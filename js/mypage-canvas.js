/*=======================================
* マイページの継続クラスのCanvasLIBRARY
* (c) 2013 CROOZ All Rights Reserved
*
*	@author マト
=========================================*/
//継続キャンバスクラス
//オペニングアニメーションのクラス
function Canvas_Startup(canvas){
	var animations = [];					//アニメーションのリスト
	var isAnim = false;						//アニメーション中かどうか
	var now;								//FPSを制限させる
	var then = Date.now();					//FPSを制限させる
	var INTERVAL = 1000 / UTILITY.FRAME_RATE;		//FPS
	var delta;								//FPSを制限させる

	//アニメーションのリストを処理する
	var animate = function(){
		if(!isAnim) return;

		requestAnimFrame(function() {
			animate();
		});

	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	        then = now - (delta % INTERVAL);
	        for(var i=0; i < animations.length; i++){
	        	var anim = animations[i];
	        	var frames = anim.frames;

	        	for(var key in anim.to){
	        		anim.from[key] = processAnimation(
					        			key,
					        			anim.sprite,
					        			anim.from[key],
					        			anim.to[key],
					        			frames
					        		);
	    		}

	        	frames--;
	        	anim.frames = frames;
	        	if(frames <= 0){

	        		if(anim.callback)
	        			anim.callback();

	        		animations.splice(i,1);

	        		if(animations.length===0)
	        			isAnim = false;
	        	}
	        }
	        canvas.paintRotateOpening();
	    }
	};

	//アニメーションのタイプによって処理する
	var processAnimation = function(type, sprite, from, to, total){
		var result = from - ((from - to) / total);
		if(type === "size")
			sprite.scale(result);
		else if(type === "y")
			sprite.frame.y = result;
		else if(type === "x")
			sprite.frame.x = result;
		else if(type === "angle")
			sprite.ellipsePath(result);
		else if(type === "visible")
			sprite.visible = to;
		else if(type === "maskH")
			sprite.maskFrame.height = result;
		return result;
	};

	//新しいアニメーションを追加
	var addAnimation = function(sprite, from, to, frames, callback){
		animations.push({
			sprite: sprite,
			from: from,
			to: to,
			frames: canvas.round(frames / UTILITY.FRAME_SKIP),
			callback: callback,
		});
	};

	//スプライトを非表示
	var hideGrapix = function(){
		for(var i=0; i<canvas.sprites.length; i++)
			canvas.sprites[i].visible = false;
	};

	//名前によってスプライトを取得
	var getSprite = function(name){
		for(var i=0; i< canvas.sprites.length; i++){
			if(canvas.sprites[i].name === name){
				return canvas.sprites[i];
			}
		}
	};

	//オペニングアニメーションを開始
	var buttonNum = 0;
	var buttonArrange = [];
	canvas.startOpeningAnimation = function(){
		this.isAnimating = true;
		buttonNum = this.buttonAngle.length;
		if(buttonNum == 6)
			buttonArrange = [3,4,5,0,1,2]; //[3,4,0,1,2];
		else
			buttonArrange = [3,4,0,1,2]; //[3,0,1,2];

		hideGrapix();

		isAnim = true;
		animate();

		//var chara = getSprite("character");
		//chara.maskFrame = {height:0}; //1.0 for 100%

		var bg = getSprite("background");
		bg.visible = true;

		var frame1 = getSprite("ring_b");
		var frame2 = getSprite("ring_f");
		frame1.visible = true;
		frame2.visible = true;

		animation(1);
	};

	//アニメーションのリスト
	var animation = function(param, name){
		switch(param){
		case 1:
			addAnimation(undefined, {time:0},{time:10},30,function(){animation(3);});
			break;
		case 3:
			animation(4, getRotatingButton());
			animation(0);
			break;
		case 4:
			if(buttonNum >= 0){
				addAnimation(getSprite(name.name), {size:2.0, x:100, y: 490},{size:0.34, x:302, y: 260 + UTILITY.ADJUST_Y },18, function(){animation(4, getRotatingButton()); animation(5, name);});
			}else{
				//animation(7);
				addAnimation(undefined, {time:0},{time:10},14,function(){animation(7);});
			}
			break;
		case 5:
			animation(6, name);
			//addAnimation(getSprite(name.name), {angle:0},{angle:359},100,function(){animation(6, name);});
			break;
		case 6:
			addAnimation(getSprite(name.name), {angle:0},{angle:name.angle},Math.round(name.angle * 0.3),function(){});
			break;
		case 7:
			var chara = getSprite("character");
			chara.visible = true;
			canvas.isAnimating = false; 
			canvas.highlight();
			//addAnimation(chara, {maskH:0},{maskH:1.0}, 1, function(){canvas.isAnimating = false; canvas.highlight(); });
			break;
		};
	};

	//まわすボタンを一個ずつ取得
	var getRotatingButton = function(){
		buttonNum--;
		if(buttonNum < 0) return;
		for(var i = 0; i < canvas.sprites.length; i++){
			var sprite = canvas.sprites[i];
			if(sprite.posId != undefined){
				if(sprite.posId == buttonArrange[buttonNum]){
					sprite.angle = 300;
					sprite.move(-70, 490);
					sprite.visible = true;
					return {name: sprite.name, angle: canvas.buttonAngle[buttonArrange[buttonNum]]};
				}
			}
		}
	};

	//スプライトの表示順番で表示する
	canvas.paintRotateOpening = function(){
		this.clear();
		for(var i=0; i < canvas.sprites.length-3; i++){
			var sprite = canvas.sprites[i];
			if(i===2)
				this.paintButtons("back");
			else if(i===3){
				if(!sprite.isButton){
					checkPaint(sprite);
				}
			}
			else
				checkPaint(sprite);
		}
		this.paintButtons("front");
	};

	//キャラクターのスプライトなら、特別な表示しかたをする
	var checkPaint = function(sprite){
		sprite.paint();
//		if(sprite.name !== "character")
//			sprite.paint();
//		else{
//			if(!sprite.visible) return;
//			var imgmap = sprite.map[0].image;
//			var imgmapMask = {
//					x: imgmap.x,
//					y: imgmap.y,
//					width: imgmap.width,
//					height: imgmap.height * sprite.maskFrame.height
//			};
//			var coord = sprite.getCoordinates();
//			coord.height = coord.height * sprite.maskFrame.height;
//			sprite.drawingCanvas.draw(sprite.instance, sprite.opacity, imgmapMask, coord);
//		}
	};
};

//継続クラス　キャンバスのまわすボタン
function Canvas_Ext(canvas, parameters){

	canvas.isAnimating = false;
	canvas.buttonAngle = [0, 0, 0, 0, 0, 0];
	canvas.adjustY = 0;
	canvas.effect = parameters.effect;

	var _img = new Image();
	_img.src = parameters.effect.src;
	_img.onload = function(){
		canvas.effect.instance = _img;
		canvas.effect.isLoading = false;
	};

	var ANIMATION_COUNT = 10 / UTILITY.FRAME_SKIP;
	var now;
	var then = Date.now();
	var INTERVAL = 1000 / UTILITY.FRAME_RATE;
	var delta;

	//アニメーションを開始
	canvas.animate = function(direction){
		//DATEDIFF = Date.now();
		this.isAnimating = true;
		then = Date.now();
		anime(direction);
	};

	//方向によってアニメーションを処理する
	var counter = 0;
	var anime = function(direction) {
		if(!canvas.isAnimating) return;

		requestAnimFrame(function() {
		      anime(direction);
		});
	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	        then = now - (delta % INTERVAL);

	        for(var i=0; i<animations.length; i++){
	        	if(animations[i].start)
	        		animations[i].start = now;
				var sprite = animations[i].sprite;
				var from = animations[i].from;
				var to = animations[i].to;

				var distance = 0,
					angle_adder = 0,
					angle = 0;

				if(direction==="right"){
					if(from.angle < to.angle){
						distance = (from.angle - to.angle);
						angle_adder = distance / ANIMATION_COUNT;
						angle = from.angle - (angle_adder * counter);
					}else{
						distance = ((360 - from.angle) + to.angle);
						angle_adder = distance / ANIMATION_COUNT;
						angle = from.angle + (angle_adder * counter);
						if(angle >= 360)
							angle -=360;
					}
				}else{
					if(from.angle > to.angle){
						distance = (from.angle - to.angle);
					}else{
						distance = (from.angle + (360 - to.angle));
					}
					angle_adder = distance / ANIMATION_COUNT;
					angle = from.angle - (angle_adder * counter);
					if(angle < 0)
						angle +=360;
				}
				sprite.ellipsePath(angle);
			}

			canvas.paintRotate();
			counter++;
			if(counter > ANIMATION_COUNT){
				counter = 0;
				canvas.isAnimating = false;
				animations = [];
				//alert(Date.now()-DATEDIFF);

				isHighLight = true;
				canvas.highlight();
			}
	    }
	};

	var isHighLight = true;
	var highlightCount = 0;
	canvas.highlight = function() {
		if(!isHighLight) return;
		if(canvas.isAnimating){
			highlightCount = 0;
			isHighLight = false;
			return;
		};

		requestAnimFrame(function() {
			canvas.highlight();
		});

	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	        then = now - (delta % INTERVAL);
	        highlightCount++;

	        if(highlightCount <= 6)
	        	canvas.paintRotate(1 + (highlightCount * 0.05));
	        if(highlightCount == 7)
	        	canvas.paintRotate(1 + (3 * 0.035));

			if(highlightCount >= 7){
				highlightCount = 0;
				isHighLight = false;
			}
	    }
	};

	//canvas.buttonAngle = [230, 270, 310, 75, 105];
	//スプライトボタンのボタンの位置を再計算する
	canvas.rearrangeButtons = function(){
		var counter = 0;
		for(var i=0; i<this.sprites.length; i++){
			var button = this.sprites[i];
			if(button.isButton){
				button.reposition();
				canvas.buttonAngle[button.posId] = button.angle;
				counter++;
			}
		}
		canvas.buttonAngle = canvas.buttonAngle.splice(0, counter);
	};

	//まわす円周の定義
	var ellipse = {
			centerX: canvas.frame.width / 2,
			centerY: 252 + UTILITY.ADJUST_Y,
			semiminor: 130, //half width
			semimajor: 30 //half height
	};

	//円周の角度によって、一位を取得
	canvas.getPositionInEllipsePath = function(angle){
		var delta = (360 - angle) * ((Math.PI * 2)/360);
		return {
			x: ellipse.centerX + (ellipse.semiminor * Math.cos(delta)),
			y: ellipse.centerY + (ellipse.semimajor * Math.sin(delta))
		};
	};

	//スプライトの表示順番で表示する
	canvas.paintRotate = function(effect){
		
		this.clear();
		for(var i=0; i < canvas.sprites.length-3; i++){
			var sprite = canvas.sprites[i];
			if(i===2)
				this.paintButtons("back");
			else if(i===3){
				if(!sprite.isButton){
					sprite.paint();
				}
			}
			else
				sprite.paint();
		}
		this.paintButtons("front", effect);
	};


	//ボタンの表示順番で表示する
	canvas.paintButtons = function(position, effect){

		
		for(var i=0; i < canvas.sprites.length; i++){
			var sprite = canvas.sprites[i];
			if(sprite.isButton){
				if(position === "front"){
					if((sprite.angle >= 180)&&(sprite.angle < 360)){
						//isHighLight
						if(effect)
							canvas.draw( canvas.effect.instance, 1, canvas.effect.frame, getEffectCoordinates(sprite, effect) );
						sprite.paint();
					}
				}
				else{
					if((sprite.angle >= 0)&&(sprite.angle < 180))
						sprite.paint();
				}
			}
		}
	};

	var getEffectCoordinates = function(sprite, effect){
		var	width = (sprite.frame.width * sprite.wsize) * effect,
			height = (sprite.frame.height * sprite.hsize) * effect;
		return {
			width: width * UTILITY.PIXEL_ASPECT,
			height: height * UTILITY.PIXEL_ASPECT,
			x:  (sprite.frame.x  - (width / 2)) * UTILITY.PIXEL_ASPECT,
			y:  (sprite.frame.y  - (height / 2)) * UTILITY.PIXEL_ASPECT
		};
	};


	//アニメーションのリスト
	var animations = [];

	//アニメーションを追加する
	canvas.addAnimation = function(sprite, from, to, time){
		animations.push({
			sprite: sprite,
			from: from,
			to: to,
			time: time
		});
	};

	//キャンバスの処理を開始、アニメーションさせるかただの表示するか
	canvas.execute = function(){
		this.rearrangeButtons();
		if(parameters.opening_animation)
			this.startOpeningAnimation();
		else{
			setTimeout( function() {
				canvas.paintRotate(1 + (3 * 0.035));
			}, 0);
			//this.paint();
		}

	};

	//TODO: write code here to start opening animation
	if(parameters.opening_animation)
		Canvas_Startup(canvas);
};

function Sprite_Ext(sprite, parameters){

	sprite.posId = parameters.value;
	sprite.isButton = true;
	sprite.angle = 0;
	//sprite.toFront = parameters.front;

	//円周のパスによって、ボタンの位置を変える
	sprite.reposition = function(){
		this.ellipsePath(parameters.angle);
	};

	//円周のパスによって、ボタンの位置を変える
	sprite.ellipsePath = function(angle){
		this.angle = angle;
		var pos = sprite.drawingCanvas.getPositionInEllipsePath(this.angle);
		this.move(pos.x, pos.y, false);
		this.scale(depthResize(this.angle), false);
	};

	//円周の位置によってボタンの大きさを変える
	var depthResize = function(angle){
		var size_adder = 0.0015555555555555555;
		var plane = sprite.getCircleQuadrant(angle);
		var excess = angle - ((plane * 90) - 90);

		switch(plane){
		case 1:
			return 0.33999999999999997 - (excess * size_adder);
			break;
		case 2:
			return 0.20 + (excess * size_adder);
			break;
		case 3:
			return 0.33999999999999997 + (excess * size_adder);
			break;
		case 4:
			return 0.48 - (excess * size_adder);
			break;
		}
		return 0;
	};

	//ボタンはどちらのPLANEのQUADRANTにあるか取得
	sprite.getCircleQuadrant = function(angle){
		if((angle >= 0)&&(angle < 90))
			return 1;
		else if((angle >= 90)&&(angle < 180))
			return 2;
		else if((angle >= 180)&&(angle < 270))
			return 3;
		else
			return 4;
	};

	//HREFによってページを移動させる
	sprite.goTo = function(param, x, y){
		if(this.posId >= 3) return;
		window.location.href = param.url;
	};

	//不要かもしてません
	sprite.slide = function(param, direction, x, y){
		if(this.posId >= 3) return;
		rotate(direction);
	};

	//ボタンを方向によって回転させる
	var rotate = function(direction){
		var canvas = sprite.drawingCanvas;
		if(canvas.isAnimating) return;
		for(var i=0; i<canvas.sprites.length; i++){
			(function(_sprite){
				if(_sprite.isButton){
					if(direction === "left"){
						_sprite.posId -= 1;
						if(_sprite.posId <= -1){
							_sprite.posId = canvas.buttonAngle.length -1;
						}
					}else{
						_sprite.posId += 1;
						if(_sprite.posId >= canvas.buttonAngle.length){
							_sprite.posId = 0;
						}
					}
					canvas.addAnimation(_sprite, {angle : _sprite.angle}, {angle: canvas.buttonAngle[_sprite.posId]}, 500);
				}
			})(canvas.sprites[i]);
		}
		canvas.animate(direction);
	};
};



///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
var mypage = {};

$(window).bind('orientationchange resize', function(event){
	if(mypage.reposition){
		mypage.resize();
		mypage.reposition();
		if(mypage.paintRotateOpening){
			if(mypage.isAnimating)
				mypage.paintRotateOpening();
			else
				mypage.paintRotate(1 + (3 * 0.035));
		}else{
			mypage.paintRotate(1 + (3 * 0.035));
		}

	}
});

$(window).bind("load",function(){
	UTILITY.ADJUST_Y = -90;


	var device = UTILITY.getDeviceType();
	if(device === "iPhone"){
		UTILITY.FRAME_RATE = 60;
		UTILITY.FRAME_SKIP = 1;
	}else if(device === "Android"){
		UTILITY.FRAME_RATE = 60;
		UTILITY.FRAME_SKIP = 2;
	}


	mypage = new Canvas({container:"mypage_canvas",
		frame:{ x:0, y:0, width:320, height:420 },
		extend: {
			name: "Canvas_Ext",
			param : {
				opening_animation: true,
				effect : {
					src: 'images/highlight5.png',
					isLoading: true,
					frame: {
						x: 0,
						y: 0,
						width: 200,
						height: 200
					}
				}
			}
		}});

 	var bg = new Sprite({
		name: 'background',
		src: 'images/mypage_bg.jpg',
		size: 0.45,
		frame: {
			x: 160,
			y: 200,
			width: 720,
			height: 896
		}
	});

	var unitChara = $("#mypage_canvas").data('chara');
	var chara = new Sprite({
		name: 'character',
		src: unitChara || 'images/chara.png',
		//src: unitChara,
		size: 0.45,
		frame: {
			x: 160,
			y: 185,
			width: 720,
			height: 820
		}
	});

	var frame_back = new Sprite({
		name: 'ring_b',
		src: 'images/frame_back.png',
		size: 0.44,
		frame: {
			x: 160,
			y: 252 + UTILITY.ADJUST_Y,
			width: 720,
			height: 96
		}
	});

	var frame_front = new Sprite({
		name: 'ring_f',
		src: 'images/frame_front.png',
		size: 0.44,
		frame: {
			x: 160,
			y: 294 + UTILITY.ADJUST_Y,
			width: 720,
			height: 96
		}
	});






	var pvp_btn = new Sprite({
		name: 'pvp',
		src: 'images/mypage.png',
		size: 0.43,
		actions:{
			idle:[
				{
					map:{ x:128, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 53,
			y: 290,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
				}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 0,
				angle: 210,
				front: true
			}
		}
	});

	var quest_btn = new Sprite({
		name: 'quest',
		src: 'images/mypage.png',
		size: 0.5,
		actions:{
			idle:[
				{
					map:{ x:0, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 160,
			y: 300,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
					}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 1,
				angle: 270,
				front: true
			}
		}
	});

	var gacha_btn = new Sprite({
		name: 'gacha',
		src: 'images/mypage.png',
		size: 0.43,
		actions:{
			idle:[
				{
					map:{ x:256, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 260,
			y: 290,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
				}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 2,
				angle: 330,
				front: true
			}
		}
	});

	var equip_btn = new Sprite({
		name: 'eqip',
		src: 'images/mypage.png',
		size: 0.3,
		actions:{
			idle:[
				{
					map:{ x:386, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 100,
			y: 100,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
				}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 3,
				angle: 50,
				front: false
			}
		}
	});

	var formation_btn = new Sprite({
		name: 'formation',
		src: 'images/mypage.png',
		size: 0.3,
		actions:{
			idle:[
				{
					map:{ x:513, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 160,
			y: 235,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
				}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 4,
				angle: 90,
				front: false
			}
		}
	});

	var unit_btn = new Sprite({
		name: 'unit',
		src: 'images/mypage.png',
		size: 0.3,
		actions:{
			idle:[
				{
					map:{ x:256, y:0, width:118, height:118 },
					adjust:{ width:0, height:0, x:0, y:0 }
				}
			]
		},
		frame: {
			x: 160,
			y: 235,
			width: 118,
			height: 118
		},
		event:{
			tap: [{
				name: "goTo",
				param:{
					url: ""
					}
				}],
			dragged: [{
				name: "slide",
				param:{
					message: "DRAGGED"
				}
			}]
		},
		extend: {
			name: "Sprite_Ext",
			param : {
				value: 5,
				angle: 130,
				front: false
			}
		}
	});


	mypage.addSprite(bg);
	mypage.addSprite(frame_back);
	mypage.addSprite(unit_btn); //unit_btn.visible = false;
	mypage.addSprite(formation_btn); //event_btn.visible = false;
	mypage.addSprite(equip_btn);
	mypage.addSprite(chara); //chara.visible = false;
	mypage.addSprite(frame_front);
	mypage.addSprite(pvp_btn); //pvp_btn.visible = false;
	mypage.addSprite(quest_btn);
	mypage.addSprite(gacha_btn); //gacha_btn.visible =false;

	mypage.execute();
});