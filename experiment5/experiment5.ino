/**********************************************
 * Experiment 5                               *
 * Kristy Boyce, Roxanne Henry, Emilia Mason  *
 * DGIF 6037                                  *
 * Kate Harman & Nick Puckett                 *
 * Wednesday, December 13th 2017              *
 **********************************************/



/****************************************************************
I2C_Gesture_Demo.ino
XYZ Interactive ZX Sensor
Shawn Hymel @ SparkFun Electronics
May 6, 2015
https://github.com/sparkfun/SparkFun_ZX_Distance_and_Gesture_Sensor_Arduino_Library

Tests the ZX sensor's ability to read ZX data over I2C. This demo
configures the ZX sensor and periodically polls for gestures. The
gesture is displayed along with its "speed" (how long it takes to
complete the gesture). Note that higher numbers of "speed"
indicate a slower speed.

Hardware Connections:
 
 Arduino Pin  ZX Sensor Board  Function
 ---------------------------------------
 5V           VCC              Power
 GND          GND              Ground
 A4           DA               I2C Data
 A5           CL               I2C Clock

Resources:
Include Wire.h and ZX_Sensor.h

Development environment specifics:
Written in Arduino 1.6.3
Tested with a SparkFun RedBoard

This code is beerware; if you see me (or any other SparkFun 
employee) at the local, and you've found our code helpful, please
buy us a round!

Distributed as-is; no warranty is given.
****************************************************************/

/**********************************
 *       MUSIC FEATHER SETUP      *
 **********************************/

// include SPI, MP3 and SD libraries
#include <SPI.h>
#include <SD.h>
#include <Adafruit_VS1053.h>

// These are the pins used
#define VS1053_RESET   -1     // VS1053 reset pin (not used!)

// Feather M0 or 32u4
#if defined(__AVR__) || defined(ARDUINO_SAMD_FEATHER_M0)
  #define VS1053_CS       6     // VS1053 chip select pin (output)
  #define VS1053_DCS     10     // VS1053 Data/command select pin (output)
  #define CARDCS          5     // Card chip select pin
  // DREQ should be an Int pin *if possible* (not possible on 32u4)
  #define VS1053_DREQ     9     // VS1053 Data request, ideally an Interrupt pin
#endif


Adafruit_VS1053_FilePlayer musicPlayer = 
  Adafruit_VS1053_FilePlayer(VS1053_RESET, VS1053_CS, VS1053_DCS, VS1053_DREQ, CARDCS);

/**********************************
 *       GESTURE SENSE SETUP      *
 **********************************/

#include <Wire.h>
#include <ZX_Sensor.h>

// Constants
const int ZX_ADDR = 0x10;    // ZX Sensor I2C address

// Global Variables
ZX_Sensor zx_sensor = ZX_Sensor(ZX_ADDR);
GestureType gesture;
uint8_t gesture_speed;

long timer = 0;


void setup() {
  
  Serial.begin(9600);

  /**********************************
   *       GESTURE SENSE SETUP      *
   **********************************/
   
  uint8_t ver;
  
  Serial.println();
  Serial.println("----------------------------------------");
  Serial.println("Note: higher 'speed' numbers mean slower");
  Serial.println("----------------------------------------");

  
  // Initialize ZX Sensor (configure I2C and read model ID)
  if ( zx_sensor.init() ) {
    Serial.println("ZX Sensor initialization complete");
  } else {
    Serial.println("Something went wrong during ZX Sensor init!");
  }
  
  // Read the model version number and ensure the library will work
  ver = zx_sensor.getModelVersion();
  if ( ver == ZX_ERROR ) {
    Serial.println("Error reading model version number");
  } else {
    Serial.print("Model version: ");
    Serial.println(ver);
  }
  
  if ( ver != ZX_MODEL_VER ) {
    Serial.print("Model version needs to be ");
    Serial.print(ZX_MODEL_VER);
    Serial.print(" to work with this library. Stopping.");
    while(1);
  }
  
  // Read the register map version and ensure the library will work
  ver = zx_sensor.getRegMapVersion();
  if ( ver == ZX_ERROR ) {
    Serial.println("Error reading register map version number");
  } else {
    Serial.print("Register Map Version: ");
    Serial.println(ver);
  }
  
  if ( ver != ZX_REG_MAP_VER ) {
    Serial.print("Register map version needs to be ");
    Serial.print(ZX_REG_MAP_VER);
    Serial.print(" to work with this library. Stopping.");
    while(1);
  }

  /**********************************
   *       MUSIC FEATHER SETUP      *
   **********************************/
  
  if (! musicPlayer.begin()) { // initialise the music player
     Serial.println(F("Couldn't find VS1053, do you have the right pins defined?"));
     while (1);
  }

  Serial.println(F("VS1053 found"));
  
  if (!SD.begin(CARDCS)) {
    Serial.println(F("SD failed, or not present"));
    while (1);  // don't do anything more
  }
  Serial.println("SD OK!");
  
  // list files
  printDirectory(SD.open("/"), 0);
  
  // Set volume for left, right channels. lower numbers == louder volume!
  musicPlayer.setVolume(10,10);
  

  // If DREQ is on an interrupt pin we can do background
  // audio playing
  musicPlayer.useInterrupt(VS1053_FILEPLAYER_PIN_INT);  // DREQ int

  
//  musicPlayer.sineTest(0x44, 500);    // Make a tone to indicate VS1053 is working

}

void loop() {

//  Serial.println(".");
  
  // If there is gesture data available, read and print it
  if ( zx_sensor.gestureAvailable() ) {
    gesture = zx_sensor.readGesture();
    gesture_speed = zx_sensor.readGestureSpeed();
    switch ( gesture ) {
      case NO_GESTURE:
        Serial.println("No Gesture");        
        break;
        
      case RIGHT_SWIPE:
        Serial.print("Right Swipe. Speed: ");
        Serial.println(gesture_speed, DEC);

        // FAST RIGHT SWIPE 
        if(gesture_speed < 20){
          musicPlayer.startPlayingFile("track001.mp3");
        }
        else { //SLOW RIGHT SWIPE
          musicPlayer.startPlayingFile("track002.mp3");
        }
        
        break;
        
      case LEFT_SWIPE:
        Serial.print("Left Swipe. Speed: ");
        Serial.println(gesture_speed, DEC);

        // FAST LEFT SWIPE 
        if(gesture_speed < 20){
          musicPlayer.startPlayingFile("track003.mp3");
        }
        else { //SLOW LEFT SWIPE
          musicPlayer.startPlayingFile("track004.mp3");
        }
                
        break;
        
      case UP_SWIPE:
        Serial.print("Up Swipe. Speed: ");
        Serial.println(gesture_speed, DEC);

        // FAST UP SWIPE 
        if(gesture_speed < 20){
          musicPlayer.startPlayingFile("track005.mp3");
        }
        else { //SLOW LEFT SWIPE
          musicPlayer.startPlayingFile("track006.mp3");
        }
                
        break;
        
      default:
        break;
    }
  }

  if(millis()-timer >= 5000){
    musicPlayer.softReset();
    timer = millis();
  }
}



/// File listing helper
void printDirectory(File dir, int numTabs) {
   while(true) {
     
     File entry =  dir.openNextFile();
     if (! entry) {
       // no more files
       //Serial.println("**nomorefiles**");
       break;
     }
     for (uint8_t i=0; i<numTabs; i++) {
       Serial.print('\t');
     }
     Serial.print(entry.name());
     if (entry.isDirectory()) {
       Serial.println("/");
       printDirectory(entry, numTabs+1);
     } else {
       // files have sizes, directories do not
       Serial.print("\t\t");
       Serial.println(entry.size(), DEC);
     }
     entry.close();
   }
}


