const db = require('../config/database');
const fs = require('fs');

// Listar registros do paciente
exports.listar = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        
        const [registros] = await db.query(
            `SELECT id, tipo, nome, descricao, arquivo_url, tamanho_bytes, formato, created_at
             FROM registros_acompanhamento
             WHERE paciente_id = ?
             ORDER BY created_at DESC`,
            [pacienteId]
        );
        
        // Formatar dados
        const registrosFormatados = registros.map(reg => ({
            ...reg,
            data_formatada: new Date(reg.created_at).toLocaleString('pt-BR')
        }));
        
        res.json({
            success: true,
            data: registrosFormatados
        });
        
    } catch (error) {
        console.error('Erro ao listar registros:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar registros: ' + error.message
        });
    }
};

// Upload de audio
exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo de audio enviado'
            });
        }
        
        const { paciente_id, consulta_id } = req.body;
        const file = req.file;
        
        const [result] = await db.query(
            `INSERT INTO registros_acompanhamento 
             (paciente_id, consulta_id, tipo, nome, descricao, 
              arquivo_url, tamanho_bytes, formato)
             VALUES (?, ?, 'audio', ?, ?, ?, ?, ?)`,
            [
                paciente_id || 1,
                consulta_id || null,
                file.originalname,
                'Gravacao de atendimento - ' + new Date().toLocaleString('pt-BR'),
                '/uploads/' + file.filename,
                file.size,
                file.mimetype
            ]
        );
        
        res.status(201).json({
            success: true,
            message: 'Audio salvo com sucesso',
            data: {
                id: result.insertId,
                url: '/uploads/' + file.filename
            }
        });
        
    } catch (error) {
        console.error('Erro ao fazer upload de audio:', error);
        
        // Remover arquivo em caso de erro
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar audio: ' + error.message
        });
    }
};

// Upload de documentos
exports.uploadDocumento = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum documento enviado'
            });
        }
        
        const { paciente_id, consulta_id } = req.body;
        const results = [];
        
        for (const file of req.files) {
            let tipo = 'documento';
            if (file.mimetype.startsWith('image/')) {
                tipo = 'imagem';
            } else if (file.mimetype.includes('pdf')) {
                tipo = 'documento';
            }
            
            const [result] = await db.query(
                `INSERT INTO registros_acompanhamento 
                 (paciente_id, consulta_id, tipo, nome, descricao, 
                  arquivo_url, tamanho_bytes, formato)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    paciente_id || 1,
                    consulta_id || null,
                    tipo,
                    file.originalname,
                    'Documento: ' + file.originalname,
                    '/uploads/' + file.filename,
                    file.size,
                    file.mimetype
                ]
            );
            
            results.push({
                id: result.insertId,
                nome: file.originalname,
                url: '/uploads/' + file.filename
            });
        }
        
        res.status(201).json({
            success: true,
            message: results.length + ' documento(s) salvos com sucesso',
            data: results
        });
        
    } catch (error) {
        console.error('Erro ao fazer upload de documentos:', error);
        
        // Remover arquivos em caso de erro
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, () => {});
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar documentos: ' + error.message
        });
    }
};

// Excluir registro
exports.excluir = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar registro para pegar o caminho do arquivo
        const [registros] = await db.query(
            'SELECT arquivo_url FROM registros_acompanhamento WHERE id = ?',
            [id]
        );
        
        if (registros.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Registro nao encontrado'
            });
        }
        
        // Deletar do banco
        await db.query('DELETE FROM registros_acompanhamento WHERE id = ?', [id]);
        
        // Deletar arquivo fisico
        if (registros[0].arquivo_url) {
            const filePath = path.join(__dirname, '..', registros[0].arquivo_url);
            fs.unlink(filePath, () => {});
        }
        
        res.json({
            success: true,
            message: 'Registro excluido com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao excluir registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao excluir registro: ' + error.message
        });
    }
};