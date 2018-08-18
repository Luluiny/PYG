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

    //拓展zeptob 给$对象添加自定义的属性或者方法
    $.extend($,{
        checkPhone:function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        },
        checkEmail:function (myemail) {　　
            var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
            if (myReg.test(myemail)) {　　　　
                return true;　　
            } else {　　　　
                return false;
            }
        },
        
     //根据 url上的key来获取值
        getValue:function (name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
     },
     token: function () {
        // 如果userinfo 存在 返回token 否则就返回 ""
        var token;
        if (!localStorage.getItem("userinfo")) {
          token = "";
        } else {
          token = JSON.parse(localStorage.getItem("userinfo")).token;
        }
        return token;
      },
     ckeckLogin:function(){
         //判断登录只要判断本地存储中是否有token
         return localStorage.getItem("userinfo");
     }
    });

})