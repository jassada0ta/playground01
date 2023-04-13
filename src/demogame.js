

class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.outText = null;
        this.joyStick = null;
        this.isDumpjoyStick = false;
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = "Key down: ";
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

        this.outText.setText(s);
    }

    preload() {
        this.load.plugin('rexvirtualjoystickplugin', '/lib/phaser-plugins/rexvirtualjoystickplugin.min.js', true);
    }

    create() {
        this.cameras.main.setBounds(0, 0, 2048, 2048);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);
        const outText = this.add.text(10, 10)
            .setText("Demo game")
            .setScrollFactor(0);
        outText.setShadow(1, 1, "#000000", 2);
        this.outText = outText;

        this.joyStick = this.plugins
            .get("rexvirtualjoystickplugin")
            .add(this, {
                x: 120,
                y: 480,
                radius: 100,
                base: this.add.circle(0, 0, 100, 0x888888),
                thumb: this.add.circle(0, 0, 50, 0xcccccc),
                dir: '4dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            })
            .on("update", this.dumpJoyStickState, this)
            .on("pointerdown", function () {
                console.log("pointerdown");
            })
            .on("pointerup", function () {
                console.log("pointerup");
            });
        this.dumpJoyStickState();

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
                        gravity: { y: 300 },
                        debug: false
                    }
                },
                scene: MainScene
            };

            const game = new Phaser.Game(config);
            alert("test");
        }
    }
);