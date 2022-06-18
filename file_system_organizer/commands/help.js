function helpFn() {
    console.log(`List of all command:
                        node main.js tree "directoryPath"
                        node main.js organize "directoryPath"
                        node main.js help
    `);
}
module.exports={
    helpKey:helpFn
}