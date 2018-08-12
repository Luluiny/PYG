$(function(){
    var BaseUrl="http://api.pyg.ak48.xyz/";
    template.defaults.imports.iconUrl = BaseUrl;
    //修改接口的使用方式 拦截器 在每一次发送请求之前 对请求做一些处理
    //一般的地址修改做出改变是只改变前面的接口之类的 后面的分类的一般是
    //很少改变 所以把前面的容易做出改变的拿出来 单独放在一个变量里 这样就会比较容易管理 后面的地址也是可以改变的 只是比较少
    //发送ajax的次数
   var  ajaxNums=0;
    $.ajaxSettings.beforeSend=function(xhr,obj){
        obj.url=BaseUrl+"api/public/v1/"+obj.url;
        ajaxNums++;
        $("body").addClass("wait");
    }

    //ajax请求获得了返回值之后
    $.ajaxSettings.complete=function(){
        //同时发送多个请求的时候应该是让最后一个请求回来的时候算是数据渲染完毕
        ajaxNums--;
        if(ajaxNums==0){
            //这个时候就是最后一个请求回来了
            $("body").removeClass("wait");
        }
    }
})