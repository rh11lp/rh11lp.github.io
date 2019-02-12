/*
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 *
 * Allows you to send data to Adafruit IO + IFTTT
 *
 */


var AIO_KEY = "1cbc86563dfa426fbf1ec2d3fe157d83";//get this from your account
var channelGroup = "ubiComp";
var channel1 = "position1";
var channel2 = "position2";



function setup()
{
createCanvas(windowWidth,windowHeight);




}


function draw()
{
background(0,255,0);
stroke(255);
strokeWeight(5);
line(0,mouseY,width,mouseY);    // draw horizontal line  at the Y position of the cursor
line(mouseX,0,mouseX,height);   // draw vertical line  at the X position of the cursor


}

function mousePressed()
{
	sendData();

}



function sendData()
	{

        var url = ("https://io.adafruit.com/api/v1/groups/"+channelGroup+"/send.json?x-aio-key=" + AIO_KEY + "&"+channel1+"=" + mouseX + "&"+channel2+"=" + mouseY);
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", reqListener)
        oReq.open("POST", url)
        oReq.send()
      }

function reqListener(inputdata)
{
	console.log(inputdata);
}
