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
});

const executeQuery = async (sql) => {
  try {
    const stmt = await connection.execute({
      sqlText: sql,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Error executing query:', err.message);
          return;
        }
        queryIDs.push(stmt.getQueryId());
        console.log('Query executed successfully:', rows);
      }
    });
  } catch (err) {
    console.error('Error executing query:', err.message);
  }
};

queryList.forEach((query) => {
  executeQuery(query);
});


let count = 0;

async function printHello (){
  try {
    if (count < 4) {

      // Se verifica que exista al menos un queryID
      if (queryIDs.length > 0) {
        console.log('Intentando obtener estado de la primera query...');

        let a = await connection.getQueryStatus(queryIDs[0], (err, status) => {
          if (err) {
            console.error('Error obteniendo estado de la query:', err.message);
          } else {
            console.log("AAAAAA")
            console.log('Estado de la primera query:', status)
            return status;
          }
        });
        console.log(a)
      } else {
        console.log('No hay query IDs disponibles');
      }

      count++;
      setTimeout(printHello, 3000); // Llamada recursiva cada 3 segundos
    }
  } catch (err) {
    console.error('Error:', err.message);
    count++; // Incrementar el contador para continuar con la siguiente iteración
    setTimeout(printHello, 3000); // Llamada recursiva cada 3 segundos
  }
};

printHello(); // Iniciar la primera ejecución