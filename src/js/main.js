function like_(id,value,key,type,total,status,cover,title,message,content){
  var token = localStorage.getItem('token');
  if(token){
    var before='';
    var data = {'access_token':token,'type':type,'key':key,'value':value};
    if(value==1){
      var post = majax_secure('likes/add',data,before);
    }else if(value==0){
      var post = majax_secure('likes/cancel',data,before);
    }else{
      var post = majax_secure('likes/report',data,before);
    }
    // var post = majax_secure('likes/add',data,before);
    post.success(function(data){
      console.log(data)
      //$('#like-'+id).addClass('blue');
      
      if(data.meta.code == 200){
        try{
          //console.log($('#Like'+type+'-'+key).html());
          console.log(value)
          if(type=="Feed"){
            if(value=='1'){
              $('#act_list-like').attr('onclick','like_(\''+key+'\',\'0\',\''+key+'\',\''+type+'\')').addClass('blue')
              $('#actLike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'0\',\''+key+'\',\''+type+'\')')
              $('#like-'+key).addClass('blue')
              $('#DisLike'+type+'-'+key).removeClass('red')
            }else if(value=='0'){
              $('#act_list-like').attr('onclick','like_(\''+key+'\',\'1\',\''+key+'\',\''+type+'\')').removeClass('blue')
              $('#actLike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'1\',\''+key+'\',\''+type+'\')')
              $('#like-'+key).removeClass('blue')
              $('#DisLike'+type+'-'+key).removeClass('red')
            }else{
              $('#actDisLike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'0\',\''+key+'\',\''+type+'\')')
              $('#DisLike'+type+'-'+key).addClass('red')
              $('#like-'+key).removeClass('blue')
            }
            $('#like'+type+'-'+key).html(data.data.total_like+' menyukai')
            $('#total_like').html(data.data.total_like)
            if(data.data.like.like_dislike!='0'){
              $('#comment'+type+'-'+key).attr('onclick','com_feeds('+id+',\''+data.data.total_like+'\',true,\''+cover+'\',\''+title+'\',\''+message+'\',\''+content+'\')')
            }else{
              $('#comment'+type+'-'+key).attr('onclick','com_feeds('+id+',\''+data.data.total_like+'\',false,\''+cover+'\',\''+title+'\',\''+message+'\',\''+content+'\')')
            }
          }else{
            console.log(type+' '+key)
            if(value=='1'){
              $('#actLike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'0\',\''+key+'\',\''+type+'\')')
              $('#Like'+type+'-'+key).addClass('blue').removeClass('grey')
              $('#actDislike'+type+'-'+key).removeClass('red').addClass('grey')
            }else if(value=='0'){
              $('#actLike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'1\',\''+key+'\',\''+type+'\')')
              $('#Like'+type+'-'+key).removeClass('blue').addClass('grey')
              $('#actDislike'+type+'-'+key).removeClass('red').addClass('grey')
            }else if(value=='-1'){
              $('#actDislike'+type+'-'+key).attr('onclick','like_(\''+key+'\',\'0\',\''+key+'\',\''+type+'\')').removeClass('grey')
              $('#Like'+type+'-'+key).removeClass('blue').addClass('grey')
            }
            $('#TotalLike'+type+'-'+key).html(data.data.total_like)
          }
        }catch(error){
          console.log(error.message)
        }
        //console.log(data);
      }else if(data.meta.code==404){
        App.Failed_Content=data.meta.error_message;
        $('#failed').click();
      }else{
        App.Failed_Alert="Oops!";
        App.Failed_Content=data.meta.error_message;
        $('#failed').click();
      }
    });
    post.error(function(data){
      console.log(data)
      App.Failed_Alert="Oops!";
      if(data.statusText!=""){
        App.Failed_Content=data.statusText;
      }else if(data.responseText!=""){
        App.Failed_Content=data.responseText;
      }else{
        App.Failed_Content="Network Problem"
      }
      $('#failed').click();
    });
  }else{
    location.href='#/login';
  }   
}

function logout_moco(){
  //window.localStorage.clear();
  window.localStorage.removeItem('collection');
  window.localStorage.removeItem('balance');
  window.localStorage.removeItem('id');
  window.localStorage.removeItem('back');
  window.localStorage.removeItem('fb_set');
  window.localStorage.removeItem('fb_token');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('collection_title');
  window.localStorage.removeItem('profile');
  window.localStorage.removeItem('_read');
  window.localStorage.removeItem('_featured');
  window.localStorage.removeItem('_pustaka');
  window.localStorage.removeItem('_current');
  window.localStorage.removeItem('_wishlist');
  window.localStorage.removeItem('_history');
  window.localStorage.removeItem('_feed');
  window.localStorage.removeItem('_notes');
  window.localStorage.removeItem('_purchase');
  window.localStorage.removeItem('_notif');
  window.localStorage.removeItem('_message');
  window.localStorage.removeItem('_followers');
  window.localStorage.removeItem('_followings');
  window.localStorage.removeItem('_recommended');
  window.localStorage.removeItem('_popular');
  window.localStorage.removeItem('_recent');
  window.localStorage.removeItem('_login');
  window.localStorage.removeItem('_rnotes');
  window.localStorage.removeItem('_books_genre');
  window.localStorage.removeItem('_pustaka_genre');
  window.localStorage.setItem('con_yahoo',0);
  window.localStorage.setItem('con_google',0);
  window.localStorage.setItem('con_facebook',0);
  window.localStorage.setItem('con_twitter',0);

  // fs.fileRemove(homePath+'/.iNgawi/https_www.facebook.com_0.localstorage')
  clear_data(); 
  // window.location.replace('#/main/store/recommended');
  $('.side-menu').removeClass('side-open').addClass('side-close')
}
function clear_data(){
  $('.side-menu').removeClass('side-open');
  $('.identity button').html('Masuk');
  $('.identity').attr('onclick',"location.href='#/login'")
  $('.photoCircle').attr('src','img/main/avatar.png');
  $('#name').html('User');
  $('#following').html('0');
  $('#follower').html('0');
  $('#about').html('');
  $('#open_profile').hide();
  $('#password').hide();
  $('#logout').hide();
  $('.pre').hide();
  $('#purchase').html('');
}

function review(type,cat,id){
  //var controller = App.CommentsController.create();
  //controller.send('review','book',id)
  var access_token = localStorage.getItem('token')
  var before='';
  $('#empty').hide();
  var content = $("#reviews-input").val()
  var dataComment = document.getElementById('reviews-input'); 
  if (dataComment.value){
    if(type=="Comment"){
    //var content = $("#reviews-input").val()
    if(cat=="Review"){
      var width = 'width:205px' 
    }else{
      var width = ''
    }
    var Profile = ReadData('profile').data.User
    var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="commentnew" style="'+width+'">\
        <div class="head">\
          <span><a href="#/main/user/'+Profile.id+'"><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></a></span>\
          <span class="blue">'+Profile.name+'</span>\
          <span class="f10 b">now</span>\
        </div>\
        <div class="content m-right">\
          <span>'+content+'</span>\
        </div>\
        <div class="tail" style="margin-top:0;border-color:transparent">\
          <span><i class="moco-like grey"></i> 0 menyukai</span>\
          <span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
        </div>\
      </div>\
      <div class="divider"></div>'
    $('#review').prepend(word);
    var comment = new majax_secure('comments/add',{'access_token':access_token,'key':id,'type':cat,'comment':$("#reviews-input").val()},before);
    comment.success(function(data){
      if(data.meta.code == 200){
        $("#reviews-input").val("");
      }
      else{
      }
    });
    }else if(cat=="Book"){
      //var content = $("#reviews-input").val()
      var Profile = ReadData('profile').data.User
      var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="reviewnew">\
      <div class="head">\
        <span><a href="#/main/user/'+Profile.id+'"><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></a></span>\
        <span class="blue up">'+Profile.name+'</span>\
        <span class="f10 b up">now</span>\
      </div>\
      <div class="content m-right">\
        <span>'+content+'</span>\
      </div>\
      <div class="tail">\
        <span><i class="moco-like grey"></i> 0 menyukai.</span>\
        <span> Comment</span>\
        <span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
      </div>\
          </div>\
          <div class="divider"></div>'
        $('#review').prepend(word);
      var comment = new majax_secure('reviews/add',{'access_token':access_token,'key':id,'type':cat,'content':$("#reviews-input").val()},before);
      comment.success(function(data){
        if(data.meta.code == 200){
          $("#reviews-input").val("");
        }
        else{
        }
      });
    }else{
      //var content = $("#reviews-input").val()
      var Profile = ReadData('profile').data.User
      console.log(cat)
      if(cat=="Review"){
        var width = 'width:205px' 
      }else{
        var width = ''
      }
      var word ='<div class="comment wow fadeInDown"  data-wow-duration="2s" id="commentnew" style="'+width+'">\
              <div class="head">\
                <span><img class="avaMiniCircle" src="'+Profile.avatar+'"></span>\
                <span class="blue up">'+Profile.name+'</span>\
                <span class="f10 b up">now</span>\
              </div>\
              <div class="content m-left">\
                <span>'+content+'</span>\
              </div>\
              <div class="tail">\
                <span><i class="moco-like grey"></i> 0 menyukai</span>\
                <span><i class="moco-flag grey"></i> Laporkan</span>\
              </div>\
            </div>'
      $('#review'+id).append(word);
      var comment = new majax_secure('comments/add',{'access_token':access_token,'key':id,'type':cat,'comment':content},before);
      comment.success(function(data){
        if(data.meta.code == 200){
          $("#reviews-input").val("");
        }
        else{
        }
      });
    }
  }
  else{   }
  /*if(type=="Comment"){
    //var content = $("#reviews-input").val()
    if(cat=="Review"){
      var width = 'width:205px' 
    }else{
      var width = ''
    }
    var Profile = ReadData('profile').data.User
    var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="commentnew" style="'+width+'">\
        <div class="head">\
          <span><a href="#/main/user/'+Profile.id+'"><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></a></span>\
          <span class="blue">'+Profile.name+'</span>\
          <span class="f10 b">now</span>\
        </div>\
        <div class="content m-right">\
          <span>'+content+'</span>\
        </div>\
        <div class="tail" style="margin-top:0;border-color:transparent">\
          <span><i class="moco-like grey"></i> 0 menyukai</span>\
          <span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
        </div>\
      </div>\
      <div class="divider"></div>'
    $('#review').prepend(word);
    var comment = new majax_secure('comments/add',{'access_token':access_token,'key':id,'type':cat,'comment':$("#reviews-input").val()},before);
    comment.success(function(data){
      if(data.meta.code == 200){
        $("#reviews-input").val("");
      }
      else{
      }
    });
  }else if(cat=="Book"){
    //var content = $("#reviews-input").val()
    var Profile = ReadData('profile').data.User
    var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="reviewnew">\
    <div class="head">\
      <span><a href="#/main/user/'+Profile.id+'"><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></a></span>\
      <span class="blue up">'+Profile.name+'</span>\
      <span class="f10 b up">now</span>\
    </div>\
    <div class="content m-right">\
      <span>'+content+'</span>\
    </div>\
    <div class="tail">\
      <span><i class="moco-like grey"></i> 0 menyukai.</span>\
      <span> Comment</span>\
      <span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
    </div>\
        </div>\
        <div class="divider"></div>'
      $('#review').prepend(word);
    var comment = new majax_secure('reviews/add',{'access_token':access_token,'key':id,'type':cat,'content':$("#reviews-input").val()},before);
    comment.success(function(data){
      if(data.meta.code == 200){
        $("#reviews-input").val("");
      }
      else{
      }
    });
  }else{
    //var content = $("#reviews-input").val()
    var Profile = ReadData('profile').data.User
    console.log(cat)
    if(cat=="Review"){
      var width = 'width:205px' 
    }else{
      var width = ''
    }
    var word ='<div class="comment wow fadeInDown"  data-wow-duration="2s" id="commentnew" style="'+width+'">\
            <div class="head">\
              <span><img class="avaMiniCircle" src="'+Profile.avatar+'"></span>\
              <span class="blue up">'+Profile.name+'</span>\
              <span class="f10 b up">now</span>\
            </div>\
            <div class="content m-left">\
              <span>'+content+'</span>\
            </div>\
            <div class="tail">\
              <span><i class="moco-like grey"></i> 0 menyukai</span>\
              <span><i class="moco-flag grey"></i> Laporkan</span>\
            </div>\
          </div>'
    $('#review'+id).append(word);
    var comment = new majax_secure('comments/add',{'access_token':access_token,'key':id,'type':cat,'comment':content},before);
    comment.success(function(data){
      if(data.meta.code == 200){
        $("#reviews-input").val("");
      }
      else{
      }
    });
  }*/
}
function make_rate(count, id) {
  var token=window.localStorage.getItem('token');
  if(token){
    var rate = new majax_secure("ratings/add",{'access_token':token,'type':'Book','key':id,'star_rating':count},'');
    rate.success(function(data){
      console.log(data)
      if(data.meta.code==200){
        App.Success_Alert ="Success"
        App.Success_Content = data.data;
        $('#success').click();

      }else{
        //controller.send('book',id)
        App.Failed_Alert ="Failed"
        App.Failed_Content = data.meta.error_message;
        $('#failed').click();
      }
      get_rate(id);
    });
  }else{
    App.Failed_Alert ="Failed"
    App.Failed_Content = "Kamu harus Login untuk melakukan rating"
    $('#failed').click();
  }
}
function get_rate(id) {
  var html="";
  var token=window.localStorage.getItem('token');
  var rate = new majax("ratings/get_rate",{'access_token':token,'type':'Book','key':id},'');
  rate.success(function(data){
    if(data.meta.code==200){
      var ratecount = 5 - data.data;
      $('#rating_star').html("");
      html+='<span class="name_rate" style="display:none">Rating</span>'
      html+='<div class="basic" data-average="'+data.data+'" data-id="1" style="background-color:#ddd;left:62px;"></div>';
      html+='<span id="rate" style="display:none">'+data.data+'</span>'
      $('#rating_star').html(html);
      setTimeout(function(){
        $('.basic').jRating({
          length : 5,
          decimalLength : 0,
          onClick : function(element,rate) {
           make_rate("'"+rate+"'","'"+id+"'");
          }
        });
      },500);
    }
  });
}

function stack_scroll(id,scroll,data){
  $(document).ready(function() {
    var s = $(id);
    var pos = s.position();   
    var t = $(id).offset().top-167;
    console.log(t)                 
    $(scroll).scroll(function() {
        var windowpos = $(scroll).scrollTop();
        console.log(windowpos)
        if(data){
          if (windowpos >= t) {
              s.addClass("stick1");
          } else {
              s.removeClass("stick1"); 
          }
        }else{
          if (windowpos >= pos.top) {
              s.addClass("stick");
          } else {
              s.removeClass("stick"); 
          }
        }
    });
  });
}

function notif_read(id){
    // $('#status_'+id).css('visibility','hidden');
  var token = window.localStorage.getItem('token');
  $("#notif_"+id).css('background-color','#fafafa')
  var req_data = {'access_token':token,'notification_ids':'['+id+']'};
  var action = new majax_secure('notifications/mark_read',req_data);
  action.error(function(data) {
    //alert('Network Problem');  
    $("#notif_"+id).css('background-color','#fff')
  }),
  action.success(function(data){
    if (data.meta.code==200){
        //general_follow();
          //comments_detail(id_book);
      $("#notif_"+id).css('background-color','#f7f7f7')
    }else{
      $("#notif_"+id).css('background-color','#fff')
    }
  });
}

function msg_read(id){
  var token = window.localStorage.getItem('token');
  var req_data = {'access_token':token,'message_ids':'['+id+']'};
  var action = new majax_post('messages/mark_read',req_data);
  $("#chat_"+id).css('background-color','#fff')
  action.error(function(data) {
      //alert('Network Problem');  
    $("#chat_"+id).css('background-color','#fff')
  }),
  action.success(function(data){
    if (data.meta.code==200){
        //general_follow();
          //comments_detail(id_book);
      $("#chat_"+id).css('background-color','#f7f7f7')
    }else{
      $("#chat_"+id).css('background-color','#fff')
    }
  });
}

function notif_act(id,type,key){
  notif_read(id)
  if(type=="Book"){
    location.href="#/main/book/"+key
  }else if(type=="User"){
    location.href="#/main/user/"+key
  }else if(type=="Author"){
    location.href="#/main/author/"+key
  }else if(type=="Library"){
    location.href="#/main/epustaka/"+key
  }else if(type=='Feeds'){
    $('#com-feeds').click();
    det_feeds(id)
  }else{
    location.href="#/main/book/"+key
  }
}

function share(type,id,link,name,cover,address,total){
  $('#btn-share').click();
  console.log(type)
  if(type=="Synopsis"){
    name = limitCharacter(jQuery(App.book_synopsis).html().trim().replace(/(\r\n|\n|\r)/g,"").replace(/'/g,'').replace(/"/g,'').replace(/[-\/\^\*;:{}=\-_`~]/g,''),300);
  }
  setTimeout(function(){
    if(id){
      if(type=="Library"){
        $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link+'&picture='+cover+'&name='+name+'&description= '+name+' ePustaka @iNgawi, ada '+total+' koleksi boleh dipinjam... &redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
        $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+link+'")');
        $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+link+'")');
        $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+name+'%20%0A'+total+' books '+address+'%20%0A'+link+'%20%0Avia iNgawi desktop")');
        $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+link+'")');
      }else if(type=="Book"){
        $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link+'&picture='+cover+'&name='+name+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
        $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+link+'")');
        $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+link+'")');
        $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+name+'%20%0A'+link+'%20%0Avia iNgawi desktop")');
        $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+link+'")');
      }else if(type=="Notes"){
        $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link+'&name='+name+'&description= '+cover+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
        $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+link+'")');
        $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+link+'")');
        $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+name+'%20%0A'+link+'%20%0Avia iNgawi desktop")');
        $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+link+'")');
      }else if(type=="Synopsis"){
        console.log('hallo')
        $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link+'&picture='+cover+'&name='+name+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
        $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+link+'")');
        $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+link+'")');
        $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+name+'%20%0A'+link+'%20%0Avia iNgawi desktop")');
        $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+link+'")');
      }
    }
  })
}

function legal(data){
  if(data=="tos"){
    $('#btn-tos').click()
    $('#act_tos').hide()
    $('#act_close').removeAttr('data-ember-action').attr('onclick','javascript:$(\'#btn-close\').click()')
  }else if(data=="faq"){
    gui.Shell.openExternal(App.faq.id.ingawi)
  }else if(data=="howto"){
    gui.Shell.openExternal(App.howto.id.ingawi)
  }
}