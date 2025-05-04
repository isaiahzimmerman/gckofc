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
    if(daysApart === 0){
        return `Today`
    }else if(daysApart === 1){
        return `Tomorrow`
    }else if(daysApart < 7 && daysApart > 0){
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