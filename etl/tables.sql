DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `originalId` varchar(36) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` BIGINT DEFAULT NULL,
  `startedAt` BIGINT DEFAULT NULL,
  `endedAt` BIGINT DEFAULT NULL,
  `readableId` varchar(12) NULL,
  `isTakeout` tinyint(1) DEFAULT 1,
  `kioskId` varchar(12) NULL,
  `subtotal` DECIMAL(10,2) NULL,
  `total` DECIMAL(10,2) NULL,
  `customerId` varchar(250) NOT NULL,
  `tableId` varchar(12) NULL,
  `notes` varchar(250) DEFAULT NULL,
  `tax` DECIMAL(10,2)  DEFAULT NULL,
  `tip` DECIMAL(10,2) DEFAULT NULL,
  `discountFixed` DECIMAL(10,2) DEFAULT NULL,
  `discountId` INT DEFAULT NULL,
  `readyAt` BIGINT DEFAULT NULL,
  `isPrinted` tinyint(1) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `originalId` varchar(36) NOT NULL,
  `createdAt` BIGINT DEFAULT NULL,
  `orderId` varchar(250) NOT NULL,
  `dishId` varchar(250) NOT NULL,
  `name` varchar(250) NOT NULL,
  `quantity` int(5) DEFAULT NULL,
  `price` DECIMAL(10,2)  DEFAULT NULL,
  `tax` DECIMAL(10,2)  DEFAULT NULL,
  `notes` varchar(500) NULL,
  `discountFixed` DECIMAL(10,2) DEFAULT NULL,
  `discountId` INT DEFAULT NULL,
  `isUpcharge` tinyint(1) NULL,
   PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `OrderItemChoices`;
CREATE TABLE `OrderItemChoices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `originalId` varchar(36) NOT NULL,
  `createdAt` BIGINT DEFAULT NULL,
  `orderItemId` varchar(250) NOT NULL,
  `choiceId` varchar(250) NOT NULL,
  `name` varchar(250) NOT NULL,
  `quantity` int(5) DEFAULT NULL,
  `price` DECIMAL(10,2)  DEFAULT NULL,
   PRIMARY KEY (`id`)
);
