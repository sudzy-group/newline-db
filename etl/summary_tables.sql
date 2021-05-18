########################
# Items Sales
########################
DROP TABLE IF EXISTS `ItemsSales`;

CREATE TABLE `ItemsSales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryName` varchar(250) NULL,
  `category` int(11) NULL,
  `name` varchar(250) NULL,
  `dishId` varchar(250) NULL,
  `milisec` bigint NOT NULL,
  `hour` datetime NOT NULL,
  `sold` INT(11) NULL DEFAULT NULL,
  `gross` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ItemsSales` (userId, categoryName, category, name, dishId, milisec, hour, sold, gross)
SELECT min(oi.userId) as userId, min(c.categoryName) as categoryName, min(d.categoryId) as category, min(oi.name) as name, min(oi.dishId) as dishId, min(oi.createdAt) - mod(min(oi.createdAt), 60 * 60 * 1000) as milisec, DATE(CONVERT_TZ(FROM_UNIXTIME((min(oi.createdAt) - mod(min(oi.createdAt), 60 * 60 * 1000))/1000), '+00:00', '-13:00')) as hour, sum(quantity) as sold, sum(quantity) * min(price) as gross FROM `OrderItems` as oi
LEFT JOIN Dishes AS d ON oi.dishId = d.dishId
LEFT JOIN Categories AS c ON d.categoryId = c.categoryId
GROUP BY oi.createdAt - mod(oi.createdAt, 60 * 60 * 1000), oi.dishId, oi.userId
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
SELECT min(oic.userId) as userId, min(oic.name) as name, min(oic.createdAt) - mod(min(oic.createdAt), 60 * 60 * 1000) as milisec, DATE(CONVERT_TZ(FROM_UNIXTIME((min(oic.createdAt) - mod(min(oic.createdAt), 60 * 60 * 1000))/1000), '+00:00', '-13:00')) as hour, sum(quantity) as sold, sum(quantity) * min(price) as gross FROM `OrderItemChoices` as oic
LEFT JOIN Choices AS c ON oic.choiceId = c.choiceId
GROUP BY oic.createdAt - mod(oic.createdAt, 60 * 60 * 1000), c.choiceName, oic.userId
ORDER BY hour;
