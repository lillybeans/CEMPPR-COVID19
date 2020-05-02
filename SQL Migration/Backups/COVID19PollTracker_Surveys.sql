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
-- Table structure for table `Surveys`
--

DROP TABLE IF EXISTS `Surveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `polling_group` varchar(45) DEFAULT NULL,
  `poll_name` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `subnational` varchar(45) DEFAULT NULL,
  `population` varchar(45) DEFAULT NULL,
  `language` varchar(45) DEFAULT NULL,
  `sample_size` int DEFAULT NULL,
  `sample_method` varchar(45) DEFAULT NULL,
  `type_of_study` varchar(45) DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  `publication_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `updated_at` varchar(45) NOT NULL,
  `updated_by` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Surveys`
--

LOCK TABLES `Surveys` WRITE;
/*!40000 ALTER TABLE `Surveys` DISABLE KEYS */;
INSERT INTO `Surveys` VALUES (1,'Gallup News Service','Gallup_Feb20','United States','N/A','Nationally Representative',NULL,1028,'Random digit dial','One-time','https://news.gallup.com/file/poll/286388/200219CoronaVirus.pdf','2020-02-20 00:00:00','2020-02-03 00:00:00','2020-02-16 00:00:00','2020-04-01 00:00:00','TP','2020-04-01','TP'),(2,'CUNY SPH','CUNY(State)_Mar16','United States','New York State','Locally Representative',NULL,1000,'RDD + SMS + Online','One-time','https://sph.cuny.edu/research/covid-19-tracking-survey/week-1/','2020-03-16 00:00:00','2020-03-13 00:00:00','2020-03-15 00:00:00','2020-04-01 00:00:00','DG?','2020-04-01','DG?'),(3,'CUNY SPH','CUNY(City)_Mar16','United States','New York City','Locally Representative',NULL,1000,'RDD + SMS + Online','One-time','https://sph.cuny.edu/research/covid-19-tracking-survey/week-1/','2020-03-16 00:00:00','2020-03-13 00:00:00','2020-03-15 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(4,'Leger','Leger_Mar19','Canada','N/A','Nationally Representative',NULL,1538,'Web Survey','One-time','https://leger360.com/surveys/concerns-about-covid-19-march-19-2020/','2020-03-19 00:00:00','2020-03-13 00:00:00','2020-03-16 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(5,'SSRS','NBC_Mar20','United States','N/A','Nationally Representative',NULL,1006,'Random digit dial','One-time','https://www.commonwealthfund.org/publications/surveys/2020/mar/what-are-americans-views-coronavirus-pandemic?utm_source=alert&utm_medium=email&utm_campaign=Health%20Coverage','2020-03-20 00:00:00','2020-03-10 00:00:00','2020-03-15 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(6,'NPR/PBS/Marist','NPR_Mar17','United States','N/A','Nationally Representative',NULL,835,'Random digit dial','One-time','http://maristpoll.marist.edu/wp-content/uploads/2020/03/NPR_PBS-NewsHour_Marist-Poll_USA-NOS-and-Tables_2003151338.pdf','2020-03-22 00:00:00','2020-03-13 00:00:00','2020-03-14 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(7,'Leger','Leger_Mar24','Canada','N/A','Nationally Representative',NULL,1508,'Random Online Selection','One-time','https://leger360.com/surveys/concerns-about-covid-19-march-24-2020/','2020-03-24 00:00:00','2020-03-20 00:00:00','2020-03-22 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(8,'YouGov','CBS_Mar24','United States','N/A','Nationally Representative',NULL,2190,NULL,'One-time','https://drive.google.com/file/d/1TofJVeuCbZN8cRGBN97kWGqhO6tlQ7VA/view','2020-03-24 00:00:00','2020-03-21 00:00:00','2020-03-23 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(9,'Morning Consult/Politico','MornConsultPolitico_Mar25','United States','N/A','Registered Voters',NULL,1996,'Random Online Selection','One-time','https://morningconsult.com/wp-content/uploads/2020/03/200386_crosstabs_POLITICO_RVs.pdf','2020-03-25 00:00:00','2020-03-20 00:00:00','2020-03-22 00:00:00','2020-04-01 00:00:00','TP','2020-04-01','TP'),(10,'CUNY SPH','CUNY(State)_Mar23','United States','New York State','Locally Representative',NULL,1000,'RDD + SMS + Online','Longitudinal','https://sph.cuny.edu/research/covid-19-tracking-survey/week-2/','2020-03-23 00:00:00','2020-03-20 00:00:00','2020-03-22 00:00:00','2020-04-01 00:00:00','CS','2020-04-01','CS'),(11,'CUNY SPH','CUNY(City)_Mar23','United States','New York City','Locally Representative',NULL,1000,'RDD + SMS + Online','Longitudinal','https://sph.cuny.edu/research/covid-19-tracking-survey/week-2/','2020-03-23 00:00:00','2020-03-20 00:00:00','2020-03-22 00:00:00','2020-04-01 00:00:00','CS','2020-04-01','CS'),(12,'Civiqs','DailyKos_Mar31','United States','N/A','Nationally Representative',NULL,1505,'Random Online Selection','One-time','https://civiqs.com/documents/Civiqs_DailyKos_monthly_banner_book_2020_03B_x2nf9sb.pdf','2020-03-31 00:00:00','2020-04-28 00:00:00','2020-04-30 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(13,'DART & maru','Dart_April 1','Canada','N/A','Nationally Representative',NULL,1520,'Random Online Selection','One-time','https://dartincom.ca/wp-content/uploads/2020/04/Coronavirus-Lock-it-Down-DTs-April-1-2020.pdf','2020-04-01 00:00:00','2020-03-27 00:00:00','2020-03-29 00:00:00','2020-04-01 00:00:00','DG','2020-04-01','DG'),(14,'Leger','LegerAssociationforCanadianStudies_Mar30','Canada','N/A','Nationally Representative',NULL,1590,'Online Panel','One-time','https://leger360.com/surveys/concerns-about-covid-19-march-31-2020/','2020-03-30 00:00:00','2020-03-27 00:00:00','2020-03-29 00:00:00','2020-04-01 00:00:00','TP','2020-04-01','TP'),(17,'Leger','Leger_20200330_UnitedStates','United States',NULL,'Nationally Representative',NULL,1004,'Online Panel','One-time','https://leger360.com/surveys/concerns-about-covid-19-march-31-2020/','2020-03-30 00:00:00','2020-03-27 00:00:00','2020-03-29 00:00:00','2020-04-16 00:35:24','TP','2020-04-16 00:35:24','TP'),(18,'Maru/Blue','MaruBlue_20200402_Canada','Canada',NULL,'Nationally Representative',NULL,2659,'Online Panel','One-time','https://drive.google.com/file/d/1oX8f_tORclxUwkoVh-IDquvKS_g9D2Xg/view','2020-04-02 00:00:00','2020-03-31 00:00:00','2020-04-01 00:00:00','2020-04-23 01:07:15','TP','2020-04-23 01:07:15','TP'),(19,'Civiqs','Daily Kos_Mar31','United States',NULL,'Nationally Representative',NULL,1505,'Random Online Selection','One-time','https://civiqs.com/documents/Civiqs_DailyKos_monthly_banner_book_2020_03B_x2nf9sb.pdf','2020-03-31 00:00:00','2020-04-28 00:00:00','2020-04-30 00:00:00','2020-04-16 15:18:49','DG','2020-04-16 15:18:49','DG'),(20,'Universiti Sains Malaysia','USM_20200409','Malaysia',NULL,'Populace - Non-representative',NULL,1075,'Online Convenience','One-time','https://advance.sagepub.com/articles/Public_knowledge_perception_and_communication_behavior_surrounding_COVID-19_in_Malaysia/12102816/1','2020-09-04 00:00:00','2020-03-18 00:00:00','2020-03-25 00:00:00','2020-04-17 16:51:47','DG','2020-04-17 16:51:47','DG'),(21,'Nanos Research ','CTV_20200327','Canada',NULL,'Nationally Representative',NULL,1013,'Random Digital Dial','One-time','https://secureservercdn.net/198.71.233.47/823.910.myftpupload.com/wp-content/uploads/2020/03/2020-1604-5-CTV-Globe-March-Populated-Report-w-Tabs.pdf','2020-03-27 00:00:00','2020-03-24 00:00:00','2020-03-27 00:00:00','2020-04-17 05:58:52','CS','2020-04-17 05:58:52','CS'),(22,'Vetenskap & Allmänhet','V&A_20200402','Sweden',NULL,'Nationally Representative',NULL,1141,'Online Panel','Longitudinal','https://v-a.se/2020/04/coronavirus-in-the-swedish-media-study-high-public-confidence-in-researchers-and-healthcare-professionals/','2020-04-02 00:00:00','2020-03-18 00:00:00','2020-02-21 00:00:00','2020-04-17 17:21:37','DG','2020-04-17 17:21:37','DG'),(23,'Nanos','Globe&Nanos_20200329','Canada',NULL,'Nationally Representative',NULL,1013,'RDD + Online','One-time','https://www.theglobeandmail.com/politics/article-majority-of-canadians-pessimistic-about-covid-19-but-support-ottawas/','2020-03-29 00:00:00','2020-03-24 00:00:00','2020-03-27 00:00:00','2020-04-17 18:10:27','DG','2020-04-17 18:10:27','DG'),(24,'Staance ','STAANCE_20200315','United States',NULL,'Nationally Representative',NULL,2004,'Web Survey','One-time','https://www.staance.com/post/coronavirus-reactions','2020-03-13 00:00:00','2020-03-06 00:00:00','2020-03-08 00:00:00','2020-04-18 15:17:26','CS','2020-04-18 15:17:26','CS'),(25,'Abacus ','ABACUS_20200325','Canada',NULL,NULL,NULL,2309,'Online Panel','One-time','https://abacusdata.ca/coronavirus-covid19-abacus-data-mood-polling/','2020-03-25 00:00:00','2020-03-20 00:00:00','2020-03-24 00:00:00','2020-04-18 17:19:41','CS','2020-04-18 17:19:41','CS'),(26,'Ipsos','Ipsos_20200403_UnitedStates','United States',NULL,'Nationally Representative',NULL,1002,'Ipsos Ampario Overview','One-time','https://www.publicagenda.org/wp-content/uploads/2020/04/Americas-Hidden-Common-Ground-on-Coronavirus.pdf','2020-04-03 00:00:00','2020-03-27 00:00:00','2020-03-30 00:00:00','2020-04-21 02:43:47','TP','2020-04-21 02:43:47','TP'),(27,'Harris Insights & Analytics','Harris_20200309','United States',NULL,'Nationally Representative',NULL,2019,NULL,'Longitudinal','https://theharrispoll.com/the-harris-poll-covid19-tracker/','2020-03-09 00:00:00','2020-03-05 00:00:00','2020-03-09 00:00:00','2020-04-22 09:42:30','DG','2020-04-22 09:42:30','DG'),(28,'Angus Reid Institute ','Angus_20200413','Canada',NULL,'Nationally Representative',NULL,4240,'Online Panel','One-time','http://angusreid.org/wp-content/uploads/2020/04/2020.04.12_back_to_normal.pdf','2020-04-13 00:00:00','2020-04-01 00:00:00','2020-04-06 00:00:00','2020-04-23 04:22:14','CS','2020-04-23 04:22:14','CS'),(29,'Harris Insights & Analytics','Harris_20200413','United States',NULL,'Nationally Representative',NULL,2013,NULL,'Longitudinal','https://theharrispoll.com/wp-content/uploads/2020/04/Wave-2-7_tabs_rev.pdf','2020-04-13 00:00:00','2020-04-11 00:00:00','2020-04-13 00:00:00','2020-04-22 09:55:04','DG','2020-04-22 09:55:04','DG'),(30,'Edelman','Edelman_20200316_Canada','Canada',NULL,'Nationally Representative',NULL,1000,'Web Survey','One-time','https://www.edelman.com/sites/g/files/aatuss191/files/2020-03/2020%20Edelman%20Trust%20Barometer%20Coronavirus%20Special%20Report_0.pdf','2020-03-16 00:00:00','2020-03-06 00:00:00','2020-03-10 00:00:00','2020-04-23 19:58:21','TP','2020-04-23 19:58:21','TP'),(31,'Abacus','ABACUS_20200327','Canada',NULL,'Nationally Representative',NULL,2309,'Online Panel','One-time','https://abacusdata.ca/coronavirus-covid19-food-security-prices-availability/','2020-03-27 00:00:00','2020-03-20 00:00:00','2020-03-24 00:00:00','2020-04-24 03:29:11','CS','2020-04-24 03:29:11','CS');
/*!40000 ALTER TABLE `Surveys` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-02 16:46:39
