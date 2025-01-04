document.addEventListener("DOMContentLoaded", function()
{
    // Generate file content in JavaScript
    const fileContent = 'Hello, world!';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.textContent = "test"
    document.body.appendChild(a);
})

function testJSON(){

fetch('data.json')
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        console.log(data); // Log the JSON data to the console
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

}