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

    drawImages()
})

async function getJSON(path){
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

function drawImages(){
    //done this way because getJSON uses asynchronous functions
    const parent = document.getElementById("images")
    getJSON('../assets/imagePaths.json')
        .then(data => {
            data.imagePaths.forEach(function(element){
                const currentElement = document.createElement("img")
                currentElement.src = "/assets/images/"+element
                parent.appendChild(currentElement)
            })
        })
}