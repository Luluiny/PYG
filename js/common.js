$(function(){
    var BaseUrl="http://api.pyg.ak48.xyz/api/public/v1/";
    //修改接口的使用方式 拦截器 在每一次发送请求之前 对请求做一些处理
    //一般的地址修改做出改变是只改变前面的接口之类的 后面的分类的一般是
    //很少改变 所以把前面的容易做出改变的拿出来 单独放在一个变量里 这样就会比较容易管理 后面的地址也是可以改变的 只是比较少
    $.ajaxSettings.beforeSend=function(xhr,obj){
        obj.url=BaseUrl+obj.url;
    }
})