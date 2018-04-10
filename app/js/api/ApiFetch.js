const request = require('request');
const crypter = require("cryptico");
const mega = require('megajs');

var cfg = require(__dirname + '\\config\\config');

class ApiFetch {
    constructor(){
        this.privKey = crypter.generateRSAKey(cfg.passphrase,cfg.bits);
        this.pubKey  = crypter.publicKeyString(this.privKey); 
        this.name = "";
        this.size = 0;

        this.getAttr = this.getAttr.bind(this);
    }

    /**
     * This function is used ass the callback for get Attributes. It sets the attributes of the 
     * download bars once their attributes have been fetched from the mega server
     * Currently there is no error handling involved so be careful of when and how this is run
     * 
     * @param {*} error 
     * @param {*} fileData 
     */
    getAttr(error, fileData) {            
        console.log(fileData)
        this.size = fileData.size;
        if(fileData.directory){
            fileData.children.forEach(child => {
                this.size += child.size;                    
            });
        } else {this.size = fileData.size}

        this.name = fileData.name;

        if(Array.isArray(fileData.downloadId)){
            var query = fileData.downloadId[0]
        } else {
            var query = fileData.downloadId
        }
        document.getElementById(`${query}name`).innerHTML = this.name
        document.getElementById(`${query}size`).innerHTML = `${this.size/1000000}MB`
    }

    /**
     * Log the RSA key value pair
     */
    logPair(){
        console.log(this.privKey);
        console.log(this.pubKey);
    }

    /**
     * Use this function to fetch attributes and update a file. Passing the URL will
     * allow the function to automatically find and update the element via its ID
     * 
     * @param {String} url The mega file URL
     * @param {Function} callback The callback function
     */
    getMegaFile(url,callback = () => {}){
        var file = mega.File.fromURL(url);
        file.loadAttributes(this.getAttr);
        callback();
    }

}

module.exports = ApiFetch