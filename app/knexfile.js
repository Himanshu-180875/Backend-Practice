require('dotenv').config()
// var options = {
//     development: {
//         client: 'mysql',
//     connection: {
//       host : 'localhost',
//       port : 3306,
//       user : 'root',
//       password : '',
//       database : 'test'
//     },
//     pool:{
//       min:2,
//       max:10
//     },
//     migrations:{
//         tableName:'knex_migrations',
//         directory: __dirname + '/config/migrations'
//     }
//       },
//     production: {
//         client: 'mysql',
//     connection: {
//       host : 'localhost',
//       port : 3306,
//       user : 'root',
//       password : '',
//       database : 'test'
//     },
//     migrations:{
//         tableName:'knex_migrations',
//         directory: __dirname + '/config/migrations'
//     }
//   }
// }

// var environment = process.env.NODE_ENV || 'development';
// var config = options[environment];
// module.exports = require('knex')(config);
module.exports ={
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    },
    migrations:{
        tableName:'knex_migrations',
    }
  };

//   module.exports= knex;



// 


    
  