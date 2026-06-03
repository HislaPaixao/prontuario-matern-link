CREATE DATABASE IF NOT EXISTS matern_link;
USE matern_link;

-- Tabela de Consultas
CREATE TABLE IF NOT EXISTS consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT DEFAULT 1,
    medico_nome VARCHAR(255) DEFAULT 'Dr. Carlos Eduardo',
    medico_crm VARCHAR(20) DEFAULT '123456',
    data_consulta DATETIME NOT NULL,
    queixa_principal TEXT,
    exame_fisico TEXT,
    historia_molestia TEXT,
    historico_antecedentes TEXT,
    peso DECIMAL(5,2),
    altura DECIMAL(3,2),
    imc DECIMAL(4,2),
    hipotese_diagnostica TEXT,
    conduta TEXT,
    status VARCHAR(20) DEFAULT 'finalizada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir consultas de exemplo
INSERT INTO consultas (data_consulta, queixa_principal, exame_fisico, conduta, status) VALUES
('2024-03-15 14:30:00', 
 'Consulta de rotina - Pressão monitorada. Paciente relata leve cansaço ao fim do dia, sem outros sintomas.',
 'PA: 130/85 mmHg, FC: 88 bpm, FR: 18 irpm. Altura uterina: 28cm. BCF: 144 bpm.',
 'Manter repouso relativo, aumentar a ingestão de água para 3L ao dia e retornar em 15 dias para reavaliação.',
 'finalizada'),
('2024-03-01 10:00:00', 
 'Ultrassom obstétrico de rotina para acompanhamento do terceiro trimestre.',
 'Exame laudado com sucesso. Peso fetal estimado: 1800g. Placenta grau I, líquido amniótico adequado.',
 'Exame laudado com sucesso. Desenvolvimento fetal adequado para 30 semanas. Batimentos cardíacos normais.',
 'finalizada'),
('2024-02-15 09:00:00', 
 'Retorno de consulta pré-natal. Paciente assintomática.',
 'PA: 120/80 mmHg. Ganho de peso adequado. Exames laboratoriais sem alterações.',
 'Manter suplementação atual. Solicitar USG obstétrica com doppler para 28 semanas.',
 'finalizada');