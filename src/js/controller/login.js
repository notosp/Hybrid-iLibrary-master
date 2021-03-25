App.ModalController = Ember.ObjectController.extend({
  actions: {
  }
});
App.LoginController = Ember.ObjectController.extend({
  init:function(){
    document.title="Login";
  },
  actions: {
    fb: function(){
      ga_action('User','Login','Facebook');
      fb_token = localStorage.getItem('fb_token')
      var controller = App.FacebookController.create();
      if(fb_token){
        controller.send('get_fb');
      }else{
        controller.send('fb_oauth');
      }
      // alert('will be available soon')
    },
    twitter: function(){
      ga_action('User','Login','Twitter');
      console.log('get FB akun');
      setTimeout(function(){
        $('#loading').click();
        setTimeout(function(){
          $('#loading_text').html("Connect with Twitter");
          var check = new majax_fast('login/twitter','','');
          console.log(check)
          check.error(function(e) {
            console.log(e)
            // if(e.responseJSON.meta.code==302){
            //       location.href=e.responseJSON.data.oauth_request_auth_url;
            //   }
          }),
          check.success(function(data){
            console.log(data);
            if(data.meta.code==302){
              console.log(data.data);
              location.href=data.data.twitter_oauth_request_auth_url;
            }
          });
        },100)
      },500)
    },
    login_email: function(){
      //var link = this;
      login_email()
    },
    login_forgot: function(){
      var email = $('#log_forgot').val();
      user_atch = email.split("@").length;
      if($('#log_forgot').val()==""||$('#log_forgot').val()=="Required"){
        error_handling('#log_forgot',"Required");
      }else{
        // var before = $('#log-load').addClass('moco-load fa-spin');
        var before = "";
        var user = $('#log_forgot').val();
        username_sign = user;
        var data = {'username':user,'client_id':App.api.client_id};
        setTimeout(function(){
          var post = majax_secure('users/forgot_password',data,before);
          post.success(function(data){
            $('#log-load').removeClass('moco-load fa-spin');
            if(data.meta.code == 200){
              App.Success_Alert="Success";
              App.Success_Content=data.data;
              $('#success').click();
            }else{
              App.Failed_Alert="Oops!";
              App.Failed_Content=data.meta.error_message;
              $('#failed').click();
              $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#login_email").click()')
              $('#act_try').css('margin-top','65px');
              $('#icn_failed').html('<i class="moco-alert_o white" style="font-size:40px;"></i>')
            }
          });
          post.error(function(data){
            App.Failed_Alert="Oops!";
            if(data.status){
              App.Failed_Content=data.statusText;
            }else if(data.responseText!=""){
              App.Failed_Content=data.responseText;
            }else if(data.statusText!=""){
              App.Failed_Content=data.statusText
            }else{
              App.Failed_Content="Network Problem"
            }
            $('#failed').click();
            $('#log-load').removeClass('moco-load fa-spin');
            $('#act_try').css('margin-top','65px');
            $('#icn_failed').html('<i class="moco-alert_o white" style="font-size:40px;"></i>')
          });
        },500)
      }
    },
    reg_email:function(){
      var email = $('#reg_email').val();
      user_atch = email.split("@").length;
      signup[0] = $('#reg_name').val();
      signup[1] = $('#reg_email').val();
      signup[2] = $('#reg_pass').val();
      signup[3] = $('#reg_pass2').val();
      signup[4] = $('#reg_phone').val();
      if($('#reg_email').val()==""||$('#reg_name').val()==""||$('#reg_name').val()=="Required"||$('#reg_email').val()=="Required"){
        if($('#reg_email').val()==""||$('#reg_email').val()=="Required"){
          error_handling('#reg_email',"Required");
        }
        if($('#reg_name').val()==""||$('#reg_name').val()=="Required"){
          error_handling('#reg_name',"Required");
        }
      }else{
        $('#tos').click();
      }
    },
    register:function(){
      // var before = $('#log-load').addClass('moco-load fa-spin');
      signup_email();
    },
    reg_twit:function(){
      var email = $('#reg_email').val();
      user_atch = email.split("@").length;
      signup[0] = $('#reg_name').val();
      signup[1] = $('#reg_email').val();
      signup[2] = $('#reg_pass').val();
      signup[3] = $('#reg_pass2').val();
      signup[4] = $('#reg_phone').val();
      if($('#reg_email').val()==""||$('#reg_name').val()==""||$('#reg_name').val()=="Required"||$('#reg_email').val()=="Required"){
        if($('#reg_email').val()==""||$('#reg_email').val()=="Required"){
          error_handling('#reg_email',"Required");
        }
        if($('#reg_name').val()==""||$('#reg_name').val()=="Required"){
          error_handling('#reg_name',"Required");
        }
      }else{
        this.send('register_twit')
      }
    },
    register_twit:function(){
      // var before = $('#log-load').addClass('moco-load fa-spin');
      var before ="";
      ga_action('User','Register','Twitter');
      setTimeout(function(){
        var data = {'username':signup[1],'password':signup[2],'confirm_password':signup[3],'name':signup[0],'phone':signup[4],'client_id':App.api.client_id,'client_secret':App.api.client_secret,'device_id':'1'};
        var post = majax_secure('register/twitter',data,before);
        post.success(function(data){
          $('#log-load').removeClass('moco-load fa-spin');
          if(data.meta.code == 200){
            console.log(data);
            token = data.data.access_token;
            window.localStorage.removeItem('token');
            window.localStorage.setItem('token',token);
            App.Success_Alert="Success";
            App.Success_Content=data.meta.confirm;
            $('#success').click();
            setTimeout(function(){
              // link.transitionTo('main')
              location.href='#/main/home';
            },700);
          }else if(data.meta.code==404){
            App.Failed_Content=data.meta.error_message;
            $('#no-user').click();
          }else{
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message;
            $('#failed').click();
          }
        });
        post.error(function(data){
          App.Failed_Alert="Oops!";
          if(data.status){
            App.Failed_Content=data.statusText;
          }else if(data.responseText!=""){
            App.Failed_Content=data.responseText;
          }else if(data.statusText!=""){
            App.Failed_Content=data.statusText
          }else{
            App.Failed_Content="Network Problem"
          }
          $('#failed').click();
          $('#log-load').removeClass('moco-load fa-spin');
        });
      },500);
    }
  }
})
App.FacebookController = Ember.ObjectController.extend({
  actions:{
    get_fb:function(){
      console.log('get FB akun');
      setTimeout(function(){
        $('#loading').click();
        setTimeout(function(){
          $('#loading_text').html("Waiting");
          $('#loading_text2').html("to Connect Facebook");
        },100)
      },500)
      var fb_token = localStorage.getItem('fb_token');
      fb=[];
      // var fb_graph='https://graph.facebook.com/v2.0/fql';
      // var req = {'q':'select name,uid,email,pic from user where uid=me()','access_token':fb_token}
      var fb_graph='https://graph.facebook.com/me?&fields=name,email,id,picture';
      var req = {'access_token':fb_token}
      setTimeout(function(){
        var check = new majax_empty(fb_graph,req,'');
        check.success(function(data){
          console.log(data)
          if(data){
            console.log(data)
            var fb_name= data.name;
            var fb_id=data.id;
            var fb_email=data.email;
            if(data.picture.data.url){
              var fb_avatar=data.picture.data.url;
            }else{
              var fb_avatar='';
            }
            fb[0]=fb_name;
            fb[1]=fb_id;
            if(fb_email){
              fb[2]=fb_email
            }else{
              fb[2]=fb_id;
            }
            // fb[2]=fb_email;
            fb[3]=fb_avatar;
            fb[4]=fb_token;

            var fb_set = new Array(fb[0],fb[1],fb[2],fb[3],fb[4]);
            var data =JSON.stringify(fb_set);
            window.localStorage.setItem('fb_set',data);

            setTimeout(function(){
              // var controller = this.controllerFor('facebook');
              var controller = App.FacebookController.create();
              controller.send('check_account')
            },3000); 
          }else{
            window.localStorage.removeItem('fb_set');
            var controller = App.FacebookController.create();
            controller.send('fb_oauth')
          }
        });
        check.error(function(data){
          window.localStorage.removeItem('fb_token');
          var controller = App.FacebookController.create();
          controller.send('fb_oauth')
        });
      },500);
    },
    fb_oauth:function(){
      // App = Ember.Application.create();
      window.localStorage.removeItem('fb_token');
      App.loading = "Connecting to Facebook";
      // $('#loading').click();
      // top.location = 'https://graph.facebook.com/oauth/authorize?client_id=1389978131265139&scope=publish_stream,email,offline_access&redirect_uri=http://eyeyunianto.github.io/fb_hybrid/';
      // top.location = 'https://graph.facebook.com/oauth/authorize?client_id='+App.fb_id+'&scope=publish_stream,email,offline_access&redirect_uri=http://eyeyunianto.github.io/fb_ijak/';
      
      // $('#load_iframe').show().css('z-index','2');
      var facebook_id = App.fb_id;
      var app_url = 'https://ijakarta.id/fb/';

      facebookLogin(facebook_id, app_url, function(res){
        console.log(res);
        if(res.access_token){
          console.log('facebook')
          localStorage.setItem('fb_token',res.access_token);
          var controller = App.FacebookController.create();
          controller.send('get_fb');
        }
      });

      // $('#load_iframe').attr('src','https://graph.facebook.com/oauth/authorize?client_id='+App.fb_id+'&scope=publish_stream,email,offline_access&redirect_uri=http://eyeyunianto.github.io/fb_ijak/')
    },
    check_account:function(){
      var check = new majax('users/has_moco_account',{'client_id':App.api.client_id,'username':fb[2]},'');
      check.success(function(data){
      if(data.data=="false"){
        console.log('signup fb')
          setTimeout(function(){
            $('#register').click();
            setTimeout(function(){
              $('#reg_title').html('Connect with Facebook')
              $('#reg_back').removeClass('data-ember-action').attr('onclick','$("#close").click()')
              var fb_=JSON.parse(window.localStorage.getItem('fb_set'));
              $('#reg_name').val(fb[0]);
              var xx = fb[2].split('@')
              if(xx[1]){
                $('#reg_email').val(fb[2]);
                $('#reg_email').css('text-indent','10px').css('padding-left','0').css('padding-right','0').css('background','#f7f7f7');
                $('#reg_email').attr('disabled','disabled');
              }else{
                // $('#reg_email').val('');
              }
              // $('#reg_name').css('display','none');
              // $('#reg_email').css('display','none');
              $('#reg_name').attr('disabled','disabled');
              $('#reg_name').css('text-indent','10px').css('padding-left','0').css('padding-right','0').css('background','#f7f7f7');
              
            },500);
          },500);
      }else{
        var controller = App.FacebookController.create();
        controller.send('fb_sync');
      }
      });
      check.error(function(data){
        var controller = App.FacebookController.create();
        controller.send('fb_oauth');
      })
    },
    fb_sync:function(){
      // $('#loading_text').html("Sync Facebook to Moco");
      var fb_name = fb[0];
      var fb_id = fb[1];
      var fb_email = fb[2];
      var fb_avatar =  fb[3];
      var data = {'client_id':App.api.client_id,'client_secret':App.api.client_secret,'device_id':'1','username':fb_email,'facebook_id':fb_id}
      var check = new majax_secure('users/sync_facebook_with_moco',data,'');
      check.success(function(data){
        if(data.meta.code == 200){
            var token = data.data.access_token;
            window.localStorage.removeItem('token');
            window.localStorage.setItem('token',token);
            // location.href="#/main"
            location.href='#/main/home';
            setTimeout(function(){
              main_profile();
              var controller = App.RealtimeController.create();
              try{
                controller.send('subcribe');
                controller.send('real_feeds');
              }catch(error){
                console.log(error.message)
              }
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
            })
        }else{
          App.Failed_Alert="Oops!";
          App.Failed_Content=data.meta.error_message;
          $('#failed').click();
        }
      });
      check.error(function(data){
        var controller = App.FacebookController.create();
        controller.send('fb_oauth');
      })
    }
  }
})
App.TwitterController = Ember.ObjectController.extend({
  actions:{
    twit_oauth_login:function(data){
      setTimeout(function(){
        $('#loading').click()
        setTimeout(function(){
          $('#loading_text').html("Wait ...");
          $('#loading_text2').html("Connecting Twitter to Moco");
          // $('#loading_text').html("Import Data from Twitter");
        },500);
        console.log(data);
        var req = {'client_id':App.api.client_id,'code':data}
        console.log(req)
        var check = new majax_fast('login/twitter/connect',req,'');
        check.error(function(e) {
          console.log(e)
          // if(e.responseJSON.meta.code==302){
          //       location.href=e.responseJSON.data.oauth_request_auth_url;
          //   }
        }),
        check.success(function(data){
          console.log(data);
          if(data.meta.code==302){
            // $('#medsos').click();
          }
          if(data.meta.code==200){
            var token = data.data.access_token;
            window.localStorage.removeItem('token');
            window.localStorage.setItem('token',token);
            // location.href="#/main"
            $('#open_profile').show();
            $('#password').show();
            $('#logout').show();
            location.href='#/main/home';
          }else if(data.meta.code==302){
            setTimeout(function(){
              $('#reg-twit').click();
            },500)
          }else{
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message;
            $('#failed').click();
          }
        });
        check.error(function(data){
          console.log(data)
        })
      },500);
    }
  }
})

function login_email(){
  ga_action('User','Login','Email');
  var email = $('#log_email').val();
  user_atch = email.split("@").length;
  if($('#log_email').val()==""||$('#log_pass').val()==""||$('#log_pass').val()=="Required"||$('#log_email').val()=="Required"){
    if($('#log_email').val()==""||$('#log_email').val()=="Required"){
      error_handling('#log_email',"Required");
    }
    if($('#log_pass').val()==""||$('#log_pass').val()=="Required"){
      error_handling('#log_pass',"Required");
    }
  }else{
    // var before = $('#log-load').addClass('moco-load fa-spin');
    var before="";
    var user = $('#log_email').val();
    var pass = $('#log_pass').val();
    signup[2] = pass;
    signup[1] = user;
    window.email = user;
    // App.password = pass;
    var data = {'username':user,'password':pass,'client_id':App.api.client_id,'client_secret':App.api.client_secret,'device_id':'1'};
    // this.transitionTo('main')
    setTimeout(function(){
      var post = majax_secure('login',data,before);
      post.success(function(data){
        $('#log-load').removeClass('fa fa-spin moco-load');
        if(data.meta.code == 200){
          console.log(data);
          token = data.data.access_token;
          window.localStorage.removeItem('token');
          window.localStorage.setItem('token',token);
          main_profile();
          $('#open_profile').show();
          $('#password').show();
          $('#logout').show();
          // location.href='#/main/home';
          window.history.go(-1);
        }else if(data.meta.code==0){
          App.Failed_Content=data.meta.error_message;
          $('#no-user').click();
        }else if(data.meta.code==2){
          App.Success_Alert = "Akun belum terverifikasi"
          App.Success_Content = data.meta.error_message;
          $('#btn-dialog').click();
          $('#act_cancel').attr("onclick","javascript:$('#close').click()")
          $('#act_try').attr('onclick','resend_verification()')
          $('#act_try a').html('Kirim Ulang');
          $('#text_conf').css('padding-top','10px')
        }else{
          App.Failed_Alert="Failed";
          App.Failed_Content=data.meta.error_message;
          $('#failed').click();
        }
      });
      /*post.error(function(data){
        App.Failed_Alert="Oops!";
        if(data.statusText!=""){
          App.Failed_Content=data.statusText;
        }else if(data.responseText!=""){
          App.Failed_Content=data.responseText;
        }else{
          App.Failed_Content="Network Problem"
        }
        $('#failed').click();
        $('#log-load').removeClass('fa-spin moco-load');
      });*/
      post.error(function(data){
        App.Failed_Alert="Terjadi Masalah!";
        if(data.statusText!=""){
          App.Failed_Content="Gagal terhubung server, Pastikan koneksi internet anda terhubung dengan baik";
        }else if(data.responseText!=""){
          App.Failed_Content=data.responseText;
        }else{
          App.Failed_Content="Network Problem"
        }
        $('#failed').click();
        $('#log-load').removeClass('fa-spin moco-load');
      });
    },500)
  }
}

function signup_email(){
  var before = ""
  ga_action('User','Register','Email');
  setTimeout(function(){
    try{
      if(fb){
        console.log('signup_fb');
        var data = {'username':signup[1],'password':signup[2],'confirm_password':signup[3],'name':signup[0],'phone':signup[4],'client_id':App.api.client_id,'client_secret':App.api.client_secret,'device_id':'1','facebook_id':fb[1]};
        var post = majax_secure('users/signup_facebook',data,before);
      }
    }catch(err){
      console.log(err.message);
      var data = {'username':signup[1],'password':signup[2],'confirm_password':signup[3],'name':signup[0],'phone':signup[4],'client_id':App.api.client_id,'client_secret':App.api.client_secret,'device_id':'1'};
      var post = majax_secure('register2',data,before);
    }
    post.success(function(data){
      $('#log-load').removeClass('moco-load fa-spin');
      if(data.meta.code == 200){
        
        // console.log(data);
        // token = data.data.access_token;
        // window.localStorage.removeItem('token');
        // window.localStorage.setItem('token',token);
        // $('#open_profile').show();
        // $('#password').show();
        // $('#logout').show();
        // location.href='#/main/home';

        // App.Success_Alert="Success";
        // App.Success_Content=data.data.message;
        // $('#success').click();

        token = data.data.access_token;
        window.localStorage.removeItem('token');
        window.localStorage.setItem('token',token);
        main_profile();
        $('#open_profile').show();
        $('#password').show();
        $('#logout').show();
        App.Success_Alert="Selamat datang di iNgawi";
        App.Success_Content="Nikmati membaca dengan mudah dan menyenangkan dengan iNgawi";
        $('#success').click();
        // $('#act_try').html('OK').removeAttr('data-ember-action').attr('onclick','location.href=\'#/main/home\'')
        $('#act_try').html('OK').removeAttr('data-ember-action').attr('onclick','rec_friends()')
        // setTimeout(function(){
          // link.transitionTo('main')
          //location.href='#/main/home';
        // },700);

      }else if(data.meta.code==404){
        App.Failed_Content=data.meta.error_message;
        $('#no-user').click();
      }else{
        App.Failed_Alert="Oops!";
        App.Failed_Content=data.meta.error_message;
        $('#failed').click();
      }
    });
    post.error(function(data){
      App.Failed_Alert="Oops!";
      if(data.status){
        App.Failed_Content=data.statusText;
      }else if(data.responseText!=""){
        App.Failed_Content=data.responseText;
      }else if(data.statusText!=""){
        App.Failed_Content=data.statusText
      }else{
        App.Failed_Content="Network Problem"
      }
      $('#failed').click();
      $('#log-load').removeClass('moco-load fa-spin');
    });
  },500);
}

function rec_friends(){
  $('#btn-u_recommend').click();
  setTimeout(function(){
    var controller = App.MainHomeController.create();
    controller.send('suggest');
  },500)
}
function resend_verification(){
  var token =window.localStorage.getItem('token');
  var data ={'client_id':App.api.client_id,'client_secret':App.api.client_secret,'email':email};
  // var post = majax_post('books/borrow_book',data,'');
  var post = majax_secure('users/resend_verification',data,'');
  post.success(function(data){
    //console.log(data);
    $('#act_cancel').click();
    setTimeout(function(){
      if(data.meta.code == 200){
        App.Success_Alert=data.meta.confirm
        App.Success_Content=data.data.message
      $('#success').click();
      }else{
        App.Failed_Alert ="Gagal"
        App.Failed_Content = data.meta.error_message;
      $('#failed').click();
      }
    },500)
  });
  post.error(function(data){
    $('#act_cancel').click();
    setTimeout(function(){
      dua=data;
      App.Failed_Alert ="Failed"
      if(data.status){
        App.Failed_Content=data.statusText;
      }else if(data.responseText!=""){
        App.Failed_Content=data.responseText;
      }else if(data.statusText!=""){
        App.Failed_Content=data.statusText
      }else{
        App.Failed_Content="Network Problem"
      }
      // Moco.content="Network Problem";
      $('#failed').click();
    },500)
  });
}
