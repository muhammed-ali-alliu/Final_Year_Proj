const Pool = require('pg').Pool;
require('dotenv').config();

// const pool = new Pool({
//     user: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     host: process.env.HOST,
//     port: process.env.PORT,
//     database: process.env.DATABASE,
//     //role: process.env.ROLE
// });


const pool = new Pool({
    user: "postgres",
    password: "Postgres",
    host: "localhost",
    port: "5432",
    database: "COMP3000",
    //role: process.env.ROLE
});

// pool.connect(function(error) {
//     if(error){
//         throw error
//     }

//     console.log("Connected")
// });


module.exports = pool;
