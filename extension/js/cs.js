console.log('lo from getDescription.js')
var N = 0
var inital_image = ""
var last_img = ""

video = document.getElementsByTagName('video')[0]

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function get_image() {
    var canvas = document.createElement("canvas");
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    console.log("Inside get_image")

    return img

}


function upload(showname, season, episode, data) {
  formdata = new FormData();
  formdata.append("show", showname)
  formdata.append("season", season)
  formdata.append("episode", episode)
  formdata.append("file", data)

  fetch('https://httpbin.org/anything', {
  		  method: 'POST',
  		  body: formdata})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));

  console.log('after upload')
}


function comm(request, sender, sendResponse) {
  console.log('comm', request)
  console.log('sender', sender)
  if (request.ext == "frames"  && request.action == "http") {
  	//console.log('inside com before upload')
  	//upload('showname', 's1', 'e1', 'aaaa')

  } else if (sender.tab && request.action == "image"){
    //
  } else {
    //
  }
}


chrome.runtime.onMessage.addListener(comm);
//chrome.extension.onRequest.addListener(l2);



function send_image_cb() {
    //console.log("inside send_image_cb")
    sleep(1).then(send_image);   
    //console.log("done send_image_cb")
}

function send_image() {
	// sends the image back to the browser extension.
    N++
    console.log(N)
    t = get_image()
    if (last_img != t.src) {
        last_img = t.src
    } else {
        console.log('same image!!')
    }
    
	chrome.runtime.sendMessage({image:t.src}, function(response) {});

}

// add events.
// playing: when it starts after been stopped/paused or buffing
video.addEventListener("playing", send_image_cb)
video.addEventListener("timeupdate", send_image_cb)
// Send the inital image when the extention is opened
send_image()