/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.32-MariaDB : Database - selvasavia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`selvasavia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `selvasavia`;

/*Table structure for table `calls` */

DROP TABLE IF EXISTS `calls`;

CREATE TABLE `calls` (
  `CallId` int(11) NOT NULL AUTO_INCREMENT,
  `ChallengeName` text NOT NULL,
  `ChallengeLeaderName` varchar(255) NOT NULL,
  `InstitutionOrganization` text NOT NULL,
  `ActorType` enum('Student','Teacher','Entrepreneur','Community') NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `ContextDescription` text NOT NULL,
  `SpecificProblemDescription` text NOT NULL,
  `ChallengeFormula` text NOT NULL,
  `RequiredResources` text NOT NULL,
  `InvitedParticipants` text NOT NULL,
  `InformationSources` text NOT NULL,
  `Observations` text DEFAULT NULL,
  `CreationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `StatusCall` enum('New','Approved','Rejected','Open','Closed') DEFAULT NULL,
  `ChallengeAnalysis` text DEFAULT NULL COMMENT 'Profundiza la problemática del reto F3',
  `Identify3Causes` text DEFAULT NULL COMMENT 'Identifica 3 causas F3',
  `Project3Effects` text DEFAULT NULL COMMENT 'Proyecta 3 efectos F3',
  `PossibleAlternatives` text DEFAULT NULL COMMENT 'Posibles alternativas F3',
  `GeneralObjective` text DEFAULT NULL COMMENT 'Objetivo general solución del reto F3',
  `Describe3SpecificObjectives` text DEFAULT NULL COMMENT 'Describe 3 objetivos específicos para alcanzar el reto F3',
  `Project3Impacts` text DEFAULT NULL COMMENT 'Proyecta 3 impactos que podrían surgir si la solución se logra F3',
  `PublicationTitle` varchar(255) DEFAULT NULL COMMENT 'Título de la publicación de la convocatoria',
  `PublicationDetail` text DEFAULT NULL COMMENT 'Detalle de la publicación de la convocatoria',
  `PublicationImage` varchar(255) DEFAULT NULL COMMENT 'Imagen de la publicación de la convocatoria',
  PRIMARY KEY (`CallId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `calls` */

LOCK TABLES `calls` WRITE;

insert  into `calls`(`CallId`,`ChallengeName`,`ChallengeLeaderName`,`InstitutionOrganization`,`ActorType`,`EmailAddress`,`PhoneNumber`,`ContextDescription`,`SpecificProblemDescription`,`ChallengeFormula`,`RequiredResources`,`InvitedParticipants`,`InformationSources`,`Observations`,`CreationDate`,`StatusCall`,`ChallengeAnalysis`,`Identify3Causes`,`Project3Effects`,`PossibleAlternatives`,`GeneralObjective`,`Describe3SpecificObjectives`,`Project3Impacts`,`PublicationTitle`,`PublicationDetail`,`PublicationImage`) values (1,'Arboles en Africa','Anailys Rodriguez','La Arboleda','Student','rodriguezanailys07@gmail.com','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','2024-02-02 04:49:51','Open',NULL,NULL,'Proyectar 3 efectos del reto...','Posibles alternativas...','Objetivo general de la solución...','Describir 3 objetivos específicos...','Proyectar 3 impactos de la solución...','PublicationTitle 1','PublicationDetail1','uploads/fCarla.jpeg'),(2,'Arboles en Africa2','Anailys Rodriguez','La Arboleda','Student','rodriguezanailys07@gmail.com','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','Applicant','2024-02-02 05:02:23','Rejected',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

UNLOCK TABLES;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `IdUser` int(11) NOT NULL AUTO_INCREMENT,
  `NameUser` varchar(255) NOT NULL,
  `EmailUser` varchar(255) NOT NULL,
  `PasswordUser` varchar(255) NOT NULL,
  `RoleUser` enum('Admin','project leader') NOT NULL,
  `RegistrationDateUser` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsActiveUser` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

LOCK TABLES `users` WRITE;

insert  into `users`(`IdUser`,`NameUser`,`EmailUser`,`PasswordUser`,`RoleUser`,`RegistrationDateUser`,`IsActiveUser`) values (1,'Anailys Rodriguez','correoa@example.com','$2b$10$LO8C5Vsdz28MjLxIuEnYtuL7i894ELR5sOjx4pycllH5PQ8i6N4Z2','Admin','2024-02-01 09:04:59',1),(2,'Nombre del Usuario5','correo@example.com','$2b$10$IdSc.zjRBeJCF6jdcqJ6yODyzZvQ1O/bZ5607ZQDDQ2jN.2hjqxVW','Admin','2024-02-01 12:17:30',1);

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
