document.addEventListener("DOMContentLoaded", async () => {
    drawSiteFromSiteData()

    // Inside the parent
    window.addEventListener('message', (event) => {
        // event.origin === your own origin
        if(event.data.message == "data_request"){
            console.log(event.data)
            console.log("sending data!")
            sendSiteDataToIframe()
        }
    });

})

function drawSiteFromSiteData(){
    getJSON('/assets/json/data.json')
        .then(data => {
            siteData = data

            showSiteImages()
            drawImages()
            drawStoryEditor()
            drawOfficersEditor()
        })
}

function sendSiteDataToIframe(){
    const iframe = document.getElementById('site_preview');
    iframe.contentWindow.postMessage({ content: siteData }, '*');
}

function updateSiteJSON(){
    const fileContent = JSON.stringify(siteData);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    document.getElementById("download_json").href = url;
    document.getElementById("download_json").download = 'data.json';

    sendSiteDataToIframe()    
}

let currentlyChanging = null

function reassignCurrentImage(newPath){
    document.getElementById(currentlyChanging.spot).src = "/assets/images/"+newPath

    if(currentlyChanging.type == "main"){
        document.getElementById(`title_${currentlyChanging.spot}`).innerText = newPath
        
        //TODO: This only works if images are 2 deep, aka home->site_title_emblem
        a = currentlyChanging.spot.split("/")
        siteData.images[a[0]][a[1]] = newPath
        updateSiteJSON()
    }else if(currentlyChanging.type == "story"){
        setAttribute(currentlyChanging.spot, newPath)
    }else if(currentlyChanging.type == "officer"){
        const idAttrs = currentlyChanging.spot.split("_")

        siteData.officers[idAttrs[0]].image = newPath

        updateSiteJSON()
    }
}

function drawImages(){
    //done this way because getJSON uses asynchronous functions
    const parent = document.getElementById("image_selector")
    getJSON('/assets/json/imagePaths.json')
        .then(data => {
            data.imagePaths.forEach(function(element){
                const currentElement = document.createElement("img")
                currentElement.src = "/assets/images/"+element
                parent.appendChild(currentElement)
                currentElement.onclick = function(){
                    reassignCurrentImage(element)
                }
                updateSiteJSON()
            })
        })
}

let siteData

function showSiteImages(){
    const siteImgDiv = document.createElement("div")
    
    for(let site in siteData.images){
        const pageDiv = document.createElement("div")

        const pageName = document.createElement("h2")
        pageName.innerText = site
        pageDiv.appendChild(pageName)

        for(let image in siteData.images[site]){
            const imageSpotName = document.createElement("h3")
            imageSpotName.innerText = image
            pageDiv.appendChild(imageSpotName)

            const imageSpotCurrentName = document.createElement("h4")
            imageSpotCurrentName.innerText = siteData.images[site][image]
            imageSpotCurrentName.id = `title_${site}/${image}`
            pageDiv.appendChild(imageSpotCurrentName)

            const imageSpotCurrent = document.createElement("img")
            imageSpotCurrent.classList.add("previewImage")
            imageSpotCurrent.id = `${site}/${image}`
            imageSpotCurrent.src = `/assets/images/${siteData.images[site][image]}`
            imageSpotCurrent.onclick = function(){
                createImageSelector(`${site}/${image}`, "main")
            }
            pageDiv.appendChild(imageSpotCurrent)
        }

        siteImgDiv.appendChild(pageDiv)
    }

    document.getElementById("images").appendChild(siteImgDiv)
}

function createImageSelector(imageSpotName, type){
    currentlyChanging = {spot: imageSpotName, type: type}
    document.getElementById("image_selector_bg").style.display = "flex"

    document.getElementById("image_selector").style.display = "flex"

    const imageSelectorNewLeft = Math.min(
        document.getElementById(imageSpotName).getBoundingClientRect().right + 5,
        window.innerWidth - document.getElementById("image_selector").getBoundingClientRect().width
    )

    document.getElementById("image_selector").style.left = `${imageSelectorNewLeft}px`

    const imageSelectorNewTop = Math.min(
        document.getElementById(imageSpotName).getBoundingClientRect().top + 5,
        window.innerHeight - document.getElementById("image_selector").getBoundingClientRect().height
    )
    document.getElementById("image_selector").style.top = `${imageSelectorNewTop}px`
}

function hideImageSelector(){
    currentlyChanging = null
    document.getElementById("image_selector_bg").style.display = "none"
    document.getElementById("image_selector").style.display = "none"
}

function saveElement(id, type){
    let textContent = document.getElementById(id).querySelector('textarea').value
    textContent = textContent ? textContent : "please provide text!"

    const newElement = makeElementEditable(type, id, textContent)
    setAttribute(id, textContent)

    document.getElementById(id).innerHTML = ""
    document.getElementById(id).appendChild(newElement)

    updateSiteJSON()
}

function setAttribute(htmlID, value){
    const idAttrs = htmlID.split("_")

    siteData.stories[idAttrs[1]][idAttrs[2]] = value

    updateSiteJSON()
}

function editElement(id, message, type){
    console.log(id)
    const textInputContainer = document.createElement('div')

    const textInput = document.createElement('textarea')
    textInput.value = message

    const saveTextInput = document.createElement('span')
    saveTextInput.classList.add('save_text')
    saveTextInput.addEventListener('click', function(){
        console.log(id)
        saveElement(id, type)
    })
    saveTextInput.textContent = 'save'

    textInputContainer.appendChild(textInput)
    textInputContainer.appendChild(saveTextInput)

    document.getElementById(id).innerHTML = ''
    document.getElementById(id).appendChild(textInputContainer)
}

function makeElementEditable(type, id, message){
    const elementContainer = document.createElement('div')
    elementContainer.id = id

    const element = document.createElement(type)
    element.innerText = message
    element.addEventListener('click', function(){
        editElement(elementContainer.id, message, type)
    })

    elementContainer.appendChild(element)

    return elementContainer
}

function createEditableElement(type, story, attribute){
    const elementContainer = document.createElement('div')
    elementContainer.id = `story_${story.id}_${attribute}`

    const element = document.createElement(type)
    element.innerText = story[attribute] ? story[attribute] : `attribute "${attribute}" is empty!`
    element.addEventListener('click', function(){
        editElement(elementContainer.id, story[attribute], type)
    })

    elementContainer.appendChild(element)

    return elementContainer
}

function drawStoryEditor(data){
    const storiesDiv = document.createElement("div")

    const stories = siteData.stories

    for(const storyID in stories){
        const story = stories[storyID]
        const storyDiv = document.createElement('div')
        storyDiv.id = story.id
        storyDiv.className = "story"

        storyDiv.appendChild(createEditableElement('h2', story, 'title'))
        storyDiv.appendChild(createEditableElement('p', story, 'content'))
        storyDiv.appendChild(createEditableElement('p', story, 'shortDescription'))
        storyDiv.appendChild(getStoryImage(story))

        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", ()=>{
            deleteStory(story.id)
        })
        deleteButton.innerText = "delete story"
        storyDiv.appendChild(deleteButton)

        storiesDiv.appendChild(storyDiv)
    };

    document.getElementById("stories").innerHTML = ""
    document.getElementById("stories").appendChild(storiesDiv)
}

function drawOfficersEditor(){
    const parent = document.getElementById("officers")

    for(const officerID in siteData.officers){
        const officer = siteData.officers[officerID]
        console.log(officer)

        const officerPicture = document.createElement("img")
        officerPicture.src = "/assets/images/"+officer.image
        officerPicture.id = `${officerID}_picture`
        officerPicture.addEventListener('click', function(){
            createImageSelector(officerPicture.id, "officer")
        })
        
        parent.appendChild(officerPicture)

        updateSiteJSON()
    }
}

function getStoryImage(story){
    const storyImage = document.createElement("img")
    storyImage.src = `/assets/images/${story.picture}`
    storyImage.id = `story_${story.id}_picture`
    storyImage.className = "story_image"

    storyImage.addEventListener("click", function(){
        createImageSelector(storyImage.id, "story")
    })

    return storyImage
}

function getTodayString(){
    const today = new Date()
    return `${today.getFullYear().toString().padStart(4, '0')}${today.getMonth().toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`
}

function newStory(){
    const storyIDs = Object.keys(siteData.stories)
    const todayString = getTodayString()

    console.log(siteData.stories)
    let i=0
    while(true){
        const tryID = `story${todayString}${i}`

        if(!storyIDs.includes(tryID)){
            siteData.stories[tryID] = {
                id: tryID,
                title: `No title found!`,
                content: `No content found!`,
                shortDescription: `No short description found!`,
                picture: "not_found.png",
                startDate: {
                    year: 2000,
                    month: 1,
                    day: 1,
                    time: {
                        hour: 0,
                        minute: 0
                    }
                },
                endDate: {
                    year: 2000,
                    month: 1,
                    day: 1,
                    time: {
                        hour: 0,
                        minute: 0
                    }
                }
            }
            break
        }

        i++
    }
    console.log(siteData.stories)

    updateSiteJSON()
    drawStoryEditor()
    sendSiteDataToIframe()
}

function deleteStory(id){
    delete siteData.stories[id];

    updateSiteJSON()
    drawStoryEditor()
    sendSiteDataToIframe()
}