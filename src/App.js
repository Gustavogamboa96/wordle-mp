import "./styles.css";
import { words } from "./helper.js";
import { io } from "socket.io-client";
// import { dictionary } from "./dictionary.js";
import { useRef, useState, useEffect } from "react";
let dict = ["squat", "ladel", "spurt"];

function RowInput({ handleInnerComponentStateChange }) {
  const [values, setValues] = useState(new Array(5).fill(""));
  const refs = useRef(new Array(5).fill(null));
  let isWinner = false;
  //const [guesses, setGuesses] = useState(null);

  //THIS MOVES FOCUS TO FIRST REF EVERYTIME
  //TURN OFF WHEN DEVELOPING OTHERWISE
  //YOU WILL GO CRAZY
  //----------------------------------------
  // useEffect(() => {
  //   refs.current[0].focus();
  // }, []);

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
      const socket = io("https://n2l443-3000.csb.app/");

      socket.emit("message", "Howdy");

      let word = values.join("");
      if (word.length < 5) {
        alert("Minimun 5 letter words");
      } else {
        //const [matched, greenIndex] = compareWords(dict[1], word);
        const [green, matches, yellow] = compareWords2(dict[1], word);
        if (true) {
          //SET THE YELLOWS

          console.log(compareWords2(dict[1], word));
          console.log(words.includes(word.toLowerCase));

          //SET THE YELLOWS
          for (const match in yellow) {
            refs.current[yellow[match]].style.backgroundColor = "yellow";
          }

          //SET THE GREENS
          for (const match in green) {
            refs.current[green[match]].style.backgroundColor = "green";
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

export default function App() {
  const [isWinner, setWinner] = useState(false);
  const [guesses, setGuesses] = useState(new Array(5).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.title = "Wordle MP";
  }, []);

  const handleInnerComponentStateChange = (word, isWinner) => {
    if (isWinner) {
      alert("Winner");
      setWinner(true);
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
      <RowInput
        handleInnerComponentStateChange={handleInnerComponentStateChange}
      />
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
