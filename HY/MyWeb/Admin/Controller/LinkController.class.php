<?php 
    namespace Admin\Controller;
    use Think\Controller;
    class LinkController extends AllowController{

/********************************响应友情链接开始****************************************/
        public function index(){
            $nameStr = $_GET['name'];
            $arr = array();
            if(!empty($_GET['name'])){
                $arr['name'] = array("like","%{$_GET['name']}%");
            }
            // exit;
            $mod = M('link');
            $count = $mod->where($arr)->where("status=1")->count();
            $page = new \Think\Page($count,5);
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $data = $mod->where("status=1")->limit($page->firstRow,$page->listRows)->select();
            $name = I("post.name");
            $this->assign('data',$data);
            $this->assign('count',$count);
            $this->assign('nameStr',$nameStr);
            $this->assign('pageinfo',$page->show());
            $this->display("Link/index");
        }
/********************************响应友情链接结束****************************************/

/********************************添加友情链接开始****************************************/
        public function add(){
            $this->display("Link/add");
        }
        public function insert(){
            $mod = M('link');
            if($mod->data($_POST)->add()){
                $this->success('添加成功',U('Link/index'));
            }else{
                $this->error('添加失败',U('Link/add'));
            }
        }
/********************************添加友情链接结束****************************************/

/********************************友情链接申请开始****************************************/
        public function apply(){
            $arr = array();
            if(!empty($_GET['name'])){
                $arr['name'] = array("like","%{$_GET['name']}%");
            }
            $mod = M('link');
            $count = $mod->where($arr)->where("status=0")->count();
            $page = new \Think\Page($count,5);
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
            $data = $mod->where("status=0")->limit($page->firstRow,$page->listRows)->select();
            $name = I("post.name");
            $this->assign('data',$data);
            $this->assign('count',$count);
            $this->assign('pageinfo',$page->show());
            $this->display("Link/apply");
        }
        public function appok(){
            $id = isset($_GET['id'])?$_GET['id']:'';
            if($id==''){
                echo "至少选择一条数据";
                exit;
            }
            $arr = array("status"=>"1");
            if(M('link')->where("id=$id")->save($arr)){
                $list = M('link')->where("id=$id")->find();
                $email = $list['email'];
                $s=sendmail($list['email'],"申请成功","恭喜您申请的友情链接：".$list['name']."<br>网址：<a href=".$list['url'].">".$list['url']."</a><br>已通过验证。");
                if($s){
                     $this->success("通过成功",U("Link/apply"));
                }
                
            }
        }
        public function del(){
            $id = isset($_GET['id'])?$_GET['id']:'';
            if($id==''){
                echo "至少选择一条数据";
                exit;
            }
            foreach($id as $k => $v){
                if(M('link')->delete($v)){
                }
            }
            echo "删除成功";
        }
        public function delete(){
            $id = isset($_GET['id'])?$_GET['id']:'';
            if($id==''){
                alert("请选择要删除的数据");
                exit;
            }
            $list = M('link')->where("id=$id")->find();
            $s=sendmail($list['email'],"申请失败","抱歉，您申请的友情链接：".$list['name']."<br>网址：<a href=".$list['url'].">".$list['url']."</a><br>经管理员审核，未能通过，请您检查申请数据后再次提交申请。");
            if(M('link')->delete($id)){
                $this->success("删除成功",U("Link/apply"));
            }else{
                echo '<script>alert("删除失败");location="'.__MODULE__.'/Link/apply";</script>';
            }
        }
        public function dele(){
            $id = isset($_GET['id'])?$_GET['id']:'';
            if($id==''){
                alert("请选择要删除的数据");
                exit;
            }
            if(M('link')->delete($id)){
                echo '<script>location="'.__MODULE__.'/Link/index";</script>';
            }else{
                echo '<script>alert("删除失败");location="'.__MODULE__.'/Link/index";</script>';
            }
        }
/********************************友情链接申请结束****************************************/

/********************************友情链接修改开始****************************************/
        public function edit(){
            $id = I("get.id");
            $mod = M('link');
            $data = $mod->where("id=$id")->find();
            $this->assign("data",$data);
            $this->display("Link/edit");
        }
        public function update(){
            $id = I("post.id");
            array_shift($_POST);
            if(M('link')->where("id=$id")->save($_POST)){
                $this->success("修改成功",U("Link/index"));
            }else{
                $this->error("数据未修改",U("Link/edit?id=".$id));
            }
        }
/********************************友情链接修改结束****************************************/
    }
 ?>