<?php
    //$to 接收方  $title 邮件主题  $content 发送邮件的内容
    function sendmail($to, $title, $content){
        //通过命名空间加载第三方发送邮件类 PHPMailer 
        $mail=new \Org\Util\PHPMailer();
        // echo $mail->Version;
        //设置字符集
        $mail->CharSet="utf-8";
        //设置采用SMTP方式发送邮件
        $mail->IsSMTP();
        //设置邮件服务器地址 smtp.163.com
        $mail->Host=C('mail1.smtp');//C 获取配置文件信息 
        //设置邮件服务器的端口 默认的是25  如果需要谷歌邮箱的话 443 端口号
        $mail->Port=25;
        //设置发件人的邮箱地址
        $mail->From=C('mail1.username'); //
        // $mail->FromName='我';//
        //设置SMTP是否需要密码验证
        $mail->SMTPAuth=true;
        //发送方
        $mail->Username=C('mail1.username');
        $mail->Password=C('mail1.password');//C客户端的授权密码(不是163邮箱的登录密码)
        //发送邮件的主题
        $mail->Subject=$title;
        //内容类型 文本型
        $mail->AltBody="text/html";
        //发送的内容
        $mail->Body=$content;
        //设置内容是否为html格式
        $mail->IsHTML(true);
        //设置接收方
        $mail->AddAddress(trim($to));
        //执行邮件发送
        if(!$mail->Send()){
            echo "失败".$mail->ErrorInfo;
            return false;
            
        }else{
            return true;
        }
    } 

    //接收注册短信验证码
     function phone($phone){
        //导入第三方类库
        import("Vendor.lib.Ucpaas");
        //实例化
        $options['accountsid']='78f28cfdab2f7dd4d5914cefeba0eb90';
        $options['token']='0903a15f6d866539a0e55b594198dbee';
        $Ucpaas = new Ucpaas($options);
        // var_dump($Ucpass);
        //短信验证码（模板短信）,默认以65个汉字（同65个英文）为一条（可容纳字数受您应用名称占用字符影响），超过长度短信平台将会自动分割为多条发送。分割后的多条短信将按照具体占用条数计费。
        $appId = "42253a511aa64fa9a9b80da9b27f06c0";
        $to = $phone;
        $templateId = "277060";
        //参数（验证码）
        $param=mt_rand(1000,9999);

        cookie('param',$param,60);

        $json = $Ucpaas->templateSMS($appId,$to,$templateId,$param);
        $arr = json_decode($json,true);
        if($arr['resp']['respCode'] == "000000"){
            return true;
        }else{
            return false;
        }
    }

      //接收密码找回验证码
     function phone2($phone){
        //导入第三方类库
        import("Vendor.lib.Ucpaas");
        //实例化
        $options['accountsid']='c5d88226d7fb9be9e191e21e96b0f922';
        $options['token']='33e052d6b609303eb3a4c43780546b38';
        $Ucpaas = new Ucpaas($options);
        // var_dump($Ucpass);
        //短信验证码（模板短信）,默认以65个汉字（同65个英文）为一条（可容纳字数受您应用名称占用字符影响），超过长度短信平台将会自动分割为多条发送。分割后的多条短信将按照具体占用条数计费。
        $appId = "9c575b2890e54356873317c7a853a2ce";
        $to = $phone;
        $templateId = "92951";
        //参数（验证码）
        $param=mt_rand(1000,9999);

        cookie('param',$param,60);

        $json = $Ucpaas->templateSMS($appId,$to,$templateId,$param);
        $arr = json_decode($json,true);
        if($arr['resp']['respCode'] == "000000"){
            return true;
        }else{
            return false;
        }
    }
 ?>