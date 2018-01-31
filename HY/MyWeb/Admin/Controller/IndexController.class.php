<?php
    namespace Admin\Controller;
    use Think\Controller;
    class IndexController extends AllowController {
        public function index(){
            $this->display('Index/index');
        }
        public function top(){
            $this->display('Index/top');
        }
        public function left(){
            $this->display('Index/left');
        }
        public function right(){
              $this->assign('time',time());
            $all = $this->getCity();
            $city = $all['city'];
            $province = $all['province'];
            $url = 'http://wthrcdn.etouch.cn/weather_mini?city='.$city;
            $html = file_get_contents($url);
            $wearher =  gzdecode($html);
            $sss= json_decode($wearher,TRUE);
            $weather = $sss['data']['forecast'][0];
            $city = $sss['data']['city'];
            $icon = '';
            switch($weather['type']){
                case '多云':
                    $icon = 'icol32-weather-cloudy';
                break;
                case '晴':
                    $icon = 'icol32-weather-sun';
                break;
                case '小雨':
                    $icon = 'icol32-weather-rain';
                break;
                case '大雨':
                    $icon = 'icol32-weather-rain';
                break;
                case '中雨':
                    $icon = 'icol32-weather-rain';
                break;
                case '暴雨':
                    $icon = 'icol32-weather-rain';
                break;
                case '雷阵雨':
                    $icon = 'icol32-weather-lightning';
                break;
                case '阵雨':
                    $icon = 'icol32-weather-rain';
                break;
                case '阴':
                    $icon = 'icol32-weather-clouds';
                break;
                default:
                    $icon = 'icol32-weather-clouds';
                break;
                
            }
            $this->assign('icon',$icon);
            $this->assign('weather',$weather);
            $this->assign('city',$city);
            $this->assign('province',$province);
            $this->display('Index/right');
        }

         public function getCity($ip = '')
            {
                if($ip == ''){
                    $url = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json";
                    $ip=json_decode(file_get_contents($url),true);
                    $data = $ip;
                }else{
                    $url="http://ip.taobao.com/service/getIpInfo.php?ip=".$ip;
                    $ip=json_decode(file_get_contents($url));   
                    if((string)$ip->code=='1'){
                       return false;
                    }
                    $data = (array)$ip->data;
                } 
                return $data;   
            }
    }
?>