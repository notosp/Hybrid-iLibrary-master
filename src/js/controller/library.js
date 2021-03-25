App.MainLibraryController = Ember.ArrayController.extend({
  init:function(){
    
  },
  actions:{
  	libraries:function(sort,type,id,name){
  		console.log(sort+' '+type+' '+id+' '+name);
		$('.main').removeClass('blur');
    	$('.side-menu').removeClass('side-open');
		$("#collection").html('')
		document.title="ePustaka";
		//location.href='#/main/store/'+sort;
		ga_pages('/epustaka','ePustaka');
		ga_action('ePustaka','Filter',sort);
		setTimeout(function(){
	        $('.cat').removeAttr('style')
	        if(id){
	        	$('#kategori').html(name.replace(/--/g,'/').replace(/-/g,' '))
	        }else if(sort){
	        	if(sort=="recommended"){
	        		$('#kategori').html("Kategori ePustaka")
	        	}else if(sort=="all"){
	        		$('#kategori').html("Kategori ePustaka")
	        	}else if(sort=="populer"){
	        		$('#kategori').html("Populer")
	        	}else{
	        		$('#kategori').html(sort)
	        	}
				// $('#kategori').html(sort)
			}else{
				// $('#kategori').html("All")
				$('#kategori').html("Kategori ePustaka")
			}
			$('#'+sort).css('color','#4D4B8C')
	    })
	    morelibraries = false;
		if(id){
			local = ReadData('_librariescategory'+id);
		}else if(sort){
			local = ReadData('_libraries'+sort);
		}else{
			local = ReadData('_libraries')
		}
		if(local!=null){
			// setTimeout(function(){
				var controller = App.MainLibraryController.create();
				controller.send('parselibraries',local,sort,0,id)
			// })
		}
		var before = $("#collection").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
		var token = localStorage.getItem('token')
		if(id){
			var check = new majax_fast('libraries/sort/category',{'access_token':token,'client_id':App.api.client_id,'per_page':10,'category_id':id},before);
		}else if(sort){
			var check = new majax_fast('libraries/sort/'+sort,{'access_token':token,'client_id':App.api.client_id,'per_page':10},before);
		}else{
			var check = new majax_fast('libraries/index',{'access_token':token,'client_id':App.api.client_id,'per_page':10},before);
		}
		check.success(function(data){
			$('#btn-loadmore_library').attr('onclick','more_library_(\''+id+'\',\''+sort+'\')')
			$("#collection").removeClass('fa fa-spin moco-load');
			if(data.meta.code==200){
				if(data.data.total_result<10){
					$('#btn-loadmore_library').hide()
				}else{
					$('#btn-loadmore_library').show()
				}
				if(id){
					WriteData('_librariescategory'+id, data);
				}if(sort){
					WriteData('_libraries'+sort, data);
				}else{
					WriteData('_libraries', data);
				}
				$('#collection').attr('data-index',3);
				// if(local){

				// }else{
					var controller = App.MainLibraryController.create();
					controller.send('parselibraries',data,sort,0,id)
				// }
			}else if(data.meta.code==401){
          		logout_();
          		var controller = App.MainLibraryController.create();
				controller.send('libraries',sort,type,id,name)
			}else{
				$('#btn-loadmore_library').hide()
				$("#collection").html('<br><center>'+data.meta.error_message+'<center>')
			}
		})
		check.error(function(data){
			$('#btn-loadmore_library').hide()
			$("#collection").html('');
		})
  	},
  	morelibraries:function(id,sort){
  		if(morelibraries){
    
      	}else{
	        morelibraries=true;
	        var token = localStorage.getItem('token');
	        var before = $('#load_more_').addClass('moco-load')
	        var index = $('#collection').attr('data-index')
	        if(id){
				var notes = new majax_fast('libraries/sort/category',{'access_token':token,'client_id':App.api.client_id,'per_page':5,'category_id':id,'page':index},before);
			}else if(sort){
	          var notes = new majax_fast('libraries/sort/'+sort,{'access_token':token,'client_id':App.api.client_id,'per_page':5,'page':index},before);
	        }else{
	          var notes = new majax_fast('libraries/index',{'access_token':token,'client_id':App.api.client_id,'per_page':5,'page':index},before);
	        }
	        // notes = new majax_fast('feeds',{'access_token':token,'per_page':5,'page':index},before);
	        notes.success(function(data){
	        	$('#load_more_').removeClass('moco-load')
	          	morelibraries = false
	          	if(data.meta.code==200){
	            	  // WriteData('_feed', data);
	              	$('#collection').attr('data-index',parseInt(index)+1);
	              	var controller = App.MainLibraryController.create();
	              	controller.send('parselibraries',data,sort,1,id)
	          	}else{
	          		$('#btn-loadmore_library').hide()
	            	morelibraries = true;
	            	//$('#dg-container').removeClass('dg-container').removeAttr('id')
	            	var wall = new freewall("#collection");
	            	wall.reset({
	              		selector: '.books',
	              		animate: false,
	              		cellW: 180,
	              		cellH: 'auto',
	              		// delay:50,
	              		onResize: function() {
	                		wall.fitWidth();
	              		}
	            	});
	            	wall.fitWidth();
	            	var height = parseInt($('#collection').attr('data-wall-height'));
	            	//console.log(height);
	            	height=height+150;
	            	//console.log(height)
	            	$('#collection').css('height',height)
	          }
	        })
	        notes.error(function(data){
	        	$('#load_more_').removeClass('moco-load')
	        	$('#btn-loadmore_library').hide()
	        })
	    }
  	},
  	parselibraries:function(data,sort,index,id){
  		var token = localStorage.getItem('token')
  		books_text='';
		var slide = '';
		var wall = new freewall("#collection");
		wall.reset({
			selector: '.books',
			cellW: 180,
			cellH: 'auto',
			animate:false,
			// delay:50,
			onResize: function() {
			  wall.fitWidth();
			}
		});
		wall.fitWidth();
		// console.log(data);
		$.each(data.data.data,function(){
			var Config=this.Config;
			var Library = this.Library;
			var Statistic=this.Statistic;
			var Books = this.Books;
			books_text += '<div class="books b-white">\
		  		<div class="content">\
		  			<div class="image"><a href="#/main/epustaka/'+Library.id+'"><img class="logo" src="'+Library.logo+'" style="width:100%;" onerror="CovError(this)"></a></div>';
			books_text+='</div>\
				<div class="divider"></div>\
				<div style="padding:15px;">\
					<div class="" style="word-break:break-word">'+Library.name+'</div>\
					<div class=""><span class="blue f12">'+kilo(Statistic.total_books)+' Koleksi</span></div>\
		  			<div class="tail" style="padding:0;height:15px;">\
		  				<div class="col-xs-6 col-md-6 col-lg-6 f10" style="padding:0"><span class="red2">'+kilo(Statistic.total_copies)+'</span> Salinan</div>\
		  				<div class="col-xs-6 col-md-6 col-lg-6 f10" style="padding:0"><span class="red2">'+kilo(Statistic.total_members)+'</span> Anggota</div>\
		  			</div>\
		  		</div>\
		  	</div>'
		  	
		  	//<div class="divider"></div><div class="blue center">'+Statistic.total_books+' Collection</div><div class="col-md-12 col-xs-12" style="padding:5px;">';
		  	



		  	//<div>Books</div>\
		  	// $.each(Books,function(){
		  	// 	var authors = this.authors;
		  	// 	var cover = this.cover;
		  	// 	var id = this.id;
		  	// 	var title = this.title;
		  	// 	if(Statistic.total_books=="0"){
		  			
		  	// 	}else{
			  // 		books_text+="<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='"+cover+"'style='width:100%' onerror='CovError(this)' onclick='location.href=\"#/main/book/"+id+"\"'></div>"
		  	// 	}
		  	//})
		 //  	if(Statistic.total_books=="0"){
		 //  		books_text+="<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>\
		 //  		<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>\
		 //  		<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>"
		 //  	}else if(Statistic.total_books==1){
		 //  		books_text+="<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>\
		 //  		<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>"
		 //  	}else if(Statistic.total_books==2){
		 //  		books_text+="<div class='col-md-4 col-xs-4 pointer' style='padding:2px;'><img src='img/main/bg.png'style='width:100%' onerror='CovError(this)'></div>"
		 //  	}else{
		  		
		 //  	}
		  	
   //    		if(Library.has_join=="false"){
   //    			if(token){
			// 	  	if(Config["Library.AllowPoinChargeJoin"]=="1"&&Config["Library.AllowUniqueCodeJoin"]=="1"){
			// 	  		var join = 'join_(\'All\',\''+Library.id+'\',\''+Library.name+'\',\''+Config["Library.MembershipCharge"]+'\')'
			// 	  	}else if(Config["Library.AllowPoinChargeJoin"]=="1"){
			// 	  		var join = 'join_(\'Poin\',\''+Library.id+'\',\''+Library.name+'\',\''+Config["Library.MembershipCharge"]+'\')';
			// 	  	}else if(Config["Library.AllowUniqueCodeJoin"]=="1"){
			// 	  		var join = 'join_(\'Code\',\''+Library.id+'\',\''+Library.name+'\',\''+Config["Library.MembershipCharge"]+'\')';
			// 	  	}else{
			// 	  		var join = 'join_(\'All\',\''+Library.id+'\',\''+Library.name+'\',\''+Config["Library.MembershipCharge"]+'\')'
			//   		}
			//   	}else{
			//   		var join = "location.href='#/login'";
			//   	}
		 //  		books_text+='</div><div class="stat grey">\
			//     	<div class="col-md-6 col-xs-6 pointer" onclick="'+join+'"><span class="moco-plus_o store_stat"></span> Join</div>\
			//     	<div class="col-md-6 col-xs-6 pointer" onclick="share(\'Library\',\''+Library.id+'\',\''+Library.url_profile+'\',\''+Library.name+'\',\''+Library.logo+'\',\''+Library.address+'\',\''+Statistic.total_books+'\')"><span class="moco-share store_stat"></span> Share</div></div>\
			// 	</div>';

		 //  	}else{
		 //  		join = "javascript:alert('You have joined with this ePustaka')";
		 //  		books_text+='</div><div class="stat grey">\
		 //    	<div class="col-md-12 col-xs-12 pointer" style="border-right:1px solid transparent" onclick="share(\'Library\',\''+Library.id+'\',\''+Library.url_profile+'\',\''+Library.name+'\',\''+Library.logo+'\',\''+Library.address+'\',\''+Statistic.total_books+'\')"><span class="moco-share store_stat"></span> Share</div></div>\
			// </div>';
		 //  	}
		 //  	books_text+='</div><div class="stat grey">\
		 //    	<div class="col-md-6 col-xs-6 pointer" onclick="'+join+'"><span class="moco-plus_o store_stat"></span> Join</div>\
		 //    	<div class="col-md-6 col-xs-6 pointer" onclick="share(\'Library\',\''+Library.id+'\',\''+Library.url_profile+'\',\''+Library.name+'\',\''+Library.logo+'\',\''+Library.address+'\',\''+Statistic.total_books+'\')"><span class="moco-share store_stat"></span> Share</div></div>\
			// </div>';
		});
		if(index==0){
		  	$('#collection').html(books_text);
		  	var images = wall.container.find('.books');
		  	images.find('img').load(function() {
		    	wall.fitWidth();
		  	});
		  	// var controller = App.MainLibraryController.create();
		  	// controller.send('endlesslibraries',sort)
		}else{
		  	$('#collection').append(books_text);
		  	wall.refresh();
		  	// var controller = App.MainStoreController.create();
		   //  controller.send('endlesslibraries',sort)
		}
		jQuery(function($){
			$('.store').unbind();
          $('.store').bind('scroll', function()
            {
              if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
              {
              	var controller = App.MainLibraryController.create();
				controller.send('morelibraries',id,sort)
                var wall = new freewall("#collection");
                wall.reset({
                  selector: '.books',
                  cellW: 180,
                  cellH: 'auto',
                  animate:false,
                  // delay:50,
                  onResize: function() {
                    wall.fitWidth();
                  }
                });
                wall.refresh();
              }
            })
          }
        );
  	},
  	endlesslibraries:function(sort){
  		if(morelibraries){
		}else{
			$(".store").endlessScroll({
				fireOnce: false,
				fireDelay: false,
				fireOnce:true,
				ceaseFireOnEmpty: false,
				inflowPixels:100,
				insertAfter: "#list div:last",
				loader: '<div class=""><img src="img/gif/g_loading2.GIF" style="width:40px;"><div>',
				callback: function(){
					var controller = App.MainLibraryController.create();
					controller.send('morelibraries',id,sort)
				}
			});
		}
  	}
  }
})

function more_library_(id,sort){
	var controller = App.MainLibraryController.create();
	controller.send('morelibraries',id,sort)
}
function click_pustaka(charge,library,name){
  // if(name){
  //   ga_action('Library','Borrow From',name);
  // }
  // library_id=library;
  // if(status_pustaka==1){
  //   borrow_books();
  //   is_expired(library_id);
  // }
  // library_cost = charge;
  // $('#_conf_join').click();
}

function join_(type,id,name,charge,id_book){
	App.Success_Alert = "Belum Menjadi Anggota?"
	App.Success_Content = "Sekarang waktunya kamu menjadi anggota Pustaka ini, Jadi kamu bisa meminjam buku!"
	$('#success').click()
	$('#icn_success').removeClass('moco-check_o2').addClass('moco-ask_o2')
	// $('#act_try').attr('onclick','_join_(\''+type+'\',\''+id+'\',\''+name+'\',\''+parseInt(charge/1000)+'\')')
	if(id_book){	
		$('#act_try').attr('onclick','join_confirm(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\',\''+id_book+'\')');
	}else{
		$('#act_try').attr('onclick','join_confirm(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\')');
	}
	$('#act_try').css('background-color','#4D4B8C').css('color','#fff')
	$('#act_try').html('Ya, Daftar sekarang!').css('font-size','10px').css('width','180px').css('border-radius','30px')
}
function _join_(type,id,name,charge,id_book){
	if(type=="All"){
		$('#btn-join').click();
		$('#points_join').html(charge+" Points").attr('onclick','join_confirm(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\')')
	}else if(type=="Poin"){
		$('#btn-confirm').click();
		$('#act_confirm').attr('onclick','join_confirm(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\',\''+id_book+'\')');
		$('#act_close').attr('onclick','javascript:$("close").click()')
		$('#point_confirm').html(charge);
	}else if(type=="Code"){
		$('#btn-unix').click()
		$('#pustaka_name').html(name)
	}else{
		$('#btn-join').click();
		$('#points_join').html(charge+" Points").attr('onclick','join_confirm(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\')')
	}
}
function join_confirm(type,id,name,charge,id_book){
	$('#btn-password').click();
	// $('#act_close').attr('onclick','join_(\''+type+'\',\''+id+'\',\''+name+'\',\''+charge+'\')');
	$('#act_close').attr("javascript:$('#btn-close_modal').click()")
	if(id_book){
		$('#act_password').attr('onclick','join_regular(\''+id+'\',\''+id_book+'\',\''+name+'\')');
	}else{
		$('#act_password').attr('onclick','join_regular(\''+id+'\')');
	}
}

function unix_member(){
	if($('#unix_code').val()==''){
		alert('You must insert a unix code')
	}else{
	    data="";
	    var token = window.localStorage.getItem('token');
	    var action = new majax_post('students/signup_member',{'access_token':token,'unique_code':$('#unix_code').val()},'');
	    action.success(function(data){
	      //console.log(data);
	        if(data.meta.code == 200){
	        	App.Success_Alert = "Welcome, New Member!"
	        	App.Success_Content = 'We are delighted to have you!'
	            $('#success').click();
	            $('#icn_success').removeClass('moco-check_o2').addClass('moco-love_o_')
            	$('#act_try').css('margin-top','65px')
	        }
	        else{
	          	var msg = "";
	            msg=data.meta.error_message;
	          	//alert(msg);
	          	App.Failed_Alert="Oops"
	          	App.Failed_Content=msg;
	            $('#failed').click();
	            $('#act_try').css('margin-top','65px')
	        }
	    });
	    action.error(function(data){
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
            $('#act_try').css('margin-top','65px')
	    })
	}
}

function join_regular(id,id_book,name){
	console.log(id_book)
  	data='';
	var token = window.localStorage.getItem('token');
  	var before=$('#transaction_confirm').html('<center style="padding-top:20px;"><img src="css/plugin/images/bx_loader.gif"></center>');
  	var req_data ={'access_token':token,'password':$('#input_password').val(),'library_id':id};
  	// var post = majax_post('students/signup_regular',req_data,before);
  	var post = majax_secure('students/signup_member',req_data,before);
  	post.success(function(data){
    	if(data.meta.code == 200){
            if(id_book){
            	borrow_books(id,name)
            }else{
            	App.Success_Alert = "Selamat Datang!"
		      	if(data.data){
		      		App.Success_Content = data.data
		      	}else{
	        		App.Success_Content = 'Selamat Bergabung dengan ePustaka ini!'
		      	}
	            $('#success').click();
	            $('#icn_success').removeClass('moco-check_o2').addClass('moco-love_o_')
	            $('#act_try').css('margin-top','65px')

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
						
            }
            
          // ga_action('Library','Joined',pustaka_name,library_cost);
     	}else{
			var msg = "";
           if($.isArray(data.meta.error_message)){
            $.each(data.meta.error_message,function(i,j){
                if(i == 0){
                    msg += j;   
                }else{
                    msg += " , "+j; 
                }
              });
          }else{
            msg = data.meta.error_message;
          }
          	App.Failed_Content=msg;
	        $('#failed').click();
	        $('#act_try').css('margin-top','30px')
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
        $('#act_try').css('margin-top','65px')
    })
}