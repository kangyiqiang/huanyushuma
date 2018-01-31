<?php
	//收藏管理
    namespace Home\Controller;
    use Think\Controller;
    class CollectController extends Controller {
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/***********************显示收藏信息开始*******************************/

        public function index(){
            $this->display('Collect/index');
        }
/***********************显示收藏信息结束*******************************/

    }
?>