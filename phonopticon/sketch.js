var pubnubError = true;

function setup() {

    //PUBNUB SETUP
    pubnub = new PubNub({
        publishKey : 'pub-c-a210a34e-4b38-474e-8fe8-b70f0c0b2924',
        subscribeKey : 'sub-c-84d87f80-fd57-11e7-8c23-76e4b319f7ff'
    })

    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['Channel-5pibjxuoh']
    });

    // publish();
    console.log("done setup");
    
}

function draw() {
  console.log("Entering Draw... ... pubnub error?", pubnubError)
  if (!pubnubError) {
    console.log('waiting...');
    return;
  }

  text('pubnub!', 0, height - 30, width, 30);

}

function publish() {

    function publishSampleMessage() {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
        var publishConfig = {
            channel : "Channel-5pibjxuoh",
            message : "Hello from PubNub Docs!"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log("status", status, "response", response);
            pubnubError = status.error;
        })
    }
};


// pubnub.addListener({
//     status: function(statusEvent) {
//         if (statusEvent.category === "PNConnectedCategory") {
//             publishSampleMessage();
//         }
//     },
//     message: function(message) {
//         console.log("New Message!!", message);
//     },
//     presence: function(presenceEvent) {
//         // handle presence
//     }
// })
