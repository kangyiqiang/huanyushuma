<?php 
    namespace Admin\Controller;
    use Think\Controller;
    class AdvertController extends AllowController{
        public function index(){
            $mod = M('advert');
            $number = $mod->count();
            $res = $mod->select();
            $this->assign("number",$number);
            $this->assign("res",$res);
            $this->display('Advert/index');
        }
/********************************添加广告图开始****************************************/
        public function add(){
            $mod = M('Advert');
            $res = $mod->select();
            if($res){
                $this->error("头部广告只能含有一个");
            }else{
                $this->display('Advert/add');                
            }
        }
        public function insert(){
            //实例化
            $upload = new \Think\Upload();
            //设置信息
            $upload->maxSize = 124000000;
            //类型
            $upload->exts=array('jpg','png','gif','jpeg');
            //保存路径
            $upload->rootPath="./Public/Uploads/advert/";
            //是否具有日期目录
            $upload->autoSub=false;
            $info = $upload->upload();
            if(!$info){
                $this->error($upload->getError(),U("Advert/add"));
            }else{
                foreach($info as $file){
                    //日期目录
                    $savepath=$file['savepath'];
                    //获取上传以后的图片
                    $savename=$file['savename'];
                    $pic="/Public/Uploads/advert/".$savepath.$savename;
                }
                $mod = M('advert');
                $data['url'] = I('post.url');
                $data['pic'] = $pic;
                $res = $mod->create($data);
                if($mod->add($data)){
                    $this->success("添加成功",U("Advert/index"));
                }else{
                    $this->error("添加失败",U("Advert/add"));
                }
            }
        }
/********************************添加广告图结束****************************************/

/********************************修改广告图开始****************************************/
        public function edit(){
            $id = I('get.id');
            $mod = M('advert');
            $data = $mod->where("id=$id")->find();
            $this->assign("data",$data);
            $this->display("Advert/edit");
        }
        public function update(){
             $id = I("post.id");
             if(empty($id)){
                $this->error("请选择要修改的图片",U("Advert/index"));
                exit;
             }
             $mod = M('advert');    
            if(empty($_FILES['pic']['name'])){
                //未修改图片
                $data['url'] = I("post.url");
                if($mod->where("id=$id")->save($data)){                  
                     $this->success("修改成功",U("Advert/index"));             
                 }else{
                     $this->error("修改失败",U("Advert/index"));
                 }

            }else{
                //要修改图片
                //存储原图信息 便于删除
                $pic = $mod->field("pic")->where("id=$id")->find();
                //实例化
                $upload = new \Think\Upload();
                //设置信息
                $upload->maxSize = 124000000;
                //类型
                $upload->exts=array('jpg','png','gif','jpeg');
                //保存路径
                $upload->rootPath="./Public/Uploads/advert/";
                //是否具有日期目录
                $upload->autoSub=false;
                $info = $upload->upload();
                if(!$info){
                    $this->error($upload->getError());
                    echo '<script>location="'.__MODULE__.'/Advert/edit/id/'.$id.'"</script>';
                }else{
                    foreach($info as $file){
                        //日期目录
                        $savepath=$file['savepath'];
                        //获取上传以后的图片
                        $savename=$file['savename'];
                        $pic2="/Public/Uploads/advert/".$savepath.$savename;
                    }
                    $data['url'] = I('post.url');
                    $data['pic'] = $pic2;
                    $res = $mod->create($data);
                    if($mod->where("id=$id")->save($data)){
                        if(unlink(".".$pic['pic'])){
                            $this->success("修改成功",U("Advert/index"));
                        }else{
                            $this->error("删除原图片失败",U("Advert/index"));
                        }
                    }else{
                        $this->error("修改失败",U("Advert/index"));
                    }
                }
            }
            
            
        }
/********************************修改广告图结束****************************************/

/********************************删除广告图开始****************************************/
        public function delete(){
            $id = I("get.id");
            $mod = M('advert');
            $pic = $mod->where("id=$id")->field("pic")->find();
            if($mod->where("id=$id")->delete()){
                if(unlink(".".$pic['pic'])){
                    $this->success("删除成功",U("Advert/index"));
                }else{
                    $this->error("删除原图片失败",U("Advert/index"));
                }
                
            }else{
                $this->error("删除失败",U("Advert/index"));
            }
        }
/********************************删除广告图结束****************************************/
    }
 ?>