import "./App.css";
import { socket } from "./socket";
import { Timer } from "./Timer.js"
import { useRef, useState, useEffect } from "react";

const words = require("./words.json");
let ranWord ;

function RowInput({ handleInnerComponentStateChange }) {
  const [values, setValues] = useState(new Array(5).fill(""));
  const refs = useRef(new Array(5).fill(null));
  let isWinner = false;
  //const [guesses, setGuesses] = useState(null);

  //THIS MOVES FOCUS TO FIRST REF EVERYTIME
  //TURN OFF WHEN DEVELOPING OTHERWISE
  //YOU WILL GO CRAZY
  //----------------------------------------
  useEffect(() => {
    refs.current[0].focus();
  }, []);

  function handleInputChange(event, index) {
    //const index = event.target.tabIndex;
    const value = event.target.value;

    values[index] = value;
    setValues([...values]);

    if (value.length === 1 && index !== 4) {
      refs.current[index + 1].focus();
    }
  }
  //greens work ok, yellows TODO
  function compareWords2(target, word) {
    const inTarget = {};
    const inGuess = {};
    const matched = {};
    const green = [];
    const greenCount = {};
    const yellow = [];

    word = word.toLowerCase();

    for (const c of target) {
      if (inTarget[c]) {
        inTarget[c]++;
      } else {
        inTarget[c] = 1;
      }
    }
    for (const c of word) {
      if (inGuess[c]) {
        inGuess[c]++;
      } else {
        inGuess[c] = 1;
      }
    }

    console.log(inGuess);
    console.log(inTarget);
    for (let i = 0; i < target.length; i++) {
      if (word[i] === target[i]) {
        green.push(i);
        greenCount[i] = word[i];
        inTarget[word[i]]--;
      }
      if (target.includes(word[i])) {
        yellow.push(i);
      }
    }

    for (const i in inTarget) {
      if (inTarget[i] === 0) {
        break;
      }
    }

    return [green, matched, yellow];
  }

  function handleDelete(event, index) {
    //const index = event.target.tabIndex;
    if (event.key === "Enter") {
      //const socket = io("https://n2l443-3000.csb.app/");
      //socket.emit("codeGame", "howdy")
      

      let word = values.join("");
      if (word.length < 5) {
        alert("Minimun 5 letter words");
      } else {
        //const [matched, greenIndex] = compareWords(dict[1], word);
        // const [green, matches, yellow] = compareWords2(dict[1], word);
        if (words.words.includes(word.toLowerCase())) {
          //SET THE YELLOWS
          const [green, matches, yellow] = compareWords2(ranWord, word);
          console.log("random word: " + ranWord);
          console.log(words.words.includes(word.toLowerCase()));
          // console.log(words.words.includes(word));

          //SET THE YELLOWS
          for (const match in yellow) {
            refs.current[yellow[match]].style.backgroundColor = "#B59F3B";
          }

          //SET THE GREENS
          for (const match in green) {
            refs.current[green[match]].style.backgroundColor = "#538D4E";
          }
          if (green.length === 5) {
            isWinner = true;
          }
          //refs.current[0].style.backgroundColor = "yellow";
          handleInnerComponentStateChange(word, isWinner);
          // if (event.target.value.length === 1 && index !== 4) {
          //refs.current[0].focus();
          // }
          console.log("matched: " + matches);
          console.log("yellow:" + yellow);
          console.log("green: " + green);
          console.log("refs: " + refs.current.length);
        }
        // console.log(dict);
      }
    }

    if (index === 0) {
      return;
    }
    if (event.key === "Backspace" && values[index] === "") {
      values[index - 1] = "";
      setValues([...values]);

      refs.current[index - 1].focus();
    }
  }

  return (
    <div>
      {values.map((value, index) => (
        <input
          key={index}
          ref={(element) => (refs.current[index] = element)}
          type="text"
          className="custom-input"
          maxLength={1}
          value={value}
          onChange={(event) => handleInputChange(event, index)}
          onKeyDown={(event) => handleDelete(event, index)}
        />
      ))}
    </div>
  );
}

function GameCreation(){
  const [gameCode, setGameCode] = useState(null);

  const randomCodeGenerator = () => {
    function generateRandomCode(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let code = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
      }
    
      return code;
    }
    const newgc = generateRandomCode(4);
    setGameCode(newgc)
    socket.emit("gameCode", newgc);
  }

  const sendGameCode = (event) => {
    if(event.key === "Enter"){
    socket.emit("gameCodeIncoming", event.target.value)
    }
  }
  
  return(
    
  <div>
    
    <button onClick={randomCodeGenerator}>Create Game</button>
    <h1>{gameCode}</h1>
    <div>
      <input type="text" onKeyDown={(event) => sendGameCode(event)} placeholder="Enter game code"/>
    </div>
  
  </div>
  )
}

export default function App() {
  const [guesses, setGuesses] = useState(new Array(5).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [loser, setLoser] = useState(false);
  let [randomWord, setRandomWord] = useState(null);

  useEffect(() => {
    document.title = "Wordle MP";
  }, []);
  
  socket.on("randomWord", (msg) => {
    setRandomWord(msg);
    ranWord = msg;
  });

  socket.on("gameStarting", (msg) => {
    setGameStart(true);
    console.log("HEREWEGO " + msg)
  })

  //this is what happens when you lose
  socket.on("isWinner", (msg) => {
    setGameStart(false);
    setLoser(true);
    console.log(msg)
  })

  const handleInnerComponentStateChange = (word, isWinner) => {
    if (isWinner) {
      setGameStart(false)
      socket.emit("isWinner", "Winner"+socket.id);
      alert("Winner");
      return;
    }
    const tmp = [...guesses];
    tmp[currentIndex] = word;
    setCurrentIndex(currentIndex + 1);
    setGuesses(tmp);

    console.log("guesses: " + guesses);
  };

  //const handleWinner = (newState) =>

  return (
    <div className="App">
      <GameCreation></GameCreation>
      {gameStart && <Timer></Timer>}
      {loser && <h1>LOSER</h1>}
      {randomWord && (<RowInput
        handleInnerComponentStateChange={handleInnerComponentStateChange}
      />)}
      {guesses[0] && (
        <RowInput
          handleInnerComponentStateChange={handleInnerComponentStateChange}
        />
      )}
      {guesses[1] && (
        <RowInput
          handleInnerComponentStateChange={handleInnerComponentStateChange}
        />
      )}
      {guesses[2] && (
        <RowInput
          handleInnerComponentStateChange={handleInnerComponentStateChange}
        />
      )}
      {guesses[3] && (
        <RowInput
          handleInnerComponentStateChange={handleInnerComponentStateChange}
        />
      )}
      {guesses[4] && (
        <RowInput
          handleInnerComponentStateChange={handleInnerComponentStateChange}
        />
      )}
    </div>
  );
}
