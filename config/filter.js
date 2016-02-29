var fs = require('fs');
var config = require('./config');

function getFiles (dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function isIgnored(FILE_NAME) {
    for (var i = 0; i < config.ignore.length ; i++) {
        if( FILE_NAME.indexOf(config.ignore[i]) !== -1 )
            return true;
    };
    return false;
}

function filter() {
    var FILES = getFiles(config.input);
    var xmls = [];

    for (var i = 0; i < FILES.length; i++) {
        if(!isIgnored(FILES[i]))
            xmls.push(FILES[i]);
    };

    return xmls;
}

module.exports = filter;