(function(window) {
	
	var PTUtils = function(){
		throw "PTUTils is a static class and not meant to be instantiated";
	};

	PTUtils.makeTriangle = function(color, width, height) {
		var triangle = new cjs.Shape();
		triangle.graphics.beginFill(color).
			lineTo(width/2, 0).
			lineTo(0, -height).
			lineTo(-width/2, 0).
			lineTo(0, 0);
		return triangle;
	};

	PTUtils.makeCircle = function(color, radius) {
		var triangle = new cjs.Shape();
		triangle.graphics.beginFill(color).
		drawCircle(0, 0, radius);
		return triangle;
	};

	PTUtils.makeRect = function(color, x, y, w, h) {
		var rect = new cjs.Shape();
		rect.graphics.beginFill(color).
		drawRect(x, y, w, h);
		return rect;
	};
		

	PTUtils.populateBits = function(container, numBits) {
		for (var i = 0; i < numBits; i++) {
			var bit = PTUtils.makeTriangle('#FFF', 5, 5);
			var spread = 1000;
			bit.x = Math.random()*spread - Math.random()*spread;
			bit.y = Math.random()*spread - Math.random()*spread;
			bit.rotation = Math.random()*360;
			container.addChild(bit);
		}
	};

	PTUtils.makeFPSLabel = function() {
		fpsLabel = new Text("-- fps","bold 10px Arial","#FFF");
		fpsLabel.x = 10;
		fpsLabel.y = 20;
		fpsLabel.tick = function() {
			this.text = Math.round(Ticker.getMeasuredFPS()) + " FPS";
		};
		return fpsLabel;
	};

	PTUtils.polarRadians = function(len, angleRadians) {
		return new cjs.Point(-len * Math.sin(-angleRadians), -len * Math.cos(-angleRadians));
	};

	PTUtils.polarDegrees = function(len, angleDegrees) {
		return PTUtils.polarRadians(len, PTUtils.degreesToRads(angleDegrees));
	};

	PTUtils.degreesToRads = function(degrees) {
		return (degrees * (Math.PI/180));
	};

	PTUtils.radsToDegrees = function(rads) {
		var degrees = rads*(180/Math.PI);
		if (degrees < -180) degrees += 360;
		return degrees; 
	};

	PTUtils.distance = function(p1, p2) {
		return Math.sqrt(Math.pow((p2.x - p1.x), 2)+Math.pow((p2.y - p1.y), 2));
	};

	PTUtils.angleRadians = function(p1, p2) {
		return (Math.atan2(p1.y-p2.y,p1.x-p2.x) - (Math.PI/2));
	};

	PTUtils.angleDegrees = function(p1, p2) {
		return PTUtils.radsToDegrees(PTUtils.angleRadians(p1, p2));
	};

	PTUtils.getOppositeAngleRadians = function(radians) {
		return radians - (Math.PI/2) + (Math.random()*Math.PI);
	};

	PTUtils.getAdjustedRotation = function(rotation) { 
		if (rotation > 180) {
			rotation -= (Math.floor(rotation / 360)+1) * 360;
		} else if (rotation < -180) {
			rotation +=  -(Math.floor(rotation / 360)) * 360;
		}
		return rotation;
	};

	PTUtils.addPoints = function(pointA, pointB) {
		return new cjs.Point(pointA.x + pointB.x, pointA.y + pointB.y);
	};

	window.PTUtils = PTUtils;
	
}(window));