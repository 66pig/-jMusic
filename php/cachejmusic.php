<?php
    header("Content-Type:text/html;charset=utf-8");
    // 创建memcache对象
    $mem = new Memcache;

    // 连接memcache服务器
    $mem -> connect("localhost", 11211);
    // $mem -> addServer("192.168.2.58", 11211); // 添加memcache服务器
    /**
     * 当有多台服务器的时候也可以写成一下这种形式
     * $mem -> addServer("localhost", 11211);
     * $mem -> addServer("192.168.2.58", 11211);
     * 这样的话，所有服务器都在连接池中，分布也更均匀
     */
     
    // 操作 下面的这些数据将根据hash算法均匀分布到所有服务器
    if( isset($_POST['cachekey']) ) {
      // echo $mem -> get("AAA");
    }
    /**
     * 网易新歌榜
     */
    if( isset($_POST['savenews'])) { 
            // echo $_POST['savenews'];
          $mem -> set($_POST['cachekey'], $_POST['savenews'], MEMCACHE_COMPRESSED,  60*60*24);
         // echo $mem -> get($_POST['cachekey']);
    }
    /**
     * 搜索到的歌曲
     */
    if( isset($_POST['savesearch'])) { 
            // echo $_POST['savenews'];
          $mem -> set($_POST['cachekey'].'1', $_POST['savesearch'], MEMCACHE_COMPRESSED,  60*60*24);
          echo $mem -> get($_POST['cachekey'].'1');
    }
    /**
     * 播放列表
     */
    if( isset($_POST['saveplaying'])) { 
            // echo $_POST['savenews'];
          $mem -> set($_POST['cachekey'].'2', $_POST['saveplaying'], MEMCACHE_COMPRESSED,  60*60*24);
          echo $mem -> get($_POST['cachekey'].'2');
    }
    /**
     * 最后播放的一首歌id
     */
     if( isset($_POST['lasting'])) { 
            // echo $_POST['savenews'];
          $mem -> set($_POST['cachekey'].'3', $_POST['lasting'], MEMCACHE_COMPRESSED,  60*60*24);
         echo $mem -> get($_POST['cachekey'].'3');
    }
    if( isset($_POST['getnews'])) { 
            // echo $_POST['savenews'];
          if(!empty($mem -> get($_POST['getnews']))) {
             echo $mem -> get($_POST['getnews']);
         }else {
            echo '-1';
         }
    }
    if( isset($_POST['getplaying'])) { 
            // echo $_POST['savenews'];
          if(!empty($mem -> get($_POST['getplaying']))) {
             echo $mem -> get($_POST['getplaying'].'2');
         }else {
            echo '-1';
         }
    }
    if( isset($_POST['showlasting']) ) {
        if(!empty($mem -> get($_POST['showlasting']))) {
             echo $mem -> get($_POST['showlasting'].'3');
         }else {
            echo '-1';
         }
    }
    // 关闭连接
    $mem -> close();