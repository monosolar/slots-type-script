///<reference path="./lib/pixi.js.d.ts" />
"use strict";
/*

 TODO:
 - separate classes in ui, controller, etc
 - check for existing sources
 - rename basic classes
 - perform npm deploy
 - consts instead privates

 ** used TweenMax, but no
 ** hard to reach class methods inside nested functs.
 *
 */


module Slots {

    interface ReelItem {
        row:    [];
        init:     number;
    }

    class Mocks {
        public static reelMock = '{ "sequences":[     {"row":[5,6,8,7,5,4], "init":3},' +
                                               '{"row":[11,6,5,2,10,6,3,1], "init":2},' +
                                               '{"row":[8,9,12,11,7,8,4,3], "init":1},' +
                                               '{"row":[9,10,12,6,2,8,9,4,7], "init":4},' +
                                               '{"row":[3,0,8,11,6,13,12,6,7,10], "init":6} ] }';
    }

    class Collections {
        public static signsTexturesArray = new Array<PIXI.Texture>();
    }

    class Utils {
        public static ticker: PIXI.ticker.Ticker;
    }

    export class Basics {

        private app:PIXI.Application;

        private reelsSequenceComponent: ReelsSequenceComponent;

        constructor() {

            let appWidth = 1130;
            let appHeight = 660;

            let curtainHeight = 614;

            let appMiddle = curtainHeight / 2;

            this.app = new PIXI.Application(appWidth, appHeight, {backgroundColor: 0x0b991b});
            document.body.appendChild(this.app.view);
            Utils.ticker = this.app.ticker;

            this.fillSignTexturesArray();





            let curtainContainer = new PIXI.Container();
            let curtainImgSprite = PIXI.Sprite.fromImage("./assets/img/slotOverlay.png");
            curtainContainer.addChild(curtainImgSprite);


            let rectGraphic = new PIXI.Graphics();
            rectGraphic.lineStyle(2, 0x0000FF, 1);
            rectGraphic.beginFill(0xFF700B, 0.5);
            rectGraphic.drawRoundedRect(0, 0, 1050, 560, 20, 20);

            let rectSprite = new PIXI.Sprite(rectGraphic.generateCanvasTexture());
            rectSprite.x = appWidth / 2;
            rectSprite.y = curtainHeight / 2;

            rectSprite.anchor.set(0.5, 0.5);

            //curtainContainer.addChild(rectSprite );

            let middleLineGraphic = new PIXI.Graphics();
            middleLineGraphic.lineStyle(2, 0xFF0000, 1);
            middleLineGraphic.moveTo(0, 0);
            middleLineGraphic.lineTo(appWidth, 0);

            let middleLineSprite = new PIXI.Sprite(middleLineGraphic.generateCanvasTexture());
            middleLineSprite.y = appMiddle;

            curtainContainer.addChild(middleLineSprite);

            let spinButton = new SpinButton();
            spinButton.position.set(appWidth / 2, appHeight - spinButton.height);
            spinButton.anchor.set(0.5, 0.5);

            curtainContainer.addChild(spinButton);

            this.reelsSequenceComponent = new ReelsSequenceComponent();

            this.reelsSequenceComponent.position.set(100,100);



            this.app.stage.addChild(this.reelsSequenceComponent);


            this.app.stage.addChild(curtainContainer);

        }

        private fillSignTexturesArray():void {
            let idx:String;
            for (let i = 1; i < 14; i++) {
                idx = (i > 9) ? String(i) : "0" + String(i);
                Collections.signsTexturesArray.push(PIXI.Texture.fromImage("./assets/img/" + idx + ".png"));
            }
        }

    }


    class SpinButton extends PIXI.Sprite {

        private textureButton:PIXI.Texture;
        private textureButtonPressed:PIXI.Texture;
        private textureButtonHover:PIXI.Texture;
        private textureButtonDisable:PIXI.Texture;

        constructor() {

            this.textureButton = PIXI.Texture.fromImage('assets/img/btn_spin_normal.png');
            this.textureButtonPressed = PIXI.Texture.fromImage('assets/img/btn_spin_pressed.png');
            this.textureButtonHover = PIXI.Texture.fromImage('assets/img/btn_spin_hover.png');
            this.textureButtonDisable = PIXI.Texture.fromImage('assets/img/btn_spin_disable.png');

            super(this.textureButton);

            this.interactive = true;
            this.buttonMode = true;

            this
                .on('pointerdown', this.onButtonDown)
                .on('pointerup', this.onButtonUp)
                .on('pointerupoutside', this.onButtonUp)
                .on('pointerover', this.onButtonOver)
                .on('pointerout', this.onButtonOut);

        }

        private onButtonDown():void {
            this.isdown = true;
            this.texture = this.textureButtonPressed;
            this.alpha = 1;
        }

        private onButtonUp():void {
            this.isdown = false;
            if (this.isOver) {
                this.texture = this.textureButtonHover;
            }
            else {
                this.texture = this.textureButton;
            }
        }

        private onButtonOver():void {
            this.isOver = true;
            if (this.isdown) {
                return;
            }
            this.texture = this.textureButtonHover;
        }

        private onButtonOut():void {
            this.isOver = false;
            if (this.isdown) {
                return;
            }
            this.texture = this.textureButton;
        }

    }

    class ReelsSequenceComponent extends PIXI.Sprite {

        private fixedWidth = 1000;
        private fixedHeight = 600;

        private reelsArray: ReelComponent[] = [];

        constructor() {
            super();

            // background layer
            // ---------------
            // reels
            // ---------------
            //

            let background = new PIXI.extras
                .TilingSprite(PIXI.Texture.fromImage("./assets/img/winningFrameBackground.jpg"));
            background.width = this.fixedWidth;
            background.height = this.fixedHeight;
            this.addChild(background)

            let reelsParsedArray: ReelItem[] = JSON.parse(Mocks.reelMock).sequences;

            this.reelsArray = [ new ReelComponent,
                                new ReelComponent,
                                new ReelComponent,
                                new ReelComponent,
                                new ReelComponent ];

            this.reelsArray.forEach((reelComponent, index) => {
                reelComponent.signsIDsArray = reelsParsedArray[index].row;
                reelComponent.createMainColumnSprite();
                //reelComponent.setReelToId(reelsParsedArray[index].init);
                reelComponent.setReelToId(0);
                reelComponent.x = index * (this.fixedWidth/this.reelsArray.length);
                reelComponent.y = this.fixedHeight / 2;
                reelComponent.pivot.x = -this.fixedWidth/this.reelsArray.length*0.5;

                this.addChild(reelComponent)
            });



        }
    }

    class ReelComponent extends PIXI.Sprite {

        public signsIDsArray: number[];
        public startSignID: number;

        private signHeight:number = 178;
        private signVPadding:number = -20;

        private beginSignsAmount:number = 4;
        private endSignsAmount:number = 2;

        private reelSprite:PIXI.Sprite;

        private animationFunction:Function;

        constructor() {
            super();

            //this.signsIDsArray = signsIDsArray;

            /*this.createMainColumnSprite();
            this.setReelToId(0);

            this.startReel();

            setTimeout(this.stopReel, 1500, this)*/
        }

        public startReel():void {

            let speed = 0.3;
            let maxSpeed = 15;

            this.animationFunction = function () {

                if (speed < maxSpeed) {
                    speed *= 2;
                    this.mainColumnSpriteBlurAmount += 1.5;
                }

                if (this.reelSprite.y > this.getColumnYBySignIndex(-this.endSignsAmount)) {
                    this.setReelToId(this.signsIDsArray.length - this.endSignsAmount, speed)
                } else {
                    this.reelSprite.y += speed;
                }
            }

            Utils.ticker.add(this.animationFunction, this);
        }

        private stopReel(context:any):void {
            let randomSign = parseInt(Math.random() * context.signsIDsArray.length);

            Utils.ticker.remove(context.animationFunction);
            context.setReelToId(randomSign);

            context.mainColumnSpriteBlurAmount = 0;
        }

        private init():void {




            // ==================================================

            /*
             var rotateCD = new TweenMax.to(this.reelSprite, 2, {y: -this.signStep * 2,
             ease:Linear.easeNone,repeat:-1,paused:true}).timeScale(0);

             play.onclick = function(){
             rotateCD.play();
             TweenLite.to(rotateCD,2,{timeScale:1});
             };

             pause.onclick = function(){
             TweenLite.to(rotateCD,2,{timeScale:0,onComplete:function(){ this.pause() }})
             };*/


            /*var animation = new TweenMax.to(reelSprite, 2, {y: -this.signStep * 2,
             repeatDelay:0.5, ease:Linear.easeNone, onComplete:function() {

             reelSprite.y = -referencedSignStep * 6;

             TweenMax.to(reelSprite, 2, {y: -referencedSignStep * 2, repeat: -1, ease:Linear.easeNone});

             }});*/

            //TweenMax.fromTo(animation,2,{timeScale:0},{timeScale:1})

            /* var animation = new TimelineLite()
             animation
             .to(reelSprite, 2, {y:-this.signStep * 2, ease:Linear.easeNone})
             .to(reelSprite, 3, {x:500, ease:Linear.easeNone});*/



        }

        public createMainColumnSprite():void {
            if (!this.signsIDsArray || !this.signsIDsArray.length) return;

            this.removeChildren();

            let fullSignsIDArray:[] = this.signsIDsArray.slice(this.signsIDsArray.length - this.beginSignsAmount, this.signsIDsArray.length);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDsArray);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDsArray.slice(0, this.endSignsAmount));

            this.reelSprite = this.getReelSpriteByIDsArray(fullSignsIDArray);
            this.addChild(this.reelSprite);
        }

        public setReelToId(idx = 0, correction = 0):void {
            this.reelSprite.y = this.getColumnYBySignIndex(idx) + correction;
        }

        private set mainColumnSpriteBlurAmount(value:number):void {
            if (!this.reelSprite.filters) {
            }
            this.reelSprite.filters = [new PIXI.filters.BlurYFilter()];

            this.reelSprite.filters[0].blur = value;
        }

        private get mainColumnSpriteBlurAmount():number {
            if (!this.reelSprite.filters)
                return 0;

            return this.reelSprite.filters[0].blur;
        }

        private get signStep():number {
            return (this.signHeight + this.signVPadding);
        }

        private getColumnYBySignIndex(idx:number):number {
            if (idx > this.signsIDsArray.length - 1)
                idx = this.signsIDsArray.length - 1;

            return -this.signStep * (this.beginSignsAmount + idx);
        }

        private getReelSpriteByIDsArray(signsIDArray:[]):PIXI.Sprite {
            let signsColumnSprite:PIXI.Sprite = new PIXI.Sprite();
            let currentSignSprite:PIXI.Sprite;

            signsIDArray.forEach((item, index) => {
                currentSignSprite = new PIXI.Sprite(Collections.signsTexturesArray[item - 1]);
                currentSignSprite.anchor.set(0.5, 0.5)
                currentSignSprite.y = this.signStep * index;

                if (index == 4) {
                    let enter = new PIXI.Graphics();
                    enter.lineStyle(2, 0x0000FF, 1);
                    enter.beginFill(0xF0B7F0, 1);
                    enter.drawEllipse(0, 0, 10, 10);

                    currentSignSprite.addChild(enter);
                }

                signsColumnSprite.addChild(currentSignSprite);
            });

            return signsColumnSprite;
        }

    }

}

new Slots.Basics();

