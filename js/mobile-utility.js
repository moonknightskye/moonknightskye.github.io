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
	
	round: function( param ){
		return ( 0.5 + param ) << 0;
	},
	
	setGame: function( param ){
		UTILITY.GAME_INSTANCE = param;
	},
	
	getGame: function(){
		return UTILITY.GAME_INSTANCE;
	},
	
	createWrapper: function( id ){
		var wrapper = document.createElement( 'div' );
		wrapper.setAttribute( 'id', id );
		return wrapper;
	},
	
	getWrapper: function ( id ){
		return document.getElementById( id );
	},
	
	getCSS: function( param ){
		var css = [];
		for(var key in param){
			var prop = param[key];
			switch(key){
			case "frame":
				css.push("position: ", prop.position || "absolute", "; left: ", prop.x, "px; top: ",
				           prop.y, "px; width: ", prop.width, "px; height: ", prop.height, "px; ");
				break;
			case "size":
				css.push("width: ", prop.width, "px; height: ", prop.height, "px; ");
				break;
			case "bgcolor":
				css.push("background: ", prop, "; ");
				break;
			case "zindex":
				css.push("z-index: ", prop, "; ");
				break;
			case "overflow":
				css.push("overflow: ", prop, "; ");
				break;
			case "backgroundimage":
				css.push("background: url(\"",prop.src, "\") no-repeat; background-size: ",
						prop.width, "px ", prop.height, "px;");
				break;
			case "map":				
				css.push("background-position: ", prop.x, "px ", -(prop.y), "px; ");
				break;
			case "scale":
				css.push("-webkit-transform: scale(", prop.wsize, ", ", prop.hsize, ");");
				break;
			case "translate":
				css.push("position: absolute; -webkit-transform: translate(", prop.x, "px, ", prop.y, "px);");
				break;
			case "rotate":
				css.push("-webkit-transform: rotate(", -(prop.rotation), "deg);");
				break;
			case "opacity":
				css.push("opacity: ", prop, ";");
				break;
			}
		};
		return css.join("");
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
		if(ua.match(/Android 2/i)) return 'Android 2.x';
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
	},
	
	moveAtAngularPath: function(speed, angle){
		var delta = (360 - angle) * (Math.PI  / 180);
		return {
			x: speed * Math.cos(delta),
			y: speed * Math.sin(delta)
		};
	}
};