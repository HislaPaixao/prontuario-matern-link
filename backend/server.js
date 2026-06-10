const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rotas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const consultasRoutes = require('./routes/consultas');
const registrosRoutes = require('./routes/registros');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estaticos da pasta raiz do projeto
app.use(express.static(path.join(__dirname, '..')));

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== ROTAS DA API (DEVEM VIR ANTES DAS ROTAS DE PAGINA) ==========
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/registros', registrosRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API Matern Link rodando',
        timestamp: new Date().toISOString()
    });
});

// Rota para a pagina inicial (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('  Matern Link - Sistema completo');
    console.log('========================================');
    console.log('  Acesse: http://localhost:' + PORT);
    console.log('  Login: http://localhost:' + PORT + '/login.html');
    console.log('  API:   http://localhost:' + PORT + '/api');
    console.log('========================================');
});