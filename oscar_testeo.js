const snowFlakeClient = require('snowflake-sdk');

//Create snowflake connection

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
      'SELECT SYSTEM$WAIT(120)',
      'SELECT * FROM testeo WHERE ID=3'
    ];


    //console.log("AAA:", conn.getQueryStatus('01b0f5bb-0303-33c5-0000-000210daf025'));
    conn.execute({
        sqlText: 'SELECT * FROM testeo WHERE ID=2',
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
const a = connection.getQueryStatus('01b0f5bb-0303-33c5-0000-000210daf025')
console.log(a)
    //setTimeout(() => {
      // Verificar el estado de la consulta
    //  console.log('Estado de la consulta:', stmt.getStatus());
    //  }, 20000)
    //console.log("AAAA:", a)
//console.log("This is the message")