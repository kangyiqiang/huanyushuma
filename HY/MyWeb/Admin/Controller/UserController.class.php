<?php
namespace Admin\Controller;
use Think\Controller;
class UserController extends AllowController {
/***************************添加用户开始**********************************************/
   public function add(){
        //加载模板
        $this->display("User/add");
   }

   //执行添加
   public function insert(){
   	 //实例化Model
      $user=D('User');
      $data['username']=$_POST['username'];
      $data['password']=md5($_POST['password']);
      $data['email']=$_POST['email'];
      $data['token']=rand(1000,100000);
      $data['level']=$_POST['level'];
      $data['phone']=$_POST['phone'];
      $data['addtime']=time();
      if(!$user->create()){
        //创建数据对象失败 把错误的信息输出
        $this->error($user->getError());
      }
      //数据执行添加
      if($user->add($data)){
        $this->success('添加成功',U('User/index'));
      }else{
        $this->error('添加失败',U('User/add'));
      }
   }
/***************************添加用户结束**********************************************/

/***************************显示用户列表开始**********************************************/
   //列表页
   public function index(){
          //获取搜索的信息
        // var_dump($_SESSION);
         $arr=array();
        if(!empty($_GET['username'])){
           $arr['username']=array('like',"%{$_GET['username']}%");
        }
        if(!empty($_GET['level']) || $_GET['level']=='0'){
          $arr['level']="{$_GET['level']}";
        }
       // //M 方法
        $mod=M('User');
        //获取数据总条数
        $tot=$mod->where($arr)->Count();

        //实例化分页类
        $page=new \Think\Page($tot,4);
        //设置分页
        $page->setConfig('prev','上一页');
        $page->setConfig('next','下一页');
        $page->setConfig('first','首页');
        $page->setConfig('last','末页');
        $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        // select * from stu limit 12,4
        //获取结果集
        $list=$mod->where($arr)->limit($page->firstRow,$page->listRows)->select();
        // echo "<pre>";
        // var_dump($list);
        //定义会员等级
        $arr=array('禁用','普通会员','VIP会员','普通管理员','超级管理员');
        //定义会员等级的颜色
        $font=array('#ccc','black','red','orange','green');
        //分配给模板
        $level=$_GET['level'];
        $this->assign('level',$level);
        $this->assign('arr',$arr);
        $this->assign('font',$font);
        $this->assign('list',$list);
        //组装分页
        $this->assign('pageinfo',$page->show());

        //加载模板
        $this->display('User/index');
   }
/***************************显示用户列表结束**********************************************/

/***************************删除用户操作开始**********************************************/
   //用户删除操作
   public function delete(){
        $id=I('get.id');
        $mod=M('User');
        $s=$mod->where("id={$id}")->delete();
        if($s){
          $this->success('删除成功',U('User/index'));
        }else{
          $this->error('删除失败',U('User/index'));
        }
   }
/***************************删除用户操作结束**********************************************/

/***************************修改用户操作开始**********************************************/
   //用户修改操作
   public function edit(){
        $id=I('get.id');
        // var_dump($id);
        $mod=M('User');
        $list=$mod->where("id={$id}")->find();
        // var_dump($list);
        //分配数据
        $this->assign('list',$list);
        $this->display('User/edit');
   }
   //执行用户的修改
   public function update(){
        $mod = M('User');    
        $id = $_POST['id'];
        //判断是否修改密码
        if(empty($_POST['password'])){
            //保存原密码
            $res = $mod->where("id=".$id)->find();
            $_POST['password'] = $res['password'];
        }else{
            $_POST['password'] = md5($_POST['password']);      
        }
        if($mod->save($_POST)){
          $this->success('修改成功',U('User/index'));
        }else{
          $this->error('修改失败',U("User/edit?id={$id}"));
        }

   }
/***************************修改用户操作结束**********************************************/

/***************************权限分配操作开始**********************************************/
   //普通管理员列表页
   public function list1(){
        
        //M 方法
        $mod=M('User');
        //获取数据总条数
        $tot=$mod->where($arr)->where('level=3')->Count();

        //实例化分页类
        $page=new \Think\Page($tot,4);
        //设置分页
        $page->setConfig('prev','上一页');
        $page->setConfig('next','下一页');
        $page->setConfig('first','首页');
        $page->setConfig('last','末页');
        $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        // select * from stu limit 12,4
        //获取结果集
        $list=$mod->where('level=3')->limit($page->firstRow,$page->listRows)->select();
        // echo "<pre>";
        // var_dump($list);
        //定义会员等级
        $arr=array('禁用','普通会员','VIP会员','普通管理员','超级管理员');
        //定义会员等级的颜色
        $font=array('#ccc','black','red','orange','green');

        //分配给模板
        $this->assign('arr',$arr);
        $this->assign('font',$font);
        $this->assign('list',$list);
        //组装分页
        $this->assign('pageinfo',$page->show());

        //加载模板
        $this->display('User/list');
   }

    //分配页面
    public function list_html($id){
        //M 方法
        $mod=M('User');
        //查询该数据信息
        $row = $mod->where("id=".$id)->find();
        //分配数据
        $this->assign('row',$row);
        //加载模板
        $this->display('User/list_html');
    }

    //执行分配
    public function do_list(){
        //弹出Id值
        $id = array_pop($_POST);   
        //获取rule字段值
        $array = $_POST['rule'];
        $str = implode(",",$array);
        $data['rule'] = $str;
        //执行更新
        $mod = M('User');
        if($mod->where("id=".$id)->save($data)){
            $this->success('权限更新成功',U('User/list'));          
        }else{
            $this->error('权限更新成功',U('User/list'));                    
        }
    }

/***************************权限分配操作开始**********************************************/

/***************************修改个人信息操作开始*******************************************/
    public function user_edit(){
      // var_dump($_SESSION['userid']);
      $id = $_SESSION['userid'];
      //显示本人主要信息
      $mod = M('User');
      $list = $mod->where("id=".$id)->find();
      //分配数据
      $this->assign("list",$list);
      //加载模板
      $this->display("User/user_edit");

    }

    //执行修改
    public function do_user_edit(){
      $mod = M('User');
      //弹出id
      $id = array_pop($_POST);
      //密码是否为空 为空表示不修改密码
      if(empty($_POST['password'])){
          //保存原密码
          $res = $mod->where("id=".$id)->find();
          $_POST['password'] = $res['password'];
      }else{
          $_POST['password'] = md5($_POST['password']);    
      }

      //执行修改
      if($mod->where("id=".$id)->save($_POST)){
          $this->success('个人信息更新成功',U('Index/right'));          
      }else{
          $this->error('个人信息更新失败',U('Index/right'));          
      }
    }
/***************************修改个人信息操作结束*******************************************/

/******************************查看用户附表信息开始**************************************/ 
    public function info_index(){
      $id=I('get.id');
      // var_dump($id);
      $mod=M('User_info');
      //查看会员附表有误信息
      $row=$mod->where("uid={$id}")->find();
      $this->assign('id',$id);
      //如果没有数据实现用户附表的添加操作,否则,修改
      if($row){
        //修改操作
        // var_dump($row);exit;
        $submit='修改';
        $action='update';
        $this->assign('row',$row);
        $this->assign('action',$action);
        $this->assign('submit',$submit);
        $this->display('User/info_index');
      }else{
        //添加操作
        $submit='添加';
        $action='add';
        $this->assign('action',$action);
        $this->assign('submit',$submit);
        $this->display('User/info_index');
      }
   }
/******************************查看用户附表信息结束**************************************/ 


/******************************用户附表的添加开始**************************************/ 
   public function info_add(){
      //调用文件上传函数,获取头像地址
      // $mod=M('User_info');
      $mod = new \Admin\Model\InfoModel('User_info');
      $url=$this->upload();
      $_POST['pic']=$url;
      if(!$mod->create()){
        //创建数据对象失败 把错误的信息输出
        $this->error($mod->getError());
      }
      if($mod->add($_POST)){
        $this->success('添加成功',U('User/index'));
      }else{
        $this->error('添加失败',U("User/info_index?id={$_POST['id']}"));
      }
      // var_dump($url);
   }
/******************************用户附表的添加开始**************************************/ 



/******************************用户附表的修改开始**************************************/ 
   public function info_update(){
      //判断是否要修改头像
      // $mod=M('user_info');
      $mod = new \Admin\Model\InfoModel('User_info');

      if($_FILES['pic']['name']){
        //有修改头像
        $row=$mod->where("uid={$_POST['uid']}")->find();
        $url=$this->upload();
        $_POST['pic']=$url;
        if(!$mod->create()){
        //创建数据对象失败 把错误的信息输出
        $this->error($mod->getError());
      }
        if($mod->save($_POST)){
          $this->success('修改成功',U('User/index'));
          //删除旧的头像    /Git/Think1/mayuntest1/TP/Public/Uploads/2017-07-01/595739bbb16c6.jpg
          $a=strstr($row['pic'],'Public');
          unlink('./'."$a");
        }else{
          $this->error('修改失败',U("User/info_index?id={$_POST['uid']}"));
        }
      }else{
        //没有修改头像
        if($mod->save($_POST)){
          $this->success('修改成功',U('User/index'));
        }else{
          $this->error('修改失败',U("User/info_index?id={$_POST['uid']}"));
        }
      }
   }
/*****************************用户附表的修改结束**************************************/ 


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