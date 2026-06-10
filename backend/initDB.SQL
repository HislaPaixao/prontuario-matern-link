-- ============================================
-- MATERN LINK - BANCO DE DADOS 
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS matern_link;
USE matern_link;


-- ============================================
-- 1. TABELA DE MEDICOS
-- ============================================
CREATE TABLE medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    especialidade VARCHAR(100) DEFAULT 'Obstetricia',
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. TABELA DE PACIENTES
-- ============================================
CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    data_nascimento DATE,
    idade INT,
    convenio VARCHAR(100),
    numero_convenio VARCHAR(50),
    medico_responsavel_id INT,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medico_responsavel_id) REFERENCES medicos(id) ON DELETE SET NULL,
    INDEX idx_paciente_medico (medico_responsavel_id),
    INDEX idx_paciente_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. TABELA DE GESTACOES
-- ============================================
CREATE TABLE gestacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    semanas_gestacao INT,
    data_ultima_menstruacao DATE,
    data_prevista_parto DATE,
    tipo_gravidez VARCHAR(50) DEFAULT 'Unica',
    numero_gestacao INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'em_andamento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    INDEX idx_gestacao_paciente (paciente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. TABELA DE ALERGIAS
-- ============================================
CREATE TABLE alergias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    substancia VARCHAR(255) NOT NULL,
    gravidade VARCHAR(20) DEFAULT 'moderada',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    INDEX idx_alergia_paciente (paciente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. TABELA DE ANTECEDENTES
-- ============================================
CREATE TABLE antecedentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    INDEX idx_antecedente_paciente (paciente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. TABELA DE CONSULTAS
-- ============================================
CREATE TABLE consultas (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_consulta_paciente (paciente_id),
    INDEX idx_consulta_data (data_consulta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. TABELA DE REGISTROS DE ACOMPANHAMENTO
-- ============================================
CREATE TABLE registros_acompanhamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL DEFAULT 1,
    consulta_id INT NULL,
    tipo VARCHAR(20) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    arquivo_url VARCHAR(500),
    tamanho_bytes BIGINT,
    formato VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE SET NULL,
    INDEX idx_registro_paciente (paciente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 8. TABELA DE ALERGIAS
-- ============================================
CREATE TABLE IF NOT EXISTS alergias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    substancia VARCHAR(255) NOT NULL,
    gravidade VARCHAR(20) DEFAULT 'moderada',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    INDEX idx_alergia_paciente (paciente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================
-- INSERIR DADOS DE EXEMPLO
-- ============================================

-- Medicos
INSERT INTO medicos (nome, crm, email, especialidade) VALUES
('Dr. Carlos Eduardo', '123456', 'carlos.eduardo@maternlink.com', 'Obstetricia'),
('Dra. Ana Paula', '789012', 'ana.paula@maternlink.com', 'Ginecologia'),
('Dr. Ricardo Mendes', '345678', 'ricardo.mendes@maternlink.com', 'Ultrassonografia');

-- Pacientes
INSERT INTO pacientes (nome, email, telefone, data_nascimento, convenio, numero_convenio, medico_responsavel_id) VALUES
('Maria Silva Santos', 'maria.silva@email.com', '(11) 99999-9999', '1996-05-15', 'Unimed Gestante', 'UG-12345', 1),
('Ana Beatriz Costa', 'ana.costa@email.com', '(11) 98888-7777', '1992-08-20', 'Bradesco Saude', 'BS-98765', 1),
('Juliana Oliveira', 'juliana.oliveira@email.com', '(11) 97777-6666', '1995-03-10', 'Amil', 'AM-45678', 1),
('Fernanda Lima', 'fernanda.lima@email.com', '(11) 96666-5555', '1990-11-25', 'SulAmerica', 'SA-34567', 2),
('Patricia Souza', 'patricia.souza@email.com', '(11) 95555-4444', '1988-06-15', 'Unimed', 'UN-23456', 2),
('Camila Rodrigues', 'camila.rodrigues@email.com', '(11) 94444-3333', '1993-01-30', 'Porto Seguro', 'PS-12345', 3),
('Gabriela Santos', 'gabriela.santos@email.com', '(11) 93333-2222', '1997-04-05', 'Bradesco Saude', 'BS-87654', 3);

-- Gestacoes
INSERT INTO gestacoes (paciente_id, semanas_gestacao, data_ultima_menstruacao, data_prevista_parto) VALUES
(1, 32, '2023-10-15', '2024-07-20'),
(2, 28, '2023-11-10', '2024-08-15'),
(3, 20, '2024-01-05', '2024-10-10'),
(4, 36, '2023-09-20', '2024-06-25'),
(5, 24, '2023-12-01', '2024-09-05'),
(6, 16, '2024-02-15', '2024-11-20'),
(7, 38, '2023-09-01', '2024-06-05');

-- Alergias
INSERT INTO alergias (paciente_id, substancia, gravidade) VALUES
(1, 'Penicilina', 'severa'),
(2, 'Dipirona', 'moderada'),
(3, 'Iodo', 'leve'),
(4, 'Latex', 'severa');

-- Antecedentes
INSERT INTO antecedentes (paciente_id, tipo, descricao) VALUES
(1, 'medicacao', 'Acido Folico - 1 comprimido/dia'),
(1, 'medicacao', 'Sulfato Ferroso - 1 comprimido/dia'),
(1, 'historico_familiar', 'Pressao arterial elevada'),
(2, 'cirurgia', 'Cesariana anterior - 2022'),
(2, 'medicacao', 'Vitamina D - 1 comprimido/semana'),
(3, 'doenca_cronica', 'Hipotireoidismo controlado'),
(3, 'medicacao', 'Levotiroxina 50mcg/dia'),
(4, 'habito', 'Tabagismo - parou ha 6 meses'),
(5, 'cirurgia', 'Apendicectomia - 2018'),
(6, 'doenca_cronica', 'Diabetes gestacional'),
(6, 'medicacao', 'Insulina NPH conforme prescricao');

-- Consultas de exemplo
INSERT INTO consultas (paciente_id, data_consulta, queixa_principal, exame_fisico, conduta, status) VALUES
(1, '2024-03-15 14:30:00', 
 'Consulta de rotina - Pressao monitorada. Paciente relata leve cansaco ao fim do dia, sem outros sintomas.',
 'PA: 130/85 mmHg, FC: 88 bpm, FR: 18 irpm. Altura uterina: 28cm. BCF: 144 bpm.',
 'Manter repouso relativo, aumentar a ingestao de agua para 3L ao dia e retornar em 15 dias para reavaliacao.',
 'finalizada'),
(1, '2024-03-01 10:00:00', 
 'Ultrassom obstetrico de rotina para acompanhamento do terceiro trimestre.',
 'Exame laudado com sucesso. Peso fetal estimado: 1800g. Placenta grau I, liquido amniotico adequado.',
 'Exame laudado com sucesso. Desenvolvimento fetal adequado para 30 semanas. Batimentos cardiacos normais.',
 'finalizada'),
(1, '2024-02-15 09:00:00', 
 'Retorno de consulta pre-natal. Paciente assintomatica.',
 'PA: 120/80 mmHg. Ganho de peso adequado. Exames laboratoriais sem alteracoes.',
 'Manter suplementacao atual. Solicitar USG obstetrica com doppler para 28 semanas.',
 'finalizada');
 
 -- alergias
INSERT INTO alergias (paciente_id, substancia, gravidade) VALUES
(1, 'Penicilina', 'severa'),
(2, 'Dipirona', 'moderada'),
(3, 'Iodo', 'leve'),
(4, 'Latex', 'severa');

-- ============================================
-- VERIFICACAO
-- ============================================
SELECT 'Tabelas criadas com sucesso!' AS status;
SHOW TABLES;