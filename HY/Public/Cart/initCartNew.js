var tcart = {
	tc : getParam("tc"),
	getItem : function(sku,pc) {
		return sku ? ('<div class="p-item">'+
						'<div class="p-img">'+
							'<a href="//item.jd.com/'+sku.id+'.html'+ (sku.dist == "jd"? "?dist=jd": "") + '"  target="_blank"><img src="//img10.360buyimg.com/cms/s60x60_'+sku.imgUrl+'" clstag="pageclick|keycount|201601152|11"/></a>'+
						'</div>'+
						'<div class="p-info">'+
							'<div class="p-name">'+
								'<a href="//item.jd.com/'+sku.id+'.html'+ (sku.dist == "jd"? "?dist=jd": "") + '"  target="_blank" clstag="pageclick|keycount|201601152|2" title="'+sku.name+'">'+(sku.samGoods ? '<em class="project-sam-icon project-sam-icon-b mr5"></em>' : '')+sku.name+'</a>'+
							'</div>'+
							'<div class="p-extra">'+
								(sku.color ? ('<span class="txt" title="'+sku.color+'">颜色：'+sku.color+'</span>') : "")+
								(sku.size ? ('<span class="txt" title="'+sku.size+'">尺码：'+sku.size+'</span>') : "")+
								(sku.lsid ? ('<span class="txt txt-l" id="'+sku.lsid+'"></span>'):"")+
								'<span class="txt">'+
									((sku.color||sku.size||sku.lsid) ? "/" : "")+'  数量：'+pc+
								'</span>'+
							'</div>'+
						'</div>'+
						'<div class="clr"></div>'+
					'</div>') : "";
	},
	getResult : function(addItemSuccess, sku , pid, pc) {
		return $('<div class="m succeed-box'+(addItemSuccess ? "" : " fail-box")+'">'+
					'<div class="mc success-cont">'+
						'<div class="success-lcol">'+
							'<div class="success-top">'+
								'<b class="'+(addItemSuccess ? "succ" : "error")+'-icon"></b>'+
								'<h3 class="ftx-0'+(addItemSuccess ? "2" : "1")+'">'+(addItemSuccess ? "商品已成功加入购物车！" : "添加购物车失败,请返回重试")+'</h3>'+
							'</div>'+
							this.getItem(sku , pc)+
						'</div>'+
						'<div class="success-btns success-btns-new">'+
							'<div class="success-ad">'+
								'<a href="#none"></a>'+
							'</div>'+
							'<div class="clr"></div>'+
							'<div>'+
								'<a class="btn-tobback" href="//item.jd.com/'+pid+'.html'+ ((sku && sku.dist == "jd")? "?dist=jd": "") + '"  target="_blank" clstag="pageclick|keycount|201601152|3">'+(addItemSuccess?"查看":"返回")+'商品详情</a>'+
								'<a class="btn-'+(addItemSuccess ? "addto" : "view")+'cart" href="//cart.jd.com/cart.action?r='+Math.random()+'" id="GotoShoppingCart" clstag="pageclick|keycount|201601152|4"><b></b>'+(addItemSuccess ? "去购物车结算" : "查看购物车")+'</a>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>');
	},
	//google 统计 by google tag  manager
	googleCode : function(sku) {
		try {
			var google_tag_params = {
				ecomm_prodid : [sku.id],
				ecomm_pagetype : ['cart'],
				ecomm_pname : [sku.name],
				ecomm_pcat : [sku.cid],
				ecomm_pvalues : [sku.discountedPrice],
				ecomm_pbrand : ['']
			};
			dataLayer.push({
						'event' : 'addToCart',
						'google_tag_params' : google_tag_params
					});
		} catch (e) {
		}
	},
	//购物车营销日志
	marketLog:function(sku){
		try{
			var location = $.jCookie("ipLoc-djd");
			if(location != null){
				var locIds = location.split("-");
				if(locIds.length == 3){
					location += "-0";
				}
			}
			var __jda = readCookie("__jda");
			var uuid = __jda ? __jda.split(".")[1] : false;
			setTimeout(function(){("undefined" != typeof log) && log("item","010002",uuid,$.jCookie("pin"),location,sku.id+"_"+sku.discountedPrice,"add");},500);
		}catch(e){}
	},
	//加载商品
	loadAddedProduct : function(pid,pc,addItemSuccess,dist,lsid){
		if(this.tc){
			$("#result").html(this.getResult(true,null,pid,pc));
			return;
		}
		var me = this;
		jQuery.ajax({
			type : "POST",
			dataType : "json",
			url : PurchaseAppConfig.Domain+"/tproduct?pid="+pid+"&rid="+Math.random(),
			success : function(result) {
				if (result && result.success && result.lastAddedSku) {
					me.writeMarketLog(result.lastAddedSku);
					dist && (result.lastAddedSku.dist = dist);
					lsid && (result.lastAddedSku.lsid = lsid);
					$("#result").html(me.getResult(addItemSuccess,result.lastAddedSku,pid,pc));
					me.locShopInfo(result.lastAddedSku.lsid);
				} else {
					$("#result").html(me.getResult(addItemSuccess,null,pid,pc));
				}
			},
			error:function(XMLHttpResponse){
			   $("#result").html(me.getResult(addItemSuccess,null,pid,pc));
			}
		});
	},
	// 推荐
	loadRecommend : function() {
		if(window.location.pathname == '/toCart.html' || !nr){
			seajs.use(['user/cart/js/recommend-cart'], function(rc){
				function recommend(){
					var pin = readCookie('pin')?decodeURI(readCookie('pin')):"";
					var pid = getParam("pid");
					rc.recAlsoBuy(pin,pid,'#similar',function(){});
					setTimeout(function(){rc.recMayNeedBuy(pin,pid,'#promotion',function(){});}, 900);
				}
				recommend();
			});
		}else{
			seajs.use(['user/cart/js/recommend-cart-201608'], function(rc){
				var pin = readCookie('pin')?decodeURI(readCookie('pin')):"";
				var pid = getParam("pid");
				rc.recAlsoBuy(pin,pid,'#similar',
					function(){
						rc.recMayNeedBuy(pin,pid,'#promotion',function(){});
					}
				);
			});
		}
	},
	loadWhatBuy : function(){
		var pid = getParam("pid");
	  	seajs.use(['user/cart/js/recommend-whatbuy'], function(whatBuy){
	  		whatBuy.recommendWhatBuy('#whatbuy',pid,function(){});
	  	});
	},
	// 电子书
	loadEbook:function(){
		seajs.use(['user/cart/js/ebookcard-addCart'], function(ebookcard){
		    ebookcard('#ebook', function(){});
		});
	},
	// 添加成功
	showAddSucTip : function(target,isEbook) {
		var sucTip ;
		if($(target).parent().next().length){
			sucTip = $(target).parent().next();
			sucTip.show();
		}else{
			sucTip = $('<div class="addsucc-tips'+(isEbook ? "-card" : "")+'"><i></i><span>成功加入购物车</span></div>');
			$(target).parent().after(sucTip);
		}
		sucTip.fadeOut(3000);
	},
	// 添加失败
	loadFailTip :function(){
		var me = this ;
		seajs.use(['jdf/1.0.0/ui/dialog/1.0.0/dialog'],function(){ 
			function showFailTip(message){
			    $('body').dialog({
			        title:'添加失败', 
			        autoUpdate:true,
			        width: 400,
			        source:'<div class="addtocart-error-cont"><div class="addtocart-error"><i></i><span>'+message+'</span></div><span class="cls-btn">关闭</span></div>',
			        onReady: function(){$('.cls-btn').click(function(){$.closeDialog();})},
			        autoCloseTime:5
			    }); 
			}
			me.showFailTip = showFailTip;
		}); 
	},
	isAddItemSuccess : function(returnCode,isAlert) {
		if (returnCode == "2") {
			if(isAlert){
				alert("添加商品失败,已超出购物车最大容量!");
			}
			return false ;
		} else if (returnCode == "3") {
			if(isAlert){
				alert("添加商品失败,商品数量不能大于" + getParam("em"));
			}
			return false ;
		} else if (returnCode == "0") {
			if(isAlert){
				alert("添加商品失败!");
			}
			return false ;
		}
		return true ;
	},
	locShopInfo: function (lsid) {
		try {
			if (lsid) {
				jQuery.ajax({
					type : "POST",
					dataType : "json",
					url : PurchaseAppConfig.Domain+"/loadShopInfo"+"?lsids="+lsid+"&rid="+Math.random(),
					success : function(result) {
						if(result && result.locShopInfoResult){
							$("span[id=" + lsid + "]").html("门店：" + result.locShopInfoResult[lsid]);
							$("span[id=" + lsid + "]").attr("title", result.locShopInfoResult[lsid]);
						}
					},
					error:function(XMLHttpResponse){
					}
				});
			}
		} catch(e) {}
	},
	writeMarketLog: function (lastAddedSku) {
		try {
			if (lastAddedSku.discountedPrice && lastAddedSku.discountedPrice > 0) {
				me.marketLog(lastAddedSku);
				me.googleCode(lastAddedSku);
				return;
			}
			var me = this;
			if (lastAddedSku) {
				jQuery.ajax({
		            type  : "POST",
		            dataType : "json",
		            url   : '//p.3.cn/prices/mgets?callback=?',
		            data  : {skuIds : "J_" + lastAddedSku.id, source : "cartfe", random : Math.random()},
		            success : function(result) {
		            	if(result && result[0] && result[0].p && result[0].p > 0){
		            		lastAddedSku.discountedPrice = result[0].p;
		            		me.marketLog(lastAddedSku);
							me.googleCode(lastAddedSku);
		            	}
		            },
		            error:function(XMLHttpResponse){
		            }
		        });
			}
		} catch(e) {}
	},
	init:function(){
		var me = this;
		try{me.loadAddedProduct(getParam("pid"),getParam("pc"),me.isAddItemSuccess(getParam("rcd")),getParam("dist"),getParam("lsid"));}catch(e){}
		try{me.loadRecommend();}catch(e){}
		try{if(!getParam("wb")){me.loadWhatBuy();}}catch(e){}
		try{me.loadEbook();}catch(e){}
		try{setTimeout(function(){me.isAddItemSuccess(getParam("rcd"),true);},500);}catch(e){}
		me.loadFailTip();
	}
};

/**
 * 过渡页添加商品
 */
function AddProduct(id,count,target,isEbook){
	$.getJSON(PurchaseAppConfig.Domain+"/gate.action?rd="+Math.random(),"f=3&pid="+id+"&ptype=1&pcount="+count+ "&callback=?",function(result){
		if(result && result.l == 1){
			window.location.href= "https://passport.jd.com/uc/login";
			return;
		}
        if(result && result.url){
            window.location.href= result.url;
            return;
        }
        var success = (result != null && tcart.isAddItemSuccess(result.rcd));
		tcart.loadAddedProduct(id,count,success);
		if(success){
			tcart.showAddSucTip(target,isEbook)
		}else{
	        var failMsg = (result && result.rcd=="2") ? "添加商品失败,已超出购物车最大容量!" : "添加商品失败!";
	        tcart.showFailTip(failMsg);
		}
	});
}
$(function(){
	tcart.init();
});