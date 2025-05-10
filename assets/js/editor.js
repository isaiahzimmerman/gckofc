function dataRequestIfIframe(){
    let isInIframe;
    try {
        isInIframe = window.self !== window.top;
    } catch (e) {
        isInIframe = true; // assume it's in an iframe
    }

    if(isInIframe){
        window.parent.postMessage({ message: 'data_request' }, '*');
    }
}

function linkEditor(){
    dataRequestIfIframe()
    listenForEdits()
}

function listenForEdits(){
    window.addEventListener('message', (event) => {
        console.log(event)
        processSiteData(event.data.content)
    });
}