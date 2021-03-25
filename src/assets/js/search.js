var _timer = 0; 
function nav_search(){
    if($("input#nav_search").val()!=''){
        nav_search_live($("input#nav_search").val())
    }
    $('input#nav_search').unbind('keyup keydown keypress')
    $("input#nav_search").keyup(function (e) {
        if (e.keyCode == 13) {
            // Do something
            console.log('enter pressed 2')
            $('#search_preload').show();
            var q = $("input#nav_search").val();
            console.log(q)
            location.href="#/main/search/"+q
        }
        nav_keyup_search();
    });
    // $("input#nav_search").attr('onkeyup','nav_keyup_search(\''+data+'\')')
}
function nav_keyup_search(){
    var typingTimer;                
    var doneTypingInterval = 0;
    var token =window.localStorage.getItem('token');
     if (_timer)
        window.clearTimeout(_timer);
    _timer = window.setTimeout(function() {
            nav_search_live($("input#nav_search").val())
    }, 1000);
}

function nav_search_live(moco_query){
    $('#nav_search_result').html('').show();
    var ldata = ''    
    var shortcut = App.api.url_search+'books';
    $.ajax({
        type: 'GET',
        url: shortcut,
        data: {'q':moco_query,'page':'1','per_pages':20,'app':'ingawi'},
        dataType:"json",
        timeout:60000,
        beforeSend:function(){
            // $("input#nav_search").attr('disabled',true);
            $('#nav_search_result').html('<li style="padding:10px;"><span class="fa fa-spin moco-load fa-2x"></span><span class="red" style="position:relative;top:-7px;"> Pencarian Berlangsung.....</span></li>');
        },
        success: function(result){
            // $('#search_preload').show();
            var html = "";
            if(result.status==404){
                $('#nav_search_result').html('<center style="position:absolute;top:0px;right:0px;bottom:0px;left:0px;margin:20% auto"><span class="moco-not_found" style="font-size:60px;"></span><div style="font-size:12px;margin-top:10px;"> Maaf Data Tidak Ditemukan</div></center>');
                $("input#nav_search").prop('disabled',false);
                $('#search_more').css('visibility','hidden');
            }
            if(result.meta.code == 200){
                $('#nav_search_result').html('<div class="media col-md-12 col-xs-12 red2" style="width:100%;padding-left:0px;margin-top:5px;margin-bottom:5px;"><button class="b_red2 b-trans red2" id="btn-balance" style="margin:12px; width:300px;height:36px;border-radius:5px;padding:0px;" onclick="location.href=\'#/main/search/'+moco_query+'\'"><span class="red2" style="font-size:12px;margin-right:10px;">Lihat Keseluruhan Hasil       </span><i class="fa fa-angle-right" style="font-size: 25px;position: absolute;top: 4px;"></i></button></div><div class="col-md-12 col-xs-12 divider" style="border-bottom:1px solid #ddd;margin:2px 0px"></div>')
                $.each(result.data,function(){
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

                    html+='<div class="media col-md-12 col-xs-12" style="width:100%;padding-left:0px;margin-top:5px;margin-bottom:5px;">\
                          <div class="col-xs-3 col-md-3" style=";padding-left:20px;">\
                            <a onclick="'+link_+'" ><img class="media-object" src="'+image+'" style="width:50px;height:50px;cursor:pointer;border-radius:'+radius+';'+border+'"></a>\
                          </div>\
                          <div class="media-body col-xs-8 col-md-8" style="padding-left:0px;padding-top:5px;">\
                            <div class="black" style="font-size:14px;cursor:pointer" onclick="'+link_+'" >'+name+'</div>\
                            <div style="font-size:12px;">'+badge+' <span style="font-size:12px;cursor:pointer" class="light-blue" onclick="'+link_+'">'+address+'</span></div>\
                          </div>\
                          </div>\
                          <div class="col-md-12 col-xs-12 divider" style="border-bottom:1px solid #ddd;margin:2px 0px"></div>'

                });
                html += "<div class='result-load' active='false'></div>";
                
                $('#nav_search_result').append(html);
                
                if(result.meta.total_pages>1){
                    console.log('show')
                  $('#search_more').css('visibility','visible');
                }else{
                  $('#search_more').css('visibility','hidden');
                }
                if(result.meta.result<20){
                    $('#search_more').css('visibility','hidden');
                }
                $("input#nav_search").prop('disabled',false);
            }else{
                //$("#result").html(result.meta.msg);
                $('#nav_search_result').html('<center style="position:absolute;top:0px;right:0px;bottom:0px;left:0px;margin:20% auto"><span class="moco-not_found" style="font-size:60px;"></span><div style="font-size:12px;margin-top:10px;"> Maaf Data Tidak Ditemukan</div></center>');
                
                // $('#search_result').html('<center><span class="grey">'+result.meta.msg+'</span></center>');
                $("input#nav_search").prop('disabled',false);
                $('#search_more').css('visibility','hidden');
            }
        },
        error: function(result){
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
            $('#nav_search_result').html('<center><span class="grey">'+msg+'</span></center>');
        }
    });
}