/*********************************
*         Roxanne Henry          *
*          DGIF 6037             *
*   Using the P5.speech library  *
**********************************/

var serial;          // variable to hold an instance of the serialport library
var portName = 'COM5'; // fill in your serial port name here
var inData;                            // for incoming serial data

 var myRec = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)

function setup() {
 createCanvas(400, 300);          // make the canvas
 myRec.onResult = showResult;
 myRec.onEnd = printSomething;
 myRec.start();
 serial = new p5.SerialPort();    // make a new instance of the serialport library
 serial.on('data', serialEvent);  // callback for when new data arrives
 serial.on('error', serialError); // callback for errors
 serial.open(portName);           // open a serial port
}

function serialEvent() {
  inData = Number(serial.read()); //kind of unecessary, but leaving this in so i can quickly make use of it later if i want to
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ', err);
}

function draw() {
  //nothing needs to be here
}


function showResult() {
  console.log("Showing results"); //debugging
 if(myRec.resultValue==true) { //if there's a recording
   console.log(myRec.resultString) //debugging
   if(myRec.resultString.search("Roxanne")>-1){ //if the recording contains the word "Roxanne"
     // send it out the serial port:
     var outByte = byte(3); //3 is arbitrary but it was changed from 1 because the button was sending 1s before and i wanted their signals to be distinct
     serial.write(outByte);
     console.log("hey yo it's you");//debugging

    background(192, 255, 192);//colour the background
    text(myRec.resultString, width/2, height/2);//and print the recording out (this is just to look pretty)
   }else{
     console.log("not Roxanne"); //debugging
   }


 }
}

//start recording again if you stop recording... stop stopping... honestly............
function printSomething(){
   console.log("ending");
   myRec.start();
}
