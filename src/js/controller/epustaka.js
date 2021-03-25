App.MainEpustakaController = Ember.ArrayController.extend({
	init:function(){

	},
	actions:{
		epustaka:function(id){
			// var local = ReadData('_pustaka_genre');
			// myArray = local.data.Category;
			var controller = App.MainEpustakaController.create();
			local = ReadData('_epustaka'+id)
			var token = localStorage.getItem('token')
			var check = new majax_fast('libraries/detail',{'client_id':App.api.client_id,'library_id':id,'access_token':token},'');
			check.error(function(data) {

			}),
			check.success(function(data) {
				// console.log(data)
				if(data.meta.code==200){
					WriteData('_epustaka'+id, data);
					if(local){
						controller.send('parse_epustaka',local,id)
					}else{
						controller.send('parse_epustaka',data,id)
					}
				}else{
					alert(data.meta.error_message);
					history.go(-1);
				}
			})
		},
		parse_epustaka:function(data,id){
			// console.log(data);
			var Config = data.data.Config;
			var Library = data.data.Library;
			var Sponsors = data.data.Sponsors;
			var Statistic = data.data.Statistic;
			console.log(Library.category_name)
			if(Library.category_name=="Tokoh"){
				$('.cover img').css('border-radius','50%');
			}
			// try{
			// 	var found = $.map(local.data.Category, function(val) {
			// 	    return val.id == Library.category_id ? val.name : null;
			// 	});
			// 	if(found[0]=="Tokoh"){
			// 		$('.cover img').css('border-radius','50%');
			// 	}
			// }catch(e){
			// 	console.log(e)
			// }
			setTimeout(function(){
				$('.cover img').attr('src',Library.logo);
			},500)
			$('.author').html(Library.name);
			$('#pustaka_name').html(Library.name)
			$('#tot_collection').html(kilo(Statistic.total_books))
			$('#copy').html(kilo(Statistic.total_copies))
			var cost = parseInt(Config["Library.MembershipCharge"]/1000)
			$('#point').html(cost);
			$('#want').html(Statistic.total_followers)
			$('#tot_review').html("("+Statistic.total_comments+")")
			// $('#reads').html(Statistic.total_reading)
			// $('#synopsis').html(Library.about);
			$('#synopsis').html(limitCharacter(Library.about,200,true));
			App.book_id = Library.id
			App.book_synopsis = Library.about;
			App.book_title = Library.name
			App.book_cover = Library.logo;
			App.book_authors = Library.address;

			document.title=App.book_title;

			ga_pages('/epustaka/'+Library.name,Library.name)
			ga_action('ePustaka','ePustaka Detail',Library.name)

			$('#read_more').attr('onclick','javascript:$(\'#det-epustaka\').click()')

			var pustaka_link = Library.url_profile;
			
			$('#facebook1').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+pustaka_link+'&picture='+Library.logo+'&name='+Library.name+'&description='+Statistic.total_books+' books '+Library.address+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
			$('#twitter1').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+Library.name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+pustaka_link+'")');
			$('#google1').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+pustaka_link+'")');
			$('#email1').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+Library.name+'%20%0A'+Statistic.total_books+' books '+Library.address+'%20%0A'+pustaka_link+'%20%0Avia iNgawi desktop")');
			$('#linkedin1').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+pustaka_link+'")');

			if(Config["Library.AllowPoinChargeJoin"]=="1"&&Config["Library.AllowUniqueCodeJoin"]=="1"){
		  		var join = 'join_(\'All\',\''+Library.id+'\',\''+Library.name.replace(/\'/g," ")+'\',\''+Config["Library.MembershipCharge"]+'\')'
		  	}else if(Config["Library.AllowPoinChargeJoin"]=="1"){
		  		var join = 'join_(\'Poin\',\''+Library.id+'\',\''+Library.name.replace(/\'/g," ")+'\',\''+Config["Library.MembershipCharge"]+'\')';
		  	}else if(Config["Library.AllowUniqueCodeJoin"]=="1"){
		  		var join = 'join_(\'Code\',\''+Library.id+'\',\''+Library.name.replace(/\'/g," ")+'\',\''+Config["Library.MembershipCharge"]+'\')';
		  	}else{
		  		var join = 'join_(\'All\',\''+Library.id+'\',\''+Library.name.replace(/\'/g," ")+'\',\''+Config["Library.MembershipCharge"]+'\')'
	  		}
	  		// stack_scroll('#review_stack','.b_left',1)
	  		if(token){
				$('#join_pustaka').attr('onclick',join);
				$('#pustaka_follow').attr('onclick','pustaka_follower('+id+')')
				$('#btn-review').attr('onclick','review(\'Comment\',\'Library\',\''+id+'\')');
			}else{
				$('#join_pustaka').attr('onclick',"location.href='#/login'")
				$('#pustaka_follow').attr('onclick',"location.href='#/login'")
				$('#btn-review').attr('onclick',"location.href='#/login'")
			}
			$('#btn-loadmore_comment').attr('onclick','morecomment(\'pustaka\',\''+id+'\')')
			$('#btn-loadmore_col').attr('onclick','morecol(\'pustaka\',\''+id+'\')')
			var controller = App.FollowController.create();
			controller.send('check_follow','Library',id)
			var controller = App.MainEpustakaController.create();
					
				
			$('#btn-loadmore_search').attr('onclick','more_pustaka_search(\''+id+'\')')
			try{
				controller.send('review',id)
			}catch(error){	
				console.log(error.message)
			}
			try{
				controller.send('check_member',id)
			}catch(error){	
				console.log(error.message)
			}
			try{
				controller.send('collection',id)
			}catch(error){	
				console.log(error.message)
			}
			try{
				controller.send('search',id)
			}catch(error){
				console.log(error.message)
			}
		},
		check_member:function(id){
			var token = window.localStorage.getItem('token');
			var member = new majax('students/is_member',{'access_token':token,'library_id':id},"");
			member.success(function(data){
			  //console.log(data);
				if(data.meta.code==200){
					if(data.data=='true'){
						$('#join_pustaka').css('background-color','#aaa');
						$('#join_pustaka').removeAttr('onclick');
						//$('#join_pustaka').css('padding','10px 10px');
						$('#join_text').html('You`re a Member');
						$('#join_pustaka').css('border','1px solid #888');
						$('#act_follow_').removeClass('col-md-4 col-xs-4').addClass('col-md-6 col-xs-6').css('padding-left','4px')
						$('#act_follow_ .box').css('padding-top','15px').css('padding-bottom','15px')
						$('#pustaka_follow_').removeClass('col-md-4 col-xs-4').addClass('col-md-6 col-xs-6').css('padding-right','4px')
						$('#pustaka_follow_ .box' ).css('padding-top','15px').css('padding-bottom','15px')
						$('#join_pustaka_').hide()
						//$("#join_check").removeClass('fa fa-plus').addClass('moco-check_o_e');
						//$("#join_check").css('padding-right','10px');
						// $('#nav_sponsored').css('visibility','visible');
					}else{
						//is_free_epustaka();
					}
				}else{
				}
			});
			member.error(function(data){
			// console.log(data);
			Moco.content=data.responseText;
				$('#confirm_trans_failed').click();
			})
		},
		review:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('comments/index',{'access_token':token,'key':id,'type':'Library','per_page':10},before);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#review').attr('data-index',3);
						// console.log(data)
						$('#list_review').html('');
						// console.log(data)
						if(data.data.total_result<10){
							$('#btn-loadmore_comment').hide()
						}
						var controller = App.MainEpustakaController.create();
						controller.send('parse_review',data)
					}else{
						word = '<center id="empty"  style="margin-top: 50px;">\
		                   <div class="fe_blank_chat" style="height:150px;"></div>\
		                  <div class="grey f14" style="">Belum ada ulasan</div>\
		                  </div>\
		                </center>'
						$('#list_review').html(word);
						$('#btn-loadmore_comment').hide()
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_comment').hide()
			}
		},
		parse_review:function(data,index){
			var word ="";
			$.each(data.data.data,function(){
				var Comments = this.Comment;
				var Like = this.Like;
				var Review = this.Review;
				var User = this.User;
				var nama = "iNgawi User"
				try{
					var name = User.name.split(' ');
					// console.log(name)
					// console.log(name.length)
					if(name.length>3){
						nama = name[0]+' '+name[1]+' '+name[2]
					}else{
						nama = User.name
					}
				}catch(error){
					console.log(error.message)
					nama = User.name
				}
				word+='<div class="review" id="review'+Comments.id+'" style="padding-top:5px;">\
					<div class="">\
						<span><a href="#/main/user/'+User.id+'"><img class="avaMiniCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a></span>\
						<span class="blue up">'+nama+'</span>\
						<span class="f10 b up">'+timeago(Comments.elapsed_time)+'</span>\
					</div>\
					<div class="content m-right" style="margin-top:0">\
						<span>'+Comments.comment+'</span>\
					</div>\
					<div class="tail" style="margin-top:4px;left:0;width:207px;padding:5px;padding-bottom:0;padding-top:0;border-color:transparent;margin-left: 23px;">'
					//console.log(Like.has_like)
					if(Like.has_like==1){
						word+='<span class="pointer" id="actLikeComment-'+Comments.id+'" onclick="like_(\''+Comments.id+'\',\'0\',\''+Comments.id+'\',\'Comment\')"><i class="moco-like blue" id="LikeReview-'+Comments.id+'"></i> <span id="TotalLikeReview-'+Comments.id+'">'+Like.total_likes+'</span> .</span>'
					}else{
						word+='<span class="pointer" id="actLikeComment-'+Comments.id+'" onclick="like_(\''+Comments.id+'\',\'1\',\''+Comments.id+'\',\'Comment\')"><i class="moco-like grey" id="LikeReview-'+Comments.id+'"></i> <span id="TotalLikeReview-'+Comments.id+'">'+Like.total_likes+'</span> .</span>'
					}
					// word+='<span class="pointer" onclick="change_review('+Comments.id+')"> Comment</span>'
					if(Like.has_report==1){	
						word+='<span class="pointer" id="actDislikeComment-'+Comments.id+'" onclick="like_(\''+Comments.id+'\',\'0\',\''+Comments.id+'\',\'Comment\')" style="float:right"><i id="DislikeReview-'+Comments.id+'" class="moco-flag"></i> Laporkan</span>'
					}else{
						word+='<span class="pointer" id="actDislikeComment-'+Comments.id+'" onclick="like_(\''+Comments.id+'\',\'-1\',\''+Comments.id+'\',\'Comment\')" style="float:right"><i id="DislikeReview-'+Comments.id+'"class="moco-flag grey"></i> Laporkan</span>'
					}
					word+='</div>'
				word+='<div class="divider" style="padding-top:0;border-color:#fafafa"></div></div>'
			})
			if(index){
				$('#list_review').append(word);
			}else{
				$('#list_review').html(word);
			}
		},
		morereview:function(id){
			var word = '';
			var index = $('#review').attr('data-index')
			var token = localStorage.getItem('token');
			var before = $('#icn-loadmore_comment').addClass('fa moco-load fa-spin');
			//var before = $('#review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('comments/index',{'access_token':token,'key':id,'type':'Library','per_page':5,'page':index},before);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					$('#icn-loadmore_comment').removeClass('fa moco-load fa-spin');
					if(data.meta.code==200){
						$('#review').attr('data-index',parseInt(index)+1);
						// console.log(data)
						console.log(data)
						if(data.data.total_result<10){
							$('#btn-loadmore_comment').hide()
						}
						$('#review').attr('data-index',3)
						var controller = App.MainEpustakaController.create();
						controller.send('parse_review',data,1)
					}else{
						$('#icn-loadmore_comment').removeClass('fa moco-load fa-spin');
						$('#btn-loadmore_comment').hide()
					}
				})
			}catch(error){
				$('#icn-loadmore_comment').removeClass('fa moco-load fa-spin');
				$('#btn-loadmore_comment').hide()
				console.log(error.message)
			}
		},
		comment:function(id){

		},
		collection:function(id){
			var books_text='';
			var token = localStorage.getItem('token')
			var before = $('#list_collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var check = new majax_fast('books/sort/library',{'library_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12},before,600000);
			check.success(function(data){
				// console.log(data)
				$('#list_collection').html('');
				if(data.meta.code==200){
					var controller = App.MainEpustakaController.create()
					controller.send('parse_collection',data)
					$('#list_collection').attr('data-index',2)
					if(data.data.total_result<12){
						$('#btn-loadmore_col').hide()
					}
				  //console.log(book);
				}else{
				  //$('#detail_book').html('');
				  book=data.meta.error_message;
				  $('#list_collection').html(book);
				  $('#btn-loadmore_col').hide()
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				    $('#list_collection').html('<center class="grey">Data not found</center>');
				    $('#btn-loadmore_col').hide()
				  }
				}
			});
			check.error(function(data){
			// book=data.meta.error_message;
			$('#list_collection').html('');
			$('#btn-loadmore_col').hide()
			})
		},
		more_collection:function(id){
			var token = localStorage.getItem('token')
			// var before = $('#collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var before=""
			var index = $('#list_collection').attr('data-index')
			var check = new majax_fast('books/sort/library',{'library_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'page':index},before,600000);
			check.success(function(data){
				// console.log(data)
				//$('#collection').html('');
				if(data.meta.code==200){
					$('#list_collection').attr('data-index',parseInt(index)+1)
					var controller = App.MainEpustakaController.create()
					controller.send('parse_collection',data,1)
				  //console.log(book);
				}else{
				  //$('#detail_book').html('');
				  book=data.meta.error_message;
				  $('#btn-loadmore_col').hide()
				  //$('#collection').html(book);
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				    $('#btn-loadmore_col').hide()
				    //$('#collection').html('<center class="grey">Data not found</center>');
				  }
				}
			});
			check.error(function(data){
				// book=data.meta.error_message;
				//$('#list_collection').html('');
				$('#btn-loadmore_col').hide()
			})
		},
		parse_collection:function(data,index){
			var books_text='';
			$.each(data.data.data,function(){
				var Book = this.Book;
				var Statistic = this.Statistic;
			    // parse_epustaka_books(data);
			    if(Book.extension=="mp4"){
 		          var error = 'VidError(this)'
 		        }else if(Book.extension=="mp3"){
 		          var error = 'AudError(this)'
 		        }else{
 		          var error = 'CovError(this)'
 		        }
			    books_text += '<div class="b-white">\
		        	<div class="image col-lg-3 col-md-4 col-xs-6" style="margin-bottom:15px;"><img class="shadow pointer img_cover1" src="'+Book.cover+'" onerror="'+error+'" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        books_text+='</div>'
		  	});
		  	if(index){
		  		$('#list_collection').append(books_text)
		  	}else{
				$('#list_collection').html(books_text)
		  	}
		},
		search:function(id){
			//http://moco.co.id:7070/apis/libraries/http://localhost:8000/apis/libraries/search?access_token=1c3038ca50048937836c8b0521a0f345256ab69e&per_page=2&keywords=strategi&library_id=20&page=1
			var typingTimer;                
		    var doneTypingInterval = 1000;
		    var token =window.localStorage.getItem('token');
		    $("input#query_psearch").keyup(function(){
		        clearTimeout(typingTimer);
		        if ($("input#query_psearch").val()) {
		            typingTimer = setTimeout(function(){
		                var books_text='';
						var token = localStorage.getItem('token')
						var before = $('#search_collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
						var check = new majax_fast('libraries/search',{'library_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'keywords':$("input#query_psearch").val()},before,600000);
						check.success(function(data){
							// console.log(data)
							$('#search_collection').html('');
							if(data.meta.code==200){
								$('#search_collection').attr('data-index',2)
								var controller = App.MainEpustakaController.create();
								controller.send('parse_search',data)
								if(data.data.total_result>=20){
									$('#btn-loadmore_search').show()
								}
							  //console.log(book);
							}else{
							  //$('#detail_book').html('');
							  book=data.meta.error_message;
							  $('#search_collection').html('<center class="grey">'+book+'</center>');
							}
							if(data.data){
							  if(data.data.total_result==0){
							    book=data.meta.error_message;
							    $('#search_collection').html('<center class="grey">Data not found</center>');
							  }
							}
						});
						check.error(function(data){
						// book=data.meta.error_message;
						$('#collection').html('');
						})
		            }, doneTypingInterval);
		        }
		    })
		},
		more_search:function(id){
			var index = $('#search_collection').attr('data-index');
			var token = localStorage.getItem('token')
			var before='';
			var check = new majax_fast('libraries/search',{'library_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'page':index,'keywords':$("input#query_psearch").val()},before,600000);
			check.success(function(data){
				// console.log(data)
				// $('#search_collection').html('');
				if(data.meta.code==200){
					$('#search_collection').attr('data-index',parseInt(index)+1)
					var controller = App.MainEpustakaController.create();
					controller.send('parse_search',data,1)
					if(data.data.total_result>=20){
						$('#btn-loadmore_search').show()
					}
				  //console.log(book);
				}else{
					$('#btn-loadmore_search').hide();
				  //$('#detail_book').html('');
				  book=data.meta.error_message;
				  $('#search_collection').append(book);
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				  }
				}
			});
			check.error(function(data){
				$('#btn-loadmore_search').hide()
			// book=data.meta.error_message;
			})
		},
		parse_search:function(data,index){
			var books_text ="";
			// console.log(data)
			$.each(data.data.book,function(){
				// console.log(this)
				var Book = this;
				var Statistic = this.Statistic;
			    // parse_epustaka_books(data);
			    // books_text += '<div class="b-white">\
		     	//      <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		     	//    books_text+='</div>'
		     	books_text += '<div class="b-white">\
		          <div class="image col-lg-3 col-md-4 col-xs-6" style="margin-bottom:15px;"><img class="shadow pointer img_cover1" src="'+Book.cover+'" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        books_text+='</div>'
		  	});
		  	if(index){
		  		$('#search_collection').append(books_text)
		  	}else{
				$('#search_collection').html(books_text)
		  	}
		}
	}
})

function open_pustaka(data){
	if(data){
		$('#result_icon').css('left','480px');
		$('#result_search').show();
		setTimeout(function(){
			$('#query_psearch').focus();
		},1000)
	}else{
		$('#result_icon').css('left','100%');
		$('#result_search').hide();
	}
}
function more_pustaka_search(id){
	var controller = App.MainEpustakaController.create();
	controller.send('more_search',id);
}

function morecomment(type,id){
	if(type=="pustaka"){
		var controller = App.MainEpustakaController.create();
		controller.send('morereview',id)
	}else if(type=="author"){
		var controller = App.AuthorController.create();
		controller.send('morereview',id)
	}else if(type=="user"){
		var controller = App.UserController.create();
		controller.send('morereview',id)
	}
}

function morecol(type,id){
	if(type=="pustaka"){
		var controller = App.MainEpustakaController.create();
		controller.send('more_collection',id)
	}else if(type=="author"){
		var controller = App.AuthorEpustakaController.create();
		controller.send('more_collection',id)
	}else if(type=="user"){
		var controller = App.UserController.create();
		controller.send('more_collection',id)
	}
}