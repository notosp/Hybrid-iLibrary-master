function search(data){
    $('.r_nav').css('background-color','#fff').css('color','#4D4B8C')
    $('#show_'+data).css('background-color','#4D4B8C').css('color','#fff');


    // $('.search').removeClass('active');
    // $('#'+data).addClass('active')
    $('.list div').hide();
    $('#list_'+data).show();
    // console.log($("input#query_search").val())
    // if($("input#query_search").val()!=''){
    //     search_live($("input#query_search").val(),data)
    // }
    // $("input#query_search").attr('onkeyup','keyup_search(\''+data+'\')')
    console.log($("input#nav_search").val())
    if($("input#nav_search").val()!=''){
        search_live($("input#nav_search").val(),data)
    }
    $('input#nav_search').unbind('keyup keydown keypress')
    $("input#nav_search").keyup(function (e) {
        if (e.keyCode == 13) {
            // Do something
            console.log('enter pressed')
            $('#search_preload').show();
            var q = $("input#nav_search").val();
            console.log(q)
            location.href="#/main/search/"+q
            $('#nav_search_result').html('').hide()
        }
        nav_keyup_search(data);
    });
    // $("input#nav_search").attr('onkeyup','keyup_search(\''+data+'\')')
}

var _timer = 0; 

function keyup_search(data){
    var typingTimer;                
    var doneTypingInterval = 0;
    var token =window.localStorage.getItem('token');
    //  if (_timer)
    //     window.clearTimeout(_timer);
    // _timer = window.setTimeout(function() {
    //         search_live($("input#query_search").val(),data)
    // }, 1000);

    if (_timer)
        window.clearTimeout(_timer);
    _timer = window.setTimeout(function() {
            search_live($("input#nav_search").val())
    }, 1000);


    // $("input#query_search").keyup(function(){
        // clearTimeout(typingTimer);
        // if ($("input#query_search").val()) {
        //     typingTimer = setTimeout(function(){
        //         if(req==true){

        //         }else{
        //             search_live($("input#query_search").val(),data)
        //             req=true
        //         }
        //     }, doneTypingInterval);
        // }
    // })
}

function search_live(moco_query,sort,page){
    $('#dropdown_global').removeClass('open');
    $('#search_more_act').attr('onclick','moresearch_books('+sort+')')
    $('.sort').css('color','#888888');
    $('#s_'+sort).css('color','#c92036');
    $('#search_result').html('')
    var ldata = '<div class="col-xs-12 col-md-12" style="cursor:pointer;height:30px;visibility:hidden;padding-top:15px;margin-bottom:15px;" id="search_more">\
    <center><button id="search_action_more" class="btn btn_rounded" onclick="moresearch_books()" style="border-radius:15px;color:#888;right:20px;bottom:20px;width:100px;height:26;font-size:12px;border:1px solid #888;background-color:transparent">\
     Load More </button></center>\
          </div>';
    $('#search_result').html(ldata);

    if(page<2){
        if(sort=="people"){
            $('#list_people').html('');
        }else if(sort=="collection"){
            document.title="Pencarian"
            $('#list_collection').html('');
        }else if(sort=="pustaka"){
            $('#list_pustaka').html('');
        }else if(sort=="chat"){
            $('#search_').html('');
        }else{
            document.title="Pencarian"
            $('#list_collection').html('');
        }
    }

    if(sort=="people"){
        var shortcut = App.api.url_search+'users';
    }else if(sort=="collection"){
        // var shortcut = App.api.api_realtime+':6161/s';
        var shortcut = App.api.url_search+'books';
    }else if(sort=="pustaka"){
        var shortcut = App.api.url_search+'libraries';
    }else if(sort=="chat"){
        var shortcut = App.api.url_search+'users';
        chat_search();
        $('#search_').html('')
        $('#icon-search i').removeClass('fa-search').addClass('fa-close').attr('onclick','chat_search(1)');
        if(message_real!=undefined){
            message_real.close();
        }
    }else{
        var shortcut = App.api.url_search+'books';
    }

    var before='$("input#nav_search").attr(\'disabled\',true)\
            if(sort=="people"){\
                $(\'#list_people\').html(\'<center><div class="fa fa-spin moco-load fa-4x red"></div><div>Pencarian Berlangsung.....</div></center>\');\
            }else if(sort=="pustaka"){\
                $(\'#list_pustaka\').html(\'<center><div class="fa fa-spin moco-load fa-4x red"></div><div>Pencarian Berlangsung.....</div></center>\');\
            }else if(sort=="chat"){\
                // $(\'#list_collection\').html(\'<center><div class="fa fa-spin moco-load fa-4x red"></div><div>Pencarian Berlangsung.....</div></center>\');\
            }else{\
                $(\'#list_collection\').html(\'<center><div class="fa fa-spin moco-load fa-4x red"></div><div>Pencarian Berlangsung.....</div></center>\');\
            }';
    var beforeSend ='$("#search_more").show();'
    if(page){
        var check = new majax_empty(shortcut,{'q':moco_query,'page':page,'per_pages':10,'app':'ingawi'},beforeSend);
    }else{
        var check = new majax_empty(shortcut,{'q':moco_query,'page':'1','per_pages':10,'app':'ingawi'},before);
    }
    check.error(function(result) {
        $("#search_more").hide();
        $('#search_preload').hide();
        // $("input#query_search").prop('disabled',false);
        // $("input#query_search").focus();
        $("input#nav_search").prop('disabled',false);
        $("input#nav_search").focus();
        var msg =  "Request Timeout";
        if(result.status=="404"){
            var data = JSON.parse(result.responseText)
            if(data.meta.msg){
                msg = data.meta.msg;
            }else{
                msg = "Data Not Found";
            }
        }else{
            msg = result.statusText
        }
        if(sort=="people"){
            $('#list_people').html('<center><span class="grey">'+msg+'</span></center>');
        }else if(sort=="collection"){
            $('#list_collection').html('<center><span class="grey">'+msg+'</span></center>');
        }else if(sort=="pustaka"){
            $('#list_people').html('<center><span class="grey">'+msg+'</span></center>');
        }else if(sort=="chat"){
            $('#search_').html('<center><span class="grey">'+msg+'</span></center>');
        }
    }),
    check.success(function(result) {
        $("#search_more").hide();
        if(result.statusCode=='404'){
            if(sort=="people"){
                $('#list_people').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
            }else if(sort=="collection"){
                $('#list_collection').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
            }else if(sort=="pustaka"){
                $('#list_pustaka').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
            }else if(sort=="chat"){
                $('#search_').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
            }else{
                $('#list_collection').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
            }
            $("input#nav_search").focus();
            $("input#nav_search").prop('disabled',false);
            $('#search_more').css('visibility','hidden');
        }else if(result.meta.code==200){
            $('#search_preload').hide();
            var html = "";
            $.each(result.data,function(){
                if(sort=="people"){
                    var user = this.data;
                    if(user.avatar!=null){
                        var image = user.avatar;
                    }else{
                        var image ='images/icon/avatar.png';
                    }
                    //var image = user.avatar;
                    var name = user.name;
                    if(user.address){
                        var address = user.address
                        // var address = limitCharacter(user.address,15);
                    }else{
                        var address = "-";
                    }
                    var link_ =  'user_details('+user.id+')';
                    var href = '#/main/user/'+user.id;
                    var badge = "";
                    var radius = "50%/50%";
                    var border ="";
                }else if(sort=="pustaka"){
                    var pustaka = this.data;
                    if(pustaka.logo!=null){
                        var image = pustaka.logo;
                    }else{
                        var image ='images/icon/avatar.png';
                    }
                    //var image = user.avatar;
                    var name = pustaka.name;
                    if(pustaka.address){
                        var address = pustaka.address;
                        // var address = limitCharacter(pustaka.address,15);
                    }else{
                        var address = "-";
                    }
                    var link_ =  'location.href=\'#/main/epustaka/'+pustaka.id+'\'';
                    var href = "#/main/epustaka/"+pustaka.id;
                    var badge = "";
                    var radius = "10px 10px 10px";
                    var border = "border:1px solid #ddd";
                }else if(sort=="chat"){
                }else{
                    var Book=this.Book;
                    var Category = this.Category;
                    var Publisher = this.Publisher;
                    var Statistic = this.Statistic;

                    page_search = result.meta.total_pages;
                    if(Publisher){
                        if(Publisher.name){dt4=Publisher.name.replace(/'/g,'')}else{dt4="-"}
                    }  
                    if(Statistic){
                        if(Statistic.rating){dt8=Statistic.rating}else{dt8="-"}
                    }
                    var image = Book.cover;
                    // var name = limitCharacter(Book.title,15);
                    var name = Book.title
                    // var address = limitCharacter(Book.authors,15);
                    var address = Book.authors
                    var link_ = 'location.href=\'#/main/book/'+Book.id+'\'';
                    var href = '#/main/book/'+Book.id+'/';
                    var badge = "by";
                    var radius = "10px 10px 10px";
                    var border ="";
                }
                if(sort=="chat"){
                    var user = this.data;
                    if(user.avatar!=null){
                        var image = user.avatar;
                    }else{
                        var image ='images/icon/avatar.png';
                    }
                    //var image = user.avatar;
                    if(user.name){
                        var name = user.name;
                    }else{
                        var name = 'iNgawi User';
                    }
                    if(user.address){
                        var address = user.address
                        // var address = limitCharacter(user.address,15);
                    }else{
                        var address = "-";
                    }
                    var link_ =  'detail_chat("'+user.id+'",undefined,"'+image+'","'+name+'")';
                    var href = '#/chat/'+user.id;
                    var badge = "";
                    var radius = "50%/50%";
                    var border ="";
                    status ="background-color: #fff";

                    html+='<div class="col-md-12 col-xs-12" style="padding:10px;border-bottom:1px solid #fafafa;line-height:1.2;'+status+'">\
                            <div class="n_del pointer" onclick="dialog(\'chat\','+user.id+')" style="position:absolute;right:13px;top:29px;display:none;"><div><i class="moco-trash f12" style="height:0;"></i></div></div>\
                            <div class="col-md-2 col-xs-2"><a href="'+href+'" onclick="'+link_+'"><img class="icon-circle" src="'+image+'" style="position:relative" onerror="AvaError(this)"></a></div>\
                            <div class="col-md-7 col-xs-7 pointer" onclick="detail_chat(\''+user.id+'\',undefined,\''+image+'\',\''+name.replace(/'/g,"").replace(/"/g,"")+'\')">\
                                <div class="blue" style="font-size:14px;">'+name+'</div>\
                                <div class="grey f12" style="word-break:break-word;">'+address+'</div>\
                            </div>\
                            <div class="col-md-3 col-xs-3" style="padding:0;float:right;style:display:none;">\
                                <div style="font-size:10px;color:#ddd;float:right;"></div>\
                            </div>\
                        </div>'
                }else{
                    html+='<div class="media col-md-12 col-xs-12" style="width:100%;padding-left:0px;margin-top:15px;margin-bottom:15px;">\
                      <div class="col-xs-1 col-md-1" style=";padding-left:20px;width:99px;">\
                        <a onclick="'+link_+'" ><img class="media-object" src="'+image+'" style="width:60px;height:60px;cursor:pointer;border-radius:'+radius+';'+border+'"></a>\
                      </div>\
                      <div class="media-body col-xs-10 col-md-10" style="padding-left:0px;padding-top:11px;">\
                        <div class="black" style="font-size:14px;cursor:pointer" onclick="'+link_+'" >'+name+'</div>\
                        <div style="font-size:12px;">'+badge+' <span style="font-size:12px;cursor:pointer" class="light-blue" onclick="'+link_+'">'+address+'</span></div>\
                      </div>\
                      </div>\
                      <div class="col-md-12 col-xs-12 divider" style="border-bottom:1px solid #ddd;"></div>'
                }
            });
            if(page>result.meta.total_pages){
                $('#btn-loadmore_store').hide();
            }
            html += "<div class='result-load' active='false'></div>";
            console.log(page)
            if(page>1){
                if(sort=="people"){
                    $('#list_people').append(html);
                }else if(sort=="collection"){
                    $('#list_collection').append(html);
                }else if(sort=="pustaka"){
                    $('#list_pustaka').append(html);
                }else if(sort=="chat"){
                    $('#search_').append(html);
                }else{
                    $('#list_collection').append(html);
                }
                $('#btn-loadmore_store').attr('onclick','search_live(\''+moco_query+'\',\''+sort+'\',\''+(parseInt(page)+1)+'\')')
            }else{
                if(sort=="people"){
                    $('#list_people').html(html);
                }else if(sort=="collection"){
                    $('#list_collection').html(html);
                }else if(sort=="pustaka"){
                    $('#list_pustaka').html(html);
                }else if(sort=="chat"){
                    $('#search_').prepend(html);
                }else{
                    $('#list_collection').html(html);
                }
                $('#btn-loadmore_store').attr('onclick','search_live(\''+moco_query+'\',\''+sort+'\',2)')
            }
            if(result.meta.total_pages>1){
                console.log('show')
              $('#act_more_search').show();
            }else{
              $('#act_more_search').hide();
            }
            if(result.meta.result<20){
                $('#act_more_search').hide();
            }

            $("input#nav_search").prop('disabled',false);
            $("input#nav_search").focus();
        }else{
            if(page<2){
                $('#search_preload').hide();
                $("input#nav_search").prop('disabled',false);
                $("input#nav_search").focus();
                if(sort=="people"){
                    $('#list_people').html('<center><span class="grey">Request Timeout</span></center>');
                }else if(sort=="collection"){
                    $('#list_collection').html('<center><span class="grey">Request Timeout</span></center>');
                }else if(sort=="pustaka"){
                    $('#list_people').html('<center><span class="grey">Request Timeout</span></center>');
                }else if(sort=="chat"){
                    $('#search_').html('<center><span class="grey">Request Timeout</span></center>');
                }
            }else{
                $('#btn-loadmore_store').hide();
            }
        }
    })
}

function search_user(fungsi){
    moco_query =  $("input#users").val()
    if(moco_query!=""){
        //$('#users').html(data);
        var shortcut = App.api.url_search+'users';
        $.ajax({
            type: 'GET',
            //url: realtime+':6161/s',
            url: shortcut,
            //url: 'http://store.aksaramaya.com:6161/search',
            data: {'q':moco_query,'page':'1','per_pages':40,'app':'ingawi'},
            dataType:"json",
            timeout:60000,
            beforeSend:function(){
                $("input#users").attr('disabled',true);
            },
            success: function(result){
                var html = "";
                if(result.status==404){
                    $('#list_people').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
                    $("input#users").prop('disabled',false);
                }
                if(result.meta.code == 200){
                    $.each(result.data,function(){
                        var user = this.data;
                        console.log(user)
                    html+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #fafafa;padding-top:10px;padding-bottom:5px;">\
                            <div class="col-md-2 col-xs-2" style="padding:0;width:30px;">\
                              <a href="#/main/user/'+user.id+'"><img class="avaMiddleCircle" src="'+user.avatar+'" onerror="AvaError(this)"></a>\
                            </div>\
                            <div class="col-md-7 col-xs-7" style="line-height:1.2;margin-right:23px">\
                              <div>'+user.name+'</div>\
                              <div class="grey f12">'+user.username+'</div>\
                            </div>';
                            if(fungsi){
                              html+='<div class="col-md-3 col-xs-3" style="padding-left:40px;">\
                                <button class="radius b-trans b_grey grey" onclick="user_push('+user.id+',\''+user.name+'\')" id="btn-rec'+user.id+'" style="padding:3px 15px"><i id="icn-rec'+user.id+'"  class="fa moco-plus moco-x7 f14"></i></button>\
                              </div></div>'
                            }else{
                                html+='<div class="col-md-3 col-xs-3" style="padding-left:40px;">\
                                <button class="radius b-trans b_grey grey" onclick="user_push1('+user.id+',\''+user.name+'\')" id="btn-rec'+user.id+'" style="padding:3px 15px"><i id="icn-rec'+user.id+'"  class="fa moco-plus moco-x7 f14"></i></button>\
                              </div></div>'
                            }
                          })

                    //$("#result").prepend(html);
                    $('#list_user').html(html);

                    $("input#users").prop('disabled',false);
                }else{
                    $('#list_user').html('<center><span class="grey">Data Tidak Ditemukan</span></center>');
                    $("input#users").prop('disabled',false);
                    $('#search_more').css('visibility','hidden');
                }
            },
            error: function(result){
                $("input#users").prop('disabled',false);
                var msg =  "Request Timeout";
                if(result.status=="404"){
                    var data = JSON.parse(result.responseText)
                    if(data.meta.msg){
                        msg = data.meta.msg;
                    }else{
                        msg = "Data Not Found";
                    }
                }else{
                    msg = result.statusText
                }
                $('#list_people').html('<center><span class="grey">'+msg+'</span></center>');
            }
        });
    }
}



function home_search(){
    if($("input#user_chat").val()!=''){
        home_search_live($("input#user_chat").val())
    }
    $("input#user_chat").attr('onkeyup','home_keyup_search(\''+data+'\')')
}
function home_keyup_search(){
    var typingTimer;                
    var doneTypingInterval = 0;
    var token =window.localStorage.getItem('token');
     if (_timer)
        window.clearTimeout(_timer);
    _timer = window.setTimeout(function() {
            home_search_live($("input#user_chat").val())
    }, 1000);
}

function home_search_live(moco_query){
    $('#online').html('')
    var ldata = ''
    $('#online').html();
    
    var shortcut = App.api.url_search+'users';
    
    $.ajax({
        type: 'GET',
        url: shortcut,
        data: {'q':moco_query,'page':'1','per_pages':20,'app':'ingawi'},
        dataType:"json",
        timeout:60000,
        beforeSend:function(){
            // $("input#user_chat").attr('disabled',true);
            $('#online').html('<br><center><span class="fa fa-spin moco-load fa-2x"></span></center>');
        },
        success: function(result){
            var html = "";
            if(result.status==404){
                $('#online').html('<center style="position:absolute;top:0px;right:0px;bottom:0px;left:0px;margin:20% auto"><span class="moco-not_found" style="font-size:60px;"></span><div style="font-size:12px;margin-top:10px;"> Maaf Data Tidak Ditemukan</div></center>');
                $("input#user_chat").prop('disabled',false);
                $('#search_more').css('visibility','hidden');
            }
            if(result.meta.code == 200){
                $('#online').html('')
                $.each(result.data,function(){
                    var user = this.data;
                    if(user.avatar!=null){
                        var image = user.avatar;
                    }else{
                        var image ='images/icon/avatar.png';
                    }
                    //var image = user.avatar;
                    var name = user.name;
                    if(user.address){
                        var address = user.address
                        // var address = limitCharacter(user.address,15);
                    }else{
                        var address = "-";
                    }
                    var link_ =  'user_details('+user.id+')';
                    var href = '#/main/user/'+user.id;
                    var badge = "";
                    var radius = "50%/50%";
                    var border ="";

                    html+='<div class="media col-md-12 col-xs-12" style="width:100%;padding-left:0px;margin-top:15px;margin-bottom:15px;">\
                          <div class="col-xs-1 col-md-1" style=";padding-left:0px;width:35px;">\
                            <a onclick="'+link_+'" ><img class="media-object" src="'+image+'" style="width:35px;height:35px;cursor:pointer;border-radius:'+radius+';'+border+'"></a>\
                          </div>\
                          <div class="media-body col-xs-9 col-md-9" style="padding-left:10px;padding-top:0px;">\
                            <div class="black" style="font-size:14px;cursor:pointer" onclick="'+link_+'" >'+name+'</div>\
                            <div style="font-size:12px;">'+badge+' <span style="font-size:12px;cursor:pointer" class="light-blue" onclick="'+link_+'">'+address+'</span></div>\
                          </div>\
                          </div>\
                          <div class="col-md-12 col-xs-12 divider" style="border-bottom:1px solid #ddd;"></div>'});
                html += "<div class='result-load' active='false'></div>";
                
                $('#online').prepend(html);
                
                if(result.meta.total_pages>1){
                    console.log('show')
                  $('#search_more').css('visibility','visible');
                }else{
                  $('#search_more').css('visibility','hidden');
                }
                if(result.meta.result<20){
                    $('#search_more').css('visibility','hidden');
                }
                $("input#user_chat").prop('disabled',false);
            }else{
                //$("#result").html(result.meta.msg);
                $('#online').html('<center style="position:absolute;top:0px;right:0px;bottom:0px;left:0px;margin:20% auto"><span class="moco-not_found" style="font-size:60px;"></span><div style="font-size:12px;margin-top:10px;"> Maaf Data Tidak Ditemukan</div></center>');
                
                // $('#search_result').html('<center><span class="grey">'+result.meta.msg+'</span></center>');
                $("input#user_chat").prop('disabled',false);
                $('#search_more').css('visibility','hidden');
            }
        },
        error: function(result){
            $("input#user_chat").prop('disabled',false);
            var msg =  "Request Timeout";
            if(result.status=="404"){
                var data = JSON.parse(result.responseText)
                if(data.meta.msg){
                    msg = data.meta.msg;
                }else{
                    msg = "Data Not Found";
                }
            }else{
                msg = result.statusText
            }
            $('#online').html('<center><span class="grey">'+msg+'</span></center>');
        }
    });
}