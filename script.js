const gamePlace = document.querySelector(".game");
const timeOutTime = 700;
const winTexts = [
  "Ар ю крэйзи?))",
  "Ура, победа",
  "поздравляем, вы выиграли бутерброд",
  "если вы это читаете напишите мне в тг",
  "еще одна победа, и сюда прилетят пришельцы",
];

let cards = [
  {
    color: `${getRandHex()}`,
  },
  {
    color: `${getRandHex()}`,
  },
  {
    color: `${getRandHex()}`,
  },
  {
    color: `${getRandHex()}`,
  },
  {
    color: `${getRandHex()}`,
  },
  {
    color: `${getRandHex()}`,
  },
];

//
startGame();
//

function startGame() {
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
        <div class="back" style="background: ${card.color}"></div>
      </div> 
    </div>`;
  });

  // Расстановка слушателей на игровое поле
  window.cardsElements = gamePlace.querySelectorAll(".card");
  cardsElements.forEach((element) => {
    element.addEventListener("click", ohTwoCards);
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
  e.target.offsetParent.classList.toggle("card-flipped");

  // Проверка на наличие двух открытых карт
  if (gamePlace.querySelectorAll(".card-flipped").length === 2) {
    console.log("Открыты две карты");
    const twoCards = document.querySelectorAll(".card-flipped");

    // Одинковые ли карты
    if (
      twoCards[0].querySelector(".back").style.background ===
      twoCards[1].querySelector(".back").style.background
    ) {
      twoCards.forEach((winCard) => {
        winCard.classList.add("resolved");
        console.log(winCard);
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
        element.classList.remove("card-flipped");

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
