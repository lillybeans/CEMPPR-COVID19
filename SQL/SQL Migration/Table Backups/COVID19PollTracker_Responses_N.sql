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
-- Table structure for table `Responses_N`
--

DROP TABLE IF EXISTS `Responses_N`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Responses_N` (
  `Response_ID` int DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `Is_this_question_for_an_existing_survey` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Existing_Survey_s_Poll_Name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Polling_Group` varchar(27) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Poll_Name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Publication_Date` datetime DEFAULT NULL,
  `Start_Date` datetime DEFAULT NULL,
  `End_Date` datetime DEFAULT NULL,
  `Sample_Size` int DEFAULT NULL,
  `Sample_Method` varchar(23) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Type_of_Study` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Country` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Sub_National` varchar(45) DEFAULT NULL,
  `Population` varchar(29) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Your_Initial` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `URL_of_Survey` varchar(148) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Use_the_same_sample_size` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Survey_Item` varchar(9) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Theme` varchar(22) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Group` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Keywords` varchar(73) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Question` varchar(498) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Option_A` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `A` decimal(3,1) DEFAULT NULL,
  `Option_B` varchar(220) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `B` decimal(3,1) DEFAULT NULL,
  `Option_C` varchar(137) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `C` decimal(3,1) DEFAULT NULL,
  `Option_D` varchar(124) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `D` decimal(3,1) DEFAULT NULL,
  `Option_E` varchar(119) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `E` decimal(3,1) DEFAULT NULL,
  `Option_F` varchar(95) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `F` decimal(3,1) DEFAULT NULL,
  `Option_G` varchar(79) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `G` decimal(3,1) DEFAULT NULL,
  `Option_H` varchar(26) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `H` decimal(3,1) DEFAULT NULL,
  `Option_I` varchar(23) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `I` int DEFAULT NULL,
  `Option_J` varchar(23) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `J` int DEFAULT NULL,
  `Column_44` int DEFAULT NULL,
  `Additional_Options` varchar(113) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  KEY `idx_Responses_Question_ID` (`Response_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Responses_N`
--

LOCK TABLES `Responses_N` WRITE;
/*!40000 ALTER TABLE `Responses_N` DISABLE KEYS */;
/*!40000 ALTER TABLE `Responses_N` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-02 16:46:41
