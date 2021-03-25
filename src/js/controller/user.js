App.UserController = Ember.ArrayController.extend({
	init:function(){
		// /apis/iNgawi/v3/donations/users_donation_list
	},
	actions:{
		user:function(id){
			var userp_id = ReadData('user_id');
			user_idp = id;
			if(userp_id==id){
				$('.u_gen').hide();
				// $('.own').removeClass('col-md-4').removeClass('col-xs-4').addClass('col-md-6').addClass('col-xs-6');
				$('#chat_act').hide()
				$('.u_det').show()
			}else{
				$('.u_gen').show();
				// $('.own').addClass('col-md-4').addClass('col-xs-4').removeClass('col-md-6').removeClass('col-xs-6');
				$('#chat_act').show()
				$('.u_det').hide()
			}
      				
			$('#btn-close').click()
			// console.log(id)
			var token = localStorage.getItem('token')
			var check = new majax_fast('profile',{'client_id':App.api.client_id,'user_id':id},'');
			//access_token,library_id,page,per_page
			check.error(function(data) {

			}),
			check.success(function(data) {
				// console.log(data)
				if(data.meta.code==200){
					// console.log(data);
					var User = data.data.User
					var Badge = data.data.Badge
					var Statistic = data.data.Statistic
					var Customer = data.data.Customer
					var UserFollowing = data.data.UserFollowing
					var Student = data.data.Student
					// console.log(User)
					// console.log(data)

					$('.cover img').attr('src',User.avatar);
					$('#author_name').html(User.name)
					$('#author_address').html(User.address)
					$('#author_following').html(Statistic.total_followings)
					$('#author_followers').html(Statistic.total_followers)
					$('#synopsis').html(limitCharacter(User.about,200,true));
					App.book_id = User.id
					App.book_synopsis = User.about;
					App.book_title = User.name
					App.book_cover = User.avatar;
					App.book_authors = User.address;
					$('#read_more').attr('onclick','javascript:$(\'#det-synopsis\').click()')

					document.title=App.book_title;

					$('#img_badge').attr('src',Badge.icon)
					$('#name_badge').html(' '+Badge.name)

					if(token){
						$('#_followers').attr('onclick','_follower(\'user\','+id+')')
						$('#_following').attr('onclick','_following(\'user\','+id+')')
					}else{
						$('#_followers').attr('onclick',"location.href='#/login'")
						// $('#_following').attr('onclick','_following(\'author\','+id+')')
						$('#_following').attr('onclick',"location.href='#/login'")
					}


					var pustaka_link = User.url_profile;
					var name_chat;
					if(User.name){
						name_chat = User.name.replace(/'/g,'').replace(/"/g,'')
					}else{
						name_chat = 'iNgawi User'
					}
					$('#chat_act').attr('onclick','detail_chat1(\''+id+'\',undefined,\''+User.avatar+'\',\''+name_chat+'\')').attr('href','#/chat/'+User.id)
					//$('#btn-review').attr('onclick','review(\'Comment\',\'Author\',\''+id+'\')');
					// $('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id=1389978131265139&link='+pustaka_link+'&picture='+User.avatar+'&name='+User.name+'&description='+User.address+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
					// $('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+User.name+' on moco%20%0Avia moco desktop%20%0A&url='+pustaka_link+'")');
					// $('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+pustaka_link+'")');
					// $('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+User.name+'%20%0A'+User.address+'%20%0A'+pustaka_link+'%20%0Avia moco desktop")');
					// $('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+pustaka_link+'")');

					var controller = App.FollowController.create();
					controller.send('check_follow','User',id)

					$('#btn-loadmore_comment').attr('onclick','morecomment(\'user\',\''+id+'\')')
					$('#btn-loadmore_col').attr('onclick','morecol(\'user\',\''+id+'\')')

					var controller = App.UserController.create();
					
					try{
						controller.send('review',id)
					}catch(error){	
						console.log(error)
					}
					try{
						controller.send('collection',id)
					}catch(error){	
						console.log(error)
					}
					try{
						controller.send('list_donasi','false')
					}catch(error){	
						console.log(error)
					}
					if(user_tab=="donasi"){
						controller.send('donasi')
					}
				}
			})
		},
		comment:function(id){
			$('.u_list').hide()
			$('.u_btn').removeClass('act-author');
			$('#review').show()
			$('#s2').addClass('act-author');
			// alert('Comment')
		},
		books:function(){
			$('.u_list').hide()
			$('.u_btn').removeClass('act-author');
			$('#collection').show()
			$('#s1').addClass('act-author');
			// alert('books')
			user_tab="book"
		},
		donasi:function(id){
			$('.u_list').hide()
			$('.u_btn').removeClass('act-author');
			$('#donasi').show()
			$('#s3').addClass('act-author');
			user_tab="donasi";
			// alert('Comment')
		},
		list_donasi:function(status){
			if(status!="true"){
				var before = $("#list_donasi").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
			}else{
				var before = '';
			}
			var page = $('#list_donasi').attr('data-index')
			var token = localStorage.getItem('token')
			var books_text = '';
			console.log(page)
			console.log(status)
			if(token){
				var check = new majax_secure_empty(App.api.v3+'donations/users_donation_list',{'access_token':token,'client_id':App.api.client_id,'page':page,'per_page':10,'user_id':user_idp},before);
			}else{
				var check = new majax_secure_empty(App.api.v3+'donations/users_donation_list',{'client_id':App.api.client_id,'page':page,'per_page':10,'user_id':user_idp},before);
			}
			check.success(function(data){
				$("#list_donasi").removeClass('fa fa-spin moco-load');
				$('#btn-loadmore_don').show()
				if(data.meta.code==200){
					if(data.data.Viewed_users_books){
						if(data.data.Viewed_users_books.length<10){
							$('#btn-loadmore_don').hide()
						}else{
							$('#btn-loadmore_don').show()
						}
						if(status=="true"){
							var angka = parseInt($('#list_donasi').attr('data-index'))+1
							console.log(angka)
							$('#list_donasi').attr('data-index',angka);
						}else{
							$('#list_donasi').attr('data-index',2);
						}
						var action ="";
						$.each(data.data.Viewed_users_books,function(){
							var Book = this;
						    books_text += '<div class="b-white">\
					          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Book.book_id+'\'"></div>';
					        books_text+='</div>'
						})
						if(status=="true"){
							$('#list_donasi').append(books_text)
						}else{
							$('#list_donasi').html(books_text)
						}
					}else{
						books_text ='<div class="content1" id="scroll_feeds" style="bottom:0;;height:371px;text-align: center;margin-top:50px;">\
		                <div style="padding: 10px 70px;font-size: 12px;color: #444;">Bantu cerdaskan bangsa lewat uluran tanggan anda</div>\
		                <div><img src="img/main/empty_donasi.png"></div>\
		                <div style="font-size: 12px;padding: 10px 25px;color: #444;">Saatnya anda turun tangan dengan menambah jumlah koleksi ePustaka kesayangan anda agar buku favorit anda bisa dinikmati oleh orang banyak</div>\
		              </div>'
						$('#btn-loadmore_don').hide()
						if(status!=true){
							// $("#list_donasi").html('<br><center>'+data.meta.error_message+'<center>')
							$("#list_donasi").html(books_text)
						}
					}
				}else{
					books_text ='<div class="content1" id="scroll_feeds" style="bottom:0;;height:371px;text-align: center;margin-top:50px;">\
		                <div style="padding: 10px 70px;font-size: 12px;color: #444;">Bantu cerdaskan bangsa lewat uluran tanggan anda</div>\
		                <div><img src="img/main/empty_donasi.png"></div>\
		                <div style="font-size: 12px;padding: 10px 25px;color: #444;">Saatnya anda turun tangan dengan menambah jumlah koleksi ePustaka kesayangan anda agar buku favorit anda bisa dinikmati oleh orang banyak</div>\
		              </div>'
					$('#btn-loadmore_don').hide()
					if(status!=true){
						// $("#list_donasi").html('<br><center>'+data.meta.error_message+'<center>')
						$("#list_donasi").html(books_text)
					}
				}
			})
			check.error(function(data){
				$('#btn-loadmore').hide()
				$("#don_list_pustaka").html('');
			})
		},
		review:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('queues/index',{'user_id':id,'client_id':App.api.client_id,'per_page':12},before,600000);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#review').attr('data-index',3);
						$('#list_review').html('');
						// console.log(data)
						if(data.data.total_result<12){
							$('#btn-loadmore_comment').hide()
						}
						var controller = App.UserController.create();
						controller.send('parse_review',data)
					}else{
						word = '<div id="empty" style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;height:150px;width:150px;">\
		                   <div class="fe_blank_chat" style="height:150px;"></div>\
		                <div style="text-align:center">'+data.meta.error_message+'</div></div>'

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
				var Book = this.Book;
				var Statistic = this.Statistic;
			    word += '<div class="b-white">\
		          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        word+='</div>'
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
			try{
				var check = new majax_fast('queues/index',{'user_id':id,'client_id':App.api.client_id,'per_page':12,'page':index},before,600000);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					$('#icn-loadmore_comment').removeClass('fa moco-load fa-spin');
					if(data.meta.code==200){
						$('#review').attr('data-index',parseInt(index)+1);
						console.log(data)
						if(data.data.total_result<20){
							$('#btn-loadmore_comment').hide()
						}
						$('#review').attr('data-index',3)
						var controller = App.UserController.create();
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
		collection:function(id){
			var books_text='';
			var word='';
			var token = localStorage.getItem('token')
			var before = $('#list_collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var check = new majax_fast('books/borrow_histories',{'user_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12},before,600000);
			check.success(function(data){
				$('#list_collection').html('');
				if(data.meta.code==200){
					var controller = App.UserController.create()
					controller.send('parse_collection',data)
					$('#list_collection').attr('data-index',2)
					if(data.data.total_result<12){
						$('#btn-loadmore_col').hide()
					}else{
						$('#btn-loadmore_col').show()
					}
				}else{
				  // book=data.meta.error_message;
				  // $('#list_collection').html(book);
				  word = '<div id="empty" style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;height:150px;width:150px;">\
		                   <div class="fe_blank_chat" style="height:150px;"></div>\
		                <div style="text-align:center">'+data.meta.error_message+'</div></div>'
				    $('#list_collection').html(word);
				  $('#btn-loadmore_col').hide()
				}
				if(data.data){
				  if(data.data.total_result==0){
				    // book=data.meta.error_message;
				    word = '<div id="empty" style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;height:150px;width:150px;">\
		                   <div class="fe_blank_chat" style="height:150px;"></div>\
		                <div style="text-align:center">'+data.meta.error_message+'</div></div>'
		                
				    $('#list_collection').html(word);
				    $('#btn-loadmore_col').hide()
				  }
				}
			});
			check.error(function(data){
			$('#list_collection').html('');
			$('#btn-loadmore_col').hide()
			})
		},
		more_collection:function(id){
			var token = localStorage.getItem('token')
			var before=""
			var index = $('#list_collection').attr('data-index')
			var check = new majax_fast('books/borrow_histories',{'user_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'page':index},before,600000);
			check.success(function(data){
				if(data.meta.code==200){
					$('#list_collection').attr('data-index',parseInt(index)+1)
					var controller = App.UserController.create()
					controller.send('parse_collection',data,1)
				}else{
				  book=data.meta.error_message;
				  $('#btn-loadmore_col').hide()
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				    $('#btn-loadmore_col').hide()
				  }
				}
			});
			check.error(function(data){
				$('#btn-loadmore_col').hide()
			})
		},
		parse_collection:function(data,index){
			var books_text='';
			$.each(data.data.data,function(){
				var Book = this.Book;
				var Statistic = this.Statistic;
				if(Book.extension=="mp4"){
		          var error = 'VidError(this)'
		        }else if(Book.extension=="mp3"){
		          var error = 'AudError(this)'
		        }else{
		          var error = 'CovError(this)'
		        }
			    books_text += '<div class="b-white">\
		          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError('+error+')" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        books_text+='</div>'
		  	});
		  	if(index){
		  		$('#list_collection').append(books_text)
		  	}else{
				$('#list_collection').html(books_text)
		  	}
		},
		review1:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('items/want',{'user_id':id,'client_id':App.api.client_id,'per_page':12},before,600000);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#review').attr('data-index',3);
						$('#list_review').html('');
						console.log(data)
						if(data.data.total_result<12){
							$('#btn-loadmore_comment').hide()
						}
						var controller = App.UserController.create();
						controller.send('parse_review',data)
					}else{
						word = '<div id="empty" style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;height:150px;width:150px;">\
		                   <div class="fe_blank_chat" style="height:150px;"></div>\
		                <div style="text-align:center">'+data.meta.error_message+'</div></div>'

						$('#list_review').html(word);
						$('#btn-loadmore_comment').hide()
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_comment').hide()
			}
		},
		parse_review1:function(data,index){
			var word ="";
			$.each(data.data.data,function(){
				var Book = this.Book;
				var Statistic = this.Statistic;
				if(Book.extension=="mp4"){
		          var error = 'VidError(this)'
		        }else if(Book.extension=="mp3"){
		          var error = 'AudError(this)'
		        }else{
		          var error = 'CovError(this)'
		        }
			    word += '<div class="b-white">\
		          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError('+error+')" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        word+='</div>'
			})
			if(index){
				$('#list_review').append(word);
			}else{
				$('#list_review').html(word);
			}
		},
		morereview1:function(id){
			var word = '';
			var index = $('#review').attr('data-index')
			var token = localStorage.getItem('token');
			var before = $('#icn-loadmore_comment').addClass('fa moco-load fa-spin');
			try{
				var check = new majax_fast('items/want',{'user_id':id,'client_id':App.api.client_id,'per_page':12,'page':index},before,600000);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					$('#icn-loadmore_comment').removeClass('fa moco-load fa-spin');
					if(data.meta.code==200){
						$('#review').attr('data-index',parseInt(index)+1);
						console.log(data)
						if(data.data.total_result<20){
							$('#btn-loadmore_comment').hide()
						}
						$('#review').attr('data-index',3)
						var controller = App.UserController.create();
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
		collection1:function(id){
			var books_text='';
			var token = localStorage.getItem('token')
			var before = $('#list_collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var check = new majax_fast('items/user_reads',{'user_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12},before,600000);
			check.success(function(data){
				$('#list_collection').html('');
				if(data.meta.code==200){
					var controller = App.UserController.create()
					controller.send('parse_collection',data)
					$('#list_collection').attr('data-index',2)
					if(data.data.total_result<12){
						$('#btn-loadmore_col').hide()
					}
				}else{
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
			$('#list_collection').html('');
			$('#btn-loadmore_col').hide()
			})
		},
		more_collection1:function(id){
			var token = localStorage.getItem('token')
			var before=""
			var index = $('#list_collection').attr('data-index')
			var check = new majax_fast('items/user_reads',{'user_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'page':index},before,600000);
			check.success(function(data){
				if(data.meta.code==200){
					$('#list_collection').attr('data-index',parseInt(index)+1)
					var controller = App.UserController.create()
					controller.send('parse_collection',data,1)
				}else{
				  book=data.meta.error_message;
				  $('#btn-loadmore_col').hide()
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				    $('#btn-loadmore_col').hide()
				  }
				}
			});
			check.error(function(data){
				$('#btn-loadmore_col').hide()
			})
		},
		parse_collection1:function(data,index){
			var books_text='';
			$.each(data.data.data,function(){
				var Book = this.Book;
				var Statistic = this.Statistic;
				if(Book.extension=="mp4"){
		          var error = 'VidError(this)'
		        }else if(Book.extension=="mp3"){
		          var error = 'AudError(this)'
		        }else{
		          var error = 'CovError(this)'
		        }
			    books_text += '<div class="b-white">\
		          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError('+error+')" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        books_text+='</div>'
		  	});
		  	if(index){
		  		$('#list_collection').append(books_text)
		  	}else{
				$('#list_collection').html(books_text)
		  	}
		},
		want:function(id){
			var books_text='';
			var before = $('#collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var check = new majax_fast('items/want',{'user_id':id,'client_id':App.api.client_id,'per_page':12},before,600000);
			check.success(function(data){
				$('#author-comments').html('');
				if(data.meta.code==200){
					$.each(data.data.data,function(){
						var Book = this.Book;
						var Statistic = this.Statistic;
						if(Book.extension=="mp4"){
				          var error = 'VidError(this)'
				        }else if(Book.extension=="mp3"){
				          var error = 'AudError(this)'
				        }else{
				          var error = 'CovError(this)'
				        }
					    books_text += '<div class="b-white">\
				          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow img_cover" src="'+Book.cover+'"></div>';
				        books_text+='</div>'
				  	});
					$('#author-comments').html(books_text)
				}else{
				  book=data.meta.error_message;
				  $('#author-comments').html(book);
				}
				if(data.data){
				  if(data.data.total_result==0){
				    book=data.meta.error_message;
				    $('#author-comments').html('<center class="grey">Data not found</center>');
				  }
				}
			});
			check.error(function(data){
				$('#author-comments').html('');
			})
		}
	}
})
function send_gift_poin(point){
  // var a = point.toString();
  // var poin = a.slice(0, -3);
  $('#btn-gift').click();
  setTimeout(function(){
    $('#desc').html(rec_user_name[0]);
    $('#conf_gift').attr('onclick','send_gift('+rec_user[0]+','+point+')')
    $('#point_spent').html(point);
  },100)
}

function send_gift(id,point){
  var token= window.localStorage.getItem('token');
  var data = {'access_token':token,'client_secret':App.api.client_secret,'client_id':App.api.client_id,'balance':point,'user_id':id};
  var before = $('#conf_gift').html('').attr('disabled','disabled').addClass('fa moco-load fa-large')
  var post = majax_secure('gift',data,'');
  post.success(function(data){
      if(data.meta.code == 200){
        console.log(data);
        App.Success_Alert ="Success"
		App.Success_Content = data.meta.confirm;
		$('#success').click();
        //profile();
      }
      else{
        App.Success_Alert ="Oops"
		App.Success_Content = data.meta.error_message;
		$('#failed').click();
      }
  });
}

function detail_chat1(a,b,c,d){
	location.href="#/chat"
	setTimeout(function(){
		detail_chat(a,b,c,d);
	},500)
}
