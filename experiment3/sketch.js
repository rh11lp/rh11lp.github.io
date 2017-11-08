	var serial;          // variable to hold an instance of the serialport library
	var portName = 'COM3'; // fill in your serial port name here
	var inData;                            // for incoming serial data
	var outByte = 0;                       // for outgoing data

	 var myRec = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)

	function setup() {
	 createCanvas(400, 300);          // make the canvas
	 myRec.onResult = showResult;
	 myRec.start();
	 // serial = new p5.SerialPort();    // make a new instance of the serialport library
	 // serial.on('data', serialEvent);  // callback for when new data arrives
	 // serial.on('error', serialError); // callback for errors
	 // serial.open(portName);           // open a serial port
	}

	function serialEvent() {
	 // read a byte from the serial port:
	 var inByte = serial.read();
	 // store it in a global variable:
	 inData = inByte;
	}

	function serialError(err) {
	  println('Something went wrong with the serial port. ' + err);
	}

	function draw() {
	 // black background, white text:
	 // background(0);
	 // fill(255);
	 // display the incoming serial data as a string:
	 //text("incoming value: " + inData, 30, 30);
	}


	function showResult() {
	 if(myRec.resultValue==true) {
	 	background(192, 255, 192);
	 	text(myRec.resultString, width/2, height/2);
	 	console.log(myRec.resultString);
	  console.log(myRec);
		myRec.start();
	 }
	}
