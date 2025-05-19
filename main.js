document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/json/data.json')
    .then(data => {
        processSiteData(data)

        linkEditor()
    })
})

function processSiteData(data){
    //process stories
    processStories(data.stories)
    processImages(data.images.home)
    processOfficers(data.officers)
    processBlog(data.blog_posts)
}

function processStories(stories){
    const storiesDiv = document.getElementById("stories")
    storiesDiv.innerHTML = ""
    console.log(stories)
    for(const storyKey in stories){
        const story = stories[storyKey]

        const requiredAttributes = ["title", "shortDescription"]

        for(const attr of requiredAttributes){
            if(!story[attr]){
                story[attr] = `attribute "${attr}" is empty!`
            }
        }

        if(!story.startDate){
            story.startDate = {
                year: 2000,
                month: 1,
                day: 1,
                time: {
                    hour: 0,
                    minute: 0
                }
            }
        }

        if(!story.endDate){
            story.endDate = {
                year: 2000,
                month: 1,
                day: 1,
                time: {
                    hour: 0,
                    minute: 0
                }
            }
        }
        
        const storyDiv = document.createElement("a")
        storyDiv.href = `/event/?id=${story.id}&${story.title.replaceAll(" ", "_")}`
        storyDiv.classList.add("story")

        const startDate = new Date(story.startDate.year, story.startDate.month, story.startDate.day, story.startDate.time.hour, story.startDate.time.minute)
        const endDate = new Date(story.endDate.year, story.endDate.month, story.endDate.day, story.endDate.time.hour, story.endDate.time.minute)

        storyDiv.innerHTML = 
        `<div class="story_graphic">
            <div class="story_date">
                <div class="story_month">${getMonthName(startDate).substring(0,3).toUpperCase()}</div>
                <div class="story_day">${story.startDate.day}</div>
            </div>
            <img class="story_image" src="assets/images/${story.picture}" alt="">
        </div>
        <div class="story_info">
            <div class="story-date-display">${getDayText(story)}</div>
            <div class="story_title">${story.title}</div>
            <div class="story_description">${story.shortDescription}</div>
        </div>`

        storiesDiv.appendChild(storyDiv)

        // storyDiv.onclick = function(){
        //     generateIcsInvite({
        //         title: story.title,
        //         description: story.shortDescription,
        //         location: story.location,
        //         startDate: startDate,
        //         endDate: endDate
        //     });
        // }
    }
    resizeAllItems()
    // Example usage
}

function processImages(images){
    for(const [key, value] of Object.entries(images)){
        document.getElementById(key).src = `/assets/images/${value}`;
    }
}

function processOfficers(officers){
    /*
    <div class="officer">
        <div class="officer_image_container">
            <img src="/assets/images/guy1.png" alt="" class="officer_image">
        </div>
        <div class="officer_name">Dennis Sansotta</div>
        <div class="officer_title">Grand Knight</div>
    </div>*/
    const officersDiv = document.getElementById("officers")

    officersDiv.innerHTML = ""

    for(const officerID in officers){
        const officer = officers[officerID]

        const officerDiv = document.createElement("div")
        officerDiv.classList.add("officer")

        const officerImageContainer = document.createElement("div")
        officerImageContainer.classList.add("officer_image_container")

        const officerImage = document.createElement("img")
        officerImage.classList.add("officer_image")
        officerImage.src = `/assets/images/${officer.image}`

        officerImageContainer.appendChild(officerImage)

        const officerNameAndTitleDiv = document.createElement("div")
        officerNameAndTitleDiv.classList.add("officer_name_and_title")

        const officerName = document.createElement("div")
        officerName.classList.add("officer_name")
        officerName.innerText = officer.name

        const officerTitle = document.createElement("div")
        officerTitle.classList.add("officer_title")
        officerTitle.innerText = officer.title

        officerNameAndTitleDiv.appendChild(officerName)
        officerNameAndTitleDiv.appendChild(officerTitle)

        officerDiv.appendChild(officerImageContainer)
        officerDiv.appendChild(officerNameAndTitleDiv)
    
        officersDiv.appendChild(officerDiv)
    }
}

function processBlog(posts){
    const blogDiv = document.getElementById("blog")

    blogDiv.innerHTML = ""

    for(const postKey in posts){
        const post = posts[postKey]

        const postLink = document.createElement("a")
        postLink.href = `/newsletter/?id=${postKey}`

        const postTitle = document.createElement("div")
        postTitle.classList.add("monthly_newsletter_title")
        postTitle.innerText = post.title

        postLink.appendChild(postTitle)

        blogDiv.appendChild(postLink)
    }
}