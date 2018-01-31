/**
 * Created by lizhibo on 16/3/8.
 */
$(function(){

    function buildProductHtml(info,sku){
        var cartUrl = '//cart.jd.com/gate.action?pid='+sku+'&pcount=1&ptype=1';
        var imgPath = "//img14.360buyimg.com/n1/"+info.imagePath;
        var html = '<div class="sku clearfix">'+
            '<input type="hidden" class="skuValue" value="'+sku+'">'+
            '<div class="thumb">' +
            '<a target="_blank" href="//item.jd.com/'+sku+'.html">'+
            '<img src="'+imgPath+'" style="width: 100px;height: 100px;">' +
            '</a>'+
            '</div>'+
            '<div class="tic">'+
            '<div class="st">'+
            '<a target="_blank" href="//item.jd.com/'+sku+'.html">'+
            info.name+
            '</a>'+
            '</div>'+
            '<div class="price"><span class="icon">￥</span>'+info.price+'</div>'+
            '<a target="_blank" href="'+cartUrl+'" class="btn"><span class="icon_add"></span>我要买</a>'+
            '</div>'+
            '</div>';
        return html;
    }

    var updateInfo = function (dom, info,sku) {
        var html = buildProductHtml(info,sku);
        dom.replaceWith(html);
    };
    $(".skuValue").each(function(i,dom){
        var sku = $(dom).val();
        $.post("/sku/getSkuInfo.htm",{sku:sku},function(info){
            if(info.success){
                updateInfo($(dom).parent(),info.result.skuInfo,sku);
            }
        });
    });
});
