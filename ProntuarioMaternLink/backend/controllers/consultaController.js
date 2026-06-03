const db = require('../config/database');

// Buscar histórico de consultas
exports.getHistorico = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        
        const [consultas] = await db.query(
            `SELECT 
                id,
                data_consulta,
                queixa_principal,
                exame_fisico,
                conduta,
                medico_nome,
                medico_crm,
                status
             FROM consultas 
             WHERE paciente_id = ? 
             ORDER BY data_consulta DESC`,
            [pacienteId]
        );
        
        // Formatar as datas para o frontend
        const consultasFormatadas = consultas.map(consulta => ({
            ...consulta,
            data_formatada: new Date(consulta.data_consulta).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            hora_formatada: new Date(consulta.data_consulta).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }));
        
        res.json({
            success: true,
            data: consultasFormatadas
        });
        
    } catch (error) {
        console.error('Erro ao buscar historico:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar historico de consultas: ' + error.message
        });
    }
};

// Buscar consulta especifica
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [consultas] = await db.query(
            `SELECT * FROM consultas WHERE id = ?`,
            [id]
        );
        
        if (consultas.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Consulta nao encontrada'
            });
        }
        
        res.json({
            success: true,
            data: consultas[0]
        });
        
    } catch (error) {
        console.error('Erro ao buscar consulta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar consulta: ' + error.message
        });
    }
};

// Criar nova consulta
exports.create = async (req, res) => {
    try {
        const {
            data_consulta,
            queixa_principal,
            exame_fisico,
            historia_molestia,
            historico_antecedentes,
            peso,
            altura,
            imc,
            hipotese_diagnostica,
            conduta
        } = req.body;
        
        // Validar dados obrigatorios
        if (!data_consulta) {
            return res.status(400).json({
                success: false,
                message: 'Data da consulta e obrigatoria'
            });
        }
        
        if (!queixa_principal || queixa_principal.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Queixa principal e obrigatoria'
            });
        }
        
        // 12 colunas = 12 valores
        const [result] = await db.query(
            `INSERT INTO consultas 
             (paciente_id, data_consulta, queixa_principal, exame_fisico, 
              historia_molestia, historico_antecedentes, peso, altura, imc,
              hipotese_diagnostica, conduta, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                1,                          // paciente_id
                data_consulta,              // data_consulta
                queixa_principal,           // queixa_principal
                exame_fisico || null,       // exame_fisico
                historia_molestia || null,  // historia_molestia
                historico_antecedentes || null, // historico_antecedentes
                peso || null,               // peso
                altura || null,             // altura
                imc || null,                // imc
                hipotese_diagnostica || null, // hipotese_diagnostica
                conduta || null,            // conduta
                'finalizada'                // status
            ]
        );
        
        // Buscar a consulta recem-criada para retornar
        const [novaConsulta] = await db.query(
            'SELECT * FROM consultas WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Consulta salva com sucesso',
            data: novaConsulta[0]
        });
        
    } catch (error) {
        console.error('Erro ao criar consulta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar consulta: ' + error.message,
            errorDetails: error.sqlMessage || error.message
        });
    }
};

// Atualizar consulta
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remover campos que nao devem ser atualizados
        delete updateData.id;
        delete updateData.paciente_id;
        delete updateData.created_at;
        
        // Se nao houver dados para atualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum dado para atualizar'
            });
        }
        
        const [result] = await db.query(
            'UPDATE consultas SET ? WHERE id = ? AND paciente_id = 1',
            [updateData, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Consulta nao encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Consulta atualizada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar consulta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar consulta: ' + error.message
        });
    }
};