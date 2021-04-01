namespace SpriteKind {
    export const Container = SpriteKind.create()
    export const Toy = SpriteKind.create()
}

let toyImages: Image[] = [
    assets.image`toy0`,
    assets.image`toy1`,
    assets.image`toy2`,
    assets.image`toy3`,
    assets.image`toy4`,
    assets.image`toy5`
]

// Constants
const MIN_TOY_PLACEMENT_DISTANCE = 20;
const TOY_CARRY_CAPACITY = 3;
const TOY_COUNT = 18;

// Game state
const gameState = {
    toyCarryCount: 0,
    putAwayToys: 0,
}

function areTooClose(sprite1: Sprite, sprite2: Sprite) {
    const xDiff = Math.abs(sprite1.x - sprite2.x);
    const yDiff = Math.abs(sprite1.y - sprite2.y);

    const dist = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    return dist >= MIN_TOY_PLACEMENT_DISTANCE;
}

function placeToy() {
    const setRandPos = (spr: Sprite) => spr.setPosition(randint(7, 150), randint(8, 115));

    toyImg = toyImages[randint(0, toyImages.length - 1)]
    toy = sprites.create(toyImg, SpriteKind.Toy)
    setRandPos(toy)

    while(!areTooClose(toy, cleaner) || !areTooClose(toy, bin)) {
        setRandPos(toy)
    }
}

function createToys(num: number) {
    for (let index = 0; index <= num - 1; index++) {
        placeToy()
    }
}

const singCleanupSong = () => {
    const maxSayTimes = 3;
    const maxSongTimes = 4;
        music.setVolume(100)

    let counter = 0;
    const playLine = () => {
        counter++;

        if (counter > maxSongTimes) {
            return;
        }
        if (counter <= maxSayTimes) {
            cleaner.say('Clean Up', 500)
        }

        music.playMelody("C5", 130)
        music.playMelody("A4", 200)
        music.playMelody("", 20)
    }

    setInterval(function() {
        playLine()
    }, 200)
}

const setCapBar = () => capacityBar.value = Math.ceil((gameState.toyCarryCount / TOY_CARRY_CAPACITY) * 100);

const endGame = () => {
    capacityBar.setBarSize(0, 0)
    game.over(true);
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
        endGame();
    } else {
        music.thump.playUntilDone()
        setTimeout(function() {
            music.thump.playUntilDone()
        }, 120)
    }
})

let toy: Sprite = null
let toyImg: Image = null
let capacityBar: StatusBarSprite

scene.setBackgroundColor(6)
tiles.setTilemap(tilemap`level1`)

let cleaner = sprites.create(assets.image`player`, SpriteKind.Player)
controller.moveSprite(cleaner)
let bin = sprites.create(assets.image`chestEmpty`, SpriteKind.Container)
bin.setPosition(127, 5)

createToys(TOY_COUNT)

capacityBar = statusbars.create(20, 4, 0)
capacityBar.attachToSprite(cleaner)
capacityBar.setColor(0x7, 0x6)
capacityBar.setBarBorder(1, 0x10)
setCapBar();

singCleanupSong();

