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

function draw() {
  background(127);
  drawButton();
}

function changeState() {
  state++;
}

function drawButton(){
  switch(state){
    case 0:
      //BUTTON SETUP
      startButton = createButton('Start');
      startButton.position(20, 65);
      startButton.size(90, 40);
      startButton.style('background-color', '#12b259');
      startButton.style('border', 'none');
      startButton.style('color', '#fffbf7')
      startButton.mousePressed(function(){
        outResponse.response = "start"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
      });
      break;
    case 1:
      okButton = createButton('Okay');
      okButton.position(20, 65);
      okButton.mousePressed(function(){
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
        yesButton.position(20, 65);
        yesButton.mousePressed(function(){
          outResponse.response = "yes"; publish();
          numAns++;
        });

        noButton = createButton('No');
        noButton.position(60, 65);
        noButton.mousePressed(function(){
          outResponse.response = "no"; publish();
          numAns++;
        });
      } else {changeState();}

      break;
    case 3:
        continueButton = createButton('Continue...');
        continueButton.position(20, 65);
        continueButton.mousePressed(function(){
          outResponse.response = "continue"
          publish();
          //move on the state to display the yes/no buttons
          changeState();
        });
        break;
    default:
      //BUTTON SETUP
      reStartButton = createButton('Restart');
      reStartButton.position(20, 65);
      reStartButton.mousePressed(function(){outResponse.response = "restart"; publish();});
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
