-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: localhost    Database: COVID19PollTracker
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `Question_Keywords`
--

DROP TABLE IF EXISTS `Question_Keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Question_Keywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `keyword` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=332 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Question_Keywords`
--

LOCK TABLES `Question_Keywords` WRITE;
/*!40000 ALTER TABLE `Question_Keywords` DISABLE KEYS */;
INSERT INTO `Question_Keywords` VALUES (1,1,'Fear'),(2,2,'Trust'),(3,3,'Economics'),(4,4,'Science'),(5,5,'Illness'),(6,6,'Illness'),(7,7,'Healthcare'),(8,8,'Trust'),(9,8,'News'),(10,9,'Social Media'),(11,10,'Social Media'),(12,11,'Social Media'),(13,12,'Science'),(14,13,'Self-isolation'),(15,14,'Self-isolation'),(16,15,'Travel'),(17,16,'Physical Distancing'),(18,17,'Physical Distancing'),(19,18,'Hygiene'),(20,19,'Healthcare'),(21,20,'Self-isolation'),(22,21,'Self-isolation'),(23,22,'School'),(24,23,'Science'),(25,24,'Illness'),(26,25,'Illness'),(27,26,'Healthcare'),(28,27,'Trust'),(29,27,'News'),(30,28,'Social Media'),(31,29,'Social Media'),(32,30,'Social Media'),(33,31,'Science'),(34,32,'Self-isolation'),(35,33,'Self-isolation'),(36,34,'Travel'),(37,35,'Physical Distancing'),(38,36,'Physical Distancing'),(39,37,'Hygiene'),(40,38,'Healthcare'),(41,39,'Self-isolation'),(42,40,'Self-isolation'),(43,41,'School'),(44,42,'Fear'),(45,43,'Fear'),(46,43,'Economics'),(47,44,'Trust'),(48,45,'Travel'),(49,46,'Testing'),(50,47,'Economics'),(51,48,'Politics'),(52,48,'Trust'),(53,49,'Politics'),(54,49,'Trust'),(55,50,'Trust'),(56,51,'Trust'),(57,52,'Trust'),(58,52,'Healthcare'),(59,53,'Vaccine'),(60,54,'Vaccine'),(61,55,'Trust'),(62,56,'Fear'),(63,57,'Spread'),(64,58,'Spread'),(65,59,'Testing'),(66,60,'Food'),(67,60,'Self-isolation'),(68,61,'Food'),(69,62,'Travel'),(70,63,'Physical Distancing'),(71,64,'Employment'),(72,65,'Employment'),(73,66,'Trust'),(74,67,'Trust'),(75,68,'Trust'),(76,69,'Trust'),(77,70,'Fear'),(78,71,'Illness'),(79,71,'Fear'),(80,72,'Illness'),(81,72,'Fear'),(82,73,'Fear'),(83,74,'Illness'),(84,75,'Illness'),(85,76,'Illness'),(86,77,'Illness'),(87,78,'Illness'),(88,79,'Physical Distancing'),(89,80,'Physical Distancing'),(90,81,'Physical Distancing'),(91,82,'Physical Distancing'),(92,82,'Food'),(93,83,'Employment'),(94,84,'Food'),(95,85,'Self-isolation'),(96,86,'Employment'),(97,87,'Employment'),(98,88,'Employment'),(99,89,'Employment'),(100,90,'Economics'),(101,90,'Employment'),(102,91,'Economics'),(103,91,'Employment'),(104,92,'Physical Distancing'),(105,92,'Laws'),(106,92,'Testing'),(107,93,'Return to Normal'),(108,94,'Family'),(109,94,'Physical Distancing'),(110,95,'Physical Distancing'),(111,96,'Spread'),(112,97,'Fear'),(113,97,'Spread'),(114,98,'Trust'),(115,99,'Laws'),(116,100,'Economics'),(117,101,'Politics'),(118,102,'Fear'),(119,103,'Fear'),(120,104,'Fear'),(121,105,'Fear'),(122,106,'Fear'),(123,107,'Mental Health'),(124,108,'Mental Health'),(125,109,'Mental Health'),(126,110,'Mental Health'),(127,111,'Mental Health'),(128,112,'Mental Health'),(129,113,'Mental Health'),(130,114,'Mental Health'),(131,115,'News'),(132,115,'Spread'),(133,115,'Mental Health'),(134,116,'Politics'),(135,117,'Vaccine'),(136,118,'Healthcare'),(137,119,'Physical Distancing'),(138,119,'Hygiene'),(139,120,'Trust'),(140,121,'Trust'),(141,122,'Trust'),(142,123,'Trust'),(143,124,'Trust'),(144,125,'Trust'),(145,125,'News'),(146,126,'Trust'),(147,127,'Trust'),(148,127,'Family'),(149,128,'News'),(150,129,'News'),(151,130,'Physical Distancing'),(152,131,'Physical Distancing'),(153,131,'Family'),(154,132,'Fear'),(155,132,'Illness'),(156,133,'Physical Distancing'),(157,134,'Physical Distancing'),(158,134,'Self-isolation'),(159,135,'Return to Normal'),(160,136,'Testing'),(161,137,'Post-secondary education'),(162,137,'School'),(163,138,'Post-secondary education'),(164,138,'School'),(165,139,'Employment'),(166,140,'News'),(167,141,'Economics'),(168,142,'Physical Distancing'),(169,143,'Testing'),(170,144,'Economics'),(171,145,'Fear'),(172,146,'Family'),(173,147,'Politics'),(174,148,'Trust'),(175,148,'Politics'),(176,149,'Trust'),(177,149,'Politics'),(178,150,'Trust'),(179,150,'Politics'),(180,151,'Trust'),(181,151,'Politics'),(182,152,'Trust'),(183,152,'Politics'),(184,153,'Trust'),(185,153,'Politics'),(186,154,'Trust'),(187,154,'Politics'),(188,155,'Trust'),(189,155,'Politics'),(190,156,'Trust'),(191,156,'Politics'),(192,157,'Trust'),(193,158,'Trust'),(194,159,'Testing'),(195,160,'Spread'),(196,161,'Science'),(197,162,'Science'),(198,163,'Hospitals'),(199,164,'Economics'),(200,165,'Trust'),(201,166,'Physical Distancing'),(202,167,'Physical Distancing'),(203,168,'Spread'),(204,169,'Trust'),(205,170,'Economics'),(206,171,'Economics'),(207,172,'Economics'),(208,173,'Economics'),(209,174,'Economics'),(210,175,'Economics'),(211,176,'Economics'),(212,177,'Economics'),(213,178,'Economics'),(214,179,'Economics'),(215,180,'Economics'),(216,181,'Economics'),(217,182,'Economics'),(218,183,'Economics'),(219,184,'Economics'),(220,185,'Economics'),(221,186,'Economics'),(222,187,'Economics'),(223,188,'Economics'),(224,189,'Economics'),(225,190,'Economics'),(226,191,'Economics'),(227,192,'Economics'),(228,193,'Economics'),(229,194,'Economics'),(230,195,'Economics'),(231,196,'Economics'),(232,197,'Economics'),(233,198,'Economics'),(234,199,'Economics'),(235,200,'Economics'),(236,201,'Economics'),(237,202,'Economics'),(238,203,'Economics'),(239,204,'Economics'),(240,205,'Illness'),(241,206,'Testing'),(242,206,'Illness'),(243,207,'Testing'),(244,208,'News'),(245,208,'Media'),(246,209,'News'),(247,209,'Media'),(248,210,'Physical Distancing'),(249,210,'Self-isolation'),(250,211,'Physical Distancing'),(251,212,'Physical Distancing'),(252,213,'Illness'),(253,214,'School'),(254,214,'Spread'),(255,214,'Laws'),(256,214,'Post-secondary education'),(257,215,'Restaurants'),(258,215,'Laws'),(259,216,'Laws'),(260,216,'Physical Distancing'),(261,217,'Food'),(262,218,'Employment'),(263,219,'Illness'),(264,220,'Testing'),(265,220,'Illness'),(266,221,'Testing'),(267,221,'Illness'),(268,222,'News'),(269,222,'Media'),(270,223,'News'),(271,223,'Media'),(272,224,'Physical Distancing'),(273,224,'Self-isolation'),(274,225,'Physical Distancing'),(275,226,'Physical Distancing'),(276,227,'Illness'),(277,228,'School'),(278,228,'Spread'),(279,228,'Laws'),(280,228,'Post-secondary education'),(281,229,'Restaurants'),(282,229,'Laws'),(283,230,'Laws'),(284,230,'Physical Distancing'),(285,231,'Food'),(286,232,'Employment'),(287,233,'Spread'),(288,233,'Illness'),(289,233,'Fear'),(290,234,'Politics'),(291,235,'Politics'),(292,236,'Politics'),(293,236,'Trust'),(294,237,'Politics'),(295,238,'Spread'),(296,238,'Illness'),(297,239,'Physical Distancing'),(298,239,'Self-isolation'),(299,239,'Travel'),(300,240,'Fear'),(301,240,'Illness'),(302,241,'Testing'),(303,241,'Healthcare'),(304,242,'Healthcare'),(305,242,'Economics'),(306,243,'Food'),(307,243,'Hygiene'),(308,244,'Return to Normal'),(309,245,'Economics'),(310,245,'Politics'),(311,246,'Fear'),(312,246,'Trust'),(313,247,'Social Media'),(314,247,'Politics'),(315,247,'News'),(316,248,'Trust'),(317,248,'Fear'),(318,248,'News'),(319,249,'Physical Distancing'),(320,249,'Spread'),(321,250,'Fear'),(322,250,'Healthcare'),(323,250,'Employment'),(324,250,'Economics'),(325,250,'Illness'),(326,251,'Economics'),(327,251,'Healthcare'),(328,251,'Hygiene'),(329,251,'Return to Normal'),(330,252,'Fear'),(331,252,'Illness');
/*!40000 ALTER TABLE `Question_Keywords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-02 16:46:42
