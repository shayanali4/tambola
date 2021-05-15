ALTER TABLE `game`
ADD COLUMN `gameprice` TEXT NULL AFTER `called_numbers`;

DROP procedure IF EXISTS `USPgamesave`;


DELIMITER $$
CREATE  PROCEDURE `USPgamesave`(IN `product_id` INT, `product_status` VARCHAR(10), `product_createdbyid` INT, IN `client_id` INT, `product_launchdate` DATETIME, `product_drawsequence` LONGTEXT, `product_tickets` LONGTEXT, `product_winners` LONGTEXT, `product_called_numbers` TEXT,
 `product_gameprice` TEXT)
BEGIN
DECLARE isExit,i,_length,_gameid int DEFAULT 0;

if product_id = 0 then

		insert into game(createdbyid,status,launchdate,createdbydate,clientid,drawsequence, winners, called_numbers,gameprice)
		values(product_createdbyid,product_status,product_launchdate,now(), client_id,product_drawsequence, product_winners, product_called_numbers,product_gameprice);

        SELECT LAST_INSERT_ID() into _gameid;

			SET _length = JSON_LENGTH(product_tickets);
		WHILE  i < _length DO

			insert into gametickets(gameid,ticket,ticketid)
            value(_gameid,JSON_EXTRACT(product_tickets,CONCAT('$[',i,'].ticket')) , JSON_EXTRACT(product_tickets,CONCAT('$[',i,'].ticketid')));

			SET  i = i + 1;
	    END WHILE;



    elseif product_id  > 0 then


	update game set
   status = product_status,
    launchdate = product_launchdate,
    modifiedbyid=product_createdbyid,
    modifiedbydate=now(),
    gameprice = product_gameprice
    where id =product_id and clientid=client_id;

end if;
END$$

DELIMITER ;
;




DROP procedure IF EXISTS `USPgamepageview`;

DELIMITER $$
CREATE  PROCEDURE `USPgamepageview`(IN `client_id` INT)
BEGIN
    declare _gameid int;
    declare _launchdate datetime;
    declare _drawsequence,_called_numbers,_gameprice text;
        declare _winners longtext;

    select id,launchdate,drawsequence,called_numbers,winners ,gameprice
    into _gameid,_launchdate,_drawsequence,_called_numbers,_winners,_gameprice
    from game where status = 1 and deleted = 0 order by id desc limit 1;

    select  _gameid id,_launchdate launchdate,now() currentdate,_drawsequence drawsequence, _called_numbers called_numbers,_winners winners, _gameprice gameprice;
    select * from gametickets where gameid = _gameid;

END$$

DELIMITER ;
;



ALTER TABLE `gametickets`
ADD COLUMN `mobile` VARCHAR(12) NULL AFTER `customer`;




DROP procedure IF EXISTS `USPgamebookticketsearch`;


DELIMITER $$
CREATE  PROCEDURE `USPgamebookticketsearch`(IN `product_createdbyid` INT, IN `client_id` INT)
BEGIN

    declare _gameid, _salescount int;
    declare _launchdate datetime;
    declare _drawsequence text;

    select g.id,g.launchdate,g.drawsequence,
    (select count(1) from gametickets where gameid = g.id and salesbyid = product_createdbyid)
    into _gameid,_launchdate,_drawsequence,_salescount
    from game g where g.status = 1 order by g.id desc limit 1;

    select  _gameid id,_launchdate launchdate,_drawsequence drawsequence, _salescount salescount;
    select * from gametickets where gameid = _gameid;

END$$

DELIMITER ;
;




DROP procedure IF EXISTS `USPgamemysalessearch`;


DELIMITER $$
CREATE  PROCEDURE `USPgamemysalessearch`(IN `client_id` INT, IN `user_id` INT)
BEGIN

declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

select * from gametickets where gameid = _gameid and salesbyid = user_id;

END$$

DELIMITER ;
;


DROP procedure IF EXISTS `USPgameallsalessearch`;


DELIMITER $$
CREATE  PROCEDURE `USPgameallsalessearch`(IN `client_id` INT, IN `user_id` INT)
BEGIN

declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

select ticketid, customer, concat(u.firstname, ' ', u.lastname) agentname,g.mobile  from gametickets g inner join user u
on u.id = g.salesbyid where gameid = _gameid ;

END$$

DELIMITER ;
;



DROP procedure IF EXISTS `USPgamebookticketsave`;


DELIMITER $$
CREATE  PROCEDURE `USPgamebookticketsave`(IN `product_id` INT, IN `product_gameid` INT, IN `product_ticketid` INT,
 IN `product_sheetid` INT, `product_customer` VARCHAR(250),
 `product_mobile` VARCHAR(12), `product_createdbyid` INT, IN `client_id` INT)
BEGIN
DECLARE isExit,i,_length,_gameid int DEFAULT 0;
declare _customer varchar(250);


if product_sheetid > 0 then
	set product_ticketid = (product_sheetid-1)*6;

    select count(1) into _customer from gametickets where
	gameid = product_gameid
    and customer is null
    and ticketid in (product_ticketid + 1, product_ticketid + 2, product_ticketid+ 3,product_ticketid + 4, product_ticketid + 5 ,product_ticketid + 6);

    if _customer < 6 then
		call ERROR(Concat('This sheet can\'t be sold.'));
	end if;

    update gametickets set customer = product_customer,
	mobile = product_mobile, salesbyid = product_createdbyid,
	salesbydate = now()   where
	gameid = product_gameid and ticketid in (product_ticketid + 1, product_ticketid + 2, product_ticketid+ 3,product_ticketid + 4, product_ticketid + 5 ,product_ticketid + 6);

else

	select customer into _customer from gametickets where id = product_id and gameid = product_gameid and ticketid = product_ticketid
	and salesbyid != product_createdbyid;

	if _customer is not null then
		call ERROR(Concat('Ticket is already sales to another customer'));
	end if;

	update gametickets set customer = product_customer,
	mobile = product_mobile, salesbyid = product_createdbyid,
	salesbydate = now()   where id = product_id and gameid = product_gameid and ticketid = product_ticketid;
end if;

END$$

DELIMITER ;
;




DELIMITER $$
CREATE PROCEDURE `USPgamebookticketdelete`(IN `product_id` INT, IN `product_gameid` INT, IN `product_ticketid` INT,
 IN `product_sheetid` INT, `product_customer` VARCHAR(250),
 `product_mobile` VARCHAR(12), `product_createdbyid` INT, IN `client_id` INT)
BEGIN
DECLARE isExit,i,_length,_gameid int DEFAULT 0;
declare _customer varchar(250);


if product_sheetid > 0 then
	set product_ticketid = (product_sheetid-1)*6;

    update gametickets set customer = null,
	mobile = null, salesbyid = null,
	salesbydate = null   where
	gameid = product_gameid and ticketid in (product_ticketid + 1, product_ticketid + 2, product_ticketid+ 3,product_ticketid + 4, product_ticketid + 5 ,product_ticketid + 6);

else

	update gametickets set customer = null,
	mobile = null, salesbyid = null,
	salesbydate = null   where id = product_id and gameid = product_gameid and ticketid = product_ticketid;
end if;

END$$

DELIMITER ;
;
