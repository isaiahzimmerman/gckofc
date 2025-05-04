document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/json/data.json')
    .then(data => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        console.log(params)

        const storyID = params.get("id")

        drawEventSite(data.stories[storyID]);
    })
})

function drawEventSite(story){
    document.title = story.title
    
    document.getElementById("event_title").innerHTML = story.title
    document.getElementById("event_dates_range").innerHTML = getDayText(story)
    document.getElementById("event_content").innerHTML = story.content
}