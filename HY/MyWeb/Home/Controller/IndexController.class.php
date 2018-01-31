<?php
    namespace Home\Controller;
    use Think\Controller;
    class IndexController extends Controller {
/**********************************防止地址栏非法操作开始*******************************/
         public function _empty(){
             session_destroy();
             $this->error("系统检测到您正在进行非法操作，已注销您的账号",U("Login/login"));
          }
/*********************************防止地址栏非法操作结束********************************/

/********************************首页开始****************************************/
        public function index(){
            /*6个商品展示模块*/
            $toptype = $this->getType(0);
            foreach($toptype as $value){
                foreach($value['shop'] as $val){
                    foreach($val['shop'] as $v){
                        $arr[$value['id']][] = $v['id'];
                    }
                }
            }
            // var_dump($toptype);

            //循环获取每一个一级分类下的所有商品(取前4个)
            for($i=1;$i<=6;$i++){
                $str = '';
                //第一个父分类的所有子类id
                foreach($arr[$i] as $k=>$v){
                    $str .= $v.',';
                }
                $str = rtrim($str,',');
                // var_dump($str);
                //三表联查获取所有商品(价格,图片,名称)取前四个
                $goods = M('goods_info as i')->field('i.goods_name as gname,v.price,c.spic,i.type_id as tid,v.id as vid')->join('goods_version as v on i.id=v.goods_id')->group('v.goods_id')->join('goods_color as c on i.id=c.goods_id')->where("type_id in ({$str}) and status=1")->limit(4)->select();
                //分割商品中的图片
                foreach($goods as $k=>$v){
                    $goods[$k]['spic'] = explode(',',$v['spic'])[0];
                }
                //封装商品信息到分类
                $type[$i]['goods']=$goods;
            }
           
            $this->assign('type',$type);

            //文章分配数据
            $text = M('articles');
            $sheying = $text->order("addtime")->where("type=1")->limit(3)->select();
            $zhineng = $text->order("addtime")->where("type=2")->limit(3)->select();
            $zaole = $text->order("addtime")->where("type=3")->limit(3)->select();
            $sheyingall = $text->where("type=1")->count();
            $zhinengall = $text->where("type=2")->count();
            $zaoleall = $text->where("type=3")->count();
            $title = M('articles a')->field("a.id,a.title,a.type,count(p.art_id) zan")->group("p.art_id")->join("LEFT JOIN zan p ON p.art_id=a.id")->order("zan desc")->limit(4)->select();
            $this->assign('title',$title);
            $this->assign('sheying',$sheying);
            $this->assign('zhineng',$zhineng);
            $this->assign('zaole',$zaole);
            $this->assign('sheyingall',$sheyingall);
            $this->assign('zhinengall',$zhinengall);
            $this->assign('zaoleall',$zaoleall);
            //轮播图分配数据
            $mod = M('lunbo');
            $lunbo = $mod->select();
            $count = $mod->count();
            $this->assign('lunbo',$lunbo);
            $this->assign('count',$count);
            //顶部广告分配数据
            $mod = M('advert');
            $advert = $mod->select();
            $advert = $advert[0];
            $adNum = $mod->count();
            $this->assign('advert',$advert);
            $this->assign('adNum',$adNum);
            //分类分配数据
            $types = $this->getType(0);
            $this->assign('types',$types);
            //加载主页
            $this->display('Index/index');
        }
        //无限分类递归
        public function getType($id){
            $mod = M('type');
            $list = $mod->where("pid=$id AND display=0")->select();
            foreach($list as $k => $v){
                $v['shop'] = $this->getType($v['id']);
                $data[] = $v;
            }
            return $data;
        }
        public function pubu(){
            /*获取所有商品的价格，图片 ，名称，版本id*/
            //瀑布流
            $pubu = M('goods_info')->where("status=1")->count();
            $page = new \Think\Page($pubu,16);
            $list=M("goods_info")->field('id,goods_name,descr')->where("status=1")->limit($page->firstRow,$page->listRows)->select();
            //图片+版本+价格
            foreach($list as $k=>$v){
                $condition['goods_id'] = $v['id'];
                $res=M('goods_color')->field('spic')->where($condition)->find();
                $list[$k]['spic']=explode(',',$res['spic'])[0];     
                $list[$k]['version_id']=M('goods_version')->field('id')->where($condition)->find()['id'];
            }
            echo json_encode($list);
        }
/********************************首页结束****************************************/

/********************************友情链接开始****************************************/
        public function link(){
            $mod = M('link');
            $count = $mod->count();
            $page=new \Think\Page($count,100);
            //设置分页
            $page->setConfig('prev','上一页');
            $page->setConfig('next','下一页');
            $page->setConfig('first','首页');
            $page->setConfig('last','末页');
            $page->setConfig('theme','%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
            $data = $mod->limit($page->firstRow,$page->listRows)->where("status=1")->select();
            $this->assign('pageinfo',$page->show());
            $this->assign('data',$data);
            $this->display('Index/link');
        }
        public function apply(){
            $mod = M('link');
            if($mod->add($_POST)){
                echo '<script>alert("申请成功！请等待管理员审核，结果将以邮件形式发送至您的邮箱");location="'.__MODULE__.'/Index/link"</script>';
            }else{
                echo '<script>alert("申请失败");location="'.__MODULE__.'/Index/link"</script>';
            }
        }
/********************************友情链接结束****************************************/

/********************************删除商品开始****************************************/
        public function cart(){
            $id = $_GET['vid'];
            $returnurl = "http://".$_GET['returnurl'];
            if(M('cart')->where("vid=$id")->delete()){
                unset($_SESSION['cart'][$id]);
                echo '<script>alert("删除成功");location="'.$returnurl.'";</script>';
            }else{
                echo '<script>alert("删除失败");location="'.$returnurl.'";</script>';
            }
        }
/********************************删除商品结束****************************************/
    }
?>