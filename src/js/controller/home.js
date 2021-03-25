App.MainHomeController = Ember.ArrayController.extend({
  init:function(){
    
  },
  actions:{
    books_genre:function(){
      try{  
        var book='';
        var local = ReadData('_books_genre');
        var controller = App.MainHomeController.create();
        if(local!=null){
          controller.send('parse_genre',local,'#genre_book','book')
        }
        var check = new majax_fast('categories/index',{'client_id':App.api.client_id,'type_id':'1'},'',600000);
        check.error(function(data) {
        }),
        check.success(function(data){
          if(data.meta.code==200){
            setTimeout(function(){
              WriteData('_books_genre', data)
              controller.send('parse_genre',data,'#genre_book','book')
            },5000)
          }
        });
      }catch(error){
        console.log(error.message)
      }
    },
    parse_genre:function(data,link,type){
      // console.log(type)
      // console.log(link);
      if(type=="book"){
        var book='';
        // book+='<li class="cat" id="recommended"><a href=\'#/main/store/recommended\'><span>Rekomendasi</span></a></li>\
        //             <li class="cat" id="newest" style="display:none"><a href=\'#/main/store/newest\'><span>Terbaru</span></a></li>\
        //             <li class="cat" id="populer" style="display:none"><a href=\'#/main/store/populer\'><span>Populer</span></a></li>'
                    //<li class="cat" id="free"><a href=\'#/main/store/free\'><span>Free</span></a></li>
        // $('#_genre_book').html('<li class="cat" id="all"><a href=\'#/main/store/free\'><span>Semua</span></a></li>');
        $.each(data.data.Category,function(){
          var Category = this;
          var Child = this.children;
          if(Child.length>0){

            // book+='<li class="has-sub"><a href=""><span>'+Category.name+'</span></a>\
            //       <ul style="border-top:1px solid #ddd;border-bottom:1px solid #ddd;margin-right:10px;margin-left:10px;max-height:200px;overflow:auto">'
            //       $.each(Child,function(){
            //         book+='<li><a href="#/main/store/'+this.id+'_'+this.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+this.name+'</span></a></li>';
            //       });
            // book+='</ul></li>'

            $.each(Child,function(){
              book+='<li><a href="#/main/store/'+this.id+'_'+this.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+this.name+'</span></a></li>';
            });
          }else{
            book+='<li><a href="#/main/store/'+Category.id+'_'+Category.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+limitCharacter(Category.name,20)+'</span></a></li>';
          }

          //book+='<li><a href="#/main/store/'+Category.id+'_'+Category.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+limitCharacter(Category.name,20)+'</span></a></li>';
        });
        //console.log('book')
        setTimeout(function(){
          $(link).html(book);
          // $('#books_genre').append(book)
        })
      }else if(type=="pustaka"){
        var book='';
        //console.log(type)
        //console.log(data)

        // book+='<li class=""><a href=\'#/main/library/all\'><span>Semua</span></a></li>\
        //   <li class=""><a href=\'#/main/library/recommended\'><span>Rekomendasi</span></a></li>\
        //   <li class="" style="display:none"><a href=\'#/main/library/populer\'><span>Populer</span></a></li>';

        // $('#_cat_pustaka').html('<li class=""><a href=\'#/main/library/all\'><span>Semua</span></a></li>');
        $.each(data.data.Category,function(){
          var Category = this;
          var Child = this.children;
          if(Child.length>0){
            book+='<li class="has-sub"><a href=""><span>ePustaka Category</span></a>\
              <ul id="cat_pustaka" style="border-top:1px solid #ddd;border-bottom:1px solid #ddd;margin-right:10px;margin-left:10px;max-height:200px;overflow:auto">'
                $.each(Child,function(){
                  book+='<li><a href="#/main/library/category_'+this.id+'_'+this.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+this.name+'</span></a></li>';
                });
            book+='</ul></li>'
          }else{
            book+='<li><a href="#/main/library/category_'+Category.id+'_'+Category.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+limitCharacter(Category.name,20)+'</span></a></li>';
          }
          // book+='<li><a href="#/main/library/category_'+Category.id+'_'+Category.name.replace(/\//g,'--').replace(/ /g,'-')+'"><span>'+limitCharacter(Category.name,20)+'</span></a></li>';
        });
        // console.log(book)
        setTimeout(function(){
          $(link).html(book);
          $('#cat_pustaka').html(book)
        })
      }
    },
    epustaka_genre:function() {
      try{  
        var book='';
        var local = ReadData('_pustaka_genre');
        var controller = App.MainHomeController.create();
        if(local!=null){
          controller.send('parse_genre',local,'#cat_pustaka','pustaka')
        }
        var check = new majax_fast('categories/index',{'client_id':App.api.client_id,'type_id':'2'},'',600000);
        check.error(function(data) {
        }),
        check.success(function(data){
          if(data.meta.code==200){
            WriteData('_pustaka_genre', data)
            // parse_genre(data,'#books_genre');
            var controller = App.MainHomeController.create();
            controller.send('parse_genre',data,'#cat_pustaka','pustaka')
          }
        });
      }catch(error){
        console.log(error.message)
      }
      setTimeout(function(){
        load_dropdown();
      },100)
    },
    feeds:function(){
      feed_feeds();
    },
    morefeeds:function(data){
      feed_morefeeds(data);
    },
    parsefeeds:function(data,index){
      // console.log(data)
      feed_parsefeeds(data,index)
    },
    endlessfeeds:function(){
      if(morefeeds){

      }else{
        $(".home").endlessScroll({
          fireOnce: false,
          fireDelay: false,
          fireOnce:true,
          ceaseFireOnEmpty: false,
          inflowPixels:100,
          insertAfter: "#list div:last",
          loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
          callback: function(){
            var controller = App.MainHomeController.create();
            controller.send('morefeeds',false)
          }
        });
      }
    },
    chat:function(id){
      feed_chat(id);
    },
    suggest:function(id){
      feed_suggest(id);
    },
    review:function(id,like,status_like,type){
      var word = '';
      var token = localStorage.getItem('token')
      var before = $('#review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
      try{
        var check = new majax_fast('comments/index',{'access_token':token,'key':id,'type':'Feed','per_page':50},before);
        check.error(function(data) {
        }),
        check.success(function(data) {
          if(data.meta.code==200){
            $('#review').attr('data-index',3);
            // console.log(data)
            $('#review').html('');
            $.each(data.data.data,function(){
              var Comment = this.Comment;
              var Like = this.Like;
              var Review = this.Review;
              var User = this.User;
              if(type=="feeds"){
                var style="position:relative;top:-3px"
              }else{
                var style="";
              }
              word+='<div class="review" id="review'+Comment.id+'" style="padding-left:10px;padding-right:10px;line-height:1.2">\
                <div class="head">\
                  <span><a href="#/main/user/'+User.id+'"><img class="avaMiniCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a></span>\
                  <span class="blue" style="'+style+'">'+User.name+'</span>\
                  <span class="f10 b">'+timeago(Comment.elapsed_time)+'</span>\
                </div>\
                <div class="content m-right">\
                  <span>'+Comment.comment+'</span>\
                </div>\
                <div class="tail" style="width:250px;">';
                  // <span><i class="fa fa-thumbs-up"></i> '+Like.total_likes+' .</span>\
                  // <span style="float:right"><i class="fa fa-flag"></i> Report</span>\
                if(Like.has_like==1){
                  word+='<span class="pointer" id="actLikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'0\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like blue"  id="LikeComment-'+Comment.id+'"></i> <span id="TotalLikeComment-'+Comment.id+'">'+Like.total_likes+'</span> likes. </span>'
                }else{
                  word+='<span class="pointer" id="actLikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like grey" id="LikeComment-'+Comment.id+'"></i> <span id="TotalLikeComment-'+Comment.id+'">'+Like.total_likes+'</span> likes. </span>'
                }
                  // <span class="pointer" onclick="like_(\''+Comment.id+'\',\'1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like blue"></i> <span id="LikeComment-'+Comment.id+'">'+Like.total_likes+'</span> .</span>\
                if(Like.has_report==1){
                  word+='<span class="pointer"  style="float:right" id="actDislikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'0\',\''+Comment.id+'\',\'Comment\')"><i class="moco-flag" id="DislikeComment-'+Comment.id+'"></i> Laporkan</span>'
                }else{
                  word+='<span class="pointer"  style="float:right" id="actDislikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'-1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-flag grey" id="DislikeComment-'+Comment.id+'"></i> Laporkan</span>'
                }
                word+='</div>\
              </div>'
              word+='<div class="divider"></div>'
            })
            $('#review1').html(word);
            $('#total_like').html(like);
            if(status_like==true){
              $('#like_status').addClass('blue');
            }
            $('#btn-review').attr('onclick','addcomment(\'Feed\',\''+id+'\')');
            // $('#btn-review').attr('onclick','review(\'Review\',\'Book\',\''+id+'\')');
          }else{
            word = '<center id="empty">\
                    <div class="fe_blank_chat" style="height:150px;"></div>\
                    <div class="grey">Belum Ada Komentar</div>\
                  </center>';
            $('#review1').html(word);
          }
        })
      }catch(error){
        console.log(error.message)
      }
    },
    list_like:function(id){
      var word = '';
      var token = localStorage.getItem('token')
      var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
      //$('#follow_title').html('People who like this')
      try{
        var check = new majax_fast('likes/users',{'access_token':token,'key':id,'type':'Feed','per_page':20},before);
          check.error(function(data) {
        }),
        check.success(function(data) {
          if(data.meta.code==200){
            $('#list_user').attr('data-index',3);
            // console.log(data)
            $('#list_user').html('');
            $.each(data.data.users,function(){
              console.log(this)
              if(this.status_follow=="true"){
                hidden = "display:none"
              }else{
                hidden = "";
              }
              word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #ddd;padding-top:10px;padding-bottom:5px;">\
              <a href="#/main/user/'+this.id+'"><div class="col-md-2 col-xs-2">\
                <img class="avaMiniCircle" src="'+this.avatar+'" onerror="AvaError(this)">\
              </div></a>\
              <div class="col-md-7 col-xs-7" style="line-height:1.2">\
                <div class="blue">'+this.name+'</div>\
                <div class="grey f12">'+this.username+'</div>\
              </div>\
              <div class="col-md-3 col-xs-3" style="'+hidden+'">\
                <button class="radius b-trans b_grey grey" style="padding:5px 20px" id="btn-'+this.id+'" onclick="act_follow('+this.id+',\'User\')"><i class="fa fa-plus f14" id="icon-'+this.id+'"></i></button>\
              </div></div>'
              //word+='<div class="divider"></div>'
            })
            $('#list_user').html(word);
          }else{
            word = '<center style="">'+data.meta.error_message+'</center>'
            $('#list_user').html(word);
          }
        })
      }catch(error){
        console.log(error.message)
      }
    }
  }
})

function open_profile(){
  $('#btn-profile').click();
}

function feed_feeds(){
  $('.side').removeClass('active');
  $('#home').addClass('active');
  $('.main').removeClass('blur');
  $('.pre').hide();
  document.title="Beranda";
  setTimeout(function(){
    home_search()
  },500)
  try{
    ga_pages('/feeds','Your Feeds');
    // location.href='#main/home';
    morefeeds = false;
    var local = ReadData('_feed');
    if(local!=null){
      setTimeout(function(){
        var controller = App.MainHomeController.create();
        controller.send('parsefeeds',local,0)
      },1)
    }
    var token = localStorage.getItem('token');
    var before = $("#timeline").html('<center style="font-size:20px;margin-top:30px;"><span class="fa fa-spin moco-load"></span></center>');
    notes = new majax_fast('feeds',{'access_token':token,'per_page':10},before);
    notes.success(function(data){
      $("#timeline").html('');
      // console.log(data)
      if(data.meta.code==200){
        WriteData('_feed', data);
        $('#timeline').attr('data-index',2);

        var controller = App.MainHomeController.create();
        controller.send('parsefeeds',data,0)
        if(data.data.total_result>=20){
          $('#btn-loadmore_feeds').show()
        }else{
          $('#btn-loadmore_feeds').hide()
        }
      }else{
        $('#btn-loadmore_feeds').hide()
        // var word = '<center style="">\
        //             <div class="moco-balon grey" style="font-size:150px;margin:40% auto;"><div class="moco-moco white" style="font-size:55px;top:-115px;position:relative"></div>\
        //             <div class="grey f14" style="position:relative;top:-47px;">No Activity Yet</div>\
        //             </div>\
        //           </center>'
        var word='';
        word +='<div class="empty_feeds shadow">\
        <div class="top" style="padding:10px 7px;">\
          <div>Telusuri dan temukan bacaan eBook yang kamu inginkan</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_store red"></span></div>\
        </div>\
        <div class="bottom pointer black" onclick="location.href=\'#/main/store/index\'">Telusuri Sekarang</div>\
        </div>'
        word +='<div class="empty_feeds shadow" style="position:absolute;top:10px;left:260px">\
        <div class="top">\
          <div>Dapatkan informasi terbaru dari ePustaka iNgawi.</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_epustaka red"></span></div>\
        </div>\
        <div class="bottom pointer black"  onclick="location.href=\'#/main/library/all\'">Kunjungi sekarang</div>\
        </div>'
        word +='<div class="empty_feeds shadow" >\
        <div class="top">\
          <div>Dapatkan aktifitas terbaru didalam feeds mu.</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_home red"></span></div>\
        </div>\
        <div class="bottom pointer black" onclick="location.href=\'#/main/search/12\'">Temukan dan jalin pertemanan</div>\
        </div>'
        word +='<div class="empty_feeds shadow" style="position:absolute;top:188px;left:260px">\
        <div class="top">\
          <div>Tambahkan koleksi bacaanmu kedalam lemari penyimpanan</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_shelf red"></span></div>\
        </div>\
        <div class="bottom pointer black"  onclick="location.href=\'#/main/shelf/current\'">Lihat buku yang telah dipinjam</div>\
        </div>'
        word +='<div class="empty_feeds shadow">\
        <div class="top">\
          <div>Temukan koleksi terbaru dengan fitur pencarian</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_search red"></span></div>\
        </div>\
        <div class="bottom pointer black"  onclick="location.href=\'#/main/search\'">Temukan apa saja di iNgawi</div>\
        </div>'

        word +='<div class="empty_feeds shadow" style="position:absolute;top:366px;left:260px">\
        <div class="top">\
          <div>Ubah avatar profilmu agar terlihat lebih menarik.</div>\
          <div style="padding-top:18px;font-size:30px"><span class="moco-ij_camera red"></span></div>\
        </div>\
        <div class="bottom pointer black"  onclick="open_profile()">Lengkapi profilmu sekarang</div>\
        </div>'
        
        // word +='<div class="empty_feeds shadow"  style="position:absolute;top:188px;left:260px">\
        // <div class="top">\
        //   <div>Top Up your balance to get more your favourite books.</div>\
        //   <div style="padding-top:18px;font-size:30px"><span class="moco-database blue"></span></div>\
        // </div>\
        // <div class="bottom pointer" onclick="open_balance()">See Your Balance Now</div>\
        // </div>'
        $('#timeline').html(word);
      }
    })
    notes.error(function(data){
      $("#timeline").html('');
      $('#btn-loadmore_feeds').hide()
    })
  }catch(error){
    console.log(error.message)
  }
}
function feed_morefeeds(data){
  if(morefeeds){
        
  }else{
    morefeeds=true;
    var token = localStorage.getItem('token');
    var before = $('#load_more_').addClass('moco-load');
    var index = $('#timeline').attr('data-index')
    notes = new majax_fast('feeds',{'access_token':token,'per_page':10,'page':index},before);
    notes.success(function(data){
      morefeeds = false
      $('#load_more_').removeClass('moco-load');
      if(data.meta.code==200){
          // WriteData('_feed', data);
          $('#timeline').attr('data-index',parseInt(index)+1);
          var controller = App.MainHomeController.create();
          controller.send('parsefeeds',data,1)
        }else{
          morefeeds =true;
          //$('#dg-container').removeClass('dg-container').removeAttr('id')
          // var wall = new freewall("#timeline");
          // wall.reset({
          //   selector: '.feeds',
          //   cellW: 200,
          //   cellH: 'auto',
          //   animate:false,
          //   // delay:50,
          //   onResize: function() {
          //     wall.fitWidth();
          //   }
          // });

          // wall.fitWidth();
          var height = parseInt($('#timeline').attr('data-wall-height'));
          console.log(height);
          height=height+150;
          console.log(height)
          $('#timeline').css('height',height)
          $('#btn-loadmore_feeds').hide()
        }
    })
    notes.error(function(data){
      $('#load_more_').removeClass('moco-load');
      $('#btn-loadmore_feeds').hide()
    })
  }
}
function feed_parsefeeds(data,index){
  var feeds_text='';
  var wall = new freewall("#timeline");
  wall.reset({
    selector: '.feeds',
    cellW: 200,
    cellH: 'auto',
    gutterX: 30,
    gutterY: 20,
    animate:false,
    // delay:50,
    onResize: function() {
      wall.fitWidth();
    }
  });
  wall.fitWidth();
  $.each(data.data.data,function(){
    var Feed = this.Feed;
    var Sender = this.Sender;
    var Object = this.Object;
    var Statistic = this.Statistics;
    //console.log(Sender)
    //if(Feed.action_type=="JOIN"){
    try{
      if(Feed.sender_type=="User"){
        name_sender = Sender.User.name;
        // if(Feed.action_type=="STATUS"){
        //   link_avatar = 'javascript:gui.Shell.openExternal(\''+Sender.User.url_profile+'\')';
        // }else{
        //   link_avatar = 'location.href=\'#/main/user/'+Sender.User.id+'\'';
        // }
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

      if(Feed.object_type=="Book"){
        object_name = Object.Book.title;
        var list_author='';
        list_author +='<span class="black">by </span>';
        if(Object.Book.authors){
            object_det = 'by <span class="medium light-blue">'+Object.Book.authors+'</span>';
        }else{
           if(Object.Authors.length==0){
              list_author+='<span class="medium"></span>';
              object_det=list_author;
            }else{
                $.each(Object.Authors,function(){
                    var id = this.id;
                    var name = this.name;
                    if(id){
                        list_author+='<span><a style="color:#4D4B8C" href="#/main/moco/library/" onclick="authors_details('+id+')">'+name+' </a></span>';
                    }else{
                       list_author+='<span><a style="color:#4D4B8C" onclick="">'+name+' </a></span>';
                    }
                })  
                object_det=list_author;
            }
        }
        object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
        // if(Feed.action_type=="RECOMMEND"){
        //   object_image = '<img class="cover pointer btm_rad7" src="'+Object.Book.cover+'" style="height:329px;width:230px;" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
        // }else{
        //   object_image = '<img class="cover pointer" src="'+Object.Book.cover+'" style="height:329px;width:230px;" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
        // }
        if(Object.Book.extension=="mp4"){
           var error = 'VidError(this)'
         }else if(Object.Book.extension=="mp3"){
           var error = 'AudError(this)'
         }else{
           var error = 'CovError(this)'
         }
         object_image = '<img class="cover pointer" src="'+Object.Book.cover+'" style="height:329px;width:230px;" onerror="'+error+'" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
        // object_image = '<img class="cover pointer btm_rad7" src="'+Object.Book.cover+'" style="height:329px;width:230px;" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
      }else if(Feed.object_type=="Library"){
        if(Object.Library.name){
          object_name = '<a href="#/main/epustaka/'+Object.Library.id+'" class="blue">'+Object.Library.name+'</a>';
          object_det = Object.Statistic.total_books+' Books';
          object_action = "n_pustaka("+Object.Library.id+",'"+Object.Library.name.replace(/ /g,'_')+"')";
          object_image = '<img class="shadow pointer btm_rad7" src="'+Object.Library.logo+'" style="width:100%;min-height:230px;" onerror="CovError(this)" onclick="location.href=\'#/main/epustaka/'+Object.Library.id+'\'">';
        }else{
          object_name='';
          object_det='';
          object_action='';
          object_image='';
        }      
      }else if(Feed.object_type=="User"){
        object_name = Object.User.name;
        object_det = "-";
        object_action = "n_user("+Object.User.id+",'"+Object.User.name.replace(/ /g,'_')+"',1,undefined,'"+Object.User.name.replace(/ /g,'_')+"','"+Object.User.avatar+"')";
        object_image = '<img class="shadow avaCircle right pointer btm_rad7" src="'+Object.User.avatar+'" style="" onerror="AvaError(this)" onclick="location.href=\'#/main/user/'+Object.User.id+'\'">';
      }else if(Feed.object_type=="Author"){
        object_name = Object.Author.name;
        object_det = "-";
        object_action = "n_author("+Object.Author.id+",'"+Object.Author.name.replace(/ /g,'_')+"',1,undefined,'"+Object.Author.name.replace(/ /g,'_')+"','"+Object.Author.avatar+"')";
        object_image = '<img class="shadow avaCircle right pointer btm_rad7" src="'+Object.Author.avatar+'" style="" onerror="AvaError(this)" onclick="location.href=\'#/main/author/'+Object.Author.id+'\'">';
      }else if(Feed.object_type=="Review"){
        object_name = '';
        object_det = '"'+limitCharacter(Object.Review.content,15)+'" <br><span onclick=notif_act_to("'+Object.Review.id+'","'+Object.Book.id+'","books") style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
        object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
        if(Object.Book.extension=="mp4"){
          var error = 'VidError(this)'
        }else if(Object.Book.extension=="mp3"){
          var error = 'AudError(this)'
        }else{
          var error = 'CovError(this)'
        }
        object_image = '<img class="pointer" src="'+Object.Book.cover+'" style="width:100%" onerror="'+error+'" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
        action_next = "notif_act_to('"+Object.Review.id+"','"+Object.Book.id+"','books')";
      }else if(Feed.object_type=="Comment"){
        object_name = '';
        if(Object.Book != undefined){
          object_det = '"'+limitCharacter(Object.Comment.comment,15)+'" <br><span onclick=notif_act_to("'+Object.Comment.id+'","'+Object.Book.id+'","books") style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
          object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_')+"',1,undefined,\'"+Object.Book.cover+"\')"
          if(Object.Book.extension=="mp4"){
            var error = 'VidError(this)'
          }else if(Object.Book.extension=="mp3"){
            var error = 'AudError(this)'
          }else{
            var error = 'CovError(this)'
          }
          object_image = '<img class="pointer" src="'+Object.Book.cover+'" style="width:100%" onerror="'+error+'" onclick="location.href=\'#/main/book/'+Object.Book.id+'\'">';
          action_next = "notif_act_to('"+Object.Comment.id+"','"+Object.Book.id+"','books')";
        }else{
          object_det = "'"+limitCharacter(Object.Comment.comment,15)+"'";
          object_action = '';
          object_image = '';
          action_next = "";
        }    
      }else if(Feed.object_type=="Status"){
        object_name = '';
        if(Object.Status){
          object_det = Object.Status.text;
        }else{
          object_det = '';
        }
        object_action=""
        if(Object.Media){
          if(Object.Media[0].Link.url!=''){
            if(Object.Media[0].Link.type=="Book"){
              status_link = 'location.href=\'#/main/book/'+Object.Media[0].Link.url+'\'';
            }else  if(Object.Media[0].Link.type=="Library"){
              status_link = 'location.href=\'#/main/epustaka/'+Object.Media[0].Link.url+'\'';
            }else  if(Object.Media[0].Link.type=="User"){
              status_link = 'location.href=\'#/main/user/'+Object.Media[0].Link.url+'\'';
            }else if(Object.Media[0].Link.type=="Link"){
               status_link = 'javascript:gui.Shell.openExternal(\''+Object.Media[0].Link.url+'\')';
            }else{
              status_link = '';
            }
          }else{
            status_link = 'com_feeds('+Feed.id+')'
          }
          // object_image = '<img class="pointer" src="'+Object.Media[0].Picture.media+'" style="width:100%" onerror="CovError(this)" onclick="location.href=\'#/main/home\'">';
          object_image = '<img class="pointer" src="'+Object.Media[0].Picture.media+'" style="width:100%" onerror="CovError(this)" onclick="'+status_link+'">';
        }else{
          object_image = '';
          status_link = '';
        }
        action_next = "";
      }else if(Feed.object_type=="Badge"){
        object_name = Object.Badge.name;
        object_det = ".";
        object_action="";
        //object_image = Object.Badge.icon;
        object_image = '';
      }else{
        object_name = "";
        object_det = "";
        object_image="";
          //cat_sender = Notif.recipient_type;
      }
      if(Feed.action_type=="RECOMMEND"){
        var detail_rec = Feed.message; 
        Feed.message = "mengirimkan rekomendasi buku"
      }
      feeds_text += '<div class="feeds b-white">\
        <div class="head"><img class="avaCircle left pointer" src="'+image+'" onerror="AvaError(this)" onclick="'+link_avatar+'">\
          <div class="name"><span class="blue pointer" onclick="'+link_avatar+'">'+name_sender+'</span> .<span class="f12">'+timeago(Feed.elapsed_time)+'</span></span>\
            </div><div>';
      if(Feed.action_type=="STATUS"){
        if(Feed.message=='' || Feed.message=="None"){
          feeds_text += '<span class="black thin">Mengabarkan Anda</span>';
        }else{
          feeds_text += '<span class="black thin">'+Feed.message+'</span>';
        }
      }else{
        feeds_text += '<span class="black thin">'+Feed.message+'</span>';
      }
      if(object_name!=""){
        feeds_text +='<span> "'+object_name+'"</span><span class="black f12">';
      }
      total_likes = 0;
      total_comments = 0;
      try{
        if(Statistic.total_likes!=null){
          total_likes = Statistic.total_likes
        }
        if(Statistic.total_comments!=null){
          total_comments = Statistic.total_comments
        }0
      }catch(error){
        console.log(error.message)
      }
      if(Feed.object_type=="Library"){
        feeds_text+='</div></div><div class="content">\
          <div class="image">'+object_image+'</div>\
          <div class="stat" style="display:none"><span class="like">'+total_likes+' menyukai</span>\
          <span class="comment"> '+total_comments+' mengomentari</span></div>\
          </div></div>';
      }else if(Feed.action_type=="RECOMMEND"){
        feeds_text+='</div></div><div class="content">';
        if(detail_rec){
          feeds_text+='<div class="divider"></div><div class="review">"'+limitCharacter(detail_rec,300)+'"</div>';
        }
          feeds_text+='<div class="image">'+object_image+'</div>\
          </div></div>';
          // feeds_text+='<div class="image">'+object_image+'</div>\
          // <div class="stat" style="display:none"><span class="like">'+total_likes+' menyukai</span>\
          // <span class="comment"> '+total_comments+' mengomentari</span></div>\
          // </div></div>';
      }else if(Feed.object_type=="User" || Feed.object_type=="Author"){
        if(Feed.object_type=="User"){
          link_object = 'location.href=\'#/main/user/'+Object.User.id+'\'';
          var id_ = Object.User.id;
          if(Object.User.status_follow=="false"){
            var act_follow = 'act_follow(\''+Object.User.id+'\',\'User\')';
            var text = 'Follow'
            var btn_follow ='b-trans b_grey'
            var icn_follow ='moco-x7 moco-plus grey'
          }else{
            var act_follow = 'act_unfollow(\''+Object.User.id+'\',\'User\')';
            var text = 'Unfollow'
            var btn_follow ='b-blue b_blue'
            var icn_follow ='moco-x7 moco-check white'
          }
        }else if(Feed.object_type=="Author"){
          var id_ = Object.Author.id;
          link_object = 'location.href=\'#/main/author/'+Object.Author.id+'\'';
          if(Object.Author.status_follow=="false"){
            var act_follow = 'act_follow(\''+Object.Author.id+'\',\'Author\')';
            var text = 'Follow'
            var btn_follow ='b-trans b_grey'
            var icn_follow ='moco-x7 moco-plus grey'
          }else{
            var act_follow = 'act_unfollow(\''+Object.Author.id+'\',\'Author\')';
            var text = 'Unfollow'
            var btn_follow ='b-blue b_blue'
            var icn_follow ='moco-x7 moco-check white'
          }
        }
        feeds_text+='</div></div><div class="content" style="background-color:#fafafa">\
          <div class="right pointer" style="padding-top:10px" onclick="'+link_object+'" ><div style="margin-right:70px;"><div class="account blue">'+object_name+'</div>'
        //console.log(Feed.object_type)
        if(Feed.object_type=="Author"){
          feeds_text+='<div class="det_account">Author</div>'
        }else{ 
          feeds_text+='<div class="det_account">'+object_det+'</div>'
        } 
        feeds_text +='</div>\
          <div class="logo" style="top:-35px;">'+object_image+'</div></div>\
          <div class="stat" style="position:absolute;margin-top:45px;display:none;"><span class="like">'+total_likes+' menyukai</span>\
          <span class="comment"> '+total_comments+' mengomentari</span></div>\
          </div>\
          <div class="" style="height:35px; padding:7px 10px;"><span id="text-follow'+id_+'">'+text+'</span> <div style="position:absolute;right:15px;bottom:-4px;"><button id="btn-follow'+id_+'" onclick="'+act_follow+'" class="'+btn_follow+' radius" style="padding:2px 12px;border-radius:4px;">\
          <i id="icn-follow'+id_+'" class="fa '+icn_follow+'"></i></button></div></div>';
      }else {
        if(Feed.action_type=="REVIEW"){
          feeds_text+='</div></div><div class="content"><div class="divider"></div><div class="review">"'+limitCharacter(Object.Review.content,300)+'"</div>\
            <div class="image">'+object_image+'</div>\
          <div class="stat"><span class="like pointer" id="likeFeed-'+Feed.id+'"  onclick="Feed_like('+Feed.id+')">'+total_likes+' menyukai</span>\
          <span class="comment" id="commentFeed-'+Feed.id+'"> '+total_comments+' mengomentari</span></div></div>';
        }else if(Feed.action_type=="STATUS"){
          if(Object.Media && Object.Status){
            var display = ""
          }else{
            var display =""
          }
          if(object_det==""){
            var a = 'none'
          }else{
            var a = ''
          }
          feeds_text+='</div>\
            </div><div class="content"><div class="divider"></div><div class="review" style="display:'+a+'">'+object_det+'</div>\
            <div class="image">'+object_image+'</div>\
            <div class="stat" style="display:'+display+'"><span class="like pointer" id="likeFeed-'+Feed.id+'" onclick="Feed_like('+Feed.id+')">'+total_likes+' menyukai</span>\
            <span class="comment" id="commentFeed-'+Feed.id+'"> '+total_comments+' mengomentari</span></div></div>';
        }else{
          feeds_text+='</div>\
            </div><div class="content">\
            <div class="image">'+object_image+'</div>\
          <div class="stat"><span class="like pointer" id="likeFeed-'+Feed.id+'"  onclick="Feed_like('+Feed.id+')">'+total_likes+' menyukai</span>\
          <span class="comment" id="commentFeed-'+Feed.id+'"> '+total_comments+' mengomentari</span></div>\
          </div>';
        }
      }
      
      var like = '';
      var like_status = false;
      var like_act ='';
      try{
        if(Statistic.has_like=="1"){
          like="blue";
          like_status = true
          like_act='like_(\''+Feed.id+'\',\'0\','+Feed.id+',\'Feed\')'
        }else{
          like_act='like_(\''+Feed.id+'\',\'1\','+Feed.id+',\'Feed\')'
        }
      }catch(error){
        console.log(error.message)
      }
      
      if(Feed.object_type=="Book" || Feed.object_type=="Review" || Feed.object_type=="Comment" || Feed.action_type=="STATUS"){
        var komen='';var act_comFeed="";
        try{  
          if(Feed.object_type=="Review"){
            var komen = limitCharacter(Object.Review.content.replace(/'/g,' ').replace(/"/g,' ').replace(/;/g,' ').replace(/,/g,''),200);
            var act_comFeed = 'com_feeds('+Feed.id+','+Statistic.total_likes+','+like_status+',\''+Object.Book.cover+'\',\''+Object.Book.title+'\',\''+Feed.message+'\',\''+komen+'\')';
          }else if(Feed.action_type=="STATUS"){
            if(Object.Status){
              var komen_ = strip (Object.Status.text)
              var komen = limitCharacter(komen_.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g,' ').replace(/"/g,' ').replace(/;/g,' ').replace(/,/g,''),200);
            }else{
              var komen = ''
            }
            if(Feed.message==''){
              var c_text = "Mengabarkan Anda"
            }else{
              var c_text = Feed.message
            }
            if(Object.Media){
              var c_cover = Object.Media[0].Picture.media;
            }else{
              var c_cover = 'assets/img/placeholder/ic_buku_placeholder.png'
            }
            var c_title = '';
            var act_comFeed = 'com_feeds('+Feed.id+','+Statistic.total_likes+','+like_status+',\''+c_cover+'\',\''+c_title+'\',\''+c_text+'\',\''+komen+'\')';
          }else{
            var act_comFeed = 'com_feeds('+Feed.id+','+Statistic.total_likes+','+like_status+',\''+Object.Book.cover+'\',\''+Object.Book.title+'\',\''+Feed.message+'\')';
          }
          try{
            if(Statistic.has_like=="1"){
              like="blue";
              like_status = true
              if(Feed.action_type=="STATUS"){
                like_act='like_(\''+Feed.id+'\',\'0\','+Feed.id+',\'Feed\','+Statistic.total_likes+','+like_status+',undefined,undefined,\''+Feed.message+'\',\''+komen+'\')'
              }else{
                like_act='like_(\''+Feed.id+'\',\'0\','+Feed.id+',\'Feed\','+Statistic.total_likes+','+like_status+',\''+Object.Book.cover+'\',\''+Object.Book.title+'\',\''+Feed.message+'\',\''+komen+'\')'
              }
            }else{
              if(Feed.action_type=="STATUS"){
                like_act='like_(\''+Feed.id+'\',\'1\','+Feed.id+',\'Feed\','+Statistic.total_likes+','+like_status+',undefined,undefined,\''+Feed.message+'\',\''+komen+'\')'
              }else{
                like_act='like_(\''+Feed.id+'\',\'1\','+Feed.id+',\'Feed\','+Statistic.total_likes+','+like_status+',\''+Object.Book.cover+'\',\''+Object.Book.title+'\',\''+Feed.message+'\',\''+komen+'\')'
              }
            }
          }catch(error){
            console.log(error.message)
          }
        }catch(error){
          console.log(error.message)
        }
        if(Feed.action_type=="RECOMMEND"){

        }else{
          if(Feed.action_type=="STATUS"){
            if(Object.Media && Object.Status){
              var aa = '';
            }else{
              var aa = 'padding-top:0px';
            }
              feeds_text+='<div class="tail" style="'+aa+'">\
                  <div class="col-md-6 col-xs-6 like pointer" id="actLikeFeed-'+Feed.id+'" onclick="'+like_act+'"><span class="moco-like '+like+'" id="like-'+Feed.id+'"></span> suka</div>\
                  <div class="col-md-6 col-xs-6 pointer" id="commentFeed-'+Feed.id+'" onclick="'+act_comFeed+'"><span class="moco-ij_balon"></span> komentar</div>\
                </div>\
              </div>'
          }else{
            feeds_text+='<div class="tail">\
                <div class="col-md-6 col-xs-6 like pointer" id="actLikeFeed-'+Feed.id+'" onclick="'+like_act+'"><span class="moco-like '+like+'" id="like-'+Feed.id+'"></span> suka</div>\
                <div class="col-md-6 col-xs-6 pointer" id="commentFeed-'+Feed.id+'" onclick="'+act_comFeed+'"><span class="moco-ij_balon"></span> komentar</div>\
              </div>\
            </div>'
          }
        }
      }else{
        feeds_text+='</div>'
      }
    }catch(error){console.log(error.message)}
  });
  if(index==0){
    // console.log(feeds_text)
    $('#timeline').html(feeds_text);
    // preload_ava('.avaCircle')
    // preload_img('.shadow')

    var images = wall.container.find('.feeds');
    images.find('img').load(function() {
      wall.fitWidth();
    });
    setTimeout(function(){
       wall.refresh();
    },500)

    jQuery(function($){
      $('.home').bind('scroll', function()
        {
          if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
          {
            feed_morefeeds();
            var wall = new freewall("#timeline");
            wall.reset({
              selector: '.feeds',
              cellW: 200,
              cellH: 'auto',
              gutterX: 30,
              gutterY: 20,
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

    // var controller = App.MainHomeController.create();
    // controller.send('endlessfeeds')
  }else{
    $('#timeline').append(feeds_text);
    // preload_img('.shadow')
      
      wall.refresh();

    // wall.refresh();
    // var controller = App.MainHomeController.create();
    // controller.send('endlessfeeds')
  }
}
function feed_chat(id){
  var text='';
  try{
    ga_pages('/home/chat','Online Friends');
    ga_action('Friends','Chat','Feeds');
  
    var before = $("#online").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
    var token =window.localStorage.getItem('token');
    var check = new majax_fast('messages/index',{'access_token':token,'per_page':10},before)
    check.success(function(data){
      $("#online").removeClass('fa fa-spin moco-load');
      //console.log(data)
      if(data.meta.code==200){
        $.each(data.data.data,function(){
          var Sender = this.Sender;
          var Message = this.Message;
          var Recipient = this.Recipient;
          text += '<div class="user" style="padding:10px 0px;height:50px">\
          <div class="col-md-2 col-xs-2"><img class="chat-circle" src="'+Sender.avatar+'" onerror="AvaError(this)"></div>\
          <a href="#/chat"><div class="col-md-9 col-xs-9" style="line-height:1.1;color:#888" onclick="detail_chat(\''+Sender.id+'\')">\
            <div class="blue" style="word-break:break-all;margin-top:6px;font-size:13px;">'+limitCharacter(Sender.name,15)+'</div>\
            <div class="f8" style="display:none">'+limitCharacter(Sender.address,20)+'</div>\
          </div></a>\
          </div><div class="divider" style="border-color:#fafafa"></div>';
        })
        $('#online').html(text)
        setTimeout(function(){
          search_chat();
        },500)
      }else{
        var word = '<center id="empty">\
                      <div class="fe_blank_chat" style="height: 100px;margin: 24% auto;background-size: contain;margin-bottom: 3%;"></div>\
                      <div class="grey f14" style="">Belum ada chat</div>\
                    </center>'
        $("#online").html(word);
      }
    })
    check.error(function(data){
      $("#online").html('');
    })
  }catch(error){
    console.log(error.message)
  }
}
function feed_suggest(id){
  var text='';
  try{
    ga_pages('/home/suggest','Suggest Friends');
    ga_action('Friends','Suggest','Feeds');
    var local = ReadData('_suggest');
    if(local!=null){
      setTimeout(function(){
        feed_suggest_parse(local)
      },1)
    }
    // var before = $("#suggest").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
    var before = $("#suggest").html('<br><center><span class="fa moco-load fa-spin fa-2x"></span></center>');
    var token =window.localStorage.getItem('token');
    var check = new majax_fast('users/suggestfriends',{'access_token':token,'limit':4},before)
    check.success(function(data){
      $("#suggest").removeClass('fa fa-spin moco-load');
      //console.log(data)
      if(data.meta.code==200){
        WriteData('_suggest',data)
        feed_suggest_parse(data)
      }else{
        $("#suggest").html('<br><center>'+data.meta.error_message+'</center>');
      }
    })
    check.error(function(data){
      $("#suggest").html('');
    })
  }catch(error){
    console.log(error.message)
  }
}

function feed_suggest_parse(data){
  var text='';
  $('#open_profile').show();
  $('#password').show();
  $('#logout').show();
  $.each(data.data.users,function(e,Users){
          //console.log(Users)
    if(Users.avatar){
      var avatar = Users.avatar
    }else{
      var avatar='img/main/avatar.png'
    }
    text += '<div class="user" id="suggest-'+Users.sugested_friend_id+'" style="padding:10px 0px;height:50px">\
    <div style="position:absolute;right:17px;margin-top:2px;"><button id="btn-follow'+Users.sugested_friend_id+'" onclick="act_follow(\''+Users.sugested_friend_id+'\',\'User\')" class="b-trans b_grey radius" style="padding:2px 12px; border-radius:4px;">\
    <i id="icn-follow'+Users.sugested_friend_id+'" class="moco-x7 moco-plus grey"></i></button></div>\
    <div class="col-md-2 col-xs-2"><a href="#/main/user/'+Users.sugested_friend_id+'"><img class="chat-circle" src="'+avatar+'" onerror="AvaError(this)"></a></div>\
    <div class="col-md-8 col-xs-8" style="line-height:1.4;padding-left:5px;">\
      <a href="#/main/user/'+Users.sugested_friend_id+'"><div class="blue" style="word-break:break-all;font-size:13px;">'+limitCharacter(Users.name,13)+'</div></a>\
      <div class="f8">'+limitCharacter(Users.address,20)+'</div>\
    </div>\
    </div><div class="divider" id="divsuggest-'+Users.sugested_friend_id+'" style="border-color:#fafafa"></div>';
  })
  $('#suggest').html(text);
}