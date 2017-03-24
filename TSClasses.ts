///<reference path="./lib/pixi.js.d.ts" />
"use strict";
/*

TODO:
    - separate classes in ui, controller, etc
    - check for existing sources
    - rename basic classes
*/



module Chart {

    export class Collections {
        public static signsTexturesArray = new Array<PIXI.Texture>();
    }

    export class Basics {

        private app: PIXI.Application;

        constructor() {

            let appWidth = 1130;
            let appHeight = 660;

            let curtainHeight = 614;

            let appMiddle = curtainHeight / 2;

            this.app = new PIXI.Application(appWidth, appHeight, { backgroundColor: 0x0b991b });
            document.body.appendChild(this.app.view);

            this.fillSignTexturesArray();

            let curtainContainer = new PIXI.Container();
            let curtainImgSprite = PIXI.Sprite.fromImage("./assets/img/slotOverlay.png");
            curtainContainer.addChild(curtainImgSprite );


            let rectGraphic = new PIXI.Graphics();
            rectGraphic.lineStyle(2, 0x0000FF, 1);
            rectGraphic.beginFill(0xFF700B, 0.5);
            rectGraphic.drawRoundedRect(0, 0, 1050, 560, 20, 20);

            let rectSprite = new PIXI.Sprite(rectGraphic.generateCanvasTexture());
            rectSprite.x = appWidth / 2;
            rectSprite.y = curtainHeight / 2;

            rectSprite.anchor.set(0.5,0.5);

            //curtainContainer.addChild(rectSprite );

            let middleLineGraphic = new PIXI.Graphics();
            middleLineGraphic.lineStyle(2, 0xFF0000, 1);
            middleLineGraphic.moveTo(0,0);
            middleLineGraphic.lineTo(appWidth,0);

            let middleLineSprite = new PIXI.Sprite(middleLineGraphic.generateCanvasTexture());
            middleLineSprite.y = appMiddle;

            curtainContainer.addChild(middleLineSprite);

            let spinButton = new SpinButton();
            spinButton.position.set(appWidth / 2, appHeight - spinButton.height);
            spinButton.anchor.set(0.5,0.5);

            curtainContainer.addChild(spinButton );

            let reelComponent:ReelComponent = new ReelComponent([7,8,9,10], this.app.ticker);

            reelComponent.x = 200;
            reelComponent.y = appMiddle;

            this.app.stage.addChild(reelComponent);


            this.app.stage.addChild(curtainContainer);

        }

        private fillSignTexturesArray():void {
            let idx:String;
            for (let i = 1; i < 14; i++) {
                idx = (i > 9) ? String(i) : "0"+String(i);
                Collections.signsTexturesArray.push(PIXI.Texture.fromImage("./assets/img/"+ idx +".png"));
            }
        }

    }



    export class SpinButton extends PIXI.Sprite {

        private textureButton: PIXI.Texture ;
        private textureButtonPressed: PIXI.Texture;
        private textureButtonHover: PIXI.Texture;
        private textureButtonDisable: PIXI.Texture;

        constructor() {

            this.textureButton =  PIXI.Texture.fromImage('assets/img/btn_spin_normal.png');
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

        private signHeight: number = 178;
        private signVPadding: number = -20;

        constructor(signsIDArray:[], ticker) {
            super();

            this.signsIDArray = signsIDArray;
            this.ticker = ticker;

            this.init();



        }

        private init():void {

            var beginSignsAmount: number = 4;
            var endSignsAmount: number = 2;

            let fullSignsIDArray:[] = this.signsIDArray.slice(this.signsIDArray.length-beginSignsAmount,this.signsIDArray.length);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDArray);
            fullSignsIDArray = fullSignsIDArray.concat(this.signsIDArray.slice(0,endSignsAmount));

            let mainColumnSprite = this.getSignColumnSprite(fullSignsIDArray);

            mainColumnSprite.y = -this.signStep * beginSignsAmount;


            this.addChild(mainColumnSprite);

           // console.log("-first>", mainColumnSprite.y + (this.signStep * beginSignsAmount));

            this.ticker.add(this.reelMoving);

        }

        private reelMoving(): void {

            console.log("-start>", this);

            /*if (  mainColumnSprite.y + (this.signStep * beginSignsAmount)
                >
                (this.signStep * (2)  )

            )
            {

            } else {
                mainColumnSprite.y +=6;
            }

            console.log("-proc>", this.signStep);*/
        }

        private get signStep(): number {
            return (this.signHeight + this.signVPadding);
        }

        private getSignColumnSprite(signsIDArray:[]):PIXI.Sprite {
            let signsColumnSprite:PIXI.Sprite = new PIXI.Sprite();
            let currentSignSprite:PIXI.Sprite;

            signsIDArray.forEach((item, index) => {
                currentSignSprite = new PIXI.Sprite(Collections.signsTexturesArray[item-1]);
                currentSignSprite.anchor.set(0.5,0.5)
                currentSignSprite.y = this.signStep * index;

                if (index == 4){
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
