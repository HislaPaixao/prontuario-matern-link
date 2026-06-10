const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.listar);
router.get('/estatisticas', pacienteController.estatisticas);
router.get('/:id', pacienteController.buscarPorId);

module.exports = router;