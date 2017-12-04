//http://youmightnotneedjquery.com/#toggle_class
export function toggleAnimation(el, className){
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
    classes.splice(existingIndex, 1);
    else
    classes.push(className);

    el.className = classes.join(' ');
  }
};

export function polyfillStringStartsWith(){
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }
}

/*
 * Parse JSON from string
 */
export function parseDataAttrJSON(options) {
  return (!options || typeof JSON.parse !== 'function') ? {} : JSON.parse(options);
}



/*
 * Helper to extract map animjs elements based on key prop
 * @function
 * @param {Object} config - arr{nodeList}, attr{sring}, attr{string} prop{string}
 * @return {Obkect}
 */
export function mapElementsToObject(config){
  if (typeof config !== 'object' && config instanceof Array === false){
    throw new Error("Argument must be an Object.");
  }
  var {
    arr,
    attr,
    prop,
    objToExtend
  } = config

  arr.forEach((el, i) => {
    var options = parseDataAttrJSON(el.getAttribute(attr));

    // no prop, no party
    if (options[prop] === undefined) {
      return false;
    }

    // First time entry? create an empty _prop array
    if(objToExtend[options[prop]] === undefined){
      objToExtend[options[prop]] = [];
    }

    objToExtend[options[prop]].push(el);
  })
}

/*

  github-stars.js - v1
  JavaScript library for counting stars on a repo or user/org
  githubStars("stretchr/arg.js")

  by Ryan Quinn
  Copyright (c) 2013 Stretchr, Inc.

  Please consider promoting this project if you find it useful.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
  to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies
  or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  DEALINGS IN THE SOFTWARE.

*/

(function(exports) {
  exports.githubStars = function (repo, callback) {
    var xmlhttp = new XMLHttpRequest(),
      url = ["https://api.github.com"],
      useCallback = (typeof(callback) == "function");

    //count the stars
    function countStars(response) {
      //don't care, just make it an array
      if (!(response instanceof Array)) {
        response = [response];
      }
      //start the count
      var stars = 0;

      for (var i in response) {
        stars += parseInt(response[i].stargazers_count);
      }

      return stars;
    }

    //determine if we're looking at a collection or a single repo
    repo = repo.split("/");

    if (repo.length === 1) {
      url.push("users", repo[0], "repos");
    } else {
      url.push("repos", repo[0], repo[1]);
    }

    //check if we were given a callback, if so we set that up
    if (useCallback) {
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          callback(countStars(JSON.parse(xmlhttp.responseText)));
        }
      }
    }

    xmlhttp.open("GET", url.join("/"), useCallback);
    //set the github media header
    xmlhttp.setRequestHeader("Accept", "application/vnd.github.v3+json");
    xmlhttp.send();

    if (!useCallback) {
      //no callback, just wait for the response
      return countStars(JSON.parse(xmlhttp.responseText));
    }
  }
})(typeof exports !== 'undefined' ? exports : window);
