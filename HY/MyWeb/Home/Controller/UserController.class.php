<?php
	//用户信息管理
    namespace Home\Controller;
    use Think\Controller;
    class UserController extends AllowController {
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/************************个人中心默认页面开始*****************************/
        
        public function index(){
            // var_dump($_SESSION);exit;
            $user=M('User');
            $row=$user->where("id={$_SESSION['uid']}")->find();
            $user_info=M('User_info');
            $info=$user_info->where("uid={$_SESSION['uid']}")->find();
            // var_dump($row);
            // var_dump($info);exit;
            $ord=M('Orders');
            $orders=$ord->limit(0,2)->select();
            $this->assign('orders',$orders);
            $this->assign('row',$row);
            $this->assign('info',$info);
            $this->display('User/index');
        }
/**************************个人中心默认页面结束***************************/




/***********************修改密码模板开始*******************************/
        public function setpwd(){
            $this->display('User/setpwd');
        }
/***********************修改密码模板结束*******************************/


/***********************修改密码开始*******************************/
        public function pwd_update(){
            // var_dump($_POST);
            $data['password']=md5($_POST['newpassword']);
            $data['id']=$_SESSION['uid'];
            $mod=M('User');
            if($mod->save($data)){
                $this->success('修改密码成功',U('User/setpwd'));
            }else{
                $this->error('修改密码失败',U('User/setpwd'));
            }
        }
/***********************修改密码结束*******************************/



/***********************检测密码结束*******************************/
        public function checkPWD(){
            //接收输入的手机号
            $password = $_POST['password'];
            // var_dump($password);exit;
            //从数据库检查邮箱是否被占用
            $mod = M('User');
            $res = $mod->where("id={$_SESSION['uid']}")->find();
            if($res['password']==md5($password)){
                echo 1;
            }else{
                echo 0;
            }
        }
/***********************检测密码结束*******************************/



/***********************基本资料开始*******************************/
        public function index1(){
            $user=M('User');
            $row=$user->where("id={$_SESSION['uid']}")->find();
            $this->assign('row',$row);
			$this->display('User/index1');
		}

        public function info(){
            $mod=M('User_info');
            $info=$mod->where("uid={$_SESSION['uid']}")->find();
            // var_dump($info);exit;
            if(!$info){
                $required='required';
                $this->assign('required',$required);
            }
            $this->assign('info',$info);
            $this->display('User/info');
        }
/***********************基本资料结束*******************************/
    


/************************详细信息添加修改开始*******************************/
        public function info_insert(){
            //修改详细信息
            $mod=M('User_info');
            if($mod->where("uid={$_SESSION['uid']}")->find()){
                // var_dump($_POST);
                if($_FILES['pic']['name']){
                    //修改头像
                    // echo '修改头像';
                    $row=$mod->where("uid={$_POST['uid']}")->find();
                    $url=$this->upload();
                    $_POST['pic']=$url;
                    if($mod->save($_POST)){
                        $this->success('修改成功',U("User/info?id={$_POST['uid']}"));
                        //删除旧的头像    /Git/Think1/mayuntest1/TP/Public/Uploads/2017-07-01/595739bbb16c6.jpg
                        $a=strstr($row['pic'],'Public');
                        unlink('./'."$a");
                    }else{
                        $this->error('修改失败',U("User/info?id={$_POST['uid']}"));
                    }
                }else{
                    //没有修改头像
                    if($mod->save($_POST)){
                        $this->success('修改成功');
                    }else{
                        $this->error('修改失败');
                    }
                }
            }else{
                //添加详细信息
                // echo '添加';
                $url=$this->upload();
                $_POST['pic']=$url;
                $_POST['uid']=$_SESSION['uid'];
                if($mod->add($_POST)){
                    $this->success('添加成功',U('User/info'));
                }else{
                    $this->error('添加失败',U('User/info'));
                }
            }
        }
/***********************详细信息添加修改结束*******************************/



/************************会员信息修改开始*******************************/
    public function user_update(){
        // var_dump($_POST);
        $mod=M('User');
        if($mod->save($_POST)){
            $this->success('修改成功',U('User/index1'));
        }else{
            $this->error('修改失败',U('User/info'));
        }
    }
/************************会员信息修改结束*******************************/




/*****************************文件上传开始**************************************/ 
   public function upload(){
      //实例化
      $upload=new \Think\Upload();
      //设置信息
      //大小
      $Upload->maxSize=999999999999;
      //类型
      $upload->exts=array('jpg','jpeg','gif','png');
      //保存路径
      $upload->rootPath="./Public/Uploads/";
      //是否具有日期目录
      $upload->autoSub=true;
      //执行上传
      $info=$upload->upload();
      if(!$info){
        //显示错误信息
        $this->error($upload->getError());
      }else{
        // echo '<pre>';
        // var_dump($info);
        //遍历
        foreach($info as $file){
          //日期目录
          $savepath=$file['savepath'];
          //获取上传以后的图片
          $savename=$file['savename'];
          $url=__ROOT__."/Public/Uploads/".$savepath.$savename;
          // echo $url;
        }
      }
      return $url;
    }
/*****************************文件上传结束**************************************/ 





    }
?>