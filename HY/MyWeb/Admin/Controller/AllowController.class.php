<?php
namespace Admin\Controller;
use Think\Controller;
class AllowController extends Controller {
   //控制器初始化方法
	public function _initialize(){
		if(!$_SESSION['islogin']){
			//跳转到登录界面
			// $this->error("请先登录后台",U("Login/login"));
			
			// U("Login/Login");
			echo "<script>alert('请先登录再进行操作');top.location='".__ROOT__."/index.php/Admin/Login/login.html'</script>";
		}

	}
}