let soundEnabled = false;

const singCleanupSong = () => {
    const maxSayTimes = 3;
    const maxSongTimes = 4;
    music.setVolume(100);
    soundEnabled = true;

    let counter = 0;
    const playLine = () => {
        counter++;

        if (counter > maxSongTimes || !soundEnabled) {
            return;
        }
        if (counter <= maxSayTimes) {
            cleaner.say('Clean Up', 500);
        }

        music.playMelody("C5", 130);
        music.playMelody("A4", 200);
        music.playMelody("", 20);
    }

    setInterval(function() {
        playLine();
    }, 200);
};

const tizzyMonsterSound = () => {
    const maxNoiseTimes = 4;
    music.setVolume(100);
    soundEnabled = true;

    let counter = 0;
    const playLine = () => {
        counter++;

        music.playMelody("C5", 700);
        music.playMelody("A4", 700);
    }
 
    setInterval(function() {
        if (soundEnabled) {
            playLine();
        }
    }, 25);
};

const stopAllSounds = () => {
    soundEnabled = false;
    music.stopAllSounds();
};