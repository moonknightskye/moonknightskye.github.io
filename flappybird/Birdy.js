var Birdy = function( sprite, params ){
	
	var sway = false;
	var flapup = false;
	var firsttap = false;
	var trnsl8_wrapper = "";
	var flaptap = false;
	var halffall = false;
	var suspend = 10;
	
	var ground = 200;		//ground distance
	
	
	//this will load extension on init
	sprite.initExtension = function(){};
	
	//this will excecute on image load
	sprite.initExtensionOnImageLoad = function(){
		//override the move event
		trnsl8_wrapper = UTILITY.getWrapper( [sprite.name, "_translate"].join("") );
		trnsl8_wrapper.addEventListener("webkitTransitionEnd", flap, false);
	};
	
	sprite.run = function( counter ){
		//console.log(counter);
		if( !sway ){
			sway = true;
			sprite.flapdown();
		}
		sprite.animate();
	};
	
	sprite.flapdown = function(){
		sprite.move({x:sprite.frame.x, y:sprite.frame.y+5, animate:true, speed: 100});
		flapup = false;
	};
	
	sprite.flapup = function(){
		sprite.move({x:sprite.frame.x, y:sprite.frame.y-5, animate:true, speed: 100});
		flapup = true;
	};
	
	sprite.flap = function(){
		if(!firsttap){
			firsttap = true;
		}
		sprite.rotate({angle:40, animate:false, speed: 1});
		sprite.move({x:sprite.frame.x, y:($("#char01_translate").position().top/2) - 20, animate:true, speed: 1});
		flaptap = true;
		suspend = 10;
		halffall = false;
		//($("#char01_translate").position().top/2) + 6.5 STAY ON POSITION
	};

	sprite.plunge = function( param ){
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
		trnsl8_wrapper = document.getElementById(sprite.name + '_translate');
		
		if( trnsl8_wrapper )
		trnsl8_wrapper.style.cssText = [anim, UTILITY.getCSS({translate: param, zindex: sprite.zindex})].join("");
	};

	
	var getAnimationText = function( time ){
		var cubic = "0.550, 0.055, 0.790, 0.270";
		return '-webkit-transition: -webkit-transform ' + time + 'ms cubic-bezier(' + cubic + '); ' +
				'-webkit-transition-timing-function: cubic-bezier(' + cubic + '); ';
	};
	
	function flap(e){
		if(!firsttap){
			(flapup) ? sprite.flapdown() : sprite.flapup();
		}else{
			if(flaptap){
				if(e.target.id.indexOf("translate") != -1){
					sprite.move({x:sprite.frame.x, y:($('#' + sprite.name + '_translate').position().top/2) + 60, animate:true, speed: 15});
					sprite.rotate({angle:-90, animate:true, speed: 5});
					halffall = true;
					flaptap = false;
				}
			}else if( halffall ){
				if(e.target.id.indexOf("translate") != -1){
					var current_pos = ($('#' + sprite.name + '_translate').position().top/2) + 6.5;
					var speed = (200 - current_pos) / 40;
					sprite.plunge({x:sprite.frame.x, y:200, animate:true, speed: speed});
					halffall = false;
				}
			}
			if(!flaptap ||  !halffall){
				if(e.target.id.indexOf("translate") != -1){
					if( (($('#' + sprite.name + '_translate').position().top/2) + 6.5)  >= 200 ){
						console.log("GAME OVER");
					}
				}
			}
			
		}
	};
};