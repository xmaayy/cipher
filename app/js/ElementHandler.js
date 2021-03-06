/**
 * The purpose of this file is to manage the GUI portion of Cipher
 */

// Yes I know this isnt great but ill do what I want with globals
var path = require('path')
var ApiFetch = require(path.join(__dirname, '/js/api/ApiFetch.js'))
var DLM = require(path.join(__dirname, '/js/DLM.js'))
var fetchBox = document.getElementById('search-field')
var fetchBtn = document.getElementById('fetchBtn')
var downloads = []

var Api = new ApiFetch()

/**
 * After you call makeDownload, this function will be called to generate the inner HTML for the element.
 * @param {int} size Represents the file size in MB
 * @param {int} prog Progress of the download, generally 0 as you're not adding a previously started download
 * @param {string} name The name of the file, this will be fetched in the makeDownload function (hopefully)
 * @return {string} An HTML element corresponding to the download at the provided link
 */
function makeProgBar (size = 0, prog = 0, name = 'loading', id, link = 'false') {
  return `<div class="container-fluid" id = "${id}" linked = "${link}" updated = "false">
     <div class="row">
         <div class="col-md-7">
             <div id = "${id}name">
                 Loading...
             </div>
             <div id = "${id}size">
                 0
             </div>
             <div class="progress" >
                 <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                     aria-valuenow = ${prog}
                     aria-valuemin = "0" 
                     aria-valuemax = "100"
                     style = "width: ${prog}%;"
                     id = "${id}prog">
                 </div>
             </div>
         </div>
         <div class="col-md-2" id = "${id}speed">
         
         </div>
         <div class="col-md-3">
         <div>Controls</div>
             <div class="btn-group" role="group">			 
                <button class="btn btn-secondary no-drag" type="button" id = "${id}start">
                    Start
                 </button> 
                 <button class="btn btn-secondary no-drag" type="button">
                    Stop
                 </button> 
             </div>
         </div>
     </div>
 </div>`
}

/**
 * This is used to when the fetch button is clicked.
 * When called with a link, it will go about fetching all the files asociated with the link that was given and will add them
 * to the download page
 *
 * @param {string} link This is the MegaCrypt location from which we will fetch the link
 * @returns {object} A object with the HTML for the download, as well as its progress
 */
function makeDownload (link) {
  var ids = link.split('!')
  var dlObjs = []
  if ($(`#${ids[1]}name`).length !== 0) {
    window.alert('You are already downloading this file...')
  } else {
    dlObjs.push({
      'html': makeProgBar(0, 0, 'Loading', ids[1], link)
    })
  }

  dlObjs.forEach((dlObj) => {
    if (dlObj == null) return
    $('#progress-area').append(dlObj.html)
    downloads.push(dlObj)
  })

  return dlObjs
}

/**
 * Fully re-render the downloads area, bad idea
 *
 * @param {array} downloads This is an array of download objects to render to the DOM
 */
function renderDownloads (downloads) {
  var renderBuffer = ``
  downloads.forEach(dlObj => {
    renderBuffer += (dlObj.html + `\n`)
  })
  document.getElementById('progress-area').innerHTML = renderBuffer
}

/**
 * Called whenever a new download is submitted via the fetchbutton, it calls make download to get
 * all the new files and then renders all the files to the dom
 */
var newDownload = function () {
  makeDownload(fetchBox.value)
  var downloads = $('#progress-area').children()
  console.log(downloads)
  downloads.each((n) => {
    dlId = downloads[n].id
    Api.getMegaFile(fetchBox.value)
    $(`#${dlId}start`).on('click', (e) => {
      e.preventDefault()
      var link = document.getElementById(dlId)
      var prop = {
        // This download directory is hardcoded rn, but easy to make a little settings area for it later
        dir: 'C:\\Users\\Xander\\Downloads\\MegaJS',
        file: link.getAttribute('linked'),
        size: parseInt(document.getElementById(`${dlId}size`).innerHTML) * 1000000,
        id: dlId
      }
      var dlMan = new DLM(prop)
      console.log(link.getAttribute('linked'))
      dlMan.start()
    })
  })
}

/**
 * An event listener to create new download tiles whenever the fetch button is pressed
 */
fetchBtn.addEventListener('click', (e) => {
  e.preventDefault()
  newDownload()
  return false
})
