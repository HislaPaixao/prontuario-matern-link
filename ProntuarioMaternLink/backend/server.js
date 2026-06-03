const express = require('express');
const cors = require('cors');
const consultasRoutes = require('./routes/consultas');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/consultas', consultasRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API Matern Link rodando! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/consultas/historico/1`);
    console.log(`   GET  http://localhost:${PORT}/api/consultas/1`);
    console.log(`   POST http://localhost:${PORT}/api/consultas`);
});