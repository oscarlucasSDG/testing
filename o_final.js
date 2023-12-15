//Import packages
const snowflake = require('snowflake-sdk');


//Queries to execute
const queryList = [
  'SELECT SYSTEM$WAIT(10)',
  'SELECT * FROM testeo WHERE ID=1',
  'SELECT * FROM testeo WHERE ID=2'
];
const queryIDs = [];


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


//Queries async execution 
const executeQuery = async (sql) => {
  try {
    const stmt = await connection.execute({
      sqlText: sql,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Error executing query:', err.message);
          return;
        }
        queryIDs.push(stmt.getQueryId()); //Saving queryIDs
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


//Query status checking
async function QueryStatusChecking(i){
  if (queryIDs.length > 0) {
    console.log("AAAAAAAA")
    let status = await connection.getQueryStatus(queryIDs[i], (err, result) => {
      return result
      });
    console.log("BBBBBBBB")
    console.log(status)
  }
  else {
    console.log('No hay query IDs disponibles')
  }
}

if (queryIDs.length>0){
for (let i = 0; i < queryIDs.length+1; i++) {
  QueryStatusChecking(i);
}
}
