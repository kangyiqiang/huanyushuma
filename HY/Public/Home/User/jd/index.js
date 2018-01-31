
$(document).ready(function() {

    $.get('/getAdviseHtml.action', function(data) {
        $("#da-main").html(data);
    });
    
    //获取实名认证和小白信用积分:操作dom用最基本方法 防止浏览器兼容性
    $.get('/getUserVerifyRight.action', function(data) {
    	if(data.success && data.success == true ){
    		/*if(data.code == 0){
    			var div = document.getElementById("userVerifyRight_unpassed");
    			div.style.display = "block";
    			div.innerHTML = '<a href="https://authpay.jd.com/auth/toAuthPage.action?source=43" target="_blank" clstag="homepage|keycount|home2013|Homesmrz1">实名认证：</a><a href="https://authpay.jd.com/auth/toAuthPage.action?source=43" target="_blank" clstag="homepage|keycount|home2013|Homesmrz1">未认证</a>';
    		}else if(data.code == 1 && data.content != '' && data.content.length != 0){*/
            var div = document.getElementById("xbcredit_score");
            div.style.display = "block";
            var str = '<a href="//credit.jd.com/?via=membercenter" target="_blank"  clstag="homepage|keycount|home2013|Homesmrz2" >小白信用：</a><a href="//credit.jd.com/?via=membercenter" target="_blank"  clstag="homepage|keycount|home2013|Homesmrz2" ><em>';
            str += '' + data.content + '</em></a>';
            div.innerHTML = str;
    	}
    });

    $.get('//home.jd.com/2014/data/page/link.action', function(data) {
        //获取普通用户链接内容，追加到#fc-msg-link 元素内
        var linkAttrs = data.content.linkAttr;
        if(linkAttrs){
            for(var i=0;i<linkAttrs.length;i++){
                var AddedLink = $("<a></a>",{
                    href: linkAttrs[i].href,
                    text:" "+linkAttrs[i].text+" ",
                    clstag:linkAttrs[i].clstag,
                    target:"_blank"
                });
                var bline = $("<b></b>",{
                    text:'|'
                });
                $("#fc-msg-link").append(AddedLink).append(bline);
            }
        }
        //获取vip用户链接内容，追加到#fc-msg-link 元素内
        var vipLinkAttrs = data.content.vipLinkAttr;
        var isVip =$("#fc-msg-link").attr("data-vip");
        if(vipLinkAttrs && isVip=="true"){
            for(var i=0;i<vipLinkAttrs.length;i++){
                var AddedLink = $("<a></a>",{
                    href: vipLinkAttrs[i].href,
                    text:" "+vipLinkAttrs[i].text+" ",
                    clstag:vipLinkAttrs[i].clstag,
                    target:"_blank"
                });
                var bline = $("<b></b>",{
                    text:'|'
                });
                $("#fc-msg-link").append(AddedLink).append(bline);
            }
        }
        //去除最后一个|元素
        $("#fc-msg-link b:last").remove();

        var gangbenLink =  data.content.exchangeGangbenLink;
        $("#exchangeGangben").attr('href',gangbenLink);
    });


    //试用 //img20.360buyimg.com/shaidan/jfs/t3235/203/1848195204/1181/970e0e4d/57d6650eN2135bca8.jpg
    //正式 //img20.360buyimg.com/shaidan/jfs/t3301/304/1852041425/1000/29d62e8a/57d6650eN5d9da09c.jpg
    //未开通 //img20.360buyimg.com/shaidan/jfs/t3232/147/1885775253/839/3340bf04/57d6650eN0a8ea31b.jpg
    $.get('//home.jd.com/2014/data/plus/get.action',function (data) {
        var userLevel = $("#home-u-level").attr("data-id-u-level");
        var userLevelName = $("#home-u-level").attr("data-id-u-levelname");

        //var probationImg = "//img20.360buyimg.com/shaidan/jfs/t3235/203/1848195204/1181/970e0e4d/57d6650eN2135bca8.jpg";
        var probationImg ="/misc/img/shiyong.png";
        var probationTitle = "购买PLUS会员，享更多特权";
        //var formalImg ="//img20.360buyimg.com/shaidan/jfs/t3301/304/1852041425/1000/29d62e8a/57d6650eN5d9da09c.jpg";
        var formalImg ="/misc/img/zhengshi.png";
        var formalTitle ="PLUS正式会员，尊享顶级特权";
        //var nonmemberImg = "//img20.360buyimg.com/shaidan/jfs/t3232/147/1885775253/839/3340bf04/57d6650eN0a8ea31b.jpg";
        var nonmemberImg = "/misc/img/weikaitong.png";
        var nonmember000R102Title ="试用PLUS会员，领免运费券";
        var nonmember103Title ="购买PLUS会员，尊享顶级特权";
        var nonmember203Title ="续费PLUS会员，送150元礼包";
        var qyzqImg = "/misc/img/qyzq.png";
        var qyzqTitle = "企业专区，企业用户专属权益聚集地";

        var nonmemberDiamond ="您可享钻石专享价：开通PLUS￥109/年（原价￥149元）";
        var nonmemberGold = "您可享金牌专享价：开通PLUS ￥129元/年（原价￥149元）";
        var nonmemberSilver = "您可享银牌专享价：开通PLUS ￥139元/年（原价￥149元）";

        var formalDiamond ="您可享钻石专享价：续费PLUS￥109/年（原价￥149元）";
        var formalGold = "您可享金牌专享价：续费PLUS ￥129元/年（原价￥149元）";
        var formalSilver = "您可享银牌专享价：续费PLUS ￥139元/年（原价￥149元）";


        var AddPlusElement=function (imgSrc,title,userLevel) {
            var plusElement =$('<a href="//plus.jd.com/index" target="_blank" clstag="homepage|keycount|home2013|Homeplus"><img id="userPlusIcon" src="" alt="plus_icon"  /> </a>');
            plusElement.find("img").attr("src",imgSrc)
                .attr("title",title);
            if("50"==userLevel || "56"==userLevel || "59"==userLevel){
                $("span.rank").append('<a href="//vip.jd.com/" target="_blank">'+userLevelName+'</a>&nbsp;');
            }
            //如果是铜牌或者注册会员，不显示显示优惠
            $("span.rank").append(plusElement);
            if("50"!=userLevel && "56"!=userLevel && "59"!=userLevel){
                $("span.rank").append('<a id="home-u-plus" href="//plus.jd.com/index" target="_blank" clstag="homepage|keycount|home2013|Homepluscx" style="position: relative;top: -10px;"><img width="54" height="16" src="//img30.360buyimg.com/uba/jfs/t3094/311/8608955278/3086/1d425635/58c6511aN1f50050a.png"></a>');
            }
        }
        if(data.success && data.success == true ){
            if("class90"==data.returnObj){
                var enterpriseElement =$('<a href="//corp.jd.com/user/main" target="_blank" clstag="homepage|keycount|home2013|Homeqyyhrk2"><img id="class90Icon" src="" alt="user_icon"  /></a>');
                enterpriseElement.find("img").attr("src",qyzqImg)
                    .attr("title",qyzqTitle);
                $("span.rank").after(enterpriseElement);
            }else if("201"==data.returnObj){
            //正式期
                if("105"==userLevel){
                    AddPlusElement(formalImg,formalDiamond,userLevel);
                }else if("62"==userLevel){
                    AddPlusElement(formalImg,formalGold,userLevel);
                }else if("61"==userLevel){
                    AddPlusElement(formalImg,formalSilver,userLevel);
                }else{
                    AddPlusElement(formalImg,formalTitle,userLevel);
                }
            //未使用、试用已到期、正式已到期及其他 试用期
            }else if("101"==data.returnObj){
                //试用期
                if("105"==userLevel){
                    AddPlusElement(probationImg,nonmemberDiamond,userLevel);
                }else if("62"==userLevel){
                    AddPlusElement(probationImg,nonmemberGold,userLevel);
                }else if("61"==userLevel){
                    AddPlusElement(probationImg,nonmemberSilver,userLevel);
                }else{
                    AddPlusElement(probationImg,probationTitle,userLevel);
                }
            }else if("000"==data.returnObj||"102"==data.returnObj){
                //未试用
                if("105"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberDiamond,userLevel);
                }else if("62"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberGold,userLevel);
                }else if("61"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberSilver,userLevel);
                }else {
                    AddPlusElement(nonmemberImg, nonmember000R102Title,userLevel);
                }
            }else if("103"==data.returnObj){
                //试用期已到期
                if("105"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberDiamond,userLevel);
                }else if("62"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberGold,userLevel);
                }else if("61"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberSilver,userLevel);
                }else {
                    AddPlusElement(nonmemberImg, nonmember103Title,userLevel);
                }
            }else if("203"==data.returnObj){
                //正式期已到期
                if("105"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberDiamond,userLevel);
                }else if("62"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberGold,userLevel);
                }else if("61"==userLevel){
                    AddPlusElement(nonmemberImg,nonmemberSilver,userLevel);
                }else {
                    AddPlusElement(nonmemberImg, nonmember203Title,userLevel);
                }
            }else {
                //其他状态添加上用户级别
                $("span.rank").append('<a href="//vip.jd.com/" target="_blank">'+userLevelName+'</a>&nbsp;');
            }
        }
    });
    


});


var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C',
    'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
// js随机算法
function generateMixed(n) {
    var res = "";
    for ( var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}