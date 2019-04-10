// Find all images on page
const KEY_ID = config.SECRET_KEY;
const Url = "https://vision.googleapis.com/v1/images:annotate?key=" + KEY_ID;
const data1 = '{"requests":[{"image":{"source":{"imageUri":"';
const data2 = '"}},"features":[{"type":"LABEL_DETECTION"}]}]}';
const threshold = 0.5;

var body, elements, imgs, imgSrcs;
var imageUri, postBody;
var imagesToShow = [];
var blacklist;
var index;

function hideImage(imageUri) {
  $("img").each(function() {
    if (this.src == imageUri) {
      $(this).css({
        opacity: 0
      });
    }
  });
}

function showImage(imageUri) {
  $("img").each(function() {
    if (this.src == imageUri) {
      $(this).css({
        opacity: 1
      });
    }
  });
}

function showAllImages() {
  $('img').each(function() {
    $(this).css({
      opacity: 1
    });
  })
}

function checkBlacklist(imageUri, response) {
  var text = false;
  var hide = false

  // console.log("Blacklist: " + blacklist);
  // console.log("response: " + JSON.stringify(response));
  // console.log("response.responses: " + JSON.stringify(response.responses));
  // console.log("response.responses[0].labelAnnotations: " + JSON.stringify(response.responses[0].labelAnnotations));
  // console.log("response.responses[0].labelAnnotations[0]: " + JSON.stringify(response.responses[0].labelAnnotations[0]));

  var responses = response.responses[0].labelAnnotations;
  if (responses != null) {
    responses.forEach(function(label) {
      var score = label.score;
      if (score >= threshold) {
        if (blacklist.includes(label.description)) {
          hide = true;
        } else if (label.description == "Text") {
          text = true;
        }
      }
      // console.log("Hide: " + hide);
    });
    if (!hide || text) {
      // console.log("Hiding: " + imageUri);
      // hideImage(imageUri);
      showImage(imageUri);
      // imagesToShow.push(index);
      console.log("Uri: " + imageUri);
    }
  }
}

$('img').each(function() {
  $(this).css({
    opacity: 0
  });
})

body = document.body;
elements = document.body.getElementsByTagName("*");

imgs = document.getElementsByTagName("img");
imgSrcs = [];

for (var i = 0; i < imgs.length; i++) {
  imgSrcs.push(imgs[i].src);
}

chrome.storage.sync.get('blacklist', function(data) {
  // console.log("Blacklist data: " + JSON.stringify(data));
  blacklist = Object.values(data.blacklist);
  if (Object.keys(blacklist).length > 0) {
    imgSrcs.forEach(function(element) {
      // var element = imgSrcs[2];
      postBody = data1 + element + data2;

      var http = new XMLHttpRequest();
      http.open('POST', Url, true);
      http.setRequestHeader('Content-type', 'application/json');
      http.onreadystatechange = function() { //Call a function when the state changes.
        console.log("body: " + postBody);
        if (http.readyState == 4 && http.status == 200) {
          console.log("Response:" + JSON.parse(http.responseText));
          checkBlacklist(element, JSON.parse(http.responseText));
        }
      }
      http.send(postBody);
    });
  } else {
    console.log("Blacklist empty");
    showAllImages();
  }
});