exports["logAny"] = console.log

exports["_windowWrite"] = function(key) {
  return function(value) {
    return function() {
      window[key] = value;
    }
  }
}

exports["_windowRead"] = function(key) {
  return function(just) {
    return function(nothing) {
      return function() {
        if(window[key]) {
          return just(window[key]);
        } else {
          return nothing;
        }
      }
    }
  }
}

exports["_backfillMD5"] = function(objects) {
  return function() {
    let md5 = require('md5');
    return objects.map(function(item) {
      if(!item["hash"]) {
        item["hash"] = md5(JSON.stringify(item));
      }
      return item;
    });
  }
}

exports["downloadFile"] = function(content) {
  return function(fileName) {
    return function() {
      download(content, fileName, "application/json");
    }
  }
}

exports["_loadFile"] = function(error, callback) {
  var input = document.createElement('input');
  input.type = 'file';

  function readFile(file) {
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = readerEvent => {
      var content = readerEvent.target.result;
      callback(JSON.parse(content));
    }
  }

  input.onchange = e => {
    var file = e.target.files[0];
    readFile(file);
  }

  input.click();
}