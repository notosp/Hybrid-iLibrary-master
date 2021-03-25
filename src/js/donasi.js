var don_pid,don_bid,don_qty,don_harga,don_boxid,don_tot,don_unix,don_pay,don_status,don_total,order_id;
function don_search_pustaka(id,status){
	if(status!=true){
		var before = $("#don_list_pustaka").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
	}else{
		var before = '';
	}
	var page = $('#don_list_pustaka').attr('data-index')
	var token = localStorage.getItem('token')
	var html ='';
	moco_query = $("input#"+id).val()
	var shortcut = App.api.url_search+':6161/lib_search';
	$.ajax({
        type: 'GET',
        url: shortcut,
        data: {'q':moco_query,'page':'1','per_pages':20,'page':page},
        dataType:"json",
        timeout:60000,
        beforeSend:function(){
            $("input#"+id).attr('disabled',true);
            if(status!=true){
				$("#don_list_pustaka").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
			}else{
				
			}
		},
        success: function(result){
            if(result.meta.code == 200){
            	if(result.meta.total_result<10){
					$('#btn-loadmore_don').hide()
				}else{
					$('#btn-loadmore_don').show()
				}
				if(status==true){
					var angka = parseInt(result.meta.page)+1
					console.log(angka)
					$('#don_list_pustaka').attr('data-index',angka);
				}else{
					$('#don_list_pustaka').attr('data-index',1);
				}
                $.each(result.data,function(){
                	console.log(this.data)
                	var Library = this.data;
                	var action = 'don_sel_pustaka('+Library.id+')';
					html += '<div class="media col-md-12 don_p" id="don_p'+Library.id+'" onclick="'+action+'" style="padding-left:10px;cursor:pointer;padding-right:10px;padding-top:20px;margin-top:0">\
				      <div class="col-xs-2 col-md-2" style="margin-top:0px;padding:5px;border:1px solid #ddd;border-radius:5px;width:50px;height:50px;">\
				        <img class="media-object" src="'+Library.logo+'" onerror="CovError(this)" style="width:40px;height:40px;">\
				      </div>\
				      <div class="media-body col-xs-10 col-md-10" style="margin-left:5px;margin-top:5px;padding-right:0px;">\
				        <div class="blue" style="font-size:14px">'+limitCharacter(Library.name,40)+'</div>\
				        <div class="grey" style="font-size:12px;">Member <span class="blue"> </span></div>\
				      </div>\
				      <div class="col-xs-1 col-md-1" style="margin-top:10px;margin-left:25px;display:none">\
				      </div>\
				      <div class="divider" style="padding-top:70px;border-color:#ddd"></div>\
				      </div>';
                })
                $("input#"+id).prop('disabled',false);
                $("input#"+id).focus();
                if(status==true){
					$('#don_list_pustaka').append(html)
				}else{
					$('#don_list_pustaka').html(html)
				}
				if(result.meta.result<result.meta.per_pages){
					$('#btn-loadmore_don').hide()
				}
            }else{
                $("input#"+id).prop('disabled',false);
                $("input#"+id).focus();
                $('#btn-loadmore_don').hide()
				if(status!=true){
					$("#don_list_pustaka").html('<br><center>'+result.meta.msg+'<center>')
				}
            }
        },
        error: function(result){
            $("input#"+id).prop('disabled',false);
            $("input#"+id).focus();
            if(status!=true){
            	$('#don_list_pustaka').html('<center><span class="grey">Request Timeout</span></center>');
            }
        }
    })

}

function list_donasi(status){
	console.log(status)
	var token = localStorage.getItem('token');
	if(token){
		if(status){
			don_book(20,1,true);
		}else{
			don_book(20,1);
		}
	}else{
		$('#don_check_o').hide();
		$('#don_head').html('Mari bergabung menjadi member iNgawi')
		$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/login'").html('Gabung iNgawi').show();
		$('#btn_don_bayar').hide();
	}
}
function don_sel_pustaka(id){
	console.log(don_status)
	$('.don_p').css('background','');
	$('#don_p'+id).css('background','#e1f9f9');
	don_pid = id;
	if(don_status){
		$('#don_action').attr('onclick','don_edit('+don_status+','+don_bid+','+don_qty+','+don_pid+')')
	}else{
		$('#don_action').attr('onclick','don_save('+don_bid+','+don_qty+','+don_pid+')')
	}
}
function don_open_check(id,status){
	$('.check_list').hide();
	$('#open_'+id).show()
	if(id==1){
		$('._list').removeClass('red');
		$('#don_kotak').addClass('red');
		$('#don_action').html('Pesan Donasi')
		if(status){
			$('#don_action').attr('onclick','don_sumary(false)');
		}
	}else if(id==2){
		$('._list').addClass('red');
		$('#don_konf').removeClass('red');
		$('#don_action').html('Pesan Sekarang')
	}else{
		$('#don_help_va').hide();
		$('#tot_').show();
		$('#don_akhir_ket').show();
		$('._list').addClass('red');
		$('#don_action').html('Saya telah melakukan pembayaran')
	}
}
function don_list_pustaka(status){
	if(status!=true){
		var before = $("#don_list_pustaka").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
	}else{
		var before = '';
	}
	var id = $('#don_kategori').val();
	var page = $('#don_list_pustaka').attr('data-index')
	var token = localStorage.getItem('token')
	var library = '';
	if(id!='all'){
		var check = new majax_fast('libraries/sort/category',{'access_token':token,'client_id':App.api.client_id,'page':page,'per_page':10,'category_id':id},before);
	}else{
		var check = new majax_fast('libraries/index',{'access_token':token,'client_id':App.api.client_id,'page':page,'per_page':10},before);
	}
	check.success(function(data){
		$("#don_list_pustaka").removeClass('fa fa-spin moco-load');
		$('#btn-loadmore_don').show()
		if(data.meta.code==200){
			if(data.data.total_result<10){
				$('#btn-loadmore_don').hide()
			}else{
				$('#btn-loadmore_don').show()
			}
			if(status==true){
				var angka = parseInt(data.data.current_page)+1
				console.log(angka)
				$('#don_list_pustaka').attr('data-index',angka);
			}else{
				$('#don_list_pustaka').attr('data-index',1);
			}
			var action ="";
			$.each(data.data.data,function(){
				var Config=this.Config;
				var Library = this.Library;
				var Statistic=this.Statistic;
				var Books = this.Books;
				var action = 'don_sel_pustaka('+Library.id+')';
				library += '<div class="media col-md-12 don_p" id="don_p'+Library.id+'" onclick="'+action+'" style="padding-left:10px;cursor:pointer;padding-right:10px;padding-top:20px;margin-top:0">\
		      <div class="col-xs-2 col-md-2" style="margin-top:0px;padding:5px;border:1px solid #ddd;border-radius:5px;width:50px;height:50px;">\
		        <img class="media-object" src="'+Library.logo+'" onerror="CovError(this)" style="width:40px;height:40px;">\
		      </div>\
		      <div class="media-body col-xs-10 col-md-10" style="margin-left:5px;margin-top:5px;padding-right:0px;">\
		        <div class="blue" style="font-size:14px">'+limitCharacter(Library.name,40)+'</div>\
		        <div class="grey" style="font-size:12px;">Member <span class="blue">'+Statistic.total_members+' </span></div>\
		      </div>\
		      <div class="col-xs-1 col-md-1" style="margin-top:10px;margin-left:25px;display:none">\
		      </div>\
		      <div class="divider" style="padding-top:70px;border-color:#ddd"></div>\
		      </div>';
			})
			if(status==true){
				$('#don_list_pustaka').append(library)
			}else{
				$('#don_list_pustaka').html(library)
			}
		}else{
			$('#btn-loadmore_don').hide()
			if(status!=true){
				$("#don_list_pustaka").html('<br><center>'+data.meta.error_message+'<center>')
			}
		}
	})
	check.error(function(data){
		$('#btn-loadmore_don').hide()
		$("#don_list_pustaka").html('');
	})
}
function don_cat_pustaka(){
	var local = ReadData('_pustaka_genre');
	var html = '<option value="all">All</option>';
	$.each(local.data.Category,function(){
        var Category = this;
        var Child = this.children;
        html+='<option value="'+this.id+'">'+this.name+'</option>'
    });
    $('#don_kategori').html(html);
    setTimeout(function(){
		$('#don_kategori').on('change', function (e) {
			$('#don_list_pustaka').attr('data-index',1);
		    // var optionSelected = $("option:selected", this);
		    // var valueSelected = this.value;
		    don_list_pustaka(false);
		});
    },500)
}
function don_p_book(book_id,status,lib_id,qty){
	if(status){
		don_status = status;
	}else{
		don_status = undefined
	}
	var token = localStorage.getItem('token');
	don_bid = book_id;
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/index',{'access_token':token,'book_id':book_id},before);
		var library = '';
		check.success(function(data){
			console.log(data)
			if(data.meta.code=="200"){
				$('#btn-add_donasi').click();
				don_cat_pustaka()
				var Books = data.data.Books;
				var Libraries = data.data.Libraries;
				$('#don_price').html(rupiah(Books.price));
				$('#don_cover').attr('src',Books.cover)
				$('#don_title').html(limitCharacter(Books.title,50));
	            $('#don_author').html(Books.authors)
	            don_qty = parseInt($('#don_qty').val());
	            don_harga = parseInt(Books.price);
	            if(status){
	            	$('#don_action').attr('onclick','don_edit('+status+','+don_bid+','+don_qty+')')
	            }else{
	            	$('#don_action').attr('onclick','don_save('+don_bid+','+don_qty+')')
	            }
	            $('#don_total').html(rupiah(don_qty*don_harga));
				$.each(Libraries,function(){
					var Library = this;
					var action = 'don_sel_pustaka('+Library.id+')';
					library += '<div class="media col-md-12 don_p" id="don_p'+Library.id+'" onclick="'+action+'" style="padding-left:10px;cursor:pointer;padding-right:10px;padding-top:20px;margin-top:0">\
			      <div class="col-xs-2 col-md-2" style="margin-top:0px;padding:5px;border:1px solid #ddd;border-radius:5px;width:50px;height:50px;">\
			        <img class="media-object" src="'+Library.logo+'" onerror="CovError(this)" style="width:40px;height:40px;">\
			      </div>\
			      <div class="media-body col-xs-10 col-md-10" style="margin-left:5px;margin-top:5px;padding-right:0px;">\
			        <div class="blue" style="font-size:14px">'+limitCharacter(Library.name,40)+'</div>\
			        <div class="grey" style="font-size:12px;">Member <span class="blue">'+Library.total_members+' </span></div>\
			      </div>\
			      <div class="col-xs-1 col-md-1" style="margin-top:10px;margin-left:25px;display:none">\
			      </div>\
			      <div class="divider" style="padding-top:70px;border-color:#ddd"></div>\
			      </div>';
				})
				$('#don_list_pustaka').html(library);
				$('#don_qty').on('change', function (e) {
					if($('#don_qty').val()==""){
						// alert('Qty tidak boleh kosong')
						$('#don_qty').val(1);
						don_qty = parseInt($('#don_qty').val());
						$('#don_total').html(rupiah(don_qty*don_harga));
					}else{
						don_qty = parseInt($('#don_qty').val());
						$('#don_total').html(rupiah(don_qty*don_harga));
					}
					if(status){
		            	$('#don_action').attr('onclick','don_edit('+status+','+don_bid+','+don_qty+')')
		            }else{
		            	$('#don_action').attr('onclick','don_save('+don_bid+','+don_qty+')')
		            }
				});
				// $('#don_qty').bootstrapNumber({
				// 	upClass: 'b-black',
				// 	downClass: 'b-black'
				// });
				if(status){
					$('#sel').val(qty);
					if(lib_id!=undefined){
						don_sel_pustaka(lib_id);
					}
				}
			}else{
				alert(data.meta.error_message)
			}
			// $('#don_action').attr('onclick','don_save('+don_bid+','+don_qty+')')
		})
		check.error(function(data){
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}
function don_save(book_id,qty,library_id){
	var token = localStorage.getItem('token');
	if(library_id){
		if(token){
			var before ='';
			var check = new majax_secure_empty(App.api.v3+'donations/save_donation_box',{'access_token':token,'book_id':book_id,'qty':qty,'library_id':library_id},before);
			check.success(function(data){
				if(data.meta.code=="200"){
					App.Success_Alert = "Pemesanan Sukses";
					App.Success_Content = data.data.message;
					$('#btn-conf_dialog').click()
					$('#icn-success i').removeClass('moco-ask_o2').addClass('moco-check_o2');
					$('#act_cancel').attr('onclick','')
					$('#act_try').attr('onclick','')
					$('#act_cancel a').html('Tambahkan Buku').css('font-size','12px').attr('onclick','goto_store()')
					$('#act_try a').html('Lanjutkan').css('font-size','12px').attr('onclick','don_book(20,1,true)')
					$('#don_check_o').show();
					list_donasi();
				}else{
					alert(data.meta.error_message);
				}
			})
			check.error(function(data){
				console.log(data)
				alert(data)
			})
		}else{
			location.href="#/login"
		}
	}else{
		alert('Anda belum memilih tujuan donasi')
	}
}
function goto_store(){
	location.href="#/main/store/index"
	$('#btn-close').click();
}
var donasi_ehead =' <div class="red" style="text-align:center;font-size: 12px; padding: 15px;line-height: 1.2;">Maaf, kotak pesanan anda masih kosong. Silahkan kembali dan lakukan pemesanan.</div>'
var donasi_ebody =' <div style="margin-top:40px;"><img src="img/main/empty_donasi.png" style="width:150px"></div>\
    <div style="padding: 10px 60px;font-size: 12px;color: #444;margin-bottom:40px;">Bantu cerdaskan bangsa lewat uluran tanggan anda</div>'

function don_book(per_page,page,status){
	var token = localStorage.getItem('token')
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/donation_box_2',{'access_token':token,'page':page,'per_page':per_page},before);
		check.success(function(data){
			// console.log(data)
			if(data.meta.code=="200"){
				$('#don_check_o').show();
				var Books = data.data.Books;
				var Payments = data.data.payment_methods;
				don_tot = data.data.total_donation_cost;
				// Books.epustaka_id
				if(status==true){
					$('#btn-check_donasi').click();
					$('#don_tot').html(rupiah(don_tot));
					don_open_check(1,true)
					var html1='';
					var html2='';
					var html ='';
					$.each(Payments,function(){
				        var payment = this;
				        // html+='<option value="'+this.id+'">'+this.name+'</option>'
				        html+='<div class="pad10 m10 pointer" onclick="don_sumary(undefined,'+this.id+')" style="border:1px solid #ddd;border-radius:5px;background:#fff;padding:0;height:50px">\
		                    <span class="red f14" style="margin-bottom: 5px;"><b style="margin: 10px;top: 14px;position: relative;">'+this.name+'</b></span>\
		                    <img src="'+this.icon+'" style="height:38px;float:right;max-width:225px;margin:5px;">\
		                  </div>'
				    });
				    // console.log(html)
				    $('#don_list_book').html(html);
				    $.each(Books,function(){
				        var book = this;
				        html1+='<div class="don_list_b" id="don_list_b'+book.donation_box_id+'" style="">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 100px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 100px;max-width:80px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.5">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,25)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,40)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,40)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5 pointer" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				                </div>';
				    });
				    // $('#don_list_book').html(html1);
				    //dropdown
				    html2 = '';
					html1 = '';
					// console.log(html1)
				    $('#don_head').html(html2);
				    $('#don_content').html(html1).css('text-align','')
				    // $('#btn_ayodonasi').css('text-align','center').attr('onclick',"don_book(20,1,true)").html('Pesan Donasi');
				    $('#btn_ayodonasi').hide()
				    $('#btn_don_bayar').show();
				    $('#don_list_pay').on('change', function (e) {
						don_pay = $('#don_list_pay').val();
						if(don_pay!="0"){
							$('#don_action').attr('onclick','don_sumary()')
						}
					});
				}else{
					//dropdown
					html2 = '';
					html1 = '';
					$.each(Books,function(){
				        var book = this;
				        html1+='<div class="don_list_b" id="don_list_b1'+book.donation_box_id+'" style="height:80px;background:#fff">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 50px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 80px;max-width:60px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.1">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,15)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,25)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,25)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5 pointer" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				            </div>';
				    });
				    $('#don_head').html(html2);
				    $('#don_content').html(html1).css('text-align','')
				    // $('#btn_ayodonasi').css('text-align','center').attr('onclick',"don_book(20,1,true)").html('Pesan Donasi');
				    $('#btn_ayodonasi').hide()
				    $('#btn_don_bayar').show();
					// $('#don_head').html(meta)
				}
			}else if(data.meta.code=="404"){
				$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
				$('#btn_don_bayar').hide();
				$('#don_head').html(donasi_ehead);
				$('#don_content').css('text-align','center').html(donasi_ebody);
				$('#don_check_o').hide();
			}else{
				$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
				$('#btn_don_bayar').hide();
				alert(data.meta.error_message);
				$('#don_check_o').hide();
				$('#don_head').html(donasi_ehead);
				$('#don_content').css('text-align','center').html(donasi_ebody);
			}
		})
		check.error(function(data){
			$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
			$('#btn_don_bayar').hide();
			// console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function don_book_old(per_page,page,status){
	var token = localStorage.getItem('token')
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/donation_box_2',{'access_token':token,'page':page,'per_page':per_page},before);
		check.success(function(data){
			// console.log(data)
			if(data.meta.code=="200"){
				$('#don_check_o').show();
				var Books = data.data.Books;
				var Payments = data.data.payment_methods;
				don_tot = data.data.total_donation_cost;
				// Books.epustaka_id
				if(status==true){
					$('#btn-check_donasi').click();
					$('#don_tot').html(rupiah(don_tot));
					don_open_check(1,true)
					var html1='';
					var html2='';
					var html ='<option value="0">Pilih Metode Transaksi</option>'
					$.each(Payments,function(){
				        var payment = this;
				        html+='<option value="'+this.id+'">'+this.name+'</option>'
				    });
				    $('#don_list_pay').html(html);
				    $.each(Books,function(){
				        var book = this;
				        html1+='<div class="don_list_b" id="don_list_b'+book.donation_box_id+'" style="">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 100px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 100px;max-width:80px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.5">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,25)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,40)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,40)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5 pointer" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				                </div>';
				    });
				    $('#don_list_book').html(html1);
				    //dropdown
				    html2 = '';
					html1 = '';
					$.each(Books,function(){
				        var book = this;
				        html1+='<div class="don_list_b" id="don_list_b1'+book.donation_box_id+'" style="height:80px;background:#fff">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 50px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 80px;max-width:60px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.1">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,15)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,25)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,25)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5 pointer" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				                </div>';
				    });
				    // html2+='<div class="col-xs-12 col-md-12 col-lg-12 f12" style="padding: 10px 15px;padding-top: 5px;">\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0">Total Biaya</div><div class="col-xs-6 col-md-6 col-lg-6 p0 harga_tot" style="text-align: right;" >'+rupiah(don_tot)+'</div>\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0 black">Kode Unik</div><div class="col-xs-6 col-md-6 col-lg-6 p0 black" style="text-align: right;" >,-</div>\
	       //               <div class="col-xs-12 col-md-12 divider" style=""></div>\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0">Total Pembayaran</div><div class="col-xs-6 col-md-6 col-lg-6 p0 harga_tot" style="text-align: right;">'+rupiah(don_tot)+'</div>\
	       //              </div>'
				    $('#don_head').html(html2);
				    $('#don_content').html(html1).css('text-align','')
				    // $('#btn_ayodonasi').css('text-align','center').attr('onclick',"don_book(20,1,true)").html('Pesan Donasi');
				    $('#btn_ayodonasi').hide()
				    $('#btn_don_bayar').show();
				    $('#don_list_pay').on('change', function (e) {
						don_pay = $('#don_list_pay').val();
						if(don_pay!="0"){
							$('#don_action').attr('onclick','don_sumary()')
						}
					});
				}else{
					//dropdown
					html2 = '';
					html1 = '';
					$.each(Books,function(){
				        var book = this;
				        html1+='<div class="don_list_b" id="don_list_b1'+book.donation_box_id+'" style="height:80px;background:#fff">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 50px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 80px;max-width:60px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.1">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,15)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,25)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,25)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5 pointer" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				                </div>';
				    });
				    // html2+='<div class="col-xs-12 col-md-12 col-lg-12 f12" style="padding: 10px 15px;padding-top: 5px;">\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0">Total Biaya</div><div class="col-xs-6 col-md-6 col-lg-6 p0 harga_tot" style="text-align: right;" >'+rupiah(don_tot)+'</div>\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0 black">Kode Unik</div><div class="col-xs-6 col-md-6 col-lg-6 p0 black" style="text-align: right;" >,-</div>\
	       //               <div class="col-xs-12 col-md-12 divider" style=""></div>\
	       //               <div class="col-xs-6 col-md-6 col-lg-6 p0">Total Pembayaran</div><div class="col-xs-6 col-md-6 col-lg-6 p0 harga_tot" style="text-align: right;">'+rupiah(don_tot)+'</div>\
	       //              </div>'
				    $('#don_head').html(html2);
				    $('#don_content').html(html1).css('text-align','')
				    // $('#btn_ayodonasi').css('text-align','center').attr('onclick',"don_book(20,1,true)").html('Pesan Donasi');
				    $('#btn_ayodonasi').hide()
				    $('#btn_don_bayar').show();
					// $('#don_head').html(meta)
				}
			}else if(data.meta.code=="404"){
				$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
				$('#btn_don_bayar').hide();
				$('#don_head').html(donasi_ehead);
				$('#don_content').css('text-align','center').html(donasi_ebody);
				$('#don_check_o').hide();
			}else{
				$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
				$('#btn_don_bayar').hide();
				alert(data.meta.error_message);
				$('#don_check_o').hide();
				$('#don_head').html(donasi_ehead);
				$('#don_content').css('text-align','center').html(donasi_ebody);
			}
		})
		check.error(function(data){
			$('#btn_ayodonasi').css('text-align','center').attr('onclick',"location.href='#/main/store/index'").html('Ayo Donasi').show();
			$('#btn_don_bayar').hide();
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function don_edit(don_id,book_id,qty,library_id){
	var token = localStorage.getItem('token')
	var qty = parseInt($('#don_qty').val());
	if(library_id){
		if(token){
			var before ='';
			var check = new majax_secure_empty(App.api.v3+'donations/edit_donation_box',{'access_token':token,'donation_box_id':don_id,'library_id':library_id,'qty':qty},before);
			check.success(function(data){
					console.log(data)
				if(data.meta.code=="200"){
					App.Success_Alert = "Pemesanan Sukses";
					if(data.data.message){
						App.Success_Content = "Berhasil melakukan perubahan pada box donasi"
					}else{
						// App.Success_Content = data.data.message;
						App.Success_Content = "Berhasil melakukan perubahan pada box donasi"
					}
					$('#btn-conf_dialog').click()
					$('#icn-success i').removeClass('moco-ask_o2').addClass('moco-check_o2');
					$('#act_cancel').attr('onclick','')
					$('#act_try').attr('onclick','')
					$('#act_cancel a').html('Tambahkan Buku').css('font-size','12px').attr('onclick','don_p_book('+book_id+')')
					$('#act_try a').html('Lanjutkan').css('font-size','12px').attr('onclick','don_book(20,1,true)')
					$('#don_check_o').show()
				}else{
					alert(data.meta.error_message)
				}
			})
			check.error(function(data){
				console.log(data)
			})
		}else{
			location.href="#/login"
		}
	}else{
		alert('Anda belum memilih tujuan donasi')
	}
}

function don_delete(don_id,kurang){
	var token = localStorage.getItem('token')
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/delete_donation_box',{'access_token':token,'donation_box_id':don_id},before);
		check.success(function(data){
			console.log(data)
			if(data.meta.code=="200"){
				$('#don_list_b'+don_id).hide();
				$('#don_list_b1'+don_id).hide();
				var harga = parseInt(don_tot)-parseInt(kurang);
				console.log(harga)
				$('#don_tot').html(rupiah(harga));
				$('.harga_tot').html(rupiah(harga));
				don_tot = harga;
				if(harga=="0"){
					list_donasi();
				}
			}else{
				alert(data.meta.error_message)
			}
		})
		check.error(function(data){
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function don_sumary(don_id,pay){
	if(don_id!=false){
		var token = localStorage.getItem('token');
		// var pay = $('#don_list_pay').val();
		console.log(pay)
		don_pay = pay;
		if(token){
			if(pay!="0"||pay!=undefined){
				var before ='';
				var check = new majax_secure_empty(App.api.v3+'donations/donation_summary',{'access_token':token,'payment_method_id':don_pay},before);
				check.success(function(data){
					console.log(data)
					var html='';
					if(data.meta.code=="200"){
						don_open_check(2,true);
						var Books = data.data.Books;
						var Donations = data.data.Donations;
						$('#don_order').html(Donations.order_id)
						$('#don_sum_cos').html(rupiah(Donations.total_donation_cost))
						$('#don_sum_reward').html(rupiah(Donations.reward))
						$('#don_sum_tot').html(rupiah(Donations.total_payment))
						$('#btn_donasi_checkout').show();
						don_tot = Donations.total_donation_cost
						don_unix = Donations.reward
						order_id = Donations.order_id
						don_checkout(Donations.order_id,don_pay)
					}else{
						alert(data.meta.error_message)
					}
				})
				check.error(function(data){
					console.log(data)
				})
			}else{
				alert("Anda belum memilih metode transaksi")
			}
		}else{
			location.href="#/login"
		}
	}else{
		alert("Anda belum memilih metode transaksi")
	}
}

function don_sumary_old(don_id){
	if(don_id!=false){
		var token = localStorage.getItem('token');
		var pay = $('#don_list_pay').val();
		console.log(pay)
		don_pay = pay;
		if(token){
			if(pay!="0"||pay!=undefined){
				var before ='';
				var check = new majax_secure_empty(App.api.v3+'donations/donation_summary',{'access_token':token,'payment_method_id':don_pay},before);
				check.success(function(data){
					console.log(data)
					var html='';
					if(data.meta.code=="200"){
						don_open_check(2,true);
						var Books = data.data.Books;
						var Donations = data.data.Donations;
						$('#don_order').html(Donations.order_id)
						$('#don_sum_cos').html(rupiah(Donations.total_donation_cost))
						$('#don_sum_reward').html(rupiah(Donations.reward))
						$('#don_sum_tot').html(rupiah(Donations.total_payment))
						$('#don_action').attr('onclick','don_checkout('+Donations.order_id+','+don_pay+')')
						$.each(Books,function(){
				        	var book = this;
				        	html+='<div class="don_list_b" id="don_list_b'+book.donation_box_id+'" style="background:#fff">\
				        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 100px;padding-top: 0px;padding-left:0;">\
				                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 100px;max-width:80px;"></div>\
				                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.5">\
				                    <div class="f14" id="don_title1">'+limitCharacter(book.title,25)+'</div>\
				                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,40)+'</span></div>\
				                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,40)+'</span></div>\
				                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
				                    <div class="f10 red p5" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')" style="display:none">Sunting</div>\
				                  </div>\
				                  <div class="pointer moco-cross red f10" style="position:absolute;display:none; top: 4px;right:4px;" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
				                </div>\
				                </div>';
				    	});
				    	$('#don_list_book1').html(html);
					}else{
						alert(data.meta.error_message)
					}
				})
				check.error(function(data){
					console.log(data)
				})
			}else{
				alert("Anda belum memilih metode transaksi")
			}
		}else{
			location.href="#/login"
		}
	}else{
		alert("Anda belum memilih metode transaksi")
	}
}

function don_checkout(order_id,pay_id){
	var token = localStorage.getItem('token');
	var html = "";
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/save_donation',{'access_token':token,'payment_method_id':pay_id,'order_id':order_id},before);
		check.success(function(data){
			console.log(data)
			if(data.meta.code=="200"){
				// don_open_check(3,true);
				list_donasi();
				var Account = data.data.Account_destination;
				var Payment = data.data.payment_method;
				var url = data.data.Payment_url;
				var total = data.data.Total_payment;
				var Donations = data.data.Donations;
				order_id = Donations.order_id;
				console.log(data);
				// payment_method = Donations.payment_method;
				// payment_method_id = Donations.payment_method_id;
				// reward = Donations.reward;
				// total_donation_cost = Donations.total_donation_cost;
				// total_payment = Donations.total_payment;
				// $('#don_action').attr('onclick','don_confirm('+Donations.order_id+')')
				// don_total = Donations.total_payment;
				// $('#tot_don_pay').html(rupiah(Donations.total_payment));
				// don_confirm(order_id)
				// $('#don_action').attr('onclick','alert("manual konfirmasi masih dalam proses")')
				$('#tot_don_pay').html(rupiah(total));
				if(url){
					$('#link_payment').show();
					$('#don_action').attr('onclick','call_payment(\''+order_id+'\',\''+url+'\')').html('Lanjutkan ke pembayaran')
					call_payment(order_id,url);
					$('#bank_list').hide();
				}else{
					// don_manual(total_payment);
					$('#tot_don_pay').html(rupiah(total));
					$.each(Account,function(){
				        var bank = this;
				        html +='<div style="padding-bottom:10px;">\
	                        <div class="black f12"><b>'+bank.bank_name+'</b></div>\
	                        <div class="black f12"><b>'+bank.account_number+'</b></div>\
	                        <div class="f10">'+bank.bank_branch+'</div>\
	                      </div>'
				    });
					$('#bank_list').html(html).show();
					$('#_don_tot').html(rupiah(don_tot))
					$('#don_unix').html(don_unix)
					$('#_order_id').html(order_id)
					
					$('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Saya telah melakukan pembayaran')
					don_open_check(3);
					don_unverified(true)
				}
			}else{
				alert(data.meta.error_message)
			}
		})
		check.error(function(data){
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function don_reset_trx(order_id){
	var token = localStorage.getItem('token');
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/reset_url_payment',{'access_token':token,'order_id':order_id},before);
		check.success(function(data){
			console.log(data)
			if(data.meta.code=="200"){
				$('#btn-check_donasi').click()
				// don_open_check(3,true);
				var Account = data.data.Account_destination;
				var Payment = data.data.payment_method;
				var url = data.data.Payment_url;
				var total = data.data.Total_payment;
				$('#tot_don_pay').html(rupiah(total));
				if(url){
					$('#link_payment').show();
					$('#don_action').attr('onclick','call_payment(\''+order_id+'\',\''+url+'\')').html('Lanjutkan ke pembayaran')
					call_payment(order_id,url)
				}
				don_unverified();
			}else{
				alert(data.meta.error_message)
			}
		})
		check.error(function(data){
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function call_payment(orderid,data){
	var html = '';
	open_payment(data,function(res){
		console.log(res);
		order_id = orderid;
		list_donasi();
		don_open_check(3,true);
		//http://103.43.44.130:7575/apis/iNgawi/v3/donations/ionpay/callback?resultCd=0000&resultMsg=SUCCESS&bankVacctNo=0622028028&tXid=IONPAYTEST02201605110622028028&referenceNo=1605114391&transDt=20160511&transTm=062202&amount=104391&description=Deskripsi+donasi
		var a = getJsonFromUrl(res);
		don_unverified();
		if(a.bankVacctNo){
			// $('#don_help_va').show();
			var date = a.transDt;
			date = date.replace(/(\d\d\d\d)(\d\d)(\d\d)/g, '$2/$3/$1');
			html='<div style="border: 1px solid #ddd;border-radius:5px;margin: 0px 0px;font-size:12px;background: #fff;"> \
				<div class="red f14" style="border-bottom:1px solid #ddd">Nomor VA '+a.bankVacctNo+'</div>\
				<div style="padding:10px;">\
					<div>Transaction ID: '+a.tXid+'</div>\
					<div>No Ref: '+a.referenceNo+'</div>\
					<div>Tanggal Pemesanan: '+a.transDt+'</div>\
				</div>\
	        </div>'
	        App.Callback=html;
	        $('#bank_list').html(html).show();
	        html = '<div style="text-align:center">\
	        	<div class="red f12">Transaction ID : '+a.tXid+'</div>\
	       		<div class="divider"></div>\
	       		<div class="black f12"><b>Total Donasi Yang Harus Anda Bayar</b></div>\
	       		<div class="red f14">'+rupiah(don_tot)+'</div>\
	       		</div>';
	       	$('.box_conf').html(html);
	       	$('#don_3_checkout').css('border','').css('background','').css('margin-top','75px').css('padding','0');
			$('#don_akhir_ket').html('Silakan lakukan pembayaran ke nomor virtual akun di bawah ini untuk penyelesaian donasi')
			$('#don_akhir_ket').css('background','#fff').css('padding-top: 5px')
			$('#don_akhir_ket').css('border','1px solid #ddd').css('border-radius','5px');
			$('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Saya telah melakukan pembayaran')
		}else{
			$('#tot_').hide();
			$('#don_akhir_ket').hide();
			html='<div><img src="img/main/empty_donasi.png"></div>\
                <div style="font-size: 12px;padding: 10px 25px;color: #444;">Terima kasih telah melakukan pembayaran menggunakan kartu kredit Anda, bentuk kedulian Anda sangat berarti bagi Kami.</div>';
			$('#bank_list').html(html).show();
			$('#don_3_checkout').css('margin-top','').css('border','').css('background','transparent')
			$('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Tutup')
			// $('#don_action').attr('onclick',"$('#btn-close').click()").html('Tutup')
		}
		don_unverified();
		// html += '<table class="table" style="font-size:12px;text-align:left">\
		//     <tbody>';
		// 	html+='<tr><td>Result Code</td><td>'+a.resultCd+'</td></tr>'
		// 	html+='<tr><td>Result Message</td><td>'+a.resultMsg+'</td></tr>'
		// 	html+='<tr><td>Transaction ID</td><td>'+a.tXid+'</td></tr>'
		// 	if(a.bankVacctNo){
		// 		html+='<tr><td>Bank Vacct No</td><td>'+a.bankVacctNo+'</td></tr>'
		// 	}else{
		// 		html+='<tr><td>Authorization No</td><td>'+a.authNo+'</td></tr>'
		// 	}
		// 	html+='<tr><td>Reference No</td><td>'+a.referenceNo+'</td></tr>'
		// 	html+='<tr><td>Amount</td><td>'+rupiah(a.amount)+'</td></tr>'
		// 	html+='<tr><td>Date/Time</td><td>'+a.transDt+'/'+a.transTm+'</td></tr>'
		// 	html+='<tr><td>Description</td><td>'+a.description.replace(/[.*+?^${}()|[\]\\]/g, " ")+'</td></tr>'
		// html+= '</tbody>\
		//   </table>';
		// $('#bank_list').html(html).show();
		// $('#don_action').attr('onclick','donasi_confirm(\''+order_id+'\')').html('Saya telah melakukan pembayaran')
	})
}

function don_confirm(order_id){
	var token = localStorage.getItem('token')
	if(token){
		var before ='';
		var check = new majax_secure_empty(App.api.v3+'donations/donation_confirmation',{'access_token':token,'order_id':order_id},before);
		check.success(function(data){
			console.log(data)
			if(data.meta.code=="200"){
				don_open_check(3,true);
				var Account = data.data.Account_destination;
				var Payment = data.data.payment_method;
				var url = data.data.Payment_url;
				var total = data.data.Total_payment;
				$('#don_action').attr('onclick','alert("manual konfirmasi masih dalam proses")')
				$('#tot_don_pay').html(rupiah(total));
				if(url){
					$('#link_payment').show();
					$('#btn-link_pay').attr('onclick','open_payment(\''+url+'\')').html('Lanjutkan ke pembayaran')
				}
			}else{
				alert(data.meta.error_message)
			}
		})
		check.error(function(data){
			console.log(data)
		})
	}else{
		location.href="#/login"
	}
}

function don_unverified(status){
	var token = localStorage.getItem('token');
	if(status!=true){
		// var before = $("#list_confirm").html('<br><center><span class="fa fa-spin moco-load fa-4x red"></span></center>');
		var before = '';
	}else{
		var before = '';
	}
	var page = $('#list_confirm').attr('data-index')
	console.log(page)
	var html='';
	if(token){
		var check = new majax_secure_empty(App.api.v3+'donations/unverified_donations_notification',{'access_token':token,'per_page':'20','page':page},before);
		check.success(function(data){
			// console.log(data)
			if(data.meta.code=="200"){
				var Notif = data.data.Confirmations;
				if(data.data.total_result<20){
					$('#btn-loadmore_don_confirm').hide()
				}else{
					$('#btn-loadmore_don_confirm').show()
				}
				if(status==true){
					var angka = parseInt(data.data.current_page)+1
					console.log(angka)
					$('#list_confirm').attr('data-index',angka);
				}else{
					$('#list_confirm').attr('data-index',2);
				}
				$.each(Notif,function(){
				    var notif = this;
				    // console.log(this)
				    var a,b,name,image;
				    a = this.image
				    b = this.name
				    if(a){
				    	image = a;
				    }else{
				    	image = "img/icon/icon.png"
				    }
				    if(b){
				    	name = b;
				    }else{
				    	name = "iNgawi"
				    }
				    html+='<div class="col-xs-12 col-md-12 pointer" onclick="donasi_confirm(\''+notif.Order_ID+'\',\''+notif.id+'\')" style="min-height:37px;">\
				    		<div class="col-xs-3 col-md-3 p0"><img class="icon-circle" src="'+image+'" style="" onerror="AvaError(this)"></div>\
	          				<div class="col-xs-9 col-md-9 p0">\
	          					<div><span class="f13 blue">'+name+' </span><span class="f10 grey">'+timeago(notif.elapsed_time)+'</span></div>\
	          					<div class="f11">'+notif.message+'</div>\
	          				</div>\
	          			</div>\
				    </div><div class="divider col-xs-12 col-md-12"></div>'
				});
				if(status==true){
					$('#list_confirm').append(html)
				}else{
					$('#list_confirm').html(html)
				}
			}else{
				console.log(data.meta.error_message)
				if(status!=true){
					$('#list_confirm').html('<center class="f12 p10" style="margin-bottom:10px;">'+data.meta.error_message+'</center>')
				}
				$('#btn-loadmore_don_confirm').hide()
			}
		})
		check.error(function(data){
			console.log(data)
			$('#btn-loadmore_don_confirm').hide()
		})
	}else{
		$('#btn-loadmore_don_confirm').hide()
	}

}
function donasi_confirm(order_id,id){
	var html = '';
	var html1 = '';
	var html2 = '';
	///apis/iNgawi/v3/donations/confirmation_detail
	var token = localStorage.getItem('token');
	var before ='';
	var check = new majax_secure_empty(App.api.v3+'donations/confirmation_detail',{'access_token':token,'order_id':order_id},before);
	check.success(function(data){
		// console.log(data)
		if(data.meta.code=="200"){
			setTimeout(function(){
				$('#btn-conf_donasi').click();
				var order = data.data.order;
				var book = data.data.donation_books;
				var Account = data.data.Account_destination;
				var Callback = data.data.data_callback;

				$('#don_resettrx').attr('onclick','don_reset_trx(\''+order_id+'\')')
				html1 +='<div>Silakan lakukan pembayaran kesalah satu rekening di bawah ini agar proses transaksi dapat dilanjutkan</div><br>'
				$('#status_bayar').html(order.status_pembayaran);
				console.log(order.status_pembayaran)
				if(order.status_pembayaran=="Dalam Verifikasi"){
					// $('#status_bayar').html('Terverifikasi')
				}
				if(order.status_pembayaran!="Dalam Verifikasi"){
                  	$('.btn-panduan').hide();
                  	$('#status_bayar').removeClass('red').addClass('blue')
                  	$('#conf_ket_don').html('Pembayaran Anda telah Kami terima. Terima kasih atas partisipasi Anda dalam mencerdaskan bangsa')
                }else{
                	$('.btn-panduan').show();
                }
                if(Account){	
					$.each(Account,function(){
				        var bank = this;
				        html1 +='<div style="padding-bottom:10px;">\
		                    <div class="black f12"><b>'+bank.bank_name+'</b></div>\
		                    <div class="black f12"><b>'+bank.account_number+'</b></div>\
		                    <div class="f10">'+bank.bank_branch+'</div>\
		                  </div>'
				    });
				}else{
					if(Callback){
						if(Callback.bank_tutorial){
							html1 = Callback.bank_tutorial;
						}
					}else{
						html1='';
					}
				}
			    App.bank = html1;
				if(order.payment_method=="Virtual Account"){
				    if(order.status_pembayaran!="Dalam Verifikasi"){
				    	if(Callback){
				   //  		var html2 ='<div class="red f14" style="border-bottom:1px solid #ddd;text-align:center">Transaction ID : '+Callback.tXid+'</div>\
							// <div style="padding:10px;text-align:center" class="f12">\
							// 	<div><b>Total Donasi Yang Anda Bayar</b></div>\
							// 	<div class="red f14">'+rupiah(order.total_bayar)+'</div>\
							// </div>'
							var html2 = '<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Transaction ID : <span id="con_order_id">'+Callback.tXid+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Total Pembayaran</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi" class="red">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
						}else{
							// var html2 ='<div class="red f14" style="border-bottom:1px solid #ddd;text-align:center">Order ID : '+order.order_id+'</div>\
							// <div style="padding:10px;text-align:center" class="f12">\
							// 	<div><b>Total Donasi Yang Anda Bayar</b></div>\
							// 	<div class="red f14">'+rupiah(order.total_bayar)+'</div>\
							// </div>'
							var html2 = '<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Total Pembayaran</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi"  class="red">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
						}
				    }else{
				    	var html2 ='<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Tanggal Transaksi</div>\
		                    <div>Batas Akhir</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi">'+dateFormat(order.tanggal_transaksi,'dd mmmm yyyy')+'</div>\
		                    <div id="tgl_akhir"><b>'+dateFormat(order.batas_akhir,'dd mmmm yyyy')+'</b></div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12" style="border-color: #4D4B8C;display:none"></div>\
		                  <div class="col-xs-6 col-md-6 p0" style="padding-top:5px;">\
		                    <div class="f12"><b>Total Pembayaran</b></div>\
		                  </div>\
		                  <div class="col-xs-6 col-md-6 p0" style="text-align: right;padding-top:5px;">\
		                    <div class="f12 red" id="tot_transaksi" style="">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
				    }
                  	
                  	App.temp = html2;

                  	$('.box_conf').html(html2);
                  	setTimeout(function(){
	              	    $('.btn-panduan').html('Panduan Rekening Tujuan Pembayaran')
	               	})
				}else if(order.payment_method=="Kartu Kredit"){
					$('.btn-panduan').hide();
					if(order.status_pembayaran!="Dalam Verifikasi"){
				    	if(Callback){
				   //  		var html2 ='<div class="red f14" style="border-bottom:1px solid #ddd;text-align:center">Transaction ID : '+Callback.tXid+'</div>\
							// <div style="padding:10px;text-align:center" class="f12">\
							// 	<div><b>Total Donasi Yang Anda Bayar</b></div>\
							// 	<div class="red f14">'+rupiah(order.total_bayar)+'</div>\
							// </div>'
							var html2 = '<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Transaction ID : <span id="con_order_id">'+Callback.tXid+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Total Pembayaran</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi" class="red">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
						}else{
							// var html2 ='<div class="red f14" style="border-bottom:1px solid #ddd;text-align:center">Order ID : '+order.order_id+'</div>\
							// <div style="padding:10px;text-align:center" class="f12">\
							// 	<div><b>Total Donasi Yang Anda Bayar</b></div>\
							// 	<div class="red f14">'+rupiah(order.total_bayar)+'</div>\
							// </div>'
							var html2 = '<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Total Pembayaran</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi" class="red">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
						}
				    }else{
				    	var html2 ='<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Tanggal Transaksi</div>\
		                    <div>Batas Akhir</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi">'+dateFormat(order.tanggal_transaksi,'dd mmmm yyyy')+'</div>\
		                    <div id="tgl_akhir"><b>'+dateFormat(order.batas_akhir,'dd mmmm yyyy')+'</b></div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12" style="border-color: #4D4B8C;display:none"></div>\
		                  <div class="col-xs-6 col-md-6 p0" style="padding-top:5px;">\
		                    <div class="f12"><b>Total Pembayaran</b></div>\
		                  </div>\
		                  <div class="col-xs-6 col-md-6 p0" style="text-align: right;padding-top:5px;">\
		                    <div class="f12 red" id="tot_transaksi" style="">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
				    }
                  	
                  	App.temp = html2;

                  	$('.box_conf').html(html2);
				}else{
					if(order.status_pembayaran!="Dalam Verifikasi"){
						// var html2 ='<div class="red f14" style="border-bottom:1px solid #ddd;text-align:center">Order ID : '+order.order_id+'</div>\
						// <div style="padding:10px;text-align:center" class="f12">\
						// 	<div><b>Total Donasi Yang Anda Bayar</b></div>\
						// 	<div class="red f14">'+rupiah(order.total_bayar)+'</div>\
						// </div>'
						var html2 = '<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Total Pembayaran</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi" class="red">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
				    }else{
				    	var html2 ='<div class="f11 col-xs-6 col-md-6 p0" style="padding-bottom:10px;">\
		                  <div class="red" >Order ID : <span id="con_order_id">'+order.order_id+'</span></div>\
		                  </div>\
		                  <div class="f12 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div class="red" id="metode_transaksi">'+order.payment_method+'</div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12"></div>\
		                  <div class="f11 col-xs-6 col-md-6 p0">\
		                    <div>Tanggal Transaksi</div>\
		                    <div>Batas Akhir</div>\
		                  </div>\
		                  <div class="f11 col-xs-6 col-md-6 p0" style="text-align: right">\
		                    <div id="tgl_transaksi">'+dateFormat(order.tanggal_transaksi,'dd mmmm yyyy')+'</div>\
		                    <div id="tgl_akhir"><b>'+dateFormat(order.batas_akhir,'dd mmmm yyyy')+'</b></div>\
		                  </div>\
		                  <div class="divider col-xs-12 col-md-12" style="border-color: #4D4B8C;display:none"></div>\
		                  <div class="col-xs-6 col-md-6 p0" style="padding-top:5px;">\
		                    <div class="f12"><b>Total Pembayaran</b></div>\
		                  </div>\
		                  <div class="col-xs-6 col-md-6 p0" style="text-align: right;padding-top:5px;">\
		                    <div class="f12 red" id="tot_transaksi" style="">'+rupiah(order.total_bayar)+'</div>\
		                  </div>';
				    }
                  	App.temp = html2;
                  	$('.box_conf').html(html2);
				}
				
			    // App.Bank = html1;
				$.each(book,function(){
		        	var book = this;
		        	html+='<div class="don_list_b" id="don_list_b'+book.donation_box_id+'" style="background:#fff">\
		        		<div class="col-md-12 col-lg-12 col-md-12" style="height: 100px;padding-top: 0px;padding-left:0;">\
		                  <div class="col-md-3 col-xs-3 col-lg-3" style="padding-left: 0px"><img src="'+book.cover+'" id="don_cover1" onerror="CovError(this)" style="max-height: 100px;max-width:80px;"></div>\
		                  <div class="col-md-9 col-xs-9 col-lg-9" style="padding-left: 0;line-height:1.5">\
		                    <div class="f14" id="don_title1">'+limitCharacter(book.title,25)+'</div>\
		                    <div class="f10" id="don_author1">by <span class="blue">'+limitCharacter(book.authors,40)+'</span></div>\
		                    <div class="f10 p5" id="don_toepustaka1">to <span class="">'+limitCharacter(book.to_epustaka,40)+'</span></div>\
		                    <div class="f10" id="don_copy1">Copy: '+book.qty+' x '+book.price+' = <span class="red">'+rupiah(book.price*book.qty)+'</span></div>\
		                    <div class="f10 red p5" style="display:none" onclick="don_p_book('+book.book_id+','+book.donation_box_id+','+book.epustaka_id+','+book.qty+')">Sunting</div>\
		                  </div>\
		                  <div class="pointer moco-cross red f10" style="position:absolute; top: 4px;right:4px;display:none" onclick="don_delete('+book.donation_box_id+','+book.price*book.qty+')"></div>\
		                </div>\
		                </div>';
		    	});
		    	App.Book = html;
		    	$('#don_list_book1').html(html);
		    })
		}else{
			alert(data.meta.error_message)
		}
	})
	check.error(function(data){
		console.log(data)
	})
	setTimeout(function(){
		$('#don_action1').attr('onclick','upload_confirmation(\''+order_id+'\',\''+id+'\')');
	})
}

function upload_confirmation(order,id){
	gui.Shell.openExternal('mailto:admin@ingawi.id?Subject="Konfirmasi Donasi"');
}

function upload_confirmation_old(order,id){
	var token = localStorage.getItem('token');
	$('#fileDialog1').click()
	$('input[type=file]').change(function () {
		var filePath=$('#fileDialog1').val(); 
		// console.log(filePath)
		// canvas_foto(filePath)
		getDataUri(filePath, function(dataUri) {
		    // console.log(dataUri);
		    var request = App.api.v3+'donations/upload_confirmation?access_token='+token+'&id_donation='+id;  
      		var ajax = new XMLHttpRequest();
		    ajax.open("POST",request,true);  
			ajax.setRequestHeader('Content-Type', 'canvas/upload');  
			setTimeout(function() {  ajax.abort()  },9000000);
			ajax.onreadystatechange = function (oEvent) {  
			if (ajax.readyState === 4) {  
			    if (ajax.status === 200) {  
			      // console.log(ajax.responseText) ;
			      var obj = JSON.parse(ajax.responseText);
			      // console.log(obj)
			      App.Success_Alert = "Sukses"
			      App.Success_Content= obj.data;
			      $('#success').click();
			  } else {  
			    console.log("Error", ajax.statusText); 
			    App.Failed_Alert="Oops!";
			    App.Failed_Content="Network Problem";
			    $('#failed').click();
			    setTimeout(function(){
			      $('#act_try').removeAttr('data-ember-action').attr('onclick','donasi_confirm(\''+order+'\',\''+id+'\')')
			    })
			  }  
			}  
			};
			ajax.send(dataUri);
		});
	});
}

function open_payment(link,callback) {
	// var url = require('url');
	var loginWindow = gui.Window.open(link, {
		focus:true,
		position:'center',
		toolbar:false,
		title:'Payment',
		icon:'img/icon/icon.png'
	});
	var out = {};
	loginWindow.addListener('loaded', function(){
		try{
			var login = loginWindow;
			var a = loginWindow.window.location.href.split('donations/ionpay/callback?')
			// console.log(login)
			if(a[1]){
				console.log(location.href)
				loginWindow.close();
				callback(a[1]);
				// var  a = loginWindow.window.location.href.split('bankVacctNo=')
				// if(a[1]){
				// 	//virtual akun
				// 	console.log('virtual akun')
				// 	setTimeout(function(){
				// 		document.body.innerHTML += '<br\><center style="font-size:12px;">Silakan lanjutkan dengan melakukan transfer ke alamat virtual akun diatas <br\> Terima kasih<br\><br\><button onclick="login.close()">OK</button></center>';
				// 	},1000)
				// }else{
				// 	console.log('kartu kredit')
				// 	var  a = loginWindow.window.location.href.split('bankVacctNo=')
				// 	//cc
				// 	loginWindow.close()
				// 	alert('Terima kasih atas partisipasinya dalam melakukan donasi')
				// }
			}
		}catch(e){
		  	console.log(e.message)
		}
		console.log(a)
		if(a[1]){
			// loginWindow.close();
			// callback(a)
		}
	});
}

function getDataUri(url, callback) {
    var image = new Image();
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        // callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };
    image.src = url;
}


//CC
//http://103.43.44.130:7575/apis/iNgawi/v3/donations/ionpay/callback?resultCd=0000&resultMsg=SUCCESS&authNo=CardApv123&tXid=IONPAYTEST01201605110619428027&referenceNo=1605119771&transDt=20160511&transTm=061942&amount=104771&description=Deskripsi+donasi

//VA
//http://103.43.44.130:7575/apis/iNgawi/v3/donations/ionpay/callback?resultCd=0000&resultMsg=SUCCESS&bankVacctNo=0622028028&tXid=IONPAYTEST02201605110622028028&referenceNo=1605114391&transDt=20160511&transTm=062202&amount=104391&description=Deskripsi+donasi