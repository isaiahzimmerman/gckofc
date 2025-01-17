document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/data.json')
        .then(data => {
            processSiteData(data)
        })
})

function processSiteData(data){
    //process stories
    processStories(data.stories)
    processImages(data.images.home)
}

function getDaysApart(date1, date2) {
    const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    const difference = day2 - day1;

    return difference / (24 * 60 * 60 * 1000);
}

function areDatesOnSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function formatTimeWithAmPm(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes} ${amPm}`;
}

function getRelativeDayDescriptor(date){
    const now = new Date()
    const daysApart = getDaysApart(now, date)
    if(daysApart === 1){
        return `Tomorrow`
    }else if(daysApart < 7){
        return getFullDayOfWeek(date)
    }else if(now.getFullYear() === date.getFullYear()){
        return `${getMonthName(date)} ${date.getDate()}`
    }else{
        return `${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`
    }
}

function getFullDayOfWeek(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getMonthName(date) {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
}

function getDayText(story){
    const startDate = new Date(story.startDate.year, story.startDate.month, story.startDate.day, story.startDate.time.hour, story.startDate.time.minute)
    const endDate = new Date(story.endDate.year, story.endDate.month, story.endDate.day, story.endDate.time.hour, story.endDate.time.minute)
    const now = new Date()

    const daysUntilStart = (startDate - now) / 86400000
    const daysUntilEnd = (endDate - now) / 86400000

    if(areDatesOnSameDay(startDate, endDate)){
        return `${getRelativeDayDescriptor(startDate)}, ${formatTimeWithAmPm(startDate)} - ${formatTimeWithAmPm(endDate)}`
    }else{
        return `${getRelativeDayDescriptor(startDate)}, ${formatTimeWithAmPm(startDate)} - ${getRelativeDayDescriptor(endDate)}, ${formatTimeWithAmPm(endDate)}`
    }
    
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
    stories.forEach(function(story){
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

        storiesDiv.appendChild(storyDiv)

        storyDiv.onclick = function(){
            generateIcsInvite({
                title: story.title,
                description: story.shortDescription,
                location: story.location,
                startDate: startDate,
                endDate: endDate
            });
        }
    })
    resizeAllItems()
    // Example usage
}

function processImages(images){
    for(const [key, value] of Object.entries(images)){
        document.getElementById(key).src = `/assets/images/${value}`;
    }
}