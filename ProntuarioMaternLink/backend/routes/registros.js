const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const registroController = require('../controllers/registroController');

// Configurar multer para upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Rotas
router.get('/paciente/:pacienteId', registroController.listar);
router.post('/audio', upload.single('audio'), registroController.uploadAudio);
router.post('/documento', upload.array('documentos', 5), registroController.uploadDocumento);
router.delete('/:id', registroController.excluir);

module.exports = router;