const mkdirp = require("mkdirp")
const request = require('request');
const mega = require('megajs');
const fs = require('fs');

/**
 * The download manager class. This will be the main class handling all of the downloading functions
 */
class DLM {
    /**
     * 
     * @param {object} props REQUIRED : Link for the link to the file and dir for the download directory 
     */
    constructor(props){
        this.link = props.file;
        this.file = mega.File.fromURL(this.link);
        this.dir = props.dir;

        this.download = this.download.bind(this);
    }

    /**
     * Begin the download process
     */
    start(){
        this.file.loadAttributes(this.download);
    }

    /**
     * The main download function for the download manager. Handles recursive directories and whatnot
     * TODO: Update download percentages
     * 
     * @param {*} err Callback error from load atrtibutes 
     * @param {*} fileData The mega File type either from the loadAtributes function or from a recursive download call
     * @param {*} directory The directory in which the download will go to
     */
    download(err,fileData, directory = this.dir){
        if(fileData.directory){
            var direc = `${directory}/${fileData.name}`
            mkdirp(direc)
            console.log(direc)
            fileData.children.forEach((child) => {
                if(child.directory){
                    this.download(err,child,direc)
                } else {
                    child.download().pipe(fs.createWriteStream(direc +"/"+ child.name))
                }
            })
        }
    }   
}

module.exports = DLM;