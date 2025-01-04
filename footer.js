document.addEventListener("DOMContentLoaded", function(){
    footerYearDiv = document.getElementById("footer_current_year")
    footerYearDiv.innerText = new Date().getFullYear()
})