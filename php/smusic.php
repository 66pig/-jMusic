<?php
	
 	function getNews($url){
 		$curl = curl_init(); // 初始化cURL limit=20&type=1&s=love
	    curl_setopt($curl, CURLOPT_URL, $url); // 设置请求地址
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); // 执行后不直接打印出来
		//echo "http://s.music.163.com/search/get/?limit={$_POST['limit']}&type={$_POST['type']}&s={$_POST['s']}";
	    $output = curl_exec($curl); // 执行命令
	    curl_close($curl);			// 关闭cURL
		echo $output;
 	}
 	function getMusicInfo($url, $data){
	 	// $data = "offset=2&limit=30&type=1&s={$_POST['s']}"; // 设置请求的参数
	    $curlobj = curl_init(); // 初始化
	    curl_setopt($curlobj, CURLOPT_URL, $url); // 路径
	    curl_setopt($curlobj, CURLOPT_HEADER, 0); // 不显示header，因为不是直接打印所以不用显示header,参数中的1代表true，0代表false
	    curl_setopt($curlobj, CURLOPT_RETURNTRANSFER, 1); // 不直接打印,参数中的1代表true，0代表false
	    curl_setopt($curlobj, CURLOPT_POST, 1); // 提交方式：post,参数中的1代表true，0代表false
	    curl_setopt($curlobj, CURLOPT_POSTFIELDS, $data); // 提交的请求参数
	    curl_setopt($curlobj, CURLOPT_HTTPHEADER, array("application/x-www-form-urlencoded;charset=utf-8", "Content-length:".strlen($data))); // 1. 设置post提交的数据格式；2. 编码方式：utf-8；3. 由于是post提交所以还要计算参数的长度：strlen($data)，并存到Content-length中
	    $output = curl_exec($curlobj);
	    if(!curl_errno($curlobj)){
	    // $info = curl_getinfo($curlobj);
	    // print_r($info);
	    	echo $output;
	    }else{
	    	echo 'Curl出错了：'.curl_error($curlobj);
	    }
	    curl_close($curlobj);
 	}

 	// 根据接收过来的不同参数给出不同的输出
	if(isset( $_POST['s']) ){
		getMusicInfo('http://music.163.com/api/search/pc', "limit={$_POST['limit']}&type=1&s={$_POST['s']}");
	}else if( isset($_POST['relmusic']) ){
		$result = get_headers($_POST['relmusic'], 1); 
		echo substr($result[isset($result[1])], 9, 3);
	}else if( isset($_POST['lyid']) ){
		getMusicInfo('http://music.163.com/api/song/lyric', "os=pc&lv=-1&kv=-1&tv=-1&id={$_POST['lyid']}");
	}else if( isset($_POST['news']) ){
		getNews('http://music.163.com/api/playlist/detail?id=3779629');
	}else if( isset($_POST['getbyid']) ){
		getMusicInfo('http://music.163.com/api/search/pc', "type=1002&limit=20&s=陈一发儿");
	}
