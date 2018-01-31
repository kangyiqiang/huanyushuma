<?php
namespace Admin\Controller;
use Think\Controller;
class TypeController extends AllowController {
	
/********************************调整类别顺序开始*************************************/
   public function gettypes(){
		$mod=D("Type");
		//连贯 类别顺序调整
	   	$type=$mod->field("*,concat(path,',',id) as paths")->order("paths")->select();
	   	//遍历
	   	foreach($type as $key=>$value){
	   		//获取path
	   		$path=$value['path'];
	
	   		//转换为数组
	   		$arr=explode(",",$path);
	  
	   		//获取数组长度
	   		$arrlength=count($arr);

	   		//获取逗号的个数
	   		$length=$arrlength-1;
        
	   		//重复字符串
	   		$type[$key]['name']=str_repeat('——',$length).$value['name'];

	   	}
	   	return $type;
   }  
/********************************调整类别顺序结束************************************/

/********************************添加分类开始****************************************/
  //加载添加模板
   public function add(){
   		//实例化Model
   		$type=D("Type");
   		// $list=$type->select();
   		$list=$this->gettypes();
   		$this->assign('list',$list);
      //加载模板
      $this->display("Type/add");
   }

   //执行添加
   public function insert(){
    //实例化
    $mod = D("Type");
    //获取pid
    $pid=I("post.pid");
    //获取是否显示
    $display = I("post.display");
 
    if($pid==0){
      //如果添加的是顶级分类
      $_POST['path']='0';
      //判断顶级分类是否超过7个
      $count = $mod->where("path='0'")->count();
      if($count==7){
        $this->error("超出同级分类个数限制",U("Type/add"));
        exit;
      }
    }else{
      //如果添加的不是顶级分类       
      $s=$mod->where("id=$pid")->select();
      //拼接path
      $_POST['path']=$s[0]['path'].",".$s[0]['id'];
      $path = $_POST['path'];
      //判断分类是否超出6个
      $count = $mod->where("path='{$path}'")->count();
      if($count==6){
        $this->error("超出同级分类个数限制",U("Type/add"));
        exit;
      }
      //判断是否添加的是四级以下分类
      $array = explode(",",$path);
      if(count($array)==4){
        $this->error("不支持显示第四级分类",U("Type/add"));
        exit;
      }

    }

    //执行数据库的插入操作
    if(!$mod->create()){
      $this->error($mod->getError());
    }
    if($mod->add()){
      // echo "1111";
      $this->success("添加成功",U("Type/index"));
    }else{
      // echo "0000";
      $this->error("添加失败",U("Type/add"));
    }
    
   }
/********************************添加分类结束****************************************/

/********************************修改分类开始****************************************/
   //加载修改模板
   public function edit(){
      //获取id
      $id = I("get.id");
      //实例化Model
      $type=D("Type");
      // $list=$type->select();
      $result=$type->where("id=".$id)->find();
      $this->assign('result',$result);
        //加载模板
        $this->display("Type/edit");
   }
   //执行修改
   public function update(){
    // var_dump($_POST);EXIT;
      //获取id
      $id = array_pop($_POST);
      //实例化
      $type = D('Type');
      if(!$type->create()){
        $this->error($type->getError());
      }
      //执行修改
      if($type->where("id=".$id)->save($_POST)){
          $this->success("修改成功！",U("Type/index"));
      }else{
          $this->success("修改失败！",U("Type/index"));        
      }
   }
/********************************修改分类结束****************************************/

/********************************显示分类列表开始*************************************/
   //第一次使用的列表页 
   public function index($pid=0){
      $id = I('get.pid');
      //实例化
     	$mod=D("Type");
     	//连贯 类别顺序调整
     	$type=$mod->field("*,concat(path,',',id) as paths")->where("pid=".$pid)->order("paths")->select();
     	$this->assign('type',$type);
     	$this->display("Type/index");
   }

   //后面使用的列表页
   public function index3($pid=0){
      $id = I('get.pid');
      //实例化
      $mod=D("Type");
      //根据id查询pid
      $re= $mod->field("pid")->where("id=".$id)->find();
      $oldPid = $re['pid'];

      //连贯查询 类别顺序调整
      $type=$mod->field("*,concat(path,',',id) as paths")->where("pid=".$pid)->order("paths")->select();

      //判断该分类下是否存在子分类
      if(empty($type)){
        $this->error("此分类下暂无子分类",U("Type/index","pid={$oldPid}"));
        exit;
      }

      $this->assign('type',$type);
      $this->display("Type/index");
   }
/********************************显示分类列表结束*************************************/

/********************************查看上级分类开始*************************************/
   //列表页 默认显示顶级分类
   public function index2($path=0){
    $p = strrchr($path,",");
    $newPath = str_replace($p, "", $path);
    // var_dump($newPath);exit;
    //实例化
    $mod=D("Type");
    //连贯 类别顺序调整
    $type=$mod->field("*,concat(path,',',id) as paths")->where("path='".$newPath."'")->order("paths")->select();
    // echo $mod->getLastSql();
    // exit;

    $this->assign('type',$type);
    $this->display("Type/index");
   }
/********************************查看上级分类结束*************************************/

/********************************删除分类开始***************************************/
   //执行删除
   public function delete(){
   		//获取id
   		$id=I("get.id");
   		//判断当前类别下是否有子类信息
   		$mod=D("Type");
   		$s=$mod->where("pid=$id")->Count();

   		if($s>0){
     			//含有子类不能删除
     			$this->error("不能删除含有子类的分类",U("Type/index"));
     			exit;
   		}else{
            //判断当前分类下是否含有商品
            $goods = D("goods_info");
            $r = $goods->where("type_id={$id}")->select();
            if($r>0){
              //含有商品不能删除
                $this->error("该分类下含有商品不能删除",U("Type/index"));
                exit;
            }else{
                //执行删除当前类别
                if($mod->where("id={$id}")->delete($id)){
                  $this->success("删除成功",U("Type/index"));
                }else{
                  $this->error("删除失败",U("Type/index"));
                }
            }   			
   		}
   }
/********************************删除分类结束***************************************/

  
}