<?php
    namespace Home\Controller;
    use Think\Controller;
    class ArticleController extends Controller{
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/********************************文章开始****************************************/
        public function index(){
            //分配文章数据
            $id = I('get.id');
            $mod = M('articles');
            $data = $mod->where("id=$id")->find();
            if(!$data){
                session_destroy();
                $this->success("检测到您正在进行异常操作，已注销您的账号",U("Login/login"),3);exit;
            }
            $this->assign("data",$data);
            //分配点赞数据
            $model = M('zan');
            $zan = $model->where("art_id=$id")->count();
            $arrzan = $model->where("art_id=$id")->field("user_id")->select();
            $azan = array();
            foreach($arrzan as $v){
                $azan[] = $v['user_id']; 
            }
            if(in_array($_SESSION['userid'],$azan)){
                $click = 1;
            }else{
                $click = 0;
            }
            $arrzan1 = $model->where("art_id=$id")->field("user_id")->limit(5)->select();
            foreach($arrzan1 as $val){
                $exit = M('user_info')->field("pic")->where("uid=".$val['user_id'])->find();
                if(empty($exit)){
                    $userzan[] = __ROOT__."/Public/Article/touxiang.jpg";
                }else{
                    $userzan[] = $exit['pic'];
                }
            }
            $this->assign('userzan',$userzan);
            $this->assign('click',$click);
            $this->assign('zan',$zan);
            //分配评论数据
            $list = M('comment');
            $commall = $list->where("art_id=$id")->count();
            $page = new \Think\Page($commall,10);
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
            $judge = $list->order("addtime")->where("art_id=$id")->limit($page->firstRow,$page->listRows)->select();
            foreach($judge as $k=> $v){
                $user = M('user_info')->field('name,pic')->where("uid={$v['user_id']}")->find();
                if($user){
                    $judge[$k]['user_name']=$user['name'];
                    $judge[$k]['pic']=$user['pic'];
                }else{
                    $username = M('user')->where("id={$v['user_id']}")->find();
                    $judge[$k]['user_name']=$username['username'];
                    $judge[$k]['pic']= __ROOT__."/Public/Article/touxiang.jpg";

                }
            }
            $user = M('user_info')->field('pic')->where("uid={$_SESSION['userid']}")->find();
            if(empty($user)){
                $flag = 0;
            }else{
                $flag = 1;
                $this->assign('user',$user);
            }
            $this->assign('flag',$flag);
            $this->assign('pageinfo',$page->show());
            $this->assign("commall",$commall);
            $this->assign("judge",$judge);
            $this->display("Article/article");
        }
/********************************文章结束****************************************/

/********************************社区首页开始****************************************/
        public function community(){
            $type= I('get.type');
            $title = "";
            switch($type){
                case 1:
                    $title = "摄影社区";
                break;
                case 2:
                    $title = "智能社区";
                break;
                case 3:
                    $title = "造乐社区";
                break;
            }
            $mod = M('articles');
            $count = $mod->where("type=$type")->count();
            if(!$count){
                session_destroy();
                $this->success("检测到您正在进行异常操作，已注销您的账号",U("Login/login"),3);exit;
            }
            $page = new \Think\Page($count,5);
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
            $data = $mod->where("type=$type")->limit($page->firstRow,$page->listRows)->select();
            foreach($data as $k => $v){
                $list = M('comment')->where("art_id={$v['id']}")->count();
                $data[$k]['comment'] = $list;
            }
            $flag = 0;
            $user = M('user_info')->where("uid={$_SESSION['userid']}")->find();
            if(empty($user)){
                $flag = 0;
            }else{
                $flag = 1;
                $this->assign('user',$user);
            }
            $this->assign('flag',$flag);
            $this->assign('pageinfo',$page->show());
            $this->assign('data',$data);
            $this->assign('count',$count);
            $this->assign('title',$title);
            $this->display("Article/community");
        }
/********************************社区首页结束****************************************/

/********************************点赞修改开始****************************************/
        public function addzan(){
            $mod = M('zan');
            $artid = $_GET['artid'];
            $userid = $_GET['userid'];
            $data = array("art_id"=>$artid,"user_id"=>$userid);
            $mod->add($data);
        }
        public function removezan(){
            $mod = M('zan');
            $artid = $_GET['artid'];
            $userid = $_GET['userid'];
            $mod->where("art_id=$artid")->where("user_id=$userid")->delete();
        }
/********************************点赞修改结束****************************************/

/********************************评论模块开始****************************************/
        public function comment(){
            $_POST['addtime'] = time();
            if(M('comment')->add($_POST)){
                echo "<script>alert('评论成功');location='".__MODULE__."/Article/index/id/".$_POST['art_id']."';</script>";
            }else{
                echo "<script>alert('评论失败');location='".__MODULE__."/Article/index/id/".$_POST['art_id']."';</script>";
            }
        }
        public function delete(){
            $id = I('get.id');
            if(M('comment')->where("id=$id")->delete()){
                echo "<script>alert('删除成功');location='".__MODULE__."/Article/index/id/".$_GET['art_id']."';</script>";
            }else{
                echo "<script>alert('删除失败');location='".__MODULE__."/Article/index/id/".$_GET['art_id']."';</script>";
            }

        }
/********************************评论模块结束****************************************/
    }
?>