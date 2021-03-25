App.CommentsController = Ember.ObjectController.extend({
	init:function(){

	},
	actions:{
		review:function(type,id){
			var access_token = localStorage.getItem('token')
			var before='';
			var comment = new majax_post('reviews/add',{'access_token':access_token,'key':id,'type':type,'content':$("#reviews-input").val()},before);
		    comment.success(function(data){
		        if(data.meta.code == 200){
		        	var content = $("#reviews-input").val()
		            $("#reviews-input").val("");
		            console.log(data);
		            var Profile = ReadData('profile').data.User
		            var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="reviewnew">\
								<div class="head">\
									<span><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></span>\
									<span class="blue">'+Profile.name+'</span>\
									<span class="f10 b">now</span>\
								</div>\
								<div class="content m-right">\
									<span>'+content+'</span>\
								</div>\
								<div class="tail">\
									<span><i class="moco-like grey"></i> 0 menyukai</span>\
									<span> Komentar</span>\
									<span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
								</div>\
							</div>'
					$('#empty').hide();
					$('#review').prepend(word);
		        }
		        else{
		        }
		    });
		    comment.error(function(data){

		    });
		},
		comments:function(type,id){
			console.log(type)
			console.log(id)
			var access_token = localStorage.getItem('token')
			var before='';
			var comment = new majax_secure('comments/add',{'access_token':access_token,'key':id,'type':type,'comment':$("#reviews-input").val()},before);
		    var Profile = ReadData('profile').data.User
		    if(type =="Feed"){
            	width='width:250px'
            	width1=""
            }else{
            	width='';
            	width1="205px"
            }
		    var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="reviewnew" style="padding-left:10px;padding-right:10px;line-height:1.2;'+width1+'">\
				<div class="head">\
					<span><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></span>\
					<span class="blue" style="position:relative;top:-3px;">'+Profile.name+'</span>\
					<span class="f10 b">now</span>\
				</div>\
				<div class="content m-right">\
					<span>'+$("#reviews-input").val()+'</span>\
				</div>\
				<div class="tail" style="'+width+'">\
					<span><i class="moco-like grey"></i> 0 menyukai</span>\
					<span style="float:right"><i class="moco-flag grey"></i> Laporkan</span>\
				</div>\
			</div>\
			<div class="divider"></div>';
			$('#empty').hide();
			if(type=="Feed"){
				$('#review1').prepend(word);
			}else{
				$('#review').prepend(word);
			}
			// $('#review').prepend(word);
		    comment.success(function(data){
		        if(data.meta.code == 200){
		        	var content = $("#reviews-input").val()
		            $("#reviews-input").val("");
		            console.log(data);
		            // var Profile = ReadData('profile').data.User
		   //          if(type =="Feed"){
		   //          	width='width:305px'
		   //          }else{
		   //          	width='';
		   //          }
		   //          var word='<div class="review wow fadeInDown" data-wow-duration="2s"id="reviewnew" style="padding-left:10px;padding-right:10px;line-height:1.2">\
					// 			<div class="head">\
					// 				<span><img class="avaMiniCircle" src="'+Profile.avatar+'" onerror="AvaError(this)"></span>\
					// 				<span class="blue">'+Profile.name+'</span>\
					// 				<span class="f10 b">now</span>\
					// 			</div>\
					// 			<div class="content m-right">\
					// 				<span>'+content+'</span>\
					// 			</div>\
					// 			<div class="tail" style="'+width+'">\
					// 				<span><i class="fa fa-thumbs-up"></i> 0 .</span>\
					// 				<span style="float:right"><i class="fa fa-flag"></i> Report</span>\
					// 			</div>\
					// 		</div>\
					// 		<div class="divider"></div>'
					// $('#review').prepend(word);
		        }
		        else{
		        }
		    });
		    comment.error(function(data){

		    });
		}
	}
})