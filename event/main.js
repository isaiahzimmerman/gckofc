document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/json/data.json')
    .then(data => {
        processSiteData(data)

        linkEditor()
    })
})

function processSiteData(data){
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    console.log(params)

    const storyID = params.get("id")
    console.log(data.stories)
    console.log(data.stories[storyID])

    if(!data.stories[storyID]){
        console.log(`404 story not found`)
        return
    }

    drawEventSite(data.stories[storyID]);

    document.getElementById("event_dates").addEventListener("click", function(){
        addEventToCalendar(data.stories[storyID])
    })
}

function addEventToCalendar(story){
    const startDate = new Date(story.startDate.year, story.startDate.month, story.startDate.day, story.startDate.time.hour, story.startDate.time.minute)
    const endDate = new Date(story.endDate.year, story.endDate.month, story.endDate.day, story.endDate.time.hour, story.endDate.time.minute)

    generateIcsInvite({
        title: story.title,
        description: story.shortDescription,
        location: story.location,
        startDate: startDate,
        endDate: endDate
    });
}

function drawEventSite(story){
    document.title = story.title
    
    document.getElementById("event_title").innerHTML = story.title
    document.getElementById("event_dates_range").innerHTML = getDayText(story)
    document.getElementById("event_content").innerHTML = story.content
    document.getElementById("event_image").src = `/assets/images/${story.picture}`
}