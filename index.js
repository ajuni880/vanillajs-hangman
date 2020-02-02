(function () {
    const state = {
        word: getWord(),
        guessedChars: [],
        wrongChars: new Map()
    }

    const DOM = {
        guillotine: document.querySelector('.guillotine'),
        wordContainer: document.querySelector('.word'),
        wrongCharsContainer: document.querySelector('.wrong-chars__content'),
        popup: document.querySelector('.popup'),
        playAgainBtn: document.querySelector('#playAgain')
    }

    init()

    function init() {
        document.addEventListener('keyup', onKeyUp)
        DOM.playAgainBtn.addEventListener('click', playAgain)
        initCharBuckets();
    }

    function initCharBuckets() {
        let html = ''
        for (let i = 0; i < state.word.length; i++) {
            html += `<span class="word__char word__char--${i}"></span>`
        }
        DOM.wordContainer.insertAdjacentHTML('afterbegin', html)
    }

    function guess(char) {
        const alreadyGuessed = state.guessedChars.includes(char)
        const positions = alreadyGuessed ? [] : findCharPostions(state.word, char)
        if (!alreadyGuessed && positions.length) {
            displayGuessedChars(positions, char)
        } else {
            if (!state.wrongChars.has(char)) {
                updateHangman()
                displayWrongChars(char);
                displayGameOver()
            }
        }
    }

    function displayGuessedChars(positions, char) {
        if (positions.length) {
            const selector = positions.map(p => `.word__char--${p}`).join(', ')
            const elems = DOM.wordContainer.querySelectorAll(selector)
            Array.prototype.slice.call(elems).forEach(elem => {
                elem.innerText = char
            });
            for (const p of positions) {
                state.guessedChars[p] = char
            }
            displayCorrectGuess()
        }
    }

    function displayCorrectGuess() {
        if (state.guessedChars.length === state.word.length && state.guessedChars.join('') === state.word) {
            DOM.popup.firstElementChild.firstElementChild.innerText = 'You guessed it!'
            DOM.popup.style.display = 'block'
        }
    }

    function updateHangman() {
        const elem = document.querySelector(`[data-id="${state.wrongChars.size}"]`)
        if (elem) {
            elem.classList.remove('hide')
        }
    }

    function findCharPostions(word, char) {
        const positions = []
        for (let i = 0; i < word.length; i++) {
            if (word[i] === char) {
                positions.push(i)
            }
        }
        return positions
    }

    function displayGameOver() {
        if (isGameOver()) {
            DOM.popup.firstElementChild.firstElementChild.innerText = 'GAME OVER!'
            DOM.popup.style.display = 'block'
        }
    }

    function isGameOver() {
        return state.wrongChars.size === 6
    }

    function displayWrongChars(char) {
        state.wrongChars.set(char, char)
        const text = DOM.wrongCharsContainer.innerText
        DOM.wrongCharsContainer.innerText = text ? `${text}, ${state.wrongChars.get(char)}` : char
    }

    function onKeyUp(e) {
        const keyCode = e.keyCode || e.which
        if (keyCode >= 65 && keyCode <= 90) {
            guess(e.key.toLowerCase())
        }
    }

    function playAgain() {
        resetState()
        resetHangman()
        DOM.popup.style.display = 'none'
        DOM.wordContainer.innerHTML = ''
        DOM.wrongCharsContainer.innerHTML = ''
        init()
    }

    function resetHangman() {
        const elems = document.querySelectorAll(`.man`)
        Array.prototype.slice.call(elems).forEach(elem => {
            elem.classList.add('hide')
        });
    }

    function resetState() {
        state.word = getWord()
        state.wrongChars = new Map()
        state.guessedChars = []
    }

    function getWord() {
        const words = ['bonus', 'inspector', 'population', 'computer' ,  'revolution']
        return words[Math.floor(Math.random() * words.length)]
    }
})()