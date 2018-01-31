<?php
namespace Admin\Model;
use Think\Model;
class InfoModel extends Model {

	//自动验证操作规则
	protected $_validate = array(
		// name 验证字段 require 规则 必须  验证码必须 提示信息
	     array('name','require','姓名不能为空！'), 
	       //年龄
	     array('age','require','年龄不能为空'),
	     //callback 函数规则 回调方法
	     array('age','checkAge','年龄非法赋值',0,'callback'),//年龄自定义函数规则
	     array('address','require','请填写地址'),
	     array('score','require','积分不能为空'),
	     array('score','number','积分赋值非法'),
	     array('hobby','require','请填写爱好'),
	 );



	 //自定义的函数
	function checkAge($age){
		if($age<0||$age>300){
			return false;
		}else{
			return true;
		}
	}
	
} 	
 ?>