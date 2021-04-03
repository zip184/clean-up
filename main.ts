namespace SpriteKind {
    export const Container = SpriteKind.create();
    export const Toy = SpriteKind.create();
    export const Voice = SpriteKind.create();
    export const VideoGame = SpriteKind.create();
}

let toyImages: Image[] = [
    assets.image`toy0`,
    assets.image`toy1`,
    assets.image`toy2`,
    assets.image`toy3`,
    assets.image`toy4`,
    assets.image`toy5`,
    assets.image`toy6`,
    assets.image`toy7`,
    assets.image`toy8`,
    assets.image`toy9`,
    assets.image`toy10`
]

// Constants
const MIN_TOY_PLACEMENT_DISTANCE = 20;
const TOY_CARRY_CAPACITY = 3;
const TOY_COUNT = 30;
const TIME_LIMIT = 35;
const PLAY_MUSIC = true;
const DO_OPENING_SEQUENCE = true;

// Game state
const gameState = {
    toyCarryCount: 0,
    putAwayToys: 0,
};

function areTooClose(sprite1: Sprite, sprite2: Sprite) {
    const xDiff = Math.abs(sprite1.x - sprite2.x);
    const yDiff = Math.abs(sprite1.y - sprite2.y);

    const dist = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    return dist >= MIN_TOY_PLACEMENT_DISTANCE;
}

function placeToy() {
    const setRandPos = (spr: Sprite) => spr.setPosition(randint(7, 150), randint(8, 115));
    //const setRandPos = (spr: Sprite) => spr.setPosition(randint(110, 110), randint(35, 35)); // DEBUG

    toyImg = toyImages[randint(0, toyImages.length - 1)]
    toy = sprites.create(toyImg, SpriteKind.Toy)
    setRandPos(toy)

    while(
        !areTooClose(toy, cleaner) ||
        !areTooClose(toy, bin) ||
        !areTooClose(toy, videoGame)
    ) {
        setRandPos(toy);
    }
}

function createToys(num: number) {
    for (let index = 0; index <= num - 1; index++) {
        placeToy()
    }
}

const setCapBar = () => capacityBar.value = Math.ceil((gameState.toyCarryCount / TOY_CARRY_CAPACITY) * 100);

function setupCapBar() {
    capacityBar = statusbars.create(20, 4, 0)
    capacityBar.attachToSprite(cleaner)
    capacityBar.setColor(0x7, 0x6)
    capacityBar.setBarBorder(1, 0x10)
    setCapBar();
}

// Overlap events
sprites.onOverlap(SpriteKind.Player, SpriteKind.Toy, function(player: Sprite, toy: Sprite) {
    if (gameState.toyCarryCount >= TOY_CARRY_CAPACITY) {
        // Can't fit anymore toys
        return;
    }

    toy.destroy();
    gameState.toyCarryCount++;
    music.baDing.play();
    setCapBar();
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Container, function(player: Sprite, toy: Sprite) {
    if (gameState.toyCarryCount < 1) {
        // Not carrying anything
        return;
    }

    bin.setImage(assets.image`chestFull`);

    gameState.putAwayToys += gameState.toyCarryCount;
    gameState.toyCarryCount = 0;
    setCapBar();

    if (gameState.putAwayToys >= TOY_COUNT) {
        endGame(true);
    } else {
        music.thump.playUntilDone();
        setTimeout(function() {
            music.thump.playUntilDone();
        }, 120);
    }
});

const endGame = (win: boolean) => {
    capacityBar.destroy();
    turnOffWalking(cleaner);

    cleaner.setPosition(109, 66);
    cleaner.setImage(assets.image`playerUp`);

    if (win) {
        info.stopCountdown();
        closingSequenceWon(() => {
            game.over(true);
        });
    } else {
        closingSequenceLost(() => {
            game.over(false);
        });
    }
    
}

function startGame() {
    turnOnControls(cleaner);
    setupCapBar();
    info.startCountdown(TIME_LIMIT);

    if (PLAY_MUSIC) {
        singCleanupSong();
    }

    info.onCountdownEnd(function() {
        endGame(false);
    });
}

let toy: Sprite = null
let toyImg: Image = null
let capacityBar: StatusBarSprite

scene.setBackgroundColor(6)
tiles.setTilemap(tilemap`bedroom`);

let cleaner = sprites.create(assets.image`playerUp`, SpriteKind.Player);
cleaner.setPosition(80, 48);
let bin = sprites.create(assets.image`chestEmpty`, SpriteKind.Container);
bin.setPosition(15, 15);
let videoGame = sprites.create(assets.image`tvOff`, SpriteKind.VideoGame);
videoGame.setPosition(80, 24);
animation.runImageAnimation(videoGame, assets.animation`tvVideoGame`, 200, true);

createToys(TOY_COUNT);

if (DO_OPENING_SEQUENCE) {
    openingSequence(() => {
        startGame();
    });
} else {
    startGame();
}


