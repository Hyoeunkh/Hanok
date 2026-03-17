-- =============================================
-- DB Schema (Generated from JPA Entities)
-- MySQL
-- @Enumerated(EnumType.STRING) → DB에는 enum 이름(예: READY, SOLD) 저장
-- =============================================
--
-- [Enum 값 참고 - Java 엔티티 기준]
-- SellerType: INDIVIDUAL, BUSINESS
-- Category: SNEAKERS_SHOES, CLOTHING, WATCHES, BAGS_FASHION_ACCESSORIES, JEWELRY,
--           TRADING_CARDS, FIGURES_ARTTOYS_GOODS, ELECTRONICS, ART_PRINTS, ANTIQUES, ETC
-- ItemStatus: READY, PENDING, SOLD
-- ItemCondition: BRAND_NEW, OPEN_BOX, REFURBISHED, USED
-- AuctionType: UNIQUE_TOP, BOTTOM_UP
-- AuctionStatus: READY, INTRODUCING, LIVE, SOLD, UNSOLD
-- UniqueBidStatus: READY, LIVE, INTRODUCING, CALCULATING, SOLD, UNSOLD
-- EscrowStatus: DEPOSITED, SHIPPED, COMPLETED, CANCELLED
-- StreamStatus: LIVE, SCHEDULED, PAUSED, ENDED
-- StartType: SCHEDULED, INSTANT
-- WithdrawStatus: PENDING, COMPLETED, REJECTED
-- TradeType: CHARGE, WITHDRAW, SETTLEMENT
-- MessageType: CHAT, SYSTEM, FILTERED, MACRO
--
-- =============================================

-- 1. user
CREATE TABLE `user` (
                        `id` BIGINT NOT NULL AUTO_INCREMENT,
                        `email` VARCHAR(50) NOT NULL,
                        `password` VARCHAR(255) NOT NULL,
                        `nickname` VARCHAR(50) NOT NULL,
                        `profile_image` VARCHAR(500),
                        `phone` VARCHAR(50) NOT NULL,
                        `is_active` TINYINT(1) NOT NULL,
                        `balance` BIGINT NOT NULL,
                        `deposited_bid_balance` BIGINT NOT NULL,
                        `deposited_escrow_balance` BIGINT NOT NULL,
                        `deposited_withdraw_balance` BIGINT NOT NULL,
                        `bank_code` VARCHAR(50),
                        `account_name` VARCHAR(50),
                        `account_num` VARCHAR(100),
                        `created_at` DATETIME NOT NULL,
                        `updated_at` DATETIME NOT NULL,
                        `notification_setting` TINYINT(1) NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. seller
CREATE TABLE `seller` (
                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                          `intro` VARCHAR(100) NOT NULL,
                          `penalty_count` INT NOT NULL,
                          `type` ENUM('INDIVIDUAL','BUSINESS') NOT NULL,
                          `business_number` VARCHAR(50),
                          `insta_url` VARCHAR(100),
                          `youtube_url` VARCHAR(100),
                          `tiktok_url` VARCHAR(100),
                          `avg_ship_days` DOUBLE,
                          `created_at` DATETIME NOT NULL,
                          `updated_at` DATETIME NOT NULL,
                          `user_id` BIGINT NOT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_seller_user_id` (`user_id`),
                          CONSTRAINT `fk_seller_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. item
CREATE TABLE `item` (
                        `id` BIGINT NOT NULL AUTO_INCREMENT,
                        `name` VARCHAR(255),
                        `description` VARCHAR(255),
                        `category` ENUM('SNEAKERS_SHOES','CLOTHING','WATCHES','BAGS_FASHION_ACCESSORIES','JEWELRY','TRADING_CARDS','FIGURES_ARTTOYS_GOODS','ELECTRONICS','ART_PRINTS','ANTIQUES','ETC'),
                        `start_price` BIGINT,
                        `bid_unit` BIGINT,
                        `auction_duration` INT,
                        `status` ENUM('READY','PENDING','SOLD'),
                        `item_condition` ENUM('BRAND_NEW','OPEN_BOX','REFURBISHED','USED'),
                        `auction_type` ENUM('UNIQUE_TOP','BOTTOM_UP'),
                        `image1` VARCHAR(255),
                        `image2` VARCHAR(255),
                        `image3` VARCHAR(255),
                        `sold_at` DATETIME,
                        `created_at` DATETIME,
                        `seller_id` BIGINT,
                        PRIMARY KEY (`id`),
                        CONSTRAINT `fk_item_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. tag
CREATE TABLE `tag` (
                       `id` BIGINT NOT NULL AUTO_INCREMENT,
                       `name` VARCHAR(255),
                       `item_id` BIGINT,
                       PRIMARY KEY (`id`),
                       CONSTRAINT `fk_tag_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. stream
CREATE TABLE `stream` (
                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                          `title` VARCHAR(255),
                          `category` ENUM('SNEAKERS_SHOES','CLOTHING','WATCHES','BAGS_FASHION_ACCESSORIES','JEWELRY','TRADING_CARDS','FIGURES_ARTTOYS_GOODS','ELECTRONICS','ART_PRINTS','ANTIQUES','ETC'),
                          `status` ENUM('LIVE','SCHEDULED','PAUSED','ENDED'),
                          `thumbnail` VARCHAR(255),
                          `scheduled_at` DATETIME,
                          `start_type` ENUM('SCHEDULED','INSTANT'),
                          `notice` VARCHAR(255),
                          `created_at` DATETIME,
                          `seller_id` BIGINT,
                          `started_at` DATETIME,
                          PRIMARY KEY (`id`),
                          CONSTRAINT `fk_stream_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. auction
CREATE TABLE `auction` (
                           `id` BIGINT NOT NULL AUTO_INCREMENT,
                           `final_price` BIGINT,
                           `auction_status` ENUM('READY','INTRODUCING','LIVE','SOLD','UNSOLD'),
                           `started_at` VARCHAR(255),
                           `stream_id` BIGINT,
                           `item_id` BIGINT,
                           PRIMARY KEY (`id`),
                           CONSTRAINT `fk_auction_stream` FOREIGN KEY (`stream_id`) REFERENCES `stream` (`id`),
                           CONSTRAINT `fk_auction_item` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. unique_bid_auction
CREATE TABLE `unique_bid_auction` (
                                      `id` BIGINT NOT NULL AUTO_INCREMENT,
                                      `auction_id` BIGINT,
                                      `min_price` BIGINT,
                                      `max_price` BIGINT,
                                      `status` ENUM('READY','LIVE','INTRODUCING','CALCULATING','SOLD','UNSOLD'),
                                      `started_at` VARCHAR(255),
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `uk_unique_bid_auction_auction_id` (`auction_id`),
                                      CONSTRAINT `fk_unique_bid_auction_auction` FOREIGN KEY (`auction_id`) REFERENCES `auction` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. shipping_address
CREATE TABLE `shipping_address` (
                                    `id` BIGINT NOT NULL AUTO_INCREMENT,
                                    `address_name` VARCHAR(255),
                                    `postal_code` INT,
                                    `address` VARCHAR(255),
                                    `address_detail` VARCHAR(255),
                                    `phone` VARCHAR(255),
                                    `recipient_name` VARCHAR(255),
                                    `is_default` TINYINT(1),
                                    `user_id` BIGINT,
                                    PRIMARY KEY (`id`),
                                    CONSTRAINT `fk_shipping_address_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. escrow
CREATE TABLE `escrow` (
                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                          `winning_price` BIGINT,
                          `fee_amount` BIGINT,
                          `escrow_status` ENUM('DEPOSITED','SHIPPED','COMPLETED','CANCELLED'),
                          `courier_name` VARCHAR(255),
                          `tracking_number` VARCHAR(255),
                          `submitted_at` DATETIME,
                          `cancel_reason` VARCHAR(255),
                          `auction_id` BIGINT,
                          `user_id` BIGINT,
                          `seller_id` BIGINT,
                          `shipping_address_id` BIGINT,
                          `created_at` DATETIME,
                          `modified_at` DATETIME,
                          PRIMARY KEY (`id`),
                          CONSTRAINT `fk_escrow_auction` FOREIGN KEY (`auction_id`) REFERENCES `auction` (`id`),
                          CONSTRAINT `fk_escrow_buyer` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
                          CONSTRAINT `fk_escrow_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`),
                          CONSTRAINT `fk_escrow_shipping_address` FOREIGN KEY (`shipping_address_id`) REFERENCES `shipping_address` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. withdraw_request
CREATE TABLE `withdraw_request` (
                                    `id` BIGINT NOT NULL AUTO_INCREMENT,
                                    `amount` BIGINT,
                                    `withdraw_status` ENUM('PENDING','COMPLETED','REJECTED'),
                                    `requested_at` DATETIME,
                                    `processed_at` DATETIME,
                                    `user_id` BIGINT,
                                    PRIMARY KEY (`id`),
                                    CONSTRAINT `fk_withdraw_request_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. trade_report
CREATE TABLE `trade_report` (
                                `id` BIGINT NOT NULL AUTO_INCREMENT,
                                `amount` BIGINT,
                                `trade_type` ENUM('CHARGE','WITHDRAW','SETTLEMENT'),
                                `user_id` BIGINT,
                                `escrow_id` BIGINT,
                                `created_at` DATETIME,
                                PRIMARY KEY (`id`),
                                CONSTRAINT `fk_trade_report_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
                                CONSTRAINT `fk_trade_report_escrow` FOREIGN KEY (`escrow_id`) REFERENCES `escrow` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. follow
CREATE TABLE `follow` (
                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                          `user_id` BIGINT NOT NULL,
                          `seller_id` BIGINT NOT NULL,
                          `created_at` DATETIME NOT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uk_follow_user_seller` (`user_id`, `seller_id`),
                          CONSTRAINT `fk_follow_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
                          CONSTRAINT `fk_follow_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. seller_notice
CREATE TABLE `seller_notice` (
                                 `id` BIGINT NOT NULL AUTO_INCREMENT,
                                 `title` VARCHAR(100) NOT NULL,
                                 `content` TEXT NOT NULL,
                                 `created_at` DATETIME NOT NULL,
                                 `updated_at` DATETIME NOT NULL,
                                 `seller_id` BIGINT NOT NULL,
                                 PRIMARY KEY (`id`),
                                 CONSTRAINT `fk_seller_notice_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. chat_message
CREATE TABLE `chat_message` (
                                `id` BIGINT NOT NULL AUTO_INCREMENT,
                                `stream_id` BIGINT NOT NULL,
                                `user_id` BIGINT NOT NULL,
                                `nickname` VARCHAR(255) NOT NULL,
                                `content` VARCHAR(500) NOT NULL,
                                `message_type` ENUM('CHAT','SYSTEM','FILTERED','MACRO') NOT NULL,
                                `filtered` TINYINT(1) NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
