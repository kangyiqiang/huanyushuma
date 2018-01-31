<?php
    namespace Admin\Controller;
    use Think\Controller;
    class ArticleController extends AllowController{
        public function index(){
            $title = isset($_GET['title'])?$_GET['title']:"";
            $name["title"] = array("LIKE","%".$title."%");
            $mod = M('articles');
            $count = $mod->count();
            $page = new \Think\Page($count,5);
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $data = $mod->limit($page->firstRow,$page->listRows)->where($name)->select();
            foreach($data as $k => $v){
                $data[$k]['zan'] = M('zan')->where("art_id=".$v['id'])->count();
            }
            $this->assign('title',$title);
            $this->assign('data',$data);
            $this->assign('count',$count);
            $this->assign('pageinfo',$page->show());
            $this->display("Article/index");
        }
/********************************添加文章开始****************************************/
        public function add(){
     	  $this->display("Article/add");
        }
        public function insert(){
            //实例化
            $upload = new \Think\Upload();
            //设置信息
            $upload->maxSize = 124000000;
            //类型
            $upload->exts=array('jpg','png','gif','jpeg');
            //保存路径
            $upload->rootPath="./Public/Uploads/Article/";
            //是否具有日期目录
            $upload->autoSub=false;
            $info = $upload->upload();
            if(!$info){
                $this->error($upload->getError(),U("Article/add"));
            }else{
                foreach($info as $file){
                    //日期目录
                    $savepath=$file['savepath'];
                    //获取上传以后的图片
                    $savename=$file['savename'];
                    $url="/Public/Uploads/Article/".$savepath.$savename;
                }
            }
            $mod = M('articles');
            $_POST['pic'] = $url;
            $_POST['addtime'] = time();
            $res = $mod->create($_POST);
            if($mod->add($_POST)){
                $this->success("添加成功",U("Article/index"));
            }else{
                $this->error("添加失败",U("Article/add"));
            }
        }
/********************************添加文章结束****************************************/

/********************************删除文章开始****************************************/
        public function delete(){
            $id = I('get.id');
            $mod = M('articles');
            $data = $mod->where("id=$id")->find();
            $arr = explode('src="',$data['descr']);
            $array = array();
            foreach($arr as $k=>$v){
                if($k%2==0){
                }else{
                    $array[] = $v;
                }
            }
            foreach ($array as $v){
                unlink("../..".strstr($v,'"',true));
            }
            if($mod->where("id=$id")->delete()){
                if(M('zan')->where("art_id=$id")->delete()){
                    if(M('comment')->where("art_id=$id")->delete()){
                        $this->success("删除成功",U("Article/index"));
                    }
                }
            }else{
                $this->success("删除失败",U("Article/index"));
            }
        }
/********************************删除文章结束****************************************/

/********************************修改文章开始****************************************/
        public function edit(){
            $id = I("get.id");
            $mod = M('articles');
            $data = $mod->where("id=$id")->find();
            $this->assign("id",$id);
            $this->assign("data",$data);
            $this->display("Article/edit");
        }
        public function update(){
            if(empty($_FILES['pic']['name'])){
                //不修改封面
                $mod = M('articles');
                $id = $_POST['id'];
                array_shift($_POST);
                $res = $mod->create($_POST);
                if($mod->where("id=$id")->save($_POST)){
                    $this->success("修改成功",U("Article/index"));
                }else{
                    $this->error("数据未修改",U("Article/edit?id=".$id));
                }
            }else{
                //实例化
                $upload = new \Think\Upload();
                //设置信息
                $upload->maxSize = 124000000;
                //类型
                $upload->exts=array('jpg','png','gif','jpeg');
                //保存路径
                $upload->rootPath="./Public/Uploads/Article/";
                //是否具有日期目录
                $upload->autoSub=false;
                $info = $upload->upload();
                if(!$info){
                    $this->error($upload->getError(),U("Article/add"));
                }else{
                    foreach($info as $file){
                        //日期目录
                        $savepath=$file['savepath'];
                        //获取上传以后的图片
                        $savename=$file['savename'];
                        $url="/Public/Uploads/Article/".$savepath.$savename;
                    }
                }
                $mod = M('articles');
                $id = $_POST['id'];
                array_shift($_POST);
                $list = $mod->where("id=$id")->find();
                $photo = $list['pic'];
                unlink(".".$photo);
                $_POST['pic'] = $url;
                $res = $mod->create($_POST);
                if($mod->where("id=$id")->save($_POST)){
                    $this->success("修改成功",U("Article/index"));
                }else{
                    $this->error("修改失败",U("Article/add"));
                }
            }
        }
/********************************修改文章结束****************************************/
    }
?>