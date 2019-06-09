const b64toBlob = async (b64Data) => {
  const response = await fetch(b64Data);
  const blob = await response.blob();
  return blob;
};

async function get_show_tvmaze(show) {
  // http://api.tvmaze.com/search/shows?q=girls
  console.log("called get_show_tvmaze")

  let result = await fetch("http://api.tvmaze.com/search/shows?q="+show)
            .then(response => (response.json()))
            .catch(error => console.error('Error:', error))
            .then(response => (response[0]));
  
  // lets just got the first one, this should be the one with the hightst confidence.
  console.log(result)
  return result
}

async function do_upload(showname, season, episode, type, data) {
  let result = await get_show_tvmaze(showname)
  // do the upload
  await upload(showname, season, episode, result.show.externals.imdb, type, data)
  console.debug('Doing upload.')
  return true

}


function modify_pop(name, status) {
  var windows = chrome.extension.getViews({type : "popup"});
  if(windows) { // If popup is actually open
    var popup = windows[0]; // This is the window object for the popup page
    alert_el = popup.document.getElementById("alert")
    span_el = popup.document.getElementById("alertText")
    alert_el.classList.remove("el-hidden")
    alert_el.classList.add("el-show")

    if (status == "error") {
      alert_el.classList.add("alert-error")
      alert_el.classList.remove("alert-success")
    }
   
    span_el.innerHTML = name + " was upload to frames"
    // remove the damn shit.
    setTimeout(function() { 
        alert_el.classList.add("el-hidden")
        alert_el.classList.remove("el-show")
        span_el.innerHTML = ""
        alert_el.classList.add('alert-success')
        alert_el.classList.remove("alert-error")

        }, 1500)

    }
}

async function upload(showname, season, episode, id, type, data) {
  formdata = new FormData()
  ffs = await b64toBlob(data)
  formdata.append("show", showname)
  formdata.append("season", season)
  formdata.append("episode", episode)
  formdata.append("file", ffs, '24.png')
  formdata.append("id", id)
  formdata.append("type", type)

  console.debug(formdata)

  fetch('https://frames.servingthe.net/api/upload', {
  		  method: 'POST',
  		  body: formdata})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error))
        .then(response => modify_pop(showname, 'success'));

}

// Seems we have to the http in a background script cus of cors.
chrome.runtime.onMessage.addListener(function(request, sender, resp) {
    // 
    if (request.ext == "frames" && request.action == "upload" && request.target == "bg") {
      result = do_upload(request.data.show, request.data.season, request.data.episode, request.data.type, request.data.img)
      return true

    }
    
});