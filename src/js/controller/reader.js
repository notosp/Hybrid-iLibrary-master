var bookmark=[];
var note="";
var typingTimer;                
var doneTypingInterval = 1000;
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
App.ReaderController = Ember.ArrayController.extend({
    init:function(){

    },
    actions:{
        read:function(type,link){
            if(type=="epub"){
                this.send('epub',link)
            }else{
                this.send('pdf',link)
            }
        },
        epub:function(link){
            console.log('ePub Reading')
            console.log(link)
            if(book_id){

            }else{
                book_id = window.localStorage.getItem('book_id')
            }
            console.log(book_id)
            // var path = homePath+link;
            if (navigator.appVersion.indexOf("Win")!=-1){
                var path = "file:///"+homePath.replace(/ /g,"%20")+link;
                // root='file:///'+data
            }else{
                var path = homePath+link;
                // root=data;
            }
            console.log(path)
            root = path;
            bookmark = JSON.parse(localStorage.getItem(root+'newbookmark'))
            //console.log(bookmark)
            
            setTimeout(function(){
                "user strict"
                EPUBJS.cssPath = "css/plugin/";
                Book = ePub(path, { 
                    restore: true,
                    spreads: true, // Displays two columns
                    //spreads : spreads,
                    fixedLayout : false //-- Will turn off pagination
                });
                Book.renderTo("viewer");
                try{
                    setTimeout(function(){
                        $('iframe').attr('id','frame_ok');
                        try{
                            title_book=Book.metadata.bookTitle.capitalize();
                        }catch(e){
                            console.log(e.message)
                        }
                        $('#title_book').html(limitCharacter(title_book,60));
                        var controller= App.ReaderController.create();
                        controller.send('show_toc');
                        // try{
                        //     var a = location.href.split('Book_')
                        //     var aa = a[1].split('_')
                        //     console.log(aa)
                        //     book_id=aa[0]
                        // }catch(error){
                        //     console.log(error.message)
                        // }
                        show_bookmark();
                        is_bookmark();
                        get_memo();
                        $('#query_reader').keyup(function(){
                            //console.log("cek cek");
                            var str=$(this).val();
                            //console.log(str);
                            $("iframe").contents().find("p").removeHighlight().highlight(str);
                        });
                        $('.complete').zoomingBox({
                            thumbnails:true
                        });
                        setTimeout(function(){
                            $('.complete').click(function(){
                                var w = 0.7 * window.innerWidth;
                                var h = 0.9 * window.innerHeight;
                                setTimeout(function(){
                                    console.log(window.innerHeight,$('.zoomingBox-xl').height())
                                    console.log(window.innerWidth,$('.zoomingBox-xl').width())
                                    if(window.innerHeight>$('.zoomingBox-xl').height()){
                                        
                                    }else{
                                        console.log('besar');
                                    }
                                },100)
                            });
                        },500)
                    },1000)
                }catch(error){
                    console.log(error.message)
                }
                $('#new_memo').jeegoocontext('menu', {
                    widthOverflowOffset: 0,
                    heightOverflowOffset: 1,
                    submenuLeftOffset: -4,
                    submenuTopOffset: -2,
                    event: 'click',
                    openBelowContext: true 
                });

                $("#load_memo").jeegoocontext('menu', {
                    widthOverflowOffset: 0,
                    heightOverflowOffset: 1,
                    submenuLeftOffset: -4,
                    submenuTopOffset: -2,
                    event: 'click',
                    openBelowContext: true 
                });

            },1000)

        },
        pdf:function(link){
            console.log('PDF Readig')
            link = homePath + link;
            console.log(link)
            var files = fs.readdirSync(link);
            console.log(files[0])
            if(files[0]){
                console.log(link+files[0])
                window.location.href='web/viewer.html?file='+link+files[0]+'#zoom=auto';
            }else{
                console.log(link_file)
                console.log('cannot open '+files[0]);
                // delete_file(link_file);
                del_dir_epub();
            }
            // window.location.href='web/viewer.html#'+link;
        },
        config_reader:function(){
            $('iframe').contents().find('h2').css('margin-top','20px').css('font-weight','lighter').css('font-size','16pt').css('color','#4D4B8C');

            $('iframe').contents().find('a').css('vertical-align','super').css('font-size','smaller').css('text-decoration','none');

            $('iframe').contents().find('p').css('margin-bottom','10px').css('text-indent','24pt');

            Book.setStyle('text-align','left');
            Book.setStyle('line-height','1.5');
            //enable rendering
            Book.setStyle('text-rendering','optimizeLegibility')
            //set indent text
            Book.setStyle('text-indent','24pt')
            var configure = JSON.parse(localStorage.getItem('reader_conf'));
            this.send('style','font-size',configure[0]);
            this.send('style','font-family',configure[1]);
        },
        style:function(type,data){
            var config = JSON.parse(localStorage.getItem('reader_conf'));
            if(type=="font-size"){
                config[0]=data;
            }else if(type=="font-family"){
                config[1]=data;
                $('.font').css('visibility','hidden');
                $("iframe").contents().find("span").css(type,data);
                $("iframe").contents().find("p").css(type,data);
            }
            Book.setStyle(type,data);
            var data =JSON.stringify(config);
            window.localStorage.setItem('reader_conf',data);
        },
        theme:function(data){
            var conf = JSON.parse(localStorage.getItem('reader_conf'));
            conf[3]=data;
            $('.tick_theme').css('visibility','hidden');
            if(data==1){
                Book.setStyle('color','#000000');
                $('#frame_ok').contents().find('span').css('color','#000')
                $('#frame_ok').contents().find('body').css('background-color','transparent')
                $('body').css('background','');
                $('#theme1').css('visibility','visible');
                $('iframe').contents().find('h1 span').css('color','#4D4B8C');
                $('iframe').contents().find('h2 span').css('color','#4D4B8C');
                $('#ads').css('background-color','#f4f1f1')
                $('#frame_ok').contents().find('p').css('color','#000000')
            }else if(data==2){
                $('#frame_ok').contents().find('body').css('background-color','#ffebdc')
                Book.setStyle('color','#000000');
                $('#frame_ok').contents().find('span').css('color','#000')
                $('body').css('background','#ffebdc');
                $('#theme2').css('visibility','visible');
                $('iframe').contents().find('h1 span').css('color','#4D4B8C');
                $('iframe').contents().find('h2 span').css('color','#4D4B8C');
                $('#ads').css('background-color','#ffebdc')
                $('#frame_ok').contents().find('p').css('color','#000000')
            }else{
                $('body').css('color','#ffffff');
                $('#frame_ok').contents().find('body').css('background-color','#000')
                Book.setStyle('color','#ffffff');
                $('#frame_ok').contents().find('span').css('color','#fff')
                $('body').css('background','#000000');
                $('#theme3').css('visibility','visible');
                $('iframe').contents().find('h1 span').css('color','#fff');
                $('iframe').contents().find('h2 span').css('color','#fff');
                $('#ads').css('background-color','#000000')
                $('#frame_ok').contents().find('p').css('color','#ffffff')
            }

            var data =JSON.stringify(conf);
            window.localStorage.setItem('reader_conf',data);
        },
        percent:function(id,percent){
            var token = window.localStorage.getItem('token');
            var req_data = {'access_token':token,'type':'Book','key':id,'read_percentage':percent};
            var action = new majax_post('items/update_percentage',req_data,'');
            action.error(function(data) {
            }),
            action.success(function(data){
                if (data.meta.code==200){
                }else{
                }
            });
        },
        show_toc:function(){
            var html='';
            $('#toc_toc > li').remove();
            var toc =Book.getToc().resolvedValue;
            toc.forEach(function(toc){
                var nama = toc.label;
                //console.log(nama)
                html +="<li id='toc_' style='cursor:pointer;font-size:14px;'><a onclick=Book.goto('"+toc.href+"')>\
                <span style='color:#777;'>"+nama.capitalize()+"</span></a></li>\
                <li id='toc_' class='divider' style='padding-top:0px;border-color:#fafafa'></li>";
                if(toc.subitems.length>0){
                    var sub = toc.subitems;
                    // var pag31 = pag3+1;
                    sub.forEach(function(sub){
                        // pag31 = pag31+2;
                        html +="<li id='toc_' style='cursor:pointer;font-size:14px;padding-left:10px;'><a onclick=goto_sub('"+sub.href+"') style='font-size:14px;'>\
                        <span style='color:#777;'>"+sub.label.capitalize()+"</span></a></li>\
                        <li id='toc_' class='divider' style='padding-top:0px;border-color:#fafafa'></li>";
                    }); 
                }
            })
            $("#toc_toc").append(html);
        }
    }
})

//API Access to READER

function del_dir_epub(){
    if (navigator.appVersion.indexOf("Win")!=-1){
        // alert('This book cannot be read, Please redownload this book to read');
        //update_file('Book',book_id);
        // exec('rmdir "'+root+'"');
        execute('rmdir "'+homePath+'/.iNgawi/files" /s /q',function(data){
            console.log(data)
        })
        // $('#r_back').click();
        goBackReader();
    }else{
        // alert('This book cannot be read, Please redownload this book to read');
        //update_file('Book',book_id);
        execute('rm -rf '+homePath+'/.iNgawi/files',function(data){
            console.log(data)
        })
        exec('rm -rf '+homePath+'/.iNgawi/files');
        // $('#r_back').click();
        goBackReader()
    }
}

function clear_books(){
    setTimeout(function(){
        if (navigator.appVersion.indexOf("Win")!=-1){
            exec('rmdir "'+homePath+'/.iNgawi/files/" /s /q');
            execute('rmdir "'+homePath+'/.iNgawi/files" /s /q',function(data){
                console.log(data)
            })
        }else{
            exec('rm -rf '+homePath+'/.iNgawi/files/');
            execute('rm -rf '+homePath+'/.iNgawi/files',function(data){
                console.log(data)
            })
        }
    },1000)
}

//Reader Configuration
function configure_reader(){
    //riset
    // $('iframe').contents().find('p span').contents().unwrap();
    // //capital every first character
    $('iframe').contents().find('h1').css('text-transform','capitalize').css('margin-bottom','20px').css('font-weight','lighter').css('font-size','18pt').css('color','#4D4B8C');

    //override h2
    $('iframe').contents().find('h2').css('margin-top','20px').css('font-weight','lighter').css('font-size','16pt').css('color','#4D4B8C');
    //override a
    $('iframe').contents().find('a').css('vertical-align','super').css('font-size','smaller').css('text-decoration','none');

    $('iframe').contents().find('p').css('margin-bottom','10px').css('text-indent','24pt');

    Book.setStyle('text-align','left');
    Book.setStyle('line-height','1.5');
    //enable rendering
    Book.setStyle('text-rendering','optimizeLegibility')
    //set indent text
    Book.setStyle('text-indent','24pt');
    
    try{
        var conf = JSON.parse(localStorage.getItem('reader_conf'));
        //console.log(conf[0])
        if(conf[0]){
            Book.setStyle('font-size',conf[0]);
            $(".font-size-conf").attr('value',conf[0].replace('px',''))
        }
        if(conf[1]){
            //console.log(conf[1])
            font(conf[1])
        }
        if(conf[2]){
            line_spacing(conf[2])
        }
        if(conf[3]){
            theme_set(conf[3])
        }
    }catch(error){
        console.log(error.message)
    }
    //$('body').css('background','#f7f7f7');
    $(".font-size-conf").change(function(){
        var config = JSON.parse(localStorage.getItem('reader_conf'));
        var data = $(this).val()+'px';
        config[0]=data;
        console.log(data);
        if($(this).val() != ""){
            $('iframe').contents().find('p').css('font-size',data);
            Book.setStyle('font-size',data); 
            Book.render.resized();
            // $('iframe').contents().find('span').css('font-size','12px');
            // $('iframe').contents().find('span').css('line-height','1.3');
        }

        var data =JSON.stringify(config);
        window.localStorage.setItem('reader_conf',data);
    });
    
    var configure = JSON.parse(localStorage.getItem('reader_conf'));
    font_size(configure[0]);
    font(configure[1]);

    $('iframe').contents().find('span').css('background-color','transparent')
    $('iframe').contents().find('h1').css('background-color','transparent')
    $('iframe').contents().find('h2').css('background-color','transparent')
}
function font_size(data){
    var config = JSON.parse(localStorage.getItem('reader_conf'));
    config[0]=data;
    //$('#viewer iframe').contents().find('span').css('font-size',data);
    Book.setStyle('font-size',data);
    var data =JSON.stringify(config);
    window.localStorage.setItem('reader_conf',data);
}
function goto_sub(data){
    var sublink = data.split('#');
    Book.goto(sublink[0]);
    setTimeout(function(){
        Book.goto(data);
    },500);
}
function font(data){
    var conf = JSON.parse(localStorage.getItem('reader_conf'));
    conf[1]=data;
    $('.font').css('visibility','hidden');
    
    $("iframe").contents().find("span").css('font-family',data);
    $("iframe").contents().find("p").css('font-family',data);
    //$('#viewer iframe').contents().find('span').css('font-family',data);
    //$('.two').find('span').css('font-family',data);
    Book.setStyle('font-family',data);
    $('#font_'+data).css('visibility','visible');
    $('.itext_').css('color','#444');
    $('#itext_'+data).css('color','#ff5a5a');

    var data =JSON.stringify(conf);
    window.localStorage.setItem('reader_conf',data);
}
function change_line(data){
    line_spacing(data);
    setTimeout(function(){
        Book.render.resized();
        setTimeout(function(){
            //window.localStorage.removeItem(root+':pages:1');
            // Book.render.calculateNumberOfPages(true);
        },2500)
    },2500);
}
function line_spacing(data){
    var conf = JSON.parse(localStorage.getItem('reader_conf'));
    conf[2]=data;
    $('.tick_line').css('visibility','hidden');
    if(data==1.5){
        $('#viewer iframe').contents().find('span').css('line-height',1.7);
        $('#viewer iframe').contents().find('p').css('line-height',1.7);
    }else if(data==2){
        $('#viewer iframe').contents().find('span').css('line-height',1.8);
        $('#viewer iframe').contents().find('p').css('line-height',1.8);
    }else{
        $('#viewer iframe').contents().find('span').css('line-height',1.5);
        $('#viewer iframe').contents().find('p').css('line-height',1.5);
    }
    if(data !=1.5){
        $('#line_'+data).css('visibility','visible');
    }else{
        $('#line_15').css('visibility','visible');
    }

    var data =JSON.stringify(conf);
    window.localStorage.setItem('reader_conf',data);
}
function theme_set(data){
    var conf = JSON.parse(localStorage.getItem('reader_conf'));
    conf[3]=data;
    $('.tick_theme').css('visibility','hidden');
    if(data==1){
        //$('#viewer iframe').contents().find('span').css('color','#000000');
        Book.setStyle('color','#000000');
        $('#frame_ok').contents().find('span').css('color','#000')
        $('#frame_ok').contents().find('body').css('background-color','transparent')
        $('body').css('background','#f7f7f7');
        $('#theme1').css('visibility','visible');
        $('iframe').contents().find('h1 span').css('color','#4D4B8C');
        $('iframe').contents().find('h2 span').css('color','#4D4B8C');
        $('#ads').css('background-color','#f7f7f7')
        $('#frame_ok').contents().find('p').css('color','#000000')
    
    }else if(data==2){
        //$('#viewer iframe').contents().find('span').css('color','#000000');
        $('#frame_ok').contents().find('body').css('background-color','#ffebdc')
        Book.setStyle('color','#000000');
        $('#frame_ok').contents().find('span').css('color','#000')
        $('body').css('background','#ffebdc');
        $('#theme2').css('visibility','visible');
        $('iframe').contents().find('h1 span').css('color','#4D4B8C');
        $('iframe').contents().find('h2 span').css('color','#4D4B8C');
        $('#ads').css('background-color','#ffebdc')
        $('#frame_ok').contents().find('p').css('color','#000000')
    }else{
        $('body').css('color','#ffffff');
        //$('#viewer iframe').contents().find('span').css('color','#ffffff');
        $('#frame_ok').contents().find('body').css('background-color','#000')
        Book.setStyle('color','#ffffff');
        $('#frame_ok').contents().find('span').css('color','#fff')
        $('body').css('background','#000000');
        $('#theme3').css('visibility','visible');
        $('iframe').contents().find('h1 span').css('color','#fff');
        $('iframe').contents().find('h2 span').css('color','#fff');
        $('#ads').css('background-color','#000000')
        $('#frame_ok').contents().find('p').css('color','#ffffff')
    }

    var data =JSON.stringify(conf);
    window.localStorage.setItem('reader_conf',data);
}

//Function books_update
function books_percent(id,percent){
    var token = window.localStorage.getItem('token');
    var req_data = {'access_token':token,'type':'Book','key':id,'read_percentage':percent};
    var action = new majax_secure('items/update_percentage',req_data,'');
    action.error(function(data) {
    }),
    action.success(function(data){
        if (data.meta.code==200){
        }else{
        }
    });
}
function load_context(){
    $('iframe').contents().find('span').contextmenu({
      target: '#context-menu',
      before: function (e) {
          // This function is optional.
          // Here we use it to stop the event if the user clicks a span
          e.preventDefault();
          //this.closemenu();
          if (e.target.tagName == 'SPAN') {
              e.preventDefault();
              this.closemenu();
              return false;
          }
          //this.getMenu().find("li").eq(2).find('a').html("This was dynamically changed");
          return true;
      }
    });
    $('iframe').contents().find('p').contextmenu({
      target: '#context-menu',
      before: function (e) {
          // This function is optional.
          // Here we use it to stop the event if the user clicks a span
          e.preventDefault();
          //this.closemenu();
          if (e.target.tagName == 'SPAN') {
              e.preventDefault();
              this.closemenu();
              return false;
          }
          //this.getMenu().find("li").eq(2).find('a').html("This was dynamically changed");
          return true;
      }
    });
    //Disable Copy Paste
    $('iframe').contents().find('body').attr('oncopy','return false').attr('oncut','return false').attr('onpaste','return false').css("background-color", "transparent");
    $('iframe').contents().find('span').css('background-color','transparent')
    $('iframe').contents().find('h1').css('background-color','transparent')
    $('iframe').contents().find('h2').css('background-color','transparent')
    //$('iframe').contents().find('body').attr('oncopy','return false').attr('oncut','return false').attr('onpaste','return false');
}
function set_number(){
    $('#frame_ok').focus();
    // try{
    //     if(Book.spinePos>spine_pos){
    //         var persen = (Book.spinePos/Book.spine.length)*100;
    //         console.log(persen);
    //         books_percent(book_id,persen)
    //         spine_pos = Book.spinePos;
    //     }
    // }catch(error){
    //     console.log(error.message)
    // }
    footnote(); 
}
function r_next_page(){
    Book.nextPage();
    $('#bookmark span').removeClass('blue').addClass('grey')
    set_number();
    is_bookmark();
    $('#menu').hide();
}
function r_prev_page(){
    Book.prevPage();
    $('#bookmark span').removeClass('blue').addClass('grey')
    set_number();
    is_bookmark();
    $('#menu').hide();
}
function footnote(){
    var a =$('#viewer iframe').contents().find('a[href]');
    a.click(function(){
        var link = $(this).attr('href');
        link = link.replace('../','');
        Book.goto(link);
        setTimeout(function(){
            Book.goto(link);
            set_number();
            setTimeout(function(){
                Book.goto(link);
            },1000);
        },1000);
    });
}
function keyboard_act(){
    $('#frame_ok').contents().bind('keydown', function(e) {
        //console.log(e.keyCode);
        //right
        if (e.keyCode == 39) {
            //next_page();
            $('#r_next_page').click();
        }
        //left
        else if (e.keyCode == 37){
            //prev_page();
            $('#r_prev_page').click();
        }
        //up
        else if (e.keyCode == 38){

        }
        //down
        else if (e.keyCode == 40){

        }
        //esc
        else if (e.keyCode == 27){
            window.location.replace('index.html');
        }
    });
}
function share_reader(data){
    // share_url = App.api.url_share
    var link_ =  window.localStorage.getItem('link_profile') 
    if(link_){
        var link_profile = link_
    }else{
        var link_profile = App.api.base+'publications/books/'+book_id;
    }
    if(cover_book){

    }else{
        var cover_book=""
    }
    var SelRange;
    var frame = document.getElementById('frame_ok');
    var frameWindow = frame && frame.contentWindow;
    var frameDocument = frameWindow && frameWindow.document;

    if (frameDocument) {
        if (frameDocument.getSelection) {
            // Most browsers
            SelRange=frameDocument.getSelection().getRangeAt(0);
        }
        else if (frameDocument.selection) {
            // Internet Explorer 8 and below
            SelRange=frameDocument.selection.createRange().text;
        }
        else if (frameWindow.getSelection) {
            // Safari 3
            SelRange=frameWindow.getSelection().getRangeAt(0);
        }
    }
    aku=SelRange
    if (data==1){
        var S_quote = SelRange.toString();
        var quote = limitCharacter(S_quote,100);

        console.log(cover_book)
        var fb_token = localStorage.getItem('fb_token')
        if(fb_token!=""){
            //fb_share(SelRange);
            if(cover_book!=""){
                if(cover_book!=undefined){
                    gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&picture='+cover_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
                }else{
                    gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
                }
            }else{
                gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
            }
        }else{
            if(cover_book!=""){
                if(cover_book!=undefined){
                    gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&picture='+cover_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
                }else{
                    gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
                }
            }else{
                gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+title_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
            }
        }
    }if(data==2){
        var S_quote = SelRange.toString();
        var quote = limitCharacter(S_quote,100);
        gui.Shell.openExternal('http://twitter.com/share?text="'+quote+'"%20%0A&url='+link_profile);
    }if(data==3){
        var fragment = SelRange.cloneContents();
        var div = document.createElement('div');
        div.appendChild( fragment.cloneNode(true) );
 
        // your document fragment to a string (w/ html)! (yay!)
        var text = div.innerText;
        console.log(text);

        //add_notes(SelRange);
        
        setTimeout(function(){
            var token = window.localStorage.getItem('token');
        var data={'access_token':token,'title':title_book,'note':text};
        console.log(data);
            var post = majax_post('notes/add',data,'');
            post.success(function(data){
            //console.log(data);
            //console.log(data);
            if(data.meta.code == 200){
                App.content='Note saved';
                $('#confirm_trans_success').click();
                r_get_notes();
            }
            else{
                App.content="Failed saved note";
                $('#confirm_trans_failed').click();
            }
        });
        post.error(function(data){
            // Moco.content="No Internet Connection";
            // $('#confirm_trans_failed').click();
        });
        },500);
    }if(data==4){
        var S_quote = SelRange.toString();
        var quote = limitCharacter(S_quote,100);
        gui.Shell.openExternal('http://www.linkedin.com/shareArticle?mini=true&url='+link_profile+'&amp;summary="'+quote+'"');


    }if(data==5){
        var S_quote = SelRange.toString();
        var quote = limitCharacter(S_quote,250);
        gui.Shell.openExternal('mailto:?Subject=Sharing Quote via iNgawi&Body='+title_book +'%20%0A "'+quote+'"%20%0A via iNgawi desktop');
    }
}

//Zooming function
function set_zoom(data){
    $('.close').click();
    // get_zoom_data(data);
    $('.complete').attr('href',data);
    $('.complete').click();
    setTimeout(function(){
        var k=$(".zoomingBox-xl").width(),
        l=$(".zoomingBox-xl").height(),
        m = 0.7 * window.innerWidth,
        o = 0.9 * window.innerHeight;
        console.log(k,l,m,o)
        if(k>l){
            console.log('lebar')
            $(".zoomingBox-xl").css('width',m)
        }else{
            console.log('panjang')
            $(".zoomingBox-xl").css('height',o)
        }
        set_margin()
    },100)
    act_zoom();
    $('.zoom_right').attr('onclick','window.top.set_nextzoom(\''+data+'\')')
    $('.zoom_left').attr('onclick','window.top.set_prevzoom(\''+data+'\')')
}

function act_zoom(){

}
function set_margin(){
    var top = (window.innerHeight-$('#zoomingBox-content').height())/2;
    console.log(top);
    $('#zoomingBox-content').css('margin-top',top);
}
function set_nextzoom(data){
    try {
        var link = get_zoom_data(data);
        console.log(link)
        var imageUrl = link;
        imageExists(imageUrl, function(exists) {
          console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
            if(exists==true){
                setTimeout(function(){
                    set_zoom(link)
                },10)    
            }else{
                setTimeout(function(){
                    set_zoom(data)
                    $('.zoom_right').css('display','none')
                },10)
            }
        });
    }
    catch(err) {
        console.log(err.message);
    }
}
function set_prevzoom(data){
    try {
        var link = get_zoom_data(data,'prev');
        console.log(link)
        var imageUrl = link;
        imageExists(imageUrl, function(exists) {
          console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
            if(exists==true){
                setTimeout(function(){
                    set_zoom(link)
                },10)    
            }else{
                setTimeout(function(){
                    set_zoom(data)
                    $('.zoom_left').css('display','none')
                },10)
            }
        });
    }
    catch(err) {
        console.log(err.message);
    }
}
function get_zoom_data(data,ket){
    var split = data.split('/');
    var img = split[split.length-1];
    var loc = data.split(img);
    var locate = loc[0];
    var num = get_numbers(img);
    var part = img.split(num);
    var length = num[0].length;
    var content = '';
    if(ket=='prev'){
        var c = parseInt(num)-1;
        var d = '';
        console.log(c.toString().length)
        console.log(c)
        for(i=c.toString().length;i<length;i++){
            d +='0';
        }
        content=d+c;
    }else{
        var c = parseInt(num)+1;
        var d = '';
        console.log(c.toString().length)
        console.log(c)
        for(i=c.toString().length;i<length;i++){
            d +='0';
        }
        content=d+c;
    }
    var link = locate + part[0] + content + part[1];
    return link;
}
function get_numbers(input) {
    return input.match(/[0-9]+/g);
}
function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

//Memo
// Highlight Reader
var range_add,sel_add,chapter_memo,sel_data,window_range,memo_id,data_dom;
function highlight_reader(data){
    var colour;
    if (data==1){
        colour="#F52754";
    }
    if (data==2){
        colour="#4DD9E8";
    }
    if(data==3){
        colour="#35BD50";
    }
    if(data==4){
        colour="#F5FA66";
    }
    if(data==5){
        colour="#FFFFFF";
    }
    if(data==6){
        colour="rgba(255,90,90,0.5)";
    }

    var range,sel;

    var frame = document.getElementById('frame_ok');
    var frameWindow = frame && frame.contentWindow;
    var frameDocument = frameWindow && frameWindow.document;

    if(frameWindow.getSelection){
        sel=frameWindow.getSelection(0);
        if(sel.getRangeAt){
            range=sel.getRangeAt(0);
            //console.log(range);
            range_add=range;
        }
        document.designMode="on";
        if(range){
            sel.removeAllRanges();
            sel.addRange(range);
            sel_add=sel;
            SelRange=sel_add;
            //console.log(sel);
        }

        var chap = sel.anchorNode.baseURI.split('/');
        chapter_memo = chap[chap.length-1]+'__'+Book.render.getPageCfi(); 
        App.data_dom=frameWindow.document.getSelection(0).getRangeAt(0);
        localStorage.setItem('DOM',App.data_dom);
        add_memo(App.data_dom);
        if(data==5){
            frameWindow.document.execCommand('underline',false,null);
            $('#viewer iframe').contents().find('u').css('text-decoration','none').css('border-bottom','solid red');
        }else{
            frameWindow.document.execCommand('BackColor',false,colour);
            window_range = frameWindow;
            setTimeout(function(){
                $('#context-menu').removeClass('open');
            },100);
        }

        document.designMode="off";      
    }
}

var DOM,title_memo;
function add_memo(data2){
    var token = window.localStorage.getItem('token');
    DOM = range_add.cloneRange();

    sel_add = data2;
    title_memo = "'<span>"+sel_add+"<span>'";
    //alert(data2);
    //var req_data = {'access_token':token,'book_id':book_id,'title':"'"+sel_add+"'",'description':note,'chapter':chapter_memo,'dom':"'"+range_add.commonAncestorContainer.parentElement.outerHTML+"'"};
    if(book_id){
        var req_data = {'access_token':token,'book_id':book_id,'title':"'<span>"+sel_add+"<span>'",'description':note,'chapter':chapter_memo,'dom':"'<span>"+sel_add+"<span>'"};
    }else{
        var req_data = {'access_token':token,'book_id':'','title':"'<span>"+sel_add+"<span>'",'description':note,'chapter':chapter_memo,'dom':"'<span>"+sel_add+"<span>'"};
    }
    var action = new majax_secure('memos/add',req_data,'');
    action.error(function(data) {
    }),
    action.success(function(data){
        if (data.meta.code==200){
            //console.log(data);
            memo_id=data.data.Memos.id;
            edit_memo();
            get_memo();
            setTimeout(function(){
                $('#memo_desc').val('');
                $('#load_memo').click();
            },200)
            //$('#load_memo').click();
            context_pos();
            $('#frame_ok').contents().find('body').click(function(){
                //console.log('luar');
                $('#menu').hide();
            })

        }else{
        }
    });
}

function del_memo(id){
    var token = window.localStorage.getItem('token');
    var req_data = {'access_token':token,'memo_id':id};
    var action = new majax_secure('memos/delete',req_data,'');
    $('#memo_'+id).hide();
    $('#divider_'+id).hide();
    action.error(function(data) {
    }),
    action.success(function(data){
        if (data.meta.code==200){
        }else{
        }
    });
}

function memo_load(id){
    //$('iframe').contents().find('memo').click(function(){
        $('iframe').contents().find('memo').css('z-index','1000');
        var top_pos = $('iframe').contents().find('memo').position().top+50;

        // if($(window).height()-$('#menu').position().top<250){
        // var top_pos = $(window).height()-250;
        // $('#menu').css('top',top_pos);
        // }

        $('#load_memo').click();
        setTimeout(function(){
            //context_pos();
            $('#menu').css('top',top_pos);
            $('#menu').css('left',20);
        },100)

        edit_memo(id);

        $('#frame_ok').contents().find('body').click(function(){
            //console.log('luar');
            $('#menu').hide();
        })


    //});
}
function get_memo(){
    //&ldquo;
    var token = window.localStorage.getItem('token');
    $('#toc_note > li').remove();
    if(book_id){
        var notes = new majax('memos/index',{'access_token':token,'book_id':book_id},'');
    }else{
        var notes = new majax('memos/index',{'access_token':token,'book_id':''},'');
    }
    note_text ='';
    count='';
    notes.success(function(data){
       if(data.meta.code==200){
        //count = data.data.total_result;
        console.log(data.data.data)
        $.each(data.data.data,function(){
            var memo = this.Memo;
            console.log(memo)
            var title_memo = memo.title.replace(/'<span>/g,"").replace(/<span>'/g,"");
            title_memo = title_memo.replace(/'/g,'--')
            title_memo = title_memo.replace(/"/g,"---")
            title_memo = title_memo.replace(/ /g,'___')
            console.log(title_memo)
            title_memo = title_memo.replace(/\n/g,'-__--')
            title_memo = title_memo.replace(/\r/g,'--__-')
            console.log(title_memo)
            try{
                var memo_desc = memo.description.replace(/'/g,'--')
            }catch(e){
                console.log(e.message)
                var memo_desc = "";
            }
            memo_desc = memo_desc.replace(/"/g,'---')
            memo_desc = memo_desc.replace(/ /g,'___')

            //console.log(title_memo)
            var chapter_ = "'"+memo.chapter+"'";
            //var created_time=change_time(note.modified);
            note_text +='<li id="memo_'+memo.id+'" style="width:275px;">';
            note_text+="<div class='SmallGrey' style='margin-bottom: 0px;color:#ff5a5a;font-family:georgia;cursor:pointer;' onclick=get_DOM('"+memo.chapter+"','"+title_memo+"',"+memo.id+",'"+memo_desc+"')>";
            note_text +='<span class="medium" style="color:#ff5a5a;font-size:20px;position:absolute;left:18px;display:none">&ldquo;</span>'+limitCharacter(memo.title,95)+'</div>\
            <div style="font-size:0.8em;color:#777;">'+limitCharacter(memo.description,50)+'</div>\
            <div><span class="SmallGrey" style="font-size:0.6em;color:#777;">'+memo.elapsed_time+'</span><span style="padding-left:5px;padding-right:5px;">&middot;</span><span style="color:#444;cursor:pointer;font-size:10px;" onclick="del_memo('+memo.id+')">Delete</span></div>\
            </li>\
            <li id="divider_'+memo.id+'" class="divider" style="width:275px;padding-top:0px;"></li>';
        }); 
       $('#toc_note').html(note_text);
  //      jQuery(document).ready(function() {
  // jQuery("abb.timeago3").timeago();
  //   });
        }
   });
    notes.error(function(data){
        //alert('Network Error');
    });
}

var memo_val;

function edit_memo(id){
    var token = window.localStorage.getItem('token');
    //var data_range = sel_add.focusNode.data;

    var data_range ="";
    $('#memo_desc').keyup(function(){
        clearTimeout(typingTimer);
        if ($('#memo_desc').val()) {
            typingTimer = setTimeout(function(){
                //do stuff here e.g ajax call etc....
                var note= $('#memo_desc').val();
                memo_val = $('#memo_desc').val();
                if (book_id==null){
                    //console.log('kosong');
                }else{
                    //console.log('isi');
                    if(id!=undefined){
                        memo_id=id;
                    }
                    //console.log(memo_id)
                    var req_data = {'access_token':token,'title':title_memo,'memo_id':memo_id,'description':note};
                    //console.log('tengah');
                    //console.log(req_data)
                    var action = new majax_secure('memos/edit',req_data,'');
                    //console.log('akhir')
                    action.success(function(data){
                        console.log(data);
                    if(data.meta.code == 200){
                        //get_notes();

                        get_memo();
                    }
                    else{
                        var msg = "";
                        console.log(data)
                        //alert(msg);
                    }
                });
                }
            }, doneTypingInterval);
        }
    });
}

function get_r_notes(status){
    $('#load_more').css('visibility','hidden');
    $('#notes_action_more').attr('onclick','more_get_notes('+status+')');
    page_note =0;
    count_note =2;
    var local = ReadData('_rnotes');
    if(local!=null){
      //console.log(local);
      $('#memo_content').html('');
      r_parse_notes(local);
    }else{
        var before =$('#memo_content').html('<center style="padding-top:25px;"><img src="css/plugin/images/bx_loader.gif"></center>');
    }
    var token = window.localStorage.getItem('token');
    var notes = new majax('notes/index',{'access_token':token,'per_page':100},'');
    note_text ='';
    notes.success(function(data){
        if(data.meta.code==200){
            count = data.data.total_result;
            page_note = data.data.num_pages;
            if(page_note>1){
                $('#load_more').css('visibility','visible');
              }else{
                $('#load_more').css('visibility','hidden');
              }

            WriteData('_rnotes', data)
            if(local==null){
                  //console.log(local);
                $('#memo_content').html('');
                r_parse_notes(data);
            }else{
                $('#memo_content').html('');
                r_parse_notes(data);
            }

            setTimeout(function(){ThisAnim('#memo_content','fadeInRight')},200);
            if(status=="true"){
                $('.btn-del').css('display','block');
                $('#btn-edit').css('color','#c92036');
            }
            jQuery(document).ready(function() {
                jQuery("abb.timeago3").timeago();
            });
            edit_notes();
        }else{
            $('#memo_content').html('');
            $('#load_more').css('visibility','hidden');
        }
        
    });
    notes.error(function(data){
        $('#load_more').css('visibility','hidden');
    });
}

function r_parse_notes(data){
    var note_text="";
    $.each(data.data.data,function(){
        var note = this.Note;
        var created_time=change_time(note.modified);
        note_text += '<div style="" class="list_notes" id="index_'+note.id+'">\
                        <div style=";padding-bottom:0px;cursor:pointer;padding-left:0px;" onclick="syn_note('+note.id+')">\
                            <div class="col-xs-10 col-md-11" style="padding:0;padding-top:12px;cursor:pointer">\
                                <div class="_title" id="_title'+note.id+'" style="font-size:12px;">'+note.title+'</div>\
                                <div><abb class="timeago3 grey _time" id="_time'+note.id+'" title="'+created_time+'" style="font-size:10px;"></abb></div>\
                            </div>\
                             <div class="col-xs-2 col-md-1 btn-del" id="memo_check'+note.id+'" style="padding-top:25px;visibility:hidden;"><i href="#/main/notes" onclick="" class="moco mc-check" style="color:#b31635;font-size:13px;"></i>\
                             </div>\
                            <div class="col-md-12 col-xs-12" style="padding-top:0px;padding-left:0px;">\
                                <div class="divider" style="padding-top:0px;"></div>\
                            </div>\
                        </div>\
                    </div>';
    }); 
    $('#memo_content').append(note_text);
}

var id_note_syn;

function syn_note(id){
    $('.btn-del').css('visibility','hidden');
    $('#memo_check'+id).css('visibility','visible');
    id_note_syn = id;
    if(id_note_syn){
        $('#btn-syntonote').removeAttr('disabled');
        $('#btn-syntonote').attr('onclick','add_child('+id_note_syn+')');
    }
}

function act_new_note(){
    if(memo_val==undefined){
        memo = "";
    }else{
        memo = memo_val;
    }
    var note_text="";
    var dom_=localStorage.getItem('DOM');
    note_text +='<div id="memo_696969" style="padding-left:20px;border-top:1px solid #ddd">';
    note_text+="<div class='SmallGrey' style='margin-bottom: 0px;color:#ff5a5a;font-family:georgia;'>";
    note_text +='<span class="medium" style="color:#ff5a5a;font-size:20px;position:absolute;left:10px;">&ldquo;</span>'+dom_+'</div>\
    <div style="font-size:0.8em;color:#777;">'+memo+'</div>\
    <div><span class="SmallGrey" style="font-size:0.6em;color:#777;">Just Now</span><span style="padding-left:5px;padding-right:5px;">&middot;</span><span style="color:#444;cursor:pointer;font-size:10px;" onclick="del_memo(696969)">Delete</span></div>\
    </div>\
    <div class="divider" style="padding-top:0px;"></div>';
    $('#note_content').html(note_text);
    $('#anote_title').val(title_book);
    $('#btn-addnote').attr('onclick','syncToNote()')
    setTimeout(function(){
        
    },100)
    
}

function context_pos(){
    // if($(window).height()-$('#menu').position().top<250){
    //     var top_pos = $(window).height()-250;
    //     $('#menu').css('top',top_pos);
    // }
    // if($(window).width()-$('#menu').position().left<250){
    //     var left_pos = $(window).width()-250;
    //     console.log(left_pos);
    //     $('#menu').css('left',left_pos);
    // }
    // if($('#menu').position().left<50){
    //     var left_pos = 50;
    //     console.log(left_pos);
    //     $('#menu').css('left',left_pos);
    // }
}

function getPath(){
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    
    if(navigator.appVersion.indexOf("Win")!=-1){
        var link = appPath.replace(/ /g,'%20');
        var callback='file:///'+link+'/www/';
        return callback;
    }else {
        var link = appPath.replace('MacOS','Resources');
        var callback='file://'+link+'/www/';
        return callback;
    }
}

function add_child(parent_id){
    var token = window.localStorage.getItem('token');
    var note= $('#memo_desc').val();
    var req_data = {'access_token':token,'parent_id':parent_id,'title':sel_data,'note':note};
    var action = new majax_post('notes/add_child',req_data,'');
    action.error(function(data) {
    }),
    action.success(function(data){
        if (data.meta.code==200){
            //console.log(data);
            $('#close').click();
        }else{
        }
    });
}

function syncToNote(){
    var token = window.localStorage.getItem('token');
    var title = $('#anote_title').val();
    var req_data = {'access_token':token,'title':title};
    var action = new majax_secure('notes/add',req_data,'');
    action.error(function(data) {
    }),
    action.success(function(data){
        if (data.meta.code==200){
            $('.x').click();
            console.log(data);
        }else{
        }
    });
}

function get_DOM(chapter,data,id,desc){
    //Book.goto('Text/'+chapter);
    var link_to= chapter.split('__')
    // Book.render.gotoPercent(link_to[1]);
    console.log(link_to[1])
    Book.displayChapter(link_to[1])
    var arr = data.replace(/---/g,'"');
    //console.log(arr);
    arr = arr.replace(/___/g,' ');
    //console.log(arr);
    arr = arr.replace(/--/g,"'");
    arr = arr.replace(/-__--/g,'\n')
    arr = arr.replace(/--__-/g,'\r')
    //console.log(arr);

    var memo_desc = desc.replace(/---/g,'"')
    memo_desc = memo_desc.replace(/___/g,' ');
    memo_desc = memo_desc.replace(/--/g,"'");

    memo_id = id;
    sel_data = arr;
    //sel_data = data;

    //$('#memo_desc').val(str_desc);
    $('#memo_desc').val(memo_desc);
    //console.log(chapter);
    //console.log(str);
    
    // var image = getPath()+'images/icon/quote.png';
    // var quote = '<span id="'+id+'" style="position:relative;left:-10px;cursor:pointer;z-index:222" ><img onclick="memo_load('+id+');" src="'+image+'"></span>';
    // insertHtmlAtSelectionEnd(quote, true);
    setTimeout(function(){
        $("iframe").contents().find("p").removeHighlight().highlight(arr);
        //$("iframe").contents().find("memo").prepend(quote);
        $("iframe").contents().find("memo").css('cursor','pointer').attr('onclick','memo_load('+id+')');
        memo_load(id);
        var innerWindow = document.getElementById('frame_ok').contentWindow;
        innerWindow.memo_load= memo_load;
    },500); 
}

var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;
        
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection && document.body.createTextRange) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}

var savedSelection;


//Bookmark
function action_bookmark(){
    var a = $('#bookmark span').attr('class');
    console.log(a)
    if(a=='moco-bookmark grey'){
        console.log('add');
        add_bookmark();
        show_bookmark();
    }else{
        console.log('del');
        del_bookmark();
        show_bookmark();
    }
}
function add_bookmark(){
    var name_bookmark = ""
    try{
        var angka = 
        name_bookmark = $('iframe').contents().find('#EPUBJS-PAGE-'+Book.render.chapterPos).html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
        // console.log(name_bookmark)
    }catch(error){
        // console.log(error.message)
        if($('iframe').contents().find('h1').length!=0){
            name_bookmark = $('iframe').contents().find('h1').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
            if(name_bookmark==""){
                name_bookmark = $('iframe').contents().find('h1 span').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');            
            }
        }else if($('iframe').contents().find('h1 span').length!=0){
            name_bookmark = $('iframe').contents().find('h1 span').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
        }else if($('iframe').contents().find('h2').length!=0){
            name_bookmark = $('iframe').contents().find('h2').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
            if(name_bookmark==""){
                name_bookmark = $('iframe').contents().find('h2 span').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');            
            }
        }else if($('iframe').contents().find('h2 span').length!=0){
            name_bookmark = $('iframe').contents().find('h2 span').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
        }else{
            name_bookmark = "No Title"
        }
    }
    name_bookmark = strip(name_bookmark)
    // console.log(name_bookmark)
    var a = Book.render.getPageCfi(),
    b = a.match(/\[(.*?)\]/),
    c = b[1],
    d = c.split('.'),
    e = d[0],
    g = e.split('Section'),
    h = parseInt(g[1]),
    i = h-1;

    console.log(g[1]);
    $('#viewBookmark i').removeClass('grey').addClass('blue')
    // var a = PDFView.documentFingerprint;
    var b =JSON.stringify(bookmark);

    if(g[1]!=undefined){
        if(a==null){
            alert('Loading count page, Bookmark can be done. Please try again later')
        }else{
            var g = i+'__'+a+'__'+name_bookmark;
            console.log(g)
            bookmark.push(g);
            bookmark = bookmark.filter( onlyUnique ); 
            $('#bookmark span').removeClass('grey').addClass('blue')
            var data =JSON.stringify(bookmark);
            localStorage.setItem(root+'newbookmark',data);
        }
    }else{
        // var f = Book.render.getReadingPercentage();
        //console.log(f)
        var index = Book.contents.spineIndexByURL;
        //console.log(index)
        var num_index = index[Book.chapter.href];
        //console.log(num_index)
        if(f==null){
            alert('Loading count page, Bookmark can be done. Please try again later')
        }else{
            var gi = num_index+'__'+a+'__'+name_bookmark;
            bookmark.push(gi);
            bookmark = bookmark.filter( onlyUnique ); 
            $('#bookmark span').removeClass('grey').addClass('blue')
            var data =JSON.stringify(bookmark);
            localStorage.setItem(root+'newbookmark',data);
        }
    }
    //console.log(a);
    
}
function del_bookmark(){
    if($('iframe').contents().find('h1 span').length!=0){
        var name_bookmark = $('iframe').contents().find('h1 span').html().replace(/ /g,'-').replace(/\'/g,'').replace(/\"/g,'').replace(/_/g,'*');
    }else{
        var name_bookmark = "No Title"
    }
    var a = Book.render.getPageCfi(),
    b = a.match(/\[(.*?)\]/),
    c = b[1],
    d = c.split('.'),
    e = d[0],
    g = e.split('Section'),
    h = parseInt(g[1]),
    i = h-1;

    // var f = Book.render.getReadingPercentage();
    var g = i+'__'+a+'__'+name_bookmark;
    // var aa = i+'_'+f;
    var aa = i+'__';
    console.log(g)
    var h = bookmark.indexOf(g);
    var bb = bookmark.indexOf(aa);
    if(h==-1){
        delete bookmark[0];
        delete bookmark[0];
    }else{
        delete bookmark[h];
        delete bookmark[bb];
    }
    bookmark = $.grep(bookmark,function(n){ return(n) });
    $('#bookmark span').removeClass('blue').addClass('grey')
    var data =JSON.stringify(bookmark);
    localStorage.setItem(root+'newbookmark',data);
}
function is_bookmark(){
    // var percent = Book.render.getReadingPercentage();
    var percent = Book.render.getPageCfi();
    //console.log(percent);
    $('#bookmark span').addClass("grey").removeClass("blue");
    var i=0;
    try{
        bookmark.forEach(function(){
            var a = bookmark[i].split('__');
            //console.log(a[1]);
            // console.log(percent)
            // console.log(a[1])
            if(a[1] == percent){
                //alert('OK2');
                $('#bookmark span').removeClass("grey").addClass("blue");
            }
            i++;
        })
    }catch(error){
        console.log(error.message)
        bookmark = [];
    }
    // books_percent(book_id,persen*100);
}
function show_bookmark(){
    var array_toc=[];
    $('#toc_bookmark > li').remove();
    $('#toc_bookmark').html('')

    i=0;
    var _toc =Book.getToc().resolvedValue;
    _toc.forEach(function(toc){
        array_toc.push(toc.label)
        if(toc.subitems.length>0){
            var sub = toc.subitems;
            sub.forEach(function(sub){
                array_toc.push(sub.label)
            }); 
        }
    })
    //console.log(toc);
    try{
        bookmark.forEach(function(){
            var _a = bookmark[i].split('__');
            var _c = _a[0];
            setTimeout(function(){
                if(_a[2]){
                    // console.log(_a[2])
                    var title_bookmark = limitCharacter(_a[2].replace(/\*/g,'_').replace(/-/g," "),30);
                }else{
                    if(array_toc[_c]!=undefined){
                        var title_bookmark = array_toc[_c].capitalize();
                    }else{
                        var title_bookmark = "Untitled"
                    }
                }
                var html="<li id='bookmark_' style='cursor:pointer;font-size:14px;'><a onclick=goto_bookmark(\'"+_a[1]+"\')>\
                <span style='color:#777;'>"+title_bookmark+"</span></a></li>\
                <li id='toc_' class='divider' style='padding-top:0px;border-color:#fafafa'></li>"
                $("#toc_bookmark").append(html);
            },500)
            
            i++;
        })
    }catch(error){
        console.log(error.message)
    }
}
function goto_bookmark(data){
    Book.displayChapter(data);
    setTimeout(function(){
        is_bookmark()
    },1000)
}
//convert arabic to roman
function romanize (num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

