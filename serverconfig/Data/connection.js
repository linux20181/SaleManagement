const mysql = require('../../node_modules/mysql');
module.exports = {
    connection : function(){
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'sale_management'
          });
    }
}