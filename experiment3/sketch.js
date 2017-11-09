var serial;          // variable to hold an instance of the serialport library
var portName = 'COM5'; // fill in your serial port name here
var inData;                            // for incoming serial data

 var myRec = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)

function setup() {
 createCanvas(400, 300);          // make the canvas
 myRec.onResult = showResult;
 myRec.start();
 serial = new p5.SerialPort();    // make a new instance of the serialport library
 serial.on('data', serialEvent);  // callback for when new data arrives
 serial.on('error', serialError); // callback for errors
 serial.open(portName);           // open a serial port
}

function serialEvent() {
  inData = Number(serial.read());
  console.log(inData);
  if(inData ==1){
    myRec = new p5.SpeechRec();
    myRec.onResult = showResult;
    myRec.start();
  }
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function draw() {
 // black background, white text:
 // background(0);
 // fill(255);
 // display the incoming serial data as a string:
 // text("incoming value: " + inData, 30, 30);
}


function showResult() {
  console.log("Showing results");
 if(myRec.resultValue==true) {

   console.log(myRec.resultString)
   if(myRec.resultString.search("Roxanne")>-1){
     // send it out the serial port:
     var outByte = byte(1);
     serial.write(outByte);
     console.log("hey yo it's you")
   }

   background(192, 255, 192);
   text(myRec.resultString, width/2, height/2);

 }
 else{
   console.log("if we're entering this i swear to god");
   var outByte = byte(0);
   serial.write(outByte);
 }
}
