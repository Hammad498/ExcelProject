import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection=mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DB_PASSWORD,
  database : 'excel_data'
});



connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

export default connection;