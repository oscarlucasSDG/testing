const ConfigUtil = require('./helper/Config');
const snowFlakeClient = require('snowflake-sdk');

//Create snowflake connection
//const snowflakeConfig = ConfigUtil.getSnowflakeConfig();
//const { account, username, password, database, schema, warehouse } = snowflakeConfig;
//console.log(account, username, password, database, schema, warehouse)
const connection = snowFlakeClient.createConnection({
    account: 'II85362.west-europe.azure',
    username: 'OSCARLUCAS',
    password: 'Salve120913',
    database: 'TETEO',
    schema: 'PUBLIC',
    warehouse: 'TESTING'
});

  connection.connect((err, conn) => {
    if (err) {
      console.error('Error connecting to Snowflake:', err.message);
      return;
    }
    const sqlQueries = [
      'SELECT * FROM testeo WHERE ID=1',
      'SELECT * FROM testeo WHERE ID=2',
      'SELECT * FROM testeo WHERE ID=3'
    ];

    conn.execute({
        sqlText: 'SELECT SYSTEM$WAIT(120)',
        complete: (err, stmt, rows) => {
          if (err) {
            console.error('Error executing query:', err.message);
            console.log('Estado de la consulta:', stmt.getStatus());
            return;
                }
          else {
            console.log('Successfully connected to Snowflake.');
            console.log('Query results:', rows);
            console.log('Estado de la consulta:', stmt.getStatus())
            // Agregar un retraso de 5 segundos (5000 milisegundos) antes de verificar el estado
            setTimeout(() => {
            // Verificar el estado de la consulta
            console.log('Estado de la consulta:', stmt.getStatus());
            }, 5000); // Esperar 5 segundos antes de verificar el estado
                }
        }
      });
      //conn.getQueryStatus('01b0f04d-0303-3125-0000-000210da21d9')
    });

console.log("This is the message")