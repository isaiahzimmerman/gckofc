document.addEventListener("DOMContentLoaded", function(){
    getJSON('/assets/json/data.json')
    .then(data => {
        processSiteData(data)

        linkEditor()
    })
})

function processSiteData(data){
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    console.log(params)

    const postID = params.get("id")

    if(!data?.["blog_posts"][postID]){
        console.log(`404 post not found`)
        return
    }

    drawNewsletterSite(data["blog_posts"][postID])
}

function drawNewsletterSite(newsletter){
    document.getElementById("newsletter_title").innerHTML = newsletter.title

    const content = document.getElementById("newsletter_content")

    content.innerHTML = ""

    for(const item of newsletter.content){
        if(item.type == "body"){
            const newsletterItem = document.createElement("p")
            newsletterItem.innerHTML = item.text
            newsletterItem.classList.add("newsletter_paragraph")

            if(item.indented){
                newsletterItem.classList.add("indented")
            }

            content.appendChild(newsletterItem)
        }else if(item.type == "image"){
            const newsletterItem = document.createElement("div")
            newsletterItem.classList.add("newsletter_image")
            
            const newsletterItemImage = document.createElement("img")
            newsletterItemImage.src = `/assets/images/${item.src}`

            newsletterItem.appendChild(newsletterItemImage)

            content.appendChild(newsletterItem)
        }
    }
}