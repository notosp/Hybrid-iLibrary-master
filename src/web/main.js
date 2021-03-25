console.log(gui)
window.persen=0;
var book_id = localStorage.getItem('book_id');
var typingTimer;                
var doneTypingInterval = 1000;
function limitCharacter(textToLimit, wordLimit,status)
{
    var finalText = "";
    if(textToLimit==null){
        return textToLimit;
    }else{
        var numberOfWords = textToLimit.length;
        //console.log(numberOfWords,wordLimit)
        var i=0;
        if(numberOfWords > wordLimit)
        {
            if(status){
                $('#read_more').show();
            }
            for(i=0; i< wordLimit; i++)
            finalText = finalText+ textToLimit[i];
            return finalText+"...";
        }
        return textToLimit;
    }
}
var range_add,sel_add,chapter_memo,sel_data,window_range,memo_id,data_dom;
function share(data){
    console.log(gui)
    var SelRange;
    SelRange= window.getSelection().getRangeAt(0);
    var S_quote = SelRange.toString().replace(/'/g,'').replace(/"/g,'');
    var quote = limitCharacter(S_quote,100);
    var fb_id = window.localStorage.getItem('fb_id')
    var app_base = window.localStorage.getItem('app_base')
    var book_id = window.localStorage.getItem('book_id')
    var link_ =  window.localStorage.getItem('link_profile') 
    var books_title = localStorage.getItem('books_title');
    if(link_){
        var link_profile = link_
    }else{
        var link_profile = app_base+'publications/books/'+book_id;
    }
    fb_token="";
    if (data==1){
        // if(fb_token!=""){
        //     gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+fb_id+'&link='app_base+'/books/view/'+book_id+'&name='+SelRange+'&name="'+SelRange+'"&message='+SelRange+'%20%0Afrom '+title_book+'&picture='+cover_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
        // }else{
        //    gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+fb_id+'&link='app_base+'/books/view/'+book_id+'&name='+SelRange+'&name="'+SelRange+'"&message='+SelRange+'%20%0Afrom '+title_book+'&picture='+cover_book+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
            
        // }
        gui.Shell.openExternal('http://www.facebook.com/dialog/feed?app_id='+fb_id+'&link='+link_profile+'&name="'+quote+'"&message='+quote+'%20%0Afrom '+books_title+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0');
    }if(data==2){
        gui.Shell.openExternal('http://twitter.com/share?text="'+quote+'"%20%0A&url='+link_profile);    
    }if(data==3){
        var fragment = SelRange.cloneContents();
        var div = document.createElement('div');
        div.appendChild( fragment.cloneNode(true) );
        var text = div.innerText;
        console.log(text);
        setTimeout(function(){
        var token = window.localStorage.getItem('token');
        var data={'access_token':token,'title':title_book,'note':text};
        console.log(data);
            var post = majax_secure('notes/add',data,'');
            post.success(function(data){
            if(data.meta.code == 200){
                Moco.content='Note saved';
                $('#confirm_trans_success').click();
                r_get_notes();
            }
            else{
                Moco.content="Failed saved note";
                $('#confirm_trans_failed').click();
            }
        });
        post.error(function(data){
            Moco.content="No Internet Connection";
            $('#confirm_trans_failed').click();
        });
        },500);
    }if(data==4){
        gui.Shell.openExternal('http://www.linkedin.com/shareArticle?mini=true&url='+link_profile+'&amp;summary="'+quote+'"');
    }if(data==5){
        gui.Shell.openExternal('mailto:?Subject=Sharing Quote via iNgawi&Body='+books_title +'%20%0A "'+quote+'"%20%0A via iNgawi Desktop');
    }if(data==6){
        // alert('Will be available soon');
        add_memo(S_quote)
        // var href = PDFView.getAnchorUrl(pdfOpenParams);
        // var a1 = href.split('#');
        // var a = a1[1].split('&')
        // console.log(quote)
        // console.log(a[0])
        // var dom = quote+"__"+a[0];
    }

}

var bookmark=[];

function action_bookmark(data){
    var a = $('#viewBookmark i').attr('class');
    if(a=='moco-bookmark grey'){
        console.log('add');
        add_bookmark(data);
        load_bookmark();
    }else{
        console.log('del');
        del_bookmark(data);
        load_bookmark();
    }
}

function load_bookmark(){
    var a = getFileName(PDFView.url).replace(/ /g,'_')
    bookmark = JSON.parse(localStorage.getItem(a));
    $("#toc_bookmark").html('')
    var html='';
    try{
        bookmark.forEach(function(a){
            var title = a.replace('=',' ').capitalizeFirstLetter();
            var html='<div class="outlineItem"><a href="#'+a+'">'+title+'</a></div>';
            $("#toc_bookmark").append(html);
        })
    }catch(error){
        console.log(error.message)
    }
}

function go_bookmark(data){
    PDFView.initialBookmark=data;
    PDFView.open(PDFView.url+data)
}

function add_bookmark(data){
    $('#viewBookmark i').removeClass('grey').addClass('red')
    // var a = PDFView.documentFingerprint;
    var a = getFileName(PDFView.url).replace(/ /g,'_')
    bookmark.push(data);
    bookmark = bookmark.filter( onlyUnique ); 
    var b =JSON.stringify(bookmark);
    localStorage.setItem(a,b);
    load_bookmark();
}

function del_bookmark(data){
    // var a = PDFView.documentFingerprint;
    var a = getFileName(PDFView.url).replace(/ /g,'_')
    var h = bookmark.indexOf(data);
    console.log(data)
    console.log(h)
    if(h==-1){
        delete bookmark[0];
    }else{
        delete bookmark[h];
    }
    bookmark = $.grep(bookmark,function(n){ return(n) });
    $('#viewBookmark i').removeClass('blue').addClass('grey')
    var data =JSON.stringify(bookmark);
    localStorage.setItem(a,data);
    load_bookmark();
}

function is_bookmark(data){
    var page = data.split('&');
    var i=0;
    $('#viewBookmark i').addClass("grey").removeClass("red");
    try{
        bookmark.forEach(function(){
            var a = bookmark[i].split('&');
            if(a[0] == page[0]){
                $('#viewBookmark i').removeClass("grey").addClass("red");
            }
            i++;
        })
    }catch(error){
        console.log(error.message)
        bookmark = [];
    }
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var DOM,title_memo,note,memo_id;
function add_memo(word){
    var token = window.localStorage.getItem('token');
    if(book_id){
        var req_data = {'access_token':token,'book_id':book_id,'title':word,'description':note,'chapter':'pdf','dom':curr_page};
    }
    var action = new majax_secure('memos/add',req_data,'');
    action.error(function(data) {
    }),
    action.success(function(data){
        console.log(data)
        if (data.meta.code==200){
            memo_id=data.data.Memo.id;
            edit_memo();
            get_memo();
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

function memo_load(id,link){
    edit_memo(id);
    $('#memo_load a').attr('href','#'+link)
    setTimeout(function(){
         $('#memo_load a').click();
        location.href="#"+link;
    },500)
}
function get_memo(){
    var token = window.localStorage.getItem('token');
    console.log(book_id)
    if(book_id){
        var notes = new majax('memos/index',{'access_token':token,'book_id':book_id},'');
        note_text ='';
        count='';
        notes.success(function(data){
           if(data.meta.code==200){
            console.log(data.data.data)
            $.each(data.data.data,function(){
                var memo = this.Memo;
                try{
                    var memo_desc = memo.description
                }catch(e){
                    console.log(e.message)
                    var memo_desc = "";
                }
                //var created_time=change_time(note.modified);
                note_text +='<div id="memo_'+memo.id+'" style="width:200px;padding-left:10px;padding-right:10px">';
                note_text+="<div class='SmallGrey' style='margin-bottom: 0px;color:#ff5a5a;font-family:georgia;cursor:pointer;' onclick=memo_load('"+memo.id+"','"+memo.dom+"')>";
                note_text +='<span class="medium" style="color:#ff5a5a;font-size:20px;position:absolute;left:18px;display:none">&ldquo;</span>'+limitCharacter(memo.title,95)+'</div>\
                <div style="font-size:0.8em;color:#777;">'+limitCharacter(memo.description,50)+'</div>\
                <div><span class="SmallGrey" style="font-size:0.6em;color:#777;">'+memo.elapsed_time+'</span><span style="padding-left:5px;padding-right:5px;">&middot;</span><span style="color:#444;cursor:pointer;font-size:10px;" onclick="del_memo('+memo.id+')">Delete</span></div>\
                </div>\
                <div id="divider_'+memo.id+'" class="divider" style="width:200px;padding-top:0px;"></div>';
            }); 
           $('#toc_note').html(note_text);
            }
        });
        notes.error(function(data){
        });
    }
}
var memo_val;

function edit_memo(id){
    var token = window.localStorage.getItem('token');
    $('#menu').show();
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
                    if(id!=undefined){
                        memo_id=id;
                    }
                    var req_data = {'access_token':token,'title':title_memo,'memo_id':memo_id,'description':note};
                    var action = new majax_secure('memos/edit',req_data,'');
                    action.success(function(data){
                        console.log(data);
                    if(data.meta.code == 200){
                        get_memo();
                    }
                    else{
                        var msg = "";
                        console.log(data)
                    }
                });
                }
            }, doneTypingInterval);
        }
    });
}
var myVar = setInterval(function(){ myTimer() }, 30000);

function myTimer() {
    // var d = new Date();
    // var t = d.toLocaleTimeString();
    // document.getElementById("demo").innerHTML = t;
    var a = $('#page_progress').css('width');
    a = a.replace('px','')
    var persen = parseInt(a)/4;
    //console.log(persen)
    books_percent(persen)
}

function myStopFunction() {
    clearInterval(myVar);
}

setTimeout(function(){
    var books_title = localStorage.getItem('books_title');
    PDFView.setTitle(books_title)
},3000)

function majax_secure(get,send,bs){
    var fast = localStorage.getItem('app_fast')
  return $.ajax({
     type: 'POST',
     contentType: "application/json; charset=utf-8",
     url:fast+get,
     beforeSend:function(){bs},
     data: JSON.stringify(send),
     async: false,
     timeout:60000,
     dataType:"json"
  });  
}
function majax_post(get,send,bs){
    var base = localStorage.getItem('app_base')
  return $.ajax({
    type: 'POST',
    url: base+get,
    cache:true,
    beforeSend:function(){bs},
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function majax_fast(get,send,bs){
    var base = localStorage.getItem('app_fast')
  return $.ajax({
    type: 'GET',
    beforeSend:function(){bs},
    url: base+get,
    cache:true,
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function majax(get,send,bs){
    var base = localStorage.getItem('app_base')
  return $.ajax({
    type: 'GET',
    beforeSend:function(){bs},
    url: base+get,
    cache:true,
    data: send,
    async: false,
    timeout:60000,
    dataType:"json"
  });  
}
function books_percent(percent){
    if(percent>window.persen){
        var token = window.localStorage.getItem('token');
        var id = localStorage.getItem('book_id')
        var req_data = {'access_token':token,'type':'Book','key':id,'read_percentage':percent};
        var action = new majax_secure('items/update_percentage',req_data,'');
        action.error(function(data) {
        }),
        action.success(function(data){
            if (data.meta.code==200){
                window.persen = percent;
            }else{
            }
        });
    }else{
        // console.log('nilai persen page masih <= '+percent)
    }
}

setTimeout(function(){
    load_bookmark();
    get_memo();
},1000)

function active_me(data,index){
  $('.toc_act').css('display','none');
  // $('#toc_display').css('left','-'+index+' px');
  $('#toc_'+data).css('display','block');
  $('.r_nav').css('background-color','#fff').css('color','#4D4B8C')
  $('#show_'+data).css('background-color','#4D4B8C').css('color','#fff');
  $('.nav_notif').css('display','none');
  // $('#toc_display').css('left','-'+index+' px');
  $('#'+data).css('display','block'); 
}

setTimeout(function(){
    $('.toc').click(function(e) {
        e.stopPropagation();
    });
},1000);
