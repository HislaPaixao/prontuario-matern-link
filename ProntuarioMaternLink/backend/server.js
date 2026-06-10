const express = require('express');
const cors = require('cors');
const path = require('path');
const consultasRoutes = require('./routes/consultas');
const registrosRoutes = require('./routes/registros');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estaticos (upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/consultas', consultasRoutes);
app.use('/api/registros', registrosRoutes);

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API Matern Link rodando'
    });
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
    console.log('Endpoints disponiveis:');
    console.log('  GET  /api/health');
    console.log('  GET  /api/consultas/historico/1');
    console.log('  POST /api/consultas');
    console.log('  GET  /api/registros/paciente/1');
    console.log('  POST /api/registros/audio');
    console.log('  POST /api/registros/documento');
});