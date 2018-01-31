<?php
namespace Admin\Model;
use Think\Model;
class TypeModel extends Model {

	//自动验证操作规则
	protected $_validate = array(
		// name 验证字段 require 规则 必须  验证码必须 提示信息
	     array('name','require','分类名不能为空！'), 
	     array('name','/^.{2,22}$/','分类名必须为2-22字节'), 
	     //正则
	     //0 可选参数 存在字段 验证操作   unique 唯一 可选参数  1 验证时间 (在新增数据的时候 验证操作) 
	     // array('name','','该分类已存在',0,'unique',1),//唯一
	    
	 );


	
} 	
 ?>