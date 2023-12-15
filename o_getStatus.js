//Import packages
const snowflake = require('snowflake-sdk');


//Queries to execute
const queryList = [
  'SELECT SYSTEM$WAIT(10)',
  'SELECT * FROM testeo WHERE ID=1',
  'SELECT * FROM testeo WHERE ID=2'
];
const queryIDs = ['01b1011c-0303-38a6-0002-10da0001a01a'];


//Snowflake connection definition
const connection = snowflake.createConnection({
  account: 'II85362.west-europe.azure',
  username: 'OSCARLUCAS',
  password: 'Salve120913',
  database: 'TETEO',
  schema: 'PUBLIC',
  warehouse: 'TESTING'
});


//Snowflake connection opening
connection.connect((err, conn) => {
  if (err) {
    console.error('Error connecting to Snowflake:', err.message);
    return;
  }
  console.log('Connected to Snowflake');
});


let count = 0;

async function printHello (){
  try {
    if (count < 4) {

      // Se verifica que exista al menos un queryID
      if (queryIDs.length > 0) {
        console.log('Intentando obtener estado de la primera query...');

        let a = await connection.getQueryStatus('01b1011c-0303-38a6-0002-10da0001a01a', (err, status) => {
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