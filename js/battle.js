$(window).bind('orientationchange resize', function(event){
	if(UTILITY.game.canvas.reposition){
		UTILITY.game.canvas.resize();
		UTILITY.game.canvas.reposition();
		UTILITY.game.canvas.paint();
	}
});

$(window).bind("load",function(){
	//	http://dev3.mdrabre.croozsocial.jp/img/s3/test/battle
	var battle = new Canvas({container:"mypage_canvas",
		id:"matocanvas",
		frame:{ x:0, y:0, width:320, height:320 },
		extend:{
			name:"CanvasExt",
			param :{
				
			}
		}
	});

 	var background = new Sprite({
		name:'bg',
		src:'images/forest-bg5.jpg', //forest-bg5.jpg grid.png
		size: 2, //4.2
		rotation:6, //6
		frame:{x:160, y:160 },
		extend:{
			name:"SpriteBackground",
			param :{
				speed:-25
			}
		}
	});
 	background.scroll(true);
 	
 	var char01 = new Sprite({
		name:'char01',
		src:'images/attacker.png',
		size: 1,
		frame:{ x:-30, y:100, height:58 },
		status:"walk_right",
		current:0,
		actions:{
			idle_right:[
					{
						map:{ x:0, y:0, width:200, height:58 },
						adjust:{ width:0, height:0, x:0, y:-29 }
					}
			      ],
			walk_right:[
					     {
					    	 map:{ x:0, y:61, width:200, height:58 },
							 adjust:{ width:0, height:0, x:0, y:-29 }
					     },{
					    	 map:{ x:0, y:119, width:200, height:58 },
							 adjust:{ width:0, height:0, x:0, y:-31 }
					     },{
					    	 map:{ x:0, y:178, width:200, height:58 },
							 adjust:{ width:0, height:0, x:0, y:-29  }
					     },{
					    	 map:{ x:0, y:239, width:200, height:58 },
							 adjust:{ width:0, height:0, x:0, y:-31 }
					     }  
			      ],
			attack_right:[
						{
							map:{ x:0, y:298, width:200, height:100 },
							adjust:{width:0,height:42,x:0,y:0}
						},{
							map:{ x:0,y:394,width:200, height:67 },
							adjust:{width:0,height:10,x:2,y:0}
						}   
				]
		},
		extend:{
			name:"SpriteWarriors",
			param :{
				bgsprite: background,
				runspeed:5,
				hp:1000,
				atk:280
			}
		}
	});
 	
 	var char02 = new Sprite({
		name:'char02',
		src:'images/knight.png',
		size:1,
		frame:{x:-30,y:150,width:200,height:60},
		status:"walk_right",
		current:0,
		opacity: 0.5,
		actions:{
			idle_right:[
					{
						map:{ x:0, y:0, width:200, height:62},
						adjust:{width:0,height:0,x:0,y:-30}
					}
			      ],
			walk_right:[
					     {
					    	 map:{x:0,y:69,width:200,height:62 },
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0,y:140,width:200,height:62},
							 adjust:{width:0,height:0,x:0,y:-32}
					     },{
					    	 map:{x:0,y:209,width:200,height:62},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{ x:0,y:278,width:200, height:62},
							 adjust:{width:0,height:0,x:0,y:-32}
					     }  
			      ],
			attack_right:[
						{
							map:{x:0,y:349, width:200,height:60},
							adjust:{width:0,height:0,x:0,y:0}
						},{
							map:{ x:0,y:418,width:200,height:70},
							adjust:{width:0,height:10,x:10,y:3}
						}   
				]
		},
		extend:{
			name:"SpriteWarriors",
			param :{
				bgsprite: background,
				runspeed:5,
				hp:1000,
				atk:320
			}
		}
	});
 	
 	var char03 = new Sprite({
		name:'char03',
		src:'images/mage.png',
		size:1,
		frame:{x:-30,y:200,width:200,height:56},
		status:"walk_right",
		current:0,
		actions:{
			idle_right:[
					{
						map:{x:0,y:0,width:200,height:57},
						adjust:{width:0,height:0,x:0,y:-28}
					}
			      ],
			walk_right:[
					     {
					    	 map:{x:0,y:66,width:200,height:57},
							 adjust:{width:0,height:0,x:0,y:-28}
					     },{
					    	 map:{x:0,y:129,width:200,height:57},
							 adjust:{width:0,height:0,x:0,y:-31}
					     },{
					    	 map:{x:0,y:193,width:200,height:57},
							 adjust:{width:0,height:0,x:0,y:-28}
					     },{
					    	 map:{x:0,y:259,width:200,height:57},
							 adjust:{width:0,height:0,x:0,y:-31}
					     }  
			      ],
			attack_right:[
						{
							map:{x:0,y:322,width:200,height:57},
							adjust:{width:0,height:0,x:0,y:0}
						},{
							map:{x:0,y:394,width:200,height:57},
							adjust:{width:0,height:0,x:0,y:0}
						}   
				]
		},
		extend:{
			name:"SpriteWarriors",
			param :{
				bgsprite: background,
				runspeed:5,
				hp:1000,
				atk:170 
			}
		}
	});
 	
 	var enemy01 = new Sprite({
		name:'enemy01',
		src:'images/kurene.png',
		size:1,
		frame:{x:350,y:105,width:80,height:80},
		status:"walk_left",
		current: 0,
		opacity: 1,
		actions:{
			idle_left:[
			           {
					    	 map:{x:0, y:90,width:80, height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0,y:180,width:80,height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0,y:270,width:80,height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0, y:360,width:80,height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     }  
			      ],
			walk_left:[
					     {
					    	 map:{x:0,y:90,width:80, height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{ x:0,y:180,width:80,height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0, y:270, width:80,height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     },{
					    	 map:{x:0,y:360,width:80, height:80},
							 adjust:{width:0,height:0,x:0,y:-30}
					     }  
			      ],
			attack_left:[
			             {
			            	map:{ x:0,y:0,width:80, height:80},
							adjust:{width:0,height:0,x:0,y:0} 
			             },{
							map:{x:0,y:450,width:80,height:80},
							adjust:{width:0,height:0,x:0,y:0}
						},{
							map:{x:0,y:540,width:80, height:80},
							adjust:{width:0,height:0,x:0,y:0}
						}   
				]
		},
		extend:{
			name:"SpriteEnemy",
			param :{
				bgsprite: background,
				hp:1000,
				atk:350
			}
		}
	});
 	
 	battle.addSprite(background); //background.visible = false;
 	battle.addSprite(enemy01); //char01.visible = false;
 	battle.addSprite(char01); char01.visible = false; 
 	battle.addSprite(char02); char02.visible = false;
 	battle.addSprite(char03); char03.visible = false;
 	
 	
 	var game = new Game({
 		canvas:battle,
 		fps:15
 	});
 	
 	game.start();
});
 
function Game( param ){
	
	var status = "stop",
		isAnimating = false,	
		now = 0,	
		then = Date.now(),			
		INTERVAL = 0,	
		delta = 0;		
		counter = 0;
	
	var game = {
		canvas:param.canvas,
		fps:param.fps || 15,
		scene:"start",
		animations:[]
	};
	
	
	game.start = function(){
		status = "start";
		UTILITY.FRAME_RATE = this.fps;
		INTERVAL = 1000 / UTILITY.FRAME_RATE;
		this.animations = [];
		animationAdder(50); //1
		this.resume();
	};
	
	game.stop = function(){
		isAnimating = false;
		this.animations = [];
		status = "stop";
	};
	
	game.pause = function(){
		isAnimating = false;
	};
	
	game.resume = function(){
		isAnimating = true;
		animate();
	};
	
	var animate = function(){
		if(!isAnimating) return;

		requestAnimFrame(function() {
			animate();
		});

	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	    	counter++;
	        then = now - (delta % INTERVAL);
	        var animation = {};
	        
	        for(var i=0; i < game.animations.length; i++){
	        	
	        	animation = game.animations[i];

	        	for(var key in animation.action){
	        		processAnimation(key, animation);
	    		}

	        	if(animation.isFinished){

	        		if(animation.callback)
	        			animation.callback();

	        		game.animations.splice(i,1);

	        		if(game.animations.length===0)
	        			isAnimating = false;
	        	}
	        }
	        game.canvas.paint();
	        
	        //addNewEvents();
	    }
	};
	
	var processAnimation = function(type, animation){
		var sprite = animation.sprite,
			action = animation.action[type];
		switch(type){
		case "earthquake":
			if(action.x == 10){
				earthquake();
				//quake();
			}
			
			if(action.flip)
				action.flip = false;
			else
				action.flip = true;
			action.x*=0.8;
			action.y*=0.8;
			
			//sprite.setTremor( (action.flip)? action.x:-action.x, (action.flip)? action.y:-action.y );
			if(Math.round(action.x) == 0){
				animation.isFinished = true;
				sprite.setTremor(0, 0);
			};
			break;
		case "attack":
			if(sprite.status.indexOf("right")>-1){
				sprite.setAction("attack_right");
				action.count--;
				if(action.count<=0){
					animation.isFinished = true;
					sprite.setAction("idle_right");
				}
			};
			if(sprite.status.indexOf("left")>-1){
				sprite.setAction("attack_left");
				action.count--;
				if(action.count<=0){
					animation.isFinished = true;
					sprite.setAction("idle_left");
				}
			};
			break;
		case "flinch":
			//change color
			if(sprite.opacity == 1)
				sprite.opacity = 0.2;
			else
				sprite.opacity = 1;
			
			if(!action.damagePoints){
				action.damagePoints = computeDamage(sprite, action.attacker, action.attack);
				game.canvas.labels.push({name: sprite.name, 
					x: sprite.frame.x, y: (sprite.frame.y - 10), opacity: 1,
					count: 10, dmg:action.damagePoints});
			}
				
			if(sprite.status.indexOf("right")>-1){
				//flinch to left
				action.distance*=0.8;
				if(sprite.rframe.x >= 60)
					sprite.rframe.x -= action.distance;
				
				if(Math.round(action.distance) == 0){
					sprite.opacity = 1;
					sprite.damage = 0;
					animation.isFinished = true;
				}
					
			}
			if(sprite.status.indexOf("left")>-1){
				//flinch to right
				action.distance*=0.8;
				if(sprite.rframe.x <= 260)
					sprite.rframe.x += action.distance;
				
				if(Math.round(action.distance) == 0){
					sprite.opacity = 1;
					sprite.damage = 0;
					animation.isFinished = true;
				}
			}
			break;
		case "rotate":
			if(action.direction === "counterclockwise"){
				if(sprite.rotation > 340)
					sprite.rotation+=0.2;
				else
					sprite.rotation+=0.2;
				if(sprite.rotation >= 360)
					sprite.rotation-=360;
			}else{
				sprite.rotation-=0.2;
				if(sprite.rotation < 0)
					sprite.rotation+=360;
			}
			
			var pos = {};
			if(sprite.frame.x<=160){
				var posangle = sprite.rotation + 180;
				if(posangle >=360)
			        	posangle-=360;
				pos = sprite.getPositionInEllipsePath(posangle, sprite.rframe.x, sprite.rframe.y, (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO));
			}else{
				pos = sprite.getPositionInEllipsePath(sprite.rotation, sprite.rframe.x, sprite.rframe.y, (UTILITY.BGWIDTHRATIO / UTILITY.BGHEIGHTRATIO));
			}
			sprite.move(pos.x, pos.y);
			
			if(action.direction === "counterclockwise"){
				if(sprite.rotation < 340)
				if(action.rotation < sprite.rotation){
					animation.isFinished = true;
				}
			}else{
				if((sprite.rotation < 340)&&(sprite.rotation > 20)){
					animation.isFinished = true;
				}
			}
			
			break;
		case "encounter":
			action.count--;
			if(sprite.scrollSpeed < 0){
				var result = action.count + sprite.getScrollSpeed();
				//if(result == 0)
				//	animationAdder(2, "enemy01");
				if(result  <= 0){
					sprite.scrollSpeed++;
				}
			}
			if(action.count<=0){
				animation.isFinished = true;
			}
			break;
		case "move":
			if(UTILITY.game.scene === "battle"){
				if(action.delflag){
					sprite.setAction("idle_right");
					animation.isFinished = true;
				}
			};
				
			if(sprite.status === "walk_right"){
				if(sprite.direction === "front"){
					if(sprite.frame.x < action.x)
						sprite.run( action.speed );
					else
						animation.isFinished = true;
				}else if(sprite.direction === "back"){
					if(sprite.frame.x > action.x)
						sprite.run( action.speed );
					else
						animation.isFinished = true;
				}else if(sprite.direction==="stay"){
					action.idle--;
					if(action.idle <= 0)
						animation.isFinished = true;
				}
			}else if(sprite.status === "walk_left"){
				if(sprite.direction === "front"){
					if(sprite.frame.x > action.x)
						sprite.run( - action.speed );
					else
						animation.isFinished = true;
				}
			}
			break;
		case "idle":
			action.time--;
			if(action.time<=0){
				animation.isFinished = true;
			}
		break;
		}
	};
	
	var computeDamage = function(sprite, attacker, attack){
		var attakr = game.canvas.getSprite(attacker);
		var damage = -1;
		if(attack === "normal"){
			damage = attakr.atk;
			sprite.hp -= damage;
			if(sprite.hp <= 0){
				//sprite.visible = false;
				console.log(sprite.name + " DIED");
				//game.pause();
			}
		}
		return damage;
	};
	
	game.addAnimation = function(sprite, action, callback){
		this.animations.push({
				sprite:sprite,
				action:action,
				callback:callback,
				isFinished:false 
		});
	};

	var animationAdder = function(param, name, props){
		var canvas = game.canvas;
		switch(param){
		case 1:
			//START THE GAME BY SCROLLING BACKGROUND
			var bg = canvas.getSprite("bg");
			bg.scroll(true);
			bg.resetScrollSpeed();
			game.addAnimation(bg, { encounter:{ count:50 + UTILITY.random(200) }}, // 50 + UTILITY.random(200)
					function(){
						bg.scroll(false);
						bg.autoRotate();
						animationAdder(4); 
						//animationAdder(11, "enemy01", {target:"char"});
			});
			animationAdder(8, "char01", {x:60, speed:5 + UTILITY.random(5) });
			animationAdder(8, "char02", {x:60, speed:5 + UTILITY.random(5) });
			animationAdder(8, "char03", {x:60, speed:5 + UTILITY.random(5) });
			break;
		case 8:
			//START THE GAME BY SCROLLING BACKGROUND
			var sprite = canvas.getSprite(name);
			sprite.setAction("walk_right");
			sprite.direction = "front";
			game.addAnimation(sprite, { move:{ x:props.x, speed:props.speed, delflag:true }},function(){ if(UTILITY.game.scene !== "battle") sprite.generateNextAction(); });
			break;
		case 2:
			//WALK THE ENEMY TOWARDS CENTER
			var sprite = canvas.getSprite(name);
			sprite.setAction("walk_left");
			game.addAnimation(sprite, { move:{ x:200, speed:7 }},function(){ animationAdder(3); });
			break;
		case 3:
			//START THE BATTLE WITH THIS ONE
			canvas.getSprite("char01").battleStart();
			canvas.getSprite("char02").battleStart();
			canvas.getSprite("char03").battleStart();
			canvas.getSprite("enemy01").battleStart();
			canvas.getSprite("bg").autoRotate();
			animationAdder(9);
			break;
		case 4:
			game.addAnimation(canvas.getSprite("bg"), { rotate:{ rotation:20, direction:"counterclockwise" }}, function(){ if(UTILITY.game.scene === "battle") animationAdder(10);  });
			break;
		case 10:
			game.addAnimation(canvas.getSprite("bg"), { rotate:{ rotation:240, direction:"clockwise" }}, function(){ if(UTILITY.game.scene === "battle") animationAdder(4);});
			break;
		case 9:
			//IDLING
			game.addAnimation(undefined, { idle:{ time:5 }}, function(){
				animationAdder(4); 
				animationAdder(11, "enemy01", {target:"char"});
			});
			break;
		case 5:
			//attack
			game.addAnimation(canvas.getSprite(name), { attack:{ count:(name.indexOf("char")>-1)? 5:7 }});
			if(props.target === "char"){
				for(var i=0; i < canvas.sprites.length; i++){
					if(canvas.sprites[i].name.indexOf("char")>-1){
						(function(target){
							if(target === "char01"){
								//quake2();
								game.addAnimation(undefined, { idle:{ time:2 }}, function(){ animationAdder(12, target, {attacker:name, attack:"normal" }); });
								game.addAnimation(canvas.getSprite("bg"), { earthquake:{ x:10, y:10 }});
							}
							else
								game.addAnimation(undefined, { idle:{ time:2 }}, function(){ animationAdder(7, target, {attacker:name, attack:"normal" });});
						})(canvas.sprites[i].name);
					}
				}
			}else
				game.addAnimation(undefined, { idle:{ time:2 }}, function(){ animationAdder(7, props.target, {attacker:name, attack:"normal" });});
				
			break;
		case 6:
			//move near the enemy then attack!
			var target = canvas.getSprite(props.target);
			var sprite = canvas.getSprite(name);
			if(target.hp > 0){
				sprite.setAction("walk_right");
				sprite.direction = "front";
				game.addAnimation(sprite, { move:{ x:target.rframe.x - 50, speed:10 }}, function(){ animationAdder(5, name, props); });
			}else{
				animationAdder(100, name, props);
			}
			break;
		case 7:
			if(name === "enemy01"){
				game.addAnimation(canvas.getSprite(name), { flinch:{ distance:13, attacker:props.attacker, attack:props.attack }}, function(){ animationAdder(6, "char0" + (UTILITY.random(2)+1), {target:"enemy01"}); });
				game.addAnimation(canvas.getSprite("bg"), { earthquake:{ x:10, y:10 }});
			}
			else
				game.addAnimation(canvas.getSprite(name), { flinch:{ distance:13, attacker:props.attacker, attack:props.attack }});
			break;
		case 11:
			//move enemy to nearest guy then attack
			var sprite = canvas.getSprite(name);
			sprite.setAction("walk_left");
			sprite.direction = "front";
			var target = 60;
			for(var i=0; i < canvas.sprites.length; i++){
				if(canvas.sprites[i].name.indexOf("char")>-1){
					target = Math.max(target, canvas.sprites[i].frame.x);
				}
			}
			game.addAnimation(sprite, { move:{ x:target + 50, speed:10 }}, function(){ animationAdder(5, name, {target:"char"}); });
			break;
		case 12:
			game.addAnimation(canvas.getSprite(name), { flinch:{ distance:13, attacker:props.attacker, attack:props.attack }}, function(){ animationAdder(6, "char0" + (UTILITY.random(2)+1), {target:"enemy01"}); });
			break;
		case 50:
			var bg = canvas.getSprite("bg");
			bg.scroll(true);
			bg.resetScrollSpeed();
			game.addAnimation(bg, { encounter:{ count:0 }}, //count:50 + UTILITY.random(200)
					function(){
						bg.scroll(false);
						animationAdder(51); 
			});
			break;
		case 51:
			var bg = canvas.getSprite("bg");
			bg.autoRotate();
			animationAdder(4); 
			//char01 = UTILITY.game.canvas.getSprite("char01");
			//char01.move(60,140);
			rotate( true );
			break;
		case 100:
			var result = $("#battle_result"),
				width = parseInt($("#battle_result").css("width")),
				left = ($(window).width() /2) - (width /2),
				top = UTILITY.game.canvas.CANVAS_Y - 17;
		
			result.css({"visibility":"visible", "top":top, "left":left});
			console.log("RESULTS!");
			break;
		};
	};
	
	game.virtual = function(){
		animationAdder(4);
		rotate( true );
		game.resume();
		
	};
	
	UTILITY.game = game;
	
	return game;
};
















function rotate( param ){
	var rotate = param;
	UTILITY.FRAME_RATE = 15;
	
	var now;
	var then = Date.now();
	var INTERVAL = 1000 / UTILITY.FRAME_RATE;
	var delta;
	
	bg = UTILITY.game.canvas.getSprite("bg");
	char01 = UTILITY.game.canvas.getSprite("char01");
	char02 = UTILITY.game.canvas.getSprite("char02");
	char03 = UTILITY.game.canvas.getSprite("char03");
	enem01 = UTILITY.game.canvas.getSprite("enemy01");
	
	char01.move(60,120);
	char02.move(60,160);
	char03.move(60,200);
	enem01.move(230,150);
	
	char01.visible = true;
	char01.setAction("idle_right");
	char01.resetEllipseData();
	
	
	char02.visible = true;
	char02.setAction("idle_right");
	char02.resetEllipseData();
	
	char03.visible = true;
	char03.setAction("idle_right");
	char03.resetEllipseData();
	
	enem01.visible = true;
	enem01.setAction("idle_left");
	enem01.resetEllipseData();
	
	
	
	
	var count = 0;
	var animate = function(){
		if(!rotate) return;
		requestAnimFrame(function() {
			animate();
		});

	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	        then = now - (delta % INTERVAL);
	        //rotation+=1;
	        //if(rotation>=360)
	        //rotation = 0;
	        //console.log(rotation - bg.rotation);
	        
	        //console.log(_rotate);
	        
	        
	        char01.moveAtBGRotationPath();
	        char02.moveAtBGRotationPath();
	        char03.moveAtBGRotationPath();
	        enem01.moveAtBGRotationPath();
	       
	        

	        count++;
	        if((count > 20)&&(count <= 40)){
	        	char01.setAction("walk_right");
	        	char01.moveAtBGAngularPath(10);
	        }
	        if(count == 40){
	        	char01.setAction("idle_right");
	        	char01.moveFinish();
	        }
	        
	        if((count > 200)&&(count <= 220)){
	        	char01.setAction("walk_right");
	        	char01.moveAtBGAngularPath(-10);
	        }
	        if(count == 220){
	        	char01.setAction("idle_right");
	        	char01.moveFinish();
	        }
	        
	        if((count > 20)&&(count <= 30)){
	        	enem01.setAction("walk_left");
	        	enem01.moveAtBGAngularPath(-10);
	        }
	        if(count == 30){
	        	enem01.setAction("idle_left");
	        	enem01.moveFinish();
	        }
	        
	        if((count > 200)&&(count <= 210)){
	        	enem01.setAction("walk_left");
	        	enem01.moveAtBGAngularPath(10);
	        }
	        if(count == 210){
	        	enem01.setAction("idle_left");
	        	enem01.moveFinish();
	        }
	        
	        	
	    }
	};
	
	animate();
};




























function earthquake(){
	var rotate = true;
	UTILITY.FRAME_RATE = 15;
	
	var now;								//FPS繧貞宛髯舌＆縺帙ｋ
	var then = Date.now();					//FPS繧貞宛髯舌＆縺帙ｋ
	var INTERVAL = 1000 / UTILITY.FRAME_RATE;		//FPS
	var delta;								//FPS繧貞宛髯舌＆縺帙ｋ
	
	
	var flip = true;
	var x = 10;
	var y = 10;
	
	var animate = function(){
		if(!rotate) return;
		requestAnimFrame(function() {
			animate();
		});
		
		

	    now = Date.now();
	    delta = now - then;

	    if (delta > INTERVAL) {
	        then = now - (delta % INTERVAL);
	        
	        if(flip)
				flip = false;
			else
				flip = true;
			x*=0.8;
			y*=0.8;
			//earthquake2()
			UTILITY.game.canvas.sprites[0].setTremor((flip)? x:-x, (flip)? y:-y);
			if(Math.round(x) == 0){
				UTILITY.game.canvas.sprites[0].setTremor(0, 0);
				rotate = false;
			};
	    }
	};
	
	animate();
};

function quake(){
	//UTILITY.game.addAnimation(UTILITY.game.canvas.getSprite("bg"), { earthquake:{ x:10, y:10 }});
	UTILITY.game.animations.unshift({
		sprite:UTILITY.game.canvas.getSprite("bg"),
		action:{ earthquake:{ x:10, y:10 }},
		callback:undefined,
		isFinished:false 
	});
	
};

function quake2(){
	UTILITY.game.animations.push({
		sprite:UTILITY.game.canvas.getSprite("bg"),
		action:{ earthquake:{ x:10, y:10 }},
		callback:undefined,
		isFinished:false 
	});
};

var qdir = true;
function earthquake2(){
	var spr = {};
	for(var i=0; i<UTILITY.game.canvas.sprites.length; i++){
		spr = UTILITY.game.canvas.sprites[i];
		
		if(spr.rframe){
			if(qdir){
				spr.rframe.x -= 10;
				spr.rframe.y -= 10;
				qdir = false;
			}else{
				spr.rframe.x += 10;
				spr.rframe.y += 10;
				qdir = true;
			}
		}
	}
};