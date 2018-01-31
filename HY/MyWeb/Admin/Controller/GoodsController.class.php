<?php

namespace Admin\Controller;
use Think\Controller;

class GoodsController extends AllowController 
{
    
   /*--------------------------------------------------------------------------显示商品列表
   * 显示商品列表页面
   * 商品id 商品名称 商品图片 商品类别 状态 添加时间
   * Index() 
   */
  public function Index(){
    //获取搜索的信息
    $arr=array();
    if(!empty($_GET['goods_name'])){
       $arr['goods_name']=array('like',"%{$_GET['goods_name']}%");
    }
    $mod=M('goods_info');
    //获取数据总条数
    $tot=$mod->where($arr)->Count();
    //实例化分页类
    $page=new \Think\Page($tot,6);
    //设置分页
    $page->setConfig('prev','上一页');
    $page->setConfig('next','下一页');
    $page->setConfig('first','首页');
    $page->setConfig('last','末页');
    $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
    // select * from goods_info limit 8,4
    //获取结果集
    $list=$mod->where($arr)->limit($page->firstRow,$page->listRows)->order('id desc')->select();
    // echo "<pre>";
    // var_dump($list);

    //组装分页
    $this->assign('pageinfo',$page->show());

    //类别type_id替换为类别名称
    foreach($list as $key=>$val){
      $list[$key]['type_name'] = M('type')->field('name')->where("id={$val['type_id']}")->find()['name'];
      //从goods_color中截取一张缩略图
      $firstSpic = M('goods_color')->field('spic')->where("goods_id={$val['id']}")->find()['spic'];
      $list[$key]['goods_pic'] = strstr($firstSpic,',',-1);

    }
    //分配变量
    $this->assign('list',$list);
    //加载列表模板
    $this->display('Goods/goodsList');
  }
  //状态(上架/下架)
    public function status(){
      $map = array();
      $map['status'] = $_GET['status'];
      $map['id'] = $_GET['id'];

      $goods = M('goods_info');
      if($goods->save($map)){
        $this->index();
      }else{
        $this->index();
      } 
    }
  /*+--------------------------------------------------------------------------------添加商品
   * 添加商品方法
   * add() : 加载商品基本信息模板
   * addInfo() : 执行添加基本信息
   * gettypes() : 调整类别顺序
   */
   public function add(){
      $type=M("type");
      $list=$type->select();
      $list=$this->gettypes();
      // var_dump($list);
      // var_dump(list[0]['path']);pid=0 (pid=0)=>pid 
      $this->assign('list',$list);
      $this->display("Goods/addInfo");//加载模板
   }

   public function addInfo(){  

      /*上传商品详情图*/
      $upload = new \Think\Upload();// 实例化上传类
      $upload->maxSize = 31457212121218 ;// 设置附件上传大小
      $upload->exts = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
      $upload->rootPath = './Public/Uploads/goods_bpic/';// 设置附件上传目录
      $upload->autoSub = true;//是否具有日期目录
      $info = $upload->upload();//执行上传 取得成功上传的文件信息
      if(!$info){
          $this->error($upload->getError());//输出错误提示
      }else{
        //上传成功 把上传后的商品大图存放在goods_info表中
        foreach($info as $file){
           $savepath = $file['savepath'];
           $savename = $file['savename'];
           //把商品详情的图片名写入在数组中
           $_POST['bpic'][] = $savepath.$savename;
        }
      }
      //把数组中的商品名转化为字符串 并且存储在post数组中
      $_POST['bpic'] = rtrim(implode(',',$_POST['bpic']),',');
      $_POST['add_time'] = time();
      
      $mod = new \Admin\Model\GoodsModel('goods_info');
      if(!$mod->create()){
        $this->error($mod->getError());
      }
 
      // var_dump($mod);exit;
      $insertId = $mod->add($_POST);
      if( $insertId > 0 ){
        //添加成功 加载添加商品版本页面
        $this->addColor($insertId);
      }else{
        //添加失败 输出错误信息
        $this->error($this->getError());
      }
   }

   public function gettypes(){
    $mod=M("type");
    //连贯 类别顺序调整
      $type=$mod->field("*,concat(path,',',id) as paths")->order("paths")->select();
      //遍历
      foreach($type as $key=>$value){
        //获取path
        $path=$value['path'];

        //转换为数组
        $arr=explode(",",$path);
        // echo "<pre>";
        // var_dump($arr);
        //获取数组长度
        $arrlength=count($arr);
        //获取逗号的个数
        $length=$arrlength-1;
        //重复字符串
        $type[$key]['name']=str_repeat('——',$length).$value['name'];

      }
      return $type;
   }  

  /*
   * 添加商品版本,价格,库存
   * addVersion() : 加载添加模板
   * insertVersion() : 执行添加
   * @param insertId 添加商品基本信息后返回过来的goods_id
   */
   public function addVersion($insertId=''){
    // var_dump($_POST);exit;
      $goods_id = isset($_GET['goods_id'])?$_GET['goods_id']:$insertId;
      $this->assign('goods_id',$goods_id);
      $this->display('Goods/addVersion');
   }

   public function insertVersion(){
    //循环取出每一个版本对应的价格和库存 存储到一个新的数组(vp)中
    foreach($_POST['version'] as $k=>$v){
      $vp[$k]['goods_id'] = $_POST['goods_id'];        
      $vp[$k]['version'] = $v;
    }
      foreach($_POST['store'] as $k=>$v){
      $vp[$k]['store'] = $v;
    }
      foreach($_POST['price'] as $k=>$v){
      $vp[$k]['price'] = $v;
    }
    //版本信息入库-->goods_version
    $mod = M('goods_version');
    foreach($vp as $key=>$val){
      $insertId=$mod->add($val);
      
    }
    if($insertId>0){
      //添加成功 加载添加商品颜色的方法
      $this->success('添加成功',U('Goods/index'));
    }else{
      //添加失败 输出错误信息
      $this->display('Goods/addVersion');
    }
   }

  /*
   * 添加商品的颜色,对应的缩略图
   * addColor() : 加载添加模板
   * insertColor() : 执行添加
   * uploadsSpic() : 上传颜色对应的缩率图
   * saveColorName() :从所有上传的缩略途中循环截取一种颜色对应的缩略图,5张以为一组,返回一个缩略图二维数组
   * @param goods_id 添加商品基本信息后返回过来的goods_id
   */
   public function addColor($goods_id){
      //给模板分配变量
      $this->assign('goods_id',$goods_id);
      $this->display('Goods/addColor');
   }

   public function insertColor(){
     //调用上传颜色对应的缩略图方法
     $_POST = $this->uploadsSpic();
     // var_dump($_POST);
     foreach($_POST['spic'] as $val){
      $_POST['spics'][] = rtrim(implode(',',$val),',');
     }

     // var_dump($_POST);

     //用一个数组arr装goods_id color_name spic
     //循环插入颜色表
     foreach($_POST['color_name'] as $key=>$val){
        $arr[$key]['goods_id'] = $_POST['goods_id'];
        $arr[$key]['spic'] = $_POST['spics'][$key];
        $arr[$key]['color_name'] = $val; //红 黄
        
     }
    foreach($arr as $val){
      if($val['spic']==null){
        $this->error('缩略图上传有误，请重新上传');
      }else{
         $mod = M('goods_color');
         $insertId = $mod->add($val);
      }
    }  
    //fldkfj
      if($insertId>0){
         $this->addVersion($_POST['goods_id']);
      }else{
         $this->error($this->getError());
      }
   }
   //上传缩略图
   public function uploadsSpic(){

    $upload = new \Think\Upload();// 实例化上传类
    $upload->maxSize = 31457212121218 ;// 设置附件上传大小
    $upload->exts = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
    $upload->rootPath = './Public/Uploads/goods_spic/';// 设置附件上传目录
    $upload->autoSub = true;//是否具有日期目录
    $info = $upload->upload();//执行上传 取得成功上传的文件信息
    if(!$info){
        $this->error($upload->getError());//输出错误提示
    }else{
       
        foreach($info as $file){
            $savepath=$file['savepath'];
            $savename=$file['savename'];
           //把所有缩略图名存储在一个二维数组中
            $spicName[]=$savepath.$savename;
        }

        //判断上传缩略图的个数是否为5的倍数
        $total=count($info);
        if($total%5==0){
            // var_dump(array_slice($spicName,0,5));
            // var_dump(array_slice($spicName,5,5));
            //把商品颜色对应的图片名存储在goods_color中
            /*调用缩略图切割取出方法*/
            $_POST['spic'] = $this->saveColorName($spicName);
            return $_POST;
        }else{
          //缩略图数量有误 
          foreach($spicName as $key=>$val){
            unlink('./Public/Uploads/goods_spic/'.$val);
          }
          $this->error('缩略图上传有误，请重新上传');
        }
    }
   }

   public function saveColorName($spicName){
      //把一个数组中指定长度的值取出来循环装入新的数组
      $length=count($spicName);
      $num = $length/5;
      $start = 0;
      for($i=1;$i<=$num;$i++){
        $oneColorSpic[]=array_slice($spicName,$start,5);
        $start=5*$i;
      }
      return $oneColorSpic;        
   }
  
  /*+--------------------------------------------------------------------------------删除商品
   *1.删除缩略图 和 商品详情图
   *2.删除 goods_info goods_version goods_color有关该商品的所有信息
   *
   */
  public function delete(){
    //实例化获取要删除商品的信息
    $info = M('goods_info')->where("id={$_GET['id']}")->find();
    $color = M('goods_color')->where("goods_id={$_GET['id']}")->select();
    //把数组中的图片名称分割到数组中
    $info['pic'] = explode(',',$info['bpic']); 
    foreach($color as $key=>$val){
      $color[$key]['pic'] = explode(',',$val['spic']);  
    }
    //删除详情图
    foreach($info['pic'] as $val){
      unlink('./Public/Uploads/goods_bpic/'.$val);
    }
    //删除缩略图
    foreach($color as $val){
      foreach($val['pic'] as $val){
        unlink('./Public/Uploads/goods_spic/'.$val);
      }
    }
    //删除所有表中有关此商品的的信息
     $res[] = M('goods_info')->where("id={$_GET['id']}")->delete();
     $res[] = M('goods_version')->where("goods_id={$_GET['id']}")->delete();
     $res[] = M('goods_color')->where("goods_id={$_GET['id']}")->delete();
     if(array_sum($res)>0){
       $this->success('删除成功',U("Goods/index"));
     }  
  }
   /*+--------------------------------------------------------------------------------修改商品
    *
    *
    */
   //商品详情页面
   public function edit(){
    $type=M("type");
    $list1=$type->select();
    $list1=$this->gettypes();
    $this->assign('list1',$list1);

    $info = M('goods_info')->where("id={$_GET['id']}")->find();
    $version = M('goods_version')->where("goods_id={$_GET['id']}")->select();
    $color = M('goods_color')->where("goods_id={$_GET['id']}")->select();
    //把商品详情图的名字分割在数组中 
    $info['pic'] = explode(',',$info['bpic']);  
    //把缩略图名字分割在数据中
    foreach($color as $key=>$val){
      $color[$key]['pic'] = explode(',',$val['spic']);  
    }
    $this->assign('info',$info);
    $this->assign('version',$version);
    $this->assign('color',$color);
    $this->display('Goods/editGoods');
  }

  // 修改基本信息
  public function editInfo(){
    $type=M("type");
    $list1=$type->select();
    $list1=$this->gettypes();
    $this->assign('list1',$list1);

    $list = M('goods_info')->where("id={$_GET['id']}")->find();
    $this->assign('list',$list);
    //加载修改基本信息模板
    $this->display('Goods/editInfo');
  }
  //执行修改基本信息
  public function updateInfo(){
      $mod = new \Admin\Model\GoodsModel('goods_info');
      if(!$mod->create()){
        $this->error($mod->getError());
      }
     $res = $mod->save($_POST);
     if($res){
      $this->success('修改成功',U("Goods/edit?id={$_POST['id']}"));
     }else{
       $this->error('未做任何修改');
     }
  }
  //修改商品版本信息
  public function editVersion(){

    // var_dump($_GET);
    $list = M('goods_version')->where("goods_id={$_GET['id']}")->select();

    $this->assign('goods_id',$_GET['id']);
    $this->assign('list',$list);
    $this->display("Goods/editVersion");
  }

  //执行修改商品版本信息
  public function updateVersion(){
    foreach($_POST['version'] as $key=>$val){ 
      $arr[$key]['version'] = $val;
      $arr[$key]['id'] = $_POST['id'][$key];
      $arr[$key]['price'] = $_POST['price'][$key];
      $arr[$key]['store'] = $_POST['store'][$key];
    }

    foreach($arr as $key=>$val){
      $res[] = M('goods_version')->save($val);
    }

    if(array_sum($res)>0){
      $this->success('修改成功',U("Goods/edit?id={$_POST['goods_id']}"));
    }else{
      $this->error('尚未做任何修改');
    }
  }
  //删除version
  public function deleteVersion(){
    // var_dump($_GET['id']);
    $res = M('goods_version')->where("id={$_GET['id']}")->delete();
    if($res>0){
      $this->success('删除成功');
    }else{
      $this->error('删除失败');
    }
  }

//修改颜色
  public function editColor(){
    // var_dump($_GET);
    $color=M('goods_color')->where("goods_id={$_GET['id']}")->select();
    foreach($color as $key=>$val){
      $color[$key]['pic'] = explode(',',$val['spic']);  
    }
    $this->assign('goods_id',$_GET['id']);
    $this->assign('color',$color);
    $this->display('Goods/editColor');
  }
  public function updateColor(){
       //调用上传颜色对应的缩略图方法
     $_POST = $this->uploadsSpic();
     // var_dump($_POST);
     foreach($_POST['spic'] as $val){
      $_POST['spics'][] = rtrim(implode(',',$val),',');
     }

     //用一个数组arr装goods_id color_name spic
     //循环插入颜色表
     foreach($_POST['color_name'] as $key=>$val){
        $arr[$key]['goods_id'] = $_POST['goods_id'];
        $arr[$key]['spic'] = $_POST['spics'][$key];
        $arr[$key]['color_name'] = $val; //红 黄
        
     }
    foreach($arr as $val){
      if($val['spic']==null){
        $this->error('缩略图上传有误，请重新上传');
      }else{
         $mod = M('goods_color');
         $insertId = $mod->add($val);
      }
    }  
      if($insertId>0){
         $this->success('添加成功');
      }else{
         $this->error($this->getError());
      }
  }
  //删除缩略图
  public function delSpic(){
    // var_dump($_GET['cid']);
    //先删除图片
    $spic = M('goods_color')->where("id={$_GET['cid']}")->find()['spic'];
    //分割图片名到数组
    $spicArr = explode(',',$spic);

    //删除表中基本信息
    $ret = M('goods_color')->where("id={$_GET['cid']}")->delete();
    if($ret>0){
      //循环取出所有的图片名,删除本地图片
      foreach($spicArr as $val){
        unlink('./Public/Uploads/goods_spic/'.$val);
      }
      $this->success('删除成功');
    }else{
      $this->error('删除失败');
    }
  }
  //修改详情图
  public function editBpic(){
    $info = M('goods_info')->where("id={$_GET['id']}")->find();
    //把商品详情图的名字分割在数组中 
    $info['pic'] = explode(',',$info['bpic']);  
    // var_dump($info);
    $this->assign('info',$info);
    $this->display('Goods/editBpic');
  }
  //删除详情图
  public function delBpic(){
    $ret = M('goods_info')->where("id={$_GET['id']}")->find();
    $bpic = explode(',',$ret['bpic']);  
    //删除本地图片
    $num = count($bpic);
    if($num==1){
      $this->error('至少保留一张商品详情图');
    }else{
      
      foreach($bpic as $k=>$v){
        //如果匹配到 就删除
        if(strcmp($_GET['bname'],$v)== 0){
          unset($bpic[$k]);
          unlink('./Public/Uploads/goods_bpic/'.$bpic[$k]);
        }
      }
      $bpic = implode(",", $bpic);
      $ret['bpic'] = $bpic;
      //更新数据表
      $result=M('goods_info')->save($ret);
      if($result>0){
        $this->success('删除成功');
      }else{
        $this->error('删除失败');
      }
      
    }

  }
  //新增详情图
  public function uploadsBpic(){
    // var_dump($_POST);
    // var_dump($_FILES);
    $upload = new \Think\Upload();// 实例化上传类
    $upload->maxSize = 31457212121218 ;// 设置附件上传大小
    $upload->exts = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
    $upload->rootPath = './Public/Uploads/goods_bpic/';// 设置附件上传目录
    $upload->autoSub = true;//是否具有日期目录
    $info = $upload->upload();//执行上传 取得成功上传的文件信息
    if(!$info){
        $this->error($upload->getError());//输出错误提示
    }else{
   
        foreach($info as $file){
            $savepath=$file['savepath'];
            $savename=$file['savename'];
           //把所有缩略图名存储在一个二维数组中
            $bpicName[]=$savepath.$savename;
        }
    }
    //连接成字符串
    $bpicName = implode(',',$bpicName);
    //把新增的图片追加到商品详情图的名中
    $list = M('goods_info')->where("id={$_POST['id']}")->find();
    $list['bpic'] = $list['bpic'].','.$bpicName;
    //执行更改
    if(M('goods_info')->save($list)){
      $this->success('新增图片成功');
    }else{
      $this->error('新增图片失败');
    }
  }


 
}