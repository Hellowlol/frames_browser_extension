var N = 0
var last_img = ""
var gogo = true

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  // stolen from https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }

function get_image() {
    // we should check and resize image if its too big, no need to send more data then we need.
    var vid = document.getElementsByTagName('video')[0]
    var canvas = document.createElement("canvas");
    canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
    var img = document.createElement("img");
    img.src = canvas.toDataURL();

    return img

}


function comm(request, sender, sendResponse) {

  if (request.ext == "frames" && request.action == "get_frame" && request.target == "cs") {
    send_image()
  }

}


function send_image_cb() {
  sleep(1).then(send_image);
}

function send_image() {
	// sends the image back to the browser extension.
  N++
  var img
  console.debug(N)
  img = get_image()
  if (last_img != img.src) {
      last_img = img.src
  } else {
      console.log('same image!!')
  }

  var ob = {ext:"frames",
            action:"show_image",
            target:"pop",
            data: {image:img.src}}

      
  chrome.runtime.sendMessage(ob, function(response) {});
  //return true

}

// add events.
// playing: when it starts after been stopped/paused or buffing
//video.addEventListener("playing", send_image_cb)
//video.addEventListener("timeupdate", send_image_cb)
// Send the inital image when the extention is opened
send_image()

if (gogo) {

  video = document.getElementsByTagName('video')[0]
  if (video) {
    video.addEventListener("playing", send_image_cb)
    video.addEventListener("timeupdate", send_image_cb)

  }
  
}
chrome.runtime.onMessage.addListener(comm);