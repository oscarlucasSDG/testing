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

//Connect to Snowflake
connection.connect((err, conn) => {
  if (err) {
    console.error('Error connecting to Snowflake:', err.message);
    return;
  }
});

//Queries to execute
const sqlQueries = [
  'SELECT * FROM testeo WHERE ID=1',
  'SELECT * FROM testeo WHERE ID=2',
  'SELECT SYSTEM$WAIT(10)',
  'SELECT * FROM testeo WHERE ID=3'
];

const sqlId = []


//Quert excution
connection.execute({
  sqlText: sqlQueries[0],
  complete: (err, stmt, rows) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return;
          }
    else {
      //console.log('Query results:', rows);
      //console.log('Estado de la consulta:', stmt.getStatus());
      console.log("AAAAA:", sqlId)
      let queryId = stmt.getQueryId();
      sqlId.push(queryId)
      console.log("BBBBB:",sqlId)
      }
  }
});

async function asyncFunc(){
  let result = await queryId
  console.log("CCCCCCC:", result)
}

asyncFunc()
//const a = await connection.getQueryStatus(sqlId[0])
//console.log(connection.getQueryStatusThrowIfError('01b0f5bb-0303-33c5-0000-000210daf025'));
//console.log(connection.getQueryStatus('01b0f5bb-0303-33c5-0000-000210daf025'));
//let promise = connection.getQueryStatus('01b0f5bb-0303-33c5-0000-000210daf025')
//console.log(promise)
//let promise = new Promise(function(resolve, reject) {
//  setTimeout(function(){
//    resolve('Promise resolved')}, 4000);
//  });

//async function asyncFunc(){
//  let result = await promise;
//  console.log(result);
//  console.log("Hello")
//};
  
//asyncFunc();
