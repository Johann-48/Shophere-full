-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2025 at 11:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistemacomercioslocais`
--

-- --------------------------------------------------------

--
-- Table structure for table `avaliacoescomercio`
--

CREATE TABLE `avaliacoescomercio` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `comercio_id` int(11) DEFAULT NULL,
  `conteudo` text DEFAULT NULL,
  `nota` int(11) DEFAULT NULL CHECK (`nota` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `avaliacoesproduto`
--

CREATE TABLE `avaliacoesproduto` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `produto_id` int(11) DEFAULT NULL,
  `conteudo` text DEFAULT NULL,
  `nota` int(11) DEFAULT NULL CHECK (`nota` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `avaliacoesproduto`
--

INSERT INTO `avaliacoesproduto` (`id`, `usuario_id`, `produto_id`, `conteudo`, `nota`) VALUES
(1, 1, 1, 'Excelente qualidade e acabamento impecável!', 5),
(2, 2, 1, 'Muito divertido, mas faltou algumas peças pequenas.', 4),
(3, 3, 1, 'Boa experiência, mas esperava mais detalhes.', 3),
(4, 1, 2, 'Ótimo carrinho, cores vibrantes e resistente.', 5),
(5, 2, 2, 'O tamanho é menor do que eu imaginava.', 4),
(6, 3, 2, 'Preço justo, mas o adesivo veio um pouco desalinhado.', 4),
(7, 1, 3, 'Modelo fiel ao real, a escala está perfeita.', 5),
(8, 2, 3, 'Rodas um pouco travadas, mas a pintura é legal.', 4),
(9, 3, 3, 'Gostei bastante, mas o interior poderia ser mais detalhado.', 4),
(10, 1, 4, 'Excelente desempenho em jogos a 1080p!', 5),
(11, 2, 4, 'Esquenta um pouco, mas a ventoinha é silenciosa.', 4),
(12, 3, 4, 'Boa placa custo‑benefício, mas não testei em 4K ainda.', 4),
(13, 1003, 3, 'Achei muito bom, superou expectativas!', 4),
(14, 1003, 1, 'asdasdasdasd', 2),
(15, 1003, 2, 'asdsadasdasdas', 2),
(16, 1003, 25, 'Muito Bom, este produto alegrou meu dia', 5);

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id`, `nome`) VALUES
(4, 'Alimentação'),
(9, 'Beleza & Higiene'),
(1, 'Brinquedos'),
(2, 'Computação'),
(3, 'Decoração'),
(11, 'Eletrônicos'),
(6, 'Fitness'),
(10, 'Informática'),
(12, 'Jardinagem'),
(5, 'Livros'),
(7, 'Moda'),
(8, 'Pets');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `loja_id` int(11) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `cliente_id`, `loja_id`, `criado_em`) VALUES
(1, 1003, 1, '2025-07-21 10:23:39'),
(2, 1003, 2, '2025-07-21 10:23:40'),
(3, 1003, 1001, '2025-07-21 10:36:23'),
(4, 1003, 1002, '2025-07-21 10:36:24'),
(5, 1003, 1012, '2025-07-21 10:36:24'),
(6, 1003, 1016, '2025-07-21 10:36:30');

-- --------------------------------------------------------

--
-- Table structure for table `comercios`
--

CREATE TABLE `comercios` (
  `id` int(11) NOT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `fotos` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comercios`
--

INSERT INTO `comercios` (`id`, `endereco`, `telefone`, `fotos`, `email`, `senha`, `nome`, `descricao`) VALUES
(1001, 'R. Minas Gerais, 108 - Jardim America, Eng. Coelho - SP, 13165-000', '01938129000', 'https://storage.googleapis.com/ecdt-logo-saida/5f0706c3eb04252fff9925f5895445373402a60cf4a38c376203288e8edc61bf/BERTON-SUPERMERCADO.webp', 'berton@gmail.com', 'beton@2025', 'Berton', 'Mercado Popular no centro de EC'),
(1002, 'Alameda Ipê Rosa, 11', '19997691375', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png', 'bitcoin@gmail.com', '$2b$10$sUe.unzD6CruB0mX0SNApuBfrHTwzi7Bvk7WTwG0IblXHm40C8Dom', 'Bitcoin', 'Bitcoin, e isso'),
(1003, 'Alameda Ipê Rosa, 11', '19997691375', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3opv14tOqxrS1-VK2V4oyOjMNyYkX-iPamA&s', 'variedades@gmail.com', '$2b$10$d3kObOBWl4t2DUTALeDFeO19i32qgN2HKxSTQD1aiqM89OdDfe/ye', 'Shopping das Variedades', 'Todos os produtos do mundo em apenas uma loja'),
(1004, 'Alameda Ipê Rosa, 11', '19997691375', 'https://t.ctcdn.com.br/luOODOyEQXWKBMiGRDleaCrJzyE=/i490135.jpeg', 'pc@gmail.com', '$2b$10$JKcr8TMCyoEAEajaq/iJveN172.Hi66wjpTFp20E5sSO1/LpTQfZ.', 'PC', 'Pecas para seu PC Gamer'),
(1005, 'Rua das Flores, 200 - Centro, Campinas, SP', '19 99823‑3456', 'https://via.placeholder.com/150?text=Floricultura', 'contato@florprimavera.com.br', 'senha123', 'Floricultura Primavera', 'As mais belas flores para todas as ocasiões.'),
(1006, 'Av. Paulista, 1500 - Bela Vista, São Paulo, SP', '11 3123‑4567', 'https://via.placeholder.com/150?text=Cafeteria', 'contato@cafedamanha.com.br', 'senha123', 'Café da Manhã', 'Especialidades em cafés especiais e brunch.'),
(1007, 'Travessa do Livro, 45 - Centro, Rio de Janeiro, RJ', '21 98765‑4321', 'https://via.placeholder.com/150?text=Livraria', 'contato@livrolivre.com.br', 'senha123', 'Livraria Livre', 'Seu refúgio de histórias e conhecimento.'),
(1008, 'Rua Fitness, 300 - Vila Olímpia, São Paulo, SP', '11 4002‑7890', 'https://via.placeholder.com/150?text=Academia', 'contato@fitclub.com.br', 'senha123', 'FitClub Academia', 'Treinamentos personalizados e equipamentos de ponta.'),
(1009, 'Estrada Animal, 120 - Interlagos, São Paulo, SP', '11 97654‑3210', 'https://via.placeholder.com/150?text=Pet+Shop', 'contato@petlove.com.br', 'senha123', 'Pet Love', 'Tudo para o bem‑estar do seu pet.'),
(1010, 'Av. Moda, 78 - Jardins, São Paulo, SP', '11 3456‑7890', 'https://via.placeholder.com/150?text=Moda', 'contato@fashionstore.com.br', 'senha123', 'Fashion Store', 'Tendências e estilos internacionais.'),
(1011, 'Rua Saúde, 22 - Centro, Curitiba, PR', '41 99876‑5432', 'https://via.placeholder.com/150?text=Farmacia', 'contato@farmacia24h.com.br', 'senha123', 'Farmácia 24h', 'Atendimento 24 horas e entrega rápida.'),
(1012, 'Praça Gourmet, 5 - Savassi, Belo Horizonte, MG', '31 99222‑3344', 'https://via.placeholder.com/150?text=Lanchonete', 'contato@burgerhouse.com.br', 'senha123', 'Burger House', 'Os melhores burgers artesanais da cidade.'),
(1013, 'Av. Tecnologia, 500 - Porto Alegre, RS', '51 99811‑2233', 'https://via.placeholder.com/150?text=Eletronicos', 'contato@techpoint.com.br', 'senha123', 'TechPoint', 'Eletrônicos e acessórios com garantia.'),
(1014, 'Rua Verde, 89 - Centro, Recife, PE', '81 99777‑8888', 'https://via.placeholder.com/150?text=Organicos', 'contato@organics.com.br', 'senha123', 'Orgânicos & Cia', 'Produtos naturais e sustentáveis.'),
(1015, '10, alameda nova, campinas', '19997691375', NULL, 'teste@teste.com', 'teste', 'Loja Teste', NULL),
(1016, 'Alameda Ipê Rosa, 11', '19997691375', 'https://cdn.motor1.com/images/mgl/nn6YR/s1/2020-audi-a7-sportback-e-quattro.jpg', 'johann@gmail.com', '$2b$10$UkKxtR/mjIlSf1HrF4Wkc.kBYlYd1Ea9AaTULUKq9KyXMVbxaJZiW', 'Johann', 'Loja Teste'),
(1017, 'Alameda Ipê Rosa, 11', '19997691375', NULL, 'asd@gmail.com', '$2b$10$GGcwqUUyu/RShmv09qfroOgUOCefPYk1qdfeT2NpCH4kgg0m7UH8C', 'ASD', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fotos_produto`
--

CREATE TABLE `fotos_produto` (
  `id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fotos_produto`
--

INSERT INTO `fotos_produto` (`id`, `produto_id`, `url`, `principal`) VALUES
(1, 1, '/uploads/lego-policia.jpg', 1),
(2, 2, '/uploads/hotwheels-camaro.avif', 1),
(3, 3, '/uploads/hotwheels-supra.avif', 1),
(4, 4, '/uploads/xfx-rx6650xt.webp', 1),
(5, 114, '/uploads/1752155388013-xfx-rx6650xt.webp', 1),
(6, 115, '/uploads/1752155710518-AdobeColor-Shophere main theme.jpeg', 1),
(7, 116, '/uploads/1752155837744-hotwheels-supra.avif', 1),
(8, 117, '/uploads/1752775761189-Romanian Revolution in pictures, 1989 (1).jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `mensagens`
--

CREATE TABLE `mensagens` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `remetente` enum('cliente','loja') NOT NULL,
  `tipo` enum('texto','imagem','audio') NOT NULL,
  `conteudo` text DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mensagens`
--

INSERT INTO `mensagens` (`id`, `chat_id`, `remetente`, `tipo`, `conteudo`, `criado_em`) VALUES
(1, 5, 'cliente', 'texto', 'Ola', '2025-07-21 10:36:27'),
(2, 6, 'cliente', 'texto', 'OI', '2025-07-21 10:36:32'),
(3, 6, 'cliente', 'texto', 'Ola', '2025-07-21 10:36:59'),
(4, 6, 'cliente', 'texto', 'asd', '2025-07-21 10:37:02'),
(5, 6, 'loja', 'texto', 'asd', '2025-07-21 10:46:17'),
(6, 6, 'loja', 'texto', 'qwewqsad', '2025-07-21 10:46:19'),
(7, 6, 'loja', 'texto', 'Oloco', '2025-07-21 10:49:21'),
(8, 6, 'loja', 'texto', 'Ta funcuonadno', '2025-07-21 10:49:24'),
(9, 6, 'cliente', 'texto', 'pior que ta mensmo', '2025-07-21 10:53:17'),
(10, 6, 'cliente', 'audio', 'blob:http://localhost:5173/d7a6e3e5-aeb2-427c-8fda-c963819b1934', '2025-07-21 10:53:53'),
(11, 6, 'cliente', 'audio', 'blob:http://localhost:5173/82b25f3c-85ac-493a-b024-9330647d4e10', '2025-07-21 10:53:56'),
(12, 6, 'cliente', 'audio', 'blob:http://localhost:5173/1df42b53-4d94-4cf1-af7d-3bdd5e757eff', '2025-07-21 10:54:05'),
(13, 6, 'loja', 'audio', 'blob:http://localhost:5173/2e55b53a-6f64-4527-8f5d-9dd11ad37d74', '2025-07-21 10:55:13'),
(14, 6, 'loja', 'audio', 'blob:http://localhost:5173/799218ad-721f-4b47-a10c-03e6dfc13457', '2025-07-21 10:55:19'),
(16, 6, 'cliente', 'texto', 'Ola', '2025-07-21 11:38:06'),
(18, 6, 'cliente', 'audio', '/uploads/audios/audio_1753206279276.webm', '2025-07-22 14:44:39'),
(19, 6, 'cliente', 'audio', '/uploads/audios/audio_1753206285695.webm', '2025-07-22 14:44:45'),
(20, 6, 'cliente', 'audio', '/uploads/audios/audio_1753206373296.webm', '2025-07-22 14:46:13'),
(21, 6, 'loja', 'audio', 'blob:http://localhost:5173/ca0a3e57-9359-4dd5-a0a6-d294c37b331d', '2025-07-22 15:05:13'),
(22, 6, 'loja', 'imagem', 'blob:http://localhost:5173/7b047193-6135-4804-af87-ac4f0c066607', '2025-07-22 15:05:51'),
(23, 6, 'cliente', 'imagem', 'blob:http://localhost:5173/ae74a74f-371e-47b5-af69-bf2424da73b3', '2025-07-23 09:25:32'),
(24, 6, 'cliente', 'imagem', '/uploads/imagens/img_1753274879328.jpg', '2025-07-23 09:47:59'),
(25, 6, 'cliente', 'audio', '/uploads/audios/audio_1753275522280.webm', '2025-07-23 09:58:42'),
(26, 6, 'loja', 'texto', 'É ta funcionadno meu', '2025-07-23 09:59:18'),
(27, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359671628.webm', '2025-07-24 09:21:11'),
(28, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359691661.webm', '2025-07-24 09:21:31'),
(29, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359706448.webm', '2025-07-24 09:21:46'),
(30, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359707470.webm', '2025-07-24 09:21:47'),
(31, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359721112.webm', '2025-07-24 09:22:01'),
(32, 6, 'cliente', 'audio', '/uploads/audios/audio_1753359842814.webm', '2025-07-24 09:24:02'),
(33, 4, 'cliente', 'texto', 'oi', '2025-07-24 10:07:39'),
(34, 6, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Toyota Supra Mk3\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-24 10:16:39'),
(35, 6, 'cliente', 'texto', 'oi', '2025-07-24 10:19:27'),
(36, 6, 'cliente', 'audio', '/uploads/audios/audio_1753363180879.webm', '2025-07-24 10:19:40'),
(37, 6, 'cliente', 'imagem', '/uploads/imagens/img_1753363206011.avif', '2025-07-24 10:20:06'),
(38, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-27 11:05:52'),
(39, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-27 11:09:28'),
(40, 6, 'cliente', 'audio', '/uploads/audios/audio_1753625747031.webm', '2025-07-27 11:15:47'),
(41, 6, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Croissant Integral\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 10:36:55'),
(42, 4, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Croissant Integral\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 10:37:07'),
(43, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 11:24:10'),
(44, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 11:24:38'),
(45, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 11:42:10'),
(46, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-07-28 11:42:13'),
(47, 3, 'cliente', 'texto', 'Olá, tenho interesse no produto \"Carro em Miniatura Chevrolet Camaro 2020\". Você pode me informar disponibilidade e prazo de entrega(se disponível)?', '2025-08-15 11:07:44'),
(48, 6, 'cliente', 'texto', 'asd', '2025-08-15 11:08:29'),
(49, 6, 'cliente', 'texto', 'asd', '2025-08-15 11:08:32');

-- --------------------------------------------------------

--
-- Table structure for table `produtos`
--

CREATE TABLE `produtos` (
  `id` int(11) NOT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `fotos` text DEFAULT NULL,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `quantidade` int(11) DEFAULT 0,
  `comercio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produtos`
--

INSERT INTO `produtos` (`id`, `marca`, `nome`, `preco`, `fotos`, `codigo_barras`, `descricao`, `quantidade`, `comercio_id`) VALUES
(1, 'Lego', 'Carro de Polícia de Lego', 199.90, NULL, NULL, NULL, 0, 1003),
(2, 'Hotweels', 'Carro em Miniatura Chevrolet Camaro 2020', 18.90, NULL, NULL, NULL, 1, 1001),
(3, 'Hotweels', 'Carro em Miniatura Toyota Supra Mk3', 23.90, NULL, NULL, NULL, 0, 1003),
(4, 'XFX', 'XFX Radeon RX6650XT', 1599.90, NULL, NULL, NULL, 0, 1004),
(25, 'FloraLife', 'Buquê de Rosas Vermelhas', 89.90, 'https://via.placeholder.com/150?text=Rosas', '7890000001001', 'Buquê com 12 rosas importadas.', 25, 1005),
(26, 'OrchidArt', 'Orquídea em Vaso Cerâmico', 59.50, 'https://via.placeholder.com/150?text=Orqu%C3%ADdea', '7890000001002', 'Orquídea branca plantada em vaso decorativo.', 15, 1005),
(27, 'BaristaPro', 'Café Espresso Torrado', 29.90, 'https://via.placeholder.com/150?text=Caf%C3%A9+Espresso', '7890000002001', 'Pacote com 250g de café 100% arábica.', 40, 1006),
(28, 'BakerHouse', 'Croissant Integral', 4.50, 'https://via.placeholder.com/150?text=Croissant', '7890000002002', 'Croissant integral, fresco e crocante.', 60, 1006),
(29, 'Penguin', '1984 - George Orwell', 49.90, 'https://via.placeholder.com/150?text=1984', '7890000003001', 'Edição brochura, 328 páginas.', 30, 1007),
(30, 'Saraiva', 'Aprendendo SQL', 79.90, 'https://via.placeholder.com/150?text=SQL', '7890000003002', 'Manual prático de SQL para iniciantes.', 20, 1007),
(31, 'Nike', 'Tênis de Corrida Air Zoom', 399.90, 'https://via.placeholder.com/150?text=Nike+Air+Zoom', '7890000004001', 'Tênis de corrida com amortecimento gel.', 12, 1008),
(32, 'Adidas', 'Legging Fitness', 129.90, 'https://via.placeholder.com/150?text=Legging', '7890000004002', 'Legging de alta compressão e secagem rápida.', 22, 1008),
(33, 'Whiskas', 'Ração Sabor Frango 1kg', 24.90, 'https://via.placeholder.com/150?text=Whiskas', '7890000005001', 'Ração seca para gatos adultos.', 35, 1009),
(34, 'PetSafe', 'Brinquedo Mordedor', 39.90, 'https://via.placeholder.com/150?text=Mordedor', '7890000005002', 'Brinquedo resistente em nylon.', 18, 1009),
(35, 'Levi’s', 'Jeans Skinny', 199.90, 'https://via.placeholder.com/150?text=Jeans', '7890000006001', 'Calça jeans modelo skinny, azul escuro.', 28, 1010),
(36, 'H&M', 'Camisa Social Slim', 129.90, 'https://via.placeholder.com/150?text=Camisa+Slim', '7890000006002', 'Camisa social slim fit, algodão.', 32, 1010),
(37, 'Vick', 'Bálsamo de Ervas 25g', 12.90, 'https://via.placeholder.com/150?text=B%C3%A1lsamo', '7890000007001', 'Alívio de congestão nasal.', 50, 1011),
(38, 'Dove', 'Sabonete Antibacteriano', 4.50, 'https://via.placeholder.com/150?text=Sabonete', '7890000007002', 'Sabonete líquido antibacteriano 200ml.', 45, 1011),
(39, 'McCain', 'Batata Rústica 600g', 14.90, 'https://via.placeholder.com/150?text=Batata', '7890000008001', 'Batata congelada para fritar.', 40, 1012),
(40, 'Heinz', 'Ketchup Tradicional 397g', 8.90, 'https://via.placeholder.com/150?text=Ketchup', '7890000008002', 'Molho de tomate para hambúrguer.', 55, 1012),
(41, 'Logitech', 'Teclado Mecânico MK120', 199.90, 'https://via.placeholder.com/150?text=Teclado', '7890000009001', 'Teclado USB com LEDs azuis.', 20, 1013),
(42, 'Kingston', 'Pendrive 32GB', 49.90, 'https://via.placeholder.com/150?text=Pendrive', '7890000009002', 'USB 3.0, alta velocidade.', 60, 1013),
(43, 'AgroVerde', 'Azeite de Oliva Extra Virgem 500ml', 29.90, 'https://via.placeholder.com/150?text=Azeite', '7890000010001', 'Produzido de forma orgânica.', 25, 1014),
(44, 'Natureza', 'Mel Puro 300g', 19.90, 'https://via.placeholder.com/150?text=Mel', '7890000010002', 'Mel de abelhas sem aditivos.', 30, 1014),
(45, 'GardenJoy', 'Arranjo Mix de Flores Silvestres', 74.90, 'https://via.placeholder.com/150?text=Mix+Silvestre', '7890000001003', 'Arranjo em vaso com flores silvestres variadas.', 18, 1005),
(46, 'TulipaBella', 'Buquê de Tulipas Coloridas', 99.90, 'https://via.placeholder.com/150?text=Tulipas', '7890000001004', '12 tulipas em cores sortidas.', 22, 1005),
(47, 'MoocaCoffee', 'Café em Cápsulas Compatível', 39.90, 'https://via.placeholder.com/150?text=C%C3%A1psulas', '7890000002003', 'Pacote com 10 cápsulas de café forte.', 55, 1006),
(48, 'SweetBites', 'Baguete Francesa', 7.90, 'https://via.placeholder.com/150?text=Baguete', '7890000002004', 'Pão baguete fresco, crocante por fora.', 35, 1006),
(49, 'CompanhiaDasLetras', 'O Pequeno Príncipe', 39.50, 'https://via.placeholder.com/150?text=Pequeno+Pr%C3%ADncipe', '7890000003003', 'Edição ilustrada comemorativa.', 28, 1007),
(50, 'Fontanar', 'Dom Casmurro', 29.90, 'https://via.placeholder.com/150?text=Dom+Casmurro', '7890000003004', 'Clássico de Machado de Assis.', 32, 1007),
(51, 'Reebok', 'Camiseta Dry-Fit', 89.90, 'https://via.placeholder.com/150?text=Camiseta+DryFit', '7890000004003', 'Camiseta esportiva com tecido respirável.', 26, 1008),
(52, 'UnderArmour', 'Short de Corrida', 79.90, 'https://via.placeholder.com/150?text=Short+Corrida', '7890000004004', 'Short leve com bolso para celular.', 19, 1008),
(53, 'RoyalCanin', 'Ração Cães Adultos 3kg', 129.90, 'https://via.placeholder.com/150?text=Royal+Canin', '7890000005003', 'Ração premium para cães adultos.', 20, 1009),
(54, 'Ferplast', 'Casinha para Gatos', 149.90, 'https://via.placeholder.com/150?text=Casinha+Gato', '7890000005004', 'Casinha portátil em tecido.', 10, 1009),
(55, 'Zara', 'Vestido Floral', 189.90, 'https://via.placeholder.com/150?text=Vestido+Floral', '7890000006003', 'Vestido leve com estampa floral.', 24, 1010),
(56, 'Polo', 'Camiseta Polo Básica', 149.90, 'https://via.placeholder.com/150?text=Polo+Shirt', '7890000006004', 'Polo clássica em algodão.', 30, 1010),
(57, 'Neosaldina', 'Composto Analgésico 10cp', 8.90, 'https://via.placeholder.com/150?text=Neosaldina', '7890000007003', 'Analgésico e antitérmico.', 60, 1011),
(58, 'AmbiPur', 'Odorizador de Ambiente 300ml', 19.90, 'https://via.placeholder.com/150?text=AmbiPur', '7890000007004', 'Spray para eliminar odores.', 40, 1011),
(59, 'Ambev', 'Refrigerante 2L', 7.90, 'https://via.placeholder.com/150?text=Refrigerante', '7890000008003', 'Refrigerante cola em garrafa PET.', 70, 1012),
(60, 'Sadia', 'Hambúrguer de Frango 480g', 21.90, 'https://via.placeholder.com/150?text=Hamburguer', '7890000008004', '4 hambúrgueres de frango congelados.', 45, 1012),
(61, 'Dell', 'Monitor Gamer 27\" Curvo', 1299.90, 'https://via.placeholder.com/150?text=Monitor+Curvo', '7890000009003', 'Monitor 144Hz com FreeSync.', 8, 1013),
(62, 'Samsung', 'SSD NVMe 1TB', 599.90, 'https://via.placeholder.com/150?text=SSD+NVMe', '7890000009004', 'SSD interno M.2 PCIe 1TB.', 14, 1013),
(63, 'VivaBem', 'Chá Verde Orgânico 20 saquinhos', 15.90, 'https://via.placeholder.com/150?text=Ch%C3%A1+Verde', '7890000010003', 'Chá verde puro e sem aditivos.', 40, 1014),
(64, 'BioLife', 'Granola Integral 500g', 22.90, 'https://via.placeholder.com/150?text=Granola', '7890000010004', 'Granola com aveia e frutas secas.', 35, 1014),
(66, 'BaristaPro', 'Café Espresso Torrado', 29.90, 'https://via.placeholder.com/150?text=Caf%C3%A9+Espresso', '7890000002001', 'Pacote com 250g de café 100% arábica.', 40, 1009),
(67, 'Penguin', '1984 - George Orwell', 49.90, 'https://via.placeholder.com/150?text=1984', '7890000003001', 'Edição brochura, 328 páginas.', 30, 1005),
(68, 'Levi’s', 'Jeans Skinny', 199.90, 'https://via.placeholder.com/150?text=Jeans', '7890000006001', 'Calça jeans modelo skinny, azul escuro.', 28, 1006),
(69, 'Heinz', 'Ketchup Tradicional 397g', 8.90, 'https://via.placeholder.com/150?text=Ketchup', '7890000008002', 'Molho de tomate para hambúrguer.', 55, 1005),
(70, 'Logitech', 'Teclado Mecânico MK120', 199.90, 'https://via.placeholder.com/150?text=Teclado', '7890000009001', 'Teclado USB com LEDs azuis.', 20, 1007),
(73, 'OrchidArt', 'Orquídea em Vaso Cerâmico', 59.50, 'https://via.placeholder.com/150?text=Orqu%C3%ADdea', '7890000001002', 'Orquídea branca plantada em vaso decorativo.', 15, 1007),
(74, 'BaristaPro', 'Café Espresso Torrado', 29.90, 'https://via.placeholder.com/150?text=Caf%C3%A9+Espresso', '7890000002001', 'Pacote com 250g de café 100% arábica.', 40, 1008),
(75, 'BakerHouse', 'Croissant Integral', 4.50, 'https://via.placeholder.com/150?text=Croissant', '7890000002002', 'Croissant integral, fresco e crocante.', 60, 1009),
(76, 'Penguin', '1984 - George Orwell', 49.90, 'https://via.placeholder.com/150?text=1984', '7890000003001', 'Edição brochura, 328 páginas.', 30, 1010),
(77, 'Saraiva', 'Aprendendo SQL', 79.90, 'https://via.placeholder.com/150?text=SQL', '7890000003002', 'Manual prático de SQL para iniciantes.', 20, 1011),
(78, 'Nike', 'Tênis de Corrida Air Zoom', 399.90, 'https://via.placeholder.com/150?text=Nike+Air+Zoom', '7890000004001', 'Tênis de corrida com amortecimento gel.', 12, 1012),
(79, 'Adidas', 'Legging Fitness', 129.90, 'https://via.placeholder.com/150?text=Legging', '7890000004002', 'Legging de alta compressão e secagem rápida.', 22, 1013),
(80, 'Whiskas', 'Ração Sabor Frango 1kg', 24.90, 'https://via.placeholder.com/150?text=Whiskas', '7890000005001', 'Ração seca para gatos adultos.', 35, 1005),
(81, 'PetSafe', 'Brinquedo Mordedor', 39.90, 'https://via.placeholder.com/150?text=Mordedor', '7890000005002', 'Brinquedo resistente em nylon.', 18, 1006),
(82, 'Levi’s', 'Jeans Skinny', 199.90, 'https://via.placeholder.com/150?text=Jeans', '7890000006001', 'Calça jeans modelo skinny, azul escuro.', 28, 1007),
(83, 'H&M', 'Camisa Social Slim', 129.90, 'https://via.placeholder.com/150?text=Camisa+Slim', '7890000006002', 'Camisa social slim fit, algodão.', 32, 1008),
(84, 'Vick', 'Bálsamo de Ervas 25g', 12.90, 'https://via.placeholder.com/150?text=B%C3%A1lsamo', '7890000007001', 'Alívio de congestão nasal.', 50, 1009),
(85, 'Dove', 'Sabonete Antibacteriano', 4.50, 'https://via.placeholder.com/150?text=Sabonete', '7890000007002', 'Sabonete líquido antibacteriano 200ml.', 45, 1010),
(86, 'McCain', 'Batata Rústica 600g', 14.90, 'https://via.placeholder.com/150?text=Batata', '7890000008001', 'Batata congelada para fritar.', 40, 1011),
(87, 'Heinz', 'Ketchup Tradicional 397g', 8.90, 'https://via.placeholder.com/150?text=Ketchup', '7890000008002', 'Molho de tomate para hambúrguer.', 55, 1012),
(88, 'Logitech', 'Teclado Mecânico MK120', 199.90, 'https://via.placeholder.com/150?text=Teclado', '7890000009001', 'Teclado USB com LEDs azuis.', 20, 1013),
(89, 'Kingston', 'Pendrive 32GB', 49.90, 'https://via.placeholder.com/150?text=Pendrive', '7890000009002', 'USB 3.0, alta velocidade.', 60, 1005),
(90, 'AgroVerde', 'Azeite de Oliva Extra Virgem 500ml', 29.90, 'https://via.placeholder.com/150?text=Azeite', '7890000010001', 'Produzido de forma orgânica.', 25, 1006),
(91, 'Natureza', 'Mel Puro 300g', 19.90, 'https://via.placeholder.com/150?text=Mel', '7890000010002', 'Mel de abelhas sem aditivos.', 30, 1007),
(92, 'GardenJoy', 'Arranjo Mix de Flores Silvestres', 74.90, 'https://via.placeholder.com/150?text=Mix+Silvestre', '7890000001003', 'Arranjo em vaso com flores silvestres variadas.', 18, 1008),
(93, 'FloraLife', 'Buquê de Rosas Vermelhas', 107.88, 'https://via.placeholder.com/150?text=Rosas', '7890000001001', 'Buquê com 12 rosas importadas.', 25, 1006),
(100, NULL, 'produto', 11.00, NULL, NULL, 'nada', 0, 1016),
(101, 'marca1', 'produto2', 20.00, NULL, NULL, 'Nada', 20, 1016),
(102, 'oi', 'p', 1.00, NULL, NULL, 'nada', 1111, 1016),
(103, 'asd', 'as', 1.00, NULL, NULL, 'asd', 4, 1016),
(106, 'p', 'p', 1.00, NULL, 'p', 'p', 1, 1016),
(107, '1', 'Produto computacao', 1.00, NULL, '1', '1', 1, 1016),
(108, '1', 'Produto computacao', 1.00, NULL, '1', '1', 1, 1016),
(109, '1', 'Produto computacao', 1.00, NULL, '1', '1', 1, 1016),
(110, '1', 'Produto computacao', 1.00, NULL, '1', '1', 1, 1016),
(111, '1', 'asd', 1.00, NULL, '1', '1', 1, 1016),
(112, '1', '1', 1.00, NULL, '1', '1', 1, 1016),
(113, '1', '1', 1.00, NULL, '1', '1', 1, 1016),
(114, '1', '1', 1.00, NULL, '1', '2', 2, 1016),
(115, '12', '12', 12.00, NULL, '12', '12', 12, 1016),
(116, 'asd', 'oi', 1.00, NULL, NULL, 'alo', 123123, 1016),
(117, 'qwe', 'que', 123.00, NULL, 'asdasdasdasdasdasdasdadasd', 'qew', 123, 1016),
(118, 'Shoppee', 'Vaso', 100.00, NULL, NULL, 'Vaso legal', 12, 1016),
(119, '123', 'Produto Gente Boa', 123.00, NULL, '123', '123', 123, 1016),
(120, 'asd', 'asdasd1234', 123.00, NULL, 'asd', 'asd', 123, 1016),
(121, 'asd', 'asd12334trfcxv', 123.00, NULL, NULL, 'asd', 123, 1016),
(122, '123', 'asd', 123.00, NULL, NULL, 'sda', 123, 1016),
(123, 'qwe', 'asd1233123254 4365435', 123.00, NULL, '14557', 'qwe', 12353, 1016);

-- --------------------------------------------------------

--
-- Table structure for table `produtos_categorias`
--

CREATE TABLE `produtos_categorias` (
  `produto_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produtos_categorias`
--

INSERT INTO `produtos_categorias` (`produto_id`, `categoria_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(4, 11),
(25, 12),
(26, 12),
(27, 4),
(28, 4),
(29, 5),
(30, 5),
(31, 6),
(32, 6),
(33, 8),
(34, 8),
(35, 7),
(36, 7),
(37, 9),
(38, 9),
(39, 4),
(40, 4),
(41, 10),
(42, 10),
(43, 4),
(44, 4),
(45, 12),
(46, 4),
(47, 5),
(48, 7),
(49, 4),
(50, 10),
(116, 4),
(123, 4);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token`, `device_info`, `ip`, `created_at`, `expires_at`) VALUES
(1, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MDYxNSwiZXhwIjoxNzUzNDQ3MDE1fQ.q8s550HDvISaIrnhpSRiN1HIaNPKqtbwdXUAIpAl3xU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 09:36:55', '2025-07-25 09:36:55'),
(2, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MDY2OSwiZXhwIjoxNzUzNDQ3MDY5fQ.CgPdZgCZYVfCJb9y3f980BQoavqSEptw7S42dVE_I_U', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 09:37:49', '2025-07-25 09:37:49'),
(3, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MjMzMiwiZXhwIjoxNzUzNDQ4NzMyfQ.x5t2XUHxgm2DYToG8y2UcYjHAOs9dKG3FmuDvjBZfR8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 10:05:32', '2025-07-25 10:05:32'),
(4, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MjQxMywiZXhwIjoxNzUzNDQ4ODEzfQ.647EjJCJl51cGi1vv6MIetZimrJc_vsyXrpgLdLYaAk', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 10:06:53', '2025-07-25 10:06:53'),
(5, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MzE3NSwiZXhwIjoxNzUzNDQ5NTc1fQ.GaXLU-u3Mn7Si00lr-sbVAgXbCnPKSu908Espkr28UU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 10:19:35', '2025-07-25 10:19:35'),
(6, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2MzQxNiwiZXhwIjoxNzUzNDQ5ODE2fQ.JHpTlUpqq69l85uCwGcGYNFRfti3oV4JHXXBruQTovU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 10:23:36', '2025-07-25 10:23:36'),
(7, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzM2NDAzNiwiZXhwIjoxNzUzNDUwNDM2fQ.aowvP06Yx2FCrJbXWsT9bl6B45el0F6JefaqL-yzOVw', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-24 10:33:56', '2025-07-25 10:33:56'),
(8, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMTk2OSwiZXhwIjoxNzUzNzA4MzY5fQ.CjrjlFwHHjiYc28OYsEpJZbVnmxzWkXfBJt6Gc2n0VM', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:12:49', '2025-07-28 10:12:49'),
(9, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMzAyMywiZXhwIjoxNzUzNzA5NDIzfQ.Y-6Owe2Z9CCN45H-xjNExiHtPQ3QVwzMcd4e00swle0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:30:23', '2025-07-28 10:30:23'),
(10, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMzExMiwiZXhwIjoxNzUzNzA5NTEyfQ.9s3cfjkhsPyhMp0pXqerKx8lYOTYPkOXASIS8WlivT8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:31:52', '2025-07-28 10:31:52'),
(11, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMzI1MywiZXhwIjoxNzUzNzA5NjUzfQ.TBC02dlFkdyiFZ6HVC-PSfDXiG_GG7pIwe6OmqDOIgs', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:34:13', '2025-07-28 10:34:13'),
(12, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMzYyOSwiZXhwIjoxNzUzNzEwMDI5fQ.dnw04FGdmXnEOUdP-aMIi8fxjwMPs5Y1qG8kB_il20o', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:40:29', '2025-07-28 10:40:29'),
(13, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyMzk2MCwiZXhwIjoxNzUzNzEwMzYwfQ.Mb5JqoEt2xMv0MNI23iGcvPFufKfAT4PvPr4cMXRWpw', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 10:46:00', '2025-07-28 10:46:00'),
(14, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzYyNTM2MCwiZXhwIjoxNzUzNzExNzYwfQ.qPEKBCgdGrVFUDnYggledZM5HxEveGGLgiuDO4yv2Lk', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-27 11:09:20', '2025-07-28 11:09:20'),
(15, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzcxMTg3OSwiZXhwIjoxNzUzNzk4Mjc5fQ.X5Qd75xvkrOHVdOYoxwSJJXSs6YQa06Wam0SjsludKg', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-28 11:11:19', '2025-07-29 11:11:19'),
(16, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzcxMjA4OSwiZXhwIjoxNzUzNzk4NDg5fQ.kNZg91yW0Xsf52hD3qNeWK60_qdiKAddiFKsiryK-9w', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-28 11:14:49', '2025-07-29 11:14:49'),
(17, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MzcxMzcyMSwiZXhwIjoxNzUzODAwMTIxfQ.U-wbgRhdkcRJTDIacV5dNrxVZDrN1pFx799RrqW3Oj8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-28 11:42:01', '2025-07-29 11:42:01'),
(18, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5MjA2NiwiZXhwIjoxNzUzODc4NDY2fQ.yqco4t6PP7rFWZoU_9rnFSqCBvJVtHQ5bM5hgo98BDE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:27:46', '2025-07-30 09:27:46'),
(21, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5MjIxNiwiZXhwIjoxNzUzODc4NjE2fQ.Ywe92mtIMjObo4RLACTM87GAXZNbbZ9P0BFtUgBdexQ', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:30:16', '2025-07-30 09:30:16'),
(23, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5MjgwMCwiZXhwIjoxNzUzODc5MjAwfQ.0k30I6Fo5kwMid91ejhSRmkbd6nGcQUR_MuFJZDNtek', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:40:00', '2025-07-30 09:40:00'),
(24, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5MjgwNCwiZXhwIjoxNzUzODc5MjA0fQ.RW92FoQ3ZQPE3cZTLK0ROZnnLntdEkA6jpOQfFTlN2w', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:40:04', '2025-07-30 09:40:04'),
(25, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5NDEwMywiZXhwIjoxNzUzODgwNTAzfQ.n97CbDfyE4P-z7gp_7PERkB30xJA0KwrJenbyX_TOyk', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:01:43', '2025-07-30 10:01:43'),
(26, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5NDEzNCwiZXhwIjoxNzUzODgwNTM0fQ.p7bJ7CVV8eS7r0n2ZbZM2ZBqJpxF9SdQbk-pa50ckAY', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:02:14', '2025-07-30 10:02:14'),
(27, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzc5NDcwNiwiZXhwIjoxNzUzODgxMTA2fQ.QY4G0DZGRhw2Dz-gn7HShhy5TIYQemlBnxW7D3wxRq4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:11:46', '2025-07-30 10:11:46'),
(28, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzg4MDQ3NCwiZXhwIjoxNzUzOTY2ODc0fQ.HBPmjD4xxVRdu4RHtrvbZ3xgE-i3XKiroZrN9S2x9qU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-30 10:01:14', '2025-07-31 10:01:14'),
(29, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1Mzg4MDQ4NiwiZXhwIjoxNzUzOTY2ODg2fQ.aOTn6HU5_jfPh2S-cQy5KQp2ER46JieBBu6z7Qni_rk', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-30 10:01:26', '2025-07-31 10:01:26'),
(30, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTI2Njg1NywiZXhwIjoxNzU1MzUzMjU3fQ.MeJzvk65RrXJjisUpM2pFoYJJnbQwX3KXH5Xhe3vwPA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-15 11:07:37', '2025-08-16 11:07:37'),
(31, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTI2NzM4MiwiZXhwIjoxNzU1MzUzNzgyfQ.AazTHpZcT2u2DRckWubcSZuAAmFgtWGtZdFgCBPs4WE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-15 11:16:22', '2025-08-16 11:16:22'),
(32, 1003, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZW1haWwiOiJqb2hhbm4uYmF1ZXJAZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiBCYXVlcm1hbm4iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTI2ODM5NSwiZXhwIjoxNzU1MzU0Nzk1fQ.cQehKDMdzXIfrVIVsBjbvkxlblq8mR6zhB1kxUFs904', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-15 11:33:15', '2025-08-16 11:33:15'),
(33, 1008, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwOCwiZW1haWwiOiJhYWFAZ21haWwuY29tIiwibm9tZSI6ImFhYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU2Njc4MDY5LCJleHAiOjE3NTY3NjQ0Njl9.JK7y6UDtebMVAPutERiWtMebwQB0U6t3WRXkxbb-gYQ', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-31 19:07:49', '2025-09-01 19:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `sessions_comercios`
--

CREATE TABLE `sessions_comercios` (
  `id` int(11) NOT NULL,
  `comercio_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `device_info` text DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions_comercios`
--

INSERT INTO `sessions_comercios` (`id`, `comercio_id`, `token`, `device_info`, `ip`, `created_at`, `expires_at`) VALUES
(1, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5Mjc4OCwiZXhwIjoxNzUzODc5MTg4fQ.K4vFt0AzCVy0Mrud6NI2Gw2ALzsPm_NZ00vFiQfJOs0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:39:48', '2025-07-30 09:39:48'),
(2, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5Mjg0OSwiZXhwIjoxNzUzODc5MjQ5fQ.-lmbtt52XekSVke9SOvRlWw0NMvvaybLvReAHWxH09g', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:40:49', '2025-07-30 09:40:49'),
(3, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5Mjg1MSwiZXhwIjoxNzUzODc5MjUxfQ.h3PJU0TKyeQ699ITzAUMwlmoj_JkwVeXwE6Sr0Bzx8k', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:40:51', '2025-07-30 09:40:51'),
(4, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5Mjg2NiwiZXhwIjoxNzUzODc5MjY2fQ.bAj8nyh4HmcCsde6XWpqzZV64o8YuUUWL__qaHYt2uU', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:41:06', '2025-07-30 09:41:06'),
(5, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5Mjg3MCwiZXhwIjoxNzUzODc5MjcwfQ.fNDj3wk-gs9CQdGfhwIqRkU72opB4_ZfruVB2FP9QZA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:41:10', '2025-07-30 09:41:10'),
(6, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5MzA4NSwiZXhwIjoxNzUzODc5NDg1fQ.irbZZlAyh2ZzGFOOtUqOeWC1hRu88YukdikAp8EUBE4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:44:45', '2025-07-30 09:44:45'),
(7, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5MzA5MCwiZXhwIjoxNzUzODc5NDkwfQ.ECdfHDKaeUA7p4vpH2XlQcdPDb24HAzDQ5xPQv4JGAk', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 09:44:50', '2025-07-30 09:44:50'),
(8, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5NDA3OSwiZXhwIjoxNzUzODgwNDc5fQ.FkwXhOXUk5rDPJH3VTINjsHQYpPFA3-ei1q-4r5pUEA', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:01:19', '2025-07-30 10:01:19'),
(9, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5NDEyMywiZXhwIjoxNzUzODgwNTIzfQ.4e0y0RlfYfNxIJKB8wvtANR3ls1PRu3XqkMvbEa468w', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:02:03', '2025-07-30 10:02:03'),
(10, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5NDY5OSwiZXhwIjoxNzUzODgxMDk5fQ.IMeAppY8sIAiL4N_RiUgX4-cmEhjwFPKsA26AAFZ7VE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:11:39', '2025-07-30 10:11:39'),
(11, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5NDcwOSwiZXhwIjoxNzUzODgxMTA5fQ.uf74WpKFosCJjd2On8uWYsUCrpqsakh8aH7fKemKixo', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:11:49', '2025-07-30 10:11:49'),
(12, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzc5NTM0MiwiZXhwIjoxNzUzODgxNzQyfQ.zgaEkj7um04IC6wNQmzgjuOnqgQglECCEoLFzpbfmu4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-29 10:22:22', '2025-07-30 10:22:22'),
(13, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzg4MDUwNywiZXhwIjoxNzUzOTY2OTA3fQ.RR9d28LQ2GYaVhCS7JfSuPBb7byA2DySv9q267NlHRI', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-30 10:01:47', '2025-07-31 10:01:47'),
(14, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzg4MTQ4NCwiZXhwIjoxNzUzOTY3ODg0fQ.5I2ybtA6bAFeK4Fsj8XJIe9EooY49EUPaSzXWjq3BDw', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-30 10:18:04', '2025-07-31 10:18:04'),
(15, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzk4NDkzMywiZXhwIjoxNzU0MDcxMzMzfQ.iqZmkbk0exCIeu-YeHowh-lYDgvlvL5aqs-mWe2rv8I', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-31 15:02:13', '2025-08-01 15:02:13'),
(16, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzk4NTQxNCwiZXhwIjoxNzU0MDcxODE0fQ.Gus1hkPYxA801SwpYWTFv9usSFyZHPXnpkrmsz8licY', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-31 15:10:14', '2025-08-01 15:10:14'),
(17, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzk4NTQ5NiwiZXhwIjoxNzU0MDcxODk2fQ.5KQ8Jow2Cy9ZivE3VJvC9YSdrnWiAMoWAAhWXBw9AMc', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-31 15:11:36', '2025-08-01 15:11:36'),
(18, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1Mzk4NTUzMiwiZXhwIjoxNzU0MDcxOTMyfQ.F7WyO4qbU3YP3Y8c7lsQrgSSm7Q05SeA4tuhgW9N_ZE', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-07-31 15:12:12', '2025-08-01 15:12:12'),
(19, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1NTI2Njg1MCwiZXhwIjoxNzU1MzUzMjUwfQ.sYHlazhN8VaZnlH3LToy8SHxZEtZSPZv0WXjr1OEm7c', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-15 11:07:30', '2025-08-16 11:07:30'),
(20, 1016, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNiwiZW1haWwiOiJqb2hhbm5AZ21haWwuY29tIiwibm9tZSI6IkpvaGFubiIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1NjY3NjcyOCwiZXhwIjoxNzU2NzYzMTI4fQ.1X8ZXBPhIF36NgOpK6sscGlhAWXKv5R-pfCNDrpPoIs', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-31 18:45:28', '2025-09-01 18:45:28'),
(21, 1017, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxNywiZW1haWwiOiJhc2RAZ21haWwuY29tIiwibm9tZSI6IkFTRCIsInJvbGUiOiJjb21tZXJjZSIsImlhdCI6MTc1NjY3Njc3MiwiZXhwIjoxNzU2NzYzMTcyfQ.ZjV5E9ohuTDb3Q_4BVokvtxTvJBXLRtlw-epb2cTMeg', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0 (Edition std-2)', '::1', '2025-08-31 18:46:12', '2025-09-01 18:46:12');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `cidade`, `nome`, `senha`, `telefone`, `foto_perfil`) VALUES
(1, 'johann.sbauermann@gmail.com', 'Porto Alegre', 'Johann Schultz Bauermann', 'Johann@08022008', '19999865667', NULL),
(2, 'teste@teste.com', 'São Paulo', 'João Teste', '$2b$10$R9seRGEeMxunJZW7FSVSSuFiAGGikGnWypqAJVXLPRvG0Iv7WbhHe\r\n', '', NULL),
(3, 'martin@gmail.com', 'Nova York', 'Martin', 'Martin', '19999999999', NULL),
(1003, 'johann.bauer@gmail.com', 'Engenheiro Coelho', 'Johann Bauermann', '$2b$10$gZne9k0Yp9KXIOvgCbLteO2PT1I22RZVnSM3wAU/H31xLePUuo6nW', '(19) 99769-1375', NULL),
(1004, 'oi@eamil.com', NULL, 'OI', '$2b$10$7KrXMfJqV8B7Kk061tAe3OZY6ktihHt4zF68iprw6utHdyT0p592q', '', NULL),
(1005, 'ola@gmail.com', NULL, 'ola', '$2b$10$ojsllSAUbY/poh7PzvSOMOFUICkF9SA24SuuOG2tnvV8miTZ7yQ0W', '', NULL),
(1006, 'aA@sadfdsa', NULL, 'asdasd', '$2b$10$5FlCbki8Q4ye8snm5YQfTu4MlwiNButpdL9mWDjY6fDGlL9iW7Xrq', '', NULL),
(1007, 'solana@gmail.com', NULL, 'Solana Nah', '$2b$10$flQ1tNAH3qpP3ps4lV8yLe7CasSX10CNA6ibGL6j/nrTKSLEsGjEm', '', NULL),
(1008, 'aaa@gmail.com', NULL, 'aaa', '$2b$10$OHfj6V8sRtGazqrJAZegRuQKt6Mk44jKzQOYMx49qfCxjqZZd9UTy', '19997691375', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avaliacoescomercio`
--
ALTER TABLE `avaliacoescomercio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `comercio_id` (`comercio_id`);

--
-- Indexes for table `avaliacoesproduto`
--
ALTER TABLE `avaliacoesproduto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `produto_id` (`produto_id`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_chats_cliente_loja` (`cliente_id`,`loja_id`);

--
-- Indexes for table `comercios`
--
ALTER TABLE `comercios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `fotos_produto`
--
ALTER TABLE `fotos_produto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produto_id` (`produto_id`);

--
-- Indexes for table `mensagens`
--
ALTER TABLE `mensagens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`);

--
-- Indexes for table `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comercio_produto` (`comercio_id`);

--
-- Indexes for table `produtos_categorias`
--
ALTER TABLE `produtos_categorias`
  ADD PRIMARY KEY (`produto_id`,`categoria_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions_comercios`
--
ALTER TABLE `sessions_comercios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comercio_id` (`comercio_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `avaliacoescomercio`
--
ALTER TABLE `avaliacoescomercio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `avaliacoesproduto`
--
ALTER TABLE `avaliacoesproduto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comercios`
--
ALTER TABLE `comercios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1018;

--
-- AUTO_INCREMENT for table `fotos_produto`
--
ALTER TABLE `fotos_produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `mensagens`
--
ALTER TABLE `mensagens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `sessions_comercios`
--
ALTER TABLE `sessions_comercios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1009;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `avaliacoescomercio`
--
ALTER TABLE `avaliacoescomercio`
  ADD CONSTRAINT `avaliacoescomercio_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `avaliacoescomercio_ibfk_2` FOREIGN KEY (`comercio_id`) REFERENCES `comercios` (`id`);

--
-- Constraints for table `avaliacoesproduto`
--
ALTER TABLE `avaliacoesproduto`
  ADD CONSTRAINT `avaliacoesproduto_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `avaliacoesproduto_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`);

--
-- Constraints for table `fotos_produto`
--
ALTER TABLE `fotos_produto`
  ADD CONSTRAINT `fotos_produto_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mensagens`
--
ALTER TABLE `mensagens`
  ADD CONSTRAINT `mensagens_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `fk_comercio_produto` FOREIGN KEY (`comercio_id`) REFERENCES `comercios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produtos_categorias`
--
ALTER TABLE `produtos_categorias`
  ADD CONSTRAINT `produtos_categorias_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`),
  ADD CONSTRAINT `produtos_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions_comercios`
--
ALTER TABLE `sessions_comercios`
  ADD CONSTRAINT `sessions_comercios_ibfk_1` FOREIGN KEY (`comercio_id`) REFERENCES `comercios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
