
/****************
*   WIFI STUFF  *
*****************/

#include <ArduinoJson.h>
#include <SPI.h>

#include <WiFi101.h>
#define PubNub_BASE_CLIENT WiFiClient
#include <PubNub.h>


static char ssid[] = "ocadu-embedded";      //SSID of the wireless network
static char pass[] = "internetofthings";    //password of that network
int status = WL_IDLE_STATUS;                // the Wifi radio's status

const static char pubkey[] = "pub-c-4a4bbb79-93d9-4288-9952-6bcbe72135d5";  //get this from your PUbNub account
const static char subkey[] = "sub-c-7072dd64-ce1e-11e7-9319-62175e58f2c1";  //get this from your PubNub account

const static char pubChannel[] = "channel2"; //choose a name for the channel to publish messages to
const static char subChannel[] = "channel1"; //choose a name for the channel to publish messages to


/******************
*    OLED STUFF   *
*******************/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display = Adafruit_SSD1306();

 // 32u4, M0, and 328p
  #define BUTTON_A 9
  #define BUTTON_B 6
  #define BUTTON_C 5
  #define LED      13

bool pendingMessage = true;
String printMessage;

/******************
*   BUTTON STUFF  *
*******************/
const int buttonPinDot = 12;     // the number of the pushbutton pin
const int buttonPinLin = 11;
const int buttonPinEnd = 10;


// variables will change:
int buttonStateDot = 0;         // variable for reading the pushbutton status
int buttonStateLin = 0;
int buttonStateEnd = 0;

int lastButtonStateDot = 0;
int lastButtonStateLin = 0;
int lastButtonStateEnd = 0;

int dot = 1;
int line = 2;
int End = 0;

int myValue[] = {0,0,0,0};
int calculator[] = {1000,100,10,1};
int myMessage = 0;
int arrayPosition = 0;
String currLetter;

bool mainScreen = true;

void setup() {

  /****************
  *   WIFI STUFF  *
  *****************/
  connectToServer();
  

  /****************
  *   OLED STUFF  *
  *****************/

  // by default, we'll generate the high voltage from the 3.3v line internally! (neat!)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3C (for the 128x32)
  // Show image buffer on the display hardware.
  // Since the buffer is intialized with an Adafruit splashscreen
  // internally, this will display the splashscreen.
  display.display();
  // Clear the buffer.
  display.clearDisplay();
  display.display();

  // text display tests
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  
  display.print("Waiting for the first message...");
  display.display();
  
  /******************
  *   BUTTON STUFF  *
  *******************/
  // initialize the LED pin as an output:
  // initialize the pushbutton pin as an input:
  pinMode(buttonPinDot, INPUT_PULLUP);
  pinMode(buttonPinLin, INPUT_PULLUP);
  pinMode(buttonPinEnd, INPUT_PULLUP);

  Serial.begin(9600);
}

// check if the pushbutton is pressed. If it is, the buttonState is HIGH:
void loop(){


  /******************
  *   BUTTON STUFF  *
  *******************/
//read the state of the button pins
   buttonStateDot = digitalRead(buttonPinDot);
   buttonStateLin = digitalRead(buttonPinLin);
   buttonStateEnd = digitalRead(buttonPinEnd);
   
//when the end button is pressed, end =3, end the following loop
   if(buttonStateEnd != lastButtonStateEnd){
    if(buttonStateEnd == HIGH){
      End = 3;
//      Serial.write(End);
//      digitalWrite(ledPinEnd, HIGH);
    }else{
//      digitalWrite(ledPinEnd, LOW);
    }
    delay(1);
  }
  lastButtonStateEnd = buttonStateEnd;

//when the End is not equel with 3, do the loop
if( End == 0 && arrayPosition<4 ){  
    if(buttonStateDot != lastButtonStateDot){
      if(buttonStateDot == HIGH){
//        Serial.write(dot);
        myValue[arrayPosition] = dot;
        arrayPosition =arrayPosition +1;
        }
       delay(1);
     }
    lastButtonStateDot = buttonStateDot;
  
    if(buttonStateLin != lastButtonStateLin){
      if(buttonStateLin == HIGH){
        myValue[arrayPosition] = line;
        arrayPosition =arrayPosition +1;
      }
       delay(1);
      }
    lastButtonStateLin = buttonStateLin;  
  }
  else if(End = 3 || arrayPosition >=4){
    alphabet();
  } 
 delay(10);    // slight delay to stabilize the ADC

  if (! digitalRead(BUTTON_A)) {
    clearDisplay();
  }
  
  if (!digitalRead(BUTTON_B)){
    readFromPubNub();
  }

}

void alphabet(){//based on the myValue array to check which character it should be

//Here is to debug
  Serial.println("You did it ! The message is ");
  int i;
  for( i=0; i<4; i = i+1 ){
    Serial.println(myValue[i]);
  }
  
  if( myValue[0] == 1){/*The firs position is dot*/
    if(myValue[1] == 1){/*The 2ns position is dot*/
       if(myValue[2] == 1){/*The 3ns position is dot*/
        if(myValue[3] == 1){/*The 4ns position is dot  ....  H  */
          currLetter = "h";
        }
        if(myValue[3] == 2){/*The 4ns position is dash   ...-  V */
          currLetter = "v";
        }
        if(myValue[3] == 0){/*The 4ns position is empty   ...  S */
          currLetter = "s";
        }
       }
       if(myValue[2] == 2){/*The 3ns position is dash*/
        if(myValue[3] == 1){/*The 4ns position is dot   ..-.   F */
          currLetter = "f";
        }
        if(myValue[3] == 2){/*The 4ns position is dash    ..--   */
          ////////////////No Character Fit!
        }
        if(myValue[3] == 0){/*The 4ns position is empty    ..-   U*/
          currLetter = "u";
        }
       }else if(myValue[2] == 0){/*The 3ns position is empty  .. I*/
          currLetter = "i";
       }
    }
    if(myValue[1] == 2){/*The 2nd position is dash*/
      if(myValue[2] == 1){/*The 3ns position is dot*/
        if(myValue[3] == 1){/*The 4ns position is dot   .-..   L*/
          currLetter = "l";
        }
        if(myValue[3] == 2){/*The 4ns position is dash   .-.-   */
          ////////////////No Character Fit!
        }
        if(myValue[3] == 0){/*The 4ns position is empty   .-.   R*/
          currLetter = "r";
        }
       }
       if(myValue[2] == 2){/*The 3ns position is dash*/
        if(myValue[3] == 1){/*The 4ns position is dot .--.  P*/
          currLetter = "p";
        }
        if(myValue[3] == 2){/*The 4ns position is dash   .---   J*/
          currLetter = "j";
        }
        if(myValue[3] == 0){/*The 4ns position is empty  .--   W*/
          currLetter = "w";
        }
       }else if(myValue[2] == 0){/*The 3ns position is empty  .-  A */
          currLetter = "a";
       }
    }else if(myValue[1] == 0){/*The 2nd position is empty  .  E */
          currLetter = "e";
    }    
  }else if (myValue[0] ==2 ){/*The firs position is dash*/
      if(myValue[1] == 1){/*The 2ns position is dot*/
       if(myValue[2] == 1){/*The 3ns position is dot*/
        if(myValue[3] == 1){/*The 4ns position is dot   -...   B*/
          currLetter = "b";
        }
        if(myValue[3] == 2){/*The 4ns position is dash  -..-  X*/
          currLetter = 'x';
        }
        if(myValue[3] == 0){/*The 4ns position is empty  -..  D*/
          currLetter = "d";
        }
       }
       if(myValue[2] == 2){/*The 3ns position is dash*/
        if(myValue[3] == 1){/*The 4ns position is dot   -.-.  C*/
          currLetter = "c";
        }
        if(myValue[3] == 2){/*The 4ns position is dash  -.--  Y*/
          currLetter = 'y';
        }
        if(myValue[3] == 0){/*The 4ns position is empty  -.-  K*/
          currLetter = "k";
        }
       }else if(myValue[2] == 0){/*The 3ns position is empty  -.  N*/
          currLetter = "n";
       }
    }
    if(myValue[1] == 2){/*The 2nd position is dash*/
      if(myValue[2] == 1){/*The 3ns position is dot*/
        if(myValue[3] == 1){/*The 4ns position is dot  --..  Z*/
          currLetter = "z";
        }
        if(myValue[3] == 2){/*The 4ns position is dash   --.-   Q*/
          currLetter = "q";
        }
        if(myValue[3] == 0){/*The 4ns position is empty  --.   G*/
          currLetter = "g";
        }
       }
       if(myValue[2] == 2){/*The 3ns position is dash*/
        if(myValue[3] == 1){/*The 4ns position is dot   ---.  */
          ////////////////No Character Fit!
        }
        if(myValue[3] == 2){/*The 4ns position is dash   ----*/
          ////////////////No Character Fit!
        }
        if(myValue[3] == 0){/*The 4ns position is empty   ---  O*/
          currLetter = "o";
        }
       }else if(myValue[2] == 0){/*The 3ns position is empty  --  M*/
        Serial.print('m');
          currLetter = "m";
       }
    }else if(myValue[1] == 0){/*The 2nd position is empty  -  T*/
          currLetter = "t";
    } 
  }/*Here is end of the huge if statement*/ 
 
  Serial.println(currLetter);
  delay(5);
  clearUp();
}/*Here is end of the alphabet()*/ 

void clearUp(){
    End = 0;
    arrayPosition = 0; 
//      Serial.print("You did it ! The message is ");
    int i;
    for( i=0; i<4; i = i+1 ){
      myValue[i] = 0;
    }

    if(pendingMessage){
      clearDisplay();
      pendingMessage = false;
    }
  publishToPubNub();

     currLetter = "";
     
}

void clearDisplay(){
      display.clearDisplay();
      
      display.display();
      // text display tests
      display.setTextSize(1);
      display.setTextColor(WHITE);
      display.setCursor(0,0);
}

void publishToPubNub() {

  WiFiClient *client;
  StaticJsonBuffer<800> messageBuffer;                    //create a memory buffer to hold a JSON Object
  JsonObject& pMessage = messageBuffer.createObject();    //create a new JSON object in that buffer
  
 ///the imporant bit where you feed in values
  pMessage["letterValue"] = currLetter;                      //add a new property and give it a value
  pMessage["timeStamp"] = millis();                     //add a new property and give it a value


///                                                       //you can add/remove parameter as you like
  
  //pMessage.prettyPrintTo(Serial);   //uncomment this to see the messages in the serial monitor
  
  
  int mSize = pMessage.measureLength()+1;                     //determine the size of the JSON Message
  char msg[mSize];                                            //create a char array to hold the message 
  pMessage.printTo(msg,mSize);                               //convert the JSON object into simple text (needed for the PN Arduino client)
  
  client = PubNub.publish(pubChannel, msg);                      //publish the message to PubNub

  if (!client)                                                //error check the connection
  {
    Serial.println("client error");
    delay(1000);
    return;
  }
  
  if (PubNub.get_last_http_status_code_class() != PubNub::http_scc_success)  //check that it worked
  {
    Serial.print("Got HTTP status code error from PubNub, class: ");
    Serial.print(PubNub.get_last_http_status_code_class(), DEC);
  }
  
  while (client->available())                                 //get feedback from PubNub
  {
    Serial.write(client->read());
  }
  client->stop();                                             //stop the connection
  Serial.println("Successful Publish");
  
}

void readFromPubNub()
{
  Serial.println("Reading from pubnub");
  StaticJsonBuffer<1000> inBuffer;                    //create a memory buffer to hold a JSON Object
  Serial.println("Setting client");
//  PubSubClient *sClient = PubNub.subscribe(subChannel,15);
  PubNub_BASE_CLIENT *sClient = PubNub.history(subChannel, 1, 15);
  Serial.println("Client set");
  
  if (!sClient) {                                     //error check to the connection
    Serial.println("message read error");
    delay(1000);
    return;
  }

  while (sClient->connected())                                //if it is connected
  {
    Serial.println("Connected");
    while (sClient->connected() && !sClient->available()) ; // wait for data
    char c = sClient->read();
    JsonObject& sMessage = inBuffer.parse(*sClient);        //make the json object to hold the message

    if(sMessage.success())
    {
      //sMessage.prettyPrintTo(Serial); //uncomment to see the JSON message in the serial monitor
      
      printMessage = sMessage["letterValue"].as<String>();         //read the value from the json object into 
      Serial.println(printMessage.length());
      
      if(printMessage.length()<= 0){
        Serial.print("end of transmission");
      }

      if(mainScreen){
        clearDisplay();
        mainScreen = false;
      }
      
      Serial.print("printMessage ");               
      Serial.println(printMessage);
      display.print(printMessage);
      display.display();
      
    }
    
    
  }
  
  sClient->stop();                                //stop the connection
  Serial.println("Done reading");
}

void connectToServer()
{
  WiFi.setPins(8,7,4,2); //This is specific to the feather M0
 
  status = WiFi.begin(ssid, pass);                    //attempt to connect to the network
  Serial.println("***Connecting to WiFi Network***");


 for(int trys = 1; trys<=10; trys++)                    //use a loop to attempt the connection more than once
 { 
    if ( status == WL_CONNECTED)                        //check to see if the connection was successful
    {
      Serial.print("Connected to ");
      Serial.println(ssid);
  
      PubNub.begin(pubkey, subkey);                      //connect to the PubNub Servers
      Serial.println("PubNub Connected"); 
      break;                                             //exit the connection loop     
    } 
    else 
    {
      Serial.print("Could Not Connect - Attempt:");
      Serial.println(trys);

    }

    if(trys==10)                                              //what to print if it doesn't work after 10 tries
    {
      Serial.println("I don't this this is going to work");
    }
    delay(1000);
 }

  
}




