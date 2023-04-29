export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, joystick) {
        super(scene, x, y, 'player', 0);
        this.joystick = joystick;
        this.punching = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (this.punching) {
                this.punching = false;
                this.scene.updateDebugData();
            }
        }, this);
    }

    punch() {
        this.punching = true;
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.scene.updateDebugData();
        this.anims.play('punch', true);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        const player = this;
        const joystick = this.joystick;
        const cursors = joystick.createCursorKeys();


        const forceX = Math.floor(joystick.forceX * 100) / 100;
        const forceY = Math.floor(joystick.forceY * 100) / 100;

        if (this.punching) {
            player.setVelocityX(0);
            player.setVelocityY(0);
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