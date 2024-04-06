const gamePlace = document.querySelector(".game");
const timeOutTime = 700;
const winTexts = [
  "Ура, победа",
  "поздравляем, вы выиграли бутерброд (но вы его не получите, потому что разработчик в край обеднел с подобными призовыми...)",
  "если вы это читаете напишите мне в тг",
  "еще одна победа, и сюда прилетят пришельцы",
  "меня не выпускают из подвала, помогите...",
  "какой акваланг посоветуете?",
  "сколько в ломбарде дадут за UGM-133A Trident II (D5) — самую точную межконтинентальную баллистическую ракету?",
  "эх, щас бы тунца с овощами...",
  "поехали в Бикини Боттомскую область?",
  "сквидвард кларнет пропил...",
];

let numberOfCards = 12;
let NumberOfUnicueCards = numberOfCards / 2;

let cards = [];

//
startGame();
//

function startGame() {
  //Создание колоды
  createDeck();

  // Дублирование карт
  cards.forEach((card) => {
    cards.push(card);
  });
  // Перемешивание карт
  shuffle(cards);

  // Создание игрового поля
  cards.forEach((card) => {
    gamePlace.innerHTML += `
    <div class="card">
      <div class="flip-card">
        <div class="front"></div>
        <div class="back" style="background: ${card.image}"></div>
      </div> 
    </div>`;
  });

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
    }

    // Проверка на выигрыш
    if (gamePlace.querySelectorAll(".resolved").length === cards.length) {
      setTimeout(() => {
        alert(winTexts[Math.floor(Math.random() * winTexts.length)]);
        location.reload();
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
      image: `${getRandHex()}`,
    });
  }
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
