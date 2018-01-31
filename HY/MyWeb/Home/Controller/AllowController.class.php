<?php
namespace Home\Controller;
use Think\Controller;
class AllowController extends Controller {
	
   //控制器初始化方法
	public function _initialize(){
		if(empty($_SESSION['uid'])){
			//跳转到登录界面
			echo "<script>alert('请先登录再进行操作');top.location='".__ROOT__."/index.php/Home/Login/login.html'</script>";
		}

	}
}