########################
# Items Sales
########################
DROP TABLE IF EXISTS `ItemsSales`;

CREATE TABLE `ItemsSales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `dishId` varchar(250) NOT NULL,
  `hour` varchar(8) NOT NULL,
  `sold` INT(11) NULL DEFAULT NULL,
  `gross` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ItemsSales` (userId, category, name, dishId, hour, sold, gross)
SELECT min(oi.userId) as userId, min(d.categoryId) as category, min(d.dishName) as name, min(oi.dishId) as dishId, DATE_FORMAT(FROM_UNIXTIME(min(oi.createdAt)/1000), "%y%m%d%H") as hour, count(*) as sold, sum(price) as gross FROM `OrderItems` as oi
LEFT JOIN Dishes AS d ON oi.dishId = d.dishId
GROUP BY HOUR(FROM_UNIXTIME(oi.createdAt/1000)), oi.dishId, oi.userId
ORDER BY hour;

########################
# Modifiers Sales
########################
DROP TABLE IF EXISTS `ModifiersSales`;

CREATE TABLE `ModifiersSales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(250) NULL,
  `hour` varchar(8) NOT NULL,
  `sold` INT(11) NULL DEFAULT NULL,
  `gross` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ModifiersSales` (userId, name, hour, sold, gross)
SELECT min(oic.userId) as userId, min(c.choiceName) as name, DATE_FORMAT(FROM_UNIXTIME(min(oic.createdAt)/1000), "%y%m%d%H") as hour, count(*) as sold, sum(price) as gross FROM `OrderItemChoices` as oic
LEFT JOIN Choices AS c ON oic.choiceId = c.choiceId
GROUP BY HOUR(FROM_UNIXTIME(oic.createdAt/1000)), c.choiceName, oic.userId
ORDER BY hour;
