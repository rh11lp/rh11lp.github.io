#include <Servo.h>

int buttonPin = 9;
int buttonState; 

int incomingByte;
int servoPin1 = 10;           //Pin that the servo is attached to.
int moveRate = 2;        //the time between updates in milliseconds
int minAngle = 0;     //sets the low point of the movement range
int maxAngle = 90;   //sets the high point of the movement range
int moveIncrement = 1;    // how much to move the motor each cycle 
int servoAngle1;

long lastTimeYouMoved1;

bool shouldBeMoving = false;

Servo servo1;  // create the Servo object
 
void setup() {
 Serial.begin(9600);             // initialize serial communication

 pinMode(buttonPin, INPUT_PULLUP);   //set the pin to be an input and and turn on the pullup resistor
 
 servo1.attach(servoPin1);  //attach the servo to the corresponding control pin
 servoAngle1=minAngle;
}
 
void loop() {
 buttonState = digitalRead(buttonPin);  //read the value on the pin and store it in the variable

 if(buttonState == HIGH && shouldBeMoving){
  shouldBeMoving = false;
 }
 
 
 if (Serial.available() > 0) {   // see if there's incoming serial data
   incomingByte = Serial.read(); // read it and if it's 1, set the boolean
   if(incomingByte == 3){
    
      shouldBeMoving = true;
   }
 }
 if (shouldBeMoving) {  
      if(millis()-lastTimeYouMoved1>=moveRate) //this very simple statement is the timer,
      {                                          //it subtracts the value of the moment in time the last blink happened, and sees if that number is larger than your set blinking value
        
        servo1.write(servoAngle1);
        
        servoAngle1 += moveIncrement;
        
          if (servoAngle1 <= minAngle || servoAngle1 >= maxAngle) 
          {
            moveIncrement = -moveIncrement;
          }
        
        lastTimeYouMoved1 = millis();            //save the value in time that this switch occured, so we can use it again.
           
      }
  }
}
