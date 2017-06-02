/**
 * 无聊的时候看见微博的播放器挺不错的，据仿着做了个，而且近期空闲时间不是太多，
 * 所以还有很多可以优化的地方没有仔细处理所以只建议作为学习交流之用，
 * js代码未加密，未压缩，保留了制作注释，可以随意修改
 * 但是最终解释权归制作者所有。++++++溜溜猪。
 * segmentfault主页：https://segmentfault.com/u/liuliuzhu
 * 欢迎大家一起交流
 */
var jM = (function() {
	var jMusicObj = {
	$:function(selector,context) {
		context = context || document;
		if( selector.indexOf(" ") !== -1 ) {
			return context.querySelectorAll( selector );
		}else if( selector.charAt(0) === "#" ) {
			return document.getElementById( selector.slice( 1 ) )
		}else if( selector.charAt(0) === "." ) {
			return context.getElementsByClassName( selector.slice( 1 ) );
		}else{
			return context.getElementsByTagName( selector );
		}
	},
	addEvent:function( ele,eventName,eventFn ) {
		ele.addEventListener(eventName,eventFn, false);
	},
	removeEvent:function( ele,eventName,eventFn ) {
		ele.removeEventListener(eventName,eventFn,false);
	},
	addClass:function ( ele,clsNames ) {
		 if ( !this.hasClass( ele, clsNames ) ) ele.className += " " + clsNames; 
	},
	removeClass:function ( ele,clsNames ) {
		if ( this.hasClass( ele, clsNames ) ) {  
	        var reg = new RegExp( '(\\s|^)' + clsNames + '(\\s|$)' );  
	        ele.className = ele.className.replace( reg, ' ' );  
	    }  
	},
	hasClass:function(ele,classNames) {
		return ele.className.match( new RegExp('(\\s|^)' + classNames + '(\\s|$)') );
	},
	cloneObj:function( obj ) {
	    function Fn(){}
	    Fn.prototype = obj;//引用obj对象中值挂在到Fn.prototype
	    return new Fn();//返回Fn实例化后的对象
	},
	getPos:function( ele ) {
		var a = {left:0, top:0};
		while(ele) {
			a.left += ele.offsetLeft;
			a.top += ele.offsetTop;
			ele = ele.offsetParent;
		} return a;
	},
	getRealTime:function( num ) {
		num = parseFloat(num);
		/*** var iH = toZero(Math.floor(num/3600)); */
		//var iM = this.toTwo(Math.floor(num%3600/60));
		
		//var iS = this.toTwo(Math.floor(num%60));
		
		/*** return iH + ':' +iM + ':' + iS; */
		return this.toTwo(Math.floor(num%3600/60)) + ' : ' + this.toTwo(Math.floor(num%60));
	},
	toTwo:function( num ) { /*** 将转换出来的小于10的数字前面加上一个0 */
		if(num<=9){return '0' + num;
		}else{return '' + num;}
	},
	toOne:function( num ) { /*** 将转换出来的小于10的数字前面去掉0 */
		if(num<=9){return Number(num.charAt(1,2));
		}else{return Number(num);}
	},
	scrollBar:function(pos) {
		// 滚动条
		function sBar(pos) {
		this.bar = jM.$( '.scroll-bar' )[pos];
		this.ul  = jM.$( '.imc-wrap-ul' )[pos];
		this.li  = jM.$( '.li-item', this.ul );
		this.T, this.sT, this.H;
		//this.wrap = jM.$( '.scroll-box' )[0];
		}
		sBar.prototype = {
		constructor: sBar,
		init: function() {
			var _this = this;
			// 根据内容判断自定义滚动条的高度
			// 当歌曲大于20首时，滚动条开始根据内容变换
			// 当滚动条的高度变化后小于10%时，保持10%不变
			if(this.li.length > 20) {
				var a = parseInt(this.bar.style.height);
				var b = 594*100/this.ul.scrollHeight; 
				var realH = a*b/100;
				if(realH < 10)realH = '10';
				this.bar.style.height = realH + '%';
			}
			
			// 判断自定义滚动条出现的情况
			if(this.li.length <= 7) {this.bar.style.display= 'none';
				} else {this.bar.style.display = 'block';
				this.sT = this.ul.scrollHeight-this.ul.offsetHeight, // 初始化系统滚动条能滚动的最大距离
				this.H = this.bar.offsetParent.offsetHeight - this.bar.offsetHeight; // 初始化自定义的滚动条能滚动的最大距离
		};
			// 当点击滚动条时
			this.bar.onmousedown = function(ev) {
				var ev = ev || window.event;
				_this.down(ev);
				return false;
			}
			// 当滑动鼠标滚轮时
			this.ul.onscroll = function(ev) {
				var ev = ev || event;
				_this.scroll(ev);
			}
			return this.li.length;
		},
		down: function(ev) {
			//console.log(d_this.style.height);
			// alert(ev.clientY);
			var _this = this; // console.log(this.ul.scrollTop);console.log(this.ul.scrollHeight);
			
			this.T = ev.clientY - this.bar.offsetTop;
			document.onmousemove = function(ev) {
				var ev = ev || window.event;
				_this.move(ev);
			}
			document.onmouseup = function() {
					_this.up();
				};	
			//console.log(h);
			// console.log(this.T);
		},
		move: function(ev) {
			var nowT = ev.clientY - this.T;
			
			if( nowT < 0 ){
				nowT = 0;
			}else if( nowT > this.H ){
				nowT = this.H;
			}
			this.bar.style.top = nowT + 'px';
			this.ul.scrollTop = (nowT/this.H)*this.sT;
		},
		up: function() {
			// console.log(this.bar.style.top);
			document.onmousemove = document.onmouseup = null;
		},
		scroll: function(ev) {
			var getdScT = (this.ul.scrollTop/this.sT)*this.H;
			// console.log(getdScT);
			this.bar.style.top = getdScT + 'px';
		}

	}
	return new sBar(pos);
	},
	ajax: function(method, url, data, success){
		var xhr = null;
		try {
			xhr = new XMLHttpRequest();
		} catch (e) {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		
		if (method == 'get' && data) {
			url += '?' + data;
		}
		
		xhr.open(method,url,true);
		if (method == 'get') {
			xhr.send();
		} else {
			xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			xhr.send(data);
		}
		
		xhr.onload = function() {
			success && success(xhr.responseText);	
		}
		xhr.onerror = function(){
			console.log('错误信息：' + xhr.status);
		}
	}
}
return jMusicObj;

}());

// cLiTitle: 播放列表、亚洲新歌榜的父级className
// oSongList: 每次点击相应按钮移动的歌曲面板

(function( window ){
	// sOnOff搜索按钮lock锁，当上次的搜索还未结束前，将搜索按钮锁住不允许再次搜索，
	// 必须等到上次搜索结束才能准予新的搜索
	var sOnOff, 

	// 存储播放列表的所有歌曲
	allMusicList = [], 

	// lastinput核对歌曲搜索的cache缓存，判断最近的两次搜索内容是否一致，
	// 如果不一致再进行搜索事件，否则不予搜索，保留上次的结果
	lastinput,

	// nowTimer实时更新当前播放时间以及进度的定时器
	nowTimer,

	lyricTimer, // 歌词定时器

	// newsLname存储亚洲新歌榜前多首歌曲的名字
	newsLname = [],

	// newsLid存储亚洲新歌榜前20首歌曲的信息
	newsLinfo = [],

	// searched存储搜索到的结果
	searched  = [],

	// 为蜘蛛侠spider计数，最大为20
	spiderCount = 0,

	// 歌曲循环的三个开关
	jloop = [false,/**随机**/ false,/**单曲循环**/ true/**列表循环**/],

	onStopLoadBar = true,

	$jMusic = {
		cachename : '',
		cacheid	  : '',
	},

	// 搜索出错的用户提示
	sStatus = '<p class="errorinfoMes"><i></i>jMusic提醒：歌曲库为空或异常~</p>';

	var allofjmusicnodes = '<div class="PCD-mplayer"> <div class="tiny"> <div class="tiny-panel-area"> <a href="javascript:void(0);" class="tiny-btn-area pause-state"> <i class="ico-ctrl ico-tiny-state" id="ico-tiny-state"></i> <span class="mask"></span> <img src="./images/musicpic.png" class="pic" /> </a> </div> <a href="javascript:void(0);" class="tiny-fold-ctrl-area"> <i class="ico-ctrl ico-unfold"></i> </a> <a href="javascript:void(0);" class="ico-ctrl ico-close" title="关闭"></a> </div> </div> <div class="i_mplayer"> <div class="player_bg"> <div class="panel-area iM-bg"> <div class="title-box"> <div class="opt-btn"> <a href="javascript:void(0);" class="ico-ctrl ico-close"></a> </div> <ul class="ul-title"> <li class="li-title"> <a href="javascript:void(0);" class="title-current"> <span class="title">播放列表</span> <span class="ani-border ani-active"></span> </a> </li> <li class="li-title"> <a href="javascript:void(0);" class="title-current"> <span class="title">网易新歌榜</span> <span class="ani-border"></span> </a> </li> </ul> <div class="opt-box"> <div class="search-box"> <input class="ipt-text" placeholder="搜索歌曲/歌手" /> <a href="javascript:void(0);" class="li-title search-btn"> <i class="ico-ctrl ico-search"></i> </a> </div> </div> </div> <!-- 歌曲列表 --> <div class="list-area"> <div class="song-list"> <!-- 播放列表 --> <div class="list-i-playing imc-i-list"> <p class="list-p-item"> <span class="music-del"> 正在播放（ <span class="nowplay">0/0</span> ） </span> <span class="music-del music-del-hov"> <span class="ico-ctrl ico-del-lite-v2"></span> 清空列表 </span> </p> <div class="imc-list-info"> <div class="imc-wrap-ul listing"> <div class="list-wrap"> <div class="list-box"> <ul class="ul-list"> <!--   歌曲        start -->  <!--    歌曲        end--> </ul> </div> </div> </div> </div> <div class="scroll-box"> <div class="scroll-bar"></div> </div> </div> <!-- 亚洲新歌榜 --> <div class="list-i-news imc-i-list"> <p class="list-p-item"> <span class="music-del news-total">共0首</span> <span class="music-del music-del-hov"> <span class="ico-ctrl ico-rig-play"></span> 全部播放 </span> </p> <div class="imc-list-info"> <div class="imc-wrap-ul newsing"> <div class="list-wrap"> <div class="list-box"> <ul class="ul-list"> <!--   歌曲        start --> <p class="saySearching">玩命加载中，请稍后...</p> <!--    歌曲        end--> </ul> </div> </div> </div> </div> <div class="scroll-box"> <div class="scroll-bar"></div> </div> </div> <!-- 搜索结果 --> <div class="list-i-search imc-i-list"> <p class="list-p-item"> <span class="music-del search-total">共0首</span> <span class="music-del music-del-hov"> <span class="ico-ctrl ico-rig-play"></span> 全部播放 </span> </p> <div class="imc-list-info"> <div class="imc-wrap-ul searching"> <div class="list-wrap"> <div class="list-box"> <ul class="ul-list"> <!--   歌曲        start -->  <!--    歌曲        end--> </ul> </div> </div> </div> </div> <div class="scroll-box"> <div class="scroll-bar"></div> </div> </div> </div> </div> </div> <!-- 播放器控制bar --> <div class="unfold-area"> <div class="unfold-bg"> <div class="time-wrap"> <div class="time-bar"> <div class="progress"> </div> <div class="cur-time-bg" style="width:0%;"> <span class="cur-time" title="进度"></span> </div> </div> <div class="time-count tcol-sub">00 : 00 </div> <div class="layer-time"> <div class="content"> <i class="ico-ctrl ico-time-arrow"></i> <span class="pointTimer"></span> </div> </div> </div> <div class="main-panel"> <div class="music-info"> <!--temp start--> <!--音乐头像--> <div class="music-pic"> <a target="_blank" href="https://segmentfault.com/u/liuliuzhu" title="溜溜猪的segmentfault" class="pic"> <img src="./images/musicpic.png" /> </a> </div> <!--音乐显示细节--> <div class="music-detail"> <p class="name-bar"> <a target="_blank" class="name autocut" href="https://segmentfault.com/u/liuliuzhu" title="我是Jerry">爱上玩的习惯</a> </p> <p class="author-bar autocut"> <a target="_blank" class="author tcol-sub" href="https://segmentfault.com/u/liuliuzhu" title="溜溜猪">溜溜猪</a> </p> <p class="source-bar autocut"> <em class="tcol-sub">来自</em> <a target="_blank" href="https://segmentfault.com/u/liuliuzhu" class="source">owyoo社区</a> </p> </div> <!--temp end--> </div> <div class="contrl-panel"> <p class="layer-loop"> <a href="javascript:void(0);" title="随机播放" class="ico-ctrl ico-rand"></a> <a href="javascript:void(0);" title="单曲循环" class="ico-ctrl ico-solo"></a> <a href="javascript:void(0);" tilte="列表循环" class="ico-ctrl ico-loop"></a> </p> <div class="contrl-bar"> <div class="base-ctrl"> <a href="javascript:void(0);" title="上一首" class="ico-ctrl ico-prev"></a> <a href="javascript:void(0);" title="播放" id="playPause" class="ico-ctrl ico-play"></a> <a href="javascript:void(0);" title="下一首" class="ico-ctrl ico-next"></a> <a href="javascript:void(0);" id="playMode" title="列表循环" class="ico-ctrl ico-loop"></a> </div> <div class="vol-ctrl"> <a href="javascript:void(0);" class="ico-ctrl ico-vol" title="音量"></a> <div class="ctrl-bar"> <div class="cur-vol cur-volmute" style="width:100%;"> <a href="javascript:void(0);" class="ico-ctrl ico-curvol" title="音量调节"></a> </div> </div> </div> <div class="opt-ctrl"> <a href="javascript:void(0);" class="ico-ctrl ico-like" title="赞"></a> <a href="javascript:void(0);" class="ico-ctrl ico-share" title="分享"></a> <a href="javascript:void(0);" class="ico-ctrl ico-list" title="展开列表"></a> <a href="javascript:void(0);" class="ico-ctrl ico-lyric ico-lyric-open" title="显示歌词">词</a> </div> </div> </div> </div> </div> </div> <div class="fold-ctrl-area"> <div class="mask"> <a href="javascript:void(0);" class="ico-ctrl ico-fold"></a> </div> </div> <div class="lyric-wrap iM-bg"> <div class="lyric-bg"> <a href="javascript:void(0);" class="ico-ctrl ico-close close-lyric" title="关闭"></a> <div class="content" style="cursor:pointer"> <div class="tcol-sub i-wrap-lyrics"> <p class="cur-word">作者：溜溜猪</p> </div> </div> </div> </div> </div> <audio src="" id="jmusicplayer" controls loop="loop" autoplay="autoplay" hidden> 浏览器不支持audio标签 </audio> </div>';

	if ( typeof window === "object" ) {
		window.jMusic = $jMusic;
	}

// 初始化亚洲新歌榜中的歌单
window.onload = function(){
	var jmoDiv = document.createElement('div');
	jmoDiv.innerHTML = allofjmusicnodes;
	document.body.appendChild(jmoDiv);
	var cLiTitle  = jM.$( '.li-title' );
	var oSongList = jM.$( '.song-list' )[0];
	var btnLen = cLiTitle.length - 1, 
	lyricWrap = jM.$('.i-wrap-lyrics')[0],
 	timeCount = jM.$( '.time-count'  )[ 0 ],
	playingbar = jM.$( '.cur-time-bg' )[ 0 ],
	musicObj = jM.$('#jmusicplayer'); // 播放器对象

	if( $jMusic.cacheid != ''){
			jM.ajax( 'post', 
			     './php/cachejmusic.php', 
			     'cachekey='+ $jMusic.cacheid, 
		function(data){
			console.log('连接成功，歌曲将自动缓存');
		});
	}
	// 取缓存--新歌榜
	jM.ajax( 'post', 
		  './php/cachejmusic.php', 
		  'getnews='+ $jMusic.cacheid +'&cachekey='+ $jMusic.cacheid, 
	function(data){
		var data = JSON.parse( data );
		// console.log(data);
		if( data != '-1' ){
			newsLinfo = data ;
			insertNewsList( 1, newsLinfo );
		}else {
			jM.ajax( 'post', 
		     './php/smusic.php', 
		     'news=getList', 
			function(data){
				var data = JSON.parse( data );
				defaultNews( data );
			});
		}
	});

	// 取缓存--播放列表
	jM.ajax( 'post', 
		  './php/cachejmusic.php', 
		  'getplaying='+ $jMusic.cacheid, 
	function(data){
		// console.log(data);
		var data = data == '' ? '-1' : JSON.parse( data );
		// console.log(data);
		if( data != '-1' ){
			allMusicList = data;
			//sCallback( data );
			insertNewsList( 0, allMusicList );
			jM.ajax( 'post', 
				  './php/cachejmusic.php', 
				  'showlasting='+ $jMusic.cacheid, 
			function( data ){
				var data = data == '' ? '-1' : JSON.parse( data );
				if( data != '-1' ){
					var callaback = new sCallback( allMusicList );
					callaback.init().playMusic( callaback.uLing[ data ], true );
				}
			})
		}
	});


// 初始化news新歌排行榜歌单
function defaultNews( data ) {
	spiderCount = 0, newsLinfo = [],newsLname = [],
	   newsList = data.result.tracks;
	// console.log(newsList);
	for( var i=0; i<26; i++) {
		newsLname.push( newsList[ i ].name );
	}

	(function spider( i ) {

	if( spiderCount == 20 || i>25 ) {
		insertNewsList( 1, newsLinfo);
		// 缓存新歌榜数据
		jM.ajax( 'post', 
			     './php/cachejmusic.php', 
			     'savenews='+ JSON.stringify(newsLinfo) +'&cachekey='+ $jMusic.cacheid, 
		function(data){
			// console.log('news is ok');
		});
		return;
	}

	// 根据排行榜的歌单进行歌曲搜索
	jM.ajax( 'post', 
	'./php/smusic.php', 
	'limit=3&s=' + newsLname[ i ],
	function( data ) {
		var da = JSON.parse( data );
		if( da.result ){
			if( !da.result.songs ){ // 如果返回异常，则不进行歌曲筛选，因为根本就没有歌曲
				spider( i+1 );
				return;
			}
		
		// 如果不存在异常就对每一批的6首歌进行检测，挑选出可以播放的
		(function checkNewsList( n ){

		if( n == da.result.songs.length ){
			spider( i+1 );
			return;
		}
		
		// 检验搜索到的新歌数据中有哪些数据是出错的，并过滤掉
		jM.ajax( 'post', 
				'./php/smusic.php', 
				'relmusic=' + da.result.songs[ n ].mp3Url,
		function( data ){
		
		if( data == '200' ){
			newsLinfo.push( da.result.songs[ n ] );
			spiderCount++;
			spider( i+1 );
			return;
			}
			checkNewsList( n+1 );
			});
		})( 0 );
	}
	});
})( 0 );
}
// 当spider爬行完了20首新歌的时候就调用此函数将爬行的数据插入到新歌榜的panel中

	function insertNewsList( num, obj ){
	 var str = '';
	
	for( var i=0; i<obj.length; i++) {
		if(num){
		str += '<li class="li-item" objectid="'+obj[ i ].id+'" action-type="list-select"><span class="music-name">'+obj[ i ].name+'</span><span class="singer-name"><span>'+obj[ i ].artists[ 0 ].name+'</span></span><span class="opt-box"><a href="javascript:void(0);" class="ico-like-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-share-lite ico-ctrl"></a></span></li>';
	}else {
		str += '<li class="li-item" objectid="'+obj[ i ].id+'" action-type="list-select"><span class="music-name">'+obj[ i ].name+'</span><span class="singer-name"><span>'+obj[ i ].artists[ 0 ].name+'</span></span><span class="opt-box"><a href="javascript:void(0);" class="ico-like-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-share-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-del-lite ico-ctrl"></a></span></li>';
		}}		
		jM.$( '.ul-list' )[ num ].innerHTML = str; // 插入所有歌曲数据到新歌榜panel

		setTimeout( function() {
			jM.scrollBar( num ).init();
		});
		if(num) {
			jM.$( '.news-total' )[ 0 ].innerHTML = '共'+ obj.length +'首';
		}else {
			jM.$( '.nowplay' )[ 0 ].innerHTML = '1/' + obj.length;
		}
		//sCallback( newsLinfo );
		var callaback = new sCallback(obj);
			callaback.init();
	
	}
// jM.ajax( 'post', 'smusic.php', 'getbyid=gg', function(data){
// 	console.log(data);
// });

// 遍历cLiTitle，当鼠标触发播放列表、亚洲新歌榜时，做出相应响应
for( var i=0; i<cLiTitle.length; i++ )
{
	cLiTitle[ i ].index = i; // 索引
	cLiTitle[ i ].onclick = function()
	{
		var _that = this; // 存this
		// 当点击搜索按钮的时候内容为空则直接不做任何反应就返回
		if( this.index == btnLen && jM.$( '.ipt-text' )[ 0 ].value == '')return;
		for( var i=0; i < btnLen; i++ )
		{	// 每次点击歌曲菜单时遍历清除其余菜单按钮的样式
			//（但不能包含搜索按钮）因为搜索按钮只是借助了这个class那么的事件
			var spanl = jM.$( 'span',  cLiTitle[ i ] )[ 1 ];
			jM.removeClass( spanl, 'ani-active' );
		}
		// 搜索按钮
		// 必须内容不为空时才能触发搜索事件
		if( this.index == btnLen) 
		{
			oSongList.style.left = - this.index*685 + 'px'; // 根据点击不同的按钮移动相应面板位置
			if( jM.$('.ipt-text')[0].value == lastinput && jM.$( '.ipt-text' )[0].value != '' )return;
			if( sOnOff )return;
			sOnOff = true;
			 // 如果本次的搜索与上次搜索内容一致就直接返回，节约资源
			lastinput = jM.$('.ipt-text')[0].value;
			// ajax获取搜索的歌曲信息
			searchAjax();
		}else{ // 播放列表、亚洲新歌榜按钮
			oSongList.style.left = - this.index * 685 + 'px'; // 根据点击不同的按钮移动相应面板位置
			var spanTwo = jM.$( 'span', _that )[ 1 ]; // 用this（_that）
			jM.addClass( spanTwo, 'ani-active' );
		}
	}

}

// 回车搜索
jM.$('.search-box .ipt-text')[0].onkeydown = function( ev ) {
	var ev = ev || window.event;
	if( ev.keyCode == 13 ) {
		oSongList.style.left = - 2*685 + 'px'; // 
		for( var i=0; i < btnLen; i++ )
		{	// 每次点击歌曲菜单时遍历清除其余菜单按钮的样式
			//（但不能包含搜索按钮）因为搜索按钮只是借助了这个class那么的事件
			var spanl = jM.$( 'span',  cLiTitle[ i ] )[ 1 ];
			jM.removeClass( spanl, 'ani-active' );
		}
		if( this.value == lastinput && this.value != '' )return;
		if( sOnOff )return;
			sOnOff = true;
		 // 如果本次的搜索与上次搜索内容一致就直接返回，节约资源
		lastinput = jM.$('.ipt-text')[0].value;
		// ajax获取搜索的歌曲信息
		searchAjax();
	}
}

// 当数据完全插入后初始化了sCallback函数，在sCallback函数中进行对数据的操作
/**
 * this.data = data, 
	this.playingbar = jM.$( '.cur-time-bg' )[ 0 ],
	this.timeCount = jM.$( '.time-count'  )[ 0 ];
 */
sCallback.prototype.init = function() {
	var _this = this;
	var pCount3 = jM.scrollBar( 2 ).init();
	jM.$( '.search-total' )[0].innerHTML = '共'+ pCount3 +'首';

	 this.uLing = jM.$( '.ul-list' )[ 0 ].getElementsByClassName( 'li-item' ); // 播放列表的li
	this.uLnews = jM.$( '.ul-list' )[ 1 ].getElementsByClassName( 'li-item' ); // 新歌列表的li
	   this.uLi = jM.$( '.ul-list' )[ 2 ].getElementsByClassName( 'li-item' ); // 搜索列表的li

	//console.log(uLi);
	// 循环遍历所有搜索到的音乐等待点击事件去进行相应播放
	for( var i=0; i<this.uLi.length; i++ ){
		this.uLi[ i ].index = i;
		jM.addEvent( this.uLi[i], 'click', function() {
			var _that = this;
			musicObj.pause();
			_this.playMusic( _that );
		});
	}

	// 循环遍历新歌榜中的音乐等待点击事件去进行相应播放
	for( var i=0; i<this.uLnews.length; i++ ){
		this.uLnews[ i ].index = i;
		jM.addEvent( this.uLnews[i], 'click', function() {
			var _that = this;
			musicObj.pause();
			_this.playMusic( _that );
		});
	}

	for( var i=0; i<this.uLing.length; i++ ){
		 this.uLing[ i ].index = i;
		jM.addEvent(  this.uLing[i], 'click', function() {
			var _that = this;
			musicObj.pause();
			_this.playMusic( _that );
		});
	}

	// 触发新歌榜音乐的全部播放按钮
	jM.$( '.music-del-hov' )[ 1 ].onclick = function() {
		_this.touchAlltoPlay( newsLinfo );
	}

	// 触发搜索的的音乐的全部播放按钮
	jM.$( '.music-del-hov' )[ 2 ].onclick = function() {
		_this.touchAlltoPlay(searched);
	}

	// 触发新歌榜音乐的全部删除按钮
	jM.$( '.music-del-hov' )[ 0 ].onclick = function() {
		allMusicList = [],
		jM.$( '.ul-list' )[ 0 ].innerHTML = '';
		// 重置播放列表的滚动条对象
		var pCount1 = jM.scrollBar( 0 ).init();
		jM.$( '.nowplay' )[ 0 ].innerHTML = '1/' + pCount1;
	}
	return this;
}

// 全部播放事件函数
/**
 * this.data = data, 
	this.playingbar = jM.$( '.cur-time-bg' )[ 0 ],
	this.timeCount = jM.$( '.time-count'  )[ 0 ];
 */
sCallback.prototype.touchAlltoPlay = function( object ) {
		if( allMusicList[0] == null ) {
			allMusicList = allMusicList.concat( object );
		} else {
			
			// 通过递归遍历所有要添加的歌曲在播放列表中是否存在，
			// 仅添加播放列表中不存在的到播放列表
			(function newsLoop( p ){
				var onOff = true;
				if( p == object.length ) {
					return;
				}
				(function playingloop( i ){
					if( i == allMusicList.length ) {
						if( onOff )allMusicList.push( object[p] );
						newsLoop( p + 1 );
						return;
					}
					if( object[p].id == allMusicList[i].id )onOff = false;
					playingloop( i + 1 );

					})(0);
			})(0);
		}
		
		var allNewtoPlaying = '';
		for( var i=0; i<allMusicList.length; i++ ) {
			allNewtoPlaying += '<li class="li-item" objectid="'+allMusicList[i].id+'" action-type="list-select"><span class="music-name">'+allMusicList[i].name+'</span><span class="singer-name"><span>'+allMusicList[i].artists[0].name+'</span></span><span class="opt-box"><a href="javascript:void(0);" class="ico-like-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-share-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-del-lite ico-ctrl"></a></span></li>';
		}

		// 
		jM.$( '.ul-list' )[ 0 ].innerHTML = allNewtoPlaying;
		  this.playMusic( this.uLing[ 0 ] );

		// 重置播放列表的滚动条对象
		var pCount1 = jM.scrollBar( 0 ).init();
		jM.$( '.nowplay' )[ 0 ].innerHTML = '1/' + pCount1;
	} // 全部播放事件函数结束 


	// 歌曲循环函数
	sCallback.prototype.loop = function( a ) {
		
		jM.$( '#playPause' ).className = 'ico-ctrl ico-play';
		if( allMusicList[0] == null )return;
		
		if( jloop[ 0 ] == true ) {
			a = Math.round( Math.random()*( allMusicList.length -1) ); // 随机取歌曲序列
		} else if( jloop[ 2 ] == true ) {	// 列表循环
			a++;
			a = a >= allMusicList.length
			  ? 0 
			: a < 0 
			  ? allMusicList.length -1 
			: a;
		}
		// 出了上面两种情况外剩下的一种不动用播放位置的为单曲循环
		this.playMusic( this.uLing[ a ] );
	}

	// 播放音乐点击触发事件函数
sCallback.prototype.playMusic = function( _this, pause ) { 
			var _loop = this;
			clearInterval( nowTimer );
			clearInterval( lyricTimer );
			lyricWrap.style.top = '0px'; // 每次播放的时候都要初始化歌词高度位置 
			// 当添加歌曲到播放列表的时候，如果遇到添加了重复的歌曲，则直接返回不进行添加
			var objId = _this.getAttribute( 'objectid' ), _that, checkIfhave = true;
			var lyname, auname, lyid, piSrc, mpUrl, nowId;	

			// 每一次删除了歌曲后会留下缓存导致实际歌曲对应的节点和所删除的不一致
			// 因此为了消除缓存导致的问题，就需要每次删除一个节点后重新加载一次页面的真实节点
			( function refreshNode( uLing ) {
				// 初始化播放列表的事件
				if( allMusicList[0] != null ){
				
				for( var i=0; i<uLing.length; i++ ) {

				uLing[i].index = i;
				jM.$( '.ico-del-lite', uLing[i] )[0].onclick = function( ev ) 
				{
					var ev = ev || window.event;
					ev.stopPropagation(); // 阻止冒泡
					var _this = this.parentNode.parentNode;						
					_this.parentNode.removeChild( _this );
					allMusicList.splice( _this.index, 1 );

					// 重置播放列表的滚动条对象
					var pCount1 = jM.scrollBar( 0 ).init();
					jM.$( '.nowplay' )[0].innerHTML = '1/' + pCount1;
					refreshNode( uLing );
				}}

				}
			})( this.uLing );

			// var sid   = objId.substring(1); // 取出搜索出来的所有歌曲的sid
			for( var i=0; i<this.uLing.length; i++ ) {
				if( allMusicList[i].id == objId ) {
					checkIfhave = false;
				}
			}

			// 检测是否点击了搜索列表的音乐
			// 如果点击了，那么就调取出当前音乐的id
			if( jM.hasClass( _this.offsetParent, 'searching' ) ) 
			{
				for( var i=0; i<this.data.length; i++ )
				{
					if( this.data[i].id == objId )_that = i;
				}
			}else if( jM.hasClass( _this.offsetParent, 'listing' ) ) 
			{
				for( var i=0; i<allMusicList.length; i++ )
				{
					if( allMusicList[i].id == objId )_that = i;
				}
			}else if( jM.hasClass( _this.offsetParent, 'newsing' ) ) 
			{
				for( var i=0; i<this.data.length; i++ )
				{
					if( this.data[i].id == objId )_that = i;
				}
			}

			
			// 根据开关规则来确定是否可以添加新歌曲到播放列表
		if( checkIfhave ) {
			//if( _this.offsetParent )
			// 存储播放列表所有的音乐
			allMusicList.push( this.data[ _that ] );
			// console.log(allMusicList); 调试查看播放列表的数组中的清单
			lyname = this.data[ _that ].name, auname = this.data[ _that ].artists[ 0 ].name;
			// 添加歌曲后将新歌曲添加到播放列表
			var oLi = document.createElement('li');
			oLi.innerHTML = '<span class="music-name" objectid="'+lyid+'">'+lyname+'</span><span class="singer-name"><span>'+auname+'</span></span><span class="opt-box"><a href="javascript:void(0);" class="ico-like-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-share-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-del-lite ico-ctrl"></a></span>';
			
			oLi.className = 'li-item';
			oLi.setAttribute( "objectid", this.data[_that].id );
			// oLi.setAttribute( "linksid", 'p'+sid );
			jM.$( '.ul-list' )[ 0 ].appendChild( oLi );

			// 重置播放列表的滚动条对象
			var pCount1 = jM.scrollBar( 0 ).init();
			jM.$( '.nowplay' )[ 0 ].innerHTML = '1/' + pCount1;
		}

		// 缓存播放列表数据
		if( allMusicList[0] != null ){
			jM.ajax( 'post', 
				     './php/cachejmusic.php', 
				     'saveplaying='+ JSON.stringify(allMusicList) +'&cachekey='+ $jMusic.cacheid, 
			function(data){
				// console.log('listing is ok!');
			});
		}

		// 循环遍历播放列表所存储到的数组，调用出每次播放的歌曲信息
			for( var i=0; i<allMusicList.length; i++ ) {
				if( allMusicList[ i ].id == objId ) {
					lyname = allMusicList[ i ].name,
					auname = allMusicList[ i ].artists[ 0 ].name,
					lyid   = allMusicList[ i ].id,
					piSrc  = allMusicList[ i ].album.picUrl,
					mpUrl  = allMusicList[ i ].mp3Url,
					nowId  = i;
				}
			}

			// 缓存当前播放数据
		if( allMusicList[0] != null ){
			jM.ajax( 'post', 
				     './php/cachejmusic.php', 
				     'lasting='+ nowId +'&cachekey='+ $jMusic.cacheid, 
			function(data){
				//console.log(data);
			});
		}

		// 获取歌词
		jM.ajax('post', './php/smusic.php', 'lyid='+ lyid, function( data ) {
			var da = JSON.parse( data );
			lyricFactory( da );
		});

		// 歌词处理函数
		function lyricFactory( da ){
			clearInterval( lyricTimer );
			var	lyricArr = [], // 歌词数组
				timeArr  = [], // 时间数组
				lyricStr = ''; // 整理后的h歌词字符串

			if( da.uncollected || da.nolyric ) {	 // 当歌词不存在时会给出这两种返回值
				jM.$( '.i-wrap-lyrics' )[ 0 ].innerHTML = '<p>抱歉，暂无歌词</p><p>……</p>'; 
				return;
			}

			// 如果歌词不存在直接返回
			var lyric = da.lrc.lyric;
			var reg = /[\n]*\[[0-9]{2}:[0-9]{2}\.[0-9]*\]/g; // 过滤歌词中的时间
			lyricArr = lyric.split( reg ); // 所有歌词
			lyricArr.shift(); // 移除分割歌词是多出的前面一个多余空格元素

			// console.log(lyricArr);
			var cache = lyric.split( '\n' );
			// console.log(cache);
			// 整理过滤出时间
			for( var i=0; i<cache.length; i++) {
				timeArr.push( jM.toOne( cache[i].substring( 1,3 ) )*60+jM.toOne( cache[ i ].substring( 4,6 ) ) );
			}

			 // 移除分割时间时多余的一个空格元素
			for( var i=0; i<lyricArr.length; i++ ) {
				lyricStr += ' <p>'+lyricArr[ i ]+'</p>';
			}

			// <p style="transition:color .5s ease;">曲：金玟岐</p>
			timeArr.pop();

			jM.$( '.i-wrap-lyrics' )[ 0 ].innerHTML = lyricStr;
			var lyrP = jM.$( '.i-wrap-lyrics p' );
			
			//
			lyricTimer = setInterval( autoLyric, 800 );

			function autoLyric(){
				for( var i=0; i<timeArr.length; i++ ) {
					if(parseInt( musicObj.currentTime ) == timeArr[ i ] ) {
						for( var j=0; j<lyrP.length; j++ ) {
							lyrP[ j ].className = '';
						}
						lyrP[ i ].className = 'cur-word';
						if( lyrP[ i ].offsetHeight > 20 ) {
							lyricWrap.style.top = - lyrP[ i ].offsetTop + 'px';
						} else{
							lyricWrap.style.top = 16 - lyrP[ i ].offsetTop + 'px';
						}
					}
				}
			}
				// 歌词面板的拖拽字幕
			jM.addEvent( lyricWrap,'mousedown', function( ev ) {
				var ev = ev || window.event;
				var H  = ev.clientY - lyricWrap.offsetTop;
				clearInterval(lyricTimer);
				jM.addClass ( document.body, 'lyric-move-body' );
				if( lyricWrap.setCapture ) {
					lyricWrap.setCapture();
				}
				document.onmousemove = function( ev ) {
					var ev = ev || window.event;
					var pos = ev.clientY - H;
					pos = pos > 0 ? 0 
					: pos < -lyricWrap.offsetHeight  ? -lyricWrap.offsetHeight + 26
					: pos;
					lyricWrap.style.top = pos + 'px';
				}
				document.onmouseup = function() {
					document.onmousemove = document.onmouseup = null;
					lyricTimer = setInterval( autoLyric, 800 );
					jM.removeClass ( document.body, 'lyric-move-body' );

					if( lyricWrap.releaseCapture ) {
						lyricWrap.releaseCapture();
					}
				}
				return false;
			})
			
			// 
		} // 歌词处理函数结束

		// 对播放中的歌曲字体改色
		for( var i=0; i<this.uLing.length; i++ ) {
			this.uLing[ i ].style.color = '#808080';
		}
		this.uLing[ nowId ].style.color = '#fa7d3c';
		// 重置为当前播放的音乐的播放面板
		jM.$( '.music-pic img' )[ 0 ].src = jM.$( '.tiny-panel-area .pic' )[ 0 ].src = piSrc;
		jM.$( '.name-bar a' )[ 0 ].innerHTML = jM.$( '.name-bar a' )[ 0 ].title = lyname;
		jM.$( '.author-bar a' )[ 0 ].innerHTML = jM.$( '.author-bar a' )[ 0 ].title = auname;
		musicObj.src = mpUrl;

		if( pause ){clearInterval(nowTimer);musicObj.pause()}else{

			// jM.removeClass( jM.$( '#playPause' ), 'ico-play' );
			// jM.addClass( jM.$( '#playPause' ), 'ico-playing' );
			jM.$( '#playPause' ).className = 'ico-ctrl ico-playing';
			// obj.currentTime: 获取歌曲当前的播放时间进度
			// obj.duration: 获取歌曲的总时长
			nowTimer = setInterval( timeUpdate, 500 );
		};
		

		// 实时更新时间函数
		function timeUpdate(){
			var buffered, percent, onOff=true;
			// 已缓冲部分
			musicObj.readyState == 4 && ( buffered = musicObj.buffered.end( 0 ) );
			// 已缓冲百分百
			musicObj.readyState == 4 && ( percent = Math.round( buffered / musicObj.duration * 100 ) + '%' );

			// 当准备就绪后更新时间和进度条
			if( musicObj.readyState == 4 ){

				if( onOff ){
					jM.$( '.progress')[ 0 ].style.width = percent;
					if( percent == '100%' )onOff=false;
				}

				// 播放器右上角的时间实时显示最新播放进度剩下的时间
				timeCount.innerHTML = jM.getRealTime( musicObj.duration - musicObj.currentTime );
				if( onStopLoadBar )playingbar.style.width = musicObj.currentTime * 100 / musicObj.duration + '%';

				// console.log(musicObj.duration - musicObj.currentTime);
			if( ( musicObj.duration - musicObj.currentTime ) < 0.8 ) {
				musicObj.pause();
				clearInterval( nowTimer );
				// console.log(musicObj.currentTime);

				// 上一首播放结束，开始准备下一首
				// 循环遍历所有播放列表的音乐，当上一次播放结束后循环到下一首
				// 注意：此事件必须发生在每次添加了新的歌曲到播放列表之后
				// 要保证播放列表遍历的都是最新的	
				_loop.loop( nowId ); // 歌曲自动播放时的循环
			}}
		} // 实时更新时间函数结束

		/**
		 * ********************  控制面板 start  *************
		 */

		// 后退到上一首
		jM.$( '.ico-prev' )[ 0 ].onclick = function() {
			_loop.loop( nowId-2 );
		}

		// 前进到下一首
		jM.$( '.ico-next' )[ 0 ].onclick = function() {
			_loop.loop( nowId );
		}

		// 暂停与播放
		
		jM.$( '.tiny-panel-area' )[ 0 ].onclick = jM.$( '#playPause' ).onclick = function() {
			if( musicObj.paused ){
				musicObj.play();
				jM.$( '#playPause' ).className = 'ico-ctrl ico-playing';
				nowTimer = setInterval( timeUpdate, 500 );
				jM.addClass( jM.$( '#ico-tiny-state' ), 'ico-pause-state' );
				lyPanelDisplay( 'none' );
			
			} else {
				musicObj.pause();
				jM.$( '#playPause' ).className = 'ico-ctrl ico-play';
				clearInterval( nowTimer );
				jM.removeClass(jM.$( '#ico-tiny-state' ), 'ico-pause-state' );
				lyPanelDisplay( 'block' );
			}
		}

		var timerLyricfold;
		// ???
		jM.$( '.tiny-panel-area' )[ 0 ].onmouseover = function() {
			clearTimeout( timerLyricfold );
			lyPanelDisplay( 'block' );
		}
		jM.$( '.tiny-panel-area' )[ 0 ].onmouseout = function() {
			if( musicObj.paused )return;
			timerLyricfold = setTimeout( function() {
					lyPanelDisplay( 'none' );
				},1000 );
		}

		// ????
		jM.$( '.tiny-fold-ctrl-area' )[ 0 ].onmouseover = function() {
			clearTimeout( timerLyricfold );
		}
		jM.$( '.tiny-fold-ctrl-area' )[ 0 ].onmouseout = function() {
			clearTimeout( timerLyricfold );
			if( musicObj.paused )return;
			timerLyricfold = setTimeout( function() {
				lyPanelDisplay( 'none' );
			}, 1000 );
		}

		// 声音控制panel  .ctrl-bar jM.getPos()  musicObj.volume
		var volumeW = jM.$('.ctrl-bar')[0].offsetWidth,
			volCache = 1; // 初始化音量
		jM.$( '.vol-ctrl a' )[ 0 ].onclick = function() {
			if( jM.hasClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' ) )
			{
				musicObj.volume = volCache;
				jM.$( '.cur-volmute' )[ 0 ].style.width = volCache*100 + '%';
				jM.removeClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' );
			} else {
				jM.addClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' );
				jM.$( '.cur-volmute' )[ 0 ].style.width = 0 + '%';
				musicObj.volume = 0;
			}

		}
		jM.$( '.ctrl-bar' )[ 0 ].onmousedown = function( ev ) {
				var ev = ev || window.event;
				var voL = jM.getPos( this ).left;
					volCache = ( ev.clientX - voL ) / volumeW;
					volCache = volCache > 1 ? 1 : volCache < 0 ? 0 : volCache;

				volumeFn( volCache );

				function volumeFn( volCache ) {

					if( volCache == 0 ){
							jM.addClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' );
					} else {
						if( jM.hasClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' ) )
						{
						 jM.removeClass( jM.$( '.vol-ctrl a' )[ 0 ], 'ico-mute' );
						}
					}

					musicObj.volume = volCache;
					jM.$( '.cur-volmute' )[ 0 ].style.width = volCache * 100 + '%';
				}
			document.onmousemove = function( ev ) {
				var ev = ev || window.event;
				volCache = ( ev.clientX - voL ) / volumeW;
				volCache = volCache > 1 ? 1 : volCache < 0 ? 0 : volCache;
				volumeFn( volCache );
			}
			document.onmouseup = function() {
				document.onmouseup = document.onmousemove = null;
			}
			return false;
		}
		/**
		 * ********************  控制面板 end  **************
		 */

		// 鼠标在进度条上面的位置
		var timeBar   = jM.$( '.time-bar' )[ 0 ], 
			timeArrow = jM.$('.layer-time')[ 0 ];
		var tBarWidth = timeBar.offsetWidth;

		// 鼠标在进度条移动的事件
		function barOver( ev ) {
			this.onmousemove = function() {
			var ev = ev || window.event; 
			var layerX = ev.clientX;
			timeArrow.style.display = 'block';
		    timeArrow.innerHTML  = jM.getRealTime( layerX * musicObj.duration / tBarWidth );
		    timeArrow.style.left = layerX - 20 + 'px';
			}
		}

		// 当鼠标会拖动进度条的时候的事件
		function dragProgress( ev ) {
			clearInterval( nowTimer );
			var ev = ev || window.event;
			var layerX = ev.clientX, perCent; 
			perCent = layerX/tBarWidth;
			perCent = perCent > 1 ? 1 : perCent;
			jM.$( '.cur-time-bg' )[ 0 ].style.width = perCent * 100 + '%';
			// 进度条的拖拽事件
			document.onmousemove = function( ev ) {
				var ev = ev || window.event;
				clearInterval( nowTimer );
				perCent = ev.clientX / tBarWidth;
				perCent = perCent > 1 ? 1 : perCent;
				jM.$( '.cur-time-bg' )[ 0 ].style.width = perCent*100 + '%';
			}

			document.onmouseup = function() {
			document.onmouseup = document.onmousemove = null;
				musicObj.readyState == 4 && 
				( musicObj.currentTime = perCent*musicObj.duration );
				nowTimer = setInterval( timeUpdate, 500 );
			}
			return false;
		}

		// 对两起事件进行绑定
		jM.addEvent( timeBar, 'mouseover', barOver );
		jM.addEvent( timeBar, 'mousedown', dragProgress);

		// 重点提醒：当取消mover
		timeBar.onmouseout = function() {
			jM.removeEvent( timeBar, 'mouseover',barOver );
			timeArrow.style.display = 'none';
		}

		// 点击触发播放列表的歌曲
		for( var i=0; i<this.uLing.length; i++ ) {
			this.uLing[i].index = i;
			jM.addEvent( this.uLing[i], 'click', function() {
					var _this = this;
					_loop.playMusic( _this );
			});
		}

	} // 播放音乐函数结束

	// 播放列表的li   uLing, 
	// 新歌列表的li  uLnews, 
	// 搜索列表的li  uLi,
function sCallback( data ){
	this.data = data, this.uLing, this.uLnews, this.uLi;
}

// 函数中统一管理搜索获取的歌曲
function searchAjax() {
	searched = [];

	// 搜索时重置提示信息
	jM.$( '.ul-list' )[ 2 ].innerHTML = 
	'<p class="saySearching searchPercent">努力搜索中，请稍后</p>';

	jM.ajax( 'post', 
			'./php/smusic.php', 
			'limit=30&s=' + jM.$( '.ipt-text' )[ 0 ].value,
		function( data ) {
			// console.log(data);
			var da = JSON.parse( data );
			if( da.result ) {

			if( !da.result.songs ) { // 如果返回异常，则不进行歌曲筛选，因为根本就没有歌曲
				jM.$( '.ul-list' )[ 2 ].innerHTML = sStatus;
				sOnOff = false; // 还原开关，此开关用于控制在搜索期间不允许触发再次搜索事件，必须要等到上次搜索结束
				return;
			}
			var str = '', timer;
			songlist = da.result.songs;

			//
			(function iterator( i ) {

				clearTimeout( timer );

				// 搜索加载过程显示进度
				jM.$( '.searchPercent' )[ 0 ].innerHTML = '努力搜索中，请稍后' + Math.round( i*100/songlist.length ) + '%';
				
				//console.log(str);
				if( i == songlist.length ) {
					if(str != ''){
						jM.$( '.ul-list' )[ 2 ].innerHTML = str;

						// 缓存搜索到的音乐数据
					} else {
						jM.$( '.ul-list' )[ 2 ].innerHTML = '<p class="errorinfoMes"><i></i>jMusic遗憾的告诉你：你所搜索的歌曲在歌曲库没找到~</p>';
					}
					//sCallback( songlist );
					var callaback = new sCallback(searched);
						callaback.init();
					sOnOff = false;
					return;
				}

				// 核对音乐有效性的超时处理
				timer = setTimeout( function() {
					jM.$( '.ul-list' )[ 2 ].innerHTML = '<p class="errorinfoMes"><i></i>服务器网络不太好哟~</p>';
					sOnOff = false; // 网络故障，所以打开搜索禁止开关，可以继续重新搜索
					return;
				},8000 );

				// 用ajax检测接口的mp3过滤掉不能放的mp3
				jM.ajax( 'post', 
						 './php/smusic.php', 
						'relmusic=' + songlist[ i ].mp3Url,
				function(data){
					//console.log(data);
				var data = JSON.parse( data );
				if( data == '200' ){
					// 
					str += '<li class="li-item" objectid="'+songlist[ i ].id+'" action-type="list-select"><span class="music-name">'+songlist[ i ].name+'</span><span class="singer-name"><span>'+songlist[ i ].artists[ 0 ].name+'</span></span><span class="opt-box"><a href="javascript:void(0);" class="ico-like-lite ico-ctrl"></a><a href="javascript:void(0);" class="ico-share-lite ico-ctrl"></a></span></li>';
					searched.push(songlist[ i ]); // 将搜索到的音乐全部存入数组
				}
				iterator( i+1 );
				});

			})( 0 );

		}else{
			console.log('jMusic提醒：歌曲库为空或异常~');
			setTimeout( function() {
			jM.$( '.ul-list' )[ 2 ].innerHTML = sStatus;
			sOnOff = false; // 出现异常，所以打开搜索开关，可以继续搜索
			}, 2000 );
		}
	});
}




// 面板的打开与关闭函数
function panelFn( mark, obj, maxWidth ) {
	clearInterval( timer );
	var oPacity = mark;
	var timer = setInterval( function() {
		oPacity = mark ? oPacity - 0.1 : oPacity + 0.1;
		if( oPacity < (mark^1) ) {
			obj.style.width = mark ? '0px' : maxWidth;
			oPacity = ( mark^1 );
			clearInterval( timer );
		}
		obj.style.opacity = oPacity;
	}, 20 );
}

/**
 * 歌单面板 start   .opt-btn  .ico-list
 */
var panel = jM.$( '.panel-area' )[ 0 ]; // 面板对象
// 窗口面板的关闭
jM.$('.opt-btn')[ 0 ].onclick = function() {
	if( panel.offsetWidth == 0 ) {
		return;
	}panelFn( 1, panel );
}

// 窗口面板的打开与关闭操作
jM.$( '.ico-list' )[ 0 ].onclick = function() {
	if( panel.offsetWidth > 0) {
		panelFn( 1, panel );
		return;
	}panelFn( 0, panel, '685px' );
}
/**
 * 歌单面板 end
 */

/*****************************************/

/**
 * 歌词面板 start    .close-lyric  .ico-lyric-open
 */
var lyricPanel = jM.$( '.lyric-wrap' )[ 0 ];
jM.$( '.close-lyric' )[ 0 ].onclick = function() {
	if( lyricPanel.offsetWidth == 0 ) {
		return;
	}panelFn( 1, lyricPanel );
}
jM.$( '.ico-lyric-open' )[ 0 ].onclick = function() {
	if( lyricPanel.offsetWidth > 0 ) {
		panelFn( 1, lyricPanel );
		return;
	}panelFn( 0, lyricPanel, '200px' );
}

/**
 * 播放控制按钮面板 start
 */
function lyPanelDisplay( style ) {
	jM.$( '.tiny-panel-area .mask' )[ 0 ].style.opacity = style == 'none' ? 0 : 1;
	  jM.$( '.tiny-fold-ctrl-area' )[ 0 ].style.display = style;
	       jM.$( '.ico-tiny-state' )[ 0 ].style.display = style;
}

jM.$( '.fold-ctrl-area' )[ 0 ].onclick = function() {
	var timer = 0;
	if( panel.offsetWidth > 0 || lyricPanel.offsetWidth > 0 )timer=600;
	panelFn( 1, panel );
	panelFn( 1, lyricPanel );
	if ( musicObj.paused ) {
		lyPanelDisplay( 'block' );
		jM.removeClass( jM.$('#ico-tiny-state' ), 'ico-pause-state' );
	} else {
		lyPanelDisplay( 'none' );
		   jM.addClass( jM.$( '#ico-tiny-state' ), 'ico-pause-state' );
	}
	setTimeout( function() {
			   jM.$( '.i_mplayer')[ 0 ].style.left = '-690px';
		setTimeout(function() {
			jM.$( '.PCD-mplayer' )[ 0 ].style.left = '0px';
		}, 500 );
	}, timer);
}

jM.$( '.tiny-fold-ctrl-area' )[ 0 ].onclick = function() {
	    jM.$( '.PCD-mplayer' )[ 0 ].style.left = '-66px';
	setTimeout(function(){
		  jM.$( '.i_mplayer' )[ 0 ].style.left = '0px';
	}, 300);
}

jM.$( '#playMode' ).onclick = function() {
	jM.$( '.layer-loop' )[ 0 ].style.display = 'block';
}

var layerLoop = jM.$( '.layer-loop .ico-ctrl' );
for( var i=0; i<layerLoop.length; i++ ) {
	layerLoop[ i ].index = i;
	layerLoop[ i ].onclick = function() {
		for( var j=0; j<jloop.length; j++ ) {
			jloop[ j ] = false;
		}
		jloop[ this.index ] = true;
		var oClass = this.index == 0 ? 'ico-rand' : this.index == 1 ? 'ico-solo' : 'ico-loop';
		jM.$( '.layer-loop' )[ 0 ].style.display = 'none';
		jM.$( '#playMode' ).className = 'ico-ctrl '+ oClass;
	}
}


}
})( window );