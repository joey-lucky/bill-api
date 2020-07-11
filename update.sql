drop view bc_bill_template_view;
drop view bc_bill_type_view;
drop view bc_card_view;
drop view bc_dict_data_view;
drop view bd_bill_view;
drop view bd_stat_bill_m_view;
CREATE TABLE `bc_fund_type` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `name` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bc_fund_buss_type` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `parent_id` varchar(255) NULL, `is_leaf` tinyint NULL COMMENT '是否为叶子', `name` varchar(255) NULL, `sort` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bc_fund` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `name` varchar(255) NOT NULL COMMENT '基金名称', `code` varchar(255) NOT NULL COMMENT '基金代码', `fund_type_id` varchar(255) NULL, `fund_buss_type_id` varchar(255) NULL, INDEX `IDX_487e82119c108a378fc06b7ce9` (`name`), UNIQUE INDEX `IDX_244ebae02a80087c3a1dc692b0` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bd_fund_price` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `fund_id` varchar(255) NOT NULL, `price` double NULL DEFAULT -1, `increase` double NULL DEFAULT -1, `date_time` datetime NULL, INDEX `IDX_64ad3dba08f021dc5dc2dae6a6` (`increase`), INDEX `IDX_f54107950eaab59730084dcb33` (`date_time`), UNIQUE INDEX `IDX_a4d5daf33ef6b34e52d727daf7` (`fund_id`, `date_time`), PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bc_fund_buy_commission` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `less_than_money` int NOT NULL, `commission` double NOT NULL, `fund_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bc_fund_sell_commission` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `less_than_day` int NOT NULL, `commission` double NOT NULL, `fund_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bd_fund_deal` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `fund_id` varchar(255) NOT NULL, `apply_buy_date` datetime NOT NULL COMMENT '申请买入日期', `buy_date` datetime NULL COMMENT '买入日期', `buy_money` double NOT NULL COMMENT '买入金额', `buy_count` double NULL COMMENT '买入份额' DEFAULT 0, `buy_price` double NULL COMMENT '买入价格', `buy_commission` double NULL COMMENT '买入手续费', `data_status` varchar(255) NOT NULL COMMENT '数据状态，关联字典fund_data_status' DEFAULT '0', `status` varchar(255) NOT NULL COMMENT '记录状态，关联字典fund_deal_status' DEFAULT '0', `total_sell_count` double NOT NULL COMMENT '合计卖出份额' DEFAULT 0, `total_sell_money` double NOT NULL COMMENT '合计卖出金额' DEFAULT 0, `total_sell_commission` double NOT NULL COMMENT '合计卖出手续费' DEFAULT 0, `remain_count` double NOT NULL COMMENT '剩余份额' DEFAULT 0, `market_value` double NOT NULL COMMENT '市值' DEFAULT 0, `profit_radio` double NOT NULL COMMENT '盈利比例' DEFAULT 0, `profit_money` double NOT NULL COMMENT '盈利金额' DEFAULT 0, `user_id` varchar(255) NOT NULL COMMENT '买入用户id', INDEX `IDX_0b3c5130a9be381b5df5ec45c3` (`data_status`), INDEX `IDX_3a09e1817e5946dbfdcaa33bb9` (`status`), INDEX `IDX_e42d16f2e55908255231729f52` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `bd_fund_deal_sell` (`id` varchar(36) NOT NULL, `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `create_by` varchar(36) NULL, `update_by` varchar(36) NULL, `fund_deal_id` varchar(255) NOT NULL COMMENT '买入记录ID', `apply_sell_date` datetime NOT NULL COMMENT '申请卖出日期', `sell_date` datetime NULL COMMENT '卖出日期', `sell_count` double NOT NULL COMMENT '卖出数量', `sell_price` double NULL COMMENT '卖出单价', `sell_money` double NULL COMMENT '卖出金额', `sell_commission` double NULL COMMENT '卖出手续费', `data_status` varchar(255) NOT NULL COMMENT '数据状态，关联字典fund_data_status' DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB;
ALTER TABLE `bc_bill_type` ADD `is_leaf` tinyint NULL COMMENT '是否为叶子';
ALTER TABLE `bc_dict_data` ADD `is_leaf` tinyint NULL COMMENT '是否为叶子';
ALTER TABLE `bc_fund` ADD CONSTRAINT `FK_7204af1f31fdee503ee110a55c8` FOREIGN KEY (`fund_type_id`) REFERENCES `bc_fund_type`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE `bc_fund` ADD CONSTRAINT `FK_dafbb18578b9b7b9883e50673c8` FOREIGN KEY (`fund_buss_type_id`) REFERENCES `bc_fund_buss_type`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE `bd_fund_price` ADD CONSTRAINT `FK_46c8d3425f31210cc0e915619a8` FOREIGN KEY (`fund_id`) REFERENCES `bc_fund`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bc_fund_buy_commission` ADD CONSTRAINT `FK_cf616d807b47c030aae7c31f0a4` FOREIGN KEY (`fund_id`) REFERENCES `bc_fund`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bc_fund_sell_commission` ADD CONSTRAINT `FK_2231094da29517b84ab63eff7be` FOREIGN KEY (`fund_id`) REFERENCES `bc_fund`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bd_fund_deal` ADD CONSTRAINT `FK_3917e5575e4d393c83a620204f2` FOREIGN KEY (`fund_id`) REFERENCES `bc_fund`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `bd_fund_deal_sell` ADD CONSTRAINT `FK_ce127373717432adb21e821053d` FOREIGN KEY (`fund_deal_id`) REFERENCES `bd_fund_deal`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
CREATE VIEW `bc_bill_type_view` AS select t.*,t1.name parent_name,t2.value type_value from bc_bill_type t left join bc_bill_type t1 on t1.id = t.parent_id left join bc_dict_data t2 on t2.code = t.type and t2.type_code = 'bill_type' ;
CREATE VIEW `bc_card_view` AS select card.*, cardType.name as card_type_name, user.name as user_name from bc_card card left join bc_card_type cardType on cardType.id = card.card_type_id left join bc_user user on user.id = card.user_id;
CREATE VIEW `bc_dict_data_view` AS select t.*, t1.value as type_code_value from bc_dict_data t left join bc_dict_type t1 on t1.code = t.type_code;
CREATE VIEW `bd_bill_view` AS select bill.*, user.name as user_name, billType.name as bill_type_name, billType.type as bill_type_type, dictData.value as bill_type_type_value, card.name as card_name, card.user_id as card_user_id, cardUser.name as card_user_name, targetCard.name as target_card_name, targetCard.user_id as target_card_user_id, targetCardUser.name as target_card_user_name from bd_bill bill left join bc_bill_type billType on billType.id = bill.bill_type_id left join bc_user user on user.id = bill.user_id left join bc_card card on card.id = bill.card_id left join bc_user cardUser on cardUser.id = card.user_id left join bc_card targetCard on targetCard.id = bill.target_card_id left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id left join bc_dict_data dictData on dictData.code = billType.type and dictData.type_code = 'bill_type';
CREATE VIEW `bc_bill_template_view` AS select billTemplate.*, user.name as user_name, billType.name as bill_type_name, billType.type as bill_type_type, billTypeDict.value as bill_type_value, card.name as card_name, card.user_id as card_user_id, cardUser.name as card_user_name, targetCard.name as target_card_name, targetCard.user_id as target_card_user_id, targetCardUser.name as target_card_user_name from bc_bill_template billTemplate left join bc_bill_type billType on billType.id = billTemplate.bill_type_id left join bc_dict_data billTypeDict on billTypeDict.code = billType.type and billTypeDict.type_code = 'bill_type' left join bc_user user on user.id = billTemplate.user_id left join bc_card card on card.id = billTemplate.card_id left join bc_user cardUser on cardUser.id = card.user_id left join bc_card targetCard on targetCard.id = billTemplate.target_card_id left join bc_user targetCardUser on targetCardUser.id = targetCard.user_id ;
CREATE VIEW `bd_stat_bill_m_view` AS select uuid() as id, t.bill_type_id, t.card_id, t.user_id, card.name as card_name, user.name as user_name, billType.name as bill_type_name, t.money, billType.type as billTypeType, str_to_date(concat(t.date_time, '-01 00:00:00'), '%Y-%m-NaN %H:%i:%s')as date_time from (select ROUND(sum(t.money), 2) as money, DATE_FORMAT(t.date_time, '%Y-%m') as date_time, t.bill_type_id, t.card_id, t.user_id from bd_bill t left join bc_bill_type t1 on t1.id = t.bill_type_id group by DATE_FORMAT(t.date_time, '%Y-%m'), t.user_id, t.bill_type_id, t.card_id) t left join bc_card card on card.id = t.card_id left join bc_user user on user.id = t.user_id left join bc_bill_type billType on billType.id = t.bill_type_id;
CREATE VIEW `bc_fund_view` AS select t.*, t1.name as fund_buss_type_name, t2.name as fund_type_name from bc_fund t left join bc_fund_buss_type t1 on t1.id = t.fund_buss_type_id left join bc_fund_type t2 on t2.id = t.fund_type_id ;
CREATE VIEW `bd_fund_deal_view` AS SELECT t.*, t1.code AS fund_code, t1.name AS fund_name, t2.name AS user_name, t3.value AS status_value, t4.value AS data_status_value FROM bd_fund_deal t LEFT JOIN bc_fund t1 ON t1.id = t.fund_id LEFT JOIN bc_user t2 ON t2.id = t.user_id LEFT JOIN bc_dict_data t3 ON t3.code = t.status AND t3.type_code = 'fund_deal_status' LEFT JOIN bc_dict_data t4 ON t4.code = t.data_status AND t4.type_code = 'fund_data_status' ;
CREATE VIEW `bd_fund_deal_sell_view` AS select t.*, t1.value as data_status_value, t3.name as fund_name from bd_fund_deal_sell t left join bc_dict_data t1 on t1.code = t.data_status and t1.type_code = 'fund_data_status' left join bd_fund_deal t2 on t2.id = t.fund_deal_id left join bc_fund t3 on t3.id = t2.fund_id ;
CREATE VIEW `bd_fund_price_view` AS select t.*, t1.code as fund_code, t1.name as fund_name from bd_fund_price t left join bc_fund t1 on t1.id = t.fund_id;
update bc_bill_type
set is_leaf = 1
where id not in (
    select it.parent_id
    from (select it.parent_id
          from bc_bill_type it
          where it.parent_id is not null) it
)
  and parent_id is not null;
update bc_bill_type
set is_leaf = 0
where is_leaf is null;

ALTER TABLE `bc_fund` ADD `start_date` datetime NULL COMMENT '发行时间';
