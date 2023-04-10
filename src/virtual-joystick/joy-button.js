class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        this.load.plugin('rexvirtualjoystickplugin', '/lib/phaser-plugins/rexvirtualjoystickplugin.min.js', true);
        this.load.plugin('rexbuttonplugin', '/lib/phaser-plugins/rexbuttonplugin.min.js', true);
    }

    create() {
        var joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 200,
            y: 300,
            radius: 100,
            // base: this.add.circle(0, 0, 100, 0x888888),
            // thumb: this.add.circle(0, 0, 50, 0xcccccc),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        })

        var print = this.add.text(0, 0, '');
        var sprite = this.add.circle(500, 300, 50).setStrokeStyle(2, 0xff0000);
        this.input.addPointer(1);
        var btn = this.plugins.get('rexbuttonplugin').add(sprite);

        //var btn = new Button(sprite);
        btn.on('click', function () {
            print.text += 'Click Button\n';
        })
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
                parent: 'phaser-example',
                width: 800,
                height: 600,
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                },
                scene: Demo
            };

            var game = new Phaser.Game(config);
        }
    }
);
