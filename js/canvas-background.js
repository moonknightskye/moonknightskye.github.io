var CanvasExt = function( canvas, params ){

	canvas.labels = [];
	
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
		//canvas.sprites[ 0 ].paint();
		for( var i = 0; i < canvas.sprites.length; i++ ){
			canvas.sprites[ i ].paint();
		}
		
		var label;
		for( var i = 0; i < canvas.labels.length; i++ ){
			label = canvas.labels[i];
			
			canvas.displayText({ text:label.dmg, x:label.x, y:label.y, size: 20, opacity: label.opacity });
			label.y-=2;
			label.opacity -= 0.1;
			
			label.count--;
			if(label.count <=0 ){
				canvas.labels.splice(i,1);
			}	
		}
		
		//canvas.displayText({ text:"●", x:160, y:165, size: 20 });
	};
	
	
	//画像がキャシング中かチェックする
	var isLoading = function(){
		for( var i = 0; i < canvas.sprites.length; i++ ){
			if( canvas.sprites[ i ].isLoading )
				return true;
		}
		return false;
	};
	
};

var SpriteEnemy = function( sprite, params ){

	SpriteWarriors(sprite, params);
	
};


var SpriteWarriors = function( sprite, params ){

	sprite.isMoving = false;
	sprite.direction = "front";
	sprite.hp = params.hp || 100;
	sprite.atk = params.atk || 100;
	sprite.bgsprite = params.bgsprite;
	var counter = 0;
	
	sprite.rotateWithCanvas = function( pos, angle ){
		this.move(pos.x, pos.y);
		//this.rotate(angle);
	};
	
	sprite.run = function( speed ){
		if(UTILITY.game.scene === "battle"){
			this.rframe.x += ((this.direction === "front") ? speed: -(speed));
		}
		else
			this.moveAtAngularPath(((this.direction === "front") ? speed: -(speed)), this.rotation);
	};
	
	sprite.battleStart = function(){
		this.rframe = {
			x: this.frame.x,
			y: this.frame.y // + ((this.frame.x > 160)? 5:-5)
		};
	};

	sprite.paint = function( param ){
		if( !this.visible ) return;
		if( !param ) param = this.current;
		
		var canvas = this.drawingCanvas;
		var screen = this.getCoordinates();
	
		canvas.context.save();
		canvas.context.translate((screen.width/2) + screen.x, (screen.height/2) + screen.y);
		canvas.context.rotate(-1 * (Math.PI / 180) * this.rotation);
		
		screen.x = -(screen.width/2);
		screen.y = -(screen.height/2);
		
		canvas.draw( this.instance, this.opacity, this.actions[this.status][this.current].map, screen);
		canvas.context.restore();
		
		if(counter++ % 2){
			this.current++;
			if( this.current >= this.actions[this.status].length)
				this.current = 0;
		}
	};
	
	sprite.generateNextAction = function (){
		var _act = UTILITY.random(1);
		sprite.setAction("walk_right");
		if(_act == 0){
			this.direction = "stay";
			UTILITY.game.addAnimation(this, { move:{ idle:UTILITY.random(10), delflag:true }}, function(){ if(UTILITY.game.scene !== "battle") sprite.generateNextAction();});
		}else{
			var pointx = 60 + UTILITY.random(80);
			if(this.frame.x < pointx)
				this.direction = "front";
			else if(this.frame.x > pointx)
				this.direction = "back";
			else{
				this.generateNextAction();
				return;
			}
			UTILITY.game.addAnimation(this, { move:{ x:pointx, speed: 1 + UTILITY.random(3), delflag:true }}, function(){ if(UTILITY.game.scene !== "battle") sprite.generateNextAction();});
		}
	};
	
	sprite.moveAtBGRotationPath = function(){
		if(this.isMoving) return;
		
		var pos = UTILITY.getPositionInEllipsePath( this.getRotationAngle(this.battleEllipse), this.battleEllipse.ellipse);
		this.move(pos.x, pos.y);
	};
	
	
	sprite.moveAtBGAngularPath = function(speed, repaint){
		this.isMoving = true;
		
		var delta = (360 - this.bgsprite.rotation) * (Math.PI  / 180);
			x = (speed * Math.cos(delta)),
			y = (((speed * Math.sin(delta)) * (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO)));
		
		this.move(this.frame.x + x, this.frame.y + y, repaint);
	};
	
	sprite.moveFinish = function(){
		this.resetEllipseData();
		this.isMoving = false;
	};
	
	sprite.getRotationAngle = function(param){
		var _rotate =  this.bgsprite.rotation - param.rotation;
	    if(_rotate >= 330)
	    	_rotate-=360;
		return param.angle + _rotate;
	};
	
	sprite.resetEllipseData = function(adjust){
		var ellipse = getEllipse(this.frame.x, this.frame.y),
			quadrant = UTILITY.getCircleQuadrant(this.frame.x - ellipse.centerX, this.frame.y - ellipse.centerY),
			limit = quadrant * 90;
		
		var pos;
		var adj = adjust || 1;
		if(quadrant == -1){
			ellipse.semiminor = 0;
			ellipse.semimajor = 0;
			this.battleEllipse = {
					angle: 0,
					ellipse: ellipse,
					x: 0,
					y: 0,
					rotation: this.bgsprite.rotation
			};
			return;
		}else{
			for(var angle = limit - 90; angle <= limit; angle++){
				pos = UTILITY.getPositionInEllipsePath(angle, ellipse);
				//console.log({angle: angle, x: pos.x, y:pos.y});
				if(((pos.x <= this.frame.x + adj) && (pos.x >= this.frame.x - adj)) && 
				  ((pos.y <= this.frame.y + adj) && (pos.y >= this.frame.y - adj))){
					//console.log("RESULT: " +angle);
					this.battleEllipse = {
							angle: angle,
							ellipse: ellipse,
							x: this.frame.x,
							y: this.frame.y,
							rotation: this.bgsprite.rotation
					};
					return;
				}
			}
		}
		
		console.log("WARNING: ANGLE CANNOT BE CALIBRATED " + this.name);
		return 0;
	};



	var getEllipse = function( x, y){
		var canvas = UTILITY.game.canvas,
			centerX = canvas.frame.width / 2,
			centerY = canvas.frame.height / 2,
			R = Math.pow(UTILITY.BGHEIGHTRATIO,2) / Math.pow(UTILITY.BGWIDTHRATIO,2),
			semiminor = ( Math.pow(x - centerX,2) + (R * Math.pow(y - centerY,2))) / R,
			semimajor = R * semiminor;
		
		return {
			centerX: centerX,
			centerY: centerY,
			semiminor: Math.sqrt(semiminor),
			semimajor: Math.sqrt(semimajor)
		};
	};
};

var SpriteBackground = function( sprite, params ){

	var isScrolling = true;
	var isRotating = false;
	sprite.tremor = {x:0, y:0};
	
	
	sprite.scrollSpeed = params.speed;
	
	sprite.scroll = function( param ){
		isScrolling = param;
		//isRotating = false;
	};
	
	sprite.setTremor = function(x, y){
		this.tremor ={x:x,y:y};
	};
	
	sprite.isRotating = function(){
		return isRotating;
	};
	
	sprite.autoRotate = function(){
		isRotating = true;
		this.rframe = {
				x: this.frame.x - 0.7,
				y: this.frame.y,
				rotation: this.rotation
		};
		enemy01 = this.drawingCanvas.sprites[1];
		char01 = this.drawingCanvas.sprites[2];
		char02 = this.drawingCanvas.sprites[3];
		char03 = this.drawingCanvas.sprites[4];
		UTILITY.game.scene = "battle";
	};
	
//	sprite.getOrigPos = function(){
//		return this.rframe;
//	};
	
	sprite.resetScrollSpeed = function(){
		this.scrollSpeed = params.speed;
	};
	
	sprite.getScrollSpeed = function(){
		return params.speed;
	};
	
	
	sprite.getPositionInEllipsePath = function(angle, x, y, scaleH){
		var canvas = UTILITY.game.canvas,
			delta = (360 - angle) * (Math.PI/180),
			width = ((canvas.frame.width/2) - x),
			height = ((canvas.frame.height/2) - y),
			radius = Math.sqrt( Math.pow(width,2) + Math.pow(height,2) );
			
		return {
			x: (canvas.frame.width/2) + (radius * Math.cos(delta)) + this.tremor.x,
			y: (canvas.frame.height/2) + ((radius * (scaleH || 1) ) * Math.sin(delta)) + this.tremor.y
		};
	};
	
	var getAngle = function( frame ){
		var degree = Math.atan2(160-frame.x, 160-frame.y) * 180 / Math.PI;
		return degree + (sprite.rotation + 90);
	};
	
	sprite.moveAtAngularPathScaleHeight = function(speed, angle, scaleH, repaint){
		var delta = (360 - angle) * (Math.PI  / 180);
		this.frame.x += (speed * Math.cos(delta));
		this.frame.y += ((speed * Math.sin(delta)) * (scaleH));
		if( repaint )
			this.drawingCanvas.paint();
	};
	
	//スプライトをCanvasに表示
	sprite.paint = function( param ){
		if( !this.visible ) return;
		if( !param ) param = this.current;

		if(isScrolling)
			this.moveAtAngularPathScaleHeight(this.scrollSpeed, this.rotation, UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO);
		else{
			if(isRotating){
				//pos = this.getCharPosInEllipsePath2(getAngle(enemy01.rframe), enemy01.rframe.x, enemy01.rframe.y, 0.5);
				//enemy01.rotateWithCanvas(pos, this.rotation);
			}
		}
		//this.size = 1.5;
		var canvas = sprite.drawingCanvas;
		var ctx = sprite.drawingCanvas.context;
		var screen = sprite.getCoordinates();
		
	    ctx.save();
	    
	    //DRAW THE MAIN CANVAS
	    // scale it
	    ctx.translate(screen.x, screen.y + (screen.height * (1 - (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO)) / 2)); // move by half of the 1/3 space to center it
	    ctx.scale(1, UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO); // squish it to 2/3 vertical size

	    // rotate it
	    ctx.translate(screen.width/2, screen.height/2);
	    ctx.rotate(-1 * (Math.PI  / 180) * this.rotation);
	    ctx.translate(-(screen.width/2), -(screen.height/2));
	                  
	    screen.x = 0;
	    screen.y = 0;
	    canvas.draw( this.instance, this.opacity, this.actions[this.status][this.current].map, screen);
	    
	    //DRAW THE LEADING SQUARES
		var canvascoordinates = {
			x:0, y:0,
			width: this.drawingCanvas.frame.width * UTILITY.PIXEL_ASPECT,
			height: this.drawingCanvas.frame.height * UTILITY.PIXEL_ASPECT
		};
			
		if(params.speed < 0){
			screen.x += screen.width;
			canvas.draw( this.instance, this.opacity, this.actions[this.status][this.current].map, screen);
			if( !isCollided(getSquareBounds(this.getCoordinates()),getSquareBounds(canvascoordinates)) ){
				var pos = getPosAtAngularPath(this.frame.x, this.frame.y, (this.frame.width * this.wsize) , this.rotation, UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO);
				this.move(pos.x, pos.y);
			} 
		}else{
			screen.x -= screen.width;
			canvas.draw( this.instance, this.opacity, this.actions[this.status][this.current].map, screen);
			if( !isCollided(getSquareBounds(this.getCoordinates()),getSquareBounds(canvascoordinates)) ){
				var pos = getPosAtAngularPath(this.frame.x, this.frame.y, -(this.frame.width * this.wsize) , this.rotation, UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO);
				this.move(pos.x, pos.y);
			} 
		}
	    
	    ctx.restore();
	    
	    drawGradient();
	};
	
	sprite.depthResize = function(angle){
		var size_adder = 0.022222222222222223;
		var plane = sprite.getCircleQuadrant(angle);
		var excess = angle - ((plane * 90) - 90);

		switch(plane){
		case 1:
			return 3 - (excess * size_adder);
			break;
		case 2:
			return 1 + (excess * size_adder);
			break;
		case 3:
			return 3 - (excess * size_adder);
			break;
		case 4:
			return 1 + (excess * size_adder);
			break;
		}
		return 0;
	};
	
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
	
	var getPosAtAngularPath = function(x, y, speed, angle, scaleH){
		var delta = (360 - angle) * (Math.PI  / 180);
		return {
			x : x + (speed * Math.cos(delta)),
			y : y + (speed * Math.sin(delta)) * (scaleH || 1)
		};
	};
	
	var getSquareBounds = function( bounds ){
		return {
			lx: ( bounds.x / UTILITY.PIXEL_RATIO ),
			ux: ( ( bounds.x + bounds.width ) / UTILITY.PIXEL_RATIO ),
			ly: ( bounds.y / UTILITY.PIXEL_RATIO ),
			uy: ( ( bounds.y + bounds.height ) / UTILITY.PIXEL_RATIO )
		};
	};
	
	var isCollided = function(box1, box2){
		return ( (box1.ux > box2.lx) && (box1.lx < box2.ux) && (box1.uy > box2.ly) && (box1.ly < box2.uy)) ? true:false;
	};
	
	
	//GRADIENTS
	var drawGradient = function(){
		var canvas = sprite.drawingCanvas,
			ctx = canvas.context,
			x = (canvas.frame.width / 2) * UTILITY.PIXEL_ASPECT,
		  	y = ((canvas.frame.height / 2 ) / (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO)) * UTILITY.PIXEL_ASPECT;
		  	circle1 = 100 * UTILITY.PIXEL_ASPECT,
		  	circle2 = 250 * UTILITY.PIXEL_ASPECT,
			g = ctx.createRadialGradient(x, y, circle1, x, y, circle2);
		g.addColorStop(0.5, 'transparent');
		g.addColorStop(1, 'black');
		ctx.save();
		ctx.scale(1, UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO);
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, canvas.frame.width * UTILITY.PIXEL_ASPECT, (canvas.frame.height * UTILITY.PIXEL_ASPECT) / (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO));
		ctx.restore();
	};
};