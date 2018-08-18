$(function(){
    init();
    function init(){
        eventList();
    }
    function eventList() {
        //登录页面 点击登录的时候获取账号和密码 验证合法后发送请求 
        $("#loginBtn").on("tap",function(){
            //console.log(123);
            var mobile=$("[name='mobile']").val().trim();
            var password=$("[name='password']").val().trim();
            //debugger
            //验证手机号码
            if(!$.checkPhone(mobile)){
                mui.toast("手机号不合法");
                return;
            }
            if(password.length<6){
                mui.toast("密码不合法");
                return;
            }
            //都符合要求发送请求获取数据
            $.post("login",{username:mobile,password:password},function(res){
               console.log(res);
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);

                   // sessionStorage  会话存储 浏览器移关闭就不存在
                   // localStorage   永久存储 对于前端来说除非手动删除 否则一直存在 后台的话还要验证是否过期
                    //当前的简单类型 全部会先转换成字符串格式 复杂类型也会转成字符串 所以要先做处理 不然就会丢失数据
                    //先转换成json字符串 在存储 JSON.stringfy(obj)
                    // 取数据 (复杂类型) 字符串 先解析为原来的状态 JSON.parse()

                    //把用户信息存储到永久存储当中
                    localStorage.setItem("userinfo",JSON.stringify(res.data));
                    
                    setInterval(function(){

                        //先判断一下有没有之前的页面信息 pageName
                    var pageName=sessionStorage.getItem("pageName");
                    if(pageName){
                        location.href=pageName;
                    }else{
                        Location.href="/index.html";
                    }
                       
                    },1000);
                }else{
                    mui.toast(res.meta.msg);
                }
            })
        })
    }
})