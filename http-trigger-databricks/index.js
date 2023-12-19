const {postCallNextFunctionNoProxy} = require("../helper/Utils");

module.exports = async function (context, req) {
    context.log(`Starting http-trigger-databricks function. The received event is: ${JSON.stringify(req.body)}`);
    
    context.cloudEvent = req.body
    const app = context.cloudEvent.app

    //TODO Validaciones
    if (!('rrhh' === app)) {
        context.log.warn(`ERROR: App should be rrhh`);
        context.log.warn(`App: ${app}.`);
    }

    //TODO variables futuras
    

    // Sending configuration to new Extractor Process
    const response = await sendToConsumerProcess(context);
}

async function sendToConsumerProcess(context) {
    const urlExtractor = `https://${process.env.durable_function_domain}` +
        `/api/orchestrators/durable-functions-databricks`;
    context.log.info(`Routing to: ${urlExtractor}`);

    return postCallNextFunctionNoProxy(context, { cloudEvent: JSON.stringify(context.cloudEvent) }, urlExtractor);
}