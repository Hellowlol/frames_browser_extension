
const regex = /▶?\s(.+)\s-\s([sS]\d+)\s+·\s([Ee]\d+)/gmiu;

showname = ''
tvdbid = ''
season = ''
episode = ''
image = ''
var tab
var bgtab
imgz = document.getElementById("imgz")


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    console.log(tab.url, tab.title);
    // for now we just inject this everywhere. ideally it should only be some places.
    chrome.tabs.executeScript(tab.id, {file: 'js/cs.js', allFrames: true});
});

chrome.runtime.onStartup.addListener(function () {
    console.log("ext is staring up.")
});


function extract_show_season_episode(t) {
  m = regex.exec(t)
  //console.log(m)
  //console.log(m.length)
  if (m.length == 4) {
    console.log('Failed to find the damn name')
    return {show:m[1], season:m[2], episode:m[3]};
  }

}

$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });


const alertError = (error, message) => {
  console.log(message)
  console.log(error)
  $('#alertText').text(message)
  $('#alert').show()
}

const add_title = (tabs) => {
  currentTab = tabs[0]
  $('#tabTitle').text(currentTab.title);
  $('#urlInput').val(currentTab.url);
}

// check for compat
if(chrome) {
  chrome.tabs.query(
    {active: true, currentWindow: true},
    (arrayOfTabs) => { add_title(arrayOfTabs) }
  );
  
} else {
	// cba with other browsers for now.
	//
  //browser.tabs.query({active: true, currentWindow: true})
  //  .then(add_title)
  // This enables links to be opened in new tabs
  //$('a').click( (event) => { browser.tabs.create({url:event.target.href}) } )
}


// a msg should look like.
/*
{ext: "frames",
 target: rescipient
 action: "whwat to do"
 data:  {}}

*/ 


function comm(request, sender, sendResponse) {
  if (sender.tab && request.action == "http") {
  	//

  } else if (sender.tab && request.action == "image"){
    //
  } else {
    //
  }
}


// Listen to msg from the tab.
// remove and combine this with com later.
function image_cb(request, sender, sendResponse) {
  // check the event properly.

  if (request.image) {
  	imgz.src = request.image
  }
}



function send_msg(ob) {
	ob.ext = "frames"

	// default action should be to send to the content script. (cs)
	if (ob.target == undefined) {
		ob.target == "cs"
	}

	if (ob.target == "cs") {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, ob, function(response) {});
	  });
    } else {
      chrome.runtime.sendMessage(ob);
    }
}

// add a listener.
chrome.runtime.onMessage.addListener(image_cb);


$("#testy").click(function(event) {
  event.preventDefault();

  var o
  // change target to test
  o = {action: "get_id",
       target: "bg",
     data: {show:"24",
          season:"1",
          episode:"2"
       }
    }
  send_msg(o)
});


$("#btn_submit").click(function(event) {
  event.preventDefault();
  var o
  // change target to test
  o = {action: "http",
       target: "bg",
	   data: {show:"showname",
		   	  season:"1",
		   	  episode:"2"
		   }
    }
  
  send_msg(o)

  
  console.log("testy clicked")


});

console.log("bg", chrome.extension.getBackgroundPage())