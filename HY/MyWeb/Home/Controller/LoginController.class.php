<?php
namespace Home\Controller;
use Think\Controller;
class LoginController extends Controller {
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/
/*********************************登录开始***************************************/

    //登录
    public function login(){
        //加载登录模板
        $this->display('Login/login');
    }

    //执行登录
    public function dologin(){
        //获取登录的用户名和密码
        $arr['username'] = $_POST['username'];
        $arr['password'] = md5($_POST['password']);     
        //实例化Model
        $user=M('User');
        //数据库查询
        $res=$user->where($arr)->find();
        // var_dump($res);
        // exit;
        if($res['level']>0){
            //把用户的信息存储在session
            $_SESSION['username']=$arr['username'];
            $_SESSION['islogin']=2;
            $_SESSION['userid'] = $res['id'];
            $_SESSION['uid'] = $res['id'];
            $_SESSION['level'] = $res['level'];
            //跳转
            $id = $res['id'];
            $cart = M('cart')->where("userid=$id")->select();
            foreach($cart as $v){
                $_SESSION['cart'][$v['vid']]['price'] = $v['price'];
                $_SESSION['cart'][$v['vid']]['gnum'] = $v['gnum'];
                $_SESSION['cart'][$v['vid']]['vid'] = $v['vid'];
                $_SESSION['cart'][$v['vid']]['spic'] = $v['spic'];
                $_SESSION['cart'][$v['vid']]['gname'] = $v['gname'];
            }
            if(empty($_POST['returnurl'])){
                $this->success('登录成功',U('Index/index'));
            }else{
                $returnurl = base64_decode($_POST['returnurl']);
                echo '<script>alert("登录成功，请继续操作");location="http://'.$returnurl.'";</script>';
            }
        }else{
            $this->error('用户名与密码不匹配或账户未激活',U('Login/login'));
        }    
    }
/*********************************登录结束***************************************/

/*********************************注册开始***************************************/
    //手机注册
    public function register(){
        //加载注册模板   
        $this->display('Login/register');
    }
   //执行手机注册
    public function doRegister(){
        //判断手机验证码是否正确
        if($_POST['mobileCode'] !== $_COOKIE['param']){
            $this->error("手机验证失败",U("Login/register"));
        }        
        //接收注册信息(用户名 密码 手机号 邮箱 时间)
        $arr['username'] = $_POST['username'];
        $arr['password'] = md5($_POST['password']);
        $arr['phone'] = $_POST['phone'];
        $arr['level'] = '1';
        $arr['addtime'] = time();
        //实例化
        $mod = M('User');
        //添加数据
        $insertId = $mod->add($arr);
        if($insertId>0){
            //添加成功 返回id值
            $this->success('恭喜你!注册成功,正在转到登录页面...',U('Login/login'));
        }else{
            $this->error('注册失败',U('Login/register'));
        }       

    }

    //邮箱注册
     public function register2(){
        //加载注册模板   
        $this->display('Login/register2');
    }
    //执行邮箱注册
    public function doRegister2(){

       
        //接收注册信息(用户名 密码  邮箱 时间)
        $arr['username'] = $_POST['username'];
        $arr['password'] = md5($_POST['password']);
        $arr['email'] = $_POST['email'];
     
        $arr['addtime'] = time();
        //实例化
        $mod = M('User');
        //添加数据
        $insertId = $mod->add($arr);
        if($insertId>0){
             if(sendmail($_POST['email'],"【寰宇数码】账户激活","【寰宇数码】<a href='http://localhost/jingdong/TP/index.php/Home/Login/jihuo/id/{$insertId}'>账户激活</a>如非本人操作请忽略")){
                    //添加成功 返回id值
                    $this->success('恭喜你!注册成功,请先登录邮箱激活账户',U('Login/login'));
                }else{
                    $this->error('注册失败',U('Login/register'));                   
                }
            
        }else{
            $this->error('注册失败',U('Login/register'));
        }       

    }

    //用户激活链接
    public function jihuo(){
        $id = I('get.id');
        $mod = M('user');
        $arr['level'] = '1';
        $res = $mod->where('id='.$id)->save($arr);
        if($res){
            $this->success('恭喜你!账户激活成功，正在跳转登录页....',U('Login/login'));
        }else{
            $this->error('激活失败',U('Login/login'));        
        }

    }

    //找回密码
    public function findpwd(){         
        $this->display("Login/findpwd");
    }
    //找回第一步
    public function find1(){
        $username = $_POST['username'];
        $mod = M("user");
        $re = $mod->where("username='{$username}'")->find();
        if($re > 0){
            if(!empty($re['email'])){
                //邮件找回
                $fangshi = 1;
                $this->assign("fangshi",$fangshi);
                if(sendmail($re['email'],"【寰宇数码】密码找回","【寰宇数码】<a href='http://localhost/jingdong/TP/index.php/Home/Login/email_find/email/{$re["email"]}'>密码找回</a>如非本人操作请忽略")){
                }else{
                    $this->error('密码找回邮件发送失败，请重新操作',U("Login/findpwd"));                   
                }

            }else{
                //手机找回
                $fangshi = 2;               
                $this->assign("fangshi",$fangshi);
                $this->assign("phoneY",$re['phone']);                              
                $a = substr($re['phone'],0,3);
                $b = substr($re['phone'],-4);               
                $phoneNum = $a."****".$b;
                $this->assign("phoneNum",$phoneNum);               
            }
            //加载模板
            $this->display("Login/findpwd1");                                  

        }else{
            $this->error("您所输入的用户名不存在",U("Login/findpwd"));
        }
    }

    //手机找回验证
    public function find2(){
        if($_POST['mobileCode'] == $_COOKIE['param']){
            //加载重置密码模板
            $this->assign("phone",$_POST['phone']);
            $this->display("Login/findpwd2");
        }else{
            $this->error("手机验证失败,请重新操作",U("Login/findpwd"));
        }
    }

    //邮件找回验证
    public function email_find(){
             //加载重置密码模板
            $this->assign("email",$_GET['email']);
            $this->display("Login/findpwd2_e");
    }
    public function pwd_update(){
        //执行修改
        $phone = $_POST['phone'];
        $password = md5($_POST['password']);
        $arr['password'] = $password;
        $mod = M("user");
        $res = $mod->where("phone='{$phone}'")->save($arr);
        if($res){
            $this->success("密码重置成功,正在跳转登录页...",U("Login/login"));
        }else{
            $this->error("操作超时,请重新操作",U("Login/findpwd"));
        }
    }
    //邮件方式修改
     public function pwd_update_e(){
        //执行修改
        $email = I('post.email');
        $password = md5($_POST['password']);
        $arr['password'] = $password;
        $mod = M("user");
        $res = $mod->where("email='{$email}'")->save($arr);
        if($res){
            $this->success("密码重置成功,正在跳转登录页...",U("Login/login"));
        }else{
            $this->error("操作超时,请重新操作",U("Login/findpwd"));
        }
    }


    //加载验证码
    public function verify(){
        //实例化验证码类
        $verify=new \Think\Verify();
        //设置
        //字体大小
        $verify->fontSize=30;
        //是否采用杂点
        $verify->useNoise=false;
        //验证码的位数
        $verify->length=4;
        //是否采用中文验证码
        $verify->useZh=false;
        //中文验证码内容
        $verify->zhSet="你喜欢我吗";
        //写入验证码
        $verify->entry();
   }
    // 检查姓名
    public function checkName(){
        //接收用户注册的用户名
        $name=$_POST['name'];
        //从数据库检查是否有重复的用户名
        $mod=M('User');
        $res= $mod->where("username='{$name}'")->find();
        if($res){
            echo 1;
        }else{
            echo 0;
        }
    }
    //检查验证码
    public function checkCode(){
        //获取输入的验证码
        $code=$_POST['code'];
        //实例化验证码类
        $verify=new \Think\Verify();
        if($verify->check($code,"")){
            echo 1;
        }else{
            echo 0;
        }
    }
    //检查邮箱
    public function checkEmail(){
        //接收输入的邮箱
        $email = $_POST['email'];
        //从数据库检查邮箱是否被占用
        $mod = M('User');
        $res = $mod->where("email='{$email}'")->find();
        if($res){
            echo 1;
        }else{
            echo 0;
        }
    }
    //验证手机
    public function checkPhone(){
        //接收输入的手机号
        $phone = $_POST['phone'];
        //从数据库检查邮箱是否被占用
        $mod = M('User');
        $res = $mod->where("phone='{$phone}'")->find();
        if($res){
            echo 1;
        }else{
            echo 0;
        }
    }
  

 
/***************************发送短信验证码开始**********************************************/
    //注册
    public function sendPhone(){
        if(phone($_GET['phone'])){
            echo "1";
        }else{
            echo "2";
        }
    }

    //密码找回
     public function sendPhone2(){
        if(phone2($_GET['phone'])){
            echo "1";
        }else{
            echo "2";
        }
    }
/***************************发送短信验证码结束**********************************************/

/*********************************注册结束***************************************/


/*********************************退出登录开始************************************/
    public function logout(){
         session_destroy();
         $this->success('退出登录成功,正在转到登录页面...',U('Login/login'));
    }
/*********************************退出登录结束************************************/



}