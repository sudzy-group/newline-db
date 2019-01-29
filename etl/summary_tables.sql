########################
# New customers count
########################
-- DROP TABLE IF EXISTS `{{store_id}}_customers_count`;

-- CREATE TABLE `{{store_id}}_customers_count` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `day` date NOT NULL,
--   `customers_count` INT NULL,
--   PRIMARY KEY (`id`)
-- );

-- INSERT INTO `{{store_id}}_customers_count` (day, customers_count)
-- SELECT date(FROM_UNIXTIME(created_at/1000)) as day, count(date(FROM_UNIXTIME(created_at/1000))) as customers_count FROM `{{store_id}}_customers` GROUP BY DATE(CONVERT_TZ(FROM_UNIXTIME(created_at/1000),'+00:00','-04:00'));

