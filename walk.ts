enum Direction {
    UP, DOWN, LEFT, RIGHT
};

interface DirectionalImages {
    up: Image;
    down: Image;
    left: Image;
    right: Image;
}

const playerImages = <DirectionalImages>{
    up: assets.image`playerUp`,
    down: assets.image`playerDown`,
    left: assets.image`playerLeft`,
    right: assets.image`playerRight`,
};

// State
let enableWalking = true;

const turnOnControls = (player: Sprite) => {
    controller.moveSprite(player);

    controller.up.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            player.setImage(playerImages.up);
        }
    });

    controller.down.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            player.setImage(playerImages.down);
        }
    });

    controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            player.setImage(playerImages.left);
        }
    });

    controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            player.setImage(playerImages.right);
        }
    });
};

const turnOffWalking = (player: Sprite) => {
    enableWalking = false;
    controller.moveSprite(player, 0, 0);
};