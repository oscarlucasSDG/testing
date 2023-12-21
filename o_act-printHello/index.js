const df = require("durable-functions");

module.exports = async function (context) {
    console.log("Hello World");
    return "Mensaje impreso";
};
