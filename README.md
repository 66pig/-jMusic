演示地址：http://123.56.191.84/jmusic_v1/jmusic.php

好了，步入正题，这个小东西涉及的一些大概知识点：`cRUL`、`ajax`、`session`、`memcache`、`闭包`、`递归`。。差不多就这些把，没别的了，考虑到有些朋友可能对有些知识点遗忘了，哈哈，我特意整理了每个知识点的笔记，笔记讲不是很细，但是应付这个小东西绰绰有余。

`Cookie 与 Session：`http://segmentfault.com/n/1330000009610165

`Memcache：`https://segmentfault.com/n/1330000009605929

`cURL：`https://segmentfault.com/n/1330000009577171

至于如果作为一个前端不知道ajax那我也没办法了，找点资料了解下吧，因为太简单，我就没有整理笔记了，但是如果有网友需要，可以联系我。

# 功能演示 #
1. 小窗口与大窗口切换

![tinywindow](https://raw.githubusercontent.com/66pig/-jMusic/f27729b1e1c42c3868994290066f9aa47d38306b/show/1.gif)


2. 播放面板的：后退、播放与暂停、前进、播放模式切换、音量（点赞与分享功能没做，和删除功能大同小异，后面有时间了我再补上）、定位播放位置（可拖拽）

![playing](https://raw.githubusercontent.com/66pig/-jMusic/f27729b1e1c42c3868994290066f9aa47d38306b/show/2.gif)


3. 播放列表页、新歌榜（默认显示20首）、歌曲搜索页、列表滚动条。
###### `注：`这些歌曲均是通过网易接口爬取过来的，因为网易很坑，我拿到的接口中30首差不多就只有5-8首可以正常播放，所以采用了cURL爬取验证，过滤掉了不能放的音乐，如果不知道网易接口怎么用的，可以自行[百度](http://www.baidu.com) ######

![list](https://raw.githubusercontent.com/66pig/-jMusic/f27729b1e1c42c3868994290066f9aa47d38306b/show/4.gif)


4. 播放列表的歌曲批量删除、单曲删除，排行榜的批量播放、搜索列表的批量播放。

![delete](https://raw.githubusercontent.com/66pig/-jMusic/f27729b1e1c42c3868994290066f9aa47d38306b/show/6.gif)


5. 歌词的拖拽查看

![drag](https://raw.githubusercontent.com/66pig/-jMusic/f27729b1e1c42c3868994290066f9aa47d38306b/show/5.gif)


# 播放器使用方法（引入方法） #
1. 将除show文件夹之外的必要文件移动到你要显示播放器所在的文件夹
2. 在要显示播放器的页面中插入如下几行代码
```
    1. <?php session_start();?>
    2. <link charset="utf-8" href="css/jmusic.css" type="text/css" rel="stylesheet" />
    3. <script charset="utf-8" src="./js/jmusic.js"></script>
    4. <script>jMusic.cacheid = '<?php if(!empty(session_id()))echo session_id(); ?>';</script>
```
注意：除第一行代码必须放在网页顶部外，其余代码可以插入到任意位置（但是css样式插入位置必须在`<head>`标签中），但是要保准顺序不能变 第4行代码必须要在第三行代码后面
### 代码插入示例 ###
```
<?php session_start();?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>音乐播放器</title>
	<link charset="utf-8" href="css/jmusic.css" type="text/css" rel="stylesheet" />
</head>
<body>
	
</body>
<script charset="utf-8" src="./js/jmusic.js"></script>
<script>
	jMusic.cacheid = '<?php if(!empty(session_id()))echo session_id(); ?>';
</script>
</html>
```
提醒：代码必须要放置在php环境、并且安装memcache扩展

### 4行代码解释 ###
1.`<?php session_start();?>`  //启动Session 的初始化 ，分配给用户一个sessionid，此id使用来读取服务器缓存的用户播放记录和新歌榜记录（方便下次快速播放->因为网易api的问题才会考虑缓存新歌榜的记录的）。

2.`<link charset="utf-8" href="css/jmusic.css" type="text/css" rel="stylesheet" />`   // 引入css样式文件

3.`<script charset="utf-8" src="./js/jmusic.js"></script>`   引入js主文件

4.`<script>jMusic.cacheid = '<?php if(!empty(session_id()))echo session_id(); ?>';</script>`  // 将sessionid传递给js主文件通过ajax进行服务器的匹配是否存在此用户的缓存音乐，如果存在就直接返回，没有怎重新从api获取

# 文件目录 #
* jmusic.php //次文件是你的将要引入播放器的文件（可修改）
* css  // css样式文件（不可改，但是如果懂，可以自行修改）
* js   // js主文件（不可改，但是如果懂，可以自行修改）
* php  // 存放着php文件，用于验证网易api中那些音乐可以播放哪些音乐不可以播放
* show // 用于存放本文章中所有功能演示图片（可删除）

# 提示 #
这种可以缓存音乐的都是需要用户登录的，考虑到大家看演示的时候都会缓存造成大量垃圾，而我又是用的很渣的服务器，所以缓存在的时间只有24小时，并且开启了session的垃圾回收机制（当访问过大时，超时的session会被自动删除）。
如果想要看微博原始播放器的朋友，可以移步至：[点击进入微博页](http://www.weibo.com)  `提醒：必须要登录后播放器才会显示，如果有账号可以登录查看`

# 源码下载地址 #
https://github.com/66pig/-jMusic
