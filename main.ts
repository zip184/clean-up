namespace SpriteKind {
    export const Container = SpriteKind.create()
    export const Toy = SpriteKind.create()
    export const Voice = SpriteKind.create()
    export const VideoGame = SpriteKind.create()
}

// --- Constants ---
const DEBUG_MODE = false;
const DISABLE_OPENING = false;
const TIME_LIMIT = 50;
const TOY_CARRY_CAPACITY = 3;
const MIN_TOY_PLACEMENT_DISTANCE = 20
const TOY_COUNT = DEBUG_MODE ? 1 : 40;
const TIME_BEFORE_UNLEASH = DEBUG_MODE ? 1000 : 10000;

// ---- Tizzy Monster Constants ----
const MON_X_SPEED = 50;
const MON_Y_SPEED = 50;
const SWITCH_DIR_TIME = 1500;
const CHECK_POS_TIME = 200;
const TIME_BEFORE_RETURNING = 9000;
const DROP_UNICORN_TIME = 1500;
// -------------

const toyImages = [
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
];

const gameState = {
    toyCarryCount: 0,
    putAwayToys: 0,
    totalToyCount: TOY_COUNT,
};

sprites.onOverlap(SpriteKind.Player, SpriteKind.Container, function (player2, toy) {
    if (gameState.toyCarryCount < 1) {
        return;
    }
    bin.setImage(assets.image`chestFull`)
    gameState.putAwayToys += gameState.toyCarryCount;

    gameState.toyCarryCount = 0;
    setCapBar();

    if (gameState.putAwayToys >= gameState.totalToyCount) {
            endGame(true);
        } else {
            music.thump.playUntilDone()
            setTimeout(function() {
                music.thump.playUntilDone();
            }, 120);
        }
    })

function placeToy () {
    const setRandPos = (spr: Sprite) => spr.setPosition(randint(7, 150), randint(8, 115));
    
    let toyImg = toyImages[randint(0, toyImages.length - 1)]
    let toy = sprites.create(toyImg, SpriteKind.Toy)
    setRandPos(toy);
    const isNearTimer = () => toy.y < 20 && toy.x > 40 && toy.x < 90;

    while (areTooClose(toy, cleaner) || areTooClose(toy, bin) || areTooClose(toy, videoGame) || isNearTimer()) {
        setRandPos(toy);
    }
}

function areTooClose (sprite1: Sprite, sprite2: Sprite) {
    const xDiff = Math.abs(sprite1.x - sprite2.x)
    const yDiff = Math.abs(sprite1.y - sprite2.y)
    const dist = Math.sqrt(xDiff ** 2 + yDiff ** 2)
    return dist < MIN_TOY_PLACEMENT_DISTANCE
}

function setupCapBar () {
    capacityBar = statusbars.create(20, 4, 0)
    capacityBar.attachToSprite(cleaner)
    capacityBar.setColor(0x7, 0x6)
    capacityBar.setBarBorder(1, 0x10)
    setCapBar();
}

// Overlap events
sprites.onOverlap(SpriteKind.Player, SpriteKind.Toy, function (player2, toy) {
    if (gameState.toyCarryCount >= TOY_CARRY_CAPACITY) {
        return;
    }
    toy.destroy()
    gameState.toyCarryCount++;
music.baDing.play()
    setCapBar();
})

function createToys (num: number) {
    for (let index = 0; index <= num - 1; index++) {
        placeToy()
    }
}

const setCapBar = () => capacityBar.value = Math.ceil((gameState.toyCarryCount / TOY_CARRY_CAPACITY) * 100);

const endGame = (win: boolean) => {
    capacityBar.destroy();
    turnOffWalking(cleaner);
    tizzy.destoryMon();

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

function startGame () {
    turnOnControls(cleaner);

    setupCapBar();

    if (!DEBUG_MODE) {
        info.startCountdown(TIME_LIMIT);
        singCleanupSong();
    }
    info.onCountdownEnd(function() {
        endGame(false);
    });

    setTimeout(function() {
        tizzy.unleash();
        tizzy.onDropUnicorn(() => {
            gameState.totalToyCount++;
        });
    }, TIME_BEFORE_UNLEASH);
}

let toy: Sprite = null
let toyImg: Image = null
let capacityBar: StatusBarSprite

scene.setBackgroundColor(6)
tiles.setTilemap(tilemap`bedroom`);

let cleaner = sprites.create(assets.image`playerUp`, SpriteKind.Player)
cleaner.setPosition(80, 48)
let bin = sprites.create(assets.image`chestEmpty`, SpriteKind.Container)
bin.setPosition(15, 15)
let videoGame = sprites.create(assets.image`tvOff`, SpriteKind.VideoGame)
videoGame.setPosition(80, 24)
animation.runImageAnimation(videoGame,assets.animation`tvVideoGame`, 200, true);

createToys(TOY_COUNT);

if (!DEBUG_MODE && !DISABLE_OPENING) {
    game.splash("Clean Up Game!")
    openingSequence(() => {
        startGame()
    });
} else {
    startGame()
}