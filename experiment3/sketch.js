var myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
	myRec.continuous = true; // do continuous recognition
	myRec.interimResults = true; // allow partial recognition (faster, less accurate)

	function setup()
	{
		// graphics stuff:
		createCanvas(800, 400);
		background(255, 255, 255);
		fill(0, 0, 0, 255);
		// instructions:
		textSize(32);
		textAlign(CENTER);
		text("say something", width/2, height/2);
		myRec.start();
		console.log(myRec);
	}
	function draw()
	{
		// why draw when you can talk?
	}
	function parseResult() {
		if(myRec.resultValue==true) {
			background(192, 255, 192);
			text(myRec.resultString, width/2, height/2);
			var mostrecentword = myRec.resultString.split(' ').pop();
			console.log(mostrecentword);
		}
	}
