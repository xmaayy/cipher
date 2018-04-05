const request = require('request');
const crypter = require("cryptico");

var cfg = require(__dirname + '\\config\\config');

class ApiFetch {
    constructor(){
        this.privKey = crypter.generateRSAKey(cfg.passphrase,cfg.bits);
        this.pubKey  = crypter.publicKeyString(this.privKey); 
    }

    logPair(){
        console.log(this.privKey);
        console.log(this.pubKey);
    }

    getMegaFile(){
        
    }

}

module.exports = ApiFetch