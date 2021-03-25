App.NotesController = Ember.ObjectController.extend({
	init:function(){

	},
	actions:{
		list:function(){
			document.title="Catatan";
			var token = window.localStorage.getItem('token');
			$('#list_note').html('');
		    var notes = new majax('notes/index',{'access_token':token,'per_page':10},'');
		    note_text ='';
		    var local = ReadData('_notes');
		    if(local!=null){
                  //console.log(local);
                $('#notes_index').html('');
                var controller = App.NotesController.create();
                controller.send('parse_notes',local)
                //parse_notes(data);
            }else{
                //$('#notes_index').html('');
                //parse_notes(data);
            }
		    notes.success(function(data){
		        if(data.meta.code==200){
		            // count = data.data.total_result;
		            // page_note = data.data.num_pages;
		            var controller = App.NotesController.create();
                	controller.send('parse_notes',data)
		            WriteData('_notes', data)
		            //edit_notes();
		        }else{
		            $('#notes_index').html('');
		            $('#load_more').css('visibility','hidden');
		        }
		        
		    });
		    notes.error(function(data){
		    });
		},
		parse_notes:function(data){
			var note_text="";
			console.log(data)
		    $.each(data.data.data,function(){
		        var note = this.Note;
		        var child = this.children;
		        var date = note.modified.split(' ')
				var now = dateFormat(new Date(),"yyyy-mm-dd");
				if(now == date[0]){
					var time = change_time(date[1])
				}else{
					var time = dateFormat(date[0], "d mmmm yyyy")
				}
				$('#act_share').attr('onclick','open_share(\'Notes\',\'undefined\',\''+App.api.api_base+'\',\''+note.note+'\')');
		        note_text +='<div class="list_note pointer" id="note'+note.id+'">\
		        <div class="n_del pointer" onclick="dialog(\'notes\','+note.id+')"><div><i class="fa fa-times-circle red"></i></div></div>\
		        <div onclick="det_notes('+note.id+')">	\
		        	<div><span id="title'+note.id+'">'+limitCharacter(note.title,15)+'</span><span class="red f10" id="time'+note.id+'" style="padding-left:10px;">'+time+' </span></div>\
		        	<div class="f12"><span class="black" id="detail'+note.id+'"> '+limitCharacter(note.note,50)+'</span></div>\
		        </div>\
		        </div>'
		    }); 
			setTimeout(function(){
				$('#date').html(dateFormat(new Date(), "d mmmm yyyy"))
				$('#list_note').html(note_text);
			})
		},
		detail:function(id){
			var token =window.localStorage.getItem('token');
		    var before =$('#n_detail').html("Loading data ...");
		    var before =$('#n_title').val("Loading data ...");
		    var notes = new majax('notes/detail',{'access_token':token,'note_id':id},before);
		    note_det ='';

		    notes.success(function(data){
		       //console.log(data);
		       //console.log(count);
			    $.each(data.data,function(){
			        var notes = data.data.Notes;
			        //console.log(notes);
			        note_det=notes.note;
			        $('#act_share').attr('onclick','share(\'Notes\',\'undefined\',\''+App.api.api_base+'\',\''+notes.title+'\',\''+notes.note+'\')');
			        $('#n_title').html(notes.title);
			        ga_action('Notes','Open',notes.title);
			        if(notes.note==null){
			        $('#n_detail').html(" ");
			        }else{
			        $('#n_detail').html(notes.note);
			        }
			    });
			    var controller = App.NotesController.create();
			    controller.send('edit',id) 
		    });
		        //window.localStorage.setItem('note_id',id)
		        //note_id = id;
		},
		delete:function(id){
			var token =window.localStorage.getItem('token');
		    var data ={'access_token':token,'note_id':id};
		    var post = majax_secure('notes/delete',data,'');
		    post.success(function(data){
		        //console.log(data);
		        if(data.meta.code == 200){
		            $('#note'+id).hide();
		            //alert("Berhasil menghapus Notes");
		        }
		        else{
		        	App.Success_Alert ="Failed"
					App.Success_Content = data.meta.error_message;
					$('#failed').click();
		        }
		    });
		},
		add:function(id){
			ga_action('Notes','Add');
			var  note_text='';
		    var token =window.localStorage.getItem('token');
		    var title_note = $('#note_title').html();
		    var data_note = $('#message').html();
		    var data={'access_token':token,'title':'New Note','note':'new notes'};
		    var post = majax_secure('notes/add',data,'');
		        post.success(function(data){
		        //console.log(data);
		        if(data.meta.code == 200){
		            // get_notes();
		            // var controller = App.NotesController.create();
		            // controller.send('list')
		            var note = data.data.Notes;

			        var date = note.modified.split(' ')
					var now = dateFormat(new Date(),"yyyy-mm-dd");
					if(now == date[0]){
						var time = change_time(date[1])
					}else{
						var time = dateFormat(date[0], "mmmm d, yyyy")
					}
			        note_text +='<div class="list_note pointer wow fadeInDown" data-wow-duration="2s" id="note'+note.id+'">\
			        <div class="n_del pointer" onclick="dialog(\'notes\','+note.id+')"><div><i class="fa fa-times-circle red"></i></div></div>\
			        <div onclick="det_notes('+note.id+')">	\
		        		<div><span id="title'+note.id+'">'+limitCharacter(note.title,15)+'</span><span class="red f10" id="time'+note.id+'" style="padding-left:10px;">'+time+' </span></div>\
		        		<div class="f12"><span class="black" id="detail'+note.id+'"> '+limitCharacter(note.note,100)+'</span></div>\
		        	</div>\
			        </div>'
			        $('#list_note').prepend(note_text);
			        $('.list_note').css('background-color','transparent');
  					$('#note'+note.id).css('background-color','#fff');
		        }
		        else{
		            var msg = data.meta.error_message;
		            //alert(msg);
		        }
		    });
		    post.error(function(data){
		    //alert('Network Error');
		    });
		},
		edit:function(id){
			$('#n_title').unbind('keyup');
			$('#n_detail').unbind('keyup');
			var typingTimer;                
			var doneTypingInterval = 1000;
			var token =window.localStorage.getItem('token');
			$('#n_title').keyup(function(){
				var title = $('#n_title').html();
				$('#title'+id).html(limitCharacter(title,15));
				clearTimeout(typingTimer);
		        if ($('#n_title').html()) {
		            typingTimer = setTimeout(function(){
		                //do stuff here e.g ajax call etc....
		                var title = $("#n_title").html();
		                var note= $('#n_detail').html();
		                $('#detail'+id).html(limitCharacter(note,50));
		                //console.log(note);
		                if (id==null){
		                    console.log('kosong');
		                }else{
		                	$('#act_share').attr('onclick','share(\'Notes\',\'undefined\',\''+App.api.api_base+'\',\''+title+'\',\''+note+'\')');
		                    var data={'access_token':token,'title':title,'note_id':id,'note':note};
		                    var post = majax_secure('notes/edit',data,'');
		                    post.success(function(data){
		                    //console.log(data);
			                    if(data.meta.code == 200){
			                        //get_notes();
			                        $('#time'+id).html(dateFormat(new Date(),'h:MM:ss TT'))
			                    }
			                    else{
			                        var msg = "";
			                        //alert(msg);
			                    }
		                	});
		                }
		            }, doneTypingInterval);
		        }
			});
		    $('#n_detail').keyup(function(){
		        clearTimeout(typingTimer);
		        if ($('#n_detail').html()) {
		            typingTimer = setTimeout(function(){
		                //do stuff here e.g ajax call etc....
		                var title = $("#n_title").html();
		                var note= $('#n_detail').html();
		                //console.log(note);
		                if (id==null){
		                    console.log('kosong');
		                }else{
		                    var data={'access_token':token,'title':title,'note_id':id,'note':note};
		                    var post = majax_secure('notes/edit',data,'');
		                    post.success(function(data){
		                    //console.log(data);
			                    if(data.meta.code == 200){
			                        //get_notes();
			                        $('#time'+id).html(dateFormat(new Date(),'h:MM:ss TT'))
			                        $('#detail'+id).html(limitCharacter(note,50));
			                        $('#title'+id).html(limitCharacter(title,15));
			                    }
			                    else{
			                        var msg = "";
			                        //alert(msg);
			                    }
		                	});
		                }
		            }, doneTypingInterval);
		        }
		    });
		}
	}
})