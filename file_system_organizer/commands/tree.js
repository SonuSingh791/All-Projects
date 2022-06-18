const fs = require("fs");
const path = require("path");
function treeFn(dirPath) {
    console.log("tree command implemented for ",dirPath);
    if(dirPath==undefined){
        console.log("Please Enter Path");
        return;
    }
    else{
        let doesPathExist=fs.existsSync(dirPath);
        if(doesPathExist){
            treeFnUtil(dirPath,"");
        }
        else{
            console.log("please enter valid path");
        }
    }
}
function treeFnUtil(dirPath,indent){
    
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent+"|--"+fileName);
    }
    else{
        let dirName=path.basename(dirPath);
        console.log(indent+"»»»");
        let children=fs.readdirSync(dirPath);
        for(let i=0;i<children.length;i++){
            let childPath=path.join(dirPath,children[i]);
            treeFnUtil(childPath,indent+"\t");
        }
    }
}
module.exports={
    treeKey:treeFn
}