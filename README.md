#Slots machine prototype
This is an example of using TypeScript + PIXI renderer to perform prototype of spinning slot reel.

##Requirements:
 - Make signs animation like in real slots reel
 - Use PIXI.js as renderer
 - Use TypeScript for source code
 - Signs should setting by arrays of numbers:
[1,2,3,4,5,6,7,8,9,10,11,12],
[1,2,3,4,5,6,7,8,9,10,11,12],
[1,2,3,4,5,6,7,8,9,10,11,12],
[1,2,3,4,5,6,7,8,9,10,11,12],
[1,2,3,4,5,6,7,8,9,10,11,12]
 - Order of numbers may be random
 - Spin button should be below of reels
 - After clicking button should be disabled till each reel will stop
 - On clicking Spin Button should play sound "Reel_Spin.mp3"
 - Stop-position of each reel is random. But time between stop each reel is equal.
 - At reel stop should play "Landing_1.mp3" sound
 - Reels starting from last stopped positions
 - Reel has loop spinning animation, end of array is equal to begin

##Realization:
Used TypeScript, PIXI main library, PIXI sound tool. Libraries deployed by npm, see package.json