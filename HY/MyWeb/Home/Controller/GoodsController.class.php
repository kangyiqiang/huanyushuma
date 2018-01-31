<?php 
namespace Home\Controller;
use Think\Controller;

class GoodsController extends Controller {
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

	/**********************************商品主页-Start************************************/
	public function index(){
		//接收到父类id
		$type = M('type')->where("id={$_GET['type']}")->select();	
        //所有父分类下的子类添加到父分类中second字段组成一个新的数组
        foreach($type as $k=>$v){
            $type[$k]['second']=M('type')->where("pid={$v['id']}")->select();
        }
        foreach($type[0]['second'] as $k=>$v){
        	$type[0]['second'][$k]['third']=M('type')->where("pid={$v['id']}")->select();
        }
        //查询三类数据
        if($type[0]['second']==null){
        	$type= $_GET['type'];
        	if($type==''){
        		$type='';
        	}else{
        		$type="and type_id in ({$type})";	
        	}

        }else{
	        //循环获取每一个一级分类下的所有商品(取前4个)
	        $str = '';
	        //获取父类三级子类id，连接成字符串
	        foreach($type[0]['second'] as $k=>$v){
	        	foreach($v['third'] as $k=>$v){
	            	$str .= $v['id'].',';
	        	}
	        }
	        $str = rtrim($str,',');
	        $type = empty($str)?"":"and type_id in ({$str})";
        	
        }
		//价格排序
		if(!empty($_GET['price'])){
			$order = 'v.price desc';
		}
		//时间排序
		if(!empty($_GET['time'])){
			$order = 'add_time desc';
		}
		//重量排序
		if(!empty($_GET['weight'])){
			$order = 'weight asc';
		}
		//搜索
		$sear = $_GET['search'];
		if($sear==''){
			$search='';
		}else{
			$search = "and goods_name like '%{$sear}%'";	
		}
		//间接获取分页数量
	   $list=M('goods_info')->field('id,goods_name,type_id,sale')->where("status=1 {$search} {$type}")->select();
	   	//搜索的数量
		$num = count($list);
	   // 实例化分页类
	    $page=new \Think\Page($num,16);
	    //设置分页
	    $page->setConfig('prev','上一页');
	    $page->setConfig('next','下一页');
	    $page->setConfig('first','首页');
	    $page->setConfig('last','末页');
	    $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
   		 //组装分页
	    $this->assign('pageinfo',$page->show());
	    if($page->totalPages==null){$page->totalPages=1;};
	    $this->assign('totalPages',$page->totalPages); 
		//加分页
		$list=M("goods_info as i")->field('i.id,i.goods_name,i.type_id,i.sale,v.price,v.id as version_id,.
			c.spic')->join('goods_version as v on i.id=v.goods_id')->join('goods_color as c on i.id=c.goods_id')->group('i.id')->order($order)->where("status=1 {$search} {$type}")->limit($page->firstRow,$page->listRows)->select();
		//图片+版本+价格
		foreach($list as $k=>$v){
			$condition['goods_id'] = $v['id'];
		    $list[$k]['spic']=explode(',',$v['spic']);
		    $list[$k]['version']=M('goods_version')->field('version')->where($condition)->select();		
		}
		//精品推荐
		$ret = M("goods_info as i")->field('i.id,i.goods_name,i.type_id,i.sale,v.price,v.id as version_id,.
			c.spic')->join('goods_version as v on i.id=v.goods_id')->join('goods_color as c on i.id=c.goods_id')->order($order)->where("status=1")->select();
		foreach($ret as $k=>$v){
			$condition['goods_id'] = $v['id'];
		    $ret[$k]['spic']=explode(',',$v['spic']);
		    $ret[$k]['version']=M('goods_version')->field('version')->where($condition)->select();		
		}
		shuffle($ret);
		$jinp = array_slice($ret,0,6);
		$this->assign('list',$list);
		$this->assign('jinp',$jinp);
		//搜索的值 和结果数量
		$this->assign('val',$sear);
		$this->assign('num',$num);
		$this->display('Goods/index');
	}
  
	/*********************************商品主页-End***************************************/
	public function product(){
		if(!IS_AJAX){
			//判断是否正常获取商品版本id
			if(!isset($_GET['version_id'])){
				session_destroy();
				$this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
				exit;
			}
			$vid = $_GET['version_id'];
			$test = M("goods_version")->where("id={$vid}")->find();
			if(!$test){
				session_destroy();
				$this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
				exit;
			}		
		}
		

		if(!IS_AJAX){
			//显示价格
			$res = M('goods_version')->where("id={$_GET['version_id']}")->find();
			//商品id
			$condition['goods_id']=$res['goods_id'];
			//商品名
			$list = M('goods_info')->where("id={$res['goods_id']}")->find();
			//颜色
			$color = M('goods_color')->where($condition)->select();
			//规格
			$version = M('goods_version')->where($condition)->select();
			//默认缩略图
			$spic= explode(',',$color[0]['spic']);
			//详情图
			$bpic= explode(',',$list['bpic']);
			

			//猜你喜欢   
			$guess = M('goods_info')->group('goods_id')->field('goods_info.id as goods_id,goods_version.id as vid,goods_version.version as vname,goods_color.spic,goods_version.price as price')->join('goods_version on goods_info.id=goods_version.goods_id')->join('goods_color on goods_info.id=goods_color.goods_id')->limit(5)->select();
			foreach($guess as $k=>$v){
				$guess[$k]['spic']=explode(',',$v['spic'])[0];
			}
			// var_dump($version);
			$this->assign('list',$list);
			$this->assign('spic',$spic);
			$this->assign('bpic',$bpic);
			$this->assign('res',$res);
			$this->assign("color",$color);
			$this->assign("version",$version);
			$this->assign('guess',$guess);
			$this->display('Goods/product');	
		}

		//颜色改变缩略图
		$cid = $_GET['cid'];
		$spic = M('goods_color')->where("id={$cid}")->find();
		echo json_encode($spic);

	}
	public function changeVersion(){
		// var_dump($_GET);
		// 版本改变价格
		$vid = $_GET['vid'];		
		$price = M('goods_version')->where("id={$vid}")->find();	
		echo json_encode($price);
	}
	public function minus(){
		//获取id
    	$id=$_GET['id'];
    	$n=$_GET['n'];
    	$_SESSION['s'][$id]['num']= $n;
    	//让session里的数量做减一
    	$_SESSION['s'][$id]['num']-=1;
    	// //判断
    	if($_SESSION['s'][$id]['num']<1){
    		$_SESSION['s'][$id]['num']=1;
    	}

    	echo json_encode($_SESSION['s'][$id]);	
	}
	public function plus(){
		//获取id
    	$id=$_GET['id'];
    	$n=$_GET['n'];

    	$_SESSION['s'][$id]['num']= $n;
    	//让session里的数量做减一
    	$_SESSION['s'][$id]['num']+=1;
    	// //判断
    	//获取当前商品的库存数据
    	$info = M('goods_version')->find($id);
    	if($_SESSION['s'][$id]['num']>$info['store']){
    		$_SESSION['s'][$id]['num']=$info['store'];
    	}

    	echo json_encode($_SESSION['s'][$id]);	
	}


 }
 ?>