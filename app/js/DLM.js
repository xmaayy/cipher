const mkdirp = require('mkdirp')
const mega = require('megajs')
const fs = require('fs')
var path = require('path')

/**
 * The download manager class. This will be the main class handling all of the downloading functions
 *
 * TODO:
 * Make this an event emitter to automatically detroy itsself and the file connections after its done
 */
class DLM {
  /**
     *
     * @param {object} props REQUIRED : Link for the link to the file and dir for the download directory
     */
  constructor (props) {
    this.id = props.id
    this.link = props.file
    this.file = mega.File.fromURL(this.link)
    this.dir = props.dir
    this.size = props.size
    this.downloaded = 0
    this.done = false
    this.lastchunk = new Date().getTime()

    this.download = this.download.bind(this)
    this.updateDownloaded = this.updateDownloaded.bind(this)
    this.makeDownload = this.makeDownload.bind(this)
  }

  /**
     * Begin the download process, function created for future extensibility
     */
  start () {
    this.file.loadAttributes(this.download)
  }

  /**
     * This function handles the incrementing of the download counter
     *
     * It is here now to make this program easily extensible in the future if we want to do
     * per file download progress rather than just full folder progress
     *
     * @param {int} amnt The ammount by which to increment how much the client has downloaded
     */
  updateDownloaded (amnt) {
    var d = new Date()

    // Update Percentages
    var prog = Math.ceil((this.downloaded / this.size) * 100)
    this.downloaded += amnt
    document.getElementById(`${this.id}prog`).setAttribute('style', `width: ${prog}%;`)

    // Update Speeds
    var spd = Math.ceil(amnt / ((d.getTime() - this.lastchunk) / 1000) / 1024)
    if (spd > 1024) {
      document.getElementById(`${this.id}speed`).innerHTML = `${Math.round(spd / 1024 * 100) / 100} MB/sec`
    } else {
      document.getElementById(`${this.id}speed`).innerHTML = `${spd} KB/sec`
    }
    this.lastchunk = d.getTime()
  }

  /**
     * This function takes in a directory and file data for a download and handles the
     * download process
     *
     * @param {String} direc //Directory in which to save files
     * @param {File} fileData //The file data from the MEGA api
     */
  makeDownload (direc, fileData) {
    mkdirp(direc)
    var filePath = path.join(direc, fileData.name)
    console.log(filePath)
    // Begin the download from mega
    var dlStream = fileData.download().pipe(fs.createWriteStream(filePath))
    dlStream.on('finish', () => {
      console.log('COMPLETE!')
      document.getElementById(`${this.id}speed`).innerHTML = ``
      $(`#${this.id}start`).on('click', (e) => {})
    })
    console.log(dlStream)
    // Open a file watcher to add each files progress to the folders download progress
    // Minimal overhead to watch each file and will give granularity in the future
    fs.watchFile(filePath, { persistent: true, interval: 507 }, (curr, prev) => {
      // console.log(`Added ${curr.size - prev.size} bytes to file: ${curr.name}`)

      // Abs needed because for some reason the first push of data always results in a
      // negative difference between curr and prev
      this.updateDownloaded(Math.abs(curr.size - prev.size))
    })
  }

  /**
     * The main download function for the download manager. Handles recursive directories and whatnot
     * TODO: Update download percentages
     *
     * @param {*} err Callback error from load atrtibutes
     * @param {*} fileData The mega File type either from the loadAtributes function or from a recursive download call
     * @param {*} directory The directory in which the download will go to
     */
  download (err, fileData, directory = this.dir) {
    if (fileData.directory) {
      // Make filepath and create in filesystem
      var direc = `${directory}/${fileData.name}`
      mkdirp(direc)
      // console.log(direc)
      fileData.children.forEach((child) => {
        if (child.directory) {
          this.download(err, child, direc)
        } else {
          this.makeDownload(direc, child)
        }
      })
    } else {
      this.makeDownload(directory, fileData)
    }
  }
}

module.exports = DLM
