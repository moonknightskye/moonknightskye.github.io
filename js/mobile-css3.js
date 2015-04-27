
function CSS3Game( param ){
	var game = {
			status: "loading",
			frame: param.frame || { x:0, y:0, width:320, height:320 },
			bgcolor: param.bgcolor || "black",
			scenes: [],
			fps: param.fps || 12
	};
	
	var init = function(){
		
		game.frame.position = "relative";
		game.instance = document.getElementById("css3game");
		game.resize();
		game.reposition();
		game.instance.style.cssText = getCSS();
		
		//LOADING SCREEN
		game.loading = document.createElement( 'div' );
		game.loading.setAttribute( 'id', "css3game_loading" );
		game.loading.style.cssText = UTILITY.getCSS( {bgcolor: "#3b3b3b", frame: game.frame, zindex:99} );
		game.loadingText = document.createElement( 'label' );
		game.loadingText.setAttribute( 'id', "loading_txt" );
		game.loadingText.style.cssText = "color: #616161 ; font-family: 'HelveticaNeue-UltraLight', serif; font-size: 50px ; background: #3b3b3b ; " +
				"text-shadow: -1px 0px #2f2f2f,0px -1px #2f2f2f,1px -2px #2f2f2f,2px -3px #2f2f2f,3px -4px #2f2f2f,4px -5px #2f2f2f,5px -6px #2f2f2f," +
				"0px 1px #2f2f2f,1px 0px #2f2f2f,2px -1px #2f2f2f,3px -2px #2f2f2f,4px -3px #2f2f2f,5px -4px #2f2f2f,6px -5px #2f2f2f;";

		game.loadingText.innerHTML = UTILITY.LOADING_MESSAGE;
		game.loading.appendChild( game.loadingText );
		game.instance.appendChild( game.loading );
		
		game.showLoadingScreen();
		
		$( game.instance ).disableSelection();
		$( game.loading ).disableSelection();
	};
	
	var isLoadingScreenAnimating = false;
	game.showLoadingScreen = function(){
		if(isLoadingScreenAnimating) return;
		game.pause();
		
		this.loading.style.width = game.frame.width + "px";
		this.loading.style.height = game.frame.height + "px";
		this.loadingText.innerHTML = UTILITY.LOADING_MESSAGE;
		isLoadingScreenAnimating = true;
		animateLoadingScreen();
		this.loading.style.opacity = 1.0;
	};
	
	game.hideLoadingScreen = function(){
		isLoadingScreenAnimating = false;
		this.loading.style.cssText = [this.loading.style.cssText, " -webkit-transition: opacity 1s ease-in-out; opacity: 0;"].join("");
		this.loading.addEventListener("webkitTransitionEnd", function(){game.loading.style.width = "0px";game.loading.style.height = "0px";game.loadingText.innerHTML = "";}, false);
		//-webkit-transform: rotate(7deg) scale(2,2);
		this.loading.style.opacity = 0;
	};
	
	game.addScene = function( param ){
		this.showLoadingScreen();
		this.scenes.push( param );
		param.init( );
	};
	
	var isStarted = false;
	game.start = function( ){
		if(isStarted){
			alert("ERROR: GAME ALREADY STARTED!");
			return;
		}
		
		isStarted = true;
		this.status = "playing";
	};
	
	game.resize = function(){
		UTILITY.ASPECT_RATIO = document.documentElement.clientWidth / this.frame.width;
		UTILITY.ASPECT_RATIO = (UTILITY.ASPECT_RATIO > UTILITY.MAX_ASPECT_RATIO) ? 
								UTILITY.MAX_ASPECT_RATIO: UTILITY.ASPECT_RATIO;
	};
	
	game.reposition = function(){
		var position = $(this.instance).position();
		this.CONTAINER_X = UTILITY.round(position.left);
		this.CONTAINER_Y = UTILITY.round(position.top);
	};
	
	var counter = 0;
	var isRunning = false;
	game.resume = function(){
		run();
	};
	
	game.pause = function(){
		isRunning = false;
	};
	
	var getCSS = function(){
		return [
		           "-webkit-transform: scale(", UTILITY.ASPECT_RATIO, "); ",
		           "-webkit-transform-origin: 0% 0% ; " ,
		           "overflow: hidden; ",
		           UTILITY.getCSS(game)
		].join("");
	};
	
	function run(){
		var now;
		var then = Date.now();
		var INTERVAL = 1000 / game.fps;
		var delta;
		
		isRunning = true;
		var animate = function(){
			if(!isRunning) return;
			
			requestAnimFrame(function() {
				animate();
			});

		    now = Date.now();
		    delta = now - then;

		    if (delta > INTERVAL) {
		        then = now - (delta % INTERVAL);
		        
		        for(var i=0; i < game.scenes.length; i++){
		        	game.scenes[i].run( counter );
		        }
		        
		        counter++;
		    }
		};
		
		animate();
	};
	
	function animateLoadingScreen(){
		var FRAME_RATE = 2;
		var now;
		var then = Date.now();
		var INTERVAL = 1000 / FRAME_RATE;
		var delta;
		
		var count = 0;
		var loadingText;
		var animate = function(){
			if(!isLoadingScreenAnimating) return;
			
			requestAnimFrame(function() {
				animate();
			});

		    now = Date.now();
		    delta = now - then;

		    if (delta > INTERVAL) {
		        then = now - (delta % INTERVAL);
		        
		        loadingText = [UTILITY.LOADING_MESSAGE];
		        for(var i=0; i<count; i++){
		        	loadingText.push(".");
		        }
		        
		        game.loadingText.innerHTML = loadingText.join("");
		        
		        count++;
		        if( count > 3)
		        	count = 0;
		        
		        //check for the loading status of the objects
		        if((!isPreloading()&&isStarted)){
		        	game.hideLoadingScreen();
		        	game.resume();
		        }
		    }
		};
		
		animate();
	};
	
	var isPreloading = function(){
		for(var i = 0; i < game.scenes.length; i++){
			for(var j = 0; j < game.scenes[i].sprites.length; j++){
				if(game.scenes[i].sprites[j].isLoading) return true;
			}
		};
		
		return false;
	};
	
	init();
	
	return game;
};


function Scene( param ){
	
	var scene = {
		name: param.name, 											//this should not contain spaces
		bgcolor: param.bgcolor || "black",
		frame: param.frame || { x:0, y:0, width:320, height:320 },
		sprites: [],
		overflow: "hidden"
	};
	
	scene.init = function( ){
		scene.instance = document.createElement( 'div' );
		scene.instance.setAttribute( 'id', scene.name );
		scene.instance.style.cssText = UTILITY.getCSS( scene );// + "-webkit-transform: rotate(7deg) scale(2,2);";
		UTILITY.getGame().instance.appendChild( scene.instance );
		
		if( param.extend ){
			if(typeof window[ param.extend.name ] === 'function') {
				scene.initExtension();
			}
		};
	};
	
	scene.addSprite = function( param ){
		UTILITY.getGame().showLoadingScreen();
		param.setScene( this );
		this.sprites.push( param );
	};
	
	scene.removeSprite = function( param ){
		var sprite = {}
		if( typeof param === 'string' )
			sprite = this.getSprite( param );
		else
			sprite = param;
			
		for(var i=0; i < this.sprites.length; i++){
			if( sprite.name === this.sprites[i].name ){
				this.sprites.splice( i, 1 );
				sprite.destroy();
				break;
			}
		}
	};
	
	scene.getSprite = function( param ){
		for(var i=0; i < this.sprites.length; i++){
			if(this.sprites[i].name === param) return this.sprites[i];
		}
	};
	
	scene.run = function( counter ){
		for(var i=0; i < this.sprites.length; i++){
			this.sprites[i].run( counter );
		}
	};
	
	//継続させる
	if( param.extend ){
		var fn = window[ param.extend.name ];
		if(typeof fn === 'function') {
		    fn( scene, param.extend.param );
		}
	};
	
	return scene;
};

function Sprite( param ){
	
	var trnsl8_wrapper = {},
		scle_wrapper = {},
		rot8_wrapper = {};
	
	var sprite = {
			name: param.name,						//名前かラベル
			isLoading: true,						//画像が表示中かどうか
			zindex: param.zindex,
//			tap: false,								//指にタッチしたか
//			size: param.size,						//表示サイズの倍数 0.5 = 50%
			wsize: param.wsize || param.size || 1,	//横表示サイズの倍数 0.5 = 50%
			hsize: param.hsize || param.size || 1,	//幅表示サイズの倍数 0.5 = 50%
			opacity: param.opacity || 1,
			rotation: param.rotation || 0,
			frame: param.frame || undefined, 		//キャンバスにの表示の位置
//			event: param.event || {},				//イベントの定義
			status: param.status || 'idle',
			current: param.current || 0,			//現在の表示している画像
			actions: param.actions || {idle:[]},
			isOpacityChange: false
	};
	
	var init = function( ){
		//画像をキャッシュにロードする
		var _img = new Image();
		//_img.setAttribute( 'id', sprite.name );
		_img.src = param.src;
		_img.onerror = function() { 
			console.log( "CRIT: IMAGE NOT FOUND! " + param.src );
		};
		_img.onload = function(){
			sprite.IMAGE = _img;
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
			
			sprite.instance = document.createElement( 'div' );
			sprite.instance.setAttribute( 'id', sprite.name );
			sprite.instance.style.cssText = getCSS( );
			//console.log(sprite.instance.style.cssText);
			sprite.instance.addEventListener("webkitTransitionEnd", transitionEnd, false);
			
			//assign order of appearance
			if(!sprite.zindex)
				for(var key in sprite.scene.sprites){
					if(sprite.scene.sprites[key].name === sprite.name)
						sprite.zindex = key;
				}
		
			//move the sprite
			trnsl8_wrapper = UTILITY.createWrapper( [sprite.name, "_translate"].join("") );
			sprite.move({x:sprite.frame.x, y:sprite.frame.y});
			trnsl8_wrapper.addEventListener("webkitTransitionEnd", transitionEnd, false);
			
			//scale the sprite
			scle_wrapper = UTILITY.createWrapper( [sprite.name, "_scale"].join("") );
			sprite.scale({wsize: sprite.wsize, hsize: sprite.hsize});
			
			//rotate the sprite
			rot8_wrapper = UTILITY.createWrapper( [sprite.name, "_rotate"].join("") );
			sprite.rotate( {angle: sprite.rotation} );
			
			sprite.scene.instance.appendChild( trnsl8_wrapper );
			trnsl8_wrapper.appendChild( scle_wrapper );
			scle_wrapper.appendChild( rot8_wrapper );
			rot8_wrapper.appendChild( sprite.instance );
		
			if( param.extend ){
				if(typeof window[ param.extend.name ] === 'function') {
				    sprite.initExtensionOnImageLoad();
				}
			};
			
			sprite.isLoading = false;
		};
		
		if( param.extend ){
			if(typeof window[ param.extend.name ] === 'function') {
			    sprite.initExtension();
			}
		};
	};
	
	sprite.destroy = function( ){
		trnsl8_wrapper.removeEventListener("webkitTransitionEnd", transitionEnd, false);
		sprite.instance.removeEventListener("webkitTransitionEnd", transitionEnd, false);
		sprite.scene.instance.removeChild( trnsl8_wrapper );
		sprite = null;
	};
	
	function transitionEnd(e){
		if (e.propertyName == "opacity") {
			sprite.isOpacityChange = false;
		}
	};
	
	sprite.setAction = function( param ){
		if(this.status === param) return;
		
		this.status = param;
		this.current = 0;
	};
	
	sprite.setOpacity = function( param ){
		var anim = "";
		if(param.animate){
			sprite.isOpacityChange = true;
			anim = ["-webkit-transition: opacity ", Math.abs(this.opacity - param.opacity) * (param.speed || 500),"ms ease-in-out;"].join("");
		}
		this.opacity = param.opacity;
		
		this.instance.style.cssText = [anim, getCSS( )].join("");
	};
	
	sprite.run = function( counter ){
		//console.log(this.name);
		this.animate();
	};
	
	sprite.move = function( param ){
		var from = {x: this.frame.x, y: this.frame.y};
		var to = {x: param.x, y: param.y};
		
		this.frame.x = param.x;
		this.frame.y = param.y;
		param.x -= (this.frame.width / 2); // - (this.actions[this.status][this.current].adjust.x * this.wsize );
		param.y -= (this.frame.height / 2); //- (this.actions[this.status][this.current].adjust.y * this.hsize );
		
		var anim = "";
		if(param.animate){
			anim = getAnimationText((Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y))) * (param.speed || 5));
		}
		
		trnsl8_wrapper.style.cssText = [anim, UTILITY.getCSS({translate: param, zindex: sprite.zindex})].join("");
	};
	
	sprite.animate = function( counter ){
		
		if(UTILITY.getDeviceType() === "Android 2.x"){
			var anim = "";
			if(this.isOpacityChange){
				anim = ["-webkit-transition: opacity 500ms ease-in-out;"].join("");
			}
			this.instance.style.cssText = [anim, getCSS( )].join("");
		}
		else{
			var map = this.actions[this.status][this.current].map;
			//var adjust = this.actions[this.status][this.current].adjust;
			sprite.instance.style.backgroundPosition = [map.x, "px -", map.y, "px"].join("");
			sprite.instance.style.width = map.width + "px";
			sprite.instance.style.height = map.height + "px";
			//trnsl8_wrapper.style.top = adjust.y + "px";
			//trnsl8_wrapper.style.left = adjust.x + "px";
		}
		
		this.current++;
		if( this.current >= this.actions[this.status].length)
			this.current = 0;
	};
	
	sprite.rotate = function( param ){
		var anim = "",
			angle = param.angle;
		if(param.animate){
			if(param.direction === "clockwise")
				angle -= 360;
			anim = getAnimationText( (Math.abs(this.rotation - angle)) * (param.speed || 5) );
		}
		this.rotation = param.angle;
		
		rot8_wrapper.style.cssText = anim + UTILITY.getCSS({rotate: {rotation: angle}});
	};
	
	var getAnimationText = function( time ){
		return ["-webkit-transition: -webkit-transform ",time,"ms linear; "].join("");
	};
	
	sprite.scale = function( param ){
		var from = {wsize: this.wsize, hsize: this.hsize};
		var to = {wsize: param.wsize||param.size, hsize: param.hsize||param.size};
		
		this.wsize = to.wsize;
		this.hsize = to.hsize;
		
		var anim = "";
		if(param.animate){
			anim = getAnimationText((Math.max(Math.abs(from.wsize - to.wsize), Math.abs(from.hsize - to.hsize))) * (param.speed || 5));
		}
		scale(this.wsize, this.hsize, anim);
	};
	
	sprite.scaleHeight = function( param ){
		var anim = "";
		if(param.animate){
			anim = getAnimationText((Math.abs(this.hsize - param.hsize)) * (param.speed || 5));
		}
		
		this.hsize = param.hsize;
		scale(this.wsize, this.hsize, anim);
	};
	
	sprite.scaleWidth = function( param ){
		var anim = "";
		if(param.animate){
			anim = getAnimationText((Math.abs(this.wsize - param.wsize)) * (param.speed || 5));
		}
		this.wsize = param.wsize;
		scale(this.wsize, this.hsize, anim);
	};
	
	sprite.getSquareBounds = function(){
		var _offset = $(sprite.instance).offset();
		return {
			lx: _offset.left * this.wsize,
			ux: (_offset.left + this.frame.width) * this.wsize,
			ly: _offset.top * this.hsize,
			uy: (_offset.top + this.frame.height) * this.hsize
		};
	};
	
	sprite.isCollided = function( box2 ){
		var box1 = this.getSquareBounds();
		return ( (box1.ux > box2.lx) && (box1.lx < box2.ux) && (box1.uy > box2.ly) && (box1.ly < box2.uy)) ? true:false;
	};
	
	var scale = function( param1, param2, anim ){
		scle_wrapper.style.cssText = [anim||"", UTILITY.getCSS({scale: {wsize: param1, hsize:param2 }})].join("");
	};
	
	var getCSS = function( ){
		return UTILITY.getCSS({
				size:{
					width: sprite.actions[sprite.status][sprite.current]["map"].width,
					height: sprite.actions[sprite.status][sprite.current]["map"].height
				},
				backgroundimage: sprite.IMAGE,
				map: sprite.actions[sprite.status][sprite.current]["map"],
				opacity: sprite.opacity
		});
	};
	
	sprite.setScene = function( param ){
		this.scene = param;
		init();
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













