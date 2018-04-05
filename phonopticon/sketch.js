var pubnubError = true;
var myUserID;
var outResponse = {uuid: 0};
var inResponse = {uuid: 0};
var channelName = 'mudit';
var startButton;
var state = 0; //states: 0-START 1-Y/N 2-FINAL
var numAns = 0;
var firstEntry = true;

var yesButton;
var noButton;;
var more;
var endButton;

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
var changingState = true;
var yesNoButtons = false;
var moreEndButtons = false;

function draw() {

  background('black');

  if(changingState){
    drawButton();
  }


  //DEAL WITH YES/NO BUTTON DISABLES
  if(millis() - timer >= 20000 && yesNoButtons){
    console.log("ENABLING BUTTONS");
    //reset button appearance and re-enable
    yesNoButtons = false;
    removeElements();
    drawButton();
  }

  //DEAL WITH MORE/END BUTTON DISABLES
  if(millis() - timer >= 15000 && moreEndButtons){
    console.log("ENABLING BUTTONS");
    //reset button appearance and re-enable
    moreEndButtons = false;

    more.style('background-color', '#000000');
    more.style('color', '#2bec9b');
    more.touchEnded(function(){
      more.response = "more"
      publish();
      //move on the state to display the yes/no buttons
      changeState();
      return false;
    });

    endButton.style('background-color', '#000000');
    endButton.style('color', '#2bec9b');
    endButton.touchEnded(function(){
      outResponse.response = "end"
      publish();
      //move on the state to display the yes/no buttons
      state = 7;
      return false;
    });


  }


}

function changeState() {
  state++;
  removeElements();
  changingState = true;
}

function drawButton(){
  switch(state){
    case 0:
      //BUTTON SETUP
      changingState = false;
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
      changingState = false;
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
        changingState = false;
        yesButton = createButton('Yes');
        noButton = createButton('No');

        yesButton.position(width/20, height/10);
        yesButton.size(width-(width/10), height/2-(height/4));
        yesButton.style('background-color', '#000000');
        yesButton.style('border', '4px solid #2bec9b');
        yesButton.style('border-radius', '4px');
        yesButton.style('color', '#2bec9b');
        yesButton.style('font-size', '225px');
        yesButton.touchEnded(function(){
          console.log("SUP WHAT")
          yesButton.style('background-color', '#2bec9b');
          yesButton.style('color', '#000000');
          noButton.style('background-color', '#2bec9b');
          noButton.style('color', '#000000');

          outResponse.response = "yes";
          publish();
          numAns++;

          yesButton.attribute('disabled','true');
          noButton.attribute('disabled','true');
          timer = millis();
          yesNoButtons = true;

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
          yesButton.style('background-color', '#2bec9b');
          yesButton.style('color', '#000000');

          outResponse.response = "no";
          publish();
          numAns++;

          timer = millis();
          yesNoButtons = true;

          noButton.removeAttribute('disabled','disabled');
          yesButton.removeAttribute('disabled','disabled');


          return false;
        });


      } else
      {
        changeState();
      }
      break;

    case 3:
        changingState = false;
        yesNoButtons = false;
        continueButton = createButton('Initialize');
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
          outResponse.response = "init"
          publish();
          //move on the state to display the yes/no buttons
          changeState();
          return false;
        });
        break;

    case 4:
        changingState = false;
        tellMeHow = createButton('Tell me how');
        tellMeHow.position(width/20, height/8);
        tellMeHow.size(width-(width/10), height-(height/2));
        tellMeHow.style('background-color', '#000000');
        tellMeHow.style('border', '4px solid #2bec9b');
        tellMeHow.style('border-radius', '4px');
        tellMeHow.style('color', '#2bec9b');
        tellMeHow.style('font-size', '115px')
        tellMeHow.touchEnded(function(){
          tellMeHow.style('background-color', '#2bec9b');
          tellMeHow.style('color', '#000000');
          outResponse.response = "how"
          publish();
          //move on the state to display the yes/no buttons
          changeState();
          return false;
        });
        break;

    case 5:
        changingState = false;
        moreEndButtons = true;
        timer = millis();

        more = createButton('More info');
        more.position(width/20, height/10);
        more.size(width-(width/10), height/2-(height/4));
        more.style('border', '4px solid #2bec9b');
        more.style('border-radius', '4px');
        more.style('color', '#2bec9b');
        more.style('font-size', '115px');
        more.style('background-color', '#2bec9b');
        more.style('color', '#000000');


        endButton = createButton('End');
        endButton.position(width/20, height/2);
        endButton.size(width-(width/10), height/2-(height/4));
        endButton.style('border', '4px solid #2bec9b');
        endButton.style('border-radius', '4px');
        endButton.style('font-size', '115px');
        endButton.style('background-color', '#2bec9b');
        endButton.style('color', '#000000');


        break;

    case 6:
      //BUTTON SETUP
      changingState = false;
      endButton = createButton('End');
      endButton.position(width/20, height/8);
      endButton.size(width-(width/10), height-(height/2));
      endButton.style('background-color', '#000000');
      endButton.style('border', '4px solid #2bec9b');
      endButton.style('border-radius', '4px');
      endButton.style('color', '#2bec9b');
      endButton.style('font-size', '225px');
      endButton.touchEnded(function(){
        endButton.style('background-color', '#2bec9b');
        endButton.style('color', '#000000');
        outResponse.response = "end"
        publish();
        //move on the state to display the yes/no buttons
        changeState();
        return false;
      });

      break;

    default:
      //BUTTON SETUP
      changingState = false;
      thankYouButton = createButton('Thank you.');
      thankYouButton.position(width/20, height/8);
      thankYouButton.size(width-(width/10), height-(height/2));
      thankYouButton.style('background-color', '#000000');
      thankYouButton.style('border', '4px solid #2bec9b');
      thankYouButton.style('border-radius', '4px');
      thankYouButton.style('color', '#2bec9b');
      thankYouButton.style('font-size', '115px')

    break;
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
