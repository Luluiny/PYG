$(function () {
    init();

    function init() {
        gitData();
        gitNav();
        gtiContent();
    }

    function gitData() {
        //获取轮播图的内容
        $.get("home/swiperdata", function (res) {
            //console.log(res);
            var html=template("tempslider",{data:res.data});
            $(".mui-slider").html(html);
            //初始化轮播图  写在这里原因是一般要等标签渲染后然后初始化
            var gallery = mui('.mui-slider');
            gallery.slider({
              interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
            });
        })
    }

    function gitNav(){
        $.get("home/catitems",function(res){
            //console.log(res);
            var html=template("tempnav",{data:res.data});
            $(".index_nav").html(html);
        })
    }

    function gtiContent(){
        $.get("home/goodslist",function(res){
            console.log(res);
            var html=template("tempcontent",{data:res.data});
            $(".goodlist").html(html);
        })
    }

})