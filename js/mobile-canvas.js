/*=======================================
* モバイルCanvasLIBRARY
* (c) 2013 CROOZ All Rights Reserved
*
*	@author マト
=========================================*/
//セレクトを無効させる
$.fn.extend({
	disableSelection : function() {
		this.each(function() {
			this.onselectstart = function() { return false; };
			this.unselectable = "on";
			$(this).css('-moz-user-select', 'none');
			$(this).css('-webkit-user-select', 'none');
		});
	}
});

//次のアニメーションフレームを要求する
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

var UTILITY = {
	PIXEL_RATIO: 1,					//ピクセル密度 RETINA=2 NORMAL=1
	ASPECT_RATIO: 1,				//アスペクト比
	PIXEL_ASPECT: 1,				//ピクセル密度とアスペクト比
	MAX_ASPECT_RATIO: 2,			//最上限のアスペクト比
	LOADING_MESSAGE: "Loading",		//ロード中のメッセージ
	FRAME_RATE: 60,					//アニメーションのフレーム数
	FRAME_SKIP: 1,					//フレームをスキップさせる数。１通常
	BGWIDTHRATIO: 2,
	BGHEIGHTRATIO:5,
	
	random: function( param ){
		return Math.round(Math.random() * param);
	},
	
	getCircleQuadrant: function( x, y){
		if((x == 0)&&(y == 0))
			return -1;
		else if((x > 0)&&(y <= 0))
			return 1;
		else if((x <= 0)&&(y <= 0))
			return 2;
		else if((x <= 0)&&(y > 0))
			return 3;
		else
			return 4;
	},
	
	getDeviceType: function(){
		var ua = navigator.userAgent;
		if(ua.match(/iPhone|iPod/i)) return 'iPhone';
		if(ua.match(/iPad/i)) return 'iPad';
		if(ua.match(/Android/i)) return 'Android';
		if(ua.match(/BlackBerry/i)) return 'BlackBerry';
		if(ua.match(/IEMobile/i)) return 'Windows Phone';
		if(ua.match(/Macintosh/i)) return 'Desktop';
		return 'Untested Device';
	},
	
	getAngle: function( frame ){
		var degree = Math.atan2(frame.x - 160, frame.y - 160) * (180 / Math.PI) - 90;
		if(degree < 0)
			return degree + 360;
		else
			return degree;
	},
	
	getPositionInEllipsePath: function(angle, ellipse){
		var delta = (360 - angle) * (Math.PI / 180);
		return {
			x: ellipse.centerX + (ellipse.semimajor * Math.cos(delta)),
			y: ellipse.centerY + (ellipse.semiminor * Math.sin(delta))
		};
	}
};


//主のCanvasオブジェクト
var Canvas = function( param ){

	if( !param ) param = {};

	//Canvasのプロパティの初期値化
	var canvas = {
		id: param.id || 'cnv_' + new Date().getTime(),				//CanvasのID
		container: param.container || 'canvas',									//親のDIVタッグ
		isLoading: true,											//Canvasのロード状態
		frame: param.frame || {	x:0, y:0, width:320, height:420},	//親DIVによるのCanvasの位置
		sprites: []													//Canvasのスプライト画像
	};

	//Canvasの初期化
	var init = function(){
		
		//CanvasのDOMオブジェクト作成
		canvas.instance = document.createElement( 'canvas' );
		canvas.instance.setAttribute( 'id', canvas.id );
		canvas.context = canvas.instance.getContext( '2d' );
		
		//ピクセル密度取得
		var devicePixelRatio =	window.devicePixelRatio || 1,
	    backingStoreRatio =	canvas.context.webkitBackingStorePixelRatio ||
						    canvas.context.mozBackingStorePixelRatio ||
						    canvas.context.msBackingStorePixelRatio ||
						    canvas.context.oBackingStorePixelRatio ||
						    canvas.context.backingStorePixelRatio || 1;
		UTILITY.PIXEL_RATIO = devicePixelRatio / backingStoreRatio;
		
		//ピクセル密度によるCANVASのサイズを決定
		canvas.context.scale( UTILITY.PIXEL_RATIO, UTILITY.PIXEL_RATIO );
		canvas.instance.style.position = 'relative';
		canvas.instance.style.top = canvas.frame.y + 'px';
		canvas.instance.style.left = canvas.frame.x + 'px';		
		canvas.resize();
		
		//ロード中画面を表示する
		canvas.showLoadingScreen( false );
		
		//CanvasをDOMに入れる
		document.getElementById( canvas.container ).appendChild( canvas.instance );
		canvas.reposition();
		
		//Canvasの選択防止
		$( canvas.instance ).disableSelection();
		
		//イベントの定義
		canvas.events = new TouchEvents( canvas );
	};
	
	//Canvasのサイズを定義
	canvas.resize = function(){
		UTILITY.ASPECT_RATIO = document.documentElement.clientWidth / this.frame.width;
		UTILITY.ASPECT_RATIO = (UTILITY.ASPECT_RATIO > UTILITY.MAX_ASPECT_RATIO) ? 
								UTILITY.MAX_ASPECT_RATIO: UTILITY.ASPECT_RATIO;
		UTILITY.PIXEL_ASPECT = UTILITY.PIXEL_RATIO * UTILITY.ASPECT_RATIO;
		this.instance.style.width = this.frame.width * UTILITY.ASPECT_RATIO + 'px'; 	
		this.instance.style.height = this.frame.height * UTILITY.ASPECT_RATIO + 'px';
		this.instance.setAttribute('width', this.frame.width * UTILITY.PIXEL_ASPECT);
		this.instance.setAttribute('height', this.frame.height * UTILITY.PIXEL_ASPECT);
	};
	
	//Canvasの位置を取得
	canvas.reposition = function(){
		var canvas_position = $('#' + this.container).position();
		this.CANVAS_X = this.round(canvas_position.left);
		this.CANVAS_Y = this.round(canvas_position.top);
	};
	
	//ロード中の画面を表示する
	canvas.showLoadingScreen = function( animate ) {
		this.context.textAlign = 'center';
		this.context.textBaseline = 'center';
		this.context.beginPath();
		
		if( !animate ){
			displayMessage( UTILITY.LOADING_MESSAGE );
		}else{
			//ロードメッセージをアニメーションさせる
			var count = 1;
			var text = [ UTILITY.LOADING_MESSAGE, '.' ];
			return setInterval (function(){
				displayMessage( text.join('') );
				count++;
				text.push('.');
				if(count>=4){
					count = 0;
					text = [ UTILITY.LOADING_MESSAGE ];
				}	
			},500);
		}
	};
	
	var displayMessage = function( param ){
		var centerX = ( canvas.frame.width / 2 ),
			centerY = ( canvas.frame.height / 2 );
		
		//ロードメッセージを固定に表示
		canvas.context.fillStyle = 'black';
		canvas.context.fillRect( 0, 0, canvas.frame.width * UTILITY.PIXEL_ASPECT,
									   canvas.frame.height * UTILITY.PIXEL_ASPECT );
		canvas.displayText( {text: param, x: centerX, y:centerY, size:20 });
	};
	
	canvas.displayText = function( param ){
		this.context.font = [ 'bold ',((param.size || 12 ) * UTILITY.PIXEL_ASPECT), 'px Calibri' ].join( '' );
		this.context.fillStyle = param.color || 'white';
		this.context.globalAlpha = param.opacity || 1;
		this.context.fillText( param.text, param.x  * UTILITY.PIXEL_ASPECT, param.y  * UTILITY.PIXEL_ASPECT);
		this.context.globalAlpha = 1;
	};
	
	//スプライトをCanvas上に追加する
	canvas.addSprite = function( param ){
		param.setDrawingCanvas( this );
		this.sprites.push( param );
	};
	
	canvas.getSprite = function( param ){
		for(var i=0; i < this.sprites.length; i++){
			if(this.sprites[i].name === param) return this.sprites[i];
		}
	};

	//全部スプライトを全部表示する
	var isLoadingScreen = false;
	canvas.paint = function(){
		if( this.sprites.length === 0 ) throw ( "[ERROR] There are no sprites on the canvas" );
		
		//画像はまだキャシング中の場合はロード画面の表示
		if( this.isLoading ){
			if(!isLoadingScreen){
				isLoadingScreen = true;
				var loadingScreen = this.showLoadingScreen( true );
				var wait = 0;
				wait = setInterval (function(){
					if( !isLoading() ){
						clearInterval( loadingScreen );
						clearInterval( wait );
						canvas.isLoading = false;
						paint();
					}
				}, 150);
			}
		}else{
			paint();
		}
	};
	
	//スプライトを全部表示する
	var paint = function(){
		canvas.clear();
		for( var i = 0; i < canvas.sprites.length; i++ ){
			canvas.sprites[ i ].paint();
		}
	};
	
	//Canvas上に画像表示
	canvas.draw = function( img, opacity, item, screen ){
		this.context.globalAlpha = opacity;
		this.context.drawImage( img, item.x, item.y, item.width, item.height, 
				screen.x, screen.y, screen.width, screen.height );
	};

	//Canvasをクリアする
	canvas.clear = function(){
		this.context.clearRect( 0, 0, this.frame.width * UTILITY.PIXEL_ASPECT, 
									  this.frame.height * UTILITY.PIXEL_ASPECT );
	};
	
	//Floating防止
	canvas.round = function( param ){
		return ( 0.5 + param ) << 0;
	};
	
	//画像がキャシング中かチェックする
	var isLoading = function(){
		for( var i = 0; i < canvas.sprites.length; i++ ){
			if( canvas.sprites[ i ].isLoading )
				return true;
		}
		return false;
	};

	//Canvasオブジェクトを継続させる
	if( param.extend ){
		var fn = window[ param.extend.name ];
		if(typeof fn === 'function') {
		    fn( canvas, param.extend.param );
		}
	};
	
	//初期化
	init();
	
	return canvas;
};

//スプライトの主なクラス
var Sprite = function( param ){
	
	//エラー処理
	if( !param ) throw( "A sprite object is required." );
	if( !param.src ) throw( "An image source is required." );
	
	//スプライトを初期化する
	var sprite = {
		name: param.name,						//名前かラベル
		isLoading: true,						//画像が表示中かどうか
		visible: param.visible || true,			//表示させるか
		tap: false,								//指にタッチしたか
//		size: param.size,						//表示サイズの倍数 0.5 = 50%
		wsize: param.wsize || param.size || 1,	//横表示サイズの倍数 0.5 = 50%
		hsize: param.hsize || param.size || 1,	//幅表示サイズの倍数 0.5 = 50%
		opacity: param.opacity || 1,
		rotation: param.rotation || -1,
		frame: param.frame || undefined, 		//キャンバスにの表示の位置
		event: param.event || {},				//イベントの定義
		status: param.status || 'idle',
		current: param.current || 0,			//現在の表示している画像
		actions: param.actions || {idle:[]}
	};
	
	//スプライトを初期化させる
	var init = function(){
		//画像をキャッシュにロードする
		var _img = new Image();
		_img.src = param.src;
		_img.onerror = function() { 
			console.log( "CRIT: IMAGE NOT FOUND! " + param.src );
		};
		_img.onload = function(){
			sprite.instance = _img;
			sprite.isLoading = false;
			if(sprite.frame == undefined)
				sprite.frame = { x:0, y:0, width:_img.width, height:_img.height };
			else{
				if(!sprite.frame.width) sprite.frame.width = _img.width;
				if(!sprite.frame.height) sprite.frame.height = _img.height;
			}
			
			//画像がのマッピングを定義
			//画像はスプライトじゃない場合はmapの定義をする必要ない
			if( sprite.actions[sprite.status].length == 0 ){
				sprite.actions[sprite.status].push({
					map: {
						x: 0,
						y: 0,
						width: sprite.frame.width,
						height: sprite.frame.height
					},
				    adjust:{
				    		width: 0,
				    		height: 0,
				    		x: 0,
				    		y:0
				    }
				});
			}
		};
	};
	
	//スプライトの親CANVASを定義
	sprite.setDrawingCanvas = function( param ){
		this.drawingCanvas = param;
		init();
	};
	
	//スプライトをCanvasに表示
	sprite.paint = function( param ){
		if(( !this.visible ) || ( this.opacity == 0 ))  return;
		if( !param ) param = this.current;
		
		if(this.rotation < 0){
			//画像			スプライトの区域			Canvasの位置
			this.drawingCanvas.draw( this.instance, this.opacity, this.actions[this.status][this.current].map, this.getCoordinates());
		}else{
			rotate();
		}
		
		this.current++;
		if( this.current >= this.actions[this.status].length)
			this.current = 0;
	};
	
	sprite.rotate = function( rotation, repaint ){
		if(rotation < 0) return;
		this.rotation = rotation;
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	sprite.setOpacity = function(param, repaint){
		this.opacity = param;
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	sprite.moveAtAngularPath = function(speed, angle, repaint){
		var delta = (360 - angle) * (Math.PI  / 180);
		this.move(this.frame.x + (speed * Math.cos(delta)), 
				  this.frame.y + (speed * Math.sin(delta)), 
				  repaint);
	};
	
	sprite.setAction = function( param ){
		if(this.status === param) return;
		
		this.status = param;
		this.current = 0;
	};
	
	var rotate = function(){
		var canvas = sprite.drawingCanvas;
		var screen = sprite.getCoordinates();
	
		canvas.context.save();
		canvas.context.translate((screen.width/2) + screen.x, (screen.height/2) + screen.y);
		canvas.context.rotate(-1 * (Math.PI / 180) * sprite.rotation);
		
		screen.x = -(screen.width/2);
		screen.y = -(screen.height/2);
		
		canvas.draw( sprite.instance, sprite.opacity, sprite.actions[sprite.status][sprite.current].map, screen);
		canvas.context.restore();
	};
	
	//スプライトのサイズを弄る
	//repaintはtrueだとすぐに反映させる
	sprite.scale = function( param1, param2, repaint ){
		if(!param2){
			this.wsize = param1;
			this.hsize = param1;
		}else{
			this.wsize = param1;
			this.hsize = param2;
		}
		
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	sprite.scaleHeight = function( param, repaint ){
		this.hsize = param;
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	sprite.scaleWidth = function( param, repaint ){
		this.wsize = param;
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	//スプライトを移動させる
	//repaintはtrueだとすぐに反映させる
	sprite.move = function( x, y, repaint ){
		this.frame.x = x;
		this.frame.y = y;
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	//スプライトのCanvasによるの位置
	sprite.getCoordinates = function(){
		var	width = (this.frame.width + this.actions[this.status][this.current].adjust.width) * sprite.wsize,
			height = (this.frame.height + this.actions[this.status][this.current].adjust.height) * sprite.hsize;
		return {
			width: width * UTILITY.PIXEL_ASPECT,
			height: height * UTILITY.PIXEL_ASPECT,
			x:  ((this.frame.x + this.actions[this.status][this.current].adjust.x)  - (width / 2)) * UTILITY.PIXEL_ASPECT,
			y:  ((this.frame.y + this.actions[this.status][this.current].adjust.y)  - (height / 2)) * UTILITY.PIXEL_ASPECT
		};
	};
	
	//継続させる
	if( param.extend ){
		var fn = window[ param.extend.name ];
		if(typeof fn === 'function') {
		    fn( sprite, param.extend.param );
		}
	};
	
	return sprite;
};

//タッチイベントクラス
var TouchEvents = function( canvas ){
	
	var touch = {
		id: -1,						//指のIDの定義
		x: {start: 0, end: 0},		//タッチし始めるの指の位置
		y: {start:0, end: 0}		//タッチし終わるの指の位置
	},
	CONSECUTIVE_TOUCH = 1;			//指の同時タッチの定義
	
	//タッチし始めるのイベントを起こす
	canvas.instance.addEventListener( 'touchstart' , function( event ) {
		for ( var i = 0; i < event.changedTouches.length; i++ ) {
			if(i >= CONSECUTIVE_TOUCH) return;
			
			//指の定義
			var finger = event.changedTouches[ i ];
			touch.x.start = finger.pageX - canvas.CANVAS_X;
			touch.y.start = finger.pageY - canvas.CANVAS_Y;
			
			for(var j = 0; j < canvas.sprites.length; j++){
				var sprite = canvas.sprites[ j ];
				
				//スプライトがタップイベントがあれば、タッチされたかのチェック処理
				if( sprite.event.tap ){
					if( touch.isTouched( touch.x.start, touch.y.start, getSquareBounds( sprite.getCoordinates() ) ) ){
						if( !sprite.tap )	sprite.tap = true;
					}
				}
			}
		}
	});
	
	function preventDefault(e) { 
		e.preventDefault();
	};

	
	//指をスライドさせる処理
	canvas.instance.addEventListener( 'touchmove', function( event ) {
		for ( var i = 0; i < event.changedTouches.length; i++ ) {
			if( i >= CONSECUTIVE_TOUCH ) return;
			
			//指の定義
			var finger = event.changedTouches[ i ],
				endX = finger.pageX - canvas.CANVAS_X,
				endY = finger.pageY - canvas.CANVAS_Y;
			
			for( var j = 0; j < canvas.sprites.length; j++ ){
				var sprite = canvas.sprites[ j ];
				
				//スプライトがドラッグイベントがあれば、タッチ区域にタッチされたかのチェック処理
				if( sprite.event.dragging ){
					//if( touch.isTouched( touch.x.end, touch.y.end, getSquareBounds( sprite.getCoordinates() ) ) ){
						//画面を動かす防止
					//	event.preventDefault();
						//ドラッグイベントを起こす
					//	touch.dragging( sprite );
					//}
				}else if( sprite.event.dragged ){
					if( sprite.tap ){
						//画面を動かす防止
						var antislip = touch.x.start - endX;
						if((antislip >= 10)||(antislip <= -10)){
							canvas.instance.addEventListener('touchmove', preventDefault, false);
							sprite.drag = true;
							sprite.tap = false;
						}
					}
				}
			}
		}
	}, false );
	
	canvas.instance.addEventListener( 'touchend', function( event ) {
		
		for ( var i = 0; i < event.changedTouches.length; i++ ) {
			if( i >= CONSECUTIVE_TOUCH ) return;
			
			//指の定義
			var finger = event.changedTouches[ i ];
			touch.x.end = finger.pageX - canvas.CANVAS_X;
			touch.y.end = finger.pageY - canvas.CANVAS_Y;
		}
		
		var sprite = {};
		for(var i = 0; i < canvas.sprites.length; i++ ){
			sprite = canvas.sprites[i];
			if(sprite.drag){
				canvas.instance.removeEventListener('touchmove', preventDefault, false);
				sprite.drag = false;
				
				var result = touch.x.start - touch.x.end;
				if( result >= 10 ){ //１０はドラッグの敏感値高ければ高い程鈍くなる
					touch.dragged( sprite, 'left' );
				}else if( result <= -10 ){
					touch.dragged( sprite, 'right' );
				}
			}else if(sprite.tap){
				sprite.tap = false;
				var result = touch.y.start - touch.y.end;
				if((result<=6)&&(result>=-6)){
					touch.tap( sprite );
				}
			}
		}
	},false);
	
	//タップイベントを起こす
	touch.tap = function( param ){
		//継続クラスにより、イベントを処理する
		for( var i = 0; i < param.event.tap.length; i++ ){
			param[ param.event.tap[ i ].name ]( param.event.tap[ i ].param, this.x, this.y );
		}
	};
	
	//スプライトをドラッグされた
	touch.dragged = function( param, direction ){
		//継続クラスにとり、イベントを処理する
		for( var i = 0; i < param.event.dragged.length; i++ ){
			param[ param.event.dragged[ i ].name ]( param.event.dragged[ i ].param, direction, this.x, this.y );
		}
	};
	
	//スプライトをドラッグ中
	touch.dragging = function( param ){
		//if( param.tap ){
		//	param.tap = false;
		//	touch_timer = stopTimer( touch_timer );
		//}
		
		//継続クラスにとり、イベントを処理する
		//for( var i = 0; i < param.event.dragging.length; i++ ){
		//	param[ param.event.dragging[ i ].name ]( param.event.dragging[ i ].param, this.x, this.y );
		//}
	};
	
	//オブジェクトのサイズにより四角の領域を取得
	var getSquareBounds = function( bounds ){
		return {
			lx: ( bounds.x / UTILITY.PIXEL_RATIO ),
			ux: ( ( bounds.x + bounds.width ) / UTILITY.PIXEL_RATIO ),
			ly: ( bounds.y / UTILITY.PIXEL_RATIO ),
			uy: ( ( bounds.y + bounds.height ) / UTILITY.PIXEL_RATIO )
		};
	};
	
	//タッチ領域に触れたか
	touch.isTouched = function( x, y, map ){
		return ( ( x > map.lx ) && ( x < map.ux ) && ( y > map.ly ) && ( y < map.uy ) ) ? true: false;
	};
	
	return touch;
};