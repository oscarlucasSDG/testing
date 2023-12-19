const snowflake = require('snowflake-sdk');


const connection = snowflake.createConnection({
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

  console.log('Connected to Snowflake');

  const sqlQuery = 'SELECT SYSTEM$WAIT(120)'; // Consulta que durará 120 segundos

  const statement = conn.execute({
    sqlText: sqlQuery,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
      console.log('Query executed successfully');
    }
  });

  
  //setTimeout(() => {
    //statement.cancel(); // Cancelar la consulta (si aún está en ejecución)

  // Cerrar la conexión y terminar el programa, independientemente del estado de la consulta
  conn.destroy((err) => {
    if (err) {
      console.error('Error closing connection:', err.message);
      return;
    }
    console.log('Connection closed due to timeout');
    process.exit(0); // Terminar el programa después de cerrar la conexión debido al tiempo transcurrido
  });
  //}, 5000); // 30 segundos en milisegundos
});
