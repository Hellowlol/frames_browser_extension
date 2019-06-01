
console.log('in bg')


function get_id_from_tvmaze() {
  //
  // do some http calls to get tvdb or something using,
  // tvmaze as we need that for our db.
}



function upload(showname, season, episode, data) {
  formdata = new FormData();
  formdata.append("show", showname)
  formdata.append("season", season)
  formdata.append("episode", episode)
  formdata.append("file", data)
  formdata.append("id", '') // get this from get_id_from_tvmaze.
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


// Seems we have to the http in a background script cus of cors.
chrome.runtime.onMessage.addListener(function(request, sender, resp) {
    console.log("request", request)
    console.log("sender", sender)

    if (request.ext == "frames" && request.action == "http" && request.target == "bg") {
      upload(request.data.showname, request.data.season, request.data.episode, "aaaa")
    }
    console.log('bg got msg', request)
    
});