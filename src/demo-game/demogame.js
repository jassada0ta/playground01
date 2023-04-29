import { PlayerSprite } from "./player.js";

class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.outText = null;
        this.joystick = null;
        this.atkButton = null;
        this.isShowDebug = true;
        this.player = null;
    }

    updateDebugData() {
        var cursorKeys = this.joystick.createCursorKeys();
        var s = "Key down: ";
        if (this.isShowDebug) {
            for (var name in cursorKeys) {
                if (cursorKeys[name].isDown) {
                    s += `${name} `;
                }
            }

            s += `
Force: ${Math.floor(this.joystick.force * 100) / 100}
Angle: ${Math.floor(this.joystick.angle * 100) / 100}
`;

            s += "\nTimestamp:\n";
            for (var name in cursorKeys) {
                var key = cursorKeys[name];
                s += `${name}: duration=${key.duration / 1000}\n`;
            }
            s += "\nPunch:" + this.player.punching + "\n";
        }
        else {
            s = "";
        }
        this.outText.setText(s);
    }

    preload() {
        this.load.plugin(
            'rexvirtualjoystickplugin',
            '/lib/phaser-plugins/rexvirtualjoystickplugin.min.js',
            true);
        this.load.plugin(
            'rexbuttonplugin',
            '/lib/phaser-plugins/rexbuttonplugin.min.js',
            true);

        this.load.spritesheet(
            'player',
            'assets/demo-game/player2.png',
            { frameWidth: 32, frameHeight: 48 },
        );

        this.load.image('sky', 'assets/firstgame/sky.png');
    }

    setupPlayer() {

        const player = new PlayerSprite(this, 400, 300, this.joystick);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 15 }),
            frameRate: 15,
            repeat: 0,
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 20
        });

        this.player = player;
    }

    setupJoystick() {
        this.joystick = this.plugins
            .get("rexvirtualjoystickplugin")
            .add(this, {
                x: 120,
                y: 480,
                radius: 100,
                base: this.add.circle(0, 0, 100, 0x888888, 0.4),
                thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.6),
                dir: '4dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            })
            .on("update", () => {
                this.updateDebugData();
            }, this)
            .on("pointerdown", function () {
                console.log("pointerdown");
            })
            .on("pointerup", function () {
                console.log("pointerup");
            });
    }

    setupButtons() {
        const scene = this;
        const btnPlugin = scene.plugins.get('rexbuttonplugin');
        scene.input.addPointer(1);

        const toggleDebugBtnSprite = scene.add.circle(775, 15, 10, 0xdddddd);
        const toggleDebugBtn = btnPlugin.add(toggleDebugBtnSprite);
        toggleDebugBtn.on('click', () => {
            scene.isShowDebug = !scene.isShowDebug;
            scene.updateDebugData();
        });

        const atkBtnSprite = scene.add.circle(700, 500, 25, 0xff6666);
        const atkBtn = btnPlugin.add(atkBtnSprite);

        atkBtn.on('click', () => {
            this.player.punch();
            this.updateDebugData();
        });

        this.atkButton = atkBtn;
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.cameras.main.setBounds(0, 0, 2048, 2048);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);
        const outText = this.add.text(10, 10)
            .setText("Demo game")
            .setScrollFactor(0);
        outText.setShadow(1, 1, "#000000", 2);
        this.outText = outText;
        this.setupPlayer();
        this.setupJoystick();
        this.setupButtons();
        this.updateDebugData();
    }

    update() {
        
    }
}

window.customElements.define(
    "phaser-screen",
    class extends HTMLElement {
        constructor() {
            super();
            const root = this.attachShadow({ mode: "open" });
        }

        connectedCallback() {

            const self = this;
            var config = {
                type: Phaser.AUTO,
                scale: {
                    mode: Phaser.Scale.FIT,
                    parent: 'phaser-example',
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 800,
                    height: 600
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: true
                    }
                },
                scene: MainScene
            };

            const game = new Phaser.Game(config);
        }
    }
);