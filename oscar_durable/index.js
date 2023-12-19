const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    // Llamar a la actividad para imprimir "Hello World"
    yield context.df.callActivity("ImprimirHelloWorld");

    // Llamar a otro orquestador (Durable Function)
    const otraFuncionResult = yield context.df.callSubOrchestrator("NombreDeOtraDurableFunction");

    return otraFuncionResult;
});
