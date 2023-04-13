
class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.outText = null;
    }

    preload() { }

    create() {
        this.cameras.main.setBounds(0, 0, 2048, 2048);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);
        const outText = this.add.text(10, 10).setText("Hello").setScrollFactor(0);
        outText.setShadow(1, 1, "#000000", 2);
        this.outText = outText;
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
            const config = {
                type: Phaser.AUTO,
                backgroundColor: "#000000",
                scale: {
                    mode: Phaser.Scale.FIT,
                    parent: "phaser-example",
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 1068,
                    height: 600,
                },
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { y: 300 },
                        debug: false,
                    },
                },
                scene: [MainScene],
            };

            const game = new Phaser.Game(config);
        }
    }
);