const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    // Llamar a la actividad para imprimir "Hello World"
    yield context.df.callActivity("o_act-printHello");

    return otraFuncionResult;
});
