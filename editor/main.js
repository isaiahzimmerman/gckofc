document.addEventListener("DOMContentLoaded", async () => {
    showSiteImages()
    drawImages()
    drawStoryEditor()
})

function updateSiteJSON(){
    const fileContent = JSON.stringify(siteData);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    document.getElementById("download_json").href = url;
    document.getElementById("download_json").download = 'data.json';
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

function drawOfficers(){
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
    getJSON('/assets/json/data.json')
        .then(data => {
            siteData = data

            for(let site in data.images){
                const pageDiv = document.createElement("div")

                const pageName = document.createElement("h2")
                pageName.innerText = site
                pageDiv.appendChild(pageName)

                for(let image in data.images[site]){
                    const imageSpotName = document.createElement("h3")
                    imageSpotName.innerText = image
                    pageDiv.appendChild(imageSpotName)

                    const imageSpotCurrentName = document.createElement("h4")
                    imageSpotCurrentName.innerText = data.images[site][image]
                    imageSpotCurrentName.id = `title_${site}/${image}`
                    pageDiv.appendChild(imageSpotCurrentName)

                    const imageSpotCurrent = document.createElement("img")
                    imageSpotCurrent.classList.add("previewImage")
                    imageSpotCurrent.id = `${site}/${image}`
                    imageSpotCurrent.src = `/assets/images/${data.images[site][image]}`
                    imageSpotCurrent.onclick = function(){
                        createImageSelector(`${site}/${image}`, "main")
                    }
                    pageDiv.appendChild(imageSpotCurrent)
                }

                siteImgDiv.appendChild(pageDiv)
            }
        })
    document.getElementById("images").appendChild(siteImgDiv)
}

function createImageSelector(imageSpotName, type){
    currentlyChanging = {spot: imageSpotName, type: type}
    document.getElementById("image_selector_bg").style.display = "flex"
    document.getElementById("image_selector").style.left = `${document.getElementById(imageSpotName).getBoundingClientRect().right + 5}px`
    document.getElementById("image_selector").style.top = `${document.getElementById(imageSpotName).getBoundingClientRect().top + window.scrollY}px`
    document.getElementById("image_selector").style.display = "flex"
}

function hideImageSelector(){
    currentlyChanging = null
    document.getElementById("image_selector_bg").style.display = "none"
    document.getElementById("image_selector").style.display = "none"
}

function saveElement(id, type){
    let textContent = document.getElementById(id).querySelector('input').value
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

    const textInput = document.createElement('input')
    textInput.type = 'text'
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
    element.innerText = story[attribute]
    element.addEventListener('click', function(){
        editElement(elementContainer.id, story[attribute], type)
    })

    elementContainer.appendChild(element)

    return elementContainer
}

function drawStoryEditor(){
    const storiesDiv = document.createElement("div")
    getJSON('/assets/json/data.json')
        .then(data => {
            siteData = data

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

                storiesDiv.appendChild(storyDiv)
            };

            console.log(siteData.stories)
            
        })
    document.getElementById("stories").appendChild(storiesDiv)
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