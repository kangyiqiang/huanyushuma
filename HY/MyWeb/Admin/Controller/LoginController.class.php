<?php
namespace Admin\Controller;
use Think\Controller;
class LoginController extends Controller {
   public function login(){
        //加载模板
        $this->display("Login/login");
   		
   }

   //加载验证码
   public function verify(){
   		//实例化验证码类
    	$verify=new \Think\Verify();
    	//设置
    	//字体大小
    	$verify->fontSize=20;
    	//是否采用杂点
    	$verify->useNoise=true;
    	//验证码的位数
    	$verify->length=4;
    	//是否采用中文验证码
    	$verify->useZh=false;
    	//中文验证码内容
    	$verify->zhSet="你喜欢我吗";
    	//写入验证码
    	$verify->entry();
   }

   //执行登录
   public function dologin(){
   		//获取输入的验证码
    	$fcode=$_POST['fcode'];
    	//实例化验证码类
    	$verify=new \Think\Verify();
    	if($verify->check($fcode,"")){
    		//获取登录的用户名和密码
    		$username=$_POST['username'];
    		$password=md5($_POST['password']);
    		//实例化Model
    		$mod=M("user");
    		$row=$mod->where("username='{$username}' and password='{$password}' and level>=3")->find();
    		if($row){
    			//把用户的信息存储在session
          $_SESSION['userid']=$row['id'];
    			$_SESSION['username']=$username;
    			$_SESSION['islogin']=2;
          $_SESSION['level'] = $row['level'];
          $_SESSION['rule'] = $row['rule'];


         
    			//跳转
          echo "<script>alert('登录成功！');location='".__ROOT__."/index.php/Admin'</script>";
    		}else{
    			$this->error("账号密码不匹配或权限不足",U("Login/login"));
    		}
    		
    	}else{
    		$this->error("验证码有误",U("Login/login"));
    	}
   }

   //退出
   public function logout(){
	   	setcookie(session_name(),'',time()-100,'/');
	   	$_SESSION=array();
	   	session_destroy();
      echo "<script>top.location='".__ROOT__."/index.php/Admin/Login/login.html';</script>";
   }
}