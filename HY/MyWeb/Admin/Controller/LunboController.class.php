<?php 
    namespace Admin\Controller;
    use Think\Controller;
    class LunboController extends AllowController{
        public function index(){
            $mod = M('lunbo');
            $all = $mod->count();
            if($all>0){
                $data = $mod->order("id")->select();
                $this->assign('data',$data);
            }
            $this->assign('number',$all);
            $this->display('Lunbo/index');
        }
/********************************添加轮播图开始****************************************/
        public function add(){
            $mod = M('lunbo');
            $full = 0;
            $all = $mod->count();
            if($all>=7){
                $full = 1;
            }
            $this->assign('full',$full);
            $this->display('Lunbo/add');
        }
        public function insert(){
            //实例化
            $upload = new \Think\Upload();
            //设置信息
            $upload->maxSize = 124000000;
            //类型
            $upload->exts=array('jpg','png','gif','jpeg');
            //保存路径
            $upload->rootPath="./Public/Uploads/lunbo/";
            //是否具有日期目录
            $upload->autoSub=false;
            $info = $upload->upload();
            if(!$info){
                $this->error($upload->getError(),U("Lunbo/add"));
            }else{
                foreach($info as $file){
                    //日期目录
                    $savepath=$file['savepath'];
                    //获取上传以后的图片
                    $savename=$file['savename'];
                    $url="/Public/Uploads/lunbo/".$savepath.$savename;
                }
                $mod = M('lunbo');
                $data = array("pic"=>$url);
                $res = $mod->create($data);
                if($mod->add($data)){
                    $this->success("添加成功",U("Lunbo/index"));
                }else{
                    $this->error("添加失败",U("Lunbo/add"));
                }
            }
        }
/********************************添加轮播图结束****************************************/

/********************************修改轮播图开始****************************************/
        public function edit(){
            $id = I('get.id');
            $mod = M('lunbo');
            $data = $mod->where("id=$id")->find();
            $this->assign("data",$data);
            $this->display("Lunbo/edit");
        }
        public function update(){
            if(empty($_FILES['pic']['name'])){
                $this->error("没有数据被成功修改",U("Lunbo/index"));
            }else{
                $id = I("post.id");
                $mod = M('lunbo');
                $pic = $mod->field("pic")->where("id=$id")->find();
                //实例化
                $upload = new \Think\Upload();
                //设置信息
                $upload->maxSize = 124000000;
                //类型
                $upload->exts=array('jpg','png','gif','jpeg');
                //保存路径
                $upload->rootPath="./Public/Uploads/lunbo/";
                //是否具有日期目录
                $upload->autoSub=false;
                $info = $upload->upload();
                if(!$info){
                    $this->error($upload->getError());
                    echo '<script>location="'.__MODULE__.'/Lunbo/edit?id='.$id.'"</script>';
                }else{
                    foreach($info as $file){
                        //日期目录
                        $savepath=$file['savepath'];
                        //获取上传以后的图片
                        $savename=$file['savename'];
                        $url="/Public/Uploads/lunbo/".$savepath.$savename;
                    }
                    $data = array("pic"=>$url);
                    $res = $mod->create($data);
                    if($mod->where("id=$id")->save($data)){
                        if(unlink(".".$pic['pic'])){
                            $this->success("修改成功",U("Lunbo/index"));
                        }else{
                            $this->error("删除原图片失败",U("Lunbo/index"));
                        }
                    }else{
                        $this->error("修改失败",U("Lunbo/index"));
                    }
                }
            }
            
            
        }
/********************************修改轮播图结束****************************************/

/********************************删除轮播图开始****************************************/
        public function delete(){
            $id = I("get.id");
            $mod = M('lunbo');
            $pic = $mod->where("id=$id")->field("pic")->find();
            if($mod->where("id=$id")->delete()){
                if(unlink(".".$pic['pic'])){
                    $this->success("删除成功",U("Lunbo/index"));
                }else{
                    $this->error("删除原图片失败",U("Lunbo/index"));
                }
                
            }else{
                $this->error("删除失败",U("Lunbo/index"));
            }
        }
/********************************删除轮播图结束****************************************/
    }
 ?>