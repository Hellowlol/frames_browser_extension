const regex = /\u25B6?\s*(.+)\s-\s[sS](\d+)\s+\u00B7\s[Ee](\d+)/;


imgz = document.getElementById("imgz")
// Inject the content script.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    console.log(tab.url, tab.title);
    // for now we just inject this everywhere. ideally it should only be some places.
    chrome.tabs.executeScript(tab.id, {file: 'js/cs.js', allFrames: true});
});



function send_msg(ob) {
  ob.ext = "frames"

  // default action should be to send to the content script. (cs)
  if (ob.target == undefined) {
    ob.target == "cs"
  }

  console.debug("send_msg", ob)

  if (ob.target == "cs") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, ob, function(response) {});
    });
    } else {
      chrome.runtime.sendMessage(ob);
    }
}

/*
if (window.location.hash == "#frames_pop") {

  send_msg({target:"cs", action:"pop_open", data:{is_open:true}})

}
*/


/*

// if (request.ext == "frames" && request.action == "get_id" && request.target == "bg") 
document.body.addEventListener("unload", function () {
  //alert('dick')
  send_msg({target:"cs", action:"pop_open", data:{is_open:true}})
});
*/


console.log("lo from pop")

function extract_show_season_episode_org(t) {
  n = "'" + t + "'"
  console.log(n)
  m = regex.exec(t)
  console.log(m)
  if (m != null && m.length == 4) {
    return {
      show: m[1],
      season: m[2],
      episode: m[3]
    };
  } else {
      console.log("Failed to find the damn name.")
  }

}

function extract_show_season_episode(t) {
  m = regex.exec(t)
  //console.log(m.length)
  if (m != null && m.length == 4) {
    // dunno why chrome dont like tha damn char
    // '\u25B6'
    if (m[1].indexOf('\u25B6') > -1) {
        m[1] = m[1].slice(2)
        
    }

    return {
      show: m[1],
      season: m[2],
      episode: m[3]
    };
  } else {
      console.log("Failed to find the damn name. " + t)
  }

}

$("#alert").click(() => { $('#alert').hide() });

/*
const alertError = (error, message) => {
  console.log(message)
  console.log(error)
  $('#alertText').text(message)
  $('#alert').show()
}
*/

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


function show_img_cb(ob) {
  imgz.style.width = 300
  imgz.style.height = 150
  imgz.src = ob
}


function comm(request, sender, sendResponse) {
  if (request.ext == "frames" && request.target == "pop" && request.action == "show_image") {
    show_img_cb(request.data.image)

  }

}


// Listen to msg from the tab.
// remove and combine this with com later.
function image_cb(request, sender, sendResponse) {
  // check the event properly.

  if (request.image) {
    //imgz.style.width = 300
    //imgz.style.height = 150
  	imgz.src = request.image
    
  }

  return true
}



function send_msg(ob) {
	ob.ext = "frames"

	// default action should be to send to the content script. (cs)
	if (ob.target == undefined) {
		ob.target == "cs"
	}

  console.log("send_msg", ob)

	if (ob.target == "cs") {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, ob, function(response) {});
	  });
    } else {
      chrome.runtime.sendMessage(ob);
    }
}


function img_to_bs64(o) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = o.height;
    canvas.width = o.width;
    ctx.drawImage(o, 0, 0);
    dataURL = canvas.toDataURL();

    return dataURL

}


$("#btn_submit").click(function(event) {
  event.preventDefault();
  var o
  var k
  k = extract_show_season_episode($('#tabTitle').text())

  bs64_img = img_to_bs64(imgz)
  image_type = $('input[name=radio]:checked').val()

  // change target to test
  o = {action: "upload",
       target: "bg",
	     data: {show: k.show,
		   	      season: k.season,
		   	      episode: k.episode,
              img: bs64_img,
              type: image_type
		   }
    }
  
  send_msg(o)
});




// add a listener.
chrome.runtime.onMessage.addListener(comm);


// this shit dont seems to work..
/*
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
 alert("tab closed")
})

chrome.tabs.onClose.addListener(function(tabid, removed) {
 alert("tab closed")
})

chrome.windows.onRemoved.addListener(function(windowid) {
 alert("window closed")
})
*/