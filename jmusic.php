<?php session_start();?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>音乐播放器</title>
	<link charset="utf-8" href="css/jmusic.css" type="text/css" rel="stylesheet" />
	<!-- <script charset="utf-8" src="js/jmusic.js"></script> -->
	<!-- <script charset="utf-8" src="extend.js"></script> -->
</head>
<body>
	
</body>
<script charset="utf-8" src="./js/jmusic.js"></script>
<script>
jMusic.cacheid = '<?php if(!empty(session_id()))echo session_id(); ?>';
</script>
</html>