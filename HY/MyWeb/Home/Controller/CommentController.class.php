<?php
	//评论管理
    namespace Home\Controller;
    use Think\Controller;
    class CommentController extends Controller {
 /**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/

/***********************显示评论信息开始*******************************/

        public function index(){
        	$mod=M('Goods_comment');
        	 //获取数据总条数
	        $tot=$mod->where("uid={$_SESSION['uid']}")->Count();

	        //实例化分页类
	        $page=new \Think\Page($tot,5);
	        //设置分页
	        $page->setConfig('prev','上一页');
	        $page->setConfig('next','下一页');
	        $page->setConfig('first','首页');
	        $page->setConfig('last','末页');
	        $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
	        // select * from stu limit 12,4
	        //获取结果集
	        $list=$mod->where("uid={$_SESSION['uid']}")->limit($page->firstRow,$page->listRows)->select();
			 $this->assign('pageinfo',$page->show());
        	$this->assign('list',$list);
            $this->display('Comment/index');
        }
/***********************显示评论信息结束*******************************/


/***********************添加评论开始*******************************/
		public function add(){
			// $arr=array();
			$total=count($_POST['star']);
			for($i=0;$i<$total;$i++){
				foreach($_POST as $key=>$value){
						$arr[]=array_slice($value,$i,1);
				}
			}
			// $arr=array_chunk($arr,3);
			foreach($arr as $k=>$v){
				$array[]=$v[0];
			}
			$array=array_chunk($array,4);
			//添加评论
			foreach($array as $key=>$value){
				$data['comment_text']=$value[0];
				$data['comment_star']=$value[1];
				$data['goodsid']=$value[2];
				$data['orderid']=$value[3];
				$data['addtime']=time();
				$data['uid']=$_SESSION['uid'];
				$comment=M('Goods_comment');
				$s=$comment->add($data);
			}
			//修改评论状态
			$ord=M('Orders');
			$arra=array('comment'=>1);
			$ord->where("id={$data['orderid']}")->save($arra);
			if($s){
				$this->success('评论成功');
			}else{
				$this->error('评论失败');
			}

		}
/***********************添加评论结束*******************************/

    }
?>