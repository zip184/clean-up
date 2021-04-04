const unicornImg: Image = assets.image`unicorn`;

enum DiagDirection {
    NORTHEAST, SOUTHEAST, SOUTHWEST, NORTHWEST
}

const startPos = { x: 145, y: 14 };

const bounds = {
    xMin: 10,
    xMax: 150,
    yMin: 13,
    yMax: 106,
};

const getRandomDirection = (dontAllowDirs: DiagDirection[]): DiagDirection => {
    const allDirs = [DiagDirection.NORTHEAST, DiagDirection.SOUTHEAST, DiagDirection.SOUTHWEST, DiagDirection.NORTHWEST];
    const posDirs = dontAllowDirs ? allDirs.filter(dir => !!dontAllowDirs.find(fDir => fDir === dir)) : allDirs;
    return posDirs[randint(0, posDirs.length - 1)];
}

class TizzyMonster {
    mon: Sprite = null;
    isReturning = false;
    currentDir: DiagDirection = null;
    onDropUnicornHandler: () => void = null;

    constructor() {
        // Set random direction
        setInterval(function() {
            if (this.mon && !this.isReturning) {
                this.setDirection(getRandomDirection(undefined));
            }
        }, SWITCH_DIR_TIME);

        // Check for out of bounds & if we're home
        setInterval(function() {
            if (!this.mon) {
                return;
            }

            if (this.isReturning) {
                this.destroyIfClose();
            } else {
                this.checkBounds();
            }

        }, CHECK_POS_TIME);

        // Drop a unicorn
        setInterval(function() {
            if (!this.mon || this.isReturning) {
                return;
            }

            this.dropUnicorn();
        }, DROP_UNICORN_TIME);
    }

    /**
     * Returns true if monster was already unleashed
     */
    unleash() {
        if (this.mon) {
            return false;
        }

        this.mon = sprites.create(assets.image`emptyImage`, SpriteKind.Enemy);
        animation.runImageAnimation(this.mon, assets.animation`tizzyMon`, 150, true);
        this.mon.setPosition(startPos.x, startPos.y);
        this.setDirection(DiagDirection.SOUTHWEST);
        tizzyMonsterSound();

        this.isReturning = false;

        setTimeout(function() {
            this.returnHome();
        }, TIME_BEFORE_RETURNING);

        
        if (DEBUG_MODE) {
            controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
                this.returnHome();
            });
        }

        return true;
    }

    onDropUnicorn(onDrop: () => void) {
        this.onDropUnicornHandler = onDrop;
    }

    dropUnicorn() {
        let unicorn = sprites.create(assets.image`unicorn`, SpriteKind.Toy);
        unicorn.setPosition(this.mon.x, this.mon.y);

        if (this.onDropUnicornHandler) {
            this.onDropUnicornHandler();
        }
    }

    setDirection(dir: DiagDirection) {
        switch(dir) {
            case DiagDirection.NORTHEAST:
                this.mon.vx = MON_X_SPEED;
                this.mon.vy = -MON_Y_SPEED;
                break;
            case DiagDirection.SOUTHEAST:
                this.mon.vx = MON_X_SPEED;
                this.mon.vy = MON_Y_SPEED;
                break;
            case DiagDirection.SOUTHWEST:
                this.mon.vx = -MON_X_SPEED;
                this.mon.vy = MON_Y_SPEED;
                break;
            case DiagDirection.NORTHWEST:
                this.mon.vx = -MON_X_SPEED;
                this.mon.vy = -MON_Y_SPEED;
                break;
        }

        this.currentDir = dir;
    }

    checkBounds() {
        const posDirs = [DiagDirection.NORTHEAST, DiagDirection.SOUTHEAST, DiagDirection.SOUTHWEST, DiagDirection.NORTHWEST];

        const { x, y } = this.mon;

        const reverseX = () => this.currentDir === DiagDirection.SOUTHWEST ? DiagDirection.NORTHWEST : DiagDirection.SOUTHWEST;
        const reverseY = () => this.currentDir === DiagDirection.SOUTHWEST ? DiagDirection.NORTHWEST : DiagDirection.SOUTHWEST;

        // Check corners
        if (x < bounds.xMin && y < bounds.yMin) {
            this.setDirection(DiagDirection.SOUTHEAST);
        } else if (x < bounds.xMin && y > bounds.yMax) {
            this.setDirection(DiagDirection.NORTHEAST);
        } else if (x > bounds.xMax && y < bounds.yMin) {
            this.setDirection(DiagDirection.SOUTHWEST);
        } else if (x > bounds.xMax && y > bounds.yMax) {
            this.setDirection(DiagDirection.NORTHWEST);
        // Check walls
        } else if (x < bounds.xMin) {
            this.setDirection(this.currentDir === DiagDirection.SOUTHWEST ? DiagDirection.SOUTHEAST : DiagDirection.NORTHEAST);
        } else if (x > bounds.xMax) {
            this.setDirection(this.currentDir === DiagDirection.SOUTHWEST ? DiagDirection.SOUTHWEST : DiagDirection.NORTHWEST);
        } else if (y < bounds.yMin) {
            this.setDirection(this.currentDir === DiagDirection.NORTHWEST ? DiagDirection.SOUTHWEST : DiagDirection.SOUTHEAST);
        } else if (y > bounds.yMax) {
            this.setDirection(this.currentDir === DiagDirection.SOUTHEAST ? DiagDirection.NORTHEAST : DiagDirection.NORTHWEST);
        }
    }

    returnHome() {
        this.isReturning = true;
        stopAllSounds();
        tizzyBedTime();

        const dy = this.mon.y - startPos.y;
        const dx = startPos.x - this.mon.x;

        if (dx >= dy) {
            this.mon.vx = MON_X_SPEED;
            this.mon.vy = (dy / dx) * -MON_Y_SPEED;
        } else {
            this.mon.vy = -MON_Y_SPEED;
            this.mon.vx = (dx / dy) * MON_X_SPEED;
        }
    }

    destroyIfClose() {
        const dx = Math.abs(this.mon.x - startPos.x)
        const dy = Math.abs(this.mon.y - startPos.y);
        const distToStart = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distToStart < 15) {
            this.destoryMon();
        }
    }

    destoryMon() {
        if (this.mon) {
            this.mon.destroy();
            this.mon = null;
            this.isReturning = false;
            stopAllSounds();
        }
    }
}

const tizzy = new TizzyMonster();