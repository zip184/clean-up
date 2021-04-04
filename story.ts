class TalkSequence {
    sprite: Sprite;
    emptySprite: Sprite;

    constructor(x: number, y:number) {
        this.emptySprite = sprites.create(assets.image`emptyImage`, SpriteKind.Voice);
        this.resetVoice(x, y);
    }

    setSprite(s: Sprite) {
        this.sprite = s;
    }

    resetVoice(x: number, y:number) {
        this.emptySprite.setPosition(x, y);
        this.sprite = this.emptySprite;
    }

    destroy() {
        this.emptySprite.destroy();
    }

    showText(text: string, duration: number, postDelay = 0, onFinish?: () => void) {
        this.sprite.say(text, duration);

        setTimeout(() => {
            if (onFinish) {
                onFinish();
            }

        }, duration + postDelay);
    }
}

function tizzyBedTime() {
    const talk = new TalkSequence(100, 18);
    talk.showText("Mom: Tizzy!", 1200, 300, () => {
    talk.showText("Time for bed!", 2500, 300, () => {});
    });
};

function openingSequence(onFinish?: () => void) {
    const talk = new TalkSequence(100, 6);

    talk.showText("Mom: Keathopher!", 2500, 300, () => {
    talk.showText("It's almost", 1200, 200, () => {
    talk.showText("BEDTIME!", 1200, 800, () => {
    talk.showText('Clean your room', 1200, 300, () => {
    talk.showText('before bed...', 1000, 300, () => {
    talk.showText('OR ELSE!!!', 1800, 700, () => {

    talk.setSprite(cleaner);
    talk.showText("I'll just finish", 1200, 300, () => {
    talk.showText("this last level.", 2000, 1000, () => {
    game.splash("25 mintues later...");

    talk.resetVoice(100, 6);
    talk.showText("DAD: KEATHTOPHER", 2500, 300, () => {
    talk.showText("I'm coming down!", 1200, 200, () => {
    talk.showText("That room", 1200, 100, () => {
    talk.showText("BETTER BE CLEAN!", 2000, 400, () => {

    talk.destroy();
    if (onFinish) {
        onFinish();
    }
    })
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
    });
}

function closingSequenceLost(onFinish?: () => void) {
    const dad = sprites.create(assets.image`dad`, SpriteKind.Voice);
    dad.setPosition(110, 30);
    const talk = new TalkSequence(0, 0);
    talk.setSprite(dad);

    talk.showText("What a mess!", 1200, 300, () => {
    talk.showText("No more video games!", 1200, 300, () => {
    talk.showText("We're sending", 800, 300, () => {
    talk.showText("that PS5 to...", 1000, 300, () => {
    talk.showText("your Aunt & Uncle!", 2000, 300, () => {
        if (onFinish) {
            onFinish();
        }
    });
    });
    });
    });
    });
}

function closingSequenceWon(onFinish?: () => void) {
    const dad = sprites.create(assets.image`dad`, SpriteKind.Voice);
    dad.setPosition(110, 30);
    const talk = new TalkSequence(0, 0);
    talk.setSprite(dad);

    talk.showText("WOW Keathopher!", 1200, 300, () => {
    talk.showText("What a clean room!", 1200, 300, () => {
    dad.setImage(assets.image`dadIceCream`);
    talk.showText("Have some ICE CREAM!", 2000, 300, () => {
        if (onFinish) {
            onFinish();
        }
    });
    });
    });
}