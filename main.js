document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/json/data.json')
        .then(data => {
            processSiteData(data)
        })
})

function processSiteData(data){
    //process stories
    processStories(data.stories)
    processImages(data.images.home)
    processOfficers(data.officers)
}

function generateIcsInvite(eventDetails) {
    const { title, description, location, startDate, endDate } = eventDetails;
  
    // Format dates to the iCalendar format: YYYYMMDDTHHMMSSZ (UTC time)
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
  
    const start = formatDate(new Date(startDate));
    const end = formatDate(new Date(endDate));
  
    // iCalendar content
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR`.trim();
  
    // Create a Blob with the content and generate a download link
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
  
    // Create a download link dynamically
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.ics`; // Filename
    link.click();
  
    // Revoke the object URL to free memory
    URL.revokeObjectURL(url);
}

function processStories(stories){
    const storiesDiv = document.getElementById("stories")
    storiesDiv.innerHTML = ""
    console.log(stories)
    for(const storyKey in stories){
        const story = stories[storyKey]
        
        const storyDiv = document.createElement("div")
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
            <div class="story_description">${story.content}</div>
        </div>`

        storyDiv.addEventListener("click", function(){
            console.log(story.title)
            window.location.assign(`/event/?id=${story.id}&${story.title.replaceAll(" ", "_")}`);
        })

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

        const officerName = document.createElement("div")
        officerName.classList.add("officer_name")
        officerName.innerText = officer.name

        const officerTitle = document.createElement("div")
        officerTitle.classList.add("officer_title")
        officerTitle.innerText = officer.title

        officerDiv.appendChild(officerImageContainer)
        officerDiv.appendChild(officerName)
        officerDiv.appendChild(officerTitle)

        officersDiv.appendChild(officerDiv)
    }
}