require('dotenv').config({ path: `./configuration/${process.env.environment}.env` });

function getSnowflakeConfig() {
    return {
        account: process.env.snowflake_account,
        username: process.env.snowflake_username,
        password: process.env.snowflake_password,
        database: process.env.snowflake_database,
        schema: process.env.snowflake_schema,
        warehouse: process.env.snowflake_warehouse
    };
}

exports.getSnowflakeConfig = getSnowflakeConfig;