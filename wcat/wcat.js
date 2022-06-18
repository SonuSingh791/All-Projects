#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const inputArr = process.argv.slice(2);
let optionsArr = [];
let filesArr = [];
for (let i = 0; i < inputArr.length; i++) {
  if (inputArr[i].charAt(0) == "-") {
    optionsArr.push(inputArr[i]);
  } else {
    filesArr.push(inputArr[i]);
  }
}
if(optionsArr.includes("-n") && optionsArr.includes("-b")){
    console.log("either enter -n or -b");
    return;
}
let content = "";
for (let i = 0; i < filesArr.length; i++) {
    if(fs.existsSync(filesArr[i])==false){
        console.log(`file ${filesArr[i]} doesn't exist`);
        return;
    }
  let bufferContent = fs.readFileSync(filesArr[i]);
  content += bufferContent + "\n";
}
let contnentArr = content.split("\n");
// console.log(contnentArr);
let isPresent = optionsArr.includes("-s");
if (isPresent) {
  for (let i = 1; i < contnentArr.length; i++) {
    if (contnentArr[i] == "" && contnentArr[i - 1] == "") {
      contnentArr[i] = null;
    } else if (contnentArr[i] == "" && contnentArr[i - 1] == null) {
      contnentArr[i] = null;
    }
  }
  let tempArr = [];
  for (let i = 0; i < contnentArr.length; i++) {
    if (contnentArr[i] != null) {
      tempArr.push(contnentArr[i]);
    }
  }
  contnentArr=tempArr;
}
let isNPresent=optionsArr.includes("-n");
if(isNPresent){
    for(let i=0;i<contnentArr.length;i++){
        contnentArr[i]=`${i+1} ${contnentArr[i]}`;
    }
}
let isBPresent=optionsArr.includes("-b");
let counter=0;
if(isBPresent){
    for(let i=0;i<contnentArr.length;i++){
        if(contnentArr[i]!=""){
            counter++;
            contnentArr[i]=`${counter} ${contnentArr[i]}`;
        }
    }
}

console.log(contnentArr.join("\n"));
