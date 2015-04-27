var Floor = function( sprite, params ){
	
	var scrolling = false;
	
	//this will load extension on init
	sprite.initExtension = function(){};
	
	//this will excecute on image load
	sprite.initExtensionOnImageLoad = function(){
		//override the move event
		trnsl8_wrapper = UTILITY.getWrapper( sprite.name + '_translate' );
		trnsl8_wrapper.addEventListener( 'webkitTransitionEnd' , deadend, false);
	};
	
	sprite.run = function( counter ){
		if( !scrolling ){
			scrolling = true;
			sprite.scroll();
		}
	};
	
	sprite.scroll = function(){
		sprite.move({x:sprite.frame.x-7, y:sprite.frame.y, animate:true, speed: params.speed});
	};
	
	sprite.reset = function(){
		sprite.move({x:sprite.frame.x+7, y:sprite.frame.y, animate:false});
		setTimeout(function(){
			sprite.scroll();
		}, 0);
	};
	
	function deadend(e){
		sprite.reset();
	}
};