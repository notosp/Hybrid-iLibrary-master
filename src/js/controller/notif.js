App.NotifController = Ember.ArrayController.extend({
	init:function(){

	},
	actions:{
		list_notif:function(ding){
	      	notif_list_notif(ding)
		},
		parse_notif:function(data){
			notif_parse_notif(data)
		},
		morenotif:function(){
			//alert('morenotif')
			var before = $('#icn-loadmore_notif').addClass('fa moco-load fa-spin');
			var index = $('#list_notif').attr('data-index');
			var token = window.localStorage.getItem('token')
			var msg = new majax_fast('notifications',{'access_token':token,'per_page':12,'page':index},before);
			msg.success(function(data){
				$('#icn-loadmore_notif').removeClass('fa moco-load fa-spin');
				$('#list_notif').attr('data-index',parseInt(index)+1);
				if(data.meta.code==200){
				  count = data.data.total_result;
				  page_Notification=data.data.num_pages;
				  var controller = App.NotifController.create();
				  controller.send('parse_notif',data);       
				}else if(data.meta.code==401){
				    App.content=data.meta.error_message;
				    $('#confirm_trans_failed').click();
				    // modalMain();
				    logout_moco();
				}else{
					$('#btn-loadmore_notif').hide();
				    //$('#result_Notification').html('<center style="color:#ddd;padding-top:50px;">'+data.meta.error_Notification+'</center>');
				    // $('#list_notif').html('<div style="color:#ddd; padding-top:27px;text-align:center">'+data.meta.error_Notification+'</div>');
				}
			}),
			msg.error(function(data){
				$('#btn-loadmore_notif').hide();
				$('#btn-loadmore_notif').removeClass('fa moco-load fa-spin');
			});
	    },
	    detil_feed:function(id){
	    	det_feeds(id);
	  //   	var token = localStorage.getItem('token');
	  //   	var check = new majax_fast('feeds/detail',{'access_token':token,'feed_id':id},'');
			// check.error(function(data) {

			// }),
			// check.success(function(data) {
			// 	console.log(data)
			// 	// com_feeds(id,like,status_like,cover,title,action,data)
			// 	if(data.meta.code==200){
			// 		var Feed = data.data.Feed;
			// 		var Statistic = data.data.Statistics;
			// 		var Sender = data.data.Sender;
			// 		var Book = data.data.Object.Book;
			// 		var Authors = data.data.Object.Authors;
			// 		try{
			// 			com_feeds(Feed.id,Statistic.total_likes,Statistic.has_like,Book.cover,Book.title,Feed.message,Feed.message)
			// 		}catch(error){
			// 			console.log(error.message)
			// 		}

			// 	}else{

			// 	}
			// });
	    }
	}
})

// function com_feeds(id,like,status_like,cover,title,action,data){
function detil_feed(id){
	var controller = App.NotifController.create();
	controller.send('detil_feed',id);
}

function notif_list_notif(ding){
	var token = window.localStorage.getItem('token');
	var local = ReadData('_notif');
	//console.log(local)
	if(local!=null){
		//console.log('lewat')
	  	$('#list_notif').html('');
	  	notif_parse_notif(local)
		// this.send('parse_notif',local);
		if(ding){
			var before =$('#list_notif').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
			// var msg = new majax('Notifications/index',{'access_token':token,'per_page':12},'');
			var msg = new majax_fast('notifications',{'access_token':token,'per_page':12},'');
			msg.success(function(data){
			  	$('#list_notif').html('').attr('data-index',2);
			  	if(data.meta.code==200){
			      	count = data.data.total_result;
			      	page_Notification=data.data.num_pages;
			      	WriteData('_notif', data)
			      	var controller = App.NotifController.create();
			      	if(local==null){
			        	$('#list_notif').html(''); 
						// controller.send('parse_notif',local);
						notif_parse_notif(data)
			      	}else{
			          	$('#list_notif').html(''); 
						// controller.send('parse_notif',local);
						notif_parse_notif(data)
			      	}       
			  	}else if(data.meta.code==401){
			      	App.content=data.meta.error_message;
			      	$('#confirm_trans_failed').click();
			      	// modalMain();
			      	logout_moco();
				}else{
					$('#btn-loadmore_notif').hide();
			      	//$('#result_Notification').html('<center style="color:#ddd;padding-top:50px;">'+data.meta.error_Notification+'</center>');
			      	$('#list_notif').html('<div style="color:#ddd; padding-top:27px;text-align:center">'+data.meta.error_message+'</div>');
			  	}
			}),
			msg.error(function(data){
				$('#btn-loadmore_notif').hide();
			});
		}
	}else{
		$('#list_notif').html('');
	  	var before =$('#list_notif').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
		// var msg = new majax('Notifications/index',{'access_token':token,'per_page':12},'');
		var msg = new majax_fast('notifications',{'access_token':token,'per_page':12},'');
		msg.success(function(data){
		  	$('#list_notif').html('').attr('data-index',2);;
		  	if(data.meta.code==200){
		      	count = data.data.total_result;
		      	page_Notification=data.data.num_pages;
		      	WriteData('_notif', data)
		      	var controller = App.NotifController.create();
		      	if(local==null){
		        	$('#list_notif').html(''); 
					// controller.send('parse_notif',data);
					notif_parse_notif(data)
		      	}else{
		          	$('#list_notif').html(''); 
					// controller.send('parse_notif',data);
					notif_parse_notif(data)
		      	}       
		  	}else if(data.meta.code==401){
		  		$('#btn-loadmore_notif').hide();
		      	App.content=data.meta.error_message;
		      	$('#confirm_trans_failed').click();
		      	// modalMain();
		      	logout_moco();
			}else{
				$('#btn-loadmore_notif').hide();
		      	//$('#result_Notification').html('<center style="color:#ddd;padding-top:50px;">'+data.meta.error_Notification+'</center>');
		      	$('#list_notif').html('<div style="color:#ddd; padding-top:27px;text-align:center">'+data.meta.error_Notification+'</div>');
		  	}
		}),
		msg.error(function(data){
			$('#btn-loadmore_notif').hide();
		});
	}
}

function notif_parse_notif(data){
	var list='';
	// console.log(data)
	try{
	    $.each(data.data.data,function(){
	        var Notif = this.Notification;
	        var Sender = this.Sender;
	        var Object = this.Object;
	        var Other = this.OtherRecipients;
	        hidden ="";
	        // console.log(Notif)
	        //new parse
	        if(Notif.action_type=="RECOMMEND"){
	            // console.log('RECOMMEND')
	            eval("rec_inotif"+Notif.id+"  = 0");
	            var syn="No description";
	            if(Object.Book.description){
	               syn=limitCharacter(Object.Book.description.replace(/\'/g,'').replace(/\"/g,'').replace(/\./g,'-').replace(/\,/g,'+').replace(/(?:\r\n|\r|\n)/g, '*'),165).replace(/\./g,'-'); 
	            }
	            var _author='';
	            var _auth ="";
	            _author +='<span class="black">by </span>';
	            if(Object.Book.authors){
	                 _auth = 'by <span class="medium light-blue">'+Object.Book.authors+'</span>';
	            }else{
	               if(Object.Authors.length==0){
	                  _author+='<span class="medium"></span>';
	                  _auth=_author;
	                }else{
	                    $.each(Object.Authors,function(){
	                        var id = this.id;
	                        var name = this.name;
	                        if(id){
	                            _author+='<span><a style="color:#4D4B8C" href="#/main/moco/library/" onclick="authors_details('+id+')">'+name+' </a></span>';
	                        }else{
	                           _author+='<span><a style="color:#4D4B8C" onclick="">'+name+' </a></span>';
	                        }
	                    })  
	                    _auth=_author;
	                }
	            }
	            // console.log(_auth)
	            eval("rec_dnotif"+Notif.id+"  = []");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Sender.User.id+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Sender.User.avatar+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Sender.User.name+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Object.Book.id+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Object.Book.cover+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+limitCharacter(Object.Book.title,25)+"\')");
	            // eval("rec_dnotif"+Notif.id+".push(\'"+limitCharacter(Object.Book.authors,30)+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+_auth+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+syn+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Notif.elapsed_time+"\')");
	            eval("rec_dnotif"+Notif.id+".push(\'"+Notif.message+"\')");
	        }
	        if($.isEmptyObject(Other)==false){
	            // console.log('not empty')
	            eval("rec_notif"+Notif.id+"  = []");
	            $.each(Other, function(index, value){
	                if($.isEmptyObject(value)==false){
	                    $.each(value, function(index, item){
	                        eval("rec_notif"+Notif.id+".push("+item.id+")")
	                        eval("rec_notif"+Notif.id+".push(\'"+item.name+"\')")
	                    })
	                }else{

	                }
	                eval("rec_inotif"+Notif.id+"  = "+index);
	                // eval("rec_notif"+Notif.id+" = "+rec);
	            })
	        }else{
	            // console.log('empty')
	        }
	        if(Notif.action_type!="DM"){
	            if(Notif.sender_type=="User"){
	                if(Sender.User.name){
	                    name_sender = Sender.User.name;
	                    //link_avatar = "user_details("+Sender.User.id+",'"+Sender.User.name.replace(/ /g,'_')+"')";
	                    link_avatar = "n_user("+Sender.User.id+",'"+Sender.User.name.replace(/ /g,'_')+"',undefined,'"+Notif.id+"','"+Sender.User.name.replace(/ /g,'_')+"','"+Sender.User.avatar+"')";
	                }else{
	                    name_sender = "iNgawi User";
	                    //link_avatar = "user_details("+Sender.User.id+",'"+Sender.User.name.replace(/ /g,'_')+"')";
	                    link_avatar = "n_user("+Sender.User.id+",'Moco_User',undefined,'"+Notif.id+"','Moco_User','"+Sender.User.avatar+"')";
	                }
	                if(Sender.User.avatar){
	                    if(Sender.User.avatar== 'http://store.moco.co.id'){
	                        image="images/icon/avatar.png";
	                    }else{
	                        image=Sender.User.avatar;
	                    }
	                }else{
	                    image="images/icon/avatar.png";
	                }
	                sender_id = '#/main/user/'+Sender.User.id;
	                //cat_sender = Notif.recipient_type;
	            }else if(Notif.sender_type=="Library"){
	                if(Sender.Library.name){
	                    name_sender = Sender.Library.name;
	                    link_avatar = "n_pustaka("+Sender.Library.id+",'"+Sender.Library.name.replace(/ /g,'_')+"',undefined,'"+Notif.id+"')"
	                    //link_avatar = "pustaka("+Sender.Library.id+")";
	                }else{
	                    name_sender = "Pustaka";
	                    link_avatar = "n_pustaka("+Sender.Library.id+",'Pustaka',undefined,'"+Notif.id+"')"
	                    hidden = "display:none;"
	                    //link_avatar = "pustaka("+Sender.Library.id+")";
	                }
	                if(Sender.Library.logo){
	                    image=Sender.Library.logo;
	                }else{
	                    image="images/icon/avatar.png";
	                }
	                //cat_sender = Notif.recipient_type;
	                sender_id = '#/main/epustaka/'+Sender.Library.id;
	            }else if(Notif.sender_type=="Store"){
	                if(Sender.Store.name){
	                    name_sender = Sender.Store.name;
	                    link_avatar = "";
	                }else{
	                    name_sender = "Store";
	                    link_avatar = "";
	                }
	                if(Sender.Store.logo){
	                    image=Sender.Store.logo;
	                }else{
	                    image="images/icon/avatar.png";
	                }
	                sender_id = '#/main/epustaka/'+Sender.Store.id;
	                //cat_sender = Notif.recipient_type;
	            }else{
	                name_sender = "";
	                link_avatar = "";
	                image="images/icon/avatar.png";
	                sender_id = '#/main/user/'+Sender.User.id;
	                //cat_sender = Notif.recipient_type;
	            }

	            //parsing object
	            if(Notif.object_type=="Book"){
	                if(Object.Book){
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
	                    // if(Object.Book.title){
	                    // 	object_action="n_book("+Object.Book.id+",'"+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+"',1,undefined,\'"+Object.Book.cover+"\')"
	                    // 	action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+"\')";
	                    // }else{
	                    // 	object_action="n_book("+Object.Book.id+",'"+Object.Book.title+"',1,undefined,\'"+Object.Book.cover+"\')"
	                    // 	action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title+"\')";
	                    // }
	                    object_action= '';
	                    object_next='';
	                    object_image = '<img class="media-object" src="'+Object.Book.cover+'" style="width:75px;">';
	                    // action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+"\')";
	                	act_notif = 'notif_act(\''+Notif.id+'\',\'Book\',\''+Object.Book.id+'\')'
	                }else{
	                    object_name = '';
	                    object_det = '';
	                    object_action = '';
	                    object_image = 'images/icon/avatar.png';
	                    action_next="";
	                }
	            }else if(Notif.object_type=="User"){
	                object_name = '';
	                object_det = '';
	                //object_action = 'user_details('+Object.User.id+')';
	                object_action = "n_user("+Sender.User.id+",'"+Sender.User.name.replace(/ /g,'_')+"',undefined,'"+Notif.id+"','"+Sender.User.name.replace(/ /g,'_')+"','"+Sender.User.avatar+"')";
	                object_image = '';
	                action_next = "notif_act_to('"+Notif.id+"','"+Object.User.id+"','user_details',\'"+Object.User.name.replace(/ /g,'_').replace(/'/g,"")+"\','"+Sender.User.avatar+"')";
	           		// act_notif = '#/main/user/'+Object.User.id;
	           		act_notif = 'notif_act(\''+Notif.id+'\',\'User\',\''+Object.User.id+'\')'
	            }else if(Notif.object_type=="Library"){
	                if(Object.Library){
	                    object_name = Object.Library.name;
	                    // object_det = 'pustaka('+Object.Library.id+')';
	                    object_action = "n_pustaka("+Object.Library.id+",'"+Object.Library.name.replace(/ /g,'_')+"')";
	                    object_det = Object.Library.address;
	                    object_image = '<img class="media-object" src="'+Object.Library.logo+'" style="width:130px;height:130px;">';
	                    action_next = "notif_act_to('"+Notif.id+"','"+Object.Library.id+"','pustaka')";
	                	// act_notif = '#/main/pustaka/'+Object.Library.id
	                	act_notif = 'notif_act(\''+Notif.id+'\',\'Library\',\''+Object.Library.id+'\')'
	                }else{
	                    object_name = '';
	                    object_det = '';
	                    object_action = '';
	                    object_image = 'images/icon/avatar.png';
	                    action_next="";
	                }
	            }else if(Notif.object_type=="Review"){
	                object_name = '';
	                object_det = '"'+limitCharacter(Object.Review.content,15)+'"<br><span onclick=notif_act_to(\''+Notif.id+'\',\''+Object.Book.id+'\',\'books\',\''+Object.Book.cover+'\',\''+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+'\') style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
	                object_action = '';
	                object_image = '';
	                //action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books')";
	                action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+"\')";
	           		// act_notif = '#/main/book/'+Object.Book.id;
	           		act_notif = 'notif_act(\''+Notif.id+'\',\'Book\',\''+Object.Book.id+'\')'
	            }else if(Notif.object_type=="Comment"){
	                object_name = '';
	                //console.log(Object.Book)
	                if(Object.Book != undefined){
	                    if(Object.Book.title){
	                        object_det = '"'+limitCharacter(Object.Comment.comment,15)+'"<br><span onclick=notif_act_to(\''+Notif.id+'\',\''+Object.Book.id+'\',\'books\',\''+Object.Book.cover+'\',\''+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+'\') style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
	                        object_action = '';
	                        object_image = '';
	                        //action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books')";
	                        action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title.replace(/ /g,'_').replace(/'/g,"")+"\')";
	                    }else{
	                        object_det = '"'+limitCharacter(Object.Comment.comment,15)+'"<br><span onclick=notif_act_to(\''+Notif.id+'\',\''+Object.Book.id+'\',\'books\',\''+Object.Book.cover+'\',\''+Object.Book.title+'\') style="color:#c92036;padding-left:0px;cursor:pointer">Read More >> </span>';
	                        object_action = '';
	                        object_image = '';
	                        //action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books')";
	                        action_next = "notif_act_to('"+Notif.id+"','"+Object.Book.id+"','books',\'"+Object.Book.cover+"\',\'"+Object.Book.title+"\')";
	                    }
	                    // act_notif = '#/main/book/'+Object.Book.id
	                    act_notif = 'notif_act(\''+Notif.id+'\',\'Book\',\''+Object.Book.id+'\')'
	                }else{
	                    object_det = "'"+limitCharacter(Object.Comment.comment,15)+"'";
	                    object_action = '';
	                    object_image = '';
	                    action_next = "";
	                    act_notif ="";
	                }
	            }else if(Notif.object_type=="Message"){
	                object_name = '';
	                object_det = '';
	                object_action = '';
	                object_image = '';
	                action_next = "notif_act_to('"+Notif.id+"','"+Object.Message.sender_id+"','open_conv')";
	                act_notif ="";
	            }else {
	                object_name = '';
	                object_det = '';
	                object_action = '';
	                object_image = 'images/icon/avatar.png';
	                action_next="";
	                act_notif ="";
	            }

	            if(Notif.is_read=="1"){
	                status ="background-color: #f7f7f7";
	            }else{
	                status ="";
	            }

	            // list +='<div class="" id="notif_'+Notif.id+'" style="'+hidden+'">\
	            // <div class="col-xs-1 col-md-1" style="width:3%;padding:0px;'+status+';" id="_status_'+Notif.id+'"><span class="fa fa-circle light-blue"></div>\
	            // <div class="col-xs-3 col-md-2"></span><a href="#/main/moco/library/" onclick="'+link_avatar+'"><img class="media-object circle" src="'+image+'" style="width:60px;height:60px;"></a></div>\
	            // <div class="col-xs-8 col-md-9" style="padding-right:0px;" onclick="" style="cursor:pointer">\
	            // <div class="black" style="font-size:16px;cursor:pointer" onclick="'+link_avatar+'">'+name_sender+'</div>';
	            if(Notif.action_type=="RECOMMEND"){
	                var and='';
	                action_next = 'rec_detail ('+Notif.id+')';
	                try {
	                    if(eval("rec_inotif"+Notif.id)){
	                        if(eval("rec_inotif"+Notif.id)>=1){
	                            and='and '+eval("rec_inotif"+Notif.id)+' person';
	                        }
	                    }
	                } catch (e) {
	                    console.log(e.message);
	                }
	                // list+='<div class="grey" style="font-size:12px;cursor:pointer;word-break:break-word;" onclick="">Send a recommended with you '+and+'</div>\
	                // <div class="grey" style="font-size:12px;cursor:pointer;padding-top:10px;" onclick="'+action_next+'">'+limitCharacter(Notif.message,50)+'</div><div style="font-size:10px;color:#c92036;padding-left:0px;cursor:pointer;" onclick="rec_detail ('+Notif.id+')"> Read More >> </div>\
	                // <div class="col-md-12" style="padding:0px;">\
	                //     <div class="col-xs-5 col-md-3" style="padding:0;float:left;padding-top:15px;"><a href="#/main/moco/library/" onclick="'+object_action+'">'+object_image+'</a></div>\
	                //     <div class="col-xs-7 col-md-9" style="padding:0px;">\
	                //         <div class="black" style="font-size:16px;padding-top:10px;">'+object_name+'</div>\
	                //         <div class="black" style="font-size:12px;padding-top:0px">'+object_det+'</div>\
	                //     </div>\
	                // </div>\
	                // </div>';
	            }else{
	                // list+='<div class="grey" style="font-size:12px;cursor:pointer" onclick="'+action_next+'">'+Notif.message+'</div>\
	                //         <div class="col-md-12" style="padding:0px;">\
	                //         <div class="col-xs-9 col-md-10" style="padding:0px;">\
	                //             <div class="black" style="font-size:16px;padding-top:10px;">'+object_name+'</div>\
	                //             <div class="black" style="font-size:12px;padding-top:10px">'+object_det+'</div>\
	                //         </div>\
	                //         <div class="col-xs-3 col-md-2" style="padding:0;float:right;padding-top:15px;"><a href="#/main/moco/library/" onclick="'+object_action+'">'+object_image+'</a></div>\
	                //     </div>\
	                //     </div>';
	            }

	            if(Notif.action_type=="LIKE_FEED"||Notif.action_type=="COMMENT_FEED"){
	            	act_notif = 'notif_act(\''+Notif.feed_id+'\',\'Feeds\')'
	            }
	            //status ="visibility:hidden";
	            list +='<div>\
	            <div class="col-md-12 col-xs-12 list_chat" id="notif_'+Notif.id+'" style="'+status+'"><div class="col-xs-2 col-md-2" style="margin-left:10px;min-height:32px;"></span><a href="'+sender_id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="'+image+'" style="" onerror="AvaError(this)"></a></div>\
	            <a onclick="'+act_notif+'" class="pointer"><div class="col-xs-9 col-md-9 pointer" style="padding-right:0px;" style="cursor:pointer">\
	            <div class="blue" style="font-size:14px;">'+name_sender+'\
	            <span class="black f12" style="word-break:break-word;">'+Notif.message+'</span><span style="font-size:10px;color:#ddd;"> '+timeago(Notif.elapsed_time)+'</span></div>';
	            list+='</div></a>\
	            <div class="col-xs-12 col-md-12" style="padding:0px;padding-top:5px;display:none;"><div class="divider" style="padding-top:0px;margin-right:0;border-color:#fafafa"></div></div></div></div>';
	            
	            // list+='<div class="col-xs-12 col-md-12" style="padding:0px;padding-top:5px;padding-bottom:10px;padding-left: 20px;">\
	            // <div class="col-xs-3 col-md-2"></div><div class="col-md-7 col-xs-7" style="font-size:10px;color:#bbb">'+Notif.elapsed_time+'</div>\
	            // <div class="divider" style="padding-top:20px;"></div></div></div>';
	        }else{
	        }

	        	// list +='<div class="" id="chat_'+Notification.id+'" style="line-height:1.2">\
	            // <div class="col-xs-1 col-md-1" style="width:14px;padding:0px;'+status+';" id="_status_'+Notification.id+'"><span class="fa fa-circle light-blue"></div>\
	            // <div class="col-xs-2 col-md-2"></span><a href="#/main/user/'+Sender.id+'" onclick="'+link_avatar+'"><img class="icon-circle" src="'+image+'" style="" onerror="AvaError(this)"></a></div>\
	            // <a href="#/chat"><div class="col-xs-6 col-md-6 pointer" style="padding-right:0px;" onclick="detail_chat(\''+Sender.id+'\')" style="cursor:pointer">\
	            // <div class="black" style="font-size:16px;">'+name_sender+'</div>\
	            // <div class="grey f12" style="word-break:break-word;">'+Notification.message+'</div>';
	            // list+='</div></a>\
	            // <div class="col-xs-3 col-md-3 grey" style="padding:0;padding-right:5px;"><div style="font-size:10px;color:#ddd;float:right;">'+timeago(Notification.elapsed_time)+'</div></div>\
	            // <div class="col-xs-12 col-md-12" style="padding:0px;padding-top:10px;"><div class="divider" style="padding-top:0px;margin-right:0"></div></div></div>';
	        	// }
	    });
		setTimeout(function(){
			$('#list_notif').append(list); 
		})
	}catch(error){
		console.log(error.message)
	}
}

function reset_count(){
	var token = localStorage.getItem('token');
	if(token){
		var before = ''
		var data = {'access_token':token};
		var post = majax_secure('notifications/reset_count',data,before);
		post.success(function(data){
	    	// console.log(data)
	    	if(data.meta.code == 200){
	    	}else{

	    	}
	  	});
	  	post.error(function(data){
			// console.log(data)
			App.Failed_Alert="Oops!";
			if(data.statusText!=""){
				App.Failed_Content=data.statusText;
			}else if(data.responseText!=""){
				App.Failed_Content=data.responseText;
			}else{
				App.Failed_Content="Network Problem"
			}
			console.log(App.Failed_Content)
		});
	}else{
		console.log('not yet login')
	}
}
