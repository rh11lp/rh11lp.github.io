var pubnubError = true;
var myUserID;
var outResponse = {uuid: 0, response: ''};
var inResponse = {uuid: 0, response: ''};
var channelName = 'Channel-5pibjxuoh';
var startButton;

function setup() {

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

    //BUTTON SETUP
    startButton = createButton('Start');
    startButton.position(input.x + input.width, 65);
    startButton.mousePressed(function(){
      outResponse.message = "start"
      publish();
    });

    console.log("done setup");

}

function draw() {



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
