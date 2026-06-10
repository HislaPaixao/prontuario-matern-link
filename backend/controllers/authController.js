const db = require('../config/database');

// Login do medico
exports.loginMedico = async (req, res) => {
    try {
        const { usuario } = req.body;
        
        if (!usuario) {
            return res.status(400).json({
                success: false,
                message: 'CRM ou email e obrigatorio'
            });
        }
        
        // Buscar por CRM ou email
        const [medicos] = await db.query(
            `SELECT id, nome, crm, email, especialidade 
             FROM medicos 
             WHERE (crm = ? OR email = ?) AND status = 1`,
            [usuario, usuario]
        );
        
        if (medicos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Medico nao encontrado. Verifique o CRM ou email.'
            });
        }
        
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                medico: medicos[0],
                token: 'matern_link_' + medicos[0].id + '_' + Date.now()
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login: ' + error.message
        });
    }
};

// Login do paciente (futuro)
exports.loginPaciente = async (req, res) => {
    try {
        const { usuario } = req.body;
        
        if (!usuario) {
            return res.status(400).json({
                success: false,
                message: 'Email e obrigatorio'
            });
        }
        
        const [pacientes] = await db.query(
            `SELECT id, nome, email, telefone, data_nascimento, convenio 
             FROM pacientes 
             WHERE email = ? AND status = 1`,
            [usuario]
        );
        
        if (pacientes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Paciente nao encontrado. Verifique o email.'
            });
        }
        
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                paciente: pacientes[0],
                token: 'matern_link_paciente_' + pacientes[0].id + '_' + Date.now()
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login: ' + error.message
        });
    }
};