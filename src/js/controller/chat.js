var loop='';
var user_id_conv = '';
var image_real;
var message_real;
App.ChatController = Ember.ArrayController.extend({
	init:function(){

	},
	actions:{
	    list_chat:function(type,ding){
	    	$('#list_inbox').html(' ')
	    	$('#list_chat').html(' ');
	      	chat_list_chat(type,ding)
	      	setTimeout(function(){
	      		if(type){

	      		}else{
	      			search('chat')
	      		}
	      	})
		},
		parse_list:function(data,type){
			//console.log(type)
			chat_parse_list(data,type)
		},
		morechat:function(type){
			//alert('morenotif')
			// var before = $('#btn-loadmore_chat').addClass('fa moco-load fa-spin');
			var before ='';
			if(type){
				var index = $('#list_inbox').attr('data-index');
			}else{
				var index = $('#list_chat').attr('data-index');
			}
			var token = window.localStorage.getItem('token')
			var msg = new majax_fast('messages/index',{'access_token':token,'per_page':12,'page':index},before);
			msg.success(function(data){
				$('#btn-loadmore_chat').removeClass('fa moco-load fa-spin');
				if(type){
					$('#list_inbox').attr('data-index',parseInt(index)+1);
				}else{
					$('#list_chat').attr('data-index',parseInt(index)+1);
				}
				if(data.meta.code==200){
					count = data.data.total_result;
					page_Notification=data.data.num_pages;
					var controller = App.ChatController.create();
					if(type){
				  		controller.send('parse_list',data,'inbox');
				  	}else{
					 	controller.send('parse_list',data);       
				  	}
				}else if(data.meta.code==401){
				    App.content=data.meta.error_message;
				    $('#confirm_trans_failed').click();
				    // modalMain();
				    logout_moco();
				}else{
					// if(type){

					// }else{
					// 	chat_friend();
					// }
					$('#btn-loadmore_chat').hide();
				    //$('#result_Notification').html('<center style="color:#ddd;padding-top:50px;">'+data.meta.error_Notification+'</center>');
				    //$('#list_chat').html('<div style="color:#ddd; padding-top:27px;text-align:center">'+data.meta.error_Notification+'</div>');
				}
			}),
			msg.error(function(data){
				$('#btn-loadmore_chat').hide();
				$('#btn-loadmore_chat').removeClass('fa moco-load fa-spin');
				$('#btn-loadmore_chat').hide();
			});
	    },
	    chat:function(sender_id,sender_avatar,name){
	    	if(message_real!=undefined){
		        message_real.close();
		    }
            document.title="Chatting";
	    	image_real = sender_avatar;
	    	user_id_conv = sender_id;
			var msg_text='';
			$('#chat_name').html(name)
            setTimeout(function(){
            	$('#chat_name').html(name);
            },500)
			var token = localStorage.getItem('token');
			var empty ='<div id="content_empty" style="position:absolute;top:0;bottom:50px;left:0;right:0;margin:auto;height:150px;width:150px;">\
                   <div class="fe_blank_chat" style="height:150px;"></div>\
                <div style="text-align:center">Belum ada chat</div></div>'
			var before = $('#det_chat').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
			// console.log(sender_id);
			var id = localStorage.getItem('user_id');
			// console.log(id)
			var msg = new majax_fast('messages/conversation',{'access_token':token,'per_page':20,'sender_id':sender_id,'page':1},before);
			msg.success(function(data){
				$('#det_chat').html('');
				// console.log(data)
				if(data.meta.code==200){
					if(data.data=="Belum ada Message"){
		                $('#det_chat').html("");
		                load_send_text();
		                $('#msg_block').attr("onclick","msg_block("+id_sender+",'User','Message')");
		                is_msg_block(id_sender,'User','Message');
		                $('#load_more_').hide();

		            }else if(data.data=="There are no message"){
		                $('#det_chat').html("");
		                $('#msg_block').attr("onclick","msg_block("+id_sender+",'User','Message')");
		                is_msg_block(id_sender,'User','Message');
		                load_send_text();
		                $('#load_more_').hide();

		            }else{
		            	 $('#det_chat').attr('data-index','2')
		            	if(data.data.total_result>20){
		            		$('#btn-loadmore_chat').show().attr('onclick','load_more_chat(\''+sender_id+'\')')
		            	}
		                var controller = App.ChatController.create();
		                controller.send('parse_chat',data)
					}
				}else{
		        $('#det_chat').html(empty);
				}
			})
			msg.error(function(data){
		        //alert('Network Error');
		        $('#det_chat').html(empty);
		    });
		},
		parse_chat:function(data,index){
			var msg_text='';
			var id = localStorage.getItem('user_id');
			$.each(data.data.data,function(){
                var Sender = this.Sender;
                var Message = this.Message;
                var Recipient = this.Recipient;
                if(Sender!=undefined){
                    // name_sender = Sender.User.name;
                    // link_avatar = "user_details("+Sender.User.id+")";
                    if(Message.sender_id==id){
                        image="";
                        bubble_class='bubble';
                        name_sender = Recipient.name;
                        var poss = 'right';
                        var back_col = 'background-color:#4D4B8C;color:#fff;';
                        var time = 'min-width:70px;right:0;text-align:right;';
                        $('#chat_name').html(name_sender)

                        //link_avatar = "user_details("+Sender.User.id+")";
                    }else{
                        name_sender = Sender.name;
                        link_avatar = "user_details("+Sender.id+")";
                        bubble_class='bubble2';
                        var poss = 'left';
                        var back_col = 'background-color:#f7f1f1;';
                        var time = 'min-width:70px;left:0;text-align:left;';
                        $('#chat_name').html(name_sender)
                        if(Sender.avatar==undefined){
                            image='<a href="#/main/user/'+Sender.id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="img/main/avatar.png"  onerror="AvaError(this)"></a>';
                            
                            //image=Sender.User.avatar;
                        }else{
                            //console.log('masuk dalemmm');
                            image='<a href="#/main/user/'+Sender.id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="'+Sender.avatar+'" onerror="AvaError(this)"></a>';
                            //console.log(Sender.User.avatar);
                            //image="img/main/avatar.png";
                        }   //image='<a href="#/main/moco/library/" onclick="'+link_avatar+'"><img class="media-object circle" src="img/main/avatar.png" style="width:55px;height:55px;"></a>';
                    }
                }
                //msg_text += '<div class="col-md-12" style="cursor:pointer;height:30px;display:none;padding-top:15px;margin-bottom:15px;position:absolute;right:0;left:0;top:0;" id="load_more_"><center><button id="btn_ok_load" class="btn btn_rounded" style="border-radius:15px;color:#888;right:20px;bottom:20px;width:100px;height:26;font-size:12px;border:1px solid #888;background-color:transparent"> Load More </button></center></div>';
                
                $('#name_sender').text(name_sender);

                var pesan_='';
                var a = Message.message.split('\\n');
                if(a[1]){
                    pesan_ = '<span>'+a[0]+'</span>';
                    for(i=1;i<a.length;i++){
                        // console.log(a[i])
                        pesan_ +='<br><span>'+a[i]+'</span>'
                    }
                }else{
                    pesan_= a;
                }
                image_message = image;
                msg_text +='<div class="col-md-12 col-xs-12" id="notif_'+Message.id+'" onclick="msg_read('+Message.id+')" style="cursor:pointer;padding-bottom:25px;">\
                <div class="col-md-12 col-xs-12"><div class="col-xs-2 col-md-1" style="padding-top:5px;margin-left:20px;width:50px;"></span>'+image+'</div>\
                <div class="col-xs-9 col-md-10" style="padding:0px;min-height:15px;padding-top:0px;margin-left:5px;">\
                <div class="black '+bubble_class+'" style="border-bottom:2px solid #ddd;min-height:15px;'+back_col+';font-size:14px;word-break:break-word;padding:5px 15px;float:'+poss+';border-radius:5px;max-width:80%;z-index:1;">'+pesan_+' <div class="grey f10" style="position:absolute;bottom:-23px;'+time+'">'+timeago(Message.elapsed_time)+'</div></div>\
                </div></div>\
                <div class="col-md-12" style="padding:0px;padding-top:0px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';
            });
			if(index){
				$('#det_chat').prepend(msg_text)
			}else{
				$('#det_chat').html(msg_text)
			}
			$('.n_right').scrollTop(10000000000000);
			var controller = App.ChatController.create();
			controller.send('real_message',user_id_conv)
		},
		load_morechat:function(sender_id){
			var index = $('#det_chat').attr('data-index')
			var msg_text='';
			var token = localStorage.getItem('token')
			var empty ='<div style="position:absolute;top:0;bottom:50px;left:0;right:0;margin:auto;height:150px;width:150px;">\
                   <div class="fe_blank_chat" style="height:150px;"></div>\
                <div style="text-align:center">You don\'t have Chat</div></div>'
			var before = '';
			// console.log(sender_id);
			var id = localStorage.getItem('user_id');
			// console.log(id)
			var msg = new majax_fast('messages/conversation',{'access_token':token,'per_page':20,'sender_id':sender_id,'page':index},before);
			msg.success(function(data){
				if(data.meta.code==200){
	            	$('#det_chat').attr('data-index',parseInt(index)+1)
	            	if(data.data.current_page_result>20){
	            		$('#btn-loadmore_chat').show().attr('onclick','load_more_chat(\''+sender_id+'\')')
	            	}else{
	            		$('#btn-loadmore_chat').hide()
	            	}
	                var controller = App.ChatController.create();
	                controller.send('parse_chat',data,index)
		        }else{
		        	$('#btn-loadmore_chat').hide()
		        }
			})
			msg.error(function(data){
		        //alert('Network Error');
		        $('#btn-loadmore_chat').hide()
		    });
		},
	    real_message:function(id){
	    	try{
	    		message_real.close();
	    	}catch(e){
	    		console.log(e.message)
	    	}
		    var msg_text="";
		    user_id = window.localStorage.getItem('user_id');
		    //alert listener
		    //message_real = new EventSource(realtime+':8080/subscribe?events='+id+'-'+user_id);
		    if(App.api.url_chat){
		        message_real = new EventSource(App.api.url_chat+'?events='+id+'-'+user_id);
		    }else{	
		    	message_real = new EventSource(App.api.api_realtime_chat+':6163/subscribe?events='+id+'-'+user_id);
		    }
		    message_real.addEventListener('message', function (e)
		    {
		      var event = JSON.parse(e.data);
		      console.log(event.message);
		      if(image_message){
		        image_real=image_message;
		      }else{
		        image_real='<a href="" onclick=""><img class="icon-circle" src="img/main/avatar.png" onerror="AvaError(this)"></a>';
		      }
		      msg_text="";

		        var a = event.message.default.split('\\n');
		        if(a[1]){
		            pesan_ = '<span>'+a[0]+'</span>';
		            for(i=1;i<a.length;i++){
		                console.log(a[i])
		                pesan_ +='<br><span>'+a[i]+'</span>'
		            }
		        }else{
		            pesan_= a;
		        }
		      //generate("bottomLeft",event.message.default);

		      msg_text +='<div class="col-md-12 col-xs-12" style="cursor:pointer;padding-bottom:25px;">\
                <div class="col-md-12 col-xs-12"><div class="col-xs-2 col-md-1" style="padding-top:5px;margin-left:20px;width:50px;"></span>'+image_real+'</div>\
                <div class="col-xs-9 col-md-10" style="padding:0px;min-height:15px;padding-top:0px;margin-left:5px;">\
                <div class="black bubble2" style="border-bottom:2px solid #ddd;min-height:15px;background-color:#f7f1f1;font-size:14px;word-break:break-word;padding:5px 15px;float:left;border-radius:5px;max-width:80%;z-index:1;">'+pesan_+' <div class="grey f10" style="position:absolute;bottom:-23px;right:0;text-align:right;">now</div></div>\
                </div></div>\
                <div class="col-md-12" style="padding:0px;padding-top:0px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';
       
		      // msg_text +='<div id="notif_" style="cursor:pointer;">\
		      //               <div class="col-xs-3 col-md-2" style="padding-top:5px"></span><a href="#/main/moco/library/" onclick=""><img class="media-object circle" src="'+image_real+'" style="width:55px;height:55px;"></a></div>\
		      //               <div class="col-xs-8 col-md-9" style="padding:0px;min-height:40px;padding-top:5px;margin-left:5px;">\
		      //               <div class="grey bubble2" style="border-bottom:2px solid #ddd;min-height:40px;background-color:#ffffff;font-size:14px;word-break:break-word;padding:10px;float:left;border-radius:30px;max-width:200px;z-index:100;">'+pesan_+'</div>\
		      //               </div>\
		      //               <div class="col-xs-3 col-md-2"></div>\
		      //               <div class="col-xs-8 col-md-9" style="padding-right:0;padding-left:0;padding-bottom:5 px;"><div style="float:left;font-size:10px;color:#bbb;padding-top:3px;padding-left:5px;">just now</div></div>\
		      //               <div class="col-md-12" style="padding:0px;padding-top:5px;padding-bottom:15px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';
		      // msg_text +='<div id="" onclick="" style="cursor:pointer;">\
		      //               <div class="col-xs-3 col-md-2" style="padding-top:5px"></span>'+image_message+'</div>\
		      //               <div class="col-xs-8 col-md-9" style="padding:0px;min-height:40px;margin-left:5px;padding-top:10px;">\
		      //               <div class="grey bubble2" style="border-bottom:2px solid #ddd;min-height:40px;background-color:#ffffff;font-size:14px;word-break:break-word;padding:10px;left:right;border-radius:7px;max-width:200px;z-index:100;padding-top:10px;">'+event.message.default+'</div>\
		      //               </div>\
		      //               <div class="col-xs-3 col-md-2"></div>\
		      //               <div class="col-xs-8 col-md-9" style="padding-right:0;padding-left:0"><div style="float:left;font-size:10px;color:#bbb;">just now</div></div>\
		      //               <div class="col-md-12" style="padding:0px;padding-top:5px;padding-bottom:15px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';
		                
		        console.log('ada')
		                    $('#det_chat').append(msg_text);
		                    $('.n_right').scrollTop(10000000000);
		      //notif_all();
		      	set_height_chat();
		    });
		    message_real.addEventListener('error', function (e)
		    {
		        //console.log(e);
		      // var event = JSON.parse(e.data);
		      // generate("bottomLeft",event.message.default);
		    });
		}
	}
})

function load_more_chat(id){
	var controller = App.ChatController.create();
	controller.send('load_morechat',id)
}

function load_send_text(){
    $('#border_space').css('height','60px');
    $('#msg_text').css('height','30px');
    loop=1;
    $("#msg_text").keyup(function (e) {
        //console.log("ketik");
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            send_chat(2);
            //alert("enter");
            
        return false;
        }
    });
}

function send_chat(data){
	$('#empty').hide();
    var text = document.getElementById('msg_text');
    $('#content_empty').hide();
    // console.log(text.value);
    var letterNumber = /^\s*$/; 
    if(text.value.match(letterNumber)){
      // console.log('alpha')
      
    }else{
        console.log('non alpha')
        if(data){
            console.log($("#msg_text").val());
            var msg_text='';
            var pesan2 = $('#msg_text').val();
            // var pesan2 = $('#msg_text').val().substring(0, $('#msg_text').val().length-1); 
            var pesan1 = pesan2.split('\n');
            console.log(pesan2);
            console.log(pesan1);
        }else{
            console.log($("#msg_text").val());
            var msg_text='';
            var pesan2 = $('#msg_text').val(); 
            var pesan1 = pesan2.split('\n');
        }
        if(pesan1[1]){
            pesan= '<span>'+pesan1[0]+'</span>';
            for(i=1;i<pesan1.length;i++){
                console.log(pesan1[i])
                pesan +='<br><span>'+pesan1[i]+'</span>'
            }
        }else{
            pesan= pesan1;
        }
        if(pesan !=""){
            image="";
            bubble_class='bubble';
            var back_col = 'background-color:#4D4B8C;color:#fff;';

            msg_text +='<div class="col-md-12 col-xs-12" id="notif_new" onclick="" style="cursor:pointer;padding-bottom:25px;">\
                <div class="col-md-12 col-xs-12"><div class="col-xs-2 col-md-1" style="padding-top:5px;margin-left:20px;width:50px;"></span>'+image+'</div>\
                <div class="col-xs-9 col-md-10" style="padding:0px;min-height:15px;padding-top:0px;margin-left:5px;">\
                <div class="black '+bubble_class+'" style="border-bottom:2px solid #ddd;min-height:15px;'+back_col+';font-size:14px;word-break:break-word;padding:5px 15px;float:right;border-radius:5px;max-width:80%;z-index:1;">'+pesan+' <i id="error_network'+loop+'" class="fa fa-warning" style="color:#c92036;display:none;"></i><div class="grey f10" style="position:absolute;bottom:-23px;min-width:70px;right:0;text-align:right;">now</div></div>\
                </div></div>\
                <div class="col-md-12" style="padding:0px;padding-top:0px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';

            // msg_text +='<div id="" onclick="" style="cursor:pointer;">\
            //     <div class="col-xs-3 col-md-2" style="padding-top:5px"></span>'+image+'</div>\
            //     <div class="col-xs-8 col-md-9" style="padding:0px;min-height:15px;margin-left:5px;padding-top:5px;">\
            //     <div class="black '+bubble_class+'" style="border-bottom:2px solid #ddd;min-height:15px;background-color:'+back_col+';font-size:14px;word-break:break-word;padding:5px 10px;float:right;border-radius:30px;max-width:200px;z-index:100;padding-top:5px;">'+pesan+' <i id="error_network'+loop+'" class="fa fa-warning" style="color:#c92036;display:none;"></i></div>\
            //     </div>\
            //     <div class="col-xs-3 col-md-2"></div>\
            //     <div class="col-xs-8 col-md-9" style="padding-right:0;padding-left:0;padding-bottom:5px"><div style="float:right;font-size:10px;color:#bbb;padding-top:3px;">just now</div></div>\
            //     <div class="col-md-12" style="padding:0px;padding-top:0px;padding-bottom:5px;padding-left: 20px;"><div class="divider" style="padding-top:0px;visibility:hidden;"></div></div></div>';
            
                $('#det_chat').append(msg_text);
                $('.n_right').scrollTop(10000000000000);
        }

        $('#msg_text').css('height','30px');
        $('#border_space').css('height','60px')

        // textarea_('msg_text','border_space',30,120,'result_conv')

        //$('#status_'+id).css('visibility','hidden');
        var token = window.localStorage.getItem('token');
        var req_data = {'access_token':token,'recipient_id':user_id_conv,'message':pesan2};
        var action = new majax_secure('messages/send',req_data);
        image="";
        bubble_class='bubble';
        var back_col = '#00e600;';
        Message = $('input#msg_text').val();
        $('#msg_text').val("");
        set_height_chat();

        action.error(function(data) {
            $('#error_network'+loop).show();
        }),
        action.success(function(data){
            loop++;
            if (data.meta.code==200){

            }else{
            }
        });
    }
}

function set_height_chat(){
    var min = $('#border_space').height()+80;
    var tot = $('#index_message').height();
    var res_chat = tot-min;
    $('#result_conv').css('height',res_chat)
    // console.log(min,res_chat)
}

function chat_parse_list(data,type){
	//console.log(data)
	var list='';
    $.each(data.data.data,function(){
        var Sender = this.Sender;
        var Message = this.Message;
        var Recipient = this.Recipient;
        //new parse
        if($.isEmptyObject(Sender)){
        }else{
            if(Sender.id!=window.localStorage.getItem('id')){
                name_sender = Sender.name;
                link_avatar = "user_details("+Sender.id+")";
                if(Sender.avatar){
                    image=Sender.avatar;
                }else{
                    image="img/main/avatar.png";
                }
                id_conv=Sender.id
            }

            if(Message.is_read==1){
                status ="background-color: #f7f7f7";
            }else{
                status ="background-color: #fff";
            }
            //console.log(Message.is_read)
            if(type){
            	list+='<div class="col-md-12 col-xs-12 chat_list" style="padding:10px;border-bottom:1px solid #fafafa;line-height:1.2;'+status+'" id="chat_'+Message.id+'">\
            	<div class="col-md-2 col-xs-2"><a href="#/main/user/'+Sender.id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="'+image+'" style="position:relative" onerror="AvaError(this)"></a></div>\
            		<a href="#/chat"><div class="col-md-7 col-xs-7 pointer" onclick="detail_chat(\''+Sender.id+'\',\''+Message.id+'\',\''+image+'\')">\
            			<div class="blue" style="font-size:14px;">'+name_sender+'</div>\
	            		<div class="f10" style="word-break:break-word;color:#aaa">'+Message.message+'</div>\
            		</div></a>\
            		<div class="col-md-3 col-xs-3">\
            			<div style="font-size:10px;color:#ddd;float:right;">'+timeago(Message.elapsed_time)+'</div>\
            		</div>\
            	</div>'
			}else{
            	list+='<div class="col-md-12 col-xs-12 chat_list" style="padding:10px;border-bottom:1px solid #fafafa;line-height:1.2;'+status+'" id="chat_'+Sender.id+'">\
            		<div class="n_del pointer" onclick="dialog(\'chat\','+Sender.id+')" style="position:absolute;right:13px;top:29px;"><div><i class="moco-trash f12" style="height:0;"></i></div></div>\
            		<div class="col-md-2 col-xs-2"><a href="#/main/user/'+Sender.id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="'+image+'" style="position:relative" onerror="AvaError(this)"></a></div>\
            		<div class="col-md-7 col-xs-7 pointer" onclick="detail_chat(\''+Sender.id+'\',\''+Message.id+'\',\''+image+'\')">\
            			<div class="blue" style="font-size:16px;">'+name_sender+'</div>\
	            		<div class="grey f12" style="word-break:break-word;">'+Message.message+'</div>\
            		</div>\
            		<div class="col-md-3 col-xs-3" style="padding:0;">\
            			<div style="font-size:10px;color:#ddd;float:right;">'+timeago(Message.elapsed_time)+'</div>\
            		</div>\
            	</div>'
			}
            //console.log(book)
        }
    });
    setTimeout(function(){
    	//console.log(type)
    	if(type){
		    $('#list_inbox').append(list);  
		}else{
			$('#list_chat').append(list); 
		}
    })
}
function chat_list_chat(type,ding){
	var token = window.localStorage.getItem('token');
	var local = ReadData('_message');
	if(local!=null){
	  	$('#list_chat').html(' '); 
	  	$('#list_inbox').html(' ');
	  	if(type){
		  	chat_parse_list(local,type)
		}else{
			chat_parse_list(local)
		}
	}
	var before =$('#list_chat').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
	var msg = new majax_fast('messages/index',{'access_token':token,'per_page':12},'');
	msg.success(function(data){
	  	$('#list_chat').html(' ');
	  	$('#list_inbox').html(' ');
	  	if(data.meta.code==200){
	  		if(type){
	  			$('#list_inbox').html(' ').attr('data-index',2);
	  		}else{
		  		$('#list_chat').html(' ').attr('data-index',2);
	  		}
	      	count = data.data.total_result;
	      	if(count>12){
	      		$('#btn-loadmore_chat').show();
	      	}
	      	page_message=data.data.num_pages;
	      	WriteData('_message', data)
	      	// var controller = App.ChatController.create();
          	$('#list_chat').html(' '); 
          	$('#list_inbox').html(' ')
          	if(type){
			  	chat_parse_list(data,type)
			}else{
				chat_parse_list(data)
			}       
	  	}else if(data.meta.code==401){
	      	App.content=data.meta.error_message;
	      	$('#confirm_trans_failed').click();
	      	// modalMain();
	      	logout_moco();
		}else{
			chat_friend();
			// $('#btn-loadmore_chat').hide();
	      	//$('#result_message').html('<center style="color:#ddd;padding-top:50px;">'+data.meta.error_message+'</center>');
	      	// $('#list_chat').html('<div style="color:#ddd; padding-top:27px;text-align:center">'+data.meta.error_message+'</div>');
	  	}
	}),
	msg.error(function(data){
		$('#btn-loadmore_chat').hide();
	});
}

function chat_search(data){
	if(data){
		$('#search_').hide();
		$('#chat_').show();
		$('input#query_search').val('');
		$('#icon-search i').addClass('fa-search').removeClass('fa-close').attr('onclick','');
	}else{
		$('#search_').show();
		$('#chat_').hide();
	}
}

function chat_friend(){
	var html='';
	var token = localStorage.getItem('token')
	var id = localStorage.getItem('user_id');
	var before = $('#list_chat').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
	var check = new majax_fast('profile/following',{'access_token':token,'client_id':App.api.client_id,'user_id':id,'per_page':20},before,600000);
	check.error(function(data) {
	$('#list_chat').html('<center>Data Not Found</center>');
	})
	check.success(function(data){
		if(data.meta.code==200){
			$('#btn-loadmore_follow').hide()
			html+='<div style="text-align:center">Suggest friend to chat</div>'
			 $.each(data.data.data,function(){
			 	var user = this;
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

			});
			$('#list_chat').html(html)
		}else{
			chat_friend1();
		}
	})
}

function chat_friend1(){
	var html='';
	var token = localStorage.getItem('token')
	var id = localStorage.getItem('user_id');
	var before = $('#list_chat').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
	var check = new majax_fast('users/suggestfriends',{'access_token':token,'client_id':App.api.client_id,'limit':10},before,600000);
	check.error(function(data) {
	$('#list_chat').html('<center>Data Not Found</center>');
	})
	check.success(function(data){
		if(data.meta.code==200){
			$('#btn-loadmore_follow').hide()
			html+='<div style="text-align:center">Suggest friend to chat</div>'
			 $.each(data.data.users,function(e,user){
			 	// var user = this;
			 	// console.log(user)
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
                var link_ =  'detail_chat("'+user.sugested_friend_id+'",undefined,"'+image+'","'+name+'")';
                var href = '#/chat/'+user.sugested_friend_id;
                var badge = "";
                var radius = "50%/50%";
                var border ="";
                status ="background-color: #fff";

                html+='<div class="col-md-12 col-xs-12" style="padding:10px;border-bottom:1px solid #fafafa;line-height:1.2;'+status+'">\
			        <div class="n_del pointer" onclick="dialog(\'chat\','+user.sugested_friend_id+')" style="position:absolute;right:13px;top:29px;display:none;"><div><i class="moco-trash f12" style="height:0;"></i></div></div>\
			        <div class="col-md-2 col-xs-2"><a href="'+href+'" onclick="'+link_+'"><img class="icon-circle" src="'+image+'" style="position:relative" onerror="AvaError(this)"></a></div>\
			        <div class="col-md-7 col-xs-7 pointer" onclick="detail_chat(\''+user.sugested_friend_id+'\',undefined,\''+image+'\',\''+name.replace(/'/g,"").replace(/"/g,"")+'\')">\
			            <div class="blue" style="font-size:14px;">'+name+'</div>\
			            <div class="grey f12" style="word-break:break-word;">'+address+'</div>\
			        </div>\
			        <div class="col-md-3 col-xs-3" style="padding:0;float:right;style:display:none;">\
			            <div style="font-size:10px;color:#ddd;float:right;"></div>\
			        </div>\
			    </div>'

			});
			$('#list_chat').html(html)
		}else{
			book=data.meta.error_message;
			$('#list_chat').html('<center>'+book+'</center>');
			$('#btn-loadmore_follow').hide()
		}
	})
}

function del_chat(id){
	$('#btn-close_modal').click();
	var token = window.localStorage.getItem('token');
	var check = new majax_secure('messages/delete_conversation',{'access_token':token,'recipient_id':id},'');
	check.success(function(data){
	if(data.meta.code==200){
		$('#chat_'+id).hide();
		App.Success_Alert ="Success"
		App.Success_Content = data.data;
		$('#success').click();
	}else{
		App.Failed_Alert ="Failed"
		App.Failed_Content = data.meta.error_message;
		$('#failed').click();
	}
	});
}

