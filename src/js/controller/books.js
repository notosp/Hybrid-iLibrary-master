var ads_data=[];
var ads_reader=[];
App.MainBookController = Ember.ArrayController.extend({
	init:function(){

	},
	actions:{
		book:function(id){
			books_id=id;
			$('.b_det_download').addClass('hide');
 			$('#get_books').removeAttr('disabled');
			$('#review').css('top','155px');
			// local = ReadData('_book'+id)
			$('#don_books').removeAttr('disabled');
			var token = localStorage.getItem('token')
			var controller = App.MainBookController.create();
			var check = new majax_fast('books/detail',{'client_id':App.api.client_id,'book_id':id,'access_token':token},'');
			check.error(function(data) {
				$('.basic').attr('data-average',Statistic.rating)
				setTimeout(function(){
					$('.basic').jRating({
						length : 5,
						decimalLength : 0,
						onClick : function(element,rate) {
				 			make_rate(rate,Book.id);
						}
					});
				})
			}),
			check.success(function(data) {
				if(data.meta.code==200){
					// WriteData('_book'+id, data);
					controller.send('parse_book',data,id)
					// if(local){
					// 	controller.send('parse_book',local,id)
					// }else{
					// 	controller.send('parse_book',data,id)
					// }
				}else{
					alert(data.meta.error_message);
					history.go(-1);
				}
			})
		},
		parse_book:function(data,id){
			var local_profile = ReadData('profile');
			$('#read_more').hide();
		    if(local_profile!=null){
		        main_parse_profile(local_profile)
		    }
			var back = window.location.href;
				window.localStorage.setItem('back',back);
			var Authors = data.data.Authors;
			var Book = data.data.Book;
			var Category = data.data.Category;
			var Libraries = data.data.Library;
			var Publisher = data.data.Publisher;
			var RentPricing = data.data.RentPricing;
			var Statistic = data.data.Statistic;
			var Item =data.data.Item;
			var Promotion = data.data.Promotions;
			var Sponsors = data.data.Sponsors;
			var Donators =  data.data.Donators;

			if(Book.description==""){
				$('#review').css('top','78px');
			}

			ga_pages('/book/'+Book.title,Book.title)
			ga_action('Book','Choose Book',Book.title)
			document.title=Book.title;

			window.localStorage.setItem('link_profile',Book.url_profile)

			$('#btn-review').attr('onclick','review(\'Review\',\'Book\',\''+Book.id+'\')')
			if(Book.is_free == 1){
				$('#cov_badge').prepend('<span style="position:absolute;"><img src="img/icon/free.png"></span>');
		    }else{
		        
		    }
		    
			$('#book_cov').attr('src',Book.cover);
			// $('.author').html(Book.authors);
			if(Book.extension=="mp4"){
 	        	$('#book_cov').attr('onerror','VidError(this)')
 	        	var ActBookBorrow = 'Pinjam'
 	        }else if(Book.extension=="mp3"){
 	        	$('#book_cov').attr('onerror','AudError(this)')
 	        	var ActBookBorrow = 'Pinjam'
 	        }else{
 	        	$('#book_cov').attr('onerror','CovError(this)')
 	        	var ActBookBorrow = 'Pinjam Buku'
 	        }
 	        $('#get_books').css('background-color','#4D4B8C').html('<span class="moco-book_arrow" style="position:relative;top:1px;font-size:11px;"></span> '+ActBookBorrow+'</button>')
			

          	$("#title_").html(Book.title)
          	$("#isbn").html(Book.isbn)
          	var a1 = Book.published_date.split('-')
          	$("#tahun").html(a1[0])
          	$('#size').html(Book.size);
          	$('#copy').html(kilo(Book.available_copy)+' COPY');

          	$('#genre_buku').html(Category.name);
			$('#publisher').html(Book.publisher_name);
			$('#penerbit').html(Book.publisher_name);
			$('.basic').attr('data-average',Statistic.rating)
			$('#rate').html(Statistic.rating)
			$('#tot_review').html('('+Statistic.total_reviews+')')
			$('#add_want').attr('onclick','add_want('+id+')')
			$('#don_books').attr('onclick','don_p_book('+id+')')
			$('.caption').attr('id','download_'+id);
			var list_author='';
	        // list_author +='<span class="black">by </span>';
	        if(Authors.length==0){
	        	if(Book.authors==""){
	        		list_author+='<span class="">Anonym</span>';
	        	}else{
		          list_author+='<span class="">'+Book.authors+'</span>';
	        	}
	          $('.author').html(list_author);
	          $('#pengarang').html(list_author)
	        }else{
	        	n = data.data.Authors.length
	          	$.each(data.data.Authors,function(index){
		            var Author = this;

		            //console.log(n)
		            //console.log(index)
		            if(n==1){
		            	list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+'</a></span>';
		            }else if(n==2){
		            	if(index==0){
		            		list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+' and </a></span>';
		            	}else{
		            		list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+'</a></span>';
		            	}
		            }else{
		            	if(index==(n-2)){
		            		list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+' and </a></span>';
		            	}else if(index==(n-1)){
		            		list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+'</a></span>';
		            	}else{
		            		list_author+='<span><a style="color:#4D4B8C" href="#/main/author/'+Author.id+'">'+Author.name+', </a></span>';
		            	}
		            }
	        	});
	            $('.author').html(list_author);
	            $('#pengarang').html(list_author)
	        }
	        //console.log(list_author)
			setTimeout(function(){
				$('.basic').jRating({
					length : 5,
					decimalLength : 0,
					onClick : function(element,rate) {
			 			make_rate(rate,Book.id);
					}
				});
			})
			if(Donators){
				if(Donators[0]){
					var word='';
					$('#badge_donasi').show();
					$('#user_donatur').show();
					if(Donators.length >= 2){
						$('#more_donatur').show();
					}else{
						$('#more_donatur').hide();
					}
					// console.log(Donators)
					$.each(Donators,function(i){
						if(i<=2){
							var User = this;
							if(User.status_follow=="false"){
								var act = '<button class="radius b-trans b_grey grey" id="btn-follow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;margin-top:5px;"><i id="icn-follow'+User.id+'" class="fa  moco-x7 moco-plus f14"></i></button>'
							}else{
								var act = '<button class="radius b-blue b_blue" id="btn-unfollow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;margin-top:5px;"><i id="icn-follow'+User.id+'" class="fa moco-x7 moco-check white f14"></i></button>'
							}
							word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #ddd;padding-top:10px;padding-bottom:5px;padding-left:5px;background:#fafafa">\
					        <div class="col-md-2 col-xs-2" style="padding:0;width:35px;">\
					          <a href="#/main/user/'+User.id+'"><img class="avaMiddleCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a>\
					        </div>\
					        <div class="col-md-7 col-xs-7" style="line-height:1.2;padding:0;padding-left:8px;text-align:left;font-size:12px;">\
					          <div class="blue">'+User.name+'</div>\
					          <div class="black f11">'+User.total_copy+' Copy</div>\
					        </div>\
							<div class="col-md-3 col-xs-3" style="width:30px;">'+act+'</div></div>'
						}else{

						}
					})
					$('#list_user_donasi').html(word);
				}else{
					$('#badge_donasi').hide();
					$('#user_donatur').hide();
					$('#more_donatur').hide();
				}
			}else{
				$('#badge_donasi').hide();
				$('#user_donatur').hide();
				$('#more_donatur').hide();
			}
			var books_buy = Book.price/1000;

	        //console.log(books_buy)
			if(RentPricing){
	          // console.log(RentPricing)
	          var books_rent_nom = RentPricing.price/1000;
	          // var books_borrow = RentPricing.price/1000;
	          var books_day = RentPricing.qty_days;
	          var price_id = RentPricing.id;
	        }else{
	          var books_rent_nom = undefined;
	          // var books_borrow = 0;
	          var books_day = 30;
	          var price_id = 0;
	        }
	        if(Promotion){
		        if(Promotion){
			        // console.log(Promotion)
			        $.each(Promotion,function(){
			          // console.log(this)
			          if(this.promotion_type=="DETAIL_BOOK_POPUP"){
			            console.log("DETAIL_BOOK_POPUP")
			            // if(this.value){
			            //     Moco.content=this.value; 
			            //     // Moco.expired=dateFormat(promo.end,'dd mmm yyyy');
			            //     $('#_diskon').click();
			            //     setTimeout(function(){
			            //       if(this.background=="yellow"){
			            //         $('#diskon_back').css('background-color','#ffcd44')
			            //       }else if(this.background=="green"){
			            //         $('#diskon_back').css('background-color','#1ebe8e')
			            //       }else if(this.background=="blue"){
			            //         $('#diskon_back').css('background-color','#4D4B8C')
			            //       }else{
			            //         $('#diskon_back').css('background-color','#1ebe8e')
			            //       }
			            //     },200)
			            // }
			          }
			          if(this.promotion_type=="DISCOUNT_POPUP"){
			            console.log("DISCOUNT_POPUP")
			            if(this.value){
			                App.content=this.value; 
			                // Moco.expired=dateFormat(promo.end,'dd mmm yyyy');
			                $('#_diskon').click();
			                setTimeout(function(){
			                  if(this.background=="yellow"){
			                    $('#diskon_back').css('background-color','#ffcd44')
			                  }else if(this.background=="green"){
			                    $('#diskon_back').css('background-color','#1ebe8e')
			                  }else if(this.background=="blue"){
			                    $('#diskon_back').css('background-color','#4D4B8C')
			                  }else{
			                    $('#diskon_back').css('background-color','#1ebe8e')
			                  }
			                },200)
			            }
			          }
			          if(this.promotion_type=="IN_READER"){
			            console.log("IN_READER")
			          }
			        })
			    }
			}
			if(Sponsors){
			    if(Sponsors){
		        	// console.log(Sponsors)
		          $.each(Sponsors,function(){
		            // console.log(this)
		            if(this.placement=="popup_purchase"){
		              var sponsor = this;
		              console.log(sponsor);
		              ads_data[0]=sponsor.banner;
		              var link = sponsor.url.split('http://');
		              if(link[0]==sponsor.url){
		                ads_data[1]='http://'+sponsor.url;
		              }else{
		                ads_data[1]=sponsor.url;
		              }
		            }
		            if(this.placement=="in_reader"){
		              var sponsor = this;
		              console.log(sponsor);
		              ads_reader[0]=sponsor.banner;
		              var link = sponsor.url.split('http://');
		              if(link[0]==sponsor.url){
		                ads_reader[1]='http://'+sponsor.url;
		              }else{
		                ads_reader[1]=sponsor.url;
		              }
		            }
		          });
		      	}
			}
			var token = localStorage.getItem('token')
			console.log(token)
			if(token){
		      	if(Book.has_book==true){
		      		$('#add_want').removeAttr('onclick').removeClass('b-orange').removeClass('pointer').addClass('grey');
		      		$('#add_want div').removeClass('white');
			        console.log('punya')
			        // setTimeout(function(){
			        // 	check_collection(Book.id);
			        // },1000)
			        if(reader_back==1){
			        	console.log('load back ulang')
			        	//reader_back=0
			        	$('#get_books').html('Loading ... ')
			        	setTimeout(function(){
			        		check_collection(id)
			        	},5000)
			        }else{
			        	console.log('check buku')
			        	// check_collection(Book.id);
			        	var act = 'download_book(\''+Book.id+'\',\''+Item.out+'\',\''+Item.pass+'\',\''+Item.session+'\',\''+Book.extension+'\',\''+Book.cover+'\',\''+Book.url_profile+'\',\''+Item.security_version+'\')';
			        	$('#get_books').html('Read').attr('onclick',act)
			        	// books_out(Book.id,Book.cover,Item.pass,Book.extension,Item.out,Item.session,undefined,Book.url_profile,Item.security_version)
			        }
			        if(Book.is_free==1){
			        	$('.point').css('visibility','hidden');
			        }
			    }else{
			    	// console.log('belum punya')
			    	if(Book.is_free==1){
			    		$('#don_books').attr('disabled','disabled');
						$('.point').css('visibility','hidden');
						if(ads_data[0]){
							$('#get_books').attr('onclick','download_free(\''+Book.id+'\',1)')
						}else{
							$('#get_books').attr('onclick','download_free(\''+Book.id+'\')')
						}
						//download_free(id,data)
					}else{
						// $('#point').html(books_buy)
				    	// $('#get_books').attr('onclick','get_books(\''+books_buy+'\',\''+books_rent_nom+'\',\''+books_day+'\',\''+price_id+'\')')
					 //    if(Libraries){
						// 	if(Libraries.length==0){
						// 		status_pustaka=0;
						// 	}else{
						// 		status_pustaka=1;
						// 		borrow_pustaka="";
						// 		$.each(Libraries,function(){
						// 		  var Library = this.Library;
						// 		  var Config = this.Config;
						// 		  //console.log(Library)
						// 		  // console.log(Config)
						// 		  	if(Library!=undefined){
						// 			    if(Library.is_member==false){
						// 			      state="none";
						// 			      link="#/main/epustaka/"+Library.id;
						// 			      if(Config){
						// 			        action="click_pustaka("+Config['Library.MembershipCharge']/1000+","+Library.id+",'"+Library.name+"')";
						// 			      }else{
						// 			        action="click_pustaka('0',"+Library.id+",'"+Library.name+"')";
						// 			      }
						// 			    }else{
						// 			      state="block";
						// 			      link="";
						// 			      action="borrow_books('"+Library.id+"','"+Library.name+"')";
						// 			    }

						// 			    borrow_pustaka+='<div class="media col-md-12" onclick="'+action+'" style="padding-left:0px;cursor:pointer;padding-right:0;padding-top:20px;margin-top:0">\
						// 			      <div class="col-xs-2 col-md-2" style="margin-top:0px;padding:5px;border:1px solid #ddd;border-radius:5px;width:50px;height:50px;">\
						// 			        <img class="media-object" src="'+Library.logo+'" onerror="CovError(this)" style="width:40px;height:40px;">\
						// 			      </div>\
						// 			      <div class="media-body col-xs-7 col-md-7" style="margin-left:5px;margin-top:5px;">\
						// 			        <div class="black" style="font-size:14px">'+limitCharacter(Library.name,20)+'</div>\
						// 			        <div class="grey" style="font-size:12px;display:'+state+'">Available '+Library.available_book+' Books</div>\
						// 			      </div>\
						// 			      <div class="col-xs-1 col-md-1" style="margin-top:10px;margin-left:25px">\
						// 			      <button id="btn_" onclick="" class="btn btn-default" style="border-color: #c92036;background-color:transparent;padding:1px 14px;display:'+state+'">\
						// 			        <span id="text_'+Library.id+'" class="moco-check" style="color: #c92036;font-size:9px;"><span></button>\
						// 			      </div>\
						// 			      <!--<div class="col-xs-1 col-md-1"style="top:20px"><a href="'+link+'" onclick="'+action+'"><span class="fa fa-chevron-right grey"><span></a></div>-->\
						// 			      <div class="divider" style="padding-top:70px;border-color:#fafafa"></div>\
						// 			      </div>';
						// 		  	}else{
							    
						// 	  		}
						// 		});
						// 	}
						// }
					}


					//ijakrta
					if(Libraries.length==0){
						status_pustaka=0;
						if(Book.available_copy==0){
							$('#get_books').attr('onclick',"alert('Tidak ada ePustaka yang menyediakan Buku ini')").html('Antri');
						}else{
							$('#get_books').attr('onclick',"alert('Copy buku tidak tersedia')");
						}
					}else if(Libraries.length==1){
						if(Book.available_copy==0){
							action="subscribe_books('"+Libraries[0].Library.id+"','"+Libraries[0].Library.name.replace(/\'/g," ")+"')";
							$('#get_books').html('Antri').attr('onclick',action);
						}else{
							if(Libraries[0].Library.is_member==false){
								action="join_(undefined,"+Libraries[0].Library.id+",'"+Libraries[0].Library.name.replace(/\'/g," ")+"',"+Libraries[0].Config['Library.MembershipCharge']/1000+",'"+Book.id+"')"
							}else{
								action="borrow_books('"+Libraries[0].Library.id+"','"+Libraries[0].Library.name.replace(/\'/g," ")+"')";
							}
							$('#get_books').attr('onclick',action);
						}
					}else{
						console.log('multi lib')
						status_pustaka=1;
						borrow_pustaka="";
						$.each(Libraries,function(){
							var Library = this.Library;
							var Config = this.Config;
							if(Library!=undefined){
								state="none";
								link="";
								if(Book.available_copy==0){
									action="subscribe_books('"+Library.id+"','"+Library.name.replace(/\'/g," ")+"')";
								}else{
								    if(Library.is_member==false){
								      state="none";
								      link="";
								      // link="#/main/epustaka/"+Library.id;
								      // if(Config){
								      //   action="click_pustaka("+Config['Library.MembershipCharge']/1000+","+Library.id+",'"+Library.name+"')";
								      // }else{
								      //   action="click_pustaka('0',"+Library.id+",'"+Library.name+"')";
								      // }
								      action="join_(undefined,"+Library.id+",'"+Library.name.replace(/\'/g," ")+"',"+Config['Library.MembershipCharge']/1000+",'"+Book.id+"')"
								    }else{
								      state="block";
								      link="";
								      action="borrow_books('"+Library.id+"','"+Library.name.replace(/\'/g," ")+"')";
								    }
								}

							    borrow_pustaka+='<div class="media col-md-12" onclick="'+action+'" style="padding-left:0px;cursor:pointer;padding-right:0;padding-top:20px;margin-top:0">\
							      <div class="col-xs-2 col-md-2" style="margin-top:0px;padding:5px;border:1px solid #ddd;border-radius:5px;width:50px;height:50px;">\
							        <img class="media-object" src="'+Library.logo+'" onerror="CovError(this)" style="width:40px;height:40px;">\
							      </div>\
							      <div class="media-body col-xs-7 col-md-7" style="margin-left:5px;margin-top:5px;">\
							        <div class="black" style="font-size:14px">'+limitCharacter(Library.name,20)+'</div>\
							        <div class="grey" style="font-size:12px;display:'+state+'">Available '+Library.available_copy+' Books</div>\
							      </div>\
							      <div class="col-xs-1 col-md-1" style="margin-top:10px;margin-left:25px">\
							      <button id="btn_" onclick="" class="btn btn-default" style="border-color: #4D4B8C;background-color:transparent;padding:1px 14px;display:'+state+'">\
							        <span id="text_'+Library.id+'" class="moco-check" style="color: #4D4B8C;font-size:9px;"><span></button>\
							      </div>\
							      <!--<div class="col-xs-1 col-md-1"style="top:20px"><a href="'+link+'" onclick="'+action+'"><span class="fa fa-chevron-right grey"><span></a></div>-->\
							      <div class="divider" style="padding-top:70px;border-color:#fafafa"></div>\
							      </div>';
						  	}else{
					    
					  		}
					  	});
						$('#get_books').attr('onclick',"javascript:$('#btn-borrow').click()");
				  	}
				}
			}else{
				$('#get_books').attr('onclick',"location.href='#/login'");
			}

			if(Book.price=="0"){
		    	$('#don_books').attr('disabled','disabled');
			}

			$('#point').html(kilo(Book.available_copy))
			$('#title_').html(limitCharacter(Book.title,65))

			$('#want').html(Statistic.total_wishlists)
			$('#queue').html(Statistic.total_queues)
			
			// $('#reads').html(Statistic.total_reading)
			$('#reads').html(Statistic.total_has_borrow)
			$('#synopsis').html(limitCharacter(strip(Book.description),130,true));
			App.book_id = Book.id
			App.book_synopsis = Book.description;
			App.book_title = Book.title
			App.book_cover = Book.cover;
			App.book_authors = Book.authors;
			App.book_url_profile = Book.url_profile;
			$('#read_more').attr('onclick','javascript:$(\'#det-synopsis\').click()')
			$('#reads').attr('onclick','book_borrow(\''+Book.id+'\')');
			$('#queue').attr('onclick','book_want(\''+Book.id+'\')');
			$('#user_donatur').attr('onclick','book_donatur(\''+Book.id+'\')');
			// user_donatur
			// $('#want').attr('onclick','book_want(\''+Book.id+'\')');
			$('#facebook1').attr('onclick','javascript:gui.Shell.openExternal("http://www.facebook.com/dialog/feed?app_id='+App.fb_id+'&link='+Book.url_profile+'&picture='+Book.cover+'&redirect_uri=https%3A%2F%2Fwww.facebook.com&display=touch&refid=0");ga_book(1)');
			$('#twitter1').attr('onclick','javascript:gui.Shell.openExternal("http://twitter.com/share?text=Reading '+limitCharacter(Book.title,20)+' via iNgawi desktop&url='+Book.url_profile+'");ga_book(2)');
			$('#google1').attr('onclick','javascript:gui.Shell.openExternal("https://plus.google.com/share?url='+Book.url_profile+'");ga_book(3)');
			$('#email1').attr('onclick','javascript:gui.Shell.openExternal("mailto:?Subject=Recommended to Read Book &Body='+Book.title+'%20%0A'+Publisher.name+'%20%0A'+Book.url_profile+' %20%0A via iNgawi desktop");ga_book(4)');
			$('#linkedin1').attr('onclick','javascript:gui.Shell.openExternal("http://www.linkedin.com/shareArticle?mini=true&url='+Book.url_profile+'");ga_book(5)');
		},
		review:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#review').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			try{
				var check = new majax_fast('reviews/index',{'access_token':token,'key':id,'type':'Book','per_page':20},before);
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#review').attr('data-index',3);
						if(data.data.total_result<20){
							$('#btn-loadmore_review').hide()
						}
						// console.log(data)
						$('#review').html('');
						var controller = App.MainBookController.create();
						controller.send('parse_review',data)
						if(token){
							$('#btn-review').attr('onclick','review(\'Review\',\'Book\',\''+id+'\')');
						}else{
							$('#btn-review').attr('onclick',"location.href='#/login'");
						}
					}else{
						$('#review').html('')
						$('#btn-loadmore_review').hide()
		    			word = '<center id="empty" style="margin-top: 50px;">\
		                  <div class="fe_blank_chat" style="height:150px;"></div>\
		                  <div class="grey f14" style="">Belum ada ulasan</div>\
		                </center>'

						$('#review').html(word);
					}
				})
			}catch(error){
				$('#btn-loadmore_review').hide()
				console.log(error.message)
			}
		},
		parse_review:function(data,index){
			var word ="";
			$.each(data.data.data,function(){
				var Comments = this.Comments;
				var Like = this.Like;
				var Review = this.Review;
				var User = this.User;
				var nama = "iNgawi User"
				try{
					var name = User.name.split(' ');
					//console.log(name)
					//console.log(name.length)
					if(name.length>3){
						nama = name[0]+' '+name[1]+' '+name[2]
					}else{
						nama = User.name
					}
				}catch(error){
					console.log(error.message)
					nama = User.name
				}
				word+='<div class="review" id="review'+Review.id+'">\
					<div class="head">\
						<span><a href="#/main/user/'+User.id+'"><img class="avaMiniCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a></span>\
						<span class="blue up">'+limitCharacter(nama,20)+'</span>\
						<span class="f10 b up">'+timeago(Review.elapsed_time)+'</span>\
					</div>\
					<div class="content m-right">\
						<span>'+Review.content+'</span>\
					</div>\
					<div class="tail">'
					//console.log(Like.has_like)
					if(Like.has_like==1){
						word+='<span class="pointer" id="actLikeReview-'+Review.id+'" onclick="like_(\''+Review.id+'\',\'0\',\''+Review.id+'\',\'Review\')"><i class="moco-like blue" id="LikeReview-'+Review.id+'"></i> <span id="TotalLikeReview-'+Review.id+'">'+Like.total_likes+'</span> .</span>'
					}else{
						word+='<span class="pointer" id="actLikeReview-'+Review.id+'" onclick="like_(\''+Review.id+'\',\'1\',\''+Review.id+'\',\'Review\')"><i class="moco-like grey" id="LikeReview-'+Review.id+'"></i> <span id="TotalLikeReview-'+Review.id+'">'+Like.total_likes+'</span> .</span>'
					}
					word+='<span class="pointer" onclick="change_review('+Review.id+')"> Komentar</span>'
					if(Like.has_report==1){	
						word+='<span class="pointer" id="actDislikeReview-'+Review.id+'" onclick="like_(\''+Review.id+'\',\'0\',\''+Review.id+'\',\'Review\')" style="float:right;margin-right:12px;"><i id="DislikeReview-'+Review.id+'" class="moco-flag"></i> Laporkan</span>'
					}else{
						word+='<span class="pointer" id="actDislikeReview-'+Review.id+'" onclick="like_(\''+Review.id+'\',\'-1\',\''+Review.id+'\',\'Review\')" style="float:right;margin-right:12px;"><i id="DislikeReview-'+Review.id+'"class="moco-flag grey"></i> Laporkan</span>'
					}
					word+='</div>\
				</div>'
				if(Comments.length>0){
					$.each(Comments,function(){
						var Comment = this.Comment;
						var Like = this.Like;
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
						word+='<div class="comment" id="comment'+Comment.id+'" style="width:205px;">\
						<div class="head">\
							<span><a href="#/main/user/'+User.id+'"><img class="avaMiniCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a></span>\
							<span class="blue up">'+nama+'</span>\
							<span class="f10 b up">'+timeago(Comment.elapsed_time)+'</span>\
						</div>\
						<div class="content m-left">\
							<span>'+Comment.comment+'</span>\
						</div>\
						<div class="tail">'
						if(Like.has_like==1){
							word+='<span class="pointer" id="actLikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'0\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like blue"  id="LikeComment-'+Comment.id+'"></i> <span id="TotalLikeComment-'+Comment.id+'">'+Like.total_likes+'</span> menyukai. </span>'
						}else{
							word+='<span class="pointer" id="actLikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like grey" id="LikeComment-'+Comment.id+'"></i> <span id="TotalLikeComment-'+Comment.id+'">'+Like.total_likes+'</span> menyukai. </span>'
						}
							// <span class="pointer" onclick="like_(\''+Comment.id+'\',\'1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-like blue"></i> <span id="LikeComment-'+Comment.id+'">'+Like.total_likes+'</span> .</span>\
						if(Like.has_report==1){
							word+='<span class="pointer" id="actDislikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'0\',\''+Comment.id+'\',\'Comment\')"><i class="moco-flag" id="DislikeComment-'+Comment.id+'"></i> Laporkan</span>'
						}else{
							word+='<span class="pointer" id="actDislikeComment-'+Comment.id+'" onclick="like_(\''+Comment.id+'\',\'-1\',\''+Comment.id+'\',\'Comment\')"><i class="moco-flag grey" id="DislikeComment-'+Comment.id+'"></i> Laporkan</span>'
						}
						word+='</div>\
					</div>'
					})
				}
				word+='<div class="divider"></div>'
			})
			if(index){
				$('#list_review').append(word);
				$('#review').append(word);
			}else{
				$('#list_review').html(word);
				$('#review').html(word);
			}
		},
		morereview:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var index = $('#review').attr('data-index');
			var before = $('#icn-loadmore_review').addClass('fa moco-load fa-spin');
			var book_id = App.book_id
			console.log(book_id+' '+index)
			try{
				if(id){
					var check = new majax_fast('reviews/index',{'access_token':token,'key':id,'type':'Book','per_page':10,'page':index},before);
				}else{
					var check = new majax_fast('reviews/index',{'access_token':token,'key':book_id,'type':'Book','per_page':10,'page':index},before);
				}
				// var check = new majax_fast('reviews/index',{'access_token':token,'key':book_id,'type':'Book','per_page':10,'page':index},before);
				check.error(function(data) {
				})
				check.success(function(data) {
					$('#icn-loadmore_review').removeClass('fa moco-load fa-spin');
					if(data.meta.code==200){
						$('#review').attr('data-index',parseInt(index)+1);
						// console.log(data)
						if(data.data.total_result<10){
							$('#btn-loadmore_review').hide()
						}
						//$('#review').html('');
						var controller = App.MainBookController.create();
						controller.send('parse_review',data,1)
						//$('#btn-review').attr('onclick','review(\'Review\',\'Book\',\''+id+'\')');
					}else{
						$('#btn-loadmore_review').hide()
					}
				})
			}catch(error){
				$('#icn-loadmore_review').removeClass('fa moco-load fa-spin');
				console.log(error.message)
			}
		},
		suggested:function(id){
			var word='';
			var token = localStorage.getItem('token')
			var check = new majax_fast('books/recommended',{'client_id':App.api.client_id,'book_id':id,'access_token':token,'limit':20},'');
			check.error(function(data) {

			}),
			check.success(function(data) {
				if(data.meta.code==200){
					var Book = data.data.Book;
					$.each(Book,function(index,book){
					if(book.extension=="mp4"){
 				          var error = 'VidError(this)'
 				        }else if(book.extension=="mp3"){
 				          var error = 'AudError(this)'
 				        }else{
 				          var error = 'CovError(this)'
 				        }
 						word +='<div class="col-lg-3 col-md-4 col-xs-6 pad5"><img src="'+book.cover+'" class="shadow1 pointer" onerror="'+error+'" style="width:100%;max-width:120px;max-height:149px;" onclick="location.href=\'#/main/book/'+book.id+'\'"></div>'
					})
					$('#suggested').html(word)
				}
			})
		},
		want:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			$('#follow_title').html('Orang yang mengantri buku')
			try{
				var check = new majax_fast('queues/user_want_this',{'client_id':App.api.client_id,'type':'Book','key':id,'per_page':20,"access_token":token},before);
  				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',3);
						$('#list_user').html('');
						if(data.data.total_result>20){
							$('#btn-loadmore_follow').attr('onclick','more_userbook(\'want\',\''+id+'\')');
						}else{
							$('#btn-loadmore_follow').hide();
						}
						var controller = App.MainBookController.create();
						controller.send('parse_want',data)
					}else{
						word = '<center style="">'+data.meta.error_message+'</center>'
						$('#list_user').html(word);
						$('#btn-loadmore_follow').hide()
					}
				})
			}catch(error){
				console.log(error.message)
			}
		},
		more_want:function(){
			var word = '';
			var index = $('#list_user').attr('data-index')
			var token = localStorage.getItem('token')
			var before="";
			try{
				var check = new majax_fast('queues/user_want_this',{'client_id':App.api.client_id,'book_id':id,'per_page':10,"access_token":token,'page':index},before);
  				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',parseInt(index)+1);
						var controller = App.MainBookController.create();
						controller.send('parse_want',data,1)
					}else{
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_follow').hide();
			}
		},
		want1:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			$('#follow_title').html('Daftar wantlist peminjaman buku')
			try{
				var check = new majax_fast('books/want',{'client_id':App.api.client_id,'book_id':id,'per_page':20,"access_token":token},before);
  				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',3);
						$('#list_user').html('');
						if(data.data.total_result>20){
							$('#btn-loadmore_follow').attr('onclick','more_userbook(\'want\',\''+id+'\')');
						}else{
							$('#btn-loadmore_follow').hide();
						}
						var controller = App.MainBookController.create();
						controller.send('parse',data)
					}else{
						word = '<center style="">'+data.meta.error_message+'</center>'
						$('#list_user').html(word);
						$('#btn-loadmore_follow').hide()
					}
				})
			}catch(error){
				console.log(error.message)
			}
		},
		more_want1:function(){
			var word = '';
			var index = $('#list_user').attr('data-index')
			var token = localStorage.getItem('token')
			var before="";
			try{
				var check = new majax_fast('books/want',{'client_id':App.api.client_id,'book_id':id,'per_page':10,"access_token":token,'page':index},before);
  				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',parseInt(index)+1);
						var controller = App.MainBookController.create();
						controller.send('parse',data,1)
					}else{
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_follow').hide();
			}
		},
		reads:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			$('#follow_title').html('Daftar peminjam buku')
			try{
				var check = new majax_fast('books/reading',{'client_id':App.api.client_id,'book_id':id,'per_page':20,'access_token':token},before);
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',3);
						$('#list_user').html('');
						if(data.data.total_result>20){
							$("#btn-loadmore_follow").attr("onclick",'more_userbook(\'read\',\''+id+'\')') 
						}else{
							$('#btn-loadmore_follow').hide();
						}
						var controller = App.MainBookController.create();
						controller.send('parse',data)

					}else{
						word = '<center style="">'+data.meta.error_message+'</center>'
						$('#list_user').html(word);
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
			}
		},
		more_read:function(id){
			var word = '';
			var index = $('#list_user').attr('data-index')
			var token = localStorage.getItem('token')
			var before = ""
			try{
				console.log(index)
				var check = new majax_fast('books/reading',{'client_id':App.api.client_id,'book_id':id,'per_page':10,'access_token':token,'page':index},before);
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',parseInt(index)+1);
						var controller = App.MainBookController.create();
						controller.send('parse',data,1)

					}else{
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_follow').hide();
			}
		},
		borrow:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			$('#follow_title').html('Orang yang pinjam buku')
			try{
				var check = new majax_fast('books/has_borrow',{'client_id':App.api.client_id,'book_id':id,'per_page':20,'access_token':token},before);
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',3);
						$('#list_user').html('');
						if(data.data.total_result>20){
							$("#btn-loadmore_follow").attr("onclick",'more_userbook(\'borrow\',\''+id+'\')') 
						}else{
							$('#btn-loadmore_follow').hide();
						}
						var controller = App.MainBookController.create();
						controller.send('parse',data)

					}else{
						word = '<center style="">'+data.meta.error_message+'</center>'
						$('#list_user').html(word);
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
			}
		},
		more_borrow:function(id){
			var word = '';
			var index = $('#list_user').attr('data-index')
			var token = localStorage.getItem('token')
			var before = ""
			try{
				console.log(index)
				var check = new majax_fast('books/has_borrow',{'client_id':App.api.client_id,'book_id':id,'per_page':10,'access_token':token,'page':index},before);
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',parseInt(index)+1);
						var controller = App.MainBookController.create();
						controller.send('parse',data,1)

					}else{
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_follow').hide();
			}
		},
		add_want:function(id){
		    var total = $('#want-'+id).html()
		    var aa = parseInt($('#queue').html())
		    var token = window.localStorage.getItem('token');
		    if(token){
			    var rate = new majax_secure("queues/add",{'access_token':token,'book_id':id},'');
			    rate.success(function(data){
			        if(data.meta.code==200){
			        	try{
			        		$('#want-'+id).html(' '+parseInt(parseInt(total)+1))
			        	}catch(error){
			        		console.log(error.message)
			        	}
			            App.Success_Alert ="Success"
			            App.Success_Content = data.data;
			            $('#success').click();
			            var a = parseInt($('#want').html())+1
			            $('#want').html(a);
			            try{
					    	var a = aa+1
						    $('#queue').html(a)
					    }catch(e){
					    	console.log(e.message)
					    }
			        }else{
			        	App.Failed_Alert ="Failed"
			            App.Failed_Content = data.meta.error_message;
			            $('#failed').click();
			        }
			    });
			    rate.error(function(data){
			    	
			    })
			}else{
				location.href="#/login"
			}
		},
		add_want1:function(id){
		    var total = $('#want-'+id).html()
		    var token = window.localStorage.getItem('token');
		    if(token){
			    var rate = new majax_secure("wishlists/add",{'access_token':token,'book_id':id},'');
			    rate.success(function(data){
			        if(data.meta.code==200){
			        	try{
			        		$('#want-'+id).html(' '+parseInt(parseInt(total)+1))
			        	}catch(error){
			        		console.log(error.message)
			        	}
			            App.Success_Alert ="Success"
			            App.Success_Content = data.data;
			            $('#success').click();
			            var a = parseInt($('#want').html())+1
			            $('#want').html(a)
			        }else{
			        	App.Failed_Alert ="Failed"
			            App.Failed_Content = data.meta.error_message;
			            $('#failed').click();
			        }
			    });
			    rate.error(function(data){
			    	
			    })
			}else{
				location.href="#/login"
			}
		},
		parse:function(data,index){
			var word ="";
			
			$.each(data.data.data,function(){
				if(this.status_follow=="false"){
					var act = '<button class="radius b-trans b_grey grey" id="btn-follow'+this.id+'" onclick="act_follow(\''+this.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+this.id+'" class="fa  moco-x7 moco-plus f14"></i></button>'
				}else{
					var act = '<button class="radius b-blue b_blue" id="btn-unfollow'+this.id+'" onclick="act_follow(\''+this.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+this.id+'" class="fa moco-x7 moco-check white f14"></i></button>'
				}
				// if(this.address){
    //                 var address = this.address
    //             }else{
    //                 var address = "Alamat Tidak Ditemukan";
    //             }
				word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #fafafa;padding-top:10px;padding-bottom:5px;">\
		        <div class="col-md-2 col-xs-2" style="padding:0;width:30px;">\
		          <a href="#/main/user/'+this.id+'"><img class="avaMiddleCircle" src="'+this.avatar+'" onerror="AvaError(this)"></a>\
		        </div>\
		        <div class="col-md-7 col-xs-7" style="line-height:1.2;margin-right:23px">\
		          <div class="blue">'+this.name+'</div>\
		          <div class="grey f12">'+this.badge_name+'</div>\
		        </div>\
				<div class="col-md-3 col-xs-3" style="padding-left:40px;">'+act+'</div></div>'
			})
			if(index){
				$('#list_user').append(word);
			}else{
				$('#list_user').html(word);
			}
		},
		parse_want:function(data,index){
			var word ="";
			$.each(data.data.data,function(){
				var User = this.User;
				var Queue = this.Queue;
				if(User.status_follow=="false"){
					var act = '<button class="radius b-trans b_grey grey" id="btn-follow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+User.id+'" class="fa  moco-x7 moco-plus f14"></i></button>'
				}else{
					var act = '<button class="radius b-blue b_blue" id="btn-unfollow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+User.id+'" class="fa moco-x7 moco-check white f14"></i></button>'
				}
				word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #fafafa;padding-top:10px;padding-bottom:5px;">\
		        <div class="col-md-2 col-xs-2" style="padding:0;width:30px;">\
		          <a href="#/main/user/'+User.id+'"><img class="avaMiddleCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a>\
		        </div>\
		        <div class="col-md-7 col-xs-7" style="line-height:1.2;margin-right:23px">\
		          <div class="blue">'+User.name+'</div>\
		          <div class="grey f12">'+User.address+'</div>\
		        </div>\
				<div class="col-md-3 col-xs-3" style="padding-left:40px;">'+act+'</div></div>'
			})
			if(index){
				$('#list_user').append(word);
			}else{
				$('#list_user').html(word);
			}
		},
		// donations/donators_list
		donasi:function(id){
			var word = '';
			var token = localStorage.getItem('token')
			var before = $('#list_user').html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>')
			$('#follow_title').html('Para Donatur').css('padding-left','35px')
			try{
				if(token){
					var check = new majax_secure_empty(App.api.v3+'donations/donators_list',{'client_id':App.api.client_id,'book_id':id,'per_page':20,"access_token":token},before);
				}else{
					var check = new majax_secure_empty(App.api.v3+'donations/donators_list',{'client_id':App.api.client_id,'book_id':id,'per_page':20},before);
				}
  				check.error(function(data) {
  					$('#shelf_read').removeAttr("disabled");
				}),
				check.success(function(data) {
					$('#shelf_read').removeAttr("disabled");
					// if(data.data.Donator[0].id){
						if(data.meta.code==200){
							$('#list_user').attr('data-index',3);
							$('#list_user').html('');
							if(data.data.total_result>20){
								$('#btn-loadmore_follow').attr('onclick','more_userbook(\'donasi\',\''+id+'\')');
							}else{
								$('#btn-loadmore_follow').hide();
							}
							var controller = App.MainBookController.create();
							controller.send('parse_donasi',data);
						}else{
							word = '<center style="">'+data.meta.error_message+'</center>'
							$('#list_user').html(word);
							$('#btn-loadmore_follow').hide();
							$('#shelf_read').click();
						}
					// }else{

					// }
				})
			}catch(error){
				console.log(error.message)
			}
		},
		more_donasi:function(){
			var word = '';
			var index = $('#list_user').attr('data-index')
			var token = localStorage.getItem('token')
			var before="";
			try{
				if(token){
					var check = new majax_secure_empty(App.api.v3+'donations/donators_list',{'client_id':App.api.client_id,'book_id':id,'per_page':20,"access_token":token},before);
				}else{
					var check = new majax_secure_empty(App.api.v3+'donations/donators_list',{'client_id':App.api.client_id,'book_id':id,'per_page':20},before);
				}
				check.error(function(data) {
				}),
				check.success(function(data) {
					if(data.meta.code==200){
						$('#list_user').attr('data-index',parseInt(index)+1);
						var controller = App.MainBookController.create();
						controller.send('parse_donasi',data,1)
					}else{
						$('#btn-loadmore_follow').hide();
					}
				})
			}catch(error){
				console.log(error.message)
				$('#btn-loadmore_follow').hide();
			}
		},
		parse_donasi:function(data,index){
			var word ="";
			console.log(data)
			$.each(data.data.Donator,function(content){
				var User = this;
				if(User.status_follow=="false"){
					var act = '<button class="radius b-trans b_grey grey" id="btn-follow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+User.id+'" class="fa  moco-x7 moco-plus f14"></i></button>'
				}else{
					var act = '<button class="radius b-blue b_blue" id="btn-unfollow'+User.id+'" onclick="act_follow(\''+User.id+'\',\'User\')" style="padding:3px 15px;border-radius:4px;"><i id="icn-follow'+User.id+'" class="fa moco-x7 moco-check white f14"></i></button>'
				}
				word+='<div class="col-md-12 col-xs-12" style="border-bottom:1px solid #fafafa;padding-top:10px;padding-bottom:5px;">\
		        <div class="col-md-2 col-xs-2" style="padding:0;width:30px;">\
		          <a href="#/main/user/'+User.id+'"><img class="avaMiddleCircle" src="'+User.avatar+'" onerror="AvaError(this)"></a>\
		        </div>\
		        <div class="col-md-7 col-xs-7" style="line-height:1.2;margin-right:23px">\
		          <div class="blue">'+User.name+'</div>\
		          <div class="black f11">'+User.total_copy+' Copy</div>\
		        </div>\
				<div class="col-md-3 col-xs-3" style="padding-left:40px;">'+act+'</div></div>'
			})
			if(index){
				$('#list_user').append(word);
			}else{
				$('#list_user').html(word);
			}
		}
	}
})

function more_userbook(type,id){
	var controller = App.MainBookController.create()
	if(type=="want"){
		controller.send('more_want',id)
	}else if(type=="borrow"){
		controller.send('more_borrow',id)
	}else if(type=="donasi"){
		controller.send('more_donasi',id)
	}else{
		controller.send('more_read',id)
	}
}

function morereview(){
	var controller = App.MainBookController.create();
	controller.send('morereview')
}

function rent(nom,id,day,buy){
	$('#btn-confirm').click();
	$('#act_confirm').attr('onclick','rent_(\''+nom+'\',\''+id+'\',\''+day+'\',\''+buy+'\')');
	$('#point_confirm').html(nom);
	$('#act_close').attr('onclick','get_books(\''+buy+'\',\''+nom+'\',\''+day+'\',\''+id+'\')')
}
function rent_(nom,id,day,buy){
	$('#btn-password').click();
	$('#act_close').attr('onclick','rent(\''+nom+'\',\''+id+'\',\''+day+'\',\''+buy+'\')');
	$('#act_password').attr('onclick','rent_books(\''+nom+'\',\''+id+'\',\''+day+'\')');
}

function buy(nom,rent,day,id){
	$('#btn-confirm').click();
	$('#act_confirm').attr('onclick','buy_(\''+nom+'\',\''+rent+'\',\''+day+'\',\''+id+'\')');
	$('#act_close').attr('onclick','get_books(\''+nom+'\',\''+rent+'\',\''+day+'\',\''+id+'\')')
	$('#point_confirm').html(nom);
}
function buy_(nom,rent,day,id){
	$('#btn-password').click();
	$('#act_close').attr('onclick','buy(\''+nom+'\',\''+rent+'\',\''+day+'\',\''+id+'\')');
	$('#act_password').attr('onclick','buy_books(\''+nom+'\')');
}

function rent_books(nominal,id,day){
	var token= window.localStorage.getItem('token');
	var data ={'access_token':token,'password':$('#input_password').val(),'book_id':books_id,'price_id':id};
	var before=$('#act_password').html('<center style="padding-top:20px;"><img src="css/plugin/images/bx_loader.gif"></center>');
	var post = majax_post('books/rent',data,before);
	post.success(function(data){
		if(data.meta.code == 200){
			App.Success_Alert="Payment Complete"
			App.Success_Content="Your book has been added to your collection!"
			$('#btn-success').click();
			check_collection(books_id);
		}else{
			App.Success_Alert ="Failed"
			App.Success_Content = data.meta.error_message;
			$('#failed').click();
		}
	});
}

function buy_books(){
	var token= window.localStorage.getItem('token');
	var data ={'access_token':token,'password':$('#input_password').val(),'book_id':books_id};
	//add reload
	var before=$('#transaction_confirm').html('<center style="padding-top:20px;"><img src="css/plugin/images/bx_loader.gif"></center>');
	var post = majax_post('books/buy',data,before);
	post.success(function(data){
		if(data.meta.code == 200){
			App.Success_Alert="Payment Complete"
			App.Success_Content="Your book has been added to your collection!"
			$('#btn-success').click();
			check_collection(books_id);
		}else{
			App.Success_Alert ="Failed"
			App.Success_Content = data.meta.error_message;
			$('#failed').click();
		}
	});
}

function borrow_books_c (id,name,confirm) {
	App.Success_Alert = "Konfirmasi Peminjaman"
	App.Success_Content = "Apakah kamu ingin melanjutkan peminjaman buku dari "+name
	$('#btn-conf_dialog').click();
	$('#act_cancel').attr("onclick","javascript:$('#close').click()")
	$('#text_conf span').css('margin','5% auto')
	// $('#text_alert11').html("Borrow books from "+name)
	$('#act_try').attr('onclick','borrow_books(\''+id+'\',\''+name+'\',\''+confirm+'\')')
	$('#act_try a').html('Ya');
}
function borrow_books(id,name,confirm){
	var token =window.localStorage.getItem('token');
	var data ={'access_token':token,'book_id':books_id,'library_id':id,'confirm':confirm};
	// var post = majax_post('books/borrow_book',data,'');
	var post = majax_secure('books/borrow_book',data,'');
	post.success(function(data){
	    //console.log(data);
	    $('#close').click();
	    if(data.meta.code == 200){
	    	setTimeout(function(){
		        App.Success_Alert=""
				App.Success_Content="Buku sudah ditambahkan di koleksimu"
				$('#btn-success').click();
			},500)
			var act = ""
			var Item = data.data;
			console.log(Item)
		  	try{
				var act = 'download_book(\''+App.book_id+'\',\''+Item.out+'\',\''+Item.pass+'\',\''+Item.session+'\',\''+Item.extension+'\',\''+App.book_cover+'\',\''+App.book_url_profile+'\',\''+Item.security_version+'\')';
				console.log(act)
				setTimeout(function(){
					$('#b_trans_suk').removeAttr('data-ember-action').attr('onclick','auto_read()');
				},1000)
	            setTimeout(function(){
	            	$('#get_books').html('Baca Buku').attr('onclick',act).css("background-color",'#4D4B8C');
	            },500)
		  	}catch(error){
		  		console.log(error.message)
		  	}
	    }else if(data.meta.code == 400){
			if(data.meta.error_code=="request_confirm"){
				borrow_books_c(id,name,1); 
			}else{
				var res = data.meta.error_message.slice(0, 38);
          		if (res === "Anda belum melakukan verifikasi email.") {
            		App.isPopUp = true;
          		} else {
            		App.isPopUp = false;
          		}
          		App.Failed_Alert = "Gagal";
          		App.Failed_Content = data.meta.error_message;
          		$("#failed").click();
          		if (id != undefined) {
            		if (App.Failed_Content != "Peminjaman Buku sudah melebihi kuota") {
              		//borrow_books_c(id,name,1);
            	}
          	}
        }  
   
	    }else{
	     	var res = data.meta.error_message.slice(0, 38);
          	if (res === "Anda belum melakukan verifikasi email.") {
            	App.isPopUp = true;
          	} else {
            	App.isPopUp = false;
          	}
          	App.Failed_Alert = "Gagal";
          	App.Failed_Content = data.meta.error_message;
          	$("#failed").click();
	    }
	});
	post.error(function(data){
	    dua=data;
	    App.Failed_Alert ="Failed"
	    if(data.status){
	      App.Failed_Content=data.statusText;
	    }else if(data.responseText!=""){
	      App.Failed_Content=data.responseText;
	    }else if(data.statusText!=""){
	      App.Failed_Content=data.statusText
	    }else{
	      App.Failed_Content="Network Problem"
	    }
	    // Moco.content="Network Problem";
	    $('#failed').click();
	});
}
function auto_read(){
	$('#btn-close_modal').click();
	$('#get_books').click();
}
function subscribe_books(id,name,confirm){
	var token =window.localStorage.getItem('token');
	var data ={'access_token':token,'book_id':books_id,'library_id':id};
	var post = majax_secure('queues/add',data,'');
	post.success(function(data){
	    if(data.meta.code == 200){
	    	try{
		    	var a = parseInt($('#queue').html())+1
			    $('#queue').html(a)
		    }catch(e){
		    	console.log(e.message)
			}
	        App.Success_Alert=""
			App.Success_Content=data.data;
			$('#btn-success').click();
	    }else if(data.meta.code == 400){
			App.Failed_Alert ="Gagal"
			App.Failed_Content = data.meta.error_message;
			$('#failed').click();  
	    }else{
	     	App.Failed_Alert ="Gagal"
			App.Failed_Content = data.meta.error_message;
			$('#failed').click();
	    }
	});
	post.error(function(data){
	    dua=data;
	    App.Failed_Alert ="Failed"
	    if(data.status){
	      App.Failed_Content=data.statusText;
	    }else if(data.responseText!=""){
	      App.Failed_Content=data.responseText;
	    }else if(data.statusText!=""){
	      App.Failed_Content=data.statusText
	    }else{
	      App.Failed_Content="Network Problem"
	    }
	    $('#failed').click();
	});
}
function subscribe_books1(id,name,confirm){
	var token =window.localStorage.getItem('token');
	var data ={'access_token':token,'book_id':books_id,'library_id':id};
	var post = majax_secure('books/subscribes',data,'');
	post.success(function(data){
	    if(data.meta.code == 200){
	        App.Success_Alert=""
			App.Success_Content="Berhasil subscribe buku ini"
			$('#btn-success').click();
	    }else if(data.meta.code == 400){
			App.Failed_Alert ="Gagal"
			App.Failed_Content = data.meta.error_message;
			$('#failed').click();  
	    }else{
	     	App.Failed_Alert ="Gagal"
			App.Failed_Content = data.meta.error_message;
			$('#failed').click();
	    }
	});
	post.error(function(data){
	    dua=data;
	    App.Failed_Alert ="Failed"
	    if(data.status){
	      App.Failed_Content=data.statusText;
	    }else if(data.responseText!=""){
	      App.Failed_Content=data.responseText;
	    }else if(data.statusText!=""){
	      App.Failed_Content=data.statusText
	    }else{
	      App.Failed_Content="Network Problem"
	    }
	    $('#failed').click();
	});
}

function download_free(id,data){
  //$("#btn-getbooks").html("Get Books <i class='fa moco-load fa-spin'></i>");
  if(data){
    $('#btn-ads').click();//load ads
    setTimeout(function(){
      $('#ads_img').attr('src',data[0]);
      $('#image_ads').attr('onclick',"gui.Shell.openExternal('"+data[1]+"')")
    },500)
  }
  var token= window.localStorage.getItem('token');
  var req_data = {'access_token':token,'book_id':id};
  $.ajax({
    type: 'POST',
    url: App.api.api_base+'books/download_free',
    data: req_data,
    dataType:"json",
    beforeSend:function(result){
      $("#moco-load").addClass('moco-load fa-spin')
    },
    success: function(result){
      $("#moco-load").removeClass('moco-load fa-spin')
        if(result.meta.code == 200){
          //overview(id);
          check_collection(id,data);
          // download_bebas=1;
            //alert("sukses");
            }else{
        //alert('"'+result.meta.error_message+'"');
        //overview(id);
        App.Failed_Alert ="Failed"
		App.Failed_Content = result.meta.error_message;
		$('#failed').click();
        // download_bebas=0;
      }
    },
    error:function(data){
		App.Failed_Alert ="Failed"
		App.Failed_Alert="Oops!";
        if(data.statusText!=""){
          App.Failed_Content=data.statusText;
        }else if(data.responseText!=""){
          App.Failed_Content=data.responseText;
        }else{
          App.Failed_Content="Network Problem"
        }
		//App.Failed_Content = data.meta.error_message;
		$('#failed').click();
	    $("#moco-load").removeClass('moco-load fa-spin')
    }
  });
}

function check_collection(id,action_,extract){
	_ads_=0;
	var token= window.localStorage.getItem('token');
	var req_data = {'access_token':token,'client_id':App.api.client_id};
	var action = new majax('books/has_book',{'access_token':token,'book_id':id});
	// var action = new majax_fast('books/has_book',{'access_token':token,'book_id':id,'client_id':client_id});
	action.success(function(data){
		var status=data.data.has_book;
		// var Item = data.data.Item;
		// var Book = data.data.Book;
		var Book = ""
		var Item = data.data;
		//console.log(Book)
		//console.log(data);
		console.log(status)
		if (status=='true'|| status==true){
		  	console.log(true)
		  	var act = ""
		  	try{
		  		var root = homePath+"/.iNgawi/";
				var file=Item.out.split('/');
				var source = homePath+'/.iNgawi/'+file[file.length - 1];
				var path = homePath+'/.iNgawi/files/uploads/'+Item.session+'/'+file[file.length - 1].replace('_out.zip','/');
				var link = '/.iNgawi/files/uploads/'+Item.session+'/'+file[file.length - 1].replace('_out.zip','/');
				console.log(source)
				isDirectory(path)
				isExist(source)
		  	}catch(error){
		  		console.log(error.message)
		  	}
		  	setTimeout(function(){
		        try{
		          console.log(dir_status)
		          if(dir_status==false){
		            //console.log('dir not exist')
		            //console.log(homePath+'/.iNgawi/files/uploads/'+b+'/')
		            act = 'download_book('+id+',\''+Item.out+'\',\''+Item.pass+'\',\''+Item.session+'\',\''+Book.extension+'\',\''+Book.cover+'\',\''+Book.url_profile+'\',\''+Item.security_version+'\')';
		           	$('#get_books').html('Download').attr('onclick',act)
		           	if(file_status==true){
		           		$('#get_books').html('Baca Buku').attr('onclick',act).css("background-color",'#4D4B8C');
		           	}
		          }else{
		            if(Book.extension=='pdf'){
		              act = 'read_this(\'pdf\',\''+link+'\',\''+id+'\',\''+Book.cover+'\')';
		              opacity = 'opacity:1';
		            }else{
		              act = 'read_this(\'epub\',\''+link+'\',\''+id+'\',\''+Book.cover+'\')';
		              opacity = 'opacity:1';
		            }
		            $('#get_books').html('Baca Buku').attr('onclick',act).css("background-color",'#4D4B8C');
		          }
		          console.log(act)

		        }catch(error){
		          console.log(error.message)
		        }
		        if(action_){
		        	$('#get_books').click();
		        }
		    })
		}else{
		  console.log(false)
		}
	});
}


function books_out(id,cover,pass,extension,out,session,action_,link,security){
	var root = homePath+"/.iNgawi/";
	var file=out.split('/');
	var source = homePath+'/.iNgawi/'+file[file.length - 1];
	var path = homePath+'/.iNgawi/files/uploads/'+session+'/'+file[file.length - 1].replace('_out.zip','/');
	var link = '/.iNgawi/files/uploads/'+session+'/'+file[file.length - 1].replace('_out.zip','/');
	console.log(source)
	isDirectory(path)
	isExist(source)
  	setTimeout(function(){
        try{
          console.log(dir_status)
          if(dir_status==false){
            //console.log('dir not exist')
            //console.log(homePath+'/.iNgawi/files/uploads/'+b+'/')
            act = 'download_book('+id+',\''+out+'\',\''+pass+'\',\''+session+'\',\''+extension+'\',\''+cover+'\',\''+link+'\',\''+security+'\')';
           	$('#get_books').html('Download').attr('onclick',act)
           	if(file_status==true){
           		$('#get_books').html('Baca Buku').attr('onclick',act).css("background-color",'#4D4B8C');
           	}
          }else{
            if(Book.extension=='pdf'){
              act = 'read_this(\'pdf\',\''+link+'\',\''+id+'\',\''+cover+'\')';
              opacity = 'opacity:1';
            }else{
              act = 'read_this(\'epub\',\''+link+'\',\''+id+'\',\''+cover+'\')';
              opacity = 'opacity:1';
            }
            $('#get_books').html('Baca Buku').attr('onclick',act).css("background-color",'#4D4B8C');
          }
          console.log(act)

        }catch(error){
          console.log(error.message)
        }
        if(action_){
        	$('#get_books').click();
        }
    })
}