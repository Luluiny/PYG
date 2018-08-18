$(function(){
    init();
    function init(){
        eventList();
    }
    function eventList(){
        //获取验证码 
        // 获取手机号 验证合法性  不通过的时候 给出提示 然后return 通过的时候发送ajax请求  按钮禁用 
        //显示倒计时 时间到了 去除禁用 然后重新设置按钮的文本
        $("#code_btn").on("tap",function(){
            //console.log(123);
            //获取电话号码
            var mobile_text=$("[name='mobile']").val().trim();
            //验证合法性
            if(!$.checkPhone(mobile_text)){
                //miu 自带的提示框 toast
                mui.toast("手机号非法");
                return;
            }
            //发送请求
            $.post("users/get_reg_code",{mobile:mobile_text},function(ret){
                console.log(ret);
                if(ret.meta.status==200){
                    //成功的情况下按钮禁用 显示倒计时 
                    $("#code_btn").attr("disabled","disabled");
                    var times=5;
                    $("#code_btn").text(times+"秒后重新发送请求");
                    //开启定时器
                    var timerId=setInterval(function(){
                        times--;
                        $("#code_btn").text(times+"秒后重新发送请求");
                        if(times==0){
                             //时间到了
                             clearInterval(timerId);
                             $("#code_btn").text("获取验证码");
                             $("#code_btn").removeAttr("disabled");
                        }
                    },1000);

                }
            })

        }),
        //点击注册
        $("#reg_btn").on("tap",function(){
            //获取所有的输入框的值 然后一个个的去验证 任意一个失败的时候提示 并且return  
            //所有的都通过之后 构造参数发送请求   最后根据返回值给出提示
            var mobile_text=$("[name='mobile']").val().trim();
            var code_text=$("[name='code']").val().trim();
            var email_text=$("[name='email']").val().trim();
            var password_text=$("[name='password']").val().trim();
            var password2_text=$("[name='password2']").val().trim();
            var gender_text=$("[name='gender']:checked").val().trim();
            //debugger
            if(!$.checkPhone(mobile_text)){
                mui.toast("手机号不合法");
                return;
            }
            if(code_text.length!=4){
                mui.toast("验证码不合法");
                return;
            }
            if(!$.checkEmail(email_text)){
                mui.toast("邮箱不合法");
                return;
            }
            if(password_text.length<6){
                mui.toast("密码不合法");
                return;
            }
            if(password_text!=password2_text){
                mui.toast("两次密码不一致");
                return;
            }
            //这些都合法 然后发送请求
            $.post("users/reg",{ mobile:mobile_text,
                code:code_text,
                email:email_text,
                pwd:password_text,
                gender:gender_text},function(ret){
                    //注册成功之后跳转到首页
                    if(ret.meta.status==200){
                        mui.toast(ret.meta.msg);
                        setTimeout(function(){
                            location.href="/page/login.html";},1000);
                    }else{
                        mui.toast(ret.meta.msg);
                    }
                })
        })
    }
})