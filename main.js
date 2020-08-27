const wordContainer = document.getElementById('word');
const wrongLettersContainer = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popUp = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMsg = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');

let selectedWord, correctLetters, wrongLetters;
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
  console.log(innerWord);
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
    finalMsg.innerText = 'Opps, you lost. Try again';
    popUp.style.display = 'flex';
  }
  figureParts.forEach((part, index) => {
    console.log('updating');
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
    });
}

function displayNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

initializeGame();

//add event listner to listen to keydown events

window.addEventListener('keydown', (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
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
