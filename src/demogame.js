

class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.outText = null;
        this.joyStick = null;
        this.isShowDebug = true;
        this.player = null;
        this.punching = false;
    }

    updateDebugData() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = "Key down: ";
        if (this.isShowDebug) {
            for (var name in cursorKeys) {
                if (cursorKeys[name].isDown) {
                    s += `${name} `;
                }
            }

            s += `
Force: ${Math.floor(this.joyStick.force * 100) / 100}
Angle: ${Math.floor(this.joyStick.angle * 100) / 100}
`;

            s += "\nTimestamp:\n";
            for (var name in cursorKeys) {
                var key = cursorKeys[name];
                s += `${name}: duration=${key.duration / 1000}\n`;
            }
        }
        else {
            s = "";
        }
        s += "\nPunch:" + this.punching + "\n";
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
        const player = this.physics.add.sprite(400, 300, 'player');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

    setupJoyStick() {
        this.joyStick = this.plugins
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
            this.punching = true;
            this.updateDebugData();
        });
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
        this.setupJoyStick();
        this.setupButtons();
        this.setupPlayer();
        this.updateDebugData();
    }

    update() {
        var cursors = this.joyStick.createCursorKeys();
        var player = this.player;
        const forceX = Math.floor(this.joyStick.forceX * 100) / 100;
        const forceY = Math.floor(this.joyStick.forceY * 100) / 100;

        if (this.punching) {
            if (player.anims.currentAnim.key !== 'punch') {
                player.setVelocityX(0);
                player.setVelocityY(0);
                player.anims.play('punch', true);
            } else {
                if (!player.anims.isPlaying) {
                    this.punching = false;
                    this.updateDebugData();
                }
            }
        } else if (cursors.left.isDown || cursors.right.isDown
            || cursors.up.isDown || cursors.down.isDown) {
            player.setVelocityX(forceX);
            player.setVelocityY(forceY);
            player.anims.play('walk', true);
            this.punching = false;
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('idle');
        }

        if (forceX < 0) {
            player.setFlipX(false);
        } else if (forceX > 0) {
            player.setFlipX(true);
        }

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
                        debug: false
                    }
                },
                scene: MainScene
            };

            const game = new Phaser.Game(config);
        }
    }
);