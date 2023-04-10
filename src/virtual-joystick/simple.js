class Demo extends Phaser.Scene {
  constructor() {
    super({
      key: "examples",
    });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', '/lib/phaser-plugins/rexvirtualjoystickplugin.min.js', true);
  }

  create() {
    this.joyStick = this.plugins
      .get("rexvirtualjoystickplugin")
      .add(this, {
        x: 400,
        y: 300,
        radius: 100,
        // base: this.add.circle(0, 0, 100, 0x888888),
        // thumb: this.add.circle(0, 0, 50, 0xcccccc),
        // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
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

    this.text = this.add.text(0, 0);
    this.dumpJoyStickState();
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

    this.text.setText(s);
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
        parent: "phaser-example",
        width: 800,
        height: 600,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: Demo,
      };

      var game = new Phaser.Game(config);
    }
  }
);
