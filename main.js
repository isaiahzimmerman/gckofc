document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/data.json')
        .then(data => {
            processSiteData(data)
        })
})

function processSiteData(data){
    //process stories
    // processStories(data.stories)
    processImages(data.images.home)
    
}

function processStories(stories){
    const storiesDiv = document.getElementById("stories")
    stories.forEach(function(story){
        const storyDiv = document.createElement("div")
        storyDiv.classList.add("story")
        
        const storyTitle = document.createElement("div")
        storyTitle.classList.add("story_title")
        storyTitle.textContent = story.title
        storyDiv.appendChild(storyTitle)

        const storyContent = document.createElement("div")
        storyContent.textContent = story.content
        storyDiv.appendChild(storyContent)

        storiesDiv.appendChild(storyDiv)
    })
}

function processImages(images){
    for(const [key, value] of Object.entries(images)){
        document.getElementById(key).src = `/assets/images/${value}`;
    }
}