App.AuthorController = Ember.ArrayController.extend({
	init:function(){

	},
	actions:{
		author:function(id){
			$('#btn-close').click()
			var token = localStorage.getItem('token')
			var check = new majax_fast('authors/detail',{'access_token':token,'client_id':App.api.client_id,'author_id':id},'');
			//access_token,library_id,page,per_page
			check.error(function(data) {

			}),
			check.success(function(data) {
				console.log(data)
				if(data.meta.code==200){
					console.log(data);
					var Author = data.data.authors
					var Badge = data.data.Badge
					var Statistic = data.data.UserFollowing
					var User = data.data.User
					//console.log(Author)

					$('.cover img').attr('src',Author.avatar);
					$('#author_name').html(Author.name)
					if(Author.address!=''){
						$('#author_address').html(Author.address)
					}else{
						$('#author_address').html('None')
					}
					$('#author_following').html(Statistic.total_followings)
					$('#author_followers').html(Statistic.total_followers)
					
					$('#synopsis').html(limitCharacter(Author.about,200,true));
					App.book_id = Author.id
					App.book_synopsis = Author.about;
					App.book_title = Author.name
					App.book_cover = Author.avatar;
					App.book_authors = Author.address;
					document.title=App.book_title;
					
					ga_pages('/author/'+Author.name,Author.name)
					ga_action('Author','Author Profile',Author.name)

					$('#read_more').attr('onclick','javascript:$(\'#det-synopsis\').click()')

					$('#pustaka_follow').attr('onclick','pustaka_follower('+id+')')
					var pustaka_link = Author.url_profile;
					$('#btn-review').attr('onclick','review(\'Comment\',\'Author\',\''+id+'\')');
					$('#facebook').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+pustaka_link+'&picture='+Author.avatar+'&name='+Author.name+'&description='+Statistic.total_books+' books '+Author.address+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0")');
					$('#twitter').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text='+Author.name+' on moco%20%0Avia iNgawi desktop%20%0A&url='+pustaka_link+'")');
					$('#google').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+pustaka_link+'")');
					$('#email').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Follow&Body='+Author.name+'%20%0A'+Author.address+'%20%0A'+pustaka_link+'%20%0Avia iNgawi desktop")');
					$('#linkedin').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+pustaka_link+'")');

					$('#btn-loadmore_comment').attr('onclick','morecomment(\'author\',\''+id+'\')')
					$('#btn-loadmore_col').attr('onclick','morecol(\'author\',\''+id+'\')')

					if(token){
						$('#_followers').attr('onclick','_follower(\'author\','+id+')')
						// $('#_following').attr('onclick','_following(\'author\','+id+')')
						$('#_following').attr('onclick','_following(\'user\','+id+')')

					}else{
						$('#_followers').attr('onclick',"location.href='#/login'")
						// $('#_following').attr('onclick','_following(\'author\','+id+')')
						$('#_following').attr('onclick',"location.href='#/login'")
					}
					
					var controller = App.FollowController.create();
					controller.send('check_follow','Author',id)
					var controller = App.MainEpustakaController.create();

					// $('#publisher').html(Book.publisher_name);
					// $('.basic').attr('data-average',Statistic.rating)
					// $('#rate').html(Statistic.rating)
					//$('#tot_collection').html('('+Statistic.total_books+')')
					var controller = App.AuthorController.create();
      					
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
				}
			})
		},
		review:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('comments/index',{'access_token':token,'key':id,'type':'Author','per_page':10},before);
				check.error(function(data) {
					$('#btn-loadmore_comment').hide()
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#review').attr('data-index',3);
						// console.log(data)
						$('#list_review').html('');
						console.log(data)
						if(data.data.total_result<10){
							$('#btn-loadmore_comment').hide()
						}
						var controller = App.AuthorController.create();
						controller.send('parse_review',data)
					}else{
						word = '<center id="empty">\
		                  <div class="fe_blank_chat" style="height:150px;"></div>\
		                  <div class="grey f14" style="">Belum ada ulasan</div>\
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
				word+='<div class="review" id="review'+Comments.id+'" style="padding-top:5px;">\
					<div class="">\
						<span><a href="#/main/user/'+User.id+'"><img class="avaMiniCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a></span>\
						<span class="blue up">'+User.name+'</span>\
						<span class="f10 b up">'+timeago(Comments.elapsed_time)+'</span>\
					</div>\
					<div class="content m-right" style="margin-top:0">\
						<span>'+Comments.comment+'</span>\
					</div>\
					<div class="tail" style="margin-top:4px;left:0;right:0;width:100%;padding:5px;padding-bottom:0;padding-top:0;border-color:transparent">'
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
				word+='<div class="divider" style="padding-top:0;"></div></div>'
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
				var check = new majax_fast('comments/index',{'access_token':token,'key':id,'type':'Author','per_page':5,'page':index},before);
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
						var controller = App.AuthorController.create();
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
			$('#collection').hide()
			$('#s1').removeClass('act-author');
			$('#review').show()
			$('#s2').addClass('act-author');
			// alert('Comment')
		},
		books:function(){
			$('#collection').show()
			$('#s1').addClass('act-author');
			$('#review').hide()
			$('#s2').removeClass('act-author');
			// alert('books')
		},
		collection:function(id){
			var books_text='';
			var token = localStorage.getItem('token')
			var before = $('#list_collection').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			var check = new majax('authors/books',{'author_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12},before,600000);
			check.success(function(data){
				// console.log(data)
				$('#list_collection').html('');
				if(data.meta.code==200){
					var controller = App.AuthorController.create()
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
			var check = new majax('authors/books',{'author_id':id,'client_id':App.api.client_id,'access_token':token,'per_page':12,'page':index},before,600000);
			check.success(function(data){
				// console.log(data)
				//$('#collection').html('');
				if(data.meta.code==200){
					$('#list_collection').attr('data-index',parseInt(index)+1)
					var controller = App.AuthorController.create()
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
			    books_text += '<div class="b-white">\
		          <div class="image col-lg-2 col-md-3 col-xs-4" style="margin-bottom:15px;"><img class="shadow pointer img_cover" src="'+Book.cover+'" onerror="CovError(this)" onclick="location.href=\'#/main/book/'+Book.id+'\'"></div>';
		        books_text+='</div>'
		  	});
		  	if(index){
		  		$('#list_collection').append(books_text)
		  	}else{
				$('#list_collection').html(books_text)
		  	}
		}
	}
})