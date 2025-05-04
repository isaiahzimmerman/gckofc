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