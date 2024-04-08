const gamePlace = document.querySelector(".game");
const timeOutTime = 700;
const winTexts = ["Поздравляем, вы выиграли бутерброд"];
const minCards = 2;
const defaultCards = 12;
const maxCards = 44;
let isEnd = false;

let numberOfCards;

let cards = [];

let victories = localStorage.getItem("victories") || 0;
document.querySelector(".panel-victories").innerHTML = victories;

let moves = 0;
let movesPlace = document.querySelector(".panel-moves");
movesPlace.innerHTML = moves;

const cardSet = [
  {
    name: "cardIconsSet1",
    amount: 202,
    fileType: "svg",
  },
];

const selectedSet = cardSet[Math.floor(Math.random() * cardSet.length)];

//
openModal(`Количество карт (четное число ${minCards}-${maxCards}):`, true);
//

function startGame() {
  //Создание колоды
  createDeck();

  // Создание игрового поля
  cards.forEach((card) => {
    gamePlace.innerHTML += `
    <div class="card">
      <div class="flip-card">
        <div class="front"></div>
        <div class="back" style="${card.style}"></div>
      </div> 
    </div>`;
  });

  setStyle();

  // Расстановка слушателей на игровое поле
  window.cardsElements = gamePlace.querySelectorAll(".card");
  cardsElements.forEach((element) => {
    element.addEventListener("click", ohTwoCards);

    // element.addEventListener("click", gameLogic);
  });
}

function getRandHex() {
  const HexColor = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  let hex = "#";
  for (i = 0; i < 6; i++) {
    hex += HexColor[Math.floor(Math.random() * HexColor.length)];
  }
  return hex;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function ohTwoCards(e) {
  if (e.target.parentNode.classList.contains("flip-card")) {
    e.target.parentNode.classList.add("card-flipped");
  } else {
    document.querySelectorAll(".card-flipped").forEach((element) => {
      element.classList.remove("card-flipped");
    });
    return;
  }

  // Проверка на наличие двух открытых карт
  if (
    gamePlace.querySelectorAll(".card-flipped:not(.resolved)").length > 1 &&
    gamePlace.querySelectorAll(".card-flipped:not(.resolved)").length < 3
  ) {
    let twoCards = document.querySelectorAll(".card-flipped:not(.resolved)");
    // Одинковые ли карты
    if (
      twoCards[0].querySelector(".back").style.background ===
      twoCards[1].querySelector(".back").style.background
    ) {
      twoCards.forEach((winCard) => {
        winCard.classList.add("resolved");
      });
    } else {
      addMoves();
    }

    // Проверка на выигрыш
    if (gamePlace.querySelectorAll(".resolved").length === cards.length) {
      setTimeout(() => {
        openModal(
          `${
            winTexts[Math.floor(Math.random() * winTexts.length)]
          } <div class="win-moves-text">Неправильных ходов: ${moves}</div>`
        );
        isEnd = true;
      }, timeOutTime);
    }

    // Конец действия
    setTimeout(() => {
      gamePlace.querySelectorAll(".card-flipped").forEach((element) => {
        if (!element.classList.contains("resolved")) {
          element.classList.remove("card-flipped");
        }
        // Возврат слушателей и курсора *отключено*
        cardsElements.forEach((element) => {
          element.addEventListener("click", ohTwoCards);
          element.classList.remove("card-nonclicable");
        });
      });
    }, timeOutTime);

    // Удаление слушателя на время и изменение курсора *отключено*
    cardsElements.forEach((element) => {
      element.removeEventListener("click", ohTwoCards);
      element.classList.add("card-nonclicable");
    });
  }
}

function createDeck() {
  for (let index = 0; index < NumberOfUnicueCards; index++) {
    cards.push({
      style: `background: ${getRandHex()} url(images/icons/${
        selectedSet.name
      }/cardIcon${Math.floor(Math.random() * (selectedSet.amount - 1) + 1)}.${
        selectedSet.fileType
      }) no-repeat center / 35%`,
    });
  }

  // Дублирование карт
  cards.forEach((card) => {
    cards.push(card);
  });
  // Перемешивание карт
  shuffle(cards);
}

function setStyle() {
  // Изменение flex для карт
  if (numberOfCards <= 8) {
    document.querySelectorAll(".card").forEach((element) => {
      element.classList.add("cardFlexBefore8");
    });
  } else if (numberOfCards <= 15) {
    document.querySelectorAll(".card").forEach((element) => {
      element.classList.add("cardFlexBefore15");
    });
  } else if (numberOfCards <= maxCards) {
    document.querySelectorAll(".card").forEach((element) => {
      element.classList.add("cardFlexBefore44");
    });
  }
}

function addMoves() {
  ++moves;
  movesPlace.innerHTML = moves;
}

// Модальное окно
function openModal(content, needInputRange = false) {
  document.querySelector(".content-text").innerHTML = content;
  switch (needInputRange) {
    case true:
      document.querySelector(
        ".modal-content"
      ).innerHTML += `<div class="modal-input-cont">
          <input min="${minCards}" max="${maxCards}" value="${defaultCards}" type="range" step="2" class="modal-range-input"/>
        </div>`;
      document.querySelector(
        ".modal-buttons"
      ).innerHTML += `<input type="number" min="${minCards}" max="${maxCards}" value="${defaultCards}" required class="modal-number-input">`;
      linkInputs();
      break;

    case false:
      document.querySelector(".modal-input-cont").remove();
      break;
  }
  document.querySelector(".modal-wrapper").classList.add("modal-open");
}
document.querySelector(".modal-ok-btn").addEventListener("click", () => {
  numberOfCards = Number(document.querySelector(".modal-number-input").value);
  if (
    !isNaN(numberOfCards) &&
    numberOfCards >= minCards &&
    numberOfCards <= maxCards
  ) {
    document.querySelector(".modal-wrapper").classList.remove("modal-open");
    window.NumberOfUnicueCards = numberOfCards / 2;
    document.querySelector(".modal-number-input").readOnly = true;
    startGame();
  }

  if (isEnd) {
    localStorage.setItem("victories", ++victories);
    location.reload();
  }
});

function linkInputs() {
  const rangeInput = document.querySelector(".modal-range-input");
  const numberInput = document.querySelector(".modal-number-input");

  rangeInput.addEventListener("input", (e) => {
    numberInput.value = e.target.value;
  });
  numberInput.addEventListener("input", (e) => {
    rangeInput.value = e.target.value;
  });
}

// function gameLogic(e) {
//   if (
//     e.target.classList.contains("front") &&
//     !e.target.classList.contains("resolved")
//   ) {
//     e.target.parentNode.classList.add("card-flipped");
//   }

//   const pickedCards = document.querySelectorAll(".card-flipped");
//   // pickedCards.forEach(element => {
//   //   if(element.classList.contains('resolved')) {

//   //   }
//   // });
//   // if ( document.querySelectorAll(".card-flipped").length > 2)
// }
