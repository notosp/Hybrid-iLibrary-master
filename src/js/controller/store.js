App.MainStoreController = Ember.ArrayController.extend({
  init:function(){
  },
  actions:{
    books:function(sort,type,id,name){
      $('.main').removeClass('blur');
      $('.side-menu').removeClass('side-open');
      $("#collection").html('')
      //location.href='#/main/store/'+sort;
      ga_pages('/store','Moco Store');
      ga_action('Book','Filter',sort);
      document.title="Koleksi";
      setTimeout(function(){
        $('.cat').removeAttr('style')
        if(id){
          $('#kategori').html(name.replace(/-/g,' ').replace(/--/g,'/'));
        }else{
          console.log(sort)
          if(sort=="newest"){
            $('#kategori').html('Terbaru')
          }else if(sort=="recommended"){
            $('#kategori').html('Kategori Buku')
            sort = "index";
          }else if(sort=="populer"){
            $('#kategori').html('Populer')
          }else if(sort=="all"){
            $('#kategori').html('Kategori Buku')
          }else if(sort=="index"){
            $('#kategori').html('Kategori Buku')
          }else{
            $('#kategori').html(sort)
          }
          // $('#kategori').html(sort)
          $('#'+sort).css('color','#c92036')
        }
      })
      morebooks = false;
      if(id){
        local = ReadData('_cat'+id)
      }else if(sort){
        local = ReadData('_sort'+sort);
      }else{
        local = ReadData('_sortreviews')
      }
      if(local!=null){
        setTimeout(function(){
          var controller = App.MainStoreController.create();
          if(id){
            controller.send('parsebook',local,0,undefined,type,id)
          }else{
            controller.send('parsebook',local,0,sort)
          }
          // $(document).on("scrollstart",function(event){
          //   console.log(event)
          //   if($(".store").scrollTop()>180){
          //     $('.kategori').addClass('fix')
          //   }
          //   if($(".store").scrollTop()<150){
          //     $('.kategori').removeClass('fix')
          //   }
          // })
        },1)
      }
      
      // setTimeout(function(){
        // $('#dg-container').gallery({
          // autoplay:true
        // });
      // })
      var token = localStorage.getItem('token')
      var before = $("#collection").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
      if(id){
        var check = new majax_fast('books/sort/category',{'client_id':App.api.client_id,'access_token':token,'category_id':id,'per_page':10},before);
      }else if(sort){
        var check = new majax_fast('books/sort/'+sort,{'client_id':App.api.client_id,'access_token':token,'per_page':10},before);
      }else{
        var check = new majax_fast('books/sort/reviews',{'client_id':App.api.client_id,'access_token':token,'per_page':10},before);
      }
      check.success(function(data){
        //$(".moco-load").removeClass('fa fa-spin').hide();
        if(data.meta.code==200){
          if(data.data.total_result<10){
            $('#btn-loadmore_store').hide();
          }else{
            $('#btn-loadmore_store').show();
          }
          if(id){
            WriteData('_cat'+id, data);
          }else if(sort){
            WriteData('_sort'+sort, data);
          }else{
            WriteData('_sortreviews', data);
          }
          $('#collection').attr('data-index',3);
          // if(local==null){
            var controller = App.MainStoreController.create();
            if(id){
              controller.send('parsebook',data,0,undefined,type,id)
            }else{
              controller.send('parsebook',data,0,sort,type)
            }
          // }
        }else{
          if(data.meta.code=="401"){
            location.href="#/login"
          }else{
            $("#collection").html('<br><center>'+data.meta.error_message+'<center>')
            $('#btn-loadmore_store').hide();
          }
        }
      })
      check.error(function(data){
        $("#collection").html('');
        $('#btn-loadmore_store').hide();
      })
    },
    morebooks:function(sort,id){
      if(morebooks){
    
      }else{
        // console.log(sort)
        morebooks=true;
        var token = localStorage.getItem('token');
        var before = $('#load_more_').addClass('moco-load');
        var index = $('#collection').attr('data-index')
        // console.log(index)
        if(id){
          var notes = new majax_fast('books/sort/category',{'client_id':App.api.client_id,'access_token':token,'category_id':id,'per_page':5,'page':index},before);
        }else if(sort){
          var notes = new majax_fast('books/sort/'+sort,{'client_id':App.api.client_id,'access_token':token,'per_page':5,'page':index},before);
        }else{
          var notes = new majax_fast('books/sort/reviews',{'client_id':App.api.client_id,'access_token':token,'per_page':5,'page':index},before);
        }
        // notes = new majax_fast('feeds',{'access_token':token,'per_page':5,'page':index},before);
        notes.success(function(data){
          $('#load_more_').removeClass('moco-load');
          morebooks = false
          if(data.meta.code==200){
              // WriteData('_feed', data);
              $('#collection').attr('data-index',parseInt(index)+1);
              var controller = App.MainStoreController.create();
              if(id){
                controller.send('parsebook',data,1,undefined,undefined,id)
              }else{
                controller.send('parsebook',data,1,sort)
              }
          }else{
            $('#btn-loadmore_store').hide();
            morebooks = true;
            //$('#dg-container').removeClass('dg-container').removeAttr('id')
            var wall = new freewall("#collection");
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
            var height = parseInt($('#collection').attr('data-wall-height'));
            // console.log(height);
            height=height+150;
            // console.log(height)
            $('#collection').css('height',height)
          }
        })
        notes.error(function(data){
          $('#load_more_').removeClass('moco-load');
          $('#btn-loadmore_store').hide();
        })
      }
    },
    parsebook:function(data,index,sort,type,id){
      // console.log(id)
      var token = localStorage.getItem('token')
      books_text='';
      var slide = '';
      var wall = new freewall("#collection");
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
        if(Book.is_free=="1"){
          free='<span style="position:absolute;"><img src="img/icon/free.png"></span>'
        }else{
          free=''
        }
        if(Book.extension=="mp4"){
          var error = 'VidError(this)'
        }else if(Book.extension=="mp3"){
          var error = 'AudError(this)'
        }else{
          var error = 'CovError(this)'
        }
        books_text += '<div class="books b-white">\
          <div class="content">\
          <div class="image">'+free+'<a href="#/main/book/'+Book.id+'"><img class="" src="'+Book.cover+'" style="width:100%;min-height:260px" onerror="'+error+'"></a></div>';
        if(token){
          if(Statistic.has_wishlist=="0"){
            // var act_want = 'add_want('+Book.id+')'
            var act_want = ""
          }else{
            var act_want = ""
          }
        }else{
          var act_want = "location.href='#/login'"
        }
        if(Statistic.has_queue=='1'){
          var c_want = 'red'
        }else{
          var c_want = 'black'
        }
        if(Statistic.total_queues==0){
          var antrian = "Tidak Ada Antrian";
        }else{
          var antrian = Statistic.total_queues+" Orang Mengantri";
        }
        books_text+='</div>\
          <div class="tail">\
            <div class="title black">'+Book.title+'</div>\
            <div class="author blue">'+Book.authors+'</div>\
            <div class="f10 black" style="padding-top:3px;"><span>Pembaca: <b>'+Statistic.total_has_borrow+'</b></span><span> Ulasan: <b>'+Statistic.total_reviews+'</b></span></div>\
          </div>\
          <div class="stat black">\
            <div class="col-md-12 col-xs-12 pointer" onclick="'+act_want+'" style="border-right-color:transparent" ><span class="moco-ij_queue store_stat '+c_want+'"></span><span id="want-'+Book.id+'" class="'+c_want+'"> '+antrian+'</span></div>\
            <!--<div class="col-md-6 col-xs-6 pointer" onclick="share(\'Book\',\''+Book.id+'\',\''+Book.url_profile+'\',\''+Book.title.replace(/'/g,'').replace(/"/g,'' )+'\',\''+Book.cover+'\')"><span class="moco-share store_stat grey"></span> Bagikan</div>-->\
            </div>\
        </div>';
        slide +='<a href=""><div><img src="'+Book.cover+'" alt="'+Book.cover+'"><div class="det"><div class="type">Books</div><div class="title">'+Book.title+'</div><div class="author"> '+Book.authors+'</div><div class="point">'+Book.price/1000+' Point</div></div></div></a>'
      });
      if(type){

      }else{
        if(id){
          $('#btn-loadmore_store').attr('onclick','store_morestore(\''+sort+'\',\''+id+'\')')
        }else{
          $('#btn-loadmore_store').attr('onclick','store_morestore(\''+sort+'\')')
        }
        // console.log(index)
        if(index==0){
          $('#collection').html(books_text);
          var images = wall.container.find('.books');
          images.find('img').load(function() {
            wall.fitWidth();
          });
          // var controller = App.MainStoreController.create();
          // if(id){
          //   controller.send('endlessbooks',sort,id)
          // }else{
          //   controller.send('endlessbooks',sort)
          // }
        }else{
          $('#collection').append(books_text);
          wall.refresh();
          // var controller = App.MainStoreController.create();
          // if(id){
          //   controller.send('endlessbooks',sort,id)
          // }else{
          //   controller.send('endlessbooks',sort)
          // }
        }
        jQuery(function($){
          console.log(index,sort,type,id)
          $('.store').unbind();
          $('.store').bind('scroll', function()
            {
              if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
              {
                store_morestore(sort,id)
                var wall = new freewall("#collection");
                wall.reset({
                  selector: '.books',
                  cellW: 180,
                  cellH: 'auto',
                  animate:false,
                  // delay:50,
                  onResize: function() {
                    wall.fitWidth();
                  }
                });
                wall.refresh();
              }
            })
          }
        );
      }
    },
    endlessbooks:function(sort,id,stat){
      if(morebooks){
      }else{
        $(".store").endlessScroll({
          fireOnce: false,
          fireDelay: false,
          fireOnce:true,
          ceaseFireOnEmpty: false,
          inflowPixels:100,
          insertAfter: "#list div:last",
          loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
          callback: function(){
            var controller = App.MainStoreController.create();
            if(id){
              controller.send('morebooks',false,sort,id)
            }else{
              controller.send('morebooks',false,sort)
            }
          }
        });
      }
    },
    recommended:function(){
      var local ="";
      local = ReadData('_sortrecommended');
      if(local){
        var controller = App.MainStoreController.create();
        controller.send('parserecommended',local)
      }else{
        var check = new majax_fast('books/sort/recommended',{'client_id':App.api.client_id,'per_page':20},before);
        check.success(function(data){
          if(data.meta.code==200){
            WriteData('_sortrecommended', data);
            var controller = App.MainStoreController.create();
            controller.send('parserecommended',data)
          }
        })
      }
    },
    parserecommended:function(data){
      var slide ="";
      $.each(data.data.data,function(){
        var Book=this.Book;
        var Statistic=this.Statistic;
        slide +='<a href="#/main/book/'+Book.id+'"><div><img src="'+Book.cover+'" alt="'+Book.cover+'"><div class="det"><div class="type">Books</div><div class="title">'+limitCharacter(Book.title,50)+'</div><div class="author"> '+limitCharacter(Book.authors,50)+'</div><div class="point">'+Book.price/1000+' Point</div></div></div></a>'
      });
      setTimeout(function(){
        $('.dg-wrapper').html(slide);
        $('#dg-container').gallery({
          autoplay:true
        });
      })
    }
  }
})

function store_morestore(sort,id,stat){
  var controller = App.MainStoreController.create();
  if(id){
    controller.send('morebooks',sort,id)
  }else{
    controller.send('morebooks',sort)
  }
}

function open_share(id,title,cover,url){
  $('#btn-share').click();
  $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+url+'&picture='+cover+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0");ga_book(1)');
  $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text=Reading '+limitCharacter(title,20)+' via moco desktop&url='+url+'");ga_book(2)');
  $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+url+'");ga_book(3)');
  $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Read Book &Body='+title+'%20%0A'+url+' %20%0A via moco desktop");ga_book(4)');
  $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+url+'");ga_book(5)');

}