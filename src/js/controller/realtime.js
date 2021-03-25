App.RealtimeController = Ember.ArrayController.extend({
  setupController:function(){

  },
  actions:{
    real_feeds:function(){
      // user_id = window.localStorage.getItem('user_id');
      // var es = new EventSource('http://feed.moco.co.id:8080/?events=feed-'+user_id);
      // es.addEventListener('message', function (e)
      // {
      //   var Feed = this.Feed;
      //   var Sender = this.Sender;
      //   var Object = this.Object;
      //   var Statistic = this.Statistics;
      //   if(Feed.sender_type=="User"){
      //     name_sender = Sender.User.name;
      //     link_avatar = 'location.href=\'#/main/user/'+Sender.User.id+'\'';
      //     if(Sender.User.avatar){
      //         image=Sender.User.avatar;
      //     }else{
      //         image="images/icon/avatar.png";
      //     }
      //     if(Sender.Badge){
      //         cat_sender = Sender.Badge.name;
      //     }else{
      //         cat_sender = Sender.User.type
      //     }
      //   }else if(Feed.sender_type=="Author"){
      //     name_sender = Sender.Author.name;
      //     link_avatar = 'location.href=\'#/main/user/'+Sender.Author.id+'\'';   
      //     if(Sender.Author.avatar){
      //         image=Sender.Author.avatar;
      //     }else{
      //         image="images/icon/avatar.png";
      //     }
      //     cat_sender = 'Author';
      //   }else if(Feed.sender_type=="Library"){
      //     name_sender = Sender.Library.name;
      //     link_avatar = 'location.href=\'#/main/library/'+Sender.Library.id+'\'';
      //     if(Sender.Library.logo){
      //         image=Sender.Library.logo;
      //     }else{
      //         image="images/icon/avatar.png";
      //     }
      //     cat_sender = "Library";
      //   }else if(Feed.sender_type=="Store"){
      //     name_sender = Sender.Store.name;
      //     link_avatar = "";
      //     if(Sender.Store.logo){
      //         image=Sender.Store.logo;
      //     }else{
      //         image="images/icon/avatar.png";
      //     }
      //     cat_sender = Feed.sender_type;
      //   }else{
      //     name_sender = "";
      //     link_avatar = "";
      //     image="images/icon/avatar.png";
      //     cat_sender = "";
      //   }

      //   if(Feed.object_type=="Book"){
      //     object_name = Object.Book.title;
      //     var list_author='';
      //     list_author +='<span class="black">by </span>';
      //     if(Object.Book.authors){
      //         object_det = 'by <span class="medium light-blue">'+Object.Book.authors+'</span>';
      //     }else{
      //        if(Object.Authors.length==0){
      //           list_author+='<span class="medium"></span>';
      //           object_det=list_author;
      //         }else{
      //             $.each(Object.Authors,function(){
      //                 var id = this.id;
      //                 var name = this.name;
      //                 if(id){
      //                     list_author+='<span><a style="color:#4D4B8C" href="#/main/moco/library/" onclick="authors_details('+id+')">'+name+' </a></span>';
      //                 }else{
      //                    list_author+='<span><a style="color:#4D4B8C" onclick="">'+name+' </a></span>';
      //                 }
      //             })  
      //             object_det=list_author;
      //         }
      //     }
      //     object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
      //     object_image = '<img class="pointer" src="'+Object.Book.cover+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
      //   }else if(Feed.object_type=="Library"){
      //     object_name = '<a href="#/main/epustaka/'+Object.Library.id+'" class="blue">'+Object.Library.name+'</a>';
      //     object_det = Object.Statistic.total_books+' Books';
      //     object_action = "n_pustaka("+Object.Library.id+",'"+Object.Library.name.replace(/ /g,'_')+"')";
      //     object_image = '<img class="shadow pointer" src="'+Object.Library.logo+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/epustaka/'+Object.Library.id+'\'">';
      //   }else if(Feed.object_type=="User"){
      //     object_name = Object.User.name;
      //     object_det = "-";
      //     object_action = "n_user("+Object.User.id+",'"+Object.User.name.replace(/ /g,'_')+"',1,undefined,'"+Object.User.name.replace(/ /g,'_')+"','"+Object.User.avatar+"')";
      //     object_image = '<img class="shadow avaCircle right pointer" src="'+Object.User.avatar+'" style="" onerror="AvaError(this)" onclick="location.href=\'#/main/user/'+Object.User.id+'\'">';
      //   }else if(Feed.object_type=="Author"){
      //     object_name = Object.Author.name;
      //     object_det = "-";
      //     object_action = "n_author("+Object.Author.id+",'"+Object.Author.name.replace(/ /g,'_')+"',1,undefined,'"+Object.Author.name.replace(/ /g,'_')+"','"+Object.Author.avatar+"')";
      //     object_image = '<img class="shadow avaCircle right pointer" src="'+Object.Author.avatar+'" style="" onerror="AvaError(this)" onclick="location.href=\'#/main/author/'+Object.Author.id+'\'">';
      //   }else if(Feed.object_type=="Review"){
      //     object_name = '';
      //     object_det = '"'+limitCharacter(Object.Review.content,15)+'" <br><span onclick=notif_act_to("'+Object.Review.id+'","'+Object.Book.id+'","books") style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
      //     object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
      //     object_image = '<img class="pointer" src="'+Object.Book.cover+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
      //     action_next = "notif_act_to('"+Object.Review.id+"','"+Object.Book.id+"','books')";
      //   }else if(Feed.object_type=="Comment"){
      //     object_name = '';
      //     if(Object.Book != undefined){
      //       object_det = '"'+limitCharacter(Object.Comment.comment,15)+'" <br><span onclick=notif_act_to("'+Object.Comment.id+'","'+Object.Book.id+'","books") style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
      //       object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
      //       object_image = '<img class="shadow pointer" src="'+Object.Book.cover+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
      //       action_next = "notif_act_to('"+Object.Comment.id+"','"+Object.Book.id+"','books')";
      //     }else{
      //       object_det = "'"+limitCharacter(Object.Comment.comment,15)+"'";
      //       object_action = '';
      //       object_image = '';
      //       action_next = "";
      //     }
      //   }else if(Feed.object_type=="Badge"){
      //     object_name = Object.Badge.name;
      //     object_det = ".";
      //     object_action="";
      //     //object_image = Object.Badge.icon;
      //     object_image = '';
      //   }else{
      //     object_name = "";
      //     object_det = "";
      //     object_image="";
      //       //cat_sender = Notif.recipient_type;
      //   }

      //   feeds_text += '<div class="feeds b-white">\
      //     <div class="head"><img class="avaCircle left pointer" src="'+image+'" onerror="AvaError(this)" onclick="'+link_avatar+'">\
      //       <div class="name"><span class="blue pointer" onclick="'+link_avatar+'">'+name_sender+'</span>\
      //       <span class="black thin">'+Feed.message+'</span>';
      //   total_likes = 0;
      //   if(Statistic.total_likes!=null){
      //     total_likes = Statistic.total_likes
      //   }
      //   total_comments = 0;
      //   if(Statistic.total_comments!=null){
      //     total_comments = Statistic.total_comments
      //   }
      //   if(Feed.object_type=="Library"){
      //     feeds_text+='<span> '+object_name+'</span><span class="grey f12">. '+timeago(Feed.elapsed_time)+'</span>\
      //         </div>\
      //       </div><div class="content">\
      //       <div class="image">'+object_image+'</div>\
      //       <div class="stat" style="display:none"><span class="like">'+total_likes+' likes</span>\
      //       <span class="comment"> '+total_comments+' comments</span></div>\
      //       </div></div>';
      //   }else if(Feed.object_type=="User" || Feed.object_type=="Author"){
      //     if(Feed.object_type=="User"){
      //       var id_ = Object.User.id;
      //       if(Object.User.status_follow=="false"){
      //         var act_follow = 'act_follow(\''+Object.User.id+'\',\'User\')';
      //         var text = 'Follow'
      //         var btn_follow ='b-trans b_grey'
      //         var icn_follow ='fa-plus grey'
      //       }else{
      //         var act_follow = 'act_unfollow(\''+Object.User.id+'\',\'User\')';
      //         var text = 'UnFollow'
      //         var btn_follow ='b-blue b_blue'
      //         var icn_follow ='fa-check white'
      //       }
      //     }else if(Feed.object_type=="Author"){
      //       var id_ = Object.Author.id;
      //       if(Object.Author.status_follow=="false"){
      //         var act_follow = 'act_follow(\''+Object.Author.id+'\',\'Author\')';
      //         var text = 'Follow'
      //         var btn_follow ='b-trans b_grey'
      //         var icn_follow ='fa-plus grey'
      //       }else{
      //         var act_follow = 'act_unfollow(\''+Object.Author.id+'\',\'Author\')';
      //         var text = 'UnFollow'
      //         var btn_follow ='b-blue b_blue'
      //         var icn_follow ='fa-check white'
      //       }
      //     }
      //     feeds_text+='<span class="grey f12">. '+timeago(Feed.elapsed_time)+'</span>\
      //         </div>\
      //       </div><div class="content" style="background-color:#fafafa">\
      //       <div class="right" style="padding-top:10px"><div style="margin-right:70px;"><div class="account blue">'+object_name+'</div>\
      //       <div class="det_account">'+object_det+'</div>\
      //       </div>\
      //       <div class="logo" style="top:-35px;">'+object_image+'</div></div>\
      //       <div class="stat" style="position:absolute;margin-top:45px;display:none;"><span class="like">'+total_likes+' likes</span>\
      //       <span class="comment"> '+total_comments+' comments</span></div>\
      //       </div>\
      //       <div class="" style="height:35px; padding:7px 10px;"><span id="text-follow'+id_+'">'+text+'</span> <div style="position:absolute;right:15px;bottom:-4px;"><button id="btn-follow'+id_+'" onclick="'+act_follow+'" class="'+btn_follow+' radius" style="padding:4px 16px;">\
      //       <i id="icn-follow'+id_+'" class="fa '+icn_follow+'"></i></button></div></div>';
      //   }else {
      //     if(Feed.action_type=="REVIEW"){
      //       feeds_text+='<span class="grey f12">. '+timeago(Feed.elapsed_time)+'</span>\
      //           </div>\
      //         </div><div class="content"><div class="divider"></div><div class="review">"'+limitCharacter(Object.Review.content,300)+'"</div>\
      //         <div class="image">'+object_image+'</div>\
      //       <div class="stat"><span class="like" id="likeFeed-'+Feed.id+'">'+total_likes+' likes</span>\
      //       <span class="comment"> '+total_comments+' comments</span></div></div>';
      //     }else{
      //     feeds_text+='<span class="grey f12">. '+timeago(Feed.elapsed_time)+'</span>\
      //         </div>\
      //       </div><div class="content">\
      //       <div class="image">'+object_image+'</div>\
      //     <div class="stat"><span class="like" id="likeFeed-'+Feed.id+'">'+total_likes+' likes</span>\
      //     <span class="comment"> '+total_comments+' comments</span></div>\
      //     </div>';
      //     }
      //   }
      //   var like = '';
      //   var like_status = false;
      //   if(Statistic.has_like=="1"){
      //     like="blue";
      //     like_status = true
      //     like_act='like_(\''+Feed.id+'\',\'0\','+Feed.id+',\'Feed\')'
      //   }else{
      //     like_act='like_(\''+Feed.id+'\',\'1\','+Feed.id+',\'Feed\')'
      //   }
      //   //console.log(Object.Book)
      //   if(Feed.object_type=="Book" || Feed.object_type=="Review" || Feed.object_type=="Comment" || Feed.object_type=="Recommend"){
      //     feeds_text+='</div>\
      //       <div class="tail">\
      //         <div class="col-md-6 col-xs-6 like pointer" id="actLikeFeed-'+Feed.id+'" onclick="'+like_act+'"><span class="moco-like '+like+'" id="like-'+Feed.id+'"></span> like</div>\
      //         <div class="col-md-6 col-xs-6 pointer" id="commentFeed-'+Feed.id+'" onclick="com_feeds('+Feed.id+','+Statistic.total_likes+','+like_status+',\''+Object.Book.cover+'\',\''+Object.Book.title+'\')"><span class="moco-chat"></span> Comment</div>\
      //       </div>\
      //     </div>'
      //   }else{
      //     feeds_text+='</div></div>'
      //   }
      //   $('#timeline').prepend(feeds_text);

      // });
      // es.addEventListener('error', function (e)
      // {
      // });
    },
    subcribe:function(){
      user_id = window.localStorage.getItem('user_id');
      //alert listener
      //var es = new EventSource('http://aksaramaya.com:6060/subscribe?events='+user_id);
      if(App.subscribe){
        App.subscribe.close()
      }
      if(user_id){
        if(App.api.url_notif){
          App.subscribe = new EventSource(App.api.url_notif+'?events='+user_id);
        }else{
          App.subscribe = new EventSource(App.api.api_realtime+':6060/subscribe?events='+user_id);
        }
        App.subscribe.addEventListener('message', function (e)
        {
          var event = JSON.parse(e.data);
          console.log(event)
          generate("bottomLeft",event.message.default);
          var controller = App.RealtimeController.create()
          controller.send('notif_all');
          var controller = App.ChatController.create();
          controller.send('list_chat');
          controller.send('list_chat','dropdown');
        });
        App.subscribe.addEventListener('error', function (e)
        {
            //console.log(e);
          // var event = JSON.parse(e.data);
          // generate("bottomLeft",event.message.default);
        });
      }
    },
    notif_all:function(){
      var token =window.localStorage.getItem('token');
      var check = new majax('notifications/total_new',{'access_token':token},'');
      //$('.notif').hide();
      check.success(function(data){
        if(data.meta.code==200){
          if(data.data=="Belum ada notifikasi"){
            $('.logo_bell').removeClass('white').addClass('dark_red');
            $('#count_notif').hide();
          }else{
            var controller = App.NotifController.create();
            controller.send('list_notif','dropdown');
            $('.logo_bell').addClass('white').removeClass('dark_red');
            $('#count_notif').text(kilo(data.data));
            var count = data.data.toString();
            if(count.length=='1'){
            }else if(count.length=='2'){
              $('#count_notif').css('width','20px').css('border-radius','10px').css('right','-8px');
            }else if(count.length=='3'){
              $('#count_notif').css('width','25px').css('border-radius','5px').css('right','-12px');
            }else{
              $('#count_notif').css('width','25px').css('border-radius','5px').css('right','-12px');
              // $('.notif').css('width','35px').css('border-radius','45%/45%');
            }
            $('#count_notif').show();
          }
        }else{
          $('.logo_bell').addClass('white').removeClass('dark_red');
          $('#count_notif').hide();
        }
      });
      check.error(function(data){
        $('.logo_bell').addClass('white').removeClass('dark_red');
        $('#count_notif').hide();
      })
    }
  } 
})

function generate(layout,data) {
  var n = noty({
      text        : data,
      type        : 'alert',
      dismissQueue: true,
      layout      : layout,
      theme       : 'defaultTheme',
      closeWith: ['click'],
      buttons     : [
          {addClass: 'btn btn-primary', text: 'Open', onClick: function ($noty) {
              $noty.close();
              //noty({dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Ok" button', type: 'success'});
              // short_notif();
              var controller = App.NotifController.create();
              controller.send('list_notif','dropdown');
              $('#logo_bell').click()
          }
          },
          {addClass: 'btn btn-danger', text: 'Dismiss', onClick: function ($noty) {
              $noty.close();
              //noty({dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Cancel" button', type: 'error'});
          }
          }
      ]
  });
  setTimeout(function(){
      //$.noty.closeAll();
      n.close();
  },3000)
    //console.log('html: ' + n.options.id);
}

function update_moco(){
    // var epus = majax_empty(App.api.url_update+'ijak/update.json','','');
    // epus.success(function(data){
    //   var build ="";
    //   if (navigator.appVersion.indexOf("Win")!=-1){
    //     var file =homePath+"/.iNgawi/"+data.win.build+".zip";
    //     build = data.win.build;
    //     link = data.win.link;
    //     version = data.win.version;
    //     shell = data.win.shell;
    //     var url = data.win.download;
    //     shell_ = win_shell;
    //     ver_ =win_ver;
    //   }else{
    //     var file = homePath+"/.iNgawi/"+data.mac.build+".zip";
    //     build = data.mac.build;
    //     link = data.mac.link;
    //     version = data.mac.version;
    //     shell = data.mac.shell;
    //     var  url = data.mac.download;
    //     shell_=mac_shell;
    //     ver_=mac_ver;
    //   }
    //   console.log(file)
    //   if(shell_!=shell){
    //     console.log('Download')
    //     $('#btn-update_moco').click();
    //     setTimeout(function(){
    //       $('#main_html').addClass('css3-gaussian-blur');
    //       $('#btn-update').attr('onclick','download_apps(\''+url+'\',\''+ver_+'\')');
    //       $('#text_update').html('version '+version);
    //     },100)
    //   }else if(fs.isExist(file)){
    //     var html = 'You have downloaded version '+build;
    //     console.log(html)
    //   }else{
    //     var _build = build.replace(/-/g,'');
    //     console.log(_build)
    //     if(version_build>=parseInt(_build)){
    //       var html = 'You have downloaded version '+version_build;
    //       console.log(html)
    //     }else{
    //       if (navigator.appVersion.indexOf("Win")!=-1){
    //         console.log('Download')
    //         $('#btn-update_moco').click();
    //         setTimeout(function(){
    //           $('#main_html').addClass('css3-gaussian-blur');
    //           $('#btn-update').attr('onclick','download_win_update(\''+link+'\',\''+ver_+'\')').html('Download');
    //           $('#text_update').html('version '+version);
    //         },100)
    //       }else{
    //         console.log('Update')
    //         $('#btn-update_moco').click();
    //         setTimeout(function(){
    //           $('#main_html').addClass('css3-gaussian-blur');
    //           $('#btn-update').attr('onclick','download_update(\''+build+'\',\''+link+'\',\''+ver_+'\')');
    //           $('#text_update').html('version '+version);
    //         },100)
    //       }
    //     }
    //   }
    // });
}

function download_apps(link,version){
  ga_pages('/download/'+version,version)
  ga_action('Download','Download New Application',version)
  $('#btn_cancel').click();
  gui.Shell.openExternal(link);
}

function download_win_update(link,version){
  ga_pages('/Update/'+version,version)
  ga_action('Download Update','Download Update Application',version)
  $('#btn_cancel').click();
  gui.Shell.openExternal(link);
}

function download_update(build,link,version){
  ga_pages('/update/'+version,version)
  ga_action('Update','Update Application',version)
  var html="";
  $('#btn-later').attr('disabled','disabled');
  $('#btn-update').attr('disabled','disabled');
  $('#text_').css('display','none');
  html+='<center style="margin-top:10px;margin-bottom:55px;"><div style="display: inline; width: 100px; height: 100px;"><input value="0" class="knob second" data-min="0" data-max="100" data-bgcolor="#ddd" data-fgcolor="#4D4B8C" data-displayinput="true" data-displayPrevious="true" data-width="100" data-height="100" data-thickness=".1" style=" width: 0px;"></div></center>';
  $('#logo').html(html);
  setTimeout(function(){
     $(".knob").knob();
  },500);
  if (navigator.appVersion.indexOf("Win")!=-1){
    var home= homePath+"/.iNgawi/"+build+".zip";
  }else{
    var home= homePath+"/.iNgawi/"+build+".zip";
  }
  ign.downloadProgress.connect(function(r,s){
    var persentation = (r/s)*100;
    $('.second').val(persentation).trigger('change');
    if(persentation == 100){
      setTimeout(function(){
        var a = appPath();
        if (navigator.appVersion.indexOf("Win")!=-1){
          var www = a+'/www/';
        }else{
          var b = a.replace('MacOS','');
          var www = b+'Resources/www/';
        }
        localStorage.setItem('home_',home);
        localStorage.setItem('url_',www);
        location.href="update.html";
        
        // fs.unzip(home,'',www);
        // setTimeout(function(){
        //   ign.reload();
        // },1000)
      },3000) 
    }
  });

  if (navigator.appVersion.indexOf("Win")!=-1){
    var home_p= homePath+"/.iNgawi";
  }else{
    var home_p= homePath+"/.iNgawi";
  }
  console.log(ign.download(link,home_p));
}