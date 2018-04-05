/**
 * The purpose of this file is to manage the GUI portion of Cipher
 */

//Yes I know this isnt great but ill do what I want with globals
var ApiFetch = require(__dirname + '\\js\\api\\ApiFetch.js')
var fetchBox = document.getElementById('search-field');
var fetchBtn = document.getElementById('fetchBtn');
var downloads = [];

var Api = new ApiFetch()

/**
 * After you call makeDownload, this function will be called to generate the inner HTML for the element.
 * @param {int} size Represents the file size in MB
 * @param {int} prog Progress of the download, generally 0 as you're not adding a previously started download
 * @param {string} name The name of the file, this will be fetched in the makeDownload function (hopefully)
 */
makeProgBar = (size, prog = 0, name) =>{
     return `<div class="bg-info">
                <span><div>${name}<div><div>${size}</div></span>
                <div class="progress bg-warning">
                    <div class = "bar bg-danger progress-bar-striped progress-bar-animated" 
                    role = "progressbar" 
                    aria-valuenow = ${prog}
                    aria-valuemin = "0" 
                    aria-valuemax = "100"
                    style = "width: ${prog}%;"
                    id = "prog">
                    0
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
 * @returns {object} A object with the HTML for the download, as well as its progress (in the future some ref to its download as well)
 */
makeDownload = (link) => {
    Api.logPair()
    var dlObj = []
    dlObj.push({
        'html' : makeProgBar(20,0,fetchBox.value)
    })
    return dlObj;
}

/**
 * DEPRICATED DONT USE IT CAN BE REPLACED BY ONE LINE OF JQ
 * 
 * This function renders all download items to the DOM under the 'progress' area div tag
 * This should only be called when a new item is added, another function can be used to
 * update individual downloads based on their tags (NOTE : Collisions need to be avoided there)
 * 
 * @param {array} downloads This is an array of download objects to render to the DOM
 */
renderDownloads = (downloads) => {
    renderBuffer = ``
    downloads.forEach(dlObj => {
        renderBuffer += (dlObj.html + `\n`);
    });
    document.getElementById("progress-area").innerHTML = renderBuffer;
}

/**
 * Called whenever a new download is submitted via the fetchbutton, it calls make download to get
 * all the new filed and then renders all the files to the dom
 */
newDownload = () => {    
    makeDownload().forEach((dlObj) => {
        $('#progress-area').append(dlObj.html)
        downloads.push(dlObj)
    })
}

/**
 * An event listener to create new download tiles whenever the fetch button is pressed
 */
fetchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    newDownload()
    return false;   
})