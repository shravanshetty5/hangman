const wordContainer = document.getElementById('word');
const hintContainer = document.getElementById('hint');
const wrongLettersContainer = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popUp = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMsg = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');

let selectedWord,
  correctLetters,
  wrongLetters,
  hintText = 'Hint: Dictonary did not have a hint. Sorry';
//display word

function displayWord() {
  wordContainer.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) =>
          `<span class="letter">${
            correctLetters.includes(letter) ? letter : ''
          }</span>`
      )
      .join('')}`;

  const innerWord = wordContainer.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    finalMsg.innerText = 'Congratulations! You won!!';
    popUp.style.display = 'flex';
  }
}

function displayWrongWords() {
  wrongLettersContainer.innerHTML = `
    ${wrongLetters.length ? `<p>Wrong</p>` : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;
}

function updateHangman() {
  const errors = wrongLetters.length;
  if (errors === figureParts.length) {
    finalMsg.innerText = `
    Opps, you lost. The word was
         "${selectedWord}"
    Try again`;
    popUp.style.display = 'flex';
  }
  figureParts.forEach((part, index) => {
    if (index < errors) {
      part.classList.add('display');
    } else {
      part.classList.remove('display');
    }
  });
}

function initializeGame() {
  //get random word, reset data
  fetch('https://random-word-api.herokuapp.com/word?number=1')
    .then((resp) => resp.json())
    .then((resp) => {
      selectedWord = resp[0];
      correctLetters = [];
      wrongLetters = [];
      //reset wrong words
      displayWrongWords();
      //displaySelectedWord
      displayWord();
      //updateHangmaan
      updateHangman();
      //clearHint
      //getDefinition for hint
      getDefinition(selectedWord);
    });
}

function getDefinition(word) {
  fetch(
    `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${word}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
        'x-rapidapi-key': 'f86afcb4f7mshc0893fcc0f5c1bap172d51jsnb8100c146d08',
      },
    }
  )
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp && resp.list[0] && resp.list[0].definition) {
        console.log('passes');
        hintText = 'Hint: ' + resp.list[0].definition;
      }
    });
}

function displayNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

function displayHint() {
  //display hint on last try
  if (wrongLetters.length === figureParts.length - 1) {
    hintContainer.innerText = `${hintText}`;
  } else {
    hintContainer.innerText = '';
  }
}

initializeGame();

//add event listner to listen to keydown events
window.addEventListener('keydown', (e) => {
  if (
    e.keyCode >= 65 &&
    e.keyCode <= 90 &&
    wrongLetters.length < figureParts.length
  ) {
    if (selectedWord.includes(e.key)) {
      if (correctLetters.includes(e.key)) {
        displayNotification();
      } else {
        correctLetters.push(e.key);
        displayWord();
      }
    } else {
      if (wrongLetters.includes(e.key)) {
        displayNotification();
      } else {
        wrongLetters.push(e.key);
        //display wrong words
        displayWrongWords();

        //displayHint
        displayHint();
        //update hangman
        updateHangman();
      }
    }
  }
});

playAgainBtn.addEventListener('click', () => {
  //initialize game
  initializeGame();
  //remove the popup
  popUp.style.display = 'none';
});
