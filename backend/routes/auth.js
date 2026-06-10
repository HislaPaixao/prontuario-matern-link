const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login/medico', authController.loginMedico);
router.post('/login/paciente', authController.loginPaciente);

module.exports = router;