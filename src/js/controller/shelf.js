App.ShelfController = Ember.ArrayController.extend({
  actions:{
    currents:function(){
      // alert('currents')
      // $('.collection').hide();
      // $('#current').show();
      // var controller = App.ShelfCurrentController.create();
      // controller.send('current');
      location.href="#/main/shelf/current";
    },
    wants:function(){
      // $('.collection').hide();
      // $('#want').show();
      // var controller = App.ShelfWantController.create();
      // controller.send('want');
      location.href="#/main/shelf/want";
    },
    histories:function(){
      // $('.collection').hide();
      // $('#history').show();
      // var controller = App.ShelfHistoryController.create();
      // controller.send('history');
      location.href="#/main/shelf/history";
    }
  }
})
App.ShelfCurrentController = Ember.ArrayController.extend({
  init:function(){
    // alert('saya')
    // this.send('current')
  },
  actions:{
    current:function(sort){
      document.title="Pinjaman";
      var local_profile = ReadData('profile');
      if(local_profile!=null){
          main_parse_profile(local_profile)
      }
      // location.href='#main/shel';
      ga_pages('/shelf/current','Current Books');
      ga_action('Book','Shelf','current');
      morecurrent = false;
      local = ReadData('_current');
      del_unused();
      if(local!=null){
        setTimeout(function(){
          var controller = App.ShelfCurrentController.create();
          controller.send('parsecurrent',local,0)
        },1)
      }
      var before = $("#current").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
      var token =window.localStorage.getItem('token');
      var check = new majax_fast('items/index',{'access_token':token,'per_page':12},before)
      check.success(function(data){
        $("#collection").removeClass('fa fa-spin moco-load');
        if(data.meta.code==200){
          var back = window.location.href;
          window.localStorage.setItem('back',back);
          WriteData('_current', data);
          if(ReadData('olcm')=="1"){
            WriteData('_current_local', data);
          }else{

          }
          $('#current').attr('data-index',2);
          // if(local!=null){

          // }else{
            var controller = App.ShelfCurrentController.create();
            controller.send('parsecurrent',data,0)
          // }
        }else if(data.meta.code=="401"){
          logout_();
          var controller = App.ShelfCurrentController.create();
          controller.send('current')
        }else{
          if(ReadData('olcm')=="2"){
          }else{
            $("#current").html('<br><center>'+data.meta.error_message+'</center>');
          }
        }
        if(ReadData('olcm')=="2"){
          var olcm_data = ReadData('_current_local');
          console.log(olcm_data)
          if(olcm_data!=null){
            var controller = App.ShelfCurrentController.create();
            controller.send('parsecurrent',olcm_data,1)
          }
        }
      })
      check.error(function(data){
        $("#current").html('');
      })
    },
    morecurrent:function(data){
      console.log(data)
      if(morecurrent){

      }else{
        morecurrent=true;
        var token = localStorage.getItem('token');
        var before = ''
        var index = $('#current').attr('data-index')
        var check = new majax_fast('items/index',{'access_token':token,'per_page':12,'page':index},before)
        // notes = new majax_fast('feeds',{'access_token':token,'per_page':5,'page':index},before);
        check.success(function(data){
          if(data.meta.code==200){
            morecurrent = false
              // WriteData('_feed', data);
              $('#current').attr('data-index',parseInt(index)+1);
              var controller = App.ShelfCurrentController.create();
              controller.send('parsecurrent',data,1)
            }else{
              morecurrent=true;
              var wall = new freewall("#current");
              wall.reset({
                selector: '.books',
                animate: false,
                cellW: 180,
                cellH: 'auto',
                // delay:50,
                onResize: function() {
                  wall.fitWidth();
                }
              });
              wall.fitWidth();
              var height = parseInt($('#current').attr('data-wall-height'));
              console.log(height);
              height=height+120;
              console.log(height)
              $('#current').css('height',height+'px')
              $('.books').last().css('height','')
            }
        })
        check.error(function(data){

        })
      }
    },
    parsecurrent:function(data,index){
      books_text='';
      var wall = new freewall("#current");
      wall.reset({
        selector: '.books',
        animate: false,
        cellW: 180,
        cellH: 'auto',
        // delay:50,
        onResize: function() {
          wall.fitWidth();
        }
      });
      wall.fitWidth();
      //console.log(data);
      $.each(data.data.data,function(){
        var Book=this.Book;
        var Statistic=this.Statistic;
        var Item = this.Item
        var opacity = 0.4;
        var act = "location.href='#/main/book/"+Book.id+"'"
        window.localStorage.setItem('link_profile',Book.url_profile)
        // var root = homePath+"/.iNgawi/";
        // var file=Item.out.split('/');
        // var path = homePath+'/.iNgawi/files/uploads/'+Item.session+'/'+file[file.length - 1].replace('_out.zip','/');
        // var path1 = homePath+'/.iNgawi/'+file[file.length - 1];
        // var link = '/.iNgawi/files/uploads/'+Item.session+'/'+file[file.length - 1].replace('_out.zip','/');
        if(Book.extension=="mp4"){
          var error = 'VidError(this)'
        }else if(Book.extension=="mp3"){
          var error = 'AudError(this)'
        }else{
          var error = 'CovError(this)'
        }
        act = 'shelf_donasi('+Book.id+',\''+Item.out+'\',\''+Item.pass+'\',\''+Item.session+'\',\''+Book.extension+'\',\''+Book.cover+'\',\''+Book.url_profile+'\',\''+Item.security_version+'\')';
        opacity = 'opacity:1'
        if(Item.read_percentage!=null){
          if(Item.read_percentage=="100"){
            var persen = 'DONE READ';
            var style = 'font-size:26px;padding-top:40px'
          }else{
            var persen = parseInt(Item.read_percentage)+'%';
            var style = '';
          }
        }else{
          var persen = '0%';
          var style = '';
        }
        books_text += '<div class="books b-white bookcur_'+Item.id+'" style="min-height:234px;background:#ddd;">\
          <div class="content" style="padding:0">\
          <div class="image pointer book_cover_act" onclick="'+act+'" id="book_cover_'+Book.id+'">\
          <img class="shadow" src="'+Book.cover+'" style="width:100%;opacity:'+opacity+';" id="book_cover_'+Book.id+'" onerror="'+error+'"></div>';
        books_text+='<div class="shelf_back hide" style="z-index:999">\
        <div style="height:73%;text-align:center">\
          <div class="shelf_circle" style="'+style+'">'+persen+'</div>\
        </div>\
        <div style="height:12%"><center class="white">Masa Berlaku '+Item.remaining_days+'</center></div>\
        <div style="height:15%" class="pointer">\
          <div class="shelf_act pointer" onclick="dialog(\'shelf\',\''+Item.id+'\',\'current\')"><span class="moco-trash"></span> Hapus Buku ini</div>\
        </div></div>\
         <div class="caption shelf_back hide" id="download_'+Book.id+'" style=""></div>\
        </div>\
        </div>';
        });
      if(index==0){
        $('#current').html(books_text);
        var images = wall.container.find('.books');
        images.find('img').load(function() {
          wall.fitWidth();
        });
        var controller = App.ShelfCurrentController.create();
        controller.send('endlesscurrent');
      }else{
        $('#current').append(books_text);
        wall.refresh();
      }
    },
    endlesscurrent:function(){
      if(morecurrent){

      }else{
        $(".list").endlessScroll({
          fireOnce: false,
          fireDelay: false,
          fireOnce:true,
          ceaseFireOnEmpty: false,
          inflowPixels:100,
          insertAfter: "#list div:last",
          loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
          callback: function(){
            var controller = App.ShelfCurrentController.create();
            controller.send('morecurrent',false);
          }
        });
      }
    }
  }
})
App.ShelfWantController = Ember.ArrayController.extend({
  init:function(){

  },
  actions:{
    want:function(sort){
      document.title="Antrian";
      ga_pages('/shelf/Queue','Queue Books');
      ga_action('Book','Shelf','queue');
      morewant = false;
      local = ReadData('_queue');
      if(local!=null){
        setTimeout(function(){
          var controller = App.ShelfHistoryController.create();
          controller.send('parsewant',local,0)
        },1)
      }
      var before = $("#want").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
      var token =window.localStorage.getItem('token');
      var check = new majax_fast('queues/index',{'client_id':App.api.client_id,'user_id':ReadData('user_id'),'per_page':12},before)
      check.success(function(data){
        $("#want").removeClass('fa fa-spin moco-load');
        if(data.meta.code==200){
          WriteData('_queue', data);
          $('#want').attr('data-index',2);
          var controller = App.ShelfWantController.create();
          controller.send('parsewant',data,0)
        }else if(data.meta.code=="401"){
          logout_();
          var controller = App.ShelfHistoryController.create();
          controller.send('want',sort)
        }else{
          $("#want").html('<br><center>'+data.meta.error_message+'</center>');
        }
      })
      check.error(function(data){
        $("#want").html('');
      })
    },
    morewant:function(data){
      if(morewant){

      }else{
        morewant=true;
        var token = localStorage.getItem('token');
        var before = ''
        var index = $('#want').attr('data-index')
        var check = new majax_fast('queues/index',{'client_id':App.api.client_id,'user_id':ReadData('user_id'),'per_page':12,'page':index},before)
        // notes = new majax_fast('feeds',{'access_token':token,'per_page':5,'page':index},before);
        check.success(function(data){
          if(data.meta.code==200){
              morewant = false;
              // WriteData('_feed', data);
              $('#want').attr('data-index',parseInt(index)+1);
              var controller = App.ShelfWantController.create();
              controller.send('parsewant',data,1)
            }else{
              morewant=true;
              var wall = new freewall("#want");
              wall.reset({
                selector: '.books',
                animate: true,
                cellW: 180,
                cellH: 'auto',
                // delay:50,
                onResize: function() {
                  wall.fitWidth();
                }
              });
              wall.fitWidth();
              var height = parseInt($('#want').attr('data-wall-height'));
              console.log(height);
              height=height+120;
              console.log(height)
              $('#want').css('height',height+'px')
              $('.books').last().css('height','')
            }
        })
        check.error(function(data){

        })
      }
    },
    parsewant:function(data,index){
      books_text='';
      var wall = new freewall("#want");
      wall.reset({
        selector: '.books',
        animate: true,
        cellW: 180,
        cellH: 'auto',
        // delay:50,
        onResize: function() {
          wall.fitWidth();
        }
      });
      wall.fitWidth();
      console.log(data);
      $.each(data.data.data,function(){
        var Book=this.Book;
        var Statistic=this.Statistic;
        var Wishlists = this.Queue
        var act="location.href='#/main/book/"+Book.id+"'"
        if(Book.extension=="mp4"){
          var error = 'VidError(this)'
        }else if(Book.extension=="mp3"){
          var error = 'AudError(this)'
        }else{
          var error = 'CovError(this)'
        }
        books_text += '<div class="books b-white bookwant_'+Wishlists.id+'" >\
          <div class="content" style="padding:0">\
          <div class="image pointer" onclick="'+act+'">\
          <img class="shadow" src="'+Book.cover+'" style="width:100%;" id="book_cover_'+Book.id+'" onerror="CovError('+error+')"></div>';
        books_text+='<div class="shelf_back hide">\
        <div style="height:85%;text-align:center">\
          <div class="" style=""></div>\
        </div>\
        <div style="height:15%" class="pointer">\
          <div class="shelf_act pointer" onclick="dialog(\'shelf\',\''+Wishlists.id+'\',\'want\')">Hapus Buku ini <span class="moco-trash"></span></div>\
        </div></div>\
         <div class="caption" id="download_'+Book.id+'" style="height:10px;width:100%;position:absolute;bottom:0;"></div>\
        </div>\
        </div>'

        // books_text += '<div class="books b-white">\
        //   <div class="content" style="padding:0">\
        //   <div class="image"><img class="shadow" src="'+Book.cover+'" style="width:100%" onerror="CovError(this)"></div>';
        // books_text+='</div>\
        // </div>'
      });
      if(index==0){
        $('#want').html(books_text);
        var images = wall.container.find('.books');
        images.find('img').load(function() {
          wall.fitWidth();
        });
        var controller = App.ShelfWantController.create();
        controller.send('endlesswant')
      }else{
        $('#want').append(books_text);
        wall.refresh();
        // var controller = App.ShelfWantController.create();
        // controller.send('endlesswant')
      }
    },
    endlesscurrent:function(){
      $(".list").endlessScroll({
        fireOnce: false,
        fireDelay: false,
        fireOnce:true,
        ceaseFireOnEmpty: false,
        inflowPixels:100,
        insertAfter: "#list div:last",
        loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
        callback: function(){
          var controller = App.ShelfWantController.create();
          controller.send('morewant',false)
        }
      });
    }
  }
})
App.ShelfHistoryController = Ember.ArrayController.extend({
  init:function(){

  },
  actions:{
    history:function(sort){
      morehistory=false;
      // location.href='#main/shelf/history';
      document.title="Riwayat";
      ga_pages('/shelf/history','History Books');
      ga_action('Book','Shelf','history');
      morebooks = false;
      local = ReadData('_history');
      if(local!=null){
        setTimeout(function(){
          var controller = App.ShelfHistoryController.create();
          controller.send('parsehistory',local,0)
        },1)
      }
      var before = $("#history").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
      var token =window.localStorage.getItem('token');
      var check = new majax_fast('items/history',{'access_token':token,'per_page':12},before)
      check.success(function(data){
        $("#history").removeClass('fa fa-spin moco-load');
        if(data.meta.code==200){
          WriteData('_history', data);
          $('#history').attr('data-index',2);
          var controller = App.ShelfHistoryController.create();
          controller.send('parsehistory',data,0)
        }else if(data.meta.code=="401"){
          logout_();
          var controller = App.ShelfHistoryController.create();
          controller.send('history',sort)
        }else{
          $("#history").html('<br><center>'+data.meta.error_message+'</center>');
        }
      })
      check.error(function(data){
        $("#history").html('');
      })
    },
    morehistory:function(data){
      if(morehistory){

      }else{
        morehistory=true;
        var token = localStorage.getItem('token');
        var before = ''
        var index = $('#history').attr('data-index')
        var check = new majax_fast('items/history',{'access_token':token,'per_page':12,'page':index},before)
        // notes = new majax_fast('feeds',{'access_token':token,'per_page':5,'page':index},before);
        check.success(function(data){
          if(data.meta.code==200){
              morehistory = false
              // WriteData('_feed', data);
              $('#history').attr('data-index',parseInt(index)+1);
              var controller = App.ShelfHistoryController.create();
              controller.send('parsehistory',data,1)
            }else{
              morehistory=true;
              var wall = new freewall("#history");
              wall.reset({
                selector: '.books',
                animate: true,
                cellW: 180,
                cellH: 'auto',
                // delay:50,
                onResize: function() {
                  wall.fitWidth();
                }
              });
              wall.fitWidth();
              var height = parseInt($('#history').attr('data-wall-height'));
              console.log(height);
              height=height+120;
              console.log(height)
              $('#history').css('height',height+'px')
              $('.books').last().css('height','')
            }
        })
        check.error(function(data){

        })
      }
    },
    parsehistory:function(data,index){
      books_text='';
      var wall = new freewall("#history");
      wall.reset({
        selector: '.books',
        animate: true,
        cellW: 180,
        cellH: 'auto',
        // delay:50,
        onResize: function() {
          wall.fitWidth();
        }
      });
      wall.fitWidth();
      console.log(data);
      $.each(data.data.data,function(){
        var Book=this.Book;
        var Statistic=this.Statistic;
        var Item = this.Item

        var act="location.href='#/main/book/"+Book.id+"'"
        if(Book.extension=="mp4"){
          var error = 'VidError(this)'
        }else if(Book.extension=="mp3"){
          var error = 'AudError(this)'
        }else{
          var error = 'CovError(this)'
        }
        books_text += '<div class="books b-white bookhis_'+Item.id+'">\
          <div class="content" style="padding:0">\
          <div class="image pointer" onclick="'+act+'">\
          <img class="shadow" src="'+Book.cover+'" style="width:100%;" id="book_cover_'+Book.id+'" onerror="CovError('+error+')"></div>';
        books_text+='<div style="height:85%;text-align:center">\
          <div class="" style=""></div>\
        </div>\
        <div style="height:15%" class="pointer hide">\
          <div class="shelf_act pointer" onclick="dialog(\'shelf\',\''+Item.id+'\',\'history\')">Hapus Buku ini <span class="moco-trash"></span></div>\
        </div></div>\
         <div class="caption" id="download_'+Book.id+'" style="height:10px;width:100%;position:absolute;bottom:0;"></div>\
        </div>'

        /*books_text+='<div class="shelf_back hide">\
        <div style="height:85%;text-align:center">\
          <div class="" style=""></div>\
        </div>\
        <div style="height:15%" class="pointer">\
          <div class="shelf_act pointer" onclick="dialog(\'shelf\',\''+Item.id+'\',\'history\')">Hapus Buku ini <span class="moco-trash"></span></div>\
        </div></div>\
         <div class="caption" id="download_'+Book.id+'" style="height:10px;width:100%;position:absolute;bottom:0;"></div>\
        </div>\
        </div>'*/

        // books_text += '<div class="books b-white">\
        //   <div class="content" style="padding:0">\
        //   <div class="image"><img class="shadow" src="'+Book.cover+'" style="width:100%" onerror="CovError(this)"></div>';
        // books_text+='</div>\
        // </div>'
      });
      if(index==0){
        $('#history').html(books_text);
        var images = wall.container.find('.books');
        images.find('img').load(function() {
          wall.fitWidth();
        });
        var controller = App.ShelfHistoryController.create();
        controller.send('endlesshistory')
      }else{
        $('#history').append(books_text);
        wall.refresh();
        // var controller = App.ShelfHistoryController.create();
        // controller.send('endlesshistory')
      }
    },
    endlesshistory:function(){
      if(morehistory){

      }else{
        $(".list").endlessScroll({
          fireOnce: false,
          fireDelay: false,
          fireOnce:true,
          ceaseFireOnEmpty: false,
          inflowPixels:100,
          insertAfter: "#list div:last",
          loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
          callback: function(){
            var controller = App.ShelfHistoryController.create();
            controller.send('morehistory',false)
          }
        });
      }
    }
  }
})
function dialog(divisi,id,type){
  console.log(divisi)
  console.log(id)
  console.log(type)
  if(divisi=="shelf"){
    App.Success_Alert ="Yakin untuk menghapus buku ini?"
    App.Success_Content = "Buku ini akan segera di hapus dan tidak bisa dipulihkan"
  }
  if(divisi=="notes"){
    App.Success_Alert ="Yakin untuk menghapus catatan ini?"
    App.Success_Content = "Catatan ini akan segera di hapus dan tidak bisa dipulihkan"
  }
  if(divisi=="chat"){
    App.Success_Alert ="Yakin untuk menghapus percapakan ini?"
    App.Success_Content = "Catatan ini akan segera di hapus dan tidak bisa dipulihkan"
  }
  $('#btn-conf_dialog').click();
  if(divisi=="shelf"){
    console.log('shelf')
    $('#act_try').attr('onclick','act_del(\''+id+'\',\''+type+'\')')
    $('#act_cancel').attr('onclick',"javascript:$('#btn-close_modal').click()")
    $('#text_conf').css('width','160px')
  }
  if(divisi=="notes"){
    $('#act_try').attr('onclick','del_notes(\''+id+'\')')
    $('#act_cancel').attr('onclick',"javascript:$('#btn-close_modal').click()")
    $('#text_conf').css('width','160px')
  }
  if(divisi=="chat"){
    $('#act_try').attr('onclick','del_chat(\''+id+'\')')
    $('#act_cancel').attr('onclick',"javascript:$('#btn-close_modal').click()")
    $('#text_conf').css('width','160px')
  }
}
function act_del(id,type){
  $('#btn-close_modal').click();
  var token = window.localStorage.getItem('token');
  if(type=="current"){
    var check = new majax_secure('items/delete_current',{'access_token':token,'item_id':id},'');
  }else if(type=="history"){
    var check = new majax_secure('items/delete_history',{'access_token':token,'item_history_id':id},'');
  // }else if(type=="want"){
  //   var check = majax_secure('wishlists/delete',{'access_token':token,'wishlist_id':id},'');
  // }
  }else if(type=="want"){
    var check = majax_secure('queues/delete',{'access_token':token,'wishlist_id':id},'');
  }
  check.success(function(data){
    if(data.meta.code==200){
      //console.log(data);
      App.Success_Alert ="Sukses"
      App.Success_Content = data.data;
      $('#success').click();
      if(type=="current"){
        $('.bookcur_'+id).css('display','none')
      }else if(type=="want"){
        $('.bookwant_'+id).css('display','none')
      }else if(type=="history"){
        $('.bookhis_'+id).css('display','none')
      }
    }else{
      App.Failed_Alert ="Gagal";
      App.isPopUp = false;
      App.Failed_Content = data.meta.error_message;
      $('#failed').click();
    }
  });
}
function shelf_donasi(book_id, out, pass, session, extension, cover, url_profile, security_version){
  // $('#com-donatur').click()
  // var controller = App.MainBookController.create();
  // controller.send('donasi',book_id)
  download_book(book_id,out,pass,session,extension,cover,url_profile,security_version);
}


// App.ShelfWantController = Ember.ArrayController.extend({
//   init:function(){

//   },
//   actions:{
//     want:function(sort){
//       document.title="Want";
//       ga_pages('/shelf/want','Want Books');
//       ga_action('Book','Shelf','want');
//       morewant = false;
//       local = ReadData('_want');
//       if(local!=null){
//         setTimeout(function(){
//           var controller = App.ShelfHistoryController.create();
//           controller.send('parsewant',local,0)
//         },1)
//       }
//       var before = $("#want").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
//       var token =window.localStorage.getItem('token');
//       var check = new majax_fast('items/want',{'client_id':App.api.client_id,'user_id':ReadData('user_id'),'per_page':12},before)
//       check.success(function(data){
//         $("#want").removeClass('fa fa-spin moco-load');
//         if(data.meta.code==200){
//           WriteData('_want', data);
//           $('#want').attr('data-index',2);
//           var controller = App.ShelfWantController.create();
//           controller.send('parsewant',data,0)
//         }else{
//           $("#want").html('<br><center>'+data.meta.error_message+'</center>');
//         }
//       })
//       check.error(function(data){
//         $("#want").html('');
//       })
//     },
//     morewant:function(data){
//       if(morewant){

//       }else{
//         morewant=true;
//         var token = localStorage.getItem('token');
//         var before = ''
//         var index = $('#want').attr('data-index')
//         var check = new majax_fast('items/want',{'client_id':App.api.client_id,'user_id':ReadData('user_id'),'per_page':12,'page':index},before)
//         check.success(function(data){
//           if(data.meta.code==200){
//               morewant = false;;
//               $('#want').attr('data-index',parseInt(index)+1);
//               var controller = App.ShelfWantController.create();
//               controller.send('parsewant',data,1)
//             }else{
//               morewant=true;
//               var wall = new freewall("#want");
//               wall.reset({
//                 selector: '.books',
//                 animate: true,
//                 cellW: 180,
//                 cellH: 'auto',
//                 onResize: function() {
//                   wall.fitWidth();
//                 }
//               });
//               wall.fitWidth();
//               var height = parseInt($('#want').attr('data-wall-height'));
//               console.log(height);
//               height=height+120;
//               console.log(height)
//               $('#want').css('height',height+'px')
//               $('.books').last().css('height','')
//             }
//         })
//         check.error(function(data){

//         })
//       }
//     },
//     parsewant:function(data,index){
//       books_text='';
//       var wall = new freewall("#want");
//       wall.reset({
//         selector: '.books',
//         animate: true,
//         cellW: 180,
//         cellH: 'auto',
//         // delay:50,
//         onResize: function() {
//           wall.fitWidth();
//         }
//       });
//       wall.fitWidth();
//       console.log(data);
//       $.each(data.data.data,function(){
//         var Book=this.Book;
//         var Statistic=this.Statistic;
//         var Wishlists = this.Wishlists
//         var act="location.href='#/main/book/"+Book.id+"'"
//         books_text += '<div class="books b-white bookwant_'+Wishlists.id+'" >\
//           <div class="content" style="padding:0">\
//           <div class="image pointer" onclick="'+act+'">\
//           <img class="shadow" src="'+Book.cover+'" style="width:100%;" id="book_cover_'+Book.id+'" onerror="CovError(this)"></div>';
//         books_text+='<div class="shelf_back hide">\
//         <div style="height:85%;text-align:center">\
//           <div class="" style=""></div>\
//         </div>\
//         <div style="height:15%" class="pointer">\
//           <div class="shelf_act pointer" onclick="dialog(\'shelf\',\''+Wishlists.id+'\',\'want\')">Hapus Buku ini <span class="moco-trash"></span></div>\
//         </div></div>\
//          <div class="caption" id="download_'+Book.id+'" style="height:10px;width:100%;position:absolute;bottom:0;"></div>\
//         </div>\
//         </div>'
//       });
//       if(index==0){
//         $('#want').html(books_text);
//         var images = wall.container.find('.books');
//         images.find('img').load(function() {
//           wall.fitWidth();
//         });
//         var controller = App.ShelfWantController.create();
//         controller.send('endlesswant')
//       }else{
//         $('#want').append(books_text);
//         wall.refresh();
//       }
//     },
//     endlesscurrent:function(){
//       $(".list").endlessScroll({
//         fireOnce: false,
//         fireDelay: false,
//         fireOnce:true,
//         ceaseFireOnEmpty: false,
//         inflowPixels:100,
//         insertAfter: "#list div:last",
//         loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
//         callback: function(){
//           var controller = App.ShelfWantController.create();
//           controller.send('morewant',false)
//         }
//       });
//     }
//   }
// })