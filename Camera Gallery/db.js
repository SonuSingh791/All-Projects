// open -> database
// Create objectStore
// make transactions

let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
    console.log("Success");
    db = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("upgradeneeded");
    db = openRequest.result;
    db.createObjectStore("video", {keyPath: "id"})
    db.createObjectStore("image", {keyPath: "id"})
})