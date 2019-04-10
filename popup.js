// https://en.wikipedia.org/wiki/Pistol
// https://en.wikipedia.org/wiki/Toad
// https://en.wikipedia.org/wiki/Frog
// https://en.wikipedia.org/wiki/Dog
$(document).ready(function() {
  let blacklist = document.getElementById('blackList');
  let jblacklist = $('#blacklist');
  // var bkg = chrome.extension.getBackgroundPage();

  function addDeleteListener(key) {
    $("#blacklist li:nth-child(" + (key + 1) + ") a").click(function() {
      chrome.storage.sync.get('blacklist', function(data) {
        var newData = data.blacklist;
        var size = Object.keys(data.blacklist).length;
        for (var i = key; i < size - 1; i++) {
          newData[i] = newData[i + 1];
        }
        delete newData[size - 1];
        chrome.storage.sync.set({
          'blacklist': newData
        }, function() {
          var removal = $("#blacklist li:nth-child(" + (key + 1) + ")");
          // bkg.console.log("Removed " + removal.html());
          removal.remove();

        })
      })
    });
  }

  function generateList() {
    chrome.storage.sync.get('blacklist', function(data) {
      jblacklist.empty();
      var arrayLength = Object.keys(data.blacklist).length;
      var list = $('#blacklist');
      for (var i = 0; i < arrayLength; i++) {
        var key = i;
        var value = data.blacklist[i];
        var template = '<li class="list-group-item"><a href="#" class="fa fa-trash-o deleteButton" value="' + key + '" style="color:red"></a>' + value + '</li>';
        list.append(template);
        addDeleteListener(key);
        // bkg.console.log("Adding listener for " + key + " " + value);
      }
    });
  }

  generateList();

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    generateList();
  });

  $("#addTag").click(function() {
    var tag = $("#inputTag").val();
    chrome.storage.sync.get('blacklist', function(data) {
      var size = Object.keys(data.blacklist).length;
      var newData = data.blacklist;
      newData[size] = tag;
      chrome.storage.sync.set({
        'blacklist': newData
      }, function() {
        // bkg.console.log("Added " + tag);
      })
    })
  })
});