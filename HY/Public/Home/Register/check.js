
      /*************************用户名*****************************/
      //1.获取焦点
      $("input[name='username']").focus(function(){
        //获取提示信息
        s=$(this).attr('class');
        //把s赋值给当前元素的下一个span
        $('.username>span').css('color','gray').html(s);
        $('.name').removeClass('cur');
        
      });
      //2.失去焦点
      $("input[name='username']").blur(function(){
        //获取用户名
        var name=$(this).val();
        if(name==''){
           $('.username>span').empty();
           exit;
        }
        //正则匹配
        if(name.match(/^\w{4,20}$/)==null){
           $('.username>span').css('color','red').html('用户名格式有误,请重新输入');
             $('.name').addClass('cur');
        }else{
          //清除提示信息
          $('.username>span').empty();
          //判断用户名是否存在
          $.post('__MODULE__/Index/checkName',{name:name},function(data){
            if(data==1){
              //用户名存在
              $('.username>span').css('color','red').html('该用户名已被注册');
             $('.name').addClass('cur');
            }else{
              //用户名可用
              $('.username>span').css('color','green').html('用户名可用');
            }
          }); 
        }
      });
      /**************************设置密码*****************************/
       //1.获取焦点
      $("input[name='password']").focus(function(){
        //获取提示信息
        s=$(this).attr('class');
        //把s赋值给当前元素的下一个span
        $('.password>span').css('color','gray').html(s);
        $('.pwd').removeClass('cur');
        
      });
      //2.失去焦点
      $("input[name='password']").blur(function(){
        var pwd=$(this).val();
        if(pwd==''){
           $('.password>span').empty();
          exit;
        }
        //正则匹配
        if(pwd.match(/^([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,18}$/)==null){
           $('.password>span').css('color','red').html('密码格式有误,请重新输入');
             $('.pwd').addClass('cur');
        }else{
          $('.password>span').css('color','green').html('密码可用');
        }
      });

      /***************确认密码**********/
      // //1.获取焦点
      $("input[name='repassword']").focus(function(){
        //获取提示信息
        s=$(this).attr('class');
        //把s赋值给当前元素的下一个span
        $('.repassword>span').css('color','gray').html(s);
        $('.repwd').removeClass('cur');
      });
      //失去焦点
       $("input[name='repassword']").blur(function(){
        //获取重复密码值
        var repwd=$(this).val();
        //获取密码值
        var pwd=$("input[name='password']").val();
        if(pwd==repwd){
          $('.repassword>span').css('color','green').html('重复密码正确');
          $('.repwd').removeClass('cur');
        }else{
          $('.repassword>span').css('color','red').html('两次密码不一致,请重新输入');
          $('.repwd').addClass('cur');
        }
      });
       /***********图片验证码*************/
        // //1.获取焦点
      $("input[name='code']").focus(function(){
        //获取提示信息
        s=$(this).attr('class');
        //把s赋值给当前元素的下一个span
        $('.code>span').css('color','gray').html(s);
        $('.codebox').removeClass('cur');
      });
      //失去焦点
       $("input[name='code']").blur(function(){
        //获取验证码
        var code=$(this).val();
         $.post('__MODULE__/Index/checkCode',{code:code},function(data){
            if(data==1){
              //验证码正确
              $('.code>span').css('color','green').html('验证码正确');
            }else{
              //验证码错误
              $('.code>span').css('color','red').html('验证码输入有误,请重新输入');
               $('.codebox').addClass('cur');
            }
          }); 
      });
  
