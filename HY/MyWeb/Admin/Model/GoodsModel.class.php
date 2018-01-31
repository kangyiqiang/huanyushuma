<?php
namespace Admin\Model;
use Think\Model;
class GoodsModel extends Model {

	//自动验证操作规则
	protected $_validate = array(


		//商品名
	     array('goods_name','require','商品名不能为空！'), 
	     array('goods_name','','商品名已经存在',0,'unique',1),//用户名唯一
	     //商品促销语
	     array('sale','require','商品促销语不能为空！'), 
	      //增值业务
	     array('add_server','require','增值业务不能为空！'), 
	     //商品描述 
	     array('descr','require','商品描述不能为空！'), 
	     //商品重量
	     array('weight','require','商品重量不能为空！'),


	 );

} 	
 ?>