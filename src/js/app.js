App = Ember.Application.create({
  LOG_TRANSITIONS:true
});

var fs = require("fs");
var unzip = require('unzip');
var spawn = require('child_process').spawn;
// var WiFiControl = require('wifi-control');
// WiFiControl.init({
//   debug: false
// });

App.checkOLCM="http://dls.moco.co.id/info.json";

// setInterval(function () { 
  // check_dls();
// }, 10000); 

function check_dls(){
  var check = majax_empty(App.checkOLCM,'','');
  check.success(function(data){
    console.log('olcm ready')
    if($('.olcm').is(':visible')==false){
      App.Success_Content='Anda berada di area Ekslusif '+data.data.name;
      $('#btn-success').click();
      setTimeout(function(){
        $('#b_trans_suk').html('Tutup');
        $('.midCircle').show();
        $('#suk_header').html('Selamat Datang');
        $('.moco-check_o2').addClass('fa').addClass('fa-envelope-o').removeClass('moco-check_o2').css('font-size','18px').css('line-height','25px');
      })
      $('.olcm').show();
      localStorage.setItem('offline',true)
      $('.main').css('top','87px');
      // http://192.168.0.54:7575//v4/offline/is_offline?client_id=NTE0ZDEzOTIwY2VhZmVk
      // write_olcm();
      var ipOLCM = "http://dls.moco.co.id:7575/apis/dls"
      RepoOlcm = {
          "base":ipOLCM,
          "api_base":ipOLCM+"/v2/",
          "client_id":"NTE0ZDEzOTIwY2VhZmVk",
          "client_secret":"e3748abd70685a01553802e044d12404bce0ab13",
          "api_realtime":"http://dls.moco.co.id",
          "api_realtime_chat":"http://dls.moco.co.id",
          "url_share":ipOLCM,
          "url_update":"https://eyeyunianto.github.io/app_update/production/",
          "api_fast":ipOLCM+"/v2/",
          "url_search":"http://search.aksaramaya.com/",
          "url_chat":"http://ijakarta.id:7777/subscribe",
          "url_notif":"http://ijakarta.id:7777/subscribe",
          "v3":ipOLCM+"/v3/",
          "search":"http://search.aksaramaya.com"
        }
    }else{

    }
  }),
  check.error(function(data) {
    console.log('not found olcm')
    var aaa = location.href.split('#/ch');
    console.log(aaa[1]);
    if(aaa[1]){
      $('.main').css('top','');
    }else{
      $('.main').css('top','52px');
    }
    localStorage.setItem('offline',false)
    if($('.olcm').is(':visible')==true){
      App.Success_Alert='Koneksi Lokal Server Terputus'
      App.Success_Content='Koneksi lokal server terputus akses Anda akan dialihkan ke koneksi reguler'
      $('#btn-conf_dialog').click();
      setTimeout(function(){
        $('#icn-success').html('').addClass('st_ic_lost')
        $('#act_try').attr('onclick','olcm_act(1)')
        $('#act_cancel').attr('onclick',"javascript:$('#btn-close_modal').click();")
        $('#act_try a').html('Lanjutkan')
        $('#text_conf').css('width','112px').css('word-break','normal');
      })
    }
  });
}

function write_olcm(){
  try{
    var check = majax_empty(App.checkOLCM,'','');
    check.success(function(data){
      if(data.data.endpoint){
        App.Success_Content='Anda berada di area Ekslusif '+data.data.ilibrary+' Lokal Server';
        $('#btn-success').click();
        setTimeout(function(){
          $('#b_trans_suk').html('Tutup');
          $('.midCircle').show();
          $('#suk_header').html('Selamat Datang');
          $('.moco-check_o2').addClass('fa').addClass('fa-envelope-o').removeClass('moco-check_o2').css('font-size','18px').css('line-height','25px');
        })
        $('.olcm').show();
        localStorage.setItem('offline',true)
        $('.main').css('top','87px');
        // http://192.168.0.54:7575//v4/offline/is_offline?client_id=NTE0ZDEzOTIwY2VhZmVk
        // write_olcm();
        var ipOLCM = data.data.endpoint
        RepoOlcm = {
            "base":ipOLCM,
            "api_base":ipOLCM+"/v2/",
            "client_id":"NTE0ZDEzOTIwY2VhZmVk",
            "client_secret":"e3748abd70685a01553802e044d12404bce0ab13",
            "api_realtime":"http://dls.moco.co.id",
            "api_realtime_chat":"http://dls.moco.co.id",
            "url_share":ipOLCM,
            "url_update":"https://eyeyunianto.github.io/app_update/production/",
            "api_fast":ipOLCM+"/v2/",
            "url_search":"http://search.aksaramaya.com/",
            "url_chat":"http://ijakarta.id:7777/subscribe",
            "url_notif":"http://ijakarta.id:7777/subscribe",
            "v3":ipOLCM+"/v3/",
            "search":"http://search.aksaramaya.com"
          }
      }
    });
    check.error(function(data){
      localStorage.setItem('offline',false)
      setTimeout(function(){
        $('.main').css('top','')
        $('.olcm').hide();
      })
    })
  }catch(e){
    console.log(e.error_message)
    localStorage.setItem('offline',false)
    setTimeout(function(){
      $('.main').css('top','');
      $('.olcm').hide();
    })
}
}

// function write_olcm() {
//   var ipOLCM = 'http://dls.moco.co.id:7575/'
//   var check = majax_empty(ipOLCM+'/v4/offline/is_offline',{'client_id':App.api.client_id},'');
//   check.error(function(data) {
//     console.log(data)
//   }),
//   check.success(function(data){
//     if(data.meta.code=='200'){
//       if(data.data.offline==true){
//         RepoOlcm = {
//           "base":ipOLCM,
//           "api_base":ipOLCM+"/v2/",
//           "client_id":"NTE0ZDEzOTIwY2VhZmVk",
//           "client_secret":"e3748abd70685a01553802e044d12404bce0ab13",
//           "api_realtime":"http://dls.moco.co.id",
//           "api_realtime_chat":"http://dls.moco.co.id",
//           "url_share":ipOLCM,
//           "url_update":"https://eyeyunianto.github.io/app_update/production/",
//           "api_fast":ipOLCM+"/v2/",
//           "url_search":"http://search.aksaramaya.com/",
//           "url_chat":"http://ijakarta.id:7777/subscribe",
//           "url_notif":"http://ijakarta.id:7777/subscribe",
//           "v3":ipOLCM+"/v3/",
//           "search":"http://search.aksaramaya.com"
//         }
//       }
//     }else{

//     }
//   })
// }

console.log(hostReplacements);
App.api = hostReplacements;

// window.onload = function() {
var r_config=["15px","georgia",1.5,1];
var data =JSON.stringify(r_config);
window.localStorage.setItem('reader_conf',data);

App.password="";
App.Success_Alert="Payment Complete"
App.Success_Content="Your book has been added to your collection!"
App.Failed_Alert="Failed"
App.Failed_Content="Failed"
App.Dialog="";
App.Callback="";
App.Bank="";
App.Book="";
App.temp='';
mac_ver='Beta';
win_ver='Beta';
mac_shell='0.1.1';
win_shell='0.1.1';
version_build=20151030;
var user_tab,shelf_tab;
vou_index_html='';

var faq ='{\
  "en":{\
    "ingawi":"http://ingawi.id/en/faq.html"\
  },\
  "id":{\
    "ingawi":"http://ingawi.id/faq.html"\
  }\
}'

var howto ='\
{\
  "en":{\
    "ingawi":"http://ingawi.id/en/howto.html"\
  },\
  "id":{\
    "ingawi":"http://ingawi.id/howto.html"\
  }\
}'

var Lfaq = $.getJSON( "https://raw.githubusercontent.com/eyeyunianto/aksara/master/web/faq.json", function() {
  App.faq = Lfaq.responseJSON;
})
  .done(function() {
    App.faq = Lfaq.responseJSON;
  })
  .fail(function() {
    console.log( "error" );
    App.faq = faq;
  });

var Lhowto = $.getJSON( "https://raw.githubusercontent.com/eyeyunianto/aksara/master/web/howto.json", function() {
  App.howto = Lhowto.responseJSON;
})
  .done(function() {
    App.howto = Lhowto.responseJSON;
  })
  .fail(function() {
    console.log( "error" );
    App.howto = howto;
  });

App.fb_id = '392240824530838';
window.localStorage.setItem('fb_id',App.fb_id)
App.twit_id = '';

App.subscribe="";
App.content="";

window.localStorage.setItem('app_fast',App.api.api_fast)
window.localStorage.setItem('client_id',App.api.client_id)
window.localStorage.setItem('app_base',App.api.base)

var status='';
var signup=[];
var profile,voucher,purchase;
App.Router.map(function() {
  this.resource('intro',function(){
    this.route('ha');
    this.route('na');
    this.route('ca');
    this.route('ra');
    this.route('ka');
  });
  this.resource('login');
  this.resource('main', function() {
    this.route('home',function(){
      this.route('home',{'path':'/:home_id'})
    });
    this.resource('store');
    this.resource('store', { 'path' : '/store/:store_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('library');
    this.resource('library', { 'path' : '/library/:library_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('epustaka', { 'path' : '/epustaka/:epustaka_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('author', { 'path' : '/author/:author_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('user', { 'path' : '/user/:user_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('book', { 'path' : '/book/:book_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('search');
    this.resource('search', { 'path' : '/search/:search_id'},function() {
      this.resource('comments',function(){
        this.route('new');
      })
    });
    this.resource('notes', { 'path' : '/notes/:notes_id'});
    this.resource('notes.new');
    this.resource('shelf',{ 'path' : '/shelf/:shelf_id'},function(){
      this.route('current');
      this.route('want');
      this.route('history');
    });
    this.resource('pustaka')
    this.resource('pustaka', { 'path' : '/pustaka/:pustaka_id'});
  });
  this.resource('chat');
  this.resource('reader', { 'path' : '/reader/:reader_id'});
});

var guid = (function(){function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();
function uuid_v4() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

var uuid = uuid_v4();

// var visitor = ua('UA-67274511-4',uuid, {https: true});
// var visitor = ua('UA-67274511-2',uuid);
var visitor = ua('UA-88393300-28',uuid);
visitor.pageview("/").send()


var h = screen.height;
var w = screen.width;
var resol= h+'x'+w;
console.log(resol)
// ga('set', 'screenResolution', resol);

function ga_action(ec1,ea1,el1,ev1){
  if(ev1){
    visitor.event(ec1, ea1, el1, ev1).send()
  }else{
    visitor.event(ec1, ea1, el1).send()
  }
}

function ga_pages(page,title){
  visitor.pageview(page, title, "http://ingawi.id").send();
}
