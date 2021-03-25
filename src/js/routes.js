var intro0,intro1,intro2,intro3;
App.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    setTimeout(function(){
      clear_books();
    },1000)
    var token = localStorage.getItem('token');
    var location = window.location.href;
    var a = location.split('?');
    if(a[1]){
      var b = a[1].split('provider=')
      if(b[1]){
        try{
          var c = b[1].split('&code=')
          var d = c[0].split('provider=')
          var provider = c[0];
          var code = c[1];
          if(b){
            if(provider=="twitter"){
              var controller = App.TwitterController.create();
              controller.send('twit_oauth_login',code);
              return this.transitionTo('login');
            }else if(provider=="yahoo"){

            }else{

            }
          }else{
            console.log(error.message);
            console.log('facebook')
            localStorage.setItem('fb_token',a[1]);
            var controller = App.FacebookController.create();
            controller.send('get_fb');
            return this.transitionTo('login');
          }
        }catch(error){
          console.log(error.message);
          console.log('facebook')
          localStorage.setItem('fb_token',a[1]);
          var controller = this.controllerFor('facebook');
          controller.send('get_fb');
          return this.transitionTo('login');
        }
      }else{
        localStorage.setItem('fb_token',a[1]);
        var controller = App.FacebookController.create();
        controller.send('get_fb');
        return this.transitionTo('login');
      }
    }else{
      if(token){
        // return this.transitionTo('main.home');
        return window.location.href="#/main/store/index";
      }else{
        // return this.transitionTo('login');
        return this.transitionTo('intro.ha')
      }
      // return this.transitionTo('main.store');
      // return window.location.href="#/main/store/index"
    }
  },
  actions:{
  }
});
App.LoginRoute = Ember.Route.extend({
  setupController: function() {
    // this.send('get_fb')
    $('.pre').hide();
  },
  actions:{
    openModal: function(modalName, model) {
      setTimeout(function(){
        if(modalName=='register'){
          console.log('reg')
          if(signup[1]){
            $('#reg_email').val(signup[1])
          }
          if(signup[2]){
            $('#reg_pass').val(signup[2]);
            $('#reg_pass2').val(signup[2]);
          }
        }
      });
      // $('#login_screen').addClass('blur')
      if(modalName=="log-email"){
        setTimeout(function(){
          $(function() {
            $('#log_pass').password().on('show.bs.password', function(e) {

            }).on('hide.bs.password', function(e) {

            });
              // $('#log_pass').password('toggle');
          });
        })
      }
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },
    closeModal: function() {
      $('#login_screen').removeClass('blur')
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
App.MainRoute = Ember.Route.extend({
  model: function() {
    // alert('coba')
    // this.send('get_fb')
    setTimeout(function(){
      $('#logo_profile').click(function(event){
        // console.log(event)
        // event.stopPropagation();
        $('.side-menu').toggleClass('side-close');
        $('.side-menu').toggleClass('side-open');
        $('.right-menu').removeClass('right-open');
        $('.pre').show();
        $('#nav_search_result').html('').hide();
        $("input#nav_search").val("")
        nav_search()
        // $('.main').addClass('blur')
      })
      if(localStorage.getItem('offline')=="true"){
        console.log('offline')
        $('.olcm').show();
        write_olcm()
        $('.main').css('top','87px');
      }else{
        // $('.main').css('top','52px');
      }
      if(localStorage.getItem('token')){
        if(localStorage.getItem('olcm')==1){
          console.log('olcm')
          olcm(1)
          $('.olcm').show();
          $('.main').css('top','87px');
        }
      }
      $('.pre').click(function(){
        $('.side-menu').removeClass('side-open').addClass('side-close');
        $('.right-menu').removeClass('right-open');
        $('.main').removeClass('blur')
        $('.pre').hide();
        $('#nav_search_result').html('').hide();
        $("input#nav_search").val("")
      })
      $('.main').click(function(){
        $('.side-menu').removeClass('side-open').addClass('side-close');
        $('.right-menu').removeClass('right-open');
        $('.main').removeClass('blur')
        $('.pre').hide();
        $('#nav_search_result').html('').hide();
        // $("input#nav_search").val("")
      })
      $('#logo_user').click(function(event){
        // event.stopPropagation();
        $('.right-menu').toggleClass('right-open');
        $('.side-menu').removeClass('side-open').addClass('side-close');
        $('.pre').show();
        $('#nav_search_result').html('').hide();
        $("input#nav_search").val("")
        // $('.main').addClass('blur')
      })
      // $('#btn-balance').click(function(event){
      //   $('#l_voucher').toggleClass('vou-open');
      // })
      $(".knob").knob();
    },1)
    //onresize function
    onresize()
    var controller = App.MainController.create();
    if(profile!=1){
      try{
        controller.send('profile');
      }catch(error){
        console.log(error.message)
      }
    }
    if(purchase!=1){
      try{
        controller.send('purchase');
      }catch(error){
        console.log(error.message)
      }
    }
    if(voucher!=1){
      try{
        // controller.send('v_index');
      }catch(error){
        console.log(error.message)
      }
    }
    var controller = App.RealtimeController.create();
    try{
      // controller.send('subcribe');
      // controller.send('real_feeds');
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
    setTimeout(function(){
      // console.log('from home')
      var controller = App.NotifController.create();
      controller.send('list_notif','dropdown');
      var controller = App.ChatController.create();
      controller.send('list_chat','dropdown')
      $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
      });
       // list_donasi();
       // don_unverified();
       nav_search()
    })
    setTimeout(function(){
      update_moco();
    },5000)
  },
  actions:{
    openModal: function(modalName, model, param) {
      setTimeout(function(){
        if(modalName=="help_olcm"){
          
        }
        if(modalName=='borrow'){
          $('#list_pustaka').html(borrow_pustaka)
        }
        if(modalName=="checkout_donasi"){
          if(model=="open"){
            don_open_check(3,true);
            $('#bank_list').html(App.Callback).show();
            $('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Saya telah melakukan pembayaran')
          }
        }
        if(modalName=="confirmation_donasi"){
          if(model=="open"){
            // don_open_check(3,true);
            // $('#con_order_id').html(App.temp[0])
            // $('#metode_transaksi').html(App.temp[1])
            // $('#status_bayar').html(App.temp[2])
            // $('#tgl_transaksi').html(dateFormat(App.temp[3],'dd mmmm yyyy'))
            // $('#tgl_akhir').html(dateFormat(App.temp[4],'dd mmmm yyyy'))
            // $('#tot_transaksi').html(rupiah(App.temp[5]))
            // $('#don_resettrx').attr('onclick','don_reset_trx(\''+order_id+'\')')
            // $('#don_list_book1').html(App.Book).show();
            $('.box_conf').html(App.temp);
            $('#don_list_book1').html(App.Book);
            // $('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Saya telah melakukan pembayaran')
          }else{
            $('#don_tutor').html(App.bank);
          }
        }
        if(modalName=="tujuan_bayar"){
          $('#don_tutor').html(App.bank);
        }
        if(modalName=='synopsis'){
          // App.book_id = Book.id
          // App.book_synopsis = Book.description;
          // App.book_title = Book.title
          // App.book_cover = Book.cover;
          // App.book_authors = Book.authors;
          var link = window.localStorage.getItem('link_profile')
          $('#detil_synopsis').html(App.book_synopsis)
          // share(type,id,link,name,cover,address,total)
          $('#share_synop').attr('onclick','share(\'Synopsis\',\''+App.book_id+'\',\''+link+'\',\'undefined\',\''+App.book_cover+'\')');
        }
      });
      if(model=="side-menu"){
        console.log('side-menu akses')
        setTimeout(function(){
          $('#close').removeAttr('data-ember-action').attr('onclick','$("#btn-close").click()');
        },500)
      }
      if(model=="gift"){
        var id = localStorage.getItem('user_id');
        var controller = App.FollowController.create();
        controller.send('follower','user',id,'gift')
        setTimeout(function(){
          $('#right_action').attr('onclick',"topup('gift')")
          $('#modal_title').html('Select User')
          $('#icon-search').attr('onclick','search_user()')
          $('#right_action').css('visibility','hidden')
        })
      }
      if(model=="epustaka"){
        setTimeout(function(){
          $('#follow_title').html('Tentang ePustaka');
          $('#follow_title-size').css('padding-left','110px')
        })
      }
      if(model=="checkout_donasi"){

      }
      // $('#login_screen').addClass('blur')
      if(modalName=="profile"){
        setTimeout(function(){
          image=user[1];
          if(image==" "){
              image="../images/icon/avatar.png";
          }
          var canvas = document.getElementById('ava');
          if (canvas.getContext) {
            var context = canvas.getContext('2d');
            var imgObj = new Image();
            imgObj.src = image;
            imgObj.onload = function () {
                //context.drawImage(imgObj, 0, 0, 100, 100);
                canvas.width=130;
                canvas.height=130;
                context.drawImage(imgObj,0,0,130,130);
            }
          }
          $('#p_user').attr('value',user[3]);
          $('#p_address').attr('value',user[8]);
          $('#p_email').attr('value',user[2]);
          //$('#p_bio').attr('value',user[9]);
          $('#p_bio').val(user[9]);
          $('#p_phone').attr('value',user[10]);
        },1000);
      }

      if(modalName=="change_password"){
        setTimeout(function(){
          $(function() {
            $('#change-pass1').password().on('show.bs.password', function(e) {

            }).on('hide.bs.password', function(e) {

            });
              // $('#change-pass1').password('toggle');
          });
        })
      }
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },
    closeModal: function() {
      $( window ).off("resize.mymethod");
      $('#login_screen').removeClass('blur')
      rec_user=[];
      rec_user_name=[];
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
    cleared:function(action){
      $('#'+action).val("");
    },
    change_photo:function(){
      $('#fileDialog').click()
      $('input[type=file]').change(function () {
         var filePath=$('#fileDialog').val(); 
         console.log(filePath)
         canvas_foto(filePath)
      });
    },
    update_user:function(){
      //console.log(user)
      var token =window.localStorage.getItem('token');
      var user1 = $('#p_user').val();
      var address = $('#p_address').val();
      var bio = $('#p_bio').val();
      var phone = $('#p_phone').val();
      // var moco_before = $('#moco-load').addClass("fa fa-spinner fa-spin");
        

      user[8] = address;
      user[9] = bio;
      user[10] = phone;
      user[6] = user1;

      var sdata = {'access_token':token,'name':user1,'address':address,'about':bio,'phone':phone}; 

      //load_photo();
      console.log(user)
      var moco = new majax_secure('users/edit_profile',sdata,'');
      moco.success(function(data){
        if(data.meta.code==200){
          //profile();
          console.log();
          //Moco.username=user;
          App.Success_Alert="Done!";
          App.Success_Content=data.meta.confirm;
          $('#success').click();
          $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$(\'#btn-close\').click()')
          
          setTimeout(function(){
            main_profile();
            // profile();
          },100)
        }else{
          //alert('gagal');
          if($.isArray(data.meta.error_message)){
              //alert(login.meta.error_message.join(', '));
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message.join(', ');
            $('#failed').click();
            $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
          }else{
              //alert(login.meta.error_message);
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message;
            $('#failed').click();
            $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
          }
        }
      });
    },
    update_password:function(){
      var token =window.localStorage.getItem('token');
      var oldpass=$('#old-pass').val(),pass=$('#change-pass1').val(),conf_pass=$('#change-pass2').val();
      // var before=$('#moco-load').addClass('icon-spinner icon-spin icon-large');
      var pass = new majax_secure('users/edit_password',{'access_token':token,'old_password':oldpass,'password':pass,'confirm_password':conf_pass},'');
      pass.success(function(data){
        if(data.meta.code==200){
          App.Success_Alert="Done!";
          App.Success_Content=data.meta.confirm;
          $('#success').click();
          $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
        }else{
          //alert('gagal');
          if($.isArray(data.meta.error_message)){
            //console.log(data);
            //alert(data.meta.error_message.join(', '));
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message.join(', ');
            $('#failed').click();
            $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
          }
          else{
              //alert(login.meta.error_message);
            App.Failed_Alert="Oops!";
            App.Failed_Content=data.meta.error_message;
            $('#failed').click();
            $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
          }
        }
        // $('#moco-load').removeClass('fa fa-spinner fa-spin fa-large');
      });
      pass.error(function(){
        App.Failed_Alert ="Failed"
        App.Failed_Content = "Network Problem";
        $('#failed').click();
        $('#act_try').removeAttr('data-ember-action').attr('onclick','javascript:$("#open_profile").click()')
      });
    }
  }
})
App.MainHomeRoute = Ember.Route.extend({
  setupController:function(){
    var token = localStorage.getItem('token');
    console.log(token)
    if (token){
      $('#open_profile').show();
      $('#password').show();
      $('#logout').show();
      var controller = App.MainHomeController.create();
      controller.send('feeds');
      controller.send('suggest');
      controller.send('chat');
      setTimeout(function(){
        // var controller = App.ChatController.create();
        // controller.send('list_chat','dropdown')
        $('#cat_lib').hide();
        $('#cat_store').hide();
        $('#navigasi span').removeClass('u')
        $('#icn_home span').addClass('u');
        main_profile();
        $('#nav_search_result').html('').hide();
        $("input#nav_search").val("")
        nav_search()
      })
    }else{
      window.location.href="#/login"
    }
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
  },
  actions:{
    // openModal: function(modalName, model) {
    //   setTimeout(function(){

    //   });
    //   // $('#login_screen').addClass('blur')
    //   return this.render(modalName, {
    //     into: 'application',
    //     outlet: 'modal'
    //   });
    // },
    // closeModal: function() {
    //   $('#login_screen').removeClass('blur')
    //   return this.disconnectOutlet({
    //     outlet: 'modal',
    //     parentView: 'application'
    //   });
    // }
  }
})
App.LibraryRoute = Ember.Route.extend({
  setupController:function(){
    setTimeout(function(){
      user_tab="book"
      $('.side-menu').removeClass('side-open');
      $('.right-menu').removeClass('right-open');
      $('.main').removeClass('blur')
      $('.pre').hide();
      $('#navigasi span').removeClass('u')
      $('#icn_library span').addClass('u')
      $('#cat_store').hide();
      $('#cat_lib').show();
      $('#nav_search_result').html('').hide();
      $("input#nav_search").val("")
      nav_search()
    },1);
    try{
      var a = location.href.split('library/');
      // console.log(a[1])
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
    // var controller = App.MainHomeController.create();
    // try{
    //   controller.send('epustaka_genre');
    // }catch(error){
    //   console.log(error.message)
    // }
    
    // try{
    //   var controller2 = App.MainStoreController.create();
    //   controller2.send('recommended')
    // }catch(error){
    //   console.log(error.message)
    // }
  },
  model: function(params, transition) {
    return { library_id: params.store_id }; 
  },
  
  serialize: function(model) {
    return { library_id: model.get('library_id') }; 
  }
})
App.StoreRoute = Ember.Route.extend({
  setupController:function(){
    // alert('saya');
    // var controller = App.MainStoreController.create();
    // controller.send('books')
    setTimeout(function(){
      user_tab="book";
      $('.side').removeClass('active');
      $('#store').addClass('active');
      $('.main').removeClass('blur');
      $('.pre').hide();
      $('#navigasi span').removeClass('u')
      $('#icn_store span').addClass('u')
      $('#cat_lib').hide();
      $('#cat_store').show()
      clearTimeout(intro0);
      clearTimeout(intro1);
      clearTimeout(intro2);
      clearTimeout(intro3);
      $('#nav_search_result').html('').hide();
      $("input#nav_search").val("")
      nav_search()
    },1);
    try{
      var a = location.href.split('store/');
      // console.log(a[1])
      var controller = App.MainStoreController.create();
      // var controller1 = App.MainHomeController.create();
      // controller1.send('books_genre');
      if(a[1]!="undefined"){
        var b = a[1].split("_");
        if(b[1]){
          controller.send('books',undefined,undefined,b[0],b[1])
        }else{
          controller.send('books',a[1])
        }
      }
      // var controller = App.ChatController.create();
      // controller.send('list_chat','dropdown')
      // setTimeout(function(){
      //   var controller = App.NotifController.create();
      //   controller.send('list_notif')
      // })
    }catch(error){
      console.log(error.message)
    }

    // var controller = App.MainHomeController.create();
    // try{
    //   controller.send('books_genre');
    // }catch(error){
    //   console.log(error.message)
    // }
    
    // try{
    //   controller.send('recommended')
    // }catch(error){
    //   console.log(error.message)
    // }
    // location.href='#/main/store/'+data
  },
  model: function(params, transition) {
    return { store_id: params.store_id }; 
  },
  
  serialize: function(model) {
    return { store_id: model.get('store_id') }; 
  }
});
App.BookRoute = Ember.Route.extend({
  setupController:function(){
    // alert('buku')
    var link = location.href;
    localStorage.setItem('history',link)
    setTimeout(function(){
      $('#cat_lib').hide();
      $('#cat_store').hide();
      $('.side-menu').removeClass('side-open').addClass('side-close');
      $('.right-menu').removeClass('right-open');
      $('.main').removeClass('blur')
      $('.pre').hide();
      $('#nav_search_result').html('').hide();
      $("input#nav_search").val("")
      nav_search()
    },1000)
    try{
      var a = link.split('book/')
      var controller = App.MainBookController.create();
      controller.send('book',a[1])
    }catch(error){
      console.log(error.message)
    }
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
    try{
      var controller = App.MainBookController.create();
          controller.send('review',a[1]);
          controller.send('suggested',a[1])
    }catch(error){  
      console.log(error)
    }
  },
  model: function(params, transition) {
    return { book_id: params.book_id }; 
  },
  
  serialize: function(model) {
    return { book_id: model.get('book_id') }; 
  },
  actions:{
    // openModal: function(modalName, model) {
    //   setTimeout(function(){
    //     if(modalName=='borrow'){
    //       $('#list_pustaka').html(borrow_pustaka)
    //     }
    //     if(modalName=='synopsis'){
    //       $('#detil_synopsis').html(App.book_synopsis)
    //     }
    //   });
    //   // $('#login_screen').addClass('blur')
    //   return this.render(modalName, {
    //     into: 'application',
    //     outlet: 'modal'
    //   });
    // },
    // closeModal: function() {
    //   $('#login_screen').removeClass('blur')
    //   return this.disconnectOutlet({
    //     outlet: 'modal',
    //     parentView: 'application'
    //   });
    // }
  }
});
App.EpustakaRoute = Ember.Route.extend({
  setupController:function(){
    // alert('buku')
    var link = location.href;
    user_tab="book";
    setTimeout(function(){
      $('#cat_lib').hide();
      $('#cat_store').hide();
      $('.side-menu').removeClass('side-open').addClass('side-close');
      $('.right-menu').removeClass('right-open');
      $('.main').removeClass('blur')
      $('.pre').hide();
      $('#nav_search_result').html('').hide();
      $("input#nav_search").val("")
      nav_search()
    },1000)
    try{
      var a = link.split('epustaka/')
      var controller = App.MainEpustakaController.create();
      controller.send('epustaka',a[1])
    }catch(error){
      console.log(error.message)
    }
    // setTimeout(function(){
    //   $('#navigasi span').removeClass('red')
    //   $('#icn_library').addClass('red')
    // })

    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
  },
  model: function(params, transition) {
    return { epustaka_id: params.epustaka_id }; 
  },
  
  serialize: function(model) {
    return { epustaka_id: model.get('epustaka_id') }; 
  }
});
App.AuthorRoute = Ember.Route.extend({
  setupController:function(){
    // alert('buku')
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
    var link = location.href;
    setTimeout(function(){
      $('#cat_lib').hide();
      $('#cat_store').hide();
    })
    try{
      var a = link.split('author/')
      var controller = App.AuthorController.create();
      setTimeout(function(){
        controller.send('author',a[1])
      }) 
    }catch(error){
      console.log(error.message)
    }
  },
  model: function(params, transition) {
    return { auhtor_id: params.author_id }; 
  },
  
  serialize: function(model) {
    return { author_id: model.get('author_id') }; 
  }
});
App.UserRoute = Ember.Route.extend({
  setupController:function(){
    // alert('buku')
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
    var link = location.href;
    setTimeout(function(){
      $('#cat_lib').hide();
      $('#cat_store').hide();
      $('.main').click()
      $('.side-menu').removeClass('side-open').addClass('side-close');
      $('.right-menu').removeClass('right-open');
      $('.main').removeClass('blur')
      $('.pre').hide();
      $('#nav_search_result').html('').hide();
      $("input#nav_search").val("")
      nav_search()
    },1000)
    try{
      var a = link.split('user/')
      console.log(a[1])
      var controller = App.UserController.create();
      setTimeout(function(){
        controller.send('user',a[1])
      }) 
    }catch(error){
      console.log(error.message)
    }
  },
  model: function(params, transition) {
    return { auhtor_id: params.author_id }; 
  },
  
  serialize: function(model) {
    return { author_id: model.get('author_id') }; 
  }
});
App.NotesRoute = Ember.Route.extend({
  setupController:function(){
    var token = localStorage.getItem('token');
    user_tab="book";
    if(token){
      var controller = App.NotesController.create();
      try{
        controller.send('list')
      }catch(error){
        console.log(error.message)
      }
      setTimeout(function(){
        $('#cat_lib').hide();
        $('#cat_store').hide();
        $('#navigasi span').removeClass('red')
        $('#icn_note').addClass('red')
        $('.side-menu').removeClass('side-open').addClass('side-close');
        $('.right-menu').removeClass('right-open');
        $('.main').removeClass('blur')
        $('.pre').hide();
        $('#nav_search_result').html('').hide();
        $("input#nav_search").val("")
        nav_search()
      },1000)
    }else{
      window.location.href="#/login"
    }
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
  },
  model: function(params, transition) {
    return { notes_id: params.notes_id }; 
  },
  serialize: function(model) {
    return { notes_id: model.get('notes_id') }; 
  }
});
App.ReaderRoute = Ember.Route.extend({
  setupController:function(){
    setTimeout(function(){
      user_tab="book"
      var link = location.href.split('reader/')
      console.log(link[1]);
      var url = link[1].split('_type_');
      console.log(url);
      var controller = App.ReaderController.create();
      if(url[0]=="epub"){
        controller.send('epub',url[1].replace(/\*/g,'/'))
      }else{
        controller.send('pdf',url[1].replace(/\*/g,'/'))
      }
      App.history = location.href;
      setTimeout(function(){
        $('.dropdown-menu').click(function(e) {
          e.stopPropagation();
        });
      })
    },1000)
  },
  model: function(params, transition) {
    return { reader_id: params.reader_id }; 
  },
  serialize: function(model) {
    return { reader_id: model.get('reader_id') }; 
  },
  actions:{
    openModal: function(modalName, model) {
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },
    closeModal: function() {
      $('#login_screen').removeClass('blur')
      rec_user=[];
      rec_user_name=[];
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
App.PustakaRoute = Ember.Route.extend({
  model: function(params, transition) {
    return { pustaka_id: params.pustaka_id }; 
  },
  serialize: function(model) {
    return { pustaka_id: model.get('pustaka_id') }; 
  },
  setupController:function () {
    setTimeout(function() {
      $('#cat_lib').hide();
      $('#cat_store').hide();
    })
  }
});
App.ShelfRoute = Ember.Route.extend({
  setupController:function(){
    user_tab="book";
    clear_books();
    var token = localStorage.getItem('token');
    if(token){
      setTimeout(function(){
        $('#cat_lib').hide();
        $('#cat_store').hide();
        $('.side').removeClass('active');
        $('#store').addClass('active');
        $('.main').removeClass('blur');
        $('.pre').hide();
        $('.main').removeClass('blur');
        $('.side-menu').removeClass('side-open');
        $('#navigasi span').removeClass('u')
        $('#icn_shelf span').addClass('u');
        dir('create',homePath+'/.iNgawi/files');
      },1);
      localStorage.setItem('history',location.href)
      var link = location.href.split('shelf/')
      console.log(link[1])
      if(link[1]){
        if(link[1]=="current"){
          var controller = App.ShelfCurrentController.create();
          controller.send('current')
          setTimeout(function(){
            $('.btn').removeClass('act')
            $('#s1').addClass('act')
            $('.collection').hide();
            $('#current').show();
          })
        }else if(link[1]=="want"){
          var controller = App.ShelfWantController.create();
          controller.send('want')
          setTimeout(function(){
            $('.btn').removeClass('act')
            $('#s2').addClass('act')
            $('.collection').hide();
            $('#want').show();
          })
        }else{
          var controller = App.ShelfHistoryController.create();
          controller.send('history')
          setTimeout(function(){
            $('.btn').removeClass('act')
            $('#s3').addClass('act')
            $('.collection').hide();
            $('#history').show();
          })
        }
      }
    }else{
      location.href="#/login"
    }
    // var controller = App.ChatController.create();
    // controller.send('list_chat','dropdown')
    // setTimeout(function(){
    //   var controller = App.NotifController.create();
    //   controller.send('list_notif')
    // })
  },
  model: function(params, transition) {
    return { shelf_id: params.shelf_id }; 
  },
  serialize: function(model) {
    return { shelf_id: model.get('shelf_id') }; 
  }
});
App.IntroRoute=Ember.Route.extend({
  setupController:function(){
  }
})
App.ChatRoute=Ember.Route.extend({
  setupController:function(){
    setTimeout(function(){
      $('#cat_lib').hide();
      $('#cat_store').hide();
      // $('.main').css('bottom','0px');
      var controller = App.ChatController.create();
      controller.send('list_chat')
    })
  },
  actions:{
    openModal: function(modalName, model, param) {
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
})
App.SearchRoute=Ember.Route.extend({
  setupController:function(){
    user_tab="book";
    App.searchHistory = window.history.length-1;
    console.log('search')
    setTimeout(function(){
      search('collection');
      $('#cat_lib').hide();
      $('#cat_store').hide();
      $('.side-menu').removeClass('side-open').addClass('side-close');
      $('.right-menu').removeClass('right-open');
      $('.main').removeClass('blur')
      $('.pre').hide();
      $('#nav_search_result').html('').hide();
      // $("input#nav_search").val("")

      // $('#navigasi span').removeClass('red')
      // $('#icn_search').addClass('red')
      
      // $('#people a').attr('onclick',"search('people')")
      // $('#collection a').attr('onclick',"search('collection')")
      // $('#pustaka a').attr('onclick',"search('pustaka')")
    },1000)
    var link = location.href.split('search/');
    // console.log(link)
    if(link[1]){
      setTimeout(function(){
        // search('people')
        $('.list div').hide();
        $('#list_collection').show();
        console.log(link[1])
        $("input#query_search").val(link[1])
        setTimeout(function(){
          console.log('search '+link[1])
          search_live(link[1],'collection')
          $("input#nav_search").val(link[1])
        },3000)
      },1000)
    }
    //search('people')
  },
  model: function(params, transition) {
    return { search_id: params.search_id }; 
  },
  serialize: function(model) {
    return { search_id: model.get('search_id') }; 
  }
})
App.IntroController = Ember.ArrayController.extend({
  init:function(){
    try{
      intro0 = setTimeout(function(){
        location.href="#/intro/na"
          intro1 = setTimeout(function(){
            location.href="#/main/store/index"
          },5000)
      },10000)
      // intro0 = setTimeout(function(){
      //   location.href="#/intro/na"
      //   intro1 = setTimeout(function(){
      //     location.href="#/intro/ca"
      //     intro2 = setTimeout(function(){
      //       location.href="#/intro/ra"
      //       intro3 = setTimeout(function(){
      //         location.href="#/main/store/index"
      //       },5000)
      //     },5000)
      //   },5000)
      // },10000)
      
      // var a = location.href.split('intro/');
      // console.log(a[1])
      // var controller = App.MainStoreController.create();
      // if(a[1]!="undefined"){
      //   if(a[1]=="ha"){
      //     setTimeout(function(){
      //       location.href="#/intro/na"
      //       setTimeout(function(){
      //         location.href="#/login"
      //       },5000)
      //     },5000)
      //   }
      //   if(a[1]=="na"){
      //     setTimeout(function(){
      //       location.href="#/login"
      //     },5000)
      //   }
      // }
    }catch(error){
      console.log(error.message)
    }
  }
})

