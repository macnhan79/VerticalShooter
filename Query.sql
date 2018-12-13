/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50560
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50560
File Encoding         : 65001

Date: 2018-12-12 18:00:58
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `verticalshooter_entity_score`
-- ----------------------------
DROP TABLE IF EXISTS `verticalshooter_entity_score`;
CREATE TABLE `verticalshooter_entity_score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of verticalshooter_entity_score
-- ----------------------------
INSERT INTO verticalshooter_entity_score VALUES ('2', '3', '0', '2018-12-05 05:36:52');
INSERT INTO verticalshooter_entity_score VALUES ('3', '3', '3200', '2018-12-05 05:37:36');
INSERT INTO verticalshooter_entity_score VALUES ('4', 'nhan', '3000', '2018-12-05 21:55:56');
INSERT INTO verticalshooter_entity_score VALUES ('5', 'nhan', '0', '2018-12-05 21:56:44');
INSERT INTO verticalshooter_entity_score VALUES ('6', 'abc', '4600', '2018-12-08 21:29:19');
INSERT INTO verticalshooter_entity_score VALUES ('7', '123', '9400', '2018-12-08 21:45:55');
INSERT INTO verticalshooter_entity_score VALUES ('8', '123', '0', '2018-12-08 22:00:40');
INSERT INTO verticalshooter_entity_score VALUES ('9', 'abc', '1000', '2018-12-08 22:01:38');
INSERT INTO verticalshooter_entity_score VALUES ('10', 'abc', '200', '2018-12-08 22:02:59');
INSERT INTO verticalshooter_entity_score VALUES ('11', 'abc', '600', '2018-12-08 22:04:37');
INSERT INTO verticalshooter_entity_score VALUES ('12', 'abc', '91800', '2018-12-08 22:08:20');
INSERT INTO verticalshooter_entity_score VALUES ('13', 'jonathan', '1600', '2018-12-09 00:15:33');
INSERT INTO verticalshooter_entity_score VALUES ('14', 'jonathan', '4600', '2018-12-09 00:31:43');
INSERT INTO verticalshooter_entity_score VALUES ('15', 'jonathan', '3800', '2018-12-09 00:35:31');
INSERT INTO verticalshooter_entity_score VALUES ('16', 'jonathan', '1600', '2018-12-09 00:36:00');
INSERT INTO verticalshooter_entity_score VALUES ('17', 'jonathan', '9200', '2018-12-09 00:41:08');
INSERT INTO verticalshooter_entity_score VALUES ('18', 'nhan', '10500', '2018-12-09 00:48:16');

-- ----------------------------
-- Table structure for `verticalshooter_entity_shield`
-- ----------------------------
DROP TABLE IF EXISTS `verticalshooter_entity_shield`;
CREATE TABLE `verticalshooter_entity_shield` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of verticalshooter_entity_shield
-- ----------------------------
INSERT INTO verticalshooter_entity_shield VALUES ('2', '20', '20');
INSERT INTO verticalshooter_entity_shield VALUES ('3', '40', '35');
INSERT INTO verticalshooter_entity_shield VALUES ('4', '60', '55');
INSERT INTO verticalshooter_entity_shield VALUES ('5', '100', '90');

-- ----------------------------
-- Table structure for `verticalshooter_entity_user`
-- ----------------------------
DROP TABLE IF EXISTS `verticalshooter_entity_user`;
CREATE TABLE `verticalshooter_entity_user` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `shield` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of verticalshooter_entity_user
-- ----------------------------
INSERT INTO verticalshooter_entity_user VALUES ('cody', '02726d40f378e716981c4321d60ba3a325ed6a4c', 'user', 'cody', 'cody123@gmail.com', '1000');
INSERT INTO verticalshooter_entity_user VALUES ('jonathan', '02726d40f378e716981c4321d60ba3a325ed6a4c', 'admin', 'jonathan', 'jonathan@gmail.com', '120');
INSERT INTO verticalshooter_entity_user VALUES ('nhan', '02726d40f378e716981c4321d60ba3a325ed6a4c', 'user', 'nhan', 'boy@gmail.com', '130');
INSERT INTO verticalshooter_entity_user VALUES ('Robert', '02726d40f378e716981c4321d60ba3a325ed6a4c', 'user', 'robert', 'robert235@yahoo.com', '100');
