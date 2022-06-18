const fs = require("fs");
const path = require("path");
function organizerFn(dirPath) {
    console.log("organizer command implemented for",dirPath);
    // 1.input-> directory path
    let destPath;
    if(dirPath==undefined){
        console.log("please enter path");
        return;
    }
    else{
        let doesPathExist = fs.existsSync(dirPath);
        if(doesPathExist){
            // 2.create->organized_files->directory
            destPath = path.join(dirPath,"organized_files");
            // console.log(destPath);
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);
            }
        }
        else{
                console.log("please enter the correct path");
            return;
        }
    }
    organizeUtil(dirPath,destPath);
    // 5.
}
function organizeUtil(src,dest){
    // 3.identify category of all files present in given directory
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for(let i =0;i<childNames.length;i++){
        let chilAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(chilAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            // console.log(childNames[i],"belongs to --> ",category);
            // 4.copy/cut files from given directory and paste it inside organized directory of same category directory
            sendFiles(chilAddress,dest,category);
        }
    }
}
function sendFiles(srcFilePath,dest,category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    console.log(fileName,"copied to ",category);
}
function getCategory(names){
    let ext = path.extname(names);
    ext = ext.slice(1);
    // console.log(ext);
    for(let type in types){
        let catTypeArr = types[type];
        for(let i=0;i<catTypeArr.length;i++){
            if(ext == catTypeArr[i]){
                return type;
            }
        }
    }
    return "others";
}
module.exports = {
    organizedKey:organizerFn
}