const df = require("durable-functions");
require("dotenv").config({ path: `./configuration/${process.env.environment}.env` });

module.exports = async function (context, req) {
    let input = req.body;
    const client = df.getClient(context);
    const instanceId = await client.startNew(req.params.functionName, undefined, input);
    context.log.warn(`Started orchestration with ID = '${instanceId}'.`);

    const response = client.createCheckStatusResponse(context.bindingData.req, instanceId);
    return {
        body: { response_durable_start: response.body },
        statusCode: response.status
    };
};