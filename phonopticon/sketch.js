var pubnubError = true;
var myUserID;
var outResponse = {uuid: 0};
var inResponse = {uuid: 0};
var channelName = 'mudit';
var startButton;
var state = 0; //states: 0-START 1-Y/N 2-FINAL
var numAns = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // initialize pubnub
    pubnub = PUBNUB.init({
      publish_key   : 'pub-c-a210a34e-4b38-474e-8fe8-b70f0c0b2924',  //get these from the pubnub account online
      subscribe_key : 'sub-c-84d87f80-fd57-11e7-8c23-76e4b319f7ff',
      uuid: myUserID,
      ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
    });

    pubnub.subscribe({
        channel: channelName,
        message: readIncoming
    });

    myUserID = PUBNUB.uuid();

    outResponse.uuid = myUserID;

    console.log("done setup");

}

var timer = 0;
var currTime = 0;
function draw() {
  removeElements();
  drawButton();
  background('black');
  currTime = millis();
}

function changeState() {
  state++;
}

function drawButton(){
  switch(state){
    case 0:
      //BUTTON SETUP
      startButton = createButton('Start');
      startButton.position(width/20, height/8);
      startButton.size(width-(width/10), height-(height/2));
      startButton.style('background-color', '#12b259');
      startButton.style('border', 'none');
      startButton.style('color', '#fffbf7')
      startButton.style('font-weight', 'bold')
      startButton.style('font-size', '225px')
      startButton.mousePressed(function(){
        startButton.style('background-color', '#148245');
        outResponse.response = "start"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
      });
      break;
    case 1:
      okButton = createButton('Okay');
      okButton.position(width/20, height/8);
      okButton.size(width-(width/10), height-(height/2));
      okButton.style('background-color', '#12b259');
      okButton.style('border', 'none');
      okButton.style('color', '#fffbf7')
      okButton.style('font-weight', 'bold')
      okButton.style('font-size', '225px')
      okButton.mousePressed(function(){
        okButton.style('background-color', '#148245');
        outResponse.response = "okay"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
      });
      break;
    case 2:
      //BUTTON SETUP
      if(numAns<=5){
        yesButton = createButton('Yes');
        noButton = createButton('No');

        if(currentTime - timer >= 30000){
          yesButton.disabled = false;
          noButton.disabled = false;
        }

        yesButton.position(width/20, height/10);
        yesButton.size(width-(width/10), height/2-(height/4));
        yesButton.style('background-color', '#12b259');
        yesButton.style('border', 'none');
        yesButton.style('color', '#fffbf7')
        yesButton.style('font-weight', 'bold')
        yesButton.style('font-size', '225px')
        yesButton.mousePressed(function(){
          yesButton.style('background-color', '#148245');
          outResponse.response = "yes"; publish();
          numAns++;
          timer = millis();
          yesButton.disabled = true;
          noButton.disabled = true;
        });


        noButton.position(width/20, height/2);
        noButton.size(width-(width/10), height/2-(height/4));
        noButton.style('background-color', '#e00b0b');
        noButton.style('border', 'none');
        noButton.style('color', '#fffbf7')
        noButton.style('font-weight', 'bold')
        noButton.style('font-size', '225px')
        noButton.mousePressed(function(){
          noButton.style('background-color', '#b71414');
          outResponse.response = "no"; publish();
          numAns++;
          timer = millis();
          yesButton.disabled = true;
          noButton.disabled = true;
        });

      } else {changeState();}

      break;
    case 3:
        continueButton = createButton('Continue');
        continueButton.position(width/20, height/8);
        continueButton.size(width-(width/10), height-(height/2));
        continueButton.style('background-color', '#12b259');
        continueButton.style('border', 'none');
        continueButton.style('color', '#fffbf7')
        continueButton.style('font-weight', 'bold')
        continueButton.style('font-size', '115px')
        continueButton.mousePressed(function(){
          continueButton.style('background-color', '#148245');
          outResponse.response = "continue"
          publish();
          //move on the state to display the yes/no buttons
          changeState();
        });
        break;
    default:
      //BUTTON SETUP
      reStartButton = createButton('Restart');
      reStartButton.position(width/20, height/8);
      reStartButton.size(width-(width/10), height-(height/2));
      reStartButton.style('background-color', '#12b259');
      reStartButton.style('border', 'none');
      reStartButton.style('color', '#fffbf7')
      reStartButton.style('font-weight', 'bold')
      reStartButton.style('font-size', '115px')
      reStartButton.mousePressed(function(){
        reStartButton.style('background-color', '#148245');
        outResponse.response = "restart"; publish();
      });
  }

}

function publish() {
  console.log("publishing");
  pubnub.publish({
    channel: channelName,
    message: outResponse
  });
};

function readIncoming(message){ //when new data comes in it triggers this function,
                                // this works becsuse we subscribed to the channel in setup()
  if(message.userID == myUserID) {
      inResponse = message;
  }
}
