var Pipe = function( sprite, params ){
	
	//this will load extension on init
	sprite.initExtension = function(){};
	
	//this will excecute on image load
	sprite.initExtensionOnImageLoad = function(){
		var trnsl8_wrapper = UTILITY.getWrapper( [sprite.name, "_translate"].join("") );
		trnsl8_wrapper.addEventListener("webkitTransitionEnd", deadend, false);
	};
	
	sprite.scroll = function( param ){
		sprite.move({x:param.x, y:param.y, animate:true, speed: params.speed});
	};
	
	//var destroy = function(){
	//	var trnsl8_wrapper = UTILITY.getWrapper( [sprite.name, "_translate"].join("") );
	//	trnsl8_wrapper.removeEventListener("webkitTransitionEnd", destroy, false);
	//	sprite.scene.removeSprite( sprite );
	//};
	
	sprite.reset = function(){
		sprite.move({x: 389, y:sprite.frame.y, animate:false}); //-302
		setTimeout(function(){
			if(sprite.name === 'upper_pipe' )
				sprite.scene.generatePipes();
			//sprite.scroll({x: 200, y:sprite.frame.y});
		}, 100);
	};
	
	function deadend(e){
		sprite.reset();
	}
	
	var getAnimationText = function( time ){
		return ["-webkit-transition: -webkit-transform ",time,"ms linear; "].join("");
	};
};