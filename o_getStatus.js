//Import packages
const snowflake = require('snowflake-sdk');


//Queries to execute
const queryIDs = ['01b11314-0303-3ba0-0002-10da0001e02e'];

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

// Query Status exctraction
let count = 0;

// This function check the Query Status every 3 seconds 
async function QueryStatusObtaining (){
  try {
    if (count < 4) { //Check the Query Status 4 times

      if (queryIDs.length > 0) { //If there is at least one QueryID to obtain the status
        console.log('Intentando obtener estado de la primera query...');

        let status = await connection.getQueryStatus('01b11314-0303-3ba0-0002-10da0001e02e', (err, stat) => { //This function returns the status of the query
          if (err) {
            console.error('Error obteniendo estado de la query:', err.message);
          } 
          else { 
            return stat;
          }
        });
        console.log("El estado de la query es:", status)
      } 
      
      else {
        console.log('No hay query IDs disponibles');
      }

      count++;
      setTimeout(QueryStatusObtaining, 3000); // Llamada recursiva cada 3 segundos
    }
  } 
  
  catch (err) {
    console.error('Error:', err.message);
    count++; // Incrementar el contador para continuar con la siguiente iteración
    setTimeout(QueryStatusObtaining, 3000); // Llamada recursiva cada 3 segundos
  }
};

QueryStatusObtaining(); // Iniciar la primera ejecución