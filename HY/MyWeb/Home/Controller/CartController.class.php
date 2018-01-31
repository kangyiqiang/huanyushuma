<?php 
namespace Home\Controller;
use Think\Controller;

class CartController extends Controller{
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/********************************添加到购物车操作开始**************************************/
	public function add(){

		//组装商品信息
		//商品 单价 数量 小计 图片操作
    $vid = I("get.vid");
    if(!$vid || !isset($vid)){
        $this->error("请选择指定版本",U("Goods/index"));
        exit;
    }

		$condition = M('goods_version')->field('goods_id')->where("id={$vid}")->find();

    $info = M('goods_info as i')->field('i.goods_name as gname,i.id as goods_id,v.version as vname,v.price,v.store,i.sale,v.id as vid')->join("goods_version as v on i.id=v.goods_id")->where("v.id={$vid}")->find();

		$info['spic'] = M('goods_info as i')->join('goods_color as c on i.id=c.goods_id')->where("c.id={$_GET['cid']}")->find()['spic']; 


		$info['spic']=explode(',',$info['spic'])[0];
    

		$info['cname'] = M('goods_info as i')->join('goods_color as c on i.id=c.goods_id')->where("c.id={$_GET['cid']}")->find()['color_name']; 
		
		//购买数量
		$info['gnum']=$_GET['gnum'];

    //用户id
    $info['userid'] = $_SESSION['userid'];

		//获取当前商品的库存数据
    $ver = M('goods_version');
  	$ret = $ver->find($vid);
    //判断购买数量是否合法
  	if($info['gnum']>$ret['store']){
  		$this->error("购买数量输入有误",U("Goods/product?version_id={$vid}"));
      exit;
  	}

    //减去相应的库存
    $ret['store'] -= $info['gnum'];
    $ver->where("id=".$vid)->save($ret);

    //实例化购物车表
    $cart = M("cart");

    //判断此商品是否在购物车里具有一模一样的
    $resu = $cart->where("vid='{$info["vid"]}' AND cname='{$info["cname"]}' AND gname='{$info["gname"]}' AND userid={$_SESSION['userid']}")->find();
    if($resu){
        //执行同个商品数量修改 达到添加
        $arr['id'] = $resu['id'];
        $arr['vid'] = $resu['vid'];
        $arr['gnum'] = $resu['gnum'] + $info['gnum'];
        $_SESSION['cart'][$resu['vid']]['gnum'] = $arr['gnum'];
        $res = $cart->save($arr);
    }else{
       //执行添加
        $_SESSION['cart'][$info['vid']]['price'] = $info['price'];
        $_SESSION['cart'][$info['vid']]['gnum'] = $info['gnum'];
        $_SESSION['cart'][$info['vid']]['vid'] = $info['vid'];
        $_SESSION['cart'][$info['vid']]['spic'] = $info['spic'];
        $_SESSION['cart'][$info['vid']]['gname'] = $info['gname'];
        $res = $cart->add($info);
    }
    if($res>0){
        $this->success("添加购物车成功",U("Cart/cart"));
    }else{
        $this->error("添加失败",U("Goods/product?version_id={$vid}"));
    }
	
	}
/********************************添加到购物车操作结束**************************************/

/********************************显示购物车页面开始****************************************/
      public function cart(){
          //查询该Id下购物车所有数据
          $cart = M("cart");
          $list = $cart->where("userid={$_SESSION['userid']}")->select();
          // var_dump($list);
          //分配数据 加载模板
          if(!empty($list)){
            $this->assign("list",$list);
            $this->display("Cart/cart");
          }else{
            $this->display("Cart/index");
          }
      }
/********************************显示购物车页面结束***************************************/

/********************************删除功能开始********************************************/
      //删除单条数据
      public function delete(){
          $id = I('get.id');
          $vid = I('get.vid');
    
          //返还库存
          $v = M("goods_version");
          $re = $v->where("id=".$vid)->find();
          $cart = M("cart")->where("id=".$id)->find();
          $re['store'] += $cart['gnum'];
          $v->where('id='.$vid)->save($re); 
          //实例化
          $mod = M("cart");
          $res = $mod->where("id=".$id)->delete();
          if($res){
            unset($_SESSION['cart'][$vid]);
            $this->error("删除成功",U("Cart/cart"));  
          }else{
            $this->error("删除失败",U("Cart/cart"));           
          }
      }

      //清空购物车
      public function deleteAll(){
          $userid = $_SESSION['userid'];
          $mod = M('cart');
          //返回所有购物车商品库存
          $version = M('goods_version');
          $res = $mod->where("userid={$userid}")->select();
          foreach($res as $k=>$v){
              $arr = $version->where("id={$v['vid']}")->find();
              $arr['store'] += $v['gnum'];
              $version->where("id={$v['vid']}")->save($arr);
          }

          if($mod->where("userid={$userid}")->delete()){
            unset($_SESSION['cart']);
            $this->success("清空购物车成功",U("Cart/cart"));
          }else{
            $this->error("清空购物车失败",U("Cart/cart"));
          }
      }
/********************************删除功能结束**********************************************/

/********************************修改数量开始**********************************************/
      public function upNum(){
        $arr['gnum'] =  $_GET['va'];
        $arr['id']   =  $_GET['id'];
        $vid = $_GET['vid'];
        $_SESSION['cart'][$vid]['gnum'] = $arr['gnum'];
        M("cart")->save($arr); 
        //修改对应商品的库存
        $version = M('goods_version');
        $res = $version->where('id='.$vid)->find();
        //判断是增还是减
        if($_GET['fang']== '1'){
             $res['store'] += 1;
        }elseif($_GET['fang']== '2'){
             $res['store'] -= 1;
        }
        $version->where('id='.$vid)->save($res);
      }
/********************************修改数量结束**********************************************/

/********************************显示结算页面开始******************************************/
      public function balance(){
          if($_POST){
              $_SESSION['balance']=$_POST;
          }
          // var_dump($_SESSION);exit;
        $mod = M('Cart');
        //判断是否是全选
         //查询地址信息
         $address = M('Address');
         //默认地址
         $address_default = $address->where("status=1 AND uid={$_SESSION['userid']}")->find();
         //非默认地址
         $address_nodefault = $address->where("status=0 AND uid={$_SESSION['userid']}")->select();
         $this->assign('address_default',$address_default);
         $this->assign('address_nodefault',$address_nodefault);
        if(array_key_exists('toggle-checkboxes',$_SESSION['balance'])){
           //全选操作
          $list = $mod->where("userid={$_SESSION['userid']}")->select();
        }else{
          //没有全选操作
          //将购物车的id号用逗号连接
          $checkItem = implode(',',$_SESSION['balance']['checkItem']);
          //查询选中的购物车信息
         $list = $mod->where("id in({$checkItem}) and userid={$_SESSION['userid']}")->select();
        }
         $this->assign('list',$list);
         $this->display('Orders/balance');
      }
/********************************显示结算页面结束******************************************/

/********************************立即购买开始*********************************************/
  public function nowBuy(){
    $vid = I("get.vid");
    if(!$vid || !isset($vid)){
        $this->error("请选择指定版本",U("Goods/index"));
        exit;
    }

    $condition = M('goods_version')->field('goods_id')->where("id={$vid}")->find();

    $info = M('goods_info as i')->field('i.goods_name as gname,i.id as goods_id,v.version as vname,v.price,v.store,i.sale,v.id as vid')->join("goods_version as v on i.id=v.goods_id")->where("v.id={$vid}")->find();

    $info['spic'] = M('goods_info as i')->join('goods_color as c on i.id=c.goods_id')->where("c.id={$_GET['cid']}")->find()['spic']; 


    $info['spic']=explode(',',$info['spic'])[0];
    

    $info['cname'] = M('goods_info as i')->join('goods_color as c on i.id=c.goods_id')->where("c.id={$_GET['cid']}")->find()['color_name']; 
    
    //购买数量
    $info['gnum']=$_GET['gnum'];

    //用户id
    $info['userid'] = $_SESSION['userid'];
    //获取当前商品的库存数据
    $ver = M('goods_version');
    $ret = $ver->find($vid);
   
    //判断购买数量是否合法
    if($info['gnum']>$ret['store']){
      $this->error("购买数量输入有误",U("Goods/product?version_id={$vid}"));
      exit;
    }
    //减去相应的库存
    $ret['store'] -= $info['gnum'];
    $ver->where("id=".$vid)->save($ret);

    // //实例化购物车表
    $cart = M("cart");
    // 
    $condition = M('goods_version')->field('goods_id')->where("id={$vid}")->find();

          //查询地址信息
         $address = M('Address');
         //默认地址
         $address_default = $address->where("status=1 AND uid={$_SESSION['userid']}")->find();
         //非默认地址
         $address_nodefault = $address->where("status=0 AND uid={$_SESSION['userid']}")->select();
         $this->assign('address_default',$address_default);
         $this->assign('address_nodefault',$address_nodefault);
         $list[0] = $info;
         $this->assign('list',$list);
         // var_dump($list);
         $this->display('Orders/balance');        

  }
/********************************立即购买结束********************************************/



/********************************设置默认地址开始******************************************/
      public function address(){
        $id=I('get.id');
        // 将该用户的所有的地址status改为0
        $mod=M('Address');
        //判断有无默认收货地址
        // $res = $mod->where("uid={$_SESSION['userid']} AND status=1")->find();
        // if(!$res){
        //   //没有默认收货地址 设置
        //   $mod->where("id={$id}")
        // }

        $array=array('status'=>0);
        $mod->where("uid={$_SESSION['userid']}")->save($array);
        //再将该地址status = 1
        $arr=array('status'=>1);
        if($mod->where("id={$id}")->save($arr)){
            $this->success('选择地址成功');
        }else{
            $this->error('选择地址失败');
        }
      
      }
/********************************设置默认地址结束******************************************/


}








