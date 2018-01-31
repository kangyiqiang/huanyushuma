define("cookie",function(require,exports,module){exports.get=getCookie;exports.set=setCookie;exports.getC=getCookieV2;exports.setC=setCookieV2;exports.del=delCookie;function getCookie(name){var reg=new RegExp("(^| )"+name+"(?:=([^;]*))?(;|$)"),val=document.cookie.match(reg);return val?(val[2]?unescape(val[2]):""):null;}
function getCookieV2(name){var reg=new RegExp("(^| )"+name+"(?:=([^;]*))?(;|$)"),val=document.cookie.match(reg);return val?(val[2]?decodeURIComponent(val[2]):""):null;}
function setCookie(name,value,expires,path,domain,secure){var exp=new Date(),expires=arguments[2]||null,path=arguments[3]||"/",domain=arguments[4]||null,secure=arguments[5]||false;expires?exp.setMinutes(exp.getMinutes()+parseInt(expires)):"";document.cookie=name+'='+escape(value)+(expires?';expires='+exp.toGMTString():'')+(path?';path='+path:'')+(domain?';domain='+domain:'')+(secure?';secure':'');}
function setCookieV2(name,value,expires,path,domain,secure){var exp=new Date(),expires=arguments[2]||null,path=arguments[3]||"/",domain=arguments[4]||null,secure=arguments[5]||false;expires?exp.setMinutes(exp.getMinutes()+parseInt(expires)):"";document.cookie=name+'='+encodeURIComponent(value)+(expires?';expires='+exp.toGMTString():'')+(path?';path='+path:'')+(domain?';domain='+domain:'')+(secure?';secure':'');}
function delCookie(name,path,domain,secure){var value=getCookie(name);if(value!=null){var exp=new Date();exp.setMinutes(exp.getMinutes()-1000);path=path||"/";document.cookie=name+'=;expires='+exp.toGMTString()+(path?';path='+path:'')+(domain?';domain='+domain:'')+(secure?';secure':'');}}});
define('formatJson', function(require, exports, module){
    var _formatJson_cache = {};
	
	$formatJson=function(str, data){
   	 	/* 模板替换,str:模板id或者内容，data:数据内容
			\W：匹配任何非单词字符。等价于 '[^A-Za-z0-9_]'。 
			如果是id,并且cache中有值，直接返回，否则获取innerHTML，再次解析；
			如果不是id，解析并存入cache
		 */
		var fn = !/\W/.test(str)?
			_formatJson_cache[str]=_formatJson_cache[str] || $formatJson(document.getElementById(str).innerHTML) :
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +
					"with(obj){p.push('" +str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") + "');}return p.join('');");
		return data ? fn( data ) : fn;
	}

	exports.render = $formatJson;
});
define('jquery.mpopup',function(require,exports,module){var jQuery=$=require("jquery");var Mpopup=function(options){this.options=$.extend({},Mpopup.defaults,options);this._init();}
Mpopup._list={};Mpopup.prototype={constructor:Mpopup,_init:function(){var opts=this.options,cls=opts.className,self=this;this.id=opts.id||'Mpopup'+new Date().getTime();if(Mpopup._list[this.id]){this.$popup=$('#'+this.id);}else{Mpopup._list[this.id]=this;if($('#'+this.id).length==0){this._create();}}
this._getPopupElem();this.$popup.css(opts.css||{});this.$popup.addClass(this.options.setClass||'')
this.hasMask=opts.mask;this.onShow=opts.onShow;this.onClose=opts.onClose;this.onConfirm=opts.onConfirm;this.buttonsTxt=opts.buttonsTxt;this._bindEvent();if(opts.autoClose){window.setTimeout(function(){self.close(this.toggleClass);},opts.autoClose);}},_getPopupElem:function(){var opts=this.options;if(opts.id==''){var $popup=$('#'+this.id).children().eq(0);}else{var $popup=$('#'+this.id);}
this.$popup=$popup;},_bindEvent:function(){var self=this;this.$popup.find('[data-mpopup-close]').on('click',function(e){e.preventDefault;self.close();});this.confirm();},_create:function(){var opts=this.options,contentTpl=opts.contentTpl,contentTxt=opts.contentTxt,appendTo=opts.popupAppendTo==''?'body':opts.popupAppendTo,popupTpl='',icoHtml='',buttonsHtml='',contentHtml='',popupHtml='';if(opts.icoType!==''){icoHtml=this._getIcoHtml();}else{icoHtml='';}
if(opts.type=='tip'){popupTpl='<div class="mod_layer mod_tip">{#icoType#}{#contentTxt#}</div>';popupHtml=popupTpl.replace(/\{#icoType#\}/,icoHtml).replace(/\{#contentTxt#\}/,contentTxt);}else{popupTpl='<div class="mod_layer">{#content#}</div>';buttonsHtml=this._getButtonsHtml();contentHtml=contentTpl.replace(/\{#contentTxt#\}/,contentTxt).replace(/\{#icoType#\}/,icoHtml).replace(/\{#buttons#\}/,buttonsHtml);popupHtml=popupTpl.replace(/\{#content#\}/,contentHtml);}
var html='<div id="'+this.id+'" >'+popupHtml+'</div>';$(html).appendTo(appendTo);},_getIcoHtml:function(){var opts=this.options;for(var i in opts.icoTypeGroup){if(this.options.icoType==opts.icoTypeGroup[i].type){return opts.icoTypeGroup[i].tpl;}}},_getButtonsHtml:function(){var opts=this.options;var buttonsHtml='';if(opts.buttonsTxt.length==1){var buttonTxt=opts.buttonsTxt[0]||'确认';buttonsHtml='<a class="layer_btn one" href="###" data-mpopup-close>{#buttonsTxt#}</a>';buttonsHtml=buttonsHtml.replace(/\{#buttonsTxt#\}/,buttonTxt);}else if(opts.buttonsTxt.length==2){buttonsHtml='<a class="layer_btn" href="###" data-mpopup-close>{#btnClose#}</a><a class="layer_btn" href="###" data-mpopup-confirm>{#btnConfirm#}</a>';var btnClose=opts.buttonsTxt[0]||'取消';var btnConfirm=opts.buttonsTxt[1]||'确认';buttonsHtml=buttonsHtml.replace(/\{#btnClose#\}/,btnClose).replace(/\{#btnConfirm#\}/,btnConfirm);}
return buttonsHtml;},setContent:function(tpl){var opts=this.options;if(opts.contentAppendTo==''){return;}
if(!tpl){this.$popup.find(opts.contentAppendTo).html(opts.contentTpl);}else{this.$popup.find(opts.contentAppendTo).html(tpl);}
return this;},show:function(clsName){if(this.isShow){return;}
var opts=this.options;var $popup=this.$popup;var marginTp=-Math.floor($popup.height()/2);var marginLt=-Math.floor($popup.width()/2);$popup.css({"margin-top":marginTp,"margin-left":marginLt});if(clsName!==undefined){this.toggleClass=clsName;setTimeout(function(){$popup.toggleClass(clsName);},0);}else{if(opts.toggleCls!==''){this.toggleClass=opts.toggleCls;var toggleCls=opts.toggleCls;setTimeout(function(){$popup.toggleClass(toggleCls);},0);}else{$popup.show();}}
if(typeof this.onShow==='function'){this.onShow($('#'+this.id));}
this.$popup.trigger('show:mpopup',[this.$popup]);if(this.hasMask){Mpopup.mask.show();}
this.isShow=true;return this;},confirm:function(){var self=this;var opts=self.options;self.$popup.find('[data-mpopup-confirm]').on('click',function(e){e.preventDefault;if(typeof self.onConfirm==='function'){self.onConfirm($('#'+self.id));return;}
if(opts.destroyAfterClose){self.destory();}else{self.hide();}
self.$popup.trigger('confirm:mpopup',[self.$popup]);});return this;},hide:function(){if(!this.isShow){return;}
var opts=this.options;var $popup=this.$popup;var closeMask=true;if(this.toggleClass!==undefined){$popup.toggleClass(this.toggleClass);}else{$popup.hide();}
if(this.hasMask){for(id in Mpopup._list){var instance=Mpopup._list[id];if(instance!==this&&instance.hasMask&&instance.isShow){closeMask=false;break;}}
if(closeMask){closeMask&&Mpopup.mask.hide();}}
this.isShow=false;this.$popup.trigger('hide:mpopup',[this.$popup]);return this;},close:function(){var opts=this.options;if(typeof this.onClose==='function'){this.onClose($('#'+this.id));}
if(opts.destroyAfterClose){this.destory();}else{this.hide();}
this.$popup.trigger('close:mpopup',[this.$popup]);},destory:function(){var self=this;var opts=this.options;var $popup=this.$popup;this.hide();if(this.toggleClass){if($popup.css('-webkit-transition-duration')!=='0s'){$popup.on('webkitTransitionEnd',function(){if(!Mpopup._list[self.id]){return;}
$('#'+self.id).remove();delete Mpopup._list[self.id];},false);}else{$('#'+this.id).remove();delete Mpopup._list[this.id];}}else{$('#'+this.id).remove();delete Mpopup._list[this.id];}
this.$popup.trigger('destory:mpopup',[]);},css:function(style){this.$popup.css(style);return this;}}
Mpopup.mask={isShow:false,layer:null,show:function(){if(this.isShow){return;}
if(!this.layer){this.layer=$('<div />').css({position:'fixed',left:0,top:0,height:'100%',width:'100%',background:'#000',opacity:'0.2',zIndex:999}).appendTo('body');}
this.layer.show();this.isShow=true;},hide:function(){if(!this.isShow||!this.layer){return;}
this.layer.hide();this.isShow=false;},setStyle:function(background,opacity){this.layer.css({background:background,opacity:opacity});},setZIndex:function(zIndex){this.layer.css('z-Index',zIndex);}}
Mpopup.defaults={id:'',type:'confirm',popupAppendTo:'',popupTpl:{'confirm':'<div class="mod_layer">{#content#}</div>','tip':'<div class="mod_layer mod_tip">{#content#}</div>'},contentTpl:'<div class="mod_layer_hd"><i class="close_ico" data-mpopup-close></i></div><div class="mod_layer_bd">{#icoType#}{#contentTxt#}</div><div class="mod_layer_ft">{#buttons#}</div>',contentAppendTo:'.mod_layer',content:'',contentTxt:'',toggleCls:'show',css:null,setClass:null,mask:true,destroyAfterClose:false,autoClose:false,zIndex:null,icoType:'success',icoTypeGroup:[{type:'success',tpl:'<i class="suc_ico"></i>'},{type:'failed',tpl:'<i class="failed_ico"></i>'}],buttonsTxt:['取消','确认'],onConfirm:null,onShow:null,onClose:null};window.Mpopup=Mpopup;$.mpopup=function(options){return new Mpopup(options);}})
define('loadUrl',function(require,exports,module){function $loadUrl(o){o.element=o.element||'script';var el=document.createElement(o.element);el.charset=o.charset||'utf-8';o.onBeforeSend&&o.onBeforeSend(el);el.onload=el.onreadystatechange=function(){if(/loaded|complete/i.test(this.readyState)||navigator.userAgent.toLowerCase().indexOf("msie")==-1){o.onload&&o.onload();clear();}};el.onerror=function(){clear();};el.src=o.url;document.getElementsByTagName('head')[0].appendChild(el);function clear(){if(!el){return;}
el.onload=el.onreadystatechange=el.onerror=null;el.parentNode&&(el.parentNode.removeChild(el));el=null;}}
exports.get=$loadUrl;});
define('md.address',function(require,exports,module){var $=require('jquery'),mFormatJson=require('formatJson'),addr_code=addrCode.split(','),addr_text=addrText.split(',');var address={provinceFlag:false,cityFlag:false,areaFlag:false,areaSelectFlag:true,municipalities:['北京市','天津市','重庆市','上海市']};address.method={init:function(dom_cache){var addr_code=dom_cache.addr_code,addr_text=dom_cache.addr_text;address.provinceId=addr_code[0],address.provinceTempId=addr_code[0],address.provinceName=decodeURI(addr_text[0]),address.cityId=addr_code[1],address.cityTempId=addr_code[1],address.cityName=decodeURI(addr_text[1]),address.areaId=addr_code[2],address.areaTempId=addr_code[2],address.areaName=decodeURI(addr_text[2]),address.dom_cache=dom_cache;address.addressDomId=dom_cache.address_list_area;if(!Array.prototype.indexOf){Array.prototype.indexOf=function(elt)
{var len=this.length>>>0;var from=Number(arguments[1])||0;from=(from<0)?Math.ceil(from):Math.floor(from);if(from<0)
from+=len;for(;from<len;from++)
{if(from in this&&this[from]===elt)
return from;}
return-1;};}
dom_cache.address_list_top.find(".address_option").on("click",function(){var btnType=$(this).attr("data-type");if(btnType=='jArea'&&address.areaSelectFlag==false){return false;}
$(this).addClass("option_on").siblings().removeClass("option_on");dom_cache.address_list_bottom.children().addClass("hide");switch(btnType){case"jProvince":address.addressDomId=dom_cache.address_list_province;dom_cache.address_list_province.removeClass("hide");break;case"jCity":address.addressDomId=dom_cache.address_list_city;dom_cache.address_list_city.removeClass("hide");break;case"jArea":address.addressDomId=dom_cache.address_list_area;dom_cache.address_list_area.removeClass("hide");break;}});dom_cache.address_list_bottom.delegate("a","click",function(e){dom_cache.address_list_top.find(".address_option").removeClass("option_on");address.addressDomId.addClass("hide");var btnType=address.addressDomId.attr("data-type");var addressId=e.target.getAttribute("id");var addressName=e.target.getAttribute("name");switch(btnType){case"province":dom_cache.show_city.find(".name").html('请选择市');dom_cache.show_area.find(".name").html('请选择区');address.cityFlag=false;address.areaFlag=false;address.areaSelectFlag=false;address.provinceTempId=addressId;address.provinceName=addressName;address.provinceFlag=true;dom_cache.show_province.find(".name").html(addressName);address.method.handleAddressData('city',addressId);var position=address.municipalities.indexOf(addressName);if(position>-1){switch(position){case 0:address.cityTempId='110100';address.cityName='北京市';break;case 1:address.cityTempId='120100';address.cityName='天津市';break;case 2:address.cityTempId='500100';address.cityName='重庆市';break;case 3:address.cityTempId='310100';address.cityName='上海市';break;}
address.addressDomId=dom_cache.address_list_area;dom_cache.address_list_area.removeClass("hide");dom_cache.show_area.addClass("option_on");address.cityFlag=true;address.areaFlag=false;dom_cache.show_city.find(".name").html(addressName);dom_cache.show_area.find(".name").html('请选择区');address.method.handleAddressData('area',addressId);}else{address.addressDomId=dom_cache.address_list_city;dom_cache.address_list_city.removeClass("hide");dom_cache.show_city.addClass("option_on");dom_cache.show_city.find(".name").html('请选择市');dom_cache.show_area.find(".name").html('请选择区');}
break;case"city":dom_cache.show_area.find(".name").html('请选择区');address.addressDomId=dom_cache.address_list_area;dom_cache.address_list_area.removeClass("hide");dom_cache.show_area.addClass("option_on");address.cityTempId=addressId;address.cityName=addressName;address.cityFlag=true;address.areaFlag=false;dom_cache.show_city.find(".name").html(addressName);address.method.handleAddressData('area',addressId);break;case"area":address.addressDomId=dom_cache.address_list_area;address.areaTempId=addressId;address.areaName=addressName;address.areaFlag=true;dom_cache.address_list.addClass("hide");dom_cache.address_list_area.removeClass("hide");if((address.areaId==address.areaTempId)&&(address.cityId==address.cityTempId)&&(address.provinceId==address.provinceTempId)){return;}
address.areaId=address.areaTempId;address.cityId=address.cityTempId;address.provinceId=address.provinceTempId;var address_return={'provinceId':address.provinceId,'cityId':address.cityId,'areaId':address.areaId,'provinceName':address.provinceName,'cityName':address.cityName,'areaName':address.areaName};dom_cache.address_callback(address_return);break;}});dom_cache.address_selected.on("click",function(){if(address.areaFlag){if(address.cityFlag){address.method.handleAddressData('city',address.cityTempId);}else{address.method.handleAddressData('area',address.areaTempId);}}else{address.method.initAddressData();}
dom_cache.show_area.toggleClass("option_on");dom_cache.address_selected.toggleClass("option_on");dom_cache.address_list.toggleClass("hide");});dom_cache.close.on("click",function(){address.provinceFlag=true;address.cityFlag=true;address.areaFlag=true;dom_cache.show_area.toggleClass("option_on");dom_cache.address_selected.toggleClass("option_on");dom_cache.address_list.toggleClass("hide");});},initAddressData:function(){address.dom_cache.show_province.find(".name").html(address.provinceName);address.dom_cache.show_city.find(".name").html(address.cityName);address.dom_cache.show_area.find(".name").html(address.areaName);var lists=[];for(var item in bbcDistrictData){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[item][0];lists.push(temp);}
address.dom_cache.address_list_province.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));var lists=[];for(var item in bbcDistrictData[address.provinceTempId][1]){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[address.provinceTempId][1][item][0];lists.push(temp);}
address.dom_cache.address_list_city.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));var lists=[];for(var item in bbcDistrictData[address.provinceTempId][1][address.cityTempId][1]){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[address.provinceTempId][1][address.cityTempId][1][item];lists.push(temp);}
address.dom_cache.address_list_area.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));},handleAddressData:function(list,para){var lists=[];if(para){switch(list){case'city':for(var item in bbcDistrictData[address.provinceTempId][1]){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[address.provinceTempId][1][item][0];lists.push(temp);}
break;case'area':for(var item in bbcDistrictData[address.provinceTempId][1][address.cityTempId][1]){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[address.provinceTempId][1][address.cityTempId][1][item];lists.push(temp);}
break;}}else{for(var item in bbcDistrictData){var temp={};temp["id"]=item;temp["name"]=bbcDistrictData[item][0];lists.push(temp);}}
switch(list){case'province':address.dom_cache.address_list_province.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));break;case'city':address.dom_cache.address_list_city.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));break;case'area':address.dom_cache.address_list_area.html(mFormatJson.render(address.dom_cache.address_tmpl,{data:lists}));break;}}};exports.init=function(){return address;}});
define('md.auth.validate.v2', function(require, exports, module) {

    /**
     * 登录注册验证组件
     */

    var jquery = $ = require('jquery'),
        mUrl = require('url'),
        md5 = require('md5'),
        Auth = {
            nonceId: null,
            rUrl   : null,
            mobile : null,
            password: null,
            msgCode: null,
            loginPassword: null,
            regPassword: null
        },
        netErrMsg = '网络异常，请稍后再试';
        commonErrMsg = '服务器开小差了，请稍后再试';

    Auth.rUrl = mUrl.getUrlParam('rurl');

    // 获取 nonceid
    Auth.getNonceId = function() {
        if (Auth.nonceId) {
            return ;
        }

        $.ajax({
            url: '//mall.midea.com/next/user_assist/getnonceid',
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function (obj) {
            if (obj.errcode === 0) {
                Auth.nonceId = obj.data.NonceId;
            }
        }).fail(function () {
            //console.log('get nonceid error.')
        });
    };

    Auth.getNonceId();

    var AuthValidate = function(options, type) {
        this.authType     = null;
        this.msgDelay     = null; // 手机短信倒计时
        this.msgDelayTemp = null;
        this.options      = null; // 先择器配置
        this.validate     = null; // 验证状态
        this.type         = null; //
        this.$imgCodeTmpl = null; // 图形验证码 浮层
        this.$submitBtn   = null; // 提交按钮

        this.init(options, type);
    };

    // 选择器列表，都是可选的
    AuthValidate.DEFAULTS = {
        authType:            null, // auth 类型
        telephoneIpt:        null, // 手机号码输入框
        telInfo:             null, // 手机号码提示语

        msgCodeIpt:          null, // 短信验证码输入框
        msgCodeBtn:          null, // 短信验证码获取按钮

        msgCodeInfo:         null, // 短信验证码
        passwordIpt:         null, // 登录时密码输入框
        passwordInfo:        null, // 登录时密码验证提示语

        regPasswordIpt:      null, // 注册时密码输入框
        regPasswordInfo:     null, // 注册时密码验证提示语
        passwordConfirm:     null, // 注册时密码输入确认框
        passwordConfirmInfo: null, // 注册时密码确认验证提示语

        imgCodeCancelBtn:    null, // 图片验证码取消按钮
        imgCodeConfirmBtn:   null, // 图片验证码确认按钮
        imgCodeWrap:         null, // 图片验证码浮层最外层
        imgCodePlace:        null, // 图片验证码图片显示框
        imgCodeIpt:          null, // 图片验证码输入框
        imgCodeInfo:         null, // 图片验证码提示语
        imgCodeBtn:          null, // 图片验证码重新获取按钮
        imgCodeMask:         null, // 图片验证码浮层遮罩
        imgCodeTmpl:         null, // 图片验证码浮层 template

        rUrlIpt:             null, // 跳转 url 隐藏输入框
        md5PwdIpt:           null, // 登录时md5后的密码 隐藏输入框
        md5RegPwdIpt:        null, // 注册时md5后的密码 隐藏输入框

        submitBtn:           null // 提交按钮
    };

    AuthValidate.prototype.getDefaults = function () {
        return AuthValidate.DEFAULTS
    };

    AuthValidate.prototype.getOptions = function (options) {
        return $.extend({}, this.getDefaults(), options);
    };

    AuthValidate.prototype.init = function (options, type) {
        var that = this;
        this.type = type || ~~(Math.random() * 1000000);
        this.msgDelay = 60; // 手机短信倒计时
        this.msgDelayTemp = this.msgDelay;
        this.validate = true; // 验证状态
        this.options = this.getOptions(options);
        this.authType = this.options.authType;
        this.$submitBtn = $(this.options.submitBtn);

        // 百度统计
        ! window._hmt && (window._hmt = []);

        if (this.options.imgCodeTmpl) {
            this.$imgCodeTmpl = $('<div />').append($(this.options.imgCodeTmpl).html()).appendTo('body');

            //s----new-----注册图片验证码框验证事件
            $(this.options.imgCodeRow).find(this.options.imgCodeIpt).on('keyup', function(e) {
                var value = $(e.target).val();

                if (value.length >= 4) {
                    $(e.target).val(value.substr(0, 4));
                    var mobile = $(that.options.telephoneIpt).val();
                    var $imgCodeIpt = $(that.options.imgCodeRow).find(that.options.imgCodeIpt);
                    var imgCode = $imgCodeIpt.val();
                    var params = {
                        mobile: mobile,
                        imgverifycode: imgCode
                    };

                    if (that.type == 'second') {
                        params['sceneid'] = 2;
                    }

                    if (! imgCode) {
                        that.validate = false;
                        $imgCodeIpt.focus();

                        return;
                    }

                    $.ajax({
                        url: '//mall.midea.com/next/user_assist/getverifycode',
                        type: 'get',
                        dataType: 'json',
                        data: params
                    }).done(function(res) {
                        if (res.errcode == 0) {
                            $(that.options.imgCodeRow).addClass('hide');
                            that.msgCodeTimer();
                            that.validate = true;

                        // 检验失败 或 未找到对应图形码 时重新拉一次图形码
                        } else if (res.errcode == '539365411' || res.errcode == '539365410') {
                            that.validate = false;
                            $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src', '//mall.midea.com/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= '+ Math.random());
                        } else {
                            that.validate = false;
                        }

                        $(that.options.imgCodeRow).find(that.options.imgCodeIpt).val('');
                    }).fail(function() {
                        that.validate = false;
                        $(that.options.imgCodeRow).find(that.options.imgCodeIpt).val('');
                    });
                }
            });

            // 注册图片验证码重新拉取图片事件
            $(that.options.imgCodeRow).find(that.options.imgCodeBtn).on('click', function() {
                var mobile = $(that.options.telephoneIpt).val();
                $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src','//mall.midea.com/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= '+ Math.random());
                $(that.options.imgCodeRow).find(that.options.imgCodeIpt).focus();
                that.validate = false;
            });
        }

        // 注册手机号输入框事件
        this.options.telephoneIpt && $(this.options.telephoneIpt).on('keyup', function(e) {
            var value = $(e.target).val();
            var reg = /^\d{0,}$/;

            if (value.length > 11) {
                $(e.target).val(value.substr(0, 11));
            }

            if (! reg.test(value)) {
                that.validate = false;
                if (that.options.telInfo) {
                    $(that.options.telInfo).removeClass('hide').addClass('show').html('请输入正确的手机号');
                } else {
                    alert('请输入正确的手机号');
                }
            } else {
                that.validate = true;
                that.options.telInfo && $(that.options.telInfo).removeClass('show').addClass('hide');
            }
        }).on('keypress',function(e) {
            var k = e.charCode || e.keyCode; // 兼容 firefox charCode
            //48-57是的数字键，8是退格符, 46是 delete

            if ((k == 46) || (k == 8)  || (k >= 48 && k <= 57)  || (k >= 37 && k <= 40)) {
                return true;
            } else {
                return false;
            }

        }).on('blur', function() {
            //that.validate = that.validateTelephone();

        }).on('focus', function() {
            that.options.telInfo && $(that.options.telInfo).removeClass('show').addClass('hide');
        });

        // 注册获取验证码事件
        this.options.msgCodeBtn && $(this.options.msgCodeBtn).on('click', function() {
            that.getMsgCode();
        });

        // 注册短信验证码输入框事件
        this.options.msgCodeIpt && $(this.options.msgCodeIpt).on('keyup', function(e) {
            var value = $(e.target).val();

            if (value.length > 6) {
                $(e.target).val(value.substr(0, 6));
            }
        }).on('focus', function() {
            that.options.msgCodeInfo && $(that.options.msgCodeInfo).removeClass('show').addClass('hide');

        }).on('blur', function() {
            //that.validate = that.validateMsgCode();

        }).on('keypress',function() {

        });

        // 绑定登录密码输入框事件
        this.options.passwordIpt && $(this.options.passwordIpt).on('keyup', function(e) {
            var value = $(e.target).val();

            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }

            that.options.passwordInfo && $(that.options.passwordInfo).removeClass('show').addClass('hide');

        }).on('keypress',function() {

        }).on('blur', function() {
            //that.validate = that.validatePassword();
        }).on('focus', function() {
            that.options.passwordInfo && $(that.options.passwordInfo).removeClass('show').addClass('hide');
        });

        // 绑定注册密码输入框事件
        this.options.regPasswordIpt && $(this.options.regPasswordIpt).on('keyup', function(e) {
            var value = $(e.target).val();

            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }

            that.options.regPasswordInfo && $(that.options.regPasswordInfo).removeClass('show').addClass('hide');

        }).on('keypress',function() {

        }).on('blur', function() {
            //that.validate = that.validateRegPassword();
        }).on('focus', function() {
            that.options.regPasswordInfo && $(that.options.regPasswordInfo).removeClass('show').addClass('hide');
        });

        // 绑定注册确认密码输入框事件
        this.options.passwordConfirm && $(this.options.passwordConfirm).on('keyup', function(e) {
            var value = $(e.target).val();

            if (value.length > 20) {
                $(e.target).val(value.substr(0, 20));
            }

            that.options.passwordConfirmInfo && $(that.options.passwordConfirmInfo).removeClass('show').addClass('hide');
        }).on('keypress',function() {

        }).on('blur', function() {
            //that.validate = that.validateConfirmPassword();
        }).on('focus', function() {
            that.options.passwordConfirmInfo && $(that.options.passwordConfirmInfo).removeClass('show').addClass('hide');
        });
    };

    AuthValidate.prototype.bindSubmit = function (cb) {
        var that = this;
        this.$submitBtn.off().on('click', function(e) {
            that.reValidate();

            if (! that.isValid()) {
                return false;
            }

            that.submitAuth(cb);
            //$(e.target).closest('form').submit();
        });
    }

    // 获取手机验证码
    AuthValidate.prototype.getMsgCode = function() {
        var that = this;
        var $telephoneIpt = $(this.options.telephoneIpt);
        var mobile = $telephoneIpt.val();
        this.validate = this.validateTelephone();
        var params = {
            mobile: mobile
        };

        if (! this.validate) {
            return false;
        }

        //获取验证码按钮添加灰色效果，并解绑点击事件
        $(this.options.msgCodeBtn).addClass('gray login_get_code_disabled').off('click');

        if (this.type == 'second') {
            params['sceneid'] = 2;
        }

        $.ajax({
            url: '//mall.midea.com/next/user_assist/getverifycode',
            type: 'get',
            dataType: 'json',
            data: params
        }).done(function (res) {
            if (res.errcode == 0) {
                that.msgCodeTimer();
            } else if (res.errcode == '539365412') {
                $(that.options.imgCodeRow).removeClass('hide');
                $(that.options.imgCodeRow).find(that.options.imgCodeIpt).focus();
                $(that.options.imgCodeRow).find(that.options.imgCodePlace).attr('src','//mall.midea.com/next/user_assist/getimgverifycode?mobile=' + mobile + '&t= '+ Math.random());
            } else {
                that.options.msgCodeBtn && $(that.options.msgCodeBtn)
                    .removeClass('gray login_get_code_disabled')
                    .bind('click', function() {
                        that.getMsgCode();
                    });
                if (that.options.msgCodeInfo) {
                    $(that.options.msgCodeInfo).removeClass('hide').addClass('show').html(res.errMsg || commonErrMsg);
                } else {
                    alert(res.errMsg || commonErrMsg);
                }
            }

        }).fail(function () {
            that.options.msgCodeBtn && $(that.options.msgCodeBtn)
                .removeClass('gray login_get_code_disabled')
                .bind('click', function() {
                    that.getMsgCode();
                });
            if (that.options.msgCodeInfo) {
                $(that.options.msgCodeInfo).removeClass('hide').addClass('show').html(commonErrMsg);
            } else {
                alert(commonErrMsg);
            }
        });
    };

    // 手机验证码倒计时
    AuthValidate.prototype.msgCodeTimer = function() {
        var that = this;
        var timer = timer || null;
        var $msgCodeBtn = $(this.options.msgCodeBtn);
        if (this.msgDelayTemp > 1) {
            this.msgDelayTemp --;

            if ($msgCodeBtn[0].tagName.toLowerCase() == 'input') {
                $msgCodeBtn.val(this.msgDelayTemp + 's后重新获取');
            } else {
                $msgCodeBtn.html(this.msgDelayTemp + 's后重新获取');
            }

            timer = setTimeout(function() {
                that.msgCodeTimer();
            }, 1000);
        } else {

            if ($msgCodeBtn[0].tagName.toLowerCase() == 'input') {
                $msgCodeBtn.val('重新获取');
            } else {
                $msgCodeBtn.html('重新获取').removeClass('gray login_get_code_disabled').bind('click', function() {
                    that.getMsgCode();
                });
            }

            this.msgDelayTemp  = this.msgDelay;
            clearTimeout(timer);
        }
    };

    // 校验手机号
    AuthValidate.prototype.validateTelephone = function() {
        var $telephoneIpt = $(this.options.telephoneIpt);
        var mobile = $telephoneIpt.val();
        var reg = /^1[0-9]{10}$/;

        if (mobile.length < 1 || ! reg.test(mobile)) {
            if (this.options.telInfo) {
                $(this.options.telInfo).html('请输入正确的手机号').removeClass('hide').addClass('show');
            } else {
                alert('请输入正确的手机号');
            }

            return false;
        }

        Auth.mobile = mobile;

        return true;
    };

    // 校验短信验证码
    AuthValidate.prototype.validateMsgCode = function() {
        var $msgCodeIpt = $(this.options.msgCodeIpt);
        var msgCode = $.trim($msgCodeIpt.val());
        var reg = /^[0-9]{4,}$/;

        if (! reg.test(msgCode)) {
            if (this.options.msgCodeInfo) {
                $(this.options.msgCodeInfo).html('短信验证码错误').removeClass('hide').addClass('show');
            } else {
                alert('短信验证码错误');
            }

            return false;
        }

        Auth.msgCode = msgCode;

        return true;
    };

    // 校验登录时密码
    AuthValidate.prototype.validatePassword = function() {
        var $passwordIpt = $(this.options.passwordIpt);
        var password = $.trim($passwordIpt.val());
        var length = password.length;
        var regPwd = /^[0-9a-z~@"():+&;_?#-%=!*/$]{6,20}$/i;

        if (length < 1) {
            if (this.options.passwordInfo) {
                $(this.options.passwordInfo).html('请输入用户密码').removeClass('hide').addClass('show');
            } else {
                alert('请输入用户密码');
            }

            return false;
        }

        if (length < 6 || length > 20) {
            if (this.options.passwordInfo) {
                $(this.options.passwordInfo).html('密码长度必须在6到20位之间').removeClass('hide').addClass('show');
            } else {
                alert('密码长度必须在6到20位之间');
            }

            return false;
        }

        if (!regPwd.test(password)) {
            if (this.options.passwordInfo) {
                $(this.options.passwordInfo).html('请输入6-20位英文字母、数字或者符号').removeClass('hide').addClass('show');
            } else {
                alert('请输入6-20位英文字母、数字或者符号');
            }

            return false;
        }

        Auth.password = password;

        return true;
    };

    // 校验注册时密码
    AuthValidate.prototype.validateRegPassword = function() {
        var $passwordIpt = $(this.options.regPasswordIpt);
        var password = $passwordIpt.val();
        var length = password.length;
        var regPwd = /^[0-9a-z~@"():+&;_?#-%=!*/$]{6,20}$/i;

        if (length < 1) {
            if (this.options.regPasswordInfo) {
                $(this.options.regPasswordInfo).html('请输入用户密码').removeClass('hide').addClass('show');
            } else {
                alert('请输入用户密码');
            }

            return false;
        }

        if (length < 6 || length > 20) {
            if (this.options.regPasswordInfo) {
                $(this.options.regPasswordInfo).html('密码长度必须在6到20位之间').removeClass('hide').addClass('show');
            } else {
                alert('密码长度必须在6到20位之间');
            }

            return false;
        }

        if (!regPwd.test(password)) {
            if (this.options.regPasswordInfo) {
                $(this.options.regPasswordInfo).html('请输入6-20位英文字母、数字或者符号').removeClass('hide').addClass('show');
            } else {
                alert('请输入6-20位英文字母、数字或者符号');
            }

            return false;
        }

        return true;
    };

    // 校验注册时密码
    AuthValidate.prototype.validateConfirmPassword = function() {
        var regPassword = $(this.options.regPasswordIpt).val();
        var $passwordConfirm = $(this.options.passwordConfirm);
        var passwordConfirm = $passwordConfirm.val();
        var length = passwordConfirm.length;
        var regPwd = /^[0-9a-z~@"():+&;_?#-%=!*/$]{6,20}$/i;

        if (length < 1) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html('请输入确认密码').removeClass('hide').addClass('show');
            } else {
                alert('请输入确认密码');
            }

            return false;
        }

        if (length < 6 || length > 20) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html('密码长度必须在6到20位之间').removeClass('hide').addClass('show');
            } else {
                alert('密码长度必须在6到20位之间');
            }

            return false;
        }

        if (!regPwd.test(passwordConfirm)) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html('请输入6-20位英文字母、数字或者符号').removeClass('hide').addClass('show');
            } else {
                alert('请输入6-20位英文字母、数字或者符号');
            }

            return false;
        }

        if (regPassword != passwordConfirm) {
            if (this.options.passwordConfirmInfo) {
                $(this.options.passwordConfirmInfo).html('两次输入的密码不一致').removeClass('hide').addClass('show');
            } else {
                alert('两次输入的密码不一致');
            }

            return false;
        }

        Auth.password = passwordConfirm;

        return true;
    };

    AuthValidate.prototype.submitAuth = function (cb) {
        var that = this;
        var url = '';
        var params = {};
        var submitLoadingText = '';
        var errTipsDom = '';

        switch (that.authType) {
            case 'passwordLogin':
                url = '//mall.midea.com/next/userinfo/loginbypasswd';
                params = {
                    mobile: Auth.mobile,
                    passwd: Auth.loginPassword,
                    sceneid: 1,
                    rurl: Auth.rUrl
                };
                submitLoadingText = '正在登录...';
                errTipsDom = that.options.passwordInfo;
                break;

            case 'msgCodeLogin':
                url = '//mall.midea.com/next/userinfo/loginbymobile';
                params = {
                    mobile: Auth.mobile,
                    verifycode: Auth.msgCode,
                    rurl: Auth.rUrl
                };
                submitLoadingText = '正在登录...';
                errTipsDom = that.options.msgCodeInfo;
                break;

            case 'mobilePasswordRegister':
                url = '//mall.midea.com/next/userinfo/registwithpasswd';
                params = {
                    mobile: Auth.mobile,
                    passwd: Auth.regPassword,
                    verifycode: Auth.msgCode,
                    rurl: Auth.rUrl
                };
                submitLoadingText = '正在提交...';
                errTipsDom = that.options.passwordConfirmInfo;
                break;

            case 'findPassword':
                url = '//mall.midea.com/next/userinfo/resetpasswd';
                params = {
                    mobile: Auth.mobile,
                    passwd: Auth.regPassword,
                    verifycode: Auth.msgCode,
                    rurl: encodeURIComponent('https://mall.midea.com/my/index/find_password_success')
                };
                submitLoadingText = '正在提交...';
                errTipsDom = that.options.passwordConfirmInfo;
                break;
        }

        var errmsg = '';
        var submitOriginText = this.$submitBtn.text();
        this.$submitBtn.off().text(submitLoadingText);

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: params,
            cache: false
        }).done(function (obj) {
            if (obj.errcode === 0) {
                if (cb && $.isFunction(cb.success)) {
                    cb.success(obj);
                } else {
                    //var rurl =
                    //var rurl = obj.data.LoginRsp.RedirectUrl || obj.data.rurl || decodeURIComponent('https://mall.midea.com/my/index');
                    mUrl.redirectUrl(decodeURIComponent(that.authType == 'findPassword' ? obj.data.rurl : obj.data.LoginRsp.RedirectUrl))
                    //location.href = Url;
                }
            } else {
                errmsg = obj.errmsg || '系统繁忙，请稍候再试'
            }
        }).fail(function (obj) {
            errmsg = netErrMsg
        }).always(function () {
            if (errmsg) {
                $(errTipsDom).html(errmsg).removeClass('hide').addClass('show');
                cb && $.isFunction(cb.fail) && cb.fail();
                that.$submitBtn.text(submitOriginText);
                that.bindSubmit(cb);
            }
        })
    };

    AuthValidate.prototype.makeRedirectUrl = function() {
        this.options.rUrlIpt && $(this.options.rUrlIpt).val(Auth.rUrl);
    };

    AuthValidate.prototype.makeLoginPassword = function() {
        var mobile = $(this.options.telephoneIpt).val();
        var passwd = $(this.options.passwordIpt).val();
        passwd = md5.hex_md5(md5.hex_md5(md5.hex_md5(passwd)) + Auth.nonceId + mobile);

        Auth.loginPassword = passwd;

        this.options.md5PwdIpt && $(this.options.md5PwdIpt).val(passwd);
    };

    AuthValidate.prototype.makeRegPassword = function() {
        var passwd = $(this.options.regPasswordIpt).val();
        passwd =  md5.hex_md5(md5.hex_md5(passwd));

        Auth.regPassword = passwd;

        this.options.md5RegPwdIpt && $(this.options.md5RegPwdIpt).val(passwd);
    };

    AuthValidate.prototype.isValid = function() {
        return this.validate;
    };

    AuthValidate.prototype.reValidate = function() {
        this.options.telephoneIpt && (this.validate = this.validateTelephone());
        this.options.msgCodeIpt && (this.validate = this.validateMsgCode() ? this.validate : false);
        this.options.passwordIpt && (this.validate = this.validatePassword() ? this.validate : false);
        this.options.regPasswordIpt && (this.validate = this.validateRegPassword() ? this.validate : false);
        this.options.passwordConfirm && (this.validate = this.validateConfirmPassword() ? this.validate : false);
        this.options.passwordIpt && this.makeLoginPassword();
        this.options.regPasswordIpt && this.makeRegPassword();
        this.validate && this.makeRedirectUrl();
        this.validate && Auth.getNonceId();
    };

    exports.init = function() {
        Auth.create = function (options, type) {
            return new AuthValidate(options, type);
        };

        return Auth;
    }
});
define('md.common.layer.login.v2',function(require,exports,module){var $=require('jquery');var authValidate=require('md.auth.validate.v2').init();function layerLogin(){var apLogin={authType:'passwordLogin',telephoneIpt:'.ap_form .js_telephone',telInfo:'.ap_form .js_telephone_tips',passwordIpt:'.ap_form .js_password',passwordInfo:'.ap_form .js_password_tips',rUrlIpt:'.ap_form .js_rurl_txt',md5PwdIpt:'.ap_form .js_password_txt',submitBtn:'.ap_form .login_btn'};var apLoginValidate=authValidate.create(apLogin);apLoginValidate.bindSubmit();var mobileLogin={authType:'msgCodeLogin',telephoneIpt:'.mobile_form .js_telephone',telInfo:'.mobile_form .js_telephone_tips',msgCodeIpt:'.mobile_form .js_verifycode',msgCodeInfo:'.mobile_form .js_verifycode_tips',msgCodeBtn:'.mobile_form .login_get_code',imgCodeRow:'.mobile_form .js_image_code_row',imgCodeCancelBtn:'.js_image_code_cancel',imgCodeConfirmBtn:'.js_image_codeConfirm',imgCodeWrap:'.js_img_code_wrap',imgCodePlace:'.js_img_code_place',imgCodeIpt:'.js_img_code',imgCodeBtn:'.js_reCode',imgCodeMask:'.js_img_code_mask',imgCodeTmpl:'#modImagecodeTmpl',rUrlIpt:'.mobile_form .js_rurl_txt',submitBtn:'.mobile_form .login_btn'};var mobileLoginValidate=authValidate.create(mobileLogin);mobileLoginValidate.bindSubmit();var mobileReg={authType:'mobilePasswordRegister',telephoneIpt:'.reg_form .js_telephone',telInfo:'.reg_form .js_telephone_tips',msgCodeIpt:'.reg_form .js_verifycode',msgCodeInfo:'.reg_form .js_verifycode_tips',msgCodeBtn:'.reg_form .login_get_code',regPasswordIpt:'.reg_form .js_password',regPasswordInfo:'.reg_form .js_password_tips',passwordConfirm:'.reg_form .js_password_confirm',passwordConfirmInfo:'.reg_form .js_password_confirm_tips',imgCodeRow:'.reg_form .js_image_code_row',imgCodeCancelBtn:'.js_image_code_cancel',imgCodeConfirmBtn:'.js_image_codeConfirm',imgCodeWrap:'.js_img_code_wrap',imgCodePlace:'.js_img_code_place',imgCodeIpt:'.js_img_code',imgCodeBtn:'.js_reCode',imgCodeMask:'.js_img_code_mask',imgCodeTmpl:'#modImagecodeTmpl',rUrlIpt:'.reg_form .js_rurl_txt',md5RegPwdIpt:'.reg_form .js_password_txt',submitBtn:'.reg_form .login_btn'};var mobileRegValidate=authValidate.create(mobileReg);mobileRegValidate.bindSubmit();$('.js_md_login').on('click','.md_login_layer_close',function(e){$(e.target).closest('.js_md_login').addClass('hide');$(".mod_login_cover").addClass("hide");}).on('keydown',function(e){var k=e.charCode||e.keyCode;if(k==13){$(e.target).closest('form').find('.login_btn').trigger('click');}});}
function togglePlaceholder(){var input=document.createElement('input');if('placeholder'in input){$('.login_form_label').hide();}else{$('.js_md_login input').each(function(i,item){var $el=$(item);$el.val()&&$el.closest('.login_form_row').addClass('editing');}).on('keyup',function(e){var $el=$(e.target);$el.closest('.login_form_row').addClass('editing');}).on('blur',function(e){var $el=$(e.target);!$.trim($el.val())&&$el.closest('.login_form_row').removeClass('editing');});}}
function initThirdLogin(){$('.js_md_login').on('click','.login_way_qq i',function(){var authUrl=encodeURIComponent('https://mall.midea.com/next/userinfo/checkuser?rurl='+encodeURIComponent(authValidate.rUrl));window.location.href='//mall.midea.com/next/userinfo/qqlogin?appname=web_qq&rurl='+authUrl;}).on('click','.login_way_wx i',function(){var authUrl=encodeURIComponent('https://mall.midea.com/next/userinfo/checkuser?rurl='+encodeURIComponent(authValidate.rUrl));window.location.href='//mall.midea.com/next/userinfo/weixinlogin?appname=web_wx&rurl='+authUrl;});}
function switchForm(){$('.js_md_login').on('click','.has_account, .other_login',function(){$('.login_type').removeClass('hide').removeClass('login_type2').addClass('login_type1');$('.register').addClass('hide');}).on('click','.reg',function(){$('.login_type').addClass('hide');$('.register').removeClass('hide');}).on('click','.js_login_way_msg',function(){$(this).removeClass('js_login_way_msg').addClass('js_login_way_account').find('span').text('账号密码登录');$('.login_type').removeClass('login_type1').addClass('login_type2');}).on('click','.js_login_way_account',function(){$(this).removeClass('js_login_way_account').addClass('js_login_way_msg').find('span').text('短信验证登录');$('.login_type').removeClass('login_type2').addClass('login_type1');});}
function bindInit(){switchForm();initThirdLogin();togglePlaceholder();$('.js_md_login').length&&layerLogin();$(".mod_login_cover .Js_cover_cancel").on("click",function(){$(".mod_login_cover").addClass("hide");$('.js_md_login').addClass('hide');});}
exports.init=function(){bindInit();return{create:function(url){url&&(authValidate.rUrl=url);$('.js_md_login').removeClass('hide');$(".mod_login_cover").removeClass("hide");}};}});
define('md.compare_list',function(require,exports,module){var $=require('jquery'),cookie=require('cookie'),formatJson=require('formatJson');function CompareObj(options){this.options=$.extend({},CompareObj.defaults,options);this.dataList=[];this.$compareListWrap=$('.compare_list_wrap');this.expires=3*24*60;this.cusCateId=0;this.cateInfoArr=[];this.contrastBody=$('#contrastBody');this.contrastTip=$('#contrast_tip');this.msg="";this.init();};CompareObj.defaults={type:'list',compare_class:'js_compare_icon',compare_cur:'active_compare_icon'};CompareObj.prototype={constructor:CompareObj,init:function(){this.loadCompareList();this.handleDelete();this.clearAllGoods();this.showOrHide();},loadCompareList:function(){var itemids=cookie.getC('itemids');this.getCompareList(itemids,'',function(){if(itemids){cookie.del('itemids');}});},getCompareList:function(itemList,sucCallback,failCallback){var self=this;if(itemList){$.ajax({type:'get',url:'/detail/compare/get_item_list_info',data:{'itemids':itemList},dataType:'json',success:function(data){if(data.errcode==0){self.cateInfoArr=data.cateInfoNew;if(data.dataList[0]&&data.dataList[0].lCategoryId){if(self.cateInfoArr[data.dataList[0].lCategoryId]){self.dataList=data.dataList;self.cusCateId=self.cateInfoArr[self.dataList[0].lCategoryId]['cus_cate_id'];$('.'+self.options.compare_class).removeClass(self.options.compare_cur);if(self.dataList.length){for(var i=0,l=self.dataList.length;i<l;i++){$('.'+self.options.compare_class+'[data-sku="'+self.dataList[i].strSrcItemid+'"]').addClass(self.options.compare_cur);}}
self.renderContrast();typeof sucCallback=='function'&&sucCallback();}else{self.msg='暂无此商品分类，请稍后再试！';self.renderContrast();}}}else{self.msg='商品信息拉取失败，请稍后再试！';self.renderContrast();typeof failCallback=='function'&&failCallback();}},error:function(){self.msg="商品信息拉取失败，请稍后再试！";self.renderContrast();typeof failCallback=='function'&&failCallback();}});}},renderContrast:function(){var self=this;self.contrastBody.html(formatJson.render('contrastBodyTmp',{dataList:self.dataList},'html'));if(self.msg){self.contrastTip.css('display','block').text(self.msg);setTimeout(function(){self.msg='';self.contrastTip.css('display','none');},2000);}else{self.contrastTip.css('display','none').text("");}
if(self.dataList.length){self.$compareListWrap.addClass('fade');}else if(self.msg){self.$compareListWrap.addClass('fade');setTimeout(function(){self.msg='';self.$compareListWrap.removeClass('fade');},2000);}else{self.$compareListWrap.removeClass('fade');}},toggleContrast:function($obj,itemid,categoryId){var self=this;if($obj.hasClass(self.options.compare_cur)){self.deleteContrast($obj,itemid);}else{self.addContrast($obj,itemid,categoryId);}},addContrast:function($obj,itemid,categoryId){var self=this,len=self.dataList.length,cusCateIdCur=0;if(self.cusCateId&&self.cateInfoArr[categoryId]){cusCateIdCur=self.cateInfoArr[categoryId]['cus_cate_id'];}
if(self.cusCateId&&(cusCateIdCur!=self.cusCateId)){self.msg="对比商品为不同品类，无法进行对比";self.renderContrast();}else if(len>=4){self.msg="已超过对比数量上限，请重新编辑。需要先将已有对比商品删除后才能继续添加";self.renderContrast();}else{self.msg="";var itemids=cookie.getC('itemids');var itemidsArr=[];if(itemids){itemidsArr=itemids.split(',');if(itemids.indexOf(itemid)>-1){self.msg="您已经添加过此商品，请勿重复添加";self.renderContrast();return true;}}
itemidsArr.push(itemid);itemids=itemidsArr.join(',');self.getCompareList(itemids,function(){$obj.addClass(self.options.compare_cur);cookie.setC('itemids',itemids,self.expires);});}},deleteContrast:function($obj,itemid,callback){var self=this;self.modifyCookie('delete',itemid);var itemids=cookie.getC('itemids');if(itemids){this.getCompareList(itemids,callback);}else{self.dataList=[];self.cusCateId=0;$('.'+self.options.compare_class).removeClass(self.options.compare_cur);self.renderContrast();typeof callback=='function'&&callback();}},handleDelete:function(){var self=this;$(document).on('click','.js_delete_single',function(){var itemid=$(this).data('itemid');self.deleteContrast($(this),itemid);});},clearAllGoods:function(){var self=this;$(document).on('click','.js_delete_all',function(){cookie.del('itemids');self.dataList=[];self.cusCateId=0;$('.'+self.options.compare_class).removeClass(self.options.compare_cur);self.renderContrast();});},showOrHide:function(){var self=this;$(document).on('click','.js_show_hide',function(){if(self.$compareListWrap.hasClass('contrast_show')){$(this).text('隐藏');self.$compareListWrap.removeClass('contrast_show').addClass('fade');}else{$(this).text('显示');self.$compareListWrap.addClass('contrast_show').removeClass('fade');}})},modifyCookie:function(type,itemid){var self=this;var itemids=cookie.getC('itemids');var itemidsArr=[];if(itemids){itemidsArr=itemids.split(',');}
if(type=='add'){itemidsArr.push(itemid);itemids=itemidsArr.join(',');}else if(type=='delete'){if(itemids&&itemids.indexOf(itemid)>-1){for(var i=0,l=itemidsArr.length;i<l;i++){if(itemidsArr[i]==itemid){itemidsArr.splice(i,1);break;}}}
itemids=itemidsArr.join(',');}
if(itemids){cookie.setC('itemids',itemids,self.expires);}else{cookie.del('itemids');}}};exports.init=function(options){return new CompareObj(options);};});
define('md.detail_v4',function(require,exports,module){var $=require('jquery'),URL=require('url'),cookie=require('cookie'),report=require('report'),QRcode=require('qrcode'),address=require('md.address').init(),login=require('md.common.layer.login.v2').init(),zoomPic=require('zoomPic').init(),oBuyInfo={},nSkuid=lDisSkuId,nBuyNum=1,icid=oItemSkuInfo.mapwxskuinfo[nSkuid].lSkuid,addr_code=addrCode.split(','),page=require('page'),formatJson=require('formatJson'),mXss=require('xss'),compareList=require('md.compare_list').init({type:'detail',compare_class:'js_toggle_contrast',compare_cur:'contrast_current'});require('jquery.mpopup');var eventType='click';var confirmDouble=$.mpopup({id:'confirmDouble'}),confirmSingle=$.mpopup({id:'confirmSingle'}),confirmNone=$.mpopup({id:'confirmNone'}),confirmRefresh=$.mpopup({id:'confirmRefresh'}),confirmBuy=$.mpopup({id:'confirmBuy'}),confirmReminder=$.mpopup({id:'confirmReminder'}),confirmCutReminder=$.mpopup({id:'confirmCutReminder'});function detailCommonPop(params,data,buttonType){var domGetStatus=$('.J_get_status');var domCloseText=$('.J_close_text');var domGetHref=$('.J_get_href');var text1=params.button_text_l?params.button_text_l:'';var text2=params.button_text_r?params.button_text_r:'';var text3=params.hinter_text?params.hinter_text:'';var url1=params.button_url_l?params.button_url_l:'javascript:void(0)';var url2=params.button_url_r?params.button_url_r:'javascript:void(0)';domGetStatus.html(text3);if(text1){domCloseText.html(text1);}
domCloseText.attr('href',url1);if(text2){domGetHref.html(text2);}
domGetHref.attr('href',url2);if(buttonType=='buy'){$('.js_hinter_ico').addClass('fail_ico');confirmBuy.show();}else if(buttonType=='none'){$('.js_hinter_ico').addClass('fail_ico');confirmNone.show();}else{if(data.errcode==0){$('.js_hinter_ico').removeClass('fail_ico');if(buttonType=='double'){confirmDouble.show();}else{confirmSingle.show();}}else if(data.errcode==0x21531003||data.errcode==0x21531004){$('.js_hinter_ico').addClass('fail_ico');confirmRefresh.show();}else{$('.js_hinter_ico').addClass('fail_ico');if(buttonType=='double'){confirmDouble.show();}else{confirmSingle.show();}}}}
var regsrc='20.20006.20006010';if(window.isOw){regsrc='20.20005.20005010';}
function commonJump(url,type){url=url+'&itemid='+window.strFiid;if(type==1){if(cookie.getC('uid')){location.href=url;}else{initLogin(url);}}else{location.href=url;}}
function bindBuyCart(){var cc=cookie.getC('flag_detail_cart');if(cookie.getC('uid')&&(cc==window.strFiid.toString())){addCart();cookie.del('flag_detail_cart','','mall.midea.com');}
$('#btnCart').on('click',function(e){e.preventDefault();var me=$(this);var dataClick=me.attr("data-click");if(dataClick==1){return;}else{me.attr("data-click",1);}
if(cookie.getC('uid')){addCart();}else{cookie.setC('flag_detail_cart',window.strFiid.toString(),60*24*7,'/','mall.midea.com');initLogin(location.href);me.attr("data-click",0);}});$('#btnBuy, #btnFixBuy, #btnCartBuy').on('click',function(e){e.preventDefault();var sellerId=parseInt(URL.getUrlParam('sellerid',location.href),10);if(nCalStock==0||nState==1){return;}
if(nFlag&&(nFlag==1)){var isBuy=$("#btnBuy").attr("is-buy");if(typeof(isBuy)!=undefined&&isBuy==2){return;}}
if(nFlag&&(nFlag==2)){var isBuy=$("#btnBuy").attr("is-buy"),now=new Date().getTime(),killStartDate=(activeInfo['activeStartTime']*1000-now-delta);if((typeof(isBuy)!=undefined&&(isBuy==2))||(killStartDate>(60*30*1000))){return;}}
var buyNum=parseInt($('#num').val()-0);if(typeof nQuotaNum!='undefined'&&buyNum>nQuotaNum&&nQuotaNum){alert("您已超过限购数量"+nQuotaNum+"件，不能继续购买");$('#num').val(nQuotaNum);return;}
var url='https://mall.midea.com/confirm_order/checkout?',presell_url='https://mall.midea.com/order/buyer/confirm_order_presell?',seckill_url='https://mall.midea.com/miao/confirmorder?';var params='skuid='+lDisSkuId
+'&buynum='+buyNum
+'&disid='+lDisId
+'&icid='+icid
+'&addr_code='+addr_code
+'&regsrc='+regsrc;if(nFlag&&(nFlag==1)){url=presell_url+params;}else if(nFlag&&(nFlag==2)){url=seckill_url+params;}else{url=url+params;}
commonJump(url,1);});}
function addCart(){var buyNum=parseInt($('#num').val()-0);if(typeof nQuotaNum!='undefined'&&buyNum>nQuotaNum&&nQuotaNum){alert("您已超过限购数量"+nQuotaNum+"件，不能继续购买");$('#num').val(nQuotaNum);return;}
var cartData={sku_id:lDisSkuId,num:buyNum,sellerid:0};if(window.strFiid){cartData['itemid']=window.strFiid;}
var params={};$.ajax({type:'POST',data:cartData,url:'//mall.midea.com/cart/index/ajax_add_item',dataType:'json',success:function(data){if(data.errcode==0){params={'hinter_text':'添加成功!','button_text_l':'继续购物','button_text_r':'去结算','button_url_l':'','button_url_r':'//mall.midea.com/cart?fsid='+window.strFsid}
detailCommonPop(params,data,'double');}else{params={'hinter_text':'添加失败!<br/>'+data.errmsg,'button_text_l':'立即购买','button_text_r':'整理购物车','button_url_l':'','button_url_r':'//mall.midea.com/cart?fsid='+window.strFsid}
detailCommonPop(params,data,'buy');}
$('#btnCart').attr("data-click",0);},error:function(data){params={'hinter_text':'添加失败!<br/>','button_text_l':'立即购买','button_text_r':'整理购物车','button_url_l':'','button_url_r':'//mall.midea.com/cart?fsid='+window.strFsid}
detailCommonPop(params,data,'buy');$('#btnCart').attr("data-click",0);}});}
function initSku(){var classDisabled='option_disabled';var classSelected='option_selected';var classOption='option';var skuWrapSelector='#skuWrap';var colorSelector='#skuColor';var specSelector='#skuSpec';var skuMap={'color':{},'spec':{}};if(nFlag==0){if(nState==1){$('.tabs_nav_right').removeClass('out_stock').addClass('no_sku');}else if((nState==2&&nCalStock==0)||nState==3){$('.tabs_nav_right').removeClass('no_sku').addClass('out_stock');}}
if(strSpec){$(colorSelector).find('.'+classOption).each(function(){if($(this).attr('name')==strSpec.colorName){$(this).addClass(classSelected).siblings().removeClass(classSelected);}});$(specSelector).find('.'+classOption).each(function(){if($(this).text()==strSpec.specName){$(this).addClass(classSelected).siblings().removeClass(classSelected);}});}
$.each(oItemSkuInfo.mapwxskuinfo,function(index,item){if(item.strSpec){var curSpec=JSON.parse(item.strSpec);if(!skuMap.color[curSpec.colorName]){skuMap.color[curSpec.colorName]=[{'name':curSpec.specName,'stock':item.nCalStock}];}else{for(var i=0;i<skuMap.color[curSpec.colorName].length;i++){if(skuMap.color[curSpec.colorName][i]==curSpec.specName){return false;}}
skuMap.color[curSpec.colorName].push({'name':curSpec.specName,'stock':item.nCalStock});}
$.each(oItemSkuInfo.mapwxskuinfo,function(index,item){var curSpec=JSON.parse(item.strSpec);if(!skuMap.spec[curSpec.specName]){skuMap.spec[curSpec.specName]=[{'name':curSpec.colorName,'stock':item.nCalStock}];}else{for(var i=0;i<skuMap.spec[curSpec.specName].length;i++){if(skuMap.spec[curSpec.specName][i]==curSpec.colorName){return false;}}
skuMap.spec[curSpec.specName].push({'name':curSpec.colorName,'stock':item.nCalStock});}});}});$.each(skuMap.color,function(key,item){for(var i=0;i<item.length;i++){if(item[i].stock!=0){break;}}});$.each(skuMap.spec,function(key,item){for(var i=0;i<item.length;i++){if(item[i].stock!=0){break;}}});$(skuWrapSelector).find('.'+classOption).on(eventType,function(){if(!$(this).hasClass(classDisabled)){countMtag($(this));$(this).addClass(classSelected).siblings().removeClass(classSelected);var colorText=$(colorSelector).find('.'+classSelected).attr('name');var specText=$(specSelector).find('.'+classSelected).text();var specFlag=false;$.each(oItemSkuInfo.mapwxskuinfo,function(index,item){var item_id=item.strFiid;if(specText==''){if(colorText==JSON.parse(item.strSpec).colorName){location.href=location.href.replace(/(\?|&)id\=\d+/ig,'$1id='+index).replace(/(\?|&)itemid\=\d+/ig,'$1itemid='+item_id);specFlag=true;}}else{if(colorText==JSON.parse(item.strSpec).colorName&&specText==JSON.parse(item.strSpec).specName){location.href=location.href.replace(/(\?|&)id\=\d+/ig,'$1id='+index).replace(/(\?|&)itemid\=\d+/ig,'$1itemid='+item_id);specFlag=true;}}});if(!specFlag){var btnBuy=$('#btnBuy');var btnCart=$('#btnCart');$('.floor_btn').removeClass('out_stock').addClass('no_sku');$('.tabs_nav_right').removeClass('out_stock').addClass('no_sku');btnCart.addClass('no_sku');$('.product_status').html('无货');$('#minus, #plus,#btnAlarm,#btnCart').off(eventType);$('.primary_btn').html('商品已被抢光，看看别的吧');$('#btnFixBuy').find('.primary_btn').html('商品已被抢光');$('.stock_status').text('库存0');nCalStock=0;clearInterval(window.activeTimer);btnBuy.attr('is-buy',2);$('.stock_right').addClass('stock_none');}}});}
function initFloatingWxcode(){$('#floating_wxcode').hover(function(){countMtag($(this));$('#floating_wxcode_content').show();},function(){$('#floating_wxcode_content').hide();});$('#scroll_to_top').on('click',function(e){e.preventDefault();countMtag($(this));$(window).scrollTop(0);});var backUrl=location.href;if(cookie.getC('flag_detail_chat')&&cookie.getC('flag_detail_chat')==1&&lUin){cookie.del('flag_detail_chat','','mall.midea.com');openChatWindow(lUin);}
$("#to_kefu").on("click",function(e){e.preventDefault();countMtag($(this));if(lUin){openChatWindow(lUin);}
else{cookie.setC('flag_detail_chat','1',60*24*7,'/','mall.midea.com');initLogin(backUrl);}});if(cookie.getC('flag_detail_chat')){cookie.del('flag_detail_chat','','mall.midea.com');}}
function openChatWindow(lUin){var clientWidth=document.documentElement.clientWidth;var clientHeight=document.documentElement.clientHeight;var chatWindowLeft;if(clientWidth<=800){chatWindowLeft=0;}
else{chatWindowLeft=(clientWidth-800)/2;}
var chatWindowTop;if(clientHeight<=600){chatWindowTop=0;}
else{chatWindowTop=(clientHeight-600)/2;}
window.open("http://61.145.111.29:9080/iccwebchat/main?channelID=144785593983573736&uin="+lUin,"_blank","left="+chatWindowLeft+",top="+chatWindowTop+",location=no,width=800,height=600");}
function initTabs(){var tabs=$('.tabs_nav li'),tabContents=$('.tabs_content'),tabWrap=$('.tabs_nav_inner_wrap'),initPos=tabWrap.offset().top;tabs.click(function(){tabs.removeClass('cur');$(this).addClass('cur');var currentTabId=$(this).data('tab');tabContents.removeClass('cur');$(currentTabId).addClass('cur');countMtag($(this));});$('.J_floor_comment').on('click',function(){tabs.removeClass('cur');$('#nav_user_evaluation').addClass('cur');tabContents.removeClass('cur');$('#user_evaluation').addClass('cur');$(window).scrollTop(initPos);tabWrap.addClass('tabs_nav_fixed');report.rd({'mtag':'30007.8.1'});});$('.js_floor_package').on('click',function(){var packagePos=$('.js_rp_wrap').offset().top;$(window).scrollTop(packagePos);})}
function handleFixed(){var flagDetailPic=true;var $tabWrap=$('.tabs_nav_inner_wrap'),initPos=$tabWrap.offset().top;var scrollTimer;$(window).on('scroll',function(){clearTimeout(scrollTimer);scrollTimer=setTimeout(function(){$(this).scrollTop()>=initPos?$tabWrap.addClass('tabs_nav_fixed'):$tabWrap.removeClass('tabs_nav_fixed');},50);if(flagDetailPic){flagDetailPic=false;var detailPic=$('#product_intro').find('img');for(var j=0;j<detailPic.length;j++){detailPic.eq(j).attr('src',detailPic.eq(j).attr('init_src'));}}});$('.tabs_nav').on('click',function(){$(window).scrollTop(initPos);clearTimeout(scrollTimer);scrollTimer=setTimeout(function(){$(this).scrollTop()>=initPos?$tabWrap.addClass('tabs_nav_fixed'):$tabWrap.removeClass('tabs_nav_fixed');},50);});}
function initTimer(){var oTime=$("#intervalTime");var now=new Date().getTime();var date3;date3=(activeInfo['activeEndTime']*1000-now-delta);var aTime=intervalTime(date3);if(date3<=0){clearInterval(window.activeTimer);oTime.html("当前活动已结束，最新价格请<a href='#' onclick='location.reload();' style='color: blue'>刷新页面</a>查看");}else{oTime.html(aTime[0]+"天"+aTime[1]+"小时"+aTime[2]+"分"+aTime[3]+"秒后活动结束");}}
function initPreTimer(){var oPreSaleTime=$("#intervalPreTime");var now=new Date().getTime();var preDate;preDate=(activeInfo['activePreEndTime']*1000-now-delta);var aPreTime=intervalTime(preDate);if(preDate<=0){clearInterval(window.activeTimer);oPreSaleTime.html("当前活动已结束，最新价格请<a href='#' onclick='location.reload();' style='color: blue'>刷新页面</a>查看");$(".floor_btn").addClass("no_sku");$("#btnBuy").html("预定结束").attr("is-buy","2");$("#btnFixBuy").find(".primary_btn").html("预定结束");$(".tabs_nav_right").addClass("no_sku");}else{oPreSaleTime.html('距离活动结束还剩'+aPreTime[0]+"天"+aPreTime[1]+"小时"+aPreTime[2]+"分"+aPreTime[3]+"秒");}}
function initKillTimer(){var oKillTime=$('#intervalKillTime'),floorHinter=$('.floor_hinter');var now=new Date().getTime();var killEndDate=(activeInfo['activeEndTime']*1000-now-delta);var killStartDate=(activeInfo['activeStartTime']*1000-now-delta);var aKillTime=intervalTime(killStartDate);if(killEndDate<=0){$('.primary_btn').html('抢光了');$('.btn_seckill').addClass('no_sku');clearInterval(window.activeTimer);}else{if(killStartDate>0){if(killStartDate<=(60*30*1000)){$("#btnBuy").attr('is-buy','1');$('.btn_seckill').removeClass('no_sku');floorHinter.removeClass('floor_hinter_seckill_off').addClass('floor_hinter_seckill_ready');}
oKillTime.find('#killTimeH').html(aKillTime[1]);oKillTime.find('#killTimeM').html(aKillTime[2]);oKillTime.find('#killTimeS').html(aKillTime[3]);}else{if(activeInfo['activeStatus']==2){$('.primary_btn').html('去秒杀');floorHinter.removeClass('floor_hinter_seckill_ready').addClass('floor_hinter_seckill_ing');}
clearInterval(window.activeTimer);}}}
function intervalTime(date3,type){var days=Math.floor(date3/(24*3600*1000));if(days<10){days='0'+days;}
var leave1=date3%(24*3600*1000);var hours=Math.floor(leave1/(3600*1000));if(hours<10){hours='0'+hours;}
var leave2=leave1%(3600*1000);var minutes=Math.floor(leave2/(60*1000));if(minutes<10){minutes='0'+minutes;}
var leave3=leave2%(60*1000);var seconds=Math.round(leave3/1000);if(seconds<10){seconds='0'+seconds;}
return[days,hours,minutes,seconds];}
function initAreaEvent(){var dom_cache={'addr_code':addrCode.split(','),'addr_text':addrText.split(','),'address_tmpl':$('#AddessTmpl').html(),'address_list':$('.address_list'),'address_list_top':$('.address_list_top'),'address_selected':$('.address_selected'),'address_selected_province':$(".address_selected_province"),'address_selected_city':$(".address_selected_city"),'address_selected_area':$(".address_selected_area"),'address_list_bottom':$('.address_list_bottom'),'address_list_option':$('.address_list_option').eq(0),'show_province':$('#showProvince'),'address_list_province':$("#addressListProvince"),'show_city':$('#showCity'),'address_list_city':$("#addressListCity"),'show_area':$('#showArea'),'address_list_area':$("#addressListArea"),'close':$('.close'),'address_callback':function(address){fAddressCallback(address);}};address.method.init(dom_cache);}
function fAddressCallback(address){report.rd({'mtag':'30007.4.1'});var url='https://mall.midea.com/detail/index?id=',presell_url='https://mall.midea.com/detail/index/sale?id=',seckill_url='https://mall.midea.com/detail/index/miao?id=';var address_info=address.provinceId+","+address.cityId+","+address.areaId;cookie.del('addr_code','','mall.midea.com');cookie.del('addr_code','','.mall.midea.com');cookie.setC('addr_code',address_info,60*24*7,'/','.midea.com');var params=nSkuid+"&icid="+icid;location.href=url;if(nFlag&&(nFlag==1)){url=presell_url+params;}else if(nFlag&&(nFlag==2)){url=seckill_url+params;}else{url=url+params;}
commonJump(url,2);}
function getSkuTagList(){$.ajax({type:'POST',data:{'skuId':icid},url:'//mall.midea.com/detail/comment/get_tag_list',dataType:'json',success:function(data){if(data.errcode==0&&data.list){$('#tagBox').removeClass('hide');$('#tagList').html(formatJson.render($('#tagsTemp').html(),{data:data.list}));}},error:function(){}});}
function getSkucommentList(pn){var $commentWrap=$('#user_evaluation');$('.J_comment_load').removeClass('hide');$.ajax({type:'POST',data:{'pn':pn,'skuId':nSkuid},url:'//mall.midea.com/detail/comment/get_skucomment_list_skuid',dataType:'json',timeout:15000,error:function(){$('.J_comment_load').addClass('hide');$commentWrap.html(" <div class='tabs_content_hinter'>评价信息拉取失败，请刷新页面重试！</div>");$commentWrap.removeClass('hide');},success:function(data){if(data.errcode==0){if(pn==1){var totalScore=(data.totalScore/500)*116+'px';$("#scoreBox").css("width",totalScore);$('.J_comment_main').removeClass('hide');}
if(data.recordCount==0){var trialDetail=window.trialDetail||{};if(trialDetail&&(trialDetail.length!=0)){$('.evaluate_content_wrap').html('');}else{$commentWrap.html('<div class="tabs_content_hinter">非常抱歉，本产品暂无“评价”，您可查看其它服务。</div>');}
$commentWrap.removeClass('hide');}else{$commentWrap.removeClass('hide');$('#commentList').html(formatJson.render($('#commentTmpl').html(),{data:data}));page.init({pageCount:data.pageCount,currentPage:pn,domList:[$('.pagination_inner')[0]],url:"javascript:void(0)",action:"func",type:"simple",func:function(pn){getSkucommentList(pn);},onInit:function(){}});initComment();}
$('.J_comment_load').addClass('hide');}else{$commentWrap.html(" <div class='tabs_content_hinter'>系统繁忙，请稍后再试！</div>");$commentWrap.removeClass('hide');}}});}
function initComment(){$('.J_comment_img').on('click',function(){var $J_img_big=$(this).parent().parent().find('.J_img_big');if($(this).hasClass('item_cur')){$(this).removeClass('item_cur');$J_img_big.addClass('hide');}else{$(this).siblings().removeClass('item_cur');$(this).addClass('item_cur');$J_img_big.attr('src',$(this).find('.small_img').attr('src'));$J_img_big.removeClass('hide');}});$('.J_comment_like').on('click',function(){var $this=$(this),sMac=cookie.get('midea_mk'),commentId=$this.attr("commentId");var praiseLayer=$.mpopup({id:'praiseLayer'}),$praiseTip=$("#praiseTip");$.ajax({type:'POST',data:{'commentId':commentId,'mac':sMac,'skuId':icid},url:'//mall.midea.com/detail/comment/point_praise',dataType:'json',success:function(data){$('#btnCart').attr("data-click",0);if(data.errcode==0){if(data.data==0){var oRateCount=$this.find(".evaluate_count");oRateCount.html("( "+(parseInt($this.attr("rateCount"))+1)+" )");$this.addClass("already_praise");}else if(data.data==1||data.data==2){var params={'hinter_text':'不可重复点赞','button_text_l':'','button_text_r':'关 闭','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');$this.addClass("already_praise");}}else{var params={'hinter_text':'系统繁忙，请稍后再试','button_text_l':'','button_text_r':'关 闭','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');}},error:function(data){var params={'hinter_text':'系统繁忙，请稍后再试','button_text_l':'','button_text_r':'关 闭','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');}});});}
function initCollect(){$("#btnCollect").on('click',function(e){e.preventDefault();countMtag($(this));if($(this).hasClass("collected_btn")){deleteCollect();}else{addCollect();}});$('#selectCut').on('click',function(){$(this).toggleClass('item_choose_checked');})
if(cookie.getC('uid')){isCollected(nSkuid);loginCollect();}
$('#btnConfirmCutReminder').on('click',function(){if($('#selectCut').hasClass('item_choose_checked')){addConfirmCutReminder();}else{confirmCutReminder.hide();}});}
function addConfirmCutReminder(){$.ajax({type:"GET",url:"//mall.midea.com/next/itemabout/pricecutnotify",dataType:"json",data:{itemid:window.strFiid,areacode:window.addrCode},success:function(data){if(data.errcode==0){confirmCutReminder.hide();}},fail:function(){}});}
function addCollect(){var url='https://mall.midea.com/detail/index?itemid='+window.strFiid,$collectBtn=$("#btnCollect"),$textCollect=$("#textCollect");if(cookie.getC('uid')){$.ajax({type:'POST',data:{skuId:nSkuid,itemid:window.strFiid},url:'//mall.midea.com/my/collect/add_collect',dataType:'json',success:function(data){var flag=data.data;if(flag==0){$collectBtn.addClass('collected_btn');$textCollect.html("已收藏");if(window.nFlag&&(window.nFlag==1||window.nFlag==2)){var params={'hinter_text':'收藏成功!<br/>请在 个人中心-我的收藏 查看','button_text_l':'关 闭','button_text_r':'查看我的收藏','button_url_l':'','button_url_r':'//mall.midea.com/my/collect/index'}
detailCommonPop(params,data,'double');}else{$('#selectCut').addClass('item_choose_checked');confirmCutReminder.show();}}else if(data.errCode==539299879||data.errCode==539299861){window.location.href='//mall.midea.com/my/index/registuid?rurl='+url;cookie.setC('flag_detail_collect',window.strFiid.toString(),60*24*7,'/','mall.midea.com');}else{if(flag==549326853){$collectBtn.addClass('collected_btn');$textCollect.html("已收藏");}
var params={'hinter_text':'收藏失败!<br/>'+data.errmsg,'button_text_l':'关 闭','button_text_r':'查看我的收藏','button_url_l':'','button_url_r':'//mall.midea.com/my/collect/index'}
detailCommonPop(params,data,'double');}},error:function(data){var params={'hinter_text':'系统繁忙，请稍后再试','button_text_l':'','button_text_r':'','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');}});}else{initLogin(url);cookie.setC('flag_detail_collect',window.strFiid.toString(),60*24*7,'/','mall.midea.com');}}
function deleteCollect(){var url='https://mall.midea.com/detail/index?itemid='+window.strFiid,$collectBtn=$("#btnCollect"),$textCollect=$("#textCollect");if(cookie.getC('uid')){$.ajax({type:'POST',data:{skuId:nSkuid,itemid:window.strFiid},url:'//mall.midea.com/my/collect/delete_collect',dataType:'json',success:function(data){var flag=data.data;if(flag=='0'){$collectBtn.removeClass('collected_btn');$textCollect.html("收藏");}},error:function(data){}});}else{initLogin(url);}}
function isCollected(id){var $collectBtn=$("#btnCollect"),$textCollect=$("#textCollect");$.ajax({type:'POST',data:{skuId:id,itemid:window.strFiid},url:'//mall.midea.com/my/collect/is_collected',dataType:'json',success:function(data){if(data=='1'){$collectBtn.addClass('collected_btn');$textCollect.html("已收藏");}else{$collectBtn.removeClass('collected_btn');$textCollect.html("收藏");}},error:function(data){}});}
function loginCollect(){var cc=cookie.getC('flag_detail_collect');if(cc==window.strFiid){addCollect();cookie.del('flag_detail_collect','','mall.midea.com');}}
function initLogin(url){login.create(url);}
function initCoupon(){if(cookie.getC('uid')){loginCoupon();}
if($('.js_coupon_list').height()>=80){$('.J_show_coupon').removeClass('hide');}
$('.J_show_coupon').on('click',function(){$(this).toggleClass('coupon_show_height');$('.J_floor_coupon').toggleClass('floor_coupon_height');});$('.J_get_coupon').on('click',function(){var $this=$(this);if($this.attr('data-click')==0){$this.attr('data-click',1);var $this=$(this);countMtag($this);addCoupon('cur',$this);}});}
function addCoupon(type,$this){var obtainId='';if(type=='login'){obtainId=cookie.getC('flag_detail_coupon_id');cookie.del('flag_detail_coupon_id','','mall.midea.com');}else{obtainId=$this.attr("obtain_id");}
var params={'button_text_r':'查看我的优惠券','button_url_r':'//mall.midea.com/coupon/get_coupon_list','button_text_l':'关 闭','button_url_l':''}
$.ajax({type:"GET",url:"//mall.midea.com/coupon/get_user_coupon",dataType:"json",timeout:8000,data:{'obtainId':obtainId},error:function(response){if($this){$this.attr('data-click',0);}
params['hinter_text']='领取失败!<br/>请稍后重试';if(window.isOw){detailCommonPop(params,response,'double');}else{detailCommonPop(params,response,'single');}},success:function(response){if(response.errcode==539299862||response.errcode==539299865){if($this){$this.attr('data-click',0);}
cookie.setC('flag_detail_coupon',window.strFiid.toString(),60*24*7,'/','mall.midea.com');cookie.setC('flag_detail_coupon_id',obtainId,60*24*7,'/','mall.midea.com');initLogin(location.href);}else{if(response.errcode==0){handleCouponStatus(type,$this);if(window.isOw){params['hinter_text']='领取成功!<br/>请在个人中心-我的优惠券查看';detailCommonPop(params,response,'double');}else{params['hinter_text']='领取成功!<br/>可在下单时直接使用~';detailCommonPop(params,response,'single');}}else if(response.errcode==0x20BA1023){handleCouponStatus(type,$this);if(window.isOw){params['hinter_text']='您已领取!<br/>请在个人中心-我的优惠券查看';detailCommonPop(params,response,'double');}else{params['hinter_text']='您已领取!<br/>可在下单时直接使用~';detailCommonPop(params,response,'single');}}else if(response.errcode==0x20BA1036){handleCouponStatus(type,$this);params['hinter_text']='已结束发放!<br/>下次请早哦';if(window.isOw){detailCommonPop(params,response,'double');}else{detailCommonPop(params,response,'single');}}else if(response.errcode==549064752||response.errcode==549064759){handleCouponStatus(type,$this);params['hinter_text']='已结束发放!<br/>下次请早哦';if(window.isOw){detailCommonPop(params,response,'double');}else{detailCommonPop(params,response,'single');}}else{if($this){$this.attr('data-click',0);}
params['hinter_text']='领取失败!<br/>请稍后重试';if(window.isOw){detailCommonPop(params,response,'double');}else{detailCommonPop(params,response,'single');}}
cookie.del('flag_detail_coupon','','mall.midea.com');cookie.del('flag_detail_coupon_id','','mall.midea.com');}}});}
function handleCouponStatus(type,$this){var $J_get_coupon=$('.J_get_coupon');if(type=='login'){var obtainId=cookie.getC('flag_detail_coupon_id');for(var i=0;i<$J_get_coupon.length;i++){if($J_get_coupon.eq(i).attr('obtain_id')==obtainId){$J_get_coupon.eq(i).parent().addClass('coupon_0');}}}else{$this.parent().addClass('coupon_0');$this.attr('data-click',1);}}
function loginCoupon(){var cc=cookie.getC('flag_detail_coupon');if(cc==window.strFiid){addCoupon('login');cookie.del('flag_detail_coupon','','mall.midea.com');}}
function bindEditNum(){oBuyInfo[nSkuid]={"skuid":nSkuid,"buynum":nBuyNum};editCmdtyNum({strEditDivId:'divEditNum_'+nSkuid,nInitNum:nBuyNum,nMinNum:1,nMaxNum:(nQuotaNum&&(nQuotaNum<nCalStock))?nQuotaNum:nCalStock,afterEdit:function(nNum){oBuyInfo[nSkuid].buynum=nNum;}});}
function editCmdtyNum(oConf){var _oConf=$.extend({strEditDivId:'',nInitNum:0,nMaxNum:0,nMinNum:0,afterEdit:function(nNum){}},oConf),oEditDiv=$('#'+_oConf.strEditDivId),oNumTxt=oEditDiv.find('.num');oNumTxt.val(_oConf.nInitNum);function editNum(nNewNum){if(nNewNum<=_oConf.nMaxNum&&nNewNum>=_oConf.nMinNum){oNumTxt.val(nNewNum);return true;}else{return false;}}
function addNum(){var nNewNum=oNumTxt.val()*1+1;return editNum(nNewNum);}
function delNum(){var nNewNum=oNumTxt.val()*1-1;return editNum(nNewNum);}
function focusNumTxt(){oNumTxt.attr('cacheNum',oNumTxt.val());}
function blurNumTxt(){var nNewNum=oNumTxt.val()*1;if(!editNum(nNewNum)){oNumTxt.val(_oConf.nMaxNum);}else{_oConf.afterEdit(oNumTxt.val());}}
function init(){oEditDiv.click(function(e){var oTarget=e.target;var oTargetName=oTarget.className;if(oTarget.className=='inner'){oTargetName=oTarget.parentNode.className;}
switch(oTargetName){case'minus':if(delNum()){_oConf.afterEdit(oNumTxt.val());countMtag($(this));}
break;case'plus':if(addNum()){_oConf.afterEdit(oNumTxt.val());countMtag($(this));}
break;}});oNumTxt.focus(focusNumTxt).blur(blurNumTxt);}
init();}
function initAlarm(){$('#btnAlarm, #btnFixAlarm').on('click',function(e){e.preventDefault();var $this=$(this);var dataClick=$this.attr("data-click");if(dataClick==1){return;}else{$this.attr("data-click",1);}
bindAlarm();});if(cookie.getC('uid')){loginAlarm();}}
function bindAlarm(){var sellerId=parseInt(URL.getUrlParam('sellerid',location.href),10);if(cookie.getC('uid')){$.ajax({type:'POST',data:{'skuId':nSkuid,'sellerId':sellerId,'addrCode':addrCode,'itemid':window.strFiid},url:'//mall.midea.com/detail/index/add_stock_register',dataType:'json',success:function(data){var errcode=data.errcode;if(errcode==0){initQrcode();var alarmAddress=$(".address_selected_province").html()+'-'+$(".address_selected_city").html()+'-'+$(".address_selected_area").html();$('.J_alarm_address').html('区域：'+alarmAddress);confirmReminder.show();}else if(errcode=='557907977'||errcode=='539299861'){window.location.href='//mall.midea.com/my/index/registuid?rurl='+location.href;cookie.setC('flag_detail_alarm',window.strFiid.toString(),3,'/','mall.midea.com');}else{var params={'hinter_text':'系统繁忙，请稍后再试','button_text_l':'','button_text_r':'','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');}
$('#btnAlarm').attr("data-click",0);$('#btnFixAlarm').attr("data-click",0);},error:function(data){var params={'hinter_text':'系统繁忙，请稍后再试','button_text_l':'','button_text_r':'','button_url_l':'','button_url_r':''}
detailCommonPop(params,data,'none');$('#btnAlarm').attr("data-click",0);$('#btnFixAlarm').attr("data-click",0);}});}else{initLogin(location.href);cookie.setC('flag_detail_alarm',window.strFiid.toString(),3,'/','mall.midea.com');$('#btnAlarm').attr("data-click",0);$('#btnFixAlarm').attr("data-click",0);}}
function loginAlarm(){var cc=cookie.getC('flag_detail_alarm');if(cc==window.strFiid){bindAlarm();cookie.del('flag_detail_alarm','','mall.midea.com');}}
function initQrcode(){var _url='//mall.midea.com/my/user_qr/get_code?scene=1100000000';if(!isOw){_url+='&app=midea_gfwsc';}
$.ajax({type:'GET',url:_url,timeout:10000,dataType:'json',success:function(data){if(data.errcode==0){$('#qrcode').attr('src',data.qrcodeUrl);}else{$('#qrcode').attr('src','//img.mdcdn.cn/h5/img/detail/midea_service.png');}},error:function(){$('#qrcode').attr('src','//img.mdcdn.cn/h5/img/detail/midea_service.png');}});}
function $id(id){return typeof(id)=="string"?document.getElementById(id):id;}
function countMtag(dom){var mtag=dom.attr('mtag');report.rd({'mtag':mtag});}
function initMobileCode(){var qr=new QRcode(document.getElementById("qrcodeTel"),{width:134,height:134});qr.makeCode(window.location.href.replace('mall.midea.com','w.midea.com'));}
function initWxShare(){var qr_wx=new QRcode(document.getElementById("qrcodeWxShare"),{width:190,height:190});qr_wx.makeCode(window.location.href.replace('mall.midea.com','w.midea.com'));$('#wxShare').on('click',function(){$('.js_wxshare_popup').removeClass('hide');});$('#closeWxShare').on('click',function(){$('.js_wxshare_popup').addClass('hide');});}
function initFxHinter(){if(!isOw){var domConfirmFx=$('#confirm_fenxiao');var domDetailCover=$('#detailCover');var isFirstClick=true;$('.js_show_fx_hinter').on('click',function(){if(isFirstClick){var qr_fenxiao=new QRcode(document.getElementById("qrcodeFenxiao"),{width:190,height:190});var locationStr=$(this).attr('data-src');qr_fenxiao.makeCode(locationStr.replace('mall.midea.com','w.midea.com'));isFirstClick=false;}
domConfirmFx.css('display','block');domDetailCover.removeClass('hide');});domDetailCover.on('click',function(){domConfirmFx.css('display','none');domDetailCover.addClass('hide');});$('.js_close_hinter').on('click',function(){domConfirmFx.css('display','none');domDetailCover.addClass('hide');});}}
function initZoomPic(){zoomPic.method.init({mpic:$id("showcase"),cdiv:$id("detailPic"),zicn:$id("pfhlkd_zoomIcon"),ldom:$id("thumbnails"),zpic:$id("zoomPic"),index:0,src:vecPicInfoList['vecPicInfoList530'],src120:vecPicInfoList['vecPicInfoList120'],srcorigin:vecPicInfoList['vecPicInfoListOrigin'],srcsize:vecPicInfoList['vecPicInfoListSize'],config:{limit:800,maxsize:1200,size:500,zoomw:500,zoomh:500}});}
function initAct(){if(nFlag==2&&(activeInfo['activeStatus']==2||activeInfo['activeStatus']==3)&&(nCalStock>0)){window.activeTimer=setInterval(function(){initKillTimer();},1000);}
if(nFlag==0&&activeInfo['activeStatus']==3){window.activeTimer=setInterval(function(){initTimer();},1000);}
if(nMobilePrice<nPcPrice){initMobileCode();}
if(nFlag==1&&activeInfo['activeStatus']==5){window.activeTimer=setInterval(function(){initPreTimer();},1000);}}
function initAsync(){imgTimer=setTimeout(function(){for(var i=1;i<vecPicInfoList['vecPicInfoList530'].length;i++){var vecImg=new Image();vecImg.src=vecPicInfoList['vecPicInfoList530'][i];}
if(window.commentCount){getSkuTagList();getSkucommentList(1);}
var servicePic=$('#servicePic').find('img');for(var k=0;k<servicePic.length;k++){servicePic.eq(k).attr('src',servicePic.eq(k).attr('init_src'));}},1000);}
var packageRecommendObj=function(){this.packageActInfo={};this.domPackageList=$('.js_package_list');this.domPackageTemp=$('#packageTemp');this.domRecommendList=$('.js_recommend_list');this.domRecommendTemp=$('#recommendTemp');this.noDataHinter=$('#noData');this.domRpWrap=$('.js_rp_wrap');this.domNav=$('.js_nav');this.domSwitchPromo=$('.js_switch_promo');this.hasLoadRecommend=0;this.actId=0;this.actType=0;};packageRecommendObj.prototype={init:function(){var meObj=this;meObj.domSwitchPromo.on('click',function(){$(this).toggleClass('switch_promo_on');$('.js_option_promo').toggleClass('option_act_hide');});if(window.productInfo.packageFlag){meObj.loadPackage();meObj.initPackageMethod();if(cookie.getC('uid')){var item_id=cookie.getC('flag_detail_package_list')||"";var act_id=cookie.getC('flag_detail_package_list_id')||"";var act_type=cookie.getC('flag_detail_package_list_type')||"";if((item_id==window.strFiid)&&act_id&&act_type){meObj.actId=act_id;meObj.actType=act_type;cookie.del('flag_detail_package_list','','mall.midea.com');cookie.del('flag_detail_package_list_id','','mall.midea.com');cookie.del('flag_detail_package_list_type','','mall.midea.com');meObj.addPackageCart("");}}}else{meObj.loadRecommend();}},loadPackage:function(){var meObj=this;$.ajax({type:'POST',url:'//mall.midea.com/next/itemabout/itempacklist',data:{'itemid':window.strFiid},dataType:'json',success:function(data){if(data.errcode==0){var itemPackList=data.data.ItemPackList;if(itemPackList){for(var i=0,listLength=itemPackList.length;i<listLength;i++){itemPackList[i].ActivtyTitle=mXss.parse(itemPackList[i].ActivtyTitle,'html');itemPackList[i].ActivtyDesc=mXss.parse(itemPackList[i].ActivtyDesc,'html');var ItemList=itemPackList[i].ItemList;for(var j=0;j<ItemList.length;j++){ItemList[j].ItemTitle=mXss.parse(ItemList[j].ItemTitle,'html');}
itemPackList[i].PageSize=4;itemPackList[i].PageIndex=Math.ceil(itemPackList[i].ItemCount/itemPackList[i].PageSize);var temp={'totalPage':itemPackList[i].PageIndex,'curPage':1};meObj.packageActInfo[itemPackList[i].ActivtyId]=temp;}
meObj.domPackageList.html(formatJson.render(meObj.domPackageTemp.html(),{data:itemPackList}));}else{var _data={'type':'recommend','message':'暂无活动数据，请稍后重试'};meObj.domPackageList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}}else{var _data={'type':'recommend','message':data.errmsg};meObj.domPackageList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}},error:function(data){var _data={'type':'recommend','message':data.errmsg};meObj.domPackageList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}});},loadRecommend:function(){var meObj=this;$.ajax({type:'POST',url:'//mall.midea.com/next/itemabout/itemrecommend',data:{'itemid':window.strFiid,'icid':window.lIcSkuId,'count':5},dataType:'json',success:function(data){if(data.errcode==0){if(data.data.TotalRecords!=0){meObj.domRecommendList.html(formatJson.render(meObj.domRecommendTemp.html(),{data:data.data.SkuInfoList}));}else{var _data={'type':'recommend','message':'暂无活动数据，请稍后重试'};meObj.domRecommendList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}}else{var _data={'type':'recommend','message':data.errmsg};meObj.domRecommendList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}},error:function(data){var _data={'type':'recommend','message':data.errmsg};meObj.domRecommendList.html(formatJson.render(meObj.noDataHinter.html(),{data:_data}));}});},initPackageMethod:function(){var meObj=this;meObj.domNav.on('click',function(){var type=$(this).attr('data-type');if(type=='recommend'){meObj.domRpWrap.addClass('recommend_cur');if(!meObj.hasLoadRecommend){meObj.hasLoadRecommend=1;meObj.loadRecommend();}}else{meObj.domRpWrap.removeClass('recommend_cur');}});$(document).delegate('.js_package_name','click',function(){var id=$(this).attr('data-id'),domPackageName=$('.js_package_name'),domPackageItemWrap=$('.js_package_item_wrap');domPackageName.removeClass('package_item_cur');$('.js_package_name_'+id).addClass('package_item_cur');domPackageItemWrap.removeClass('package_item_wrap_cur');$('.js_package_item_wrap_'+id).addClass('package_item_wrap_cur');});$(document).delegate('.js_package_page','click',function(){var id=$(this).attr('data-id'),type=$(this).attr('data-type'),domItemWrap=$('.js_package_item_wrap_'+id);var pageInfo=meObj.packageActInfo[id];if(type=='next'){if(pageInfo.curPage<pageInfo.totalPage){pageInfo.curPage++;domItemWrap.find('.js_package_inner').removeClass('package_item_active');domItemWrap.find('.js_package_inner_'+pageInfo.curPage).addClass('package_item_active');domItemWrap.find('.js_package_page_before').removeClass('bar_invalid');if(pageInfo.curPage==pageInfo.totalPage){domItemWrap.find('.js_package_page_next').addClass('bar_invalid');}}}else{if(pageInfo.curPage>1){pageInfo.curPage--;domItemWrap.find('.js_package_inner').removeClass('package_item_active');domItemWrap.find('.js_package_inner_'+pageInfo.curPage).addClass('package_item_active');domItemWrap.find('.js_package_page_next').removeClass('bar_invalid');if(pageInfo.curPage==1){domItemWrap.find('.js_package_page_before').addClass('bar_invalid');}}}});$(document).delegate('.js_package_cart','click',function(){var me=$(this);meObj.actId=me.attr('data-id'),meObj.actType=me.attr('data-type');if(cookie.getC('uid')){var act_click=me.attr('data-click');if(act_click==0){me.attr('data-click',1);meObj.addPackageCart(this);}}else{cookie.setC('flag_detail_package_list',window.strFiid.toString(),60*24*7,'/','mall.midea.com');cookie.setC('flag_detail_package_list_id',meObj.actId,60*24*7,'/','mall.midea.com');cookie.setC('flag_detail_package_list_type',meObj.actType,60*24*7,'/','mall.midea.com');initLogin(location.href);}})},addPackageCart:function(me){var meObj=this;var cartData={act_id:meObj.actId,act_type:meObj.actType,num:1,itemid:window.strFiid};var params={};$.ajax({type:'POST',data:cartData,url:'//mall.midea.com/cart/index/ajax_add_item',dataType:'json',success:function(data){if(me){$(me).attr('data-click',0);}
if(data.errcode==0){params={'hinter_text':'添加成功!','button_text_l':'继续购物','button_text_r':'去结算','button_url_l':'','button_url_r':'//mall.midea.com/cart?fsid='+window.strFsid}
detailCommonPop(params,data,'double');}else{params={'hinter_text':'添加失败!<br/>'+data.errmsg,'button_text_l':'整理购物车','button_text_r':'','button_url_l':'//mall.midea.com/cart?fsid='+window.strFsid,'button_url_r':''}
detailCommonPop(params,data,'single');}},error:function(data){if(me){$(me).attr('data-click',0);}
params={'hinter_text':'添加失败!<br/>'+data.errmsg,'button_text_l':'整理购物车','button_text_r':'','button_url_l':'//mall.midea.com/cart?fsid='+window.strFsid,'button_url_r':''}
detailCommonPop(params,data,'single');}});}};function toggleContrast(){var itemid=URL.getUrlParam('itemid',location.href);$(document).on('click','.js_toggle_contrast',function(){var cateid=$(this).data('cate-id');compareList.toggleContrast($(this),itemid,cateid);});}
exports.init=function(){initFxHinter();initZoomPic();initSku();bindBuyCart();bindEditNum();initAreaEvent();initCoupon();initAct();if(window.isOw){var packageRecommend=new packageRecommendObj();packageRecommend.init();}
initCollect();initTabs();handleFixed();initFloatingWxcode();initAlarm();initAsync();initWxShare();toggleContrast();}});
define('md5',function(require,exports,module){var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz));}
function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz));}
function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz));}
function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data));}
function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data));}
function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data));}
function md5_vm_test(){return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72";}
function core_md5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}
return Array(a,b,c,d);}
function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}
function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}
function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}
function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}
function core_hmac_md5(key,data){var bkey=str2binl(key);if(bkey.length>16)bkey=core_md5(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128);}
function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}
function str2binl(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)
bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);return bin;}
function binl2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)
str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);return str;}
function binl2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+
hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);}
return str;}
function binl2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F);}}
return str;}
exports.hex_md5=hex_md5;exports.b64_md5=b64_md5;exports.str_md5=str_md5;exports.hex_hmac_md5=hex_hmac_md5;exports.b64_hmac_md5=b64_hmac_md5;exports.str_hmac_md5=str_hmac_md5;});
define('page',function(require,exports,module){function $page(opt){var option={keyId:Math.random(),pageCount:0,currentPage:0,itemCount:0,more:false,domList:[],type:"full",action:"url",url:"http://www.paipai.com/?pid={#pageId#}",func:function(pageId,opt){return true;},onInit:function(pageId,opt){return true;}};for(var i in opt){option[i]=opt[i];}
var standStyle=['','{#goTo#}<a href="#nolink" pageTag="go" pageId="{#pageId#}">{#pageId#}</a>{#goTo/#} {#current#}<span class="page-this">{#pageId#}</span>{#current/#}{#hide#}<span class="page-break">...</span>{#hide/#}{#next#}<a href="#nolink" class="page-next" pageTag="go" pageId="{#pageId#}">&gt;</a>{#next/#}{#_next#}<span class="page-end">&gt;</span>{#_next/#}{#previou#}<a href="#nolink" pageTag="go" pageId="{#pageId#}" class="page-prev">&lt;</a>{#previou/#}{#_previou#}<span class="page-start">&lt;</span>{#_previou/#}{#first#}{#first/#}{#_first#}{#_first/#}{#last#}{#last/#}{#_last#}{#_last/#}{#more#}<span class="page-break">...</span>{#more/#}{#_more#}{#_more/#}'];var templateList={full:[standStyle[0],standStyle[1],'<div class="paginator">{#previousPage#}{#pageList#}{#morePage#}{#nextPage#}<span class="page-skip"> 到第<input type="text" name="inputItem" pageTag="input" value="{#currentPageId#}"  maxlength="{#maxlength#}" {#debugtag#} />页<button pageTag="jumper" value="go">确定</button></span></div>'],simple:[standStyle[0],standStyle[1],'<div class="paginator">{#previousPage#}{#pageList#}{#morePage#}{#nextPage#}</div>'],shortSimple:[standStyle[0],standStyle[1],'<div class="paginator">{#previousPage#}{#shortPageList#}{#morePage#}{#nextPage#}</div>'],miniSimple:[standStyle[0],standStyle[1],'<div class="paginator">{#previousPage#}{#miniPageList#}{#nextPage#}</div>'],noLastTmpl:[standStyle[0],standStyle[1],'<div class="paginator">{#previousPage#}{#noLastTmpl#}{#nextPage#}</div>']};var template=templateList[option.type][0]+templateList[option.type][1]+templateList[option.type][2];var pageCount=parseInt(option.pageCount);var currentPage=parseInt(option.currentPage);var itemCount=parseInt(option.itemCount);currentPage=(currentPage>pageCount)?pageCount:currentPage;var pt={next:"",_next:"",previou:"",_previou:"",first:"",_first:"",last:"",_last:"",more:"",_more:"",goTo:"",current:"",hide:""};for(var i in pt){var r=(new RegExp("{#"+i+"#}(.*){#"+i+"/#}","ig")).exec(template);pt[i]=(r)?RegExp.$1:"";}
pt.nextPageHtml=(currentPage<pageCount)?(pt.next.replace(/{#pageId#}/g,(currentPage+1))):(pt._next);pt.previousPageHtml=(currentPage>1)?(pt.previou.replace(/{#pageId#}/g,(currentPage-1))):(pt._previou);pt.firstPageHtml=(currentPage>1)?(pt.first.replace(/{#pageId#}/g,1)):(pt._first);pt.lastPageHtml=(currentPage<pageCount)?(pt.last.replace(/{#pageId#}/g,pageCount)):(pt._last);pt.morePageHtml=(option.more)?(pt.more.replace(/{#pageId#}/g,(pageCount+1))):(pt._more);pt.pagelistHtml="";pt.shortPageListHtml="";pt.noLastTmplHtml="";pt.miniPageListHtml="<span>"+currentPage+"/"+pageCount+"</span>";if(pageCount<=10){for(var i=1;i<=pageCount;i++){pt.pagelistHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}}
else{var prePage=currentPage-3;var frePage=currentPage+3;prePage=(prePage<=3)?1:prePage;frePage=(frePage>pageCount-3)?pageCount:frePage;if(currentPage<=6){frePage=8}
pt.pagelistHtml+=(currentPage>6)?(pt.goTo.replace(/{#pageId#}/g,1)+pt.hide):"";for(i=prePage;i<=frePage;i++){pt.pagelistHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}
pt.pagelistHtml+=(currentPage<=pageCount-6)?(pt.hide+pt.goTo.replace(/{#pageId#}/g,pageCount)):"";}
if(pageCount<=8){for(var i=1;i<=pageCount;i++){pt.shortPageListHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}}
else{var prePage=currentPage-2;var frePage=currentPage+2;prePage=(prePage<=2)?1:prePage;frePage=(frePage>pageCount-2)?pageCount:frePage;if(currentPage<=4){frePage=6;}
pt.shortPageListHtml+=(currentPage>4)?(pt.goTo.replace(/{#pageId#}/g,1)+pt.hide):"";for(i=prePage;i<=frePage;i++){pt.shortPageListHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}
pt.shortPageListHtml+=(currentPage<=pageCount-4)?(pt.hide+pt.goTo.replace(/{#pageId#}/g,pageCount)):"";}
if(pageCount<=6){for(var i=1;i<=pageCount;i++){pt.noLastTmplHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}}
else{var prePage=currentPage-2;var frePage=currentPage+1;prePage=(prePage<=3)?1:prePage;frePage=(frePage>pageCount-1)?pageCount:frePage;pt.noLastTmplHtml+=(currentPage>5)?(pt.goTo.replace(/{#pageId#}/g,1)+pt.goTo.replace(/{#pageId#}/g,2)+pt.hide):"";for(i=prePage;i<=frePage;i++){pt.noLastTmplHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}
pt.noLastTmplHtml+=(currentPage<=pageCount-2)?pt.hide:"";}
if(option.more){pt.pagelistHtml="";for(var i=1;i<=pageCount;i++){pt.pagelistHtml+=(i==currentPage)?(pt.current.replace(/{#pageId#}/g,i)):(pt.goTo.replace(/{#pageId#}/g,i));}
pt.shortPageListHtml=pt.pagelistHtml;}
template=templateList[option.type][2].replace(/{#currentPageId#}/g,currentPage).replace(/{#pageCountNum#}/g,pageCount).replace(/{#itemCountNum#}/g,itemCount).replace(/{#firstPage#}/g,pt.firstPageHtml).replace(/{#previousPage#}/g,pt.previousPageHtml).replace(/{#nextPage#}/g,pt.nextPageHtml).replace(/{#lastPage#}/g,pt.lastPageHtml).replace(/{#pageList#}/g,pt.pagelistHtml).replace(/{#shortPageList#}/g,pt.shortPageListHtml).replace(/{#morePage#}/g,pt.morePageHtml).replace(/{#miniPageList#}/g,pt.miniPageListHtml).replace(/{#noLastTmpl#}/g,pt.noLastTmplHtml).replace(/{#maxlength#}/g,pageCount.toString().length);var frameList=[];var inputList=[];var buttomList=[];var linkList=[];frameList=frameList.concat(getItemFromArray(option.domList));function getItemFromArray(arr){var array=[];for(var k=0;k<arr.length;k++){if(arr[k].length>0){array=array.concat(getItemFromArray(arr[k]));}
else{array.push(arr[k]);}}
return array;}
var k=frameList.length;for(var i=0;i<frameList.length;i++){try{frameList[i].innerHTML=template.replace(/{#debugtag#}/g,i);var temp=frameList[i].getElementsByTagName("input");for(var j=0;j<temp.length;j++){if(temp[j].getAttribute("pageTag")=="input"){inputList.push(temp[j]);}}
var temp=frameList[i].getElementsByTagName("button");for(var j=0;j<temp.length;j++){if(temp[j].getAttribute("pageTag")=="jumper"){buttomList.push(temp[j]);}}
var temp=frameList[i].getElementsByTagName("a");for(var j=0;j<temp.length;j++){if(temp[j].getAttribute("pageTag")=="go"){linkList.push(temp[j]);}}}
catch(e){}}
for(var i=0;i<inputList.length;i++){inputList[i].onblur=function(){this.value=this.value.replace(/[^0-9]/g,'');if(this.value>pageCount||this.value<1){this.value="";}
for(var j=0;j<inputList.length;j++){inputList[j].value=this.value;}};inputList[i].onfocus=function(){this.select();};inputList[i].onkeydown=function(e){var e=window.event||e;if(e.keyCode!=13){return true;}
else{this.onblur();buttomList[0].onclick();return false;}};}
for(var i=0;i<buttomList.length;i++){buttomList[i].onclick=function(){var input=(this.parentElement||this.parentNode).getElementsByTagName("input")[0];var goPage=parseInt(input.value,10);input.onblur();if(goPage<1||!goPage){input.focus();return;}
else{goTo(goPage,option);}};}
for(var i=0;i<linkList.length;i++){if(option.action=="url"){linkList[i].href=option.url.replace("{#pageId#}",linkList[i].getAttribute("pageId"));}
else{linkList[i].onclick=function(){goTo(this.getAttribute("pageId"),option);};}}
goTo=function(pageId,opt){if(opt.action=="url"){location.href=opt.url.replace("{#pageId#}",pageId);}
if(opt.action=="func"){return opt.func(pageId,opt);}
return false;};option.onInit();}
exports.init=function(opt){$page(opt);}});
define('qrcode', function (require, exports, module) {
    /**
     * @fileoverview
     * - Using the 'QRCode for Javascript library'
     * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
     * - this library has no dependencies.
     *
     * @author davidshimjs
     * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
     * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
     */
    var QRCode;

        //---------------------------------------------------------------------
        // QRCode for JavaScript
        //
        // Copyright (c) 2009 Kazuhiko Arase
        //
        // URL: http://www.d-project.com/
        //
        // Licensed under the MIT license:
        //   http://www.opensource.org/licenses/mit-license.php
        //
        // The word "QR Code" is registered trademark of
        // DENSO WAVE INCORPORATED
        //   http://www.denso-wave.com/qrcode/faqpatent-e.html
        //
        //---------------------------------------------------------------------
        function QR8bitByte(data) {
            this.mode = QRMode.MODE_8BIT_BYTE;
            this.data = data;
            this.parsedData = [];

            // Added to support UTF-8 Characters
            for (var i = 0, l = this.data.length; i < l; i++) {
                var byteArray = [];
                var code = this.data.charCodeAt(i);

                if (code > 0x10000) {
                    byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
                    byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
                    byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
                    byteArray[3] = 0x80 | (code & 0x3F);
                } else if (code > 0x800) {
                    byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
                    byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
                    byteArray[2] = 0x80 | (code & 0x3F);
                } else if (code > 0x80) {
                    byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
                    byteArray[1] = 0x80 | (code & 0x3F);
                } else {
                    byteArray[0] = code;
                }

                this.parsedData.push(byteArray);
            }

            this.parsedData = Array.prototype.concat.apply([], this.parsedData);

            if (this.parsedData.length != this.data.length) {
                this.parsedData.unshift(191);
                this.parsedData.unshift(187);
                this.parsedData.unshift(239);
            }
        }

        QR8bitByte.prototype = {
            getLength: function (buffer) {
                return this.parsedData.length;
            },
            write: function (buffer) {
                for (var i = 0, l = this.parsedData.length; i < l; i++) {
                    buffer.put(this.parsedData[i], 8);
                }
            }
        };

        function QRCodeModel(typeNumber, errorCorrectLevel) {
            this.typeNumber = typeNumber;
            this.errorCorrectLevel = errorCorrectLevel;
            this.modules = null;
            this.moduleCount = 0;
            this.dataCache = null;
            this.dataList = [];
        }

        QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col){throw new Error(row+","+col);}
            return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++){this.modules[row][col]=null;}}
            this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7){this.setupTypeNumber(test);}
            if(this.dataCache==null){this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);}
            this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r)continue;for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c)continue;if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}
            return pattern;},createMovieClip:function(target_mc,instance_name,depth){var qr_mc=target_mc.createEmptyMovieClip(instance_name,depth);var cs=1;this.make();for(var row=0;row<this.modules.length;row++){var y=row*cs;for(var col=0;col<this.modules[row].length;col++){var x=col*cs;var dark=this.modules[row][col];if(dark){qr_mc.beginFill(0,100);qr_mc.moveTo(x,y);qr_mc.lineTo(x+cs,y);qr_mc.lineTo(x+cs,y+cs);qr_mc.lineTo(x,y+cs);qr_mc.endFill();}}}
            return qr_mc;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null){continue;}
            this.modules[r][6]=(r%2==0);}
            for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null){continue;}
                this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null){continue;}
            for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}
            for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6){this.modules[i][8]=mod;}else if(i<8){this.modules[i+1][8]=mod;}else{this.modules[this.moduleCount-15+i][8]=mod;}}
            for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8){this.modules[8][this.moduleCount-i-1]=mod;}else if(i<9){this.modules[8][15-i-1+1]=mod;}else{this.modules[8][15-i-1]=mod;}}
            this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6)col--;while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length){dark=(((data[byteIndex]>>>bitIndex)&1)==1);}
            var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask){dark=!dark;}
            this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}
            row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}}}};QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}
            var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}
            if(buffer.getLengthInBits()>totalDataCount*8){throw new Error("code length overflow. ("
                +buffer.getLengthInBits()
                +">"
                +totalDataCount*8
                +")");}
            if(buffer.getLengthInBits()+4<=totalDataCount*8){buffer.put(0,4);}
            while(buffer.getLengthInBits()%8!=0){buffer.putBit(false);}
            while(true){if(buffer.getLengthInBits()>=totalDataCount*8){break;}
                buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8){break;}
                buffer.put(QRCodeModel.PAD1,8);}
            return QRCodeModel.createBytes(buffer,rsBlocks);};QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++){dcdata[r][i]=0xff&buffer.buffer[i+offset];}
            offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}
            var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++){totalCodeCount+=rsBlocks[i].totalCount;}
            var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length){data[index++]=dcdata[r][i];}}}
            for(var i=0;i<maxEcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length){data[index++]=ecdata[r][i];}}}
            return data;};var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};var QRMaskPattern={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),G18:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),G15_MASK:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0){d^=(QRUtil.G15<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)));}
            return((data<<10)|d)^QRUtil.G15_MASK;},getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0){d^=(QRUtil.G18<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)));}
            return(data<<12)|d;},getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}
            return digit;},getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern.PATTERN000:return(i+j)%2==0;case QRMaskPattern.PATTERN001:return i%2==0;case QRMaskPattern.PATTERN010:return j%3==0;case QRMaskPattern.PATTERN011:return(i+j)%3==0;case QRMaskPattern.PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern.PATTERN101:return(i*j)%2+(i*j)%3==0;case QRMaskPattern.PATTERN110:return((i*j)%2+(i*j)%3)%2==0;case QRMaskPattern.PATTERN111:return((i*j)%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++){a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));}
            return a;},getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r){continue;}
            for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c){continue;}
                if(r==0&&c==0){continue;}
                if(dark==qrCode.isDark(row+r,col+c)){sameCount++;}}}
            if(sameCount>5){lostPoint+=(3+sameCount-5);}}}
            for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col))count++;if(qrCode.isDark(row+1,col))count++;if(qrCode.isDark(row,col+1))count++;if(qrCode.isDark(row+1,col+1))count++;if(count==0||count==4){lostPoint+=3;}}}
            for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)){lostPoint+=40;}}}
            for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)){lostPoint+=40;}}}
            var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col)){darkCount++;}}}
            var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;}};var QRMath={glog:function(n){if(n<1){throw new Error("glog("+n+")");}
            return QRMath.LOG_TABLE[n];},gexp:function(n){while(n<0){n+=255;}
            while(n>=256){n-=255;}
            return QRMath.EXP_TABLE[n];},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var i=0;i<8;i++){QRMath.EXP_TABLE[i]=1<<i;}
        for(var i=8;i<256;i++){QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];}
        for(var i=0;i<255;i++){QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;}
        function QRPolynomial(num,shift){if(num.length==undefined){throw new Error(num.length+"/"+shift);}
            var offset=0;while(offset<num.length&&num[offset]==0){offset++;}
            this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++){this.num[i]=num[i+offset];}}
        QRPolynomial.prototype={get:function(index){return this.num[index];},getLength:function(){return this.num.length;},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++){for(var j=0;j<e.getLength();j++){num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));}}
            return new QRPolynomial(num,0);},mod:function(e){if(this.getLength()-e.getLength()<0){return this;}
            var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++){num[i]=this.get(i);}
            for(var i=0;i<e.getLength();i++){num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);}
            return new QRPolynomial(num,0).mod(e);}};function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
        QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined){throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);}
            var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++){list.push(new QRRSBlock(totalCount,dataCount));}}
            return list;};QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};function QRBitBuffer(){this.buffer=[];this.length=0;}
        QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex){this.buffer.push(0);}
            if(bit){this.buffer[bufIndex]|=(0x80>>>(this.length%8));}
            this.length++;}};var QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];

        function _isSupportCanvas() {
            return typeof CanvasRenderingContext2D != "undefined";
        }

        // android 2.x doesn't support Data-URI spec
        function _getAndroid() {
            var android = false;
            var sAgent = navigator.userAgent;

            if (/android/i.test(sAgent)) { // android
                android = true;
                var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

                if (aMat && aMat[1]) {
                    android = parseFloat(aMat[1]);
                }
            }

            return android;
        }

        var svgDrawer = (function() {

            var Drawing = function (el, htOption) {
                this._el = el;
                this._htOption = htOption;
            };

            Drawing.prototype.draw = function (oQRCode) {
                var _htOption = this._htOption;
                var _el = this._el;
                var nCount = oQRCode.getModuleCount();
                var nWidth = Math.floor(_htOption.width / nCount);
                var nHeight = Math.floor(_htOption.height / nCount);

                this.clear();

                function makeSVG(tag, attrs) {
                    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                    for (var k in attrs)
                        if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
                    return el;
                }

                var svg = makeSVG("svg" , {'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': _htOption.colorLight});
                svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                _el.appendChild(svg);

                svg.appendChild(makeSVG("rect", {"fill": _htOption.colorLight, "width": "100%", "height": "100%"}));
                svg.appendChild(makeSVG("rect", {"fill": _htOption.colorDark, "width": "1", "height": "1", "id": "template"}));

                for (var row = 0; row < nCount; row++) {
                    for (var col = 0; col < nCount; col++) {
                        if (oQRCode.isDark(row, col)) {
                            var child = makeSVG("use", {"x": String(row), "y": String(col)});
                            child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
                            svg.appendChild(child);
                        }
                    }
                }
            };
            Drawing.prototype.clear = function () {
                while (this._el.hasChildNodes())
                    this._el.removeChild(this._el.lastChild);
            };
            return Drawing;
        })();

        var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

        // Drawing in DOM by using Table tag
        var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
            var Drawing = function (el, htOption) {
                this._el = el;
                this._htOption = htOption;
            };

            /**
             * Draw the QRCode
             *
             * @param {QRCode} oQRCode
             */
            Drawing.prototype.draw = function (oQRCode) {
                var _htOption = this._htOption;
                var _el = this._el;
                var nCount = oQRCode.getModuleCount();
                var nWidth = Math.floor(_htOption.width / nCount);
                var nHeight = Math.floor(_htOption.height / nCount);
                var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

                for (var row = 0; row < nCount; row++) {
                    aHTML.push('<tr>');

                    for (var col = 0; col < nCount; col++) {
                        aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
                    }

                    aHTML.push('</tr>');
                }

                aHTML.push('</table>');
                _el.innerHTML = aHTML.join('');

                // Fix the margin values as real size.
                var elTable = _el.childNodes[0];
                var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
                var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;

                if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
                    elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
                }
            };

            /**
             * Clear the QRCode
             */
            Drawing.prototype.clear = function () {
                this._el.innerHTML = '';
            };

            return Drawing;
        })() : (function () { // Drawing in Canvas
            function _onMakeImage() {
                this._elImage.src = this._elCanvas.toDataURL("image/png");
                this._elImage.style.display = "block";
                this._elCanvas.style.display = "none";
            }

            // Android 2.1 bug workaround
            // http://code.google.com/p/android/issues/detail?id=5141
            if (this._android && this._android <= 2.1) {
                var factor = 1 / window.devicePixelRatio;
                var drawImage = CanvasRenderingContext2D.prototype.drawImage;
                CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
                    if (("nodeName" in image) && /img/i.test(image.nodeName)) {
                        for (var i = arguments.length - 1; i >= 1; i--) {
                            arguments[i] = arguments[i] * factor;
                        }
                    } else if (typeof dw == "undefined") {
                        arguments[1] *= factor;
                        arguments[2] *= factor;
                        arguments[3] *= factor;
                        arguments[4] *= factor;
                    }

                    drawImage.apply(this, arguments);
                };
            }

            /**
             * Check whether the user's browser supports Data URI or not
             *
             * @private
             * @param {Function} fSuccess Occurs if it supports Data URI
             * @param {Function} fFail Occurs if it doesn't support Data URI
             */
            function _safeSetDataURI(fSuccess, fFail) {
                var self = this;
                self._fFail = fFail;
                self._fSuccess = fSuccess;

                // Check it just once
                if (self._bSupportDataURI === null) {
                    var el = document.createElement("img");
                    var fOnError = function() {
                        self._bSupportDataURI = false;

                        if (self._fFail) {
                            self._fFail.call(self);
                        }
                    };
                    var fOnSuccess = function() {
                        self._bSupportDataURI = true;

                        if (self._fSuccess) {
                            self._fSuccess.call(self);
                        }
                    };

                    el.onabort = fOnError;
                    el.onerror = fOnError;
                    el.onload = fOnSuccess;
                    el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                    return;
                } else if (self._bSupportDataURI === true && self._fSuccess) {
                    self._fSuccess.call(self);
                } else if (self._bSupportDataURI === false && self._fFail) {
                    self._fFail.call(self);
                }
            };

            /**
             * Drawing QRCode by using canvas
             *
             * @constructor
             * @param {HTMLElement} el
             * @param {Object} htOption QRCode Options
             */
            var Drawing = function (el, htOption) {
                this._bIsPainted = false;
                this._android = _getAndroid();

                this._htOption = htOption;
                this._elCanvas = document.createElement("canvas");
                this._elCanvas.width = htOption.width;
                this._elCanvas.height = htOption.height;
                el.appendChild(this._elCanvas);
                this._el = el;
                this._oContext = this._elCanvas.getContext("2d");
                this._bIsPainted = false;
                this._elImage = document.createElement("img");
                this._elImage.alt = "Scan me!";
                this._elImage.style.display = "none";
                this._el.appendChild(this._elImage);
                this._bSupportDataURI = null;
            };

            /**
             * Draw the QRCode
             *
             * @param {QRCode} oQRCode
             */
            Drawing.prototype.draw = function (oQRCode) {
                var _elImage = this._elImage;
                var _oContext = this._oContext;
                var _htOption = this._htOption;

                var nCount = oQRCode.getModuleCount();
                var nWidth = _htOption.width / nCount;
                var nHeight = _htOption.height / nCount;
                var nRoundedWidth = Math.round(nWidth);
                var nRoundedHeight = Math.round(nHeight);

                _elImage.style.display = "none";
                this.clear();

                for (var row = 0; row < nCount; row++) {
                    for (var col = 0; col < nCount; col++) {
                        var bIsDark = oQRCode.isDark(row, col);
                        var nLeft = col * nWidth;
                        var nTop = row * nHeight;
                        _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                        _oContext.lineWidth = 1;
                        _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                        _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

                        // 안티 앨리어싱 방지 처리
                        _oContext.strokeRect(
                                Math.floor(nLeft) + 0.5,
                                Math.floor(nTop) + 0.5,
                            nRoundedWidth,
                            nRoundedHeight
                        );

                        _oContext.strokeRect(
                                Math.ceil(nLeft) - 0.5,
                                Math.ceil(nTop) - 0.5,
                            nRoundedWidth,
                            nRoundedHeight
                        );
                    }
                }

                this._bIsPainted = true;
            };

            /**
             * Make the image from Canvas if the browser supports Data URI.
             */
            Drawing.prototype.makeImage = function () {
                if (this._bIsPainted) {
                    _safeSetDataURI.call(this, _onMakeImage);
                }
            };

            /**
             * Return whether the QRCode is painted or not
             *
             * @return {Boolean}
             */
            Drawing.prototype.isPainted = function () {
                return this._bIsPainted;
            };

            /**
             * Clear the QRCode
             */
            Drawing.prototype.clear = function () {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
                this._bIsPainted = false;
            };

            /**
             * @private
             * @param {Number} nNumber
             */
            Drawing.prototype.round = function (nNumber) {
                if (!nNumber) {
                    return nNumber;
                }

                return Math.floor(nNumber * 1000) / 1000;
            };

            return Drawing;
        })();

        /**
         * Get the type by string length
         *
         * @private
         * @param {String} sText
         * @param {Number} nCorrectLevel
         * @return {Number} type
         */
        function _getTypeNumber(sText, nCorrectLevel) {
            var nType = 1;
            var length = _getUTF8Length(sText);

            for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
                var nLimit = 0;

                switch (nCorrectLevel) {
                    case QRErrorCorrectLevel.L :
                        nLimit = QRCodeLimitLength[i][0];
                        break;
                    case QRErrorCorrectLevel.M :
                        nLimit = QRCodeLimitLength[i][1];
                        break;
                    case QRErrorCorrectLevel.Q :
                        nLimit = QRCodeLimitLength[i][2];
                        break;
                    case QRErrorCorrectLevel.H :
                        nLimit = QRCodeLimitLength[i][3];
                        break;
                }

                if (length <= nLimit) {
                    break;
                } else {
                    nType++;
                }
            }

            if (nType > QRCodeLimitLength.length) {
                throw new Error("Too long data");
            }

            return nType;
        }

        function _getUTF8Length(sText) {
            var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
            return replacedText.length + (replacedText.length != sText ? 3 : 0);
        }

        /**
         * @class QRCode
         * @constructor
         * @example
         * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
         *
         * @example
         * var oQRCode = new QRCode("test", {
	 *    text : "http://naver.com",
	 *    width : 128,
	 *    height : 128
	 * });
         *
         * oQRCode.clear(); // Clear the QRCode.
         * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
         *
         * @param {HTMLElement|String} el target element or 'id' attribute of element.
         * @param {Object|String} vOption
         * @param {String} vOption.text QRCode link data
         * @param {Number} [vOption.width=256]
         * @param {Number} [vOption.height=256]
         * @param {String} [vOption.colorDark="#000000"]
         * @param {String} [vOption.colorLight="#ffffff"]
         * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
         */
        QRCode = function (el, vOption) {
            this._htOption = {
                width : 256,
                height : 256,
                typeNumber : 4,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRErrorCorrectLevel.H
            };

            if (typeof vOption === 'string') {
                vOption	= {
                    text : vOption
                };
            }

            // Overwrites options
            if (vOption) {
                for (var i in vOption) {
                    this._htOption[i] = vOption[i];
                }
            }

            if (typeof el == "string") {
                el = document.getElementById(el);
            }

            if (this._htOption.useSVG) {
                Drawing = svgDrawer;
            }

            this._android = _getAndroid();
            this._el = el;
            this._oQRCode = null;
            this._oDrawing = new Drawing(this._el, this._htOption);

            if (this._htOption.text) {
                this.makeCode(this._htOption.text);
            }
        };

        /**
         * Make the QRCode
         *
         * @param {String} sText link data
         */
        QRCode.prototype.makeCode = function (sText) {
            this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
            this._oQRCode.addData(sText);
            this._oQRCode.make();
            this._el.title = sText;
            this._oDrawing.draw(this._oQRCode);
            this.makeImage();
        };

        /**
         * Make the Image from Canvas element
         * - It occurs automatically
         * - Android below 3 doesn't support Data-URI spec.
         *
         * @private
         */
        QRCode.prototype.makeImage = function () {
            if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
                this._oDrawing.makeImage();
            }
        };

        /**
         * Clear the QRCode
         */
        QRCode.prototype.clear = function () {
            this._oDrawing.clear();
        };

        /**
         * @name QRCode.CorrectLevel
         */
        QRCode.CorrectLevel = QRErrorCorrectLevel;


        return QRCode;
//    exports.qr = QRCode;
});
define('report',function(require,exports,module){var mLoadUrl=require('loadUrl');exports.rd=function(opt){var oParams={curl:location.href,rurl:document.referrer,serviceid:10,mtag:'',skuid:'',shopid:'',command:'',dealid:'',callback:'rdcb'},arrParams=[];for(var key in oParams){var v=opt[key];if(v){oParams[key]=v;}
arrParams.push(key+'='+encodeURIComponent(oParams[key]));}
mLoadUrl.get({url:'//w.midea.com/common/log/rd?'+arrParams.join('&')});};exports.itil=function(opt){var oParams={id:'',state:1,callback:'itilcb'},arrParams=[];for(var key in oParams){var v=opt[key];if(v){oParams[key]=v;}
arrParams.push(key+'='+encodeURIComponent(oParams[key]));}
mLoadUrl.get({url:'//w.midea.com/common/log/itil?'+arrParams.join('&')});}});
define('url',function(require,exports,module){var _cacheThisModule_;module.exports={setHash:function(name){setTimeout(function(){location.hash=name;},0);},getHash:function(url){var u=url||location.hash;return u?u.replace(/.*#/,""):"";},getHashModelName:function(){var hash=this.getHash();return(hash?hash.split("&")[0].split("=")[0]:[]);},getHashActionName:function(){var hash=this.getHash();if(hash=="")return"";return(hash?hash.split("&"):[])[0].split("=")[1];},getHashParam:function(name){var result=this.getHash().match(new RegExp("(^|&)"+name+"=([^&]*)(&|$)"));return result!=null?result[2]:"";},getUrlParam:function(name,url){var u=arguments[1]||window.location.search,reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)"),r=u.substr(u.indexOf("\?")+1).match(reg);return r!=null?r[2]:"";},getParams:function(){var param=[],hash=this.getHash();paramArr=hash?hash.split("&"):[];for(var i=1,l=paramArr.length;i<l;i++){param.push(paramArr[i]);}
return param;},decodeUrl:function(url){url=decodeURIComponent(url);var urlObj=this.parseUrl(url),decodedParam=[];$.each(urlObj.params,function(key,value){value=decodeURIComponent(value);decodedParam.push(key+"="+value);});var urlPrefix=url.split("?")[0];return urlPrefix+"?"+decodedParam.join("&");},parseUrl:function(url){var a=document.createElement('a');a.href=url;return{source:url,protocol:a.protocol.replace(':',''),host:a.hostname,port:a.port,query:a.search,params:(function(){var ret={},seg=a.search.replace(/^\?/,'').split('&'),len=seg.length,i=0,s;for(;i<len;i++){if(!seg[i]){continue;}
s=seg[i].split('=');ret[s[0]]=s[1];}
return ret;})(),file:(a.pathname.match(/([^\/?#]+)$/i)||[,''])[1],hash:a.hash.replace('#',''),path:a.pathname.replace(/^([^\/])/,'/$1'),relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/)||[,''])[1],segments:a.pathname.replace(/^\//,'').split('/')};},redirectUrl:function(url){if(/^http(s?):\/\/([^\/]*\.)?midea\.com(\/|$)/i.test(url)){location.href=url;}else{location.href="http://mall.midea.com/";}}};});
define('xss',function(require,exports,module){function $xss(str,type){if(!str){return str===0?"0":"";}
switch(type){case"none":return str+"";break;case"html":return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,function(r){return"&#"+r.charCodeAt(0)+";"}).replace(/ /g,"&nbsp;").replace(/\r\n/g,"<br />").replace(/\n/g,"<br />").replace(/\r/g,"<br />");break;case"htmlEp":return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g,function(r){return"&#"+r.charCodeAt(0)+";"});break;case"url":return escape(str).replace(/\+/g,"%2B");break;case"miniUrl":return str.replace(/%/g,"%25");break;case"script":return str.replace(/[\\"']/g,function(r){return"\\"+r;}).replace(/%/g,"\\x25").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\x01/g,"\\x01");break;case"reg":return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g,function(a){return"\\"+a;});break;default:return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,function(r){return"&#"+r.charCodeAt(0)+";"}).replace(/ /g,"&nbsp;").replace(/\r\n/g,"<br />").replace(/\n/g,"<br />").replace(/\r/g,"<br />");break;}}
exports.parse=$xss;});
define('zoomPic',function(require,exports,module){var $=require('jquery');var zoomPic={};zoomPic.method={init:function(option){$initItemPicV5(option);}};function $initItemPicV5(option){var opt={mpic:null,cdiv:null,zicn:null,ldom:null,zpic:null,index:0,src:null,src120:null,srcorigin:null,srcsize:null,onzmshow:$empty(),onzmhide:$empty(),config:{limit:800,maxsize:1200,size:500,zoomw:500,zoomh:500}};$extend(opt,option);if(!opt.mpic||!opt.ldom){return;}
var mcnt=opt.mpic.parentNode;var zcnt=opt.zpic;var oimg=new Image();if(opt.srcsize[0]){oimg.src=opt.srcorigin[0];oimg.onload=function(){var $this=this;opt.zoomDetail($this);};}
opt.zoomDetail=function($this){var ow=$this.width;var oh=$this.height;var max=Math.max(ow,oh);if(max>opt.config.maxsize){if(ow>=oh){ow=opt.config.maxsize;oh=$this.height*ow/$this.width;}else{oh=opt.config.maxsize;ow=$this.width*oh/$this.height;}
max=opt.config.maxsize;}
if(max>=opt.config.limit){opt.zpic.src=$this.src;opt.zpic.width=ow;opt.zpic.height=oh;if(ow>oh){opt.zpic.style.cssText="margin:"+(ow-oh)/2+"px 0";}else if(ow<oh){opt.zpic.style.cssText="margin:0 "+(oh-ow)/2+"px";}
var rate=opt.config.size/max;var zw=Math.ceil(opt.config.zoomw*rate);var zh=Math.ceil(opt.config.zoomw*rate);mcnt.onmousemove=function(e){e=e||window.event;var rect=mcnt.getBoundingClientRect();var moveX=Math.min(Math.max(e.clientX-rect.left-zw/2,0),opt.config.size-zw);var moveY=Math.min(Math.max(e.clientY-rect.top-zh/2,0),opt.config.size-zh);opt.cdiv.style.left=moveX+"px";opt.cdiv.style.top=moveY+"px";var scrollX=moveX/opt.config.size*max;var scrollY=moveY/opt.config.size*max;zcnt.style.left=-scrollX+"px";zcnt.style.top=-scrollY+"px";};mcnt.onmouseleave=function(){$display(zcnt.parentNode,"none");$display(zcnt,"none");$display(opt.cdiv,"none");try{opt.onzmhide();}catch(e){};}}};opt.setMainPic=function(){var src=opt.src[opt.index];mcnt.onmouseenter=$empty();mcnt.onmouseleave=$empty();if(this.mpic.src!=src){this.mpic.src=src;if(opt.srcsize&&opt.srcsize[opt.index]&&opt.srcsize[opt.index].split('*')[0]>=opt.config.limit){opt.zpic.src=opt.srcorigin[opt.index];oimg.src="";oimg.src=opt.srcorigin[opt.index];}}
if(!this.cdiv||!this.zpic)return;$display(zcnt.parentNode,"none");$display(zcnt,"none");$display(this.cdiv,"none");};var delay=null;$addEvent(opt.ldom,"mouseover",function(e){var a=$getTarget(e,opt.ldom,"a"),t=null;if(!a||!(t=a.parentNode.getElementsByTagName('img'))){return false;}
if(t&&t.length>0){t=t[0];delay=setTimeout(function(){var index=t.getAttribute("index");if(index==opt.index)return;var src=opt.src[index];if(src){var doms=opt.ldom.getElementsByTagName("li");doms[opt.index].className="";doms[index].className="cur";opt.index=index;opt.setMainPic();}},200);t.onmouseout=function(){clearTimeout(delay);}}});opt.mpic.onmouseenter=function(){var index=opt.index;if(opt.srcsize&&opt.srcorigin&&opt.srcsize[index]&&opt.srcsize[index].split('*')[0]>=opt.config.limit){var ow=opt.srcsize[index].split('*')[0];var oh=opt.srcsize[index].split('*')[1];var max=Math.max(ow,oh);if(max>opt.config.maxsize){max=opt.config.maxsize;}
var rate=opt.config.size/max;var zw=Math.ceil(opt.config.zoomw*rate);var zh=Math.ceil(opt.config.zoomw*rate);opt.cdiv.style.width=zw+"px";opt.cdiv.style.height=zh+"px";$display(zcnt);$display(zcnt.parentNode);$display(opt.cdiv);try{opt.onzmshow();}catch(ee){};}};var first=opt.ldom.getElementsByTagName("img")[0];if(first){first.parentNode.parentNode.className="cur";opt.setMainPic();return opt;}else{$display(zcnt.parentNode,"none");$display(zcnt,"none");$display(opt.cdiv,"none");}}
function $addEvent(obj,type,handle){if(!obj||!type||!handle){return;}
if(obj instanceof Array){for(var i=0,l=obj.length;i<l;i++){$addEvent(obj[i],type,handle);}
return;}
if(type instanceof Array){for(var i=0,l=type.length;i<l;i++){$addEvent(obj,type[i],handle);}
return;}
window.__allHandlers=window.__allHandlers||{};window.__Hcounter=window.__Hcounter||1;function setHandler(obj,type,handler,wrapper){obj.__hids=obj.__hids||[];var hid='h'+window.__Hcounter++;obj.__hids.push(hid);window.__allHandlers[hid]={type:type,handler:handler,wrapper:wrapper}}
function createDelegate(handle,context){return function(){return handle.apply(context,arguments);};}
if(window.addEventListener){var wrapper=createDelegate(handle,obj);setHandler(obj,type,handle,wrapper);obj.addEventListener(type,wrapper,false);}
else if(window.attachEvent){var wrapper=createDelegate(handle,obj);setHandler(obj,type,handle,wrapper);obj.attachEvent("on"+type,wrapper);}
else{obj["on"+type]=handle;}};function $display(ids,state){if(!ids){return;}
var state=state||'';if(typeof(ids)=="string"){var arr=ids.split(',');for(var i=0,len=arr.length;i<len;i++){var o=$id(arr[i]);o&&(o.style.display=state);}}else if(ids.nodeType){ids.style.display=state;}else if(ids.length){for(var i=0,len=ids.length;i<len;i++){$display(ids[i],state)}}else{ids.style.display=state;}};function $empty(){return function(){return true;}};function $extend(){var target=arguments[0]||{},i=1,length=arguments.length,options;if(typeof target!="object"&&typeof target!="function")
target={};for(;i<length;i++)
if((options=arguments[i])!=null)
for(var name in options){var copy=options[name];if(target===copy)
continue;if(copy!==undefined)
target[name]=copy;}
return target;};function $getTarget(e,parent,tag){var e=window.event||e,tar=e.srcElement||e.target;if(parent&&tag&&tar.nodeName.toLowerCase()!=tag){while(tar=tar.parentNode){if(tar==parent||tar==document.body||tar==document){return null;}else if(tar.nodeName.toLowerCase()==tag){break;}}};return tar;};function $id(id){return typeof(id)=="string"?document.getElementById(id):id;};exports.init=function(opt){return zoomPic;}});
