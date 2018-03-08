var pubnubError = true;
var myUserID;
var outResponse = {uuid: 0};
var inResponse = {uuid: 0};
var channelName = 'mudit';
var startButton;
var state = 0; //states: 0-START 1-Y/N 2-FINAL
var numAns = 0;
var firstEntry = true;

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
      startButton.style('background-color', '#000000');
      startButton.style('border', '4px solid #2bec9b');
      startButton.style('border-radius', '4px');
      startButton.style('color', '#2bec9b');
      startButton.style('font-size', '225px')
      startButton.touchEnded(function(){
        startButton.style('background-color', '#2bec9b');
        startButton.style('color', '#000000');
        outResponse.response = "start"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
        return false;
      });
      break;
    case 1:
      okButton = createButton('Okay');
      okButton.position(width/20, height/8);
      okButton.size(width-(width/10), height-(height/2));
      okButton.style('background-color', '#000000');
      okButton.style('border', '4px solid #2bec9b');
      okButton.style('border-radius', '4px');
      okButton.style('color', '#2bec9b');
      okButton.style('font-size', '225px')
      okButton.touchEnded(function(){
        okButton.style('background-color', '#2bec9b');
        okButton.style('color', '#000000');
        outResponse.response = "okay"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
        return false;
      });
      break;
    case 2:
      //BUTTON SETUP
      if(numAns<=5){
        yesButton = createButton('Yes');
        noButton = createButton('No');

        if(currTime - timer >= 30000 || firstEntry){
          console.log('buttons are enabled');
          yesButton.attribute('disabled','false');
          noButton.attribute('disabled','false');
          timer=0;
          firstEntry=false;
        }else{
          console.log('buttons are disabled');
          yesButton.attribute('disabled','true');
          noButton.attribute('disabled','true');
        }

        yesButton.position(width/20, height/10);
        yesButton.size(width-(width/10), height/2-(height/4));
        yesButton.style('background-color', '#000000');
        yesButton.style('border', '4px solid #2bec9b');
        yesButton.style('border-radius', '4px');
        yesButton.style('color', '#2bec9b');
        // yesButton.style('font-weight', '500');
        yesButton.style('font-size', '225px');
        yesButton.touchEnded(function(){
          yesButton.style('background-color', '#2bec9b');
          yesButton.style('color', '#000000');
          outResponse.response = "yes"; publish();
          numAns++;
          timer = millis();
          yesButton.attribute('disabled','true');
          noButton.attribute('disabled','true');
          return false;
        });


        noButton.position(width/20, height/2);
        noButton.size(width-(width/10), height/2-(height/4));
        noButton.style('background-color', '#000000');
        noButton.style('border', '4px solid #2bec9b');
        noButton.style('border-radius', '4px');
        noButton.style('color', '#2bec9b');
        noButton.style('font-size', '225px');
        noButton.touchEnded(function(){
          noButton.style('background-color', '#2bec9b');
          noButton.style('color', '#000000');
          outResponse.response = "no"; publish();
          numAns++;
          timer = millis();
          yesButton.attribute('disabled','true');
          noButton.attribute('disabled','true');
          return false;
        });

      } else {changeState();}

      break;
    case 3:
        continueButton = createButton('Continue');
        continueButton.position(width/20, height/8);
        continueButton.size(width-(width/10), height-(height/2));
        continueButton.style('background-color', '#000000');
        continueButton.style('border', '4px solid #2bec9b');
        continueButton.style('border-radius', '4px');
        continueButton.style('color', '#2bec9b');
        continueButton.style('font-size', '115px')
        continueButton.touchEnded(function(){
          continueButton.style('background-color', '#2bec9b');
          continueButton.style('color', '#000000');
          outResponse.response = "continue"
          publish();
          //move on the state to display the yes/no buttons
          changeState();
          return false;
        });
        break;
    default:
      //BUTTON SETUP
      reStartButton = createButton('Restart');
      reStartButton.position(width/20, height/8);
      reStartButton.size(width-(width/10), height-(height/2));
      reStartButton.style('background-color', '#000000');
      reStartButton.style('border', '4px solid #2bec9b');
      reStartButton.style('border-radius', '4px');
      reStartButton.style('color', '#2bec9b');
      reStartButton.style('font-size', '115px')
      reStartButton.touchEnded(function(){
        reStartButton.style('background-color', '#2bec9b');
        reStartButton.style('color', '#000000');
        outResponse.response = "restart"; publish();
        return false;
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
