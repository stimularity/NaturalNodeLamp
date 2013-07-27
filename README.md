What is this project?
=====================
NaturalNodeLamp is a sophisticated programmable alarm clock that simulates sunrise using a strip of LEDS. 

How does it work?
=================
The project runs off a small computer called a Raspberry Pi(rPi). The rPi is connected to a strip of LEDS. 
There is a small server running on the rPi that you connect to via WiFi. From your smartphone, tablet or computer
you can set when the alarm will go off and what light pattern will wake you up. The default light pattern is a
simulation of sunrise. But you can change it to be obnoxcious flasshing if you desire. 

How can I make it?
==================
Making the sunrise lamp is a great beginner electronics project. Some parts can get a little tricky but hopefully I will be able to guide you. To begin, you need to order a bunch of parts. I ordered all the parts I needed in one order from [Adafruit](http://www.adafruit.com/).

Parts List
----------
Essential Parts:
+ [Raspberry Pi Model B](http://www.adafruit.com/products/998) x1 (You could go with the model A if you want to save money.)
+ [LED Strip](http://www.adafruit.com/products/306) x1 (If you order more than one strip you will need more than 5v of power.)
+ [Wifi Dongle](http://www.adafruit.com/products/814) x1
+ [5v Adapter](http://www.adafruit.com/products/276) x1 (This will power one led strip and the rPi.)
+ [Female DC power adapter](http://www.adafruit.com/products/368) x1
+ [4GB SD card](http://www.adafruit.com/products/102) x1 (4GB is plenty, trust me.)

Optional parts:
+ [Break out kit](http://www.adafruit.com/products/1105] x1 (To access inputs more easily.)
+ [Cute little case](http://www.adafruit.com/products/1326)

Downloads
----------
+ [Occidentalis v0.2](http://learn.adafruit.com/adafruit-raspberry-pi-educational-linux-distro/occidentalis-v0-dot-2)

Putting it all together
=======================
When your order comes in the first thing you should do is grab the SD card and install Occidentalis. Occidentalis is a small linux distribution designed to run on the rPi.
[Details on how to install Occidentalis can be found here.](http://elinux.org/RPi_Easy_SD_Card_Setup) You may also find some more clear tutorials on google.

While Occidentals is installing to the SD card connect the LED strip to the rPi. [This diagram demonstrates the perfect setup for this project.](http://learn.adafruit.com/assets/1589)
The connections will be weak and shitty so make sure you protect everything with electrical tape. As you can see in the diagram we are using the same power supply to power the rPi and the LED strip.

Slam the WiFi dongle into the rPi, connect the rPi to a screen and keyboard then plug in the power. If you see a red light thats good. If you see a blinking green light thats great! 

Give the rPi a second to boot up. You should be welcome with a beautiful config screen. Set that bad boy up! Make sure you set the proper time zone and time because you are making an alarm clock.

[Next, Configure the wifi on your rPi. Here is a lovely, little tutorial.](http://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/setting-up-wifi-with-occidentalis)


This is where the tutorial goes to shit. I will work more on it later.
======================

While we are here, download a precompile verson of node.js @TODO Expand this! 

If all went well you should be able to do: 

$ npm install https://github.com/stimularity/NaturalNodeLamp.git

Lets assume everything downloaded and compiled correctly with no errors. You will want to go into the config file and edit some values.
Set leds to the number of leds you have also, set your latitude and longitude so the clock will know when the sun rises and sets.

To run the alarm clock type in:
$ sudo forever start app.js

Again, assuming nothing went wrong. You should be able to browse to the IP of your rPi and see the web interface.
Assuming you wired everything correctly, clicking the on button should activate your strip of LEDS.

















