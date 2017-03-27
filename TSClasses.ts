///<reference path="./node_modules/@types/pixi.js/index.d.ts" />
///<reference path="./node_modules/pixi-sound/lib/index.d.ts" />
"use strict";

module Slots {

    interface ReelItem {
        row:[];
        init:number;
    }

    class Mocks {
        public static reelMock = '{ "sequences":[        {"row":[5,6,8,7,5,4], "init":3},' +
                                                        '{"row":[11,6,5,2,10,6,3,1], "init":2},' +
                                                        '{"row":[8,9,12,11,7,8,4,3], "init":1},' +
                                                        '{"row":[9,10,12,6,2,8,9,4,7], "init":4},' +
                                                        '{"row":[3,6,8,11,6,13,12,6,7,10], "init":6} ] }';
    }

    class Collections {
        public static signsTexturesArray = new Array<PIXI.Texture>();

        public static fillSignsTexturesArray():void {
            let idx:String;
            for (let i = 1; i < 14; i++) {
                idx = (i > 9) ? String(i) : "0" + String(i);
                Collections.signsTexturesArray.push(PIXI.Texture.fromImage("./assets/img/" + idx + ".png"));
            }
        }

        public static landingSound = PIXI.sound.Sound.from('./assets/sound/Landing_1.mp3');
        public static reelSpinSound = PIXI.sound.Sound.from('./assets/sound/Reel_Spin.mp3');
    }

    class Utils {
        public static ticker:PIXI.ticker.Ticker;
    }

    export class Application {

        private app:PIXI.Application;

        private reelsSequenceComponent:SpinButton;

        private spinButton:PIXI.Sprite;

        constructor() {

            const appWidth = 1130;
            const appHeight = 700;

            this.app = new PIXI.Application(appWidth, appHeight, {backgroundColor: 0x0b991b});
            document.body.appendChild(this.app.view);

            Utils.ticker = this.app.ticker;
            Collections.fillSignsTexturesArray();

            let curtainContainer = new PIXI.Container();
            let curtainImgSprite = PIXI.Sprite.fromImage("./assets/img/slotOverlay.png");
            curtainContainer.addChild(curtainImgSprite);

            this.spinButton = new SpinButton();
            this.spinButton.position.set(appWidth / 2, appHeight - 70);
            this.spinButton.anchor.set(0.5, 0.5);
            this.spinButton.on('pointerdown', this.onSpinButtonClick, this);

            curtainContainer.addChild(this.spinButton);

            this.reelsSequenceComponent = new ReelsSequenceComponent();
            this.reelsSequenceComponent.x = 32;
            this.reelsSequenceComponent.y = 33;

            this.app.stage.addChild(this.reelsSequenceComponent);
            this.app.stage.addChild(curtainContainer);
        }


        private onSpinButtonClick = () => {
            this.reelsSequenceComponent.addListener(ReelsSequenceComponent.ON_FINISHED, ()=> {
                this.spinButton.enabled = true;
            });

            this.reelsSequenceComponent.start();
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

        public set enabled(value:Boolean):void {
            this.interactive = value;
            this.buttonMode = value;

            if (value)
                this.texture = this.textureButton;
        }

        private onButtonDown():void {
            this.isdown = true;
            this.texture = this.textureButtonPressed;
            this.alpha = 1;
        }

        private onButtonUp():void {
            this.isdown = false;
            if (this.isOver) {
                this.texture = this.textureButtonDisable;
            }
            this.enabled = false;
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

        public static ON_FINISHED = 'ON_FINISHED';

        private fixedWidth = 1050;
        private fixedHeight = 570;

        private reelsArray:ReelComponent[] = [];

        constructor() {
            super();

            let maskedSprite = new PIXI.Sprite();

            let background = new PIXI.extras
                .TilingSprite(PIXI.Texture.fromImage("./assets/img/winningFrameBackground.jpg"));
            background.width = this.fixedWidth;
            background.height = this.fixedHeight;
            maskedSprite.addChild(background)

            let reelsParsedArray:ReelItem[] = JSON.parse(Mocks.reelMock).sequences;

            this.reelsArray = [ new ReelComponent,
                                new ReelComponent,
                                new ReelComponent,
                                new ReelComponent,
                                new ReelComponent   ];

            this.reelsArray.forEach((reelComponent, index) => {
                reelComponent.signsIDsArray = reelsParsedArray[index].row;
                reelComponent.createMainColumnSprite();
                reelComponent.setReelToId(reelsParsedArray[index].init);
                reelComponent.x = index * (this.fixedWidth / this.reelsArray.length);
                reelComponent.y = this.fixedHeight / 2;
                reelComponent.pivot.x = -this.fixedWidth / this.reelsArray.length * 0.5;

                maskedSprite.addChild(reelComponent)
            });

            let rectGraphic = new PIXI.Graphics();
            rectGraphic.lineStyle(2, 0x0000FF, 1);
            rectGraphic.beginFill(0xFF700B, 0.5);
            rectGraphic.drawRoundedRect(0, 0, this.fixedWidth, this.fixedHeight, 20, 20);

            this.addChild(maskedSprite);
            this.addChild(rectGraphic);

            maskedSprite.mask = rectGraphic;
        }

        public start():void {
            const reelSpinInitTime = 2000;
            const attachedDeltaTime = 450;

            this.reelsArray.forEach((reelComponent, index) => {
                reelComponent.startReel();
                setTimeout(reelComponent.stopReel, reelSpinInitTime + (index * attachedDeltaTime), reelComponent);
            });
            this.reelsArray[this.reelsArray.length - 1].addListener(ReelComponent.STOPPED, ()=> {
                this.emit(ReelsSequenceComponent.ON_FINISHED, this);
                Collections.reelSpinSound.stop();
            });
            Collections.reelSpinSound.play();
        }
    }

    class ReelComponent extends PIXI.Sprite {

        public static STOPPED = 'STOPPED';

        public signsIDsArray:number[];

        private signHeight:number = 178;
        private signVPadding:number = -20;

        private beginSignsAmount:number = 4;
        private endSignsAmount:number = 2;

        private reelSprite:PIXI.Sprite;

        private animationFunction:Function;

        constructor() {
            super();
        }

        public startReel():void {

            let speed = 0.3;
            let maxSpeed = 3;

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

        public createMainColumnSprite():void {
            if (!this.signsIDsArray || !this.signsIDsArray.length) return;

            this.removeChildren();

            let fullSignsIDArray:[] = this.signsIDsArray.slice(this.signsIDsArray.length - this.beginSignsAmount,
                                      this.signsIDsArray.length);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDsArray);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDsArray.slice(0, this.endSignsAmount));

            this.reelSprite = this.getReelSpriteByIDsArray(fullSignsIDArray);
            this.addChild(this.reelSprite);
        }

        private stopReel(context:any):void {
            let randomSign = parseInt(Math.random() * context.signsIDsArray.length);

            Utils.ticker.remove(context.animationFunction);
            context.setReelToId(randomSign);

            context.mainColumnSpriteBlurAmount = 0;

            context.emit(ReelComponent.STOPPED);
            Collections.landingSound.volume = 0.5;
            Collections.landingSound.play();
        }

        public setReelToId(idx = 0, correction = 0):void {
            this.reelSprite.y = this.getColumnYBySignIndex(idx) + correction;
        }

        private set mainColumnSpriteBlurAmount(value:number):void {
            if (!this.reelSprite.filters) {
                this.reelSprite.filters = [new PIXI.filters.BlurYFilter()];
            }

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
                signsColumnSprite.addChild(currentSignSprite);
            });

            return signsColumnSprite;
        }
    }
}

new Slots.Application();

