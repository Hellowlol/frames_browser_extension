
console.log('in bg')

function upload(showname, season, episode, data) {
  formdata = new FormData();
  formdata.append("show", showname)
  formdata.append("season", season)
  formdata.append("episode", episode)
  formdata.append("file", data)
  /*

  fetch('https://httpbin.org/anything', {
  		  method: 'POST',
  		  body: formdata})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));
  */
  // for now just do this. need the api up and running first.
  fetch('https://httpbin.org/anything', {
        method:  'GET'})
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));

  console.log('after upload')
}



chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


// Seems we have to the http in a background script cus of cors.
chrome.runtime.onMessage.addListener(function(request, sender, resp) {
    console.log("request", request)
    console.log("sender", sender)

    if (request.ext == "frames" && request.action == "http" && request.target == "bg") {
      upload(request.data.showname, request.data.season, request.data.episode, "aaaa")
    }
    console.log('bg got msg', request)
    
});