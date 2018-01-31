function asyncScript(A, B) {
	if (typeof A == "function") {
		var B = A,
		A = null
	}
	if (A) {
		if (typeof A != "string") {
			return
		}
		var x = document.createElement('script');
		x.type = 'text/javascript';
		x.async = true;
		x.src = A;
		var s = document.getElementsByTagName('head')[0];
		s.appendChild(x);
		if (B) {
			if (typeof B != "function") {
				return
			}
			if (!
			/*@cc_on!@*/
			0) {
				x.onload = function() {
					B()
				}
			} else {
				x.onreadystatechange = function() {
					if (x.readyState == 'loaded' || x.readyState == 'complete') {
						B()
					}
				}
			}
		}
	} else {
		if (!B) {
			return
		}
		setTimeout(function() {
			B()
		},
		0)
	}
};

function getRandomObj(A, R) {
	var x = 0;
	for (var i = 0; i < A.length; i++) {
		x += R[i] || 1;
		if (!R[i]) R.push(1)
	}
	var y = Math.ceil(Math.random() * x),
	z = [],
	m = [];
	for (var i = 1; i < x + 1; i++) {
		z.push(i)
	}
	for (var i = 0; i < A.length; i++) {
		m[i] = z.slice(0, R[i]);
		z.splice(0, R[i])
	}
	for (var i = 0; i < m.length; i++) {
		for (var j = 0; j < m[i].length; j++) {
			if (y == m[i][j]) {
				return A[i]
			}
		}
	}
}
function setRandomAds(A, R, O, flag) {
	var obj = getRandomObj(A, R),
	ele = document.getElementById(O),
	img;
	if (!obj) {
		return
	}
	if (flag && screen.width >= 1280) {
		obj.width = obj.width2;
		obj.url = obj.url2
	} else {
		obj.width = obj.width;
		obj.url = obj.url
	}
	img = "<a href='" + obj.link + "' target='_blank'><img width='" + obj.width + "' height='" + obj.height + "' alt='" + obj.alt + "' app='image:poster' src='" + obj.url + "' /></a>";
	if (ele) ele.innerHTML = img
}

;(function(){var ads=[{width:210,width2:0,height:261,url:"//img11.360buyimg.com/da/g15/M06/06/0B/rBEhWVMEFjIIAAAAAACPopX8tDQAAIstwP-Ku0AAI-6349.jpg",url2:"",alt:"6月值得购买的手机",link:"//c-nfa.jd.com/adclick?keyStr=z5AXFoIimt1jiDK32+w4mV5XagQcMy7MT3VMoY7N2j0uf7pQlpMRdc7Q/v09UIzZYjppC+raKej1W5QyagT4ZQg9sE4xJS4uXga54iwwiAIomOy3091gVSZ7oWYFJcmCUz7kwIFDzcKOh/Bu2yl4LrLgs+GeDU0FIaQRsy+iHCgCS44h0ctG2Rb+rgIh3Mz+Ap7ZpwcbQCO6P0vwlfGJ0T6GZKmAvP3GZHXESI5sM8RjZxeEwBKc2+ZJTIufGAWzEy/j2dB19Zp+4xUK1WbPypc6VymkvpUTpcCPFBMoknxY6jVt2c9iCmk0H6cNZ8Lw&cv=2.0&url=//yushou.jd.com/shouji.html"}];var rate=[1];asyncScript(function(){setRandomAds(ads,rate,"da211x261-1",false);})})();