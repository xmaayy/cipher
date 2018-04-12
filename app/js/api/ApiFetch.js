const request = require('request')
const crypter = require('cryptico')
const mega = require('megajs')
var path = require('path')

var cfg = require(path.join(__dirname, '/config/config'))

class ApiFetch {
  constructor () {
    this.privKey = crypter.generateRSAKey(cfg.passphrase, cfg.bits)
    this.pubKey = crypter.publicKeyString(this.privKey)
    this.name = ''
    this.size = 0

    this.getAttr = this.getAttr.bind(this)
  }

  getTotalSize (fileData) {
    var size = fileData.size
    if (fileData.directory) {
      fileData.children.forEach(child => {
        size += this.getTotalSize(child)
      })
    }
    return size
  }
  /**
     * This function is used ass the callback for get Attributes. It sets the attributes of the
     * download bars once their attributes have been fetched from the mega server
     * Currently there is no error handling involved so be careful of when and how this is run
     *
     * @param {*} error
     * @param {*} fileData
     */
  getAttr (error, fileData) {
    console.log(fileData)
    this.size = this.getTotalSize(fileData)

    this.name = fileData.name

    if (Array.isArray(fileData.downloadId)) {
      var query = fileData.downloadId[0]
    } else {
      var query = fileData.downloadId
    }
    document.getElementById(`${query}name`).innerHTML = this.name
    document.getElementById(`${query}size`).innerHTML = `${Math.ceil(this.size / 1048576)}MB`
  }

  /**
     * Log the RSA key value pair
     */
  logPair () {
    console.log(this.privKey)
    console.log(this.pubKey)
  }

  /**
     * Use this function to fetch attributes and update a file. Passing the URL will
     * allow the function to automatically find and update the element via its ID
     *
     * @param {String} url The mega file URL
     * @param {Function} callback The callback function
     */
  getMegaFile (url, callback = () => {}) {
    var file = mega.File.fromURL(url)
    file.loadAttributes(this.getAttr)
    callback()
  }
}

module.exports = ApiFetch
