don_harga = 0;
function updateSpinner(id,obj){
  var contentObj = document.getElementById(id);
  var value = parseInt(contentObj.value);
  if(obj.id == "spin_down") {
    if(value==1){

    }else{
      value--;
    }
  }else{
    value++;
  }
  contentObj.value = value;
  don_qty = parseInt($('#don_qty').val());
  $('#don_total').html(rupiah(value*don_harga));
}

function black_input(data){
  $(data).on('click',function(e){
      e.preventDefault();
      $(data).val("");
      $(data).css('color','#444444');
  });
}
function runScript(e) {
    if (e.keyCode == 13) {
        console.log(e);
        send_chat(2)
    }
}
function error_handling(id,data){
  $(id).css('color','#c92036');
  $(id).val(data);
  black_input(id);
}
function onresize(){
  $(window).resize(function() {
    purchase_resize();
  });
}
function n_pustaka(){
  
}
function open_profile(){
  $('#open_profile').click();
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function purchase_resize(){
  //480
  var height = $(window).height();
  var t = parseInt(height - 480);
  $('#purchase').css('height',t+'px')
}
function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}
Array.prototype.remove=function(v){
    delete this[this.indexOf(v)]
};
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
function isDirectory(data){
  try{
    var stats = fs.lstatSync(data);
    window.dir_status=stats.isDirectory()
  }catch(e){
    console.log(e.message)
    window.dir_status=false
  } 
}
function isExist(data){
  try{
    var stats = fs.lstatSync(data);
    if(stats.isFile()==true){
      var stat = fs.statSync(data)
      if(stat["size"]==0){
        window.file_status=false
        delete_file(data);
      }else{
        window.file_status=true
      }
    }else{
      window.file_status=false
    }
  }catch(e){
    console.log(e.message)
    window.file_status=false
  }
}
function AvaError(source){
  source.src = "img/main/avatar.png";
  source.onerror = "";
  return true;
}
function CovError(source){
  source.src = "assets/img/placeholder/ic_buku_placeholder.png";
  source.onerror = "";
  return true;
}
function AudError(source){
  source.src = "assets/img/placeholder/ic_audio_placeholder.png";
  source.onerror = "";
  return true;
}
function VidError(source){
  source.src = "assets/img/placeholder/ic_video_placeholder.png";
  source.onerror = "";
  return true;
}

function majax_fast_post(get,send,bs){
  
}
function majax_fast(get,send,bs){
  return $.ajax({
    type: 'GET',
    cache:true,
    url:App.api.api_fast+get,
    beforeSend:function(){bs},
    data: send,
    timeout:60000,
    dataType:"json"
  });
}
function majax_secure(get,send,bs){
  return App.$.ajax({
     type: 'POST',
     contentType: "application/json; charset=utf-8",
     url:App.api.api_fast+get,
     beforeSend:function(){bs},
     data: JSON.stringify(send),
     async: false,
     timeout:60000,
     dataType:"json"
  });  
}
function majax_secure_empty(get,send,bs){
  return App.$.ajax({
     type: 'POST',
     contentType: "application/json; charset=utf-8",
     url:get,
     beforeSend:function(){bs},
     data: JSON.stringify(send),
     async: false,
     timeout:60000,
     dataType:"json"
  });  
}
function majax_upload(get,send,bs){
  return App.$.ajax({
    type: 'POST',
    url:get,
    beforeSend:function(xhr){
      xhr.setRequestHeader('Content-Type', 'canvas/upload');
    },
    headers: {"Content-Type": "canvas/upload"},
    data: send,
    async: false,
    timeout:60000
  });  
}
function majax_post_fast(get,send,bs){
  return App.$.ajax({
     type: 'POST',
     contentType: "application/json; charset=utf-8",
     url:App.api.api_fast+get,
     beforeSend:function(){bs},
     data: send,
     async: false,
     timeout:60000,
     dataType:"json"
  });  
}
function majax_post(get,send,bs){
  return App.$.ajax({
    type: 'POST',
    url: App.api.api_base+get,
    cache:true,
    beforeSend:function(){bs},
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function majax_empty(get,send,bs){
  return App.$.ajax({
    type: 'GET',
    url: get,
    cache:true,
    beforeSend:function(){bs},
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function majax(get,send,bs){
  return App.$.ajax({
    type: 'GET',
    beforeSend:function(){bs},
    url: App.api.api_base+get,
    cache:true,
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function limitCharacter(textToLimit, wordLimit,status)
{
  var finalText = "";
  if(textToLimit==null){
    return textToLimit;
  }else{
    var numberOfWords = textToLimit.length;
    //console.log(numberOfWords,wordLimit)
    var i=0;
    if(numberOfWords > wordLimit)
    {
      if(status){
        $('#read_more').show();
      }
      for(i=0; i< wordLimit; i++)
      finalText = finalText+ textToLimit[i];
      return finalText+"...";
    }
    return textToLimit;
  }
}
function ReadData(sKey) {
  if(sKey){
      var sValue = window.localStorage.getItem(sKey);
      return sValue ? JSON.parse(sValue) : sValue;
  }else{
      console.log(sKey)
  }
}

function WriteData(sKey, oData) {
  if(oData){
      var sValue = JSON.stringify(oData);
      window.localStorage.setItem(sKey, sValue);
  }else{
      console.log(oData)
  }
}
function add_want(id){
  try{
    var controller = App.MainBookController.create();
    controller.send('add_want',id)
  }catch(error){
    console.log(error.message)
  }
}
function preload_img(data){
    //console.log(data);
    $(data).preload({
        placeholder:'images/bg.png',
        notFound:'images/bg.png'
    });
}

function preload_img_slider(data){
    //console.log(data);
    $(data).preload({
        notFound:'images/bg.png'
    });
}

function preload_empty(data){
    //console.log(data);
    $(data).preload({
        placeholder:'images/bg.png'
    });
}

function preload_other(data){
    //console.log(data);
    $(data).preload({
        placeholder:'images/logo.png',
        notFound:'images/logo.png'
    });
}

function preload_ava(data){
    //console.log(data);
    $(data).preload({
        placeholder:'images/icon/avatar.png',
        notFound:'images/icon/avatar.png'
    });
}

function load_dropdown(){
  ( function( $ ) {
    $( document ).ready(function() {
      $('#cssmenu li.has-sub>a').on('click', function(){
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp();
          $('#cssmenu>ul>li.has-sub>ul').css('overflow','auto');
        }
        else {
          element.addClass('open');
          element.children('ul').slideDown();
          element.siblings('li').children('ul').slideUp();
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp();
          $('#cssmenu>ul>li.has-sub>ul').css('overflow','auto');
        }
      });
      $('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');

      // try{
      //   (function getColor() {
      //     var r, g, b;
      //     var textColor = $('#cssmenu').css('color');
      //     textColor = textColor.slice(4);
      //     r = textColor.slice(0, textColor.indexOf(','));
      //     textColor = textColor.slice(textColor.indexOf(' ') + 1);
      //     g = textColor.slice(0, textColor.indexOf(','));
      //     textColor = textColor.slice(textColor.indexOf(' ') + 1);
      //     b = textColor.slice(0, textColor.indexOf(')'));
      //     var l = rgbToHsl(r, g, b);
      //     if (l > 0.7) {
      //       $('#cssmenu>ul>li>a').css('text-shadow', '0 1px 1px rgba(0, 0, 0, .35)');
      //       $('#cssmenu>ul>li>a>span').css('border-color', 'rgba(0, 0, 0, .35)');
      //     }
      //     else
      //     {
      //       $('#cssmenu>ul>li>a').css('text-shadow', '0 1px 0 rgba(255, 255, 255, .35)');
      //       $('#cssmenu>ul>li>a>span').css('border-color', 'rgba(255, 255, 255, .35)');
      //     }
      //   })();
      // }catch(error){
      //   console.log(error.message)
      // }
      // function rgbToHsl(r, g, b) {
      //     r /= 255, g /= 255, b /= 255;
      //     var max = Math.max(r, g, b), min = Math.min(r, g, b);
      //     var h, s, l = (max + min) / 2;

      //     if(max == min){
      //         h = s = 0;
      //     }
      //     else {
      //         var d = max - min;
      //         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      //         switch(max){
      //             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      //             case g: h = (b - r) / d + 2; break;
      //             case b: h = (r - g) / d + 4; break;
      //         }
      //         h /= 6;
      //     }
      //     return l;
      // }
    });
  } )( jQuery );
}

function open_balance(){
  console.log('open balance')
  setTimeout(function(){
    $('#logo_profile').click()
    setTimeout(function(){
      $('#btn-balance').click()
    },1000)
  },100)
}

function n_user(){
  
}
//Back to history
function goBack() {
  try{
      message_real.close();
    }catch(e){
      console.log(e.message)
    }
    main_profile();
    // $('.main').css('bottom','40px')
    window.history.back()
}
function act_clear(data){
  if(data==1){
    $('#count_chat').hide()
    $('#count_notif').hide()
  }else if(data==2){
    $('#count_chat').hide()
    $('#count_notif').hide()
  }
  reset_count();
}
function goBackSearch() {
  try{
    ign.back();
  }catch(error){
    console.log(error.message)
    window.history.back()
  }
}
var reader_back = 0;
function goBackReader(){
  reader_back = 1;
  clear_books();
  setTimeout(function(){
    $('body').css('color','#888')
    var link = localStorage.getItem('history')
    location.href=link;
    setTimeout(function(){
      main_profile()
    },3000)
  })
}
function show_badge(data,dua){
  if(data==2){
    $('#badge_status2').click();
    setTimeout(function(){
      $('#list_badge_s').html(list_badge);
      $('#photo_badge').attr('src',user[1]);
      if(dua){
        $('#div_sos').css('background-color','#4D4B8C');
        $('#icon_sos').removeClass('moco-lock').addClass('moco_check_o2').css('color','#fff');
        $('#span_sos').html('Socializer');
        $('#l_sos').css('color','#fff');
      }
    },100);
  }else{
    $('#badge_status1').click();
    setTimeout(function(){
      $('#list_badge_s').html(list_badge);
      $('#photo_badge').attr('src',user[1])
    },100);
  }
}

function timeago(data){
  if(data==undefined){
    return undefined
  }else{
    try{
      var a = data.split(' day');
      if(a[1]){
        if(parseInt(a[0])<7){
          var b = a[0]+'d';
          return b
        }else{
          var b = parseInt(parseInt(a[0])/7)
          b+='w';
          return b
        }
      }else{
        var b = data.split(' day')
        if(b[1]){
          return b[0]+'d'
        }else{
          var b = data.split(' hour')
          if(b[1]){
            return b[0]+'h'
          }else{
            var b = data.split(' minute')
            if(b[1]){
              return b[0]+'m'
            }else{
              return 'now'
            }
          }
        }
        // var b = data.replace(' hours','h').replace(' minutes','m').replace(' microseconds','ms').replace(' day','d').replace(' seconds','s').replace(' ago','').replace(',','');
        // return b
      }
    }catch(error){
      console.log(error.message)
      return 'now'
    }
  }
}

//Format Date
var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
      timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
      timezoneClip = /[^-+\dA-Z]/g,
      pad = function (val, len) {
          val = String(val);
          len = len || 2;
          while (val.length < len) val = "0" + val;
          return val;
      };
  return function (date, mask, utc) {
      var dF = dateFormat;
      if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
          mask = date;
          date = undefined;
      }
      date = date ? new Date(date) : new Date;
      if (isNaN(date)) throw SyntaxError("invalid date");
      mask = String(dF.masks[mask] || mask || dF.masks["default"]);
      if (mask.slice(0, 4) == "UTC:") {
          mask = mask.slice(4);
          utc = true;
      }

      var _ = utc ? "getUTC" : "get",
          d = date[_ + "Date"](),
          D = date[_ + "Day"](),
          m = date[_ + "Month"](),
          y = date[_ + "FullYear"](),
          H = date[_ + "Hours"](),
          M = date[_ + "Minutes"](),
          s = date[_ + "Seconds"](),
          L = date[_ + "Milliseconds"](),
          o = utc ? 0 : date.getTimezoneOffset(),
          flags = {
              d:    d,
              dd:   pad(d),
              ddd:  dF.i18n.dayNames[D],
              dddd: dF.i18n.dayNames[D + 7],
              m:    m + 1,
              mm:   pad(m + 1),
              mmm:  dF.i18n.monthNames[m],
              mmmm: dF.i18n.monthNames[m + 12],
              yy:   String(y).slice(2),
              yyyy: y,
              h:    H % 12 || 12,
              hh:   pad(H % 12 || 12),
              H:    H,
              HH:   pad(H),
              M:    M,
              MM:   pad(M),
              s:    s,
              ss:   pad(s),
              l:    pad(L, 3),
              L:    pad(L > 99 ? Math.round(L / 10) : L),
              t:    H < 12 ? "a"  : "p",
              tt:   H < 12 ? "am" : "pm",
              T:    H < 12 ? "A"  : "P",
              TT:   H < 12 ? "AM" : "PM",
              Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
              o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
              S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
          };

      return mask.replace(token, function ($0) {
          return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
      });
  };
}();

dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
// dateFormat.i18n = {
//     dayNames: [
//         "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
//         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
//     ],
//     monthNames: [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//         "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
//     ]
// };
dateFormat.i18n = {
    dayNames: [
        "Min","Sen", "Sel", "Rab", "Kam", "Jum", "Sab",
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]
};
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

//Change 24 Hours to 12 Hours (AM/PM)
function change_time(data){
    var arr = data.split(' ');
    if(arr[1]){
      var date_curr =arr[0];
      var time_curr = arr[1];
    }else{
      var date_curr =arr;
      var time_curr = '';
    }
    //console.log(date_curr,time_curr);
    var hourEnd = time_curr.indexOf(":");
    var H = +time_curr.substr(0, hourEnd);
    var h = H % 12 || 12;
    var ampm = H < 12 ? " AM" : " PM";
    var time_final = time_curr.substr(hourEnd, 3) + ampm;
    var result = date_curr+' '+time_final;
    //console.log(result);
    return result;
}

function search_chat(){
    var $rows=$('#online .user');
    $('#user_chat').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
    });
}
function user_details(id){
  location.href="#/main/user/"+id;
}

function ga_book(data){
  if(data){
    if(data==1){
      var type = "Facebook"
    }else if(data==2){
      var type = "Twitter"
    }else if(data==3){
      var type = "GPlus"
    }else if(data==4){
      var type = "Email"
    }else{
      var type = "LinkedIn"
    }
    ga_action('Book','Share Via '+type,App.book_title)
  }else{
    ga_action('Book','Share',App.book_title)
  }
}

function change_review(id){
  $('#btn-review').attr('onclick','review(\'Review\',\'Review\',\''+id+'\')');
  $('#reviews-input').focus();
}
function com_feeds(id,like,status_like,cover,title,action,data){
  console.log(id+' '+like+' '+status_like+' '+cover+' '+title+' '+action+' '+data)
  $('#com-feeds').click();
  var controller = App.MainHomeController.create();
  controller.send('review',id,like,status_like,'feeds');
  $('#btn-review').attr('onclick','addcomment(\'Feed\','+id+')')
  // $('#list_like').attr('onclick','actlist_like('+id+','+like+','+status_like+',\''+cover+'\',\''+title+'\',\''+action+'\',\''+data+'\')')

  // actlist_like(id,like,status_like,cover,title,action,data);
  det_feeds(id);
  if(status_like=="1"){
    $('#act_list-like').attr('onclick','like_(\''+id+'\',\'0\','+id+',\'Feed\')').addClass('blue');
  }else{
    $('#act_list-like').attr('onclick','like_(\''+id+'\',\'1\','+id+',\'Feed\')').removeClass('blue')
  }
  $('#total_like').html(like);
  $('#title').html(title);
  $('#cover').attr('src',cover);
  $('#feed_title').html(capitalizeFirstLetter(action));
  if(data){
    console.log(data)
    $('#review_text').html('"'+data+'"');
    stack_scroll('#act_list-like','#scroll_feeds')
  }else{
    console.log('non')
    $('#review_text').hide();
  }
  stretchImg();
}
function det_feeds(id){
  var controller =  App.MainHomeController.create();
  controller.send('list_like',id);
  var token = localStorage.getItem('token');
  var check = new majax_fast('feeds/detail',{'access_token':token,'feed_id':id},'');
//access_token,library_id,page,per_page
  var cover,status_link,name_sender,link_avatar,image,cat_sender,pesan;
  check.error(function(data) {

  }),
  check.success(function(data) {
    console.log(data)
    // com_feeds(id,like,status_like,cover,title,action,data)
    if(data.meta.code==200){
      var Feed = data.data.Feed;
      var Object = data.data.Object;
      var Statistic = data.data.Statistics;
      var Sender = data.data.Sender;
      var Book = data.data.Object.Book;
      var Authors = data.data.Object.Authors;
      try{
        if(Statistic.has_like=="1"){
          $('#act_list-like').attr('onclick','like_(\''+Feed.id+'\',\'0\','+Feed.id+',\'Feed\')').addClass('blue');
        }else{
          $('#act_list-like').attr('onclick','like_(\''+Feed.id+'\',\'1\','+Feed.id+',\'Feed\')').removeClass('blue')
        }

        $('#total_like').html(Statistic.total_like);
        // $('#title').html(title);
        if(Feed.sender_type=="User"){
          name_sender = Sender.User.name;
          link_avatar = 'location.href=\'#/main/user/'+Sender.User.id+'\'';
          if(Sender.User.avatar){
              image=Sender.User.avatar;
          }else{
              image="images/icon/avatar.png";
          }
          if(Sender.Badge){
              cat_sender = Sender.Badge.name;
          }else{
              cat_sender = Sender.User.type
          }
        }else if(Feed.sender_type=="Author"){
          name_sender = Sender.Author.name;
          link_avatar = 'location.href=\'#/main/user/'+Sender.Author.id+'\'';   
          if(Sender.Author.avatar){
              image=Sender.Author.avatar;
          }else{
              image="images/icon/avatar.png";
          }
          cat_sender = 'Author';
        }else if(Feed.sender_type=="Library"){
          name_sender = Sender.Library.name;
          link_avatar = 'location.href=\'#/main/library/'+Sender.Library.id+'\'';
          if(Sender.Library.logo){
              image=Sender.Library.logo;
          }else{
              image="images/icon/avatar.png";
          }
          cat_sender = "Library";
        }else if(Feed.sender_type=="Store"){
          name_sender = Sender.Store.name;
          link_avatar = "";
          if(Sender.Store.logo){
              image=Sender.Store.logo;
          }else{
              image="images/icon/avatar.png";
          }
          cat_sender = Feed.sender_type;
        }else{
          name_sender = "";
          link_avatar = "";
          image="images/icon/avatar.png";
          cat_sender = "";
        }

        $('.minCircle').attr('src',image).attr('onclick',link_avatar);
        $('#f_sender').html(name_sender)
        $('#f_time').html('. '+timeago(Feed.elapsed_time));

        if(Feed.object_type=="Book"){
          cover = Object.Book.cover
          status_link = 'location.href=\'#/main/book/'+Object.Book.id+'\'';
        }else if(Feed.object_type=="Library"){
          cover = Object.Library.logo
          status_link = 'location.href=\'#/main/library/'+Object.Library.id+'\'';
        }else if(Feed.object_type=="User"){
          cover = Object.User.avatar
          status_link = 'location.href=\'#/main/user/'+Object.User.id+'\'';
        }else if(Feed.object_type=="Author"){
          cover = Object.Author.avatar
          status_link = 'location.href=\'#/main/author/'+Object.Author.id+'\'';
        }else if(Feed.object_type=="Review"){
          cover = Object.Book.cover
          status_link = 'location.href=\'#/main/book/'+Object.Book.id+'\'';
        }else if(Feed.object_type=="Comment"){
          cover = Object.Book.cover;
          status_link = 'location.href=\'#/main/book/'+Object.Book.id+'\'';
        }else if(Feed.object_type=="Status"){
          console.log(Object.Media)
          if(Object.Media){
            console.log('ada media')
            if(Object.Media[0].Link.type=="Book"){
              status_link = 'location.href=\'#/main/book/'+Object.Media[0].Link.url+'\'';
            }else  if(Object.Media[0].Link.type=="Library"){
              status_link = 'location.href=\'#/main/epustaka/'+Object.Media[0].Link.url+'\'';
            }else  if(Object.Media[0].Link.type=="User"){
              status_link = 'location.href=\'#/main/user/'+Object.Media[0].Link.url+'\'';
            }else{
               status_link = 'javascript:gui.Shell.openExternal(\''+Object.Media[0].Link.url+'\')';
            }
            // object_image = '<img class="pointer" src="'+Object.Media[0].Picture.media+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/home\'">';
            cover = Object.Media[0].Picture.media;
          }else{
            console.log('tidak ada media')
            cover = '';
            $('#f_cov').hide();
            $('#f_cont').css('margin','auto').css('left','0').css('bottom','0');
          }
        }else{
          cover = '';
          $('#f_cov').hide();
          $('#f_cont').css('margin','auto').css('left','0').css('bottom','0');
        }

        console.log(cover)
        if(Feed.action_type=="RECOMMEND"){ 
          pesan = "mengirimkan rekomendasi buku"
        }else if(Feed.object_type=="Status"){
          if(Object.Status){
            pesan = Object.Status.text
          }else{
            pesan = '';
          }
        }else{
          pesan = Feed.message;
        }
        $('#f_content').html(pesan)
        if(pesan==""){
          $('#f_content').hide();
          $('._review').css('height','355px')
          $('#list_like_').attr('onclick','f_open(\'open\',\'false\')')
        }else{
          $('#list_like_').attr('onclick','f_open(\'open\',\'true\')')
        }

        $('#cover').attr('src',cover).attr('onclick',status_link).css('pointer','pointer');
        if(Feed.message!='None'){
          $('#feed_title').html(capitalizeFirstLetter('Mengabarkan kepada Anda'));
        }else{
          $('#feed_title').html(capitalizeFirstLetter('Mengabarkan kepada Anda'));
        }

        var _w = $('#cover').width();
        var _h = $('#cover').height();

        stretchImg();
        $( window ).on("resize.mymethod",(function() {
          stretchImg();
        }));
        // if(data){
        //   console.log(data)
        //   $('#review_text').html('"'+data+'"');
        //   stack_scroll('#act_list-like','#scroll_feeds')
        // }else{
        //   console.log('non')
        //   $('#review_text').hide();
        // }

      }catch(error){
        console.log(error.message)
      }

    }else{

    }
  });
}
function f_open(data,cond){
  if(data=='open'){
    $('._like').hide();
    $('._review').show();
    if(cond=='true'){
      $('#f_content').show();
    }
    $('#list_like_').attr('onclick','f_open(\'close\',\''+cond+'\')')
    $('#f_back').hide();
  }else{
    $('#list_like_').attr('onclick','f_open(\'open\',\''+cond+'\')')
    $('._like').show();
    $('._review').hide();
    $('#f_content').hide();
    $('#f_back').show();
    $('#f_back').attr('onclick','f_open(\'open\',\''+cond+'\')')
  }
}
function stretchImg(){
  var w = $('#cover').width();
  var h = $('#cover').height();
  // $(data).each(function() {
  //   ($(this).height() > $(this).find('img').height()) 
  //     ? $(this).find('img').removeClass('fillwidth').addClass('fillheight')
  //     : '';
  //   ($(this).width() > $(this).find('img').width()) 
  //     ? $(this).find('img').removeClass('fillheight').addClass('fillwidth')
  //     : '';
  // });
  var _h = $('#f_cov').height()
  var _w = $('#f_cov').width()
  if(w>=h){
    console.log('landscape')
    if(w>=_w){
      if(_h>_w){
        console.log('max width')
        $('#cover').css('height','').css('width','100%')
      }else{
        console.log('max height')
        $('#cover').css('height','100%').css('width','');
      }
    }else{
      console.log('standard')
      $('#cover').css('height','').css('width','100%')
    }

  }else{
    console.log('potrait')
    $('#cover').css('height','100%').css('width','')
  }
}
function parseHTML(markup) {
  if (markup.toLowerCase().trim().indexOf('<!doctype') === 0) {
    var doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = markup;
    return doc;
  } else if ('content' in document.createElement('template')) {
    // Template tag exists!
    var el = document.createElement('template');
    el.innerHTML = markup;
    return el.content;
  } else {
   // Template tag doesn't exist!
   var docfrag = document.createDocumentFragment();
   var el = document.createElement('body');
   el.innerHTML = markup;
   for (i = 0; 0 < el.childNodes.length;) {
       docfrag.appendChild(el.childNodes[i]);
   }
   return docfrag;
  }
}

function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
function topup(data){
  if(data=="token"){
    var controller = App.MainController.create();
    controller.send('topup_token')
  }else if(data=="klickpay"){
    topup_type = "klickpay"
    $('#btn-point').click();
    var controller = App.MainController.create();
    try{
      controller.send('v_index','klickpay');
    }catch(error){
      console.log(error.message)
    }
  }else if(data=="matm"){
    topup_type = "matm"
    $('#btn-point').click();
    var controller = App.MainController.create();
    try{
      controller.send('v_index','matm');
    }catch(error){
      console.log(error.message)
    }
  }else if(data=="matm_act"){
    var controller = App.MainController.create();
    controller.send('topup_matm')
  }else if(data=="gift"){
    topup_type = "gift";
    $('#btn-matm').click();
    $('#follow_title').html('Send Point')
    $('#text1').html('Enter the amount')
    $('#text2').html('which you want transfer!')
    $('#phone').attr('placeholder','Type the specify point here...')
    $('#phone').keyup(function() {
      $('#btn-act').attr('onclick',"send_gift_poin('"+parseInt($('#phone').val())+"')")
    });
    // $('#btn-act').attr('onclick',"send_gift_poin('"+parseInt($('#phone').val()/1000)+"')")
    // var controller = App.MainController.create();
    // try{
      // controller.send('v_index','gift');
    // }catch(error){
    //   console.log(error.message)
    // }
  }
} 
function set_voucher_id(index,nominal){
  $('.voucher').removeClass('b-orange').addClass('b-green');
  $('#voucher_'+index).removeClass('b-green').addClass('b-orange');
  voucher_id = index;
  App.nominal = nominal
   $('#btn-select').removeAttr('disable')
   console.log(topup_type)
  if(topup_type=="klickpay"){
    $('#btn-select').attr('onclick','get_klickpay()')
  }else if(topup_type=="matm"){
    $('#btn-select').attr('onclick',"javascript:$('#btn-matm').click()")
  }else if(topup_type=="gift"){
    $('#btn-select').attr('onclick',"send_gift_poin('"+parseInt(nominal/1000)+"')")
  }
}
function get_klickpay(){
  var token= window.localStorage.getItem('token');
  var data = {'access_token':token,'product_type':'Voucher','product_key':''+voucher_id+''}
  console.log(data);
  var location= window.location.href;
  win="";
  $.ajax({
   type: 'POST',
   url: App.api.api_base+"orders/klikPayParameters",
   data: data,
     beforeSend:function(){
          $('#moco-load').addClass('fa moco-load fa-spin fa-large');
     },
   success: function(result){
          console.log(result);
          var data = result.data; 
          transaction_klickpay(data.klikPayCode,data.transactionNo,data.totalAmount,data.currency,data.payType,data.callback,data.transactionDate,data.signature);
     }
 });
}

function transaction_klickpay(klikPayCode,transactionNo,totalAmount,currency,payType,callback,transactionDate,signature){  
  var html=''
  html='<div class="row" style="visibility:hidden"> \
      <div class="col-sm-6 col-md-3"></div>\
      <div class="col-sm-6 col-md-6"><div class="panel panel-default"> \
      <div class="panel-heading">Konfirmasi Belanja</div> \
      <div class="panel-body"> \
      Total :'+currency+' '+totalAmount+' <br><br> \
      Payment Method : KlikPay (BCA)<br>\
      <form id="add_deposit" method="POST" action="https://klikpay.klikbca.com/purchasing/purchase.do?action=loginRequest">\
      <input type="hidden" name="klikPayCode" value="'+klikPayCode+'">\
      <input type="hidden" readonly="true" name="transactionNo" value="'+transactionNo+'">\
      <input type="hidden" readonly="true" name="totalAmount" value="'+totalAmount+'">\
      <input type="hidden" readonly="true" name="currency" value="'+currency+'">\
      <input type="hidden" name="payType" value="'+payType+'">\
      <input type="hidden" name="callback" value="'+callback+'">\
      <input type="hidden" readonly="true" name="transactionDate" value="'+transactionDate+'"><br>\
      <input type="hidden" name="signature" value="'+signature+'">\
       <input type="submit" value="KlikPay Process" class="btn btn-primary btn-large">\
      </form></div></div></div>'
      $("#result").html(html);
      document.getElementById('add_deposit').submit();
}
function hide_suggest(id){
  $('#suggest-'+id).hide();
  $('#divsuggest-'+id).hide();
}
function morenotif(){
  var controller = App.NotifController.create();
  controller.send('morenotif')
}
function morechat(data){
  var controller = App.ChatController.create();
  if(data){
    controller.send('morechat')
  }else{
    controller.send('morechat','dropdown')
  }
}
function actlist_like(id,like,status_like,cover,title,action,data){
  $('#like_list').click();
  $('#back_list').attr('onclick','com_feeds('+id+','+like+','+status_like+',\''+cover+'\',\''+title+'\',\''+action+'\',\''+data+'\')')
  var controller = App.MainHomeController.create();
  controller.send('list_like',id)
}

function Feed_like(id){
  $('#like_list').click();
  $('#back_list').hide();
  var controller = App.MainHomeController.create();
  controller.send('list_like',id)
}

function addcomment(type,id){
  var dataComment = document.getElementById('reviews-input'); 
  if (dataComment.value){
    // alert("adaData");
    var a = parseInt($('#commentFeed-'+id).html())+1;
    console.log(a)
    $('#commentFeed-'+id).html(a+' mengomentari');
    var controller = App.CommentsController.create();
    controller.send('comments',type,id);
    $('#reviews-input').val('');
    $('#reviews-input:text').attr('placeholder','Ketik Pesan');

  }else{  // alert('Isi ');
  }
  // var a = parseInt($('#commentFeed-'+id).html())+1;
  // console.log(a)
  // $('#commentFeed-'+id).html(a+' mengomentari');
  // var controller = App.CommentsController.create();
  // controller.send('comments',type,id)
}
function det_notes(id){
  $('.list_note').css('background-color','transparent');
  $('#note'+id).css('background-color','#fff');
  var controller = App.NotesController.create();
  controller.send('detail',id)
}
function del_notes(id){
  var controller = App.NotesController.create();
  controller.send('delete',id);
  $('#btn-close_modal').click();
}
function _del_show(){
    $('#n_act').removeClass('red').addClass('blue');
    $('#n_act #edit').text('DONE');
    $('#n_act').attr('onclick','_del_hide()');
    $('#list_note').css('left','-70px')
}

function _del_hide(){
    $('#n_act').addClass('red').removeClass('blue');
    $('#n_act #edit').text('DELETE');
    $('#n_act').attr('onclick','_del_show()');
    $('#list_note').css('left','0px')
}

function active_me(data,index){
  $('.toc_act').css('display','none');
  // $('#toc_display').css('left','-'+index+' px');
  $('#toc_'+data).css('display','block');
  $('.r_nav').css('background-color','#fff').css('color','#4D4B8C')
  $('#show_'+data).css('background-color','#4D4B8C').css('color','#fff');
  $('.nav_notif').css('display','none');
  // $('#toc_display').css('left','-'+index+' px');
  $('#'+data).css('display','block'); 
}
function shelf_open(){
  $('#shelf_remove').attr('onclick','shelf_close()');
  $('.shelf_back').removeClass('hide').addClass('show');
}
function shelf_close(){
  $('#shelf_remove').attr('onclick','shelf_open()');
  $('.shelf_back').removeClass('show').addClass('hide');
}
function download_book(id,item_out,item_pass,item_session,type,cover,link,security){
  var controller = App.MainController.create();
  controller.send('download',id,item_out,item_pass,item_session,type,cover,link,security)
}
function read_this(type,link,id,cover,n_file){
  if(type=="epub" || type=="pdf"){
    location.href="#/reader/"+type+"_type_"+link.replace(/\//g,'*');
    book_id = id;
    cover_book = cover;
  }else if(type=="mp4"){
    var a = homePath+link+n_file+'_Book_'+id+'_out'
    var b = a+'.'+type;
    // b.replace(/ /g,'%20');
    console.log(b)
    var ab = "file://"+b;
    $('#btn-video').click();
    $('#video').attr('src',ab)
  }else if(type=="mp3"){
    var a = homePath+link+n_file+'_Book_'+id+'_out'
    var b = a+'.'+type;
    // b.replace(/ /g,'%20');
    console.log(b)
    var ab = "file://"+b;
    $('#audio_play').show();
    $('#audio_play').attr('src',ab)
    setTimeout(function(){
      $("#audio_play").contents().find("video[name='media']").css('height','35px')
    },300)
  }else{
    var a = homePath+link+n_file+'_Book_'+id+'_out'
    var b = a+'.'+type;
    // b.replace(/ /g,'%20');
    console.log(b)
    var ab = "file://"+b;
    var html;
    console.log(ab)
    var new_win = gui.Window.open(ab,{
      position: 'center',
      focus: true,
      toolbar: false,
      title: 'Multimedia Player',
    });
  }
}

function book_want(id){
  $('#com-follow').click();
  var controller = App.MainBookController.create();
  controller.send('want',id)
}
function book_reads(id){
  $('#com-follow').click();
  var controller = App.MainBookController.create();
  controller.send('reads',id)
}
function book_donatur(id){
  $('#com-follow').click();
  var controller = App.MainBookController.create();
  controller.send('donasi',id)
}
function book_borrow(id){
  $('#com-follow').click();
  var controller = App.MainBookController.create();
  controller.send('borrow',id)
}
function close(){
  $('#close').click();
}
function get_books(books_buy,books_rent_nom,books_day,price_id){
  $('#get-books').click();
  if(books_rent_nom=="0"||books_rent_nom==undefined|books_rent_nom=="undefined"){
    $('#point_rent').html('Unvailable').attr('disable','disabled')
  }else{
    $('#point_rent').html(books_rent_nom+" Points").attr('onclick','rent(\''+books_rent_nom+'\',\''+price_id+'\',\''+books_day+'\',\''+books_buy+'\')')
  }
  if(books_buy=="0"||books_buy==undefined){
    $('#point_buy').html('Unvailable').attr('disable','disabled')
  }else{
    $('#point_buy').html(books_buy+" Points").attr('onclick','buy(\''+books_buy+'\',\''+books_rent_nom+'\',\''+books_day+'\',\''+price_id+'\')')
  }
  if(status_pustaka=="0"){
    $('#borrow').html('Unvailable').attr('disable','disabled').removeAttr('data-ember-action')
  }
  //$('#point_buy').html(books_buy+" Points");
  // $('.overlay').attr('onclick','close()')
}
function detail_chat(id,data,image,name){
  $('#chat_name').html(name)
  $('.chat_list').css('background-color','#fff');
  $('#chat_'+data).css('background-color','#fafafa')
  msg_read(data)
  var controller = App.ChatController.create();
  controller.send('chat',id,image,name)
}

function pustaka_follower(id){
  $('#btn-follow').click()
  $('#follow_title').html('Daftar Follower').css('padding-left','35px')
  //var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('follower','Library',id)
}

function _follower(type,id){
  $('#btn-follow').click()
  if(type=="Author"){
    $('#follow_title').html('Daftar Follower').css('padding-left','35px')
  }else{
    $('#follow_title').html('Daftar Follower').css('padding-left','35px')
  }
  // $('#follow_title').html('People who follow this ePustaka')
  //var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('follower',type,id)
}
function _following(type,id){
  $('#btn-follow').click()
  if(type=="Author"){
    $('#follow_title').html('Daftar Following').css('padding-left','35px')
  }else{
    $('#follow_title').html('Daftar Following').css('padding-left','35px')
  }
  //var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('following',type,id)
}

function myfollower(){
  $('#btn-follow').click()
  $('#follow_title').html('Daftar Follower').css('padding-left','35px')
  var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('follower','user',id)
}
function myfollowing(){
  $('#btn-follow').click()
  $('#follow_title').html('Daftar Following').css('padding-left','35px')
  var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('following','user',id)
}
function recommend(){
  $('#btn-recommend').click()
  var id = localStorage.getItem('user_id')
  var controller = App.FollowController.create();
  controller.send('follower','user',id,'recommend')
  $('#icon-search').attr('onclick','search_user(\'recommend\')')
}

function strip(html){
  var tmp = document.implementation.createHTMLDocument("New").body;
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function kilo(data){
  if(data>1000000){
    var a = parseFloat(data)/1000000
    var b = a.toFixed(1)
    if(data>1000000){
      return b.replace('.','M')
    }else if(data == "1000000"){
      return "1M"
    }else{
      return data
    }
  }else{
    var a = parseFloat(data)/1000
    var b = a.toFixed(1)
    if(data>1000){
      return b.replace('.','K')
    }else if(data == "1000"){
      return "1K"
    }else{
      return data
    }
  }
}

function callback_oauth(type,data){
  console.log(type)
  console.log(data)
  $('#load_iframe').css('z-index','0').removeAttr('src').hide();
  if(type=="facebook"){
    localStorage.setItem('fb_token',data);
    var controller = App.FacebookController.create();
    controller.send('get_fb');
  }
}

// function facebookLogin(data1,data2,callback){
//   var loginWindow = gui.Window.open('https://www.facebook.com/dialog/oauth?response_type=token&scope=publish_stream,email,offline_access&client_id=' + data1 + '&redirect_uri='+data2, 'Login facebook', false);
//   var out = {};
//   loginWindow.addListener('load', function(){
//     url.parse(loginWindow.document.URL).hash.substring(1).split('&').forEach(function(p){
//       var a = p.split('=');
//       out[ a[0] ] = a[1];
//     });

//     if (out.access_token){
//       console.log(out)
//       loginWindow.close();
//       callback(out);
//     }
//   });
// }


function facebookLogin(data1,data2,callback){
  var url = require('url');
  // var loginWindow = gui.Window.open('https://www.facebook.com/dialog/oauth?response_type=token&client_id=' + data1 + '&redirect_uri='+data2, 'Login facebook', false);
  var loginWindow = gui.Window.open('https://www.facebook.com/dialog/oauth?response_type=token&scope=email&client_id=' + data1 + '&redirect_uri='+data2, {
    focus:true,
    position:'center',
    toolbar:false,
    title:'iNgawi Facebook Connect',
    icon:'img/icon/icon.png'
  });
  var out = {};
  console.log()
  loginWindow.addListener('loaded', function(){
    try{
      /*var  a1 = loginWindow.window.location.href.split('#')
      var a = a1[1].split('&');
    }catch(e){
      console.log(e.message)
      var a = loginWindow.window.location.href.split('&'); 
    }
    // console.log(a)
    a.forEach(function(p){
      var a = p.split('=');
      out[ a[0] ] = a[1];
    })
    if (out.access_token){
      loginWindow.close();
      callback(out);
    }*/
    var a1 = loginWindow.window.location.href.split('#')
        var a = a1[1].split(',');
      }catch(e){
        console.log(e.message)
      var a1 = loginWindow.window.location.href.split('&'); 
        var a = a1.split(','); 
      }
      // alert(a)
      a.forEach(function(p){
        var a = p.split('=');
        out[ a[0] ] = a[1];
      })
      if (out.access_token){
        loginWindow.window.close()
        localStorage.setItem('fb_token',out.access_token);
        // alert(out.access_token)
        callback(out);
      }
  });
}
function get_books_title(id){
    var client_id = localStorage.getItem('client_id')
    var token = localStorage.getItem('token')
    var check = new majax_fast('books/detail',{'client_id':client_id,'book_id':id,'access_token':token},'');
    check.error(function(data) {

    }),
    check.success(function(data) {
        if(data.meta.code==200){
            var Book = data.data.Book;
            localStorage.setItem('books_title',Book.title)
            // PDFView.setTitle(Book.title)
        }
    })
}
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

_list_col = []
function list_col(){
  var f = JSON.parse(window.localStorage.getItem('_current'));
  if(f){
    $.each(f.data.data,function(){
      var Book=this.Book;
      var Statistic=this.Statistic;
      var Item = this.Item
      var file = Item.out.split('/');
      var source = file[file.length - 1];
      //console.log(source)
      // var link = homePath+'/.iNgawi/'+a.
      _list_col.push(source)
    })
  }
}

// var source = homePath+'/.iNgawi/'+file[file.length - 1];
      
function del_col(){
  var d = JSON.parse(window.localStorage.getItem('ijog_intro'));
  try{
    var e = d.meta.version 
  }catch(e){
    var e = null;
  }
 // console.log(_list_col)
  try{
    fs.readdir(homePath+'/.iNgawi/',function(a,b){
      b.forEach(function(a){
        if(a.match('.zip')){
          if(a.match(e)){

          }else{
            if(_list_col){
              if (_list_col.indexOf(a) > -1) {
                  //In the array!
              } else {
                var source = homePath+'/.iNgawi/'+a;
                fs.unlinkSync(source);
                  //Not in the array
              }
            }else{
              var source = homePath+'/.iNgawi/'+a;
              fs.unlinkSync(source);
            }
          }
        }
      })
    })
  }catch(e){
    console.log(e.message)
  }
}

function del_unused(){
  list_col();
  setTimeout(function(){
    del_col();
  },3000)
}

function b_open(data){
  if(data==true){
    $('#b_collapse').attr('onclick','b_open(false)').removeClass('fa-angle-down').addClass('fa-angle-up')
    $('#book_det').show();
  }else{
    $('#b_collapse').attr('onclick','b_open(true)').removeClass('fa-angle-up').addClass('fa-angle-down')
    $('#book_det').hide();
  }
}
  
function rupiah(a,b,c,d,e){e=function(f){return f.split('').reverse().join('')};b=e(parseInt(a,10).toString());for(c=0,d='';c<b.length;c++){d+=b[c];if((c+1)%3===0&&c!==(b.length-1)){d+='.';}}return'Rp.\t'+e(d)+',-'}

function getJsonFromUrl(url) {
  // var a = url.split('/callback?');
  // var query = a[1];
  var query = url;
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function olcm(data){
  if(localStorage.getItem('token')){
    if(data==1){
      login_switch('offline')
    }else{
      login_switch('online')
    }
  }else{
    window.location.href="#/login"
  }
}

function oclm_offline(){
  $('.olcm').addClass('b-red').removeClass('b-black').css('border-bottom','1px solid #fff')
  $('#mode-olcm').html('Mode Luring')
  $('#btn-olcm').attr('onclick','olcm(2)').html('Jadikan Daring').css('border-color','#fff')
  App.api = RepoOlcm;
  localStorage.setItem('olcm',1)
  $('.olcm .navbar-left').attr('onclick','help_olcm(2)')
  reload_req()
}

function olcm_online(){
  $('.olcm').addClass('b-black').removeClass('b-red').css('border-bottom','0px')
  $('#mode-olcm').html('Mode Daring')
  $('#btn-olcm').attr('onclick','olcm(1)').html('Jadikan Luring').css('border-color','')
  App.api = hostReplacements;
  localStorage.setItem('olcm',2)
  $('.olcm .navbar-left').attr('onclick','help_olcm(1)')
  reload_req()
}

function reload_req(){
  var controller = App.MainHomeController.create();
  try{
    controller.send('books_genre');
  }catch(error){
    console.log(error.message)
  }
  try{
    controller.send('epustaka_genre');
  }catch(error){
    console.log(error.message)
  }
  var loc = location.href.split("#/main/");
  loc = location.href.split("#/main/");
  var loc_ = loc[1].split("/")
  if(loc_[0]=="home"){
    var controller = App.MainHomeController.create();
    controller.send('feeds');
    controller.send('suggest');
    controller.send('chat');
  }else if(loc_[0]=="store"){
    var a = location.href.split('store/');
    var controller = App.MainStoreController.create();
    if(a[1]!="undefined"){
      var b = a[1].split("_");
      if(b[1]){
        controller.send('books',undefined,undefined,b[0],b[1])
      }else{
        controller.send('books',a[1])
      }
    }
  }else if(loc_[0]=="library"){
    try{
      var a = location.href.split('library/');
      var controller = App.MainLibraryController.create();
      if(a[1]!="undefined"){
        var b = a[1].split("_");
        if(b[0]=="category"){
          controller.send('libraries',undefined,'category',b[1],b[2])
        }else if(b[1]){
          controller.send('libraries',undefined,undefined,b[0],b[1])
        }else if(a[1]!="index"){
          controller.send('libraries',a[1])
        }else{
          controller.send('libraries')
        }
      }
    }catch(error){
      console.log(error.message)
    }
  }else if(loc_[0]=="shelf"){
    var controller = App.ShelfCurrentController.create();
    controller.send(loc_[1])
  }

  if(loc[1]=="main/shelf/current"){

  }else if(loc[1]=="main/shelf/want"){

  }else if(loc[1]=="main/shelf/history"){

  }else if(loc[1]=="main/shelf/current"){

  }else if(loc[1]=="main/library/all"){

  }else if(loc[1]=="main/store/index"){

  }
}

function olcm_act(data){
  if(data==1){
    $('.olcm').hide();
    App.api = hostReplacements;
    $('#btn-close_modal').click();
  }else{

  }
}

function help_olcm(data){
  if(data==1){
    console.log('daring')
    App.olcm_head='Mode Daring';
    App.olcm_det='Mode akses iNgawi melalui koneksi internet.';
    App.olcm_status='Jadikan Luring';
    App.olcm_content='agar Anda dapat menikmati akses iNgawi melalui server lokal, sehingga Anda dapat menikmati buku dan karya ekslusif komunitas dengan lebih cepat';
    $('#btn-help_olcm').click();
    $('#act_try').addClass('red').addClass('b-trans').removeClass('b-red').removeClass('white');
    $('.st_device_info2').addClass('st_device_info1').removeClass('st_device_info2')
  }else{
    console.log('luring')
    App.olcm_head='Mode Luring';
    App.olcm_det='Mode akses iNgawi melalui koneksi server lokal.';
    App.olcm_status='Jadikan Daring';
    App.olcm_content='agar Anda dapat kembali menikmati akses iNgawi melalui koneksi internet, buku dan karya ekslusif komunitas tidak akan tersedia pada mode daring';
    $('#btn-help_olcm').click();
    $('#act_try').addClass('b-red').addClass('white').removeClass('red').removeClass('b-trans');
    $('.st_device_info1').addClass('st_device_info2').removeClass('st_device_info1')
  }
}

function logout_(){
  window.localStorage.removeItem('token');
  // location.href= "#/login"
}

function force_account(){
  try{
    var data = {'username':user[2],'password':App.password,'client_id':App.api.client_id,'client_secret':App.api.client_secret,'access_token':localStorage.getItem('token'),'device_id':'Desktop'};
    var post = majax_secure('login_switch',data,"");
    post.success(function(data){
      $('#log-load').removeClass('fa fa-spin moco-load');
      if(data.meta.code == 200){
        console.log(data)
      }else{
        console.log(data.meta.error_message)
      }
    });
    post.error(function(data){
      App.Failed_Alert="Oops!";
      if(data.statusText!=""){
        App.Failed_Content=data.statusText;
      }else if(data.responseText!=""){
        App.Failed_Content=data.responseText;
      }else{
        App.Failed_Content="Network Problem"
      }
      console.log(App.Failed_Content)
    });
  }catch(e){
    console.log(e.error_message)
  }
}


function login_switch(status){
  try{
    console.log(status)
    if(status=='online'){
      var endpoint = hostReplacements.api_fast+"login_switch"
    }else{
      var endpoint = RepoOlcm.api_fast+"login_switch"
    }
    var password = $('#input_password').val()
    if(password){
      var data = {'username':user[2],'password':password,'client_id':App.api.client_id,'client_secret':App.api.client_secret,'access_token':localStorage.getItem('token'),'device_id':'Desktop'};
    }else{
      var data = {'username':user[2],'client_id':App.api.client_id,'client_secret':App.api.client_secret,'access_token':localStorage.getItem('token'),'device_id':'Desktop'};
    }
    // var data = {'username':user[2],'password':password,'client_id':App.api.client_id,'client_secret':App.api.client_secret,'access_token':localStorage.getItem('token'),'device_id':'Desktop'};
    var post = majax_secure_empty(endpoint,data,"");
    post.success(function(data){
      $('#log-load').removeClass('fa fa-spin moco-load');
      if(data.meta.code == 200){
        console.log(data);
        token = data.data.access_token;
        window.localStorage.removeItem('token');
        window.localStorage.setItem('token',token);
        if(status=='online'){
          olcm_online()
        }else{
          oclm_offline()
        }
      }else{
        console.log(data.meta.error_message)
      }
    });
    post.error(function(data){
      console.log(data)
      App.Failed_Alert="Oops!";
      if(result.status=="401"){
        $('#btn-password').click();
        setTimeout(function(){
          $('#act_password').attr('onclick','login_switch('+status+')')
        })
      }else if(data.statusText!=""){
        App.Failed_Content=data.statusText;
      }else if(data.responseText!=""){
        App.Failed_Content=data.responseText;
      }else{
        App.Failed_Content="Network Problem"
      }
      console.log(App.Failed_Content)
    });
  }catch(e){
    console.log(e.error_message)
  }
}