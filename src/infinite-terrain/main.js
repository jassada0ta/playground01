import { Chunk } from "./entities.js";
import { perlin2 } from "./perlin.js";

class SceneMain extends Phaser.Scene {
    constructor() {
      super({ key: "SceneMain" });
    }
  
    preload() {
      this.load.spritesheet("sprWater", "assets/infinite-terrain/sprWater.png", {
        frameWidth: 16,
        frameHeight: 16
      });
      this.load.image("sprSand", "assets/infinite-terrain/sprSand.png");
      this.load.image("sprGrass", "assets/infinite-terrain/sprGrass.png");
    }
  
    create() {
      this.noise2d = perlin2();
      this.anims.create({
        key: "sprWater",
        frames: this.anims.generateFrameNumbers("sprWater"),
        frameRate: 5,
        repeat: -1
      });
  
      this.chunkSize = 16;
      this.tileSize = 16;
      this.cameraSpeed = 10;
  
      this.cameras.main.setZoom(2);
      this.followPoint = new Phaser.Math.Vector2(
        this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
        this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
      );
  
      this.chunks = [];
  
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  
    getChunk(x, y) {
      var chunk = null;
      for (var i = 0; i < this.chunks.length; i++) {
        if (this.chunks[i].x == x && this.chunks[i].y == y) {
          chunk = this.chunks[i];
        }
      }
      return chunk;
    }
  
    update() {
  
      var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
      var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));
  
      snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
      snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
  
      for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
        for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
          var existingChunk = this.getChunk(x, y);
  
          if (existingChunk == null) {
            var newChunk = new Chunk(this,this.noise2d, x, y);
            this.chunks.push(newChunk);
          }
        }
      }
  
      for (var i = 0; i < this.chunks.length; i++) {
        var chunk = this.chunks[i];
  
        if (Phaser.Math.Distance.Between(
          snappedChunkX,
          snappedChunkY,
          chunk.x,
          chunk.y
        ) < 3) {
          if (chunk !== null) {
            chunk.load();
          }
        }
        else {
          if (chunk !== null) {
            chunk.unload();
          }
        }
      }
  
      if (this.keyW.isDown) {
        this.followPoint.y -= this.cameraSpeed;
      }
      if (this.keyS.isDown) {
        this.followPoint.y += this.cameraSpeed;
      }
      if (this.keyA.isDown) {
        this.followPoint.x -= this.cameraSpeed;
      }
      if (this.keyD.isDown) {
        this.followPoint.x += this.cameraSpeed;
      }
  
      this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
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
            gravity: { y: 0, x:0 },
            debug: false,
          },
        },
        scene: [SceneMain],
      };

      const game = new Phaser.Game(config);
    }
  }
);
