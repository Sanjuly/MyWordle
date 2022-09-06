const keyboard = document.querySelector("#keyboard");
const grid = document.querySelector("#grid");
const keyboardLetters = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l" ],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "del"],
];


const listElements = [];
let myAnswer = []; //donde vamos almacenar todas las letras donde hagamos click
const secretWord = ["p", "l", "a", "t", "z", "i"];
let positions = [];
let attempts = 0;


const rows = [];
for (let row = 0; row < 5; row++) {
    const list = document.createElement("ul");
    list.classList.add("grid-row");

    for (let column = 0; column < 6; column++) {
    const listItem = document.createElement("li");
    listItem.classList.add("grid-item")
    listItem.id = `${row}-${column}`;
    list.appendChild(listItem);
    }
    rows.push(list);
    }
grid.append(...rows);

const fetchWord = () => {
    fetch("https://random-word-api.herokuapp.com/word?length=6")
        .then((response) => response.json())
        .then((data) => {
        secretWord = data[0].split("");
        });
    };

fetchWord();


keyboardLetters.map((letters) => {
    const list = document.createElement("ul");
    letters.map((letter) => {
        const listItem = document.createElement("li");
        switch (letter) { //recibeel valor que va estar comparando en cada caso
            case "enter":
                listItem.innerHTML =`
                <button onclick="checkWord()" id=${letter}>${letter}</button>
                `;
                break;
            case "del":
                listItem.innerHTML =`
                <button onclick="deleteWord()" id=${letter}>${letter}</button>
                `;
                break;
            default:
                listItem.innerHTML =`
                <button onclick="pressLetter()" id=${letter}>${letter}</button>
                `;
                break;
        }
    list.appendChild(listItem) //agrega de uno en uno
    });
    listElements.push(list);
});

//agrega varios al mismo tiempo
keyboard.append(...listElements);

const checkWord = () => {
    if (positions.every((positions) => positions === "green")) {
        alert("GANASTE!!!");
    }
    if (attempts === 5) {
        alert("YA NO TIENES INTENTOS😢")
        return;
    }
    if (myAnswer.length === 6) {
        attempts +=1; 
        for (let i = 0; i < 6; i++) {
        switch (true) {
            case myAnswer[i] === secretWord[i]:
                positions.push("green");
                break;
            case secretWord.includes(myAnswer[i]):
                positions.push("brown");
                break;
            default:
                positions.push("gray");
                break;
        }
    }
    positions.map((color, id) => {
        const item = document.getElementById(`${attempts - 1}-${id}`);
        item.classList.add(color);
    });
    myAnswer = [];//resetear
    positions = [];
} else {
    alert(`solo tiene ${myAnswer.length} caracteres`);
}
}



const deleteWord = () => {
    if (myAnswer.length === 0) {
        alert("NO TIENES NADA ESCRITO");
    }
    const item = document.getElementById(`${attempts}-${myAnswer.length -1}`);
    item.textContent = " ";
    myAnswer.pop();
};
//target es donde está nuestro elemento
const pressLetter = () => {
    const button = event.target;
        if (myAnswer.length < 6) {
        const currentItem = document.getElementById(
        `${attempts}-${myAnswer.length}`
        );
        currentItem.textContent = button.textContent;
        myAnswer.push(button.id);
    } else {
        alert("PALABRA COMPLETA");
    }
};
const reset = () => {
    event.target.disable = true;
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 6; column++) {
            const item = document.getElementById(`${row}-${column}`);
            item.textContent = "";
            item.classList.remove("green");
            item.classList.remove("brown");
            item.classList.remove("gray");
        } 
    }
    attempts = 0;
}

