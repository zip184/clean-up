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
