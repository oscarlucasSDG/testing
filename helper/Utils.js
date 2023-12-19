const got = require('got');
const { HttpsProxyAgent } = require('hpagent');

/**
 * This method is used to config an HttpsProxyAgent in a got call
 * @param {JSON} context
 * @return {HttpsProxyAgent}
 */
function getProxy(context) {
    let proxyUri = process.env.https_proxy;
    let isHttpsProtocol = true;

    if (!proxyUri) {
        isHttpsProtocol = false;
        proxyUri = process.env.WEBSITE_HOSTNAME;
    }

    const hpAgent = (isHttpsProtocol ? {
        https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: proxyUri
        })
    } : {
        http: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: proxyUri
        })
    });

    if (process.env.debug_mode && process.env.debug_mode === 'true') {
        context.log.warn(`=> HttpProxyAgent configuration:\n${JSON.stringify(hpAgent, null, 4)}`);
    }

    return hpAgent;
}

function setStructureRestProxy(context, accessToken, requestBody = null, additionalHeaders = null) {

    let headers = {};
    const contentType = "application/json";
    if (accessToken) {
        headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + accessToken
        };
    } else {
        headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': contentType
        };
    }

    if (additionalHeaders !== null) {
        headers = {...additionalHeaders, ...headers};
    }

    let body = {
        agent: getProxy(context),
        headers: headers,
        https: {
            rejectUnauthorized: (process.env.environment !== 'local') ? true : false
        },
        responseType: 'json'
    };

    if (requestBody) {
        body.json = requestBody;
    }

    return body;

}

function setStructureRest(accessToken, requestBody = null, additionalHeaders = null) {

    let headers = {};
    const contentType = "application/json";
    if (accessToken) {
        headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + accessToken
        };
    } else {
        headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': contentType
        };
    }

    if (additionalHeaders !== null) {
        headers = {...additionalHeaders, ...headers};
    }

    let body = {
        headers: headers,
        https: {
            rejectUnauthorized: (process.env.environment !== 'local') ? true : false
        },
        responseType: 'json'
    }

    if (requestBody) {
        body.json = requestBody;
    }

    return body;

}
/**
 * This method is used to call a function that will be inside our tenant
 * of Azure without a proxy
 * @param {JSON} context
 * @param {String} urlNextFunction
 * @param {String} accessToken
 * @param {JSON} headers
 * @return {JSON}
 */
async function getCallFunctionNoProxy(context, urlNextFunction, accessToken = null, headers = null) {
    console.time(`=> Completed call to function ${urlNextFunction} in`);
    let response = {
        body: `Unhandled error at FunctionCall Helper trying to launch ${urlNextFunction}`,
        statusCode: 500
    };

    if ((process.env.debug_mode && process.env.debug_mode === 'true')) {
        context.log.warn(`=> Generated url: ${urlNextFunction}`);
    }

    try {
        const { body, statusCode } = await got.get(urlNextFunction, setStructureRest(accessToken, null, headers));

        if (statusCode !== "200") {
            context.log.warn(`=> Status of sent: ${statusCode}`);
        }

        context.log.warn(`Received response from ${urlNextFunction}: ${JSON.stringify(body, null, 4)}`);
        response.statusCode = statusCode;
        response.body = body;
    } catch (error) {
        context.log.error(`=> Error calling to function: ${urlNextFunction}\n${error}`);
        response.statusCode = (error.response !== undefined) ? error.response.statusCode : 404;
        response.body = error.message;
        if (error.response && error.response.body) {
            response.body += `. ${error.response.body}`;
        }
    }

    console.timeEnd(`=> Completed call to function ${urlNextFunction} in`);
    return response;
}

/**
 * This method is used to call a function that will be inside our tenant
 * of Azure without a proxy
 *
 * @param {JSON} context
 * @param {JSON} requestBody
 * @param {String} urlNextFunction
 * @param {String} accessToken
 * @param {JSON} headers
 * @return {JSON}
 */
async function postCallNextFunctionNoProxy(context, requestBody, urlNextFunction, accessToken = null, headers = null) {
    console.time(`=> Completed call to function ${urlNextFunction} in`);
    let response = {
        body: `Unhandled error at FunctionCall Helper trying to launch ${urlNextFunction}`,
        statusCode: 500
    };

    if ((process.env.debug_mode && process.env.debug_mode === 'true')) {
        context.log.warn(`=> Generated url: ${urlNextFunction}`);
    }

    try {
        const { body, statusCode } = await got.post(urlNextFunction, setStructureRest(accessToken, requestBody, headers));

        if (statusCode !== 200) {
            context.log.warn(`=> Status of sent: ${statusCode}`);
        }

        context.log.warn(`Received response from ${urlNextFunction}: ${JSON.stringify(body, null, 4)}`);
        response.statusCode = statusCode;
        response.body = body;
    } catch (error) {
        response.statusCode = (error.response !== undefined) ? error.response.statusCode : 404;
        response.body = error.message;
        if (error.response && error.response.body) {
            response.body += `. ${JSON.stringify(error.response.body)}`;
        }
        context.log.error(`=> Error calling to function: ${urlNextFunction} - ${response.body}`);
        return response;
    }

    console.timeEnd(`=> Completed call to function ${urlNextFunction} in`);
    return response;
}

/**
 * This method is used to call a function that will be inside our tenant
 * of Azure without a proxy
 * @param {JSON} context
 * @param {String} urlNextFunction
 * @param {String} accessToken
 * @param {JSON} headers
 * @return {JSON}
 */
async function getCallFunction(context, urlNextFunction, accessToken = null, headers = null) {
    console.time(`=> Completed call to function ${urlNextFunction} in`);
    let response = {
        body: `Unhandled error at FunctionCall Helper trying to launch ${urlNextFunction}`,
        statusCode: 500
    };

    if ((process.env.debug_mode && process.env.debug_mode === 'true')) {
        context.log.warn(`=> Generated url: ${urlNextFunction}`);
    }

    try {
        const { body, statusCode } = await got.get(urlNextFunction, setStructureRest(context, accessToken, null, headers));

        if (statusCode !== "200") {
            context.log.warn(`=> Status of sent: ${statusCode}`);
        }

        context.log.warn(`Received response from ${urlNextFunction}: ${JSON.stringify(body, null, 4)}`);
        response.statusCode = statusCode;
        response.body = body;
    } catch (error) {
        context.log.error(`=> Error calling to function: ${urlNextFunction}\n${error}`);
        response.statusCode = (error.response !== undefined) ? error.response.statusCode : 404;
        response.body = error.message;
        if (error.response && error.response.body) {
            response.body += `. ${error.response.body}`;
        }
    }

    console.timeEnd(`=> Completed call to function ${urlNextFunction} in`);
    return response;
};

/**
 * This method is used to call a function that will be outside our tenant
 * of Azure through a proxy
 *
 * @param {JSON} context
 * @param {JSON} requestBody
 * @param {String} urlNextFunction
 * @param {String} accessToken
 * @param {JSON} headers
 * @return {JSON}
 */
async function postCallNextFunction(context, requestBody, urlNextFunction, accessToken = null, headers = null) {
    console.time(`=> Completed call to function ${urlNextFunction} in`);
    let response = {
        body: `Unhandled error at FunctionCall Helper trying to launch ${urlNextFunction}`,
        statusCode: 500
    };

    if ((process.env.debug_mode && process.env.debug_mode === 'true')) {
        context.log.warn(`=> Generated url: ${urlNextFunction}`);
    }

    try {
        const { body, statusCode } = await got.post(urlNextFunction, setStructureRestProxy(context, accessToken, requestBody, headers));

        if (statusCode !== "200") {
            context.log.warn(`=> Status of sent: ${statusCode}`);
        }

        context.log.warn(`Received response from ${urlNextFunction}: ${JSON.stringify(body, null, 4)}`);
        response.statusCode = statusCode;
        response.body = body;
    } catch (error) {
        context.log.error(`=> Error calling to function: ${urlNextFunction}\n${error}`);
        response.statusCode = (error.response !== undefined) ? error.response.statusCode : 404;
        response.body = error.message;
        if (error.response && error.response.body) {
            response.body += `. ${error.response.body}`;
        }
    }

    console.timeEnd(`=> Completed call to function ${urlNextFunction} in`);
    return response;
}



 module.exports = {
    setStructureRest,
        getCallFunctionNoProxy,
        postCallNextFunctionNoProxy,
        getCallFunction,
        postCallNextFunction
};