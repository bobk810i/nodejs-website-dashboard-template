const path = require('path');
const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs');

const fileName = 'logs.txt'
const savePath = path.join(__dirname, '../', '/logs', fileName);

function getCurrentHeader(){
    let currentDateFunction = moment().tz("Europe/Warsaw").format('DD-MM-YYYY HH:mm');
    let logHeader = `[${currentDateFunction}](${os.hostname()}) `;
    return logHeader;
}
  
  function info(properties={}){
    let log = `${getCurrentHeader()}INFO\n`;
    for(element in properties){
        log = log + `   ${element}: ${JSON.stringify(properties[element])}\n`;
    }
    log = log + '\n';

    // Log on console
    console.log(log);

    // Save in file
    fs.appendFile(savePath, log, (err)=>{});
}

function warn(properties={}){
    let log = `${getCurrentHeader()}WARNING\n`;
    for(element in properties){
        log = log + `   ${element}: ${JSON.stringify(properties[element])}\n`;
    }
    log = log + '\n';

    // Log on console
    console.warn(log);

    // Save in file
    fs.appendFile(savePath, log, (err)=>{});
}

function error(properties={}){
    let log = `${getCurrentHeader()}ERROR\n`;
    for(element in properties){
        log = log + `   ${element}: ${JSON.stringify(properties[element])}\n`;
    }
    log = log + '\n';

    // Log on console
    console.warn(log);

    // Save in file
    fs.appendFile(savePath, log, (err)=>{});
}

function fatal(properties={}){
    let log = `${getCurrentHeader()}FATAL\n`;
    for(element in properties){
        log = log + `   ${element}: ${JSON.stringify(properties[element])}\n`;
    }
    log = log + '\n';

    // Log on console
    console.warn(log);

    // Save in file
    fs.appendFile(savePath, log, (err)=>{});
}

module.exports = {info, warn, error, fatal};