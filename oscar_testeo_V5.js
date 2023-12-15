const snowflake = require('snowflake-sdk');

const queryList = [
  'SELECT SYSTEM$WAIT(30)',
  'SELECT * FROM testeo WHERE ID=1',
  'SELECT * FROM testeo WHERE ID=2'
];

const queryIDs = [];

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

  const sqlQuery = 'SELECT SYSTEM$WAIT(120)'; // Consulta que durará 30 segundos

  const statement = conn.execute({
    sqlText: sqlQuery,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
      console.log('Query executed successfully');
      conn.destroy((err) => {
        if (err) {
          console.error('Error closing connection:', err.message);
          return;
        }
        console.log('Connection closed');
        process.exit(0); // Terminar el programa después de cerrar la conexión
      });
    }
  });

  // Terminar la conexión y el programa después de 30 segundos, independientemente del estado de la consulta
  setTimeout(() => {
    //statement.cancel(); // Cancelar la consulta (si aún está en ejecución)
    conn.destroy((err) => {
      if (err) {
        console.error('Error closing connection:', err.message);
        return;
      }
      console.log('Connection closed due to timeout');
      process.exit(0); // Terminar el programa después de cerrar la conexión debido al tiempo transcurrido
    });
  }, 5000); // 30 segundos en milisegundos
});
