$(function(){
    var Datas;
    var leftScroll;
    init();
   
    function init(){
        setHtml();
        eventList();
        getCategories();
    }
    
    function eventList(){
        //用委托的方式对左侧的注册点击事件
        $(".left").on("tap","li",function(){
            //点击到li标签中的第几个 就显示返回值中的第几个
            //使用自定义标签记录 直接获取li标签的索引
            //获取自定义属性的值
                // <div id="text" value="123"  data-name="黑哒哒的盟友"><div>
                // $("#text").data("name");
            var index=$(this).data("index");
            $(this).addClass("active").siblings().removeClass("active");
            //该项向上滚动置顶
            leftScroll.scrollToElement(this);
            renderRight(index);
        })
        
    }


    function getCategories(){
        $.get("categories",function(res){
            console.log(res);
            var html=template("tempcateleft",{data:res.data});
            $(".cateleft").html(html);
            //只有容器元素的第一个子元素可以滚动 其他被忽略
            leftScroll = new IScroll(".left");
            Datas=res.data;
            renderRight(0);
        })

    }


    //根据索引渲染右边的数据
    function renderRight(index){
        var arr=Datas[index].children;
        //console.log(arr);
        var html2=template("tempcateright",{data:arr});
        $(".right").html(html2);
        //初始化右边的滚动条 标签都加载完了 图片不一定加载完了 要在所有的标签图片加载好了才开始初始化
        // //声明一个变量来保存图片的张数
        var nums=$(".right img").length;
        $(".right img").on("load",function(){
            console.log(123);
            nums--;
            if(nums==0){
                new IScroll(".right");
            }
        })
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

    
})