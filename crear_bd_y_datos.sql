CREATE DATABASE  IF NOT EXISTS `gestion_recursos_audiovisuales` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_recursos_audiovisuales`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_recursos_audiovisuales
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias_recurso`
--

DROP TABLE IF EXISTS `categorias_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_recurso` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_recurso`
--

LOCK TABLES `categorias_recurso` WRITE;
/*!40000 ALTER TABLE `categorias_recurso` DISABLE KEYS */;
INSERT INTO `categorias_recurso` VALUES (1,'Proyección'),(2,'Audio'),(3,'Grabación'),(4,'Computación');
/*!40000 ALTER TABLE `categorias_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_solicitud`
--

DROP TABLE IF EXISTS `detalle_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_solicitud` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `id_recurso` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_recurso` (`id_recurso`),
  CONSTRAINT `detalle_solicitud_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_prestamo` (`id_solicitud`),
  CONSTRAINT `detalle_solicitud_ibfk_2` FOREIGN KEY (`id_recurso`) REFERENCES `recursos_audiovisuales` (`id_recurso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_solicitud`
--

LOCK TABLES `detalle_solicitud` WRITE;
/*!40000 ALTER TABLE `detalle_solicitud` DISABLE KEYS */;
INSERT INTO `detalle_solicitud` VALUES (1,1,1),(2,1,2),(3,1,3);
/*!40000 ALTER TABLE `detalle_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devoluciones`
--

DROP TABLE IF EXISTS `devoluciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devoluciones` (
  `id_devolucion` int NOT NULL AUTO_INCREMENT,
  `fecha_devolucion` date NOT NULL,
  `id_solicitud` int NOT NULL,
  `observacion` text,
  PRIMARY KEY (`id_devolucion`),
  KEY `id_solicitud` (`id_solicitud`),
  CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_prestamo` (`id_solicitud`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devoluciones`
--

LOCK TABLES `devoluciones` WRITE;
/*!40000 ALTER TABLE `devoluciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `devoluciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_recurso`
--

DROP TABLE IF EXISTS `estados_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_recurso` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_recurso`
--

LOCK TABLES `estados_recurso` WRITE;
/*!40000 ALTER TABLE `estados_recurso` DISABLE KEYS */;
INSERT INTO `estados_recurso` VALUES (1,'Disponible'),(2,'Prestado'),(3,'En mantenimiento'),(4,'Fuera de servicio');
/*!40000 ALTER TABLE `estados_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_solicitud`
--

DROP TABLE IF EXISTS `estados_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_solicitud` (
  `id_estado_solicitud` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_estado_solicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_solicitud`
--

LOCK TABLES `estados_solicitud` WRITE;
/*!40000 ALTER TABLE `estados_solicitud` DISABLE KEYS */;
INSERT INTO `estados_solicitud` VALUES (1,'Pendiente'),(2,'Aprobada'),(3,'Rechazada'),(4,'Devuelta'),(5,'Devuelta'),(6,'Cancelada');
/*!40000 ALTER TABLE `estados_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_estados`
--

DROP TABLE IF EXISTS `historial_estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_estados` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `id_estado_solicitud` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_estado_solicitud` (`id_estado_solicitud`),
  CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_prestamo` (`id_solicitud`),
  CONSTRAINT `historial_estados_ibfk_2` FOREIGN KEY (`id_estado_solicitud`) REFERENCES `estados_solicitud` (`id_estado_solicitud`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_estados`
--

LOCK TABLES `historial_estados` WRITE;
/*!40000 ALTER TABLE `historial_estados` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos_audiovisuales`
--

DROP TABLE IF EXISTS `recursos_audiovisuales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos_audiovisuales` (
  `id_recurso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `id_categoria` int NOT NULL,
  `id_estado` int NOT NULL,
  PRIMARY KEY (`id_recurso`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `recursos_audiovisuales_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_recurso` (`id_categoria`),
  CONSTRAINT `recursos_audiovisuales_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados_recurso` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos_audiovisuales`
--

LOCK TABLES `recursos_audiovisuales` WRITE;
/*!40000 ALTER TABLE `recursos_audiovisuales` DISABLE KEYS */;
INSERT INTO `recursos_audiovisuales` VALUES (1,'Proyector Epson','Proyector para presentaciones',1,1),(2,'Notebook Lenovo','Notebook para apoyo audiovisual',4,1),(3,'Micrófono Inalámbrico','Micrófono para charlas',2,2),(4,'Cámara Sony','Cámara para grabación',3,1),(5,'Parlante JBL','Parlante portátil para actividades',2,1),(7,' Televisor UHD para presentaciones',' Televisor UHD para presentaciones',1,1),(8,'Focos','Focos led para iluminacion',3,1);
/*!40000 ALTER TABLE `recursos_audiovisuales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Usuario'),(2,'Administrador');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_prestamo`
--

DROP TABLE IF EXISTS `solicitudes_prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_prestamo` (
  `id_solicitud` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `id_usuario` int NOT NULL,
  `id_estado_solicitud` int NOT NULL,
  `tipo_actividad` varchar(100) DEFAULT NULL,
  `cantidad_personas` int DEFAULT NULL,
  `id_recurso` int DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado_solicitud` (`id_estado_solicitud`),
  KEY `fk_solicitud_recurso` (`id_recurso`),
  CONSTRAINT `fk_solicitud_recurso` FOREIGN KEY (`id_recurso`) REFERENCES `recursos_audiovisuales` (`id_recurso`),
  CONSTRAINT `solicitudes_prestamo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `solicitudes_prestamo_ibfk_2` FOREIGN KEY (`id_estado_solicitud`) REFERENCES `estados_solicitud` (`id_estado_solicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_prestamo`
--

LOCK TABLES `solicitudes_prestamo` WRITE;
/*!40000 ALTER TABLE `solicitudes_prestamo` DISABLE KEYS */;
INSERT INTO `solicitudes_prestamo` VALUES (1,'2026-06-01','2026-06-01',1,2,'Clase',30,NULL),(2,'2026-06-01','2026-06-01',1,3,NULL,NULL,NULL),(4,'2026-05-13','2026-05-15',1,3,NULL,NULL,NULL),(5,'2026-05-13','2026-05-15',1,3,NULL,NULL,NULL),(6,'2026-05-13','2026-05-15',1,3,NULL,NULL,NULL),(7,'2026-05-13','2026-05-15',1,3,NULL,NULL,NULL),(8,'2026-05-13','2026-05-15',1,3,NULL,NULL,NULL),(9,'2026-05-13','2026-05-15',2,3,NULL,NULL,NULL),(10,'2026-05-13','2026-05-15',2,3,NULL,NULL,NULL),(11,'2026-05-13','2026-05-15',2,3,NULL,NULL,NULL),(12,'2026-05-13','2026-05-15',2,3,NULL,NULL,NULL),(13,'2026-05-13','2026-05-15',2,3,NULL,NULL,NULL),(14,'2026-05-13','2026-05-15',2,4,NULL,NULL,1),(15,'2026-05-13','2026-05-15',2,4,NULL,NULL,1),(16,'2026-05-13','2026-05-15',2,4,NULL,NULL,2),(17,'2026-05-13','2026-05-15',2,3,NULL,NULL,3),(18,'2026-05-15','2026-05-17',3,2,NULL,NULL,3);
/*!40000 ALTER TABLE `solicitudes_prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@demo.cl','123456',1),(2,'Usuario Prueba','usuario@demo.cl','123456',2),(3,'juan','juan@demo.cl','002026',2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 19:07:15
