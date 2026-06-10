const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ADMIN', // Coloque sua senha aqui
    database: 'matern_link',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log('✅ Banco de dados conectado com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    });

module.exports = pool;