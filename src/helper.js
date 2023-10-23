const fs = require("fs");

// Read the file into memory.
const data = fs.readFileSync("src/words.json", "utf8");

// Split the file into an array of words.
const jsondata = JSON.parse(data);
const words = jsondata.words;
// const arr = words.filter((word) => word.trim() !== "");
// arr.splice(-11000);
//console.log(typeof filteredWordsArray[0]);
// Check if the word you are looking for is in the array.
export { words };

// console.log(checkForWordOccurrence("word.txt", "lover"));
