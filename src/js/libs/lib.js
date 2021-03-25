var exec = require('child_process').exec;
var crypto_ = require('crypto')
var fs = require('fs')
var request = require('request');
var progress = require('request-progress');

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

function unzip(data){
    execute(data,function(a){
        console.log(a)
    })
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function dir(option,data){
    if(option=="create"){
        console.log('buat')
        execute('mkdir "'+data+'"',function(a){console.log(a)})
    }else{
        if (navigator.appVersion.indexOf("Win")!=-1){
            execute('rmdir "'+data+'"',function(a){console.log(a)})
        }else{
            execute("rm -rf "+data,function(a){console.log(a)}) 
        }
    }
}

var homePath = getUserHome();

function download(url,callback,apiPath){
    var link = url.split('/')
    if(apiPath){
        var apiPath = apiPath + link[link.length-1]
    }else{
        var apiPath = homePath +'/.iNgawi/'+ link[link.length-1]
    }
    // console.log(apiPath)
    progress(request(url), {
        throttle: 2000,  // Throttle the progress event to 2000ms, defaults to 1000ms 
        delay: 1000      // Only start to emit after 1000ms delay, defaults to 0ms 
    })
    .on('progress', function (state) {
        // console.log('received size in bytes', state.received);
        // console.log('total size in bytes', state.total);
        console.log(state);
        console.log('percent', state.percent);
        callback(state.percent)
    })
    .on('error', function (err) {
        // Do something with err 
    })
    .pipe(fs.createWriteStream(apiPath))
    .on('error', function (err) {
        // Do something with err 
    })
    .on('close', function (err) {
        callback(100)
        // Saved to doogle.png! 
    })
}

dir('create',homePath+'/.iNgawi/');