///<reference path="./lib/pixi.js.d.ts" />
"use strict";
/*

 TODO:
 - separate classes in ui, controller, etc
 - check for existing sources
 - rename basic classes
 - perform npm deploy

 ** used TweenMax, but no
 ** hard to reach class methods inside nested functs.
 */


module Chart {

    export class Collections {
        public static signsTexturesArray = new Array<PIXI.Texture>();
    }

    export class Basics {

        private app:PIXI.Application;

        constructor() {

            let appWidth = 1130;
            let appHeight = 660;

            let curtainHeight = 614;

            let appMiddle = curtainHeight / 2;

            this.app = new PIXI.Application(appWidth, appHeight, {backgroundColor: 0x0b991b});
            document.body.appendChild(this.app.view);

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

            let reelComponent:ReelComponent = new ReelComponent([7, 8, 9, 10], this.app.ticker);

            reelComponent.x = 200;
            reelComponent.y = appMiddle;

            this.app.stage.addChild(reelComponent);


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


    export class SpinButton extends PIXI.Sprite {

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

    export class ReelComponent extends PIXI.Sprite {

        public signsIDArray:[];

        private signsTexturesArray:PIXI.Texture[];

        private ticker:PIXI.ticker.Ticker;

        private signHeight:number = 178;
        private signVPadding:number = -20;

        private mainColumnSprite:PIXI.Sprite;

        constructor(signsIDArray:[], ticker) {
            super();

            this.signsIDArray = signsIDArray;
            this.ticker = ticker;

            this.init();


        }

        private init():void {

            var beginSignsAmount:number = 4;
            var endSignsAmount:number = 2;

            let fullSignsIDArray:[] = this.signsIDArray.slice(this.signsIDArray.length - beginSignsAmount, this.signsIDArray.length);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDArray);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDArray.slice(0, endSignsAmount));

            this.mainColumnSprite = this.getSignColumnSprite(fullSignsIDArray);

            this.mainColumnSprite.y = -this.signStep * beginSignsAmount;


            this.addChild(this.mainColumnSprite);

            // ==================================================

            /*var rotateCD = new TweenMax.to(mainColumnSprite, .3, {y: -this.signStep * 2,
             ease:Linear.easeNone,repeat:-1,paused:true}).timeScale(0);*/

            /*play.onclick = function(){
             rotateCD.play();
             TweenLite.to(rotateCD,2,{timeScale:1});
             };

             pause.onclick = function(){
             TweenLite.to(rotateCD,2,{timeScale:0,onComplete:function(){ this.pause() }})
             };*/


            /*var animation = new TweenMax.to(mainColumnSprite, 2, {y: -this.signStep * 2,
             repeatDelay:0.5, ease:Linear.easeNone, onComplete:function() {

             mainColumnSprite.y = -referencedSignStep * 6;

             TweenMax.to(mainColumnSprite, 2, {y: -referencedSignStep * 2, repeat: -1, ease:Linear.easeNone});

             }});*/

            //TweenMax.fromTo(animation,2,{timeScale:0},{timeScale:1})

            /* var animation = new TimelineLite()
             animation
             .to(mainColumnSprite, 2, {y:-this.signStep * 2, ease:Linear.easeNone})
             .to(mainColumnSprite, 3, {x:500, ease:Linear.easeNone});*/

            //this.ticker.add(this.reelMoving);

            //this.mainColumnSpriteBlurAmount = 3;

            /*this.mainColumnSprite.filters = [new PIXI.filters.BlurYFilter()];
            this.mainColumnSprite.filters[0].blur = 0;*/
        }

        private reelMoving = () => {

            let speed = 2;
            let maxSpeed = 10;

            //if (speed < maxSpeed)
                speed += 2;

            if (this.mainColumnSprite.y > -this.signStep * 2) {
                this.mainColumnSprite.y = -this.signStep * 6 + speed;
            } else {
                this.mainColumnSprite.y += speed;
            }
        }

        private set mainColumnSpriteBlurAmount(value:number):void {
            if (!this.mainColumnSprite.filters)
                this.mainColumnSprite.filters = [new PIXI.filters.BlurYFilter()];

            this.mainColumnSprite.filters[0].blur = value;
        }

        private get signStep():number {
            return (this.signHeight + this.signVPadding);
        }

        private getSignColumnSprite(signsIDArray:[]):PIXI.Sprite {
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

var perfchart = new Chart.Basics();
