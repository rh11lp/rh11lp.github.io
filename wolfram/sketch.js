/*
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 *
 * Uses a PubNub function to query the Wolfram Conversation API
 *
 *
 */

// server variables

var dataServer;
var pubKey = 'pub-c-91b2a742-94e2-4b18-bcb4-652c2ef4a459';
var subKey = 'sub-c-68efe072-23f0-11e9-8dc2-e611751b4b19';

//input variables
var sendText;
var sendButton;

//size of the active area
var cSizeX = 900;
var cSizeY = 600;

var returnedAnswer = [];

//This must match the channel you set up in your function
var channelName = "wolfram";

var myRec = new p5.SpeechRec(); // speech recognition object (will prompt for mic access)


function setup()
{
  getAudioContext().resume();
  createCanvas(cSizeX, cSizeY);
  background(255);

  //setup recording
  myRec.onResult = showResult;
  myRec.onEnd = printSomething;
  myRec.start();


   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });

  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming})
  dataServer.subscribe({channels: [channelName]});

  //create the text fields for the message to be sent
  sendText = createInput();
  sendText.position(5,height);

  sendButton = createButton('Ask a Question');
  sendButton.position(sendText.x + sendText.width,height);
  sendButton.mousePressed(sendTheMessage);

}

function draw()
{


}

function showResult() {
  console.log("Showing results"); //debugging
 if(myRec.resultValue==true) { //if there's a recording
   console.log(myRec.resultString) //debugging
 }
}

//start recording again if you stop recording... stop stopping... honestly............
function printSomething(){
   console.log("ending");
   myRec.start();
   console.log("starting up again");
 }



///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {


  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message:
      {
        text: sendText.value()       //text: is the message parameter the function is expecting
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function,
{                               // this works becsuse we subscribed to the channel in setup()


console.log(inMessage);  //log the entire response
                          //the message parameter to look for is answer


    background(255);
    noStroke();
    fill(0);  //read the color values from the message
    textSize(20);
    text(inMessage.message.answer, 5, height/2);
    returnedAnswer=inMessage.message.answer.split(" ");

}

function whoisconnected(connectionInfo)
{

}
