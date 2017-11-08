	var serial;          // variable to hold an instance of the serialport library
	var portName = 'COM3'; // fill in your serial port name here
	var inData;                            // for incoming serial data
	var outByte = 0;                       // for outgoing data

	var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
	myRec.continuous = true; // do continuous recognition
	myRec.interimResults = false; // allow partial recognition (faster, less accurate)
	var x, y;
	var dx, dy;
	function setup()
	{
		// graphics stuff:
		createCanvas(800, 600);
		background(255, 255, 255);
		fill(0, 0, 0, 255);
		x = width/2;
		y = height/2;
		dx = 0;
		dy = 0;
		// instructions:
		textSize(20);
		textAlign(LEFT);
		text("draw: up, down, left, right, clear", 20, 20);
		//myRec.onResult = parseResult; // now in the constructor
		myRec.start(); // start engine
		console.log(myRec);
	}
	function draw()
	{
		ellipse(x, y, 5, 5);
		x+=dx;
		y+=dy;
		if(x<0) x = width;
		if(y<0) y = height;
		if(x>width) x = 0;
		if(y>height) y = 0;
	}
	function parseResult()
	{
		console.log("parsing results");
		// recognition system will often append words into phrases.
		// so hack here is to only use the last word:
		var mostrecentword = myRec.resultString.split(' ').pop();
		if(mostrecentword.indexOf("left")!==-1) { dx=-1;dy=0; }
		else if(mostrecentword.indexOf("right")!==-1) { dx=1;dy=0; }
		else if(mostrecentword.indexOf("up")!==-1) { dx=0;dy=-1; }
		else if(mostrecentword.indexOf("down")!==-1) { dx=0;dy=1; }
		else if(mostrecentword.indexOf("clear")!==-1) { background(255); }
		console.log(mostrecentword);
	}
