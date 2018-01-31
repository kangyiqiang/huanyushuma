<?php 
    namespace Admin\Controller;
    use Think\Controller;
    class EmptyController extends Controller {
        //_empty 在访问一个不存在控制器里不存在的方法的时候 会自动的访问_empty 
       public function _empty(){
            echo "<script>location='".__ROOT__."/index.php/Admin'</script>";
       }
   }
 ?>