 $(function () {
   init();
   var GoodsObj;

   function init() {
     getDetail();
     eventList();
   }

   function eventList() {
     $(".detailftche").on("tap", function () {
       //console.log(1213);
       //判断永久存储中有没有用户信息 如果没有说明没有登录过 有的话下面发送ajax请求的时候也还要验证是否有效 有时候后台会更新token会失效
       if (!localStorage.getItem("userinfo")) {
         mui.toast("用户未登录");
         //跳转页面之前先存储现在当前的页面 到时候登录完毕之后回到当前的页面 提高用户体验
         sessionStorage.setItem("pageName", location.href);
         setTimeout(function () {
           location.href = "/page/login.html";
         }, 1000);
         return;
       }

      // var token = JSON.parse(localStorage.getItem("userinfo")).token;
       // JSON.parse(localStorage.getItem("userinfo")).token
       var token = $.token();
       //为发送ajax请求做准备 因为这里需要判断是否有登陆 所以除了带过去正常的参数外还需要把token的信息存到请求头中 给后台做出判断
       var obj = {
         goods_price: GoodsObj.goods_price,
         goods_number: GoodsObj.goods_number,
         cat_id: GoodsObj.cat_id,
         goods_id: GoodsObj.goods_id,
         goods_name: GoodsObj.goods_name,
         goods_weight: GoodsObj.goods_weight,
         goods_small_logo: GoodsObj.goods_small_logo
       };
       $.ajax({
         url: "my/cart/add",
         type: "post",
         data: {
           info: JSON.stringify(obj)
         },
         headers: {
           "Authorization": token
         },
         success: function (res) {
           //console.log(res);
           // debugger;
           //判断登录状态
           if (res.meta.status == 401) {
             //没有登录
             mui.toast("登录时间过长 请重新登录");
             sessionStorage.setItem("pageName", location.href);
             setTimeout(function () {
               location.href = "/page/login.html";
             }, 1000);
           } else if (res.meta.status == 200) {
             //添加成功跳出一个提示框 看用户是要跳转到购物车页面还是留在当前页面
            // console.log(789);
             mui.confirm("是否跳转到购物车页面", "添加成功", ["跳转", "取消"], function (etype) {
               //console.log(etype);
               if (etype.index == 0) {
                 //console.log(456);
                 location.href="/page/car.html";
               // setTimeout(function () {
                  //新打开一个页面
                 // window.open("/page/car.html"); 
                 
               // }, 1000);
               } else if (etype.index == 1) {
                 //console.log(123);
                 //这个是取消不跳转 留在当前页面
                 location.href = "/page/car.html";
               }
             });
           }
         }
       })


     })
   }

   function getDetail() {
     $.get("goods/detail", {
       goods_id: $.getValue("goods_id")
     }, function (res) {
       // console.log(res);
       //在这里我们把返回值存起来 赋值给全局变量
       GoodsObj = res.data;
       var html = template("detailTemp", {
         data: res.data
       });
       $(".view").html(html);
       //获得slider插件对象
       var gallery = mui('.mui-slider');
       gallery.slider({
         interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
       });
     })
   }

   //点击加入购物车的时候 要判断用户是否登录过 就是看是否有token 登录过的话就直接弹窗加入购物车成功  如果没有
   //说明没有登录过 跳转到登录页面 在登录页面登录成功之后把token存到本地存储当中

 })