########################
# Items Sales
########################
DROP TABLE IF EXISTS `ItemsSales`;

CREATE TABLE `ItemsSales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryName` varchar(250) NOT NULL,
  `category` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `dishId` varchar(250) NOT NULL,
  `milisec` bigint NOT NULL,
  `hour` datetime NOT NULL,
  `sold` INT(11) NULL DEFAULT NULL,
  `gross` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ItemsSales` (userId, categoryName, category, name, dishId, milisec, hour, sold, gross)
SELECT min(oi.userId) as userId, min(c.categoryName) as categoryName, min(d.categoryId) as category, min(d.dishName) as name, min(oi.dishId) as dishId, min(oi.createdAt) - mod(min(oi.createdAt), 60 * 60 * 1000) as milisec, FROM_UNIXTIME((min(oi.createdAt) - mod(min(oi.createdAt), 60 * 60 * 1000))/1000) as hour, sum(quantity) as sold, sum(quantity) * sum(price) as gross FROM `OrderItems` as oi
LEFT JOIN Dishes AS d ON oi.dishId = d.dishId
LEFT JOIN Categories AS c ON d.categoryId = c.categoryId
GROUP BY DATE_FORMAT(FROM_UNIXTIME(oi.createdAt/1000), "%Y%m%d"), oi.dishId, oi.userId
ORDER BY hour;

########################
# Modifiers Sales
########################
DROP TABLE IF EXISTS `ModifiersSales`;

CREATE TABLE `ModifiersSales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(250) NULL,
  `milisec` bigint NOT NULL,  
  `hour` datetime NOT NULL,
  `sold` INT(11) NULL DEFAULT NULL,
  `gross` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ModifiersSales` (userId, name, milisec, hour, sold, gross)
SELECT min(oic.userId) as userId, min(c.choiceName) as name, min(oic.createdAt) - mod(min(oic.createdAt), 60 * 60 * 1000) as milisec, FROM_UNIXTIME((min(oic.createdAt) - mod(min(oic.createdAt), 60 * 60 * 1000))/1000) as hour, count(*) as sold, sum(price) as gross FROM `OrderItemChoices` as oic
LEFT JOIN Choices AS c ON oic.choiceId = c.choiceId
GROUP BY HOUR(FROM_UNIXTIME(oic.createdAt/1000)), c.choiceName, oic.userId
ORDER BY hour;
