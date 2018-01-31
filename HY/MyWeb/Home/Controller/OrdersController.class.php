<?php
	//订单管理
    namespace Home\Controller;
    use Think\Controller;
    class OrdersController extends AllowController {
 /**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/***********************显示订单信息开始*******************************/

        public function index(){
	        $ord = M('orders');
	        $uid = $_SESSION['uid'];
    		//条件数组
    		$arr = array();
        	if(isset($_GET['where'])){
	       		 $where = I('get.where');
	        	//全部订单 代付款  待发货  待收货 已完成 待评价
	        	switch ($where) {
	        		case '0':
	        			$status = "0";
			        	$arr['status'] = $status;	        			
	        		break;
	        		case '1':
	        			$status = "1";
			        	$arr['status'] = $status;	        			
	        		break;
	        		case '2':
	        			$status = "2";
			        	$arr['status'] = $status;	        			
	        		break;
	        		case '3':
	        			$status = "3";
			        	$arr['status'] = $status;	        			
	        		break;
	        		case '9':
		        		$arr['cancel'] = '1';
	        		break;
	        	}
        	}

	        $arr['uid'] = $uid;
	        //获取数据总条数
			 $tot=$ord->where($arr)->Count();
			 //实例化分页类
			 $page=new \Think\Page($tot,2);
			 //设置分页
			 $page->setConfig('prev','上一页');
			 $page->setConfig('next','下一页');
			 $page->setConfig('first','首页');
			 $page->setConfig('last','末页');
			 $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
    		 $orders=$ord->where($arr)->limit($page->firstRow,$page->listRows)->select();
        	 // var_dump($orders);
       		 $this->assign('pageinfo',$page->show());
        	 $this->assign('orders',$orders);
             $this->display('Orders/index');
        }
/***********************显示订单信息结束*******************************/


/***************************添加订单开始*************************************/
		public function add(){
			// var_dump($_SESSION);
			// var_dump($_POST);
			// exit;
			$str = implode(',',$_POST['id']);
			//查询结算的商品
			$cart=M('Cart');
			$carts=$cart->where("id in($str)")->select();
			$total=0;
			if(is_array($carts)){
				foreach($carts as $k=>$v){
					$total+=$v['gnum']*$v['price'];
					unset($_SESSION['cart'][$v['vid']]);
				}
			}else{
				unset($_SESSION['cart'][$carts['vid']]);
			}
			
			//查询地址信息
			$address = M('Address');
			$ads = $address->where("status=1")->find();
			// var_dump($carts);
			//添加订单
			$data['uid'] = $_SESSION['uid'];
			$data['name'] = $ads['name'];
			$data['phone'] = $ads['phone'];
			$data['address'] = $ads['address_province'].' '.$ads['address_city'].$ads['address_area'].$ads['address_text'];
			$data['ordernum'] = $orderid = date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);
			$data['total'] = $total;
			$data['ordertime'] = time();
			$data['status'] = 0;
			$data['cancel'] = 0;
			$orders = M('Orders');
			$s = $orders->add($data);
			if($s){
				$order_goods=M('Orders_goods');
				//添加成功后,添加订单商品表,$s为订单商品的orderid
				foreach($carts as $key=>$val){
					$arr['orderid'] = $s;
					$arr['gname'] = $val['gname'];
					$arr['vname'] = $val['vname'];
					$arr['cname'] = $val['cname'];
					$arr['sale'] = $val['sale'];
					$arr['pic'] = $val['spic'];
					$arr['price'] = $val['price'];
					$arr['gnum'] = $val['gnum'];
					$arr['goods_id'] = $val['goods_id'];
					$order_goods->add($arr);
				}
					//删除结算的session
					unset($_SESSION['balance']);

					//删除购物车商品
					$cart->where("id in($str)")->delete();
					$this->success('订单提交成功',U('Orders/index'));
			}else{
				$this->error('订单提交失败',U('Cart/balance'));
			}


		}
/***************************添加订单结束*************************************/

/***************************订单详情开始*************************************/
		public function info(){
			$id=I('get.id');
			$ord = M('Orders');
			$info = $ord->where("id={$id}")->find();
			$ord_g = M('Orders_goods');
			$rows = $ord_g->where("orderid={$id}")->select();
			$this->assign('info',$info);
			$this->assign('rows',$rows);
			// var_dump($orders);
			// var_dump($order_goods);
			$this->display('Orders/info');
		}
/***************************订单详情结束*************************************/


/***************************取消订单开始*************************************/
		public function close(){
			$id=I('get.id');
			$mod = M('Orders');
			$arr = array('cancel'=>1);
			$s = $mod->where("id={$id}")->save($arr);
			if($s){
				$this->success('取消订单成功');
			}else{
				$this->error('取消订单失败');
			}
		}
/***************************取消订单结束*************************************/


/***************************付款开始*************************************/
		public function pay(){
			$id = I('get.id');
			$mod = M('Orders');
			$arr = array('status'=>1);
			$s = $mod->where("id={$id}")->save($arr);
			if($s){
				$this->success('付款成功');
			}else{
				$this->error('付款失败');
			}
		}
/**************************付款结束*************************************/



/**************************收货开始*************************************/
		public function receive(){
			$id = I('get.id');
			$mod = M('Orders');
			$arr = array('status'=>3);
			$s = $mod->where("id={$id}")->save($arr);
			if($s){
				$this->success('收货成功');
			}else{
				$this->error('收货失败');
			}
		}
/***************************收货结束*************************************/



	

    }
?>