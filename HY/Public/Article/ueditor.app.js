/* user-club-circle/3.0.0 ueditor.app.js Date:2016-04-12 14:27:29 */
seajs.use(["jdf/1.0.0/unit/globalInit/1.0.0/globalInit","jdf/1.0.0/unit/login/1.0.0/login","jdf/1.0.0/ui/dialog/1.0.0/dialog","user/club/js/club.group.js","jdf/1.0.0/ui/placeholder/1.0.0/placeholder"],function(a,b){document.domain="jd.com";var e,f;var g={getData:function(){var a=$(".circle-post .selt option:selected").val();var b=$(".circle-post .selt option:selected").text();var c=$(".circle-post #posttitle").length>0?$(".circle-post #posttitle").val():$(".circle-post .selt").next().val();var d=m.getContent();return{pin:readCookie("pin"),tagName:b,tagId:a,subject:c,groupId:$("[data-groupid]").attr("data-groupid"),threadText:d,authKey:f,authCode:$("#verifyCode").val().trim(),contentLength:m.getContentLength(!0)}},replyData:function(){var a=$("#threadId").val();var b=$("#tagId").val();var c=$("#groupId").val();var d=m.getContent();var e=$(".btn_return").attr("data_pin");var g=$(".btn_return").attr("data_id");var h=$("#siteId").val();return{pin:readCookie("pin"),threadId:a,tagId:b,groupId:c,postText:d,parentPin:e,parentId:g,siteId:h,authKey:f,authCode:$("#verifyCode").val().trim(),contentLength:m.getContentLength(!0),replyType:0}}};var h=function(a){switch(+a){case 1:return"\u62b1\u6b49\uff0c\u60a8\u4e0d\u662f\u94dc\u724c\u4ee5\u4e0a\u7528\u6237\uff0c\u6682\u65f6\u6ca1\u6709\u53d1\u5e16\u6743\u9650\u54e6O(\u2229_\u2229)O\uff0c\u5feb\u53bb\u8d2d\u4e70\u5427~";case 2:return"\u771f\u9057\u61be\uff0c\u6709\u56fe\u624d\u80fd\u6709\u771f\u76f8\uff0c\u8f9b\u82e6\u53bb\u4f20\u4e2a\u5934\u50cf\u5427\uff0c\u8ba9\u6211\u4eec\u4e00\u8d77\u840c\u840c\u54d2~";case 3:return"\u53d1\u7684\u592a\u5feb\u5566\uff0c\u559d\u676f\u8336\uff0c\u6b47\u4f1a\u5427~";case 4:return"\u62b1\u6b49\u54e6\uff0c\u60a8\u8fd8\u6ca1\u6709\u52a0\u5165\u8be5\u5708\uff0c\u6682\u4e0d\u80fd\u53d1\u8868\u770b\u6cd5\uff0c\u770b\u5230\u52a0\u5165\u5708\u5b50\uff0c\u8981\u731b\u6233\u54e6~";case 5:return"\u5988\u5440\uff01\u597d\u50cf\u6709\u95ee\u9898\uff0c\u8054\u7cfb\u7ba1\u7406\u5458\u5427~";case 6:return"\u4eb2\u7231\u6ef4~\u60a8\u8981\u53d1\u5e03\u7684\u4fe1\u606f\u4e2d\u5b58\u5728\u5371\u9669\uff0c\u5bb9\u6613\u7206\u70b8\u54e6~";case 7:return"\u4eb2\u7231\u6ef4~\u60a8\u8981\u53d1\u5e03\u7684\u4fe1\u606f\u4e2d\u5b58\u5728\u5371\u9669\uff0c\u5bb9\u6613\u7206\u70b8\u54e6~";case 10:return"\u5185\u5bb9\u957f\u5ea6\u4e0d\u5bf9\u6216\u5185\u5bb9\u4e0d\u7b26\u8981\u6c42      \u4eb2\u7231\u6ef4~\u5185\u5bb9\u597d\u50cf\u4e0d\u592a\u5bf9~\u5185\u5bb9\u597d\u50cf\u6709\u70b9\u5c11\uff0c\u518d\u4ed4\u7ec6\u68c0\u67e5\u68c0\u67e5\u5427~";case 11:return"\u6807\u9898\u592a\u957f\u4e86\uff0c\u731b\u6233\u9000\u683c\u952e\u5220\u9664\u51e0\u4e2a\u5b57~";case 12:return"\u4eb2\u7231\u6ef4~\u5185\u5bb9\u597d\u50cf\u4e0d\u592a\u5bf9~\u5185\u5bb9\u597d\u50cf\u6709\u70b9\u513f\u591a\uff0c\u518d\u4ed4\u7ec6\u68c0\u67e5\u68c0\u67e5\u5427~";case 0:return"\u4eac\u4e1c618\uff0c\u7ba1\u7406\u5458\u90fd\u53bb\u62a2\u8d27\u4e86\uff0c\u9a9a\u7b49\u7247\u523b"}};var j=function(a){$.post("/thread/savePost.htm",a,function(a){if(!a.success){var b=h(a.resultCode);return 16==+a.resultCode?void $(".msg-error").show():void(b&&k(b))}$("#e_reply_box").remove(),location.reload(!0)})};var k=function(a,b,c,d){$("body").dialog({title:"\u63d0\u793a",width:c||400,height:d||80,type:"html",source:'<div class="icon-box warn-box"><span class="warn-icon m-icon"></span><div class="item-fore">'+a+"</div></div>",onSubmit:b||$.noop})};var l=function(a){$(".edui-message-closer").click(),m.fireEvent("showmessage",{id:(new Date).getTime(),content:a,type:"error",timeout:4e3})};if($(".input_reply").placeholder(),$(".input_reply").bind("input propertychange",function(){var a=$(this).val();var b=a.length;var c=0;var d=$(".btn_reply");for(var e=0;b>e;e++)c+=a.charCodeAt(e)>0&&a.charCodeAt(e)<128?1:2;c>280?d.addClass("btn-disabled"):d.hasClass("btn-disabled")&&d.removeClass("btn-disabled")}),$(".btn_reply").click(function(){if(!$(this).hasClass("btn-disabled")){if(!$.trim($(".input_reply").val()).length)return void l("\u8bf7\u586b\u5199\u5185\u5bb9~");var b=g.replyData();var c=$(".input_reply").val();var d="<p>"+c+"<br/></p>";b.postText=d,b.replyType=1,b.authCode="";var e=c.length;var f=0;for(var h=0;e>h;h++)f+=c.charCodeAt(h)>0&&c.charCodeAt(h)<128?1:2;b.contentLength=f,j(b)}}),$("#editor").length){var m=UE.getEditor("editor",{initialFrameHeight:300});m.ready(function(){$("#groupThreadSubmit").click(function(){var a=$(".circle-post #posttitle").length>0?$(".circle-post #posttitle").val():$(".circle-post .selt").next().val();var c=$(".circle-post .selt option:selected").text();var d="\u8bf7\u586b\u5199\u6807\u9898";return"\u8bf7\u9009\u62e9\u6807\u7b7e"==$.trim(c)?void l("\u8bf7\u9009\u62e9\u6807\u7b7e"):$.trim(a).length&&$.trim(a)!=d?$.trim(m.getPlainTxt()).length?void b({modal:!0,complete:function(){window.location.reload(!0),$("#e_reply_box").remove();var a=g.replyData();j(a)}}):void l("\u8bf7\u586b\u5199\u5185\u5bb9~"):void l(d)}),$(".btn_return").click(function(){if(!$.trim(m.getPlainTxt()).length)return void l("\u8bf7\u586b\u5199\u5185\u5bb9~");var a=g.replyData();j(a)}),window.refreshCode=function(){var a=document.getElementById("JD_Verification");e=e||a.src,a.src=e+"&t="+Math.random(),$(".msg-error").hide(),$("#verifyCode").val("")},$("#verifyCode").focus(function(){$(".msg-error").hide()}),$.get("/thread/random.htm",function(a){a.success&&(f=a.result.random,e="//authcode.jd.com/verify/image?acid="+f+"&srcid=group&_t="+new Date,$("#JD_Verification").attr("src",e))})}),window.ue=m}$(".form .mb10 input, #verifyCode").val("").css("color","#333"),$(function(){$(".pct img").each(function(){var a=$(this).width();var b=$(this).parent("p").length?$(this).parent("p").width():$(this).parents(".pc-con").width();$(this).width(Math.min(a,.95*b))})})});
