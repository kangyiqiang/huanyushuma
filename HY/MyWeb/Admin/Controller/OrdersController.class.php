<?php 
	//后台订单控制类
	namespace Admin\Controller;
	use Think\Controller;
	
	class OrdersController extends AllowController{
/******************************查询未完成订单列表开始***********************************/
		public function index(){
			$mod=M('orders');
			$list=$mod->where("status<>3")->select();
			//定义订单状态的数组
			$arr=array('未支付','待发货','已发货','交易完成');
			$this->assign('arr',$arr);
			$this->assign('list',$list);
			$this->display('Orders/index');

		}
/******************************查询未完成订单列表结束***********************************/


/******************************查询交易完成订单列表结束***********************************/
		public function index1(){
			$mod=M('orders');
			$list=$mod->where("status=3")->select();
			//定义订单状态的数组
			$arr=array('未支付','待发货','已发货','交易完成');
			$this->assign('arr',$arr);
			$this->assign('list',$list);
			$this->display('Orders/index');
		}


/******************************查询交易完成订单列表结束***********************************/



/*************************************订单详情开始***********************************/
		public function info(){
			$id=$_GET['id'];
			$mod=M('orders');
			$row=$mod->where("id={$id}")->find();
			$ord_gs=M('orders_goods');
			$list=$ord_gs->where("orderid={$id}")->select();
			//定义订单状态的数组
			$arr=array('未支付','待发货','已发货','交易完成');
			$this->assign('arr',$arr);
			$this->assign('list',$list);
			$this->assign('row',$row);
			$this->display('Orders/info');
		}
/*************************************订单详情结束***********************************/




/**********************************点击发货方法开始**********************************/
		public function send(){
			$mod=M('orders');
			$id=I('get.id');
			$cancel=I('get.cancel');
			$status=I('get.status');
			if($cancel=='1'){
				$this->error('用户已取消订单');
				exit;
			}
			switch($status){
				case '0':
					$this->error('请在用户付款后进行发货!');
					break;
				case '1':
					//发货
					$arr=array('status'=>2);
					$s=$mod->where("id={$id}")->save($arr);
					if($s){
						$this->success('发货成功');
					}else{
						$this->error('发货失败');
					}
					break;
				case '2':
					$this->error('已经发货');
					break;
				case '3':
					$this->error('交易已经完成');
					break;
			}
		}
/**************************************点击发货方法结束**************************************/




/*****************************************删除订单开始************************************/
		public function delete(){
			$id=$_GET['id'];
			$mod=M('orders');
			$s=$mod->where("id={$id}")->delete();
			if($s){
				$this->success('删除成功',U('orders/index'));
			}else{
				$this->error('删除失败',U('orders/index'));
			}
		}
/*****************************************删除订单的结束************************************/

	}
 ?>