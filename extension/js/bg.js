
console.log('in bg')


function get_id_from_tvmaze(show, season, episode) {
  //
  // do some http calls to get tvdb or something using,
  // tvmaze as we need that for our db.

  // http://api.tvmaze.com/search/shows?q=girls
  console.log("called get_id_from_tvmaze")

  t = fetch("http://api.tvmaze.com/search/shows?q="+show)
        .then(response => (response.json()))
        .catch(error => console.error('Error:', error))
        .then(response => (response));
  // lets just got the first one, this should be the one with the hightst confidence.
  console.log('done')
  console.log(t)
  console.log(t[0])
  return t
}

async function get_show_tvmaze(show) {

  // http://api.tvmaze.com/search/shows?q=girls
  console.log("called get_id_from_tvmaze")

  let result = await fetch("http://api.tvmaze.com/search/shows?q="+show)
            .then(response => (response.json()))
            .catch(error => console.error('Error:', error))
            .then(response => (response[0]));
  
  // lets just got the first one, this should be the one with the hightst confidence.
  console.log(result)
  return result
}

async function do_upload(showname, season, episode, data) {
  let result = await get_show_tvmaze(showname)

  // do the upload
  await upload(showname, season, episode, result.show.externals.imdb, data)
  return true

} 


async function upload(showname, season, episode, id, data) {
  formdata = new FormData();
  formdata.append("show", showname)
  formdata.append("season", season)
  formdata.append("episode", episode)
  formdata.append("file", data)
  formdata.append("id", id) // get this from get_id_from_tvmaze.
  

  fetch('https://httpbin.org/anything', {
  		  method: 'POST',
  		  body: formdata})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));
  
  // for now just do this. need the api up and running first.
  /*
  fetch('https://httpbin.org/anything', {
        method:  'GET'})
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));
  */

  console.log('after upload')
}


// Seems we have to the http in a background script cus of cors.
chrome.runtime.onMessage.addListener(function(request, sender, resp) {
    //console.log("request", request)
    //console.log("sender", sender)

    if (request.ext == "frames" && request.action == "http" && request.target == "bg") {
      upload(request.data.showname, request.data.season, request.data.episode, "aaaa")
    // this is just to get the damn testy button
    } else if (request.ext == "frames" && request.action == "get_id" && request.target == "bg") {
      result = do_upload(request.data.show, request.data.season, request.data.episode, "bbbb")
      console.log("get_id", result)     

    }
    console.log('bg got msg', request)
    
});