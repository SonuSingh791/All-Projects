#!/usr/bin/env node
let inputArr = process.argv.slice(2);
const fs = require("fs");
const path = require("path");
const treeObj=require("./commands/tree");
const organizeObj=require("./commands/organize");
const helpObj=require("./commands/help")
// const { types } = require("util");
let types = {
    media: ["mp4", "mkv","jpg","jpeg","png"],
    archives: ["zip", "7z", "rar", "gz", "ar", "iso", "xz"],
    documents: [
      "docx",
      "doc",
      "pdf",
      "xlsx",
      "xls",
      "odt",
      "ods",
      "odp",
      "odg",
      "ods",
      "txt",
      "ps",
      "ppt"
    ],
    apps: ["exe", "dmg", "pkg", "deb"],
  };
let command = inputArr[0];
switch(command){
    case "tree":
        treeObj.treeKey(inputArr[1]);
        break;
    case "organize":
        organizeObj.organizedKey(inputArr[1]);
        break;
    case "help":
        helpObj.helpKey();
        break;
    default:
        console.log("Please enter valid command.");
}





