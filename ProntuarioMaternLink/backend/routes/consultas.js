const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// Buscar histórico de consultas do paciente
router.get('/historico/:pacienteId', consultaController.getHistorico);

// Buscar uma consulta específica
router.get('/:id', consultaController.getById);

// Criar nova consulta
router.post('/', consultaController.create);

// Atualizar consulta existente
router.put('/:id', consultaController.update);

module.exports = router;