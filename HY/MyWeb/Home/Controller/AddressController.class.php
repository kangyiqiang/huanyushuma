<?php
	//地址管理
    namespace Home\Controller;
    use Think\Controller;
    class AddressController extends AllowController {
/**********************************防止地址栏非法操作开始*******************************/
 public function _empty(){
         session_destroy();
         $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
      }
/*********************************防止地址栏非法操作结束********************************/


/***********************显示地址信息开始*******************************/

        public function index(){
            $mod=M('Address');
            $list=$mod->where("uid={$_SESSION['uid']}")->select();
            $total=$mod->where("uid={$_SESSION['uid']}")->count();
            $this->assign('list',$list);
            $this->assign('total',$total);
            // var_dump($list);exit;
            $this->display('Address/index');
        }
/***********************显示地址信息结束*******************************/




/***********************添加地址开始*******************************/

        public function add(){
        	$this->display('Address/add');
        }
        public function insert(){
            $mod=M('Address');
                //此地址为默认地址
            if($_POST['status']==1){
                //将该地址之外的所有状态改为0
                $arr=array('status'=>'0');
                $mod->where("uid={$_POST['uid']}")->save($arr);
                //添加地址
                if($mod->add($_POST)){
                        $this->success('添加成功');
                }else{
                    $this->error('添加失败');
                }
            }else{
                //添加不是默认的地址
                $_POST['status']=0;
                // var_dump($data);
                if($mod->add($_POST)){
                    $this->success('添加成功');
                }else{
                    $this->error('添加失败');
                }
            }

        }
/***********************添加地址结束*******************************/

/***********************删除地址结束*******************************/
        public function delete(){
            $id=I('get.id');
            // var_dump($id);
            $mod=M('Address');
            $s=$mod->where("id={$id}")->delete();
            if($s){
                $this->success('删除成功',U('Address/index'));
            }else{
                $this->error('删除失败',U('Address/index'));
            }
        }
/***********************删除地址结束*******************************/


/***********************修改地址开始*******************************/
        public function edit(){
            $id=I('get.id');
            // var_dump($id);
            $mod=M('Address');
            $row=$mod->where("id={$id}")->find();
            //没有查询到数据,跳转
            if(!$row){
                $this->success('非法操作',U('Address/index'));
                exit;
            }else{
                $this->assign('row',$row);
                $this->display('Address/edit');
            }
        }
        public function update(){
            // var_dump($_POST);exit;
            $mod=M('address');
            if($_POST['status']=='1'){
                //设置了默认地址
                //将该地址之外的所有状态改为0
                $arr=array('status'=>'0');
                $mod->where("uid={$_POST['uid']}")->save($arr);
                //修改地址
                if($mod->save($_POST)){
                        $this->success('修改成功',U('Address/index'));
                }else{
                    $this->error('修改失败',U("Address/edit?id={$_POST['id']}"));
                }
            }else{
                //没有设置默认地址
                if($mod->save($_POST)){
                    $this->success('修改成功',U('Address/index'));
                 }else{
                    $this->error('修改失败',U("Address/edit?id={$_POST['id']}"));
                }    
            }
            
        }
/***********************修改地址结束*******************************/


    }
?>