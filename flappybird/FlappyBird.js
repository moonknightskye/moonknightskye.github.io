var FlappyBird = function( scene, params ){
	
	var touch = {
		id: -1,						//指のIDの定義
		x: {start: 0, end: 0},		//タッチし始めるの指の位置
		y: {start:0, end: 0}		//タッチし終わるの指の位置
	},
	CONSECUTIVE_TOUCH = 1;			//指の同時タッチの定義
	
	var firsttap = false;
	var char01 = "";
	var upper = "";
	var lower = "";
	
	//this will load extension on init
	scene.initExtension = function(){
		//タッチし始めるのイベントを起こす
		scene.instance.addEventListener( 'touchstart' , function( event ) {
			
			if( !firsttap ){
				//1. clear the screen with the design
				firsttap = true;
				for ( var i = 0; i < scene.sprites.length; i++ ) {
					if(scene.sprites[i].name == "char01" )
						char01 = scene.sprites[i];
				}
				upper = scene.getSprite('upper_pipe');
				lower = scene.getSprite('lower_pipe');
				scene.generatePipes();
			}else{
				char01.flap();
			}
			
			for ( var i = 0; i < event.changedTouches.length; i++ ) {
				if(i >= CONSECUTIVE_TOUCH) return;
				
				//指の定義
				var finger = event.changedTouches[ i ];
				touch.x.start = finger.pageX;
				touch.y.start = finger.pageY;
				
				//console.log(touch.x.start + " " + touch.y.start);
			}
		});
	};
	
	scene.generatePipes = function(){
		var upper = scene.getSprite('upper_pipe'),
			lower = scene.getSprite('lower_pipe');

		setTimeout(
			function(){
				var height = Math.floor(Math.random() * 100);
				upper.scroll({x:200, y:height, animate:true, speed: 10});
				lower.scroll({x:200, y:205 + height, animate:true, speed: 10});
			},100
		);
	};
	
	scene.run = function( counter ){
		//if (counter % 20 === 0)
		//	scene.generatePipes();
		for(var i=0; i < this.sprites.length; i++){
			if( !this.sprites[i].isLoading ){
				this.sprites[i].run( counter );
			}
		}
//		if( firsttap ){
//			if( char01.isCollided( upper.getSquareBounds() ) || char01.isCollided( lower.getSquareBounds() ) ){
//				alert("GAME OVER");
//				setTimeout(
//					function(){
//						upper.reset();
//						lower.reset();
//					},1000
//				);
//			}
//				
//		}
	};
	
	function preventDefault(e) { 
		e.preventDefault();
	};

};