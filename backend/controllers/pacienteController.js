const db = require('../config/database');

// Listar todos os pacientes
exports.listar = async (req, res) => {
    try {
        const { medico_id, busca } = req.query;
        
        let query = `
            SELECT 
                p.id, 
                p.nome, 
                p.email, 
                p.telefone,
                p.data_nascimento,
                TIMESTAMPDIFF(YEAR, p.data_nascimento, CURDATE()) as idade,
                p.convenio,
                p.numero_convenio,
                m.nome as medico_nome,
                g.semanas_gestacao,
                g.data_prevista_parto,
                (SELECT COUNT(*) FROM consultas c WHERE c.paciente_id = p.id) as total_consultas,
                (SELECT MAX(c.data_consulta) FROM consultas c WHERE c.paciente_id = p.id) as ultima_consulta
            FROM pacientes p
            LEFT JOIN medicos m ON p.medico_responsavel_id = m.id
            LEFT JOIN gestacoes g ON p.id = g.paciente_id AND g.status = 'em_andamento'
            WHERE p.status = 1
        `;
        
        const params = [];
        
        // Filtrar por medico
        if (medico_id) {
            query += ' AND p.medico_responsavel_id = ?';
            params.push(medico_id);
        }
        
        // Busca por nome
        if (busca) {
            query += ' AND p.nome LIKE ?';
            params.push('%' + busca + '%');
        }
        
        query += ' ORDER BY p.nome ASC';
        
        const [pacientes] = await db.query(query, params);
        
        // Formatar dados
        const pacientesFormatados = pacientes.map(p => ({
            ...p,
            idade: p.idade || 'N/A',
            semanas_gestacao: p.semanas_gestacao || 'N/A',
            data_prevista_parto_formatada: p.data_prevista_parto ? 
                new Date(p.data_prevista_parto).toLocaleDateString('pt-BR') : 'N/A',
            ultima_consulta_formatada: p.ultima_consulta ? 
                new Date(p.ultima_consulta).toLocaleDateString('pt-BR') : 'Sem consultas',
            tem_alergia: false // Podemos adicionar depois
        }));
        
        res.json({
            success: true,
            data: pacientesFormatados,
            total: pacientesFormatados.length
        });
        
    } catch (error) {
        console.error('Erro ao listar pacientes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar pacientes: ' + error.message
        });
    }
};

// Buscar paciente por ID
exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [pacientes] = await db.query(
            `SELECT 
                p.*,
                m.nome as medico_nome,
                m.crm as medico_crm,
                g.semanas_gestacao,
                g.data_ultima_menstruacao,
                g.data_prevista_parto,
                g.tipo_gravidez,
                g.numero_gestacao
             FROM pacientes p
             LEFT JOIN medicos m ON p.medico_responsavel_id = m.id
             LEFT JOIN gestacoes g ON p.id = g.paciente_id AND g.status = 'em_andamento'
             WHERE p.id = ? AND p.status = 1`,
            [id]
        );
        
        if (pacientes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Paciente nao encontrado'
            });
        }
        
        const paciente = pacientes[0];
        
        // Buscar alergias
        const [alergias] = await db.query(
            'SELECT substancia, gravidade FROM alergias WHERE paciente_id = ?',
            [id]
        );
        
        // Buscar ultimas consultas
        const [ultimasConsultas] = await db.query(
            `SELECT id, data_consulta, queixa_principal, conduta
             FROM consultas 
             WHERE paciente_id = ? 
             ORDER BY data_consulta DESC 
             LIMIT 5`,
            [id]
        );
        
        res.json({
            success: true,
            data: {
                ...paciente,
                alergias: alergias || [],
                ultimas_consultas: ultimasConsultas || []
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar paciente: ' + error.message
        });
    }
};

// Estatisticas do medico
exports.estatisticas = async (req, res) => {
    try {
        const { medico_id } = req.query;
        
        const [totalPacientes] = await db.query(
            'SELECT COUNT(*) as total FROM pacientes WHERE medico_responsavel_id = ? AND status = 1',
            [medico_id]
        );
        
        const [consultasHoje] = await db.query(
            `SELECT COUNT(*) as total FROM consultas c
             INNER JOIN pacientes p ON c.paciente_id = p.id
             WHERE p.medico_responsavel_id = ? AND DATE(c.data_consulta) = CURDATE()`,
            [medico_id]
        );
        
        const [totalConsultas] = await db.query(
            `SELECT COUNT(*) as total FROM consultas c
             INNER JOIN pacientes p ON c.paciente_id = p.id
             WHERE p.medico_responsavel_id = ?`,
            [medico_id]
        );
        
        res.json({
            success: true,
            data: {
                total_pacientes: totalPacientes[0].total,
                consultas_hoje: consultasHoje[0].total,
                total_consultas: totalConsultas[0].total
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar estatisticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatisticas: ' + error.message
        });
    }
};