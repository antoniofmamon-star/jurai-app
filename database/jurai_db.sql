-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12-Maio-2026 às 23:49
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `jurai_db`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `citacoes`
--

CREATE TABLE `citacoes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `autores` varchar(255) DEFAULT NULL,
  `ano` int(11) NOT NULL,
  `fonte` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `formacoes`
--

CREATE TABLE `formacoes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `instituicao` varchar(255) NOT NULL,
  `curso` varchar(255) NOT NULL,
  `grau` enum('Licenciatura','Mestrado','Doutoramento','Pós-Doutoramento','Outro') NOT NULL,
  `ano_inicio` int(11) NOT NULL,
  `ano_fim` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `formacoes`
--

INSERT INTO `formacoes` (`id`, `user_id`, `instituicao`, `curso`, `grau`, `ano_inicio`, `ano_fim`, `created_at`, `updated_at`) VALUES
(1, 1, 'Universidade Agostinho Neto', 'Engenharia Informática', 'Mestrado', 2015, 2017, '2026-05-09 10:28:10', '2026-05-09 10:28:10'),
(2, 2, 'Universidade Kimpa Vita Uíge ', 'Engenharia ', 'Doutoramento', 2010, 2015, '2026-05-09 19:54:19', '2026-05-09 19:54:19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `livros`
--

CREATE TABLE `livros` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `editora` varchar(255) DEFAULT NULL,
  `ano` int(11) NOT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mesas`
--

CREATE TABLE `mesas` (
  `id` int(11) NOT NULL,
  `nome_estudante` varchar(255) NOT NULL,
  `tema` text NOT NULL,
  `curso` varchar(255) NOT NULL,
  `ano` varchar(255) NOT NULL,
  `data_defesa` datetime DEFAULT NULL,
  `hora_defesa` varchar(255) DEFAULT NULL,
  `local_defesa` varchar(255) DEFAULT NULL,
  `presidente` varchar(255) DEFAULT 'Aguardando sugestão da IA',
  `primeiro_vogal` varchar(255) DEFAULT 'Aguardando sugestão da IA',
  `suplente` varchar(255) DEFAULT 'Aguardando sugestão da IA',
  `segundo_vogal_tutor` varchar(255) NOT NULL,
  `secretario` varchar(255) NOT NULL,
  `estado` enum('rascunho','sugerido','aprovado','rejeitado') DEFAULT 'rascunho',
  `justificacao_ia` text DEFAULT NULL,
  `criado_por` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `mesas`
--

INSERT INTO `mesas` (`id`, `nome_estudante`, `tema`, `curso`, `ano`, `data_defesa`, `hora_defesa`, `local_defesa`, `presidente`, `primeiro_vogal`, `suplente`, `segundo_vogal_tutor`, `secretario`, `estado`, `justificacao_ia`, `criado_por`, `created_at`, `updated_at`) VALUES
(1, 'António Mavinga', 'Implementação de Redes Neurais para Detecção de Fraudes Bancárias', 'Engenharia Informática', '5º Ano', '2026-06-15 00:00:00', '10:00', 'Sala de Actos', 'Prof. Dr. Miguel Santos', 'Prof. Dra. Ana Ferreira', 'Prof. Dr. Carlos Mendonça', 'Prof. Dr. João Baptista', 'Prof. Maria Luísa', 'aprovado', 'A escolha do Prof. Dr. Miguel Santos como presidente da mesa se deve à sua experiência como docente universitário, o que lhe confere habilidades para liderar e moderar a defesa do trabalho. O Prof. Dr. Miguel Santos, como docente universitário, tem uma visão abrangente das áreas da engenharia informática, o que é essencial para avaliar a implementação de redes neurais para detecção de fraudes bancárias. A Prof. Dra. Ana Ferreira é escolhida como primeira vogal devido à sua experiência acadêmica e à sua possível especialização em áreas relacionadas à engenharia informática, o que a torna apta a avaliar o trabalho apresentado. O Prof. Dr. Carlos Mendonça é designado como suplente, pois sua experiência como docente universitário o torna capaz de substituir tanto o presidente quanto o primeiro vogal, caso necessário, garantindo a continuidade da defesa do trabalho.', 1, '2026-05-08 15:07:30', '2026-05-08 22:32:52'),
(2, 'António Finda Mamona ', 'Concepção de um sistema Inteligente de correção de teste de admissão de novos \"caso Universidade Kinpa Vita Uíge\"', 'Engenharia Informática ', '4 Ano', '2026-07-10 00:00:00', '12:30', 'Auditório 1', 'Prof. Dr. Miguel Santos', 'Prof. Dra. Ana Ferreira', 'Prof. Dr. Carlos Mendonça', 'Nkanga Pedro ', 'Elísio Ivo Júnior ', 'aprovado', 'A escolha do Prof. Dr. Miguel Santos como presidente da mesa se deve à sua experiência como docente universitário, o que lhe confere a autoridade e a capacidade de liderar a discussão e a avaliação do trabalho apresentado. O Prof. Dr. Miguel Santos, como presidente, poderá garantir a imparcialidade e a rigorosidade necessárias para a defesa do trabalho. A escolha da Prof. Dra. Ana Ferreira como primeiro vogal se justifica pela sua área de atuação, que pode ser relacionada ao tema de concepção de um sistema inteligente, pois a informática é uma área que requer conhecimentos em diferentes áreas, incluindo a inteligência artificial. Já o Prof. Dr. Carlos Mendonça foi escolhido como suplente devido à sua experiência como docente universitário, podendo substituir o presidente ou o primeiro vogal, caso necessário, garantindo a continuidade da sessão de defesa do trabalho.', 1, '2026-05-09 19:25:27', '2026-05-09 19:26:23'),
(3, 'Nkembo', 'Dados hospitais ', 'Engenharia Informática ', '4 ano', '2026-02-02 00:00:00', '5:00', 'Auditório ', 'Prof. Dr. Carlos Mendonça', 'Prof. Dra. Ana Ferreira', 'Prof. Dr. Miguel Santos', 'Nkanga Pedro', 'ANTÓNIO ', 'sugerido', 'Considerando o tema \'Dados hospitais\' e o curso \'Engenharia Informática\', a escolha do presidente, primeiro vogal e suplente foi baseada na experiência e na capacidade dos docentes de avaliar trabalhos acadêmicos. O Prof. Dr. Carlos Mendonça, como presidente, traz uma visão geral e experiência em conduzir processos acadêmicos. A Prof. Dra. Ana Ferreira, como primeiro vogal, contribui com sua perspectiva feminina e uma possível especialização em áreas relacionadas à informática em saúde. O Prof. Dr. Miguel Santos, como suplente, oferece uma alternativa qualificada para substituir o presidente ou o primeiro vogal, caso necessário, garantindo a continuidade do processo de avaliação.', 1, '2026-05-11 08:41:09', '2026-05-11 08:43:16'),
(4, 'Nkembo', 'Dados hospitais ', 'Engenharia Informática ', '4 ano', '2026-02-02 00:00:00', '5:00', 'Auditório ', 'Aguardando sugestão da IA', 'Aguardando sugestão da IA', 'Aguardando sugestão da IA', 'Nkanga Pedro', 'ANTÓNIO ', 'rascunho', NULL, 1, '2026-05-11 08:41:39', '2026-05-11 08:41:39'),
(5, 'Nkembo', 'Dados hospitais ', 'Engenharia Informática ', '4 ano', '2026-02-02 00:00:00', '5:00', 'Auditório ', 'Prof. Dr. Carlos Mendonça', 'Prof. Dra. Ana Ferreira', 'Prof. Dr. Miguel Santos', 'Nkanga Pedro', 'ANTÓNIO ', 'sugerido', 'A escolha do presidente, Prof. Dr. Carlos Mendonça, se baseia em sua experiência como docente universitário, o que lhe confere autoridade e habilidades para liderar a mesa de júri de forma eficaz. A escolha do primeiro vogal, Prof. Dra. Ana Ferreira, também se baseia em sua experiência como docente universitário, o que lhe permite contribuir com uma perspectiva acadêmica sólida para a avaliação do trabalho. O suplente, Prof. Dr. Miguel Santos, foi escolhido por sua capacidade de substituir tanto o presidente quanto o primeiro vogal, caso necessário, garantindo a continuidade do processo de avaliação. Além disso, a escolha dos membros da mesa de júri levou em consideração a necessidade de uma composição diversificada e imparcial, capaz de avaliar o trabalho do estudante de forma justa e rigorosa, considerando o tema \'Dados hospitais\' e o curso \'Engenharia Informática\'.', 1, '2026-05-11 08:41:49', '2026-05-11 08:42:08');

-- --------------------------------------------------------

--
-- Estrutura da tabela `premios`
--

CREATE TABLE `premios` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `instituicao` varchar(255) DEFAULT NULL,
  `ano` int(11) NOT NULL,
  `descricao` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `projetos`
--

CREATE TABLE `projetos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `ano_inicio` int(11) NOT NULL,
  `ano_fim` int(11) DEFAULT NULL,
  `financiador` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `publicacoes`
--

CREATE TABLE `publicacoes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `tipo` enum('Artigo','Conferência','Capítulo','Outro') NOT NULL,
  `ano` int(11) NOT NULL,
  `doi` varchar(255) DEFAULT NULL,
  `revista` varchar(255) DEFAULT NULL,
  `link_pdf` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `perfil` enum('admin','docente','estudante') NOT NULL DEFAULT 'estudante',
  `activo` tinyint(1) DEFAULT 1,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `estado` enum('pendente','activo','inactivo') NOT NULL DEFAULT 'pendente',
  `aprovado_por` int(11) DEFAULT NULL,
  `data_aprovacao` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `password`, `perfil`, `activo`, `foto`, `created_at`, `updated_at`, `telefone`, `estado`, `aprovado_por`, `data_aprovacao`) VALUES
(1, 'Administrador JURAI', 'admin@unikivi.ao', '$2b$10$HmWadS6O267XdFg8dUA/ze5zFMeiXM/Xxq0sEBagj9yXGAjqOxNAa', 'admin', 1, NULL, '2026-05-08 10:44:14', '2026-05-08 10:44:14', NULL, 'activo', NULL, NULL),
(9, 'Nkanga Pedro ', 'nkanga@unikivi.ao', '$2b$10$R/pnfdDJF0h6EmfIrb60kuoyVWk/wPUAx/TOqgTywjYpdp1MHkUba', 'docente', 1, NULL, '2026-05-12 06:23:14', '2026-05-12 06:26:41', '927561462', 'activo', NULL, NULL),
(10, 'António Finda Mamona ', 'afm@unikivi.ao', '$2b$10$mtRPYCcvYcCYpH2z0kse9uLeEViLiJJLzHQBW2B.e5/5C1XW68lZi', 'estudante', 1, NULL, '2026-05-12 06:42:07', '2026-05-12 06:43:12', '930840829', 'activo', 1, '2026-05-12 06:43:12');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `citacoes`
--
ALTER TABLE `citacoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `formacoes`
--
ALTER TABLE `formacoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `livros`
--
ALTER TABLE `livros`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `premios`
--
ALTER TABLE `premios`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `projetos`
--
ALTER TABLE `projetos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `publicacoes`
--
ALTER TABLE `publicacoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD UNIQUE KEY `email_62` (`email`),
  ADD UNIQUE KEY `email_63` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `citacoes`
--
ALTER TABLE `citacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `formacoes`
--
ALTER TABLE `formacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `livros`
--
ALTER TABLE `livros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mesas`
--
ALTER TABLE `mesas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `premios`
--
ALTER TABLE `premios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projetos`
--
ALTER TABLE `projetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `publicacoes`
--
ALTER TABLE `publicacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
