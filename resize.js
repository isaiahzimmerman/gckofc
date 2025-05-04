window.addEventListener("resize", function(){
    checkDevice()
    resizeAllItems()
})

function checkDevice(){
    if(window.innerWidth < 800){
        document.body.classList.remove("desktop")
        document.body.classList.add("mobile")
    }else{
        document.body.classList.remove("mobile")
        document.body.classList.add("desktop")
    }
}

document.addEventListener("DOMContentLoaded", function(){
    checkDevice()
    resizeAllItems()
})

function resizeItemByParentWidth(parentItem, item, attribute, scale){
    const parentWidthScale = (parentItem.getBoundingClientRect().width / 100)
    item.style[attribute] = `${(parentWidthScale * scale)}px`
}

function resizeAllItems(){
    const dateItems = document.querySelectorAll(".story_date")

    dateItems.forEach(function(storyDate){
        resizeItemByParentWidth(storyDate, storyDate.querySelector(".story_month"), "font-size", 20)
        resizeItemByParentWidth(storyDate, storyDate.querySelector(".story_day"), "font-size", 40)
    })
}