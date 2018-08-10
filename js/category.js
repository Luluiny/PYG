$(function(){
    init();
    function init(){
        setHtml();
        getData();
    }
    
    function getData(){
        //只有元素的第一个子元素才可以滚动
        var leftScroll = new IScroll(".left");
    }
    function  setHtml(){
        //根据屏幕试着字体的大小
        //设计的宽度/基础值=要适配的屏幕的宽度/fz
        var base=100;
        var pagewidth=375;
        var screenwidth=document.querySelector("html").offsetWidth;
        var fz=screenwidth*base/pagewidth;
        //然后给页面
        document.querySelector("html").style.fontSize=fz+"px";
    }

    window.onresize=function(){
        setHtml();
    }

    $.get("categories",function(res){
        console.log(res);
        var html=template("tempcateleft",{data:res.data});
        $(".cateleft").html(html);
        var htmll=template("tempcateright",{data:res.data});
        
    })
})