<?php
namespace Admin\Model;
use Think\Model;
class UserModel extends Model {

	//自动验证操作规则
	protected $_validate = array(
		// name 验证字段 require 规则 必须  验证码必须 提示信息
	     array('username','require','用户名不能为空！'), //用户名不能为空
	     array('username','/^\w{4,16}$/','用户名必须为4-16位的任意的数字字母下划线'), //用户名正则
	     //0 可选参数 存在字段 验证操作   unique 唯一 可选参数  1 验证时间 (在新增数据的时候 验证操作) 
	     array('username','','用户名已经存在',0,'unique',1),//用户名唯一


	     array('password','require','密码不能为空！'), //密码不能为空
	     array('password','/^\w{4,16}$/','密码必须为4-16位的任意的数字字母下划线'), //密码正则
	     //两次密码一致
	     // array('repass','pass','两次密码不一致',0,'confirm'),

	     // name 验证字段 require 规则 必须  验证码必须 提示信息
	     array('email','require','邮箱不能为空！'), //邮箱不能为空
	     // 123@qq.com
	     array('email','/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/','邮箱格式有误'), //邮箱正则
	     //0 可选参数 存在字段 验证操作   unique 唯一 可选参数  1 验证时间 (在新增数据的时候 验证操作) 
	     array('email','','邮箱已经存在',0,'unique',1),//邮箱唯一
	      // name 验证字段 require 规则 必须  验证码必须 提示信息
	     array('phone','require','手机号不能为空！'), //手机号不能为空
	     // 123@qq.com
	     array('phone','/^1((3[0-9])|(47)|(5[0-35-9])|(7[017])|(8[0-9]))\d{8}$/','手机号格式有误'), //手机号正则
	     //0 可选参数 存在字段 验证操作   unique 唯一 可选参数  1 验证时间 (在新增数据的时候 验证操作) 
	     array('phone','','手机号已经存在',0,'unique',1),//手机号唯一
	    
	 );


	 protected $_auto = array (          
	 	//密码加密 MD5  function 函数规则
		 array('password','md5',1,'function') , //      
		 array('addtime','time',1,'function'), // 对update_time字段在更新的时候写入当前时间戳     
	 );
	
} 	
 ?>