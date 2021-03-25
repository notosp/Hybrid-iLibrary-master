App.FollowController = Ember.ArrayController.extend({
  actions:{
    follower:function(type,id,fungsi){
      var token = localStorage.getItem('token')
      console.log(fungsi)
      var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
      if(type=='author'){
        var check = new majax_fast('authors/follower',{'access_token':token,'client_id':App.api.client_id,'author_id':id,'per_page':20},before,600000);
      }else if(type=='user'){
        var check = new majax_fast('profile/follower',{'access_token':token,'client_id':App.api.client_id,'user_id':id,'per_page':20},before,600000);
      }else{
        var check = new majax_fast('libraries/follower',{'access_token':token,'client_id':App.api.client_id,'library_id':id,'per_page':20},before,600000);
      }
      check.error(function(data) {
        $('#list_user').html('<center>Data Not Found</center>');
      })
      check.success(function(data){
        if(data.meta.code==200){
          $('#list_user').attr('data-index',2);
          var controller=App.FollowController.create();
          controller.send('parse_follow',data,type,fungsi)
          if(data.data.total_result>20){
            $('#btn-loadmore_follow').attr('onclick','morefollow(\'follower\',\''+type+'\',\''+id+'\')');
          }else{
            $('#btn-loadmore_follow').hide();
          }
        }else{
          book=data.meta.error_message;
          $('#list_user').html('<center>'+book+'</center>');
          $('#btn-loadmore_follow').hide()
        }
      })
    },
    check_follow:function(type,id){
      var token = window.localStorage.getItem('token');
      var action = new majax('user_followings/has_follow',{'access_token':token,'recipient_type':type,'recipient_key':id},'');
      action.success(function(data){
          var status=data.data;
          console.log(status);
            if (status=='true'){
                if(token){
                  $('#btn-actfollow').attr('onclick','act_unfollow(\''+id+'\',\''+type+'\')');
                  //$("#follow_check").addClass('icon mc-check');
                  $("#follow_acttext").html('Following').addClass('white').removeClass('blue');
                  $("#follow_icn").removeClass('moco-plus').addClass('moco-check').addClass('white').removeClass('blue');
                  //$("#follow_text").css('padding-left','10px');
                  $('#btn-actfollow').css('background-color','#4D4B8C');
                  //$("#btn-follow").css('color','#fff');  
                }else{
                  $('#btn-actfollow').attr('onclick',"location.href='#/login'")
                }
            }else{
              if(token){
                $('#btn-actfollow').attr('onclick','act_follow(\''+id+'\',\''+type+'\')');
                //alert("salah brow");
              }else{
                $('#btn-actfollow').attr('onclick',"location.href='#/login'")
              }
            }
        });
    },
    more_follower:function(type,id,fungsi){
      var token = localStorage.getItem('token')
      var index = $('#list_user').attr('data-index')
      var before="";
      if(type=='author'){
        var check = new majax_fast('authors/follower',{'access_token':token,'client_id':App.api.client_id,'author_id':id,'per_page':20,'page':index},before,600000);
      }else if(type=='user'){
        var check = new majax_fast('profile/follower',{'access_token':token,'client_id':App.api.client_id,'user_id':id,'per_page':20,'page':index},before,600000);
      }else{
        var check = new majax_fast('libraries/follower',{'access_token':token,'client_id':App.api.client_id,'library_id':id,'per_page':20,'page':index},before,600000);
      }
      check.error(function(data) {

      })
      check.success(function(data){
        if(data.meta.code==200){
          $('#list_user').attr('data-index',parseInt(index)+1);
          var controller=App.FollowController.create();
          controller.send('parse_follow',data,type,fungsi,1)
          if(data.data.total_result<20){
            $('#btn-loadmore_follow').hide()
          }
        }else{
          book=data.meta.error_message;
          $('#btn-loadmore_follow').hide()
        }
      })
    },
    following:function(type,id,fungsi){
      var token = localStorage.getItem('token')
      var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
      if(type=='author'){
        var check = new majax_fast('authors/following',{'access_token':token,'client_id':App.api.client_id,'author_id':id,'per_page':20},before,600000);
      }else if(type=='user'){
        var check = new majax_fast('profile/following',{'access_token':token,'client_id':App.api.client_id,'user_id':id,'per_page':20},before,600000);
      }else{
        var check = new majax_fast('libraries/following',{'access_token':token,'client_id':App.api.client_id,'library_id':id,'per_page':20},before,600000);
      }
      check.error(function(data) {
        $('#list_user').html('<center>Data Not Found</center>');
      })
      check.success(function(data){
        if(data.meta.code==200){
          $('#list_user').attr('data-index',2);
          var controller=App.FollowController.create();
          controller.send('parse_follow',data,type,fungsi)
          if(data.data.total_result>20){
            $('#btn-loadmore_follow').attr('onclick','morefollow(\'following\',\''+type+'\',\''+id+'\',\''+fungsi+'\')');
          }else{
            $('#btn-loadmore_follow').hide()
          }
        }else{
          book=data.meta.error_message;
          $('#list_user').html('<center>'+book+'</center>');
          $('#btn-loadmore_follow').hide()
        }
      })
    },
    more_following:function(type,id,fungsi){
      var token = localStorage.getItem('token')
      var index = $('#list_user').attr('data-index')
      var before="";
      if(type=='author'){
        var check = new majax_fast('authors/following',{'access_token':token,'client_id':App.api.client_id,'author_id':id,'per_page':20,'page':index},before,600000);
      }else if(type=='user'){
        var check = new majax_fast('profile/following',{'access_token':token,'client_id':App.api.client_id,'user_id':id,'per_page':20,'page':index},before,600000);
      }else{
        var check = new majax_fast('libraries/following',{'access_token':token,'client_id':App.api.client_id,'library_id':id,'per_page':20,'page':index},before,600000);
      }
      check.error(function(data) {

      })
      check.success(function(data){
        if(data.meta.code==200){
          $('#list_user').attr('data-index',parseInt(index)+1);
          var controller=App.FollowController.create();
          controller.send('parse_follow',data,type,fungsi,1)
          if(data.data.total_result<20){
            $('#btn-loadmore_follow').hide()
          }
        }else{
          book=data.meta.error_message;
          $('#btn-loadmore_follow').hide()
        }
      })
    },
    parse_follow:function(data,type,fungsi,index){
      var word='';
      $.each(data.data.data,function(){
        //console.log(this)
        word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #fafafa;padding-top:10px;padding-bottom:5px;">\
        <div class="col-md-2 col-xs-2" style="padding:0;width:30px;">\
          <a href="#/main/user/'+this.id+'"><img class="avaMiddleCircle" src="'+this.avatar+'" onerror="AvaError(this)"></a>\
        </div>\
        <div class="col-md-7 col-xs-7" style="line-height:1.2;margin-right:23px">\
          <div class="blue">'+this.name+'</div>\
          <div class="grey f12">'+this.address+'</div>\
        </div>';
        if(fungsi=="recommend"){
          word+='<div class="col-md-3 col-xs-3" style="padding-left:40px;">\
            <button class="radius b-trans b_grey grey" onclick="user_push('+this.id+',\''+this.name+'\')" id="btn-rec'+this.id+'" style="padding:3px 15px;border-radius:4px;"><i id="icn-rec'+this.id+'"  class="fa moco-plus moco-x7 f14"></i></button>\
          </div></div>'
        // }else if(fungsi=="my"){
        }else if(fungsi=="gift"){
          word+='<div class="col-md-3 col-xs-3" style="padding-left:40px;">\
            <button class="radius b-trans b_grey grey" onclick="user_push1('+this.id+',\''+this.name+'\')" id="btn-rec'+this.id+'" style="padding:3px 15px;border-radius:4px;"><i id="icn-rec'+this.id+'"  class="fa moco-plus moco-x7 f14"></i></button>\
          </div></div>'
        // }else if(fungsi=="my"){
        }else if(fungsi=="mysdsadasdasdada"){
          word+='<div class="col-md-3 col-xs-3" style="display:none;">\
            <button class="radius b-trans b_grey grey" style="padding:5px 20px"><i class="fa fa-plus f14"></i></button>\
          </div></div>'
        }else{
          if(this.status_follow=="false"){
            var act = '<button class="radius b-trans b_grey grey" id="btn-follow'+this.id+'" onclick="act_follow(\''+this.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+this.id+'" class="fa  moco-x7 moco-plus f14"></i></button>'
          }else{
            var act = '<button class="radius b-blue b_blue" id="btn-unfollow'+this.id+'" onclick="act_unfollow(\''+this.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+this.id+'" class="fa moco-x7 moco-check white f14"></i></button>'
          }
          word+='<div class="col-md-3 col-xs-3" style="padding-left:40px;">'+act+'</div></div>'
        }
        //word+='<div class="divider"></div>'
      })
      //console.log(index)
      //console.log(word)
      if(index){
        $('#list_user').append(word);
      }else{
        $('#list_user').html(word);
      }
    }
  }
})

function act_follow(id,type){
  var token = localStorage.getItem('token')
  if(token){
    $("#follow_acttext").html('Following');
    $("#follow_icn").removeClass('moco-plus').addClass('moco-check');
    $('#btn-actfollow').css('background-color','#4D4B8C');
    if(type=="Library"){
      $('#btn-actfollow').attr('onclick','act_unfollow('+id+',\''+type+'\')');
    }
    $('#text-follow'+id).html('Unfollow')
    var token = window.localStorage.getItem('token');
    $('#btn-follow'+id).removeClass('b_grey b-trans grey').addClass('white b-blue b_blue');
    $('#icn-follow'+id).removeClass('moco-plus').addClass('moco-check').removeClass('grey')
    var req_data = {'access_token':token,'recipient_type':type,'recipient_key':id};
    $('#btn-'+id).attr('onclick','act_unfollow('+id+',\''+type+'\')');
    var action = new majax_secure('user_followings/follow',req_data);
    if(type=="Library"||type=="Author"||type=="User"){
      $('#follow_acttext').html('Following')
    }
    if(type=="User"){
      $('#btn-actfollow').attr('onclick','act_unfollow(\''+id+'\',\''+type+'\')');
      //$("#follow_check").addClass('icon mc-check');
      $("#follow_acttext").html('Following').addClass('white').removeClass('blue');
      $("#follow_icn").removeClass('moco-plus').addClass('moco-check').addClass('white').removeClass('blue');
      //$("#follow_text").css('padding-left','10px');
      $('#btn-actfollow').css('background-color','#4D4B8C');
    }
    action.error(function(data) {
      $("#follow_acttext").html('Follow');
      $("#follow_icn").addClass('moco-plus').removeClass('moco-check');
      // $('#btn-actfollow').css('background-color','transparent');

      $('#btn-follow'+id).addClass('b_grey b-trans grey').removeClass('white b-blue b_blue');
      $('#icn-follow'+id).addClass('moco-plus').removeClass('moco-check').addClass('grey')
      $('#btn-follow'+id).attr('onclick','act_follow('+id+',\''+type+'\')');
      $('#text-follow'+id).html('Follow');
      if(type=="Library"||type=="Author"||type=="User"){
        $('#follow_acttext').html('Follow')
      }
    }),
    action.success(function(data){
      console.log(data)
        if (data.meta.code==200){
            //comments_detail(id_book);
            console.log('sukses follow '+type+' '+id)
        }else{
          if(isArray(data.meta.error_message)){
            console.log('array');
            var text = ''
            $.each(data.meta.error_message,function(item,object){
              text +=object+' ';
            })
            App.Failed_Alert ="Gagal"
            App.Failed_Content = text;
            $('#failed').click();
            // alert(text)
          }else{
            // alert(data.meta.error_message)
            App.Failed_Alert ="Gagal"
            App.Failed_Content = data.meta.error_message;
            $('#failed').click();
          }
          $("#follow_acttext").html('Follow');
          $("#follow_icn").addClass('moco-plus').removeClass('moco-check');
          // $('#btn-actfollow').css('background-color','transparent');

          $('#btn-follow'+id).attr('onclick','act_follow('+id+',\''+type+'\')');
          $('#btn-follow'+id).addClass('b_grey b-trans grey').removeClass('white b-blue b_blue');
          $('#icn-follow'+id).addClass('moco-plus').removeClass('moco-check').addClass('grey')
          $('#text-follow'+id).html('Follow');
          if(type=="Library"||type=="Author"||type=="User"){
            $('#follow_acttext').html('Follow')
          }
        }
    });
  }else{
    $('#btn-follow'+id).attr('onclick',"location.href='#/login'");
  }
}

function act_unfollow(id,type){
  $("#follow_acttext").html('Follow');
  $("#follow_icn").addClass('moco-plus').removeClass('moco-check');
  // $('#btn-actfollow').css('background-color','transparent');
  if(type=="Library" || type =="User"){
    $('#btn-actfollow').attr('onclick','act_follow('+id+',\''+type+'\')');
  }
  $('#text-follow'+id).html('Follow')
  var token = window.localStorage.getItem('token');
  $('#btn-follow'+id).addClass('b_grey b-trans grey').removeClass('white b-blue b_blue');
  $('#icn-follow'+id).addClass('moco-plus').removeClass('moco-check').addClass('grey')
  $('#btn-follow'+id).attr('onclick','act_follow('+id+',\''+type+'\')');
  if(type=="Library"||type=="Author"||type=="User"){
    $('#follow_acttext').html('Follow')
  }
  var req_data = {'access_token':token,'recipient_type':type,'recipient_key':id};
  var action = new majax_secure('user_followings/unfollow',req_data);
  action.error(function(data) {
    $("#follow_acttext").html('Following');
    $("#follow_icn").removeClass('moco-plus').addClass('moco-check');
    $('#btn-actfollow').css('background-color','#4D4B8C');

    $('#btn-follow'+id).removeClass('b_grey b-trans grey').addClass('white b-blue b_blue');
    $('#icn-follow'+id).removeClass('moco-plus').addClass('moco-check').removeClass('grey')
    $('#btn-'+id).attr('onclick','act_follow('+id+',\''+type+'\')');
    $('#text-follow'+id).html('Unfollow');
    if(type=="Library"||type=="Author"||type=="User"){
      $('#follow_acttext').html('Following')
    }
  }),
  action.success(function(data){
    console.log(data)
      if (data.meta.code==200){
        console.log('sukses unfollow '+type+' '+id)
          //comments_detail(id_book);
      }else{
        if(isArray(data.meta.error_message)){
          console.log('array');
          var text = ''
          $.each(data.meta.error_message,function(item,object){
            text +=object+' ';
          })
          App.Failed_Alert ="Gagal"
          App.Failed_Content = text;
          $('#failed').click();
          // alert(text)
        }else{
          App.Failed_Alert ="Gagal"
          App.Failed_Content = data.meta.error_message;
          $('#failed').click();
          // alert(data.meta.error_message)
        }
        $("#follow_acttext").html('Following');
        $("#follow_icn").removeClass('moco-plus').addClass('moco-check');
        $('#btn-actfollow').css('background-color','#4D4B8C');

        $('#btn-'+id).attr('onclick','act_unfollow('+id+',\''+type+'\')');
        $('#btn-follow'+id).removeClass('b_grey b-trans grey').addClass('white b-blue b_blue');
        $('#icn-follow'+id).removeClass('moco-plus').addClass('moco-check').removeClass('grey')
        $('#text-follow'+id).html('Unfollow')
        if(type=="Library"||type=="Author"||type=="User"){
          $('#follow_acttext').html('Following')
        }
      }
  });
}

var rec_user=[];
var rec_user_name=[];

function show_list_user(){
  var html="";
  var data = rec_user_name;
  var n = data.length;
  console.log(n)
  for(i=0;i<n;i++){
    if(n<=5){
      if(n>1){
        if(i==(n-1)){
          html+=" and ";
        }
        html+=data[i];
        if(i<(n-2)){
          html+=", ";
        }
      }else{
        html+=data[i];
      }
    }else{
      if(i<=4){
        html+=data[i];
        html+=", ";
      }
      if(i==5){
        html+="and "+(n-5)+" others";
      }
    }
  }
  $('#list_user').html(html)
}

function user_push(id,name){
  $('#btn-rec'+id).removeClass('b_grey b-trans grey').addClass('white b-blue b_blue');
  $('#icn-rec'+id).removeClass('moco-plus').addClass('moco-check').removeClass('grey')
  $('#btn-rec'+id).attr('onclick','user_pop('+id+',\''+name+'\')');
  rec_user.push(id);
  rec_user_name.push(name);
}

function user_push1(id,name){
  rec_user.push(id);
  rec_user_name.push(name);
  topup('gift')
}

function user_pop(id,name){
  $('#btn-rec'+id).addClass('b_grey b-trans grey').removeClass('white b-blue b_blue');
  $('#icn-rec'+id).addClass('moco-plus').removeClass('moco-check').addClass('grey')
  $('#btn-rec'+id).attr('onclick','user_push('+id+',\''+name+'\')');
  rec_user_name.remove(name);
  rec_user.remove(id);
  rec_user.clean(undefined);
  rec_user_name.clean(undefined);
}

function go_rec_user(){
  $('#btn-rec_user').click();
  show_list_user();
}

function recommend_books(){
  var token = window.localStorage.getItem('token');
  var before = $('#moco-load3').addClass('fa moco-load fa-large fa-spin');
  before+=$('.btn').attr('disabled','disabled');
  if(rec_user!=undefined && rec_user.length > 0){
    if($('#msg_rec').val()!=""){
      var req_data = {'access_token':token,'recipient_type':'User','recipient_ids':'['+rec_user+']','object_type':'Book','object_key':books_id,'message':$('#msg_rec').val()};
    }else{
      var req_data = {'access_token':token,'recipient_type':'User','recipient_ids':'['+rec_user+']','object_type':'Book','object_key':books_id};
    }
    var action = new majax_secure('books/recommend',req_data,before);
    action.error(function(data) {
        // alert('Network Problem');
        $('#moco-load3').removeClass('fa moco-load fa-large fa-spin')
        $('.btn').removeAttr('disabled')
    }),
    action.success(function(data){
        $('#moco-load3').removeClass('fa moco-load fa-large fa-spin')
        $('.btn').removeAttr('disabled')
        if (data.meta.code==200){
          // Moco.content=data.data;
          App.Success_Alert ="Success"
          App.Success_Content = data.meta.confirm;
          $('#success').click();
          //alert(data.data);
        }else{
          App.Failed_Alert ="failed to recommend a books"
          App.Failed_Content = data.meta.error_message;
          $('#failed').click();
        }
    });
  }else{
    alert('No user selected')
  }
}

function morefollow(key,type,id){
  if(key=="follower"){
    var controller = App.FollowController.create();
    controller.send('more_follower',type,id);
  }else if(key=="following"){
    var controller = App.FollowController.create();
    controller.send('more_following',type,id);
  }
}
