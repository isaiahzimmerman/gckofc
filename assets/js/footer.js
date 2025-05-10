document.addEventListener("DOMContentLoaded", function(){
    currentYear = new Date().getFullYear()

    const footerDiv = document.getElementById("footer")

    footerDiv.innerHTML = ""

    const footerCopyrightDiv = document.createElement("div")
    footerCopyrightDiv.innerHTML = `©${currentYear} Grove City Knights of Columbus Council 3658. All rights reserved.`

    footerDiv.appendChild(footerCopyrightDiv)
})