var listOfApples;
var apple;
var loadingImg;
var appleFile;
var noApples = false;
var emptyBasket; //http://www.twosisterscrafting.com/wp-content/uploads/2015/11/apples-for-the-teacher-gift-bushelbasket.jpg

function preload(){

  //loading gif
  loadingImg = loadAnimation("assets/loadingGif/apple01.png",
                             "assets/loadingGif/apple15.png");

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
          // console.log(listOfApples.length==0);
          //If there are no apples left, just toggle the variable
          //If there are apples left, start assigning apples
          if(listOfApples.length == 0){
            noApples = true;
          } else {

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
          //send the apple back to update the db
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
        };
      }, function(errResponse){
          console.error(errResponse);
        });

}

function setup(){
  createCanvas(windowWidth, windowHeight);
  emptyBasket = loadImage("assets/emptyBasket.png");
}


function draw(){
  background(255);
  //until we have an apple,
  //play the loading gif and ignore the rest of the function
  if(!noApples){
    if(!apple){
      animation(loadingImg, windowWidth/2, windowHeight/2);
      return;
    }
  }else{
    image(emptyBasket, windowWidth/5, windowHeight/18, emptyBasket.width/5, emptyBasket.height/5);
    return;
  }

  //once we have an apple, carry on:
  image(appleFile,0, 0);

}
