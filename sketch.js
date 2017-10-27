var listOfApples;
var apple;
var loadingImg;
var appleFile;

function preload(){

  //base URL for DB
  var url = 'https://apples-73fc.restdb.io/rest/list-of-apples';
  //Condition to query against : unused apple
  var conditions = '?q={"useStatus":false}';

  //Make an API request to fetch all the unused apples
  httpDo(url+conditions, {
          method: 'GET',
          headers: {'cache-control': 'no-cache',
                    'x-apikey': '59ee28d316d89bb7783294a3',
                    'content-type': 'application/json'}
        },
        function(response){ //upon successful retrieval,
          //parse the JSON to the listOfApples variable
          listOfApples = JSON.parse(response);

          //generate random integer
          //between 0 and total number of remaining apples
          var id = floor(random(0, listOfApples.length));
          //assign the random apple to the user
          apple = listOfApples[id];

          //change the apple's status to 'used'
          apple.useStatus = true;

          //update the apple's record in the database
          //Cap the apple's id and add it as a branch to the URL
          var newAppleID = "/"+apple._id;

          appleFile = loadImage("assets/apples/"+apple.fileName)

          httpDo(url+newAppleID,
                  { method: 'PUT',
                    headers: {'cache-control': 'no-cache',
                              'x-apikey': '59ee28d316d89bb7783294a3',
                              'content-type': 'application/json'},
                    body: JSON.stringify(apple)},
                  function(response){
                    console.log(response);
                  }, function(errResponse){
                    console.error(errResponse);
                  });
        }, function(errResponse){
          console.error(errResponse);
        });

}

function setup(){
  createCanvas(windowWidth, windowHeight);
  loadingImg = loadGif("assets/loadingGif/apple.gif");
  loadingImg.resize(displayWidth,displayHeight);

}


function draw(){
  background(255);

  if(!apple){
      image(loadingImg, 0, 0);
    return;
  }
  appleFile.resize(displayWidth,displayHeight);
  image(appleFile,0, 0);
}
