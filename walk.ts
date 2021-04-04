enum Direction {
    UP, DOWN, LEFT, RIGHT
};

interface DirectionalImages {
    up: Image;
    down: Image;
    left: Image;
    right: Image;
}

interface DirectionalImageFrames {
    up: Image[];
    down: Image[];
    left: Image[];
    right: Image[];
}

const ANIMATION_SPEED = 200;

const playerImages = <DirectionalImages>{
    up: assets.image`playerUp`,
    down: assets.image`playerDown`,
    left: assets.image`playerLeft`,
    right: assets.image`playerRight`,
};

const playerAnimations = <DirectionalImageFrames>{
    up: assets.animation`playerWalkUp`,
    down: assets.animation`playerWalkDown`,
    left: assets.animation`playerWalkLeft`,
    right: assets.animation`playerWalkRight`,
};

// State
let enableWalking = true;
let direction: Direction = Direction.UP;

const isMoving = (player: Sprite) => 
    controller.up.isPressed() || 
    controller.down.isPressed() || 
    controller.left.isPressed() || 
    controller.right.isPressed();

const setImageFromState = (player: Sprite) => {
    if (isMoving(player)) {
        switch(direction) {
            case Direction.UP:
                animation.runImageAnimation(player, playerAnimations.up, ANIMATION_SPEED, true);
                break;
            case Direction.DOWN:
                animation.runImageAnimation(player, playerAnimations.down, ANIMATION_SPEED, true);
                break;
            case Direction.LEFT:
                animation.runImageAnimation(player, playerAnimations.left, ANIMATION_SPEED, true);
                break;
            case Direction.RIGHT:
                animation.runImageAnimation(player, playerAnimations.right, ANIMATION_SPEED, true);
                break;
        }
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, player);

        switch(direction) {
            case Direction.UP:
                player.setImage(playerImages.up);
                break;
            case Direction.DOWN:
                player.setImage(playerImages.down);
                break;
            case Direction.LEFT:
                player.setImage(playerImages.left);
                break;
            case Direction.RIGHT:
                player.setImage(playerImages.right);
                break;
        }
    }
}

const turnOnControls = (player: Sprite) => {
    controller.moveSprite(player);

    // Arrow key pressed
    controller.up.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            direction = Direction.UP;
            setImageFromState(player);
        }
    });
    controller.down.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            direction = Direction.DOWN;
            setImageFromState(player);
        }
    });
    controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            direction = Direction.LEFT;
            setImageFromState(player);
        }
    });
    controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
        if (enableWalking) {
            direction = Direction.RIGHT;
            setImageFromState(player);
        }
    });

    // Arrow key released
    controller.up.onEvent(ControllerButtonEvent.Released, function() {
        if (enableWalking) {
            setImageFromState(player);
        }
    });
    controller.down.onEvent(ControllerButtonEvent.Released, function() {
        if (enableWalking) {
            setImageFromState(player);
        }
    });
    controller.left.onEvent(ControllerButtonEvent.Released, function() {
        if (enableWalking) {
            setImageFromState(player);
        }
    });
    controller.right.onEvent(ControllerButtonEvent.Released, function() {
        if (enableWalking) {
            setImageFromState(player);
        }
    });
};

const turnOffWalking = (player: Sprite) => {
    enableWalking = false;
    controller.moveSprite(player, 0, 0);
};