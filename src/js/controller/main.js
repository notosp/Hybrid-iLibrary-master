App.MainController = Ember.ObjectController.extend({
  init:function(){
  },
  actions:{
    home:function(){
      $('.side').removeClass('active');
      $('#home').addClass('active');
      $('.side-menu').removeClass('side-open');
      var token = localStorage.getItem('token');
      if (token){
        var controller = App.MainHomeController.create();
        controller.send('feeds')
      }else{
        window.location.href="#/login"
      }
    },
    library:function(){
      $('.side').removeClass('active');
      $('#library').addClass('active');
      $('.side-menu').removeClass('side-open');
      // alert('library')
      this.transitionTo('main.library')
    },
    store:function(data){
      $('.side').removeClass('active');
      $('#store').addClass('active');
      $('.side-menu').removeClass('side-open');
      // this.transitionTo('store')
      var controller = App.MainStoreController.create();
      controller.send('books',data)
      // location.href='#/main/store/'+data
    },
    shelf:function(){
      $('.side').removeClass('active');
      $('#shelf').addClass('active');
      $('.side-menu').removeClass('side-open');
      $('#home').addClass('active');
      $('.main').removeClass('blur');
      $('.pre').hide();
      
      var token = localStorage.getItem('token');
      if (token){
        // var controller = App.MainHomeController.create();
        // controller.send('feeds')
        // this.transitionTo('shelf.current')
        location.href='#/main/shelf/current'
      }else{
        window.location.href="#/login"
      }
      // alert('shelf')
    },
    notes:function(){
      $('.side').removeClass('active');
      $('#notes').addClass('active');
      $('.side-menu').removeClass('side-open');
      $('.main').removeClass('blur');
      $('.pre').hide();
      // alert('shelf')
      // location.href="#/main/notes/all"
      // this.transitionTo('notes.all')
      var token = localStorage.getItem('token');
      if (token){
        // var controller = App.MainHomeController.create();
        // controller.send('feeds')
        // this.transitionTo('shelf.current')
        location.href="#/main/notes/all"
      }else{
        window.location.href="#/login"
      }
    },
    setting:function(){
      $('.side').removeClass('active');
      $('#setting').addClass('active');
      $('.side-menu').removeClass('side-open');
      alert('settings')
    },
    profile:function(){
      main_profile()
    },
    parse_profile:function(data){
      main_parse_profile(data)
    },
    purchase:function(){
      // main_purchase()
    },
    parse_purchase:function(data){
      main_parse_purchase(data)
    },
    v_index:function(){
      if(vou_index_html!=''){
        $('#list_vouchers').html(vou_index_html);
      }else{
        var token =window.localStorage.getItem('token');
        var vo='';
        // $('#balance').html(window.localStorage.getItem('balance'));
        var check = new majax('vouchers/index',{'client_id':App.api.client_id},'');
        check.success(function(data){
          if(data.meta.code==200){
            voucher=1;
            $.each(data.data,function(){
              var vou = this.Voucher;
              vo+='<li class="b-green col-md-5 col-xs-5 m10 voucher" id="voucher_'+vou.id+'" style="padding:5px;border-radius:5px;">\
                    <div onclick="set_voucher_id('+vou.id+',\''+vou.price+'\')" style="cursor:pointer">\
                        <center>\
                        <div style="display:none">'+vou.id+'</div>\
                        <div class="" style="font-size:65px;line-height:1;padding-top:5px;">'+vou.price/1000+'</div>\
                        <div class="f12"><span>Points</span></div>\
                        <div style="padding-bottom:5px">Rp. '+vou.price+'</div>\
                        </center>\
                      </div></li>';
            });
            vou_index_html=vo;
            setTimeout(function () {
              $('#list_vouchers').html(vo);
            })
          }else{
          }
        });
      }
    },
    logout:function(){
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
      window.location.href="#/main/store/index";

      clear_data();
      $('.side-menu').removeClass('side-open').addClass('side-close')
      // window.location.replace('#/main/store/recommended');
    },
    download:function(id,item_out,item_pass,item_session,type,cover,link,security){
            get_books_title(id)
      dir('create',homePath+'/.iNgawi/files');
      $('#get_books').attr('disabled','disabled');
      $('.book_cover_act').attr('disabled','disabled');
      $('.caption').addClass('hide');
      $('#download_'+id).removeClass('hide');
      $('.b_det_download').removeClass('hide');
      $(".book_cover_act").attr("disabled", "disabled").unbind('click');
      $( ".book_cover_act" ).attr('action', $( ".book_cover_act" ).attr('onclick')).attr('onclick','')

      // window.keyhash = crypto_.createHash('sha1').update(item_pass).digest('hex');

      if(security=='2'){
        console.log('new')
        if(type=="pdf"){
          window.keyhash = crypto_.createHash('sha1').update(item_pass).digest('hex')
          window.localStorage.setItem('password',crypto_.createHash('sha256').update(item_pass).digest('hex'))
        }else{
          window.keyhash = crypto_.createHash('sha256').update(item_pass).digest('hex')
        }
      }else{
        console.log('old')
        window.keyhash = crypto_.createHash('sha1').update(item_pass).digest('hex')
      }

      window.book_id = id;
      window.localStorage.setItem('book_id',id)
      if(link){
        window.localStorage.setItem('link_profile',link)
      }
      if(cover){
        window.localStorage.setItem('link_cover',cover)
      }
      // console.log(id)
      var html = '<div class="white download_progress_ f14" style="font-weight:bold;text-align:center;">Menyiapkan Buku ..... <span>0%</span></div><div class="progress active"> \
        <div id="progress-dw" class="progress-bar" aria-valuenow=""  role="progressbar" aria-valuemin="0" aria-valuemax="100"> \
          <span class="sr-only">% Complete</span> \
        </div> \
      </div>';
      $('#download_'+id).html(html);
      $('#download_').html(html);
      $('.b_det_download').html(html);
      var file = item_out.split('/');
      var source = homePath+'/.iNgawi/'+file[file.length - 1];
      var destination  = homePath+'/.iNgawi/';
      var nama_file = file[file.length - 1].split('_Book');
      var aa1 = homePath+'/.iNgawi/files/';
      var aa2 = homePath+'/.iNgawi/files/'+nama_file[0]+'/';
      // console.log(aa1);
      // console.log(aa2);
      dir('create',homePath+'/.iNgawi/files/'+nama_file[0]);
      dir('create',aa1)
      dir('create',aa2)
      var destination1  = aa2;
      // console.log(destination1)

      var path = homePath+'/.iNgawi/files/uploads/'+item_session+'/'+file[file.length - 1].replace('_out.zip','/');
      
      // var link = '/.iNgawi/files/uploads/'+item_session+'/'+file[file.length - 1].replace('_out.zip','/');
      var link = '/.iNgawi/files/'+nama_file[0]+'/';
         
      var act_book2 = 'read_this(\'pdf\',\''+link+'\',\''+id+'\',\''+cover+'\')';
      var act_book = 'read_this(\'epub\',\''+link+'\',\''+id+'\',\''+cover+'\')';
      var act_bookx = 'read_this(\''+type+'\',\''+link+'\',\''+id+'\',\''+cover+'\',\''+nama_file[0]+'\')';
      isDirectory(homePath+link)
      isExist(source);
      window.link_file = source;

      setTimeout(function(){
        console.log(file_status)
        if(file_status==true){
          $('#download_'+id).hide();
          $('#download_').hide();
          console.log('file_exist');
          setTimeout(function(){
            var child = spawn('unzip', [ '-P',keyhash, '-d',destination1,source ])
            child.stdout.on('data', function(data) {
              console.log('stdout: ' + data);
              setTimeout(function(){
                isDirectory(homePath+link)
                isExist(source)
                setTimeout(function(){
                  console.log(dir_status)
                  if(dir_status==true){
                    if(type=="pdf"){
                      console.log('pdf')
                      $('#link_book_'+id).attr('onclick',act_book2);
                      $("#book_cover_"+id).attr('onclick',act_book2);
                      $('#get_books').attr('onclick',act_book2);
                      $('#ads_act').attr('onclick',act_book2);
                    }else if(type=="epub"){
                      console.log('epub')
                      $("#link_book_"+id).attr('onclick',act_book);
                      $("#book_cover_"+id).attr('onclick',act_book);
                      $('#get_books').attr('onclick',act_book);
                      $('#ads_act').attr('onclick',act_book);
                    }else{
                      $("#link_book_"+id).attr('onclick',act_bookx);
                      $("#book_cover_"+id).attr('onclick',act_bookx);
                      $('#get_books').attr('onclick',act_bookx);
                      $('#ads_act').attr('onclick',act_bookx);
                    }
                    setTimeout(function(){
                      $("#link_book_"+id).click()
                      $("#book_cover_"+id).click()
                      $('#get_books').click()
                      $('#ads_act').click()
                    })
                  }
                  // else{
                  //   console.log(dir_status)
                  //   if(dir_status==true){
                  //     if(type=="pdf"){
                  //       console.log('pdf')
                  //       $('#link_book_'+id).attr('onclick',act_book2);
                  //       $("#book_cover_"+id).attr('onclick',act_book2);
                  //       $('#get_books').attr('onclick',act_book2);
                  //       $('#ads_act').attr('onclick',act_book2);
                  //     }else{
                  //       console.log('epub')
                  //       $("#link_book_"+id).attr('onclick',act_book);
                  //       $("#book_cover_"+id).attr('onclick',act_book);
                  //       $('#get_books').attr('onclick',act_book);
                  //       $('#ads_act').attr('onclick',act_book);
                  //     }
                  //     setTimeout(function(){
                  //       $("#link_book_"+id).click()
                  //       $("#book_cover_"+id).click()
                  //       $('#get_books').click()
                  //       $('#ads_act').click()
                  //     })
                  //   }else{
                  //     // delete_file(source)
                  //   }
                  // }
                  //GONE
                },3000)
              },1000)
              // console.log('fs.unzip('+source+','+keyhash+','+destination1+')')
              $('#ads_act').removeAttr('disabled');
            });
            child.stderr.on('data', function(data) {
              console.log('Gagal ekstrak tanpa download')
              console.log('stderr: ' + data);
              // alert("Buku tidak lengkap, Silakan ulangi untuk mengunduhnya");
              $('.caption').addClass('hide');
              //Here is where the error output goes
              $('#get_books').attr('disabled','');
              $('.book_cover_act').attr('disabled','');
              // delete_file(source);
              $( ".book_cover_act" ).attr('onclick', $( ".book_cover_act" ).attr('action')).attr('action','')

            });
            child.on('close', function(code) {
              console.log('closing code: ' + code);
              //Here you can get the exit code of the script
            });  
          },3000)
        }else{
          console.log('not found')
          download(item_out,function callback(data){
            console.log(data)
            $('#progress-dw').attr('aria-valuenow',data);
            $('#progress-dw').attr('style',"width:"+data+"%;");
            $('.download_progress_ span').html(data+'%');
            if(data==100){
              console.log('sukses download')
              $('#download_'+id).html('');
              $('#download_').empty();
              $('#download_').hide();
              $('#download_').html('');
              $('#download_').empty();
              setTimeout(function(){
                var child = spawn('unzip', [ '-P',keyhash, '-d',destination1,source ])
                child.stdout.on('data', function(data) {
                  console.log('stdout: ' + data);
                  setTimeout(function(){
                    isDirectory(homePath+link)
                    isExist(source)
                    setTimeout(function(){
                      console.log(dir_status)
                      if(dir_status==true){
                        if(type=="pdf"){
                          console.log('pdf')
                          $('#link_book_'+id).attr('onclick',act_book2);
                          $("#book_cover_"+id).attr('onclick',act_book2);
                          $('#get_books').attr('onclick',act_book2);
                          $('#ads_act').attr('onclick',act_book2);
                        }else if(type=="epub"){
                          console.log('epub')
                          $("#link_book_"+id).attr('onclick',act_book);
                          $("#book_cover_"+id).attr('onclick',act_book);
                          $('#get_books').attr('onclick',act_book);
                          $('#ads_act').attr('onclick',act_book);
                        }else{
                          $("#link_book_"+id).attr('onclick',act_bookx);
                          $("#book_cover_"+id).attr('onclick',act_bookx);
                          $('#get_books').attr('onclick',act_bookx);
                          $('#ads_act').attr('onclick',act_bookx);
                        }
                        setTimeout(function(){
                          $("#link_book_"+id).click()
                          $("#book_cover_"+id).click()
                          $('#get_books').click()
                          $('#ads_act').click()
                        })
                      }
                      // else{
                      //   console.log(dir_status)
                      //   if(dir_status==true){
                      //     if(type=="pdf"){
                      //       console.log('pdf')
                      //       $('#link_book_'+id).attr('onclick',act_book2);
                      //       $("#book_cover_"+id).attr('onclick',act_book2);
                      //       $('#get_books').attr('onclick',act_book2);
                      //       $('#ads_act').attr('onclick',act_book2);
                      //     }else{
                      //       console.log('epub')
                      //       $("#link_book_"+id).attr('onclick',act_book);
                      //       $("#book_cover_"+id).attr('onclick',act_book);
                      //       $('#get_books').attr('onclick',act_book);
                      //       $('#ads_act').attr('onclick',act_book);
                      //     }
                      //     setTimeout(function(){
                      //       $("#link_book_"+id).click()
                      //       $("#book_cover_"+id).click()
                      //       $('#get_books').click()
                      //       $('#ads_act').click()
                      //     })
                      //   }else{
                      //     delete_file(source)
                      //   }
                      // }
                      //GONE
                    },3000)
                  },1000)
                  console.log('fs.unzip('+source+','+keyhash+','+destination1+')')
                  $('#ads_act').removeAttr('disabled');
                });
                child.stderr.on('data', function(data) {
                  console.log('stderr: ' + data);
                  // alert("Buku tidak lengkap, Silakan ulangi untuk mengunduhnya");
                  $('.caption').addClass('hide');
                  $('#get_books').attr('disabled','');
                  $('.book_cover_act').attr('disabled','');
                  // delete_file(source);
                  console.log('Gagal ekstrak dengan download')
                  $( ".book_cover_act" ).attr('onclick', $( ".book_cover_act" ).attr('action')).attr('action','')
                  //Here is where the error output goes

                });
                child.on('close', function(code) {
                  console.log('closing code: ' + code);
                  //Here you can get the exit code of the script
                });  
              },1000)
            }
          })
        }
      },1000)
    },
    topup_code:function(id){
      var token= window.localStorage.getItem('token');
      var data = {'access_token':token,'product_type':'Voucher','product_key':id};
      //var data ={'access_token':token,'password':confirm_password,'book_id':books_id,'price_id':price_id};
      var post = majax_post('orders/transfer_payment',data,'');
      post.success(function(data){
        if(data.meta.code == 200){
          App.Success_Alert ="Success"
          App.Success_Content = data;
          $('#success').click();
        }
        else{
          var msg = "";
          if($.isArray(data.meta.error_message)){
            $.each(data.meta.error_message,function(i,j){
                if(i == 0){
                    msg += j;   
                }
                else{
                    msg += ","+j; 
                }
            });
          }else{
            msg = data.meta.error_message;
          }
          App.Failed_Alert ="Opps"
          App.Failed_Content = data.meta.confirm;
          $('#failed').click();
        }
      });
    },
    topup_token:function(){
      console.log('topup_token')
      var token= window.localStorage.getItem('token');
      var data = {'access_token':token,'code':$('#token_input').val()};
      //var data ={'access_token':token,'password':confirm_password,'book_id':books_id,'price_id':price_id};
      var post = majax_post('vouchers/topup_by_code',data,'');
      post.success(function(data){
          if(data.meta.code == 200){
             App.Success_Alert ="Success"
            App.Success_Content = data.data;
          }
          else{
              var msg = "";
              if($.isArray(data.meta.error_message)){
                $.each(data.meta.error_message,function(i,j){
                  if(i == 0){
                      msg += j;   
                  }
                  else{
                      msg += ","+j; 
                  }
                });
              }else{
                msg = data.meta.error_message;
              }
              App.Failed_Alert ="Opps"
              App.Failed_Content = msg;
              $('#failed').click();
          }
      });
    },
    topup_matm:function(){
      var token= window.localStorage.getItem('token');
      var data = {'access_token':token,'product_type':'Voucher','product_key':voucher_id,'phone':$('#phone').val()};
      //var data ={'access_token':token,'password':confirm_password,'book_id':books_id,'price_id':price_id};
      var post = majax_post('orders/mandiri_matm',data,'');
      post.success(function(data){
          if(data.meta.code == 200){
            App.Success_Alert ="Success"
            App.Success_Content = data.meta.confirm;
            $('#success').click();
          }
          else{
            if($.isArray(data.meta.error_message)){
              $.each(data.meta.error_message,function(i,j){
                if(i == 0){
                    msg += j;   
                }
                else{
                    msg += ","+j; 
                }
              });
            }else{
              msg = data.meta.error_message;
            }
            App.Failed_Alert ="Opps"
            App.Failed_Content = msg;
            $('#failed').click();
          }
      });
    },
    unggah:function(){
      var token =window.localStorage.getItem('token');
      var testCanvas = document.getElementById("temp_ava"); 
      console.log(testCanvas);
      var canvasData = testCanvas.toDataURL("image/png");
      console.log(canvasData);
      var postData = canvasData;

      //alert("canvasData ="+canvasData );  
      var request = App.api.api_base+'users/edit_avatar?access_token='+token      
      var ajax = new XMLHttpRequest();
      console.log(request)
      ajax.open("POST",request,true);  
      ajax.setRequestHeader('Content-Type', 'canvas/upload');  
      // ajax.setRequestHeader('Content-Type', 'canvas/upload');
      setTimeout(function() {  ajax.abort()  },9000000);
      //ajax.setRequestHeader('Content-TypeLength', postData.length);

      ajax.onreadystatechange = function (oEvent) {  
        if (ajax.readyState === 4) {  
            if (ajax.status === 200) {  
              console.log(ajax.responseText) ;
              $('#ava').css('opacity',1);
              App.Success_Alert = "Sukses"
              App.Success_Content="Avatar berhasil di ubah";
              main_profile();
              $('#success').click();
              setTimeout(function() {
                $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#editp_act").click()')
                $('.cover img').attr('src',App.photo)
              })
              user[1]=upload_img;
          } else {  
            console.log("Error", ajax.statusText); 
            App.Failed_Alert="Oops!";
            App.Failed_Content="Network Problem";
            $('#failed').click();
            setTimeout(function(){
              $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#editp_act").click()')
              $('#photo').attr('src',user[5]).css('height','210px').css('width','210px');
            })
          }  
        }  
      };
      ajax.send(postData);
    }
  }
})

function main_profile(){
  var token =window.localStorage.getItem('token');
  if(token){
    var check = new majax_fast('profile',{'access_token':token},'',600000);
    var local = ReadData('profile');
    if(local!=null){
      // var controller = App.MainController.create();
      // controller.send('parse_profile',data)
    }
    check.error(function(data) {
    }),
    check.success(function(data){
      if(data.meta.code==200){
        $('#open_profile').show();
        $('#password').show();
        $('#logout').show();
        WriteData('profile', data)
        profile = 1;
        if(local==null){
          // var controller = App.MainController.create();
          // controller.send('parse_profile',data)
          main_parse_profile(data)
        }else{
          // var controller = App.MainController.create();
          // controller.send('parse_profile',data)
          main_parse_profile(data)
        }
      }
      if(data.meta.code==401){
        App.content=data.meta.error_message;
        $('#confirm_trans_failed').click();
        var controller = App.MainController.create();
        // controller.send('logout')
        clear_data();
      }
    });
  }else{
    clear_data();
  }
}

function main_parse_profile(data){
  var token =window.localStorage.getItem('token');
  if(token){
    user = [];
    try{
      $('.side-menu .head img').attr('src',data.data.User.avatar);
      $('#name').html(data.data.User.name);
      $('#about').html(data.data.User.about);
      $('#balance').html(Math.floor(data.data.User.balance/1000));
      $('#user_photo').attr('onclick',"location.href='#/main/user/"+data.data.User.id+"'")
      $('#open_profile').attr('onclick',"location.href='#/main/user/"+data.data.User.id+"'")
      WriteData('user_id',data.data.User.id);
    }catch(error){console.log(error.message)}
    try{
      $('#follower').html(data.data.UserFollowing.total_followers);
      $('#following').html(data.data.UserFollowing.total_followings);
    }catch(error){console.log(error.message)}
    try{
      $('.side-menu .head .identity button').html(data.data.Badge.name);
    }catch(error){console.log(error.message)}
    user[0] = data.data.User.id;
    if(data.data.User.avatar=="http://store.moco.co.id/img/default_avatar.png" || data.data.User.avatar=="http://webstore.aksaramaya.com/img/default_avatar.png" ){
      user[1] = "img/main/avatar.png";
    }else{
      user[1] = data.data.User.avatar;
      $('#photo').attr('src',data.data.User.avatar);
    }
    //preload_ava('#photo')
    user[2] = data.data.User.username;
    user[3] = data.data.User.name;
    user[4] = data.data.UserFollowing.total_followers;
    user[5] = data.data.UserFollowing.total_followings;
    user[6] = data.data.Badge.icon;
    user[7] = data.data.Badge.name;
    user[8] = data.data.User.address;
    user[9] = data.data.User.about;
    user[10] = data.data.User.phone;
    var level = data.data.Badge.id;
    //console.log(data.data.Badges[1])
    list_badge="";
    if(level==1){
      //console.log('1')
      $('.side-menu .head .identity button').attr('onclick','show_badge(1)');
      var l_badge=data.data.Badges[1].Achievement;
      l_badge.forEach(function(d){
        //console.log(d);
        if(d.has_reached==true){
          var check ="fa fa-check-circle";
          var f_col ="color:#4D4B8C;"
        }else{
          var check ="fa fa-circle-thin";
          var f_col ="color:#ddd";
        }
        //console.log(d.has_reached);
        //console.log(check,f_col)
        list_badge+='<div class="badge_assigment" style="height:25px;width:100%;'+f_col+'">\
          <i class="'+check+' sidebar-text" style="padding-right:12px;padding-top:10px;float:left"></i>\
          <span class="sidebar-text" style="padding-top:5px;float:left;">'+d.name+'</span>\
          <div class="divider" style="padding:0;padding-top:25px;width:201px;"></div>\
          </div>';
      });
    }else if(level==2){
      //console.log('2')
      $('.side-menu .head .identity button').attr('onclick','show_badge(2)');
      var l_badge=data.data.Badges[2].Achievement;
      l_badge.forEach(function(d){
        if(d.has_reached==true){
          var check ="fa fa-check-circle";
          var f_col ="color:#4D4B8C;"
        }else{
          var check ="fa fa-circle-thin";
          var f_col ="color:#ddd";
        }
        //console.log(d);
        list_badge+='<div class="badge_assigment" style="height:25px;width:100%;'+f_col+'">\
          <i class="'+check+' sidebar-text" style="padding-right:12px;padding-top:10px;float:left"></i>\
          <span class="sidebar-text" style="padding-top:5px;float:left;">'+d.name+'</span>\
          <div class="divider" style="padding:0;padding-top:25px;width:201px;"></div>\
          </div>';
      });
    }else{
      $('.side-menu .head .identity button').attr('onclick','show_badge(2,1)');
      var l_badge=data.data.Badges[2].Achievement;
      l_badge.forEach(function(d){
        if(d.has_reached==true){
          var check ="fa fa-check-circle";
          var f_col ="color:#4D4B8C;"
        }else{
          var check ="fa fa-circle-thin";
          var f_col ="color:#ddd";
        }
        //console.log(d);
        list_badge+='<div class="badge_assigment" style="height:25px;width:100%;'+f_col+'">\
          <i class="'+check+' sidebar-text" style="padding-right:12px;padding-top:10px;float:left"></i>\
          <span class="sidebar-text" style="padding-top:5px;float:left;">'+d.name+'</span>\
          <div class="divider" style="padding:0;padding-top:25px;width:201px;"></div>\
          </div>';
      });
    }
  }else{
    clear_data();
  }
}

function main_purchase(){
  var month = [];
  var pos_month;
  var max_month;
  function get_month(){
    var d = new Date();
    var n = d.getMonth();
    pos_month=n;
    max_month = n+1;
    month[n+1]="total";
    for(i=0;i<=n;i++){
      month[i]=i+1;
    }
  }
  get_month();
  var mont_purchase =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var book='';
  var token =window.localStorage.getItem('token');
  var d = new Date();
  var n = d.getMonth();
  n = n+1;
  if(month==n){
    $('#group-purchase').html('This Month');
  }else if(month == 'total'){
    $('#group-purchase').html('Total');
  }else{
    $('#group-purchase').html(mont_purchase[month-1]);
  }
  var local = ReadData('_purchase');
  if(local!=null){
    // var controller = App.MainController.create();
    // controller.send('parse_purchase',local)
    main_parse_purchase(local)
  }else{
    var before = $('#purchase').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
  }
  var check = new majax('orders/purchase_histories',{'access_token':token,'group_by':'total'},'');
  check.success(function(data){
    if(data.meta.code==200){
      //$('#group-purchase').html(data.data.group_by);
      purchase=1;
      WriteData('_purchase', data)
      if(local==null){
        //console.log(local);
        // var controller = App.MainController.create();
        // controller.send('parse_purchase',data)
        main_parse_purchase(data)
      }
    }else{
       $('#purchase').html('');
    }
  });
}

function main_parse_purchase(data){
  //console.log(data)
  var book='';
  // $('#topup_val').html(Math.round(data.data.total_topup/1000));
  // $('#usage_val').html(Math.round(data.data.total_purchase/1000));
  if(data.data.current_page_result==0){ 
    console.log('empty') 
    setTimeout(function() {
      $('#purchase').html('Empty Histories');
    })
  }else{
    try{  
      $.each(data.data.data,function(){
        var Book = this.Book;
        var Order = this.Order;
        var OrderDetail = this.OrderDetail;
        var Library = this.Library;

        if(OrderDetail.type=="Library"){
          image = Library.logo;
          title_trx = limitCharacter(Library.name,45);
          days="<span style='color:transparent'>.</span>";
          // desc_trx = '<span class="light-blue medium"  style="font-size:16px;">'+Library.address+'</span>';
          desc_trx =""
          type_trx = "Join ePustaka";
        }else if(OrderDetail.type=="Book"){
          image = Book.cover;
          title_trx = limitCharacter(Book.title,45);
          // desc_trx = 'by <span class="light-blue medium" style="font-size:16px;">'+Book.authors+'</span>';
          desc_trx =""
          type_trx = OrderDetail.purchase_type;
          if(type_trx=="buy"){
            days = "<span style='color:transparent'>.</span>";
          }else{
            days = OrderDetail.qty_days;
          }

        }else{
          image = "images/logo.png";
          title_trx = "<span style='color:transparent'>.</span>";
          desc_trx = "<span style='color:transparent'>.</span>";
          days="<span style='color:transparent'>.</span>";
          type_trx = "<span style='color:transparent'>.</span>";
        }
        //Order.order_date;
        book +='<div class="" style="font-size:12px;padding:0;padding-top:5px;line-height:1.2">\
        <center style="font-size:12px;padding-bottom:15px;" class="grey">'+dateFormat(Order.payment_deadline, 'dddd, dd/mm/yy')+'</center>\
        <div class="col-xs-3 col-md-3" style="padding-left:10px;"><img src="'+image+'"style="width:50px;border:1px solid #ddd"></div>\
        <div class="col-xs-9 col-md-9" style="padding-left:10px;padding-right:5px;word-break:break-word">\
          <div class="medium" style="text-transform:capitalize;">'+type_trx+' :</div>\
          <!--<div style="font-size:12px;">'+days+' Days</div>\
          <div class="medium" style="padding-top:5px;">Points :</div>\
          <div style="font-size:12px;">'+OrderDetail.price/1000+' Pts</div>-->\
          <div class="medium" style="padding-top:5px;"  style="font-size:12px;">'+title_trx+'</div>\
          <div  style="font-size:10px;">'+desc_trx+'</div>\
        </div><div class="divider" style="margin-top:105px;"></div>\
        </div>';

      });
      setTimeout(function(){
        $('#purchase').html(book);
      })
    }catch(error){console.log(error.message)}
  }
}

function delete_file(source){
  console.log('detele file '+source)
  if (navigator.appVersion.indexOf("Win")!=-1){
      exec('del '+source);
  }else{
      exec('rm '+source);
  }
}

function canvas_foto(fl){
  // var fl = fs.openFileDialog();
  console.log(fl);
  var canvas = document.getElementById("ava");
  var temp_canvas = document.getElementById("temp_ava");
  var context = canvas.getContext("2d");
  var temp_context = temp_canvas.getContext('2d');
  console.log(fl);
  if (!fl.match(/(?:gif|jpg|png|bmp|jpeg)$/)) {
  // inputted file path is not an image of one of the above types
  alert("Please Choose a Picture File");
    //couch_act(3);
  }else{
    var gambar = 'file:///'+fl;
    App.photo=gambar;
    $('#photo').attr('src',gambar).css('height','210px').css('width','210px');
    console.log(gambar);

    upload_img = gambar;

    context.clearRect(0, 0, 130, 130);
    var imageObj = new Image();
    var temp_imageObj = new Image();

    imageObj.onload = function() {
      context.drawImage(imageObj,0,0,130,130);
    };

    temp_imageObj.onload=function(){
      temp_context.drawImage(temp_imageObj,0,0,210,210);
    }
    //imageObj.src = "file:///C:/Users/Irfan/Desktop/a.jpg";
    imageObj.src=gambar;
    temp_imageObj.src=gambar;
    $('#ava').css('opacity',0.1);
    //couch_act(3);
    setTimeout(function(){
      var controller = App.MainController.create();
      controller.send('unggah')
    },2000);
  }
}