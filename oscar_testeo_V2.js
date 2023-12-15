const snowflake = require('snowflake-sdk');

// Configuración de conexión
const connection = snowflake.createConnection({
  account: 'II85362.west-europe.azure',
  username: 'OSCARLUCAS',
  password: 'Salve120913',
  database: 'TETEO',
  schema: 'PUBLIC',
  warehouse: 'TESTING'
});

// Establecer conexión
connection.connect((err, conn) => {
  if (err) {
    console.error('Error al conectar: ' + err.message);
  } else {
    console.log('Conexión establecida con Snowflake');

    // Consultas SQL a ejecutar de manera asíncrona
    const sqlQueries = [
      'SELECT SYSTEM$WAIT(30)',
      'SELECT * FROM testeo WHERE ID=2',
      'SELECT SYSTEM$WAIT(10)'
    ];

    const queryStatus = {};

    // Función para ejecutar una consulta de manera asíncrona
    function executeAsyncQuery(query, index) {
      conn.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error('Error al ejecutar la consulta: ' + err.message);
          } else {
            console.log(`Consulta ${index + 1} ejecutada correctamente`);
            console.log('Resultado:', rows); // Imprimir los resultados si hay
          }

          // Almacena el estado de la consulta
          queryStatus[index] = stmt.getStatus();
        }
      });
    }

    // Ejecutar las consultas de manera asíncrona
    sqlQueries.forEach((query, index) => {
      executeAsyncQuery(query, index);
    });

    // Función para verificar el estado de las consultas
    //function checkQueryStatus() {
    //  const success = Object.values(queryStatus).every(status => status === 'success');

    //  if (!success) {
    //    console.log('checkeando status..')
    //    setTimeout(checkQueryStatus, 1000); // Verificar cada segundo
    //  } else {
    //    console.log('Todas las consultas fueron exitosas');

        // Cerrar la conexión
    //    conn.destroy((err) => {
    //      if (err) {
    //        console.error('Error al cerrar la conexión: ' + err.message);
    //      } else {
    //        console.log('Conexión cerrada correctamente');
    //      }
    //    });
    //  }
    //}

    // Iniciar verificación de estado
    //checkQueryStatus();
  }
});
