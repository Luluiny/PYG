$(function(){
    init();
    function init (){
        //判断是否已经登录
        if(!$.ckeckLogin()){
            //没有登录就重新跳转到登录页面
            sessionStorage.setItem("pageName",location.href);
            location.href="/page/login.html";
            return;
        }else{
            $("body").fadeIn();
        }
        getCartData();
        countAll();
        eventList();
    }

        //查询购物车数据
    function getCartData(){
        //获取token
        var token=$.token();
        $.ajax({
            url:"my/cart/all",
            headers: {
                Authorization: token
              },
            success:function(ret){
               // console.log(ret);
              //判断token是否有效
              if(ret.meta.status==200){
                  var cart_info=JSON.parse(ret.data.cart_info);
                  //console.log(cart_info);
                  
                  var html=template("mainTpl",{obj:cart_info});
                  $(".sh_content ul").html(html);
                  //初始化数字输入框
                  mui(".mui-numbox").numbox();

                  countAll();

              }  else{
                  console.log(ret.meta.msg);
              }
            }
    })
    }

    //计算总价
    function countAll(){
        //循环所有的li标签  计算每一个li标签所对应的商品的总价格(单价*数量) 然后把所有的价格加起来 辅助给上面的标签
        var lis=$(".sh_content li");
        //console.log(lis);
        
        var total=0;
        for(var i=0;i<lis.length;i++){
            var li=lis[i];
            //使用jq的方式拿数据 obj是放在li里面你的自定义属性
            var obj=$(li).data("obj");
            //然后拿到单价和总数
            var price=obj.goods_price;
            //购买的数量就是 数字框里面数字的值
            var nums=$(li).find(".mui-numbox-input").val();
           
            
            total+=price*nums;
        }
        
        //console.log(total);
        $(".totalmoney").text("￥"+total);
    }

    function eventList(){
        //给数组输入框绑定事件 点击数字加减的时候也要计算价格
        $(".sh_content").on("tap","button",function(){
            //console.log(123);
            countAll();
        })
        //给编辑按钮注册事件
        $(".compelete_btn").on("tap",function(){
           // console.log(123);
            //一开始的时候像删除之类的都是隐藏的 点击编辑之后这些显示出来
            $("body").toggleClass("edit_status");
            //动态切换编辑和完成的文字显示 有这个类名的时候文字为完成 没有的时候显示为编辑
            if($("body").hasClass("edit_status")){
                $(".compelete_btn").text("完成");
            }else{
                $(".compelete_btn").text("编辑");
                //在编辑里面的时候要判断有没有商品 获取所有的li标签 循环li标签 获取li身上的obj 改变里面的obj.amount(要购买的数量)=所在的li标签的里面的input标签里面的值
                //然后构造参数发送请求
                var lis=$(".sh_content li");
                if(lis.length==0){
                    mui.toast("您的购物车控控如也"); 
                    return;
                }
                //需要发送到后台的数据
                var infos={};
                for(var i=0;i<lis.length;i++){
                   var  li=lis[i];
                    //获取到li里面的对象 改变里面的值 （因为数子框点击两边的时候里面的值会改变 这里要把这个数据收集起来 然后发送到后台 不至于刷新过后数据就不见
                  var  obj=$(li).data("obj");
                  //console.log(obj);
                  obj.amount=$(".mui-numbox input").val();
                  infos[obj.goods_id]=obj;//给infos对象新加一个属相 叫做obj.goods_id 然后他的值就是这个重新改过amount的对象
             }
             //同步购物车数据
             syncCart(infos);
            }
             
        });
        //删除事件
        $(".delete_btn").on("tap",function(){
            //console.log(123);
            //获取已经选中的复选框的个数 如果长度为0的话就说明 还没有选中任何商品
            //长度不为0的时候说明有选中的要删除 给一个确认框 
            //确定的话 删除接口 同步购物车 删除有两种方法
                //第一 如果有10种商品 删除第一种 发送被删除的商品的id到后台
                //第二 如果有10中商品 删除第一种 发送后9种就是没有删除的商品的id到后台 这里用这种 一般的用那种看后台文件
            //获取未删除的li标签 构造函数 发送请求 删除成功之后重新发送请求 渲染页面
        var chks=$(".sh_content [name='checkbox1']:checked");
            console.log(chks);
            if(chks.length==0){
                mui.toast("您还没有选中商品");
                return;
            }
            mui.confirm("确认删除？","警告",["确认","取消"],function(etype){
                if(etype.index==0){
                    //获取未被选中的商品 获取 未被选中的复选框的父亲 li
                    var unSelectLis=$(".sh_content [name='checkbox1']").not(":checked").parents("li");
                    //被删除的对象字段
                    var infos={};
                    for (var i=0;i<unSelectLis.length;i++){
                       //这里的dom对象和jq对象是不一样的写法
                       var li =unSelectLis[i];//dom对象
                       var obj=$(li).data("obj"); 
                       infos[obj.goods_id]=obj;
                    }
                    //同步数据
                    syncCart(infos);
                }else if(etype.index==1){
                    //这里是取消 保持当前状态
                }
            })
            
        });
        //生成订单
        $(".o_create").on("tap",function(){
            console.log(123);
            //生成订单的时候先判断有没有数据  有然后发送请求
            var lis=$(".sh_content li");
            if(lis.length==0){
                mui.toast("没有可提交的");
                return;
            }
            var  paramsObj={
                order_price:$(".totalmoney").text(),
                consignee_addr:"广州大学城",
                goods:[]
            };
          for (var i=0;i<lis.length;i++){
              var li=lis[i];
              var obj=
          }  


        })
    }
    //同步数据
    function syncCart(infos){
        //获取数据 发送请求
        $.ajax({
            url:"my/cart/sync",
            type:"post",
            data:{
                infos:JSON.stringify(infos)
            },
            headers: {
                Authorization: $.token()
              },
            success:function(ret){
                console.log(ret);
                //如果请求成功的话就查询购物车数据重新渲染
                if(ret.meta.status==200){
                    mui.toast(ret.meta.msg);
                    getCartData();
                }else{
                    mui.toast(ret.meta.msg);
                }
            }
        })
    }
})