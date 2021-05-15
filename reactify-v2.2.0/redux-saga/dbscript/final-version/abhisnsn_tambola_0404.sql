-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 04, 2021 at 05:58 AM
-- Server version: 10.3.28-MariaDB-log-cll-lve
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abhisnsn_tambola`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `ERROR` (`message` VARCHAR(256))  BEGIN

ROLLBACK;

SIGNAL SQLSTATE
    'ERR0R'
SET
    MESSAGE_TEXT = `message`,
    MYSQL_ERRNO = 9999;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `getClientURL` (IN `client_emailid` VARCHAR(50))  BEGIN

	DECLARE isExistEmail int DEFAULT 0;

	SELECT count(1) into isExistEmail FROM client where useremail=client_emailid and deleted=0;

		if isExistEmail = 1 then
                select clienttype,redirecturi from client where useremail=client_emailid and deleted=0;
		else
				Call `ERROR`('Email Address not valid.');
		end if;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPadvertisementbulkpublishingstatussave` (IN `advertisement_id` LONGTEXT, IN `isEnable` TINYINT(1), IN `client_id` INT)  BEGIN

 if isEnable = 1 then
    update advertisement set publishingstatus = 1 WHERE  clientid = client_id;

 else

    update advertisement set publishingstatus = 0 where clientid = client_id ;

 end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPadvertisementdelete` (IN `advertisement_id` INT, IN `user_id` INT)  BEGIN

update advertisement set
deleted = 1,
modifiedbyid = user_id,
modifiedbydate = now()
where id=advertisement_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPadvertisementsave` (IN `advertisement_id` INT, IN `advertisement_link` VARCHAR(500), IN `advertisement_content` VARCHAR(1100), IN `advertisement_image` VARCHAR(200), IN `advertisement_createdbyid` INT, IN `client_id` INT, IN `advertisement_category` VARCHAR(50), IN `advertisement_publishingstatus` TINYINT(1), IN `advertisement_publishstartdate` DATE, IN `advertisement_publishenddate` DATE, IN `advertisement_quotetype` VARCHAR(50), IN `branchid_id` INT, IN `advertisement_title` VARCHAR(400))  BEGIN
DECLARE isMaximun int DEFAULT 0;

if advertisement_id =0  then

		if (advertisement_category = 1 or advertisement_category = 3) then
            SELECT count(1) into isMaximun FROM advertisement where advertisementcategory = advertisement_category  and clientid = client_id
			and branchid = branchid_id and deleted = 0 and publishingstatus = 1;

			if isMaximun >= 5  then
				Call `ERROR` ('You can configure max five active advertisement/news ticker only.');
			end if;
		end if;

 	insert into advertisement(link,content,image,createdbyid,createdbydate,clientid,
    advertisementcategory,publishingstatus,publishstartdate,publishenddate,
    quotetype,branchid,title)
    values(advertisement_link,advertisement_content,advertisement_image,advertisement_createdbyid,
    now(),client_id,advertisement_category,advertisement_publishingstatus,advertisement_publishstartdate,
    advertisement_publishenddate,advertisement_quotetype,branchid_id,advertisement_title);

elseif advertisement_id > 0 then


if (advertisement_category = 1 or advertisement_category = 3) then
            SELECT count(1) into isMaximun FROM advertisement where advertisementcategory = advertisement_category  and clientid = client_id
			and branchid = branchid_id and deleted = 0 and publishingstatus = 1 and id !=advertisement_id;

			if isMaximun >= 5  then
				Call `ERROR` ('You can configure max five active advertisement/news ticker only.');
			end if;
		end if;

	update advertisement set
	link    = advertisement_link,
	content = advertisement_content,
    image   = advertisement_image,
    modifiedbyid   = advertisement_createdbyid,
    modifiedbydate = now(),
    advertisementcategory = advertisement_category,
    publishingstatus = advertisement_publishingstatus,
    publishstartdate = advertisement_publishstartdate,
    publishenddate = advertisement_publishenddate,
    quotetype = advertisement_quotetype,
    title = advertisement_title
	where id = advertisement_id and clientid=client_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPadvertisementsearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _totalspace,_userId,_branchid INT;
    DECLARE filtered, sorted , obj,_exerciselist LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(5000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.userId'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_userId,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = concat('a.id,a.image,a.link,a.content,
    case when publishingstatus = 1 then "Yes" else "No" end publishingstatus,
    advertisementcategory,(advertisementcategory+0)advertisementcategoryId,publishstartdate,
    publishenddate,quotetype,title ');
    set _table = concat(' from advertisement a');
	set _where = concat(' where a.deleted = 0 and a.clientid = ', client_id ,
    ' and a.branchid = ', _branchid );

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
		  if _id = 'advertisementcategory' then
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'title' then
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
		  elseif _id = 'quotetype' then
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'publishstartdate' or _id = 'publishenddate' then
			set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
		  elseif _id = 'publishingstatus' then
			 if _value = 1 then
				set _where = concat(_where , ' and publishingstatus = 1');
			 elseif _value = 2 then
				set _where = concat(_where , ' and publishingstatus = 0');
			end if;
		  else
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	      end if;
    	end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by a.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPadvertisementview` (IN `advertisement_id` INT)  BEGIN

select  id,link,content,image,(advertisementcategory+0) advertisementcategoryId ,advertisementcategory,
publishingstatus,publishstartdate,publishenddate,(quotetype+0) quotetypeId ,quotetype,title
 from advertisement where id=advertisement_id and deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPallocatedietdelete` (IN `diet_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN

update allocatediet set
deleted=1, modifiedbyid = user_id, modifiedbydate = now()
where id=diet_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPallocatedietsave` (IN `diet_id` INT, IN `diet_memberid` VARCHAR(100), IN `diet_dateonwards` DATETIME, IN `diet_tilltodate` DATE, IN `diet_phases` LONGTEXT, IN `diet_createdbyid` INT, IN `client_id` INT, IN `diet_isnonveg` VARCHAR(20), IN `diet_iseggfille` VARCHAR(20))  BEGIN
if diet_id =0 then
	insert into allocatediet(memberid,dateonWards,phases,
    createdbyid,createdbydate,isnonveg,iseggfille,tilltodate)
    values(diet_memberid,diet_dateonwards,diet_phases,diet_createdbyid,
    now(),diet_isnonveg,diet_iseggfille,diet_tilltodate);

elseif diet_id > 0 then
	update allocatediet set
	memberid=diet_memberid,
	dateonWards=diet_dateonwards,
    phases=diet_phases,
    modifiedbyid=diet_createdbyid,
    modifiedbydate=now(),
    isnonveg = diet_isnonveg,
    iseggfille = diet_iseggfille,
    tilltodate = diet_tilltodate
	where id=diet_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPallocatedietsearch` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid,_archivedworkoutfilter INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(500);
    DECLARE _columns varchar(1000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.archivedworkoutfilter'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid,_archivedworkoutfilter,
    client_offsetvalue;

	set _offset = pageIndex * pageSize;
	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = ' a.id,concat(m.firstname,'' '',m.lastname) as name,m.membercode, dr.routinename
    ,a.dateonWards, CAST( JSON_EXTRACT(a.phases, ''$[0].noofweeks'') as SIGNED) ''weeks'',
    DATE_ADD(a.dateonWards, INTERVAL CAST( JSON_EXTRACT(a.phases, ''$[0].noofweeks'') as SIGNED) * 7 - 1 Day) enddate ,
    DATEDIFF(DATE_ADD(a.dateonWards, INTERVAL CAST( JSON_EXTRACT(a.phases, ''$[0].noofweeks'') as SIGNED) * 7 - 1 Day) , now()) ''daysleft'',
	concat(u.firstname ,'' '' , u.lastname) createdby,a.createdbydate,
	concat(um.firstname ,'' '' , um.lastname) modifiedby,a.modifiedbydate,a.tilltodate,
    m.mobile,m.personalemailid,a.memberid,
    m.image,m.memberprofileimage,case when m.balance < 0 then abs(m.balance) else 0 end as dues,
	m.status,(m.status + 0) statusId,m.gender, (m.gender + 0) genderId,m.createdbydate ''membercreatedbydate'' ,
    m.lastdisclaimerid';
    set _table = '  from allocatediet a
        INNER JOIN member m ON a.memberid = m.id
        inner join user u on a.createdbyid = u.id
			left outer join user um on a.modifiedbyid = um.id
        left outer join dietroutine dr on dr.id = CAST( JSON_EXTRACT(a.phases, ''$[0].routineid'') as SIGNED) ';

	set _where = concat(' where a.deleted = 0 and m.clientid = ', client_id , ' and
		(case when m.enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

	if _archivedworkoutfilter = 1 then
			set _where = concat(_where , ' and ( a.id is not null and date(a.tilltodate) < date(getDateFromUTC(now(),''',client_offsetvalue,''',-1)) )');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' and _value != 'null' then
         if _id = 'name' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname)  ', ' like ''%', _value ,'%'''));
		elseif _id= 'dateonWards' or _id= 'tilltodate' then
				  set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
        elseif _id = 'enddate' then
			set _where = CONCAT(_where , CONCAT(' and date(DATE_ADD(a.dateonWards, INTERVAL CAST( JSON_EXTRACT(a.phases, ''$[0].noofweeks'') as SIGNED) * 7 - 1 Day)) = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
		elseif _id= 'createdbydate' or _id= 'modifiedbydate' then
				  set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(a.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
       elseif _id= 'createdby' then
			      set _where = CONCAT(_where , CONCAT(' and concat(u.firstname,'' '',u.lastname) like ''%', _value ,'%'''));
        elseif _id= 'modifiedby' then
			      set _where = CONCAT(_where , CONCAT(' and concat(um.firstname,'' '',um.lastname) like ''%', _value ,'%'''));
      elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));

      else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
              end if;
             end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by a.deleted , a.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPallocatedietview` (IN `diet_id` INT, IN `client_id` INT)  BEGIN


	DECLARE x,_id , _lastdisclaimerid INT;
	DECLARE _dateonWards,_tilltodate date;
	DECLARE membername,memberId,iseggfille,isnonveg,iseggfilleId,isnonvegId varchar(50);
	DECLARE _phases , _allocatedietdetail,_member LONGTEXT ;
    DECLARE _membername,_membercode,_mobile,_personalemailid varchar(200);

    DECLARE i,j,reciep_id,_recordtypeId,k INT;
	DECLARE _recipename varchar(4000) default '';
	DECLARE _routinedaysdetail,_newroutinedaysdetail,_meals,_newmeals LONGTEXT ;
    DECLARE _dietdayroutine,_meal,_routinerecipedetail,_routinerecipe,_nutrition,_newroutinerecipe LONGTEXT ;
    DECLARE _tempdietroutine, _newdietscheduledetail LONGTEXT ;

	set _newdietscheduledetail = JSON_ARRAY();

        select  a.id,a.dateonWards,tilltodate,a.phases,a.iseggfille,(a.iseggfille+0),a.isnonveg,(a.isnonveg+0),
		ref_ws.id 'memberId',concat(ref_ws.firstname,' ',ref_ws.lastname ),lastdisclaimerid,
        concat(firstname,' ',lastname) membername,membercode,mobile,personalemailid
		into _id,_dateonWards,_tilltodate,_phases,iseggfille,iseggfilleId,isnonveg,isnonvegId,
        memberId,membername,_lastdisclaimerid,_membername,_membercode,_mobile,_personalemailid
        from allocatediet a
		left outer join member ref_ws on a.memberid = ref_ws.id
		where a.id=diet_id and ref_ws.clientid = client_id and a.deleted = 0;

		SET x = 0 ;

		WHILE  x < JSON_LENGTH(_phases) DO
			SELECT JSON_EXTRACT(_phases ,CONCAT('$[',x,']'))  into _allocatedietdetail;
            set x = x + 1;

			select routinedays into _routinedaysdetail  from dietroutine
			where id=JSON_EXTRACT(_allocatedietdetail ,'$.routineid') and clientid = client_id and deleted = 0;

			SET i = 0 ;
			set _newroutinedaysdetail = JSON_ARRAY();

			WHILE  i < JSON_LENGTH(_routinedaysdetail) DO

				SELECT JSON_EXTRACT(_routinedaysdetail ,CONCAT('$[',i,']')) into _dietdayroutine;
				SET  i = i + 1;

                SELECT JSON_EXTRACT(_dietdayroutine , '$.meals') into _meals;
            	SET j = 0;
				set _newmeals = JSON_ARRAY();

                WHILE  j < JSON_LENGTH(_meals) DO
				   SELECT JSON_EXTRACT(_meals,CONCAT('$[',j,']')) into _meal;
				   SET  j = j + 1;

					select JSON_EXTRACT(_meal, '$.routinerecipe') into _routinerecipedetail;
				    SET k = 0;

					set _newroutinerecipe = JSON_ARRAY();
					WHILE  k < JSON_LENGTH(_routinerecipedetail) DO
						SELECT JSON_EXTRACT(_routinerecipedetail,CONCAT('$[',k,']')) into _routinerecipe;
						SET  k = k + 1;
						select JSON_EXTRACT(_routinerecipe, '$.id') into reciep_id;
					    select recipename,nutrition into _recipename,_nutrition from recipe where id = reciep_id;
					    set _routinerecipe =  JSON_SET(_routinerecipe,'$.recipename', _recipename,
					   '$.nutrition',_nutrition);
						SET _newroutinerecipe = JSON_MERGE_PRESERVE(_newroutinerecipe,(CASE WHEN _routinerecipe != 'null' then _routinerecipe ELSE null END));
			       END WHILE;

			    set _meal = JSON_SET(_meal,'$.routinerecipe',(CASE WHEN _newroutinerecipe != '[]' then _newroutinerecipe ELSE null END));
			    SET _newmeals = JSON_MERGE_PRESERVE(_newmeals,_meal);
			END WHILE;

				set _dietdayroutine =  JSON_SET(_dietdayroutine,'$.meals', _newmeals);
				SET _newroutinedaysdetail = JSON_MERGE_PRESERVE(_newroutinedaysdetail, _dietdayroutine);
		END WHILE;

         			select JSON_SET('{}', '$.id' , id, '$.routineid' , id , '$.routinename',routinename,
            '$.routinetype',routinetype, '$.isnonveg',isnonveg,
            '$.iseggfille', iseggfille, '$.tips' , tips,'$.tips' , tips,
            '$.noofweeks' , JSON_EXTRACT(_allocatedietdetail ,'$.noofweeks') , '$.routinedays' ,case when (mealplan + 0) != 2 then  _newroutinedaysdetail else null end,
             '$.dos',dos, '$.donts' ,donts, '$.routinemealpdf' ,routinemealpdf,
             '$.mealplanId',(mealplan + 0) , '$.enablememberdownload',enablememberdownload )
            into _tempdietroutine  from dietroutine
	       where id= JSON_EXTRACT(_allocatedietdetail ,'$.routineid') and clientid = client_id and deleted = 0;

			SET _newdietscheduledetail = JSON_MERGE_PRESERVE(_newdietscheduledetail, _tempdietroutine);
		END WHILE;

		select _dateonWards as dateonWards,_tilltodate as tilltodate,membername as member,memberId,_id as id,iseggfille,iseggfilleId,
        isnonveg,isnonvegId,_newdietscheduledetail phases , _lastdisclaimerid,_membername,_membercode,_mobile,_personalemailid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxaddfpusersstaff` (IN `userid` VARCHAR(50))  BEGIN

	update db_iclock.Staffs set deleted = 0 where StaffBiometricCode = userid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxdeletefpusersstaff` (IN `userid` VARCHAR(50))  BEGIN

	update db_iclock.Staffs set deleted = 1 where StaffBiometricCode = userid;

	END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxdeleteschedulerview` (IN `client_offsetvalue` INT)  BEGIN
DECLARE _currentdate date;
set _currentdate = date(getDateFromUTC(now(),getDateOffset(REPLACE(client_offsetvalue,'"','')),-1));

select st.StaffBiometricCode
from member  m
inner join db_iclock.Staffs st on concat(m.clientid,m.membercode)  = st.StaffBiometricCode
inner join subscriptionhistory sh on m.id  = sh.member
inner join branch br on br.id = m.defaultbranchid and _currentdate between date(br.activationdate) and date(br.expirydate)
where m.status = 2 and m.timezoneoffsetvalue = client_offsetvalue  and
(date(expirydatesubscription) = DATE_ADD(_currentdate, INTERVAL -1 DAY) ||
(sh.totalminutes is not null and sh.totalminutes > 0 and sh.totalminutes <= ifnull(sh.consumedminutes,0))) and
m.clientid in (select id from client where client.status = 1)
and st.deleted = 0;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxLogdatamembersearchdatewise` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize,pageIndex,client_id, _offset,i, _length,_branchid  INT;
    DECLARE filtered,sorted, obj ,startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value,_orderby,_limit, _table, exportXLSX,
    _sendmail,_tablename, month_filter,year_filter,client_offsetvalue varchar(500);
	DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.sendMail'),
    JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, startdate,enddate,exportXLSX,
    pageIndex, client_id, filtered, sorted,_sendmail, month_filter,year_filter,_branchid,client_offsetvalue ;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _tablename = concat('SwipeDetails_', month_filter ,'_', year_filter );

        SELECT count(1) into isExist
		FROM information_schema.tables
		WHERE table_schema = 'db_iclock'
		AND table_name = _tablename
		LIMIT 1;

	if isExist > 0 then

		set _columns = concat('SUM(difference) difference,m.id,
						  concat(firstname,'' '',lastname) as name,gender,UserId as membercode,
                          date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1)) createdbydate');
		set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
				inner join member m  on ref_sd.UserId = concat(m.clientid,m.membercode)
				where m.deleted = 0 and m.clientid = ', client_id, ' and
                ref_sd.BiometricId in (SELECT BiometricId FROM db_iclock.Biometrics
				where SerialNumber in (select serialnumber from biometric where branchid = ',_branchid,')) ');
		set _where = '';

		SET i = 0;
		SET _length = JSON_LENGTH(filtered);
		WHILE  i < _length DO
			SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
			select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

			set _id = REPLACE(_id,'"','');
			set _value = REPLACE(_value,'"','');

			if _value != '' and _value != 'null' then

				if _where != '' then
					set _where = concat(_where , ' and ');
				end if;

				if _id ='createdbydate' then
						set _where = CONCAT(_where , CONCAT(' date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
                elseif _id= 'gender' then
						set _where = CONCAT(_where , CONCAT( _id , ' = ', _value));
				elseif _id = 'membercode' then
						set _where = CONCAT(_where , CONCAT( 'UserId like ''%', _value ,'%'''));
			    else
					    set _where = CONCAT(_where , CONCAT( _id , ' like ''%', _value ,'%'''));
				end if;
			end if;
			SET  i = i + 1;
		END WHILE;

		if _where != '' then
			set _where = concat(' having ' , _where);
		end if;

		SET _orderby = '';
		SET i = 0;
				SET _length = JSON_LENGTH(sorted);
				WHILE  i < _length DO
					SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
					select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

					set _id = REPLACE(_id,'"','');

					set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

					SET  i = i + 1;
				END WHILE;

				if _orderby != '' then
					set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
				else
					set _orderby = concat(' order by date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1)) desc');
				end if;

				set	_orderby = concat(' group by date(getDateFromUTC(intime,''',client_offsetvalue,''',-1)),UserId,m.id  ', _where , _orderby );

				set _limit = concat(' limit ', pageSize ,' offset ', _offset);

				if(exportXLSX = 'true' or _sendmail = 'true') then
					set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
				else
					set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );
				end if;

				 PREPARE stmt FROM @_qry;
				 EXECUTE stmt ;
				 DEALLOCATE PREPARE stmt;

				set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', ' from
				(select count(1) , ' , _columns , _table ,' group by date(getDateFromUTC(intime,''',client_offsetvalue,''',-1)),UserId,m.id ' , _where , ' )pagecount');
		     	  PREPARE stmt FROM @_qry;
				  EXECUTE stmt;

        else
					Call `ERROR`('Table is not exists.');
		end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxLogdataserach` (IN `tableInfo` LONGTEXT)  BEGIN
	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX ,month_filter,year_filter,
    _tablename,client_offsetvalue  varchar(500);
    DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
	JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,
    month_filter,year_filter,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
	set _tablename = concat('SwipeDetails_',month_filter,'_', year_filter);

	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

       SELECT count(1) into isExist
		FROM information_schema.tables
		WHERE table_schema = 'db_iclock'
			AND table_name = _tablename
		LIMIT 1;

		if isExist > 0 then
			set _columns = ' m.id,UserId,InsertDate ,SwipeDirection,VerifyMode,memberprofileimage
			, firstname,lastname,image,concat(firstname,'' '',lastname) as name,
            m.status,(m.status + 0) statusId,ref_sd.intime,ref_sd.outtime,ref_sd.difference,UserId as membercode,gender';
			set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
			 inner join member m  on ref_sd.UserId = concat(m.clientid,m.membercode) ');
			set _where = concat(' where m.deleted = 0 and m.clientid = ', client_id, ' and
                ref_sd.BiometricId in (SELECT BiometricId FROM db_iclock.Biometrics

				where SerialNumber in (select serialnumber from biometric where branchid = ',_branchid,')) ');
		else
					Call `ERROR`('Table is not exists.');
		end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id = 'intime' or _id = 'outtime' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            elseif _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
		    elseif _id = 'UserId' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
	        elseif _id = 'difference' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' >= ', _value ));
			elseif _id = 'name' then
			      set _where = CONCAT(_where , CONCAT(' and concat(firstname,'' '',lastname) like ''%', _value ,'%'''));
			elseif _id= 'gender' then
					set _where = CONCAT(_where , CONCAT( ' and ',_id , ' = ', _value));
			elseif _id = 'membercode' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
            elseif _id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' = ', _value));
           else
			 	set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
         end if;
     end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by ref_sd.intime desc, ref_sd.outtime desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxLogdatausersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX ,month_filter,year_filter,
    _tablename,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
	JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
     JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,
    month_filter,year_filter,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _tablename = concat('SwipeDetails_', month_filter ,'_', year_filter );

    SELECT count(1) into isExist
		FROM information_schema.tables
		WHERE table_schema = 'db_iclock'
			AND table_name = _tablename
		LIMIT 1;

		if isExist > 0 then
			set _columns = 'u.id,InsertDate ,ref_sd.intime,ref_sd.outtime,ref_sd.difference,SwipeDirection,VerifyMode
			, firstname,lastname,image,concat(firstname,'' '',lastname) as name,UserId as employeecode,gender,u.status,(u.status + 0) statusId,
            r.role ''rolename''';
			set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
               inner join  user u  on ref_sd.UserId = concat(u.clientid,u.employeecode)
               left outer JOIN role r on u.assignrole = r.id ');
			set _where = concat(' where u.deleted = 0 and u.clientid = ', client_id , ' and
                ref_sd.BiometricId in (SELECT BiometricId FROM db_iclock.Biometrics
				where SerialNumber in (select serialnumber from biometric where branchid = ',_branchid,')) ');
		else
					Call `ERROR`('Table is not exists.');
		end if;
SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id =   REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id = 'intime' or _id = 'outtime' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
           elseif _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
		  elseif _id = 'employeecode' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
	       elseif _id = 'difference' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' >= ', _value ));
            elseif _id = 'name' then
			      set _where = CONCAT(_where , CONCAT(' and concat(firstname,'' '',lastname) like ''%', _value ,'%'''));
	       elseif _id= 'gender' then
					set _where = CONCAT(_where , CONCAT( ' and ',_id , ' = ', _value));
			elseif _id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and u.', _id , ' = ', _value));
			elseif _id = 'rolename' then
			      set _where = CONCAT(_where , CONCAT(' and r.role like ''%', _value ,'%'''));
          else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
         end if;
     end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by ref_sd.intime desc, ref_sd.outtime desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);
	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxLogdatausersearchdatewise` (IN `tableInfo` LONGTEXT)  BEGIN
	DECLARE pageSize,pageIndex,client_id, _offset,i, _length,_branchid  INT;
    DECLARE filtered,sorted, obj ,startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value,_orderby,_limit, _table, exportXLSX,_sendmail,
    _tablename, month_filter,year_filter,client_offsetvalue varchar(500);
	DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.sendMail'),
    JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
     JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, startdate,enddate,exportXLSX,pageIndex, client_id, filtered, sorted,_sendmail,
    month_filter,year_filter ,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _tablename = concat('SwipeDetails_', month_filter ,'_', year_filter );

       SELECT count(1) into isExist
	   FROM information_schema.tables
	   WHERE table_schema = 'db_iclock'
	   AND table_name = _tablename
	   LIMIT 1;

  if isExist > 0 then

				set _columns = concat(' SUM(difference) difference,
                                  concat(firstname,'' '',lastname) as name,gender, UserId as employeecode,
                                  r.role ''rolename'' , date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1)) createdbydate');
				set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
                        inner join  user u  on ref_sd.UserId = concat(u.clientid,u.employeecode)
                        left outer JOIN role r on u.assignrole = r.id
						where u.deleted = 0 and u.clientid = ', client_id, ' and
						ref_sd.BiometricId in (SELECT BiometricId FROM db_iclock.Biometrics
						where SerialNumber in (select serialnumber from biometric where branchid = ',_branchid,')) ');
				set _where = '';

				SET i = 0;

				SET _length = JSON_LENGTH(filtered);
				WHILE  i < _length DO
					SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
					select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

					set _id = REPLACE(_id,'"','');
					set _value = REPLACE(_value,'"','');

				  if _value != '' and _value != 'null' then

					if _where != '' then
						set _where = concat(_where , ' and ');
					end if;

					if _id ='createdbydate' then
						set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
                    elseif _id= 'gender' then
							set _where = CONCAT(_where , CONCAT( _id , ' = ', _value));
					elseif _id = 'employeecode' or _id = 'name' then
									set _where = CONCAT(_where , CONCAT( _id , ' like ''%', _value ,'%'''));
					elseif _id = 'rolename' then
								set _where = CONCAT(_where , CONCAT(' r.role like ''%', _value ,'%'''));
					end if;
				end if;
				SET  i = i + 1;
			  END WHILE;

			if _where != '' then
				set _where = concat(' having ' , _where);
			end if;

			SET _orderby = '';
			SET i = 0;
			SET _length = JSON_LENGTH(sorted);
				WHILE  i < _length DO
					SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
					select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

					set _id = REPLACE(_id,'"','');

					set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

					SET  i = i + 1;
				END WHILE;

				if _orderby != '' then
					set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
				else
					set _orderby = concat(' order by date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1)) desc');
				end if;

				set	_orderby = concat(' group by concat(firstname,'' '',lastname), gender,UserId,r.role,date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1))   ', _where , _orderby );

				set _limit = concat(' limit ', pageSize ,' offset ', _offset);

				if(exportXLSX = 'true' or _sendmail = 'true') then
					set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby);
				else
					set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );
				end if;

				 PREPARE stmt FROM @_qry;
				 EXECUTE stmt ;
				 DEALLOCATE PREPARE stmt;


				 set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', ' from
					(select count(1) , ' , _columns , _table , ' group by concat(firstname,'' '',lastname), gender,UserId,r.role,date(getDateFromUTC(intime,''', client_offsetvalue ,''',-1))   ', _where , ' )pagecount');
				 PREPARE stmt FROM @_qry;
				 EXECUTE stmt;

  else
					Call `ERROR`('Table is not exists.');

 end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxLogdatausersearchstaffwise` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize,pageIndex,client_id, _offset,i, _length,_branchid  INT;
    DECLARE filtered,sorted, obj ,startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value,_orderby,_limit, _table, exportXLSX,_sendmail,
    _tablename, month_filter,year_filter,client_offsetvalue varchar(500);
	DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.sendMail'),
    JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
     JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, startdate,enddate,exportXLSX,
    pageIndex, client_id, filtered, sorted,_sendmail, month_filter,year_filter,_branchid,client_offsetvalue ;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _tablename = concat('SwipeDetails_', month_filter ,'_', year_filter );

		SELECT count(1) into isExist
		FROM information_schema.tables
		WHERE table_schema = 'db_iclock'
		AND table_name = _tablename
		LIMIT 1;

  if isExist > 0 then

				set _columns = ' SUM(difference) difference,
                                  concat(firstname,'' '',lastname) as name,gender, UserId as employeecode,
                                   r.role ''rolename''';
				set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
                        inner join  user u  on ref_sd.UserId = concat(u.clientid,u.employeecode)
                        left outer JOIN role r on u.assignrole = r.id
						where u.deleted = 0 and u.clientid = ', client_id, ' and
						ref_sd.BiometricId in (SELECT BiometricId FROM db_iclock.Biometrics
						where SerialNumber in (select serialnumber from biometric where branchid = ',_branchid,')) ');
				set _where = '';

				SET i = 0;

				SET _length = JSON_LENGTH(filtered);
				WHILE  i < _length DO
					SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
					select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

					set _id = REPLACE(_id,'"','');
					set _value = REPLACE(_value,'"','');

				  if _value != '' and _value != 'null' then

					if _where != '' then
						set _where = concat(_where , ' and ');
					end if;

					if _id ='createdbydate' then
						set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
                    elseif _id= 'gender' then
							set _where = CONCAT(_where , CONCAT( _id , ' = ', _value));
					elseif _id = 'employeecode' or _id = 'name' then
									set _where = CONCAT(_where , CONCAT( _id , ' like ''%', _value ,'%'''));
					elseif _id = 'rolename' then
								set _where = CONCAT(_where , CONCAT(' r.role like ''%', _value ,'%'''));
                    end if;
				end if;
				SET  i = i + 1;
			  END WHILE;

			if _where != '' then
				set _where = concat(' having ' , _where);
			end if;

			SET _orderby = '';
			SET i = 0;
			SET _length = JSON_LENGTH(sorted);
				WHILE  i < _length DO
					SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
					select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

					set _id = REPLACE(_id,'"','');

					set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

					SET  i = i + 1;
				END WHILE;

				if _orderby != '' then
					set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
				else
					set _orderby = ' order by UserId desc';
				end if;

				set	_orderby = concat(" group by name,UserId,gender,rolename  ", _where , _orderby );

				set _limit = concat(' limit ', pageSize ,' offset ', _offset);

				if(exportXLSX = 'true' or _sendmail = 'true') then
					set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby);
				else
					set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );
				end if;

				 PREPARE stmt FROM @_qry;
				 EXECUTE stmt ;
				 DEALLOCATE PREPARE stmt;

				 set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', " from
					(select count(1) , " , _columns , _table , " group by  concat(firstname,'' '',lastname),UserId,gender,rolename ", _where , " )pagecount");
				 PREPARE stmt FROM @_qry;
				 EXECUTE stmt;

  else
					Call `ERROR`('Table is not exists.');

 end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxmembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid,_memberstatusfilter INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(1000);
    DECLARE IsDesc TINYINT(1);
	DECLARE _columns varchar(1200);
	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.endDate'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue'),
    JSON_EXTRACT(tableInfo,'$.memberstatusfilter')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,_branchid,
    client_offsetvalue,_memberstatusfilter;

	set _offset = pageIndex * pageSize;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = ' id,concat(clientId,membercode) userid,image,memberprofileimage,personalemailid,mobile,
   firstname,lastname ,m.status,(m.status + 0) statusId,m.gender, (m.gender + 0) genderId,membercode ,
   lastcheckin,(select max(expirydatesubscription) from subscription where member =  m.id ) maxexpirydate   ,st.StaffBiometricCode, st.deleted ,
   (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "FP") isfpbiotype,
   (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "Face") isFacebiotype,accesstilldate,
   case when st.StaffBiometricCode and st.deleted = 0 then ''Added'' when st.StaffBiometricCode and st.deleted = 1 then
   ''Deleted'' else ''-'' end isuserinbiometricdevice ,
   case when m.balance < 0 then abs(m.balance) else 0 end as dues ';
    set _table = ' from member m
       left outer join db_iclock.Staffs st on concat(m.clientid,m.membercode)  = st.StaffBiometricCode';


	set _where = concat(' where m.deleted = 0 and clientid = ', client_id , ' and
		(case when enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

    if _memberstatusfilter = 1 then
			set _where = concat(_where , ' and m.status = 1 ');
    elseif _memberstatusfilter = 2 then
			set _where = concat(_where , ' and m.status = 2 ');
	elseif _memberstatusfilter = 3 then
			set _where = concat(_where , ' and m.status = 3');
    elseif _memberstatusfilter = 4 then
			set _where = concat(_where , ' and m.status = 4');
	elseif _memberstatusfilter = 5 then
			set _where = concat(_where , ' and m.status = 5');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
         if _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
		 elseif _id = 'lastcheckin' then
				set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
		 elseif _id = 'userid' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(clientId,membercode) ', ' like ''%', _value ,'%'''));
         elseif _id = 'isuserinbiometricdevice' then
                if _value = 0 then
						set _where = concat(_where , ' and st.StaffBiometricCode is null');
				elseif _value = 1 then
						set _where = concat(_where , ' and st.StaffBiometricCode is not null and st.deleted = 0');
				 elseif _value = 2 then
						set _where = concat(_where , ' and st.StaffBiometricCode is not null and st.deleted = 1');
                end if;
         elseif _id = 'isfpbiotype' then
                if _value = 0 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "FP") <= 0');
				elseif _value = 1 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "FP") > 0');
	            end if;
		 elseif _id = 'isFacebiotype' then
                if _value = 0 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "Face") <= 0');
				elseif _value = 1 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(m.clientid,m.membercode)  = fp.StaffBiometricCode and BioType = "Face") > 0');
	            end if;
		 elseif _id = 'dues' then
				set _where = CONCAT(_where , CONCAT(' and case when m.balance < 0 then abs(m.balance) else 0 end >= ', _value ));
         else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	end if;
   end if;

		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		if _id = 'userid' then
				set _orderby = CONCAT(_orderby , CONCAT(', concat(clientId,membercode) ', case when IsDesc then ' desc ' else ' asc ' end));
		else
				set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));
		end if;

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxunauthorisedLogdataserach` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX ,month_filter,year_filter,
    _tablename,client_offsetvalue  varchar(500);
    DECLARE IsDesc TINYINT(1);
	DECLARE isExist int default 0;

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
	JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,
    month_filter,year_filter,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
	set _tablename = concat('SwipeDetails_',month_filter,'_', year_filter);

    SELECT count(1) into isExist
		FROM information_schema.tables
		WHERE table_schema = 'db_iclock'
			AND table_name = _tablename
		LIMIT 1;

	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

		if isExist > 0 then
			set _columns = ' m.id,UserId,InsertDate ,ref_sd.intime,ref_sd.outtime,ref_sd.difference,SwipeDirection,
							VerifyMode,StaffName as firstname ';
			set _table = concat(' from db_iclock.SwipeDetails_InOut_',month_filter,'_', year_filter,' ref_sd
			 inner join db_iclock.Biometrics ibi on ref_sd.BiometricId =  ibi.BiometricId
            inner join biometric bi on ibi.SerialNumber =  bi.SerialNumber and bi.clientid = ', client_id, ' and bi.branchid = ', _branchid , '
			inner join db_iclock.Staffs ist on ref_sd.UserId =  ist.StaffBiometricCode
			 left outer join member m  on ref_sd.UserId = concat(m.clientid,m.membercode)
			 left outer join user u on ref_sd.UserId = concat(u.clientid,u.employeecode) ');
			set _where = concat(' where m.id is null and u.id is null');
		else
					Call `ERROR`('Table is not exists.');
		end if;
SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id = 'intime' or _id = 'outtime' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            elseif _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'StaffName ', ' like ''%', _value ,'%'''));
		  elseif _id = 'UserId' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
	       elseif _id = 'difference' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' >= ', _value ));
		  elseif _id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' = ', _value));
           else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
         end if;
     end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by ref_sd.intime desc, ref_sd.outtime desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiomaxusersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX,
    client_offsetvalue varchar(1000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.endDate'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,_branchid,
    client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = '  u.id,concat(clientId,employeecode) userid,u.image,u.firstname,u.lastname ,u.employeecode ,u.emailid,u.lastcheckin,
    u.mobile,u.gender, (u.gender + 0) genderId,u.salary, u.dateofjoining ,u.dateofresigning, u.specialization,u.phone,u.address1,u.address2,
	u.city,u.pincode,u.contactnumber,u.personalemailid,u.bloodgroup ,u.dateofbirth,u.status,(u.status + 0) statusId,
   st.StaffBiometricCode,st.deleted,(select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "FP") isfpbiotype,
   (select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "Face") isFacebiotype,
    case when st.StaffBiometricCode and st.deleted = 0 then ''Added'' when st.StaffBiometricCode and st.deleted = 1 then
   ''Deleted'' else ''-'' end isuserinbiometricdevice,lastcheckin';
    set _table = ' from user u
       left outer join db_iclock.Staffs st on concat(u.clientid,u.employeecode)  = st.StaffBiometricCode';

    if(exportXLSX = 'true') then
			set _where = concat(' where createdbydate BETWEEN getDateFromJSON(',startdate,') AND getDateFromJSON(',enddate,')
                           and u.deleted = 0 and clientid = ', client_id , ' and
                           (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ' ) is not null)
         else defaultbranchid = ' , _branchid , ' end)');
	else
			set _where = concat(' where u.deleted = 0 and clientid = ', client_id , ' and (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ' ) is not null)
         else defaultbranchid = ' , _branchid , ' end)');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
         if _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
		 elseif _id = 'lastcheckin' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
         elseif _id = 'userid' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(clientId,employeecode) ', ' like ''%', _value ,'%'''));
		 elseif _id = 'isuserinbiometricdevice' then
                if _value = 0 then
						set _where = concat(_where , ' and st.StaffBiometricCode is null');
				elseif _value = 1 then
						set _where = concat(_where , ' and st.StaffBiometricCode is not null and st.deleted = 0');
				 elseif _value = 2 then
						set _where = concat(_where , ' and st.StaffBiometricCode is not null and st.deleted = 1');
                end if;
      elseif _id = 'isfpbiotype' then
                if _value = 0 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "FP") <= 0');
				elseif _value = 1 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "FP") > 0');
	            end if;
	  elseif _id = 'isFacebiotype' then
                if _value = 0 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "Face") <= 0');
				elseif _value = 1 then
						set _where = concat(_where , ' and (select count(1) from db_iclock.FPUsers fp where concat(u.clientid,u.employeecode)  = fp.StaffBiometricCode and BioType = "Face") > 0');
	            end if;
        elseif _id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and u.', _id , ' = ', _value));

      else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		if _id = 'userid' then
				set _orderby = CONCAT(_orderby , CONCAT(', concat(clientId,employeecode) ', case when IsDesc then ' desc ' else ' asc ' end));
		else
				set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));
		end if;


		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by u.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiometricsave` (IN `biometric_id` INT, IN `biometric_name` VARCHAR(50), IN `biometric_serialnumber` VARCHAR(50), IN `createdby_id` INT, IN `client_id` INT, IN `branch_id` INT, IN `biometric_status` VARCHAR(20))  BEGIN

		if biometric_id = 0  then

			insert into biometric(biometricname,serialnumber,createdbyid,createdbydate,clientid,branchid)
			values(biometric_name,biometric_serialnumber,createdby_id,now(),client_id,branch_id);

		elseif biometric_id > 0 then

		    update biometric set
			status = biometric_status
			where id=biometric_id and clientid=client_id;

		end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiometricsearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = 'id,biometricname,serialnumber,status,(status+0) statusId';
    set _table = ' from biometric b';
	set _where = concat(' where b.deleted = 0 and b.clientid = ', client_id, ' and b.branchid = ' , _branchid);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
		end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by b.deleted, b.id  desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbiometricview` (IN `biometric_id` INT, IN `client_id` INT)  BEGIN
			select id,biometricname,serialnumber
			from biometric b
			 where b.id=biometric_id and b.clientid = client_id and b.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbranchdelete` (IN `branch_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN

	declare isExistinMember,isExistinUser int default 0;

	select count(1) into isExistinMember from member where branchid = branch_id
	and clientid = client_id and deleted = 0;

	select count(1) into isExistinUser from user where find_in_set(branch_id, branchid) and clientid = client_id and deleted = 0;

    if isExistinMember > 0 then
		Call `ERROR`('Branch is associated with a member');
    end if;

    if isExistinUser > 0 then
		Call `ERROR`('Branch is associated with a staffmember');
    end if;

update branch set
deleted=1,
branchname = Concat(branchname,'_D', ID),
modifiedbyid = user_id,
modifiedbydate=now()
where id=branch_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbranchprofileview` (IN `client_id` INT, IN `branch_id` INT)  BEGIN

	select b.id branchid,b.address1,b.address2,b.city,b.pincode,b.description,b.state 'statecode',
    b.gmapaddress,sb.name 'state',cb.name 'country',cb.code 'countrycode',
    cb.languagecode 'languagecode',b.packtype, (b.packtype + 0) packtypeId,

	cb.currency,b.latitude,b.longitude,b.shifttiming,b.timing as schedule,
    b.gymaccessslot,b.slotduration,b.slotmaxoccupancy,(b.slotduration + 0) slotdurationId,b.slotmaxdays,
	b.ptslotdetail ,b.cancelgymaccessslothour,b.cancelptslothour,b.cancelclassslothour,
	b.classmaxdays,b.expirydate,(b.gapbetweentwogymaccessslot +0)
	gapbetweentwogymaccessslotId,b.gapbetweentwogymaccessslot,
    (b.billingtype + 0) billingtypeId
	from branch b
	left outer join country cb on b.country = cb.code
	left outer join state sb on b.state = sb.id
	where b.id= branch_id and b.deleted = 0 and b.clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbranchsave` (IN `branch_id` INT, IN `branch_name` VARCHAR(200), IN `branch_description` VARCHAR(500), IN `branch_address1` VARCHAR(100), IN `branch_address2` VARCHAR(100), IN `branch_pincode` VARCHAR(10), IN `branch_latitude` VARCHAR(100), IN `branch_longitude` VARCHAR(100), IN `branch_carpetarea` VARCHAR(100), IN `branch_ownership` VARCHAR(20), IN `branch_manager` VARCHAR(100), IN `branch_schedule` LONGTEXT, IN `branch_createdbyid` INT, IN `client_id` INT, IN `branch_phoneno` VARCHAR(20), IN `branch_city` VARCHAR(100), IN `branch_state` VARCHAR(100), IN `branch_country` VARCHAR(100), IN `branch_gmaplocation` VARCHAR(500), IN `branch_gymaccessslot` TINYINT(1), IN `branch_slotduration` VARCHAR(20), IN `branch_slotmaxoccupancy` INT, IN `branch_slotmaxdays` INT, IN `branch_ptslotdetail` LONGTEXT, IN `branch_cancelgymaccessslothour` DECIMAL(12,2), IN `branch_cancelptslothour` DECIMAL(12,2), IN `branch_cancelclassslothour` DECIMAL(12,2), IN `branch_classmaxdays` INT, IN `branch_gapbetweentwogymaccessslot` VARCHAR(20), IN `branch_shifttiming` LONGTEXT)  BEGIN
	DECLARE isExit,isDefaultBranch,_numberofbranch,_ishavemutliplebranch,_noofcount int DEFAULT 0;
	DECLARE stateID int DEFAULT NULL;
	DECLARE countryID varchar(2) DEFAULT NULL;

		if branch_country != '' && branch_country is not null then
			select code into countryID from country where name = branch_country;

			if countryID is null then
				Call `ERROR` ('Please enter valid country.');
			end if;
		end if;

		if branch_state != '' && branch_state is not null then
			select id, country_code into stateID, countryID from state where name = branch_state and (country_code = countryID or countryID is null);

			if stateID is null then
				Call `ERROR` ('Please enter valid State/Region.');
			end if;
		end if;

	if branch_id =0 then

		SELECT count(1) into isExit FROM branch where branchname = branch_name and deleted = 0 and clientid = client_id;

		if isExit > 0 then
			Call `ERROR` ('Branch Name Already exists.');
		end if;

	  SELECT numberofbranch,ishavemutliplebranch into _numberofbranch,_ishavemutliplebranch FROM client where id = client_id;
	  SELECT count(1) into _noofcount FROM branch where  clientid = client_id and deleted = 0;

        if _ishavemutliplebranch = 1 and  _noofcount >= _numberofbranch  then
        			Call `ERROR` (concat('You are not allowed to create more than ', _numberofbranch, ' branch.'));
        end if;

		insert into branch(branchname,description,address1,address2,
		pincode,latitude,longitude,carpetarea,ownership,manager,
		timing,createdbyid,createdbydate,clientid,phone,city,state,country,gmapaddress,
        gymaccessslot,slotduration,slotmaxoccupancy,slotmaxdays,
        ptslotdetail,cancelgymaccessslothour,cancelptslothour,cancelclassslothour,classmaxdays,
        gapbetweentwogymaccessslot,shifttiming)
		values(branch_name,branch_description,branch_address1,branch_address2,
		branch_pincode,branch_latitude,branch_longitude,branch_carpetarea,
		branch_ownership,branch_manager,branch_schedule,
		branch_createdbyid,now(),client_id,branch_phoneno,branch_city,stateID,countryID,
        branch_gmaplocation,branch_gymaccessslot,branch_slotduration,branch_slotmaxoccupancy,
        branch_slotmaxdays,branch_ptslotdetail,branch_cancelgymaccessslothour,branch_cancelptslothour,
        branch_cancelclassslothour,branch_classmaxdays,branch_gapbetweentwogymaccessslot,branch_shifttiming);

	elseif branch_id > 0 then

		SELECT count(1) into isExit FROM branch where branchname = branch_name and deleted = 0 and id !=branch_id and clientid = client_id;

		if isExit > 0 then
			Call `ERROR` ('Branch Name Already exists.');
		end if;

		SELECT count(1) into isDefaultBranch FROM branch where isdefault = 1 and deleted = 0 and clientid = client_id
        and id = branch_id;

		update branch set
		branchname =branch_name,
		description=branch_description,
		address1=branch_address1,
		address2=branch_address2,
		pincode=branch_pincode,
		latitude=branch_latitude,
		longitude=branch_longitude,
		carpetarea=branch_carpetarea,
		ownership=branch_ownership,
		manager=branch_manager,
		timing = branch_schedule,
		phone = branch_phoneno,
		city = branch_city,
		state = stateID,
		country = countryID,
		gmapaddress = branch_gmaplocation,
		modifiedbyid =branch_createdbyid,
		modifiedbydate =now(),
        gymaccessslot = branch_gymaccessslot,
        slotduration = branch_slotduration,
        slotmaxoccupancy = branch_slotmaxoccupancy,
        slotmaxdays = branch_slotmaxdays,
	    ptslotdetail = branch_ptslotdetail ,
		cancelgymaccessslothour = branch_cancelgymaccessslothour,
		cancelptslothour = branch_cancelptslothour,
		cancelclassslothour = branch_cancelclassslothour,
		classmaxdays = branch_classmaxdays,
        gapbetweentwogymaccessslot = branch_gapbetweentwogymaccessslot,
        shifttiming = branch_shifttiming
		where id=branch_id and clientid=client_id;





	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbranchsearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted ,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = 'b.id,b.branchname,b.ownership,b.phone,b.manager,b.latitude,b.longitude,b.gmapaddress,
					concat(ref_mg.firstname,'' '',ref_mg.lastname) as managername';
    set _table = ' from branch  b
                   LEFT OUTER JOIN user ref_mg ON b.manager = ref_mg.id ';
	set _where = concat(' where b.deleted = 0 and b.clientid = ', client_id);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
			if _id = 'managername' then
					  set _where = CONCAT(_where , CONCAT(' and concat(ref_mg.firstname,'' '',ref_mg.lastname) like ''%', _value ,'%'''));
			elseif _id = 'phone' then
			      set _where = CONCAT(_where , CONCAT(' and b.', _id , ' like ''', _value ,'%'''));
            else
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
			end if;
        end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by b.deleted, b.id  desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbranchview` (IN `branch_id` INT, IN `client_id` INT)  BEGIN

    select b.id, b.branchname,b.description,b.address1,b.address2,
    b.pincode,b.latitude,b.longitude,b.carpetarea,b.ownership,b.timing,
    b.manager,b.phone,b.city,s.name 'state',c.name 'country',b.gmapaddress,
    concat(ref_mg.firstname,' ',ref_mg.lastname) as managername,
    b.gymaccessslot,b.slotduration, (b.slotduration+0)slotdurationId ,b.slotmaxoccupancy,b.slotmaxdays,
    b.ptslotdetail,b.cancelgymaccessslothour,b.cancelptslothour,
    b.cancelclassslothour,b.classmaxdays,b.gapbetweentwogymaccessslot,(b.gapbetweentwogymaccessslot +0)
    gapbetweentwogymaccessslotId,b.shifttiming
    from branch b
    left outer join user ref_mg on b.manager = ref_mg.id
	left outer join country c on b.country = c.code
    left outer join state s on b.state = s.id
    where b.id=branch_id and b.clientid = client_id and b.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbroadcastfiltersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_broadcastto,_userrole,_branchid,
    _broadcastthrough INT;
    DECLARE filtered, sorted , obj, startdate,enddate,_possiblevaluesfilter LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX,_groupby,
    _defaultactivitytype,_defaultservicetype,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.endDate'),
    JSON_EXTRACT(tableInfo,'$.broadcastto'),JSON_EXTRACT(tableInfo,'$.possiblevaluesfilter'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.broadcastthrough'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,_broadcastto,_possiblevaluesfilter,
    exportXLSX,_branchid,_broadcastthrough,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

    set _groupby = '';

	if _broadcastto = 1 then

		set _columns = 'u.id,u.firstname,u.lastname,concat(u.firstname,'' '',u.lastname)staffname,u.assignrole,
        r.role,u.mobile,u.emailid ';
		set _table = concat(' from user u
        left outer JOIN  role r on u.assignrole = r.id ');
        set _where = concat(' where u.deleted = 0 and u.status = 1 and u.clientid = ', client_id , ' and
        (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ' ) is not null)
         else defaultbranchid = ' , _branchid , ' end)');

    elseif _broadcastto = 2 then


		set _columns = 'm.id,m.firstname,m.lastname,m.status,(m.status+0)statusId,m.membercode,
        m.gender,m.mobile,m.personalemailid ''emailid'' ';
		set _table =  concat(' from member m
		left outer join (select member,serviceplan, expirydatesubscription from subscription where branchid = ',_branchid,'
		union all
		select member,serviceplan, expirydatesubscription from subscriptionhistory where branchid = ',_branchid,') s ON m.id = s.member
        left outer join service ON s.serviceplan = service.id ');
        set _where = concat(' where m.deleted = 0 and m.promotionalnotification = 1 and m.clientid = ', client_id , ' and
        (case when enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

        if startDate != 'null' and endDate != 'null' then
 			set _where = concat(_where , ' and  date( s.expirydatesubscription) BETWEEN date(',startdate,')
                        AND date(',enddate,')');
		end if;

        if JSON_SEARCH(_possiblevaluesfilter, 'all', 'memberstatus') is null then
		  set _where = concat(_where , ' and  m.status in (1,2,3) ');
        end if;

        set _groupby = ' group by m.id ';

	elseif _broadcastto = 3 then

		set _columns = 'e.id,e.firstname,e.lastname,e.gender,enquirystatus ,e.enquirybudget,
        e.createdbydate,e.mobile,e.emailid ';
		set _table = ' from enquiry e ';
        set _where = concat(' where e.deleted = 0 and e.enquirystatus != 4 and e.clientid = ', client_id , ' and
        e.branchid = ' , _branchid);

		 if startDate != 'null' and endDate != 'null' then
 			set _where = concat(_where , ' and date(getDateFromUTC(e.createdbydate ,''',client_offsetvalue,''',-1)) BETWEEN date(',startdate,') AND date(',enddate,')');
		end if;

    end if;

	if _broadcastthrough = 1 and _broadcastto = 2 then
		set _where = concat(_where , ' and  (m.personalemailid is not null and m.personalemailid != '' '')  ');
    elseif _broadcastthrough = 1 and _broadcastto != 2 then
		set _where = concat(_where , ' and  (emailid is not null and emailid != '' '')  ');
    end if;

    SET i = 0;
    SET _length = JSON_LENGTH(_possiblevaluesfilter);

    select JSON_SEARCH(_possiblevaluesfilter, 'all', 'activitytype') into _defaultactivitytype;

    select JSON_SEARCH(_possiblevaluesfilter, 'all', 'servicetype') into _defaultservicetype;

    WHILE  i < _length DO
		SELECT JSON_EXTRACT(_possiblevaluesfilter,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _id= 'memberstatus' and (_value = '' or _value = 'null') then
			set _where = concat(_where , ' and m.status in (1,2,3)');
        end if;

		if _value != '' and _value != 'null' then
		  if _id = 'userrole' then
			set _where = concat(_where , ' and assignrole in (', _value , ')');
		  elseif _id= 'memberstatus' then
			set _where = concat(_where , ' and m.status in (', _value , ')');
		  elseif _id = 'servicetype' then
              set _where = concat(_where , ' and servicetype = ', _value);
		  elseif _id = 'activitytype' then
              set _where = concat(_where , ' and service.activity = ', _value);
		  elseif _id = 'gender' then
              set _where = concat(_where , ' and gender = ', _value);
		  elseif _id = 'enquirystatus' then
              set _where = concat(_where , ' and enquirystatus in (', _value , ')');
		  elseif _id= 'startdate' then
			  set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
		  elseif _id= 'enddate' then
			  set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
        end if;
	end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

    if(exportXLSX = 'true') then
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _groupby , _orderby);
    else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _groupby , _orderby , _limit );
	end if;

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	if(exportXLSX is null or exportXLSX != 'true') then

		if _broadcastto = 2 then
		    set @_qry = CONCAT('select  count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', " from
		    (select count(1) " , _table , _where , _groupby , " )pagecount");
        else
			set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);
        end if;

		PREPARE stmt FROM @_qry;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbroadcastsave` (IN `broadcast_eventname` VARCHAR(160), IN `broadcast_message` VARCHAR(8000), IN `broadcast_fromuserid` INT, IN `broadcast_fromclient` INT, IN `broadcast_filter` VARCHAR(500), IN `broadcast_filterpossiblevalues` LONGTEXT, IN `broadcast_to` INT, IN `broadcast_count` INT, IN `broadcast_branchid` INT, IN `broadcast_through` INT, IN `broadcast_subject` VARCHAR(200))  BEGIN

	insert into broadcast(eventname,message,createdbyid,createdbydate,clientid,
    broadcastfilter,broadcastfilterpossiblevalues,broadcastto,broadcastcount,branchid,
    broadcastthrough,subject)
    values(broadcast_eventname,broadcast_message,
    broadcast_fromuserid,now(),broadcast_fromclient,broadcast_filter,broadcast_filterpossiblevalues,broadcast_to,
    broadcast_count,broadcast_branchid,broadcast_through,broadcast_subject);

 SELECT LAST_INSERT_ID() as _broadcastid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbroadcastsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid,
    client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = 'id,eventname,message,createdbydate,broadcastto,
    broadcastcount,broadcastthrough,(broadcastthrough+0)broadcastthroughId';
    set _table = ' from broadcast ';

	set _where = concat(' where clientid = ', client_id , ' and branchid = ' , _branchid);

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' and _value != 'null' then
			if _id = 'broadcastto' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id = 'broadcastthrough' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id = 'eventname' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
			elseif _id = 'message' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
			elseif _id= 'createdbydate' then
				  set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbroadcastview` (IN `broadcast_id` INT, IN `client_id` INT)  BEGIN

	DECLARE broadcastresponse LONGTEXT;

	select JSON_ARRAYAGG(json_object('responsemessage',responsemessage,'eventname',eventname,'content',content,'subject',subject)) response into broadcastresponse
    from notificationlog
    where broadcastid = broadcast_id and  fromclient = client_id;

    if broadcastresponse is null then

        select JSON_ARRAYAGG(json_object('responsemessage','','eventname',eventname,'content',message,'subject',subject)) response
		from broadcast where id = broadcast_id and  clientid = client_id;

    else

		select JSON_ARRAYAGG(json_object('responsemessage',responsemessage,'eventname',eventname,'content',content,'subject',subject)) response
		from notificationlog
		where broadcastid = broadcast_id and  fromclient = client_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbudgetdashboardexpenditurechart` (IN `start_date` DATE, IN `end_date` DATE, IN `user_id` INT, IN `client_id` INT, IN `branch_id` INT)  BEGIN

	select sum(consumesales) consumesales,sum(consume) consume,month,year,categoryid from
	  (select  sum(case when category = 2 then amount  else 0 end) consumesales,
		sum(case when category != 2 then amount  else 0 end)  consume,
		month(paymentdate) month,year(paymentdate) year,1 categoryid
		from investment where  clientid = client_id and deleted = 0 and
        paymentdate between start_date and end_date and branchid = branch_id
		group by month(paymentdate),year
		union all
		select sum(case when category = 6 then amount  else 0 end) consumesales,
		sum(case when category != 6 then amount  else 0 end) consume,
		month(expensedate) month,year(expensedate) year,2  categoryid
		from expense where  clientid = client_id and deleted =0 and
        expensedate between start_date and end_date and branchid = branch_id
		group by month(expensedate),year
		union all
		select  0 consumesales ,sum(amount) consume ,month(paymentdate) month,year(paymentdate) year, 2  categoryid
		from staffpay where  clientid = client_id and deleted =0  and paymentdate between start_date and end_date
        and branchid = branch_id and advancepaymentadjustment != 1
		group by month(paymentdate),year
	  ) data
	group by categoryid,month,year;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbudgetdelete` (IN `budget_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
		update budget set
		deleted = 1,
        modifiedbyid = user_id,
		modifiedbydate=now()
		where id = budget_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbudgetsave` (IN `budget_id` INT, IN `budget_period` VARCHAR(100), IN `budget_month` DATE, IN `budget_startDate` DATE, IN `budget_endDate` DATE, IN `budget_budgettype` LONGTEXT, IN `budget_totalbudget` INT, IN `createdby_id` INT, IN `client_id` INT, IN `budget_branchid` INT)  BEGIN
DECLARE isExist int default 0;

if budget_id = 0 then

 SELECT count(1) into isExist FROM budget
 where (date(budget_startDate) between date(startDate) and date(endDate)
 or date(budget_endDate) between date(startDate) and date(endDate))
 and deleted = 0 and clientid = client_id;

   if isExist > 0 then
      Call `ERROR`(concat('Budget ',SUBSTRING(MONTHNAME(budget_month),1,3),' - ' ,year(budget_month),' is already exists.'));
  end if;

    insert into budget(budgetperiod,month,startDate ,endDate,budgettype,totalbudget,clientid,
        createdbyid,createdbydate,branchid)
        values(budget_period , budget_month, budget_startDate,budget_endDate,budget_budgettype,
		budget_totalbudget, client_id,createdby_id,now(),budget_branchid);

elseif budget_id > 0 then

SELECT count(1) into isExist FROM budget
 where (date(budget_startDate) between date(startDate) and date(endDate)
 or date(budget_endDate) between date(startDate) and date(endDate))
 and deleted = 0 and clientid = client_id and id != budget_id;

   if isExist > 0 then
      Call `ERROR`(concat('Budget ',SUBSTRING(MONTHNAME(budget_month),1,3),' - ' ,year(budget_month),' is already exists.'));
  end if;

update budget set
		budgetperiod=budget_period,
		month=budget_month ,
		startDate=budget_startDate ,
        endDate = budget_endDate,
		budgettype=budget_budgettype ,
        totalbudget = budget_totalbudget,
        modifiedbyid = createdby_id ,
        modifiedbydate = now()
		where id = budget_id and clientid=client_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbudgetsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj , startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.endDate'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX;

	set _offset = pageIndex * pageSize;

	set _columns = 'id,budgetperiod,month,startDate ,endDate,budgettype,totalbudget';
    set _table = ' from budget ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id);
SET i = 0;

    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' and _value != 'null' then
			if _id = 'budgetperiod' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id= 'startDate' or _id= 'endDate' then
				set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
            elseif _id= 'month' then
				set _where = CONCAT(_where , CONCAT(' and month(', _id , ') = month(''',_value, ''')'));
			else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by createdbydate desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

		  PREPARE stmt FROM @_qry;
		  EXECUTE stmt;
		  DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbudgetview` (IN `budget_id` INT, IN `client_id` INT)  BEGIN
DECLARE budgetId,budget_budgetperiodId,budget_totalbudget int;
DECLARE budget_budgetperiod varchar(10);
DECLARE budget_month,budget_startDate,budget_endDate DATE;
DECLARE budget_budgettype,budget_consumed LONGTEXT;

	 select id,budgetperiod,(budgetperiod + 0),month,startDate ,endDate,
     budgettype,totalbudget into budgetId,budget_budgetperiod,budget_budgetperiodId,
     budget_month,budget_startDate,budget_endDate,budget_budgettype,budget_totalbudget
	 from budget where id = budget_id and clientid = client_id and deleted = 0;


     select  JSON_ARRAYAGG(abc.consumed) from
	  (select json_object('consumesales' , sum(case when category = 2 then amount  else 0 end) ,
     'consume' ,sum(case when category != 2 then amount  else 0 end) , 'categoryid', 1 ) consumed
     from investment where  clientid = client_id and deleted = 0 and
     paymentdate between budget_startDate and budget_endDate
	 union all
     select json_object('consumesales' ,sum(case when category = 6 then amount  else 0 end) ,
     'consume' ,sum(case when category != 6 then amount  else 0 end)
     + (select  sum(amount) consumedexpense from staffpay where  clientid = client_id and deleted =0 and
     paymentdate between budget_startDate and budget_endDate)
     , 'categoryid' , 2) consumed
     from expense where  clientid = client_id and deleted =0 and
     expensedate between budget_startDate and budget_endDate) abc into budget_consumed;


     select budget_Id as id ,budget_budgetperiod as budgetperiod,budget_budgetperiodId as budgetperiodId,
     budget_month as month,budget_startDate as startDate,budget_endDate as endDate,
     budget_budgettype as budgettype,budget_totalbudget as totalbudget,budget_consumed as consumed;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkmembergymaccessslotdelete` (IN `client_id` INT, IN `user_id` INT, IN `branch_id` INT, IN `client_offsetvalue` VARCHAR(10))  BEGIN

	DECLARE _branchid int DEFAULT 0;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

		  if branch_id <= 0 then
			SELECT id into _branchid FROM branch where deleted = 0 and clientid = client_id and isdefault = 1;
		  else
			 set _branchid = branch_id;
		  end if;

	update membergymaccessslot set
	deleted=1,
	modifiedbyid = user_id,
	modifiedbydate=now(),
    modifiedbylogintype = 0
	where branchid = _branchid and date(startdatetime) >= date(getDateFromUTC(now(), client_offsetvalue ,-1)) and attendeddate is null;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkupload` (IN `client_id` INT, IN `user_id` INT, IN `data` LONGTEXT, IN `upload_module` VARCHAR(100))  BEGIN
	DECLARE _id int;

	insert into bulkupload (createdbyid , createdbydate , modifiedbyid , modifiedbydate , module , clientid,header)
    values(user_id , now() , user_id , now() , upload_module , client_id , data);

	SELECT LAST_INSERT_ID() into _id;

    SELECT _id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadenquiry` (IN `client_id` INT, IN `user_id` INT, IN `bulkupload_id` INT, IN `data` LONGTEXT, IN `branch_id` INT)  FAIL_RECORD : BEGIN

    DECLARE isExistGender,isExistEmailid,_bulkuploadmemberid,isExistMobilenoEnquiry,isExistMobilenoMember,isExistFitnessgoal,
    isExistmembertype , isExistenquirytype,isExistenquirystatus int default 0;

    DECLARE _serviceid,_attendedbyid int default null;

    DECLARE _ismobilenovalid int;

    DECLARE _firstname , _lastname , _gender,_mobileno,_phoneno,_fitnessgoal,_enquirytype,
    _membertype ,_enquirystatus,_followupdate,_interestedservice,_emailaddress,_attendedby varchar(100);

    DECLARE _error , _dateerror varchar(500) default '';

    insert into bulkuploadmember(bulkuploadid,bulkupload)
    values (bulkupload_id , data);

    SELECT LAST_INSERT_ID() into _bulkuploadmemberid;

	select JSON_EXTRACT(data,CONCAT('$[1]')) , JSON_EXTRACT(data,CONCAT('$[2]')) , JSON_EXTRACT(data,CONCAT('$[3]')) ,
    JSON_EXTRACT(data,CONCAT('$[4]')) ,JSON_EXTRACT(data,CONCAT('$[5]')) ,JSON_EXTRACT(data,CONCAT('$[6]')) ,
    JSON_EXTRACT(data,CONCAT('$[7]')),JSON_EXTRACT(data,CONCAT('$[8]')) ,JSON_EXTRACT(data,CONCAT('$[9]')) ,
    JSON_EXTRACT(data,CONCAT('$[10]')) ,JSON_EXTRACT(data,CONCAT('$[11]')),JSON_EXTRACT(data,CONCAT('$[12]')),
    JSON_EXTRACT(data,CONCAT('$[13]')),JSON_EXTRACT(data,CONCAT('$[14]'))
    into _firstname , _lastname , _gender,_mobileno,_phoneno,_fitnessgoal,_enquirytype,
    _membertype ,_enquirystatus,_followupdate,_interestedservice,_emailaddress,_attendedby,_dateerror ;

    set _firstname = REPLACE(_firstname,'"','');
    set _lastname = REPLACE(_lastname,'"','');
    set _emailaddress = REPLACE(_emailaddress,'"','');
    set _mobileno = REPLACE(_mobileno,'"','');
    set _gender = REPLACE(_gender,'"','''');
    set _phoneno = REPLACE(_phoneno,'"','');
    set _fitnessgoal = REPLACE(_fitnessgoal,'"','''');
    set _enquirytype = REPLACE(_enquirytype,'"','''');
    set _membertype = REPLACE(_membertype,'"','''');
    set _enquirystatus = REPLACE(_enquirystatus,'"','''');
    set _followupdate = REPLACE(_followupdate,'"','');
    set _interestedservice = REPLACE(_interestedservice,'"','');
    set _attendedby = REPLACE(_attendedby,'"','');
    set _dateerror = REPLACE(_dateerror,'"','');

     if _dateerror <> 'null' && _dateerror <> '' then
        update bulkuploadmember
        set error = _dateerror
        where id = _bulkuploadmemberid;

		LEAVE FAIL_RECORD;
     end if;

	if _firstname = '' || _firstname is null || _firstname = 'null' then
		set _error = concat(_error, 'Please enter firstname.');
    end if;


    if _lastname = '' || _lastname is null || _lastname = 'null' then
		set _error = concat(_error, 'Please enter lastname.');
    end if;


     if _emailaddress <> 'null' then

        select count(1) into isExistEmailid from enquiry where emailid = _emailaddress
		and clientid = client_id and (enquirystatus != 4 || enquirystatus is null) and deleted = 0;

		if isExistEmailid > 0 then
			set _error = concat(_error, 'Email id already exists.');
		end if;

    end if;


    if _mobileno = '' || _mobileno is null || _mobileno = 'null' then
		set _error = concat(_error, 'Please enter mobile no.');

    elseif _mobileno <> 'null' && _mobileno <> '' then

		select (case when _mobileno REGEXP '^[0-9]+$' = 1 and Length(_mobileno) between 10 and 12 then 1 else 0 end) into _ismobilenovalid;

		 if _ismobilenovalid = 0 then
			set _error = concat(_error, 'Please enter mobile no. between 10-12 digits');
         else
			select count(1) into isExistMobilenoEnquiry from enquiry where mobile = _mobileno

			and clientid = client_id and (enquirystatus != 4 || enquirystatus is null) and deleted = 0;

            select count(1) into isExistMobilenoMember from member where mobile = _mobileno
			and clientid = client_id and deleted = 0;

			if isExistMobilenoEnquiry > 0 then
				set _error = concat(_error, 'Mobile no already exists.');
			end if;
            if isExistMobilenoMember > 0 then
				set _error = concat(_error, 'Member already exists with same mobile no.');
			end if;
         end if;
    end if;

     if _gender <>  'null' then

		SELECT LOCATE(_gender,COLUMN_TYPE) into isExistGender FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'enquiry' AND COLUMN_NAME = 'gender' limit 1;

         if isExistGender = 0 then
			set _error = concat(_error, 'Please enter valid gender format.');
         end if;
    end if;
     set _gender = REPLACE(_gender,'''','');

     if _fitnessgoal <>  'null' then

		SELECT LOCATE(_fitnessgoal,COLUMN_TYPE) into isExistFitnessgoal FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'enquiry' AND COLUMN_NAME = 'purpose' limit 1;

         if isExistFitnessgoal = 0 then
			set _error = concat(_error, 'Please enter valid fitness goal.');
         end if;
    end if;
     set _fitnessgoal = REPLACE(_fitnessgoal,'''','');

     if _enquirytype <>  'null' then

		SELECT LOCATE(_enquirytype,COLUMN_TYPE) into isExistenquirytype FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'enquiry' AND COLUMN_NAME = 'enquirytype' limit 1;

         if isExistenquirytype = 0 then
			set _error = concat(_error, 'Please enter valid enquiry type.');
         end if;
    end if;
     set _enquirytype = REPLACE(_enquirytype,'''','');

      if _membertype <>  'null' then

		SELECT LOCATE(_membertype,COLUMN_TYPE) into isExistmembertype FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'enquiry' AND COLUMN_NAME = 'membertype' limit 1;

         if isExistmembertype = 0 then
			set _error = concat(_error, 'Please enter valid member type.');
         end if;
    end if;
     set _membertype = REPLACE(_membertype,'''','');

      if _enquirystatus <>  'null' then

		SELECT LOCATE(_enquirystatus,COLUMN_TYPE) into isExistenquirystatus FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'enquiry' AND COLUMN_NAME = 'enquirystatus' limit 1;

         if isExistenquirystatus = 0 then
			set _error = concat(_error, 'Please enter valid enquiry status.');
         end if;
    end if;
     set _enquirystatus = REPLACE(_enquirystatus,'''','');

     if  _interestedservice <> 'null' && _interestedservice != '' &&  _interestedservice is not null  then
		select IFNULL((select id from service where servicename = _interestedservice and clientid = client_id and deleted=0),0) into _serviceid;
     end if;

     if _attendedby  != '' &&  _attendedby is not null &&  _attendedby <> 'null' then
		select IFNULL((select id from user where concat(firstname, ' ' , lastname) = _attendedby and clientid = client_id and deleted=0),0) into _attendedbyid;
     end if;

     if _serviceid = 0 then
		set _error = concat(_error, 'Please enter valid servicename.');
    end if;

    if  _attendedbyid = 0 then
		set _error = concat(_error, 'Please enter valid staff name.');
    end if;

    if _error = '' then

		insert into enquiry (firstname , lastname ,emailid , mobile , gender ,phone,purpose,enquirytype,enquirystatus,
        membertype,followupdate,serviceid,isbulkupload,
        createdbyid,modifiedbyid,bulkuploadid,clientid,createdbydate,attendedbyid,enquirycode,branchid)
		values (_firstname , _lastname , case when _emailaddress = 'null' then null else _emailaddress end,_mobileno ,case when _gender = 'null' then null else _gender end ,
		case when _phoneno = 'null' then null else _phoneno end,case when _fitnessgoal = 'null' then null else _fitnessgoal end,case when _enquirytype = 'null' then null else _enquirytype end ,
		 case when (_enquirystatus = 'null' or _enquirystatus is null) then 1 else _enquirystatus end ,case when _membertype = 'null' then null else _membertype end ,case when _followupdate = 'null' then null else getDateFromUTC(_followupdate,'+00:00',1) end ,
        _serviceid,
        1,user_id,user_id,bulkupload_id,client_id,now(),_attendedbyid, getSequence('enquiry' , client_id),branch_id);

        update bulkuploadmember
        set status = 1
        where id = _bulkuploadmemberid;

	else

		update bulkuploadmember
        set error = _error
        where id = _bulkuploadmemberid;

         Call `ERROR`(_error);

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadenquiryresponse` (IN `client_id` INT, IN `bulkupload_id` INT)  BEGIN

	select REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[1]')),'"','') _firstname,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[2]')),'"','') _lastname,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[3]')),'"','') _gender,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[4]')),'"','') _mobileno,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[5]')),'"','') _phoneno,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[6]')),'"','') _fitnessgoal,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[7]')),'"','')_enquirytype,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[8]')),'"','') _membertype,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[9]')),'"','') _enquirystatus,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[10]')),'"','') _followupdate,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[11]')),'"','')_interestedservice,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[12]')),'"','')_emailaddress,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[13]')),'"','') _attendedby,
    error _error
    from bulkuploadmember where bulkuploadid = bulkupload_id and status = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadexpense` (IN `client_id` INT, IN `user_id` INT, IN `bulkupload_id` INT, IN `data` LONGTEXT, IN `branch_id` INT)  BEGIN

	DECLARE isExistCategory,isExistPaymentMode,_bulkuploadmemberid int default 0;

    DECLARE _expensepaidbyid int default null;

    DECLARE _title , _category , _amount, _paymentmode , _expensedate, _expensepaidby ,
    _remark varchar(200);

    DECLARE _error varchar(500) default '';

    insert into bulkuploadmember(bulkuploadid,bulkupload)
    values (bulkupload_id , data);

    SELECT LAST_INSERT_ID() into _bulkuploadmemberid;

	select JSON_EXTRACT(data,CONCAT('$[1]')) , JSON_EXTRACT(data,CONCAT('$[2]')) , JSON_EXTRACT(data,CONCAT('$[3]')) ,
    JSON_EXTRACT(data,CONCAT('$[4]')) ,JSON_EXTRACT(data,CONCAT('$[5]')) ,JSON_EXTRACT(data,CONCAT('$[6]')) ,
    JSON_EXTRACT(data,CONCAT('$[7]'))
    into _title , _category , _amount,_paymentmode,_expensedate,_expensepaidby,_remark;

    set _title = REPLACE(_title,'"','');
    set _category = REPLACE(_category,'"','''');
    set _amount = REPLACE(_amount,'"','');
    set _paymentmode = REPLACE(_paymentmode,'"','''');
	set _expensedate = REPLACE(_expensedate,'"','');
    set _expensepaidby = REPLACE(_expensepaidby,'"','');
	set _remark = REPLACE(_remark,'"','');

	if _title = '' || _title is null || _title = 'null' then
		set _error = concat(_error, 'Please enter title.');
    end if;

    if _category = '' || _category is null || _category = 'null' then
		set _error = concat(_error, 'Please select category.');
	elseif _category <> 'null' && _category <> '' then
		SELECT LOCATE(_category,COLUMN_TYPE) into isExistCategory FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'expense' AND COLUMN_NAME = 'category' limit 1;

         if isExistCategory = 0 then
			set _error = concat(_error, 'Please enter valid category format.');
         end if;
    end if;

    if _amount = '' || _amount is null || _amount = 'null' then
		set _error = concat(_error, 'Please enter expense amount.');
    end if;

    if _paymentmode = '' || _paymentmode is null || _paymentmode = 'null' then
		set _error = concat(_error, 'Please select payment mode.');
    elseif _paymentmode <> 'null' && _paymentmode <> '' then
		SELECT LOCATE(_paymentmode,COLUMN_TYPE) into isExistPaymentMode FROM INFORMATION_SCHEMA.COLUMNS
		WHERE table_name = 'expense' AND COLUMN_NAME = 'paymentmode' limit 1;

         if isExistPaymentMode = 0 then
			set _error = concat(_error, 'Please enter valid payment mode format.');
         end if;
    end if;

    if _expensedate = '' || _expensedate is null || _expensedate = 'null' then
		set _error = concat(_error, 'Please enter expense date.');
    end if;

    if _expensepaidby = '' || _expensepaidby is null || _expensepaidby = 'null' then
		set _error = concat(_error, 'Please enter staffname who paid expense.');
    else
		select IFNULL((select id from user where concat(firstname, ' ' , lastname) = _expensepaidby and clientid = client_id and deleted=0),0) into _expensepaidbyid;
    end if;

     set _category = REPLACE(_category,'''','');

     set _paymentmode = REPLACE(_paymentmode,'''','');

    if  _expensepaidbyid = 0 then
		set _error = concat(_error, 'Please enter valid staff name.');
    end if;

    if _error = '' then

		insert into expense(title,category,amount ,expensedate,paymentmode,remark,expensepaidby,
        clientid,createdbyid,createdbydate,branchid,isbulkupload,bulkuploadid)
        values(_title , _category, _amount,
        case when _expensedate = 'null' then null else date(getdateFromJSON(_expensedate)) end ,
        _paymentmode,
        case when _remark = 'null' then null else _remark end,_expensepaidbyid,
		client_id,user_id,now(),branch_id,1,bulkupload_id);

        update bulkuploadmember
        set status = 1
        where id = _bulkuploadmemberid;

	else

		update bulkuploadmember
        set error = _error
        where id = _bulkuploadmemberid;

         Call `ERROR`(_error);

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadexpenseresponse` (IN `client_id` INT, IN `bulkupload_id` INT)  BEGIN

	select REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[1]')),'"','') _title,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[2]')),'"','') _category,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[3]')),'"','') _amount,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[4]')),'"','') _paymentmode,
    getDateFromJSON(REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[5]')),'"','')) _expensedate,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[6]')),'"','') _expensepaidby,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[7]')),'"','') _remark,error _error
    from bulkuploadmember where bulkuploadid = bulkupload_id and status = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadlist` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table , _modulename varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.modulename')
    into pageSize, pageIndex, client_id, filtered, sorted,_modulename;

	set _offset = pageIndex * pageSize;

	set _columns = 'SUM(CASE WHEN bm.status = 1 THEN 1 ELSE 0 END) AS successRecord,
		SUM(CASE WHEN bm.status <> 1 THEN 1 ELSE 0 END) AS failedRecord , count(1) ''totalRecord'' , b.createdbydate , b.id';
    set _table = concat(' from bulkupload b INNER JOIN bulkuploadmember bm ON b.id = bm.bulkuploadid
					where clientid = ', client_id ,' and module = ', _modulename);
	set _where = '';

	if _where != '' then
		set _where = concat(' having ' , _where);
	end if;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by b.createdbydate desc';
    end if;

    set	_orderby = concat(" group by b.createdbydate,b.id ", _where , _orderby );

      set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages'' from (select count(1) ', _table ,
    ' group by b.createdbydate,b.id ) temp' );

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadmember` (IN `client_id` INT, IN `user_id` INT, IN `bulkupload_id` INT, IN `data` LONGTEXT, IN `branch_id` VARCHAR(10), IN `clientpacktype_id` INT)  FAIL_RECORD : BEGIN
	DECLARE _ismobilenovalid int;

    DECLARE _appaccess int default 2;

    DECLARE isExistBloodgroup,isExistGender,isExistEmailid,_memberid,_serviceid , _balance ,
    _bulkuploadmemberid int default 0;

    DECLARE _firstname , _lastname ,_emailaddress,_mobileno,_gender,_phoneno,_taxno,_bloodgroup,_dob,
    _address1,_address2,_city,_state,_country,_pincode,_subscriptionplan,_startdate,_expirydate,_amount,
    _credit,_dues,_duedate,_membercode varchar(100);

    DECLARE _error,_dateerror varchar(500) default '';
    DECLARE stateID int DEFAULT NULL;
	DECLARE countryID varchar(2) DEFAULT NULL;

  DECLARE sqlcode CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
             ROLLBACK;
             if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else

				 Call `ERROR`(msg);
             end if;
		END;

    insert into bulkuploadmember(bulkuploadid,bulkupload)
    values (bulkupload_id , data);

	SELECT LAST_INSERT_ID() into _bulkuploadmemberid;

	select JSON_EXTRACT(data,CONCAT('$[1]')) , JSON_EXTRACT(data,CONCAT('$[2]')) , JSON_EXTRACT(data,CONCAT('$[3]')) ,
    JSON_EXTRACT(data,CONCAT('$[4]')) ,JSON_EXTRACT(data,CONCAT('$[5]')) ,JSON_EXTRACT(data,CONCAT('$[6]')) ,
    JSON_EXTRACT(data,CONCAT('$[7]')),JSON_EXTRACT(data,CONCAT('$[8]')) ,JSON_EXTRACT(data,CONCAT('$[9]')) ,
    JSON_EXTRACT(data,CONCAT('$[10]')) ,JSON_EXTRACT(data,CONCAT('$[11]')),JSON_EXTRACT(data,CONCAT('$[12]')),
    JSON_EXTRACT(data,CONCAT('$[13]')) ,JSON_EXTRACT(data,CONCAT('$[14]')) ,JSON_EXTRACT(data,CONCAT('$[15]')) ,
    JSON_EXTRACT(data,CONCAT('$[16]')),JSON_EXTRACT(data,CONCAT('$[17]')),JSON_EXTRACT(data,CONCAT('$[18]')),
    JSON_EXTRACT(data,CONCAT('$[19]')),JSON_EXTRACT(data,CONCAT('$[20]')),JSON_EXTRACT(data,CONCAT('$[21]')),
    JSON_EXTRACT(data,CONCAT('$[22]')),JSON_EXTRACT(data,CONCAT('$[23]')),JSON_EXTRACT(data,CONCAT('$[24]'))
    into _firstname , _lastname , _emailaddress,_mobileno,_gender,_phoneno,_taxno,_bloodgroup,_dob,
    _address1,_address2,_city,_state,_country,_pincode,_subscriptionplan,_startdate,_expirydate,_amount,
    _credit,_dues,_duedate,_membercode,_dateerror;

    set _firstname = REPLACE(_firstname,'"','');
    set _lastname = REPLACE(_lastname,'"','');
    set _emailaddress = REPLACE(_emailaddress,'"','');
    set _mobileno = REPLACE(_mobileno,'"','');
    set _gender = REPLACE(_gender,'"','''');
    set _phoneno = REPLACE(_phoneno,'"','');
    set _taxno = REPLACE(_taxno,'"','');
    set _bloodgroup = REPLACE(_bloodgroup,'"','''');

    set _gender = REPLACE(_gender,'''','');
    set _dob = REPLACE(_dob,'"','');
    set _address1 = REPLACE(_address1,'"','');
    set _address2 = REPLACE(_address2,'"','');
    set _city = REPLACE(_city,'"','');
    set _state = REPLACE(_state,'"','');
    set _country = REPLACE(_country,'"','');
    set _pincode = REPLACE(_pincode,'"','');
    set _subscriptionplan = REPLACE(_subscriptionplan,'"','');
    set _startdate = REPLACE(_startdate,'"','');
    set _expirydate = REPLACE(_expirydate,'"','');
    set _amount = REPLACE(_amount,'"','');
    set _credit = REPLACE(_credit,'"','');
    set _dues = REPLACE(_dues,'"','');
    set _duedate = REPLACE(_duedate,'"','');
    set _membercode = REPLACE(_membercode,'"','');
    set _dateerror = REPLACE(_dateerror,'"','');

     if _dateerror <> 'null' && _dateerror <> '' then
        update bulkuploadmember
        set error = _dateerror
        where id = _bulkuploadmemberid;

		LEAVE FAIL_RECORD;
     end if;

    if _membercode != '' && _membercode is not null && _membercode != 'null' then
        select ifnull((select id from member where membercode = _membercode
			and clientid = client_id and deleted = 0 limit 1),0) into _memberid;
	end if;

	if _memberid = 0 then
		if _firstname = '' || _firstname is null || _firstname = 'null' then
			set _error = concat(_error, 'Please enter firstname.');
		end if;

		if _lastname = '' || _lastname is null || _lastname = 'null' then
			set _error = concat(_error, 'Please enter lastname.');
		end if;

		if _emailaddress = '' || _emailaddress is null || _emailaddress = 'null' then
			set _error = concat(_error, 'Please enter email id.');
		elseif _emailaddress <> 'null' && _emailaddress <> '' then

			select count(1) into isExistEmailid from member where personalemailid = _emailaddress
			and clientid = client_id and deleted = 0;

			if isExistEmailid > 0 then
				set _error = concat(_error , 'Email id already exists.');
			end if;
		end if;

		if _mobileno = '' || _mobileno is null || _mobileno = 'null' then
			set _error = concat(_error, 'Please enter mobile no.');
		elseif _mobileno <> 'null' && _mobileno <> '' then
			select (case when _mobileno REGEXP '^[0-9]+$' = 1 and Length(_mobileno) between 10 and 12 then 1 else 0 end) into _ismobilenovalid;

			 if _ismobilenovalid = 0 then
				set _error = concat(_error, 'Please enter mobile no. between 10-12 digits');
			 end if;
		end if;

		if _bloodgroup <>  'null' then

			SELECT LOCATE(_bloodgroup,COLUMN_TYPE) into isExistBloodgroup FROM INFORMATION_SCHEMA.COLUMNS
			WHERE table_name = 'member' AND COLUMN_NAME = 'bloodgroup' limit 1;

			 if isExistBloodgroup = 0 then
				set _error = concat(_error, 'Please enter valid bloodgroup.');
			 end if;
		end if;
		 set _bloodgroup = REPLACE(_bloodgroup,'''','');


		if _gender <>  'null' then

			SELECT LOCATE(_gender,COLUMN_TYPE) into isExistGender FROM INFORMATION_SCHEMA.COLUMNS
			WHERE table_name = 'member' AND COLUMN_NAME = 'gender' limit 1;

			 if isExistGender = 0 then
				set _error = concat(_error, 'Please enter valid gender format.');
			 end if;
		end if;

			if _country != '' && _country is not null && _country != 'null' then
			select code into countryID from country where name = _country;

			if countryID is null then
				set _error = concat(_error , 'Please enter valid country.');
			end if;
		end if;

		if _state != '' && _state is not null && _state != 'null' then
			select id, country_code into stateID, countryID from state where name = _state and (country_code = countryID or countryID is null);

			if stateID is null then
				set _error = concat(_error , 'Please enter valid State/Region.');
			end if;
    	end if;


    end if;


    if _dues > 0 then

		if _duedate != '' && _duedate is not null && _duedate != 'null' then
            set _balance = _balance - _dues;
		else
			set _error = concat(_error , 'Please enter due date.');
        end if;

    end if;

    if _credit > 0 then
            set _balance = _balance + _credit;
    end if;


    if _subscriptionplan = '' || _subscriptionplan is null || _subscriptionplan = 'null' then
		set _error = concat(_error, 'Please enter servicename.');
	elseif _subscriptionplan <> 'null' && _subscriptionplan <> '' then
		select id into _serviceid from service where trim(servicename) =  trim(_subscriptionplan) and clientid = client_id and deleted = 0;

		if _serviceid = '' || _serviceid is null then
			set _error = concat(_error, 'Please enter valid servicename .');
		end if;
     end if;

    if _startdate = '' || _startdate is null || _startdate = 'null' then
		set _error = concat(_error, 'Please enter startdate.');
    end if;

    if _expirydate = '' || _expirydate is null || _expirydate = 'null' then
		set _error = concat(_error, 'Please enter expirydate.');
    end if;

    if _amount = '' || _amount is null || _amount = 'null' then
		set _error = concat(_error, 'Please enter serviceplan price.');
    end if;

    if clientpacktype_id = 3 then
		set _appaccess = 1;
    end if;


    if _error = '' then

		START TRANSACTION;

	if _memberid > 0 then
				update member set  balance = balance + _balance, status = case when (status = 1) or (date(now()) BETWEEN date(getDateFromUTC(_startdate,'+00:00',1)) and date(getDateFromUTC(_expirydate,'+00:00',1))) then 1 else 2 end  where  id =_memberid;
	else
		insert into member (firstname , lastname ,personalemailid , mobile , gender , balance , phone,panno,bloodgroup,
		dateofbirth,address1,address2,city,state,country,pincode,clientid,membercode,isbulkupload,
        createdbyid,modifiedbyid,bulkuploadid,branchid,bulkuploaddate,defaultbranchid,appaccess,status,transactionalnotification,promotionalnotification)
		values (_firstname , _lastname , _emailaddress,_mobileno ,case when _gender = 'null' then null else _gender end ,
        _balance,case when _phoneno = 'null' then null else _phoneno end,case when _taxno = 'null' then '' else _taxno end,case when _bloodgroup = 'null' then null else _bloodgroup end
        ,date(getDateFromUTC(_dob,'+00:00',1)), case when _address1 = 'null' then null else _address1 end,
         case when _address2 = 'null' then null else _address2 end,case when _city = 'null' then null else _city end,
         stateID,countryID,case when _pincode = 'null' then null else _pincode end,
         client_id, case when _membercode = 'null' or _membercode is null then getSequence('member' , client_id) else _membercode end ,1,user_id,user_id,bulkupload_id,json_array(branch_id),now(),
         branch_id,_appaccess,case when date(now()) BETWEEN date(getDateFromUTC(_startdate,'+00:00',1)) and date(getDateFromUTC(_expirydate,'+00:00',1)) then 1 else 2 end,
         1,1);

        SELECT LAST_INSERT_ID() into _memberid;

       end if;

		insert into subscription(member,serviceplan,startdate,expirydatesubscription,isbulkupload,createdbyid,
		modifiedbyid,amount,salesbyid,branchid)
		values (_memberid,_serviceid, date(getDateFromUTC(_startdate,'+00:00',1)), date(getDateFromUTC(_expirydate,'+00:00',1)),1,user_id,user_id,
		case when _amount = 'null' then null else _amount end,user_id,branch_id);

        if _dues > 0 then

			insert into installment (amount,paymentamount,date,memberid,installmentstatus,createdbyid,modifiedbyid,
            branchid)
            values (_dues,0,date(getDateFromUTC(_duedate,'+00:00',1)),_memberid,1,user_id,user_id,branch_id);

        end if;

        update bulkuploadmember
        set status = 1
        where id = _bulkuploadmemberid;

        COMMIT;
		SET @flag = 1;

	else

		update bulkuploadmember
        set error = _error
        where id = _bulkuploadmemberid;

         Call `ERROR`(_error);

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPbulkuploadmemberresponse` (IN `client_id` INT, IN `bulkupload_id` INT)  BEGIN

	select REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[1]')),'"','') _firstname ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[2]')),'"','')_lastname ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[3]')) ,'"','')_emailaddress,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[4]')),'"','')_mobileno,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[5]')),'"','')_gender ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[6]')),'"','')_phoneno ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[7]')),'"','')_taxno,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[8]')),'"','')_bloodgroup ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[9]')),'"','')_dob ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[10]')),'"','')_address1 ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[11]')),'"','')_address2,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[12]')),'"','')_city,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[13]')),'"','')_state ,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[14]')),'"','') _country,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[15]')),'"','') _pincode,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[16]')),'"','')_subscriptionplan,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[17]')),'"','')_startdate,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[18]')),'"','')_expirydate,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[19]')),'"','')_amount,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[20]')),'"','')_credit,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[21]')),'"','')_dues,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[22]')),'"','')_duedate,
    REPLACE(JSON_EXTRACT(bulkupload,CONCAT('$[23]')),'"','') _membercode,
	error _error
    from bulkuploadmember where bulkuploadid = bulkupload_id and status = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPcancelsale` (IN `sale_id` INT, IN `sale_amount` DECIMAL(12,2), IN `isservice` TINYINT(1), IN `member_id` INT, IN `client_id` INT, IN `sale_createdbyid` INT)  BEGIN
declare _balance DECIMAL(12,2) default 0;

	select balance into _balance from member where id = member_id  and clientid = client_id;

	if isservice = 1 then

		update subscription set
		iscancel = 1,
		modifiedbyid=sale_createdbyid,
		modifiedbydate=now()
		where id = sale_id and member = member_id;

		insert into transaction(currentbalance,transactionamount,transaction_type,transaction_id,transaction_table,member_id,
		clientid,createdbyid,createdbydate)values(_balance,sale_amount,"cancel",sale_id,"subscription",member_id,
		client_id,sale_createdbyid,now());


		INSERT INTO subscriptionhistory (id,member, serviceplan,amount,startdate,
		expirydatesubscription,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,isbulkupload,
		consumedsession,trainerid,schedule,salesbyid,notefornxtsession,costprice,ptcommssion,iscancel)
		SELECT s.id,member, serviceplan,amount,startdate,expirydatesubscription,s.createdbyid ,
		s.createdbydate,s.modifiedbyid,s.modifiedbydate,s.isbulkupload,consumedsession,trainerid,schedule,
        salesbyid,notefornxtsession,costprice,ptcommssion,iscancel
		 FROM subscription s
		 INNER JOIN member m ON m.id = s.member
		 where id = sale_id and m.clientid = client_id;

		delete subscription from subscription
		INNER JOIN member m ON m.id = subscription.member
		where  id = sale_id and m.clientid = client_id;


    else

        update productsale set
		iscancel = 1,
		modifiedbyid=sale_createdbyid,
		modifiedbydate=now()
		where id = sale_id and member = member_id;

		insert into transaction(currentbalance,transactionamount,transaction_type,transaction_id,transaction_table,member_id,
		clientid,createdbyid,createdbydate)values(_balance,sale_amount,"cancel",sale_id,"productsale",member_id,
		client_id,sale_createdbyid,now());

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPCgetClient` (IN `redirect_uri` VARCHAR(50))  BEGIN

DECLARE isExistURL int DEFAULT 0;
DECLARE _status int;
DECLARE _activationdate ,_expirydate datetime DEFAULT null;

SELECT c.id,activationdate,expirydate,(status+0) into isExistURL,_activationdate ,_expirydate , _status
FROM client c inner join branch b on b.clientid = c.id
where redirecturi=redirect_uri and isdefault = 1 order by b.expirydate desc limit 1;

    if isExistURL = 0 then
		Call `ERROR` ('Invalid Web Address.');
	end if;

	if _activationdate is null or _expirydate is null then
		Call `ERROR` ('Your request is in progress.');
	elseif _status = 2 then
		Call `ERROR` ('Your account is inactive.');
    elseif date(now()) < _activationdate then
		Call `ERROR` ('Your account is not active.');
    elseif date(now()) between date(_activationdate) and date(_expirydate)  then
			 SELECT cl.id, clientcode, redirecturi, clienttype, (clienttype + 0) clienttypeId ,logo,tagline,organizationname,
			 signinbackgroundimage,socialmedia,paymentgateway,useremail ,mobile,address1,address2,invoicebannerimage,
             city,pincode,signimage,footermessge,termsconditions,printtype,(printtype + 0) printtypeId,
             b.state,s.name 'state',c.name 'country', (b.packtype + 0) packtypeId,c.currency,
             (cl.serviceprovided + 0) serviceprovidedId,cl.istaxenable,hidememberbalanceandtransactions,
             b.expirydate,cl.singninfontportrait,cl.singninfontlandscap
			FROM client  cl
            inner join branch b on b.clientid = cl.id and b.isdefault = 1
			left outer join country c on b.country = c.code
			left outer join state s on b.state = s.id
            WHERE redirecturi = redirect_uri and b.deleted = 0 ;
    else
		Call `ERROR` ('Account is expired.');
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPCgettagvalue` (IN `client_tagname` VARCHAR(100), IN `memberid` INT, IN `clientid` INT)  BEGIN

	select query into @_qry from tagnames where tagname = client_tagname;

    if(@_qry is not null) then

		SELECT SUBSTRING(client_tagname,3,1) into @_tagtype;

        if(@_tagtype = 'G') then
			SET @memberid := clientid;
         else
			SET @memberid := memberid;
        end if;

		PREPARE stmt FROM @_qry;
		EXECUTE stmt USING @memberid;
		DEALLOCATE PREPARE stmt;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPCgetUser` (IN `user_name` VARCHAR(100), IN `pass_word` VARCHAR(100), IN `password` VARCHAR(100), IN `login_type` INT, IN `client_id` VARCHAR(100))  BEGIN
DECLARE _status,_appaccess int;

	if login_type > 0 then

       SELECT (m.status + 0),(m.appaccess + 0) into _status,_appaccess  from member m
        inner join client on m.clientid = client.id
	   WHERE m.personalemailid = TRIM(user_name) AND ((m.password is null and m.mobile = password)
       or m.password = pass_word ) AND m.deleted = 0
       and client.redirecturi = client_id;

        if _status = 2 then
		       Call `ERROR` ('Account is inactive.');
	    elseif _appaccess = 2 then
		    Call `ERROR` ('You do not have the app access');
        else
				SELECT m.id,m.clientid,login_type 'logintype',m.defaultbranchid  from member m
				inner join client on m.clientid = client.id
				WHERE m.personalemailid = TRIM(user_name) AND
				((m.password is null and m.mobile = password) or m.password = pass_word )
				AND m.deleted = 0 and client.redirecturi = client_id and m.appaccess = 1 and m.status = 1
				and client.status = 1 ;
      end if;

    else


        SELECT (u.status + 0),(u.appaccess + 0) into _status,_appaccess from user u
        inner join client on u.clientid = client.id
		WHERE u.emailid = TRIM(user_name) AND u.password = pass_word AND u.deleted = 0
        and client.redirecturi = client_id;


    if _status = 2 then
		       Call `ERROR` ('Account is inactive.');
		elseif _appaccess = 2 then
		    Call `ERROR` ('You do not have the app access');
        else
				SELECT u.id,u.clientid,login_type 'logintype' from user u
				inner join client on u.clientid = client.id
				WHERE u.emailid = TRIM(user_name) AND u.password = pass_word AND u.deleted = 0
				and client.redirecturi = client_id and u.status = 1 and u.appaccess = 1 and client.status = 1;
       end if;
    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangepaymentstatus` (IN `payment_id` INT, IN `payment_status` VARCHAR(200), IN `payment_remark` VARCHAR(200), IN `client_id` INT, IN `user_id` INT)  BEGIN

		update payment set status = payment_status,
		remark = payment_remark,
        modifiedbyid = user_id,
        modifiedbydate = now()
		where id=payment_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangesaledelete` (IN `data` LONGTEXT)  BEGIN
DECLARE _balance,sale_amount DECIMAL(12,2) default 0;
DECLARE client_id,_memberid,sale_id,sale_createdbyid,_creditforinvoiceid,_newinvoiceid INT;
DECLARE _isservice TINYINT(1);
DECLARE _canceldetail LONGTEXT;

       select JSON_EXTRACT(data,'$.canceldetail'),
        JSON_EXTRACT(data,'$.clientId'),
		JSON_EXTRACT(data,'$.userId')
		into _canceldetail,client_id,sale_createdbyid;

		    select JSON_EXTRACT(_canceldetail,'$.id'),
			JSON_EXTRACT(_canceldetail,'$.amount'),
			JSON_EXTRACT(_canceldetail,'$.memberid'),
			JSON_EXTRACT(_canceldetail,'$.isservice'),
			JSON_EXTRACT(_canceldetail,'$.invoiceid')
			into sale_id, sale_amount, _memberid,_isservice,_creditforinvoiceid;

           select balance into _balance from member where id = _memberid  and clientid = client_id;

				if _isservice = 1 then

					update subscription set
					renew_type = 5,
					modifiedbyid=sale_createdbyid,
					modifiedbydate=now()
					where id = sale_id and member = _memberid;

					update member set   balance=balance  +  sale_amount
					where id=_memberid and clientid = client_id;

					insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
					clientid,createdbyid,createdbydate)values(_balance,sale_amount,"cancel service",sale_id,"subscription",_memberid,
					client_id,sale_createdbyid,now());


                    INSERT INTO invoice ( memberid,createdbyid,createdbydate,clientid,
                    paymentid,invoicecode,creditforinvoiceid)
					SELECT memberid,createdbyid,now(),clientid,paymentid
					,getInvoicenumber('invoice', client_id),_creditforinvoiceid FROM invoice
                    where id = _creditforinvoiceid and memberid = _memberid and clientid = client_id;

        		     SELECT LAST_INSERT_ID() into _newinvoiceid;

					INSERT INTO invoiceitem (invoiceid,itemname, discount,taxamount,subscriptionid,
					productsaleid,taxcategoryid ,baseprice,taxpercentage)
					SELECT _newinvoiceid,itemname, discount,taxamount,subscriptionid,
					productsaleid,taxcategoryid ,baseprice,taxpercentage
					 FROM invoiceitem it
					 INNER JOIN invoice i ON it.invoiceid = i.id
				     where it.subscriptionid = sale_id and i.memberid = _memberid and i.clientid = client_id;

					INSERT INTO subscriptionhistory (id,member, serviceplan,amount,startdate,
					expirydatesubscription,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,isbulkupload,
					consumedsession,trainerid,schedule,salesbyid,notefornxtsession,costprice,ptcommssion,renew_type)
					SELECT s.id,member, serviceplan,amount,startdate,expirydatesubscription,s.createdbyid ,
					s.createdbydate,s.modifiedbyid,s.modifiedbydate,s.isbulkupload,consumedsession,trainerid,schedule,
					salesbyid,notefornxtsession,costprice,ptcommssion,renew_type
					 FROM subscription s
					 INNER JOIN member m ON m.id = s.member
					 where s.id = sale_id and m.clientid = client_id;

					delete subscription from subscription
					INNER JOIN member m ON m.id = subscription.member
					where  subscription.id = sale_id and m.clientid = client_id;


				else

					update productsale set
					renew_type = 5,
					modifiedbyid=sale_createdbyid,
					modifiedbydate=now()
					where id = sale_id and member = _memberid;

					insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
					clientid,createdbyid,createdbydate)values(_balance,sale_amount,"cancel product",sale_id,"productsale",_memberid,
					client_id,sale_createdbyid,now());

                    INSERT INTO invoice ( memberid,createdbyid,createdbydate,clientid,
                    paymentid,invoicecode,creditforinvoiceid)
					SELECT memberid,createdbyid,now(),clientid,paymentid
					,getInvoicenumber('invoice', client_id),_creditforinvoiceid FROM invoice
                    where id = _creditforinvoiceid and memberid = _memberid and clientid = client_id;

        		     SELECT LAST_INSERT_ID() into _newinvoiceid;

					INSERT INTO invoiceitem (invoiceid,itemname, discount,taxamount,subscriptionid,
					productsaleid,taxcategoryid ,baseprice,taxpercentage)
					SELECT _newinvoiceid,itemname, discount,taxamount,subscriptionid,
					productsaleid,taxcategoryid ,baseprice,taxpercentage
					 FROM invoiceitem it
					 INNER JOIN invoice i ON it.invoiceid = i.id
				     where it.productsaleid = sale_id and i.memberid = _memberid and i.clientid = client_id;

					 update member set   balance=balance  +  sale_amount
					where id=_memberid and clientid = client_id;

				end if;

        select _newinvoiceid as invoiceid;



END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangesaleproductsearch` (IN `tableInfo` LONGTEXT)  BEGIN
	DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table , _branchid varchar(1000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted , _branchid;

	set _offset = pageIndex * pageSize;

	   set _columns = ' p.id,ref_pro.productname as name,p.amount,p.quantity,p.createdbydate,ref_pro.category,
						concat(member.firstname,'' '',member.lastname)as membername,member.mobile,
						member.membercode,p.costprice,member.id as memberid,''0'' isservice ';
		set _table = ' from productsale p
				   INNER JOIN member ON p.member = member.id
				   INNER JOIN product ref_pro ON p.productid = ref_pro.id';

		set _where = concat(' where  renew_type != 5 and member.deleted = 0 and member.clientid = ', client_id , '
        and p.branchid = ' , _branchid);

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

	if _value != '' and _value != 'null'  then
			if _id= 'createdbydate' then
						  set _where = CONCAT(_where , CONCAT(' and date(p.', _id , ') = date(''',getDateFromJSON(_value), ''')'));
			 elseif _id = 'name' then
						set _where = CONCAT(_where , CONCAT(' and ref_pro.productname like ''%', _value ,'%'''));
			elseif _id = 'membername' then
						set _where = CONCAT(_where , CONCAT(' and concat(member.firstname , '' '' , member.lastname) like ''%', _value ,'%'''));
			elseif _id = 'membercode' then
						set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
			elseif _id = 'category' then
						set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			 elseif _id = 'quantity' then
						set _where = CONCAT(_where , CONCAT(' and p.', _id , ' = ', _value));
			 else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
    end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by p.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangesalesave` (IN `data` LONGTEXT)  BEGIN

DECLARE _balance,sale_amount,totalcartprice,totalpurchaseamount,_cancelpaymentamount,
_totalinstallmentamount,_currentdues DECIMAL(12,2) default 0;

DECLARE client_id,_memberid,sale_id,user_id,_creditforinvoiceid,_newinvoiceid,_creditnoteid,
_changetype,_cartid,_paymentmode,_paymenttype,_quantity,_taxcategoryid,_classid,
_subscriptionid,_productsaleid,_paymentid,i, _length,_salesby,_productId,
_assigntrainerid,_maxmonthlylimit,_totaldiscount,_consumedsession,_ptcommissiontype,
_totalminutes , _consumedminutes,_oldstatus,_maxmember,isMaximun,_generategstinvoice INT;

DECLARE _isservice,_enablepaymentcancel TINYINT(1);

DECLARE _canceldetail,_payment,_cart, objinstallment, _installments LONGTEXT;
DECLARE _paymentamount, _memberbalance,_totalprice, _installmentamount,
_discountedprice,_taxamount, _baseprice,_taxpercentage,_duesamount,_sessioncount,
_ptcommssion,_newmemberbalance,_totalpaymentAmount decimal(12,2) DEFAULT 0;

DECLARE _chequeno, _chequedate, _bankname, _remark, _status, _paymentdate,_referenceid,
_firstname, _lastname, _emailid, _mobile, _address1, _address2, _country, _state, _pincode,
_gender,_area,_name,_sessiontype,_price,_startdate,_expirydate, _category,_servicetypeid,_activitytypeid,
_installmentdate,_paymentreceiptnumber,_gstin,_changeservicetype,_defaultbranchid,_invoicedate,
_complementcategory varchar(500);

declare _cancelremark varchar(1000);
DECLARE _maxactivationdate date DEFAULT NULL ;
DECLARE isExit, isExistEmailid,_totalmonthlydiscountgiven int default 0;

DECLARE Loop_installmentAmount, Loop_paidAmount, Loop_remainingAmount decimal(12,2) DEFAULT 0;
DECLARE  Loop_recordFound INT;


DECLARE _newmemberid, _memberoption , _renewtype , sale_serviceid ,_enquiryid INT;
DECLARE  _billing,_paymentobj LONGTEXT;
DECLARE _cancelmembername,_cancelmembercode,_cancelservicetypeid,_cancelactivitytypeid,
_cancelsessiontypeid , _cancelstartdate, _cancelexpirydate , _transferactivationdate ,
 _transferexpirydate,_newexpirydate varchar(500);
DECLARE _city,_timezoneoffsetvalue,_membercode,_taxinvoicecode,_creditforinvoicecode varchar(100);
DECLARE stateID int DEFAULT NULL;
DECLARE countryID varchar(2) DEFAULT NULL;


 DECLARE sqlcode CHAR(5) DEFAULT '00000';
 DECLARE msg TEXT;

		DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			 SET @flag = 0;
	             ROLLBACK;
	             if sqlcode = 'ERR0R' then
					 Call `ERROR`(msg);
	             else
					 Call `ERROR`('Internal Server Error');
	             end if;
		END;

		select JSON_EXTRACT(data,'$.canceldetail'),JSON_EXTRACT(data,'$.clientId'),
		JSON_EXTRACT(data,'$.userId'),JSON_EXTRACT(data,'$.changetype'),JSON_EXTRACT(data,'$.payment'),
		JSON_EXTRACT(data,'$.cart'),JSON_EXTRACT(data,'$.installments'),JSON_EXTRACT(data,'$.changeservicetype'),
		JSON_EXTRACT(data,'$.salesby'),JSON_EXTRACT(data,'$.billing'),JSON_EXTRACT(data,'$.maxmonthlylimit'),
		JSON_EXTRACT(data,'$.totaldiscount'),JSON_EXTRACT(data,'$.invoiceDate'),
		JSON_EXTRACT(data,'$.totalinstallmentamount'),JSON_EXTRACT(data,'$.generategstinvoice'),
		JSON_EXTRACT(data,'$.totalpaymentAmount')
		into _canceldetail,client_id,user_id,_changetype,_payment,_cart,_installments,_changeservicetype,_salesby,
		_billing,_maxmonthlylimit,_totaldiscount,_invoicedate,_totalinstallmentamount,_generategstinvoice,
		_totalpaymentAmount;

		set _changeservicetype = REPLACE(_changeservicetype,'"','');
		set _invoicedate = REPLACE(_invoicedate,'"','');
		set _totalinstallmentamount = REPLACE(_totalinstallmentamount,'"','');

	  if _changetype = 2 and _maxmonthlylimit > 0 and _totaldiscount > 0 then
			SELECT IFNULL(sum(discount),0) into _totalmonthlydiscountgiven FROM invoiceitem it
			inner join invoice i on i.id = it.invoiceid where createdbyid = user_id and clientid = client_id and month(date) = month(curdate());

			if (_totalmonthlydiscountgiven + _totaldiscount) > _maxmonthlylimit then
				 Call `ERROR`(concat('You have exceed your monthly discount limit of ', _maxmonthlylimit));
			end if;
	   end if;

	    select JSON_EXTRACT(_canceldetail,'$.id'),JSON_EXTRACT(_canceldetail,'$.amount'),
	    JSON_EXTRACT(_canceldetail,'$.memberid'),JSON_EXTRACT(_canceldetail,'$.isservice'),
	    JSON_EXTRACT(_canceldetail,'$.invoiceid'),JSON_EXTRACT(_canceldetail,'$.remark'),
            JSON_EXTRACT(_canceldetail,'$.branchid'),JSON_EXTRACT(_canceldetail,'$.membername'),
            JSON_EXTRACT(_canceldetail,'$.membercode'),JSON_EXTRACT(_canceldetail,'$.serviceid'),
	    JSON_EXTRACT(_canceldetail,'$.startdate'),JSON_EXTRACT(_canceldetail, '$.servicetypeId'),
            JSON_EXTRACT(_canceldetail, '$.activityId'),JSON_EXTRACT(_canceldetail, '$.sessiontypeId'),
            JSON_EXTRACT(_canceldetail, '$.cancelexpirydate'),JSON_EXTRACT(_canceldetail, '$.transferactivationdate'),
            JSON_EXTRACT(_canceldetail, '$.transferexpirydate'),JSON_EXTRACT(_canceldetail, '$.enablepaymentcancel'),
            JSON_EXTRACT(_canceldetail, '$.cancelpaymentamount'),JSON_EXTRACT(_canceldetail, '$.consumedsession'),
            JSON_EXTRACT(_canceldetail, '$.newexpirydate')
	    into sale_id, sale_amount, _memberid,_isservice,_creditforinvoiceid,_cancelremark,_defaultbranchid,
            _cancelmembername,_cancelmembercode , sale_serviceid , _cancelstartdate,_cancelservicetypeid,
            _cancelactivitytypeid,_cancelsessiontypeid, _cancelexpirydate , _transferactivationdate ,
            _transferexpirydate,_enablepaymentcancel,_cancelpaymentamount,_consumedsession,_newexpirydate;

            set sale_id = REPLACE(sale_id,'"','');
            set _memberid = REPLACE(_memberid,'"','');
            set _cancelremark = REPLACE(_cancelremark,'"','');
	    set _defaultbranchid = REPLACE(_defaultbranchid,'"','');
            set _cancelmembername = REPLACE(_cancelmembername,'"','');
            set _cancelmembercode = REPLACE(_cancelmembercode,'"','');
            set sale_serviceid = REPLACE(sale_serviceid,'"','');
            set _cancelstartdate = REPLACE(_cancelstartdate,'"','');
            set _cancelexpirydate = REPLACE(_cancelexpirydate,'"','');
            set _cancelservicetypeid = REPLACE(_cancelservicetypeid,'"','');
            set _cancelactivitytypeid = REPLACE(_cancelactivitytypeid,'"','');
            set _cancelsessiontypeid = REPLACE(_cancelsessiontypeid,'"','');
	    set _transferactivationdate = REPLACE(_transferactivationdate,'"','');
	    set _transferexpirydate = REPLACE(_transferexpirydate,'"','');
            set _enablepaymentcancel = REPLACE(_enablepaymentcancel,'"','');
            set _cancelpaymentamount = REPLACE(_cancelpaymentamount,'"','');
            set _consumedsession = REPLACE(_consumedsession,'"','');
            set _newexpirydate = REPLACE(_newexpirydate,'"','');

            select  invoicecode into _creditforinvoicecode from invoice where id = _creditforinvoiceid;

	    if _changetype = 3 then

	    	select JSON_EXTRACT(_billing, '$.firstname'),JSON_EXTRACT(_billing , '$.lastname') ,
		JSON_EXTRACT(_billing, '$.personalemailid'),JSON_EXTRACT(_billing, '$.mobile'),
		JSON_EXTRACT(_billing, '$.address1'), JSON_EXTRACT(_billing, '$.address2'),
		JSON_EXTRACT(_billing, '$.country'), JSON_EXTRACT(_billing, '$.state'),
		JSON_EXTRACT(_billing, '$.pincode'), JSON_EXTRACT(_billing, '$.id'),
		JSON_EXTRACT(_billing, '$.memberOption'),JSON_EXTRACT(_billing, '$.area'),
		JSON_EXTRACT(_billing, '$.gstin'),JSON_EXTRACT(_billing, '$.city'),
		JSON_EXTRACT(_billing, '$.gender'),JSON_EXTRACT(_billing, '$.timezoneoffset')
		into _firstname, _lastname,_emailid,_mobile,_address1,_address2,_country,_state,_pincode,_newmemberid,
		_memberoption,_area,_gstin,_city,_gender,_timezoneoffsetvalue;

					set _firstname = REPLACE(_firstname,'"','');
					set _lastname = REPLACE(_lastname,'"','');
					set _emailid = REPLACE(_emailid,'"','');
					set _mobile = REPLACE(_mobile,'"','');
					set _address1 = REPLACE(_address1,'"','');
					set _address2 = REPLACE(_address2,'"','');
					set _country = REPLACE(_country,'"','');
					set _state = REPLACE(_state,'"','');
					set _pincode = REPLACE(_pincode,'"','');
					set _newmemberid = REPLACE(_newmemberid,'"','');
					set _memberoption = REPLACE(_memberoption,'"','');
					set _area = REPLACE(_area,'"','');
					set _gstin = REPLACE(_gstin,'"','');
					set _city = REPLACE(_city,'"','');
					set _gender = REPLACE(_gender,'"','');
                    			set _timezoneoffsetvalue = REPLACE(_timezoneoffsetvalue,'"','');

				  if _memberoption = 1 and ( _newmemberid is null or _newmemberid = 0 ) then
						Call `ERROR` ('Please select a member.');
				  end if;

				  if _country != '' and _country is not null then
					select code into countryID from country where name = _country;

					if countryID is null then
						Call `ERROR` ('Please enter valid country.');
					end if;
				  end if;

				  if _state != '' and _state is not null then
					select id, country_code into stateID, countryID from state where name = _state and (country_code = countryID or countryID is null);

					if stateID is null then
						Call `ERROR` ('Please enter valid State/Region.');
					end if;
				  end if;

				  if _memberoption = 2 or _memberoption = 3 then
					select count(1) into isExistEmailid from member where personalemailid = _emailid and clientid = client_id and deleted = 0;

					if isExistEmailid > 0 then
						Call `ERROR`('Email id already exists.');
					end if;

					select maxmember into _maxmember from branch where id = _defaultbranchid;
		          		if _maxmember > 0 then
					   	SELECT count(1) into isMaximun FROM member where clientid = client_id and deleted = 0 and  defaultbranchid = _defaultbranchid ;
						if isMaximun >= _maxmember then
							Call `ERROR` (concat('You are not allowed to add more than ', _maxmember, ' member.'));
						end if;
		   			end if;


				  end if;



            end if;

START TRANSACTION;

	select balance into _balance from member where id = _memberid  and clientid = client_id;
        set _currentdues = (case when _balance < 0 then ABS(_balance) else 0 end);

	if _changetype = 3 and _memberoption = 1 then
			select balance into _newmemberbalance from member where id = _newmemberid  and clientid = client_id;
        end if;

	if (_isservice != 1) or (_isservice = 1 and _changetype = 1) then

		if _isservice = 1 then

			update subscription set	renew_type = 5,
			remark = case when remark is not null and remark  != '' then CONCAT(remark, '\n' ,CONCAT(' "Cancel Subscription Remark" : ', _cancelremark)) else  CONCAT(' "Cancel Subscription Remark" : ', _cancelremark) end,
			modifiedbyid=user_id,modifiedbydate=now() where id = sale_id and member = _memberid;

			if _creditforinvoiceid and ((_changetype = 1 and sale_amount > 0) or _changetype = 2) then

				insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,clientid,createdbyid,createdbydate,branchid)
		                values(_balance,sale_amount,"cancelled service",sale_id,"subscription",_memberid,client_id,user_id,now(),_defaultbranchid);

				INSERT INTO invoice ( memberid,createdbyid,createdbydate,clientid,paymentid,invoicecode,creditforinvoiceid,branchid,date,totaldues,salesbyid)
				SELECT memberid,createdbyid,now(),clientid,paymentid,getInvoicenumber('invoice', client_id),_creditforinvoiceid,_defaultbranchid,now(),
		                totaldues,salesbyid FROM invoice
				where id = _creditforinvoiceid and memberid = _memberid and clientid = client_id;

				SELECT LAST_INSERT_ID() into _creditnoteid;

				INSERT INTO invoiceitem (invoiceid,itemname, discount,taxamount,subscriptionid,productsaleid,taxcategoryid ,baseprice,taxpercentage)
				SELECT _creditnoteid,itemname, discount,taxamount,sale_id,productsaleid,taxcategoryid ,baseprice,taxpercentage
				FROM invoiceitem it INNER JOIN invoice i ON it.invoiceid = i.id
				where it.subscriptionid = sale_id and i.memberid = _memberid and i.clientid = client_id;

			 end if;


		INSERT INTO subscriptionhistory (id,member, serviceplan,amount,startdate,
		expirydatesubscription,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,isbulkupload,
		consumedsession,trainerid,salesbyid,costprice,ptcommssion,renew_type,
	        remark,branchid,sessioncount,persessioncost,purchasedate,ptcommissiontype,totalminutes,consumedminutes)
		SELECT s.id,member, serviceplan,amount,startdate,now(),s.createdbyid ,
		s.createdbydate,s.modifiedbyid,s.modifiedbydate,s.isbulkupload,consumedsession,trainerid,
		s.salesbyid,costprice,ptcommssion,renew_type,remark,_defaultbranchid,
	        s.sessioncount,s.persessioncost,s.purchasedate,s.ptcommissiontype,s.totalminutes,s.consumedminutes
		FROM subscription s INNER JOIN member m ON m.id = s.member where s.id = sale_id and  s.member = _memberid;

		delete from subscription where  id = sale_id and member = _memberid;

        	SELECT count(1) into isExit FROM subscription  where member = _memberid and date(now()) between startdate and expirydatesubscription;

	        if isExit <= 0 then
	        	update member  SET status = '2' , appaccess = '2' WHERE id = _memberid;
	        end if;

	else

		update productsale set	renew_type = 5,
		remark = case when remark is not null and remark  != '' then CONCAT(remark, '\n' ,CONCAT(' "Cancel Remark" : ', _cancelremark)) else  CONCAT(' "Cancel Remark" : ', _cancelremark) end,
		modifiedbyid=user_id,modifiedbydate=now() where id = sale_id and member = _memberid;

		select productid into _productId from productsale where id = sale_id  and member = _memberid;

		update product set quantity = quantity + 1 where id = _productId;

		insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
		clientid,createdbyid,createdbydate,branchid)values(_balance,sale_amount,"cancelled product",sale_id,"productsale",_memberid,
		client_id,user_id,now(),_defaultbranchid);

		INSERT INTO invoice ( memberid,createdbyid,createdbydate,clientid,paymentid,invoicecode,creditforinvoiceid,branchid,date,totaldues,salesbyid)
		SELECT memberid,createdbyid,now(),clientid,paymentid,getInvoicenumber('invoice', client_id),
                _creditforinvoiceid,_defaultbranchid,date,totaldues,salesbyid FROM invoice
		where id = _creditforinvoiceid and memberid = _memberid and clientid = client_id;

		SELECT LAST_INSERT_ID() into _creditnoteid;

		INSERT INTO invoiceitem (invoiceid,itemname, discount,taxamount,subscriptionid, productsaleid,taxcategoryid ,baseprice,taxpercentage)
		SELECT _creditnoteid,itemname, discount,taxamount,subscriptionid,productsaleid,taxcategoryid ,baseprice,taxpercentage
		FROM invoiceitem it INNER JOIN invoice i ON it.invoiceid = i.id
		where it.productsaleid = sale_id and i.memberid = _memberid and i.clientid = client_id;

	end if;
                    set _balance = _balance + sale_amount;

	update member set   balance= _balance,salesbyid = _salesby where id=_memberid and clientid = client_id;

	  InstallmentLoop :WHILE sale_amount > 0 DO

	  set Loop_recordFound = 0;

	  SELECT  id, amount, paymentamount into Loop_recordFound, Loop_installmentAmount, Loop_paidAmount
	  FROM installment WHERE memberid = _memberid AND installmentstatus <> 2 ORDER BY date ASC limit 1;

	  	if Loop_recordFound > 0 then
			set Loop_remainingAmount = Loop_installmentAmount - Loop_paidAmount;

			if sale_amount >= Loop_remainingAmount  then
				update installment set	paymentamount = paymentamount + Loop_remainingAmount,
				installmentstatus = 2,paiddate = now()	where  id = Loop_recordFound;
				set sale_amount = sale_amount - Loop_remainingAmount ;
			else
				update installment set paymentamount = paymentamount + sale_amount, paiddate = now() where  id = Loop_recordFound;
				set sale_amount = 0;

			end if;
		else
			LEAVE InstallmentLoop;
		end if;

	   end while;

           if _enablepaymentcancel = 1 then
			   if _balance > 0 then
			   	if _balance - _cancelpaymentamount < 0 then
					set _duesamount = _cancelpaymentamount - _balance;
				else
					set _duesamount = 0;
				end if;
			   else
			   	set _duesamount = _cancelpaymentamount;
			   end if;

			   if _duesamount > 0 then
			   	insert into installment(memberid,date,amount,installmentstatus,
				paymentamount,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,branchid)
				values(_memberid,now(),_duesamount,3,0,user_id,now(),user_id,now(),_defaultbranchid);
			   end if;

			   update member set balance = balance - _cancelpaymentamount where id=_memberid and clientid = client_id;

			   update payment set status = 4,
			   remark = case when remark is not null and remark  != '' then CONCAT(remark, CONCAT(' "Cancel Payment Remark : "  ', _cancelremark)) else  CONCAT(' Cancel Payment Remark :  ', _cancelremark) end,
			   modifiedbyid = user_id,modifiedbydate = now() where paymentreceiptcode=_creditforinvoicecode and memberid=_memberid;

			   insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,clientid,createdbyid,createdbydate,branchid)
			   values(_balance, (0 - _cancelpaymentamount),concat("cancel payment - ",_creditforinvoicecode),null,"payment",_memberid,client_id,user_id,now(),_defaultbranchid);

		end if;
     end if;
     if _changetype = 3 then

	if _memberoption = 3 then

		insert into member(firstname,lastname,mobile,personalemailid,address1,address2 ,country,state ,pincode,panno,clientid,membercode,createdbyid ,createdbydate,transactionalnotification,promotionalnotification,area,gstin,branchid,city,defaultbranchid,gender,timezoneoffsetvalue)
		values(_firstname, _lastname,_mobile,_emailid,_address1,_address2,countryID,stateID,_pincode,'',client_id,getSequence('member' , client_id),user_id,now(),1,1,_area,_gstin,json_array(_defaultbranchid),_city,_defaultbranchid,_gender,_timezoneoffsetvalue);

		SELECT LAST_INSERT_ID() into _newmemberid;

	elseif _memberoption = 2 then

		SET _enquiryid = _newmemberid;
		SET _membercode = getSequence('member' , client_id);
		insert into member(firstname,lastname,mobile,personalemailid,address1,address2 ,country,state ,pincode,panno,clientid,membercode,gender,
		createdbyid ,createdbydate,transactionalnotification,promotionalnotification,area,branchid,city,defaultbranchid,timezoneoffsetvalue)
		values(_firstname,_lastname,_mobile,_emailid,_address1,_address2,countryID,stateID,_pincode,'',client_id,_membercode,_gender,user_id,now(),1,1,_area,
		json_array(_defaultbranchid),_city,_defaultbranchid,_timezoneoffsetvalue);

		SELECT LAST_INSERT_ID() into _newmemberid;

		select enquirystatus into _oldstatus from enquiry where id = _enquiryid;

		update enquiry set memberid = _newmemberid,  enquirystatus= 4 ,joineddate = now() where id=_enquiryid and clientid=client_id;

		insert into enquirystatus(remark,oldstatus,newstatus,createdbyid,createdbydate,enquiryid,branchid)
		values(_membercode,_oldstatus,4,_salesby,now(),_enquiryid,_defaultbranchid);


	  elseif _memberoption = 1 then

		 if _cancelservicetypeid = 1 then
			set _transferactivationdate = getDateFromUTC(_transferactivationdate,'+00:00',0);

			select max(expirydatesubscription) into _maxactivationdate from subscription s
			left outer join service on s.serviceplan = service.id where member = _newmemberid and
                        service.servicetype = cast(_cancelservicetypeid as unsigned);

			if _maxactivationdate >= date(_transferactivationdate) then
				Call `ERROR`(concat('Membership is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y") ));
			end if;

            update memberremark set followupdate = null  where followupdate > now() and memberid = _newmemberid and followuptype in  (1,2,4,12);

		 elseif _cancelservicetypeid = 2 then
		 	set _transferactivationdate = getDateFromUTC(_transferactivationdate,'+00:00',0);

				select max(expirydatesubscription) into _maxactivationdate from subscription s
				left outer join service on s.serviceplan = service.id where member = _newmemberid
				and service.servicetype = cast(_cancelservicetypeid as unsigned) and service.activity = cast(_cancelactivitytypeid as unsigned) and service.sessiontype = _cancelsessiontypeid;

				if _maxactivationdate >= date(_transferactivationdate) then
					Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y") ));
				end if;

				if(_cancelactivitytypeid = 2) then
					update memberremark set followupdate = null  where followupdate > now() and memberid = _newmemberid and followuptype in  (2,4,11,13);
				end if;
		 end if;

		 update member set address1 = _address1, address2= _address2 ,
		 area = _area,city = _city,country = countryID,state  = stateID,pincode = _pincode,gender = _gender
		 where id = _newmemberid and clientid = client_id and deleted = 0;

	  end if;


          INSERT INTO subscription (member, serviceplan,amount,startdate,expirydatesubscription,createdbyid ,createdbydate,isbulkupload,
	  consumedsession,trainerid,salesbyid,costprice,ptcommssion,renew_type,
	  remark,branchid,sessioncount,persessioncost,purchasedate,ptcommissiontype,totalminutes,consumedminutes)
	  SELECT _newmemberid, sale_serviceid,0,getDateFromUTC(_transferactivationdate,'+00:00',0),getDateFromUTC(_transferexpirydate,'+00:00',0),user_id,
	  now(),s.isbulkupload,0,trainerid,
	  user_id,0,ptcommssion,6,concat('Transferred from ' , _cancelmembername , ' - ' , _cancelmembercode ),
          _defaultbranchid,(ifnull(s.sessioncount,0) - ifnull(s.consumedsession,0)),s.persessioncost,
          s.purchasedate,s.ptcommissiontype,(ifnull(s.totalminutes,0) - ifnull(s.consumedminutes,0)),0 FROM subscription s
            INNER JOIN member m ON m.id = s.member where s.id = sale_id and m.clientid = client_id;

	    update subscription set remark = case when remark is not null and remark  != '' then CONCAT(remark, '\n' ,CONCAT('  "Transfer Subscription Remark" :  ', _cancelremark)) else  CONCAT(' "Transfer Subscription Remark" : ', _cancelremark) end,
            expirydatesubscription = getDateFromUTC(_cancelexpirydate,'+00:00',0),
            sessioncount = (ifnull(sessioncount,0) - (ifnull(sessioncount,0) - ifnull(consumedsession,0))),
            totalminutes = (ifnull(totalminutes,0) - (ifnull(totalminutes,0) - ifnull(consumedminutes,0))),
	    modifiedbyid=user_id,modifiedbydate=now() where id = sale_id and member = _memberid;

	    SELECT count(1) into isExit FROM subscription
	    where member = _newmemberid and date(now()) between startdate and expirydatesubscription;

            if isExit > 0 then
	    	update member  SET status = '1' , appaccess = '1' WHERE id = _newmemberid;
	    end if;

            insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
	    clientid,createdbyid,createdbydate,branchid)values(_balance,0,"transferred service",sale_id,"subscription", _memberid,client_id,user_id,now(),_defaultbranchid);
end if;

if((_changetype = 2) and _isservice = 1) then

        InstallmentLoop :WHILE _currentdues > 0 DO

			set Loop_recordFound = 0;

			SELECT  id, amount, paymentamount into Loop_recordFound, Loop_installmentAmount, Loop_paidAmount
			FROM installment WHERE memberid = _memberid AND installmentstatus <> 2 ORDER BY date ASC limit 1;

			if Loop_recordFound > 0 then
				set Loop_remainingAmount = Loop_installmentAmount - Loop_paidAmount;

				if _currentdues >= Loop_remainingAmount  then
					update installment set paymentamount = paymentamount + Loop_remainingAmount,
					installmentstatus = 2,paiddate = now() where  id = Loop_recordFound;

					set _currentdues = _currentdues - Loop_remainingAmount ;
				else
					update installment set paymentamount = paymentamount + _currentdues, paiddate = now() where  id = Loop_recordFound;

					set _currentdues = 0;

				end if;
			else
				LEAVE InstallmentLoop;
			end if;

		   end while;

end if;

 if (_changetype = 2 and _isservice = 1) then
 	update subscription set expirydatesubscription = _newexpirydate,
	remark = case when remark is not null and remark  != '' then CONCAT(remark, '\n' ,CONCAT(' "Cancel Subscription Remark" : ', _cancelremark)) else  CONCAT(' "Cancel Subscription Remark" : ', _cancelremark) end,
	modifiedbyid=user_id,modifiedbydate=now() where id = sale_id and member = _memberid;
end if;

  if (_changetype = 2 or  (_changetype = 3 and _payment != '')) then
  	select JSON_EXTRACT(_cart, '$.objectID'),JSON_EXTRACT(_cart , '$.name') ,
	JSON_EXTRACT(_cart, '$.brand'), JSON_EXTRACT(_cart, '$.price'),
        JSON_EXTRACT(_cart, '$.startDate'),  JSON_EXTRACT(_cart, '$.expiryDate'),
        JSON_EXTRACT(_cart, '$.isService'),JSON_EXTRACT(_cart, '$.totalPrice'),
        JSON_EXTRACT(_cart, '$.category'), JSON_EXTRACT(_cart, '$.Quantity'),
        JSON_EXTRACT(_cart, '$.servicetypeId'), JSON_EXTRACT(_cart, '$.activitytypeId'),
	JSON_EXTRACT(_cart,'$.taxcategoryid'), JSON_EXTRACT(_cart,'$.discountedprice'),
	JSON_EXTRACT(_cart,'$.taxamount'), JSON_EXTRACT(_cart,'$.baseprice'),
	JSON_EXTRACT(_cart,'$.taxpercentage'),JSON_EXTRACT(_cart,'$.classid'),
        JSON_EXTRACT(_cart,'$.assigntrainerid'),JSON_EXTRACT(_cart,'$.complementcategory'),
	JSON_EXTRACT(_cart,'$.sessioncount'),JSON_EXTRACT(_cart,'$.ptcommissiontype'),
        JSON_EXTRACT(_cart,'$.ptcommssion'),JSON_EXTRACT(_cart,'$.totalminutes')
	into _cartid, _name,_sessiontype,_price,_startdate,_expirydate,_isservice,_totalprice,_category,_quantity,
        _servicetypeid,_activitytypeid,_taxcategoryid,_discountedprice,_taxamount,_baseprice,_taxpercentage,
        _classid,_assigntrainerid,_complementcategory,_sessioncount,_ptcommissiontype,_ptcommssion,_totalminutes;


        set _cartid = REPLACE(_cartid,'"','');
	set _name = REPLACE(_name,'"','');
	set _sessiontype = REPLACE(_sessiontype,'"','');
        set _price = REPLACE(_price,'"','');
	set _startdate = REPLACE(_startdate,'"','');
        set _expirydate = REPLACE(_expirydate,'"','');
	set _isservice = REPLACE(_isservice,'"','');
        set _totalprice = REPLACE(_totalprice,'"','');
        set _category = REPLACE(_category,'"','');
        set _quantity = REPLACE(_quantity,'"','');
	set _taxcategoryid = REPLACE(_taxcategoryid,'"','');
	set _discountedprice = REPLACE(_discountedprice,'"','');
	set _taxamount = REPLACE(_taxamount,'"','');
	set _baseprice = REPLACE(_baseprice,'"','');
	set _servicetypeid = REPLACE(_servicetypeid,'"','');
	set _activitytypeid = REPLACE(_activitytypeid,'"','');
        set _taxpercentage = REPLACE(_taxpercentage,'"','');
	set _classid = REPLACE(_classid,'"','');
        set _assigntrainerid = REPLACE(_assigntrainerid,'"','');
        set _complementcategory = REPLACE(_complementcategory,'"','');
	set _sessioncount = REPLACE(_sessioncount,'"','');
	set _ptcommissiontype = REPLACE(_ptcommissiontype,'"','');
        set _ptcommssion = REPLACE(_ptcommssion,'"','');
        set _totalminutes = REPLACE(_totalminutes,'"','');

	set _discountedprice = case when _discountedprice > 0 then _discountedprice else null end;
	set _taxamount = case when _taxamount > 0 then _taxamount else null end;
	set _taxcategoryid = case when _taxcategoryid > 0 then _taxcategoryid else null end;

	set _taxpercentage = case when _taxpercentage > 0 then _taxpercentage else null end;
	set _assigntrainerid = case when _assigntrainerid > 0 then _assigntrainerid else null end;


	    if _ptcommissiontype = '' then
               set _ptcommissiontype = null;
            end if;

            if _servicetypeid = 1 then
	    	set _startdate = getDateFromUTC(_startdate,'+00:00',0);

		select max(expirydatesubscription) into _maxactivationdate from subscription s
		left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned);

		if _maxactivationdate >= date(_startdate) then
			Call `ERROR`(concat('Membership is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y") ));
		end if;
		update memberremark set followupdate = null  where followupdate > now() and memberid = _memberid and followuptype in  (1,2,4,12);

	    elseif _servicetypeid = 2 then
	    	set _startdate = getDateFromUTC(_startdate,'+00:00',0);
				if(_activitytypeid = 1) then
					select max(expirydatesubscription) into _maxactivationdate from subscription s
					left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

					if _maxactivationdate >= date(_startdate) then
						Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
					end if;
                elseif (_activitytypeid = 2) then

					select max(expirydatesubscription) into _maxactivationdate from subscription s
					left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype and ifnull(s.trainerid,0) = ifnull(_assigntrainerid,0);

					if _maxactivationdate >= date(_startdate) then
						Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
					end if;
                    update memberremark set followupdate = null  where followupdate > now() and memberid = _memberid and followuptype in  (2,4,11,13);
          end if;
	    end if;

            set totalcartprice = totalcartprice + _totalprice;
	    set totalpurchaseamount = totalpurchaseamount +  _totalprice;

            if _isservice = true then
				insert into subscription (member,serviceplan,amount,startdate,expirydatesubscription,createdbyid ,
                createdbydate,salesbyid,costprice,renew_type,branchid,remark,sessioncount,persessioncost,consumedsession,
                purchasedate,ptcommissiontype,ptcommssion,totalminutes,consumedminutes,trainerid)
				values((case when _changetype = 3 then _newmemberid else _memberid end),_cartid,_totalprice,getDateFromUTC(_startdate,'+00:00',0),getDateFromUTC(_expirydate,'+00:00',0),user_id,
                now(),_salesby,_price,case when _changetype = 3 then 6 else 3 end,
                _defaultbranchid,case when _complementcategory != '' and _complementcategory is not null then CONCAT(CONCAT('"Complimentary Service Category" :  ', _complementcategory), '\n' , _remark) else _remark end ,
                _sessioncount,case when _sessioncount > 0 and _activitytypeid = 2 then (_baseprice/_sessioncount) else null end,
                _consumedsession,_invoicedate,_ptcommissiontype,_ptcommssion, _totalminutes , _consumedminutes,_assigntrainerid);

		SELECT LAST_INSERT_ID() into _subscriptionid;

		if _classid is not null  and _classid > 0 then
			insert into classmember(classid,memberid,createdbyid,createdbydate)
			values(_classid,(case when _changetype = 3 then _newmemberid else _memberid end),user_id,now());
		end if;


		UPDATE member SET status = '1' , appaccess = '1' WHERE id = (case when _changetype = 3 then _newmemberid else _memberid end);
         else

	 	insert into productsale (member,productid,quantity,amount,createdbyid ,createdbydate,salesbyid,
                costprice,renew_type,branchid,remark,purchasedate)
		values((case when _changetype = 3 then _newmemberid else _memberid end),_cartid,_quantity,_totalprice,user_id,now(),_salesby,_price,
                7 ,_defaultbranchid,_remark,_invoicedate);

		SELECT LAST_INSERT_ID() into _productsaleid;

		update product set	quantity=quantity - _quantity where id=_cartid and clientid = client_id;

	 end if;

	 insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
	 clientid,createdbyid,createdbydate,branchid)
	 values((case when _changetype = 3 then _newmemberbalance else _balance end),(0 - _totalprice),_changeservicetype,ifnull(_subscriptionid,_productsaleid),case when _isservice then "subscription" else "productsale" end,
         (case when _changetype = 3 then _newmemberid else _memberid end),client_id,user_id,now(),_defaultbranchid);

	 set _taxinvoicecode = null;

	 set _paymentreceiptnumber = getInvoicenumber('invoice', client_id);
	 if _generategstinvoice = 1 then
	 	set _taxinvoicecode = getTaxInvoicenumber('taxinvoice', client_id);
	 end if;

	 insert into invoice (memberid,createdbyid,createdbydate,clientid,invoicecode,branchid,date,totaldues,taxinvoicecode,salesbyid)
	 values((case when _changetype = 3 then _newmemberid else _memberid end),user_id,now(),client_id,_paymentreceiptnumber,
         _defaultbranchid,case when _invoicedate is not null then getDateFromUTC(_invoicedate,'+00:00',0) else now() end,
         _totalinstallmentamount,_taxinvoicecode,_salesby);

	 SELECT LAST_INSERT_ID() into _newinvoiceid;

	 insert into invoiceitem (invoiceid,itemname,discount ,taxamount,subscriptionid,productsaleid,taxcategoryid,baseprice,taxpercentage)
	 values(_newinvoiceid,_name,_discountedprice,_taxamount,_subscriptionid, _productsaleid,_taxcategoryid,_baseprice,_taxpercentage);

	 set _subscriptionid = null;
	 set _productsaleid = null;

     update member set   balance=balance - totalpurchaseamount + ifnull( _totalpaymentAmount,0)
	 where id=(case when _changetype = 3 then _newmemberid else _memberid end) and clientid = client_id;

	SET i = 0;
	SET _length = JSON_LENGTH(_installments);

	WHILE  i < _length DO
		SELECT JSON_EXTRACT(_installments,CONCAT('$[',i,']')) into objinstallment;

		select JSON_EXTRACT(objinstallment, '$.installmentDate'),
		JSON_EXTRACT(objinstallment , '$.installmentAmount')
		into _installmentdate, _installmentamount;

		set _installmentdate = REPLACE(_installmentdate,'"','');
		set _installmentamount = REPLACE(_installmentamount,'"','');

                if(_installmentamount is not null) then

			insert into installment(memberid,date,amount,
			paymentamount,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,branchid)
			values((case when _changetype = 3 then _newmemberid else _memberid end),getDateFromUTC(_installmentdate,'+00:00',0),_installmentamount,0,
			user_id,now(),user_id,now(),_defaultbranchid);

		end if;

		SET  i = i + 1;
	END WHILE;

	if _memberbalance is null then set _memberbalance = 0;  end if;

	if _changetype = 3 then
		select balance into _balance from member where id =  _newmemberid  and clientid = client_id;
	end if;

	SET i = 0;
	SET _length = JSON_LENGTH(_payment);

	WHILE  i < _length DO
		SELECT JSON_EXTRACT(_payment,CONCAT('$[',i,']')) into _paymentobj;

		select JSON_EXTRACT(_paymentobj, '$.paymentAmount'),
		JSON_EXTRACT(_paymentobj , '$.paymentMode') ,
		JSON_EXTRACT(_paymentobj, '$.chequeno'),
		JSON_EXTRACT(_paymentobj, '$.chequeDate'),
		JSON_EXTRACT(_paymentobj, '$.bankName'),
		JSON_EXTRACT(_paymentobj, '$.status'),
		JSON_EXTRACT(_paymentobj, '$.remark'),
		JSON_EXTRACT(_paymentobj, '$.paymentDate'),
		JSON_EXTRACT(_paymentobj, '$.referenceId')
		into _paymentamount, _paymentmode,_chequeno,_chequedate,_bankname,_status,_remark,
		_paymentdate,_referenceid;

		set _paymentamount = REPLACE(_paymentamount,'"','');
		set _paymentmode = REPLACE(_paymentmode,'"','');
		set _chequeno = REPLACE(_chequeno,'"','');
		set _chequedate = REPLACE(_chequedate,'"','');
		set _bankname = REPLACE(_bankname,'"','');
		set _status = REPLACE(_status,'"','');
		set _remark = REPLACE(_remark,'"','');
		set _paymentdate = REPLACE(_paymentdate,'"','');
		set _referenceid = REPLACE(_referenceid,'"','');

		if _paymentamount > 0 then

			insert into payment(memberid,paymentamount,paymentmode,chequeno,
			chequedate,bankname ,status,remark,paymentdate,createdbyid ,createdbydate,createdfrom,
			paymentreceiptcode,referenceid,branchid,invoiceid)
			values((case when _changetype = 3 then _newmemberid else _memberid end),_paymentamount,_paymentmode,_chequeno,getDateFromUTC(_chequedate,'+00:00',0),_bankname,_status,
			case when _complementcategory != '' and _complementcategory is not null then CONCAT(CONCAT('"Complimentary Service Category" :  ', _complementcategory), '\n' , _remark) else _remark end,
			getDateFromUTC(_paymentdate,'+00:00',0),user_id,now(),'u',_paymentreceiptnumber,_referenceid,_defaultbranchid,_newinvoiceid);

			 SELECT LAST_INSERT_ID() into _paymentid;

			 insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
			 clientid,createdbyid,createdbydate,branchid)
			 values(((case when _changetype = 3 then _newmemberbalance else _balance end) - _totalprice),_paymentamount,"payment",_paymentid,"payment",(case when _changetype = 3 then _newmemberid else _memberid end),client_id,user_id,now(),_defaultbranchid);

			 set _newmemberbalance = _newmemberbalance  + _paymentamount;
			 set _balance = _balance  + _paymentamount;

		end if;

      	SET  i = i + 1;
  	END WHILE;
 end if;

  select ifnull(_creditnoteid,null) as creditnoteid,ifnull(_newinvoiceid,null) as invoiceid;
COMMIT;
SET @flag = 1;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangesalesubscriptionsearch` (IN `tableInfo` LONGTEXT)  BEGIN
    DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table , _branchid varchar(1000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted , _branchid;

	set _offset = pageIndex * pageSize;

			set _columns = 's.id,service.servicename as name,s.startdate, s.member,s.expirydatesubscription,s.createdbyid,
			s.createdbydate ,CASE  WHEN s.startdate > date(now()) THEN (DATEDIFF(s.expirydatesubscription,s.startdate)+1)
			ELSE  (DATEDIFF(s.expirydatesubscription,now())+1) end as daysleft,service.measurementunit,
			(service.measurementunit+0) measurementunitId ,service.servicetype, (service.servicetype+0) servicetypeId ,
			s.consumedsession,concat(m.firstname , '' '' , m.lastname) as membername,m.membercode,s.amount,
			(ifnull(s.sessioncount,0) - ifnull(s.consumedsession,0)) as ''sessionleft'' ,s.sessioncount,
			(DATEDIFF(date(s.expirydatesubscription),date(s.startdate))+1) as totaldays,
            service.activity,m.id as memberid,''1'' isservice,
            s.totalminutes , s.consumedminutes , (ifnull(s.totalminutes,0) - ifnull(s.consumedminutes,0)) as ''minutesleft''
            ';
			set _table = ' from subscription s
			left outer join service ON s.serviceplan = service.id
			left outer join member m ON s.member = m.id';

			set _where = concat(' where  s.expirydatesubscription >= date(now()) and m.deleted = 0 and
            m.clientid = ', client_id , ' and s.branchid = ' , _branchid);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

	if _value != '' and _value != 'null'  then
     if _id = 'startdate' then
				 set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromJSON(_value), ''')'));
	elseif _id = 'expirydatesubscription' then
				 set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromJSON(_value), ''')'));
  elseif _id= 'createdbydate' then
			      set _where = CONCAT(_where , CONCAT(' and date(s.', _id , ') = date(''',getDateFromJSON(_value), ''')'));

   	 elseif _id = 'createdby' then
			      set _where = CONCAT(_where , CONCAT(' and concat(ref_u.firstname , '' '' , ref_u.lastname) like ''%', _value ,'%'''));

    elseif _id = 'membername' then
				set _where = CONCAT(_where , CONCAT(' and concat(m.firstname , '' '' , m.lastname) like ''%', _value ,'%'''));
	elseif _id = 'name' then
				set _where = CONCAT(_where , CONCAT(' and service.servicename like ''%', _value ,'%'''));
    elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
	elseif _id = 'servicetype' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
    elseif _id = 'activity' then
				set _where = CONCAT(_where , CONCAT(' and service.', _id , ' = ', _value));

    else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
    end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by s.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPchangesalesubscriptionview` (IN `changesale_id` INT, IN `isiservice` TINYINT(1), IN `client_id` INT)  BEGIN
if isiservice then
			select s.id,service.servicename as name,s.startdate, s.member,s.expirydatesubscription,s.createdbyid,
			s.createdbydate ,DATEDIFF(s.expirydatesubscription,now()) as daysleft,service.measurementunit,
			(service.measurementunit+0) measurementunitId ,service.servicetype, (service.servicetype+0) servicetypeId ,
			s.consumedsession,concat(m.firstname , ' ', m.lastname) as membername,m.membercode,s.amount,
			(ifnull(s.sessioncount,0) - ifnull(s.consumedsession,0)) as 'sessionleft' ,s.sessioncount,
			DATEDIFF(s.expirydatesubscription,s.startdate) as totaldays,service.activity,(service.activity+0)activityId,
			m.id as memberid,service.sessiontype,(service.sessiontype)sessiontypeId,
           '1' isservice,i.invoiceid,service.id as serviceid,
            s.totalminutes , s.consumedminutes , (ifnull(s.totalminutes,0) - ifnull(s.consumedminutes,0)) as 'minutesleft',
            m.personalemailid,m.mobile,m.defaultbranchid,(select sum(p.paymentamount) from payment p where
		    p.paymentreceiptcode = inv.invoicecode and p.status = 2) paymentamount
			from  subscription s
			left outer join service ON s.serviceplan = service.id
			left outer join member m ON s.member = m.id
			LEFT OUTER JOIN invoiceitem i ON s.id = i.subscriptionid
            LEFT OUTER JOIN invoice inv ON i.invoiceid = inv.id
			where  s.expirydatesubscription >= date(now()) and  m.clientid =  client_id and s.id = changesale_id;
else
			select p.id,ref_pro.productname as name,p.amount,p.quantity,p.createdbydate,ref_pro.category,
			concat(member.firstname,' ',member.lastname)as membername,member.mobile,
			member.membercode,p.costprice,member.id as memberid,'0' isservice,i.invoiceid,ref_pro.id as productid,
            m.personalemailid,m.defaultbranchid,
            (select sum(pm.paymentamount) from payment pm where
		    pm.paymentreceiptcode = inv.invoicecode and pm.status = 2) paymentamount
			from productsale p
			INNER JOIN member ON p.member = member.id
			INNER JOIN product ref_pro ON p.productid = ref_pro.id
			LEFT OUTER JOIN invoiceitem i ON p.id = i.productsaleid
            LEFT OUTER JOIN invoice inv ON i.invoiceid = inv.id
			where  p.id = changesale_id and renew_type != 5 and member.clientid = client_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPClassassignmembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE pageSize, pageIndex, client_id, _offset, i, _length,class_id INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
     JSON_EXTRACT(tableInfo,'$.classId')
    into pageSize, pageIndex, client_id, filtered, sorted , class_id;

	set _offset = pageIndex * pageSize;

	set _columns = 'c.id,concat(ref_m.firstname,'' '',ref_m.lastname) as name,
						ref_m.mobile';
    set _table = ' from classmember c
                    INNER JOIN  member  ref_m on c.memberid = ref_m.id';

	set _where = concat(' where c.deleted = 0 and c.classid = ', class_id);


	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' then
         if _id = 'name' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(ref_m.firstname,'' '',ref_m.lastname) ', ' like ''%', _value ,'%'''));
		else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	end if;
    	end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by c.deleted ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientbiometricconfigurationsave` (IN `client_id` INT, IN `client_biometric` LONGTEXT, IN `client_inbody` INT, IN `client_geofencing` LONGTEXT)  BEGIN
			update client set
			biometric = client_biometric,
            isinbody = client_inbody,
            geofencing = client_geofencing
			where id = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientbrandsave` (IN `client_id` INT, IN `client_logo` VARCHAR(200), IN `client_tagline` VARCHAR(100), IN `client_signinbackgroundimage` LONGTEXT, IN `client_memberprofilecoverimage` VARCHAR(200), IN `client_sidebarimages` LONGTEXT, IN `client_invoicebannerimage` VARCHAR(200), IN `client_singninfontportrait` VARCHAR(20), IN `client_singninfontlandscap` VARCHAR(20), IN `client_brandname` VARCHAR(200))  BEGIN
		update client set
			logo = client_logo,
			tagline = client_tagline,
			signinbackgroundimage = client_signinbackgroundimage,
			memberprofilecoverimage = client_memberprofilecoverimage,
			sidebarimage = client_sidebarimages,
			invoicebannerimage = client_invoicebannerimage,
			singninfontportrait = client_singninfontportrait,
			singninfontlandscap = client_singninfontlandscap,
			organizationbrandname = client_brandname
			where id =client_id;

	END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientemailgatewaysave` (IN `client_id` INT, IN `email_gateway` LONGTEXT, IN `sms_gateway` LONGTEXT)  BEGIN

	update client set
			emailgateway = email_gateway,
            smsgateway = sms_gateway
			where id=client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientgatewayinformation` (IN `client_id` INT)  BEGIN

	select emailgateway,smsgateway
	from client
	 where id = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientnotificationconfigurationsave` (IN `data` LONGTEXT)  BEGIN
DECLARE client_id, i,j, _length,user_id INT;
    DECLARE    _notification, obj ,_days, _notificationthrough LONGTEXT;
    DECLARE _notificationAlias,_notificationType,_isEnable varchar(500);
	DECLARE isExist int DEFAULT 0;

	select JSON_EXTRACT(data,'$.clientId'),
	JSON_EXTRACT(data,'$.userId'),
    JSON_EXTRACT(data,'$.NotificationConfiguration')
    into  client_id,user_id, _notification;

     SET i = 0;

	  SET _length = JSON_LENGTH(_notification);


		WHILE  i < _length DO
			SELECT JSON_EXTRACT(_notification,CONCAT('$[',i,']')) into obj;
			select JSON_EXTRACT(obj, '$.notificationAlias'),
			JSON_EXTRACT(obj , '$.notificationType') ,
			JSON_EXTRACT(obj, '$.isEnable'),
			JSON_EXTRACT(obj, '$.days'),
            JSON_EXTRACT(obj, '$.notificationthrough')
			into _notificationAlias, _notificationType,_isEnable,_days,_notificationthrough;


			set _notificationAlias = REPLACE(_notificationAlias,'"','');
			set _notificationType = REPLACE(_notificationType,'"','');
			set _isEnable = REPLACE(_isEnable,'"','');


            if _days = 'null' then
				set _days = null;
            end if;

            SELECT count(1) into isExist FROM clientnotificationconfiguration where notificationalias=_notificationAlias AND clientid=client_id;

			if isExist = 0 then

			  insert into clientnotificationconfiguration (notificationalias,notificationtype,isenable,days,notificationthrough,
              createdbyid ,createdbydate,clientid)
				values(_notificationAlias,_notificationType,_isEnable,_days,_notificationthrough,user_id,now(),client_id);

			else

				update clientnotificationconfiguration set
					notificationalias=_notificationAlias,
                    notificationtype = _notificationType,
                    isenable = _isEnable,
                    days = _days,
                    notificationthrough = _notificationthrough,
                    modifiedbyid = user_id,
                    modifiedbydate = now()
					where notificationalias=_notificationAlias and clientid = client_id;

            end if;

			SET  i = i + 1;
		END WHILE;



END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientnotificationconfigurationview` (IN `client_id` INT)  BEGIN

    select notificationAlias,notificationType,isEnable,notificationthrough,days
	from clientnotificationconfiguration
	 where clientid = client_id;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientpaymentgatewaysave` (IN `payment_gateway` LONGTEXT, IN `client_id` INT)  BEGIN

DECLARE _configurationtype varchar(20);

SET _configurationtype = REPLACE(JSON_EXTRACT(payment_gateway,'$[0].configurationtype'), '"','');

			update client set
            paymentgateway = JSON_MERGE_PRESERVE(IFNULL(JSON_REMOVE(paymentgateway,REPLACE(
            REPLACE(JSON_SEARCH(paymentgateway,'all', _configurationtype ,  NULL, '$'),'.configurationtype',''), '"','') ) , ifnull(paymentgateway,'[]')),
			payment_gateway)
			where id = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientpaymentgatewaystatussave` (IN `paymentgateway` LONGTEXT, IN `client_id` INT)  BEGIN

            update client set
			paymentgateway = paymentgateway
			where id = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientsave` (IN `client_id` INT, IN `client_organizationname` VARCHAR(100), IN `client_emailid` VARCHAR(100), IN `client_mobile` VARCHAR(20), IN `client_address1` VARCHAR(100), IN `client_address2` VARCHAR(100), IN `client_city` VARCHAR(100), IN `client_state` VARCHAR(100), IN `client_country` VARCHAR(100), IN `client_pincode` VARCHAR(10), IN `client_description` VARCHAR(100), IN `client_gmapaddress` VARCHAR(500), IN `client_latitude` VARCHAR(50), IN `client_longitude` VARCHAR(50), IN `user_id` INT, IN `client_schedule` LONGTEXT, IN `client_gymaccessslot` TINYINT(1), IN `client_slotduration` VARCHAR(20), IN `client_slotmaxoccupancy` INT, IN `client_slotmaxdays` INT, IN `client_ptslotdetail` LONGTEXT, IN `client_cancelgymaccessslothour` DECIMAL(12,2), IN `client_cancelptslothour` DECIMAL(12,2), IN `client_cancelclassslothour` DECIMAL(12,2), IN `client_classmaxdays` INT, IN `client_gapbetweentwogymaccessslot` VARCHAR(20), IN `client_shifttiming` LONGTEXT)  BEGIN
	DECLARE stateID int DEFAULT NULL;
	DECLARE countryID varchar(2) DEFAULT NULL;
	DECLARE branch_id int DEFAULT 0;
    DECLARE client_multiplebranch int DEFAULT 0;

	if client_country != '' && client_country is not null then
		select code into countryID from country where name = client_country;

		if countryID is null then
			Call `ERROR` ('Please enter valid country.');
		end if;
	end if;

	if client_state != '' && client_state is not null then
		select id, country_code into stateID, countryID from state where name = client_state and (country_code = countryID or countryID is null);

		if stateID is null then
			Call `ERROR` ('Please enter valid State/Region.');
		end if;
	end if;

    SELECT id into branch_id FROM branch where deleted = 0 and clientid = client_id and isdefault = 1;

    select ishavemutliplebranch into client_multiplebranch from client where id = client_id;

	    update client set
		useremail = client_emailid,
		organizationname=client_organizationname ,
        mobile=client_mobile
		where id =client_id;

        if branch_id > 0 and ifnull(client_multiplebranch, 0) != 1 then

            update branch set
			branchname=client_organizationname ,
			phone=client_mobile ,
			address1 =client_address1 ,
			address2=client_address2 ,
			city=client_city ,
			country=countryID ,
			state = stateID,
			pincode=client_pincode,
			gmapaddress = client_gmapaddress,
            description=client_description,
            modifiedbyid = user_id,
            modifiedbydate = now(),
            latitude = client_latitude,
            longitude = client_longitude,
			timing = client_schedule,
            gymaccessslot = client_gymaccessslot,
			slotduration = client_slotduration,
			slotmaxoccupancy = client_slotmaxoccupancy,
			slotmaxdays = client_slotmaxdays,
			ptslotdetail = client_ptslotdetail,
            cancelgymaccessslothour = client_cancelgymaccessslothour,
            cancelptslothour = client_cancelptslothour,
            cancelclassslothour = client_cancelclassslothour,
		    classmaxdays = client_classmaxdays,
			gapbetweentwogymaccessslot = client_gapbetweentwogymaccessslot,
            shifttiming = client_shifttiming
			where id = branch_id;

       else

		   update branch set
			modifiedbyid = user_id,
            modifiedbydate = now(),
			starttime = client_starttime,
			endtime = client_endtime,
            starttime1 = client_starttime1,
            endtime1 = client_endtime1,
			timing = client_schedule,
            gymaccessslot = client_gymaccessslot,
			slotduration = client_slotduration,
			slotmaxoccupancy = client_slotmaxoccupancy,
			slotmaxdays = client_slotmaxdays,
			ptslotdetail = client_ptslotdetail,
            cancelgymaccessslothour = client_cancelgymaccessslothour,
            cancelptslothour = client_cancelptslothour,
            cancelclassslothour = client_cancelclassslothour,
		    classmaxdays = client_classmaxdays,
			gapbetweentwogymaccessslot = client_gapbetweentwogymaccessslot,
			shifttiming = client_shifttiming
			where id = branch_id;

	   end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientSignupEstablishmentInfo` (IN `clientregistrationrequest_email` VARCHAR(100), IN `clientregistrationrequest_clienttype` VARCHAR(50), IN `clientregistrationrequest_organizationtype` VARCHAR(100), IN `clientregistrationrequest_hasmultiplebranch` BOOLEAN, IN `clientregistrationrequest_branchscope` VARCHAR(50), IN `clientregistrationrequest_numberofbranch` INT, IN `clientregistrationrequest_professionaltype` VARCHAR(50))  BEGIN
		update client set
			clienttype = clientregistrationrequest_clienttype,
            organizationtype=clientregistrationrequest_organizationtype,
			ishavemutliplebranch=clientregistrationrequest_hasmultiplebranch,
			branchscope=clientregistrationrequest_branchscope,
			numberofbranch=clientregistrationrequest_numberofbranch,
            professionaltype = clientregistrationrequest_professionaltype
			where useremail=clientregistrationrequest_email;
            select 1 'Result';
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientSignupOrganizationInfo` (IN `clientregistrationrequest_email` VARCHAR(100), IN `clientregistrationrequest_organizationname` VARCHAR(50), IN `clientregistrationrequest_firstname` VARCHAR(50), IN `clientregistrationrequest_lastname` VARCHAR(50), IN `clientregistrationrequest_mobile` VARCHAR(20))  BEGIN

				update client set
				organizationname=clientregistrationrequest_organizationname,
				mobile=clientregistrationrequest_mobile,
                firstname=clientregistrationrequest_firstname,
                lastname=clientregistrationrequest_lastname
				where useremail=clientregistrationrequest_email;
				select 1 'Result';
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientSignupRequest` (IN `clientregistrationrequest_email` VARCHAR(100), IN `clientregistrationrequest_password` VARCHAR(100), IN `clientregistrationrequest_verificationcode` VARCHAR(10), IN `clientregistrationrequest_expirydate` DATETIME)  BEGIN

DECLARE isExitClient int DEFAULT 0;
DECLARE redirect_uri varchar(50);

SELECT count(1),redirecturi into isExitClient, redirect_uri FROM client where useremail=clientregistrationrequest_email and deleted = 0 limit 1 ;

	IF isExitClient = 0  || (isExitClient > 0  && redirect_uri is null) then
		insert into clientregistrationrequest (email,password,verificationcode,isused,expirydate) values (clientregistrationrequest_email,clientregistrationrequest_password,clientregistrationrequest_verificationcode,0 , clientregistrationrequest_expirydate);
	else
		Call `ERROR`('Email address is already register.');
	END if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientSignupURLCreation` (IN `clientregistrationrequest_email` VARCHAR(100), IN `clientregistrationrequest_url` VARCHAR(50), IN `clientregisteredstaff_firstname` VARCHAR(100), IN `clientregisteredstaff_lastname` VARCHAR(100), IN `clientregisteredstaff_userid` VARCHAR(100), IN `clientregisteredstaff_password` VARCHAR(300), IN `clientregisteredstaff_officialmobile` VARCHAR(20), IN `clientregistrationrequest_organizationname` VARCHAR(50), IN `clientregistrationrequest_address1` VARCHAR(100), IN `clientregistrationrequest_address2` VARCHAR(100), IN `clientregistrationrequest_city` VARCHAR(50), IN `clientregistrationrequest_state` VARCHAR(50), IN `clientregistrationrequest_country` VARCHAR(50), IN `clientregistrationrequest_pincode` INTEGER(10), IN `clientregistrationrequest_gmapaddress` VARCHAR(500), IN `clientregistrationrequest_latitude` VARCHAR(100), IN `clientregistrationrequest_longitude` VARCHAR(100), IN `clientregistrationrequest_ptslotdetail` LONGTEXT, IN `clientregistrationrequest_timezone` VARCHAR(20), IN `clientregistrationrequest_packtype` VARCHAR(50))  BEGIN

DECLARE isExistURL,isExistEmail,user_id,branch_id int DEFAULT 0;

DECLARE client_id,client_typeId int;
DECLARE sqlcode CHAR(5) DEFAULT '00000';
DECLARE msg TEXT;

DECLARE stateID int DEFAULT NULL;
DECLARE countryID varchar(2) DEFAULT NULL;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1
			sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
			ROLLBACK;
			if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else
				 Call `ERROR`('Internal Server Error');
             end if;
		END;


	if clientregistrationrequest_country != '' && clientregistrationrequest_country is not null then
		select code into countryID from country where name = clientregistrationrequest_country;

		if countryID is null then
			Call `ERROR` ('Please enter valid country.');
		end if;
	end if;

	if clientregistrationrequest_state != '' && clientregistrationrequest_state is not null then
		select id, country_code into stateID, countryID from state where name = clientregistrationrequest_state and (country_code = countryID or countryID is null);

		if stateID is null then
			Call `ERROR` ('Please enter valid State/Region.');
		end if;
	end if;

SELECT count(1) into isExistURL FROM client where redirecturi=clientregistrationrequest_url;

		if isExistURL = 0 then

         START TRANSACTION;

				update client set
				redirecturi=LOWER(clientregistrationrequest_url),
                clientcode = LOWER(clientregistrationrequest_url)
				where useremail=clientregistrationrequest_email;

                select id,(clienttype+0) into client_id ,client_typeId
                from client where useremail=clientregistrationrequest_email;

                SELECT count(1) into isExistEmail FROM user where emailid = clientregisteredstaff_userid and deleted = 0 and clientid = client_id;

				if isExistEmail > 0
				then
					Call `ERROR` ('Email-Id/User Name Already exists.');
				end if;

				insert into branch(branchname,address1,address2,phone,city,state,country,gmapaddress,
                pincode,createdbyid,createdbydate,clientid,isdefault,latitude,longitude,
                ptslotdetail,classmaxdays,packtype)
				values(clientregistrationrequest_organizationname,clientregistrationrequest_address1,
                clientregistrationrequest_address2,clientregisteredstaff_officialmobile,clientregistrationrequest_city,
                stateID,countryID,clientregistrationrequest_gmapaddress,
                clientregistrationrequest_pincode,user_id,now(),client_id,'1',clientregistrationrequest_latitude,
                clientregistrationrequest_longitude,clientregistrationrequest_ptslotdetail,7,
                clientregistrationrequest_packtype);

                SELECT LAST_INSERT_ID() into branch_id;

                insert into user(firstname,lastname,employeecode ,emailid ,password,gender,assignrole,mobile,panno,
                clientid,isowner,ismembermobilevisible,ismemberemailidvisible,isenquirymobilevisible,isenquiryemailidvisible,
                createdbydate, defaultbranchid,enablecomplimentarysale,enablediscount,timezoneoffsetvalue)
                values(
				clientregisteredstaff_firstname, clientregisteredstaff_lastname , getSequence('employee' , client_id) ,
                clientregisteredstaff_userid , clientregisteredstaff_password , '1' ,(case when client_typeId = 2 then '90' else '1' end) ,
                clientregisteredstaff_officialmobile ,'',client_id,'1','1','1','1','1',now(), branch_id,'1','1',
                clientregistrationrequest_timezone);

                SELECT LAST_INSERT_ID() into user_id;

                update branch set
				createdbyid = user_id,
				createdbydate = now()
				where id = branch_id;

                select client_id as id;
	     COMMIT;
		  SET @flag = 1;
		else
				Call `ERROR`('Web address already exists.');
		end if;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientSignupVerification` (IN `clientregistrationrequest_email` VARCHAR(100), IN `clientregistrationrequest_password` VARCHAR(100), IN `clientregistrationrequest_verificationcode` VARCHAR(10))  BEGIN

DECLARE isExistClient int DEFAULT 0;

SELECT count(1) into isExistClient FROM clientregistrationrequest where email=clientregistrationrequest_email AND verificationcode=clientregistrationrequest_verificationcode AND isused=0 AND now() < expirydate;

	if isExistClient = 1 then
		if (select 1=1 from client where useremail=clientregistrationrequest_email and deleted = 0) then
			update client set
					password=clientregistrationrequest_password
					where useremail=clientregistrationrequest_email and deleted = 0;
             update clientregistrationrequest set
					isused=1
					where verificationcode=clientregistrationrequest_verificationcode and email = clientregistrationrequest_email;
		else

		insert into client(useremail,password) values(clientregistrationrequest_email,clientregistrationrequest_password);
		end if;
	else
		Call `ERROR`('Please enter valid code.');
    end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientsocialmediasave` (IN `client_id` INT, IN `client_socialmedia` LONGTEXT)  BEGIN

	update client set
		socialmedia=client_socialmedia
		where id =client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclienttaxconfigurationsave` (IN `client_id` INT, IN `client_istaxenable` INT, IN `client_taxtype` VARCHAR(20), IN `client_gstin` VARCHAR(20), IN `client_printtype` VARCHAR(20), IN `client_discounttype` VARCHAR(20), IN `client_termsconditions` VARCHAR(14000), IN `cient_footermessage` VARCHAR(4000), IN `client_signimage` VARCHAR(200), IN `client_cardswipe` LONGTEXT, IN `client_termconditiontype` VARCHAR(20), IN `client_isshowpaymentdetailingstinvoice` INT, IN `client_showbenefitininvoice` INT)  BEGIN
			update client set
			istaxenable = client_istaxenable,
            taxtype = client_taxtype,
            gstin = client_gstin,
            printtype = client_printtype,
            discounttype = client_discounttype,
            termsconditions = client_termsconditions,
            footermessge = cient_footermessage,
            signimage = client_signimage,
			cardswipe = client_cardswipe,
            termsconditionstype = client_termconditiontype,
            isshowpaymentdetailingstinvoice = client_isshowpaymentdetailingstinvoice,
            showbenefitininvoice = client_showbenefitininvoice
			where id=client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPclientview` (IN `client_id` INT, IN `branch_id` INT)  BEGIN

	select cl.id,organizationname,useremail ,mobile,ishavemutliplebranch,
	logo,tagline,sidebarimage,memberprofilecoverimage,signinbackgroundimage,
	cl.clienttype, (cl.clienttype + 0) clienttypeId,
	cl.socialmedia,cl.paymentgateway ,cl.singninfontportrait,cl.singninfontlandscap,
	cl.istaxenable,cl.taxtype,(cl.taxtype + 0) taxtypeId,cl.gstin,cl.printtype, (cl.printtype + 0) printtypeId
	,cl.discounttype,(cl.discounttype + 0) discounttypeId,
	cl.footermessge,cl.termsconditions,cl.signimage,cl.invoicebannerimage,
	(cl.professionaltype + 0) professionaltypeId,biometric,
	JSON_UNQUOTE(JSON_EXTRACT(cl.disclaimer,CONCAT('$.isdisclaimerenabled')))  enabledisclaimertomember,
	ifnull(JSON_UNQUOTE(JSON_EXTRACT(cl.covid19disclaimer,CONCAT('$.iscovid19memberdisclaimerenabled'))) , 0)  enablecovid19disclaimertomember,
	ifnull(JSON_UNQUOTE(JSON_EXTRACT(cl.covid19disclaimer,CONCAT('$.iscovid19staffdisclaimerenabled'))) , 0) enablecovid19disclaimertostaff,
	JSON_UNQUOTE(JSON_EXTRACT(cl.covid19disclaimer,CONCAT('$.covid19daysconfig'))) covid19daysconfig,
	cl.smsgateway,cl.emailgateway,cl.isinbody,geofencing,
	hidememberbalanceandtransactions,(serviceprovided+0) serviceprovidedId,
	cl.cardswipe,cl.membercanbookpt,cl.termsconditionstype, (cl.termsconditionstype + 0)
    termsconditionstypeId,cl.isshowpaymentdetailingstinvoice,cl.showbenefitininvoice,
    cl.salesbasedonrepresentative
	from client cl
	where cl.id= client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbackcommentssave` (IN `feedback_id` INT, IN `feedback_comments` VARCHAR(1000), IN `feedback_commentdate` DATETIME, IN `user_id` INT, IN `member_id` INT)  BEGIN

    insert into feedbackcomment(feedbackid,userid,memberid,comment,commentdate) values(
	feedback_id , user_id, member_id,feedback_comments,feedback_commentdate);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbackdelete` (IN `feedback_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN
update feedback set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where id=feedback_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbacklist` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length, user_id, branch_id, _isfpl,
    _activeTab INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _id, _where, _value, _orderby, _limit, _table,isExpressSale,login_type,month_filter,year_filter,
    client_offsetvalue varchar(500);
	DECLARE _columns varchar(1000);
    DECLARE IsDesc TINYINT(1);
    DECLARE _isgeneralfeedback TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.loginType'),JSON_EXTRACT(tableInfo,'$.userId'),
    JSON_EXTRACT(tableInfo,'$.isgeneralfeedback'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.isfpl'),JSON_EXTRACT(tableInfo,'$.activeTab'),
    JSON_EXTRACT(tableInfo,'$.month'),JSON_EXTRACT(tableInfo,'$.year'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,login_type,user_id,_isgeneralfeedback,branch_id,_isfpl,
    _activeTab,month_filter,year_filter,client_offsetvalue;

	set login_type = REPLACE(login_type,'"','');
    set month_filter = REPLACE(month_filter,'"','');
	set _offset = pageIndex * pageSize;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

    if _isgeneralfeedback = 0 then
		set _columns = concat(' fb.id,fb.clientid,idea,(idea+0) ideaId,averagerating,equipmentrating,facilitiesrating,
			feedbackstatus,(feedbackstatus + 0)feedbackstatusId,trainerrating,viberating,valueformoneyrating,
            description,concat(firstname,'' '',lastname) ''name'',(gender+0)genderId,image,images,fb.createdbydate,
            (select organizationname from client where id = fb.clientid)clientname');
		set _table = ' from feedback fb';
		set _where = concat(' where fb.deleted = 0');
		if (login_type = 'u' ) then
				set _table = concat(_table , ' inner join user on fb.createdbyid = user.id ');
				set _columns = concat(_columns , ' , (case when user.id then 1 else 0 end)isstaff , user.id ''userid'' ');
				set _where = concat(_where , ' and fb.clientid = ', client_id ,' and logintype  = ''u''
				and userid = ' , user_id);
		elseif (login_type = 'm' ) then
				set _table = concat(_table , ' inner join member on fb.createdbyid = member.id');
				set _columns = concat(_columns , ' , (case when member.id then 0 else 1 end)isstaff , member.id ''memberid'' ');
				set _where = concat(_where , ' and fb.clientid = ', client_id ,' and logintype  = ''m''
				and memberid = ' , user_id);
	    end if;
    else
		set _columns = concat(' fb.id,fb.clientid,idea,(idea+0) ideaId,averagerating,equipmentrating,facilitiesrating,
        feedbackstatus,(feedbackstatus + 0)feedbackstatusId,trainerrating,viberating,valueformoneyrating,description,
        case when user.id then concat(user.firstname,'' '',user.lastname) else concat(member.firstname,'' '',member.lastname) end ''name'',
        case when user.id then (user.gender+0) else (member.gender+0) end ''genderId'',
        images,fb.createdbydate,(case when user.id then 1 else 0 end)isstaff,
        (case when user.id then user.id else null end)userid , (case when member.id then member.id else null end)memberid,
        (select organizationname from client where id = fb.clientid)clientname');
		set _table = ' from feedback fb';
		set _where = concat(' where fb.deleted = 0');

		set _table = concat(_table , '
        left outer join user on fb.createdbyid = user.id && fb.memberid is null
		left outer join member on fb.createdbyid = member.id && fb.userid is null');
		set _where = concat(_where , ' and  case when ', client_id ,' > 1 then (fb.clientid = ', client_id , ' and
		(case when ' , _isfpl , ' = 0 then fb.branchid = ' , branch_id , ' else 1=1 end)) else 1=1 end ');

    end if;

    if _activeTab = 0  && month_filter > 0 && year_filter > 0 then
		set _where = concat(_where , ' and month(getDateFromUTC(fb.createdbydate,''', client_offsetvalue ,''',-1)) = ' , month_filter , ' and
		year(getDateFromUTC(fb.createdbydate,''', client_offsetvalue ,''',-1)) = ' , year_filter);
    elseif _activeTab = 1 && year_filter > 0 then
        set _where = concat(_where , ' and year(getDateFromUTC(fb.createdbydate,''', client_offsetvalue ,''',-1)) = ' , year_filter);
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' then
		  if _id = 'feedbackfor' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
          elseif _id= 'idea' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' in (', _value , ')'));
		  elseif _id= 'feedbackstatus' then
				set _where = CONCAT(_where , CONCAT(' and (case when idea = 5 then 1=1 else ', _id , ' in (', _value , ') end)'));
             else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
          end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by fb.id desc ';
    end if;

	set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	 set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	 PREPARE stmt FROM @_qry;
	 EXECUTE stmt;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbacksave` (IN `feedback_idea` VARCHAR(30), IN `feedback_description` VARCHAR(600), IN `user_id` INT, IN `client_id` INT, IN `login_type` VARCHAR(2), IN `feedback_for` VARCHAR(10), IN `feedback_averageratings` DECIMAL(2,1), IN `feedback_equipmentratings` DECIMAL(2,1), IN `feedback_facilitiesratings` DECIMAL(2,1), IN `feedback_trainerratings` DECIMAL(2,1), IN `feedback_viberatings` DECIMAL(2,1), IN `feedback_valueformoneyratings` DECIMAL(2,1), IN `member_id` INT, IN `feedback_status` VARCHAR(20), IN `feedback_createdbyid` INT, IN `feedback_images` LONGTEXT, IN `feedback_branchid` INT)  BEGIN

	insert into feedback(idea,description,createdbyid,createdbydate,logintype,clientid,userid,memberid,
	feedbackfor,averagerating,equipmentrating,facilitiesrating,trainerrating,viberating,valueformoneyrating,
    feedbackstatus,images,branchid) values(
	feedback_idea , feedback_description, feedback_createdbyid,now(),login_type,client_id,user_id,member_id,
	feedback_for,feedback_averageratings,feedback_equipmentratings,feedback_facilitiesratings,
    feedback_trainerratings,feedback_viberatings,feedback_valueformoneyratings,feedback_status,feedback_images,feedback_branchid);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbackstatussave` (IN `feedback_id` INT, IN `feedback_status` VARCHAR(20))  BEGIN

   update feedback set feedbackstatus = feedback_status where id = feedback_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPfeedbackview` (IN `feedback_id` INT, IN `client_id` INT)  BEGIN

			select fb.id,idea,description,
            (select  JSON_ARRAYAGG(json_object('id',fc.id,'comment',comment,'name',
            case when user.id then concat(user.firstname,' ',user.lastname) else concat(member.firstname,' ',member.lastname) end,
            'date',commentdate ))
            from feedbackcomment fc
            left outer join member on fc.memberid = member.id && fc.userid is null
            left outer join user on fc.userid = user.id && fc.memberid is null
			where fc.feedbackid = feedback_id )comments
		    from feedback fb
			where (case when client_id > 1 then fb.clientid = client_id else 1=1 end) and fb.deleted = 0 and  fb.id = feedback_id
			order by fb.id desc limit 1;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamebookticketsave` (IN `product_id` INT, IN `product_gameid` INT, IN `product_ticketid` INT, `product_customer` VARCHAR(250), `product_createdbyid` INT, IN `client_id` INT)  BEGIN
DECLARE isExit,i,_length,_gameid int DEFAULT 0;
declare _customer varchar(250);
select customer into _customer from gametickets where id = product_id and gameid = product_gameid and ticketid = product_ticketid
and salesbyid != product_createdbyid;

if _customer is not null then
	call ERROR(Concat('Ticket is already sales to another customer'));
end if;

update gametickets set customer = product_customer, salesbyid = product_createdbyid,
salesbydate = now()   where id = product_id and gameid = product_gameid and ticketid = product_ticketid;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamebookticketsearch` (IN `product_createdbyid` INT, IN `client_id` INT)  BEGIN

    declare _gameid, _salescount int;
    declare _launchdate datetime;
    declare _drawsequence text;

    select g.id,g.launchdate,g.drawsequence,
    (select count(1) from gametickets where gameid = g.id and salesbyid = product_createdbyid)
    into _gameid,_launchdate,_drawsequence,_salescount
    from game g where g.status = 1 order by g.id desc limit 1;

    select  _gameid id,_launchdate launchdate,_drawsequence drawsequence, _salescount salescount;
    select id,gameid,ticketid,customer from gametickets where gameid = _gameid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamedelete` (IN `product_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN

  DECLARE isExit int DEFAULT 0;
  declare _launchdate	 datetime;

select launchdate into _launchdate from game where id=product_id;

if date(_launchdate) >= date(now()) then
	Call `ERROR` ('Game can\'t be deleted.');
end if;

update game set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where id=product_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamemysalessearch` (IN `client_id` INT, IN `user_id` INT)  BEGIN

declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

select ticketid, customer from gametickets where gameid = _gameid and salesbyid = user_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamepageview` (IN `client_id` INT)  BEGIN
    declare _gameid int;
    declare _launchdate datetime;
    declare _drawsequence,_called_numbers text;
        declare _winners longtext;

    select id,launchdate,drawsequence,called_numbers,winners
    into _gameid,_launchdate,_drawsequence,_called_numbers,_winners
    from game where status = 1 and deleted = 0 order by id desc limit 1;

    select  _gameid id,_launchdate launchdate,_drawsequence drawsequence, _called_numbers called_numbers,_winners winners;
    select * from gametickets where gameid = _gameid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamesave` (IN `product_id` INT, `product_status` VARCHAR(10), `product_createdbyid` INT, IN `client_id` INT, `product_launchdate` DATETIME, `product_drawsequence` LONGTEXT, `product_tickets` LONGTEXT, `product_winners` LONGTEXT, `product_called_numbers` TEXT)  BEGIN
DECLARE isExit,i,_length,_gameid int DEFAULT 0;

if product_id = 0 then

		insert into game(createdbyid,status,launchdate,createdbydate,clientid,drawsequence, winners, called_numbers)
		values(product_createdbyid,product_status,product_launchdate,now(), client_id,product_drawsequence, product_winners, product_called_numbers);

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
    modifiedbydate=now()
    where id =product_id and clientid=client_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamesearch` (IN `tableInfo` JSON)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj  JSON;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX,client_offsetvalue varchar(800);
    DECLARE IsDesc bool;
	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid,client_offsetvalue;
	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);
	set _columns = concat('d.id,d.launchdate,
    d.status,(d.status+0)  as statusId ');
    set _table = ' from game d
  ';
   set _where = concat(' where d.deleted = 0 and d.clientid = ', client_id );

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' then
		  if _id= 'status' then
                set _where = CONCAT(_where , CONCAT(' and d.status = ', _value));
           else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));

            end if;
          end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by d.id desc';
    end if;

			set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		 set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgamestaffwisesales` (IN `client_id` INT)  BEGIN

	declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

     select count(1) salescount, concat(u.firstname, ' ', u.lastname) staffname, salesbyid from gametickets gt
    inner join user u on gt.salesbyid  = u.id where gt.gameid = _gameid group by u.id ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgameview` (IN `service_id` INT, IN `client_id` INT)  BEGIN
    select * from game where id = service_id ;
    select * from gametickets where gameid = service_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgetbodymeasurement` (IN `member_id` INT, IN `client_id` INT)  BEGIN

select m.id,m.measurementdate,m.measurementdata,
m.advancemeasurementdata
from measurement m
inner join member ref_ma on m.memberid = ref_ma.id
where m.memberid=member_id and ref_ma.clientid = client_id and m.deleted = 0
and m.Isgoal = 0
order by measurementdate desc ,m.createdbydate desc ;


select m.id,m.measurementdate,m.measurementdata,
m.advancemeasurementdata
from measurement m
inner join member ref_ma on m.memberid = ref_ma.id
where m.memberid=member_id and ref_ma.clientid = client_id and m.deleted = 0
and m.Isgoal = 1
order by measurementdate desc,m.createdbydate desc  ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgetclasscancel` (IN `_weekstart` DATE, IN `_weekend` DATE, IN `branch_id` INT, IN `activity_type` INT)  BEGIN

	  select id, classid, classdate
      from classcancel c
      where branchid = branch_id and c.deleted = 0 and activitytype = activity_type and
      (date(c.classdate) BETWEEN date(_weekstart) AND date(_weekend));

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgetclassonlineaccessurl` (IN `client_id` INT, IN `_weekstart` DATE, IN `_weekend` DATE, IN `branch_id` INT)  BEGIN

      select id,onlineclassurl, classdate, classid, savedingooglecalendar, googlecalendareventid
      from onlineclassaccessurl mc
      where branchid = branch_id and
      (date(mc.classdate) BETWEEN date(_weekstart) AND date(_weekend));

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgetmemberbalance` (IN `client_id` INT, IN `member_id` INT)  BEGIN

	select balance from member where id = member_id and clientid = client_id and deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgetuserforgetpassword` (IN `client_id` VARCHAR(50), IN `client_emailid` VARCHAR(50), IN `login_type` INT)  BEGIN

   DECLARE userpassword varchar(50);
   DECLARE isExistUser int DEFAULT 0;

if login_type = 0 then

		SELECT count(1), u.password into isExistUser,userpassword from user u
		left outer join client c on u.clientid = c.id
		where u.emailid=TRIM(client_emailid) and c.redirecturi=client_id and u.deleted=0 and c.deleted=0
        group by u.password ;

		if isExistUser = 1 then
			select userpassword;
		else
			Call `ERROR`('Email Address not valid.');
		end if;

	else

		SELECT count(1),ifnull(m.password,m.mobile)
        into isExistUser,userpassword from member m
		left outer join client c on m.clientid = c.id
		where m.personalemailid=TRIM(client_emailid) and c.redirecturi=client_id and
        m.deleted=0 and c.deleted=0
		group by ifnull(m.password,m.mobile)
        limit 1 ;

		if isExistUser = 1 then
			select userpassword;
		else
			Call `ERROR`('Email Address not valid.');
		end if;

	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgymruledelete` (IN `rule_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN

	update gymrules set
	deleted=1, modifiedbyid = user_id, modifiedbydate = now()
	where id=rule_id and clientid = client_id ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgymrulelibrary` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace  INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,rulename';
    set _table = ' from gymrules ';
    set _where = concat(' where deleted = 0 and clientid = 1');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'rulename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

		 if _value != ''  then

				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;

           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);


	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgymrulesave` (IN `rule_id` INT, IN `rule_name` VARCHAR(1000), IN `client_id` INT, IN `createdby_id` INT)  BEGIN

   if rule_id = 0 then

		insert into gymrules(rulename,createdbyid,createdbydate,clientid)
        values(rule_name,createdby_id,now(),client_id);


  elseif rule_id > 0 then

		update gymrules set
		rulename=rule_name ,
        modifiedbyid = createdby_id ,
        modifiedbydate = now()
		where id =rule_id and clientid=client_id;
  end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPgymrulesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace  INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,rulename';
    set _table = ' from gymrules ';
    set _where = concat(' where deleted = 0 and clientid = ', client_id);

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'rulename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

		 if _value != ''  then

				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;

           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);


	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPholidaysdelete` (IN `holidays_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
		update holidays set
		deleted = 1,
        modifiedbyid = user_id,
		modifiedbydate=now()

		where id = holidays_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPholidayssave` (IN `holidays_id` INT, IN `holidays_holidayname` VARCHAR(100), IN `holidays_holidaydate` DATE, IN `user_id` INT, IN `client_id` INT, IN `holidays_repeatdate` TINYINT(1))  BEGIN

	if holidays_id = 0 then
         insert into holidays(holidayname,holidaydate,clientid,createdbyid,
        createdbydate,repeatdate)
        values(holidays_holidayname,date(holidays_holidaydate),client_id,user_id,now(),holidays_repeatdate);

     elseif holidays_id > 0 then

		update holidays set
        holidayname = holidays_holidayname,
        holidaydate = date(holidays_holidaydate),
	    modifiedbyid = user_id,
		modifiedbydate = now(),
        repeatdate = holidays_repeatdate
		where id = holidays_id and clientid=client_id;
end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPholidayssearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_year INT;
    DECLARE filtered, sorted , obj , date LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.year'),JSON_EXTRACT(tableInfo,'$.exportXLSX')
    into pageSize, pageIndex, client_id, filtered, sorted,_year,exportXLSX;

	set _offset = pageIndex * pageSize;

	set _columns = 'id,holidayname,holidaydate,(case when repeatdate = 1 then ''Yes'' else ''No'' end)repeatdate' ;
    set _table = ' from holidays ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id ,' and  case when repeatdate = 0 then year(holidaydate) = ', _year ,' else 1=1 end');
SET i = 0;

    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' and _value != 'null' then

			if _id= 'holidaydate' then
				set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
		elseif _id= 'holidayname' then
               set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
		elseif _id= 'repeatdate' then
                 if _value = 1 then
						set _where = concat(_where , ' and repeatdate = 1 ');
				 elseif _value = 2 then
					 set _where = concat(_where , '  and repeatdate = 0');
                end if;
		else
		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by createdbydate desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

		  PREPARE stmt FROM @_qry;
		  EXECUTE stmt;
		  DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPholidaysview` (IN `holidays_id` INT, IN `client_id` INT)  BEGIN

select h.id,h.holidayname,h.holidaydate,h.repeatdate
from holidays h
where h.id=holidays_id and h.clientid = client_id and h.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinbodyuserfullbodydataget` (IN `member_id` INT, IN `datetime` VARCHAR(1000))  BEGIN
     set @_qry = concat('select inbodydate from inbodyuserfullbodydata
      where memberid = ' , member_id , ' and inbodydate in( ' , datetime , ')');

	PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinbodyuserfullbodydatasave` (IN `member_id` INT, IN `inbody_fullbodydata` LONGTEXT, IN `inbody_date` DATETIME, IN `_inbodydate` VARCHAR(20), IN `inbody_createdfrom` VARCHAR(10), IN `inbody_createdbyid` INT, IN `client_id` INT)  BEGIN
DECLARE isExist int default 0;
DECLARE _Weight,_Height,_BMI,_PBF,_TBW,_BMR,_VFL,_SMM varchar(100);
DECLARE measurement_data,advancemeasurement_data LONGTEXT;

	select count(1),measurementdata,advancemeasurementdata into isExist,measurement_data,advancemeasurement_data from measurement where measurementdate = date(inbody_date)
	and memberid = member_id and deleted = 0 group by id ;

	insert into inbodyuserfullbodydata(memberid,fullbodydata,date,inbodydate,createdbyid,createdbydate,clientid)
	values(member_id,inbody_fullbodydata,inbody_date,_inbodydate,inbody_createdbyid,now(),client_id);

    select JSON_EXTRACT(inbody_fullbodydata,'$.Weight'),
    JSON_EXTRACT(inbody_fullbodydata,'$.Height'),
    JSON_EXTRACT(inbody_fullbodydata,"$.""BMI(BodyMassIndex)"""),
    JSON_EXTRACT(inbody_fullbodydata,"$.""PBF(PercentBodyFat)"""),
	JSON_EXTRACT(inbody_fullbodydata,"$.""TBW(TotalBodyWater)"""),
    JSON_EXTRACT(inbody_fullbodydata,"$.""BMR(BasalMetabolicRate)"""),
	JSON_EXTRACT(inbody_fullbodydata,"$.""VFL(VisceralFatLevel)"""),
	JSON_EXTRACT(inbody_fullbodydata,"$.""SMM(SkeletalMuscleMass)""")
    into _Weight, _Height, _BMI,_PBF,_TBW, _BMR,_VFL,_SMM;


	set _Weight = REPLACE(_Weight,'"','');
	set _Height = REPLACE(_Height,'"','');
	set _BMI = REPLACE(_BMI,'"','');
	set _PBF = REPLACE(_PBF,'"','');
	set _TBW = REPLACE(_TBW,'"','');
 	set _BMR = REPLACE(_BMR,'"','');
	set _VFL = REPLACE(_VFL,'"','');
	set _SMM = REPLACE(_SMM,'"','');

	 if isExist = 0 then

	   set  measurement_data =  JSON_OBJECT( 'weight', _Weight,'height', _Height);

       set advancemeasurement_data =  JSON_OBJECT('bmi', _BMI,'water', _TBW,'bodyfat', _PBF,
       'basalmetaboism', _BMR, 'bonemass', _SMM, 'visceralfat', _VFL);

		insert into measurement(memberid,measurementdate,measurementdata,
	    advancemeasurementdata,createdbyid,createdbydate,createdfrom,Isgoal)
		values(member_id,date(inbody_date),measurement_data,advancemeasurement_data,
		inbody_createdbyid,now(),inbody_createdfrom,0);

        update member set
			last_measurementdate =inbody_date,
			measurementdata = measurement_data,
			advancemeasurementdata = advancemeasurement_data,
			modifiedbyid = inbody_createdbyid,
			modifiedbydate= now()
			where id = member_id;

    else

      select JSON_SET(measurement_data, '$.weight', _Weight,'$.height', _Height)
      into measurement_data;

	  select JSON_SET(advancemeasurement_data, '$.bmi', _BMI,'$.water', _TBW,'$.bodyfat', _PBF,
	  '$.basalmetaboism', _BMR, '$.bonemass', _SMM, '$.visceralfat', _VFL) into advancemeasurement_data;

        update measurement set
			  measurementdata = measurement_data,
			  advancemeasurementdata = advancemeasurement_data,
			  modifiedbyid = inbody_createdbyid,
			  modifiedbydate = now()
			  where memberid = member_id and measurementdate = date(inbody_date);


			update member set
			last_measurementdate =inbody_date,
			measurementdata = measurement_data,
			advancemeasurementdata = advancemeasurement_data,
			modifiedbyid = inbody_createdbyid,
			modifiedbydate= now()
			where id = member_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinbodyusersave` (IN `member_id` INT, IN `inbody_data` LONGTEXT, IN `inbody_createdbyid` INT, IN `client_id` INT)  BEGIN
declare _memberid int;

select memberid into _memberid from inbodyuser where memberid = member_id;

if _memberid is null then

    insert into inbodyuser(memberid,inbodydata,createdbyid,createdbydate,clientid)
    values(member_id,inbody_data,inbody_createdbyid,now(),client_id);

else
    update inbodyuser set inbodydata = inbody_data;
end if;

    select ifnull(_memberid,member_id)  as memberid;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinductionchecklistmembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_activitycheckerlabel,
    _activitycheckervalue,_salesrepresentative INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _id, _value, _orderby, _limit, _table,_branchid,
    client_offsetvalue,_istrainer varchar(500);
	DECLARE _columns,_where varchar(1500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.activitycheckervalue'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.activitycheckerlabel'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue'),
    JSON_EXTRACT(tableInfo,'$.salesrepresentative')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,_activitycheckervalue,enddate,
    _activitycheckerlabel,_branchid,client_offsetvalue,_salesrepresentative;


	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = concat(' m.id,m.image,memberprofileimage,m.personalemailid,m.mobile,
		m.firstname,m.lastname ,m.status,(m.status + 0) statusId,m.gender, (m.gender + 0)
        genderId,membercode,m.createdbydate,concat(ref_u.firstname,'' '',ref_u.lastname) as
        salesby,ref_u.id as salesbyId,m.activity,
        (select JSON_EXTRACT(ac,''$.trainername'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
		JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '" and  JSON_EXTRACT(ac,''$.trainer'') = true) trainername,
		(select JSON_EXTRACT(ac,''$.dateconformbytrainer'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
		JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '" and  JSON_EXTRACT(ac,''$.trainer'') = true) dateconformbytrainer');

     set _table = ' from member m
     left outer join user ref_u ON m.salesbyid = ref_u.id';

     set _where = concat(' where m.deleted = 0 and m.clientid = ', client_id , ' and
	(case when m.enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

    if _activitycheckerlabel is not null and _activitycheckerlabel != 0 and _activitycheckervalue != 0 then
		if _activitycheckervalue = 1 then
					set _where = concat(_where , ' and (select JSON_EXTRACT(ac,''$.value'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
					JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '" and  JSON_EXTRACT(ac,''$.trainer'') = true)');
		 elseif _activitycheckervalue = 2 then
				set _where = concat(_where , ' and (activity is null or  (
			   ((select JSON_EXTRACT(ac,''$.trainer'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
			  JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '") != true)
			  or ((select JSON_EXTRACT(ac,''$.trainer'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
			 JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '") is null)
			 )) ');
		 end if;
  end if;

    if startDate != 'null' and endDate != 'null' then
  			set _where = concat(_where , ' and date(getDateFromUTC(m.createdbydate,''',client_offsetvalue,''',-1))  BETWEEN date(',startdate,') AND date(',enddate,')');
    end if;

    if _salesrepresentative != 0 and _salesrepresentative is not null then
      			set _where = concat(_where , ' and ref_u.id = ' , _salesrepresentative );
    end if;


SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
         if _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname) ', ' like ''%', _value ,'%'''));
		 elseif  _id = 'createdbydate' then
				set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(m.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id = 'membercode' or _id = 'personalemailid' then
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' like ''%', _value ,'%'''));
		elseif _id = 'maxexpirydate' then
				set _where = CONCAT(_where , CONCAT(' and m.id in (select member from subscription where date(expirydatesubscription) =  date(''',getDateFromUTC(_value,'+00:00',0), ''') )'));
		elseif _id= 'salesby' then
			      set _where = CONCAT(_where , CONCAT(' and ref_u.id =', _value ,' '));
		elseif _id= 'trainername' then
			      set _where = CONCAT(_where , CONCAT(' and  (select JSON_EXTRACT(ac,''$.trainerid'') FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
		         JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '" and  JSON_EXTRACT(ac,''$.trainer'') = true) = ', _value ,' '));
        elseif  _id = 'dateconformbytrainer' then
				set _where = CONCAT(_where , CONCAT(' and (select date(getDateFromUTC(REPLACE(JSON_EXTRACT(ac,''$.dateconformbytrainer''),''"'',''''),''',client_offsetvalue,''',-1))
                FROM JSON_TABLE(activity,"$[*]" COLUMNS( ac LONGTEXT PATH "$" )) tt where
		         JSON_EXTRACT(ac,''$.value'') = "', _activitycheckerlabel , '" and  JSON_EXTRACT(ac,''$.trainer'') = true) = date(''',_value, ''')'));
       else
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' like ''', _value ,'%'''));
        end if;
        end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvestmentdelete` (IN `investment_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
		update investment set
		deleted=1,
        modifiedbyid = user_id,
		modifiedbydate=now()
		where id=investment_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvestmentsave` (IN `investment_id` INT, IN `investment_title` VARCHAR(100), IN `investment_category` VARCHAR(100), IN `investment_amount` DECIMAL(12,2), IN `investment_date` DATE, IN `investment_remark` VARCHAR(500), IN `investment_paymentmode` VARCHAR(20), IN `investment_chequeno` VARCHAR(20), IN `investment_chequedate` DATE, IN `investment_bankname` VARCHAR(45), IN `investment_status` VARCHAR(20), IN `equipmentinvoice_id` INT, IN `investment_referenceid` VARCHAR(50), IN `user_id` INT, IN `client_id` INT, IN `investment_branchid` INT)  BEGIN

		insert into investment(title,category,amount ,paymentdate,clientid,createdbyid,
        createdbydate,remark,paymentmode,chequeno,chequedate,bankname,status,
        equipmentinvoiceid,referenceid,branchid)
        values(investment_title , investment_category, investment_amount,investment_date,
		 client_id,user_id,now(),investment_remark,investment_paymentmode,investment_chequeno,
         investment_chequedate,investment_bankname,investment_status,equipmentinvoice_id,investment_referenceid,
         investment_branchid);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvestmentsearch` (IN `tableInfo` LONGTEXT)  BEGIN

 	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
     DECLARE filtered, sorted , obj , startdate,enddate LONGTEXT;
     DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX varchar(500);
     DECLARE IsDesc TINYINT(1);

 	select JSON_EXTRACT(tableInfo,'$.pageSize'),
     JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
     JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
 	JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.endDate'),
     JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid')
     into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,_branchid;

 	set _offset = pageIndex * pageSize;

 	set _columns = 'i.id,i.title,i.category,i.amount,i.paymentdate,i.paymentmode,i.chequeno,
 					i.chequedate,i.bankname,i.status,concat(invoicenumber,'' ('',purchasedate,'')'')  as equipmentinvoicename';
     set _table = ' from investment i
                   left outer join equipmentpurchase es on i.equipmentinvoiceid = es.id ';
      if(exportXLSX = 'true') then
 			set _where = concat(' where date(paymentdate) BETWEEN date(',startdate,') AND date(',enddate,')
 					and i.deleted = 0 and i.clientid = ', client_id , ' and i.branchid = ' , _branchid);

 	else
 		set _where = concat(' where i.deleted = 0 and i.clientid = ', client_id , ' and i.branchid = ' , _branchid);
  end if;
 SET i = 0;

     SET _length = JSON_LENGTH(filtered);
     WHILE  i < _length DO
 		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
         select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

         set _id = REPLACE(_id,'"','');
         set _value = REPLACE(_value,'"','');

         if _value != '' and _value != 'null' then
 			if _id = 'category' then
 				set _where = CONCAT(_where , CONCAT(' and i.category = ', _value));
 			elseif _id= 'paymentdate' then
				set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
            elseif _id = 'equipmentinvoicename' then
 			      set _where = CONCAT(_where , CONCAT(' and concat(invoicenumber,'' ('',purchasedate,'')'') like ''%', _value ,'%'''));
            else
 				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
             end if;
         end if;

 		SET  i = i + 1;
 	END WHILE;


 	SET _orderby = '';
 	SET i = 0;
     SET _length = JSON_LENGTH(sorted);
     WHILE  i < _length DO
 		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
         select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

         set _id = REPLACE(_id,'"','');

 		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

 		SET  i = i + 1;
 	END WHILE;

 	if _orderby != '' then
 		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
     else
 		set _orderby = ' order by i.paymentdate desc ';
     end if;

     set _limit = concat(' limit ', pageSize ,' offset ', _offset);
 	if(exportXLSX = 'true') then
 			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
    else
 		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
 	end if;

 	 PREPARE stmt FROM @_qry;
      EXECUTE stmt ;
 	 DEALLOCATE PREPARE stmt;
     if(exportXLSX is null or exportXLSX != 'true') then
 		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

 		  PREPARE stmt FROM @_qry;
 		  EXECUTE stmt;
 		  DEALLOCATE PREPARE stmt;
 	end if;

 END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvestmentview` (IN `investment_id` INT, IN `client_id` INT)  BEGIN
	 select i.id,i.title,i.category, (i.category + 0) categoryId,i.amount,i.paymentdate,i.remark,
     i.paymentmode,i.chequeno,i.chequedate,i.bankname,i.status,i.referenceid,
	 i.equipmentinvoiceid,concat(invoicenumber,' (',purchasedate,')')  as equipmentinvoicename
	 from investment i
	  left outer join equipmentpurchase es on i.equipmentinvoiceid = es.id
	 where i.id=investment_id and i.clientid = client_id and i.deleted=0;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvoicesave` (IN `invoice_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN

update invoice set
        taxinvoicecode= getTaxInvoicenumber('taxinvoice', client_id),
        modifiedbyid = user_id,
        modifiedbydate = now()
		where id = invoice_id and clientid=client_id;

select taxinvoicecode from invoice where id = invoice_id and clientid=client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvoicesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, member_id,_offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table,
    client_offsetvalue varchar(500);
    DECLARE _columns varchar(1000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.memberId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, member_id, filtered,sorted, client_offsetvalue;

	set _offset = pageIndex * pageSize;

    	set _columns = ' i.id,i.createdbydate,taxinvoicecode,invoicecode,creditforinvoiceid,
    (select sum(baseprice + ifnull(taxamount,0)) from
    invoiceitem where invoiceid = i.id) totalamount,case when creditforinvoiceid then "Credit Note"
    else "Invoice" end type,(select sum(ref_i.amount - ref_i.paymentamount) from installment ref_i
    where i.id = ref_i.invoiceid and installmentstatus != 2)dues,i.date,concat(u.firstname,'' '',u.lastname) name,
    case when i.taxinvoicecode then "Yes" else "No" end istaxinvoice , concat(s.firstname,'' '',s.lastname) salesby ';

    set _table = ' from invoice i
                        LEFT OUTER JOIN user u ON i.createdbyid = u.id
                        LEFT OUTER JOIN user s ON i.salesbyid = s.id ';
	set _where = concat(' where i.clientid = ', client_id , ' and memberid = ', member_id );

	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;
        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null'  then
		if _id = 'createdbydate' then
				set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(i.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id= 'name' then
				set _where = CONCAT(_where , CONCAT(' and concat(u.firstname,'' '',u.lastname) like ''%', _value ,'%'''));
		elseif _id = 'date' then
				set _where = CONCAT(_where , CONCAT(' and date(i.', _id , ') = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
        elseif _id = 'invoicecode' or _id = 'taxinvoicecode' then
				 set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
        else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc';
    end if;

    set _limit = concat(' limit ', pageSize,' offset ', _offset );

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit);

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPinvoiceview` (IN `invoice_id` INT, IN `client_id` INT)  BEGIN

select i.id,concat(m.firstname, ' ' , m.lastname) as membername,m.id as memberid,m.mobile,m.gstin,
m.address1,m.address2,m.city,m.pincode,s.name 'state',c.name 'country',s.state_code,s.state_number,
date(i.date) date,taxinvoicecode,invoicecode,creditforinvoiceid,
(select json_object('branchname',b.branchname,'address1',b.address1,'address2',b.address2,'pincode',pincode,
'branchphoneno',b.phone ,'city',b.city,'state',s.name,'country',c.name)
from branch b left outer join country c on b.country = c.code
left outer join state s on b.state = s.id where b.id = i.branchid ) 'branchdetails',
(select JSON_ARRAYAGG(json_object('invoiceitemid',it.id,'itemname',
case when it.productsaleid is not null then it.itemname else
concat(it.itemname , ' ( ' , DATE_FORMAT(ifnull(sh.startdate,ifnull(s.startdate,null)), "%b %d, %Y") , ' to ' ,
DATE_FORMAT(ifnull(sh.expirydatesubscription,ifnull(s.expirydatesubscription,null)), "%b %d, %Y") ,
' )' , case when s.renew_type = 3 or sh.renew_type = 3 then ' (Upgrade Service)' else '' end) end,
'discount',it.discount,'taxamount',taxamount,'quantity',
case when p.quantity then p.quantity else 1 end,'total',ifnull(sh.amount,ifnull(s.amount,p.amount)),
'taxname',ref_t.taxname,'taxpercentage',ref_t.percentage,'taxgroupitem',ref_t.taxgroupitem,'baseprice',it.baseprice,'costprice',
ifnull(sh.costprice,ifnull(s.costprice,ifnull(p.costprice, 0))),'isService',
case  when subscriptionid != '' and subscriptionid != 'null' then 1 else 0 end,'taxcode',ref_ts.taxcode,'renewtype',
ifnull(sh.renew_type,ifnull(s.renew_type,ifnull(p.renew_type, 0))),'renewtypeId',
ifnull(sh.renew_type + 0,ifnull(s.renew_type + 0,ifnull(p.renew_type + 0, 0))), 'packagename',ref_p.packagename))
from invoiceitem  it
left outer join subscription s on it.subscriptionid = s.id
left outer join subscriptionhistory sh on it.subscriptionid = sh.id
left outer join productsale p on it.productsaleid = p.id
left outer join taxcodecategory ref_ts on it.taxcategoryid = ref_ts.id
left outer join tax ref_t on ref_ts.taxgroupid = ref_t.id
left outer join package ref_p on  ref_p.id = s.packageid
where  it.invoiceid = invoice_id) 'invoiceitem',
(select JSON_ARRAYAGG(json_object('paymentamount',ref_p.paymentamount,'paymentmode',ref_p.paymentmode,
'paymentmodeid',(ref_p.paymentmode+0),'chequeno',ref_p.chequeno,'chequedate',ref_p.chequedate,'paymentstatus',
ref_p.status,'referenceid',ref_p.referenceid,'paymentstatusid',(ref_p.status+0),'cardswipecharge', ref_p.cardswipecharge))
from payment ref_p where ref_p.paymentreceiptcode = i.invoicecode and !(ref_p.status = 3 or ref_p.status = 4 )) 'paymentdetails',
i.totaldues,concat(u.firstname, ' ' , u.lastname) as salesby ,m.membercode,m.personalemailid
from invoice i
inner join member m on i.memberid = m.id
left outer join country c on m.country = c.code
left outer join state s on m.state = s.id
left outer join user u on i.salesbyid = u.id
where i.id= invoice_id and i.clientid = client_id ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlinkpaycompletesave` (IN `payment_requestnumber` VARCHAR(20), IN `payment_transactionid` VARCHAR(200), IN `payment_banktransactionid` VARCHAR(100), IN `payment_otherparameter` LONGTEXT, IN `paymnet_status` VARCHAR(200), IN `is_payment` VARCHAR(5))  BEGIN
DECLARE _id,isExist  INT;
DECLARE _status varchar(50);

	SELECT status+0 into isExist FROM onlinepayment where requestnumber = payment_requestnumber ;

	if isExist != 1 then

		Call `ERROR` ('Transaction already processed.Please try again');

    end if;

		update linkpay set
		transactionid=payment_transactionid,
		banktransactionid=payment_banktransactionid,
		otherparameter= case when payment_otherparameter is not null then payment_otherparameter else otherparameter end,
		status = paymnet_status,
		ispayment = is_payment
		where requestnumber=payment_requestnumber;


	select id into _id from linkpay where requestnumber = payment_requestnumber;

    select  paymentdetail,id,ispurchase,purchasedetail from linkpay where id = _id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlinkpayFailsave` (IN `payment_requestnumber` VARCHAR(20), IN `payment_transactionid` VARCHAR(200), IN `payment_banktransactionid` VARCHAR(100), IN `payment_otherparameter` LONGTEXT, IN `paymnet_status` VARCHAR(200), IN `is_payment` VARCHAR(5))  BEGIN
DECLARE _id  INT;

	update linkpay set
	transactionid=payment_transactionid,
	banktransactionid=payment_banktransactionid,
	otherparameter= case when payment_otherparameter is not null then payment_otherparameter else otherparameter end,
    status = paymnet_status,
    ispayment = is_payment
   	where requestnumber=payment_requestnumber;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlinkpayinitsave` (IN `user_id` INT, IN `client_id` INT, IN `payment_amount` INT, IN `payment_detail` LONGTEXT, IN `payment_url` VARCHAR(200), IN `branch_id` INT, IN `is_purchase` TINYINT(1), IN `member_id` INT, IN `paymentgatewayurl` VARCHAR(100), IN `payment_gatewaydetail` LONGTEXT)  BEGIN

DECLARE _id,i, j, _length,isExitMemberMembership,isExitonceinlifetime,
parallelplanId,onceinlifetimeplanId,isExitparallelplanId,isExitonceinlifetimeplanId,_cartid INT;
DECLARE _membercode, _customerid,_servicetypeid,_startdate,_sessiontype,_activitytypeid varchar(100);
DECLARE _cart,obj LONGTEXT;
DECLARE _maxactivationdate date DEFAULT NULL ;

select JSON_EXTRACT(payment_detail,'$.cart')  into _cart;

START TRANSACTION;
if  _cart is not null then
 SET i = 0;
 SET _length = JSON_LENGTH(_cart);

      WHILE  i < _length DO
	  SELECT JSON_EXTRACT(_cart,CONCAT('$[',i,']')) into obj;

	 select JSON_EXTRACT(obj, '$.servicetypeId'),JSON_EXTRACT(obj, '$.startDate'),
			JSON_EXTRACT(obj, '$.activitytypeId'),JSON_EXTRACT(obj, '$.brand'),
			JSON_EXTRACT(obj, '$.objectID')
			into _servicetypeid,_startdate,_activitytypeid,_sessiontype,_cartid;

	 set _servicetypeid = REPLACE(_servicetypeid,'"','');
	 set _startdate = REPLACE(_startdate,'"','');
	 set _activitytypeid = REPLACE(_activitytypeid,'"','');
	set _sessiontype = REPLACE(_sessiontype,'"','');

if _servicetypeid = 1 then

	 select count(1) into isExitMemberMembership from  subscription s
	 left outer join service on s.serviceplan = service.id where member = member_id
	 and service.servicetype = cast(_servicetypeid as unsigned);

	  if isExitMemberMembership > 1 then
				Call `ERROR` ('Do not allow more than one future plan.');
	  end if;

	 elseif _servicetypeid = 2 then

		if(_activitytypeid = 1) then

            select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = member_id
			and service.servicetype = cast(_servicetypeid as unsigned)
            and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
		end if;

		if(_activitytypeid = 2) then

			select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = member_id
			and service.servicetype = cast(_servicetypeid as unsigned)
			and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
	    end if;
	end if;


		if _servicetypeid = 1 then
							set _startdate = getdateFromJSON(_startdate);

							select max(expirydatesubscription) into _maxactivationdate from subscription s
							left outer join service on s.serviceplan = service.id where member = member_id and service.servicetype = cast(_servicetypeid as unsigned);

							if _maxactivationdate >= date(_startdate) then
								Call `ERROR`(concat('Membership is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
							end if;

		elseif _servicetypeid = 2 then
							set _startdate = getdateFromJSON(_startdate);

							if(_activitytypeid = 1) then

								select max(expirydatesubscription) into _maxactivationdate from subscription s
								left outer join service on s.serviceplan = service.id where member = member_id and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

								if _maxactivationdate >= date(_startdate) then
									Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
								end if;
						end if;

	          if(_activitytypeid = 2) then

								select max(expirydatesubscription) into _maxactivationdate from subscription s
								left outer join service on s.serviceplan = service.id where member = member_id and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

								if _maxactivationdate >= date(_startdate) then
									Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
								end if;
	       end if;
	end if;


	select count(1) into isExitonceinlifetime from  subscription s
	left outer join service on s.serviceplan = service.id where member = member_id
	and service.enablesaleonceinlifetime = 1 and  service.id = _cartid;

					  if isExitonceinlifetime > 0 then
								Call `ERROR` ('This service has already been purchased by you.');
					  end if;


				    select parallelplan into parallelplanId from service
                     where service.id = _cartid and service.enablesaleonceinlifetime = 1;

                    select count(1) into isExitparallelplanId from subscription
				    where member = member_id  and serviceplan = parallelplanId;

                     if isExitparallelplanId > 0 then
								Call `ERROR` ('You are not eligible to purchase this series.');
					  end if;

	SET  i = i + 1;
	END WHILE;
end if;

     select membercode into _membercode from member where id = member_id;
	 set _customerid = concat(_membercode,'@',client_id);

	insert into linkpay(requestnumber,customerid,
    createdbyid,createdbydate,memberid,paymentamount,paymentdetail,url,branchid,status,
    ispurchase,expirydate,paymentgateway_url,paymentgatewaydetail)
    values(getSequence('paymentRqNo' , '1'),_customerid,
    user_id,now(),member_id,payment_amount,payment_detail,payment_url,branch_id,1,
    is_purchase,DATE_ADD(now(), INTERVAL 24 HOUR),paymentgatewayurl,payment_gatewaydetail);

	set  _id = LAST_INSERT_ID();

    select paymentdetail,paymentamount,requestnumber,customerid,url,ispurchase,purchasedetail,
    createdbydate,expirydate,paymentgateway_url,paymentgatewaydetail from linkpay where id = _id;

COMMIT;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlinkpaypaymengatewayview` (IN `paymnet_requestnumber` VARCHAR(100))  BEGIN

 select paymentgatewaydetail,url from  linkpay
 where requestnumber = paymnet_requestnumber ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistbasicquestion` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace,_questiontype INT;
    DECLARE filtered, sorted ,obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.questionType'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize,_questiontype,pageIndex, client_id, filtered, sorted ;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,questiontype,question,questionoption';
    set _table = ' from questions ';
	set _where = concat(' where deleted = 0 and questiontype = ', _questiontype , ' and (clientid = ', client_id ,' or clientid = 1)');


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
        SET _totalspace = 0;
        if _id = 'question' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;
		if _value != '' then
				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;
        end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted , id desc ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );
	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistbiometric` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE client_id, i, _length , _branchid INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
	JSON_EXTRACT(tableInfo,'$.branchid')
    into client_id, filtered , _branchid;

	set _columns = ' b.id,biometricname,serialnumber ';
    set _table = ' from biometric b';
	set _where = concat(' where  b.deleted = 0 and status = 1 and b.clientid = ', client_id , ' and b.branchid = ', _branchid);


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistbranch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length , ismembershared INT;
    DECLARE filtered, obj , branch_list LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table,zone_id,member_id varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.zoneId'),
    JSON_EXTRACT(tableInfo,'$.memberId')
    into client_id, filtered,zone_id,member_id;

    if zone_id is not null then

	   select JSON_UNQUOTE(branchlist) into branch_list from zone where id = zone_id ;

       set _columns = ' b.id,concat(b.branchname)  label ,isdefault';
       set _table = ' from branch b';
	   set _where = concat(' where b.deleted = 0 and b.clientid = ', client_id , ' and
       id in (SELECT * FROM JSON_TABLE(''' , case when branch_list is not null then branch_list else '[]' end , ''' ,"$[*]"
	   COLUMNS( ac VARCHAR(100) PATH "$" ))tt) and
       date(now()) between date(b.activationdate) and date(b.expirydate)');

    elseif member_id > 0 then

	   select JSON_UNQUOTE(branchid),enablesharetootherbranches into branch_list,ismembershared
       from member where id = member_id ;

       set _columns = ' b.id,concat(b.branchname)  label ,isdefault';
       set _table = ' from branch b';
	   set _where = concat(' where b.deleted = 0 and b.clientid = ', client_id , ' and
       (case when ', ismembershared , ' = 0 then
       id in (SELECT * FROM JSON_TABLE(''' , case when branch_list is not null then branch_list else '[]' end , ''' ,"$[*]"
	   COLUMNS( ac VARCHAR(100) PATH "$" ))tt) else 1=1 end) and
       date(now()) between date(b.activationdate) and date(b.expirydate)');

    else

		set _columns = ' b.id,concat(b.branchname)  label ,isdefault ';
		set _table = ' from branch b';
		set _where = concat(' where b.deleted = 0 and b.clientid = ', client_id ,
        ' and date(now()) between date(b.activationdate) and date(b.expirydate) ');

    end if;

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistbudget` (IN `tableInfo` LONGTEXT)  BEGIN


	DECLARE client_id, i, _length , _branchid INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table, client_offsetvalue varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into client_id, filtered , _branchid , client_offsetvalue;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = 'id, budgetperiod,(budgetperiod + 0) budgetperiodId,startDate,
	endDate,month,budgettype,totalbudget';
    set _table = ' from budget ';
	set _where = concat(' where deleted = 0 and startDate <= date(getDateFromUTC(now(),''', client_offsetvalue ,''',-1)) and branchid = ', _branchid , ' and clientid = ', client_id);

		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' then
			if _id = 'serviceType' then
				set _where = CONCAT(_where , CONCAT(' and measurementunit = ', _value));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistclassbookingandinterested` (IN `tableInfo` LONGTEXT)  BEGIN

    DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid , _classid INT;
    DECLARE filtered, sorted ,obj,classdate,starttime  LONGTEXT;
    DECLARE _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(500);
    DECLARE _columns varchar(700);
    DECLARE IsDesc TINYINT(1);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.classdate'),
    JSON_EXTRACT(tableInfo,'$.classid'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize,pageIndex, client_id, filtered, sorted,classdate,_classid,_branchid,client_offsetvalue ;

	set _offset = pageIndex * pageSize;
	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = ' mc.id,date(mc.startdatetime) as date,(ROW_NUMBER() OVER (
		ORDER BY mc.createdbydate asc
	)) as srno,
     concat( m.firstname,'' '',m.lastname) membername,image,
                    gender,(gender + 0) genderId,memberprofileimage,membercode,
                    last_covid19submitdate,covidrisk,(covidrisk + 0) covidriskId,
                    m.status,(m.status + 0) statusId,mc.classid,mc.attendeddate,
                    mc.isofflinebooking,mc.memberid,m.mobile,m.personalemailid,
                    (case when mc.isbooked = 1 then ''Booked'' when mc.isinterested = 1 then ''Interested'' else ''None'' end)classstatus , mc.createdbydate ';
    set _table = ' from memberclassbooking mc
      inner join member m on mc.memberid = m.id ';
	set _where = concat(' where mc.deleted = 0 and m.clientid = ' , client_id , ' and
    date(getDateFromUTC(mc.startdatetime,''', client_offsetvalue ,''',-1)) = date(',classdate,') and classid = ' , _classid ,
	' and mc.branchid = ' , _branchid);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

	if _value != '' and _value != 'null' then

        if _id = 'membername' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
        elseif _id = 'membercode' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
        elseif  _id = 'last_covid19submitdate' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id = 'covidrisk' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		elseif  _id = 'createdbydate' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(mc.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
         elseif _id = 'classstatus' then
				set _where = CONCAT(_where , CONCAT(' and case when ', _value , ' = 1 then mc.isbooked = 1 when ', _value , ' = 2 then mc.isinterested = 1 else 1=1 end'));
        end if;
		end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by mc.createdbydate asc ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistclient` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length    INT;
    DECLARE filtered, obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered')
    into client_id, filtered;

	set _columns = ' id,organizationname as  label ';
	set _table = ' from client ';
	set _where = concat(' where deleted = 0 ');

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		SET  i = i + 1;
	END WHILE;


	set @_qry = CONCAT('select ' , _columns, _table ,_where , " order by id asc " );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistdealtype` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE client_id, i, _length  INT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId')  into client_id ;

	set _columns = ' s.id value, s.dealtypename label';
    set _table = ' from dealtype s';
	set _where = concat(' where  s.deleted = 0 and s.status = 1 and s.clientid = ', client_id );

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistdietnotallocatedmember` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,is_eggfille,is_nonveg,_totalspace,_branchid INT;
    DECLARE filtered, sorted ,obj,_date,startdate,enddate LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table varchar(500);
	DECLARE _columns varchar(800);
    DECLARE IsDesc TINYINT(1);

    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.date'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate')
    into pageSize,pageIndex, client_id, filtered, sorted,_date,_branchid ,startdate,enddate;

	set _offset = pageIndex * pageSize;

	set _columns = 'm.id,concat(m.firstname,'' '',m.lastname) as name,membercode,a.dateonWards,a.tilltodate';
    set _table = ' from member m
                 left outer join allocatediet a ON m.id = a.memberid';
	set _where = concat(' where m.deleted = 0  and m.clientid = ', client_id , ' and
    (case when enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)' );

       if _date is not null then
       			set _where = concat(_where , ' and (a.id is not null and not (date(a.dateonWards) > date(' ,_date , ') ))');
       elseif  startdate and enddate is not null then
			set _where = concat(_where , ' and a.id is not null and (date(a.tilltodate) BETWEEN date(',startdate,') AND date(',enddate,'))');
       else
       			set _where = concat(_where , ' and a.id is null ');
       end if;
	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			  if _id = 'name' then
					set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname)  ', ' like ''%', _value ,'%'''));
			   elseif _id = 'membercode' then
				     set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
             elseif _id= 'dateonWards' or _id= 'tilltodate' then
			      set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
             else
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
			 end if;
		end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);
	PREPARE stmt FROM @_qry;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistdietroutine` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,is_eggfille,is_nonveg INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

    select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.Iseggfille'),JSON_EXTRACT(tableInfo,'$.Isnonveg')
    into pageSize, pageIndex, client_id, filtered, sorted,is_eggfille,is_nonveg;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,routinename as label ,isnonveg,(isnonveg+0)isnonvegId,
    iseggfille,(iseggfille+0)iseggfilleId';
    set _table = ' from dietroutine ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id ,
    ' and isnonveg = ' ,is_nonveg , ' and iseggfille = ' ,is_eggfille );

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
	if _value != '' then
    			set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted , routinename asc';
    end if;

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby);
	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistexercise` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace,_userId,_memberId INT;
    DECLARE filtered, sorted , obj, _exerciselist LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,workout_category varchar(5000);
    DECLARE IsDesc,_isFavorite TINYINT(1);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.workoutcategory'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.userId'),JSON_EXTRACT(tableInfo,'$.memberId'),
	JSON_EXTRACT(tableInfo,'$.isFavorite')
    into pageSize,workout_category, pageIndex, client_id, filtered, sorted,_userId,_memberId,_isFavorite ;

	set _offset = pageIndex * pageSize;
	set workout_category = REPLACE(workout_category,'"','');

    if _userId = 0 and _isFavorite = 1 then
			select exerciselist into _exerciselist from favoriteexercise
			where  memberid = _memberId  and clientid = client_id ;
	elseif _memberId = 0 and _isFavorite = 1 then
		 select exerciselist into _exerciselist from favoriteexercise
		 where userid = _userId and clientid = client_id;
 	end if;

	set _columns = ' id,exercisename,workoutcategory,recordtype,(recordtype + 0)recordtypeId';
    set _table = ' from exercise ';

	set _where = concat(' where deleted = 0 and (clientid = ', client_id ,' or clientid = 1)');
        if workout_category > 0 then
        	set _where = concat( _where ,' and workoutcategory = ' ,workout_category , ' ' );
		end if;
   if _isFavorite =  1  then
           	set _where = concat( _where ,' and id in  (SELECT * FROM JSON_TABLE( ''' ,case when _exerciselist is not null then _exerciselist else '[]' end , ''' ,"$[*]" COLUMNS( ac VARCHAR(100) PATH "$" )) AS tt) ' , ' ' );
   end if;

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         SET _totalspace = 0;
        if _id = 'exercisename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;
		if _value != '' then
				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;
        end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted, exercisename ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistfreeserviceformembersignup` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table,client_code varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered')
    into client_code, filtered;

	set client_code = REPLACE(client_code,'"','');

    select id into client_id from client where clientcode = client_code;

	set _columns = ' id,concat(servicename,'' - '',durationcount, '' '' ,duration) label ,durationcount,duration,price,servicename';
    set _table = ' from service ';
	set _where = concat(' where deleted = 0 and status = 1 and
    enablesaleonceinlifetime = 1 and iscomplimentaryservice = 1 and clientid = ', client_id);


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' then
			if _id = 'serviceType' then
				set _where = CONCAT(_where , CONCAT(' and measurementunit = ', _value));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistgymaccessslot` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid,_memberid,_todaybookedslot,_bookingstatus INT;
    DECLARE filtered, sorted ,obj,startdate,starttime,enddate  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.date'),
    JSON_EXTRACT(tableInfo,'$.startTime'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.memberId'),
	JSON_EXTRACT(tableInfo,'$.todaybookedslot'),JSON_EXTRACT(tableInfo,'$.bookingstatus'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize,pageIndex, client_id, filtered, sorted,startdate,starttime,_branchid ,
    enddate,_memberid,_todaybookedslot,_bookingstatus,client_offsetvalue;

	set _offset = pageIndex * pageSize;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = 'mg.id,concat(m.firstname,'' '',m.lastname) membername,m.image,
                    m.gender,(m.gender + 0) genderId,m.status,(m.status + 0) statusId ,lastcheckin,last_covid19submitdate,
                    covidrisk,(covidrisk + 0) covidriskId,memberprofileimage,membercode,branchname,mg.memberid,
                    mg.attendeddate,1 as isgymaccessslot , m.mobile,m.personalemailid,mg.deleted ,
                    mg.startdatetime,mg.enddatetime';
    set _table = ' from membergymaccessslot mg
      inner join member m on mg.memberid = m.id
      inner join branch b on mg.branchid = b.id';
	set _where = concat(' where m.clientid = ' , client_id );

	if _bookingstatus = 1 then
 			set _where = concat(_where , ' and mg.deleted = 0 ');
    elseif _bookingstatus = 2 then
   			set _where = concat(_where , ' and mg.deleted = 1 ');
    end if;

    if starttime != 'null' and starttime != '' then
   			set _where = concat(_where , ' and date(getDateFromUTC(mg.startdatetime,''', client_offsetvalue ,''',-1)) = date(',startdate,')
            and time(getDateFromUTC(mg.startdatetime,''', client_offsetvalue ,''',-1)) = time(',starttime,')
            and mg.branchid = ' , _branchid);

    end if;
    if _memberid != 'null' and _memberid != '' then
   			set _where = concat(_where , ' and mg.memberid = ' , _memberid);
    end if;
    if enddate != 'null' and enddate != '' then
   			set _where = concat(_where , ' and date(getDateFromUTC(mg.startdatetime,''', client_offsetvalue ,''',-1)) >= date(',startdate,')');
    end if;
    if _todaybookedslot = 1 then
      			set _where = concat(_where , ' and date(getDateFromUTC(mg.startdatetime,''', client_offsetvalue ,''',-1)) = date(',startdate,')');
    end if;

   SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

	if _value != '' and _value != 'null' then

        if _id = 'membername' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
		elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
		elseif _id = 'covidrisk' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		elseif _id= 'startdatetime' then
			      set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
        end if;
		end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by startdatetime asc ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistgymrules` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace INT;
    DECLARE filtered, sorted ,obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize,pageIndex, client_id, filtered, sorted ;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,rulename';
    set _table = ' from gymrules ';
	set _where = concat(' where deleted = 0 and (clientid = ', client_id ,' or clientid = 1)');


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
        SET _totalspace = 0;
        if _id = 'rulename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;
		if _value != '' then
				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;
        end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted , id desc ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );
	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistholiday` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length,branch_id,_slotmaxdays INT;
    DECLARE filtered, obj ,startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.startDate'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.endDate')
    into client_id, filtered,startdate,branch_id,enddate;

	set _columns = ' id,holidaydate ,repeatdate';
    set _table = ' from holidays ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id ,
    ' and  case when  repeatdate = 1 then CONCAT(DATE_FORMAT(now(), ''%Y''),''-'',DATE_FORMAT(holidaydate,''%m''),''-'',
      DATE_FORMAT(holidaydate,''%d'')) BETWEEN
      date(getDateFromJSON(',startdate,')) AND date(getDateFromJSON(',enddate,'))  else date(holidaydate) BETWEEN
      date(getDateFromJSON(',startdate,')) AND date(getDateFromJSON(',enddate,')) end');

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistnotallocatedmember` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,is_eggfille,is_nonveg,_totalspace,_branchid INT;
    DECLARE filtered, sorted ,obj,_date,startdate,enddate LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table varchar(500);
	DECLARE _columns varchar(800);
    DECLARE IsDesc TINYINT(1);

    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.date'),
	JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate')
    into pageSize,pageIndex, client_id, filtered, sorted,_date,_branchid,startdate,enddate ;

	set _offset = pageIndex * pageSize;

	set _columns = 'm.id,concat(m.firstname,'' '',m.lastname) as name,membercode,w.dateonWards,w.tilltodate';
    set _table = ' from member m
                 left outer join workoutschedule w ON m.id = w.memberid';
	set _where = concat(' where m.deleted = 0  and m.clientid = ', client_id , ' and
    (case when enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)' );

       if _date is not null then
       			set _where = concat(_where , ' and ( w.id is not null and not (date(w.dateonWards) > date(' ,_date , ') ))');
	   elseif  startdate and enddate is not null then
			set _where = concat(_where , ' and w.id is not null and (date(w.tilltodate) BETWEEN date(',startdate,') AND date(',enddate,'))');
       else
       			set _where = concat(_where , ' and w.id is null ');
       end if;
	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			  if _id = 'name' then
					set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname)  ', ' like ''%', _value ,'%'''));
			   elseif _id = 'membercode' then
				     set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
             elseif _id= 'dateonWards' or _id= 'tilltodate' then
			      set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
             else
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
			 end if;
		end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	PREPARE stmt FROM @_qry;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistnottakenmeasurement` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,is_eggfille,is_nonveg,_totalspace INT;
    DECLARE filtered, sorted ,obj,_date LONGTEXT;
    DECLARE  _where, _id, _value, _orderby, _limit, _table , _branchid varchar(500);
	DECLARE _columns varchar(800);
    DECLARE IsDesc TINYINT(1);
    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.date'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize,pageIndex, client_id, filtered, sorted,_date , _branchid ;

	set _offset = pageIndex * pageSize;

	set _columns = 'm.id,concat(m.firstname,'' '',m.lastname) as name,membercode,ref_m.measurementdate';
    set _table = ' from member m
                 left outer join measurement ref_m ON m.id = ref_m.memberid';
	set _where = concat(' where m.deleted = 0  and m.clientid = ', client_id , ' and
		(case when enablesharetootherbranches = 0 then json_search(m.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

       if _date is not null then
       			set _where = concat(_where , ' and  ref_m.id is not null and ( not (ref_m.measurementdate > date(getDateFromJSON( ' ,_date , ')) ))');
       else
       			set _where = concat(_where , ' and ref_m.id is null ');
       end if;
	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			  if _id = 'name' then
					set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname)  ', ' like ''%', _value ,'%'''));
			   elseif _id = 'membercode' then
				     set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
             elseif _id= 'measurementdate' then
			      set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromJSON(_value), ''')'));
             else
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
			 end if;
		end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	PREPARE stmt FROM @_qry;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistptslot` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid,
    _staffid,_memberid,_logintype,_todaybookedslot INT;
    DECLARE filtered, sorted ,obj,startdate,_starttime,enddate  LONGTEXT;
    DECLARE _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(600);
    DECLARE IsDesc TINYINT(1);
    DECLARE _columns varchar(1000);


    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.pageIndex'),
    JSON_EXTRACT(tableInfo,'$.clientId'),JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.sorted'),JSON_EXTRACT(tableInfo,'$.date'),
    JSON_EXTRACT(tableInfo,'$.startTime'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.staffid'),JSON_EXTRACT(tableInfo,'$.memberid'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.logintype'),
    JSON_EXTRACT(tableInfo,'$.todaybookedslot'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize,pageIndex, client_id, filtered, sorted,startdate,_starttime,_branchid,
    _staffid,_memberid,enddate,_logintype,_todaybookedslot,client_offsetvalue  ;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = concat('mp.id,startdatetime,enddatetime,concat(m.firstname,'' '',m.lastname) membername,m.image,
                    m.gender,(m.gender + 0) genderId,m.status,(m.status + 0) statusId ,m.lastcheckin,m.last_covid19submitdate,
                    m.covidrisk,(m.covidrisk + 0) covidriskId,m.memberprofileimage,m.membercode,sb.sessioncount,consumedsession,
                    (select count(1) from memberptslot where date(startdatetime) > date(getDateFromUTC(now(),''', client_offsetvalue ,''',-1))) advancedbokked,m.id as memberid,
                    concat(u.firstname,'' '',u.lastname) trainername,mp.staffid,mp.pttype,
                    servicename,mp.onlineaccessurl,mp.notefornxtsession,(mp.pttype + 0) pttypeId, 1 as isptslot,
                    m.mobile,m.personalemailid,u.image as trainerimage,mp.sessiontype ');
    set _table = ' from memberptslot mp
      inner join member m on mp.memberid = m.id
      inner join user u on mp.staffid = u.id
      inner join subscription sb on mp.subscriptionid = sb.id
	  inner join service s on mp.serviceid = s.id ';
	set _where = concat(' where mp.deleted = 0 and m.clientid = ' , client_id );

    if _memberid is not null and _memberid != 0 and _memberid != '' then
			set _where = concat(_where , ' and memberid = ' , _memberid );
   end if;
   if _starttime != 'null' and _starttime != '' then
   			set _where = concat(_where , ' and time(getDateFromUTC(mp.startdatetime,''', client_offsetvalue ,''',-1)) = ' , _starttime,' and date(getDateFromUTC(startdatetime,''', client_offsetvalue ,''',-1)) = date(',startdate,') and mp.branchid = ' , _branchid);
   end if;
   if _staffid is not null and _staffid != 0 and _staffid != '' then
   			set _where = concat(_where , ' and staffid = ' , _staffid);
   end if;
   if enddate != 'null' and enddate != '' then
   			set _where = concat(_where , ' and date(getDateFromUTC(mp.startdatetime,''', client_offsetvalue ,''',-1)) >= date(',startdate,')');
   end if;
   if _logintype = 0 then
      			set _where = concat(_where , ' and mp.branchid = ' , _branchid);
   end if;
    if _todaybookedslot = 1 then
      			set _where = concat(_where , ' and date(getDateFromUTC(mp.startdatetime,''', client_offsetvalue ,''',-1)) = date(',startdate,')');
   end if;
	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

	if _value != '' and _value != 'null' then

          if _id = 'membername' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(m.firstname,'' '',m.lastname) ', ' like ''%', _value ,'%'''));
		  elseif _id = 'startdatetime'   then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
          elseif _id = 'covidrisk' then
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' = ', _value));
	      elseif _id = 'trainername' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(u.firstname,'' '',u.lastname) ', ' like ''%', _value ,'%'''));
         elseif _id = 'sessiontype' then
				set _where = CONCAT(_where , CONCAT(' and mp.', _id , ' = ', _value));
	     elseif _id = 'starttime'  then
				 set _where = CONCAT(_where , CONCAT(' and TIME_FORMAT(', _id , ' ,'' %H %i'') = TIME_FORMAT(''',getTimeFromJSON(_value), ''' ,'' %H %i'' )'));
	    elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
	   elseif _id = 'lastcheckin' or _id = 'last_covid19submitdate'  then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(m.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
      elseif _id = 'pttype' then
				set _where = CONCAT(_where , CONCAT(' and mp.', _id , ' = ', _value));

   end if;
		end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by startdatetime asc ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistrecipe` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,is_eggfille,is_nonveg,_totalspace,
    recipe_group,is_customrecipe INT;
    DECLARE filtered, sorted ,obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

    select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.Iseggfille'),
    JSON_EXTRACT(tableInfo,'$.Isnonveg'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.recipegroup'),JSON_EXTRACT(tableInfo,'$.Iscustomrecipe')
    into pageSize,is_eggfille,is_nonveg,pageIndex, client_id, filtered, sorted , recipe_group , is_customrecipe;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,recipename,nutrition';
    set _table = ' from recipe ';
	set _where = concat(' where deleted = 0 and (clientid = ', client_id ,' or clientid = 1)');

  if is_nonveg != '' then
          	set _where = concat(_where , ' and isnonveg = ' ,is_nonveg);
  end if;
  if is_eggfille != '' then
          	set _where = concat(_where , ' and iseggfille = ' ,is_eggfille);
  end if;
  if recipe_group != '' then
          	set _where = concat(_where , ' and recipegroup = ' ,recipe_group);
  end if;
  if is_customrecipe = 1 then
          	set _where = concat(_where , ' and clientid = ' ,client_id);
  end if;

		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
        SET _totalspace = 0;
        if _id = 'recipename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
			if _value != '' then
					WHILE _totalspace > 0 DO

					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

					SET  _totalspace = _totalspace - 1;

					END WHILE;
			end if;
        end if;
        if _value != '' and _value != 'null' then
			if _id = 'calories' or _id = 'protein' or _id = 'fats'
            or _id = 'carbs' or _id = 'fiber' or _id = 'water' then
         		set _where = CONCAT(_where , CONCAT(' and ', ' CAST(JSON_EXTRACT(nutrition, ''$[0].', _id ,''') as SIGNED) >= ', _value ));
			end if;
        end if;

		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted, recipename ';
    end if;
     set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby, _limit );
	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistroutine` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

    select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,routinename as label ,difficultylevel,(difficultylevel + 0 ) difficultylevelId,routinetype';
    set _table = ' from workoutroutine ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id);


	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
	if _value != '' then
    if _id = 'difficultylevel' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
	elseif _id= 'routinetype' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
	else
     			set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
         end if;
		SET  i = i + 1;
	END WHILE;
	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;
   if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted , routinename asc';
    end if;

	set @_qry = CONCAT('select ' , _columns, _table ,_where ,' ', _orderby);

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistservice` (IN `tableInfo` LONGTEXT)  BEGIN


	DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered')
    into client_id, filtered;

	set _columns = ' id,concat(servicename,'' - '',durationcount, '' '' ,duration) label ,durationcount,duration,price,servicename';
    set _table = ' from service ';
	set _where = concat(' where deleted = 0 and status = 1 and clientid = ', client_id);


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' then
			if _id = 'serviceType' then
				set _where = CONCAT(_where , CONCAT(' and measurementunit = ', _value));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistserviceparallelplan` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length , service_id , branch_id , membership_type  INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table , activity_type varchar(500);
	DECLARE isExist int DEFAULT 0;

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.id'),
    JSON_EXTRACT(tableInfo,'$.branchid'),
	JSON_EXTRACT(tableInfo,'$.servicetype'),
	JSON_EXTRACT(tableInfo,'$.activity')
    into client_id, filtered,service_id,branch_id, membership_type , activity_type;

	set activity_type = REPLACE(activity_type,'"','');

    if activity_type != '' and activity_type is not null and activity_type != 'null' then
		set activity_type = cast(activity_type as unsigned);
     else
		set activity_type = 0;
    end if;

	set _columns = 'id,concat(servicename)  label';
    set _table = ' from service ';

    if service_id > 0 then
		SELECT count(1) into isExist FROM service where id = service_id
        and deleted = 0 and parallelplan is not null;
    end if;


    if isExist > 0 then
		set _where = concat(' where deleted = 0 and (parallelplan = ', service_id ,
        ' or parallelplan is null) and clientid = ', client_id ,
        ' and (case when enablesharetoallbranches = 0 then json_search(branchid, ''one'' , ' , branch_id ,') is not null else 1=1 end)
        and servicetype = ' , membership_type , ' and (case when ' , activity_type , '
		> 0 then activity = ' , activity_type , ' else 1=1 end ) ');
    else
		set _where = concat(' where deleted = 0 and (parallelplan is null and id != ', service_id , ') and clientid = ', client_id ,
        ' and (case when enablesharetoallbranches = 0 then json_search(branchid, ''one'' , ' , branch_id ,') is not null else 1=1 end)
        and servicetype = ' , membership_type , ' and (case when ' , activity_type , '
		> 0 then activity = ' , activity_type , ' else 1=1 end )');
	end if ;

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistsessiontype` ()  BEGIN
	select s.id as value,sessiontypename as label from sessiontype s order by sessiontypename asc;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistshift` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length , _branchid  INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into client_id, filtered,_branchid;

	set _columns = ' s.id as value,shiftname as label ';
    set _table = ' from staffshift s';
    set _where = concat(' where s.deleted = 0 and s.clientid = ' , client_id , ' and s.branchid = ' , _branchid);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPliststore` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE client_id, i, _length  INT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId')  into client_id ;

	set _columns = ' s.id value, concat(s.storename,'' ('',s.storeid,'')'') label';
    set _table = ' from store s';
	set _where = concat(' where  s.deleted = 0 and s.status = 1 and s.clientid = ', client_id );

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPliststorecategory` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE client_id, i, _length  INT;
    DECLARE _columns, _where, _id, _value, _table  varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId')  into client_id ;

	set _columns = ' s.id value, s.storecategoryname label';
    set _table = ' from storecategory s';
	set _where = concat(' where  s.deleted = 0 and s.status = 1 and s.clientid = ', client_id );

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlisttagname` ()  BEGIN

	select tagname , description from tagnames order by tagname asc;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlisttax` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table,_clientcountrycode varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.clientcountrycode')
    into client_id, filtered,_clientcountrycode;

	set _columns = 'id,concat(taxname)  label ,percentage,taxgroupitem';
    set _table = ' from tax ';
	set _where = concat(' where deleted = 0  and (clientid = ', client_id ,' or (clientid = 1 and clientcountrycode = ' ,_clientcountrycode , '))' );


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlisttaxcodecategory` (IN `tableInfo` LONGTEXT)  BEGIN
	DECLARE client_id, i, _length , _isService INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.isService')
    into client_id, filtered,_isService;

	set _columns = ' t.id,concat(taxcategoryname,'' - '',taxcode) as label,ref_t.taxgroupitem';
    set _table = ' from taxcodecategory t
                inner join tax ref_t on  t.taxgroupid = ref_t.id';

	set _where = concat(' where t.deleted = 0 and  (t.clientid = ', client_id, ' or   t.clientid = 1)');

     if _isService = 1 then

		set _where = concat(_where , '  and taxcodecategorytype = 1 ');

     elseif _isService = 0 then

		set _where = concat(_where , '  and taxcodecategorytype = 2 ');

     end if;

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlisttimezone` ()  BEGIN

			select id,offsetvalue,concat(name ,' - ', offset ) label,countrycode from timezone;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistuser` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length , _branchid   INT;
    DECLARE filtered, obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table , _zoneid varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.zoneid')
    into client_id, filtered, _branchid , _zoneid;

    set _zoneid = REPLACE(_zoneid,'"','');
    set _branchid = REPLACE(_branchid,'"','');

        set _columns = ' user.id,concat(firstname,'' '',lastname, '' ('',r.role,'')'') label , emailid,salary,balance, employeecode,
        concat(firstname,'' '',lastname)employeename,mobile,user.covidrisk,(user.covidrisk+0)covidriskId,user.last_covid19submitdate,
        enableonlinelisting,specialization,dateofbirth,(gender+0)genderId,ispregnant,(ptcommissiontype + 0) ptcommissiontypeId,
        ptcommssion,advancepayment';
		set _table = ' from user
        left outer JOIN  role r on user.assignrole = r.id';
		set _where = concat(' where user.deleted = 0 and status = 1 and user.clientid = ', client_id , ' and
        (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ' ) is not null)
         else defaultbranchid = ' , _branchid , ' end)');

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		SET  i = i + 1;
	END WHILE;


	set @_qry = CONCAT('select ' , _columns, _table ,_where , " order by concat(firstname,'' '',lastname )  " );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlistzone` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered')
    into client_id, filtered;

	set _columns = ' z.id,concat(z.zonename)  label ';
    set _table = ' from zone z';
	set _where = concat(' where z.deleted = 0 and z.clientid = ', client_id);


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlogaccessmodulesave` (IN `client_id` INT, IN `user_id` INT, IN `login_type` INT, IN `ip_address` VARCHAR(50), IN `module` VARCHAR(100))  BEGIN

 DECLARE _tablename,_insertvalues varchar(1000);
 DECLARE isExist int default 0;

	set _tablename =  concat('logaccessmodule_',month(now()),'_', year(now()));

    SELECT count(1) into isExist FROM information_schema.tables
	WHERE table_schema = 'db_fpllogs' AND table_name = _tablename LIMIT 1;

    if isExist = 0 then

		set @_qry = CONCAT('CREATE TABLE  db_fpllogs.' , _tablename, ' LIKE db_fpllogs.logaccessmodule');

		PREPARE stmt FROM @_qry;
		EXECUTE stmt ;
		DEALLOCATE PREPARE stmt;

    end if;

		set _insertvalues =  concat(' (clientid,userid,logintype,ipaddress,module,createdbydate)
		values (',client_id,',',user_id,',',login_type,',''',ip_address,''',''',module,''',','now())');

		set @_qry = CONCAT('insert into db_fpllogs.' , _tablename, _insertvalues);

		PREPARE stmt FROM @_qry;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPlogmodulechangeddatasave` (IN `client_id` INT, IN `user_id` INT, IN `login_type` INT, IN `ip_address` VARCHAR(50), IN `device_info` LONGTEXT, IN `module` VARCHAR(100), IN `module_operation` VARCHAR(50), IN `module_data` LONGTEXT)  BEGIN

DECLARE _tablename varchar(500);
DECLARE _insertvalues text;
 DECLARE isExist int default 0;
    set _tablename =  concat('logchangedata_',month(now()),'_', year(now()));

    SELECT count(1) into isExist FROM information_schema.tables
	WHERE table_schema = 'db_fpllogs' AND table_name = _tablename LIMIT 1;

   if isExist = 0 then

	    set @_qry = CONCAT('CREATE TABLE  db_fpllogs.' , _tablename, ' LIKE db_fpllogs.logchangedata');

		PREPARE stmt FROM @_qry;
		EXECUTE stmt ;
		DEALLOCATE PREPARE stmt;

	end if;

         set _insertvalues = concat(' (clientid,userid,logintype,ipaddress,deviceinfo,module,createdbydate,operation,data)
		 values (',client_id,',',user_id,',',login_type,',''',ip_address,''',''',device_info,''',
         ''',module,''',','now()', ',''' , module_operation , ''',''' ,module_data , ''')');

		 set @_qry = CONCAT('insert into db_fpllogs.' , _tablename, _insertvalues);

		  PREPARE stmt FROM @_qry;
		  EXECUTE stmt;
		  DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPnotificationlogsave` (IN `notification_fromclient` INT, IN `notification_touser` LONGTEXT, IN `notification_tomember` LONGTEXT, IN `notification_toenquiry` LONGTEXT, IN `notification_mobile` VARCHAR(1000), IN `notification_emailid` VARCHAR(100), IN `notification_subject` VARCHAR(200), IN `notification_content` VARCHAR(2000), IN `notification_response` VARCHAR(5000), IN `notification_type` VARCHAR(10), IN `notification_fromuserid` INT, IN `notification_attachment` LONGTEXT, IN `notification_responsemessage` VARCHAR(5000), IN `notification_templatetitle` VARCHAR(500), IN `notification_broadcastid` INT, IN `notification_bccemailid` LONGTEXT)  BEGIN

	insert into notificationlog(fromclient,touser,tomember,toenquiry,mobile,emailid,subject,content,
    response,createdbydate,notificationtype,fromuserid,attachment,responsemessage,eventname,broadcastid,bccemailid)
    values(notification_fromclient,notification_touser,notification_tomember,notification_toenquiry,
    notification_mobile,notification_emailid,notification_subject,notification_content,notification_response,
    now(),notification_type,notification_fromuserid,notification_attachment,notification_responsemessage,
    notification_templatetitle,notification_broadcastid,notification_bccemailid);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentcompletesave` (IN `payment_requestnumber` VARCHAR(20), IN `payment_transactionid` VARCHAR(200), IN `payment_banktransactionid` VARCHAR(100), IN `payment_otherparameter` LONGTEXT, IN `paymnet_status` VARCHAR(200), IN `is_payment` VARCHAR(5))  BEGIN
DECLARE _id,isExist  INT;
DECLARE _status varchar(50);

	SELECT status+0 into isExist FROM onlinepayment where requestnumber = payment_requestnumber ;

	if isExist != 1 then

		Call `ERROR` ('Transaction already processed.Please try again');

    end if;

		update onlinepayment set
		transactionid=payment_transactionid,
		banktransactionid=payment_banktransactionid,
		otherparameter= case when payment_otherparameter is not null then payment_otherparameter else otherparameter end,
		status = paymnet_status,
		ispayment = is_payment
		where requestnumber=payment_requestnumber;


	select id into _id from onlinepayment where requestnumber = payment_requestnumber;

    select  paymentdetail,id,purchasedetail,(userpaymenttype +0) userpaymenttypeId from onlinepayment where id = _id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentFailsave` (IN `payment_requestnumber` VARCHAR(20), IN `payment_transactionid` VARCHAR(200), IN `payment_banktransactionid` VARCHAR(100), IN `payment_otherparameter` LONGTEXT, IN `paymnet_status` VARCHAR(200), IN `is_payment` VARCHAR(5))  BEGIN
DECLARE _id  INT;

	update onlinepayment set
	transactionid=payment_transactionid,
	banktransactionid=payment_banktransactionid,
	otherparameter= case when payment_otherparameter is not null then payment_otherparameter else otherparameter end,
    status = paymnet_status,
    ispayment = is_payment
   	where requestnumber=payment_requestnumber;



END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentinitsave` (IN `user_id` INT, IN `client_id` INT, IN `payment_amount` INT, IN `payment_detail` LONGTEXT, IN `payment_url` VARCHAR(200), IN `branch_id` INT, IN `purchase_detail` LONGTEXT, IN `user_paymenttype` VARCHAR(20), IN `link_createdbyid` INT)  BEGIN

DECLARE _id,i, j, _length,isExitMemberMembership,isExitonceinlifetime,
parallelplanId,onceinlifetimeplanId,isExitparallelplanId,isExitonceinlifetimeplanId,_cartid,
_memberid,_memberoption INT;
DECLARE _membercode, _customerid,_servicetypeid,_startdate,_sessiontype,_activitytypeid varchar(100);
DECLARE _emailid, _country, _state varchar(500);
DECLARE _cart,obj,_billing LONGTEXT;
DECLARE _maxactivationdate date DEFAULT NULL ;
DECLARE sqlcode CHAR(5) DEFAULT '00000';
DECLARE msg TEXT;
DECLARE _city varchar(100);
DECLARE stateID int DEFAULT NULL;
DECLARE countryID varchar(2) DEFAULT NULL;
    DECLARE isExist int default 0;

 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
             ROLLBACK;
             if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else

			 	 Call `ERROR`('Internal Server Error');
             end if;
		 END;

select JSON_EXTRACT(purchase_detail,'$.cart'),
        JSON_EXTRACT(purchase_detail,'$.billing') into _cart,_billing;

if _billing is not null then
select JSON_EXTRACT(_billing, '$.personalemailid'),JSON_EXTRACT(_billing, '$.country'),
       JSON_EXTRACT(_billing, '$.state'), JSON_EXTRACT(_billing, '$.id'),
       JSON_EXTRACT(_billing, '$.memberOption'),JSON_EXTRACT(_billing, '$.city')
	into _emailid,_country,_state,_memberid,_memberoption,_city;

		set _emailid = REPLACE(_emailid,'"','');
        set _country = REPLACE(_country,'"','');
        set _state = REPLACE(_state,'"','');
        set _memberid = REPLACE(_memberid,'"','');
        set _memberoption = REPLACE(_memberoption,'"','');
        set _city = REPLACE(_city,'"','');


  if _memberoption = 1 then
		  if _memberid is null || _memberid = 0  then
			Call `ERROR` ('Please select a member.');
		  end if;
        end if;

        if _country != '' && _country is not null then
			select code into countryID from country where name = _country;

			if countryID is null then
				Call `ERROR` ('Please enter valid country.');
			end if;
		end if;

		if _state != '' && _state is not null then
			select id, country_code into stateID, countryID from state where name = _state and (country_code = countryID or countryID is null);

			if stateID is null then
				Call `ERROR` ('Please enter valid State/Region.');
			end if;
		end if;

        if _memberoption = 2 or _memberoption = 3 then

			select count(1) into isExist from member where personalemailid = _emailid
			and clientid = client_id and deleted = 0;

			if isExist > 0 then
				Call `ERROR`('Email id already exists.');
			end if;
        end if;
end if;

START TRANSACTION;
if  _cart is not null then
 SET i = 0;
 SET _length = JSON_LENGTH(_cart);

      WHILE  i < _length DO
	  SELECT JSON_EXTRACT(_cart,CONCAT('$[',i,']')) into obj;

				select JSON_EXTRACT(obj, '$.servicetypeId'),JSON_EXTRACT(obj, '$.startDate'),
				  JSON_EXTRACT(obj, '$.activitytypeId'),JSON_EXTRACT(obj, '$.sessiontypeId'),
				  JSON_EXTRACT(obj, '$.objectID')
				  into _servicetypeid,_startdate,_activitytypeid,_sessiontype,_cartid;

				set _servicetypeid = REPLACE(_servicetypeid,'"','');
				set _startdate = REPLACE(_startdate,'"','');
				set _activitytypeid = REPLACE(_activitytypeid,'"','');
				set _sessiontype = REPLACE(_sessiontype,'"','');
			    set _cartid = REPLACE(_cartid,'"','');


  if _servicetypeid = 1 then

	 select count(1) into isExitMemberMembership from  subscription s
	 left outer join service on s.serviceplan = service.id where member = user_id
	 and service.servicetype = cast(_servicetypeid as unsigned);

	  if isExitMemberMembership > 1 then
				Call `ERROR` ('Do not allow more than one future plan.');
	  end if;

  elseif _servicetypeid = 2 then

		if(_activitytypeid = 1) then

            select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = user_id
			and service.servicetype = cast(_servicetypeid as unsigned)
            and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = cast(_sessiontype as unsigned) ;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
		end if;

		if(_activitytypeid = 2) then

			select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = user_id
			and service.servicetype = cast(_servicetypeid as unsigned)
			and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = cast(_sessiontype as unsigned) ;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
	    end if;
	end if;


    if _servicetypeid = 1 then
		set _startdate = getdateFromJSON(_startdate);

		select max(expirydatesubscription) into _maxactivationdate from subscription s
		left outer join service on s.serviceplan = service.id where member = user_id and service.servicetype = cast(_servicetypeid as unsigned);

		if _maxactivationdate >= date(_startdate) then
			Call `ERROR`(concat('Membership is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
		end if;

    elseif _servicetypeid = 2 then
		set _startdate = getdateFromJSON(_startdate);

		if(_activitytypeid = 1) then

			select max(expirydatesubscription) into _maxactivationdate from subscription s
			left outer join service on s.serviceplan = service.id where member = user_id and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = cast(_sessiontype as unsigned) ;

			if _maxactivationdate >= date(_startdate) then
				Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
			end if;
		end if;

	   if(_activitytypeid = 2) then

			select max(expirydatesubscription) into _maxactivationdate from subscription s
			left outer join service on s.serviceplan = service.id where member = user_id and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = cast(_sessiontype as unsigned) ;

			if _maxactivationdate >= date(_startdate) then
				Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
			end if;
       end if;
	end if;


	select count(1) into isExitonceinlifetime from  subscription s
	left outer join service on s.serviceplan = service.id where member = user_id
	and service.enablesaleonceinlifetime = 1 and  service.id = _cartid;

	  if isExitonceinlifetime > 0 then
				Call `ERROR` ('This service has already been purchased by you.');
	  end if;

	  select parallelplan into parallelplanId from service
	  where service.id = _cartid and service.enablesaleonceinlifetime = 1;

	  select count(1) into isExitparallelplanId from subscription
	  where member = user_id  and serviceplan = parallelplanId;

	  if isExitparallelplanId > 0 then
		 Call `ERROR` ('You are not eligible to purchase this series.');
	  end if;

	SET  i = i + 1;
	END WHILE;
end if;

     select membercode into _membercode from member where id = user_id;
	 set _customerid = concat(_membercode,'@',client_id);

	insert into onlinepayment(requestnumber,customerid,
    linkcreatedbyid,createdbydate,memberid,paymentamount,paymentdetail,url,branchid,status,
    purchasedetail,userpaymenttype,expirydate,clientid)
    values(getSequence('paymentRqNo' , '1'),_customerid,
    (case when user_paymenttype = "3" then
    link_createdbyid else null end),now(),user_id,payment_amount,payment_detail,payment_url,branch_id,1,
    purchase_detail,user_paymenttype,(case when user_paymenttype = "3" then
    DATE_ADD(now(), INTERVAL 24 HOUR) else null end),client_id);

	set  _id = LAST_INSERT_ID();

    select paymentdetail,paymentamount,requestnumber,customerid,url,purchasedetail,paymentamount,
    createdbydate,expirydate from onlinepayment where id = _id;
COMMIT;
    SET @flag = 1;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentlinkpayrequestcheck` (IN `payment_requestnumber` VARCHAR(20))  BEGIN
 DECLARE startdate,enddate datetime;
 DECLARE _id,_userpaymenttype int;

   select id,createdbydate,expirydate,userpaymenttype into _id,startdate,enddate,_userpaymenttype from onlinepayment where requestnumber = payment_requestnumber;

    if _id is not null and enddate is not null and _userpaymenttype = 3  then
        if now() not between startdate and enddate then
			Call `ERROR` ('link is not valid.');
		end if;
    else
			Call `ERROR` ('link is not valid.');
    end if;

        select paymentgateway,o.url,paymentdetail,paymentamount,requestnumber,customerid,
        url,purchasedetail from client c
		inner join onlinepayment o on o.clientid = c.id
		where o.requestnumber = payment_requestnumber ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentmemberidsave` (IN `payment_requestnumber` VARCHAR(20), IN `member_id` INT)  BEGIN

	update onlinepayment set
    memberid = member_id
    where requestnumber = payment_requestnumber;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentotherparametersave` (IN `payment_requestnumber` VARCHAR(20), IN `other_parameter` LONGTEXT, IN `ispayer` INT)  BEGIN
Declare _otherparameter LONGTEXT;

if ispayer = 1 then

	select otherparameter into _otherparameter from  onlinepayment where requestnumber=payment_requestnumber;

    select JSON_SET(_otherparameter, '$.payer', other_parameter) into _otherparameter;

    update onlinepayment set
	otherparameter=_otherparameter
   	where requestnumber=payment_requestnumber;

else

    update onlinepayment set
	otherparameter=other_parameter
   	where requestnumber=payment_requestnumber;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymentsearchusingtoken` (IN `token_number` VARCHAR(50))  BEGIN

    select paymentdetail,paymentamount,requestnumber,customerid,url,otherparameter,(userpaymenttype +0) userpaymenttypeId,
    paymentgateway from onlinepayment o
    inner join member m on o.memberid = m.id
    inner join client c on m.clientid = c.id
    where token_number
    in  (JSON_EXTRACT(otherparameter, '$.token'));

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPonlinepaymnetview` (IN `paymnet_requestnumber` VARCHAR(100))  BEGIN

		select paymentgateway,o.url,(userpaymenttype +0) userpaymenttypeId,paymentdetail from client c
		inner join onlinepayment o on o.clientid = c.id
		 where o.requestnumber = paymnet_requestnumber ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpackagedelete` (IN `package_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
update package set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where id=package_id and clientid = client_id;

update packageitem set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where packageid=package_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpackagesave` (IN `package_id` INT, IN `package_name` VARCHAR(100), IN `package_services` LONGTEXT, IN `package_specialprice` DECIMAL(12,2), IN `package_status` VARCHAR(10), IN `client_id` INT, IN `createdby_id` INT, IN `package_applicablefor` VARCHAR(20), IN `package_branchname` LONGTEXT, IN `package_enablesharetoallbranches` TINYINT(1), IN `package_servicevalidity` VARCHAR(10), `package_launchdate` DATE, `package_expirydate` DATE)  BEGIN

DECLARE isExit int DEFAULT 0;
DECLARE _isservice boolean DEFAULT false;
DECLARE _quantity,_productid,_serviceid,_id,_packageid,i, j, _length INT;
DECLARE _specialprice decimal(12,2);

DECLARE obj LONGTEXT;
DECLARE sqlcode CHAR(5) DEFAULT '00000';
DECLARE msg TEXT;

     DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
             ROLLBACK;
             if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else
				 Call `ERROR`('Internal Server Error');

             end if;
		END;

START TRANSACTION;

if package_id =0 then

	SELECT count(1) into isExit FROM package where packagename = package_name and deleted = 0 and clientid = client_id;

	if isExit > 0
	then
        Call `ERROR` ('Package Name Already exists.');
	end if;

	insert into package(packagename,specialprice,status,
	createdbyid,createdbydate,clientid,applicablefor,enablesharetoallbranches,branchid,servicevalidity,launchdate,expirydate)
    values(package_name,package_specialprice,
	package_status,createdby_id,now(),client_id,package_applicablefor,
    package_enablesharetoallbranches,package_branchname,package_servicevalidity,package_launchdate,
	package_expirydate);

        SELECT LAST_INSERT_ID() into _packageid;

 SET i = 0;

	  SET _length = JSON_LENGTH(package_services);

		WHILE  i < _length DO
			SELECT JSON_EXTRACT(package_services,CONCAT('$[',i,']')) into obj;

  select JSON_EXTRACT(obj, '$.isService') ,
		JSON_EXTRACT(obj, '$.specialprice'),
		JSON_EXTRACT(obj, '$.Quantity'),
		JSON_EXTRACT(obj, '$.id')

		into _isservice,_specialprice,_quantity,_id;


        set _isservice = REPLACE(_isservice,'"','');
        set _specialprice = REPLACE(_specialprice,'"','');
        set _quantity = REPLACE(_quantity,'"','');


            if _isservice = true then
                 set _serviceid = _id;
			else
				 set _productid = _id;
                   set _serviceid = null;
			end if;


	insert into packageitem(packageid,serviceid,productid,specialprice,quantity
    ,createdbyid,createdbydate)
    values(_packageid,_serviceid,_productid,_specialprice,
	_quantity,createdby_id,now());

SET  i = i + 1;
		END WHILE;

elseif package_id > 0 then
	SELECT count(1) into isExit FROM package where packagename = package_name and deleted = 0 and id !=package_id and clientid = client_id;

	if isExit > 0
	then
        Call `ERROR` ('Package Name Already exists.');
	end if;


	update package set
    packagename =package_name,
	specialprice=package_specialprice,
    status = package_status,
    modifiedbyid=createdby_id,
    modifiedbydate=now(),
    applicablefor = package_applicablefor,
	enablesharetoallbranches = package_enablesharetoallbranches,
	branchid = package_branchname,
    servicevalidity=package_servicevalidity,
	launchdate=package_launchdate,
	expirydate=package_expirydate
	where id=package_id and clientid=client_id;

update packageitem set
					deleted = 1,
					modifiedbyid = createdby_id,
					modifiedbydate=now()
					where  packageid = package_id;

    SET i = 0;

	  SET _length = JSON_LENGTH(package_services);

		WHILE  i < _length DO
			SELECT JSON_EXTRACT(package_services,CONCAT('$[',i,']')) into obj;

  select JSON_EXTRACT(obj, '$.isService'),
		JSON_EXTRACT(obj, '$.specialprice'),
		JSON_EXTRACT(obj, '$.Quantity'),
		JSON_EXTRACT(obj, '$.id')

		into _isservice,_specialprice,_quantity,_id;


        set _isservice = REPLACE(_isservice,'"','');
        set _specialprice = REPLACE(_specialprice,'"','');
        set _quantity = REPLACE(_quantity,'"','');

            if _isservice = true then
                 set _serviceid = _id;
				set _productid = null;

			else
				 set _productid = _id;
                   set _serviceid = null;
		end if;



	insert into packageitem(packageid,serviceid,productid,specialprice,quantity
    ,createdbyid,createdbydate)
    values(package_id,_serviceid,_productid,_specialprice,
	_quantity,createdby_id,now());

SET  i = i + 1;
		END WHILE;


end if;

COMMIT;
SET @flag = 1;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpackagesearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length, _branchid INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid;

	set _offset = pageIndex * pageSize;
	set _columns = 'id,packagename, specialprice,servicevalidity,status,applicablefor,(status + 0) statusId';
	set _table = ' from package ';
	set _where = concat(' where deleted = 0 and clientid = ', client_id, ' and
	(case when enablesharetoallbranches = 0 then json_search(branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
        if _value != '' and _value != 'null' then
		if _id = 'duration' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		elseif _id = 'status' then
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
        elseif _id= 'packagename' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));

             else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));

            end if;
          end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

			set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		 set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpackageview` (IN `package_id` INT, IN `client_id` INT)  BEGIN
		select pk.id,packagename, pk.specialprice,pk.servicevalidity,(pk.servicevalidity + 0) servicevalidityId,pk.status,pk.applicablefor,
        launchdate,expirydate,branchid,enablesharetoallbranches,
			(select JSON_ARRAYAGG(json_object('packageid',pt.packageid,'id', ifnull(pt.serviceid,pt.productid),'name',
			ifnull(s.servicename,p.productname),'price',ifnull(s.price,p.price),'specialprice',pt.specialprice,
			'Quantity',pt.quantity,'isService',
			  case  when serviceid != '' and serviceid != 'null'
				then 1
				else 0
			  end,'taxgroupitem',t.taxgroupitem,'taxcategoryid',ifnull(s.taxcategoryid,p.taxcategoryid),'servicetype',s.servicetype,'activity',s.activity,'sessiontypename',st.sessiontypename))
			from packageitem pt
			left outer join service s on pt.serviceid = s.id
			left outer join product p on pt.productid = p.id

			left outer join taxcodecategory ref_t on ifnull(s.taxcategoryid,p.taxcategoryid) = ref_t.id
			left outer join tax t on ref_t.taxgroupid = t.id
            left outer join sessiontype st on st.id= s.sessiontype

			 where pt.deleted = 0  and pk.id = pt.packageid
			)'packageitem'
		from package pk
		where pk.id=package_id and pk.clientid = client_id and pk.deleted = 0;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpaymentchangestatus` (IN `payment_id` INT, IN `member_id` INT, IN `payment_status` VARCHAR(200), IN `payment_remark` VARCHAR(200), IN `payment_amount` VARCHAR(200), IN `client_id` INT, IN `user_id` INT, IN `payment_duedate` DATE, IN `payment_branchid` INT, IN `payment_invoiceid` INT)  BEGIN

 DECLARE _memberbalance,_duesamount decimal(12,2) DEFAULT 0;
 DECLARE _installmentId INT DEFAULT null;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 SET @flag = 0;
			  ROLLBACK;
			Call `ERROR` ('Internal Server Error.');
		END;

		select balance into _memberbalance from member where id = member_id and clientid = client_id and deleted = 0;

         if _memberbalance > 0 then

            if _memberbalance - payment_amount < 0 then
              set _duesamount = payment_amount - _memberbalance;
			else
				set _duesamount = 0;
            end if;
        else
              set _duesamount = payment_amount;
         end if;
	START TRANSACTION;

		if payment_status = 3 or payment_status = 4  then
				if _duesamount > 0 then

					insert into installment(memberid,date,amount,installmentstatus,
					paymentamount,createdbyid ,createdbydate,branchid,
                    invoiceid)
					values(member_id,payment_duedate,_duesamount,3,0,user_id,now(),
                    payment_branchid,payment_invoiceid);

                    SELECT LAST_INSERT_ID() into _installmentId;

                    insert into memberremark(remark,followupdate,
					createdbyid,createdbydate,memberid,followuptype,installmentid,branchid)
					values(CONCAT(' Cancel Payment Remark :  ', payment_remark),concat(payment_duedate , ' ', CURRENT_TIME()),
                    user_id,now(),member_id,2,_installmentId,payment_branchid);

				end if;
            update member set
			balance = balance - payment_amount
			where id=member_id and clientid = client_id;

        end if;
   if payment_status = 3 or payment_status = 4  then
		update payment set status = payment_status,
		remark = case when remark is not null or remark  != '' then CONCAT(remark, '\n' ,CONCAT(' "Cancel Payment Remark" : ', payment_remark)) else  CONCAT(' Cancel Payment Remark :  ', payment_remark) end,
        modifiedbyid = user_id,
        modifiedbydate = now()
		where id=payment_id and memberid=member_id;
   else
   update payment set status = payment_status,
		remark =  payment_remark,
        modifiedbyid = user_id,
        modifiedbydate = now()
		where id=payment_id and memberid=member_id;
   end if;
   if payment_status = 3 or payment_status = 4  then
         insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
		 clientid,createdbyid,createdbydate,branchid)
		 values(_memberbalance, (0 - payment_amount),"cancel payment",payment_id,"payment",member_id,
		 client_id,user_id,now(),payment_branchid);
   end if;
	COMMIT;
		SET @flag = 1;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPPaymentSave` (IN `data` LONGTEXT)  BEGIN

DECLARE client_id,user_id, i,j, _length,_paymentmode,_memberid,_memberoption,_enquiryid,pay_id,
		_paymentid,_installmentid INT;

DECLARE _paymentamount decimal(12,2) DEFAULT 0;

DECLARE   _payment,_installments, obj ,objinstallment LONGTEXT;
DECLARE _chequeno,_chequedate,_bankname,_remark,_status,_installmentdate, _installmentamount,_orderby,_paymentdate,
		_createdfrom,_referenceid,_defaultbranchid,_invoiceid varchar(500);

DECLARE  Loop_recordFound INT;
DECLARE Loop_installmentAmount, Loop_paidAmount, Loop_remainingAmount,_memberbalance,_balance,_cardswipeCharge decimal(12,2) DEFAULT 0;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		SET @flag = 0;
			ROLLBACK;
		Call `ERROR` ('Internal Server Error.');
	END;


	select JSON_EXTRACT(data,'$.clientId'),
    JSON_EXTRACT(data,'$.payment'),
	JSON_EXTRACT(data,'$.userId'),
	JSON_EXTRACT(data,'$.CreatedFrom'),
	JSON_EXTRACT(data,'$.payId')

    into  client_id, _payment ,user_id,_createdfrom,pay_id;

    if _createdfrom is null then
        set _createdfrom = 'u';
	end if;
    select  _createdfrom;

    select JSON_EXTRACT (_payment,'$.memberid'),
			JSON_EXTRACT(_payment, '$.paymentAmount'),
			JSON_EXTRACT(_payment , '$.paymentMode') ,
			JSON_EXTRACT(_payment, '$.chequeno'),
			JSON_EXTRACT(_payment, '$.chequeDate'),
			JSON_EXTRACT(_payment, '$.bankName'),
			JSON_EXTRACT(_payment, '$.status'),
			JSON_EXTRACT(_payment, '$.remark'),
			JSON_EXTRACT(_payment, '$.paymentDate'),
            JSON_EXTRACT(_payment, '$.referenceId'),
			JSON_EXTRACT(_payment, '$.branchid'),
            JSON_EXTRACT(_payment, '$.installmentid'),
			JSON_EXTRACT(_payment, '$.invoiceid'),
		    JSON_EXTRACT(_payment, '$.cardswipeCharge')
        into _memberid, _paymentamount, _paymentmode,_chequeno,_chequedate,_bankname,_status,_remark,_paymentdate,
        _referenceid,_defaultbranchid,_installmentid,_invoiceid,_cardswipeCharge;

		set _memberid = REPLACE(_memberid,'"','');
        set _paymentamount = REPLACE(_paymentamount,'"','');
        set _paymentmode = REPLACE(_paymentmode,'"','');
		set _chequeno = REPLACE(_chequeno,'"','');
        set _chequedate = REPLACE(_chequedate,'"','');
        set _bankname = REPLACE(_bankname,'"','');
        set _status = REPLACE(_status,'"','');
        set _remark = REPLACE(_remark,'"','');
        set _paymentdate = REPLACE(_paymentdate,'"','');
		set _createdfrom = REPLACE(_createdfrom,'"','');
        set _referenceid = REPLACE(_referenceid,'"','');
        set _defaultbranchid = REPLACE(_defaultbranchid,'"','');
        set _installmentid = REPLACE(_installmentid,'"','');
        set _invoiceid = REPLACE(_invoiceid,'"','');
		set _cardswipeCharge = REPLACE(_cardswipeCharge,'"','');

        if _invoiceid = 'null' then
			set _invoiceid = null;
        end if;

		select balance into _memberbalance from member where id = _memberid and clientid = client_id and deleted = 0;

START TRANSACTION;

		insert into payment(memberid,paymentamount,paymentmode,chequeno,
		chequedate,bankname ,status,remark,paymentdate,createdbyid,createdbydate,createdfrom,payid,
        paymentreceiptcode,referenceid,branchid,installmentid,invoiceid,cardswipecharge)
        values(_memberid,_paymentamount + ifnull(_cardswipeCharge,0),_paymentmode,_chequeno,getDateFromUTC(_chequedate,'+00:00',0),_bankname,_status,
        _remark,date(getDateFromUTC(_paymentdate,'+00:00',0)),user_id,now(),_createdfrom,pay_id,
        getInvoicenumber('invoice', client_id),_referenceid,_defaultbranchid,_installmentid,_invoiceid,_cardswipeCharge);

		 SELECT LAST_INSERT_ID() into _paymentid;


        insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
		clientid,createdbyid,createdbydate,branchid)
        values(_memberbalance, _paymentamount,"payment",_paymentid,"payment",_memberid,
		client_id,user_id,now(),_defaultbranchid);

		update member set balance = balance + _paymentamount where member.id=_memberid;
		update memberremark set followupdate = null  where followupdate > now() and memberid = _memberid and followuptype in  (2);

        SELECT balance INTO _balance from member where id = _memberid;

         update invoice set
		 status = case when _balance < 0 then 2 else 1 end
         where memberid = _memberid and  clientid = client_id;

InstallmentLoop :WHILE _paymentamount > 0 DO

    set Loop_recordFound = 0;

    SELECT  id, amount, paymentamount
    into Loop_recordFound, Loop_installmentAmount, Loop_paidAmount
    FROM installment WHERE memberid = _memberid AND installmentstatus <> 2 ORDER BY date ASC limit 1;

		if Loop_recordFound > 0 then
		set Loop_remainingAmount = Loop_installmentAmount - Loop_paidAmount;

			if _paymentamount >= Loop_remainingAmount  then
				update installment set
				paymentamount = paymentamount + Loop_remainingAmount,
				installmentstatus = 2,
                paiddate = date(getDateFromUTC(_paymentdate,'+00:00',0)),
                modifiedbyid = user_id,
                modifiedbydate = now()
				where  id = Loop_recordFound;
                set _paymentamount = _paymentamount - Loop_remainingAmount ;
			else
				 update installment set
                 paymentamount = paymentamount + _paymentamount,
				 paiddate = date(getDateFromUTC(_paymentdate,'+00:00',0)),
                 modifiedbyid = user_id,
                 modifiedbydate = now()
				 where  id = Loop_recordFound;

				set _paymentamount = 0;

			end if;
		else
			LEAVE InstallmentLoop;
		end if;

end while;

COMMIT;
    SET @flag = 1;

select _paymentid as paymentid;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpendigchequesearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX , _branchid varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = 'p.id,p.memberid,image,memberprofileimage,p.chequeno,p.chequedate,p.paymentamount,p.paymentmode,(p.paymentmode+0)paymentmodeId,
    concat(firstname,'' '',lastname) as name,mobile,membercode,p.paymentdate,m.personalemailid,
    p.invoiceid';
    set _table = ' from payment p
                        INNER JOIN member m ON p.memberid = m.id ';
	set _where = concat(' where (p.paymentmode = 2 or p.paymentmode = 3) and p.status = 1 and
    m.clientid = ', client_id , ' and p.branchid = ' , _branchid);

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
        if _id = 'name' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
        elseif _id = 'paymentmode' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		elseif _id= 'chequedate' or _id= 'paymentdate' then
			set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
        elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
        else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
    	end if;
        end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by p.chequedate';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
	else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    	if(exportXLSX is null or exportXLSX != 'true') then
			set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
     end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPposterdelete` (IN `poster_id` INT, IN `user_id` INT)  BEGIN

	update poster set
	deleted=1,
	modifiedbyid = user_id,
	modifiedbydate=now()
	where id=poster_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpostersave` (IN `poster_image` VARCHAR(300), IN `poster_createdbyid` INT, IN `client_id` INT)  BEGIN

	insert into poster(posterimage,createdbyid,createdbydate,clientid)
    values(poster_image,poster_createdbyid,now(),client_id);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpostersearch` (IN `id` INT)  BEGIN

	if id is not null then

		select p.id,p.posterimage
		from poster p
		where p.deleted = 0 and  p.id < id
		order by p.id desc limit 4;

	else

		select p.id,p.posterimage
		from poster p
		where p.deleted = 0 order by p.id desc limit 4;

	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductbulksaleonlinesave` (IN `product_id` LONGTEXT, IN `isEnable` TINYINT(1), IN `client_id` INT)  BEGIN

if isEnable = 1 then
    update product set enablesaleonline = 1 WHERE  clientid = client_id ;

else

    update product set enablesaleonline = 0 where clientid = client_id ;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductdelete` (IN `product_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
		update product set
		deleted=1,
        modifiedbyid = user_id,
		modifiedbydate=now()
		where id=product_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductquantitychange` (IN `product_id` INT, IN `product_quantity` INT, IN `client_id` INT)  BEGIN
		update product set
		quantity=quantity + product_quantity
		where id=product_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductsave` (IN `product_id` INT, IN `product_name` VARCHAR(100), IN `product_category` VARCHAR(100), IN `product_quantity` INT, IN `product_costprice` DECIMAL(12,2), IN `product_baseprice` DECIMAL(12,2), IN `product_price` DECIMAL(12,2), IN `product_description` VARCHAR(4000), IN `product_status` VARCHAR(30), IN `product_images` LONGTEXT, IN `client_id` INT, IN `user_id` INT, IN `product_taxcategoryid` INT, IN `product_branchid` VARCHAR(30), IN `product_iscomplimentaryproduct` TINYINT(1), IN `product_maxdiscountlimit` DECIMAL(12,2), IN `product_minsalesprice` DECIMAL(12,2), IN `product_enablesaleonline` TINYINT(1), IN `product_specialprice` DECIMAL(12,2))  BEGIN

	if product_id = 0 then

		insert into product(productname,category,quantity ,costprice,baseprice,price,
		description,status,images,clientid,createdbyid,createdbydate,taxcategoryid,branchid,
        iscomplimentaryproduct,maxdiscountlimit,minsalesprice,enablesaleonline,specialprice) values(
		product_name , product_category, product_quantity,product_costprice,product_baseprice,
		product_price,product_description , product_status ,product_images,client_id,user_id,now(),
        product_taxcategoryid,product_branchid,product_iscomplimentaryproduct,
        product_maxdiscountlimit,product_minsalesprice,product_enablesaleonline,product_specialprice);

	elseif product_id > 0 then
		update product
        set	 productname=product_name ,
		category=product_category,
        baseprice = product_baseprice,
        price=product_price,
		description=product_description ,
		status =product_status ,
        images =product_images ,
        modifiedbyid = user_id,
        modifiedbydate = now(),
		taxcategoryid = product_taxcategoryid,
        iscomplimentaryproduct = product_iscomplimentaryproduct,
        maxdiscountlimit = product_maxdiscountlimit,
        minsalesprice = product_minsalesprice,
		enablesaleonline = product_enablesaleonline,
        specialprice = product_specialprice
		where id =product_id and clientid=client_id;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid;

	set _offset = pageIndex * pageSize;


	set _columns = 'p.id,productname,category,quantity, costprice,p.baseprice,price,description,status,(status+0) statusId,images,
    CASE  WHEN  quantity = 0  THEN ''Out of Stock''
		 ELSE status end as ''status'',tax.taxgroupitem,(case when enablesaleonline = 1 then ''Enabled'' else ''Disabled'' end)enablesaleonline ';
    set _table = ' from product p
    left outer join taxcodecategory tcc on p.taxcategoryid = tcc.id
    left outer join tax on tax.id = tcc.taxgroupid ';

	set _where = concat(' where p.deleted = 0 and p.clientid = ', client_id , ' and p.branchid = ' , _branchid);

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' then
			if _id = 'category' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif 	_id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and CASE  WHEN  quantity = 0 THEN 3
					ELSE status end = ', _value));
            else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by p.deleted , p.id desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPproductview` (IN `product_id` INT, IN `client_id` INT)  BEGIN
	 select id,productname,category,(category+0)categoryId,quantity,costprice,baseprice,price,
     description,status,(status+0)statusId,images,taxcategoryid,branchid,iscomplimentaryproduct,maxdiscountlimit,
     minsalesprice,enablesaleonline,specialprice
	 from product
	 where id=product_id and clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushnotificationdietandwaterreminder` (IN `iswaterreminder` INT, IN `reminder_time` TIME, IN `mealtype` VARCHAR(50), IN `client_offsetvalue` INT)  BEGIN

	DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,_dietvalue varchar(500);

    set _value = CONCAT('{"time": ', '"' , reminder_time, '"' ,', "checked": true}' );

    set _columns = 'm.id,m.firstname as membername,m.clientid,';

    set _table = ' from member m ';

	set _where = concat(' where m.deleted = 0 and m.timezoneoffsetvalue = ' , client_offsetvalue , '
    and m.clientid in (select id from client where client.status = 1 ) ');

	if iswaterreminder = 1 then

		set _columns = CONCAT(_columns , CONCAT('m.waterreminder'));

		set _where = CONCAT(_where , CONCAT(' and ' ,
		'(m.waterreminder is not null and JSON_EXTRACT(waterreminder,''$.isreminderenabled'') = 1 and ', ' waterreminder ', ' like ''%', _value ,'%'')' ));

    else

		set _dietvalue = CONCAT('"name": ','"' , mealtype, '"' ,', "checked": true');

		set _columns = CONCAT(_columns , CONCAT('m.dietreminder'));

		set _where = CONCAT(_where , CONCAT(' and ' ,
		'(m.dietreminder is not null and JSON_EXTRACT(dietreminder,''$.isreminderenabled'') = 1 and ', ' dietreminder ', ' like ''%', _dietvalue ,'%''' ,' and dietreminder ', ' like ''%', _value ,'%'')' ));

    end if;

    set @_qry = CONCAT('select ' , _columns, _table ,_where);

    PREPARE stmt FROM @_qry;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushnotificationlogget` (IN `client_id` INT, IN `user_id` INT, IN `isuser` TINYINT(1), IN `notification_id` INT)  BEGIN

	if isuser = 1 then

		if notification_id is not null then

			select id,subject,content,createdbydate,isread from pushnotificationlog where fromclient = client_id
            and touser = user_id and  id < notification_id order by createdbydate desc,isread asc limit 10;

		else

			select id,subject,content,createdbydate,isread from pushnotificationlog where fromclient = client_id
            and touser = user_id order by createdbydate desc,isread asc limit 10;

		end if;

    elseif  isuser = 0 then

		if notification_id is not null then

			select id,subject,content,createdbydate from pushnotificationlog where fromclient = client_id
            and tomember = user_id and isread = 0 and  id < notification_id order by id desc limit 10;

		else

			select id,subject,content,createdbydate from pushnotificationlog where fromclient = client_id
            and tomember = user_id and isread = 0 order by id desc limit 10;

		end if;
    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushnotificationloggetnotificationcount` (IN `client_id` INT, IN `user_id` INT, IN `isuser` TINYINT(1))  BEGIN

	if isuser = 1 then

			select count(1) as notificationcount from pushnotificationlog where fromclient = client_id
            and touser = user_id and isread = 0;

    elseif isuser = 0 then

			select count(1) as notificationcount from pushnotificationlog where fromclient = client_id
            and tomember = user_id and isread = 0;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushnotificationlogread` (IN `client_id` INT, IN `user_id` INT, IN `isuser` TINYINT(1))  BEGIN

	if isuser = 1 then

		update pushnotificationlog
        set isread = 1
        where fromclient = client_id and touser = user_id;

    elseif  isuser = 0 then

		update pushnotificationlog
        set isread = 1
        where fromclient = client_id and tomember = user_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushnotificationlogsave` (IN `_clientid` INT, IN `_userid` INT, IN `_memberid` INT, IN `_subject` VARCHAR(200), IN `_content` VARCHAR(500), IN `_istemp` TINYINT(1), IN `_eventname` VARCHAR(200), IN `_broadcastid` INT)  BEGIN

	declare _logintype int;

		if _istemp = 1 then

			insert into pushnotificationlog_temp (fromclient,touser,tomember,subject,content,createdbydate)
			values (_clientid,_userid,_memberid,_subject,_content,now());

        else

			insert into pushnotificationlog (fromclient,touser,tomember,subject,content,createdbydate,
            eventname,broadcastid)
			values (_clientid,_userid,_memberid,_subject,_content,now(),_eventname,_broadcastid);

        end if;

		set _logintype = case when _userid is null then 1 else 0 end;

		 select subscriptionobject from pushsubscription where logintype = _logintype and userid = _memberid and clientid = _clientid;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushsubscriptionget` (IN `url_id` VARCHAR(100), IN `login_type` TINYINT, IN `client_id` INT, IN `user_id` INT)  BEGIN

	if(login_type is not null and user_id is not null and url_id is null and client_id is not null) then

        select subscriptionobject,clientid from pushsubscription where logintype = login_type and userid = user_id and clientid = client_id;

	elseif(login_type is not null and client_id is not null and user_id is not null) then

		select subscriptionobject from pushsubscription where clienturlid = url_id and logintype = login_type and clientid = client_id and userid = user_id;

	else

		select subscriptionobject from pushsubscription where clienturlid = url_id ;

	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPpushsubscriptionsave` (IN `subscription_object` LONGTEXT, IN `url_id` VARCHAR(100), IN `login_type` TINYINT, IN `client_id` INT, IN `user_id` INT, IN `iswithoauth` TINYINT)  BEGIN

	declare isExistid int default 0;

	if(iswithoauth = 0) then

		select id into isExistid from pushsubscription where clienturlid = url_id and logintype is null and clientid is null and userid is null;

        if(isExistid is not null and isExistid > 0) then

			update pushsubscription set subscriptionobject = subscription_object, date = now() where id = isExistid;

         else

			insert into pushsubscription (subscriptionobject,clienturlid, date) values (subscription_object , url_id, now());

         end if;


	elseif(iswithoauth = 1) then

		select id into isExistid from pushsubscription where clienturlid = url_id and logintype = login_type and clientid = client_id and userid = user_id;

        if(isExistid is not null and isExistid > 0) then

			update pushsubscription set subscriptionobject = subscription_object, date = now() where id = isExistid;

         else

			insert into pushsubscription (subscriptionobject,clienturlid , logintype , clientid , userid, date)
			values (subscription_object , url_id , login_type , client_id , user_id, now());
         end if;

    end if;



END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPquestiondelete` (IN `question_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN

	update questions set
	deleted=1, modifiedbyid = user_id, modifiedbydate = now()
	where id=question_id and clientid = client_id ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPquestionlibrary` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace  INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,questiontype,question,questionoption';
    set _table = ' from questions ';
    set _where = concat(' where deleted = 0 and clientid = 1');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'question' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

		 if _value != '' and _value != 'null' then

				if _id = 'questiontype' then
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
                else
					WHILE _totalspace > 0 DO

					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

					SET  _totalspace = _totalspace - 1;

					END WHILE;
                end if;

           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);


	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPquestionsave` (IN `question_id` INT, IN `question_type` VARCHAR(30), IN `question_name` VARCHAR(500), IN `question_option` LONGTEXT, IN `client_id` INT, IN `createdby_id` INT)  BEGIN

	 if question_id = 0 then

		insert into questions(questiontype,question,questionoption,createdbyid,createdbydate,clientid)
        values(question_type,question_name,question_option,createdby_id,now(),client_id);

    elseif question_id > 0 then

		update questions set
		questiontype=question_type ,
        question = question_name,
        questionoption = question_option,
        modifiedbyid = createdby_id ,
        modifiedbydate = now()
		where id =question_id and clientid=client_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPquestionsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace  INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = ' id,questiontype,question,questionoption';
    set _table = ' from questions ';
    set _where = concat(' where deleted = 0 and clientid = ', client_id);

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'question' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

		 if _value != '' and _value != 'null' then

				if _id = 'questiontype' then
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
                else
					WHILE _totalspace > 0 DO

					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

					SET  _totalspace = _totalspace - 1;

					END WHILE;
                end if;

           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);


	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPrecipedelete` (IN `recipe_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN
update recipe set
deleted=1, modifiedbyid = user_id, modifiedbydate = now()
where id=recipe_id and clientid = client_id ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPrecipelibrary` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _totalspace INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;

	set _columns = 'id,recipename,isnonveg,(isnonveg+0)isnonvegId,iseggfille,(iseggfille+0)iseggfilleId';
    set _table = ' from recipe ';
	set _where = concat(' where deleted = 0 and clientid = 1');

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'recipename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

		if _value != '' then
        if _id = 'isnonveg' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		elseif _id = 'iseggfille' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
  		else
				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;
    	end if;
        end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;


	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by recipename, length(recipename) ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPrecipesave` (IN `recipe_id` INT, IN `recipe_name` VARCHAR(200), IN `is_nonveg` VARCHAR(20), IN `is_eggfille` VARCHAR(20), IN `recipe_description` VARCHAR(8000), IN `recipe_tips` VARCHAR(3000), IN `recipe_video` VARCHAR(500), IN `recipe_image` VARCHAR(200), IN `client_id` INT, IN `createdby_id` INT, IN `recipe_time` VARCHAR(20), IN `recipe_nutriotion` LONGTEXT, IN `recipe_group` VARCHAR(50), IN `recipe_creditedto` VARCHAR(200))  BEGIN

	DECLARE isExist int default 0;

if recipe_id = 0 then

	select count(1) into isExist from recipe where recipename = recipe_name
	 and deleted = 0 and (clientid = client_id or clientid = 1) ;

    if isExist > 0 then
		Call `ERROR`('Recipe name already exists.');
    end if;

		insert into recipe(recipename,isnonveg ,iseggfille,
		image,description,recipevideo,tips,createdbyid,createdbydate,clientid,preparationtime,
        nutrition,recipegroup,creditedto)
        values(recipe_name, is_nonveg,is_eggfille ,recipe_image, recipe_description ,
		  recipe_video,recipe_tips ,createdby_id,now(),client_id,recipe_time,recipe_nutriotion,
          recipe_group,recipe_creditedto);


elseif recipe_id > 0 then

		select count(1) into isExist from recipe where recipename = recipe_name
		and (clientid = client_id or clientid =1) and deleted = 0 and id != recipe_id;

		if isExist > 0 then
		Call `ERROR`('Recipe name already exists.');
		end if;

		update recipe set
		recipename=recipe_name ,
		isnonveg=is_nonveg ,
        iseggfille=is_eggfille ,
		image=recipe_image ,
		description=recipe_description ,
        recipevideo=recipe_video ,
        tips=recipe_tips,
        modifiedbyid = createdby_id ,
        modifiedbydate = now(),
        preparationtime = recipe_time,
        nutrition = recipe_nutriotion,
        recipegroup = recipe_group,
        creditedto = recipe_creditedto
		where id =recipe_id and clientid=client_id;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPrecipesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_totalspace,
    _foodlibraryfilter , _customfoodfilter INT;
    DECLARE filtered, sorted , obj, startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.foodlibraryfilter'),JSON_EXTRACT(tableInfo,'$.customfoodfilter'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted , _foodlibraryfilter , _customfoodfilter ,
    client_offsetvalue;

	set _offset = pageIndex * pageSize;
	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = concat(' r.id,r.recipename,r.isnonveg,(r.isnonveg+0) isnonvegId,r.iseggfille,
    (r.iseggfille+0) iseggfilleId, r.image ,
    r.recipegroup,(r.recipegroup+0)recipegroupId,
			concat(u.firstname ,'' '' , u.lastname) createdby,r.createdbydate,
			concat(um.firstname ,'' '' , um.lastname) modifiedby,r.modifiedbydate,
            r.clientid  ,' , client_id , ' requestclientid');
    set _table = ' from recipe r
			inner join user u on r.createdbyid = u.id
			left outer join user um on r.modifiedbyid = um.id ';
    set _where = concat(' where r.deleted = 0 ');

	if _foodlibraryfilter = 1 and _customfoodfilter = 1 then
			set _where = concat(_where , ' and (r.clientid = ', client_id ,' or r.clientid = 1)');
    elseif _foodlibraryfilter = 1 then
			set _where = concat(_where , ' and r.clientid = 1 ');
	elseif _customfoodfilter = 1 then
			set _where = concat(_where , ' and r.clientid = ', client_id);
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        SET _totalspace = 0;
        if _id = 'recipename' then
            SET _totalspace = length(_value) - length(replace(_value,' ', '')) + 1;
        end if;

	 if _value != '' and _value != 'null' then
		if _id= 'iseggfille' or _id= 'recipegroup' or _id = 'isnonveg' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
	    elseif _id= 'createdbydate' or _id= 'modifiedbydate' then
				  set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(r.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id= 'createdby' then
			      set _where = CONCAT(_where , CONCAT(' and concat(u.firstname,'' '',u.lastname) like ''%', _value ,'%'''));
        elseif _id= 'modifiedby' then
			      set _where = CONCAT(_where , CONCAT(' and concat(um.firstname,'' '',um.lastname) like ''%', _value ,'%'''));
		else
				WHILE _totalspace > 0 DO

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', SPLIT_STR(_value,' ', _totalspace) ,'%'''));

                SET  _totalspace = _totalspace - 1;

				END WHILE;
        end if;
           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by r.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);


	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPrecipeview` (IN `recipe_id` INT, IN `client_id` INT)  BEGIN
	 select id,recipename,isnonveg,(isnonveg+0)isnonvegId,iseggfille,(iseggfille+0)iseggfilleId,image,description,recipevideo,tips,
     preparationtime,nutrition,recipegroup,creditedto
	 from recipe
	 where id=recipe_id and deleted = 0;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPresultandtestimonialbulkpublishingstatussave` (IN `resultandtestimonial_id` LONGTEXT, IN `isEnable` TINYINT(1), IN `client_id` INT)  BEGIN

 if isEnable = 1 then
    update resultandtestimonial set publishingstatus = 1 WHERE  clientid = client_id and
    deleted = 0;

 else

    update resultandtestimonial set publishingstatus = 0 where clientid = client_id and
    deleted = 0 ;

 end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPresultandtestimonialdelete` (IN `resultandtestimonial_id` INT, IN `user_id` INT)  BEGIN

	update resultandtestimonial set
	deleted = 1,
	modifiedbyid = user_id,
	modifiedbydate = now()
	where id=resultandtestimonial_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPresultandtestimonialsave` (IN `resultandtestimonial_id` INT, IN `resultandtestimonial_of` VARCHAR(10), IN `resultandtestimonial_employee_id` VARCHAR(50), IN `resultandtestimonial_member_id` VARCHAR(50), IN `resultandtestimonial_beforeimage` VARCHAR(200), IN `resultandtestimonial_afterimage` VARCHAR(200), IN `resultandtestimonial_resultachievedindays` VARCHAR(20), IN `resultandtestimonial_resulttype` VARCHAR(400), IN `resultandtestimonial_resultdata` VARCHAR(400), IN `resultandtestimonial_testimonialwords` VARCHAR(600), IN `resultandtestimonial_testimoniallink` VARCHAR(300), IN `resultandtestimonial_publishingstatus` TINYINT(1), IN `resultandtestimonial_publishstartdate` DATE, IN `resultandtestimonial_publishenddate` DATE, IN `user_id` INT, IN `client_id` INT, IN `branch_id` INT)  BEGIN
DECLARE isConfigurationMaximum int DEFAULT 0;
DECLARE isPublishingMaximum int DEFAULT 0;

	if resultandtestimonial_id = 0 then

		SELECT count(1) into isConfigurationMaximum FROM resultandtestimonial where
        clientid = client_id and branchid = branch_id and deleted = 0 ;

        if isConfigurationMaximum >= 20  then
			Call `ERROR` ('You can configure max 20 active result/testimonial only.');
		end if;

		SELECT count(1) into isPublishingMaximum FROM resultandtestimonial where
        clientid = client_id and branchid = branch_id and deleted = 0
        and publishingstatus = 1;

		if isPublishingMaximum >= 10  then
			Call `ERROR` ('You can publish max 10 active result/testimonial only.');
		end if;

			insert into resultandtestimonial(resultof,res_employeeid,res_memberid,beforeimage,
            afterimage,resultachieveindays,resulttype,resultdata,testimonialwords,testimoniallink,
            publishingstatus,publishstartdate,publishenddate,
            clientid,createdbyid,createdbydate,branchid)
			values(resultandtestimonial_of, resultandtestimonial_employee_id,resultandtestimonial_member_id,
            resultandtestimonial_beforeimage,resultandtestimonial_afterimage,resultandtestimonial_resultachievedindays,
            resultandtestimonial_resulttype,resultandtestimonial_resultdata,
            resultandtestimonial_testimonialwords,resultandtestimonial_testimoniallink,
            resultandtestimonial_publishingstatus,resultandtestimonial_publishstartdate,
            resultandtestimonial_publishenddate,client_id,user_id,now(),branch_id);

    elseif resultandtestimonial_id  > 0 then

		SELECT count(1) into isPublishingMaximum FROM resultandtestimonial where
        clientid = client_id and branchid = branch_id and deleted = 0
        and publishingstatus = 1 and id !=resultandtestimonial_id;

		if isPublishingMaximum >= 10  then
			Call `ERROR` ('You can publish max 10 active result/testimonial only.');
		end if;

		update resultandtestimonial set
		resultof = resultandtestimonial_of,
        beforeimage = resultandtestimonial_beforeimage ,
        afterimage = resultandtestimonial_afterimage,
        resultachieveindays = resultandtestimonial_resultachievedindays,
        resulttype = resultandtestimonial_resulttype,
        resultdata = resultandtestimonial_resultdata,
        testimonialwords = resultandtestimonial_testimonialwords,
        testimoniallink = resultandtestimonial_testimoniallink,
        publishingstatus = resultandtestimonial_publishingstatus,
        publishstartdate = resultandtestimonial_publishstartdate,
        publishenddate = resultandtestimonial_publishenddate,
		modifiedbyid = user_id,
		modifiedbydate = now()
		where id = resultandtestimonial_id and clientid=client_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPresultandtestimonialsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _totalspace INT;
    DECLARE filtered, sorted , obj,_exerciselist LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table ,_branchid varchar(5000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = concat('r.id,resultof,
    (case when resultof = 1 then concat(ref_u.firstname,'' '',ref_u.lastname)
    when resultof = 2 then concat(ref_m.firstname,'' '',ref_m.lastname)
    else '''' end) name,
	case when publishingstatus = 1 then "Yes" else "No" end publishingstatus,
    publishstartdate,publishenddate ');
    set _table = concat(' from resultandtestimonial r
    left outer join user ref_u ON r.res_employeeid = ref_u.id
    left outer join member ref_m ON r.res_memberid = ref_m.id');
	set _where = concat(' where r.deleted = 0 and r.clientid = ', client_id ,
    ' and r.branchid = ', _branchid);

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
		  if _id = 'resultof' then
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'publishstartdate' or _id = 'publishenddate' then
			set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
		  elseif _id = 'publishingstatus' then
			 if _value = 1 then
				set _where = concat(_where , ' and publishingstatus = 1');
			 elseif _value = 2 then
				set _where = concat(_where , ' and publishingstatus = 0');
			end if;
		  else
			set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	      end if;
    	end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by r.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPresultandtestimonialview` (IN `resultandtestimonial_id` INT)  BEGIN

	select r.id,resultof,(resultof+0)resultofId,res_employeeid,res_memberid,beforeimage,
	afterimage,resultachieveindays,resulttype,resultdata,testimonialwords,testimoniallink,
	publishingstatus,publishstartdate,publishenddate,
    concat(ref_u.firstname,' ',ref_u.lastname) as staffname,
    concat(ref_m.firstname,' ',ref_m.lastname) as membername
	from resultandtestimonial r
    left outer join user ref_u ON r.res_employeeid = ref_u.id
    left outer join member ref_m ON r.res_memberid = ref_m.id
    where r.id=resultandtestimonial_id and r.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USProledelete` (IN `role_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
update role set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where id=role_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USProlelist` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE  client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into client_id, filtered, sorted;

	set _columns = ' id, role as label,alias as rolealias';
    set _table = concat(' from (select * from  role where clientid = ', client_id ,' and deleted = 0
union
select * from  role where clientid = 1  and deleted = 0 and id not in (
select default_t.id  from  role default_t
inner join role client_t
on default_t.alias = client_t.alias and default_t.role = client_t.role
where default_t.clientid = 1
and client_t.clientid = ',client_id,' and client_t.alias is not null and default_t.id <> client_t.id
)) role ');

	set _where = concat(' where alias != ''systemadmin'' ');
SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
      	SET  i = i + 1;
	END WHILE;


  	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;




END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USProlerestore` (IN `role_alias` VARCHAR(30))  BEGIN

	select modules from role where clientid = 1 and alias = role_alias and deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USProlesave` (IN `role_id` INT, IN `role_name` VARCHAR(200), IN `role_alias` VARCHAR(200), IN `role_modules` LONGTEXT, IN `role_additionalrights` LONGTEXT, IN `role_createdbyid` INT, IN `client_id` INT)  BEGIN
DECLARE roleid int default 0;
DECLARE isExit  int DEFAULT 0;
DECLARE old_roleid int default 0;


	if role_id = 0 then
		SELECT count(1) into isExit FROM role where role = role_name and (clientid = 1 or clientid = client_id) and deleted = 0;

		if isExit > 0
		then
			Call `ERROR` ('Role Already exists.');
		end if;

		insert into role(role,modules,
        createdbyid,createdbydate,clientid,additionalrights)
		values(role_name,role_modules,
		role_createdbyid,now(),client_id,role_additionalrights);

	elseif role_id > 0 then

       if role_alias is not null then

						select id into roleid from role
						where alias=role_alias and clientid=client_id limit 1;

						if roleid is not null and roleid > 0 then
							update role set
							role = role_name,
							modules= role_modules,
                            additionalrights = role_additionalrights,
							modifiedbyid =role_createdbyid,
							modifiedbydate =now()
							where id=roleid and clientid=client_id;

						else

							insert into role(role,modules,
							createdbyid,createdbydate,clientid,alias,additionalrights)
							values(role_name,role_modules,
							role_createdbyid,now(),client_id,role_alias,role_additionalrights);

							select LAST_INSERT_ID() into roleid;

							select id into old_roleid from role
							where alias=role_alias and clientid = 1 limit 1;

							update user set assignrole = roleid where clientid = client_id and assignrole = old_roleid;

						end if;
             else

					update role set
                    role = role_name,
					modules= role_modules,
					additionalrights = role_additionalrights,
					modifiedbyid =role_createdbyid,
					modifiedbydate =now()
					where id=role_id and clientid=client_id;

			end if;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USProlesearch` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;
	set _columns = 'id,role,alias,modules,additionalrights ';
    set _table = concat(' from (select * from  role where clientid = ', client_id ,' and deleted = 0
union
select * from  role where clientid=1  and deleted = 0 and id not in (
select default_t.id  from  role default_t
inner join role client_t
on default_t.alias = client_t.alias and default_t.role = client_t.role
where default_t.clientid=1
and client_t.clientid = ', client_id ,' and client_t.alias is not null and default_t.id <> client_t.id
)) role ');

	set _where = concat(' where deleted = 0 ');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
		if _value != '' and _value != 'null' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	    end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsalesinvoicesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize,pageIndex,client_id, _offset,i, _length ,_filterwith INT;
    DECLARE filtered,sorted, obj ,startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value,_orderby,_limit, _table,exportXLSX,_sendmail,_branchid,
    client_offsetvalue varchar(800);
	DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.sendMail'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.filterwith'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, startdate,enddate,exportXLSX,pageIndex, client_id, filtered, sorted ,_sendmail,_branchid,
    _filterwith,client_offsetvalue ;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _offset = pageIndex * pageSize;

	set _columns = ' i.id,i.createdbydate,taxinvoicecode,invoicecode,creditforinvoiceid,
    concat(m.firstname,'' '',m.lastname) membername,membercode,(select sum(baseprice + ifnull(taxamount,0)) from
    invoiceitem where invoiceid = i.id) totalamount,case when creditforinvoiceid then "Credit Note"
    else "Invoice" end type,(select sum(ref_i.amount - ref_i.paymentamount) from installment ref_i
    where i.id = ref_i.invoiceid and installmentstatus != 2)dues,i.date,concat(u.firstname,'' '',u.lastname) name,
    case when i.taxinvoicecode then "Yes" else "No" end istaxinvoice , concat(s.firstname,'' '',s.lastname) salesby ';

    set _table = ' from invoice i
                    INNER JOIN member m ON i.memberid = m.id
                    LEFT OUTER JOIN user u ON i.createdbyid = u.id
                    LEFT OUTER JOIN user s ON i.salesbyid = s.id ';
	set _where = concat(' where i.clientid = ', client_id , ' and  i.branchid = ', _branchid );

	if _filterwith = 1 then
			set _where = concat(_where , ' and date(getDateFromUTC(i.createdbydate,''', client_offsetvalue ,''',-1)) BETWEEN date(',startdate,') AND date(',enddate,')');
   elseif _filterwith = 2 then
			set _where = concat(_where , ' and date(i.date) BETWEEN date(getDateFromUTC(',startdate,',''+00:00'',0)) AND date(getDateFromUTC(',enddate,',''+00:00'',0))');
    end if;

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
	   SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
	    select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
			if _id = 'createdbydate' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(i.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            elseif _id= 'membername' then
				set _where = CONCAT(_where , CONCAT(' and concat(m.firstname,'' '',m.lastname) like ''%', _value ,'%'''));
			elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and m.', _id , ' like ''%', _value ,'%'''));
		 	elseif _id = 'date' then
				 set _where = CONCAT(_where , CONCAT(' and date(i.', _id , ') = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
			elseif _id= 'name' then
				set _where = CONCAT(_where , CONCAT(' and concat(u.firstname,'' '',u.lastname) like ''%', _value ,'%'''));
            elseif _id= 'salesby' then
				set _where = CONCAT(_where , CONCAT(' and concat(s.firstname,'' '',s.lastname) like ''%', _value ,'%'''));
			elseif _id = 'type' then
				 if _value = 1 then
						set _where = concat(_where , ' and creditforinvoiceid is null');
				elseif _value = 2 then
					 set _where = concat(_where , ' and creditforinvoiceid is not null');
               end if;

         elseif _id = 'totalamount' then
				set _where = CONCAT(_where , CONCAT(' and ((select sum(baseprice + ifnull(taxamount,0)) from  invoiceitem where invoiceid = i.id) >= ', _value ,')'));
         elseif _id = 'dues' then
				set _where = CONCAT(_where , CONCAT(' and ((select sum(ref_i.amount - ref_i.paymentamount) from installment ref_i where i.id = ref_i.invoiceid and installmentstatus != 2) >= ', _value ,')'));

         elseif _id = 'istaxinvoice' then
				 if _value = 1 then
						set _where = concat(_where , ' and i.taxinvoicecode is not null');
				 elseif _value = 2 then
					 set _where = concat(_where , ' and i.taxinvoicecode is null');
                end if;

         else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
			end if;
    	end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(exportXLSX = 'true' or _sendmail = 'true') then
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
    else
	  set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
    end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'',sum((select sum(baseprice + ifnull(taxamount,0)) from
    invoiceitem where invoiceid = i.id and creditforinvoiceid is null )) ''totalinvoice'',sum((select sum(baseprice + ifnull(taxamount,0)) from
    invoiceitem where invoiceid = i.id and creditforinvoiceid is not null )) ''totalcreditnoteamount'',ceil(count(1)/', pageSize ,') ''pages''',
    _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsalesmemberview` (IN `_memberid` INT, IN `client_id` INT, IN `servicetype_id` INT)  BEGIN

	DECLARE _maxactivationdate date DEFAULT NULL ;

    if servicetype_id != '' && servicetype_id is not null && servicetype_id = 1 then
		select max(expirydatesubscription) into _maxactivationdate from subscription s
		left outer join service on s.serviceplan = service.id
        where member = _memberid and service.servicetype = cast(servicetype_id as unsigned);
    end if;

	select m.id,m.firstname,m.fathername ,m.lastname,gender,(gender + 0) genderId,panno,
    image,concat(m.firstname, ' ' , m.lastname) as name,m.phone,m.mobile,personalemailid,
    m.address1,m.address2 ,isWhatsappenabled,balance,m.city,m.pincode,s.name 'state',
    c.name 'country',c.code 'countrycode',c.languagecode 'languagecode',membercode,m.area,m.gstin,
    _maxactivationdate 'maxactivationdate',m.salesbyid
	from member m
	left outer join country c on m.country = c.code
	left outer join state s on m.state = s.id
	where m.id=_memberid and m.clientid = client_id and m.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsalespackagesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length, _branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,isExpressSale,client_offsetvalue varchar(5000);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.isExpressSale'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid,isExpressSale,client_offsetvalue;


	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);
	set _columns = 'ref_p.id,packagename,ref_p.specialprice,ref_p.servicevalidity,ref_p.status,ref_p.applicablefor,
                    ( select JSON_ARRAYAGG(json_object(''packageid'',pt.packageid,''serviceid'', pt.serviceid,''objectID'', pt.serviceid,''servicetypeId'',(s.servicetype + 0),
                    ''name'',s.servicename,''price'',s.price,
                    ''specialprice'',pt.specialprice,''Quantity'',pt.quantity,''description'',s.description,''consume'', 1
                     ,''totalPrice'', pt.specialprice,''packagename'',ref_p.packagename,''totalquantity'',pt.quantity,''isService'', 1,
                     ''duration'',s.duration,''taxgroupitem'',t.taxgroupitem
                    ,''taxcategoryid'',s.taxcategoryid,''taxname'',t.taxname,
                    ''taxpercentage'',t.percentage,''baseprice'',s.baseprice,''durationcount'',durationcount,
                    ''measurementunit'',measurementunit,''activity'',activity,''activitytypeId'',(activity + 0),
                    ''sessioncount'',sessioncount,''applicablefor'',s.applicablefor,''sessiontype'',
                    (case when sessiontype = 0 then ''All'' else ref_s.sessiontypename end),''launchdate'',
                    s.launchdate,''expirydate'',s.expirydate,''iscomplimentaryservice'',s.iscomplimentaryservice,
                    ''maxdiscountlimit'',s.maxdiscountlimit,''minsalesprice'',s.minsalesprice,''sessioncount'',
                    s.sessioncount,''servicetype'',servicetype))
				    from packageitem pt
				    left outer join service s on pt.serviceid = s.id and s.deleted = 0
                     left outer join sessiontype ref_s on s.sessiontype = ref_s.id
					left outer join taxcodecategory ref_t on s.taxcategoryid = ref_t.id
                  left outer join tax t on ref_t.taxgroupid = t.id
				     where pt.deleted = 0 and packageid = ref_p.id
				     )
				      packageitem , ref_p.servicevalidity,ref_p.launchdate,ref_p.expirydate ';
      set _table = concat(' from package ref_p');

	set _where = concat(' where ref_p.deleted = 0 and ref_p.status = 1 and (servicevalidity = 1 or
    (servicevalidity = 2 and date(getDateFromUTC(now(),''',client_offsetvalue,''',-1)) between launchdate and expirydate)) and ref_p.clientid = ', client_id, ' and
	(case when enablesharetoallbranches = 0 then json_search(ref_p.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' then
			  if _id = 'applicablefor' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
             else

				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
                 end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by ref_p.deleted , ref_p.packagename ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	if(isExpressSale = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
    else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

     PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	if(isExpressSale is null or isExpressSale != 'true') then
		set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsalesproductsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid,
    _enablecomplimentarysale INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,isExpressSale varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.isExpressSale'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.enablecomplimentarysale')
    into pageSize, pageIndex, client_id, filtered, sorted,isExpressSale,_branchid,_enablecomplimentarysale;

	set _offset = pageIndex * pageSize;


	set _columns = 'p.id,p.productname,p.category,p.quantity,p.costprice,p.price,p.baseprice,p.description,p.status,p.images,
                    t.taxgroupitem,taxcategoryid,t.taxname,t.percentage as taxpercentage,
                    p.iscomplimentaryproduct,p.maxdiscountlimit,p.minsalesprice,specialprice';
    set _table = ' from product p
				  left outer join taxcodecategory ref_t on p.taxcategoryid = ref_t.id
                  left outer join tax t on ref_t.taxgroupid = t.id';
	set _where = concat(' where p.deleted = 0 and p.status = 1 and p.branchid = ', _branchid , ' and p.clientid = ', client_id);

	if _enablecomplimentarysale = 0 then
		set _where = concat(_where , ' and p.iscomplimentaryproduct = 0');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' then
			if _id = 'category' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif 	_id = 'status' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id = 'productname' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
		    else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by p.deleted , p.productname ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(isExpressSale = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    if(isExpressSale is null or isExpressSale != 'true') then
		set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsalesservicesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid , _enablecomplimentarysale INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _where, _id, _value, _orderby, _limit, _table,isExpressSale,client_offsetvalue varchar(500);
	DECLARE _columns varchar(800);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.isExpressSale'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.enablecomplimentarysale'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,isExpressSale,_branchid,_enablecomplimentarysale,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = ' s.id,servicename,price,measurementunit,activity, (activity + 0) activitytypeId,
    sessioncount,durationcount,duration,servicetype, (servicetype + 0) servicetypeId,
    applicablefor,(case when sessiontype = 0 then ''All'' else ref_s.sessiontypename end) ''sessiontype'',servicevalidity,measurementunit,s.images, (sessiontype) sessiontypeId,
    launchdate,expirydate,taxcategoryid,t.taxname,t.percentage as taxpercentage,t.taxgroupitem,
    concat(servicename,'' - '',durationcount, '' '' ,duration) label , (s.id) serviceId ,
    s.iscomplimentaryservice,maxdiscountlimit,minsalesprice,specialprice,sessioncount,
    s.membershipaccesslimit';
    set _table = ' from service s
				   left outer join sessiontype ref_s on s.sessiontype = ref_s.id
                   left outer join taxcodecategory ref_t on s.taxcategoryid = ref_t.id
				   left outer join tax t on ref_t.taxgroupid = t.id';
	set _where = concat(' where s.deleted = 0 and s.status = 1 and (servicevalidity = 1 or
    (servicevalidity = 2 and date(getDateFromUTC(now(),''',client_offsetvalue,''',-1)) between launchdate and expirydate)) and s.clientid = ', client_id , ' and
	(case when enablesharetoallbranches = 0 then json_search(s.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

	if _enablecomplimentarysale = 0 then
		set _where = concat(_where , ' and s.iscomplimentaryservice = 0');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' then
		  if _id = 'measurementunit' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id= 'sessiontype' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id= 'activity' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
          elseif _id = 'duration' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'servicetype' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'applicablefor' then
                set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		  elseif _id = 'servicename' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
             else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
          end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by s.deleted, servicename ';
    end if;

			set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(isExpressSale = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		 set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(isExpressSale is null or isExpressSale != 'true') then
		set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPSchedulesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length,_branchid,_logintype INT;
    DECLARE filtered, obj , _weekstart,_weekend LONGTEXT;
    DECLARE _columns, _id, _value, _table varchar(500);
    DECLARE _where varchar(700);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.weekstart'),
    JSON_EXTRACT(tableInfo,'$.weekend'),
    JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.logintype')
    into client_id, filtered,_weekstart,_weekend ,_branchid,_logintype;


	set _columns = ' c.id,c.trainer,concat(firstname,'' '',lastname) as name,c.sessiontype,(c.sessiontype+0)sessiontypeId,
    c.schedule ,c.startdate , c.enddate , c.classname, gender, (gender + 0) genderId , user.image ,
    c.chargescategory , (c.chargescategory+0) chargescategoryId , c.classtype ,
    (c.classtype + 0) classtypeId , c.maxoccupancy ,c.images as classimage';
    set _table = ' from class c
    INNER JOIN user ON c.trainer = user.id';
	set _where = concat(' where c.deleted = 0 and c.status = 1 and c.clientid = ', client_id , '
    and c.branchid = ', _branchid , '
	and ((c.startdate BETWEEN date(getDateFromUTC(',_weekstart,',''+00:00'',0)) AND date(getDateFromUTC(',_weekend,',''+00:00'',0)))
    or (c.enddate BETWEEN date(getDateFromUTC(',_weekstart,',''+00:00'',0)) AND date(getDateFromUTC(',_weekend,',''+00:00'',0)))
    or (c.startdate < date(getDateFromUTC(',_weekstart,',''+00:00'',0)) AND c.enddate > date(getDateFromUTC(',_weekend,',''+00:00'',0))))');

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPselecteduserschudule` (IN `user_id` INT)  BEGIN

select schedule from user u where id = user_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsequencesave` (IN `employee_code` VARCHAR(100), IN `member_code` VARCHAR(100), IN `enquiry_code` VARCHAR(100), IN `client_hidememberbalanceandtransactions` TINYINT(1), IN `clientid` INT)  BEGIN
 DECLARE CT_COUNT int default 0 ;
 DECLARE type_code varchar(100) ;

 SET employee_code = UPPER(employee_code);
 SET member_code = UPPER(member_code);
 SET enquiry_code = UPPER(enquiry_code);

	update client set hidememberbalanceandtransactions = client_hidememberbalanceandtransactions
    where id = clientid;

	select count(1) into CT_COUNT from sequence where client_id = clientid and alias = 'employee';

	if employee_code != '' && employee_code is not null && employee_code != 'null' then
		if CT_COUNT = 0
		then
			insert into sequence(alias, name,type,value,length, client_id, code)
						select alias, name, replace(type, code , employee_code) ,0 value, length, clientid 'client_id', employee_code from sequence
						where alias = 'employee' and client_id = 1;

		else
		set type_code = (select code from sequence
						where alias = 'employee' and client_id = 1);
		update sequence  set type = replace(type, (type_code) , employee_code) ,code = employee_code where client_id = clientid and alias = 'employee' and code is  null;
		end if;
    end if;

    set CT_COUNT = 0;

select count(1) into CT_COUNT from sequence where client_id = clientid and alias = 'member';

	if member_code != '' && member_code is not null && member_code != 'null' then
		if CT_COUNT = 0
		then
		   insert into sequence(alias, name,type,value,length, client_id, code)
						select alias, name, replace(type, code , member_code) ,0 value, length, clientid 'client_id', member_code from sequence
						where alias = 'member' and client_id = 1;
		  else
		   set type_code = (select code from sequence
						where alias = 'member' and client_id = 1);

			update sequence set type = replace(type, (type_code) , member_code) ,code = member_code where client_id = clientid and alias = 'member' and code is  null;
		end if;
    end if;

 set CT_COUNT = 0;

 select count(1) into CT_COUNT from sequence where client_id = clientid and alias = 'enquiry';

	if enquiry_code != '' && enquiry_code is not null && enquiry_code != 'null' then
		if CT_COUNT = 0
		then
		   insert into sequence(alias, name,type,value,length, client_id, code)
						select alias, name, replace(type, code , enquiry_code) ,0 value, length, clientid 'client_id', enquiry_code from sequence
						where alias = 'enquiry' and client_id = 1;
		  else
		   set type_code = (select code from sequence
						where alias = 'enquiry' and client_id = 1);

			update sequence set type = replace(type, (type_code) , enquiry_code) ,code = enquiry_code where client_id = clientid and alias = 'enquiry' and code is  null;
		end if;
    end if;


	   set type_code = (select code from sequence
					where alias = 'paymentRqNo' and client_id = 1);
		update sequence set type = replace(type, (type_code) , clientid) ,code = clientid where client_id = clientid and alias = 'paymentRqNo' and code is  null;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsequenceview` (IN `clientid` INT)  BEGIN
select  code as employeecode from sequence
 where client_id=clientid  and alias = 'employee';

 select  code as membercode from sequence
 where client_id=clientid  and alias = 'member';

 select  code as enquirycode from sequence
 where client_id=clientid  and alias = 'enquiry';

 select  hidememberbalanceandtransactions from client
 where id=clientid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPservicebulksaleonlinesave` (IN `services_id` LONGTEXT, IN `isEnable` TINYINT(1), IN `client_id` INT)  BEGIN

if isEnable = 1 then
    update service set enablesaleonline = 1 WHERE  clientid = client_id;

else

    update service set enablesaleonline = 0 where clientid = client_id ;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPservicedelete` (IN `product_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN

  DECLARE isExit int DEFAULT 0;

	SELECT count(1) into isExit FROM subscription where serviceplan = product_id;
	if isExit > 0
	then
       Call `ERROR` ('Service can\'t be deleted.');
	end if;


update service set
deleted=1,
modifiedbyid = user_id,
modifiedbydate=now()
where id=product_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPservicesave` (IN `product_id` INT, IN `product_type` VARCHAR(20), IN `product_activity` VARCHAR(30), `product_status` VARCHAR(10), `product_applicablefor` VARCHAR(10), `product_name` VARCHAR(100), `product_description` VARCHAR(500), `product_measurementunit` VARCHAR(20), `product_durationcount` VARCHAR(10), `product_duration` VARCHAR(10), `product_sessioncount` VARCHAR(10), `product_baseprice` DECIMAL(12,2), `product_price` DECIMAL(12,2), `product_sessiontype` VARCHAR(20), `product_productvalidity` VARCHAR(10), `product_launchdate` DATE, `product_expirydate` DATE, `product_images` LONGTEXT, `product_createdbyid` INT, IN `client_id` INT, IN `service_taxcategoryid` INT, IN `service_branchname` LONGTEXT, IN `service_enablesharetoallbranches` TINYINT(1), IN `service_iscomplimentaryservice` TINYINT(1), IN `service_maxdiscountlimit` DECIMAL(12,2), IN `service_minsalesprice` DECIMAL(12,2), IN `service_enablesaleonline` TINYINT(1), IN `service_enablesaleonceinlifetime` TINYINT(1), IN `service_parallelplan` INT, IN `service_specialprice` DECIMAL(12,2), IN `service_membershipaccesslimit` INT)  BEGIN
DECLARE isExit int DEFAULT 0;
DECLARE _parallelplanid int;

SET product_sessioncount = if(product_measurementunit = 2,product_sessioncount , null);

if product_id = 0 then

	SELECT count(1) into isExit FROM service where trim(servicename) = trim(product_name) and deleted = 0 and clientid = client_id;

	if isExit > 0
	then
        Call `ERROR` ('Service Name Already exists.');
	end if;

	insert into service(servicetype ,activity,status ,applicablefor ,servicename ,description ,measurementunit ,
    durationcount ,duration ,sessioncount,baseprice,price,sessiontype,clientid,createdbyid,createdbydate,
    servicevalidity,launchdate,expirydate,images,taxcategoryid,branchid,enablesharetoallbranches,iscomplimentaryservice,
    maxdiscountlimit,minsalesprice,enablesaleonline,enablesaleonceinlifetime,parallelplan,specialprice,
    membershipaccesslimit)
	values(product_type,product_activity,product_status,product_applicablefor,product_name,product_description,
	product_measurementunit,product_durationcount,product_duration,product_sessioncount,product_baseprice,product_price,product_sessiontype,
	client_id,product_createdbyid,now(),product_productvalidity,product_launchdate,
	product_expirydate,product_images,service_taxcategoryid,service_branchname,service_enablesharetoallbranches,
    service_iscomplimentaryservice,service_maxdiscountlimit,service_minsalesprice,
    service_enablesaleonline,service_enablesaleonceinlifetime,service_parallelplan,service_specialprice,
    service_membershipaccesslimit);

	SELECT LAST_INSERT_ID() into _parallelplanid;

    if service_parallelplan is not null or service_parallelplan != '' then
		update service set parallelplan = _parallelplanid,
        enablesaleonceinlifetime = 1
        where id = service_parallelplan;
    end if;

	elseif product_id  > 0 then

	SELECT count(1) into isExit FROM service where servicename = product_name and deleted = 0 and id !=product_id and clientid = client_id;

	if isExit > 0 then
        Call `ERROR` ('Service Name Already exists.');
	end if;

	update service set
	servicetype =product_type,
	activity = product_activity,
	status=product_status,
	applicablefor=product_applicablefor,
	servicename=product_name,
	description=product_description,
	measurementunit=product_measurementunit,
	durationcount=product_durationcount,
	duration=product_duration,
	sessioncount=product_sessioncount,
    baseprice=product_baseprice,
	price=product_price,
	sessiontype=product_sessiontype,
	modifiedbyid=product_createdbyid,
	modifiedbydate=now(),
	servicevalidity=product_productvalidity,
	launchdate=product_launchdate,
	expirydate=product_expirydate,
	images = product_images,
    taxcategoryid = service_taxcategoryid,
    branchid = service_branchname,
    enablesharetoallbranches = service_enablesharetoallbranches,
    iscomplimentaryservice = service_iscomplimentaryservice,
    maxdiscountlimit = service_maxdiscountlimit,
    minsalesprice = service_minsalesprice,
    enablesaleonline = service_enablesaleonline,
    enablesaleonceinlifetime = service_enablesaleonceinlifetime,
    parallelplan = service_parallelplan,
    specialprice = service_specialprice,
    membershipaccesslimit = service_membershipaccesslimit
	where id =product_id and clientid=client_id;

    if service_parallelplan is not null or service_parallelplan != '' then
		update service set parallelplan = product_id ,
        enablesaleonceinlifetime = 1
        where id = service_parallelplan;
    end if;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPservicesearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,exportXLSX,client_offsetvalue varchar(800);
    DECLARE IsDesc TINYINT(1);
	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = concat(' s.id,s.servicename,s.price,s.baseprice,s.measurementunit,s.activity,
    s.sessioncount,s.durationcount,s.duration,s.servicetype,s.applicablefor,s.sessiontype,s.servicevalidity,
    s.measurementunit,s.launchdate,s.expirydate,tax.taxgroupitem,
    CASE  WHEN  s.servicevalidity = 2 and (s.launchdate > date(getDateFromUTC(now(),''',client_offsetvalue,''',-1)) or s.expirydate < date(getDateFromUTC(now(),''',client_offsetvalue,''',-1)) )  THEN  2
    ELSE (s.status+0) end as statusId,(case when s.enablesaleonline = 1 then ''Enabled'' else ''Disabled'' end)enablesaleonline ,
	st.sessiontypename, ps.servicename parallelplan,s.status ');
    set _table = ' from service s
    left outer join taxcodecategory tcc on s.taxcategoryid = tcc.id
	left outer join tax on tax.id = tcc.taxgroupid
    left outer join sessiontype st on s.sessiontype = st.id
    left outer join service ps on s.parallelplan = ps.id ';
   set _where = concat(' where s.deleted = 0 and s.clientid = ', client_id , ' and
	(case when s.enablesharetoallbranches = 0 then json_search(s.branchid, ''one'' , ' , _branchid ,') is not null else 1=1 end)');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' then
		  if _id = 'measurementunit' then
                set _where = CONCAT(_where , CONCAT(' and s.measurementunit = ', _value));
			elseif _id= 'sessiontype' then
                set _where = CONCAT(_where , CONCAT(' and s.sessiontype = ', _value));
			elseif _id= 'status' then
                set _where = CONCAT(_where , CONCAT(' and s.status = ', _value));
            elseif _id= 'activity' then
                set _where = CONCAT(_where , CONCAT(' and s.activity = ', _value));
          elseif _id = 'duration' then
                set _where = CONCAT(_where , CONCAT(' and s.duration = ', _value));
		  elseif _id = 'servicetype' then
                set _where = CONCAT(_where , CONCAT(' and s.servicetype = ', _value));
		  elseif _id = 'applicablefor' then
                set _where = CONCAT(_where , CONCAT(' and s.applicablefor = ', _value));
		  elseif _id = 'servicename' then
                set _where = CONCAT(_where , CONCAT(' and s.servicename like ''%', _value ,'%'''));
          elseif _id = 'parallelplan' then
                set _where = CONCAT(_where , CONCAT(' and ps.servicename like ''%', _value ,'%'''));
		  elseif _id = 'price' then
                set _where = CONCAT(_where , CONCAT(' and s.', _id , ' like ''', _value ,'%'''));
           elseif _id = 'enablesaleonline' then
                set _where = CONCAT(_where , CONCAT(' and s.enablesaleonline = ', _value));
          elseif _id = 'sessioncount' then
                set _where = CONCAT(_where , CONCAT(' and s.sessioncount = ', _value));
         else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));

            end if;
          end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by s.deleted, s.id desc';
    end if;

			set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
		 set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPserviceview` (IN `service_id` INT, IN `client_id` INT)  BEGIN
 select s.id,servicetype,(servicetype+0)servicetypeId,activity,(activity+0)activityId,s.status ,(s.status+0)statusId,
 applicablefor ,(applicablefor+0)applicableforId,servicename ,
 description ,measurementunit ,(measurementunit+0)measurementunitId,durationcount ,duration ,(duration+0)durationId,
 sessioncount ,price,baseprice,sessiontype,servicevalidity,(servicevalidity+0)servicevalidityId,
 launchdate,expirydate,images,taxcategoryid,branchid,enablesharetoallbranches,
 ifnull((select  id  FROM subscription where serviceplan= service_id limit 1),0) isExistSubscription,
 iscomplimentaryservice,
 concat(u.firstname ,' ' , u.lastname) createdby,s.createdbydate,concat(um.firstname ,' ' , um.lastname) modifiedby,s.modifiedbydate,
 maxdiscountlimit,minsalesprice,enablesaleonline,enablesaleonceinlifetime,parallelplan,
 (select servicename from service where id = s.parallelplan)'parallelservice',specialprice,
 s.membershipaccesslimit
 from service s
 inner join user u on s.createdbyid = u.id
 left outer join user um on s.modifiedbyid = um.id
 where s.id=service_id and s.clientid = client_id and s.deleted = 0;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffpaydelete` (IN `staffpay_id` INT, IN `user_id` INT)  BEGIN
declare _paidcommission,_staffpaytype,_paidsalary,_advancepaymentadjustment,_employeeid int;

select paidcommission,paidsalary,staffpaytype,advancepaymentadjustment,employeeid into _paidcommission,_paidsalary,_staffpaytype,_advancepaymentadjustment,_employeeid from staffpay where id = staffpay_id;

    update staffpay set deleted = 1,amount = amount - ifnull(paidcommission,0),paidcommission = null,modifiedbyid = user_id,modifiedbydate=now() where id=staffpay_id;

    if _staffpaytype = 2 then
	   update user set advancepayment = case when advancepayment - _paidsalary > 0 then advancepayment - _paidsalary else 0 end where id = _employeeid;
	elseif _advancepaymentadjustment = 1 then
        update user set advancepayment = advancepayment + _paidsalary where id = _employeeid;
    end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffpaymonthwisesalarydetail` (IN `emplyee_id` INT, IN `staffpay_month` DATE, IN `client_id` INT)  BEGIN
		select sp.amount 'paidamount',sp.remark 'remark',
		sp.paymentdate 'paymentdate',sp.chequedate 'chequeDate',sp.bankname 'bankName',
		sp.status 'status',case when advancepaymentadjustment = 1 then
        "Advance pay adjustment" else paymentmode end 'paymentmode',(paymentmode+0) 'paymentmodeid',
		sp.chequeno  'chequeno' , sp.currentsalary 'currentsalary',sp.referenceid 'referenceid',
        paidsalary,ifnull(paidcommission,0) as paidcommission
		from staffpay sp where sp.employeeid = emplyee_id and sp.clientid = client_id
		and deleted =0 and month(monthofsalary) =  month(staffpay_month) and year(monthofsalary)
        = year(staffpay_month) and staffpaytype = 1;


		select sp.amount 'paidamount',sp.remark 'remark',
		sp.paymentdate 'paymentdate',sp.chequedate 'chequeDate',sp.bankname 'bankName',
		sp.status 'status',paymentmode 'paymentmode',(paymentmode+0) 'paymentmodeid',
		sp.chequeno  'chequeno',sp.referenceid 'referenceid',
        paidsalary
		from staffpay sp where sp.employeeid = emplyee_id and sp.clientid = client_id
		and deleted =0 and staffpaytype = 2 order by id desc limit 2;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffpaysave` (IN `staffpay_id` INT, IN `staffpay_employeeid` VARCHAR(100), IN `staffpay_amount` INT, IN `staffpay_paymentdate` DATE, IN `staffpay_paymentmode` VARCHAR(100), IN `staffpay_remark` VARCHAR(500), IN `staffpay_chequeno` VARCHAR(20), IN `staffpay_chequedate` DATE, IN `staffpay_bankname` VARCHAR(45), IN `staffpay_status` VARCHAR(20), IN `staffpay_currentsalary` INT, IN `staffpay_monthofsalary` DATE, IN `staffpay_referenceid` VARCHAR(50), IN `user_id` INT, IN `client_id` INT, IN `staffpay_paidsalary` INT, IN `staffpay_paidcommission` INT, IN `staffpay_branchid` INT, IN `staffpay_staffpaytype` INT, IN `staffpay_advancepaymentadjustment` INT)  BEGIN

insert into staffpay(employeeid,amount ,paymentdate,paymentmode,chequeno,chequedate,
bankname,status,createdbyid,createdbydate,remark,currentsalary,monthofsalary,clientid,
referenceid,paidsalary,paidcommission,branchid,staffpaytype,advancepaymentadjustment)
values(staffpay_employeeid , staffpay_amount, staffpay_paymentdate,staffpay_paymentmode,
staffpay_chequeno,staffpay_chequedate,staffpay_bankname,staffpay_status,user_id,
now(),staffpay_remark,staffpay_currentsalary,staffpay_monthofsalary,client_id,
staffpay_referenceid,staffpay_paidsalary,staffpay_paidcommission,staffpay_branchid,
staffpay_staffpaytype,staffpay_advancepaymentadjustment);

		if staffpay_advancepaymentadjustment = 0 and staffpay_paidcommission > 0 then
				update user set salary = staffpay_currentsalary ,
				balance = case when balance - staffpay_paidcommission > 0 then balance - staffpay_paidcommission else 0 end
				where id = staffpay_employeeid and clientid = client_id ;
		elseif  staffpay_staffpaytype = 2 then
				update user set advancepayment = advancepayment + staffpay_paidsalary
				where id = staffpay_employeeid and clientid = client_id ;
		elseif staffpay_advancepaymentadjustment = 1 then
                update user set advancepayment = advancepayment - staffpay_paidsalary,
                balance = case when balance - staffpay_paidcommission > 0 then balance - staffpay_paidcommission else balance end
				where id = staffpay_employeeid and clientid = client_id ;
		end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffpaysearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_branchid INT;
    DECLARE filtered, sorted , obj , startdate,enddate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table, exportXLSX varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.exportXLSX'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,startdate,enddate,exportXLSX,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = 'sp.id,sp.amount, sp.paidsalary, sp.paidcommission, sp.paymentdate,sp.paymentmode,user.firstname,
    concat(firstname,'' '',lastname) as name,currentsalary,monthofsalary,advancepaymentadjustment,
    staffpaytype,case when advancepaymentadjustment = 1 then "Yes" else "No" end
    advancepaymentadjustmentLabel';
    set _table = ' from staffpay sp
		INNER JOIN user ON sp.employeeid = user.id ';
	if(exportXLSX = 'true') then
			set _where = concat(' where date(sp.paymentdate) BETWEEN date(',startdate,') AND date(',enddate,')
			and sp.deleted = 0 and user.clientid = ', client_id , ' and sp.branchid = ' , _branchid);
    else
		set _where = concat(' where sp.deleted = 0 and user.clientid = ', client_id , ' and sp.branchid = ' , _branchid);
	  end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' and _value != 'null' then
			if _id = 'paymentmode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
			elseif _id= 'paymentdate' then
				set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
            elseif _id = 'name' then
			      set _where = CONCAT(_where , CONCAT(' and concat(firstname,'' '',lastname) like ''%', _value ,'%'''));
			elseif _id= 'monthofsalary' then
				set _where = CONCAT(_where , CONCAT(' and month(', _id , ') = month(''',_value, ''')'));
			elseif _id = 'advancepaymentadjustment' then
				 if _value = 1 then
						set _where = concat(_where , ' and advancepaymentadjustment = 1');
				 elseif _value = 2 then
					 set _where = concat(_where , ' and advancepaymentadjustment = 0');
                end if;
			elseif _id = 'staffpaytype' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
            else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by paymentdate desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
   else
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

		  PREPARE stmt FROM @_qry;
		  EXECUTE stmt;
		  DEALLOCATE PREPARE stmt;
	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffpayview` (IN `staffpay_id` INT, IN `client_id` INT)  BEGIN
	 select sp.id,sp.amount, sp.paidsalary, sp.paidcommission,sp.paymentdate,sp.paymentmode,concat(ref_emp.firstname,' ',ref_emp.lastname) as employeename,
     remark,chequeno,chequedate,bankname,sp.status,currentsalary,monthofsalary,sp.referenceid,
     paidsalary,paidcommission,staffpaytype,advancepaymentadjustment,
     case when advancepaymentadjustment = 1 then "Yes" else "No" end
     advancepaymentadjustmentLabel,(sp.paymentmode +0) paymentmodeId
	 from staffpay sp
     left outer join user ref_emp on sp.employeeid = ref_emp.id
	 where sp.id=staffpay_id and ref_emp .clientid = client_id and sp.deleted=0;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformanceattentedsession` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `activeTab` INT, IN `branch_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if activeTab = 0 then
	if(chart_filtertype = 0) then
		 select count(1) as count,concat(u.firstname,' ',u.lastname) name from memberptattendance pt
		 INNER JOIN user u ON pt.ptownerid = u.id
		 where u.clientid = client_id and month(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) =  month_filter and
		 year(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) = year_filter and
         pt.deleted = 0 and pt.branchid = branch_id
		 group by concat(u.firstname,' ',u.lastname) order by count desc;

	else
		 select count(1) as count,concat(u.firstname,' ',u.lastname) name from memberptattendance pt
		 INNER JOIN user u ON pt.ptownerid = u.id
		 where u.clientid = client_id and
		 year(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) = year_filter and pt.deleted = 0
		 and pt.branchid = branch_id
		 group by concat(u.firstname,' ',u.lastname) order by count desc;

    end if;
 elseif activeTab = 1 then
	if(chart_filtertype = 0) then
		select count(1) as count, sum(count) members, name
        from(
			 select count(1) as count,classid, u.id,concat(u.firstname,' ',u.lastname) name from classattendance ma
			 INNER JOIN user u ON ma.createdbyid = u.id
			 where u.clientid = client_id and classid is not null and
             month(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) =  month_filter
			 and year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter and
             ma.deleted = 0 and ma.branchid = branch_id
			 group by concat(u.firstname,' ',u.lastname), classid, u.id
		    ) temp group by name order by count desc;
	else
		 select count(1) as count, sum(count) members, name
         from(
			  select count(1) as count,classid, u.id,concat(u.firstname,' ',u.lastname) name from classattendance ma
			  INNER JOIN user u ON ma.createdbyid = u.id
			  where u.clientid = client_id and classid is not null and
              year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter
			  and ma.deleted = 0 and ma.branchid = branch_id
			  group by concat(u.firstname,' ',u.lastname), classid, u.id
			) temp group by name order by count desc;

	end if;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformancecollection` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `branch_id` INT)  BEGIN
      if(chart_filtertype = 0) then

			select sum(paymentamount) as amount, concat(u.firstname,' ',u.lastname) name from payment p
            INNER JOIN user u ON p.createdbyid = u.id
			where u.clientid = client_id and  p.status in (1,2) and  createdfrom = 'u' and
            month(paymentdate) =  month_filter and year(paymentdate) = year_filter and p.branchid = branch_id
            group by concat(u.firstname,' ',u.lastname) order by amount desc;
	else

			select sum(paymentamount)  as amount, concat(u.firstname,' ',u.lastname) name from payment p
            INNER JOIN user u ON p.createdbyid = u.id
			where u.clientid = client_id  and p.status in (1,2) and createdfrom = 'u' and
            year(paymentdate) = year_filter and p.branchid = branch_id
            group by concat(u.firstname,' ',u.lastname) order by amount desc;

	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformanceenquiry` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `branch_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if(chart_filtertype = 0) then

	 select count(1) as count, concat(u.firstname,' ',u.lastname) name from enquiry e
	 INNER JOIN user u ON e.attendedbyid = u.id
	 where e.clientid = client_id and e.deleted = 0 and
     month(getDateFromUTC(e.createdbydate,client_offsetvalue,-1)) =  month_filter and
	 year(getDateFromUTC(e.createdbydate,client_offsetvalue,-1)) = year_filter and e.branchid = branch_id
	 group by u.firstname,u.lastname order by count desc;
else
	 select count(1) as count, concat(u.firstname,' ',u.lastname) name from enquiry e
	 INNER JOIN user u ON e.attendedbyid = u.id
	 where e.clientid = client_id and e.deleted = 0 and
     year(getDateFromUTC(e.createdbydate,client_offsetvalue,-1)) = year_filter and e.branchid = branch_id
	 group by u.firstname,u.lastname order by count desc;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformanceenrolledmember` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `branch_id` INT)  BEGIN

 if(chart_filtertype = 0) then

	select count(distinct m.id) as count, concat(u.firstname,' ',u.lastname) name,sum(s.amount) as amount from
	  (select amount,salesbyid,member from subscription
       where branchid = branch_id and renew_type = 1 and
       month(purchasedate) = month_filter and
       year(purchasedate) = year_filter
		union all
	   select amount,salesbyid,member from subscriptionhistory
       where branchid = branch_id and renew_type = 1 and
       month(purchasedate) = month_filter and
       year(purchasedate) = year_filter
	  )s
	 INNER JOIN user u ON s.salesbyid = u.id
	 inner join member m on s.member = m.id
     where u.clientid = client_id group by concat(u.firstname,' ',u.lastname) order by count(distinct m.id) desc;

   else

     select count(distinct m.id) as count, concat(u.firstname,' ',u.lastname) name,sum(s.amount) as amount from
	 (select amount,salesbyid,member from subscription
      where branchid = branch_id and renew_type = 1 and
      year(purchasedate) = year_filter
       union all
	  select amount,salesbyid,member from subscriptionhistory
      where branchid = branch_id and renew_type = 1  and
      year(purchasedate) = year_filter
      )s
	 INNER JOIN user u ON s.salesbyid = u.id
	 inner join member m on s.member = m.id
     where u.clientid = client_id group by concat(u.firstname,' ',u.lastname) order by count(distinct m.id) desc;


end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformancegeneralrating` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if(chart_filtertype = 0) then

            select avg(ifnull(rating,0))  rating,
            concat(u.firstname,' ',u.lastname) as name from userrating ur
			inner join user u on ur.userid = u.id
			where  ur.clientid = client_id and ur.deleted = 0 and
            month(getDateFromUTC(ur.createdbydate,client_offsetvalue,-1)) =  month_filter and
            year(getDateFromUTC(ur.createdbydate,client_offsetvalue,-1)) = year_filter
			group by concat(u.firstname,' ',u.lastname) order by avg(rating) desc;


   	else

			select avg(ifnull(rating,0))  rating,
            concat(u.firstname,' ',u.lastname) as name from userrating ur
			inner join user u on ur.userid = u.id
			where  ur.clientid = client_id and ur.deleted = 0 and
            year(getDateFromUTC(ur.createdbydate,client_offsetvalue,-1)) = year_filter
			group by concat(u.firstname,' ',u.lastname) order by avg(rating) desc;

end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformancememberfollowup` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `activeTab` INT, IN `branch_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if activeTab = 0 then
	 if(chart_filtertype = 0) then

				 select count(1) as count, concat(u.firstname,' ',u.lastname) name from memberremark mr
				 INNER JOIN user u ON mr.createdbyid = u.id
				 where u.clientid = client_id and u.deleted = 0 and
                 month(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1)) =  month_filter
				 and year(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1)) = year_filter and mr.branchid = branch_id
				 group by concat(u.firstname,' ',u.lastname) order by count desc;

	 else
				 select count(1) as count, concat(u.firstname,' ',u.lastname) name from memberremark mr
				 INNER JOIN user u ON mr.createdbyid = u.id
				 where u.clientid = client_id and u.deleted = 0 and
                 year(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1))= year_filter
				 and mr.branchid = branch_id
				 group by concat(u.firstname,' ',u.lastname) order by count desc;
	 end if;
	else
	 if(chart_filtertype = 0) then

			 select count(1) as count, concat(u.firstname,' ',u.lastname) name from enquirystatus es
			 INNER JOIN user u ON es.createdbyid = u.id
			 INNER JOIN enquiry e ON es.enquiryid = e.id
			 where u.clientid = client_id and u.deleted = 0 and
             month(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) =  month_filter
			 and year(getDateFromUTC(es.createdbydate,client_offsetvalue,-1))  = year_filter and es.branchid = branch_id
             and date(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) != date(getDateFromUTC(e.createdbydate,client_offsetvalue,-1))
			 group by concat(u.firstname,' ',u.lastname) order by count desc;

	 else
			 select count(1) as count, concat(u.firstname,' ',u.lastname) name from enquirystatus es
			 INNER JOIN user u ON es.createdbyid = u.id
			 INNER JOIN enquiry e ON es.enquiryid = e.id
			 where u.clientid = client_id and u.deleted = 0 and
             year(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) = year_filter
			 and es.branchid = branch_id and
             date(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) != date(getDateFromUTC(e.createdbydate,client_offsetvalue,-1))
			 group by concat(u.firstname,' ',u.lastname)  order by count desc;
	 end if;
end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformancesales` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `branch_id` INT)  BEGIN

if(chart_filtertype = 0) then

	select sum(sales.amount) as sellamount, name from
    (
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name  from subscription s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where month(s.purchasedate) = month_filter and
         year(s.purchasedate) = year_filter
         and renew_type != 5 and s.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
         union all
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name from subscriptionhistory s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where month(s.purchasedate) = month_filter and
         year(s.purchasedate) = year_filter
         and renew_type != 5 and s.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
         union all
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name  from productsale ps
         inner join user u on u.id = ps.salesbyid and u.clientid = client_id
         where month(ps.purchasedate) = month_filter and
         year(ps.purchasedate) = year_filter
         and renew_type != 5 and ps.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
	) sales
         group by name order by sellamount desc;

else

         select sum(sales.amount) as sellamount, name from
         (
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name  from subscription s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where year(s.purchasedate) = year_filter and renew_type != 5 and s.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
         union all
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name  from subscriptionhistory s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where year(s.purchasedate) = year_filter and renew_type != 5 and s.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
         union all
         select sum(amount) as amount,concat(u.firstname,' ',u.lastname) as name  from productsale ps
         inner join user u on u.id = ps.salesbyid and u.clientid = client_id
         where year(ps.purchasedate) = year_filter and renew_type != 5 and ps.branchid = branch_id
         group by concat(u.firstname,' ',u.lastname)
         ) sales
         group by name order by sellamount desc;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPstaffperformancetrainers` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `branch_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if(chart_filtertype = 0) then

            select avg(rating) as rating, name , sum(classcount) as classcount , sum(totalsession) as totalsession from
            (select count(1) totalsession , avg(ifnull(rating,0))  rating,
             sum(case when rating is not null then 1 else 0 end) classcount ,
            concat(u.firstname,' ',u.lastname) as name from classattendance ma
			inner join user u on ma.createdbyid = u.id
			where  u.clientid = client_id and ma.deleted = 0 and ma.branchid = branch_id and
            month(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) =  month_filter and
            year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter
			group by concat(u.firstname,' ',u.lastname)
			 union
			select count(1) totalsession , avg(ifnull(rating,0)) rating,
            sum(case when rating is not null then 1 else 0 end) classcount ,
            concat(u.firstname,' ',u.lastname) as name from memberptattendance m
			inner join user u on m.ptownerid = u.id
			where u.clientid = client_id and m.deleted = 0 and m.branchid = branch_id and
            month(getDateFromUTC(m.attendancedate,client_offsetvalue,-1)) =  month_filter and
            year(getDateFromUTC(m.attendancedate,client_offsetvalue,-1)) = year_filter
			group by concat(u.firstname,' ',u.lastname)
            )feedback group by name order by avg(rating) desc;


   	else

            select avg(rating) as rating, name , sum(classcount) as classcount , sum(totalsession) as totalsession from
            (select count(1) totalsession , avg(ifnull(rating,0))  rating,
            sum(case when rating is not null then 1 else 0 end) classcount ,
            concat(u.firstname,' ',u.lastname) as name from classattendance ma
			inner join user u on ma.createdbyid = u.id
			where  u.clientid = client_id and
            ma.deleted = 0 and year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter
            and ma.branchid = branch_id
			group by concat(u.firstname,' ',u.lastname)
			 union
			select count(1) totalsession , avg(ifnull(rating,0)) rating,
            sum(case when rating is not null then 1 else 0 end) classcount ,
            concat(u.firstname,' ',u.lastname) as name from memberptattendance m
			inner join user u on m.ptownerid = u.id
			where u.clientid = client_id and m.deleted = 0 and
            year(getDateFromUTC(m.attendancedate,client_offsetvalue,-1)) = year_filter and m.branchid = branch_id
			group by concat(u.firstname,' ',u.lastname)
            )feedback group by name order by avg(rating) desc;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsubscriptionexpiredsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_subscriptiontype INT;
    DECLARE filtered, sorted , obj ,startdate,enddate ,absentstartDay,absentendDay LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table , _branchid , client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);
	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.subscriptiontype'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue'),JSON_EXTRACT(tableInfo,'$.startDate'),
    JSON_EXTRACT(tableInfo,'$.endDate'),JSON_EXTRACT(tableInfo,'$.absentstartDay'),
    JSON_EXTRACT(tableInfo,'$.absentendDay')
    into pageSize, pageIndex, client_id, filtered, sorted,_subscriptiontype,_branchid,
    client_offsetvalue ,  startdate,enddate ,absentstartDay,absentendDay;

    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _offset = pageIndex * pageSize;

    set _columns = ' s.id,servicename,image,memberprofileimage,s.startdate,s.expirydatesubscription,s.amount,concat(firstname,'' '',lastname) name,
                     mobile,membercode,member.status,(member.status + 0) statusId, gender,followupdate, member.id as memberid,
                     lastcheckin , personalemailid ,
                     case when member.balance < 0 then abs(member.balance) else 0 end as dues,
					 (member.gender + 0) genderId,member.createdbydate';

	if _subscriptiontype = 2 then

		 set _table = concat(' from member
		   Inner JOIN subscriptionhistory s ON s.id =
			(SELECT sh.id
					FROM subscriptionhistory sh
					WHERE member.id = sh.member
                    and renew_type != 5
                    and branchid = ' , _branchid , '
					ORDER BY sh.expirydatesubscription DESC
				  LIMIT 1
				)
			left outer JOIN service ON s.serviceplan = service.id  ');

    elseif (_subscriptiontype = 4 or _subscriptiontype = 5) then

		 set _table = concat(' from member
		   Inner JOIN subscription s ON s.id =
			(SELECT sh.id
					FROM subscription sh
					WHERE member.id = sh.member
                    and renew_type != 5
                    and branchid = ' , _branchid , '
					ORDER BY sh.expirydatesubscription DESC
				  LIMIT 1
				)
			left outer JOIN service ON s.serviceplan = service.id  ');

    else

		set _table = concat(' from member
		   left outer join subscriptionhistory s ON s.id =
			(SELECT sh.id
					FROM subscriptionhistory sh
					WHERE member.id = sh.member
                    and renew_type != 5
                    and branchid = ' , _branchid , '
					ORDER BY sh.expirydatesubscription DESC
				  LIMIT 1
				)
			left outer JOIN service ON s.serviceplan = service.id  ');

  end if;

  if  (_subscriptiontype = 4 ) then

	set _where = concat('where member.status = 1 and member.deleted = 0 and member.clientid = ', client_id);

  else

	set _where = concat('where member.status = 2 and member.deleted = 0 and member.clientid = ', client_id);

  end if;

  if _subscriptiontype = 3 then

        set _where = concat(_where , '  and s.id is null ');

  end if;


     if _subscriptiontype = 4 then

        set _where = concat(_where , ' and DATEDIFF(now(),lastcheckin)  > (',absentstartDay,')  AND  DATEDIFF(now(),lastcheckin)  < (',absentendDay,') ' );

    end if;

    if startDate != 'null' and startDate != '' and endDate != 'null' and endDate != '' then
 			set _where = concat(_where , ' and  date( s.expirydatesubscription) BETWEEN date(',startdate,')
                        AND date(',enddate,')');
	end if;

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null'  then
		  if _id = 'name' then
			 set _where = CONCAT(_where , CONCAT(' and ', 'concat(firstname,'' '',lastname) ', ' like ''%', _value ,'%'''));
          elseif _id = 'followupdate' or _id = 'lastcheckin' then
			set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
		  elseif _id = 'startdate' or _id = 'expirydatesubscription' then
				set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',getDateFromUTC(_value,'+00:00',0), ''')'));
          elseif _id = 'membercode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
          else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
        end if;
	   end if;

		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
    	   set _orderby = ' order by member.id desc' ;
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsubscriptionhistorysave` (IN `client_offsetvalue` INT)  BEGIN

DECLARE _currentdate date;
DECLARE isExistActiveBranch int DEFAULT 0;
DECLARE _activationdate ,_expirydate datetime DEFAULT null;
DECLARE sqlcode CHAR(5) DEFAULT '00000';
DECLARE msg TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
			ROLLBACK;
           	 Call `ERROR`(msg);
            END;

set _currentdate = date(getDateFromUTC(now(),getDateOffset(REPLACE(client_offsetvalue,'"','')),-1));

		update member m
		inner join subscription s on s.member = m.id
        inner join client c on c.id = m.clientid
		set m.status = 2
		where  m.status = 1 and ((date(s.expirydatesubscription) < _currentdate) ||
        (s.totalminutes is not null and s.totalminutes > 0 and s.totalminutes <= ifnull(s.consumedminutes,0)) ||
		(s.sessioncount is not null and s.sessioncount > 0 and s.sessioncount - ifnull(s.consumedsession,0) <= 0))
        and m.timezoneoffsetvalue = client_offsetvalue;

START TRANSACTION;

		 INSERT INTO subscriptionhistory (id,member, serviceplan,amount,startdate,
		 expirydatesubscription,createdbyid ,createdbydate,modifiedbyid,modifiedbydate,isbulkupload,
		 consumedsession,trainerid,salesbyid,costprice,ptcommssion,renew_type,remark,branchid,sessioncount,persessioncost,
         purchasedate,ptcommissiontype,schedule,totalminutes,consumedminutes,packageid)
		 SELECT s.id,member, serviceplan,amount,startdate,expirydatesubscription,s.createdbyid ,
		 s.createdbydate,s.modifiedbyid,s.modifiedbydate,s.isbulkupload,consumedsession,trainerid,
		 s.salesbyid,costprice,ptcommssion,renew_type,s.remark,s.branchid,s.sessioncount,s.persessioncost,
         s.purchasedate,s.ptcommissiontype,s.schedule,s.totalminutes,s.consumedminutes,s.packageid
		 FROM subscription s
		 INNER JOIN member m ON m.id = s.member
		 where ((date(expirydatesubscription) < _currentdate) ||
         (s.totalminutes is not null and s.totalminutes > 0 and s.totalminutes <= ifnull(s.consumedminutes,0)) ||
         (s.sessioncount is not null and s.sessioncount > 0 and s.sessioncount - ifnull(s.consumedsession,0) <= 0))  and m.status != 3 and
         m.timezoneoffsetvalue = client_offsetvalue;

		 delete subscription from subscription
		 INNER JOIN member m ON m.id = subscription.member
		 where ((date(expirydatesubscription) < _currentdate) ||
         (totalminutes is not null and totalminutes > 0 and totalminutes <= ifnull(consumedminutes,0)) ||
         (sessioncount is not null and sessioncount > 0 and sessioncount - ifnull(consumedsession,0) <= 0))
         and m.status != 3 and
         m.timezoneoffsetvalue = client_offsetvalue;



COMMIT;
	 SET @flag = 1;

	 update member
     INNER JOIN subscription s ON member.id = s.member
     inner join service se on se.id = s.serviceplan
     inner join client c on c.id = member.clientid
	 set member.status = 1 ,  member.appaccess = 1 where member.deleted = 0
     and _currentdate between date(s.startdate) and date(s.expirydatesubscription)
	 and member.status = 2 and
     member.timezoneoffsetvalue = client_offsetvalue
     and case when c.membershipbasedgymaccess = 1 then se.servicetype = 1  else 1 = 1 end;

	update client c inner join (
    select c.id, max(b.expirydate)  from client c left outer join branch b on b.clientid = c.id
    where  status = 1 group by c.id having date(max(b.expirydate)) < _currentdate) nc on c.id = nc.id
    set c.status = 2;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsubscriptionsave` (IN `data` LONGTEXT)  BEGIN

	DECLARE i, _length INT;
	DECLARE client_id, user_id,  onlinepay_id,_isComplimentary,
			_paymentmode, _paymenttype , _memberid, _memberoption, _enquiryid,
            _cartid , _quantity, _salesby,_taxcategoryid,_invoiceid,_subscriptionid,_productsaleid,
            _paymentid,_renewtype,_assigntrainerid,_maxmonthlylimit,_totaldiscount,
            _maxmonthlycomplimentarylimit , _totalcomplimentaryitem,isExitMemberMembership,
            _isMember,isExitonceinlifetime,parallelplanId,onceinlifetimeplanId,
            isExitparallelplanId,isExitonceinlifetimeplanId,_ptcommissiontype,
            _membershipaccesslimit,_oldstatus,_maxmember,isMaximun,_generategstinvoice,
            _packageid INT;
	DECLARE _paymentamount, _memberbalance,_totalprice, _installmentamount,
			_discountedprice,_taxamount, _baseprice,_taxpercentage,_balance,_cardswipeCharge,
            _ptcommssion,_totalinstallmentamount,_totalpaymentAmount decimal(12,2) DEFAULT 0;

    DECLARE _billing, _cart ,_payment, _installments, obj , objinstallment,_paymentobj LONGTEXT;

    DECLARE _chequeno, _chequedate, _bankname, _remark, _status, _paymentdate,_referenceid,
			_firstname, _lastname, _emailid, _mobile, _address1, _address2, _country, _state, _pincode,
			_gender,_area,_defaultbranchid,_invoiceDate,
			_name,_sessiontype,_price,_startdate,_expirydate, _category,_servicetypeid,_activitytypeid,
            _installmentdate,_paymentreceiptnumber,_gstin,_complementcategory,
            _previousexpirydate,_membercode varchar(500);
   DECLARE _city,_timezoneoffsetvalue,_taxinvoicecode varchar(100);

    DECLARE _isservice boolean DEFAULT false;
    DECLARE stateID int DEFAULT NULL;
	DECLARE countryID varchar(2) DEFAULT NULL;

    DECLARE _maxactivationdate date DEFAULT NULL ;
    DECLARE totalcartprice, addprice, totalpurchaseamount,_sessioncount decimal(12,2) DEFAULT 0;

    DECLARE _totalmonthlydiscountgiven,_totalmonthlycomplimentarysold, isExist int DEFAULT 0;

	DECLARE sqlcode CHAR(5) DEFAULT '00000';
	DECLARE msg TEXT;
   DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
			ROLLBACK;
             if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else
				 Call `ERROR`('Internal Server Error');
             end if;
		 END;

	select JSON_EXTRACT(data,'$.billing'),JSON_EXTRACT(data,'$.cart'),
    JSON_EXTRACT(data,'$.clientId'),JSON_EXTRACT(data,'$.userId'),JSON_EXTRACT(data,'$.payId'),
    JSON_EXTRACT(data,'$.payment'),JSON_EXTRACT(data,'$.installments'),JSON_EXTRACT(data,'$.salesby'),
	JSON_EXTRACT(data, '$.invoiceDate'),JSON_EXTRACT(data,'$.isComplimentary'),
    JSON_EXTRACT(data,'$.maxmonthlylimit'),JSON_EXTRACT(data,'$.totaldiscount'),
    JSON_EXTRACT(data,'$.complimentarysalelimit'),JSON_EXTRACT(data,'$.totalcomplimentaryitem'),
    JSON_EXTRACT(data,'$.isMember'), JSON_EXTRACT(data,'$.totalinstallmentamount'),
    JSON_EXTRACT(data,'$.totalpaymentAmount'),JSON_EXTRACT(data,'$.generategstinvoice'),
    JSON_EXTRACT(data,'$.paymentType')
    into _billing, _cart, client_id,user_id,onlinepay_id, _payment,_installments,_salesby,_invoiceDate,
    _isComplimentary,_maxmonthlylimit,_totaldiscount,_maxmonthlycomplimentarylimit,
    _totalcomplimentaryitem,_isMember,_totalinstallmentamount,_totalpaymentAmount,
    _generategstinvoice,_paymenttype;

	set _invoiceDate = REPLACE(_invoiceDate,'"','');
	set _paymenttype = REPLACE(_paymenttype,'"','');

    if _maxmonthlylimit > 0 then

		SELECT IFNULL(sum(discount),0) into _totalmonthlydiscountgiven FROM invoiceitem it
		inner join invoice i on i.id = it.invoiceid
		where createdbyid = user_id and clientid = client_id and month(date) = month(curdate())  and year(date) = year(curdate());

		if (_totalmonthlydiscountgiven + _totaldiscount) > _maxmonthlylimit then
		   Call `ERROR`(concat('You have exceed monthly discount limit of ', _maxmonthlylimit));
		end if;

	end if;

    if _maxmonthlycomplimentarylimit > 0 and _totalcomplimentaryitem > 0 then

		select sum(total) into _totalmonthlycomplimentarysold from
		(SELECT count(1) 'total' FROM subscription s inner join service on s.serviceplan = service.id and iscomplimentaryservice = 1
		where s.createdbyid = user_id and month(s.createdbydate) = month(curdate()) and year(s.createdbydate) = year(curdate())
		union all
		SELECT count(1) 'total' FROM subscriptionhistory s inner join service on s.serviceplan = service.id and iscomplimentaryservice = 1
		where s.createdbyid = user_id and month(s.createdbydate) = month(curdate()) and year(s.createdbydate) = year(curdate())
		union all
		SELECT count(1) 'total' FROM productsale p inner join product on p.productid = product.id and iscomplimentaryproduct = 1
		where p.createdbyid = user_id and month(p.createdbydate) = month(curdate()) and year(p.createdbydate) = year(curdate()) )a;

		if (_totalmonthlycomplimentarysold + _totalcomplimentaryitem) > _maxmonthlycomplimentarylimit then
		   Call `ERROR`(concat('You have exceed monthly complimentary sale limit of ', _maxmonthlycomplimentarylimit));
		end if;

	end if;

	select JSON_EXTRACT(_billing, '$.firstname'),JSON_EXTRACT(_billing , '$.lastname') ,
	JSON_EXTRACT(_billing, '$.personalemailid'),JSON_EXTRACT(_billing, '$.mobile'),
	JSON_EXTRACT(_billing, '$.address1'), JSON_EXTRACT(_billing, '$.address2'),
	JSON_EXTRACT(_billing, '$.country'), JSON_EXTRACT(_billing, '$.state'),
	JSON_EXTRACT(_billing, '$.pincode'), JSON_EXTRACT(_billing, '$.id'),
	JSON_EXTRACT(_billing, '$.memberOption'),JSON_EXTRACT(_billing, '$.area'),
	JSON_EXTRACT(_billing, '$.gstin'),JSON_EXTRACT(_billing, '$.branchid'),
    JSON_EXTRACT(_billing, '$.city'),JSON_EXTRACT(_billing, '$.gender'),
    JSON_EXTRACT(_billing, '$.timezoneoffset')
	into _firstname, _lastname,_emailid,_mobile,_address1,_address2,_country,_state,_pincode,_memberid,
	_memberoption,_area,_gstin,_defaultbranchid,_city,_gender,_timezoneoffsetvalue;

        set _firstname = REPLACE(_firstname,'"','');
        set _lastname = REPLACE(_lastname,'"','');
		set _emailid = REPLACE(_emailid,'"','');
        set _mobile = REPLACE(_mobile,'"','');
        set _address1 = REPLACE(_address1,'"','');
        set _address2 = REPLACE(_address2,'"','');
        set _country = REPLACE(_country,'"','');
        set _state = REPLACE(_state,'"','');
        set _pincode = REPLACE(_pincode,'"','');
        set _memberid = REPLACE(_memberid,'"','');
        set _memberoption = REPLACE(_memberoption,'"','');
        set _area = REPLACE(_area,'"','');
        set _gstin = REPLACE(_gstin,'"','');
        set _defaultbranchid = REPLACE(_defaultbranchid,'"','');
        set _city = REPLACE(_city,'"','');
        set _gender = REPLACE(_gender,'"','');
        set _timezoneoffsetvalue = REPLACE(_timezoneoffsetvalue,'"','');

	  if _memberoption = 2 or _memberoption = 3 then
          set _renewtype = 1;
	  else
           set _renewtype = 2;
	  end if;

        if _memberoption = 1 then
		  if _memberid is null or _memberid = 0  then
			Call `ERROR` ('Please select a member.');
		  end if;
        end if;

        if _country != '' and _country is not null then
			select code into countryID from country where name = _country;

			if countryID is null then
				Call `ERROR` ('Please enter valid country.');
			end if;
		end if;

		if _state != '' and _state is not null then
			select id, country_code into stateID, countryID from state where name = _state and (country_code = countryID or countryID is null);

			if stateID is null then
				Call `ERROR` ('Please enter valid State/Region.');
			end if;
		end if;

        if _memberoption = 2 or _memberoption = 3 then

			select count(1) into isExist from member where personalemailid = _emailid and clientid = client_id and deleted = 0;

			if isExist > 0 then
				Call `ERROR`('Email id already exists.');
			end if;

            select maxmember into _maxmember from branch where id = _defaultbranchid;

			if _maxmember > 0 then
			   SELECT count(1) into isMaximun FROM member where clientid = client_id and deleted = 0 and defaultbranchid = _defaultbranchid ;

				if isMaximun >= _maxmember then
				   Call `ERROR` (concat('You are not allowed to add more than ', _maxmember, ' member.'));
                end if;
			end if;


        end if;

START TRANSACTION;

 if _memberoption = 3 then

		SET _membercode = getSequence('member' , client_id);
		insert into member(firstname,lastname,mobile,personalemailid,address1,address2 ,country,state ,pincode,panno,clientid,membercode,createdbyid ,createdbydate,
        transactionalnotification,promotionalnotification,area,gstin,branchid,city,defaultbranchid,gender, timezoneoffsetvalue)
        values(_firstname, _lastname,_mobile,_emailid,_address1,_address2,countryID,stateID,_pincode,'',client_id,_membercode,
		user_id,now(),1,1,_area,_gstin,json_array(_defaultbranchid),_city,_defaultbranchid,_gender,_timezoneoffsetvalue);

		SELECT LAST_INSERT_ID() into _memberid;

 elseif _memberoption = 2 then

		SET _enquiryid = _memberid;
		SET _membercode = getSequence('member' , client_id);
		insert into member(firstname,lastname,mobile,personalemailid,address1,address2 ,country,state ,pincode,panno,clientid,membercode,gender,
        createdbyid ,createdbydate,transactionalnotification,promotionalnotification,area,branchid,city,defaultbranchid,timezoneoffsetvalue)
        values(_firstname,_lastname,_mobile,_emailid,_address1,_address2,countryID,stateID,_pincode,'',client_id,_membercode,
		_gender,user_id,now(),1,1,_area,json_array(_defaultbranchid),_city,_defaultbranchid,_timezoneoffsetvalue);

		SELECT LAST_INSERT_ID() into _memberid;

        select enquirystatus into _oldstatus from enquiry where id = _enquiryid;
        update enquiry set memberid = _memberid,  enquirystatus= 4 ,joineddate = now() where id=_enquiryid and clientid=client_id;

		insert into enquirystatus(remark,oldstatus,newstatus,createdbyid,createdbydate,enquiryid,branchid)
		values(_membercode,_oldstatus,4,_salesby,now(),_enquiryid,_defaultbranchid);

  elseif _memberoption = 1 then
		update member set address1 = _address1, address2= _address2 ,
        area = _area,city = _city,country = countryID,state  = stateID,pincode = _pincode,
        gender = _gender,gstin = _gstin where id = _memberid and clientid = client_id and deleted = 0;

		select balance,membercode into _memberbalance,_membercode from member where id = _memberid and clientid = client_id and deleted = 0;
		set _balance = _memberbalance;
  end if;

			if _isComplimentary = 0 then

				 set _taxinvoicecode = null;
				 set _paymentreceiptnumber =  getInvoicenumber('invoice', client_id);
				 if _generategstinvoice = 1 then
					set _taxinvoicecode = getTaxInvoicenumber('taxinvoice', client_id);
				 end if;

				insert into invoice (memberid,createdbyid,createdbydate,clientid,invoicecode,branchid,date,totaldues,taxinvoicecode,salesbyid)
				values(_memberid,user_id,now(),client_id,_paymentreceiptnumber,_defaultbranchid,getDateFromUTC(_invoiceDate,'+00:00',0),_totalinstallmentamount,_taxinvoicecode,_salesby);

				SELECT LAST_INSERT_ID() into _invoiceid;
			end if;


	  SET i = 0;
	  SET _length = JSON_LENGTH(_cart);

	  WHILE  i < _length DO
			SELECT JSON_EXTRACT(_cart,CONCAT('$[',i,']')) into obj;

			select JSON_EXTRACT(obj, '$.objectID'),JSON_EXTRACT(obj , '$.name') ,
			JSON_EXTRACT(obj, '$.sessiontypeId'), JSON_EXTRACT(obj, '$.price'),
            JSON_EXTRACT(obj, '$.startDate'),  JSON_EXTRACT(obj, '$.expiryDate'),
            JSON_EXTRACT(obj, '$.isService'),JSON_EXTRACT(obj, '$.totalPrice'),
            JSON_EXTRACT(obj, '$.category'), JSON_EXTRACT(obj, '$.Quantity'),
            JSON_EXTRACT(obj, '$.servicetypeId'), JSON_EXTRACT(obj, '$.activitytypeId'),
	        JSON_EXTRACT(obj,'$.taxcategoryid'), JSON_EXTRACT(obj,'$.discountedprice'),
	        JSON_EXTRACT(obj,'$.taxamount'), JSON_EXTRACT(obj,'$.baseprice'),
			JSON_EXTRACT(obj,'$.taxpercentage'),JSON_EXTRACT(obj,'$.assigntrainerid'),
            JSON_EXTRACT(obj,'$.complementcategory'),JSON_EXTRACT(obj,'$.sessioncount'),
            JSON_EXTRACT(obj,'$.ptcommissiontype'),JSON_EXTRACT(obj,'$.ptcommssion'),
            JSON_EXTRACT(obj,'$.membershipaccesslimit'),JSON_EXTRACT(obj, '$.packageid')
			into _cartid, _name,_sessiontype,_price,
            _startdate,_expirydate,_isservice,_totalprice,_category,_quantity,_servicetypeid,_activitytypeid,_taxcategoryid,
			_discountedprice,_taxamount,_baseprice,_taxpercentage,_assigntrainerid,_complementcategory,_sessioncount,
            _ptcommissiontype,_ptcommssion,_membershipaccesslimit,_packageid;

			set _cartid = REPLACE(_cartid,'"','');
			set _name = REPLACE(_name,'"','');
			set _sessiontype = REPLACE(_sessiontype,'"','');
            set _price = REPLACE(_price,'"','');
			set _startdate = REPLACE(_startdate,'"','');
            set _expirydate = REPLACE(_expirydate,'"','');
			set _isservice = REPLACE(_isservice,'"','');
            set _totalprice = REPLACE(_totalprice,'"','');
            set _category = REPLACE(_category,'"','');
            set _quantity = REPLACE(_quantity,'"','');
			set _taxcategoryid = REPLACE(_taxcategoryid,'"','');
			set _discountedprice = REPLACE(_discountedprice,'"','');
			set _taxamount = REPLACE(_taxamount,'"','');
			set _baseprice = REPLACE(_baseprice,'"','');
			set _servicetypeid = REPLACE(_servicetypeid,'"','');
			set _activitytypeid = REPLACE(_activitytypeid,'"','');
            set _taxpercentage = REPLACE(_taxpercentage,'"','');
		    set _assigntrainerid = REPLACE(_assigntrainerid,'"','');
            set _complementcategory = REPLACE(_complementcategory,'"','');
            set _sessioncount = REPLACE(_sessioncount,'"','');
            set _ptcommissiontype = REPLACE(_ptcommissiontype,'"','');
            set _ptcommssion = REPLACE(_ptcommssion,'"','');
            set _membershipaccesslimit = REPLACE(_membershipaccesslimit,'"','');
			set _packageid = REPLACE(_packageid,'"','');

			set _discountedprice = case when _discountedprice > 0 then _discountedprice else null end;

			set _taxamount = case when _taxamount > 0 then _taxamount else null end;

			set _taxcategoryid = case when _taxcategoryid > 0 then _taxcategoryid else null end;

			set _taxpercentage = case when _taxpercentage > 0 then _taxpercentage else null end;

			set _assigntrainerid = case when _assigntrainerid > 0 then _assigntrainerid else null end;


            if _ptcommissiontype = '' then
               set _ptcommissiontype = null;
            end if;

			set _membershipaccesslimit = case when _membershipaccesslimit > 0 then _membershipaccesslimit else null end;

			set _packageid = case when _packageid > 0 then _packageid else null end;


if _servicetypeid = 1 then

	 select count(1) into isExitMemberMembership from  subscription s
	 left outer join service on s.serviceplan = service.id where member = user_id
	 and service.servicetype = cast(_servicetypeid as unsigned) and _isMember = 1;

	  if isExitMemberMembership > 1 then
				Call `ERROR` ('Do not allow more than one future plan.');
	  end if;

	 elseif _servicetypeid = 2 then

		if(_activitytypeid = 1) then

            select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = user_id
			and service.servicetype = cast(_servicetypeid as unsigned)
            and service.activity = cast(_activitytypeid as unsigned) and
            service.sessiontype = _sessiontype and _isMember = 1;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
		end if;

		if(_activitytypeid = 2) then

			select count(1) into isExitMemberMembership from  subscription s
			left outer join service on s.serviceplan = service.id where member = user_id
			and service.servicetype = cast(_servicetypeid as unsigned)
			and service.activity = cast(_activitytypeid as unsigned) and
			service.sessiontype = _sessiontype and _isMember = 1;

		  if isExitMemberMembership > 1 then
					Call `ERROR` ('Do not allow more than one future plan.');
		  end if;
	    end if;
	end if;

			set _startdate = date(getDateFromUTC(_startdate,'+00:00',0));

            if _servicetypeid = 1 then

				select max(expirydatesubscription) into _maxactivationdate from subscription s
				left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned);

				if _maxactivationdate >= _startdate then
					Call `ERROR`(concat('Membership is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
				end if;

				update memberremark set followupdate = null  where followupdate > now() and memberid = _memberid and followuptype in  (1,2,4,12);

			elseif _servicetypeid = 2 then

				if(_activitytypeid = 1) then

					select max(expirydatesubscription) into _maxactivationdate from subscription s
					left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype;

					if _maxactivationdate >= _startdate then
						Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
					end if;
                elseif (_activitytypeid = 2) then

					select max(expirydatesubscription) into _maxactivationdate from subscription s
					left outer join service on s.serviceplan = service.id where member = _memberid and service.servicetype = cast(_servicetypeid as unsigned) and service.activity = cast(_activitytypeid as unsigned) and service.sessiontype = _sessiontype and ifnull(s.trainerid,0) = ifnull(_assigntrainerid,0);

					if _maxactivationdate >= date(_startdate) then
						Call `ERROR`(concat('Subscription to same session is active till ', DATE_FORMAT(_maxactivationdate, "%M %d, %Y")));
					end if;

                    update memberremark set followupdate = null  where followupdate > now() and memberid = _memberid and followuptype in  (2,4,11,13);
                end if;
			end if;


					select count(1) into isExitonceinlifetime from  subscription s
					left outer join service on s.serviceplan = service.id where member = user_id
                    and service.enablesaleonceinlifetime = 1 and _isMember = 1
                    and  service.id = _cartid;

					  if isExitonceinlifetime > 0 then
								Call `ERROR` ('This service has already been purchased by you.');
					  end if;

					select parallelplan into parallelplanId from service
                     where service.id = _cartid and service.enablesaleonceinlifetime = 1
                     and _isMember = 1;

                    select count(1) into isExitparallelplanId from subscription
				    where member = user_id  and serviceplan = parallelplanId;

                     if isExitparallelplanId > 0 then
								Call `ERROR` ('You are not eligible to purchase this series.');
					  end if;

            set totalcartprice = totalcartprice + _totalprice;

			set totalpurchaseamount = totalpurchaseamount +  _totalprice;

            if _isservice = true then

				insert into subscription (member,serviceplan,amount,startdate,expirydatesubscription,createdbyid ,
                createdbydate,salesbyid,costprice,branchid,remark,renew_type,sessioncount,persessioncost,purchasedate,
                ptcommssion,ptcommissiontype,totalminutes,packageid, trainerid)
				values(_memberid,_cartid,_totalprice,_startdate,date(getDateFromUTC(_expirydate,'+00:00',0)),
                user_id,now(),_salesby,_price,_defaultbranchid,
				case when _complementcategory != '' and _complementcategory is not null then CONCAT(CONCAT('"Complimentary Service Category" :  ', _complementcategory), '\n' , _remark) else _remark end  ,
                _renewtype,_sessioncount,case when _sessioncount > 0 and _activitytypeid = 2 then (_baseprice/_sessioncount) else null end,_invoiceDate,
                _ptcommssion,_ptcommissiontype,_membershipaccesslimit,_packageid, _assigntrainerid);

				SELECT LAST_INSERT_ID() into _subscriptionid;

				 if _isComplimentary = 0 and _totalprice > 0 then
					insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,clientid,createdbyid,createdbydate,branchid)
					values(_balance,(0 - _totalprice),"New service",_subscriptionid,"subscription",_memberid,client_id,user_id,now(),_defaultbranchid);
				 end if;

				set _balance = _balance - _totalprice;

                if date(now()) >= _startdate then
					UPDATE member SET status = '1' , appaccess = '1' WHERE id = _memberid;
				end if;

			else
				insert into productsale (member,productid,quantity,amount,createdbyid ,createdbydate,salesbyid,costprice,branchid,remark,renew_type,purchasedate)
				values(_memberid,_cartid,_quantity,_totalprice,user_id,now(),_salesby,_price,_defaultbranchid,_remark,_renewtype,_invoiceDate);

				SELECT LAST_INSERT_ID() into _productsaleid;

				  if _isComplimentary = 0 and _totalprice > 0 then
					insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,clientid,createdbyid,createdbydate,branchid)
					values(_balance,(0 - _totalprice),"New product",_productsaleid,"productsale",_memberid,client_id,user_id,now(),_defaultbranchid);
				  end if;

				update product set	quantity=quantity - _quantity where id=_cartid and clientid = client_id;

                set _balance = _balance - _totalprice;

			end if;

			if _isComplimentary = 0 then
				insert into invoiceitem (invoiceid,itemname,discount,taxamount,subscriptionid,productsaleid,taxcategoryid,baseprice,taxpercentage)
				values(_invoiceid,_name,_discountedprice,_taxamount,_subscriptionid,	_productsaleid,_taxcategoryid,_baseprice,_taxpercentage);
            end if;

				set _subscriptionid = null;
				set _productsaleid = null;

			SET  i = i + 1;
		END WHILE;

		   update member set  balance=balance - totalpurchaseamount +  _totalpaymentAmount,salesbyid = _salesby
		   where id=_memberid and clientid = client_id;

		SET i = 0;
		SET _length = JSON_LENGTH(_installments);

		WHILE  i < _length DO

			SELECT JSON_EXTRACT(_installments,CONCAT('$[',i,']')) into objinstallment;

			select JSON_EXTRACT(objinstallment, '$.installmentDate'),JSON_EXTRACT(objinstallment , '$.installmentAmount')
			into _installmentdate, _installmentamount;

			set _installmentdate = REPLACE(_installmentdate,'"','');
			set _installmentamount = REPLACE(_installmentamount,'"','');

            if(_installmentamount is not null) then
	    		insert into installment(memberid,date,amount,paymentamount,createdbyid ,createdbydate,invoiceid,branchid)
				values(_memberid,getDateFromUTC(_installmentdate,'+00:00',0),_installmentamount,0,user_id,now(),_invoiceid,_defaultbranchid);
			end if;

			SET  i = i + 1;
	    END WHILE;

        if _memberbalance is null then set _memberbalance = 0;  end if;

		if _paymenttype = 1 and ((_memberbalance <= 0 and _totalpaymentAmount != totalcartprice) or (_memberbalance > 0 and (_memberbalance + _totalpaymentAmount) < totalcartprice)) then
			Call `ERROR` ('Please enter valid amount.');
		end if;

		SET i = 0;
		SET _length = JSON_LENGTH(_payment);

		WHILE  i < _length DO
		  SELECT JSON_EXTRACT(_payment,CONCAT('$[',i,']')) into _paymentobj;

		  select JSON_EXTRACT(_paymentobj, '$.paymentAmount'),JSON_EXTRACT(_paymentobj , '$.paymentMode') ,
		  JSON_EXTRACT(_paymentobj, '$.chequeno'),JSON_EXTRACT(_paymentobj, '$.chequeDate'),
            	  JSON_EXTRACT(_paymentobj, '$.bankName'),JSON_EXTRACT(_paymentobj, '$.status'),
            	  JSON_EXTRACT(_paymentobj, '$.remark'),JSON_EXTRACT(_paymentobj, '$.paymentDate'),
            	  JSON_EXTRACT(_paymentobj, '$.referenceId'),JSON_EXTRACT(_paymentobj, '$.cardswipeCharge')
		  into _paymentamount, _paymentmode,_chequeno,_chequedate,_bankname,_status,_remark,_paymentdate,
		  _referenceid,_cardswipeCharge;

			set _paymentamount = REPLACE(_paymentamount,'"','');
			set _paymentmode = REPLACE(_paymentmode,'"','');
			set _chequeno = REPLACE(_chequeno,'"','');
			set _chequedate = REPLACE(_chequedate,'"','');
			set _bankname = REPLACE(_bankname,'"','');
			set _status = REPLACE(_status,'"','');
			set _remark = REPLACE(_remark,'"','');
			set _paymentdate = REPLACE(_paymentdate,'"','');
			set _referenceid = REPLACE(_referenceid,'"','');
			set _cardswipeCharge = REPLACE(_cardswipeCharge,'"','');

		   if _paymentamount > 0 then

			insert into payment(memberid,paymentamount,paymentmode,chequeno,chequedate,bankname ,status,remark,paymentdate,createdbyid ,createdbydate,payid,
			createdfrom,paymentreceiptcode,referenceid,branchid,invoiceid,cardswipecharge)
			values(_memberid,_paymentamount + ifnull(_cardswipeCharge,0),_paymentmode,_chequeno,getDateFromUTC(_chequedate,'+00:00',0),_bankname,_status,
			case when _complementcategory != '' and _complementcategory is not null then CONCAT(CONCAT('"Complimentary Service Category" :  ', _complementcategory), '\n' , _remark) else _remark end  ,
                        getDateFromUTC(_paymentdate,'+00:00',0),(case when onlinepay_id is not null then _memberid else user_id end),
                        now(),onlinepay_id,(case when onlinepay_id is not null then 'm' else 'u' end),
            		_paymentreceiptnumber,_referenceid,_defaultbranchid,_invoiceid,_cardswipeCharge);

			SELECT LAST_INSERT_ID() into _paymentid;

			insert into transaction(openingbalance,amount,transaction_type,transaction_id,transaction_table,member_id,
			clientid,createdbyid,createdbydate,branchid)
	                values(_balance , _paymentamount,"payment",_paymentid,"payment",_memberid,client_id,user_id,now(),_defaultbranchid);

	    	end if;

		SET  i = i + 1;
        END WHILE;

   	update invoice set status = case when _balance < 0 then 2 else 1 end
	where id = _invoiceid and  clientid = client_id;

    select _memberid,_invoiceid as invoiceid,_membercode as membercode;

	COMMIT;
    SET @flag = 1;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsubscriptionview` (IN `subscription_id` INT, IN `client_id` INT)  BEGIN

	select s.id,s.servicetype,s.startdate,s.expirydatesubscription,s.amount,s.remark,
	concat(ref_m.firstname,' ',ref_m.lastname ) 'member', ref_s.servicename
    from subscription s
	left outer join member ref_m on s.member = ref_m.id
	left outer join service ref_s on s.serviceplan = ref_s.id


	where s.id=subscription_id and s.clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionallmember` (IN `filter` LONGTEXT)  BEGIN
	DECLARE  client_id ,  _branchid INT;
    DECLARE _value  varchar(500);
	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , _branchid;

    set _value = REPLACE(_value,'"','');

	select  * from (select id , concat(mobile ,' (' ,firstname,' ',lastname,') - ',membercode , ' (Member)') label,mobile,
    personalemailid emailid,concat(firstname,' ',lastname) name,membercode code,(status+0) statusId,
    gender, (gender + 0) genderId, '0' isEnquiry
     from member
	where  (firstname like CONCAT(_value,'%') or lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or membercode like CONCAT('%',_value,'%') or
            concat(firstname,' ',lastname) like CONCAT(_value,'%') ) and deleted = 0 and clientid = client_id and
            (case when enablesharetootherbranches = 0 then json_search(branchid, 'one' , _branchid ) is not null else 1=1 end)
     union all
	select id , concat(mobile, ' (',firstname,' ',lastname,') - ', enquirycode , ' (Enquiry)') label,mobile,
    emailid,concat(firstname,' ',lastname) name,enquirycode code , 0 statusId,
    gender, (gender + 0) genderId, '1' isEnquiry from enquiry
	where  (firstname like CONCAT(_value,'%') or lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or concat(firstname,' ',lastname) like CONCAT(_value,'%')
            ) and enquirystatus != 4 and
            deleted = 0 and clientid = client_id and branchid = _branchid) m
            order by name limit 10;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestioncountry` (IN `filter` VARCHAR(100))  BEGIN

	select code 'id' ,name 'label',phonecode,languagecode from country where name like CONCAT(filter,'%') order by name asc limit 5 ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionemployeecode` (IN `filter` LONGTEXT)  BEGIN

	DECLARE  client_id INT;
    DECLARE _value varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId')
    into _value, client_id;

    set _value = REPLACE(_value,'"','');

	select employeecode,concat(firstname,' ',lastname,' - ',employeecode) label from user
	where  ((employeecode like CONCAT('%',_value,'%')) or (firstname like CONCAT('%',_value,'%'))) and
    deleted = 0 and clientid = client_id order by firstname,lastname limit 5;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionenquiry` (IN `filter` LONGTEXT)  BEGIN

	DECLARE  client_id ,_branchid INT;
    DECLARE _value varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
	JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , _branchid;

    set _value = REPLACE(_value,'"','');

	select id , concat(firstname,' ',lastname,' - ', enquirycode) label,mobile,
    concat(firstname,' ',lastname) enquiryname
    from enquiry
	where  (firstname like CONCAT(_value,'%') or
			lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or
            concat(firstname,' ',lastname) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ', enquirycode) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ', enquirycode , ' - ', mobile ) like CONCAT(_value,'%')
            ) and
            enquirystatus != 4 and
            deleted = 0 and clientid = client_id and branchid = _branchid
            order by firstname,lastname limit 5;



END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipment` (IN `filter` LONGTEXT)  BEGIN
	DECLARE  client_id  INT;
    DECLARE _value varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId')
    into _value, client_id;

    set _value = REPLACE(_value,'"','');

	select id , concat(equipmentname,' - ',modelno)  label from equipment
	where concat(equipmentname,' - ',modelno) like CONCAT('%',_value,'%') and deleted = 0 and (clientid = client_id or clientid = 1)
    order by equipmentname asc limit 5 ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipmentbrand` (IN `filter` LONGTEXT)  BEGIN

    DECLARE _value varchar(500);
	DECLARE  client_id INT;

	select JSON_EXTRACT(filter,'$.value'),
	JSON_EXTRACT(filter,'$.clientId')
    into _value, client_id;
    set _value = REPLACE(_value,'"','');
	select id , concat(brandname,' - ',brandseries) label from equipmentbrand
	where  concat(brandname,' - ',brandseries) like CONCAT('%',_value,'%') and deleted = 0 and (clientid = client_id or clientid = 1) order by brandname;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipmentInstock` (IN `filter` LONGTEXT)  BEGIN
	DECLARE  client_id , branch_id INT;
    DECLARE _value varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , branch_id;

    set _value = REPLACE(_value,'"','');

	select e.id , concat(equipmentname,' - ',invoicenumber,' (',purchasedate,')')  as label,
    e.amount,
     (select JSON_ARRAYAGG(json_object('category',i.category,
                      'paidamount',i.amount,'remark',i.remark,
                    'paymentdate',i.paymentdate,'chequeDate',i.chequedate,'bankName',i.bankname,
                    'status',i.status,'paymentmode',i.paymentmode,'paymentmodeid',(i.paymentmode+0),'chequeno',i.chequeno,'referenceid',i.referenceid))
                     from investment i where e.id = i.equipmentinstockid
				     )
				      paymentdetail,
	(select JSON_ARRAYAGG(json_object('category',ref_e.category,
                      'paidamount',ref_e.amount,'remark',ref_e.remark,
                    'expensedate',ref_e.expensedate,'chequeDate',ref_e.chequedate,'bankName',ref_e.bankname,
                    'status',ref_e.status,'paymentmode',paymentmode,'paymentmodeid',(paymentmode+0),'chequeno',ref_e.chequeno,'referenceid',ref_e.referenceid ))
                     from expense ref_e where e.id = ref_e.equipmentinstockid
				     )
				      expensepaymentdetail
    from equipmentinstock e
    inner join equipment ref_e on e.equipmentid = ref_e.id
	where equipmentname like CONCAT(_value,'%') and e.deleted = 0 and e.clientid = client_id and
    e.branchid = branch_id
    order by equipmentname asc limit 5 ;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipmentInstockexpensepaymentdetail` (IN `_equipmentinstockid` INT, IN `_clientid` INT)  BEGIN

	select (JSON_ARRAYAGG(json_object('category',ref_e.category,
	'paidamount',ref_e.amount,'remark',ref_e.remark,
	'expensedate',ref_e.expensedate,'chequeDate',ref_e.chequedate,'bankName',ref_e.bankname,
	'status',ref_e.status,'paymentmode',paymentmode,'paymentmodeid',(paymentmode+0),'chequeno',ref_e.chequeno,
	'referenceid',ref_e.referenceid ))) expensepaymentdetail
    from expense ref_e where ref_e.equipmentinstockid = _equipmentinstockid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipmentInvoice` (IN `filter` LONGTEXT)  BEGIN

	DECLARE  client_id , branch_id INT;
    DECLARE _value varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , branch_id;

    set _value = REPLACE(_value,'"','');

	select e.id , concat(invoicenumber,' (',purchasedate,')')  as label,e.amount
    from equipmentpurchase e
	where invoicenumber like CONCAT(_value,'%') and e.deleted = 0 and e.clientid = client_id and
    e.branchid = branch_id
    order by invoicenumber asc limit 5 ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionequipmentInvoicepaymentdetail` (IN `_equipmentinvoiceid` INT, IN `_clientid` INT)  BEGIN

	select (JSON_ARRAYAGG(json_object('category',i.category,
	'paidamount',i.amount,'remark',i.remark,
	'paymentdate',i.paymentdate,'chequeDate',i.chequedate,'bankName',i.bankname,
	'status',i.status,'paymentmode',i.paymentmode,'paymentmodeid',(i.paymentmode+0),'chequeno',i.chequeno,
    'referenceid',i.referenceid))) paymentdetail
	 from investment i where i.equipmentinvoiceid = _equipmentinvoiceid and i.clientid = _clientid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionmember` (IN `filter` LONGTEXT)  BEGIN
	DECLARE  client_id ,  _branchid INT;
    DECLARE _value  varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , _branchid;

    set _value = REPLACE(_value,'"','');

	select id , concat(firstname,' ',lastname,' - ',membercode) label,mobile,personalemailid,
    concat(firstname,' ',lastname) membername,membercode,(status+0)statusId,lastdisclaimersubmitdate,lastdisclaimerid
    from member
	where  (firstname like CONCAT(_value,'%') or
			lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or
            membercode like CONCAT('%',_value,'%') or
            concat(firstname,' ',lastname) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ',membercode) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ',membercode , ' - ' , mobile) like CONCAT(_value,'%')
            ) and
            deleted = 0 and clientid = client_id and
            (case when enablesharetootherbranches = 0 then json_search(branchid, 'one' , _branchid ) is not null else 1=1 end)
            order by firstname,lastname limit 10;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionmembercode` (IN `filter` LONGTEXT)  BEGIN

	DECLARE  client_id , _branchid INT;
    DECLARE _value  varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id, _branchid;

    set _value = REPLACE(_value,'"','');

	select membercode,concat(firstname,' ',lastname,' - ',membercode) label from member
	where
    (firstname like CONCAT(_value,'%') or
			lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or
            membercode like CONCAT('%',_value,'%') or
            concat(firstname,' ',lastname) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ',membercode) like CONCAT(_value,'%')
            )
     and
    deleted = 0 and clientid = client_id and
    (case when enablesharetootherbranches = 0 then json_search(branchid, 'one' , _branchid ) is not null else 1=1 end)
    order by firstname,lastname limit 10;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionmembervisitorbook` (IN `filter` LONGTEXT)  BEGIN

	DECLARE  client_id ,  _branchid INT;
    DECLARE _value  varchar(500);

	select JSON_EXTRACT(filter,'$.value'),
    JSON_EXTRACT(filter,'$.clientId'),
    JSON_EXTRACT(filter,'$.branchid')
    into _value, client_id , _branchid;

    set _value = REPLACE(_value,'"','');

	select id , concat(firstname,' ',lastname,' - ',membercode) label,mobile,personalemailid,
    concat(firstname,' ',lastname) membername,membercode,(status+0)statusId,
    last_covid19submitdate,covidrisk,(covidrisk + 0) covidriskId,dateofbirth,(gender+0)genderId,ispregnant
    from member
	where  (firstname like CONCAT(_value,'%') or
			lastname like CONCAT(_value,'%') or
			mobile like CONCAT(_value,'%') or
            membercode like CONCAT('%',_value,'%') or
            concat(firstname,' ',lastname) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ',membercode) like CONCAT(_value,'%') or
            concat(firstname,' ',lastname,' - ',membercode , ' - ' , mobile) like CONCAT(_value,'%')
            ) and
            deleted = 0 and clientid = client_id and
            (case when enablesharetootherbranches = 0 then json_search(branchid, 'one' , _branchid ) is not null else 1=1 end)
            order by firstname,lastname limit 5;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPsuggestionstate` (IN `filter` VARCHAR(100))  BEGIN

	select id 'id' ,name 'label', country_code from state where name like CONCAT(filter,'%') order by name asc limit 5 ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPSwipeDetailslogssave` (IN `member_id` VARCHAR(50), IN `isbiometric` INT, IN `branch_id` INT)  BEGIN

DECLARE user_id varchar(50);

if isbiometric = 1 then

	insert into SwipeDetailslogs(userid,createdbydate,isbiometric,branchid)
    values(member_id,now(),isbiometric,branch_id);
else
	select concat(clientid,membercode) into user_id  from member where id = member_id;

    insert into SwipeDetailslogs(userid,createdbydate,isbiometric,branchid)
    values(user_id,now(),isbiometric,branch_id);

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPSwipeDetailslogsview` (IN `client_id` INT, IN `branch_id` INT)  BEGIN

select  s.createdbydate date,m.id,m.firstname,m.lastname,
m.image,m.memberprofileimage,m.membercode,(m.gender+0)genderId, m.status,(m.status + 0) statusId,
m.createdbydate,(select max(expirydatesubscription) from subscription where member =  m.id ) maxexpirydate,
last_covid19submitdate,covidrisk,(covidrisk + 0) covidriskId,
(select JSON_ARRAYAGG(json_object('duedate',date,'dueamount',amount,'daysleft',DATEDIFF(date,now()))) from installment where
 branchid = m.defaultbranchid and m.id = installment.memberid
 and date <= DATE_ADD(date(now()), INTERVAL 7 DAY) and installmentstatus != 2 ) duedetails
from  SwipeDetailslogs s
inner join member m  on s.userid = concat(m.clientid,m.membercode)
where date(s.createdbydate) = date(now()) and m.clientid = client_id and s.branchid = branch_id
order by s.id desc limit 20;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxcodecategorydelete` (IN `taxcategory_id` INT, IN `client_id` INT)  BEGIN
update taxcodecategory set
deleted=1
where id=taxcategory_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxcodecategorysave` (IN `taxcategory_id` INT, IN `taxcategory_name` VARCHAR(100), IN `taxcategory_code` INT, IN `taxcateory_taxgroupid` INT, IN `client_id` INT, IN `taxcategory_createdbyid` INT, IN `taxcategory_type` VARCHAR(20), IN `taxcategory_clientcountry` VARCHAR(100))  BEGIN

DECLARE isExist int DEFAULT 0;
DECLARE countryID varchar(2) DEFAULT NULL;

if taxcategory_clientcountry != '' && taxcategory_clientcountry is not null then
		select code into countryID from country where name = taxcategory_clientcountry;

		if countryID is null then
			Call `ERROR` ('Please enter valid country.');
		end if;
	end if;


if taxcategory_id = 0 then

	SELECT count(1) into isExist FROM taxcodecategory where taxcategory_name = taxcategoryname and clientid = client_id and deleted = 0;

			if isExist > 0
			then
				Call `ERROR` ('Tax Category Name Already exists.');
			end if;

            insert into taxcodecategory(clientid,taxcategoryname,taxcode,taxgroupid,createdbyid,createdbydate,
            taxcodecategorytype,clientcountrycode)
		   values(client_id,taxcategory_name,taxcategory_code,taxcateory_taxgroupid,taxcategory_createdbyid,now(),
           taxcategory_type,countryID);

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxcodecategorysearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table,_clientcountrycode varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.clientcountrycode')
    into client_id, filtered,_clientcountrycode;

    set _columns = concat('t.id,t.taxcategoryname,t.taxgroupid,tax.taxname as taxgroupname,t.taxcode,tax.taxgroupitem,t.taxcodecategorytype,
    t.clientid  ,' , client_id , ' requestclientid' );

    set _table = ' from taxcodecategory t
    inner join tax on t.taxgroupid = tax.id';

    set _where = concat(' where  t.deleted = 0 and (t.clientid = ', client_id ,' or (t.clientid = 1 and t.clientcountrycode = ' ,_clientcountrycode , '))' );

		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	set @_qry = CONCAT('select ' , _columns, _table ,_where );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxcodecategoryview` (IN `taxcategory_id` INT, IN `client_id` INT)  BEGIN

	 select t.id,taxcategoryname,taxgroupid,taxcode,tax.taxgroupitem,t.taxcodecategorytype  from taxcodecategory t
	 inner join tax on t.taxgroupid = tax.id
	 where t.id = taxcategory_id ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxdelete` (IN `tax_id` INT, IN `client_id` INT)  BEGIN

  DECLARE isExit int DEFAULT 0;
DECLARE _id,_checked,i, j, _length INT;
DECLARE obj,_taxgroupitem LONGTEXT;

select JSON_ARRAYAGG(taxgroupitem) into _taxgroupitem  from tax where  clientid = client_id and deleted = 0 and taxgroupitem is not null;

if _taxgroupitem is not null then
SET i = 0;
	  SET _length = JSON_LENGTH(_taxgroupitem);

		WHILE  i < _length DO
			SELECT JSON_EXTRACT(_taxgroupitem,CONCAT('$[',i,']')) into obj;

        SELECT JSON_EXTRACT(obj,CONCAT('$[',i,']')) into obj;

  select JSON_EXTRACT(obj, '$.checked') ,
		JSON_EXTRACT(obj, '$.id')
		into _checked,_id;
	if _id = tax_id and _checked  = true
	then
       Call `ERROR` ('Tax In Tax Group So It can\'t be deleted.');
	end if;
    SET  i = i + 1;
		END WHILE;

end if;
 SELECT count(1) into isExit FROM taxcodecategory where clientid = client_id and deleted = 0 and taxgroupid = tax_id;

if isExit > 0
			then
       Call `ERROR` ('Tax In Tax Code Category So It can\'t be deleted.');
			end if;

update tax set
deleted=1
where id=tax_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxsave` (IN `tax_id` INT, IN `client_id` INT, IN `tax_taxname` VARCHAR(100), IN `tax_percentage` DECIMAL(12,2), IN `tax_taxgroup` LONGTEXT, IN `tax_clientcountry` VARCHAR(100))  BEGIN

DECLARE isExit,isMaximun int DEFAULT 0;
DECLARE countryID varchar(2) DEFAULT NULL;

if tax_clientcountry != '' && tax_clientcountry is not null then
		select code into countryID from country where name = tax_clientcountry;

		if countryID is null then
			Call `ERROR` ('Please enter valid country.');
		end if;
	end if;

	if tax_id = 0 then

		SELECT count(1) into isExit FROM tax where taxname = tax_taxname and percentage = tax_percentage
		and deleted = 0 and (clientid = client_id or clientid = 1);

			if isExit > 0
			then
				Call `ERROR` ('Tax Already exists.');
			end if;

		SELECT count(1) into isMaximun FROM tax where clientid = client_id and deleted = 0;

			if isMaximun >= 20
			then
				Call `ERROR` ('You are not allowed to configure tax more than twenty.');
			end if;

				insert into tax(clientid,taxname,percentage,taxgroupitem,clientcountrycode)
				values(client_id,tax_taxname,tax_percentage,tax_taxgroup,countryID);

	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE client_id, i, _length INT;
    DECLARE filtered, obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _table,_orderby,_clientcountrycode varchar(500);

	select JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),
    JSON_EXTRACT(tableInfo,'$.clientcountrycode')
    into client_id, filtered,_clientcountrycode;

	set _columns = concat(' t.id,t.taxname,t.percentage,t.taxgroupitem,t.isservice,t.isproduct,t.clientid  ,' , client_id , ' requestclientid' );
    set _table = ' from tax t';
	set _where = concat(' where  t.deleted = 0 and (t.clientid = ', client_id ,' or (t.clientid = 1 and t.clientcountrycode = ' ,_clientcountrycode , '))' );


		SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');


		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by deleted, id desc ';
    end if;

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtaxview` (IN `tax_id` INT, IN `client_id` INT)  BEGIN

	 select id,taxname,percentage,taxgroupitem  from tax
	 where id = tax_id;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatecontentget` (IN `data` LONGTEXT)  BEGIN


	DECLARE client_id, member_id,enquiry_id,subscription_id,installment_id,branch_id,i, j, _length,
    payment_id,gymbooking_id INT;

    DECLARE obj ,_replacetag  LONGTEXT;
	DECLARE  newcontent  LONGTEXT default JSON_ARRAY();
	DECLARE isTransactionalEnabled int default 0;

	select JSON_EXTRACT(data,'$.memberid'),
    JSON_EXTRACT(data,'$.clientid'),
     JSON_EXTRACT(data,'$.enquiryid'),
     JSON_EXTRACT(data,'$.subscriptionid'),
    JSON_EXTRACT(data,'$.replacetag'),
    JSON_EXTRACT(data,'$.installmentid'),
    JSON_EXTRACT(data,'$.branchid'),
    JSON_EXTRACT(data,'$.paymentid'),
    JSON_EXTRACT(data,'$.gymbookingid')
    into member_id,client_id,enquiry_id,subscription_id, _replacetag,installment_id,branch_id,
    payment_id,gymbooking_id;

    SELECT transactionalnotification into isTransactionalEnabled FROM member where id = member_id and deleted = 0;

    if isTransactionalEnabled = 0 and member_id is not null then
		Call `ERROR` ('Transactional notification disabled for member.');
    end if;

    SET j = 0;
	  SET _length = JSON_LENGTH(_replacetag);

		WHILE  j < _length DO
			SELECT JSON_EXTRACT(_replacetag,CONCAT('$[',j,']')) into obj;

				select query into @_qry from tagnames where tagname = obj;

					if(@_qry is not null) then

						SELECT SUBSTRING(obj,4,1) into @_tagtype;

						if(@_tagtype = 'G') then

							SET @memberid := branch_id;

						elseif(@_tagtype = 'E') then

							SET @memberid := enquiry_id;

                        elseif(@_tagtype = 'S') then

							SET @memberid := subscription_id;

						elseif(@_tagtype = 'I') then

							SET @memberid := installment_id;

                        elseif(@_tagtype = 'P') then

							SET @memberid := payment_id;

                        elseif(@_tagtype = 'B') then

							SET @memberid := gymbooking_id;

						 else
							SET @memberid := member_id;
						end if;

						PREPARE stmt FROM @_qry;
						EXECUTE stmt USING @memberid;
						DEALLOCATE PREPARE stmt;

                       set newcontent = JSON_ARRAY_APPEND(newcontent, '$' ,JSON_OBJECT('key', obj , 'value', @result));

					end if;

			SET  j = j + 1;
		END WHILE;

        select newcontent;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatedelete` (IN `template_id` INT, IN `user_id` INT, IN `client_id` INT)  BEGIN
update template set
deleted=1,
templatetitle = Concat(templatetitle,'_D', ID),
modifiedbyid = user_id, modifiedbydate = now()
where id=template_id and clientid = client_id ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatefornotification` (IN `client_id` INT, IN `notification_alias` VARCHAR(30))  BEGIN
		DECLARE isExist int default 0;
        DECLARE Enabled , isSmsEnabled , isEmailEnabled TINYINT(1) default 0;
		DECLARE _notificationthrough ,obj LONGTEXT;
        DECLARE  i, j, _length INT;
        DECLARE _checked , _name , _value varchar(20);
		DECLARE templatefor varchar(20) default '';

		SELECT id , isenable ,notificationthrough into isExist , Enabled , _notificationthrough FROM clientnotificationconfiguration
        where notificationalias = notification_alias and clientid = client_id;

            if (isExist > 0 and Enabled = 1) then
                    SET j = 0;
					SET _length = JSON_LENGTH(_notificationthrough);

					WHILE  j < _length DO
					SELECT JSON_EXTRACT(_notificationthrough,CONCAT('$[',j,']')) into obj;

					select JSON_EXTRACT(obj, '$.name'),
					JSON_EXTRACT(obj , '$.checked'),
                    JSON_EXTRACT(obj , '$.value')
					into _name, _checked,_value;

					set _name = REPLACE(_name,'"','');
                    set _value = REPLACE(_value,'"','');

					if(_checked = 'true' and _value = '2') then
						set templatefor = concat(templatefor , _value,',');
						set isSmsEnabled = 1;
					elseif (_checked = 'true') then
						set templatefor = concat(templatefor , _value,',');
						set isEmailEnabled = 1;
					end if;

					SET  j = j + 1;
					END WHILE;

        end if;
				if (isEmailEnabled = 1 and isSmsEnabled = 1) then

                    	(select templatetitle,subject,content,1 templatetype from template
						where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 1 and notificationalias = notification_alias order by clientid desc limit 1)
						union
						(select templatetitle,subject,content,2 templatetype from template
						where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 2 and notificationalias = notification_alias  order by clientid desc limit 1);



				elseif (isEmailEnabled = 1) then

					select templatetitle,subject,content,1 templatetype from template
					where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 1 and notificationalias = notification_alias order by clientid desc limit 1;

                elseif (isSmsEnabled = 1) then

					select templatetitle,subject,content, 2 templatetype from template
					where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 2 and notificationalias = notification_alias  order by clientid desc limit 1;

			   else

					select templatetitle,subject,content from template
					where clientid= client_id and deleted = 0 and 1 = 2 ;

				end if;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatenotificationgateway` (IN `client_id` INT)  BEGIN

select emailgateway,smsgateway from client where  id = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatesave` (IN `template_id` INT, IN `template_type` INT, IN `template_title` VARCHAR(200), IN `template_subject` VARCHAR(200), IN `template_content` VARCHAR(1000), IN `template_createdbyid` INT, IN `client_id` INT, IN `template_notificationalias` VARCHAR(200), IN `active_tab` INT, IN `template_predefinedtags` VARCHAR(200))  BEGIN

DECLARE templateid int default 0;
DECLARE _clientpackfilter LONGTEXT;

	if template_id =0 then
		insert into template(templatetype,templatetitle,subject,content,
        createdbyid,createdbydate,clientid,logintype)
		values(template_type,template_title,template_subject,template_content,
		template_createdbyid,now(),client_id,active_tab);

	elseif template_id > 0 then

		select id into templateid from template
        where notificationalias=template_notificationalias and templatetype = template_type and
        clientid=client_id limit 1;

		if templateid > 0 then

			update template set
			subject=template_subject,
			content=template_content,
			modifiedbyid =template_createdbyid,
			modifiedbydate =now(),
            logintype = active_tab
			where id=templateid and clientid=client_id;

		else

	    	select clientpackfilter into _clientpackfilter from template where id = template_id;

			insert into template(templatetype,templatetitle,subject,content,
			createdbyid,createdbydate,clientid, notificationalias,logintype,predefinedtags,
            clientpackfilter)
			values(template_type,template_title,template_subject,template_content,
			template_createdbyid,now(),client_id, template_notificationalias,active_tab,
            template_predefinedtags,_clientpackfilter);

		end if;
	else

			update template set
			subject=template_subject,
			content=template_content,
			modifiedbyid =template_createdbyid,
			modifiedbydate =now(),
            logintype = active_tab
			where id=templateid and clientid=client_id;
	end if;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplatesearch` (IN `tableInfo` LONGTEXT)  BEGIN

DECLARE pageSize, pageIndex, client_id, _offset, i, _length, _activeTab , _packtypeId INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit varchar(600);
    DECLARE _table varchar(800);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.activeTab'),JSON_EXTRACT(tableInfo,'$.packtypeId')
    into pageSize, pageIndex, client_id, filtered, sorted , _activeTab , _packtypeId;

	set _offset = pageIndex * pageSize;
	set _columns = 'id,templatetype,templatetitle,subject,content';

	set _where = concat(' where deleted =  0 and logintype = ' , _activeTab ,
    ' and json_search(clientpackfilter, ''one'' , ' , _packtypeId ,') is not null');

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' and _value != 'null' then
           if _id = 'templatetype' then
         		 set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
		else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
            end if;
              end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by templatetitle,deleted';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);



    set _table =concat( ' from (select * from  template ',_where,' and clientid = ' , client_id ,'
union
select * from  template ',_where,' and clientid = 1 and id not in (
select default_t.id  from  template default_t
inner join template client_t
on default_t.notificationalias = client_t.notificationalias and default_t.templatetype = client_t.templatetype
where default_t.clientid = 1
and client_t.clientid = ', client_id ,' and client_t.notificationalias is not null and default_t.id <> client_t.id
)) template ');


	set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table );

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtemplateview` (IN `template_id` INT, IN `client_id` INT, IN `notification_alias` VARCHAR(50), IN `notification_isbookingtemplate` TINYINT(1))  BEGIN

	if template_id is null and notification_isbookingtemplate = 1 then

		(select templatetitle,subject,content,1 templatetype from template
		where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 1 and notificationalias = notification_alias order by clientid desc limit 1)
		union
		(select templatetitle,subject,content,2 templatetype from template
		where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 2 and notificationalias = notification_alias  order by clientid desc limit 1)
        union
        (select templatetitle,subject,content,3 templatetype from template
		where (clientid= client_id || clientid = 1) and deleted = 0 and templatetype = 3 and notificationalias = notification_alias  order by clientid desc limit 1);

	elseif template_id is null then

		select  id,templatetype,(templatetype+0)templatetypeId,templatetitle,subject,content,notificationalias
		from template
		where notificationalias=notification_alias  and deleted = 0 and (clientid = client_id || clientid = 1)
        and (templatetype = 1 || templatetype = 3) order by clientid desc limit 1;


    elseif template_id is not null then

		select  id,templatetype,templatetitle,subject,content,notificationalias,predefinedtags
		from template
		where id=template_id  and deleted = 0 and (clientid = client_id || clientid = 1);

    end if;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtokenrefresh` (IN `bearerToken` TEXT)  BEGIN

	SELECT access_token, access_token_expires_on,
    client_id, refresh_token, refresh_token_expires_on, user_id , logintype
    FROM oauth_tokens WHERE refresh_token = bearerToken;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtokenrevoke` (IN `userid` INT)  BEGIN


	END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtokensave` (IN `accessToken` TEXT, IN `accessTokenExpiresOn` TIMESTAMP, IN `client_id` INT, IN `refreshToken` TEXT, IN `refreshTokenExpiresOn` TIMESTAMP, IN `user_id` INT, IN `login_type` INT)  BEGIN

DECLARE haslastlogin int;

	INSERT INTO oauth_tokens(access_token, access_token_expires_on,
	 client_id, refresh_token, refresh_token_expires_on, user_id ,logintype) VALUES
	 (accessToken, accessTokenExpiresOn, client_id, refreshToken,refreshTokenExpiresOn,
	 user_id,login_type);


	if login_type = 0 then

		update user set lastlogindate = now() where id = user_id and clientid = client_id and deleted = 0;

	else

		select count(1) into haslastlogin from member where id = user_id and clientid = client_id and deleted = 0 and lastlogindate is not null;

		update member set lastlogindate = now() where id = user_id and clientid = client_id and deleted = 0;

        select haslastlogin;

	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtokenvalidate` (IN `bearerToken` TEXT)  BEGIN
		DECLARE tokenfor int default 0;
		select logintype into tokenfor from oauth_tokens where access_token = bearerToken;

		if tokenfor > 0 then
			SELECT O.access_token, O.access_token_expires_on, O.client_id,
			O.refresh_token, O.refresh_token_expires_on, O.user_id,C.clientcode 'client_code',O.logintype , C.paymentgateway,
			biometric,
              M.membercode 'code',C.ishavemutliplebranch,
            (C.clienttype + 0) clienttypeId,M.defaultbranchid
			FROM oauth_tokens as O
			inner join client as C on O.client_id = C.id
			inner join member as M on O.user_id = M.id
			WHERE access_token = bearerToken and M.deleted = 0 and M.appaccess = 1 and M.status = 1 and C.status = 1;

        else

			SELECT O.access_token, O.access_token_expires_on, O.client_id,
			O.refresh_token, O.refresh_token_expires_on, O.user_id,C.clientcode 'client_code',C.paymentgateway,U.ismembermobilevisible 'mobile_viewrights',
			U.ismemberemailidvisible 'emailid_viewrights',O.logintype,r.modules, biometric,
			U.defaultbranchid,U.zoneid,U.isenquirymobilevisible 'enquirymobile_viewrights',U.isenquiryemailidvisible 'enquiryemailid_viewrights',
            U.enablediscountlimit,U.maxmonthlylimit, U.employeecode 'code',
            U.enablecomplimentarysale,U.complimentarysalelimit,C.ishavemutliplebranch,
            (C.clienttype + 0) clienttypeId,ifnull(C.ptattendancelimit,0) ptattendancelimit,
            ifnull(C.generategstinvoice, 0) generategstinvoice
			FROM oauth_tokens as O
			inner join client as C on O.client_id = C.id
			inner join user as U on O.user_id = U.id
			left outer join role r on U.assignrole = r.id
			WHERE access_token = bearerToken and U.deleted = 0 and U.status = 1 and C.status = 1 and U.appaccess = 1;

        end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainergeneralratingbymembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

    DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_feedbackfilter,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.feedbackfilter'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_feedbackfilter,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = ' u.id,concat(u.firstname,'' '',u.lastname) as trainername,
		sum(case when ur.rating is not null then 1 else 0 end) as members ,avg(ur.rating) rating' ;
    set _table = concat(' from user u
                left outer join userrating ur ON ur.userid = u.id
                where u.deleted = 0
                and u.clientid = ', client_id , ' and u.enableonlinelisting = 1
				and (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ') is not null)
				else defaultbranchid = ' , _branchid , ' end) and status = 1');

	 set _where = '';

     if _feedbackfilter = 1 then
			set _table = concat(_table , ' and date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(ur.createdbydate) <= date(current_date()) ');
    elseif _feedbackfilter = 2 then
			set _table = concat(_table , ' and date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(ur.createdbydate) <= date(current_date()) ');
	elseif _feedbackfilter = 3 then
			set _table = concat(_table , ' and date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(ur.createdbydate) <= date(current_date()) ');
    elseif _feedbackfilter = 4 then
			set _table = concat(_table , ' and date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(ur.createdbydate) <= date(current_date()) ');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			 if _where != '' then
					set _where = concat(_where , ' and ');
			 end if;
			 if _id = 'trainername' then
					set _where = CONCAT(_where , CONCAT('trainername ', ' like ''%', _value ,'%'''));
			 else
				set _where = CONCAT(_where , CONCAT( _id , ' like ''', _value ,'%'''));
			end if;
        end if;

		SET  i = i + 1;
	END WHILE;

    if _where != '' then
				set _where = concat(' having ' , _where);
			end if;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' ';
    end if;

    set	_orderby = concat(" group by u.id " , _where , _orderby );

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

    set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', " from
	(select count(1) " , _table , " group by u.id )pagecount");

		PREPARE stmt FROM @_qry;
		EXECUTE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainergeneralratingbymemberview` (IN `trainer_id` INT, IN `feedbackfilter` INT, IN `client_id` INT, IN `branch_id` INT)  BEGIN

    select  ur.id,ur.feedback,ur.rating ,concat(m.firstname,' ',m.lastname) as membername,
    concat(u.firstname,' ',u.lastname) as trainername,ur.createdbydate
    from userrating ur
	inner join member m ON ur.createdbyid = m.id
	inner join user u ON ur.userid = u.id
	where u.deleted = 0 and m.deleted = 0 and m.clientid = client_id and (ur.rating is not null) and
    ur.userid = trainer_id
    and (case when feedbackfilter=1 then date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(ur.createdbydate) <= date(current_date())
    when feedbackfilter=2 then date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(ur.createdbydate) <= date(current_date())
    when feedbackfilter=3 then date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(ur.createdbydate) <= date(current_date())
    when feedbackfilter=4 then date(ur.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(ur.createdbydate) <= date(current_date())
    end ) order by ur.id desc;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainergsfeedbackbymembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_feedbackfilter,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.feedbackfilter'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_feedbackfilter,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = ' ma.createdbyid,concat(u.firstname,'' '',u.lastname) as trainername,
		sum(case when rating is not null then 1 else 0 end) as members ,avg(rating) rating ' ;
    set _table = concat(' from classattendance ma
				inner join user u ON ma.createdbyid = u.id
                where ma.deleted = 0
                and u.clientid = ', client_id , ' and ma.branchid = ', _branchid);

	 set _where = '';

     if _feedbackfilter = 1 then
			set _table = concat(_table , ' and date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(ma.createdbydate) <= date(current_date()) ');
    elseif _feedbackfilter = 2 then
			set _table = concat(_table , ' and date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(ma.createdbydate) <= date(current_date()) ');
	elseif _feedbackfilter = 3 then
			set _table = concat(_table , ' and date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(ma.createdbydate) <= date(current_date()) ');
    elseif _feedbackfilter = 4 then
			set _table = concat(_table , ' and date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(ma.createdbydate) <= date(current_date()) ');
    end if;

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			 if _where != '' then
					set _where = concat(_where , ' and ');
			 end if;
			 if _id = 'trainername' then
					set _where = CONCAT(_where , CONCAT('trainername ', ' like ''%', _value ,'%'''));
			 else
				set _where = CONCAT(_where , CONCAT( _id , ' like ''', _value ,'%'''));
			end if;
        end if;

		SET  i = i + 1;
	END WHILE;

    if _where != '' then
				set _where = concat(' having ' , _where);
			end if;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' ';
    end if;

    set	_orderby = concat(" group by ma.createdbyid ,concat(u.firstname,'' '',u.lastname) " , _where , _orderby );

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

    set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', " from
	(select count(1) " , _table , " group by ma.createdbyid ,concat(u.firstname,'' '',u.lastname))pagecount");

		PREPARE stmt FROM @_qry;
		EXECUTE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainergsfeedbackbymemberview` (IN `trainer_id` INT, IN `feedbackfilter` INT, IN `client_id` INT, IN `branch_id` INT)  BEGIN

	select  ma.id,feedback,rating ,ma.createdbyid,concat(m.firstname,' ',m.lastname) as membername,
    concat(u.firstname,' ',u.lastname) as trainername,ma.modifiedbydate
    from classattendance ma
	inner join member m ON ma.memberid = m.id
	inner join user u ON ma.createdbyid = u.id
	where ma.deleted = 0 and m.deleted = 0 and m.clientid = client_id and (rating is not null) and
    ma.createdbyid = trainer_id and ma.branchid = branch_id
    and (case when feedbackfilter=1 then date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(ma.createdbydate) <= date(current_date())
    when feedbackfilter=2 then date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(ma.createdbydate) <= date(current_date())
    when feedbackfilter=3 then date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(ma.createdbydate) <= date(current_date())
    when feedbackfilter=4 then date(ma.createdbydate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(ma.createdbydate) <= date(current_date())
    end ) order by ma.id desc;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainerptfeedbackbymembersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_feedbackfilter,_branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.feedbackfilter'),JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_feedbackfilter,_branchid;

	set _offset = pageIndex * pageSize;

	set _columns = ' pt.ptownerid,concat(u.firstname,'' '',u.lastname) as trainername,
		sum(case when rating is not null then 1 else 0 end) as members ,avg(rating) rating ' ;
    set _table = concat(' from memberptattendance pt
				inner join user u ON pt.ptownerid = u.id
                where pt.deleted = 0 and u.clientid = ', client_id , ' and pt.branchid = ' , _branchid);

	 set _where = '';

     if _feedbackfilter = 1 then
			set _table = concat(_table , ' and date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(pt.attendancedate) <= date(current_date()) ');
    elseif _feedbackfilter = 2 then
			set _table = concat(_table , ' and date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(pt.attendancedate) <= date(current_date()) ');
	elseif _feedbackfilter = 3 then
			set _table = concat(_table , ' and date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(pt.attendancedate) <= date(current_date()) ');
    elseif _feedbackfilter = 4 then
			set _table = concat(_table , ' and date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(pt.attendancedate) <= date(current_date()) ');
    end if;


SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			 if _where != '' then
					set _where = concat(_where , ' and ');
			 end if;
			 if _id = 'trainername' then
					set _where = CONCAT(_where , CONCAT('trainername ', ' like ''%', _value ,'%'''));
			 else
				set _where = CONCAT(_where , CONCAT( _id , ' like ''', _value ,'%'''));
			end if;
        end if;

		SET  i = i + 1;
	END WHILE;

    if _where != '' then
				set _where = concat(' having ' , _where);
			end if;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

			set _id = REPLACE(_id,'"','');

			set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' ';
    end if;

    set	_orderby = concat(" group by pt.ptownerid ,concat(u.firstname,'' '',u.lastname) " , _where , _orderby );

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

    set @_qry = CONCAT('select ' , _columns, _table ,' ', _orderby , _limit );

	PREPARE stmt FROM @_qry;
	EXECUTE stmt ;
	DEALLOCATE PREPARE stmt;

	set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', " from
	(select count(1) " , _table , " group by pt.ptownerid ,concat(u.firstname,'' '',u.lastname))pagecount");

		PREPARE stmt FROM @_qry;
		EXECUTE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPtrainerptfeedbackbymemberview` (IN `trainer_id` INT, IN `feedbackfilter` INT, IN `client_id` INT, IN `branch_id` INT)  BEGIN

	select  pt.id,feedback,rating ,pt.ptownerid,concat(m.firstname,' ',m.lastname) as membername,
    concat(u.firstname,' ',u.lastname) as trainername,pt.confirmationdate
    from memberptattendance pt
	inner join member m ON pt.memberid = m.id
	inner join user u ON pt.ptownerid = u.id
	where pt.deleted = 0 and m.deleted = 0 and m.clientid = client_id and (rating is not null) and
    pt.ptownerid = trainer_id and pt.branchid = branch_id
    and (case when feedbackfilter=1 then date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 MONTH)) and date(pt.attendancedate) <= date(current_date())
    when feedbackfilter=2 then date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 3 MONTH)) and date(pt.attendancedate) <= date(current_date())
    when feedbackfilter=3 then date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 6 MONTH)) and date(pt.attendancedate) <= date(current_date())
    when feedbackfilter=4 then date(pt.attendancedate)  >=  date(DATE_SUB(current_date(), INTERVAL 1 YEAR)) and date(pt.attendancedate) <= date(current_date())
    end ) order by pt.id desc;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuseragreedatesave` (IN `user_id` INT, IN `client_id` INT)  BEGIN

update user set	agreedate = date(now()) where id = user_id and clientid=client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserassignshiftdelete` (IN `assignshift_id` INT, IN `user_id` INT)  BEGIN

	update assignshift set
	deleted = 1,
	modifiedbyid = user_id,
	modifiedbydate=now()
	where id=assignshift_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserassignshiftsave` (IN `assignshift_id` INT, IN `assignshift_employee_id` VARCHAR(20), IN `shift_id` VARCHAR(20), IN `assignshift_startdate` DATE, IN `assignshift_enddate` DATE, IN `client_id` INT, IN `createdby_id` INT, IN `branchid_id` INT)  BEGIN

DECLARE isExist int default 0;

   if assignshift_id = 0 then

		SELECT count(1) into isExist FROM assignshift
		where (date(assignshift_startdate) between date(startdate) and date(enddate)
		or date(assignshift_enddate) between date(startdate) and date(enddate))
		and deleted = 0 and employeeid = assignshift_employee_id and clientid = client_id;

		if isExist > 0 then
			Call `ERROR`('Staff is already assigned shift for this period.');
		end if;

		insert into assignshift (employeeid,shiftid,startdate,enddate,createdbyid,createdbydate,
        clientid,branchid)
        values (assignshift_employee_id,shift_id,assignshift_startdate,assignshift_enddate,
        createdby_id,now(),client_id,branchid_id);

    elseif assignshift_id > 0 then

		SELECT count(1) into isExist FROM assignshift
		where (date(assignshift_startdate) between date(startdate) and date(enddate)
		or date(assignshift_enddate) between date(startdate) and date(enddate))
		and deleted = 0 and employeeid = assignshift_employee_id and clientid = client_id
        and id != assignshift_id;

		if isExist > 0 then
			Call `ERROR`('Staff is already assigned shift for this period.');
		end if;

        update assignshift set
        employeeid = assignshift_employee_id,
        shiftid = shift_id ,
        startdate = assignshift_startdate,
        enddate = assignshift_enddate,
        modifiedbyid = createdby_id ,
        modifiedbydate = now()
        where id = assignshift_id and clientid = client_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserassignshiftsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table  varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid;

	set _offset = pageIndex * pageSize;
	set _columns = ' s.id,employeeid,shiftid,s.startdate,s.enddate,
    concat(ref_u.firstname,'' '',ref_u.lastname) as employeename,
    ref_s.shiftname';
    set _table = ' from assignshift s
				   left outer join user ref_u ON s.employeeid = ref_u.id
                   left outer join staffshift ref_s ON s.shiftid = ref_s.id';
	set _where = concat(' where s.deleted = 0 and s.clientid = ', client_id , ' and
		s.branchid = ' , _branchid );

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id= 'startdate' or _id= 'enddate' then
			      set _where = CONCAT(_where , CONCAT(' and date(s.', _id , ') = date(''',getDateFromJSON(_value), ''')'));
			elseif _id= 'employeename' then
			      set _where = CONCAT(_where , CONCAT(' and s.employeeid = ', _value ,' '));
            elseif _id= 'shiftname' then
			      set _where = CONCAT(_where , CONCAT(' and ref_s.', _id , ' like ''%', _value ,'%'''));
            end if;
           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by s.id  desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	  set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
	  EXECUTE stmt;
	  DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserattendancedelete` (IN `attendance_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN
update userattendance set
deleted=1,
modifiedbyid=user_id,
modifiedbydate=now()
where id=attendance_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserattendanceSave` (IN `atttendance_id` INT, IN `attendance_usercode` VARCHAR(50), IN `attendance_createdbyid` INT, IN `client_id` INT, IN `atttendance_intime` DATETIME, IN `atttendance_outtime` DATETIME, IN `attendance_branchid` INT, IN `attendance_distance` INT)  BEGIN

	DECLARE user_id , userattendance_id int DEFAULT 0;
	DECLARE _firstname varchar(200);
    DECLARE _lastname varchar(200);
	DECLARE _image varchar(200);
    DECLARE _gender varchar(200);
   Declare in_time datetime;

	select id, firstname, lastname, image, gender into
     user_id, _firstname, _lastname, _image, _gender from user where employeecode = attendance_usercode and clientid = client_id and deleted = 0;

	if user_id is null or user_id = 0 then
		Call `ERROR` ('Invalid User.');
	end if;

if atttendance_id = 0 then

		if date(atttendance_intime) = date(now()) then

				  select intime , id into in_time , userattendance_id from userattendance
				  where userid = user_id and intime > date_add(now(),interval -12 hour)
				  and outtime is null and deleted = 0 order by userid desc limit 1;

				if in_time is null then
					insert into userattendance(userid,createdbyid,createdbydate,
					deleted,intime,branchid,distance)
					values(user_id,attendance_createdbyid,now(),0,atttendance_intime,attendance_branchid,attendance_distance);
				else
					if(TIMESTAMPDIFF(SECOND  , in_time , now()) > 15) then
						update userattendance set outtime = now(),
						difference = TIMESTAMPDIFF(MINUTE  , intime , now())
						where userid = user_id and outtime is null
                        and id = userattendance_id;
					end if;
				end if;

			update user set lastcheckin = now() where id = user_id;

    else

		insert into userattendance(userid,createdbyid,createdbydate,
		deleted,intime,branchid,distance)
		values(user_id,attendance_createdbyid,now(),0,atttendance_intime,attendance_branchid,attendance_distance);

    end if;
elseif atttendance_id > 0 then
			update userattendance set
            intime = atttendance_intime,
            outtime = atttendance_outtime,
            difference = TIMESTAMPDIFF(MINUTE  , atttendance_intime , atttendance_outtime),
            modifiedbyid = attendance_createdbyid,
            modifiedbydate = now()
            where id = atttendance_id;
end if;

    select LAST_INSERT_ID() as id, _firstname as firstname,_lastname as lastname,
    _image as image, _gender as gender ,attendance_usercode as usercode,
    user_id as _userid;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserchangepassword` (IN `user_id` INT, IN `old_password` VARCHAR(100), IN `new_password` VARCHAR(100), IN `client_id` INT)  BEGIN
DECLARE isExit int DEFAULT 0;

	SELECT count(1) into isExit FROM user where password = old_password and clientid = client_id and id = user_id;
	if isExit <= 0
	then
        Call `ERROR` ('Please enter correct old password.');
	end if;

update user set
password = new_password
where clientid = client_id and id = user_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusercovid19disclaimersearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length,_userdisclaimerfilter INT;
    DECLARE filtered, sorted , obj , _filterbydate LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table ,_branchid,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.staffdisclaimerfilter'),
    JSON_EXTRACT(tableInfo,'$.filterbydate'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted ,_branchid,_userdisclaimerfilter,
    _filterbydate,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

    if _filterbydate = 'null' then
				set _filterbydate = null;
	end if;

	set _columns = 'md.id,md.createdbydate,md.covidrisk,(md.covidrisk+0)covidriskId,md.disclaimerform,
    concat(u.firstname,'' '',u.lastname ) staffname,u.lastcheckin,md.covid19history,
    u.status,(u.status+0)statusId,u.image,(u.gender+0)genderId,u.employeecode,md.ispregnant';
    set _table = ' from user u
            left outer join membercovid19disclaimer md on md.userid = u.id and md.logintype = 0 ';
	set _where = concat(' where u.clientid = ',client_id , ' and
    (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , _branchid , ' ) is not null)
         else defaultbranchid = ' , _branchid , ' end)');

	if _userdisclaimerfilter = 1 and _filterbydate is not null then
		set _where = concat(_where , ' and  (u.last_covid19submitdate is null or not (date(getDateFromUTC(u.last_covid19submitdate,''',client_offsetvalue,''',-1)) > date(' ,_filterbydate , ') ))');
    elseif _userdisclaimerfilter = 1 and _filterbydate is  null then
		set _where = concat(_where , ' and u.last_covid19submitdate is null');
    elseif _userdisclaimerfilter = 2 and _filterbydate is not null  then
   		set _where = concat(_where , ' and u.last_covid19submitdate is not null and  not (date(getDateFromUTC(u.last_covid19submitdate,''',client_offsetvalue,''',-1)) < date(' ,_filterbydate , ') )');
    elseif _userdisclaimerfilter = 2 and _filterbydate is null  then
		set _where = concat(_where , ' and u.last_covid19submitdate is not null ');
    end if;

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

         if _value != '' and _value != 'null' then
        if _id = 'staffname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(u.firstname,'' '',u.lastname) ', ' like ''%', _value ,'%'''));
        elseif _id = 'createdbydate' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(md.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id = 'lastcheckin' then
			     set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(u.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id = 'covidrisk' then
				set _where = CONCAT(_where , CONCAT(' and md.', _id , ' = ', _value));
        elseif _id = 'employeecode' then
					set _where = CONCAT(_where , CONCAT(' and u.', _id , ' like ''%', _value ,'%'''));
        else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
    	end if;
        end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by md.createdbydate desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserdelete` (IN `employee_id` INT, IN `client_id` INT)  BEGIN
	DECLARE isOwnerEmployee int DEFAULT 0;

	select isowner into isOwnerEmployee from user where id = employee_id;

    if isOwnerEmployee = 1 then
		Call `ERROR` ('User can\'t be deleted.');
     end if;

     update user set
		deleted=1, emailid = Concat(emailid,'_D', ID)
		where id=employee_id and clientid = client_id;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserprofilegroupsessionclasswisesearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, user_id,_offset, i, _length INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,month_filter,
    year_filter,chart_filtertype varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.userId'), JSON_EXTRACT(tableInfo,'$.chartFilter'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.monthFilter'),JSON_EXTRACT(tableInfo,'$.yearFilter')
    into pageSize, pageIndex, client_id, user_id,chart_filtertype, filtered,sorted, month_filter,year_filter;

	set _offset = pageIndex * pageSize;

  set _columns = ' c.id,uc.createdbydate,c.sessiontype,c.classname,uc.commission';
    set _table = ' from usercommission uc
                    inner join class c on c.id = uc.classid and uc.classid is not null and uc.classattendanceid is null ';
	set _where = concat(' where  c.deleted = 0 and c.clientid = ', client_id ,' and uc.userid = ', user_id );

    if(chart_filtertype = 0) then
    			set _where = concat(_where , ' and month(uc.createdbydate) = ' , month_filter , ' and year(uc.createdbydate) = ' , year_filter );
    else
    			set _where = concat(_where , ' and year(uc.createdbydate) = ', year_filter);
    end if;

    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
       	 if _id = 'createdbydate' then
				 set _where = CONCAT(_where , CONCAT(' and date(uc.', _id , ') = date(''',getDateFromJSON(_value), ''')'));
		elseif _id= 'sessiontype' then
                set _where = CONCAT(_where , CONCAT(' and c.', _id , ' = ', _value));
		else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	end if;

        end if;
		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by uc.createdbydate desc';
    end if;

    set _limit = concat(' limit ', pageSize,' offset ', _offset );

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit);

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserprofilegroupsessionsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, user_id,_offset, i, _length INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,month_filter,
    year_filter,chart_filtertype,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.userId'), JSON_EXTRACT(tableInfo,'$.chartFilter'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.monthFilter'),JSON_EXTRACT(tableInfo,'$.yearFilter'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, user_id,chart_filtertype, filtered,sorted, month_filter,year_filter,
    client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

    set _columns = ' m.id,concat(member.firstname,'' '',member.lastname) as name,m.createdbydate,class.sessiontype,
      member.membercode,class.classname,member.gender,concat(user.firstname,'' '',user.lastname) as staffname,uc.commission';
    set _table = ' from classattendance m
					INNER JOIN member ON m.memberid = member.id
					INNER JOIN class ON m.classid = class.id
                    INNER JOIN user ON m.createdbyid = user.id
                    left outer join usercommission uc on m.id = uc.classattendanceid';
	set _where = concat(' where m.classid is not null and m.deleted = 0 and member.clientid = ', client_id ,' and user.id = ', user_id );
  if(chart_filtertype = 0) then
 			set _where = concat(_where , ' and month(getDateFromUTC(m.createdbydate,''',client_offsetvalue,''',-1)) = ', month_filter ,' and year(getDateFromUTC(m.createdbydate,''',client_offsetvalue,''',-1)) = ' , year_filter);
  else
 			set _where = concat(_where , ' and year(getDateFromUTC(m.createdbydate,''',client_offsetvalue,''',-1)) = ' , year_filter);
  end if;
    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
       	 if _id = 'name' then
			      set _where = CONCAT(_where , CONCAT(' and concat(member.firstname,'' '',member.lastname) like ''%', _value ,'%'''));
		elseif _id = 'attendancedate' or _id = 'createdbydate' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(m.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id= 'sessiontype' then
                set _where = CONCAT(_where , CONCAT(' and class.', _id , ' = ', _value));
		else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	end if;

        end if;
		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.createdbydate desc';
    end if;

    set _limit = concat(' limit ', pageSize,' offset ', _offset );

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit);
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserprofilepersonaltariningsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, user_id,_offset, i, _length,_branchid  INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table,month_filter,
    year_filter,chart_filtertype,client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.userId'), JSON_EXTRACT(tableInfo,'$.chartFilter'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.monthFilter'),JSON_EXTRACT(tableInfo,'$.yearFilter'),
    JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, user_id,chart_filtertype, filtered,sorted,
    month_filter,year_filter,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

   set _columns = ' m.id,concat(member.firstname,'' '',member.lastname) as name
					,m.createdbydate,service.servicename,m.attendancedate,
                    service.sessiontype,starttime , endtime ,uc.commission';
    set _table = concat(' from memberptattendance m
					INNER JOIN member ON m.memberid = member.id
					INNER JOIN (select * from subscription where branchid = ',_branchid,' union all
					select * from subscriptionhistory where branchid = ',_branchid,' ) s on m.subscriptionid =  s.id
                    left outer join service ON s.serviceplan = service.id
					INNER JOIN user ON m.ptownerid = user.id
                    left outer join usercommission uc on m.id = uc.ptattendanceid');
	set _where = concat(' where m.deleted = 0 and member.clientid = ', client_id ,' and user.id = ', user_id );
  if(chart_filtertype = 0) then
 			set _where = concat(_where , ' and month(getDateFromUTC(m.attendancedate,''',client_offsetvalue,''',-1)) = ', month_filter ,' and year(getDateFromUTC(m.attendancedate,''',client_offsetvalue,''',-1)) = ' , year_filter);
  else
 			set _where = concat(_where , ' and year(getDateFromUTC(m.attendancedate,''',client_offsetvalue,''',-1)) = ' , year_filter);
  end if;
    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null' then
       	 if _id = 'name' then
			      set _where = CONCAT(_where , CONCAT(' and concat(member.firstname,'' '',member.lastname) like ''%', _value ,'%'''));
		elseif _id = 'attendancedate' then
			     set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(m.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
        elseif _id= 'sessiontype' then
                set _where = CONCAT(_where , CONCAT(' and service.', _id , ' = ', _value));
		else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
	end if;

        end if;
		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by m.attendancedate desc';
    end if;

    set _limit = concat(' limit ', pageSize,' offset ', _offset );

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit);
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserprofilestaffpaysearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id,_offset, i, _length,user_id INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
      JSON_EXTRACT(tableInfo,'$.userId')
    into pageSize, pageIndex, client_id, filtered,sorted,user_id;

	set _offset = pageIndex * pageSize;

     set _columns = 's.id,amount,paymentdate,paymentmode,monthofsalary,paidsalary,paidcommission,
				 chequeno,chequedate,bankname,s.status,referenceid,(paymentmode + 0) paymentmodeId,remark,
                 staffpaytype,case when advancepaymentadjustment = 1 then "Yes" else "No" end
				advancepaymentadjustmentLabel';
    set _table = ' from staffpay s
                        INNER JOIN user u ON s.employeeid = u.id ';
	set _where = concat(' where  s.deleted = 0 and s.clientid = ', client_id ,' and employeeid = ' ,user_id);


    SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		if _value != '' and _value != 'null'  then
        if _id= 'paymentdate' then
			set _where = CONCAT(_where , CONCAT(' and date(', _id , ') = date(''',_value, ''')'));
       elseif _id = 'paymentmode' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
      elseif _id = 'advancepaymentadjustment' then
				 if _value = 1 then
						set _where = concat(_where , ' and advancepaymentadjustment = 1');
				 elseif _value = 2 then
					 set _where = concat(_where , ' and advancepaymentadjustment = 0');
                end if;
	   elseif _id = 'staffpaytype' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
      else
		    set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
    	end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by  year(monthofsalary) desc,month(monthofsalary)  desc,employeeid , paymentdate desc ';
    end if;

    set _limit = concat(' limit ', pageSize,' offset ', _offset );

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit);

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

  	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserratingsave` (IN `member_id` INT, IN `user_rating` DECIMAL(2,1), IN `user_id` INT, IN `client_id` INT, IN `user_feedback` VARCHAR(500))  BEGIN

DECLARE isExist int default 0;

    select count(1) into isExist from userrating where userid = user_id
	and clientid = client_id and deleted = 0 and createdbyid = member_id and date(createdbydate) = date(now());

    if isExist > 0 then
		Call `ERROR`('Rating already made for trainer today.');
    end if;

		insert into userrating(userid,rating, createdbyid,createdbydate,clientid,feedback)
		values(user_id,user_rating,member_id,now(),client_id,user_feedback);

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserratingsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length ,member_id , branch_id INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table , client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
    JSON_EXTRACT(tableInfo,'$.memberId'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue'),
    JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,member_id,client_offsetvalue,branch_id;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

	set _columns = 'u.id,u.firstname ,u.lastname,
    ur.feedback,ur.rating';
	set _table = concat(' from user u
    left outer join userrating ur ON ur.userid = u.id and ur.createdbyid = ' , member_id , ' and date(ur.createdbydate) = date(now())');
	set _where = concat(' where u.deleted = 0
     and u.enableonlinelisting = 1 and u.clientid = ' , client_id , '
     and (case when zoneid is not null then zoneid in (select id from zone where json_search(branchlist, ''one'' , ' , branch_id , ') is not null)
	 else defaultbranchid = ' , branch_id , ' end) and status = 1 ');

 SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' and _value != 'null' then

			if _id = 'firstname' then
         		set _where = CONCAT(_where , CONCAT(' and ', 'concat(u.firstname,'' '',u.lastname) ', ' like ''%', _value ,'%'''));
            else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;

            end if;
		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by u.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

     PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserreferrallist` (IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `referral_filtertype` VARCHAR(100), IN `client_id` INT, IN `user_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);

   if(referral_filtertype = 0) then

		select concat(e.firstname, ' ' ,e.lastname) as name,e.memberid,e.createdbydate as date,
        (select JSON_ARRAYAGG(json_object('registrationdate',getDateFromUTC(ref_m.createdbydate ,client_offsetvalue,-1),
        'status', ref_m.status,'statusId',(ref_m.status + 0))) from member ref_m where
        ref_m.id = e.memberid) createdmemberdetail
		from user u
        Inner join enquiry e on u.id =  e.ref_employeeid
        where u.clientid = client_id and u.id = user_id
        and month(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) = month_filter and year(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) = year_filter;

	else

		 select concat(e.firstname, ' ' ,e.lastname) as name,e.memberid,e.createdbydate as date,
		 (select JSON_ARRAYAGG(json_object('registrationdate',getDateFromUTC(ref_m.createdbydate ,client_offsetvalue,-1),
        'status', ref_m.status,'statusId',(ref_m.status + 0))) from member ref_m where
        ref_m.id = e.memberid) createdmemberdetail
		 from user u
         Inner join enquiry e on u.id =  e.ref_employeeid
         where u.clientid = client_id and u.id = user_id
         and year(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) = year_filter;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusersave` (IN `employee_id` INT, IN `employee_title` VARCHAR(5), IN `employee_firstname` VARCHAR(100), IN `employee_lastname` VARCHAR(100), IN `employee_dateofjoining` DATE, IN `employee_dateofresigning` DATE, IN `employee_userid` VARCHAR(100), IN `employee_password` VARCHAR(100), IN `employee_gender` CHAR(10), IN `employee_panno` VARCHAR(30), IN `employee_image` VARCHAR(200), IN `employee_assignrole` INT, IN `employee_specialization` LONGTEXT, IN `employee_officialphone` VARCHAR(20), IN `employee_officialmobile` VARCHAR(20), IN `employee_fathername` VARCHAR(100), IN `employee_contactnumber` VARCHAR(20), IN `employee_personalemailid` VARCHAR(100), IN `employee_bloodgroup` VARCHAR(5), IN `employee_dateofbirth` DATE, IN `employee_residentaddress1` VARCHAR(100), IN `employee_residentaddress2` VARCHAR(100), IN `employee_residentcity` VARCHAR(100), IN `employee_state` VARCHAR(100), IN `employee_country` VARCHAR(100), IN `employee_residentpincode` VARCHAR(10), IN `employee_status` TINYINT(1), IN `client_id` INT, IN `employee_salary` INT(11), IN `employee_isowner` INT, IN `employee_ismembermobilevisible` INT, IN `employee_ismemberemailidvisible` INT, IN `employee_branchname` INT, IN `employee_zonename` INT, IN `createdby_id` INT, IN `employee_isenquirymobilevisible` INT, IN `employee_isenquiryemailidvisible` INT, IN `employee_appaccess` TINYINT(1), IN `employee_istrainer` INT, IN `employee_enablecomplimentarysale` INT, IN `employee_enablediscount` INT, IN `employee_enablediscountlimit` INT, IN `employee_maxdiscountperitem` DECIMAL(12,2), IN `employee_maxdiscountperinvoice` VARCHAR(20), IN `employee_maxmonthlylimit` VARCHAR(20), IN `employee_isbiometriclogs` INT, IN `employee_complimentarysalelimit` VARCHAR(20), IN `employee_enableonlinelisting` INT, IN `employee_ptcommission` DECIMAL(12,2), IN `employee_enableonlinetraining` INT, IN `employee_professionaldetails` VARCHAR(600), IN `employee_ptcommissiontype` VARCHAR(20), IN `employee_daysforbackdatedinvoice` INT, IN `employee_shifttiming` LONGTEXT, IN `employee_schedule` LONGTEXT, IN `employee_timezone` VARCHAR(20))  BEGIN

DECLARE isExit , isOwnerEmployee,isMaximun,_maxstaff,isMaximunstaff int DEFAULT 0;
DECLARE stateID,memberId int DEFAULT NULL;
DECLARE countryID varchar(2) DEFAULT NULL;

	select isowner into isOwnerEmployee from user where id = employee_id;

	if employee_country != '' && employee_country is not null then
		select code into countryID from country where name = employee_country;

		if countryID is null then
			Call `ERROR` ('Please enter valid country.');
		end if;
	end if;

	if employee_state != '' && employee_state is not null then
		select id, country_code into stateID, countryID from state where name = employee_state and (country_code = countryID or countryID is null);

		if stateID is null then
			Call `ERROR` ('Please enter valid State/Region.');
		end if;
	end if;


if employee_id = 0 then

        select maxstaff into _maxstaff from branch where id = employee_branchname;

			if _maxstaff > 0 then
			   SELECT count(1) into isMaximunstaff FROM user where clientid = client_id and deleted = 0 and
			   defaultbranchid = employee_branchname ;

				if isMaximunstaff >= _maxstaff then
				   Call `ERROR` (concat('You are not allowed to add more than ', _maxstaff, ' staff.'));
                end if;
			end if;

	SELECT count(1) into isExit FROM user where emailid = employee_userid and deleted = 0 and clientid = client_id;

	if isExit > 0 then
        Call `ERROR` ('Email-Id/User Name Already exists.');
	end if;


		insert into user(title,firstname,lastname,
		dateofjoining ,dateofresigning,employeecode ,emailid ,password,gender ,panno,
		image,assignrole,specialization,phone,mobile,fathername ,contactnumber,personalemailid,
		bloodgroup ,dateofbirth ,address1,address2 ,city,country,state ,pincode,status,clientid,
        salary,isowner,ismembermobilevisible,ismemberemailidvisible,zoneid,createdbyid,createdbydate,
        defaultbranchid,isenquirymobilevisible,isenquiryemailidvisible,appaccess,istrainer,
        enablecomplimentarysale,enablediscount,enablediscountlimit,maxdiscountperitem,
        maxdiscountperinvoice,maxmonthlylimit,isbiometriclogs,complimentarysalelimit,enableonlinelisting,
        ptcommssion,enableonlinetraining,professionaldetails,ptcommissiontype,daysforbackdatedinvoice,
        shifttiming,schedule,timezoneoffsetvalue)
        values(
		 employee_title , employee_firstname, employee_lastname , employee_dateofjoining ,
		 employee_dateofresigning , getSequence('employee' , client_id) ,employee_userid , employee_password , employee_gender ,
		 employee_panno , employee_image , employee_assignrole , employee_specialization,
		 employee_officialphone , employee_officialmobile , employee_fathername , employee_contactnumber,
		 employee_personalemailid , employee_bloodgroup , employee_dateofbirth , employee_residentaddress1 ,
		 employee_residentaddress2 , employee_residentcity , countryID, stateID , employee_residentpincode ,
		 employee_status, client_id,employee_salary,employee_isowner,employee_ismembermobilevisible,employee_ismemberemailidvisible,
         employee_zonename,createdby_id,now(),employee_branchname,employee_isenquirymobilevisible,
         employee_isenquiryemailidvisible,employee_appaccess,employee_istrainer,employee_enablecomplimentarysale,
         employee_enablediscount,employee_enablediscountlimit,employee_maxdiscountperitem,
         employee_maxdiscountperinvoice,employee_maxmonthlylimit,employee_isbiometriclogs,
         employee_complimentarysalelimit,employee_enableonlinelisting,employee_ptcommission,employee_enableonlinetraining,
         employee_professionaldetails,employee_ptcommissiontype,employee_daysforbackdatedinvoice,
         employee_shifttiming,employee_schedule,employee_timezone);

         		SELECT LAST_INSERT_ID() into employee_id;

elseif employee_id > 0 then

		if isOwnerEmployee = 1 then
			set employee_status = 1;
            set employee_appaccess = 1;
		end if;

SELECT count(1) into isExit FROM user where emailid = employee_userid and deleted = 0 and id !=employee_id and clientid = client_id;

	if isExit > 0
	then
         Call `ERROR` ('Email-Id/User Name Already exists.');
	end if;

		update user set	 title=employee_title ,
		firstname=employee_firstname, lastname=employee_lastname ,
		dateofjoining=employee_dateofjoining ,
		dateofresigning=employee_dateofresigning ,
		emailid =employee_userid , password =employee_password ,
		gender=employee_gender , panno =employee_panno ,
		image=employee_image ,	 assignrole=employee_assignrole,
		specialization=employee_specialization,
		phone=employee_officialphone , mobile =employee_officialmobile ,
		fathername=employee_fathername , contactnumber =employee_contactnumber,
		personalemailid=employee_personalemailid , bloodgroup=employee_bloodgroup ,
		dateofbirth=employee_dateofbirth , address1 =employee_residentaddress1 ,
		address2=employee_residentaddress2 , city=employee_residentcity ,
		country=countryID , state = stateID, pincode=employee_residentpincode,
		status = employee_status,
        salary = employee_salary,
        ismembermobilevisible = employee_ismembermobilevisible,
        ismemberemailidvisible = employee_ismemberemailidvisible,
        zoneid = employee_zonename,
        modifiedbyid = createdby_id ,
        modifiedbydate = now(),
        defaultbranchid = employee_branchname,
        isenquirymobilevisible = employee_isenquirymobilevisible,
        isenquiryemailidvisible = employee_isenquiryemailidvisible,
        appaccess = employee_appaccess,
        istrainer = employee_istrainer,
        enablecomplimentarysale = employee_enablecomplimentarysale,
        enablediscount = employee_enablediscount,
        enablediscountlimit = employee_enablediscountlimit,
        maxdiscountperitem = employee_maxdiscountperitem,
        maxdiscountperinvoice = employee_maxdiscountperinvoice,
        maxmonthlylimit = employee_maxmonthlylimit,
		isbiometriclogs = employee_isbiometriclogs,
        complimentarysalelimit = employee_complimentarysalelimit,
        enableonlinelisting = employee_enableonlinelisting,
        ptcommssion = employee_ptcommission,
        enableonlinetraining = employee_enableonlinetraining,
        professionaldetails = employee_professionaldetails,
        ptcommissiontype = employee_ptcommissiontype,
        daysforbackdatedinvoice = employee_daysforbackdatedinvoice,
        shifttiming = employee_shifttiming,
        schedule = employee_schedule,
        timezoneoffsetvalue = employee_timezone
		where id =employee_id and clientid=client_id;
end if;

	   select employeecode from user where id = employee_id ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusersearch` (IN `tableInfo` JSON)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj  JSON;
    DECLARE  _where, _id, _value, _orderby, _limit, _table ,exportXLSX,client_offsetvalue varchar(500);
    DECLARE IsDesc bool;
    DECLARE _columns varchar(1000);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.exportXLSX'),JSON_EXTRACT(tableInfo,'$.branchid'),
    JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted,exportXLSX,_branchid,client_offsetvalue;

	set _offset = pageIndex * pageSize;
    set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);
	set _columns = ' u.id,u.image,u.firstname,u.lastname,r.role ,u.employeecode ,u.emailid,u.lastcheckin,
    u.mobile,u.gender, (u.gender + 0) genderId,u.salary, u.dateofjoining ,u.dateofresigning, u.specialization,
    u.phone,u.address1,u.address2,u.city,u.pincode,u.personalemailid,
	u.dateofbirth,u.status,(u.status + 0) statusId,u.zoneid,u.defaultbranchid';
    set _table = ' from user  u
					 left outer JOIN  role r on u.assignrole = r.id';
	set _where = concat(' where u.deleted = 0 and u.id not in (2) and u.clientid = ', client_id , ' ' );

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id= 'firstname' then
			      set _where = CONCAT(_where , CONCAT(' and concat(firstname,'' '',lastname) like ''%', _value ,'%'''));
     		 elseif _id = 'lastcheckin' then
				 set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            elseif _id = 'employeecode' then
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
            elseif _id = 'specialization' then
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
           else
					set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by u.deleted,u.id  desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);
	if(exportXLSX = 'true') then
			set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby);
	else
		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );
	end if;
	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;
	if(exportXLSX is null or exportXLSX != 'true') then
		set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

			  PREPARE stmt FROM @_qry;
			  EXECUTE stmt;
			  DEALLOCATE PREPARE stmt;
	end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusersetdefaultbranch` (IN `client_id` INT, IN `user_id` INT, IN `user_branchid` INT)  BEGIN

	update user set defaultbranchid = user_branchid where deleted = 0 and clientid = client_id and id = user_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusersettheme` (IN `user_theme` LONGTEXT, IN `user_id` INT, IN `client_id` INT)  BEGIN

	update user
    set theme = user_theme
    where clientid = client_id and id = user_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusershiftdelete` (IN `shift_id` INT, IN `user_id` INT)  BEGIN

DECLARE isExist int DEFAULT 0;

    SELECT count(1) into isExist FROM assignshift
    where shiftid = shift_id and deleted = 0;

	if isExist > 0 then
        Call `ERROR` ('This shift is assigned to staff.');
	end if;

	update staffshift set
	deleted = 1,
	modifiedbyid = user_id,
	modifiedbydate=now()
	where id=shift_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusershiftsave` (IN `shift_id` INT, IN `shift_name` VARCHAR(200), IN `shift_duration` LONGTEXT, IN `shift_schedule` LONGTEXT, IN `client_id` INT, IN `createdby_id` INT, IN `branch_id` INT, IN `shift_type` VARCHAR(50))  BEGIN

	if shift_id = 0 then

		insert into staffshift (shiftname,shiftduration,shiftschedule,createdbyid,createdbydate,clientid,
        branchid,shifttype)
        values (shift_name,shift_duration,shift_schedule,createdby_id,now(),client_id,branch_id,
        shift_type);

    elseif shift_id > 0 then

        update staffshift set
        shiftname = shift_name,
        shiftduration = shift_duration ,
        shiftschedule = shift_schedule,
        modifiedbyid = createdby_id ,
        modifiedbydate = now(),
        shifttype = shift_type
        where id = shift_id and clientid = client_id;

    end if;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusershiftsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj  LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table  varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.branchid')
    into pageSize, pageIndex, client_id, filtered, sorted,_branchid;

	set _offset = pageIndex * pageSize;
	set _columns = ' s.id,shiftname,shiftduration,shiftschedule,shifttype,
    JSON_LENGTH(shiftduration) ''perdayslot'' ';
    set _table = ' from staffshift s ';
	set _where = concat(' where s.deleted = 0 and s.clientid = ', client_id , ' and
		branchid = ' , _branchid );

	SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

		 if _value != '' and _value != 'null' then
			if _id= 'shiftname' then
			      set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''%', _value ,'%'''));
            elseif _id = 'shifttype' then
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' = ', _value));
            end if;
           end if;
		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by s.id  desc';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

		set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	  set @_qry = CONCAT('select count(1) ''count'',ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
	  EXECUTE stmt;
	  DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPusershiftview` (IN `shift_id` INT, IN `client_id` INT)  BEGIN

	select s.id,shiftname,shiftduration,shiftschedule,shifttype,(shifttype+0)shifttypeId
	from staffshift s
	where s.deleted = 0 and s.id=shift_id and s.clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserunitsave` (IN `user_unit` LONGTEXT, IN `user_id` INT, IN `client_id` INT)  BEGIN

update user
    set unit = user_unit
    where clientid = client_id and id = user_id;


END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserviewedit` (IN `user_id` INT, IN `client_id` INT)  BEGIN
	 select u.id,title,firstname,lastname,concat(firstname , ' ' , lastname) as name,status,(status + 0) statusId,
	 dateofjoining ,dateofresigning ,emailid ,password,u.employeecode,u.lastcheckin,
	 gender, (gender + 0) genderId ,panno,image,r.role 'rolename',r.alias 'rolealias',u.assignrole 'role',
     specialization,u.phone,u.mobile,fathername ,salary,theme,u.contactnumber,personalemailid,bloodgroup ,dateofbirth ,
     u.address1,u.address2 ,ismembermobilevisible,ismemberemailidvisible,u.city,u.pincode,s.name 'state',
     c.name 'country',c.code 'countrycode',c.languagecode 'languagecode',unit,r.modules,
     u.zoneid,additionalrights,u.defaultbranchid,balance,b.branchname 'defaultbranchname',z.zonename 'zonename',
     u.agreedate,isenquirymobilevisible,isenquiryemailidvisible,appaccess,(appaccess+0)appaccessId,
     u.istrainer 'isTrainer',enablecomplimentarysale,enablediscount,enablediscountlimit,maxdiscountperitem,
	 maxdiscountperinvoice,maxmonthlylimit,u.clientid,u.isbiometriclogs,u.complimentarysalelimit,
	 enableonlinelisting,u.ptcommssion,u.enableonlinetraining,u.professionaldetails,u.ptcommissiontype,
     (u.ptcommissiontype + 0) ptcommissiontypeId,daysforbackdatedinvoice,u.shifttiming,u.schedule,
     u.timezoneoffsetvalue,u.advancepayment
	 from user u
	 left outer join country c on u.country = c.code
	 left outer join state s on u.state = s.id
	 left outer JOIN  role r on u.assignrole = r.id
     left outer JOIN  branch b on u.defaultbranchid = b.id
     left outer JOIN  zone z on u.zoneid = z.id
	 where u.id=user_id and u.clientid = client_id and u.deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserviewperformance` (IN `client_id` INT, IN `month_filter` VARCHAR(100), IN `year_filter` VARCHAR(100), IN `chart_filtertype` VARCHAR(100), IN `user_id` INT, IN `client_offsetvalue` VARCHAR(20))  BEGIN

set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
set client_offsetvalue = getDateOffset(client_offsetvalue);

if(chart_filtertype = 0) then

         select count(1) as enquirycount from enquiry e
		 INNER JOIN user u ON  u.id = e.attendedbyid
		 where e.clientid = client_id and  u.id =  user_id and e.deleted = 0
         and month(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) =  month_filter and year(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) = year_filter;

		 select ifnull(sum(paymentamount),0) as collectionamount from payment p
	     INNER JOIN user u ON p.createdbyid = u.id
		 where u.clientid = client_id and u.id = user_id  and createdfrom = 'u' and
         month(getDateFromUTC(paymentdate ,client_offsetvalue,-1)) =  month_filter and year(getDateFromUTC(paymentdate ,client_offsetvalue,-1)) = year_filter;

		 select ifnull(sum(sales.amount),0) as sellamount from(
         select sum(amount) as amount from subscription s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where  u.id =  user_id and month(getDateFromUTC(s.createdbydate ,client_offsetvalue,-1)) = month_filter and year(getDateFromUTC(s.createdbydate ,client_offsetvalue,-1)) = year_filter
         union
         select sum(amount) as amount from productsale ps
         inner join user u on u.id = ps.salesbyid and u.clientid = client_id
         where u.id =  user_id and month(getDateFromUTC(ps.createdbydate,client_offsetvalue,-1)) = month_filter and year(getDateFromUTC(ps.createdbydate,client_offsetvalue,-1)) = year_filter
         ) sales;

         select count(1) as memberfollowupcount from memberremark mr
		 INNER JOIN user u ON mr.createdbyid = u.id
		 where u.clientid = client_id and u.id = user_id and u.deleted = 0
         and month(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1)) =  month_filter and year(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1)) = year_filter;

		 select count(1) as enquiryfollowupcount from enquirystatus es
		 INNER JOIN user u ON es.createdbyid = u.id
         INNER JOIN enquiry e ON es.enquiryid = e.id
		 where u.clientid = client_id and u.id = user_id and u.deleted = 0
         and date(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) != date(getDateFromUTC(e.createdbydate,client_offsetvalue,-1))
         and month(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) =  month_filter
         and year(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) = year_filter;

	     select count(1) as pscount from memberptattendance pt
		 INNER JOIN user u ON pt.ptownerid = u.id
		 where u.clientid = client_id and u.id = user_id and
		 month(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) =  month_filter
         and year(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) = year_filter and pt.deleted = 0;

		 select count(1) as gscount from classattendance ma
		 INNER JOIN user u ON ma.createdbyid = u.id
		 where u.clientid = client_id and u.id = user_id and classid is not null and
		 ma.deleted = 0 and month(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) =  month_filter
         and year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter and ma.deleted = 0;

		 select ifnull(avg(rating),0) as rating from (select avg(rating)  rating from classattendance ma
		 inner join user u on ma.createdbyid = u.id
		 where  u.id = user_id and u.clientid = client_id and rating  is not null
		 and ma.deleted = 0 and month(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) =  month_filter
         and year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter
		  union
		 select avg(rating) rating from memberptattendance m
		 inner join user u on m.ptownerid = u.id
		 where u.id = user_id and u.clientid = client_id and rating  is not null and m.deleted = 0 and
         month(getDateFromUTC(m.createdbydate,client_offsetvalue,-1)) =  month_filter and
         year(getDateFromUTC(m.createdbydate,client_offsetvalue,-1)) = year_filter
		 )feedback;

		 select ifnull(sum(commission),0) as pscommissionamount from usercommission uc
		 INNER JOIN memberptattendance mp ON uc.ptattendanceid = mp.id
		 INNER JOIN user u ON uc.userid = u.id
		 where u.clientid = client_id and u.id = user_id  and
         month(getDateFromUTC(mp.attendancedate,client_offsetvalue,-1)) =  month_filter
		 and year(getDateFromUTC(mp.attendancedate,client_offsetvalue,-1)) = year_filter and mp.deleted = 0;

		 select ifnull(sum(commission),0) as gscommissionamount from usercommission uc
		 INNER JOIN user u ON uc.userid = u.id
		 where u.clientid = client_id and u.id = user_id  and
         month(getDateFromUTC(uc.createdbydate,client_offsetvalue,-1)) =  month_filter
         and year(getDateFromUTC(uc.createdbydate,client_offsetvalue,-1)) = year_filter
         and ptattendanceid is null and uc.deleted = 0;

else

		select count(1) as enquirycount from enquiry e
		INNER JOIN user u ON  u.id = e.attendedbyid
		where e.clientid = client_id and  u.id =  user_id and e.deleted = 0
        and year(getDateFromUTC(e.createdbydate ,client_offsetvalue,-1)) = year_filter;

        select ifnull(sum(paymentamount),0)  as collectionamount from payment p
		INNER JOIN user u ON p.createdbyid = u.id
		where u.clientid = client_id and u.id = user_id
        and createdfrom = 'u' and year(getDateFromUTC(paymentdate,client_offsetvalue,-1)) = year_filter;

         select ifnull(sum(sales.amount),0) as sellamount from(
         select sum(amount) as amount  from subscription s
         inner join user u on u.id = s.salesbyid and u.clientid = client_id
         where u.id =  user_id and year(getDateFromUTC(s.createdbydate,client_offsetvalue,-1)) = year_filter
         union
         select sum(amount) as amount from productsale ps
         inner join user u on u.id = ps.salesbyid and u.clientid = client_id
         where u.id =  user_id and year(getDateFromUTC(ps.createdbydate,client_offsetvalue,-1)) = year_filter) sales;

         select count(1) as memberfollowupcount from memberremark mr
		INNER JOIN user u ON mr.createdbyid = u.id
		where u.clientid = client_id and u.id = user_id and u.deleted = 0 and
        year(getDateFromUTC(mr.createdbydate,client_offsetvalue,-1)) = year_filter;

		select count(1) as enquiryfollowupcount from enquirystatus es
		INNER JOIN user u ON es.createdbyid = u.id
        INNER JOIN enquiry e ON es.enquiryid = e.id
		where u.clientid = client_id and u.id = user_id and  u.deleted = 0 and
        year(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) = year_filter
		group by concat(u.firstname,' ',u.lastname) and
        date(getDateFromUTC(es.createdbydate,client_offsetvalue,-1)) != date(getDateFromUTC(e.createdbydate,client_offsetvalue,-1))
        order by enquiryfollowupcount desc  limit 10;

	    select count(1) as pscount from memberptattendance pt
		INNER JOIN user u ON pt.ptownerid = u.id
		where u.clientid = client_id and u.id = user_id and
        year(getDateFromUTC(pt.attendancedate,client_offsetvalue,-1)) = year_filter and pt.deleted = 0;

		select count(1) as gscount from classattendance ma
		INNER JOIN user u ON ma.createdbyid = u.id
		where  u.clientid = client_id and u.id = user_id and  classid is not null  and
		year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter and ma.deleted = 0;

		select ifnull(avg(rating),0) as rating from (select avg(rating)  rating   from classattendance ma
		inner join user u on ma.createdbyid = u.id
		where  u.id = user_id and u.clientid = client_id and rating  is not null and ma.deleted = 0 and
        year(getDateFromUTC(ma.createdbydate,client_offsetvalue,-1)) = year_filter
		 union
		select avg(rating) rating from memberptattendance m
		inner join user u on m.ptownerid = u.id
		where u.id = user_id and u.clientid = client_id and rating  is not null and m.deleted = 0 and
        year(getDateFromUTC(m.attendancedate,client_offsetvalue,-1)) = year_filter
		)feedback;

		select ifnull(sum(commission),0) as pscommissionamount from usercommission uc
	    INNER JOIN memberptattendance mp ON uc.ptattendanceid = mp.id
		INNER JOIN user u ON uc.userid = u.id
		where u.clientid = client_id and u.id = user_id
        and year(getDateFromUTC(mp.attendancedate,client_offsetvalue,-1)) = year_filter and mp.deleted = 0;

		select ifnull(sum(commission),0) as gscommissionamount from usercommission uc
		INNER JOIN user u ON uc.userid = u.id
		where u.clientid = client_id and u.id = user_id
        and year(getDateFromUTC(uc.createdbydate,client_offsetvalue,-1)) = year_filter and
        ptattendanceid is null and uc.deleted = 0;

end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPuserviewprofile` (IN `user_id` INT, IN `client_id` INT)  BEGIN
	 select u.id,title,firstname,lastname,concat(firstname , ' ' , lastname) as name,status,(status + 0) statusId,
	 dateofjoining ,dateofresigning ,emailid ,password,u.employeecode,u.lastcheckin,
	 gender, (gender + 0) genderId ,panno,image,r.role 'rolename',r.alias 'rolealias',u.assignrole 'role',
     specialization,u.phone,u.mobile,fathername ,salary,theme,u.contactnumber,personalemailid,bloodgroup ,dateofbirth ,
     u.address1,u.address2 ,ismembermobilevisible,ismemberemailidvisible,u.city,u.pincode,s.name 'state',c.name 'country' ,unit,r.modules,
     u.zoneid,additionalrights,u.defaultbranchid,balance,b.branchname 'defaultbranchname',z.zonename 'zonename',
     u.agreedate,isenquirymobilevisible,isenquiryemailidvisible,appaccess,(appaccess+0)appaccessId,
     u.istrainer 'isTrainer',enablecomplimentarysale,enablediscount,enablediscountlimit,maxdiscountperitem,
	 maxdiscountperinvoice,maxmonthlylimit,u.clientid,u.isbiometriclogs,u.complimentarysalelimit,
	 DATEDIFF(now(),u.last_covid19submitdate)  last_covid19submitdate,enableonlinelisting,u.ptcommssion,u.enableonlinetraining,u.professionaldetails,
     u.isgooglecalendarenabled,daysforbackdatedinvoice,u.shifttiming,u.schedule,u.timezoneoffsetvalue,
     u.advancepayment
	 from user u
	 left outer join country c on u.country = c.code
	 left outer join state s on u.state = s.id
	 left outer JOIN  role r on u.assignrole = r.id
     left outer JOIN  branch b on u.defaultbranchid = b.id
     left outer JOIN  zone z on u.zoneid = z.id
	 where u.id=user_id and u.clientid = client_id and u.deleted = 0;

    select 0 totalpayment,
     0
     paidsalaryoflastmonth ;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPviewworkout` (IN `workout_id` INT, IN `client_id` INT)  BEGIN

select id,routinename,difficultylevel,routinetype,workoutdays,description,workoutroutinedetail,sets,rest,reps
    from workoutroutine


 where id=workout_id and clientid = client_id and deleted = 0;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPvisitorsave` (IN `visitor_id` INT, IN `visitor_type` VARCHAR(10), IN `visitor_employee_id` VARCHAR(100), IN `visitor_member_id` VARCHAR(100), IN `visitor_enquiry_id` VARCHAR(100), IN `visitor_image` VARCHAR(200), IN `visitor_visitorname` VARCHAR(200), IN `visitor_mobileno` VARCHAR(20), IN `visitor_organizationname` VARCHAR(100), IN `visitor_visitedfor` VARCHAR(10), IN `visitor_visitedtomeet` VARCHAR(10), IN `visitedtomeet_employee_id` VARCHAR(100), IN `visitedtomeet_member_id` VARCHAR(100), IN `visitor_purpose` VARCHAR(100), IN `visitor_covid19symptoms` LONGTEXT, IN `branchid_id` INT, IN `client_id` INT, IN `user_id` INT, IN `visitor_accesspermitted` INT, IN `visitor_gender` CHAR(10), IN `visitor_remark` VARCHAR(1000), IN `visitor_riskstatus` VARCHAR(20), IN `visitor_age` INT, IN `visitor_markattendance` INT, IN `visitor_membercode` VARCHAR(50), IN `visitor_employeecode` VARCHAR(50), IN `visitor_intime` DATETIME, IN `visitor_client_timezoneoffsetvalue` VARCHAR(10))  BEGIN

DECLARE in_datetime datetime;
DECLARE _visitorid int DEFAULT 0;
DECLARE sqlcode CHAR(5) DEFAULT '00000';
DECLARE msg TEXT;

 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			 GET DIAGNOSTICS CONDITION 1
			 sqlcode = RETURNED_SQLSTATE, msg = MESSAGE_TEXT;
			SET @flag = 0;
             ROLLBACK;
             if sqlcode = 'ERR0R' then
				 Call `ERROR`(msg);
             else
				 Call `ERROR`('Internal Server Error');
             end if;
		END;

START TRANSACTION;

    if visitor_id = 0 then

		if visitor_type != 4 then
			select indatetime,id into in_datetime,_visitorid from visitorbook
			where visitortype = cast(visitor_type as unsigned) and
			(case when visitortype = 1 then vis_employeeid = visitor_employee_id
			when visitortype = 2 then vis_memberid = visitor_member_id
			when visitortype = 3 then vis_enquiryid = visitor_enquiry_id else 1=1 end) and
			outdatetime is null and date(indatetime) = date(now())
			order by id desc limit 1;

        end if;

        if in_datetime is null then

			insert into visitorbook(visitortype,vis_employeeid,vis_memberid,vis_enquiryid,
			visitorimage,visitorname,mobile,organizationname,indatetime,visitedfor,visitedtomeet,
			visitedtomeet_employeeid,visitedtomeet_memberid,purpose,covid19symptoms,clientid,
			createdbyid,createdbydate,branchid,outdatetime,gender,remark,riskstatus,age)
			values(visitor_type, visitor_employee_id,visitor_member_id,visitor_enquiry_id,
			visitor_image,visitor_visitorname,visitor_mobileno,visitor_organizationname,now(),
			visitor_visitedfor,visitor_visitedtomeet,visitedtomeet_employee_id,visitedtomeet_member_id,
			visitor_purpose,visitor_covid19symptoms,client_id,user_id,now(),branchid_id,
			case when visitor_accesspermitted = 0 then now() else null end,
			visitor_gender,visitor_remark,visitor_riskstatus,visitor_age);

			if visitor_type = 2 and visitor_markattendance = 1 and visitor_accesspermitted = 1 then
				call USPmemberattendance(0,visitor_membercode,user_id,client_id,visitor_intime,null,branchid_id,null,visitor_client_timezoneoffsetvalue);
			elseif visitor_type = 1 and visitor_markattendance = 1 and visitor_accesspermitted = 1 then
				call USPuserattendanceSave(0,visitor_employeecode,user_id,client_id,visitor_intime,null,branchid_id,null);
            end if;

		else
			Call `ERROR`('Visitor\'s outdatetime is not updated.');
		end if;

    elseif visitor_id  > 0 then

		update visitorbook set
		visitorimage = visitor_image,
		visitorname = visitor_visitorname,
		mobile = visitor_mobileno,
		organizationname = visitor_organizationname,
		visitedfor = visitor_visitedfor,
		visitedtomeet = visitor_visitedtomeet,
		visitedtomeet_employeeid = visitedtomeet_employee_id,
		visitedtomeet_memberid = visitedtomeet_member_id,
		purpose = visitor_purpose,
		covid19symptoms = visitor_covid19symptoms,
		modifiedbyid = user_id,
		modifiedbydate = now(),
        gender = visitor_gender,
        remark = visitor_remark,
        outdatetime = case when outdatetime is null and visitor_accesspermitted = 0 then now() else outdatetime end,
        riskstatus = visitor_riskstatus,
        age = visitor_age
		where id = visitor_id and clientid=client_id;

    end if;


	COMMIT;
	SET @flag = 1;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPvisitorsaveoutdatetime` (IN `visitor_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN

DECLARE member_id, employee_id , _visitortype int DEFAULT 0;
DECLARE in_datetime datetime;

	select visitortype , vis_employeeid , vis_memberid , indatetime
    into _visitortype , employee_id , member_id ,in_datetime
    from visitorbook where id = visitor_id;

    if _visitortype = 1 then

		update userattendance set outtime = now(),
        difference = TIMESTAMPDIFF(MINUTE  , intime ,now()),
        modifiedbyid = user_id,
        modifiedbydate = now()
        where userid = employee_id and outtime is null and deleted = 0 and date(intime) = date(in_datetime);

    elseif _visitortype = 2 then

        update memberattendance set outtime = now(),
        difference = TIMESTAMPDIFF(MINUTE  , intime , now()),
        modifiedbyid = user_id,
        modifiedbydate = now()
        where memberid = member_id and outtime is null and deleted = 0 and date(intime) = date(in_datetime);

    end if;

	update visitorbook set outdatetime = now(),
    modifiedbyid = user_id,
    modifiedbydate = now()
    where id = visitor_id and clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPvisitorsearch` (IN `tableInfo` LONGTEXT)  BEGIN

	DECLARE pageSize, pageIndex, client_id, _offset, i, _length , _branchid INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table, client_offsetvalue varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted'),
	JSON_EXTRACT(tableInfo,'$.branchid'),JSON_EXTRACT(tableInfo,'$.client_timezoneoffsetvalue')
    into pageSize, pageIndex, client_id, filtered, sorted , _branchid,client_offsetvalue;


	set client_offsetvalue = REPLACE(client_offsetvalue,'"','');
    set client_offsetvalue = getDateOffset(client_offsetvalue);
	set _offset = pageIndex * pageSize;

	set _columns = 'v.id,v.visitortype,v.visitorname,v.mobile,v.indatetime,v.outdatetime,v.visitorimage,
    v.createdbydate,JSON_UNQUOTE(JSON_EXTRACT(covid19symptoms,CONCAT(''$.accesspermitted''))) accesspermitted,
    v.gender,(v.gender+0)genderId';
    set _table = ' from visitorbook v ';

		set _where = concat(' where v.clientid = ', client_id , ' and v.branchid = ' , _branchid);

SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');

        if _value != '' and _value != 'null' then
			if _id = 'visitortype' then
				set _where = CONCAT(_where , CONCAT(' and v.', _id , ' = ', _value));
			elseif _id= 'outdatetime' or _id= 'indatetime' then
			      set _where = CONCAT(_where , CONCAT(' and date(getDateFromUTC(v.', _id , ',''',client_offsetvalue,''',-1)) = date(''',_value, ''')'));
            elseif _id= 'visitorname' then
			      set _where = CONCAT(_where , CONCAT(' and v.', _id , ' like ''%', _value ,'%'''));
            elseif _id = 'accesspermitted' then
				set _where = CONCAT(_where , CONCAT(' and JSON_UNQUOTE(JSON_EXTRACT(covid19symptoms,CONCAT(''$.accesspermitted''))) = ', _value));
            else
				set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
            end if;
        end if;

		SET  i = i + 1;
	END WHILE;

	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by v.id desc ';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

	 set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	 PREPARE stmt FROM @_qry;
	 EXECUTE stmt;
	 DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPvisitorview` (IN `visitor_id` INT, IN `client_id` INT)  BEGIN


	select v.id,v.visitorname,v.mobile,v.organizationname,v.purpose,covid19symptoms,
    v.visitortype,(v.visitortype + 0) visitortypeId,visitorimage,
	v.visitedfor,(v.visitedfor + 0) visitedforId,v.indatetime,v.outdatetime,
    v.visitedtomeet,(v.visitedtomeet+0)visitedtomeetId,
	concat(ref_m.firstname,' ',ref_m.lastname) 'visitedmember',
	concat(ref_u.firstname,' ',ref_u.lastname ) 'visitedemployee',
    concat(ref_m1.firstname,' ',ref_m1.lastname) 'visitedtomeetmember',
	concat(ref_u1.firstname,' ',ref_u1.lastname ) 'visitedtomeetemployee',
	concat(e1.firstname,' ',e1.lastname ,' - ', e1.enquirycode) 'visitedenquiry',
    vis_memberid,vis_employeeid,visitedtomeet_memberid,visitedtomeet_employeeid,vis_enquiryid,
    v.gender,(v.gender+0)genderId,v.remark,v.age
	from visitorbook v
	left outer join member ref_m on v.vis_memberid = ref_m.id
	left outer join user ref_u on v.vis_employeeid = ref_u.id
    left outer join member ref_m1 on v.visitedtomeet_memberid = ref_m1.id
	left outer join user ref_u1 on v.visitedtomeet_employeeid = ref_u1.id
	left outer join enquiry e1 on v.vis_enquiryid = e1.id
	where v.id=visitor_id and v.clientid = client_id;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPzonedelete` (IN `zone_id` INT, IN `client_id` INT, IN `user_id` INT)  BEGIN

declare isExist int default 0;

	select count(1) into isExist from user where zoneid = zone_id
	and clientid = client_id and deleted = 0;

    if isExist > 0 then
		Call `ERROR`('Zone is associated with a user');
    end if;

	update zone set
	deleted=1,
	modifiedbyid = user_id,
	modifiedbydate=now()
	where id=zone_id and clientid = client_id ;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPzonesave` (IN `zone_id` INT, IN `zone_name` VARCHAR(100), IN `zone_createdbyid` INT, IN `client_id` INT, IN `zone_branchlist` LONGTEXT)  BEGIN

	DECLARE isExit int DEFAULT 0;

	if zone_id = 0 then

		SELECT count(1) into isExit FROM zone where zonename = zone_name and deleted = 0 and clientid = client_id;

		if isExit > 0 then
			Call `ERROR` ('Zone Name Already exists.');
		end if;

		insert into zone(zonename,createdbyid,createdbydate,clientid,branchlist)
		values(zone_name,zone_createdbyid,now(),client_id,zone_branchlist);

	elseif zone_id  > 0 then

		SELECT count(1) into isExit FROM zone where zonename = zone_name and deleted = 0 and id !=zone_id and clientid = client_id;

		if isExit > 0 then
			Call `ERROR` ('Zone Name Already exists.');
		end if;

		update zone set
		zonename=zone_name,
		modifiedbyid=zone_createdbyid,
		modifiedbydate=now(),
        branchlist = zone_branchlist
		where id=zone_id and clientid=client_id;

	end if;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPzonesearch` (IN `tableInfo` LONGTEXT)  BEGIN
DECLARE pageSize, pageIndex, client_id, _offset, i, _length INT;
    DECLARE filtered, sorted , obj LONGTEXT;
    DECLARE _columns, _where, _id, _value, _orderby, _limit, _table varchar(500);
    DECLARE IsDesc TINYINT(1);

	select JSON_EXTRACT(tableInfo,'$.pageSize'),
    JSON_EXTRACT(tableInfo,'$.pageIndex'),JSON_EXTRACT(tableInfo,'$.clientId'),
    JSON_EXTRACT(tableInfo,'$.filtered'),JSON_EXTRACT(tableInfo,'$.sorted')
    into pageSize, pageIndex, client_id, filtered, sorted;

	set _offset = pageIndex * pageSize;
	set _columns = 'z.id,z.zonename';
    set _table = ' from zone z ';
	set _where = concat(' where z.deleted = 0 and z.clientid = ', client_id);


SET i = 0;
    SET _length = JSON_LENGTH(filtered);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(filtered,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.value') into _id, _value;

        set _id = REPLACE(_id,'"','');
        set _value = REPLACE(_value,'"','');
         if _value != '' then
         		set _where = CONCAT(_where , CONCAT(' and ', _id , ' like ''', _value ,'%'''));
		end if;

		SET  i = i + 1;
	END WHILE;


	SET _orderby = '';
	SET i = 0;
    SET _length = JSON_LENGTH(sorted);
    WHILE  i < _length DO
		SELECT JSON_EXTRACT(sorted,CONCAT('$[',i,']')) into obj;
        select JSON_EXTRACT(obj, '$.id'), JSON_EXTRACT(obj , '$.desc') into _id, IsDesc;

        set _id = REPLACE(_id,'"','');

		set _orderby = CONCAT(_orderby , CONCAT(',', _id, case when IsDesc then ' desc ' else ' asc ' end));

		SET  i = i + 1;
	END WHILE;

	if _orderby != '' then
		set _orderby =  CONCAT(' order by ' , SUBSTRING(_orderby,2));
    else
		set _orderby = ' order by z.deleted ,z.zonename';
    end if;

    set _limit = concat(' limit ', pageSize ,' offset ', _offset);

	set @_qry = CONCAT('select ' , _columns, _table ,_where,' ', _orderby , _limit );

	 PREPARE stmt FROM @_qry;
     EXECUTE stmt ;
	 DEALLOCATE PREPARE stmt;

    set @_qry = CONCAT('select count(1) ''count'', ceil(count(1)/', pageSize ,') ''pages''', _table ,_where);

	  PREPARE stmt FROM @_qry;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

END$$

CREATE DEFINER=`abhisnsn`@`localhost` PROCEDURE `USPzoneview` (IN `zone_id` INT, IN `client_id` INT)  BEGIN

 DECLARE _branchlist LONGTEXT;

 select branchlist into _branchlist from zone z where id = zone_id and z.clientid = client_id and z.deleted = 0;

	select z.id,z.zonename
    from zone z
	where z.id=zone_id and z.clientid = client_id and z.deleted = 0;

END$$

--
-- Functions
--
CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getDateFromJSON` (`jsondate` VARCHAR(100)) RETURNS DATETIME BEGIN

	DECLARE newDate DATETIME DEFAULT null;

    if jsondate is not null && jsondate != '' && jsondate != 'null' then
		set jsondate = REPLACE(jsondate, 'T',' ');
		set jsondate = REPLACE(jsondate, 'Z','');
	 	set newDate = CAST(CONVERT_TZ(jsondate,'+00:00','+05:30') as DATETIME);
	end if;

	RETURN newDate;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getDateFromUTC` (`jsondate` VARCHAR(100), `offsetvalue` VARCHAR(100), `otheroffsetvalue` VARCHAR(100)) RETURNS DATETIME BEGIN

	DECLARE newDate DATETIME DEFAULT null;

    set otheroffsetvalue = case when otheroffsetvalue = 1 then "+05:30"
								when otheroffsetvalue = -1 then "-05:30"
                                else "+00:00" end;

    if jsondate is not null && jsondate != '' && jsondate != 'null' then
	 	set newDate = CAST(CONVERT_TZ(CONVERT_TZ(REPLACE(REPLACE(jsondate, 'T',' '), 'Z',''),'+00:00',offsetvalue), '+00:00',otheroffsetvalue) as DATETIME);
	end if;

 RETURN newDate;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getDateOffset` (`offsetvalue` VARCHAR(100)) RETURNS VARCHAR(30) CHARSET utf8mb4 BEGIN

DECLARE newoffset , firstvalue , endvalue ,sign, finalvalue varchar(30);

    if offsetvalue is not null && offsetvalue != '' && offsetvalue != 'null' then

		set offsetvalue = CAST(offsetvalue AS SIGNED);
        set sign =  '+';
		if offsetvalue < 0 then
			set sign =  '-';
            set offsetvalue = ABS(offsetvalue);
        end if;

		set firstvalue = offsetvalue DIV 60;
        if firstvalue < 10 then
			set firstvalue = concat('0', firstvalue);
         end if;

        set endvalue = offsetvalue % 60;
		if endvalue < 10 then
			set endvalue = concat('0', endvalue);
         end if;

        set finalvalue = concat(sign,firstvalue,':',endvalue);
	end if;

	RETURN finalvalue;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getDateToUTC` (`jsondate` VARCHAR(100), `offsetvalue` VARCHAR(100), `otheroffsetvalue` VARCHAR(100)) RETURNS VARCHAR(100) CHARSET utf8mb4 BEGIN

	DECLARE newDate varchar(100) DEFAULT null;

    set otheroffsetvalue = case when otheroffsetvalue = 1 then "+05:30"
								when otheroffsetvalue = -1 then "-05:30"
                                else "+00:00" end;

    if jsondate is not null && jsondate != '' && jsondate != 'null' then
		set newDate = concat(REPLACE(CONVERT_TZ(CONVERT_TZ(jsondate,'+00:00',offsetvalue), '+00:00',otheroffsetvalue),' ' ,'T'), 'Z');
	end if;

 RETURN newDate;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getInvoicenumber` (`seq_name` VARCHAR(50), `clientid` INT) RETURNS VARCHAR(50) CHARSET latin1 BEGIN

	declare seq varchar(50);
	declare date varchar(20);
    DECLARE CT_COUNT int default 0 ;

	select concat(year(now()),month(now()),day(now())) into date;

	select count(1) into CT_COUNT from sequence where alias = seq_name and client_id = clientid;

	if CT_COUNT = 0
	then
		insert into sequence(alias, name,type,value,length, client_id)
					select alias, name,type,0 value, length, clientid 'client_id' from sequence
					where alias = seq_name and client_id = 1;
	end if;


	select TYPE, value, length INTO @TYPE, @value, @length from sequence where alias = seq_name and client_id = clientid;

      SET @value = @value + 1;

	update sequence set value = @value where alias = seq_name and client_id = clientid;

    set seq = concat(date ,'-',  LPAD(@value, 6, 0)) ;

RETURN seq;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getSequence` (`seq_name` VARCHAR(50), `clientid` INT) RETURNS VARCHAR(50) CHARSET latin1 BEGIN

	declare seq varchar(50);

    DECLARE CT_COUNT int default 0 ;

	select count(1) into CT_COUNT from sequence where alias = seq_name and client_id = clientid;

	if CT_COUNT = 0
	then
		insert into sequence(alias, name,type,value,length, client_id)
					select alias, name,type,0 value, length, clientid 'client_id' from sequence
					where alias = seq_name and client_id = 1;
	end if;


	select TYPE, value, length INTO @TYPE, @value, @length from sequence where alias = seq_name and client_id = clientid;

	if @TYPE <> '' and @TYPE is not null
    then
		set @TYPE = upper(@TYPE);

        SET @value = @value + 1;
		if POSITION('{VALUE}' IN @TYPE) > 0
		then
				SET @TYPE = REPLACE(@TYPE,'{VALUE}',@value);
		end if;


			SET @vallen = LENGTH(@TYPE);
			if POSITION('{PADDING}' IN @TYPE) > 0 then
				SET @typlen = LENGTH(@TYPE) - 9;
			else
				SET @typlen = LENGTH(@TYPE);
			end if;

		if @typlen < @length then
			SET @stlen = POWER(10,@length-@typlen);

            if POSITION('{PADDING}' IN  @TYPE) > 0 then
				SET @strconcat = REPLACE(@TYPE,'{PADDING}',SUBSTRING(@stlen, 2, (@stlen)- 1));
			else
				SET @strconcat = SUBSTRING(@stlen, 2, (@stlen)- 1) + @TYPE;
			end if;

        else
			if POSITION('{PADDING}' IN @TYPE) > 0 then
				SET @strconcat = REPLACE(@TYPE,'{PADDING}','');
			else
				SET @strconcat = @TYPE;
			end if;
		end if;


        	update sequence set value = @value where alias = seq_name and client_id = clientid;

		set seq = @strconcat;
    end if;
RETURN seq;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getTaxInvoicenumber` (`seq_name` VARCHAR(50), `clientid` INT) RETURNS VARCHAR(50) CHARSET latin1 BEGIN
	declare seq varchar(50);
	declare date varchar(20);
    DECLARE CT_COUNT int default 0 ;

	select year(now()) into date;

	select count(1) into CT_COUNT from sequence where alias = seq_name and client_id = clientid;

	if CT_COUNT = 0
	then
		insert into sequence(alias, name,type,value,length, client_id)
					select alias, name,type,0 value, length, clientid 'client_id' from sequence
					where alias = seq_name and client_id = 1;
	end if;

	select TYPE, value, length INTO @TYPE, @value, @length from sequence where alias = seq_name and client_id = clientid;

      SET @value = @value + 1;

	update sequence set value = @value where alias = seq_name and client_id = clientid;

    set seq = concat(date , '-',  LPAD(clientid, 5, 0) , '-',  LPAD(@value, 5, 0)) ;

RETURN seq;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `getTimeFromJSON` (`jsondate` VARCHAR(100)) RETURNS TIME BEGIN

	DECLARE newTime TIME DEFAULT null;

    if jsondate is not null && jsondate != '' then
		set newTime = CAST(CONVERT_TZ(REPLACE(REPLACE(jsondate, 'T',' '), 'Z',''),'+00:00','+05:30') as TIME);
    end if;

	RETURN newTime;
END$$

CREATE DEFINER=`abhisnsn`@`localhost` FUNCTION `SPLIT_STR` (`x` VARCHAR(255), `delim` VARCHAR(12), `pos` INT) RETURNS VARCHAR(255) CHARSET latin1 BEGIN

    RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '');
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `biometric`
--

CREATE TABLE `biometric` (
  `id` int(11) NOT NULL,
  `biometricname` varchar(50) DEFAULT NULL,
  `serialnumber` varchar(50) DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `branchid` int(11) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `branchname` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `carpetarea` varchar(100) DEFAULT NULL,
  `ownership` enum('Rented','Self Owner') DEFAULT 'Rented',
  `manager` varchar(100) DEFAULT NULL,
  `timing` longtext DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `clientid` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `gmapaddress` varchar(500) DEFAULT NULL,
  `isdefault` tinyint(1) DEFAULT 0,
  `gymaccessslot` tinyint(1) DEFAULT 0,
  `slotduration` enum('60','90','120','45','75') DEFAULT NULL,
  `slotmaxoccupancy` int(11) DEFAULT NULL,
  `slotmaxdays` int(11) DEFAULT NULL,
  `ptslotdetail` longtext DEFAULT NULL,
  `cancelgymaccessslothour` decimal(12,2) DEFAULT NULL,
  `cancelptslothour` decimal(12,2) DEFAULT NULL,
  `cancelclassslothour` decimal(12,2) DEFAULT NULL,
  `classmaxdays` int(11) DEFAULT NULL,
  `activationdate` datetime DEFAULT NULL,
  `expirydate` datetime DEFAULT NULL,
  `gapbetweentwogymaccessslot` enum('0','15','30','45','60') DEFAULT '0',
  `shifttiming` longtext DEFAULT NULL,
  `packtype` enum('Standard','Base','Premium') DEFAULT NULL,
  `billingtype` enum('Monthly','Yearly') DEFAULT NULL,
  `maxstaff` int(11) DEFAULT NULL,
  `maxmember` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`id`, `deleted`, `branchname`, `description`, `address1`, `address2`, `pincode`, `latitude`, `longitude`, `carpetarea`, `ownership`, `manager`, `timing`, `createdbyid`, `createdbydate`, `modifiedbyid`, `modifiedbydate`, `clientid`, `phone`, `city`, `state`, `country`, `gmapaddress`, `isdefault`, `gymaccessslot`, `slotduration`, `slotmaxoccupancy`, `slotmaxdays`, `ptslotdetail`, `cancelgymaccessslothour`, `cancelptslothour`, `cancelclassslothour`, `classmaxdays`, `activationdate`, `expirydate`, `gapbetweentwogymaccessslot`, `shifttiming`, `packtype`, `billingtype`, `maxstaff`, `maxmember`) VALUES
(1, 0, 'FitnezzApp', '', '', '', '383811', NULL, NULL, NULL, 'Rented', NULL, '[null, null, null, null, null, null, null]', 1, '2019-12-18 19:59:47', NULL, NULL, 1, NULL, 'Ahmedabad', 4, 'IN', NULL, 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-03-01 00:00:00', '2025-02-28 00:00:00', '0', '[{\"endtime\": null, \"starttime\": null}, {\"endtime\": null, \"starttime\": null}]', 'Premium', 'Yearly', NULL, NULL),
(2, 0, 'Tambola%20Admin', '', 'Ranip', 'Ranip', '382480', '23.0810287', '72.57680019999998', NULL, 'Rented', NULL, '[{\"name\":\"Sunday\",\"short\":\"SUN\",\"value\":\"0\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Monday\",\"short\":\"MON\",\"value\":\"1\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Tuesday\",\"short\":\"TUE\",\"value\":\"2\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Wednesday\",\"short\":\"WED\",\"value\":\"3\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Thursday\",\"short\":\"THU\",\"value\":\"4\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Friday\",\"short\":\"FRI\",\"value\":\"5\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null},{\"name\":\"Saturday\",\"short\":\"SAT\",\"value\":\"6\",\"checked\":true,\"endtime\":\"2020-07-30T15:25:28.539Z\",\"duration\":[{\"endtime\":\"2020-07-30T15:25:28.539Z\",\"starttime\":\"2020-07-30T03:30:28.539Z\"},{\"endtime\":null,\"starttime\":null}],\"endtime1\":null,\"starttime\":\"2020-07-30T03:30:28.539Z\",\"starttime1\":null}]', 2, '2019-12-18 19:59:47', 2, '2021-03-20 16:05:24', 2, '8238380029', 'Ahmedabad', 4, 'IN', 'Diyu%27s%20Fitness%20Point%2C%20Bodakdev%2C%20Ahmedabad%2C%20Gujarat%2C%20India', 1, 1, '60', 20, 7, '{\"ptslotdurationId\":1,\"ptslotdurationlabel\":\"60\",\"ptslotmaxdays\":7,\"ptslotmaxoccupancy\":1,\"restbetweentwoptslotId\":\"1\",\"restbetweentwoptslotlabel\":\"0\"}', 3.00, 2.00, 3.00, 5, '2019-03-01 00:00:00', '2025-05-31 00:00:00', '0', '[{\"endtime\":\"2020-11-27T15:25:28.000Z\",\"starttime\":\"2020-11-27T03:30:28.000Z\"},{\"endtime\":null,\"starttime\":null}]', 'Premium', 'Yearly', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `changeexpiryhistory`
--

CREATE TABLE `changeexpiryhistory` (
  `id` int(11) NOT NULL,
  `subscriptionid` int(11) DEFAULT NULL,
  `oldactivationdate` date DEFAULT NULL,
  `oldexpirydate` date DEFAULT NULL,
  `newactivationdate` date DEFAULT NULL,
  `newexpirydate` date DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `documents` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `useremail` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `clienttype` enum('Enterprise','Professionals','Individual User') DEFAULT 'Enterprise',
  `ishavemutliplebranch` tinyint(1) DEFAULT NULL,
  `branchscope` varchar(50) DEFAULT NULL,
  `clientcode` varchar(50) DEFAULT NULL,
  `numberofbranch` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT NULL,
  `organizationname` varchar(500) DEFAULT NULL,
  `organizationtype` enum('Gym','Fitness Studio','Yoga/Pilates/Barre Studio','Masilal Arts Studio','Dance Studio','Music Schools','Fine Arts Studio','Education Centers','Wellness Center','Other') DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `redirecturi` varchar(50) DEFAULT NULL,
  `logo` varchar(200) DEFAULT NULL,
  `tagline` varchar(100) DEFAULT NULL,
  `sidebarimage` longtext DEFAULT NULL,
  `memberprofilecoverimage` varchar(200) DEFAULT NULL,
  `signinbackgroundimage` longtext DEFAULT NULL,
  `emailgateway` longtext DEFAULT NULL,
  `smsgateway` longtext DEFAULT NULL,
  `paymentgateway` longtext DEFAULT NULL,
  `socialmedia` longtext DEFAULT NULL,
  `category` enum('Paid Trial','Paid','Free','Demo') DEFAULT NULL,
  `durationcount` varchar(10) DEFAULT NULL,
  `duration` enum('Year','Month','Day','Week') DEFAULT NULL,
  `trialenddate` datetime DEFAULT NULL,
  `disclaimer` longtext DEFAULT NULL,
  `taxtype` enum('Exclude','Include') DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `printtype` enum('Normal','POS') DEFAULT NULL,
  `discounttype` enum('Fixed','Percentage') DEFAULT NULL,
  `termsconditions` varchar(14000) DEFAULT NULL,
  `footermessge` varchar(4000) DEFAULT NULL,
  `istaxenable` tinyint(1) DEFAULT 0,
  `signimage` varchar(200) DEFAULT NULL,
  `invoicebannerimage` varchar(200) DEFAULT NULL,
  `professionaltype` enum('Workout Professionals','Dietitians','Both') DEFAULT NULL,
  `biometric` longtext DEFAULT NULL,
  `isinbody` int(11) DEFAULT 0,
  `geofencing` longtext DEFAULT NULL,
  `hidememberbalanceandtransactions` tinyint(1) DEFAULT 0,
  `covid19disclaimer` longtext DEFAULT NULL,
  `serviceprovided` enum('Online','At Premises','Both') NOT NULL DEFAULT 'At Premises',
  `cardswipe` longtext DEFAULT NULL,
  `singninfontportrait` varchar(20) DEFAULT NULL,
  `singninfontlandscap` varchar(20) DEFAULT NULL,
  `membercanbookpt` tinyint(1) NOT NULL DEFAULT 0,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `commissionpostduringattendance` tinyint(1) DEFAULT 0,
  `commissionconfirmationlimit` int(11) DEFAULT NULL,
  `termsconditionstype` enum('Same Page','Next Page') DEFAULT NULL,
  `ptattendancelimit` int(11) DEFAULT NULL,
  `membershipbasedgymaccess` tinyint(1) DEFAULT 0,
  `isshowpaymentdetailingstinvoice` tinyint(1) DEFAULT 0,
  `showbenefitininvoice` tinyint(1) DEFAULT 1,
  `ptattendancerestrictionbasedonlastcheckindate` tinyint(1) DEFAULT 0,
  `salesbasedonrepresentative` tinyint(1) NOT NULL DEFAULT 0,
  `generategstinvoice` tinyint(1) NOT NULL DEFAULT 0,
  `brandedapp` tinyint(1) DEFAULT 0,
  `organizationbrandname` varchar(200) DEFAULT NULL,
  `enableloginpageenqiry` tinyint(1) DEFAULT 0,
  `enableloginpageservices` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `useremail`, `password`, `clienttype`, `ishavemutliplebranch`, `branchscope`, `clientcode`, `numberofbranch`, `status`, `organizationname`, `organizationtype`, `firstname`, `lastname`, `mobile`, `redirecturi`, `logo`, `tagline`, `sidebarimage`, `memberprofilecoverimage`, `signinbackgroundimage`, `emailgateway`, `smsgateway`, `paymentgateway`, `socialmedia`, `category`, `durationcount`, `duration`, `trialenddate`, `disclaimer`, `taxtype`, `gstin`, `printtype`, `discounttype`, `termsconditions`, `footermessge`, `istaxenable`, `signimage`, `invoicebannerimage`, `professionaltype`, `biometric`, `isinbody`, `geofencing`, `hidememberbalanceandtransactions`, `covid19disclaimer`, `serviceprovided`, `cardswipe`, `singninfontportrait`, `singninfontlandscap`, `membercanbookpt`, `deleted`, `commissionpostduringattendance`, `commissionconfirmationlimit`, `termsconditionstype`, `ptattendancelimit`, `membershipbasedgymaccess`, `isshowpaymentdetailingstinvoice`, `showbenefitininvoice`, `ptattendancerestrictionbasedonlastcheckindate`, `salesbasedonrepresentative`, `generategstinvoice`, `brandedapp`, `organizationbrandname`, `enableloginpageenqiry`, `enableloginpageservices`) VALUES
(1, 'fpladmin@gmail.com', 'f55109abd1f72d25f16b3092d5282872', 'Enterprise', 1, 'Worldwide', 'app', 1, 'Active', 'FitnezzApp', NULL, 'Vishal', 'Solanki', '9429231113', 'app', '1_app/Logo/2018/powerhouse1538119554.jpg', '', NULL, NULL, '[]', '{\"from\": \"admin@fitnessproleague.com\", \"host\": \"fitnessproleague.com\", \"port\": \"465\", \"status\": \"1\", \"emailid\": \"admin@fitnessproleague.com\", \"password\": \"ff2685d29ff6ce2ef6c18e88e6b8b0eaa939d859f23de40ab80dca3b4d8bb752\", \"secureconnection\": false}', '{\"id\": \"\", \"apikey\": \"\", \"status\": \"2\", \"userid\": \"\", \"password\": \"\", \"senderid\": \"\"}', NULL, NULL, 'Free', '', NULL, NULL, '{\"consent\": \"I%2CMr./Mrs./Ms.%20%7B%24M_FNAME%24%7D%20%7B%24M_LNAME%24%7D%20agree%20to%20give%20my%20consent%20to%20join%20%7B%24G_ORGNAME%24%7D%20for%20all%20gym%20related%20activities%20i.e.%20resistance%20%2C%20cardiovascular%20%2C%20aerobic%20zone.%0AAll%20exercise%20related%20points%20have%20been%20well%20explained%20and%20understood%20by%20me%20and%20by%20signing%20this%20form%20I%20am%20personally%20responsible%20for%20all%20actions%20and%20workouts%20during%20my%20fitness%20tenure%20at%20%7B%24G_ORGNAME%24%7D.%20I%20will%20also%20not%20hold%20the%20branch%20and/%20or%20its%20staff%20responsible%20for%20any%20of%20the%20injury%2C%20minor/major%2C%20that%20may%20occur%20during%20my%20presence%20in%20the%20premises.%20%20%20%20%0ASafety%20of%20all%20my%20belongings%20and%20other%20valuables%20is%20my%20sole%20responsibility.%0AFee%20paid%20once%20will%20not%20be%20transferable%2C%20refundable%20on%20any%20direct%20or%20pro%20data%20basis.%20The%20fee%20structure%20has%20been%20under%20stood%20by%20me%20in%20details.\", \"rulelist\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], \"questionlist\": [1, 2, 3, 4, 5, 30, 31, 32, 33, 34, 35, 36, 37, 38, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], \"isdisclaimerenabled\": \"0\"}', 'Exclude', '0123456', 'Normal', 'Fixed', 'Goods once sold will not be accepted back. Our responsibility ceases as soon as goods leaves our premises', 'Thank you! Come again', 1, NULL, NULL, 'Both', '{\"url\": \"\", \"isbiometricenable\": 1}', 0, NULL, 1, '{\"questionlist\": [], \"covid19daysconfig\": 7, \"iscovid19staffdisclaimerenabled\": \"0\", \"iscovid19memberdisclaimerenabled\": \"0\"}', 'At Premises', NULL, NULL, NULL, 0, 0, 0, NULL, 'Same Page', NULL, 0, 0, 1, 0, 0, 0, 0, NULL, 0, 0),
(2, 'sanghviharmesh06@gmail.com', '96de13e13556925fa7532ddd5dacb533', 'Enterprise', 0, 'Worldwide', 'tambola', 1, 'Active', 'Tambola%20Admin', 'Gym', 'Vishal', 'Solanki', '8238380029', 'tambola', '2_ssl/ClientLogo/2021/flydZNOxwCEj5mwunsplash1614677485.jpg', 'Fitness%20For%20Life', '[]', '[\"2_mypro/ClientMemberProfileBanner/2019/banner41577278121.jpg\"]', '[]', '{\"from\": \"gymfitness2020@gmail.com\", \"host\": \"smtp.gmail.com\", \"port\": \"465\", \"status\": \"1\", \"emailid\": \"gymfitness2020@gmail.com\", \"password\": \"6fc58aa0b5f743eaf4586efddbe0fbf2\", \"secureconnection\": 1}', '{\"id\": \"\", \"url\": \"undefined\", \"apikey\": \"\", \"status\": \"1\", \"userid\": \"\", \"headers\": \"%7B%22agg%22%3A%22hgjh%22%2C%22hgh%22%3A%22hghg%22%7D\", \"password\": \"\", \"senderid\": \"\", \"promotionalurl\": \"undefinedsfjjj\", \"transactionalurl\": \"sdddddadada\"}', '[{\"mid\": \"DIY12386817555501617\", \"status\": 1, \"website\": \"WEBSTAGING\", \"secretkey\": \"bKMfNxPPf_QdZppa\", \"configurationtype\": \"Paytm\", \"configurationvalue\": \"1\"}]', '{\"youtube\": {\"id\": \"UCaB8_Y_iGaKKT7K0tNRqerQ\", \"url\": \"https://www.youtube.com/channel/\"}, \"facebook\": {\"id\": \"pages/category/Entertainment-Website/IFBB-Pro-League-503184306715865/\", \"url\": \"https://www.facebook.com/\"}, \"whatsapp\": {\"id\": \"918238380029\", \"url\": \"https://wa.me/\"}, \"instagram\": {\"id\": \"\", \"url\": \"https://www.instagram.com/\"}}', 'Free', '', NULL, NULL, '{\"consent\": \"I%2CMr./Mrs./Ms.%20%7B%24M_FNAME%24%7D%20%7B%24M_LNAME%24%7D%20agree%20to%20give%20my%20consent%20to%20join%20mypro%20for%20all%20gym%20related%20activities%20i.e.%20resistance%20%2C%20cardiovascular%20%2C%20aerobic%20zone.%0AAll%20exercise%20related%20points%20have%20been%20well%20explained%20and%20understood%20by%20me%20and%20by%20signing%20this%20form%20I%20am%20personally%20responsible%20for%20all%20actions%20and%20workouts%20during%20my%20fitness%20tenure%20at%20mypro.%20I%20will%20also%20not%20hold%20the%20branch%20and/%20or%20its%20staff%20responsible%20for%20any%20of%20the%20injury%2C%20minor/major%2C%20that%20may%20occur%20during%20my%20presence%20in%20the%20premises.%20%20%20%20%0ASafety%20of%20all%20my%20belongings%20and%20other%20valuables%20is%20my%20sole%20responsibility.%0AFee%20paid%20once%20will%20not%20be%20transferable%2C%20refundable%20on%20any%20direct%20or%20pro%20data%20basis.%20The%20fee%20structure%20has%20been%20under%20stood%20by%20me%20in%20details.\", \"rulelist\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], \"questionlist\": [3, 1, 4, 5, 30, 31, 32, 33, 34, 35, 36, 37, 38, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], \"isdisclaimerenabled\": 1}', 'Exclude', '8/5858585858', 'Normal', 'Percentage', 'Goods%20once%20sold%20will%20not%20be%20accepted%20back.%20Our%20responsibility%20ceases%20as%20soon%20as%20goods%20leaves%20our%20premises', 'Thank%20you%21%20Come%20again', 1, '2_mypro/AuthrisedSignature/2019/Sign1564720991.jpeg', '[]', 'Both', '{\"url\": \"\", \"isbiometricenable\": 1}', 1, '{\"geofencingarea\": \"\", \"isgeofencingenable\": 0}', 0, '{\"questionlist\": [], \"covid19daysconfig\": \"7\", \"iscovid19staffdisclaimerenabled\": \"0\", \"iscovid19memberdisclaimerenabled\": 1}', 'Both', '{\"iscardswipeenable\": 1, \"cardswipepercentage\": \"2\"}', '#ffffff', '#ffffff', 0, 0, 0, NULL, 'Same Page', NULL, 0, 1, 1, 2, 0, 0, 0, '', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `clientnotificationconfiguration`
--

CREATE TABLE `clientnotificationconfiguration` (
  `id` int(11) NOT NULL,
  `notificationalias` varchar(100) DEFAULT NULL,
  `notificationtype` varchar(45) DEFAULT NULL,
  `isenable` tinyint(1) DEFAULT 0,
  `days` longtext DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `notificationthrough` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `clientregistrationrequest`
--

CREATE TABLE `clientregistrationrequest` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `verificationcode` varchar(10) DEFAULT NULL,
  `isused` tinyint(4) NOT NULL,
  `expirydate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `continent`
--

CREATE TABLE `continent` (
  `code` char(2) NOT NULL COMMENT 'Continent code',
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `continent`
--

INSERT INTO `continent` (`code`, `name`) VALUES
('AF', 'Africa'),
('AN', 'Antarctica'),
('AS', 'Asia'),
('EU', 'Europe'),
('NA', 'North America'),
('OC', 'Oceania'),
('SA', 'South America');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `code` char(2) NOT NULL COMMENT 'Two-letter country code (ISO 3166-1 alpha-2)',
  `name` varchar(255) NOT NULL COMMENT 'English country name',
  `full_name` varchar(255) NOT NULL COMMENT 'Full English country name',
  `iso3` char(3) NOT NULL COMMENT 'Three-letter country code (ISO 3166-1 alpha-3)',
  `number` smallint(3) UNSIGNED ZEROFILL NOT NULL COMMENT 'Three-digit country number (ISO 3166-1 numeric)',
  `continent_code` char(2) NOT NULL,
  `phonecode` int(11) DEFAULT NULL,
  `currency` varchar(60) DEFAULT NULL,
  `languagecode` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`code`, `name`, `full_name`, `iso3`, `number`, `continent_code`, `phonecode`, `currency`, `languagecode`) VALUES
('AD', 'Andorra', 'Principality of Andorra', 'AND', 020, 'EU', 376, NULL, NULL),
('AE', 'United Arab Emirates', 'United Arab Emirates', 'ARE', 784, 'AS', 971, 'AED', 'ar'),
('AF', 'Afghanistan', 'Islamic Republic of Afghanistan', 'AFG', 004, 'AS', 93, NULL, NULL),
('AG', 'Antigua and Barbuda', 'Antigua and Barbuda', 'ATG', 028, 'NA', 1268, NULL, NULL),
('AI', 'Anguilla', 'Anguilla', 'AIA', 660, 'NA', 1264, NULL, NULL),
('AL', 'Albania', 'Republic of Albania', 'ALB', 008, 'EU', 355, NULL, NULL),
('AM', 'Armenia', 'Republic of Armenia', 'ARM', 051, 'AS', 374, NULL, 'am'),
('AO', 'Angola', 'Republic of Angola', 'AGO', 024, 'AF', 244, NULL, NULL),
('AQ', 'Antarctica', 'Antarctica (the territory South of 60 deg S)', 'ATA', 010, 'AN', 0, NULL, NULL),
('AR', 'Argentina', 'Argentine Republic', 'ARG', 032, 'SA', 54, NULL, NULL),
('AS', 'American Samoa', 'American Samoa', 'ASM', 016, 'OC', 1684, NULL, NULL),
('AT', 'Austria', 'Republic of Austria', 'AUT', 040, 'EU', 43, NULL, 'de'),
('AU', 'Australia', 'Commonwealth of Australia', 'AUS', 036, 'OC', 61, NULL, 'en'),
('AW', 'Aruba', 'Aruba', 'ABW', 533, 'NA', 297, NULL, NULL),
('AX', 'Åland Islands', 'Åland Islands', 'ALA', 248, 'EU', NULL, NULL, NULL),
('AZ', 'Azerbaijan', 'Republic of Azerbaijan', 'AZE', 031, 'AS', 994, NULL, NULL),
('BA', 'Bosnia and Herzegovina', 'Bosnia and Herzegovina', 'BIH', 070, 'EU', 387, NULL, NULL),
('BB', 'Barbados', 'Barbados', 'BRB', 052, 'NA', 1246, NULL, NULL),
('BD', 'Bangladesh', 'People\'s Republic of Bangladesh', 'BGD', 050, 'AS', 880, NULL, 'bn'),
('BE', 'Belgium', 'Kingdom of Belgium', 'BEL', 056, 'EU', 32, NULL, 'nl'),
('BF', 'Burkina Faso', 'Burkina Faso', 'BFA', 854, 'AF', 226, NULL, NULL),
('BG', 'Bulgaria', 'Republic of Bulgaria', 'BGR', 100, 'EU', 359, NULL, 'bg'),
('BH', 'Bahrain', 'Kingdom of Bahrain', 'BHR', 048, 'AS', 973, NULL, 'ar'),
('BI', 'Burundi', 'Republic of Burundi', 'BDI', 108, 'AF', 257, NULL, NULL),
('BJ', 'Benin', 'Republic of Benin', 'BEN', 204, 'AF', 229, NULL, NULL),
('BL', 'Saint Barthélemy', 'Saint Barthélemy', 'BLM', 652, 'NA', NULL, NULL, NULL),
('BM', 'Bermuda', 'Bermuda', 'BMU', 060, 'NA', 1441, NULL, NULL),
('BN', 'Brunei Darussalam', 'Brunei Darussalam', 'BRN', 096, 'AS', 673, NULL, NULL),
('BO', 'Bolivia', 'Plurinational State of Bolivia', 'BOL', 068, 'SA', 591, NULL, NULL),
('BQ', 'Bonaire, Sint Eustatius and Saba', 'Bonaire, Sint Eustatius and Saba', 'BES', 535, 'NA', NULL, NULL, NULL),
('BR', 'Brazil', 'Federative Republic of Brazil', 'BRA', 076, 'SA', 55, NULL, 'pt'),
('BS', 'Bahamas', 'Commonwealth of the Bahamas', 'BHS', 044, 'NA', 1242, NULL, NULL),
('BT', 'Bhutan', 'Kingdom of Bhutan', 'BTN', 064, 'AS', 975, NULL, NULL),
('BV', 'Bouvet Island (Bouvetoya)', 'Bouvet Island (Bouvetoya)', 'BVT', 074, 'AN', 0, NULL, NULL),
('BW', 'Botswana', 'Republic of Botswana', 'BWA', 072, 'AF', 267, NULL, NULL),
('BY', 'Belarus', 'Republic of Belarus', 'BLR', 112, 'EU', 375, NULL, 'be'),
('BZ', 'Belize', 'Belize', 'BLZ', 084, 'NA', 501, NULL, NULL),
('CA', 'Canada', 'Canada', 'CAN', 124, 'NA', 1, NULL, NULL),
('CC', 'Cocos (Keeling) Islands', 'Cocos (Keeling) Islands', 'CCK', 166, 'AS', 672, NULL, NULL),
('CD', 'Congo', 'Democratic Republic of the Congo', 'COD', 180, 'AF', 242, NULL, NULL),
('CF', 'Central African Republic', 'Central African Republic', 'CAF', 140, 'AF', 236, NULL, NULL),
('CG', 'Congo', 'Republic of the Congo', 'COG', 178, 'AF', 242, NULL, NULL),
('CH', 'Switzerland', 'Swiss Confederation', 'CHE', 756, 'EU', 41, NULL, 'de'),
('CI', 'Cote d\'Ivoire', 'Republic of Cote d\'Ivoire', 'CIV', 384, 'AF', 225, NULL, NULL),
('CK', 'Cook Islands', 'Cook Islands', 'COK', 184, 'OC', 682, NULL, NULL),
('CL', 'Chile', 'Republic of Chile', 'CHL', 152, 'SA', 56, NULL, 'es'),
('CM', 'Cameroon', 'Republic of Cameroon', 'CMR', 120, 'AF', 237, NULL, NULL),
('CN', 'China', 'People\'s Republic of China', 'CHN', 156, 'AS', 86, NULL, 'zh'),
('CO', 'Colombia', 'Republic of Colombia', 'COL', 170, 'SA', 57, NULL, 'es'),
('CR', 'Costa Rica', 'Republic of Costa Rica', 'CRI', 188, 'NA', 506, NULL, 'es'),
('CU', 'Cuba', 'Republic of Cuba', 'CUB', 192, 'NA', 53, NULL, NULL),
('CV', 'Cape Verde', 'Republic of Cape Verde', 'CPV', 132, 'AF', 238, NULL, NULL),
('CW', 'Curaçao', 'Curaçao', 'CUW', 531, 'NA', NULL, NULL, NULL),
('CX', 'Christmas Island', 'Christmas Island', 'CXR', 162, 'AS', 61, NULL, NULL),
('CY', 'Cyprus', 'Republic of Cyprus', 'CYP', 196, 'AS', 357, NULL, NULL),
('CZ', 'Czech Republic', 'Czech Republic', 'CZE', 203, 'EU', 420, NULL, 'cs'),
('DE', 'Germany', 'Federal Republic of Germany', 'DEU', 276, 'EU', 49, NULL, 'de'),
('DJ', 'Djibouti', 'Republic of Djibouti', 'DJI', 262, 'AF', 253, NULL, NULL),
('DK', 'Denmark', 'Kingdom of Denmark', 'DNK', 208, 'EU', 45, NULL, 'da'),
('DM', 'Dominica', 'Commonwealth of Dominica', 'DMA', 212, 'NA', 1767, NULL, NULL),
('DO', 'Dominican Republic', 'Dominican Republic', 'DOM', 214, 'NA', 1809, NULL, NULL),
('DZ', 'Algeria', 'People\'s Democratic Republic of Algeria', 'DZA', 012, 'AF', 213, NULL, 'ar'),
('EC', 'Ecuador', 'Republic of Ecuador', 'ECU', 218, 'SA', 593, NULL, 'es'),
('EE', 'Estonia', 'Republic of Estonia', 'EST', 233, 'EU', 372, NULL, 'et'),
('EG', 'Egypt', 'Arab Republic of Egypt', 'EGY', 818, 'AF', 20, NULL, 'ar'),
('EH', 'Western Sahara', 'Western Sahara', 'ESH', 732, 'AF', 212, NULL, NULL),
('ER', 'Eritrea', 'State of Eritrea', 'ERI', 232, 'AF', 291, NULL, NULL),
('ES', 'Spain', 'Kingdom of Spain', 'ESP', 724, 'EU', 34, NULL, 'es'),
('ET', 'Ethiopia', 'Federal Democratic Republic of Ethiopia', 'ETH', 231, 'AF', 251, NULL, NULL),
('FI', 'Finland', 'Republic of Finland', 'FIN', 246, 'EU', 358, NULL, 'fi'),
('FJ', 'Fiji', 'Republic of Fiji', 'FJI', 242, 'OC', 679, NULL, 'fj'),
('FK', 'Falkland Islands (Malvinas)', 'Falkland Islands (Malvinas)', 'FLK', 238, 'SA', 500, NULL, NULL),
('FM', 'Micronesia', 'Federated States of Micronesia', 'FSM', 583, 'OC', 691, NULL, NULL),
('FO', 'Faroe Islands', 'Faroe Islands', 'FRO', 234, 'EU', 298, NULL, 'fo'),
('FR', 'France', 'French Republic', 'FRA', 250, 'EU', 33, NULL, 'fr'),
('GA', 'Gabon', 'Gabonese Republic', 'GAB', 266, 'AF', 241, NULL, NULL),
('GB', 'United Kingdom of Great Britain & Northern Ireland', 'United Kingdom of Great Britain & Northern Ireland', 'GBR', 826, 'EU', 44, NULL, 'en'),
('GD', 'Grenada', 'Grenada', 'GRD', 308, 'NA', 1473, NULL, NULL),
('GE', 'Georgia', 'Georgia', 'GEO', 268, 'AS', 995, NULL, NULL),
('GF', 'French Guiana', 'French Guiana', 'GUF', 254, 'SA', 594, NULL, 'fr'),
('GG', 'Guernsey', 'Bailiwick of Guernsey', 'GGY', 831, 'EU', NULL, NULL, 'en'),
('GH', 'Ghana', 'Republic of Ghana', 'GHA', 288, 'AF', 233, NULL, 'en'),
('GI', 'Gibraltar', 'Gibraltar', 'GIB', 292, 'EU', 350, NULL, NULL),
('GL', 'Greenland', 'Greenland', 'GRL', 304, 'NA', 299, NULL, 'kl'),
('GM', 'Gambia', 'Republic of the Gambia', 'GMB', 270, 'AF', 220, NULL, NULL),
('GN', 'Guinea', 'Republic of Guinea', 'GIN', 324, 'AF', 224, NULL, NULL),
('GP', 'Guadeloupe', 'Guadeloupe', 'GLP', 312, 'NA', 590, NULL, 'fr'),
('GQ', 'Equatorial Guinea', 'Republic of Equatorial Guinea', 'GNQ', 226, 'AF', 240, NULL, NULL),
('GR', 'Greece', 'Hellenic Republic Greece', 'GRC', 300, 'EU', 30, NULL, 'el'),
('GS', 'South Georgia and the South Sandwich Islands', 'South Georgia and the South Sandwich Islands', 'SGS', 239, 'AN', 0, NULL, NULL),
('GT', 'Guatemala', 'Republic of Guatemala', 'GTM', 320, 'NA', 502, NULL, NULL),
('GU', 'Guam', 'Guam', 'GUM', 316, 'OC', 1671, NULL, NULL),
('GW', 'Guinea-Bissau', 'Republic of Guinea-Bissau', 'GNB', 624, 'AF', 245, NULL, NULL),
('GY', 'Guyana', 'Co-operative Republic of Guyana', 'GUY', 328, 'SA', 592, NULL, NULL),
('HK', 'Hong Kong', 'Hong Kong Special Administrative Region of China', 'HKG', 344, 'AS', 852, NULL, 'en'),
('HM', 'Heard Island and McDonald Islands', 'Heard Island and McDonald Islands', 'HMD', 334, 'AN', 0, NULL, NULL),
('HN', 'Honduras', 'Republic of Honduras', 'HND', 340, 'NA', 504, NULL, NULL),
('HR', 'Croatia', 'Republic of Croatia', 'HRV', 191, 'EU', 385, NULL, NULL),
('HT', 'Haiti', 'Republic of Haiti', 'HTI', 332, 'NA', 509, NULL, NULL),
('HU', 'Hungary', 'Hungary', 'HUN', 348, 'EU', 36, NULL, 'hu'),
('ID', 'Indonesia', 'Republic of Indonesia', 'IDN', 360, 'AS', 62, 'Rp', 'id'),
('IE', 'Ireland', 'Ireland', 'IRL', 372, 'EU', 353, NULL, 'en'),
('IL', 'Israel', 'State of Israel', 'ISR', 376, 'AS', 972, NULL, 'he'),
('IM', 'Isle of Man', 'Isle of Man', 'IMN', 833, 'EU', NULL, NULL, NULL),
('IN', 'India', 'Republic of India', 'IND', 356, 'AS', 91, '%u20B9', 'en'),
('IO', 'British Indian Ocean Territory (Chagos Archipelago)', 'British Indian Ocean Territory (Chagos Archipelago)', 'IOT', 086, 'AS', 246, NULL, NULL),
('IQ', 'Iraq', 'Republic of Iraq', 'IRQ', 368, 'AS', 964, NULL, 'ar'),
('IR', 'Iran', 'Islamic Republic of Iran', 'IRN', 364, 'AS', 98, NULL, 'fa'),
('IS', 'Iceland', 'Republic of Iceland', 'ISL', 352, 'EU', 354, NULL, NULL),
('IT', 'Italy', 'Italian Republic', 'ITA', 380, 'EU', 39, NULL, 'it'),
('JE', 'Jersey', 'Bailiwick of Jersey', 'JEY', 832, 'EU', NULL, NULL, NULL),
('JM', 'Jamaica', 'Jamaica', 'JAM', 388, 'NA', 1876, NULL, NULL),
('JO', 'Jordan', 'Hashemite Kingdom of Jordan', 'JOR', 400, 'AS', 962, NULL, 'ar'),
('JP', 'Japan', 'Japan', 'JPN', 392, 'AS', 81, NULL, 'ja'),
('KE', 'Kenya', 'Republic of Kenya', 'KEN', 404, 'AF', 254, NULL, 'en'),
('KG', 'Kyrgyz Republic', 'Kyrgyz Republic', 'KGZ', 417, 'AS', 996, NULL, NULL),
('KH', 'Cambodia', 'Kingdom of Cambodia', 'KHM', 116, 'AS', 855, NULL, NULL),
('KI', 'Kiribati', 'Republic of Kiribati', 'KIR', 296, 'OC', 686, NULL, NULL),
('KM', 'Comoros', 'Union of the Comoros', 'COM', 174, 'AF', 269, NULL, NULL),
('KN', 'Saint Kitts and Nevis', 'Federation of Saint Kitts and Nevis', 'KNA', 659, 'NA', 1869, NULL, NULL),
('KP', 'Korea', 'Democratic People\'s Republic of Korea', 'PRK', 408, 'AS', 850, NULL, NULL),
('KR', 'Korea', 'Republic of Korea', 'KOR', 410, 'AS', 82, NULL, 'ko'),
('KW', 'Kuwait', 'State of Kuwait', 'KWT', 414, 'AS', 965, NULL, 'ar'),
('KY', 'Cayman Islands', 'Cayman Islands', 'CYM', 136, 'NA', 1345, NULL, NULL),
('KZ', 'Kazakhstan', 'Republic of Kazakhstan', 'KAZ', 398, 'AS', 7, NULL, 'kk'),
('LA', 'Lao People\'s Democratic Republic', 'Lao People\'s Democratic Republic', 'LAO', 418, 'AS', 856, NULL, NULL),
('LB', 'Lebanon', 'Lebanese Republic', 'LBN', 422, 'AS', 961, NULL, NULL),
('LC', 'Saint Lucia', 'Saint Lucia', 'LCA', 662, 'NA', 1758, NULL, NULL),
('LI', 'Liechtenstein', 'Principality of Liechtenstein', 'LIE', 438, 'EU', 423, NULL, NULL),
('LK', 'Sri Lanka', 'Democratic Socialist Republic of Sri Lanka', 'LKA', 144, 'AS', 94, NULL, NULL),
('LR', 'Liberia', 'Republic of Liberia', 'LBR', 430, 'AF', 231, NULL, NULL),
('LS', 'Lesotho', 'Kingdom of Lesotho', 'LSO', 426, 'AF', 266, NULL, NULL),
('LT', 'Lithuania', 'Republic of Lithuania', 'LTU', 440, 'EU', 370, NULL, 'lt'),
('LU', 'Luxembourg', 'Grand Duchy of Luxembourg', 'LUX', 442, 'EU', 352, NULL, NULL),
('LV', 'Latvia', 'Republic of Latvia', 'LVA', 428, 'EU', 371, NULL, NULL),
('LY', 'Libya', 'Libya', 'LBY', 434, 'AF', 218, NULL, 'ar'),
('MA', 'Morocco', 'Kingdom of Morocco', 'MAR', 504, 'AF', 212, NULL, NULL),
('MC', 'Monaco', 'Principality of Monaco', 'MCO', 492, 'EU', 377, NULL, NULL),
('MD', 'Moldova', 'Republic of Moldova', 'MDA', 498, 'EU', 373, NULL, NULL),
('ME', 'Montenegro', 'Montenegro', 'MNE', 499, 'EU', NULL, NULL, NULL),
('MF', 'Saint Martin', 'Saint Martin (French part)', 'MAF', 663, 'NA', NULL, NULL, NULL),
('MG', 'Madagascar', 'Republic of Madagascar', 'MDG', 450, 'AF', 261, NULL, NULL),
('MH', 'Marshall Islands', 'Republic of the Marshall Islands', 'MHL', 584, 'OC', 692, NULL, NULL),
('MK', 'Macedonia', 'Republic of Macedonia', 'MKD', 807, 'EU', 389, NULL, NULL),
('ML', 'Mali', 'Republic of Mali', 'MLI', 466, 'AF', 223, NULL, NULL),
('MM', 'Myanmar', 'Republic of the Union of Myanmar', 'MMR', 104, 'AS', 95, NULL, NULL),
('MN', 'Mongolia', 'Mongolia', 'MNG', 496, 'AS', 976, NULL, NULL),
('MO', 'Macao', 'Macao Special Administrative Region of China', 'MAC', 446, 'AS', 853, NULL, 'en'),
('MP', 'Northern Mariana Islands', 'Commonwealth of the Northern Mariana Islands', 'MNP', 580, 'OC', 1670, NULL, NULL),
('MQ', 'Martinique', 'Martinique', 'MTQ', 474, 'NA', 596, NULL, 'fr'),
('MR', 'Mauritania', 'Islamic Republic of Mauritania', 'MRT', 478, 'AF', 222, NULL, NULL),
('MS', 'Montserrat', 'Montserrat', 'MSR', 500, 'NA', 1664, NULL, NULL),
('MT', 'Malta', 'Republic of Malta', 'MLT', 470, 'EU', 356, NULL, 'en'),
('MU', 'Mauritius', 'Republic of Mauritius', 'MUS', 480, 'AF', 230, NULL, 'en'),
('MV', 'Maldives', 'Republic of Maldives', 'MDV', 462, 'AS', 960, NULL, NULL),
('MW', 'Malawi', 'Republic of Malawi', 'MWI', 454, 'AF', 265, NULL, NULL),
('MX', 'Mexico', 'United Mexican States', 'MEX', 484, 'NA', 52, NULL, 'es'),
('MY', 'Malaysia', 'Malaysia', 'MYS', 458, 'AS', 60, NULL, 'ms'),
('MZ', 'Mozambique', 'Republic of Mozambique', 'MOZ', 508, 'AF', 258, NULL, NULL),
('NA', 'Namibia', 'Republic of Namibia', 'NAM', 516, 'AF', 264, NULL, NULL),
('NC', 'New Caledonia', 'New Caledonia', 'NCL', 540, 'OC', 687, NULL, NULL),
('NE', 'Niger', 'Republic of Niger', 'NER', 562, 'AF', 227, NULL, NULL),
('NF', 'Norfolk Island', 'Norfolk Island', 'NFK', 574, 'OC', 672, NULL, NULL),
('NG', 'Nigeria', 'Federal Republic of Nigeria', 'NGA', 566, 'AF', 234, NULL, 'en'),
('NI', 'Nicaragua', 'Republic of Nicaragua', 'NIC', 558, 'NA', 505, NULL, NULL),
('NL', 'Netherlands', 'Kingdom of the Netherlands', 'NLD', 528, 'EU', 31, NULL, 'nl'),
('NO', 'Norway', 'Kingdom of Norway', 'NOR', 578, 'EU', 47, NULL, 'nn'),
('NP', 'Nepal', 'Federal Democratic Republic of Nepal', 'NPL', 524, 'AS', 977, NULL, 'ne'),
('NR', 'Nauru', 'Republic of Nauru', 'NRU', 520, 'OC', 674, NULL, NULL),
('NU', 'Niue', 'Niue', 'NIU', 570, 'OC', 683, NULL, NULL),
('NZ', 'New Zealand', 'New Zealand', 'NZL', 554, 'OC', 64, NULL, 'en'),
('OM', 'Oman', 'Sultanate of Oman', 'OMN', 512, 'AS', 968, NULL, NULL),
('PA', 'Panama', 'Republic of Panama', 'PAN', 591, 'NA', 507, NULL, 'es'),
('PE', 'Peru', 'Republic of Peru', 'PER', 604, 'SA', 51, NULL, NULL),
('PF', 'French Polynesia', 'French Polynesia', 'PYF', 258, 'OC', 689, NULL, NULL),
('PG', 'Papua New Guinea', 'Independent State of Papua New Guinea', 'PNG', 598, 'OC', 675, NULL, NULL),
('PH', 'Philippines', 'Republic of the Philippines', 'PHL', 608, 'AS', 63, '%u20B1', 'en'),
('PK', 'Pakistan', 'Islamic Republic of Pakistan', 'PAK', 586, 'AS', 92, NULL, 'en'),
('PL', 'Poland', 'Republic of Poland', 'POL', 616, 'EU', 48, NULL, 'pl'),
('PM', 'Saint Pierre and Miquelon', 'Saint Pierre and Miquelon', 'SPM', 666, 'NA', 508, NULL, NULL),
('PN', 'Pitcairn Islands', 'Pitcairn Islands', 'PCN', 612, 'OC', 0, NULL, NULL),
('PR', 'Puerto Rico', 'Commonwealth of Puerto Rico', 'PRI', 630, 'NA', 1787, NULL, NULL),
('PS', 'Palestinian Territory', 'Occupied Palestinian Territory', 'PSE', 275, 'AS', 970, NULL, NULL),
('PT', 'Portugal', 'Portuguese Republic', 'PRT', 620, 'EU', 351, NULL, 'pt'),
('PW', 'Palau', 'Republic of Palau', 'PLW', 585, 'OC', 680, NULL, NULL),
('PY', 'Paraguay', 'Republic of Paraguay', 'PRY', 600, 'SA', 595, NULL, 'es'),
('QA', 'Qatar', 'State of Qatar', 'QAT', 634, 'AS', 974, NULL, NULL),
('RE', 'Réunion', 'Réunion', 'REU', 638, 'AF', 262, NULL, 'fr'),
('RO', 'Romania', 'Romania', 'ROU', 642, 'EU', 40, NULL, 'ro'),
('RS', 'Serbia', 'Republic of Serbia', 'SRB', 688, 'EU', 381, 'din', 'sr'),
('RU', 'Russian Federation', 'Russian Federation', 'RUS', 643, 'EU', 70, NULL, 'ru'),
('RW', 'Rwanda', 'Republic of Rwanda', 'RWA', 646, 'AF', 250, NULL, 'en'),
('SA', 'Saudi Arabia', 'Kingdom of Saudi Arabia', 'SAU', 682, 'AS', 966, NULL, 'ar'),
('SB', 'Solomon Islands', 'Solomon Islands', 'SLB', 090, 'OC', 677, NULL, NULL),
('SC', 'Seychelles', 'Republic of Seychelles', 'SYC', 690, 'AF', 248, NULL, NULL),
('SD', 'Sudan', 'Republic of Sudan', 'SDN', 729, 'AF', 249, NULL, NULL),
('SE', 'Sweden', 'Kingdom of Sweden', 'SWE', 752, 'EU', 46, NULL, 'sv'),
('SG', 'Singapore', 'Republic of Singapore', 'SGP', 702, 'AS', 65, NULL, 'en'),
('SH', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Helena, Ascension and Tristan da Cunha', 'SHN', 654, 'AF', 290, NULL, NULL),
('SI', 'Slovenia', 'Republic of Slovenia', 'SVN', 705, 'EU', 386, NULL, 'sl'),
('SJ', 'Svalbard & Jan Mayen Islands', 'Svalbard & Jan Mayen Islands', 'SJM', 744, 'EU', 47, NULL, NULL),
('SK', 'Slovakia (Slovak Republic)', 'Slovakia (Slovak Republic)', 'SVK', 703, 'EU', 421, '%u20AC', 'sk'),
('SL', 'Sierra Leone', 'Republic of Sierra Leone', 'SLE', 694, 'AF', 232, NULL, 'en'),
('SM', 'San Marino', 'Republic of San Marino', 'SMR', 674, 'EU', 378, NULL, NULL),
('SN', 'Senegal', 'Republic of Senegal', 'SEN', 686, 'AF', 221, NULL, NULL),
('SO', 'Somalia', 'Somali Republic', 'SOM', 706, 'AF', 252, NULL, NULL),
('SR', 'Suriname', 'Republic of Suriname', 'SUR', 740, 'SA', 597, NULL, NULL),
('SS', 'South Sudan', 'Republic of South Sudan', 'SSD', 728, 'AF', NULL, NULL, NULL),
('ST', 'Sao Tome and Principe', 'Democratic Republic of Sao Tome and Principe', 'STP', 678, 'AF', 239, NULL, NULL),
('SV', 'El Salvador', 'Republic of El Salvador', 'SLV', 222, 'NA', 503, NULL, NULL),
('SX', 'Sint Maarten (Dutch part)', 'Sint Maarten (Dutch part)', 'SXM', 534, 'NA', NULL, NULL, NULL),
('SY', 'Syrian Arab Republic', 'Syrian Arab Republic', 'SYR', 760, 'AS', 963, NULL, 'ar'),
('SZ', 'Swaziland', 'Kingdom of Swaziland', 'SWZ', 748, 'AF', 268, NULL, NULL),
('TC', 'Turks and Caicos Islands', 'Turks and Caicos Islands', 'TCA', 796, 'NA', 1649, NULL, NULL),
('TD', 'Chad', 'Republic of Chad', 'TCD', 148, 'AF', 235, NULL, NULL),
('TF', 'French Southern Territories', 'French Southern Territories', 'ATF', 260, 'AN', 0, NULL, NULL),
('TG', 'Togo', 'Togolese Republic', 'TGO', 768, 'AF', 228, NULL, NULL),
('TH', 'Thailand', 'Kingdom of Thailand', 'THA', 764, 'AS', 66, NULL, 'th'),
('TJ', 'Tajikistan', 'Republic of Tajikistan', 'TJK', 762, 'AS', 992, NULL, NULL),
('TK', 'Tokelau', 'Tokelau', 'TKL', 772, 'OC', 690, NULL, NULL),
('TL', 'Timor-Leste', 'Democratic Republic of Timor-Leste', 'TLS', 626, 'AS', 670, NULL, NULL),
('TM', 'Turkmenistan', 'Turkmenistan', 'TKM', 795, 'AS', 7370, NULL, NULL),
('TN', 'Tunisia', 'Tunisian Republic', 'TUN', 788, 'AF', 216, NULL, 'ar'),
('TO', 'Tonga', 'Kingdom of Tonga', 'TON', 776, 'OC', 676, NULL, NULL),
('TR', 'Turkey', 'Republic of Turkey', 'TUR', 792, 'AS', 90, NULL, 'tr'),
('TT', 'Trinidad and Tobago', 'Republic of Trinidad and Tobago', 'TTO', 780, 'NA', 1868, NULL, NULL),
('TV', 'Tuvalu', 'Tuvalu', 'TUV', 798, 'OC', 688, NULL, NULL),
('TW', 'Taiwan', 'Taiwan, Province of China', 'TWN', 158, 'AS', 886, NULL, 'zh'),
('TZ', 'Tanzania', 'United Republic of Tanzania', 'TZA', 834, 'AF', 255, NULL, 'en'),
('UA', 'Ukraine', 'Ukraine', 'UKR', 804, 'EU', 380, NULL, 'uk'),
('UG', 'Uganda', 'Republic of Uganda', 'UGA', 800, 'AF', 256, NULL, 'en'),
('UM', 'United States Minor Outlying Islands', 'United States Minor Outlying Islands', 'UMI', 581, 'OC', 1, NULL, NULL),
('US', 'USA', 'United States of America', 'USA', 840, 'NA', 1, '%24', 'en'),
('UY', 'Uruguay', 'Eastern Republic of Uruguay', 'URY', 858, 'SA', 598, NULL, 'es'),
('UZ', 'Uzbekistan', 'Republic of Uzbekistan', 'UZB', 860, 'AS', 998, NULL, NULL),
('VA', 'Holy See (Vatican City State)', 'Holy See (Vatican City State)', 'VAT', 336, 'EU', 39, NULL, NULL),
('VC', 'Saint Vincent and the Grenadines', 'Saint Vincent and the Grenadines', 'VCT', 670, 'NA', 1784, NULL, NULL),
('VE', 'Venezuela', 'Bolivarian Republic of Venezuela', 'VEN', 862, 'SA', 58, NULL, NULL),
('VG', 'British Virgin Islands', 'British Virgin Islands', 'VGB', 092, 'NA', 1284, NULL, NULL),
('VI', 'United States Virgin Islands', 'United States Virgin Islands', 'VIR', 850, 'NA', 1340, NULL, NULL),
('VN', 'Vietnam', 'Socialist Republic of Vietnam', 'VNM', 704, 'AS', 84, NULL, 'vi'),
('VU', 'Vanuatu', 'Republic of Vanuatu', 'VUT', 548, 'OC', 678, NULL, NULL),
('WF', 'Wallis and Futuna', 'Wallis and Futuna', 'WLF', 876, 'OC', 681, NULL, NULL),
('WS', 'Samoa', 'Independent State of Samoa', 'WSM', 882, 'OC', 684, NULL, NULL),
('YE', 'Yemen', 'Yemen', 'YEM', 887, 'AS', 967, NULL, NULL),
('YT', 'Mayotte', 'Mayotte', 'MYT', 175, 'AF', 269, NULL, NULL),
('ZA', 'South Africa', 'Republic of South Africa', 'ZAF', 710, 'AF', 27, NULL, 'en'),
('ZM', 'Zambia', 'Republic of Zambia', 'ZMB', 894, 'AF', 260, NULL, 'en'),
('ZW', 'Zimbabwe', 'Republic of Zimbabwe', 'ZWE', 716, 'AF', 263, NULL, 'en');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `idea` enum('Idea','Making You Confuse','Any Issue','My Suggestion','Ratings') DEFAULT 'Idea',
  `description` varchar(600) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `logintype` enum('u','m') DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `comments` longtext DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `memberid` int(11) DEFAULT NULL,
  `feedbackfor` enum('Web App','Gym') DEFAULT NULL,
  `averagerating` decimal(2,1) DEFAULT NULL,
  `equipmentrating` decimal(2,1) DEFAULT NULL,
  `facilitiesrating` decimal(2,1) DEFAULT NULL,
  `trainerrating` decimal(2,1) DEFAULT NULL,
  `viberating` decimal(2,1) DEFAULT NULL,
  `valueformoneyrating` decimal(2,1) DEFAULT NULL,
  `feedbackstatus` enum('Action Pending','Completed','In Process','Deferred') DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `branchid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feedbackcomment`
--

CREATE TABLE `feedbackcomment` (
  `id` int(11) NOT NULL,
  `feedbackid` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `memberid` int(11) DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `commentdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id` int(11) NOT NULL,
  `createdbyid` int(11) NOT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `launchdate` datetime DEFAULT NULL,
  `createdbydate` datetime NOT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `clientid` int(11) NOT NULL,
  `drawsequence` text NOT NULL,
  `winners` longtext NOT NULL,
  `called_numbers` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`id`, `createdbyid`, `modifiedbyid`, `status`, `launchdate`, `createdbydate`, `modifiedbydate`, `deleted`, `clientid`, `drawsequence`, `winners`, `called_numbers`) VALUES
(24, 5, NULL, 'Active', '2021-04-05 05:53:00', '2021-04-04 05:53:56', NULL, 0, 2, '[44,41,15,84,29,45,18,19,72,58,75,77,56,8,30,51,40,64,52]', '{\"quick_five\":53,\"quick_five53\":[120,281],\"box_bonus\":48,\"box_bonus48\":[120],\"full_sheet_bonus\":48,\"full_sheet_bonus48\":[157,158,159,160,161,162,241,242,243,244,245,246],\"bottom_line\":78,\"bottom_line78\":[283],\"top_line\":33,\"top_line33\":[144],\"middle_line\":12,\"middle_line12\":[38,63],\"star\":60,\"star60\":[121],\"first_full_house\":14,\"first_full_house14\":[290],\"second_full_house\":46,\"second_full_house46\":[2],\"third_full_house\":6,\"third_full_house6\":[70,107]}', '[69,13,37,87,22,7,73,17,90,53,10,59,48,26,63,5,78,42,20,32,49,61,66,21,82,33,50,86,70,4,39,3,24,38,12,79,65,67,76,62,81,1,88,47,25,57,9,74,35,71,2,27,68,60,80,89,43,28,34,55,85,11,83,54,31,14,46,16,23,36,6]');

-- --------------------------------------------------------

--
-- Table structure for table `gametickets`
--

CREATE TABLE `gametickets` (
  `id` int(11) NOT NULL,
  `gameid` int(11) NOT NULL,
  `ticket` text NOT NULL,
  `customer` varchar(250) DEFAULT NULL,
  `ticketid` int(11) NOT NULL,
  `salesbyid` int(11) DEFAULT NULL,
  `salesbydate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gametickets`
--

INSERT INTO `gametickets` (`id`, `gameid`, `ticket`, `customer`, `ticketid`, `salesbyid`, `salesbydate`) VALUES
(9605, 24, '[[0, 15, 21, 0, 48, 0, 61, 0, 80], [1, 0, 25, 35, 0, 0, 68, 73, 0], [8, 0, 0, 39, 0, 53, 0, 74, 87]]', NULL, 1, NULL, NULL),
(9606, 24, '[[0, 13, 0, 31, 0, 50, 0, 70, 82], [3, 17, 0, 0, 46, 0, 66, 79, 0], [4, 0, 24, 0, 49, 0, 69, 0, 90]]', NULL, 2, NULL, NULL),
(9607, 24, '[[0, 14, 0, 32, 41, 51, 0, 72, 0], [2, 0, 29, 37, 0, 0, 0, 77, 88], [0, 18, 0, 0, 43, 52, 64, 0, 89]]', NULL, 3, NULL, NULL),
(9608, 24, '[[0, 0, 20, 0, 42, 57, 60, 0, 83], [6, 16, 23, 34, 0, 0, 0, 78, 0], [0, 19, 0, 0, 45, 59, 62, 0, 86]]', NULL, 4, NULL, NULL),
(9609, 24, '[[0, 10, 26, 30, 0, 55, 0, 0, 81], [5, 11, 0, 0, 47, 56, 0, 71, 0], [0, 0, 28, 36, 0, 0, 67, 75, 84]]', NULL, 5, NULL, NULL),
(9610, 24, '[[7, 0, 22, 0, 40, 54, 63, 0, 0], [9, 0, 0, 33, 0, 58, 0, 76, 85], [0, 12, 27, 38, 44, 0, 65, 0, 0]]', NULL, 6, NULL, NULL),
(9611, 24, '[[5, 0, 0, 34, 40, 0, 64, 0, 86], [0, 11, 20, 0, 47, 50, 0, 77, 0], [0, 0, 29, 38, 0, 54, 68, 79, 0]]', NULL, 7, NULL, NULL),
(9612, 24, '[[4, 14, 0, 39, 0, 0, 61, 0, 80], [0, 16, 21, 0, 0, 0, 67, 74, 81], [0, 0, 25, 0, 44, 59, 0, 78, 84]]', NULL, 8, NULL, NULL),
(9613, 24, '[[1, 0, 24, 30, 43, 0, 0, 0, 83], [8, 12, 0, 33, 0, 57, 0, 0, 90], [0, 18, 27, 0, 46, 0, 63, 72, 0]]', NULL, 9, NULL, NULL),
(9614, 24, '[[0, 19, 0, 31, 0, 55, 60, 73, 0], [3, 0, 23, 0, 41, 0, 0, 75, 87], [6, 0, 0, 36, 42, 58, 69, 0, 0]]', NULL, 10, NULL, NULL),
(9615, 24, '[[9, 13, 0, 32, 0, 0, 62, 0, 82], [0, 15, 0, 0, 48, 51, 0, 70, 85], [0, 0, 22, 37, 0, 52, 66, 76, 0]]', NULL, 11, NULL, NULL),
(9616, 24, '[[2, 10, 0, 35, 45, 0, 65, 0, 0], [7, 0, 26, 0, 0, 53, 0, 71, 88], [0, 17, 28, 0, 49, 56, 0, 0, 89]]', NULL, 12, NULL, NULL),
(9617, 24, '[[0, 0, 22, 0, 40, 50, 66, 70, 0], [6, 0, 0, 30, 45, 0, 69, 0, 82], [0, 17, 26, 0, 0, 56, 0, 74, 88]]', NULL, 13, NULL, NULL),
(9618, 24, '[[5, 0, 25, 36, 0, 0, 0, 71, 86], [9, 12, 0, 0, 44, 57, 68, 0, 0], [0, 15, 29, 39, 0, 0, 0, 76, 90]]', NULL, 14, NULL, NULL),
(9619, 24, '[[0, 18, 0, 0, 47, 53, 60, 0, 85], [3, 0, 23, 32, 48, 0, 0, 0, 89], [8, 0, 0, 38, 0, 55, 64, 77, 0]]', NULL, 15, NULL, NULL),
(9620, 24, '[[0, 16, 0, 34, 0, 52, 0, 72, 80], [0, 19, 0, 35, 0, 54, 61, 79, 0], [2, 0, 28, 0, 42, 0, 65, 0, 81]]', NULL, 16, NULL, NULL),
(9621, 24, '[[0, 13, 20, 0, 41, 58, 0, 73, 0], [1, 14, 0, 31, 0, 59, 0, 0, 87], [7, 0, 24, 33, 46, 0, 63, 0, 0]]', NULL, 17, NULL, NULL),
(9622, 24, '[[4, 10, 0, 37, 43, 0, 0, 75, 0], [0, 0, 21, 0, 0, 51, 62, 78, 83], [0, 11, 27, 0, 49, 0, 67, 0, 84]]', NULL, 18, NULL, NULL),
(9623, 24, '[[2, 0, 0, 34, 44, 0, 66, 76, 0], [0, 14, 0, 35, 46, 50, 0, 0, 86], [0, 0, 23, 0, 49, 53, 0, 79, 87]]', NULL, 19, NULL, NULL),
(9624, 24, '[[1, 0, 0, 32, 41, 0, 63, 0, 84], [3, 0, 0, 36, 0, 0, 65, 72, 85], [0, 15, 20, 0, 45, 51, 0, 73, 0]]', NULL, 20, NULL, NULL),
(9625, 24, '[[4, 12, 22, 0, 47, 0, 67, 0, 0], [6, 0, 0, 31, 0, 55, 0, 71, 80], [0, 13, 29, 0, 0, 59, 68, 0, 89]]', NULL, 21, NULL, NULL),
(9626, 24, '[[5, 0, 26, 0, 40, 58, 0, 77, 0], [0, 10, 28, 38, 0, 0, 60, 0, 82], [9, 11, 0, 39, 0, 0, 61, 0, 83]]', NULL, 22, NULL, NULL),
(9627, 24, '[[0, 16, 24, 33, 42, 0, 0, 74, 0], [7, 0, 0, 37, 0, 56, 64, 0, 90], [0, 17, 27, 0, 48, 57, 0, 75, 0]]', NULL, 23, NULL, NULL),
(9628, 24, '[[8, 0, 21, 0, 43, 52, 0, 70, 0], [0, 18, 0, 30, 0, 54, 62, 0, 81], [0, 19, 25, 0, 0, 0, 69, 78, 88]]', NULL, 24, NULL, NULL),
(9629, 24, '[[2, 0, 0, 33, 0, 51, 0, 73, 80], [3, 0, 27, 34, 0, 57, 65, 0, 0], [0, 15, 28, 0, 42, 0, 0, 76, 89]]', NULL, 25, NULL, NULL),
(9630, 24, '[[0, 0, 0, 0, 41, 50, 61, 70, 85], [5, 0, 24, 39, 45, 0, 0, 0, 86], [0, 12, 0, 0, 49, 59, 68, 74, 0]]', NULL, 26, NULL, NULL),
(9631, 24, '[[0, 10, 20, 0, 40, 0, 60, 75, 0], [9, 0, 0, 36, 43, 56, 0, 0, 87], [0, 17, 22, 0, 0, 58, 63, 78, 0]]', NULL, 27, NULL, NULL),
(9632, 24, '[[4, 13, 23, 0, 0, 0, 66, 0, 81], [6, 0, 26, 30, 0, 55, 0, 0, 90], [0, 19, 0, 35, 47, 0, 69, 71, 0]]', NULL, 28, NULL, NULL),
(9633, 24, '[[7, 0, 25, 0, 44, 0, 0, 77, 83], [0, 14, 0, 31, 0, 53, 62, 0, 88], [8, 18, 0, 37, 48, 0, 67, 0, 0]]', NULL, 29, NULL, NULL),
(9634, 24, '[[1, 0, 21, 32, 0, 52, 0, 72, 0], [0, 11, 0, 38, 0, 54, 0, 79, 82], [0, 16, 29, 0, 46, 0, 64, 0, 84]]', NULL, 30, NULL, NULL),
(9635, 24, '[[0, 0, 0, 33, 42, 54, 62, 72, 0], [7, 16, 26, 0, 0, 0, 0, 79, 82], [0, 0, 0, 34, 48, 57, 67, 0, 90]]', NULL, 31, NULL, NULL),
(9636, 24, '[[0, 11, 0, 0, 41, 51, 60, 0, 84], [9, 0, 21, 0, 45, 0, 69, 75, 0], [0, 12, 0, 32, 0, 56, 0, 77, 88]]', NULL, 32, NULL, NULL),
(9637, 24, '[[0, 14, 23, 0, 0, 0, 65, 70, 81], [5, 15, 0, 36, 43, 50, 0, 0, 0], [0, 0, 25, 0, 49, 0, 66, 71, 83]]', NULL, 33, NULL, NULL),
(9638, 24, '[[1, 0, 27, 0, 46, 52, 63, 0, 0], [2, 18, 29, 37, 0, 0, 0, 0, 80], [0, 19, 0, 39, 0, 59, 0, 78, 87]]', NULL, 34, NULL, NULL),
(9639, 24, '[[3, 0, 22, 30, 0, 58, 61, 0, 0], [0, 10, 24, 0, 40, 0, 0, 73, 89], [8, 13, 0, 35, 44, 0, 68, 0, 0]]', NULL, 35, NULL, NULL),
(9640, 24, '[[4, 0, 20, 0, 0, 53, 0, 74, 85], [6, 0, 0, 31, 0, 55, 64, 0, 86], [0, 17, 28, 38, 47, 0, 0, 76, 0]]', NULL, 36, NULL, NULL),
(9641, 24, '[[0, 15, 0, 30, 0, 50, 61, 70, 0], [3, 16, 0, 38, 0, 0, 62, 0, 81], [0, 0, 25, 0, 48, 58, 0, 73, 88]]', NULL, 37, NULL, NULL),
(9642, 24, '[[5, 0, 23, 0, 45, 53, 0, 0, 80], [0, 12, 26, 32, 49, 0, 0, 0, 87], [8, 0, 0, 34, 0, 59, 66, 77, 0]]', NULL, 38, NULL, NULL),
(9643, 24, '[[0, 11, 0, 0, 40, 51, 0, 72, 82], [7, 0, 27, 37, 41, 0, 63, 0, 0], [0, 17, 0, 0, 0, 57, 65, 75, 89]]', NULL, 39, NULL, NULL),
(9644, 24, '[[1, 10, 20, 33, 0, 52, 0, 0, 0], [9, 0, 0, 39, 44, 0, 69, 0, 83], [0, 18, 24, 0, 47, 0, 0, 78, 90]]', NULL, 40, NULL, NULL),
(9645, 24, '[[2, 0, 28, 0, 42, 0, 0, 74, 84], [0, 14, 29, 0, 0, 54, 67, 76, 0], [4, 19, 0, 31, 0, 0, 68, 0, 85]]', NULL, 41, NULL, NULL),
(9646, 24, '[[6, 0, 0, 35, 0, 55, 0, 71, 86], [0, 13, 21, 0, 43, 0, 60, 79, 0], [0, 0, 22, 36, 46, 56, 64, 0, 0]]', NULL, 42, NULL, NULL),
(9647, 24, '[[9, 11, 0, 0, 0, 50, 0, 74, 80], [0, 0, 26, 34, 0, 54, 63, 75, 0], [0, 16, 0, 35, 40, 0, 69, 0, 89]]', NULL, 43, NULL, NULL),
(9648, 24, '[[2, 0, 22, 30, 44, 0, 0, 0, 81], [6, 10, 0, 0, 0, 55, 0, 70, 85], [0, 18, 25, 39, 48, 0, 60, 0, 0]]', NULL, 44, NULL, NULL),
(9649, 24, '[[4, 0, 24, 0, 0, 56, 0, 71, 82], [0, 12, 0, 38, 41, 0, 61, 0, 88], [0, 15, 28, 0, 0, 57, 0, 73, 90]]', NULL, 45, NULL, NULL),
(9650, 24, '[[1, 0, 20, 33, 0, 51, 65, 0, 0], [8, 14, 0, 0, 45, 0, 0, 72, 86], [0, 0, 0, 37, 49, 53, 66, 78, 0]]', NULL, 46, NULL, NULL),
(9651, 24, '[[5, 0, 27, 0, 42, 58, 0, 76, 0], [7, 0, 0, 31, 43, 0, 67, 0, 83], [0, 19, 29, 0, 0, 0, 68, 79, 87]]', NULL, 47, NULL, NULL),
(9652, 24, '[[3, 0, 21, 0, 46, 52, 62, 0, 0], [0, 13, 0, 32, 47, 0, 0, 77, 84], [0, 17, 23, 36, 0, 59, 64, 0, 0]]', NULL, 48, NULL, NULL),
(9653, 24, '[[3, 0, 20, 0, 45, 0, 60, 0, 86], [6, 12, 0, 35, 0, 53, 63, 0, 0], [0, 17, 23, 0, 47, 0, 0, 77, 88]]', NULL, 49, NULL, NULL),
(9654, 24, '[[8, 0, 24, 0, 42, 0, 61, 0, 80], [0, 15, 0, 0, 46, 0, 64, 72, 81], [0, 0, 25, 31, 0, 59, 0, 75, 90]]', NULL, 50, NULL, NULL),
(9655, 24, '[[0, 10, 26, 34, 0, 51, 0, 73, 0], [1, 0, 0, 38, 0, 56, 66, 0, 82], [5, 13, 29, 0, 48, 0, 67, 0, 0]]', NULL, 51, NULL, NULL),
(9656, 24, '[[7, 11, 0, 0, 43, 52, 0, 78, 0], [0, 14, 0, 32, 0, 57, 68, 0, 85], [9, 0, 21, 33, 0, 0, 0, 79, 87]]', NULL, 52, NULL, NULL),
(9657, 24, '[[0, 0, 22, 0, 40, 50, 0, 70, 83], [2, 0, 27, 30, 0, 54, 65, 0, 0], [0, 16, 0, 36, 41, 0, 0, 76, 89]]', NULL, 53, NULL, NULL),
(9658, 24, '[[4, 0, 28, 37, 0, 55, 0, 71, 0], [0, 18, 0, 39, 44, 0, 62, 0, 84], [0, 19, 0, 0, 49, 58, 69, 74, 0]]', NULL, 54, NULL, NULL),
(9659, 24, '[[2, 0, 0, 34, 0, 55, 66, 0, 86], [0, 14, 20, 0, 48, 0, 69, 0, 87], [5, 0, 23, 0, 0, 56, 0, 79, 89]]', NULL, 55, NULL, NULL),
(9660, 24, '[[3, 12, 0, 32, 0, 0, 64, 0, 80], [0, 0, 21, 36, 40, 57, 0, 70, 0], [0, 18, 0, 0, 43, 0, 68, 74, 82]]', NULL, 56, NULL, NULL),
(9661, 24, '[[0, 10, 22, 33, 0, 51, 0, 75, 0], [7, 19, 0, 0, 42, 0, 67, 0, 88], [0, 0, 24, 38, 44, 54, 0, 77, 0]]', NULL, 57, NULL, NULL),
(9662, 24, '[[6, 15, 25, 0, 0, 53, 0, 0, 84], [0, 0, 0, 31, 45, 0, 60, 73, 85], [8, 16, 29, 39, 0, 59, 0, 0, 0]]', NULL, 58, NULL, NULL),
(9663, 24, '[[4, 0, 27, 35, 0, 50, 0, 71, 0], [9, 13, 0, 0, 41, 58, 63, 0, 0], [0, 17, 0, 0, 46, 0, 65, 78, 81]]', NULL, 59, NULL, NULL),
(9664, 24, '[[1, 0, 0, 30, 47, 0, 61, 0, 83], [0, 0, 26, 37, 0, 0, 62, 72, 90], [0, 11, 28, 0, 49, 52, 0, 76, 0]]', NULL, 60, NULL, NULL),
(9665, 24, '[[0, 11, 21, 0, 41, 51, 61, 0, 0], [4, 0, 28, 31, 0, 0, 0, 73, 80], [8, 18, 0, 0, 45, 54, 62, 0, 0]]', NULL, 61, NULL, NULL),
(9666, 24, '[[0, 13, 22, 0, 47, 0, 69, 0, 81], [1, 0, 0, 30, 48, 0, 0, 74, 82], [6, 0, 23, 36, 0, 57, 0, 0, 83]]', NULL, 62, NULL, NULL),
(9667, 24, '[[0, 10, 0, 32, 0, 50, 63, 0, 84], [7, 12, 0, 33, 49, 0, 0, 70, 0], [9, 0, 24, 0, 0, 53, 0, 79, 85]]', NULL, 63, NULL, NULL),
(9668, 24, '[[0, 0, 20, 0, 42, 55, 65, 75, 0], [3, 0, 25, 34, 0, 0, 0, 76, 86], [0, 15, 0, 38, 43, 58, 68, 0, 0]]', NULL, 64, NULL, NULL),
(9669, 24, '[[5, 0, 0, 35, 40, 0, 64, 0, 88], [0, 14, 0, 0, 0, 59, 66, 71, 90], [0, 16, 27, 39, 44, 0, 0, 72, 0]]', NULL, 65, NULL, NULL),
(9670, 24, '[[2, 17, 0, 0, 0, 52, 60, 77, 0], [0, 0, 26, 37, 46, 56, 0, 0, 87], [0, 19, 29, 0, 0, 0, 67, 78, 89]]', NULL, 66, NULL, NULL),
(9671, 24, '[[7, 13, 0, 33, 0, 0, 0, 75, 85], [0, 14, 22, 0, 48, 0, 60, 0, 89], [9, 0, 29, 0, 0, 53, 63, 79, 0]]', NULL, 67, NULL, NULL),
(9672, 24, '[[8, 16, 0, 0, 42, 0, 61, 0, 82], [0, 18, 0, 37, 47, 52, 0, 71, 0], [0, 0, 24, 39, 0, 58, 0, 74, 83]]', NULL, 68, NULL, NULL),
(9673, 24, '[[3, 0, 21, 0, 0, 51, 0, 73, 80], [0, 0, 28, 0, 40, 54, 65, 0, 86], [0, 10, 0, 36, 49, 0, 69, 76, 0]]', NULL, 69, NULL, NULL),
(9674, 24, '[[5, 0, 20, 0, 43, 0, 67, 78, 0], [6, 0, 26, 35, 0, 55, 0, 0, 81], [0, 11, 0, 38, 0, 59, 68, 0, 90]]', NULL, 70, NULL, NULL),
(9675, 24, '[[1, 12, 23, 30, 44, 0, 0, 0, 0], [0, 0, 0, 0, 46, 57, 64, 72, 87], [4, 19, 27, 34, 0, 0, 0, 0, 88]]', NULL, 71, NULL, NULL),
(9676, 24, '[[2, 0, 0, 31, 0, 50, 62, 70, 0], [0, 15, 25, 0, 41, 56, 0, 0, 84], [0, 17, 0, 32, 45, 0, 66, 77, 0]]', NULL, 72, NULL, NULL),
(9677, 24, '[[8, 12, 0, 33, 43, 0, 66, 0, 0], [9, 0, 25, 0, 47, 0, 67, 0, 82], [0, 13, 0, 38, 0, 51, 0, 76, 85]]', NULL, 73, NULL, NULL),
(9678, 24, '[[6, 0, 21, 0, 0, 0, 65, 71, 80], [0, 18, 0, 37, 0, 56, 68, 72, 0], [0, 19, 0, 0, 44, 57, 0, 78, 84]]', NULL, 74, NULL, NULL),
(9679, 24, '[[0, 0, 20, 30, 41, 55, 60, 0, 0], [3, 17, 0, 34, 0, 0, 0, 70, 83], [0, 0, 22, 0, 49, 59, 61, 0, 88]]', NULL, 75, NULL, NULL),
(9680, 24, '[[2, 11, 26, 0, 42, 0, 63, 0, 0], [0, 0, 0, 32, 45, 50, 0, 74, 89], [0, 15, 29, 35, 0, 54, 64, 0, 0]]', NULL, 76, NULL, NULL),
(9681, 24, '[[1, 10, 0, 39, 0, 0, 0, 73, 81], [0, 14, 23, 0, 40, 0, 69, 75, 0], [4, 0, 24, 0, 46, 53, 0, 0, 90]]', NULL, 77, NULL, NULL),
(9682, 24, '[[0, 16, 0, 31, 48, 52, 0, 77, 0], [5, 0, 27, 0, 0, 58, 0, 79, 86], [7, 0, 28, 36, 0, 0, 62, 0, 87]]', NULL, 78, NULL, NULL),
(9683, 24, '[[3, 12, 0, 35, 0, 55, 0, 0, 84], [0, 0, 23, 0, 48, 0, 66, 76, 88], [0, 18, 26, 0, 49, 58, 0, 0, 90]]', NULL, 79, NULL, NULL),
(9684, 24, '[[1, 0, 0, 33, 0, 57, 0, 71, 80], [9, 15, 0, 37, 42, 0, 65, 0, 0], [0, 19, 27, 0, 0, 59, 0, 79, 83]]', NULL, 80, NULL, NULL),
(9685, 24, '[[5, 0, 0, 31, 0, 50, 60, 78, 0], [0, 14, 22, 0, 40, 0, 68, 0, 86], [0, 0, 28, 39, 41, 56, 0, 0, 87]]', NULL, 81, NULL, NULL),
(9686, 24, '[[6, 13, 20, 0, 0, 0, 61, 70, 0], [0, 17, 0, 32, 0, 52, 62, 0, 89], [7, 0, 21, 34, 43, 0, 0, 73, 0]]', NULL, 82, NULL, NULL),
(9687, 24, '[[2, 0, 24, 0, 44, 0, 63, 72, 0], [4, 0, 29, 0, 45, 53, 0, 0, 82], [0, 11, 0, 36, 0, 54, 64, 75, 0]]', NULL, 83, NULL, NULL),
(9688, 24, '[[8, 10, 0, 0, 46, 51, 0, 74, 0], [0, 16, 0, 30, 47, 0, 67, 0, 81], [0, 0, 25, 38, 0, 0, 69, 77, 85]]', NULL, 84, NULL, NULL),
(9689, 24, '[[2, 0, 24, 0, 42, 0, 69, 72, 0], [9, 14, 29, 30, 0, 56, 0, 0, 0], [0, 15, 0, 39, 44, 59, 0, 0, 90]]', NULL, 85, NULL, NULL),
(9690, 24, '[[7, 10, 0, 31, 0, 0, 61, 0, 83], [0, 18, 0, 0, 45, 52, 66, 74, 0], [8, 0, 21, 0, 49, 0, 0, 76, 87]]', NULL, 86, NULL, NULL),
(9691, 24, '[[0, 12, 0, 32, 0, 0, 62, 70, 81], [4, 19, 0, 0, 47, 51, 0, 0, 86], [0, 0, 20, 34, 0, 57, 64, 71, 0]]', NULL, 87, NULL, NULL),
(9692, 24, '[[5, 0, 0, 0, 40, 0, 63, 75, 80], [0, 16, 26, 0, 0, 53, 65, 0, 84], [0, 0, 27, 37, 41, 0, 0, 78, 89]]', NULL, 88, NULL, NULL),
(9693, 24, '[[1, 0, 22, 35, 0, 54, 60, 0, 0], [6, 0, 0, 38, 0, 0, 67, 73, 88], [0, 13, 25, 0, 46, 58, 0, 79, 0]]', NULL, 89, NULL, NULL),
(9694, 24, '[[0, 11, 23, 33, 0, 50, 0, 0, 82], [3, 0, 0, 36, 43, 0, 68, 0, 85], [0, 17, 28, 0, 48, 55, 0, 77, 0]]', NULL, 90, NULL, NULL),
(9695, 24, '[[0, 0, 26, 38, 0, 55, 63, 0, 80], [3, 10, 0, 0, 42, 0, 65, 72, 0], [0, 0, 28, 39, 46, 58, 0, 0, 90]]', NULL, 91, NULL, NULL),
(9696, 24, '[[7, 0, 25, 0, 41, 0, 0, 70, 85], [0, 12, 0, 36, 49, 54, 0, 0, 88], [0, 15, 29, 0, 0, 56, 60, 74, 0]]', NULL, 92, NULL, NULL),
(9697, 24, '[[0, 14, 21, 0, 45, 50, 0, 73, 0], [2, 0, 0, 33, 0, 57, 68, 0, 89], [0, 16, 24, 0, 48, 0, 69, 77, 0]]', NULL, 93, NULL, NULL),
(9698, 24, '[[0, 17, 22, 0, 43, 0, 0, 71, 82], [1, 0, 0, 34, 44, 0, 61, 75, 0], [9, 0, 0, 37, 0, 51, 62, 0, 86]]', NULL, 94, NULL, NULL),
(9699, 24, '[[4, 0, 23, 0, 40, 52, 64, 0, 0], [6, 13, 0, 30, 0, 53, 0, 0, 81], [0, 18, 0, 35, 0, 0, 66, 76, 83]]', NULL, 95, NULL, NULL),
(9700, 24, '[[0, 11, 20, 0, 47, 0, 0, 78, 84], [5, 0, 27, 31, 0, 59, 67, 0, 0], [8, 19, 0, 32, 0, 0, 0, 79, 87]]', NULL, 96, NULL, NULL),
(9701, 24, '[[0, 13, 0, 0, 43, 0, 60, 78, 84], [6, 16, 0, 34, 0, 52, 0, 0, 85], [0, 0, 27, 0, 48, 0, 66, 79, 90]]', NULL, 97, NULL, NULL),
(9702, 24, '[[0, 15, 0, 30, 0, 57, 0, 70, 81], [5, 0, 20, 37, 46, 0, 0, 77, 0], [9, 0, 28, 0, 49, 0, 68, 0, 86]]', NULL, 98, NULL, NULL),
(9703, 24, '[[1, 0, 0, 35, 0, 50, 62, 72, 0], [8, 12, 0, 39, 0, 53, 0, 76, 0], [0, 17, 21, 0, 40, 0, 65, 0, 83]]', NULL, 99, NULL, NULL),
(9704, 24, '[[2, 10, 0, 32, 0, 54, 0, 71, 0], [0, 19, 22, 0, 0, 56, 67, 74, 0], [4, 0, 25, 0, 47, 0, 69, 0, 89]]', NULL, 100, NULL, NULL),
(9705, 24, '[[3, 0, 23, 0, 41, 51, 0, 0, 82], [0, 14, 26, 31, 42, 0, 63, 0, 0], [0, 0, 0, 33, 0, 59, 64, 75, 88]]', NULL, 101, NULL, NULL),
(9706, 24, '[[0, 11, 24, 36, 44, 0, 0, 0, 80], [7, 18, 0, 0, 45, 55, 0, 0, 87], [0, 0, 29, 38, 0, 58, 61, 73, 0]]', NULL, 102, NULL, NULL),
(9707, 24, '[[1, 0, 21, 0, 41, 50, 0, 76, 0], [9, 0, 0, 39, 0, 56, 63, 0, 83], [0, 13, 28, 0, 42, 0, 67, 0, 84]]', NULL, 103, NULL, NULL),
(9708, 24, '[[5, 0, 26, 31, 45, 0, 62, 0, 0], [7, 10, 0, 0, 48, 0, 0, 79, 80], [0, 19, 0, 38, 0, 57, 65, 0, 85]]', NULL, 104, NULL, NULL),
(9709, 24, '[[4, 0, 0, 30, 0, 55, 61, 0, 81], [0, 14, 23, 0, 0, 0, 66, 70, 86], [0, 0, 29, 0, 44, 58, 0, 74, 89]]', NULL, 105, NULL, NULL),
(9710, 24, '[[0, 17, 20, 32, 0, 0, 64, 0, 82], [8, 18, 0, 0, 47, 0, 69, 71, 0], [0, 0, 25, 35, 0, 53, 0, 72, 87]]', NULL, 106, NULL, NULL),
(9711, 24, '[[3, 0, 27, 36, 43, 0, 0, 73, 0], [0, 12, 0, 37, 0, 54, 0, 78, 90], [6, 16, 0, 0, 46, 59, 68, 0, 0]]', NULL, 107, NULL, NULL),
(9712, 24, '[[2, 11, 0, 33, 0, 51, 0, 75, 0], [0, 0, 22, 0, 40, 52, 0, 77, 88], [0, 15, 24, 34, 49, 0, 60, 0, 0]]', NULL, 108, NULL, NULL),
(9713, 24, '[[5, 11, 27, 0, 0, 51, 0, 74, 0], [0, 0, 29, 0, 0, 57, 61, 77, 80], [0, 12, 0, 35, 41, 0, 68, 0, 89]]', NULL, 109, NULL, NULL),
(9714, 24, '[[4, 0, 0, 33, 44, 0, 62, 70, 0], [0, 17, 0, 0, 46, 50, 65, 0, 81], [0, 0, 23, 37, 0, 59, 0, 75, 85]]', NULL, 110, NULL, NULL),
(9715, 24, '[[3, 13, 0, 34, 48, 0, 0, 72, 0], [0, 18, 22, 0, 0, 52, 69, 0, 88], [0, 0, 0, 38, 49, 54, 0, 78, 90]]', NULL, 111, NULL, NULL),
(9716, 24, '[[1, 0, 21, 0, 45, 53, 0, 0, 83], [6, 15, 0, 32, 0, 0, 66, 0, 86], [0, 16, 28, 39, 0, 58, 0, 73, 0]]', NULL, 112, NULL, NULL),
(9717, 24, '[[0, 14, 0, 30, 43, 0, 0, 76, 84], [7, 0, 25, 0, 47, 56, 60, 0, 0], [8, 0, 26, 36, 0, 0, 64, 0, 87]]', NULL, 113, NULL, NULL),
(9718, 24, '[[2, 10, 20, 0, 40, 0, 0, 71, 0], [0, 0, 24, 31, 0, 55, 63, 0, 82], [9, 19, 0, 0, 42, 0, 67, 79, 0]]', NULL, 114, NULL, NULL),
(9719, 24, '[[4, 0, 21, 0, 0, 54, 64, 0, 81], [0, 15, 29, 0, 0, 55, 0, 76, 85], [0, 0, 0, 33, 43, 0, 65, 79, 88]]', NULL, 115, NULL, NULL),
(9720, 24, '[[7, 11, 20, 0, 42, 0, 63, 0, 0], [0, 0, 23, 36, 0, 57, 0, 71, 80], [0, 12, 0, 37, 44, 58, 0, 74, 0]]', NULL, 116, NULL, NULL),
(9721, 24, '[[0, 0, 25, 34, 46, 0, 60, 73, 0], [3, 16, 0, 0, 0, 51, 0, 77, 90], [5, 0, 26, 39, 49, 0, 61, 0, 0]]', NULL, 117, NULL, NULL),
(9722, 24, '[[0, 10, 24, 31, 0, 52, 66, 0, 0], [9, 0, 27, 0, 47, 0, 0, 78, 87], [0, 18, 0, 35, 0, 56, 67, 0, 89]]', NULL, 118, NULL, NULL),
(9723, 24, '[[0, 14, 0, 0, 40, 0, 62, 75, 83], [1, 0, 28, 0, 41, 50, 68, 0, 0], [8, 19, 0, 32, 0, 59, 0, 0, 84]]', NULL, 119, NULL, NULL),
(9724, 24, '[[0, 13, 0, 0, 45, 0, 69, 70, 82], [2, 0, 22, 30, 0, 53, 0, 0, 86], [6, 17, 0, 38, 48, 0, 0, 72, 0]]', NULL, 120, NULL, NULL),
(9725, 24, '[[1, 0, 0, 39, 48, 58, 0, 0, 81], [0, 13, 20, 0, 0, 59, 60, 0, 90], [3, 0, 28, 0, 49, 0, 65, 74, 0]]', NULL, 121, NULL, NULL),
(9726, 24, '[[0, 16, 0, 37, 0, 57, 0, 70, 87], [5, 18, 0, 0, 44, 0, 61, 0, 88], [8, 0, 27, 38, 0, 0, 63, 0, 89]]', NULL, 122, NULL, NULL),
(9727, 24, '[[6, 0, 0, 33, 0, 52, 0, 71, 84], [0, 15, 21, 0, 41, 53, 64, 0, 0], [0, 0, 24, 35, 46, 0, 67, 73, 0]]', NULL, 123, NULL, NULL),
(9728, 24, '[[9, 0, 25, 0, 45, 0, 62, 75, 0], [0, 12, 26, 30, 0, 54, 0, 77, 0], [0, 19, 0, 36, 47, 56, 0, 0, 85]]', NULL, 124, NULL, NULL),
(9729, 24, '[[7, 11, 0, 0, 40, 0, 66, 0, 82], [0, 0, 22, 31, 0, 51, 0, 72, 83], [0, 14, 0, 34, 42, 0, 68, 79, 0]]', NULL, 125, NULL, NULL),
(9730, 24, '[[2, 10, 23, 0, 43, 0, 0, 76, 0], [0, 0, 29, 0, 0, 50, 69, 78, 80], [4, 17, 0, 32, 0, 55, 0, 0, 86]]', NULL, 126, NULL, NULL),
(9731, 24, '[[6, 0, 26, 33, 0, 55, 60, 0, 0], [9, 12, 0, 0, 41, 0, 0, 76, 81], [0, 17, 0, 38, 44, 0, 65, 0, 82]]', NULL, 127, NULL, NULL),
(9732, 24, '[[3, 0, 0, 31, 0, 0, 64, 72, 80], [8, 0, 23, 35, 0, 0, 69, 0, 84], [0, 13, 0, 0, 49, 56, 0, 73, 86]]', NULL, 128, NULL, NULL),
(9733, 24, '[[2, 0, 21, 0, 46, 0, 63, 79, 0], [0, 14, 27, 34, 48, 50, 0, 0, 0], [0, 16, 0, 39, 0, 51, 67, 0, 85]]', NULL, 129, NULL, NULL),
(9734, 24, '[[4, 10, 0, 36, 0, 53, 0, 70, 0], [0, 0, 25, 37, 45, 0, 62, 0, 83], [0, 15, 29, 0, 0, 59, 68, 74, 0]]', NULL, 130, NULL, NULL),
(9735, 24, '[[5, 0, 20, 0, 0, 57, 66, 0, 89], [0, 18, 22, 0, 40, 0, 0, 77, 90], [7, 0, 0, 32, 43, 58, 0, 78, 0]]', NULL, 131, NULL, NULL),
(9736, 24, '[[1, 11, 0, 30, 42, 0, 0, 71, 0], [0, 19, 24, 0, 0, 52, 61, 0, 87], [0, 0, 28, 0, 47, 54, 0, 75, 88]]', NULL, 132, NULL, NULL),
(9737, 24, '[[5, 0, 0, 31, 41, 0, 63, 0, 80], [0, 18, 0, 0, 0, 52, 66, 79, 82], [8, 0, 27, 0, 46, 0, 67, 0, 90]]', NULL, 133, NULL, NULL),
(9738, 24, '[[0, 14, 23, 30, 0, 0, 0, 73, 84], [4, 0, 0, 38, 40, 58, 61, 0, 0], [6, 19, 24, 0, 0, 0, 0, 78, 87]]', NULL, 134, NULL, NULL),
(9739, 24, '[[0, 11, 21, 0, 44, 54, 60, 0, 0], [2, 0, 29, 37, 0, 0, 0, 74, 88], [0, 16, 0, 0, 49, 59, 62, 77, 0]]', NULL, 135, NULL, NULL),
(9740, 24, '[[7, 0, 0, 34, 43, 50, 0, 70, 0], [0, 0, 0, 39, 0, 53, 65, 76, 86], [0, 17, 20, 0, 45, 0, 69, 0, 89]]', NULL, 136, NULL, NULL),
(9741, 24, '[[0, 10, 22, 33, 0, 51, 0, 75, 0], [1, 0, 26, 0, 42, 57, 0, 0, 83], [9, 13, 0, 36, 48, 0, 68, 0, 0]]', NULL, 137, NULL, NULL),
(9742, 24, '[[3, 12, 0, 32, 0, 55, 0, 0, 81], [0, 0, 25, 0, 47, 0, 64, 71, 85], [0, 15, 28, 35, 0, 56, 0, 72, 0]]', NULL, 138, NULL, NULL),
(9743, 24, '[[2, 0, 0, 36, 0, 51, 69, 75, 0], [7, 0, 25, 0, 46, 56, 0, 0, 84], [0, 10, 27, 0, 47, 0, 0, 79, 90]]', NULL, 139, NULL, NULL),
(9744, 24, '[[1, 11, 23, 0, 0, 0, 64, 70, 0], [0, 17, 0, 37, 0, 50, 0, 73, 81], [0, 0, 29, 0, 44, 55, 65, 0, 88]]', NULL, 140, NULL, NULL),
(9745, 24, '[[4, 0, 20, 0, 42, 0, 60, 0, 83], [8, 0, 0, 31, 0, 52, 62, 76, 0], [0, 18, 0, 38, 0, 57, 0, 78, 85]]', NULL, 141, NULL, NULL),
(9746, 24, '[[0, 12, 22, 32, 0, 0, 63, 0, 87], [3, 0, 0, 0, 40, 54, 0, 77, 89], [0, 14, 28, 35, 41, 0, 68, 0, 0]]', NULL, 142, NULL, NULL),
(9747, 24, '[[0, 16, 21, 0, 43, 53, 0, 0, 80], [6, 0, 26, 30, 0, 0, 67, 71, 0], [0, 19, 0, 34, 45, 59, 0, 0, 86]]', NULL, 143, NULL, NULL),
(9748, 24, '[[5, 13, 0, 33, 48, 0, 61, 0, 0], [0, 0, 24, 0, 49, 58, 0, 72, 82], [9, 15, 0, 39, 0, 0, 66, 74, 0]]', NULL, 144, NULL, NULL),
(9749, 24, '[[3, 16, 0, 0, 46, 57, 0, 75, 0], [0, 17, 21, 0, 47, 0, 68, 77, 0], [0, 0, 24, 33, 0, 58, 0, 78, 87]]', NULL, 145, NULL, NULL),
(9750, 24, '[[4, 0, 20, 0, 0, 53, 69, 0, 83], [0, 14, 0, 37, 0, 56, 0, 70, 86], [9, 0, 28, 0, 48, 0, 0, 71, 90]]', NULL, 146, NULL, NULL),
(9751, 24, '[[6, 0, 29, 36, 0, 54, 61, 0, 0], [0, 10, 0, 38, 40, 55, 0, 0, 81], [0, 13, 0, 0, 45, 0, 64, 73, 85]]', NULL, 147, NULL, NULL),
(9752, 24, '[[5, 0, 22, 0, 0, 0, 62, 74, 82], [7, 0, 27, 31, 41, 59, 0, 0, 0], [0, 19, 0, 34, 0, 0, 63, 76, 88]]', NULL, 148, NULL, NULL),
(9753, 24, '[[1, 15, 0, 35, 0, 50, 60, 0, 0], [0, 0, 25, 39, 43, 0, 67, 0, 84], [2, 18, 26, 0, 44, 0, 0, 79, 0]]', NULL, 149, NULL, NULL),
(9754, 24, '[[0, 11, 0, 30, 42, 51, 65, 0, 0], [8, 0, 23, 32, 0, 0, 0, 72, 80], [0, 12, 0, 0, 49, 52, 66, 0, 89]]', NULL, 150, NULL, NULL),
(9755, 24, '[[5, 10, 0, 0, 0, 55, 60, 0, 81], [0, 13, 27, 0, 43, 56, 0, 0, 82], [0, 0, 29, 33, 0, 0, 61, 77, 86]]', NULL, 151, NULL, NULL),
(9756, 24, '[[3, 0, 0, 0, 46, 51, 0, 71, 84], [0, 18, 0, 34, 0, 0, 67, 79, 88], [0, 0, 23, 39, 0, 53, 68, 0, 89]]', NULL, 152, NULL, NULL),
(9757, 24, '[[1, 0, 26, 0, 0, 50, 62, 0, 87], [8, 11, 0, 38, 41, 0, 0, 75, 0], [0, 17, 28, 0, 42, 58, 0, 76, 0]]', NULL, 153, NULL, NULL),
(9758, 24, '[[0, 15, 21, 0, 47, 0, 64, 0, 80], [4, 0, 25, 32, 49, 0, 0, 72, 0], [6, 0, 0, 37, 0, 59, 0, 73, 83]]', NULL, 154, NULL, NULL),
(9759, 24, '[[2, 0, 20, 0, 44, 0, 63, 70, 0], [0, 12, 0, 31, 0, 52, 0, 74, 90], [7, 16, 0, 35, 45, 0, 69, 0, 0]]', NULL, 155, NULL, NULL),
(9760, 24, '[[0, 14, 22, 0, 40, 54, 65, 0, 0], [9, 19, 0, 30, 0, 0, 66, 0, 85], [0, 0, 24, 36, 48, 57, 0, 78, 0]]', NULL, 156, NULL, NULL),
(9761, 24, '[[4, 14, 0, 39, 48, 0, 0, 0, 80], [0, 19, 20, 0, 0, 54, 0, 70, 87], [0, 0, 23, 0, 0, 57, 66, 79, 88]]', NULL, 157, NULL, NULL),
(9762, 24, '[[0, 15, 27, 0, 0, 50, 0, 74, 82], [3, 0, 0, 37, 45, 51, 68, 0, 0], [8, 0, 28, 0, 49, 0, 69, 78, 0]]', NULL, 158, NULL, NULL),
(9763, 24, '[[0, 10, 0, 30, 41, 0, 63, 0, 83], [1, 0, 26, 0, 46, 55, 67, 0, 0], [0, 12, 0, 35, 0, 59, 0, 75, 84]]', NULL, 159, NULL, NULL),
(9764, 24, '[[7, 11, 0, 33, 0, 52, 61, 0, 0], [0, 18, 25, 0, 40, 0, 0, 71, 90], [0, 0, 29, 38, 42, 0, 65, 77, 0]]', NULL, 160, NULL, NULL),
(9765, 24, '[[0, 13, 0, 34, 43, 0, 0, 72, 85], [6, 0, 24, 0, 47, 56, 62, 0, 0], [9, 0, 0, 36, 0, 58, 0, 73, 89]]', NULL, 161, NULL, NULL),
(9766, 24, '[[0, 16, 0, 31, 44, 53, 0, 0, 81], [2, 17, 21, 0, 0, 0, 60, 0, 86], [5, 0, 22, 32, 0, 0, 64, 76, 0]]', NULL, 162, NULL, NULL),
(9767, 24, '[[5, 0, 24, 0, 0, 0, 61, 70, 80], [0, 17, 25, 0, 0, 54, 63, 0, 84], [0, 0, 0, 31, 45, 57, 0, 73, 90]]', NULL, 163, NULL, NULL),
(9768, 24, '[[1, 10, 0, 0, 0, 50, 0, 74, 85], [6, 0, 22, 0, 48, 0, 60, 0, 87], [0, 14, 0, 39, 0, 56, 66, 77, 0]]', NULL, 164, NULL, NULL),
(9769, 24, '[[4, 13, 0, 34, 0, 0, 62, 72, 0], [0, 0, 28, 37, 40, 58, 0, 0, 89], [0, 18, 29, 0, 44, 0, 64, 76, 0]]', NULL, 165, NULL, NULL),
(9770, 24, '[[0, 12, 20, 36, 43, 0, 0, 75, 0], [7, 0, 0, 38, 0, 55, 0, 78, 81], [0, 16, 27, 0, 49, 0, 69, 0, 86]]', NULL, 166, NULL, NULL),
(9771, 24, '[[2, 0, 0, 32, 41, 52, 67, 0, 0], [0, 11, 0, 35, 0, 59, 0, 71, 82], [3, 0, 26, 0, 47, 0, 68, 0, 88]]', NULL, 167, NULL, NULL),
(9772, 24, '[[0, 15, 0, 30, 42, 0, 65, 79, 0], [8, 19, 21, 33, 0, 51, 0, 0, 0], [9, 0, 23, 0, 46, 53, 0, 0, 83]]', NULL, 168, NULL, NULL),
(9773, 24, '[[4, 0, 0, 0, 41, 54, 63, 0, 84], [0, 13, 22, 32, 0, 0, 65, 72, 0], [5, 0, 0, 37, 48, 56, 0, 0, 86]]', NULL, 169, NULL, NULL),
(9774, 24, '[[9, 0, 0, 30, 0, 51, 0, 70, 87], [0, 18, 0, 0, 0, 59, 61, 76, 88], [0, 0, 29, 0, 49, 0, 62, 79, 90]]', NULL, 170, NULL, NULL),
(9775, 24, '[[0, 12, 0, 39, 43, 0, 68, 78, 0], [3, 0, 21, 0, 0, 57, 69, 0, 82], [7, 14, 26, 0, 44, 0, 0, 0, 83]]', NULL, 171, NULL, NULL),
(9776, 24, '[[0, 15, 23, 31, 40, 0, 60, 0, 0], [1, 0, 0, 0, 0, 52, 64, 73, 85], [0, 17, 24, 38, 45, 55, 0, 0, 0]]', NULL, 172, NULL, NULL),
(9777, 24, '[[0, 10, 27, 0, 46, 0, 66, 75, 0], [6, 0, 0, 33, 0, 50, 0, 77, 80], [8, 11, 28, 34, 0, 53, 0, 0, 0]]', NULL, 173, NULL, NULL),
(9778, 24, '[[2, 0, 20, 0, 42, 0, 67, 0, 81], [0, 16, 25, 35, 0, 58, 0, 71, 0], [0, 19, 0, 36, 47, 0, 0, 74, 89]]', NULL, 174, NULL, NULL),
(9779, 24, '[[3, 15, 0, 0, 0, 53, 63, 0, 83], [0, 17, 0, 35, 0, 0, 66, 77, 85], [7, 19, 29, 0, 44, 57, 0, 0, 0]]', NULL, 175, NULL, NULL),
(9780, 24, '[[6, 0, 0, 32, 0, 51, 0, 72, 81], [0, 14, 20, 0, 0, 52, 65, 76, 0], [0, 0, 22, 36, 40, 0, 67, 0, 90]]', NULL, 176, NULL, NULL),
(9781, 24, '[[0, 10, 21, 0, 46, 55, 0, 73, 0], [9, 18, 0, 30, 0, 0, 68, 0, 86], [0, 0, 26, 0, 48, 58, 69, 74, 0]]', NULL, 177, NULL, NULL),
(9782, 24, '[[4, 11, 0, 37, 0, 50, 0, 75, 0], [0, 16, 27, 0, 41, 0, 62, 0, 87], [0, 0, 28, 38, 47, 54, 0, 0, 89]]', NULL, 178, NULL, NULL),
(9783, 24, '[[0, 13, 23, 33, 0, 59, 0, 0, 84], [2, 0, 0, 0, 42, 0, 60, 71, 88], [5, 0, 24, 34, 49, 0, 0, 78, 0]]', NULL, 179, NULL, NULL),
(9784, 24, '[[0, 12, 25, 31, 0, 0, 0, 70, 80], [1, 0, 0, 39, 43, 0, 61, 79, 0], [8, 0, 0, 0, 45, 56, 64, 0, 82]]', NULL, 180, NULL, NULL),
(9785, 24, '[[5, 13, 20, 0, 44, 51, 0, 0, 0], [0, 0, 26, 33, 0, 54, 61, 0, 90], [7, 16, 0, 34, 0, 0, 68, 79, 0]]', NULL, 181, NULL, NULL),
(9786, 24, '[[0, 0, 0, 35, 0, 52, 66, 72, 86], [6, 15, 22, 0, 45, 0, 0, 0, 88], [0, 0, 24, 39, 0, 53, 67, 75, 0]]', NULL, 182, NULL, NULL),
(9787, 24, '[[0, 18, 23, 0, 43, 0, 62, 0, 83], [1, 19, 0, 37, 49, 55, 0, 0, 0], [0, 0, 28, 0, 0, 56, 64, 73, 85]]', NULL, 183, NULL, NULL),
(9788, 24, '[[2, 12, 0, 0, 42, 0, 0, 76, 81], [0, 14, 0, 32, 48, 0, 60, 0, 89], [9, 0, 25, 38, 0, 58, 0, 77, 0]]', NULL, 184, NULL, NULL),
(9789, 24, '[[0, 0, 0, 0, 40, 50, 63, 70, 80], [4, 0, 27, 30, 0, 0, 65, 0, 87], [8, 10, 0, 0, 47, 59, 0, 71, 0]]', NULL, 185, NULL, NULL),
(9790, 24, '[[3, 11, 21, 0, 41, 0, 0, 0, 82], [0, 0, 29, 31, 46, 0, 69, 74, 0], [0, 17, 0, 36, 0, 57, 0, 78, 84]]', NULL, 186, NULL, NULL),
(9791, 24, '[[2, 0, 22, 0, 40, 0, 0, 73, 86], [5, 10, 26, 0, 0, 52, 0, 76, 0], [0, 16, 0, 38, 0, 53, 61, 0, 89]]', NULL, 187, NULL, NULL),
(9792, 24, '[[0, 13, 23, 30, 41, 0, 0, 0, 83], [9, 0, 0, 0, 43, 54, 69, 71, 0], [0, 18, 25, 31, 0, 59, 0, 0, 87]]', NULL, 188, NULL, NULL),
(9793, 24, '[[1, 0, 27, 33, 0, 51, 64, 0, 0], [4, 0, 28, 0, 42, 0, 65, 0, 80], [0, 19, 0, 37, 45, 0, 68, 70, 0]]', NULL, 189, NULL, NULL),
(9794, 24, '[[3, 0, 0, 0, 44, 56, 60, 72, 0], [0, 12, 0, 0, 46, 0, 62, 77, 81], [0, 0, 21, 36, 0, 57, 0, 79, 90]]', NULL, 190, NULL, NULL),
(9795, 24, '[[8, 0, 24, 0, 48, 0, 66, 75, 0], [0, 11, 0, 35, 49, 0, 0, 78, 85], [0, 14, 0, 39, 0, 50, 67, 0, 88]]', NULL, 191, NULL, NULL),
(9796, 24, '[[6, 15, 20, 0, 47, 0, 0, 0, 82], [7, 0, 0, 32, 0, 55, 63, 74, 0], [0, 17, 29, 34, 0, 58, 0, 0, 84]]', NULL, 192, NULL, NULL),
(9797, 24, '[[0, 13, 22, 0, 41, 0, 0, 76, 85], [3, 0, 0, 34, 45, 56, 64, 0, 0], [6, 0, 28, 39, 0, 0, 66, 78, 0]]', NULL, 193, NULL, NULL),
(9798, 24, '[[0, 15, 21, 33, 0, 51, 0, 0, 86], [7, 18, 0, 0, 44, 0, 61, 74, 0], [0, 0, 29, 36, 49, 55, 0, 0, 90]]', NULL, 194, NULL, NULL),
(9799, 24, '[[4, 0, 27, 0, 0, 0, 67, 70, 81], [0, 11, 0, 38, 42, 0, 68, 0, 88], [0, 14, 0, 0, 47, 50, 0, 77, 89]]', NULL, 195, NULL, NULL),
(9800, 24, '[[1, 16, 0, 30, 0, 52, 0, 0, 84], [0, 0, 25, 32, 40, 59, 63, 0, 0], [0, 0, 26, 0, 43, 0, 65, 71, 87]]', NULL, 196, NULL, NULL),
(9801, 24, '[[5, 12, 23, 0, 0, 54, 0, 75, 0], [0, 0, 0, 37, 46, 0, 69, 79, 80], [8, 19, 24, 0, 0, 58, 0, 0, 83]]', NULL, 197, NULL, NULL),
(9802, 24, '[[0, 10, 0, 0, 48, 0, 60, 72, 82], [2, 17, 0, 31, 0, 53, 0, 73, 0], [9, 0, 20, 35, 0, 57, 62, 0, 0]]', NULL, 198, NULL, NULL),
(9803, 24, '[[0, 14, 23, 0, 0, 0, 63, 70, 82], [1, 0, 27, 30, 0, 57, 0, 76, 0], [0, 19, 0, 34, 46, 0, 67, 0, 90]]', NULL, 199, NULL, NULL),
(9804, 24, '[[4, 0, 26, 35, 0, 54, 0, 0, 85], [0, 16, 0, 37, 0, 55, 62, 77, 0], [9, 18, 0, 0, 48, 0, 64, 0, 87]]', NULL, 200, NULL, NULL),
(9805, 24, '[[0, 10, 24, 32, 0, 0, 0, 78, 86], [5, 0, 29, 0, 41, 0, 65, 0, 89], [7, 0, 0, 39, 47, 53, 0, 79, 0]]', NULL, 201, NULL, NULL),
(9806, 24, '[[0, 13, 20, 0, 40, 0, 0, 71, 80], [3, 0, 21, 0, 49, 58, 0, 75, 0], [0, 15, 0, 31, 0, 59, 69, 0, 84]]', NULL, 202, NULL, NULL),
(9807, 24, '[[2, 0, 0, 38, 43, 0, 61, 0, 88], [6, 0, 22, 0, 0, 50, 68, 73, 0], [0, 11, 28, 0, 45, 52, 0, 74, 0]]', NULL, 203, NULL, NULL),
(9808, 24, '[[0, 12, 0, 33, 0, 51, 60, 0, 81], [8, 17, 0, 36, 42, 56, 0, 0, 0], [0, 0, 25, 0, 44, 0, 66, 72, 83]]', NULL, 204, NULL, NULL),
(9809, 24, '[[5, 13, 0, 0, 40, 51, 0, 77, 0], [0, 0, 20, 0, 0, 59, 60, 79, 80], [0, 0, 25, 38, 44, 0, 68, 0, 81]]', NULL, 205, NULL, NULL),
(9810, 24, '[[6, 16, 0, 32, 0, 52, 0, 0, 82], [0, 0, 23, 39, 46, 0, 63, 0, 88], [0, 0, 29, 0, 49, 53, 66, 71, 0]]', NULL, 206, NULL, NULL),
(9811, 24, '[[0, 12, 0, 33, 42, 0, 61, 0, 84], [2, 0, 24, 34, 0, 56, 0, 70, 0], [8, 15, 28, 0, 0, 57, 0, 78, 0]]', NULL, 207, NULL, NULL),
(9812, 24, '[[0, 10, 21, 31, 0, 0, 0, 74, 86], [9, 0, 26, 0, 48, 0, 67, 76, 0], [0, 19, 0, 35, 0, 54, 69, 0, 87]]', NULL, 208, NULL, NULL),
(9813, 24, '[[0, 11, 0, 0, 41, 50, 0, 72, 85], [1, 18, 0, 30, 0, 55, 64, 0, 0], [3, 0, 22, 37, 43, 0, 0, 0, 90]]', NULL, 209, NULL, NULL),
(9814, 24, '[[4, 14, 0, 0, 45, 0, 62, 0, 83], [7, 0, 27, 0, 47, 0, 0, 73, 89], [0, 17, 0, 36, 0, 58, 65, 75, 0]]', NULL, 210, NULL, NULL),
(9815, 24, '[[3, 0, 21, 0, 45, 0, 63, 0, 85], [5, 17, 0, 38, 0, 52, 0, 72, 0], [0, 0, 22, 39, 0, 57, 0, 78, 90]]', NULL, 211, NULL, NULL),
(9816, 24, '[[6, 0, 24, 0, 0, 59, 0, 71, 83], [0, 15, 27, 0, 44, 0, 60, 77, 0], [0, 19, 0, 37, 47, 0, 67, 0, 84]]', NULL, 212, NULL, NULL),
(9817, 24, '[[0, 13, 0, 30, 43, 50, 0, 0, 82], [4, 0, 29, 0, 0, 0, 61, 79, 89], [0, 14, 0, 32, 46, 54, 62, 0, 0]]', NULL, 213, NULL, NULL),
(9818, 24, '[[0, 0, 23, 34, 40, 53, 65, 0, 0], [1, 10, 0, 0, 0, 55, 0, 74, 80], [0, 0, 26, 36, 41, 0, 68, 0, 87]]', NULL, 214, NULL, NULL),
(9819, 24, '[[7, 11, 0, 0, 42, 0, 66, 0, 86], [0, 16, 0, 33, 49, 56, 0, 70, 0], [9, 0, 28, 0, 0, 0, 69, 73, 88]]', NULL, 215, NULL, NULL),
(9820, 24, '[[2, 12, 20, 31, 0, 51, 0, 0, 0], [0, 18, 0, 35, 0, 0, 64, 75, 81], [8, 0, 25, 0, 48, 58, 0, 76, 0]]', NULL, 216, NULL, NULL),
(9821, 24, '[[0, 15, 27, 34, 44, 0, 60, 0, 0], [2, 0, 0, 38, 0, 53, 0, 72, 80], [6, 0, 29, 0, 46, 0, 64, 0, 88]]', NULL, 217, NULL, NULL),
(9822, 24, '[[3, 0, 23, 0, 0, 51, 0, 70, 84], [7, 11, 0, 32, 0, 55, 0, 0, 86], [0, 16, 0, 0, 42, 0, 61, 71, 87]]', NULL, 218, NULL, NULL),
(9823, 24, '[[8, 0, 0, 30, 40, 0, 65, 0, 81], [0, 14, 21, 0, 0, 52, 67, 77, 0], [0, 0, 26, 33, 45, 0, 0, 79, 90]]', NULL, 219, NULL, NULL),
(9824, 24, '[[9, 0, 0, 35, 43, 56, 0, 0, 83], [0, 12, 0, 37, 0, 0, 62, 75, 89], [0, 17, 24, 0, 47, 57, 69, 0, 0]]', NULL, 220, NULL, NULL),
(9825, 24, '[[1, 10, 20, 0, 0, 50, 63, 0, 0], [5, 0, 0, 36, 48, 0, 0, 73, 82], [0, 19, 28, 0, 0, 59, 68, 74, 0]]', NULL, 221, NULL, NULL),
(9826, 24, '[[4, 13, 0, 31, 41, 0, 0, 76, 0], [0, 0, 22, 0, 0, 54, 66, 78, 85], [0, 18, 25, 39, 49, 58, 0, 0, 0]]', NULL, 222, NULL, NULL),
(9827, 24, '[[8, 0, 23, 0, 40, 0, 0, 71, 82], [0, 16, 25, 0, 0, 51, 0, 73, 86], [9, 18, 0, 37, 0, 0, 60, 0, 89]]', NULL, 223, NULL, NULL),
(9828, 24, '[[3, 0, 22, 0, 42, 0, 64, 70, 0], [0, 10, 28, 30, 43, 54, 0, 0, 0], [0, 0, 0, 33, 0, 55, 68, 75, 84]]', NULL, 224, NULL, NULL),
(9829, 24, '[[1, 13, 0, 31, 44, 53, 0, 0, 0], [0, 17, 24, 38, 0, 58, 61, 0, 0], [0, 0, 29, 0, 49, 0, 65, 72, 80]]', NULL, 225, NULL, NULL),
(9830, 24, '[[0, 11, 0, 0, 47, 50, 66, 77, 0], [5, 0, 20, 0, 0, 56, 0, 79, 81], [0, 15, 0, 32, 48, 0, 69, 0, 83]]', NULL, 226, NULL, NULL),
(9831, 24, '[[4, 0, 26, 0, 41, 52, 0, 0, 88], [0, 12, 0, 35, 0, 59, 62, 0, 90], [7, 0, 27, 36, 0, 0, 63, 76, 0]]', NULL, 227, NULL, NULL),
(9832, 24, '[[2, 14, 0, 34, 0, 0, 0, 74, 85], [6, 0, 21, 39, 45, 0, 67, 0, 0], [0, 19, 0, 0, 46, 57, 0, 78, 87]]', NULL, 228, NULL, NULL),
(9833, 24, '[[2, 0, 25, 0, 42, 0, 61, 71, 0], [0, 10, 26, 31, 0, 0, 68, 0, 83], [0, 0, 0, 38, 45, 50, 0, 73, 86]]', NULL, 229, NULL, NULL),
(9834, 24, '[[3, 14, 0, 35, 0, 0, 65, 0, 87], [0, 17, 0, 36, 48, 0, 0, 74, 90], [8, 0, 28, 0, 49, 58, 66, 0, 0]]', NULL, 230, NULL, NULL),
(9835, 24, '[[0, 12, 20, 0, 46, 0, 0, 77, 80], [5, 0, 23, 32, 47, 0, 0, 0, 84], [6, 0, 0, 34, 0, 52, 63, 79, 0]]', NULL, 231, NULL, NULL),
(9836, 24, '[[0, 13, 22, 33, 43, 0, 0, 0, 82], [1, 0, 0, 39, 0, 55, 64, 70, 0], [0, 18, 24, 0, 44, 56, 0, 0, 88]]', NULL, 232, NULL, NULL),
(9837, 24, '[[7, 16, 0, 0, 0, 51, 60, 0, 81], [0, 0, 21, 30, 41, 54, 0, 76, 0], [0, 19, 0, 0, 0, 59, 62, 78, 85]]', NULL, 233, NULL, NULL),
(9838, 24, '[[4, 0, 27, 0, 0, 53, 67, 72, 0], [9, 11, 29, 0, 40, 0, 0, 75, 0], [0, 15, 0, 37, 0, 57, 69, 0, 89]]', NULL, 234, NULL, NULL),
(9839, 24, '[[5, 0, 27, 0, 43, 0, 62, 0, 80], [0, 13, 0, 38, 45, 0, 0, 70, 81], [0, 18, 0, 0, 46, 57, 66, 0, 84]]', NULL, 235, NULL, NULL),
(9840, 24, '[[0, 11, 0, 30, 0, 58, 60, 71, 0], [4, 0, 24, 0, 40, 0, 0, 72, 87], [0, 19, 29, 33, 0, 59, 68, 0, 0]]', NULL, 236, NULL, NULL),
(9841, 24, '[[2, 0, 20, 0, 44, 0, 67, 73, 0], [0, 15, 0, 31, 48, 54, 0, 0, 85], [3, 0, 22, 0, 0, 0, 69, 78, 86]]', NULL, 237, NULL, NULL),
(9842, 24, '[[9, 0, 26, 0, 47, 50, 0, 75, 0], [0, 10, 28, 35, 0, 0, 0, 79, 89], [0, 12, 0, 39, 0, 55, 63, 0, 90]]', NULL, 238, NULL, NULL),
(9843, 24, '[[7, 0, 25, 32, 0, 52, 0, 74, 0], [8, 0, 0, 36, 41, 0, 64, 77, 0], [0, 17, 0, 0, 49, 56, 65, 0, 82]]', NULL, 239, NULL, NULL),
(9844, 24, '[[1, 0, 21, 34, 0, 0, 61, 0, 83], [6, 14, 23, 0, 42, 51, 0, 0, 0], [0, 16, 0, 37, 0, 53, 0, 76, 88]]', NULL, 240, NULL, NULL),
(9845, 24, '[[0, 13, 23, 0, 43, 50, 0, 73, 0], [3, 14, 0, 0, 45, 0, 0, 79, 81], [0, 0, 28, 31, 0, 57, 62, 0, 83]]', NULL, 241, NULL, NULL),
(9846, 24, '[[4, 12, 0, 32, 0, 0, 68, 0, 80], [0, 19, 20, 38, 0, 0, 69, 75, 0], [0, 0, 21, 0, 49, 53, 0, 78, 85]]', NULL, 242, NULL, NULL),
(9847, 24, '[[0, 17, 29, 30, 0, 54, 0, 0, 82], [2, 0, 0, 34, 41, 55, 60, 0, 0], [6, 0, 0, 0, 48, 0, 65, 72, 86]]', NULL, 243, NULL, NULL),
(9848, 24, '[[9, 10, 0, 36, 40, 0, 61, 0, 0], [0, 0, 25, 39, 0, 58, 66, 71, 0], [0, 0, 27, 0, 44, 59, 0, 74, 87]]', NULL, 244, NULL, NULL),
(9849, 24, '[[1, 15, 0, 33, 0, 0, 64, 0, 84], [0, 18, 0, 37, 0, 52, 67, 76, 0], [7, 0, 26, 0, 47, 0, 0, 77, 88]]', NULL, 245, NULL, NULL),
(9850, 24, '[[5, 11, 22, 0, 0, 51, 0, 0, 89], [8, 0, 0, 35, 42, 56, 0, 70, 0], [0, 16, 24, 0, 46, 0, 63, 0, 90]]', NULL, 246, NULL, NULL),
(9851, 24, '[[5, 14, 0, 32, 41, 53, 0, 0, 0], [0, 15, 0, 34, 0, 0, 62, 74, 86], [7, 0, 24, 0, 44, 55, 66, 0, 0]]', NULL, 247, NULL, NULL),
(9852, 24, '[[6, 10, 0, 0, 43, 0, 0, 70, 80], [0, 0, 21, 0, 46, 50, 68, 0, 82], [8, 18, 0, 36, 0, 0, 0, 72, 88]]', NULL, 248, NULL, NULL),
(9853, 24, '[[1, 0, 22, 31, 0, 51, 0, 73, 0], [0, 13, 0, 0, 42, 57, 63, 0, 89], [9, 0, 25, 39, 48, 0, 64, 0, 0]]', NULL, 249, NULL, NULL),
(9854, 24, '[[4, 0, 23, 0, 49, 0, 61, 76, 0], [0, 19, 0, 33, 0, 52, 0, 77, 84], [0, 0, 28, 38, 0, 59, 69, 0, 87]]', NULL, 250, NULL, NULL),
(9855, 24, '[[0, 12, 20, 0, 0, 56, 65, 78, 0], [2, 0, 26, 0, 45, 0, 0, 79, 81], [0, 16, 0, 30, 0, 58, 67, 0, 90]]', NULL, 251, NULL, NULL),
(9856, 24, '[[3, 0, 27, 35, 40, 0, 0, 0, 83], [0, 11, 0, 0, 0, 54, 60, 71, 85], [0, 17, 29, 37, 47, 0, 0, 75, 0]]', NULL, 252, NULL, NULL),
(9857, 24, '[[0, 14, 27, 0, 41, 57, 60, 0, 0], [1, 0, 0, 38, 49, 0, 0, 75, 87], [0, 19, 28, 0, 0, 59, 61, 0, 89]]', NULL, 253, NULL, NULL),
(9858, 24, '[[3, 0, 0, 30, 43, 58, 0, 0, 81], [0, 17, 23, 32, 0, 0, 0, 77, 85], [9, 0, 29, 0, 46, 0, 64, 79, 0]]', NULL, 254, NULL, NULL),
(9859, 24, '[[7, 0, 0, 0, 40, 54, 0, 70, 82], [8, 11, 26, 37, 0, 0, 63, 0, 0], [0, 0, 0, 0, 45, 55, 66, 78, 86]]', NULL, 255, NULL, NULL),
(9860, 24, '[[5, 10, 0, 33, 0, 0, 65, 0, 80], [0, 13, 0, 0, 42, 51, 68, 71, 0], [0, 0, 20, 39, 0, 56, 0, 74, 83]]', NULL, 256, NULL, NULL),
(9861, 24, '[[6, 15, 0, 31, 47, 0, 62, 0, 0], [0, 0, 21, 0, 0, 50, 69, 76, 88], [0, 18, 24, 36, 48, 53, 0, 0, 0]]', NULL, 257, NULL, NULL),
(9862, 24, '[[2, 12, 22, 0, 44, 0, 0, 72, 0], [0, 0, 25, 34, 0, 52, 0, 73, 84], [4, 16, 0, 35, 0, 0, 67, 0, 90]]', NULL, 258, NULL, NULL),
(9863, 24, '[[6, 0, 22, 32, 44, 0, 62, 0, 0], [8, 10, 0, 0, 0, 51, 0, 77, 82], [0, 15, 26, 37, 46, 0, 65, 0, 0]]', NULL, 259, NULL, NULL),
(9864, 24, '[[1, 14, 0, 31, 0, 0, 0, 71, 81], [0, 16, 0, 33, 42, 0, 64, 79, 0], [9, 0, 27, 0, 43, 52, 0, 0, 88]]', NULL, 260, NULL, NULL),
(9865, 24, '[[5, 0, 25, 0, 40, 0, 0, 70, 83], [0, 11, 0, 35, 0, 53, 67, 75, 0], [0, 19, 29, 0, 0, 57, 0, 78, 87]]', NULL, 261, NULL, NULL),
(9866, 24, '[[3, 0, 21, 0, 48, 0, 60, 0, 85], [0, 12, 23, 0, 49, 54, 0, 72, 0], [7, 0, 0, 30, 0, 59, 63, 0, 89]]', NULL, 262, NULL, NULL),
(9867, 24, '[[4, 0, 0, 36, 0, 50, 61, 0, 80], [0, 17, 28, 0, 41, 0, 0, 73, 90], [0, 18, 0, 39, 0, 55, 66, 74, 0]]', NULL, 263, NULL, NULL),
(9868, 24, '[[2, 0, 0, 34, 45, 56, 0, 0, 84], [0, 13, 20, 38, 0, 58, 68, 0, 0], [0, 0, 24, 0, 47, 0, 69, 76, 86]]', NULL, 264, NULL, NULL),
(9869, 24, '[[5, 0, 0, 37, 0, 54, 0, 74, 80], [0, 15, 23, 0, 47, 55, 0, 0, 82], [0, 0, 27, 0, 0, 57, 61, 77, 87]]', NULL, 265, NULL, NULL),
(9870, 24, '[[8, 17, 0, 33, 0, 58, 62, 0, 0], [0, 18, 21, 36, 42, 0, 0, 0, 85], [9, 0, 28, 0, 45, 0, 0, 72, 88]]', NULL, 266, NULL, NULL),
(9871, 24, '[[4, 14, 0, 30, 44, 0, 0, 73, 0], [0, 0, 24, 0, 46, 0, 64, 76, 83], [6, 16, 25, 0, 0, 50, 66, 0, 0]]', NULL, 267, NULL, NULL),
(9872, 24, '[[7, 0, 0, 35, 0, 51, 0, 78, 81], [0, 10, 0, 39, 40, 53, 67, 0, 0], [0, 0, 26, 0, 43, 0, 68, 79, 86]]', NULL, 268, NULL, NULL),
(9873, 24, '[[0, 12, 0, 32, 0, 56, 0, 70, 89], [2, 19, 0, 38, 0, 0, 63, 71, 0], [3, 0, 20, 0, 49, 0, 65, 0, 90]]', NULL, 269, NULL, NULL),
(9874, 24, '[[0, 11, 22, 31, 41, 52, 0, 0, 0], [1, 13, 0, 0, 48, 0, 60, 0, 84], [0, 0, 29, 34, 0, 59, 69, 75, 0]]', NULL, 270, NULL, NULL),
(9875, 24, '[[0, 14, 0, 37, 0, 56, 60, 0, 82], [5, 15, 0, 0, 40, 58, 0, 0, 86], [0, 0, 24, 39, 0, 0, 61, 78, 90]]', NULL, 271, NULL, NULL),
(9876, 24, '[[3, 16, 20, 0, 0, 50, 0, 77, 0], [9, 0, 21, 0, 44, 0, 69, 0, 81], [0, 18, 0, 33, 47, 54, 0, 79, 0]]', NULL, 272, NULL, NULL),
(9877, 24, '[[1, 0, 0, 0, 43, 51, 62, 0, 80], [0, 13, 25, 32, 0, 52, 0, 70, 0], [2, 0, 0, 0, 49, 0, 66, 74, 83]]', NULL, 273, NULL, NULL),
(9878, 24, '[[0, 10, 22, 36, 0, 0, 63, 71, 0], [8, 0, 0, 38, 45, 59, 0, 0, 85], [0, 12, 29, 0, 0, 0, 64, 75, 89]]', NULL, 274, NULL, NULL),
(9879, 24, '[[4, 17, 27, 0, 41, 0, 0, 0, 87], [0, 19, 0, 30, 0, 55, 0, 72, 88], [7, 0, 28, 35, 46, 0, 67, 0, 0]]', NULL, 275, NULL, NULL),
(9880, 24, '[[6, 0, 23, 31, 0, 53, 65, 0, 0], [0, 11, 0, 34, 42, 0, 68, 73, 0], [0, 0, 26, 0, 48, 57, 0, 76, 84]]', NULL, 276, NULL, NULL),
(9881, 24, '[[0, 12, 0, 0, 47, 0, 61, 75, 86], [1, 19, 0, 0, 49, 0, 0, 79, 89], [0, 0, 22, 35, 0, 51, 65, 0, 90]]', NULL, 277, NULL, NULL),
(9882, 24, '[[8, 0, 20, 0, 45, 0, 60, 0, 84], [0, 13, 24, 0, 46, 54, 0, 0, 88], [0, 17, 0, 30, 0, 55, 68, 77, 0]]', NULL, 278, NULL, NULL),
(9883, 24, '[[0, 16, 0, 0, 44, 50, 0, 71, 81], [5, 0, 21, 31, 0, 0, 62, 0, 83], [6, 0, 0, 36, 0, 52, 67, 78, 0]]', NULL, 279, NULL, NULL),
(9884, 24, '[[2, 0, 23, 34, 0, 57, 0, 0, 80], [4, 10, 0, 0, 40, 58, 0, 72, 0], [0, 14, 29, 38, 0, 0, 63, 76, 0]]', NULL, 280, NULL, NULL),
(9885, 24, '[[9, 0, 25, 33, 41, 0, 0, 0, 85], [0, 11, 0, 0, 42, 53, 66, 73, 0], [0, 18, 26, 37, 0, 0, 69, 0, 87]]', NULL, 281, NULL, NULL),
(9886, 24, '[[3, 0, 27, 32, 43, 56, 0, 0, 0], [7, 0, 28, 0, 0, 59, 0, 70, 82], [0, 15, 0, 39, 48, 0, 64, 74, 0]]', NULL, 282, NULL, NULL),
(9887, 24, '[[0, 19, 26, 0, 40, 0, 63, 0, 81], [3, 0, 0, 0, 43, 0, 65, 74, 86], [5, 0, 0, 37, 0, 59, 0, 78, 90]]', NULL, 283, NULL, NULL),
(9888, 24, '[[2, 0, 24, 34, 0, 55, 0, 72, 0], [7, 10, 0, 0, 41, 0, 66, 0, 87], [0, 0, 28, 38, 0, 58, 0, 77, 89]]', NULL, 284, NULL, NULL),
(9889, 24, '[[0, 12, 0, 31, 45, 50, 60, 0, 0], [4, 0, 25, 32, 0, 52, 0, 73, 0], [0, 13, 29, 0, 49, 0, 64, 0, 83]]', NULL, 285, NULL, NULL),
(9890, 24, '[[0, 11, 0, 35, 42, 51, 0, 0, 82], [9, 15, 0, 0, 0, 53, 61, 75, 0], [0, 0, 20, 36, 48, 0, 62, 0, 85]]', NULL, 286, NULL, NULL),
(9891, 24, '[[6, 14, 0, 30, 46, 0, 0, 70, 0], [0, 18, 22, 0, 0, 54, 0, 79, 84], [0, 0, 27, 0, 47, 57, 67, 0, 88]]', NULL, 287, NULL, NULL),
(9892, 24, '[[1, 0, 21, 33, 0, 0, 68, 0, 80], [8, 16, 0, 0, 44, 0, 69, 71, 0], [0, 17, 23, 39, 0, 56, 0, 76, 0]]', NULL, 288, NULL, NULL),
(9893, 24, '[[7, 0, 0, 0, 42, 54, 0, 71, 81], [0, 13, 0, 37, 45, 0, 63, 0, 82], [0, 0, 24, 0, 0, 57, 64, 77, 84]]', NULL, 289, NULL, NULL),
(9894, 24, '[[5, 0, 20, 0, 0, 53, 60, 0, 88], [0, 12, 0, 35, 0, 59, 0, 74, 89], [0, 14, 22, 0, 43, 0, 65, 76, 0]]', NULL, 290, NULL, NULL),
(9895, 24, '[[6, 10, 0, 31, 0, 51, 0, 0, 85], [0, 19, 23, 0, 44, 55, 0, 0, 90], [0, 0, 28, 39, 47, 0, 69, 75, 0]]', NULL, 291, NULL, NULL),
(9896, 24, '[[2, 0, 27, 0, 40, 50, 0, 0, 80], [0, 17, 0, 30, 0, 0, 66, 70, 86], [8, 0, 29, 34, 0, 56, 0, 78, 0]]', NULL, 292, NULL, NULL),
(9897, 24, '[[3, 11, 0, 0, 46, 0, 62, 73, 0], [4, 0, 25, 32, 0, 52, 0, 0, 83], [0, 16, 0, 38, 49, 0, 68, 79, 0]]', NULL, 293, NULL, NULL),
(9898, 24, '[[0, 15, 21, 0, 41, 0, 61, 0, 87], [1, 0, 26, 33, 48, 0, 67, 0, 0], [9, 18, 0, 36, 0, 58, 0, 72, 0]]', NULL, 294, NULL, NULL),
(9899, 24, '[[3, 0, 21, 0, 49, 0, 68, 70, 0], [0, 10, 0, 30, 0, 57, 0, 71, 87], [5, 18, 29, 0, 0, 0, 0, 75, 88]]', NULL, 295, NULL, NULL),
(9900, 24, '[[0, 0, 0, 36, 40, 50, 0, 72, 84], [9, 14, 24, 0, 0, 0, 66, 76, 0], [0, 19, 0, 38, 48, 51, 0, 0, 86]]', NULL, 296, NULL, NULL),
(9901, 24, '[[0, 11, 0, 0, 43, 0, 62, 74, 80], [4, 17, 0, 32, 44, 58, 0, 0, 0], [8, 0, 25, 37, 0, 59, 0, 0, 90]]', NULL, 297, NULL, NULL),
(9902, 24, '[[6, 0, 23, 0, 45, 0, 63, 0, 82], [0, 12, 27, 0, 0, 0, 64, 78, 89], [7, 0, 0, 33, 0, 56, 67, 79, 0]]', NULL, 298, NULL, NULL),
(9903, 24, '[[0, 0, 22, 34, 42, 53, 60, 0, 0], [2, 15, 0, 0, 46, 0, 0, 77, 85], [0, 16, 26, 35, 0, 55, 61, 0, 0]]', NULL, 299, NULL, NULL),
(9904, 24, '[[1, 0, 0, 31, 0, 52, 65, 0, 81], [0, 13, 20, 39, 41, 0, 0, 73, 0], [0, 0, 28, 0, 47, 54, 69, 0, 83]]', NULL, 300, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notificationlog`
--

CREATE TABLE `notificationlog` (
  `id` int(11) NOT NULL,
  `fromclient` int(11) NOT NULL,
  `touser` longtext DEFAULT NULL,
  `tomember` longtext DEFAULT NULL,
  `toenquiry` longtext DEFAULT NULL,
  `mobile` varchar(1000) DEFAULT NULL,
  `emailid` varchar(100) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `response` varchar(5000) DEFAULT NULL,
  `responsemessage` varchar(5000) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `notificationtype` enum('Email','SMS') DEFAULT NULL,
  `fromuserid` int(11) DEFAULT NULL,
  `attachment` longtext DEFAULT NULL,
  `eventname` varchar(200) DEFAULT NULL,
  `broadcastid` int(11) DEFAULT NULL,
  `bccemailid` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_tokens`
--

CREATE TABLE `oauth_tokens` (
  `ID` int(11) NOT NULL,
  `access_token` text NOT NULL,
  `access_token_expires_on` datetime NOT NULL,
  `client_id` int(11) NOT NULL,
  `refresh_token` text NOT NULL,
  `refresh_token_expires_on` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `logintype` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `oauth_tokens`
--

INSERT INTO `oauth_tokens` (`ID`, `access_token`, `access_token_expires_on`, `client_id`, `refresh_token`, `refresh_token_expires_on`, `user_id`, `logintype`) VALUES
(1, '48e07d11d183e537d51dccf949f7094bbfd7475c', '2021-03-03 04:46:58', 2, '6108ff9c7d6007b17aec12336a6b3789e9a869de', '2021-03-31 22:46:58', 2, 0),
(2, 'a65a9a35cb1502eb5a9b1de67723985fb63995bc', '2021-03-03 04:53:27', 2, 'b8fb7cc1c4b7b1019e2f3e1990054e0d5a2722f2', '2021-03-31 22:53:27', 2, 0),
(3, 'c2f7805d02270576f085d6c033a6f224336b601c', '2021-03-03 04:58:56', 2, '981dc2a492dd2c76b64f795089a1b833acfe3c91', '2021-03-31 22:58:56', 2, 0),
(4, '9ff021340c66c2be2517ac32eca0ddc0239e7df1', '2021-03-03 04:59:14', 2, '8a09810e8d15b7d9eb68748360ca787bea02043a', '2021-03-31 22:59:14', 2, 0),
(5, '3b9a579f38759268f97cff71b7b88a95a0a7e5a0', '2021-03-03 05:00:36', 2, '59d9e82047d40e4f372abd0d8d5c4943ad146c11', '2021-03-31 23:00:36', 2, 0),
(6, '2318ac0f478d203bb5b5e4a099f4119da2e5e21f', '2021-03-03 05:34:01', 2, 'df7e553a29062489fdf6e2128e3ce6163f558398', '2021-03-31 23:34:01', 2, 0),
(7, '7e4b5b0f9d1366f051ab38f4862919398916c165', '2021-03-03 05:41:53', 2, '6ddc1af95b7f486352b981dd3dbdc4f67a6548ee', '2021-03-31 23:41:53', 2, 0),
(8, '3ed4367e5aabbc5a2060140e9a80c8a10ae551f7', '2021-03-03 05:42:19', 2, '6d0cd2a1644b900a26c7ab76b35437be23760cdf', '2021-03-31 23:42:19', 2, 0),
(9, 'aea09c9f089179d73d62a8c66a721d42b4008964', '2021-03-03 05:42:39', 2, 'f8847c2c326e6925886de38bcc3477bdb18874fe', '2021-03-31 23:42:39', 2, 0),
(10, '63166bcd5696fec6c9f615ec1cce5d0891c99a3e', '2021-03-03 05:44:27', 2, '779c17d9697f7d4d82ba54d4ee83a0c3947984f9', '2021-03-31 23:44:27', 2, 0),
(11, '78b4ad559e8d03f4afcdb358a9a37036d0b8abd4', '2021-03-03 05:46:44', 2, '806531199ed0533d64adc9fab5ae3f343d150816', '2021-03-31 23:46:44', 2, 0),
(12, 'd45c599b0ed917bbb97eb5e8d1a5f0b61962a624', '2021-03-03 05:50:57', 2, 'fab08a762f31db694fc9e6669429d9e6784fc292', '2021-03-31 23:50:57', 2, 0),
(13, 'dd66aa893fb1d6ec2dafca3657d8ad3e6bf0a077', '2021-03-03 05:55:44', 2, 'c231f8d6417fa4a2c0daf3fbc9adae0df40dc828', '2021-03-31 23:55:44', 2, 0),
(14, '14dd294ee3778b52313760621cb08c20153a5f6c', '2021-03-03 05:58:00', 2, 'a34857aa2e742aa8fe6e0a700aa26451dfe14690', '2021-03-31 23:58:00', 2, 0),
(15, 'eee507cb5b2ca2e5811b7c415b578188b16a2edd', '2021-03-03 05:59:17', 2, '431570b59c944deb4e1b7993b4b06400521063f7', '2021-03-31 23:59:17', 2, 0),
(16, 'd5461c9b560c7b7a307f1bc14e994b355999e072', '2021-03-03 06:07:13', 2, '21a99ddc80f9420df7f8b7f8a2a339d97909b218', '2021-04-01 00:07:13', 2, 0),
(17, 'ec04d0b15dec9b98b14b435f4fbdb946c9512840', '2021-03-03 06:08:26', 2, '09849d46eea31b14452cccd91ba442a0532c3812', '2021-04-01 00:08:26', 2, 0),
(18, 'a239d061489ac79f81ce97d7e092155e150232ed', '2021-03-03 06:09:33', 2, '97c6913fea0a9247a2a7df22c7e571f4798dc59e', '2021-04-01 00:09:33', 2, 0),
(19, 'eb50fc94ec08fabf6d4019e19dd712825efd11db', '2021-03-03 06:14:28', 2, 'f666d63e4e2a6f216eccd18789cc4d6a6c65941f', '2021-04-01 00:14:28', 2, 0),
(20, 'e4e835bd69c15d6792bce78902c3ab260ca49fef', '2021-03-03 17:11:21', 2, '7753a22a363f31464d04e4bdde1508afb9bbf86a', '2021-04-01 11:11:21', 2, 0),
(21, '06be3acc001d2f73e6976d2e80b32fd5e9fe1102', '2021-03-03 17:13:40', 2, '118be5d2e129f21d02457ca83736e86b4238153e', '2021-04-01 11:13:40', 2, 0),
(22, '93ea307e08f53955d49750ee338e7f62f651a1eb', '2021-03-03 17:14:24', 2, '028d5383847f9487df7aa27f4ad48cce74c51420', '2021-04-01 11:14:24', 2, 0),
(23, '1c7f020fc4e874144da65c9f8e5d1bfe7dcd37a1', '2021-03-03 18:37:51', 2, 'f968368898773bae7dbad8779b44ded5e806b2f0', '2021-04-01 12:37:51', 2, 0),
(24, '04d81fb21ee0b76d440d28d3197fd7a259e96ed6', '2021-03-03 18:43:44', 2, '4a51034bd3f0488b66aa95a04739934b3b8ff0b1', '2021-04-01 12:43:44', 2, 0),
(25, '505d2e31205819883f1510cd9b8aced8a0f6f61e', '2021-03-03 20:56:14', 2, '2117a83e725d2cf5294de23809356f7e2b88654a', '2021-04-01 14:56:14', 2, 0),
(26, '75ceab234f1db19be11e854cd495e54ead048058', '2021-03-03 20:57:36', 2, '74ad606fe4f94a6abe70762ddaa77fdbf32156cd', '2021-04-01 14:57:36', 2, 0),
(27, '73eb9eee45b1555add82b1fc1a128bb1e0973270', '2021-03-03 22:07:48', 2, 'd97e4e97c4575641832594ef74097a73c6d58600', '2021-04-01 16:07:48', 2, 0),
(28, 'f8c7d629e211b1f36d9732e040dc540469b7d913', '2021-03-03 22:13:21', 2, '2da30309f9c417603ad78181670dcb745fd99d0f', '2021-04-01 16:13:21', 2, 0),
(29, '88e5d5fd7c6ec9c20450bfebd052e26f53d65e96', '2021-03-05 05:18:32', 2, '81ec32d89b6a1cd0c7362f180a2ca572f9059b82', '2021-04-02 23:18:32', 2, 0),
(30, 'b1338872818f5e094ceaa457050dd7c283645e90', '2021-03-06 22:22:35', 2, '9e20c9f8de1a5af9fec44f9f93493346be03c27c', '2021-04-04 16:22:35', 2, 0),
(31, 'c392b8b3d0bab73c646c68f351f3c8b30935a75e', '2021-03-08 06:30:52', 2, 'c88902c93c00c6cee590b29adeb5b9c2b0f34f1a', '2021-04-06 00:30:52', 2, 0),
(32, '71df958cf4f390a076ec94494eb31719282c3466', '2021-03-09 16:20:47', 2, 'efe0bfbc9bc34423cdef7676d0562572d5c5aada', '2021-04-07 10:20:47', 2, 0),
(33, 'd0d57598d16508c08866b7306701da33d10ff76a', '2021-03-10 18:40:21', 2, '9e14d4b921219824a82510f8c915b65ccf29bea1', '2021-04-08 12:40:21', 2, 0),
(34, 'a01f117bbcfa76c7f228115318a6152ac9a4224a', '2021-03-10 18:41:45', 2, 'b8cd9843c77bf815abf16e1e3d4088a343a6a4c6', '2021-04-08 12:41:45', 2, 0),
(35, 'deb76c028c35d642c73e693bb56a64a48abdd42e', '2021-03-10 18:41:47', 2, '730f69958bc2b68acfa6dfe23f06d87b1946ece9', '2021-04-08 12:41:47', 2, 0),
(36, '36a5da6de274605862894cba22b0f8344d6326ba', '2021-03-10 18:41:51', 2, '03a5fb374c4cca21e0b6aeb008445ebdb9858235', '2021-04-08 12:41:51', 2, 0),
(37, '6ad0dd8b99068149b2f9cd5767d1031ee324817f', '2021-03-10 18:47:17', 2, '83d9dcc77f5853da35b7837c1f57e74ad49a8673', '2021-04-08 12:47:17', 2, 0),
(38, '93033c5b40470f55759cf5ac1067a16af3d3072a', '2021-03-10 18:47:26', 2, '5a2094d6f3abbbad1f9765ce8fba259d916354a2', '2021-04-08 12:47:26', 2, 0),
(39, '4c2e6efda7778c231d87d65b1a02ed50091a2a41', '2021-03-10 18:47:33', 2, 'a4447593bca53ef396169d8a1fd4110ff1eea032', '2021-04-08 12:47:33', 2, 0),
(40, '16a0c2342728ef38994776561b4cb984bb47d332', '2021-03-10 18:47:41', 2, 'e6d42c70eb642348f4aa234ed1f80c738893a4be', '2021-04-08 12:47:41', 2, 0),
(41, '7daf3ce0a662c19d39b89e36f7017eeee2a1656e', '2021-03-10 18:47:46', 2, 'f265b50085326736220f0d70f9499852bc06a88f', '2021-04-08 12:47:46', 2, 0),
(42, 'd30299bda1581bfe16f1e0bd4dfe6aff43ffaa42', '2021-03-10 18:48:08', 2, '0445af4865cc849523f1b39a585c37dfdac57f58', '2021-04-08 12:48:08', 2, 0),
(43, '9f7b7672db639e5f68a6dd1d006385b0b1f1815b', '2021-03-10 18:54:53', 2, 'a9bc7e291004b77ec522b3a495336ebd8682859e', '2021-04-08 12:54:53', 2, 0),
(44, '9c230be6afa8792f5d4e1a1c11b315320a0943bc', '2021-03-10 21:13:23', 2, '3efbe4e5e718b60954a1631a723ea186f8524d15', '2021-04-08 15:13:23', 2, 0),
(45, 'c8b2e82fc912242903638a8e04955635bba8617b', '2021-03-10 21:13:35', 2, '7d732eb658d2b8dff9a795410d2ab5dfd722993b', '2021-04-08 15:13:35', 2, 0),
(46, 'd45e6d556d10377852bfa0c2396b5f2deb548145', '2021-03-10 21:15:46', 2, '9e89cc47c2e7df4038c01b30ff246110a259567f', '2021-04-08 15:15:46', 2, 0),
(47, 'd32c3eaf1b552dd53a204ba2d9cb5e9deddd623d', '2021-03-10 21:15:51', 2, '7a502dc4d06cd7d2b0df6fbab0291ecbb7610e11', '2021-04-08 15:15:51', 2, 0),
(48, 'f447281987616948c385b039a9ad639b21423edc', '2021-03-10 21:18:45', 2, 'f57603b270a0bd08056adca445bc9ea40c35b8d9', '2021-04-08 15:18:45', 2, 0),
(49, '907e5c07bd9e4f8d49a0a395ed9794899b40f760', '2021-03-13 05:41:45', 2, '380685a474a6bce45215d7a815332eb797bc8419', '2021-04-10 23:41:45', 2, 0),
(50, '87e81526580cb497d82b39fd4e5bd1286404d836', '2021-03-13 16:25:51', 2, '68e78a23dd6ab2d0985fbec91873d552276e993d', '2021-04-11 10:25:51', 2, 0),
(51, '8ab3c21d6cdf8b728594299295e14be65e95ff6d', '2021-03-13 13:17:25', 2, '6f17a401c352347b03bf7d7ed7766700e322d6ed', '2021-04-11 07:17:25', 2, 0),
(52, '0928067e22aa63906c5d0e285a30f1ef7742b3ef', '2021-03-13 14:20:22', 2, '4a6a6537c09f93f90684b86cc7babe78a9edcd02', '2021-04-11 08:20:22', 5, 0),
(53, 'be8d7324b5ecdad744da8fbec74e2e1d1cc7d034', '2021-03-13 14:20:45', 2, 'bff6905b53d0e794cc74299de2315af211677318', '2021-04-11 08:20:45', 2, 0),
(54, '9e2e49c73dda8e002646c75f2de00b7fcc249505', '2021-03-13 14:22:49', 2, 'a3ed6debc7a96422250e265f7575d86d93b7d1fd', '2021-04-11 08:22:49', 2, 0),
(55, 'fcbec1e42ad7015b354d8294dc080ae0ed43e716', '2021-03-13 14:25:20', 2, 'bbdcf0a1e47d4296e7e3c24cdb2101015b8ea5e6', '2021-04-11 08:25:20', 5, 0),
(56, 'aa586a4e6f805bd0516d5dbbfe92c1e0040a8b68', '2021-03-13 14:28:55', 2, 'e240f93b77a3e77d30ee596ed1943869942c8ee9', '2021-04-11 08:28:55', 5, 0),
(57, '95679445d561bdd94e3b5012643e66d4dd2f95b9', '2021-03-13 14:56:16', 2, 'ce390f6a9832ab8fdd54ea428b7d17bcd2cdc2b7', '2021-04-11 08:56:16', 2, 0),
(58, '79481574ee006a6cada09ab68caa47027b9db602', '2021-03-16 15:47:46', 2, '5f78471aab8b3df34fa80d9b343a24527b9344fb', '2021-04-14 09:47:46', 2, 0),
(59, 'db9965807a488c532ee66e6ea48a5ebef7b9d847', '2021-03-17 09:14:56', 2, '846c59d8bcb60b445e6737c9385227e3634c067a', '2021-04-15 03:14:56', 2, 0),
(60, '02f82000ef0162b7482a1977da4ea7dabcff44a2', '2021-03-18 22:05:14', 2, '1da8f7da07f2ddf187c342bf8135f9b99f49d97d', '2021-04-16 16:05:14', 2, 0),
(61, 'e4b815af521b42719d9ae81b7a335c023e71d6fe', '2021-03-18 22:10:38', 2, '1f2f73e218f0a1f422b5c961737191cdce1162e6', '2021-04-16 16:10:38', 2, 0),
(62, 'd8b5185741b5f769ef43934271a765789dbb6e9b', '2021-03-21 22:04:27', 2, '1c061a64ea4bb09dc66073af6175cdcd6c68c803', '2021-04-19 16:04:27', 2, 0),
(63, 'f68a1bd6618e92728ab1a6346a17d35791118526', '2021-03-21 13:30:44', 2, '74b9e461c8aa28a54b625208ec519640379a9629', '2021-04-19 07:30:44', 2, 0),
(64, 'cddf0b18b45544850bb28bd1c0fe1e220e5d0b54', '2021-03-21 13:33:28', 2, '9544b8a79cced7ae8dda24a7194a6207271fc5dd', '2021-04-19 07:33:28', 5, 0),
(65, '84d5a78511db8d00474c8a91489794313d3ece9c', '2021-03-21 13:44:23', 2, '21af9f89c12577f8ea5cc4ee926d1ddaed4fa8d6', '2021-04-19 07:44:23', 5, 0),
(66, 'b7c375df3c0f4204e83b270204d44750032bc6d4', '2021-03-21 14:24:20', 2, '2486c86b31b25e22f1cf7f97d86409939e1a7b05', '2021-04-19 08:24:20', 5, 0),
(67, '714f1e9fba5de68b2cc03cc16c35329002ee9fa0', '2021-03-21 19:03:21', 2, 'c0fe641a62147b6f6771e8f6a755452c1a31b136', '2021-04-19 13:03:21', 5, 0),
(68, '3e67367435375421acb28c6938ccbee6cac2292e', '2021-03-21 19:45:24', 2, 'f1961690c580cc4abf462d22a1cc5b51a671e1d5', '2021-04-19 13:45:24', 2, 0),
(69, 'ae50ff88f824c9a85a23d7bd9fccf95a5c9d97bf', '2021-03-22 02:36:46', 2, 'c1510a6eb4be7b95f3f0444f858e7ab8c6fe0cc8', '2021-04-19 20:36:46', 5, 0),
(70, '620202e78ce8a94550b5460cc2ac2cc1b272e2c4', '2021-03-22 12:24:12', 2, '97ffcbaa0ede067d65f4614f505391a828344425', '2021-04-20 06:24:12', 5, 0),
(71, '48a638a5e800fd1e3b12b160bee105590f918aaa', '2021-03-23 21:17:37', 2, 'b6f1318c65ac78afbe44b03eae3c5c61aa05d9de', '2021-04-21 15:17:37', 2, 0),
(72, 'c09c922d18537f79c015ebc39f0bcbbcee810ef6', '2021-03-23 22:17:07', 2, 'd3d3a8f0408c735e9defa959f43368a888417d5f', '2021-04-21 16:17:07', 2, 0),
(73, '34d7645b873900f236e9953dab2e0032e89c87c1', '2021-03-23 22:29:50', 2, '99db750742d3827a062e2f8b7b0af3892f6917fe', '2021-04-21 16:29:50', 2, 0),
(74, '6ee91a7947a2bf1bc365793576d030e3af832f21', '2021-03-23 22:30:00', 2, '905d74fd5b4018cae84c2a937cd094c16961adca', '2021-04-21 16:30:00', 6, 0),
(75, 'f0ed5e154af22250ff52420f8f9285f6b999f2aa', '2021-03-23 22:33:57', 2, '4fd72da964a044b47e827a195d158c2d6323cb2c', '2021-04-21 16:33:57', 6, 0),
(76, 'b2ea48e48dd8de114d1bcd52ad16a1808cf52f2e', '2021-03-23 22:36:12', 2, 'b6dea08fd180a6e6beccd3348357e4e11cc685cd', '2021-04-21 16:36:12', 6, 0),
(77, 'c6b509f7a8f8d7b7ed30482ccfb640dab150bde9', '2021-03-23 22:36:34', 2, 'fbc51b89debfb1d108b0949d702caa47fe2c43a2', '2021-04-21 16:36:34', 2, 0),
(78, '0cc9f5e74ef4ae3311d1dad2167dc9c858f838d3', '2021-03-23 22:37:22', 2, '3dfb06068036c2c3c913b0d0ed0580b8c1dbeb36', '2021-04-21 16:37:22', 5, 0),
(79, '10d606512c457a08fe04b0f73b0c051caf05fac5', '2021-03-23 22:37:40', 2, 'aa1717be316b73f51a440255b9a88b213482eb7d', '2021-04-21 16:37:40', 6, 0),
(80, '6ab553672abd23bee52f0c82ecd9e0616718abf8', '2021-03-23 22:38:05', 2, '0cc2d92e831d1a23b0e2def60e89a90ed6c7bb21', '2021-04-21 16:38:05', 6, 0),
(81, '7c79f4e8ff94a7dd83d9f7c9ffd1e13f337066a6', '2021-03-23 22:41:35', 2, 'af401b30c2fbfb4aacb8130bd595767ad7f45320', '2021-04-21 16:41:35', 5, 0),
(82, 'ca5e0a85fa196728bc2dee24b306f67ec0c024b3', '2021-03-23 22:56:30', 2, 'bc173a0950d8d139f134d0ee9bf644df76cee0d1', '2021-04-21 16:56:30', 5, 0),
(83, '3797ef5f810c039b8e7bdbf1c84222673ef3f14d', '2021-03-24 03:42:01', 2, 'd4ddaf2d267598c15f98ed2d36cf69745d2f7955', '2021-04-21 21:42:01', 6, 0),
(84, 'cc09afa43f81f95d8894c9ac80a84567e60fec2b', '2021-03-24 03:54:10', 2, '705d6502c27860628e34b0806d95ec85b2b68105', '2021-04-21 21:54:10', 5, 0),
(85, '69aa69b82c6a49a386c0dec0ca3a05b174419234', '2021-03-25 10:47:28', 2, 'aeecb864e788a93d07d8b8d84425ed4e9ca7045b', '2021-04-23 04:47:28', 5, 0),
(86, '902e5256d8429f8388d555e1cb4172d959a5687d', '2021-03-25 10:47:29', 2, 'bacb0a05a95336b1f4b0d536f9e5398e99fcc233', '2021-04-23 04:47:29', 5, 0),
(87, '3d4a260734257bc383ef7512684fd2a1e7d7fea6', '2021-03-25 22:21:56', 2, '0c5983b1c2fe8fe06014108a46a3a92a152deb83', '2021-04-23 16:21:56', 5, 0),
(88, 'a5cf7f1d4246cf529c9383f7e85191acd3e2161b', '2021-03-25 22:32:53', 2, 'ecff5fd16c22ee48a02dfed916e6dde6a2b48866', '2021-04-23 16:32:53', 6, 0),
(89, '654c8ee54956275939591b1f3f3a35d334265e93', '2021-03-26 05:24:38', 2, '4ac2d2f5f66cabfb564f2f64c7a84e3108a16992', '2021-04-23 23:24:38', 6, 0),
(90, 'b00bd06214a7934a359614639a04c22538931a58', '2021-03-26 05:29:04', 2, 'bdb9de90472b59a3c7326519c91d27f5d132b071', '2021-04-23 23:29:04', 5, 0),
(91, '585a80cd60b8266e0d07c1b09c547952d19f909c', '2021-03-26 06:57:35', 2, 'bfe981f6534be0aa5a47ba439ad71299056a3f4a', '2021-04-24 00:57:35', 5, 0),
(92, 'bf1af5757b948fa788e411f35d10172e9ae929f7', '2021-03-26 07:00:31', 2, 'bae4724974bf736d9aa91308827f9047b82d7ca9', '2021-04-24 01:00:31', 6, 0),
(93, '49f771a10276f58258077caeff7aedc528dad177', '2021-03-26 07:04:07', 2, 'deb43b76aa394eb0a0a5c19b246af94831d987e7', '2021-04-24 01:04:07', 5, 0),
(94, '0ebd9c8c557cf08ce1fe5f315ba41e9e4e71c75d', '2021-03-26 22:49:39', 2, 'd3fb7618419e5f9b49426556812597155d48e069', '2021-04-24 16:49:39', 2, 0),
(95, '0f08d56ed044e0720a59fedfe15b0734163124aa', '2021-03-26 22:53:02', 2, 'de60a93705e16a8e005d7bd584bf6a04b5f672a9', '2021-04-24 16:53:02', 5, 0),
(96, '4b0afd24cff23ab40f90a21322239a75c1bb5a3e', '2021-03-26 22:58:05', 2, '55036b4d66fa46ba1f776eead9f33b451183e27c', '2021-04-24 16:58:05', 5, 0),
(97, '05a01ee4028828551023b1afd7a8c2e7a552fb71', '2021-03-26 22:59:04', 2, '8eed7955f52bdcebf7101522bfe64027b74a2804', '2021-04-24 16:59:04', 2, 0),
(98, '8e665e26423f91ff1796de3d20af4ae4f95c7568', '2021-03-26 23:10:44', 2, '812bec410922d1b6f9c8724c4a389b1e21681451', '2021-04-24 17:10:44', 5, 0),
(99, '72cb7e4aa0445743f01e16eea2947ed54373c4b9', '2021-03-26 23:10:52', 2, '157201b1aaea592b910cf02ba2c9a24e61cde193', '2021-04-24 17:10:52', 5, 0),
(100, '60e2a2e9eb0deeeed485dc98d8987700501685c4', '2021-03-26 23:10:58', 2, 'f1497ecc30034e759263dff765da193814cf005b', '2021-04-24 17:10:58', 6, 0),
(101, 'bee13e2924b84379f45084cfbcbc4013177338e7', '2021-03-26 23:11:46', 2, 'c4a19ee5880686fc9235a2f066f04c4c92018f8b', '2021-04-24 17:11:46', 5, 0),
(102, '189c6bfb0edc7d2204f913dde3c4c8984e8a6608', '2021-03-26 23:16:38', 2, 'e1e7ca892e6859facc0928ca46b0cb6c6f9fecd7', '2021-04-24 17:16:38', 5, 0),
(103, '1242ea5ae1e9ab19e51420970f800fe91053826a', '2021-03-26 23:16:43', 2, '7e8fdc31de48bf96e2a9e5f65a73a58949e1f07b', '2021-04-24 17:16:43', 2, 0),
(104, 'de68f2b5979465cdcc8f59dbe95097a19defcbae', '2021-03-26 23:23:05', 2, 'abf913dd9f9ec28a177f18893ca709937dbfd777', '2021-04-24 17:23:05', 5, 0),
(105, '5e6a70a7cf2b699f62bf9605442f657527185d1b', '2021-03-26 23:23:28', 2, '1f7f655c06328d52f9e3f54a22c8f0fbb65376ba', '2021-04-24 17:23:28', 6, 0),
(106, '992b4b7a2c18f66b463febc382f11827e9a79ea0', '2021-03-26 23:24:04', 2, '7ad3e35c9e8e228b6ce853b102657ae1c191244a', '2021-04-24 17:24:04', 5, 0),
(107, '8a2ebd8084ea5546835f172a0b7ea7306a51267a', '2021-03-26 23:25:29', 2, 'c7bd1e62e14445d0c7df6c334cbea1fb9d176a0b', '2021-04-24 17:25:29', 2, 0),
(108, '504ccc1d7354fa7a8e0d8f4411500c089e395b46', '2021-03-26 23:25:47', 2, '7636acd9af274f69fd33e79836fed6d918d62a5b', '2021-04-24 17:25:47', 5, 0),
(109, '2fa549e28824b5ded38b14824751316d86a09996', '2021-03-26 23:25:57', 2, '665634d869964609859b249662d6d0202dc7e848', '2021-04-24 17:25:57', 2, 0),
(110, '76002c5275feb6a049f8e52ac14a2fb891d5dc1b', '2021-03-26 23:26:20', 2, '19baab2b30a7d60d694b656769e7b3e84436d710', '2021-04-24 17:26:20', 5, 0),
(111, '84d9d25d17d7e8d5a962b9045898caf354b12bfc', '2021-03-27 04:37:09', 2, '2575bfaf2a5d503eabbaa3a35af8ab8a1f0259e6', '2021-04-24 22:37:09', 5, 0),
(112, '4c8b7c303742be8b9c90da5946717a05dceb4213', '2021-03-27 04:41:52', 2, '0a8dab7399f2dd2d83de594f4937e1b81eeeb23f', '2021-04-24 22:41:52', 6, 0),
(113, '2088854c46d035adae447ea5a9ec236241a8330e', '2021-03-27 06:14:12', 2, 'b6bf696057e0952eac9dfe77ae673aad64ce3e06', '2021-04-25 00:14:12', 5, 0),
(114, '97ea41073c6f1f448edf38e9e47507f5e1ca8936', '2021-03-29 06:33:16', 2, 'e4a9b26501965456337cd6dbec245ca14e3efc3d', '2021-04-27 00:33:16', 5, 0),
(115, '3af136a107bad38576d131ff53116d5144a2ad8b', '2021-03-30 00:42:23', 2, 'df185a5cc1a62962f2b73aa224aa3adf3bf7d5b1', '2021-04-27 18:42:23', 5, 0),
(116, '416bbbe3674ad8f1cad6274a323d388d6da7035d', '2021-03-30 00:43:06', 2, 'b69586d09e01dcce8926e58cb03da2dfa37c2bc8', '2021-04-27 18:43:06', 2, 0),
(117, '95b2984d3fb80b9b0a0f1becdd99f6551575bc11', '2021-03-30 11:17:35', 2, '7324a4e3de1f9c16e18800ccaef7655544a86386', '2021-04-28 05:17:35', 5, 0),
(118, 'f3b39077d5607903970af79f8a73304743818287', '2021-03-30 23:13:45', 2, '2c0f2a30c66cfb37750d878571c5ba725ce0d731', '2021-04-28 17:13:45', 2, 0),
(119, 'fd9928193f4257322181efc8931d851e8d4f70e5', '2021-04-01 21:33:14', 2, 'd69cda1325cb1a7cd394b453d82759883fbba3c5', '2021-04-30 15:33:14', 2, 0),
(120, 'b9a0d6a71f46360f2c4db12677043b3130758cda', '2021-04-02 06:05:23', 2, '10d40fd430d0523fa827687ea93621eeec5f538f', '2021-05-01 00:05:23', 5, 0),
(121, '37ccb72375cf95661205d1f85302d15f47711fe8', '2021-04-02 21:33:51', 2, 'b236592c38d3cfced1d540448e245ec680844d8f', '2021-05-01 15:33:51', 5, 0),
(122, 'e75a8675dfe09c38e882e9f14e65c4627d49395a', '2021-04-03 07:05:04', 2, '0c4f4d4177682465de44aff4dace3aab1b0f5969', '2021-05-02 01:05:04', 5, 0),
(123, 'f4a760b2fb9dedfc5caeb5335e7e355f263af388', '2021-04-03 07:44:08', 2, '9ac8274973d69d26f8e22b30b7b885d4c5843505', '2021-05-02 01:44:08', 6, 0),
(124, 'f9a1c5da7f29a3e9be07897ca73a162a1183ab27', '2021-04-03 07:52:52', 2, '3eec0660bbd53cf90da12e2246d258c5ba34993d', '2021-05-02 01:52:52', 6, 0),
(125, 'cf352a3faf221994032c91410278b96bcf4b2d06', '2021-04-03 07:53:48', 2, 'cd3e5a27dd40ca07f19f4f8938babf1b438b8c39', '2021-05-02 01:53:48', 5, 0),
(126, 'e0e21c43a32d43db50e28222486e389e6ef1ccb9', '2021-04-03 07:59:59', 2, '12db790e59b63ff54ab62ddb478f891af89575e4', '2021-05-02 01:59:59', 7, 0),
(127, '9d39a0b087463a0f33637e539f5f2ad813eef7fd', '2021-04-03 08:01:32', 2, '61609b133190bb580eb21797b18556b4e8792130', '2021-05-02 02:01:32', 5, 0),
(128, '266209a01061fdacc91893e30720ba28a7a6807b', '2021-04-03 08:40:19', 2, '5df70c168a921aaad0131b3f1c9637d4aa01f215', '2021-05-02 02:40:19', 5, 0),
(129, 'bafb1c1366800f978003ea63f8102cfc0ece8709', '2021-04-04 16:55:39', 2, '1c95cc82ed29821dd7e2a2253ca0414be710bd8a', '2021-05-03 10:55:39', 5, 0),
(130, 'fc7319bfa6f3a0cff07c43035d5728d209d29446', '2021-04-04 18:36:54', 2, 'ea92a4b61d5e852f9cebd32f54e810fd8ab57628', '2021-05-03 12:36:54', 5, 0),
(131, '21ddc7f3c52ceeced664da7b21d3b03f7895e6b6', '2021-04-05 08:39:48', 2, '378579adc1f85e3ba846b08dddc9af3029d08ffc', '2021-05-04 02:39:48', 5, 0),
(132, 'b6488c970ba214c72eda3c03b9bb98c6960f693d', '2021-04-05 09:25:42', 2, '9ad5213951f619cb1211e8aca3eb8b9287ec1406', '2021-05-04 03:25:42', 2, 0),
(133, 'e207d40cf9000e124c26a7573f2d9cf57ce039a1', '2021-04-05 09:26:12', 2, '3b24c191ddc4ca414492603dd31ce76f42ee93f7', '2021-05-04 03:26:12', 5, 0),
(134, '2ab20c4942beeeb80cac2225782d1f8b793ad0f3', '2021-04-05 11:43:33', 2, 'd165ed8cbaa1d39689d9dfe88533b68fbc352e67', '2021-05-04 05:43:33', 2, 0),
(135, '6821538a9acba9d699e506e228fd01af48f5b2c4', '2021-04-05 11:46:09', 2, 'a8a2ee31fbd4efa453decb7c31dea7d6ace83f71', '2021-05-04 05:46:09', 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `pushsubscription`
--

CREATE TABLE `pushsubscription` (
  `id` int(11) NOT NULL,
  `subscriptionobject` longtext DEFAULT NULL,
  `clienturlid` varchar(100) DEFAULT NULL,
  `logintype` tinyint(1) DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pushsubscription`
--

INSERT INTO `pushsubscription` (`id`, `subscriptionobject`, `clienturlid`, `logintype`, `clientid`, `userid`, `date`) VALUES
(1, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/edDGjj60tN8:APA91bGDQXirdg4z6PuLeskdAUEE0tV9QhIkWxjZGfPiTEQwq1GMgT8VkWCCKykklip8bCT4EHGDIJ6-bodmEA-429HzI9irNsA2sPBaf0047A1QwUG1n317RP8Nj0hgZaBuL6Y8Qu-3\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BDXq71EEN50ZDAGXIZj_7Ef212wOORDJ37lrGo-fOBa9ClO0pa98l4H8hCmrPKnEgPUbaf8tL943hBVbQlcxMRM\",\"auth\":\"FWwCr03AOLpsYsqObdnRtQ\"}}', 'ssl', 0, 2, 2, '2021-03-13 04:54:21'),
(2, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/c0tY8iXV3ow:APA91bGQl9tyvud9F3DJEVXtAT0LPY_7yBbJ2U_JDbQlYNBANuJUz_hlv1GJUP_owUYlIW0npaT-hJSnwIfLh0ILLW25FJHJo6CwV1CHsXYeHSVIE2-kiNsXXYOo8CXn8zit3OEZ0QE7\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BA9u36BzqbW4Lx0Mw_RjXy6FMe_nzV31i2-gh8Li04lwctB4v1mYkQD6q_LH478pzicSY8dLGo4a9NQTdeSzV_k=\",\"auth\":\"CH7XTgCtNCJ7wu4Dq-F7lw==\"}}', 'tambola', 0, 2, 6, '2021-03-26 00:13:54'),
(3, '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/c0tY8iXV3ow:APA91bGQl9tyvud9F3DJEVXtAT0LPY_7yBbJ2U_JDbQlYNBANuJUz_hlv1GJUP_owUYlIW0npaT-hJSnwIfLh0ILLW25FJHJo6CwV1CHsXYeHSVIE2-kiNsXXYOo8CXn8zit3OEZ0QE7\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BA9u36BzqbW4Lx0Mw_RjXy6FMe_nzV31i2-gh8Li04lwctB4v1mYkQD6q_LH478pzicSY8dLGo4a9NQTdeSzV_k=\",\"auth\":\"CH7XTgCtNCJ7wu4Dq-F7lw==\"}}', 'tambola', 0, 2, 5, '2021-03-28 00:34:11');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `deleted` int(11) DEFAULT 0,
  `role` varchar(100) DEFAULT NULL,
  `alias` varchar(30) DEFAULT NULL,
  `modules` longtext DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `additionalrights` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `deleted`, `role`, `alias`, `modules`, `createdbyid`, `createdbydate`, `modifiedbyid`, `modifiedbydate`, `clientid`, `additionalrights`) VALUES
(1, 0, 'System Administrative', 'systemadmin', '[{\"alias\":\"dashboard\",\"child_routes\":null,\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"game\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"bookticket\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"employeemanagement\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"branding\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"role\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true}]}]', NULL, NULL, 1, '2021-02-01 17:19:41', 1, ''),
(2, 1, 'Gym Owner', 'gymowner', '[{\"alias\": \"dashboard\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"masterdashboard\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"followupdashboard\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"revenuedashboard\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"followupanalysis\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"staffperformance\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"budgetdashboard\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"memberprofiledashboard\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"visitorbook\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"enquiry\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"alias\": \"sales\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"expresssale\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"servicesale\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"packagesale\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"productsale\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"changesale\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"invoice\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"members\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"membermanagement\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"subscriptionexpired\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"dues\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"pendingcheque\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"memberattendance\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"measurement\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"biometric\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"gymaccessslot\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"memberfeedback\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"classes\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"manageclass\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"classschedules\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"classattendance\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"classperformance\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"personaltraining\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"pt\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"ptschedule\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"ptattendence\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"workouts\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"exercise\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"workoutroutine\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"workoutschedule\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"diets\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"recipe\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"dietroutine\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"allocatediet\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"service\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"package\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"product\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"alias\": \"equipment\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"equipmentbrands\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"equipmentlibrary\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"equipmentpurchased\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"equipmentinstock\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"broadcast\", \"delete\": true, \"export\": true, \"update\": true, \"child_routes\": null}, {\"alias\": \"covid19disclaimer\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"covid19configuration\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"covid19memberdisclaimer\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"covid19staffdisclaimer\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"staff\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"employeemanagement\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"staffattendance\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"userbiometric\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"expensemanagement\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"expenses\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"investment\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"staffPay\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"report\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"collectionreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"duesreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"onlinepayment\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"soldproduct\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"soldservice\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"employeeattendancereport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"memberattendancereport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"classattendancereport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"ptattendancereport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"enquiryfollowupreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"memberfollowupreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"activemembershipreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"membershipreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"gymaccessslotreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"visitorbookreport\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"notificationreport\", \"delete\": true, \"export\": true, \"update\": true}]}, {\"alias\": \"setting\", \"child_routes\": [{\"add\": true, \"all\": true, \"view\": true, \"alias\": \"zone\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"branch\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"organization\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"advertisement\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"resultandtestimonial\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"budget\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"disclaimer\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"branding\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"integration\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"role\", \"delete\": true, \"export\": true, \"update\": true}, {\"add\": true, \"all\": true, \"view\": true, \"alias\": \"templateconfiguration\", \"delete\": true, \"export\": true, \"update\": true}]}]', NULL, NULL, 1, '2021-02-01 17:14:07', 1, '[{\"name\": \"Change Active Subscription Period\", \"alias\": \"changemembershipperiod\", \"update\": true}, {\"name\": \"Cancel Payment\", \"alias\": \"cancelpayment\", \"update\": true}, {\"name\": \"Change Status\", \"alias\": \"changestatus\", \"update\": true}, {\"name\": \"Balance Adjustment\", \"alias\": \"balanceadjustment\", \"update\": true}, {\"name\": \"Change PT Commission\", \"alias\": \"changeptcommission\", \"update\": true}, {\"name\": \"Backdated PT Attendance\", \"alias\": \"backdatedptattendance\", \"update\": true}, {\"name\": \"Change PT Owner During Attendance\", \"alias\": \"changeptownerduringattendance\", \"update\": true}, {\"name\": \"Transfer Attended By Of Enquiry\", \"alias\": \"transferattendedby\", \"update\": true}, {\"name\": \"Transfer Sales Representative Of Member\", \"alias\": \"transfersalesrepresentative\", \"update\": true}]'),
(3, 0, 'Administrative Staff', 'administrator', '[{\"alias\":\"dashboard\",\"child_routes\":null},{\"alias\":\"game\",\"add\":true,\"update\":true,\"delete\":false,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"bookticket\",\"add\":true,\"update\":true,\"delete\":false,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"employeemanagement\",\"add\":true,\"update\":true,\"view\":true},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\"},{\"alias\":\"branding\"},{\"alias\":\"role\"}]}]', NULL, NULL, 1, '2021-02-01 17:15:26', 1, ''),
(4, 1, 'Trainer', 'trainer', '[{\"name\": \"Dashboard\", \"alias\": \"dashboard\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"add\": false, \"name\": \"Master Dashboard\", \"view\": false, \"alias\": \"masterdashboard\", \"delete\": false, \"export\": false, \"update\": false, \"packType\": \"[1,2,3]\"}, {\"name\": \"Revenue Dashboard\", \"alias\": \"revenuedashboard\", \"packType\": \"[2,3]\"}, {\"name\": \"Budget Dashboard\", \"alias\": \"budgetdashboard\", \"packType\": \"[3]\"}, {\"name\": \"Staff Performance\", \"alias\": \"staffperformance\", \"packType\": \"[2,3]\"}]}, {\"add\": false, \"name\": \"Enquiry\", \"view\": false, \"alias\": \"enquiry\", \"update\": false, \"packType\": \"[1,2,3]\"}, {\"name\": \"Sales\", \"alias\": \"sales\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"name\": \"Express Sale\", \"alias\": \"expresssale\", \"packType\": \"[2,3]\"}, {\"name\": \"Service\", \"alias\": \"servicesale\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Product\", \"alias\": \"productsale\", \"packType\": \"[2,3]\"}, {\"name\": \"Invoice\", \"alias\": \"invoice\", \"packType\": \"[1,2,3]\"}]}, {\"name\": \"Members\", \"alias\": \"members\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"name\": \"Member Management\", \"view\": true, \"alias\": \"membermanagement\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Inactive Members\", \"alias\": \"subscriptionexpired\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Payment Dues\", \"alias\": \"dues\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Pending Cheque\", \"alias\": \"pendingcheque\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Member Attendance\", \"alias\": \"memberattendance\", \"packType\": \"[2,3]\"}, {\"add\": true, \"name\": \"Measurement\", \"view\": true, \"alias\": \"measurement\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}, {\"name\": \"Biometric\", \"alias\": \"biometric\", \"packType\": \"[3]\"}, {\"name\": \"Member Feedback\", \"alias\": \"memberfeedback\", \"packType\": \"[3]\"}]}, {\"name\": \"Classes\", \"alias\": \"classes\", \"packType\": \"[2,3]\", \"child_routes\": [{\"add\": false, \"name\": \"Manage Class\", \"view\": true, \"alias\": \"manageclass\", \"delete\": false, \"update\": false, \"packType\": \"[2,3]\"}, {\"add\": false, \"name\": \"Class Schedules\", \"view\": true, \"alias\": \"classschedules\", \"delete\": false, \"update\": false, \"packType\": \"[2,3]\"}, {\"add\": false, \"name\": \"Class Attendance\", \"view\": true, \"alias\": \"classattendance\", \"delete\": true, \"update\": false, \"packType\": \"[2,3]\"}, {\"add\": false, \"name\": \"Class Performance\", \"view\": true, \"alias\": \"classperformance\", \"delete\": false, \"update\": false, \"packType\": \"[2,3]\"}]}, {\"name\": \"Personal Training\", \"alias\": \"personaltraining\", \"packType\": \"[2,3]\", \"child_routes\": [{\"add\": true, \"name\": \"PT & Diet\", \"view\": true, \"alias\": \"pt\", \"delete\": false, \"update\": true, \"packType\": \"[2,3]\"}, {\"add\": true, \"name\": \"PT & Diet Schedule\", \"view\": true, \"alias\": \"ptschedule\", \"delete\": false, \"update\": true, \"packType\": \"[2,3]\"}, {\"add\": true, \"name\": \"PT Attendence\", \"view\": true, \"alias\": \"ptattendence\", \"delete\": false, \"update\": true, \"packType\": \"[2,3]\"}]}, {\"name\": \"Workouts\", \"alias\": \"workouts\", \"packType\": \"[3]\", \"child_routes\": [{\"add\": true, \"name\": \"Exercise\", \"view\": true, \"alias\": \"exercise\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}, {\"add\": true, \"name\": \"Workout Routine\", \"view\": true, \"alias\": \"workoutroutine\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}, {\"add\": true, \"name\": \"Allocate Workout\", \"view\": true, \"alias\": \"workoutschedule\", \"delete\": false, \"export\": false, \"update\": true, \"packType\": \"[3]\"}]}, {\"name\": \"Diets\", \"alias\": \"diets\", \"packType\": \"[3]\", \"child_routes\": [{\"add\": true, \"name\": \"Foods\", \"view\": true, \"alias\": \"recipe\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}, {\"add\": true, \"name\": \"Diet Routine\", \"view\": true, \"alias\": \"dietroutine\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}, {\"add\": true, \"name\": \"Allocate Diet\", \"view\": true, \"alias\": \"allocatediet\", \"delete\": false, \"update\": true, \"packType\": \"[3]\"}]}, {\"name\": \"Service\", \"alias\": \"service\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Product\", \"alias\": \"product\", \"packType\": \"[2,3]\"}, {\"name\": \"Equipment\", \"alias\": \"equipment\", \"packType\": \"[2,3]\"}, {\"name\": \"Broadcast\", \"alias\": \"broadcast\", \"packType\": \"[3]\"}, {\"name\": \"Staff\", \"alias\": \"staff\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"name\": \"Manage Staff\", \"alias\": \"employeemanagement\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Staff Attendance\", \"alias\": \"staffattendance\", \"packType\": \"[2,3]\"}, {\"name\": \"Biometric\", \"alias\": \"userbiometric\", \"packType\": \"[3]\"}]}, {\"name\": \"Invt. & Exp.\", \"alias\": \"expensemanagement\", \"packType\": \"[2,3]\", \"child_routes\": [{\"name\": \"Expenses\", \"alias\": \"expenses\", \"packType\": \"[2,3]\"}, {\"name\": \"Investment\", \"alias\": \"investment\", \"packType\": \"[2,3]\"}, {\"name\": \"Staff Pay\", \"alias\": \"staffPay\", \"packType\": \"[2,3]\"}]}, {\"name\": \"Report\", \"alias\": \"report\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"name\": \"Collection Report\", \"alias\": \"collectionreport\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Online Payment\", \"alias\": \"onlinepayment\", \"packType\": \"[3]\"}, {\"name\": \"Sold Product\", \"alias\": \"soldproduct\", \"packType\": \"[2,3]\"}, {\"name\": \"Sold Service\", \"alias\": \"soldservice\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Staff Attendance\", \"alias\": \"employeeattendancereport\", \"packType\": \"[2,3]\"}, {\"name\": \"Member Attendance\", \"alias\": \"memberattendancereport\", \"packType\": \"[2,3]\"}, {\"name\": \"Class Attendance\", \"alias\": \"classattendancereport\", \"packType\": \"[2,3]\"}, {\"name\": \"PT Attendance\", \"alias\": \"ptattendancereport\", \"packType\": \"[2,3]\"}, {\"name\": \"Enquiry Followup\", \"alias\": \"enquiryfollowupreport\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Member Followup\", \"alias\": \"memberfollowupreport\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Active Subscription\", \"alias\": \"activemembershipreport\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Subscription History\", \"alias\": \"membershipreport\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Notification Report\", \"alias\": \"notificationreport\", \"packType\": \"[1,2,3]\"}]}, {\"name\": \"Settings\", \"alias\": \"setting\", \"packType\": \"[1,2,3]\", \"child_routes\": [{\"name\": \"Zone\", \"alias\": \"zone\", \"packType\": \"[3]\"}, {\"name\": \"Branch\", \"alias\": \"branch\", \"packType\": \"[3]\"}, {\"name\": \"Organization\", \"alias\": \"organization\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Budget\", \"alias\": \"budget\", \"packType\": \"[3]\"}, {\"name\": \"Disclaimer\", \"alias\": \"disclaimer\", \"packType\": \"[3]\"}, {\"name\": \"Branding\", \"alias\": \"branding\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Role\", \"alias\": \"role\", \"packType\": \"[1,2,3]\"}, {\"name\": \"Notification\", \"alias\": \"templateconfiguration\", \"packType\": \"[1,2,3]\"}]}]', NULL, NULL, 1, '2019-11-06 14:49:19', 1, '[{\"name\": \"Change Active Subscription Period\", \"alias\": \"changemembershipperiod\"}, {\"name\": \"Cancel Payment\", \"alias\": \"cancelpayment\"}]'),
(5, 0, 'Sales Agent', 'sales', '[{\"alias\":\"dashboard\",\"child_routes\":null},{\"alias\":\"game\"},{\"alias\":\"bookticket\",\"add\":true,\"update\":false,\"delete\":false,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"employeemanagement\"},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\"},{\"alias\":\"branding\"},{\"alias\":\"role\"}]}]', NULL, NULL, 1, '2021-02-01 17:15:07', 1, ''),
(173, 0, 'System Administrative', 'systemadmin', '[{\"alias\":\"dashboard\",\"child_routes\":null,\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"game\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"bookticket\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"mysales\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"employeemanagement\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"branding\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"role\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true}]},{\"alias\":\"changepassword\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true},{\"alias\":\"logout\",\"add\":true,\"update\":true,\"delete\":true,\"export\":true,\"view\":true,\"all\":true}]', 2, '2021-03-25 16:52:25', 2, '2021-04-04 05:45:33', 2, '[{\"alias\":\"changemembershipperiod\",\"name\":\"Change Active Subscription Period\"},{\"alias\":\"cancelpayment\",\"name\":\"Cancel Payment\"},{\"alias\":\"changestatus\",\"name\":\"Change Status\"},{\"alias\":\"balanceadjustment\",\"name\":\"Balance Adjustment\"},{\"alias\":\"changeptcommission\",\"name\":\"Change PT Commission\"},{\"alias\":\"backdatedptattendance\",\"name\":\"Backdated PT Attendance\"},{\"alias\":\"changeptownerduringattendance\",\"name\":\"Change PT Owner During Attendance\"},{\"alias\":\"transferattendedby\",\"name\":\"Transfer Attended By Of Enquiry\"},{\"alias\":\"transfersalesrepresentative\",\"name\":\"Transfer Sales Representative Of Member\"}]'),
(174, 0, 'Administrative Staff', 'administrator', '[{\"alias\":\"dashboard\",\"child_routes\":null,\"add\":true,\"update\":true,\"view\":true},{\"alias\":\"game\",\"add\":true,\"update\":true,\"delete\":true,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"bookticket\",\"add\":true,\"update\":true,\"delete\":false,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"mysales\",\"add\":true,\"update\":true,\"view\":true},{\"alias\":\"employeemanagement\",\"add\":true,\"update\":true,\"view\":true},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\"},{\"alias\":\"branding\"},{\"alias\":\"role\"}]},{\"alias\":\"changepassword\",\"add\":true,\"update\":true,\"view\":true},{\"alias\":\"logout\",\"add\":true,\"update\":true,\"view\":true}]', 2, '2021-03-25 16:52:45', 2, '2021-04-04 05:45:43', 2, '[{\"alias\":\"changemembershipperiod\",\"name\":\"Change Active Subscription Period\"},{\"alias\":\"cancelpayment\",\"name\":\"Cancel Payment\"},{\"alias\":\"changestatus\",\"name\":\"Change Status\"},{\"alias\":\"balanceadjustment\",\"name\":\"Balance Adjustment\"},{\"alias\":\"changeptcommission\",\"name\":\"Change PT Commission\"},{\"alias\":\"backdatedptattendance\",\"name\":\"Backdated PT Attendance\"},{\"alias\":\"changeptownerduringattendance\",\"name\":\"Change PT Owner During Attendance\"},{\"alias\":\"transferattendedby\",\"name\":\"Transfer Attended By Of Enquiry\"},{\"alias\":\"transfersalesrepresentative\",\"name\":\"Transfer Sales Representative Of Member\"}]'),
(175, 0, 'Sales Agent', 'sales', '[{\"alias\":\"dashboard\",\"child_routes\":null},{\"alias\":\"game\"},{\"alias\":\"bookticket\",\"add\":true,\"update\":false,\"delete\":false,\"export\":false,\"view\":true,\"all\":false},{\"alias\":\"mysales\",\"add\":true,\"view\":true},{\"alias\":\"employeemanagement\"},{\"alias\":\"setting\",\"child_routes\":[{\"alias\":\"organization\"},{\"alias\":\"branding\"},{\"alias\":\"role\"}]},{\"alias\":\"changepassword\",\"add\":true,\"view\":true},{\"alias\":\"logout\",\"add\":true,\"view\":true}]', 2, '2021-03-25 16:52:54', 2, '2021-04-04 05:45:51', 2, '[{\"alias\":\"changemembershipperiod\",\"name\":\"Change Active Subscription Period\"},{\"alias\":\"cancelpayment\",\"name\":\"Cancel Payment\"},{\"alias\":\"changestatus\",\"name\":\"Change Status\"},{\"alias\":\"balanceadjustment\",\"name\":\"Balance Adjustment\"},{\"alias\":\"changeptcommission\",\"name\":\"Change PT Commission\"},{\"alias\":\"backdatedptattendance\",\"name\":\"Backdated PT Attendance\"},{\"alias\":\"changeptownerduringattendance\",\"name\":\"Change PT Owner During Attendance\"},{\"alias\":\"transferattendedby\",\"name\":\"Transfer Attended By Of Enquiry\"},{\"alias\":\"transfersalesrepresentative\",\"name\":\"Transfer Sales Representative Of Member\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `sequence`
--

CREATE TABLE `sequence` (
  `id` int(11) NOT NULL,
  `alias` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `value` int(11) NOT NULL DEFAULT 1,
  `length` int(11) NOT NULL,
  `code` varchar(200) DEFAULT NULL,
  `client_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sequence`
--

INSERT INTO `sequence` (`id`, `alias`, `name`, `type`, `value`, `length`, `code`, `client_id`) VALUES
(1, 'employee', 'Employee', 'EMP{PADDING}{VALUE}', 47, 7, 'EMP', 1),
(2, 'employee', 'Employee', 'EMP{PADDING}{VALUE}', 4, 7, 'EMP', 2);

-- --------------------------------------------------------

--
-- Table structure for table `sessiontype`
--

CREATE TABLE `sessiontype` (
  `id` int(11) NOT NULL,
  `sessiontypename` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'English State name',
  `country_code` char(2) NOT NULL,
  `state_code` varchar(3) DEFAULT NULL,
  `state_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`id`, `name`, `country_code`, `state_code`, `state_number`) VALUES
(1, 'Andhra pradesh', 'IN', 'AD', 37),
(2, 'Assam', 'IN', 'AS', 18),
(3, 'Arunachal pradesh', 'IN', 'AR', 12),
(4, 'Gujarat', 'IN', 'GJ', 24),
(5, 'Bihar', 'IN', 'BR', 10),
(6, 'Haryana', 'IN', 'HR', 6),
(7, 'Himachal pradesh', 'IN', 'HP', 2),
(8, 'Jammu & kashmir', 'IN', 'JK', 1),
(9, 'Karnataka', 'IN', 'KA', 29),
(10, 'Kerala', 'IN', 'KL', 32),
(11, 'Madhya pradesh', 'IN', 'MP', 23),
(12, 'Maharashtra', 'IN', 'MH', 27),
(13, 'Manipur', 'IN', 'MN', 14),
(14, 'Meghalaya', 'IN', 'ML', 17),
(15, 'Mizoram', 'IN', 'MZ', 15),
(16, 'Nagaland', 'IN', 'NL', 13),
(17, 'Odisha', 'IN', 'OD', 21),
(18, 'Punjab', 'IN', 'PB', 3),
(19, 'Rajasthan', 'IN', 'RJ', 8),
(20, 'Sikkim', 'IN', 'SK', 11),
(21, 'Tamil nadu', 'IN', 'TN', 33),
(22, 'Tripura', 'IN', 'TR', 16),
(23, 'Uttar pradesh', 'IN', 'UP', 9),
(24, 'West bengal', 'IN', 'WB', 19),
(25, 'Delhi', 'IN', 'DL', 7),
(26, 'Goa', 'IN', 'GA', 30),
(27, 'Pondicherry', 'IN', 'PY', 34),
(28, 'Lakshadweep', 'IN', 'LD', 31),
(29, 'Daman & diu', 'IN', 'DD', 25),
(30, 'Dadra & nagar', 'IN', 'DN', 26),
(31, 'Chandigarh', 'IN', 'CH', 4),
(32, 'Andaman & nicobar', 'IN', 'AN', 35),
(33, 'Uttaranchal', 'IN', 'UK', 5),
(34, 'Jharkhand', 'IN', 'JH', 20),
(35, 'Chattisgarh', 'IN', 'CG', 22),
(36, 'Tripura', 'IN', 'TR', 16),
(37, 'Alabama', 'US', 'AL', NULL),
(38, 'Alaska', 'US', 'AK', NULL),
(39, 'Arizona', 'US', 'AZ', NULL),
(40, 'Arkansas', 'US', 'AR', NULL),
(41, 'California', 'US', 'CA', NULL),
(42, 'Colorado', 'US', 'CO', NULL),
(43, 'Connecticut', 'US', 'CT', NULL),
(44, 'Delaware', 'US', 'DE', NULL),
(45, 'Florida', 'US', 'FL', NULL),
(46, 'Georgia', 'US', 'GA', NULL),
(47, 'Hawaii', 'US', 'HI', NULL),
(48, 'Idaho', 'US', 'ID', NULL),
(49, 'Illinois', 'US', 'IL', NULL),
(50, 'Indiana', 'US', 'IN', NULL),
(51, 'Iowa', 'US', 'IA', NULL),
(52, 'Kansas', 'US', 'KS', NULL),
(53, 'Kentucky', 'US', 'KY', NULL),
(54, 'Louisiana', 'US', 'LA', NULL),
(55, 'Maine', 'US', 'ME', NULL),
(56, 'Maryland', 'US', 'MD', NULL),
(57, 'Massachusetts', 'US', 'MA', NULL),
(58, 'Michigan', 'US', 'MI', NULL),
(59, 'Minnesota', 'US', 'MN', NULL),
(60, 'Mississippi', 'US', 'MS', NULL),
(61, 'Missouri', 'US', 'MO', NULL),
(62, 'Montana', 'US', 'MT', NULL),
(63, 'Nebraska', 'US', 'NE', NULL),
(64, 'Nevada', 'US', 'NV', NULL),
(65, 'New Hampshire', 'US', 'NH', NULL),
(66, 'New Jersey', 'US', 'NJ', NULL),
(67, 'New Mexico', 'US', 'NM', NULL),
(68, 'New York', 'US', 'NY', NULL),
(69, 'North Carolina', 'US', 'NC', NULL),
(70, 'North Dakota', 'US', 'ND', NULL),
(71, 'Ohio', 'US', 'OH', NULL),
(72, 'Oklahoma', 'US', 'OK', NULL),
(73, 'Oregon', 'US', 'OR', NULL),
(74, 'Pennsylvania', 'US', 'PA', NULL),
(75, 'Rhode Island', 'US', 'RI', NULL),
(76, 'South Carolina', 'US', 'SC', NULL),
(77, 'South Dakota', 'US', 'SD', NULL),
(78, 'Tennessee', 'US', 'TN', NULL),
(79, 'Texas', 'US', 'TX', NULL),
(80, 'Utah', 'US', 'UT', NULL),
(81, 'Vermont', 'US', 'VT', NULL),
(82, 'Virginia', 'US', 'VA', NULL),
(83, 'Washington', 'US', 'WA', NULL),
(84, 'West Virginia', 'US', 'WV', NULL),
(85, 'Wisconsin', 'US', 'WI', NULL),
(86, 'Wyoming', 'US', 'WY', NULL),
(87, 'Northland', 'NZ', 'NTL', 1),
(88, 'Auckland', 'NZ', 'AUK', 2),
(89, 'Waikato', 'NZ', 'WKO', 3),
(90, 'Bay of Plenty', 'NZ', 'BOP', 4),
(91, 'Gisborne', 'NZ', 'GIS', 5),
(92, 'Hawke\'s Bay', 'NZ', 'HKB', 6),
(93, 'Taranaki', 'NZ', 'TKI', 7),
(94, 'Manawatu-Whanganui', 'NZ', 'MWT', 8),
(95, 'Wellington', 'NZ', 'WGN', 9),
(96, 'Tasman', 'NZ', 'TAS', 10),
(97, 'Nelson', 'NZ', 'NSN', 11),
(98, 'Marlborough', 'NZ', 'MBH', 12),
(99, 'West Coast', 'NZ', 'WTC', 13),
(100, 'Canterbury', 'NZ', 'CAN', 14),
(101, 'Otago', 'NZ', 'OTA', 15),
(102, 'Southland', 'NZ', 'STL', 16),
(103, 'New South Wales', 'AU', 'NSW', NULL),
(104, 'Queensland', 'AU', 'QLD', NULL),
(105, 'South Australia', 'AU', 'SA', NULL),
(106, 'Tasmania', 'AU', 'TAS', NULL),
(107, 'Victoria', 'AU', 'VIC', NULL),
(108, 'Western Australia', 'AU', 'WA', NULL),
(109, 'Australian Capital Territory', 'AU', 'ACT', NULL),
(110, 'Northern Territory', 'AU', 'NT', NULL),
(111, 'Baden-Wurttemberg', 'DE', 'BW', NULL),
(112, 'Bavaria', 'DE', 'BY', NULL),
(113, 'Berlin', 'DE', 'BE', NULL),
(114, 'Brandenburg', 'DE', 'BB', NULL),
(115, 'Bremen', 'DE', 'HB', NULL),
(116, 'Hamburg', 'DE', 'HH', NULL),
(117, 'Hesse', 'DE', 'HE', NULL),
(118, 'Lower Saxony', 'DE', 'NI', NULL),
(119, 'Mecklenburg-Vorpommern', 'DE', 'MV', NULL),
(120, 'North Rhine-Westphalia', 'DE', 'NW', NULL),
(121, 'Rhineland-Palatinate', 'DE', 'RP', NULL),
(122, 'Saarland', 'DE', 'SL', NULL),
(123, 'Saxony', 'DE', 'SN', NULL),
(124, 'Saxony-Anhalt', 'DE', 'ST', NULL),
(125, 'Schleswig-Holstein', 'DE', 'SH', NULL),
(126, 'Thuringia', 'DE', 'TH', NULL),
(127, 'Auvergne-Rhone-Alpes', 'FR', 'ARA', NULL),
(128, 'Bourgogne-Franche-Comte', 'FR', 'BFC', NULL),
(129, 'Bretagne', 'FR', 'BRE', NULL),
(130, 'Centre-Val de Loire', 'FR', 'CVL', NULL),
(131, 'Corse', 'FR', 'COR', NULL),
(132, 'Grand-Est', 'FR', 'GES', NULL),
(133, 'Guadeloupe', 'FR', 'GUA', NULL),
(134, 'Hauts-de-France', 'FR', 'HDF', NULL),
(135, 'Ile-de-France', 'FR', 'IDF', NULL),
(136, 'Mayotte', 'FR', 'MAY', NULL),
(137, 'Normandie', 'FR', 'NOR', NULL),
(138, 'Nouvelle-Aquitaine', 'FR', 'NAQ', NULL),
(139, 'Occitanie', 'FR', 'OCC', NULL),
(140, 'Pays-de-la-Loire', 'FR', 'PDL', NULL),
(141, 'Provence-Alpes-Cote-d’Azur', 'FR', 'PAC', NULL),
(142, 'La Reunion', 'FR', 'LRE', NULL),
(143, 'Andalusia', 'ES', 'AN', NULL),
(144, 'Aragon', 'ES', 'AR', NULL),
(145, 'Principality of Asturias', 'ES', 'AS', NULL),
(146, 'Canary Islands', 'ES', 'CN', NULL),
(147, 'Cantabria', 'ES', 'CB', NULL),
(148, 'Castile and Leon', 'ES', 'CL', NULL),
(149, 'Castile-La Mancha', 'ES', 'CM', NULL),
(150, 'Catalonia', 'ES', 'CT', NULL),
(151, 'Ceuta', 'ES', 'CE', NULL),
(152, 'Extremadura', 'ES', 'EX', NULL),
(153, 'Galicia', 'ES', 'GA', NULL),
(154, 'Balearic Islands', 'ES', 'IB', NULL),
(155, 'La Rioja', 'ES', 'RI', NULL),
(156, 'Community of Madrid', 'ES', 'MD', NULL),
(157, 'Melilla', 'ES', 'ML', NULL),
(158, 'Region of Murcia', 'ES', 'MC', NULL),
(159, 'Chartered Community of Navarre', 'ES', 'NC', NULL),
(160, 'Basque Country', 'ES', 'PV', NULL),
(161, 'Valencian Community', 'ES', 'VC', NULL),
(162, 'District of Columbia', 'US', 'DC', NULL),
(163, 'Marshall Islands', 'US', 'MH', NULL),
(164, 'Abu Dhabi', 'AE', '', NULL),
(165, 'Ajman', 'AE', NULL, NULL),
(166, 'Dubai', 'AE', NULL, NULL),
(167, 'Fujairah', 'AE', NULL, NULL),
(168, 'Ras al-Khaimah', 'AE', NULL, NULL),
(169, 'Sharjah', 'AE', NULL, NULL),
(170, 'Umm al-Quwain', 'AE', NULL, NULL),
(171, 'Java', 'ID', 'JW', NULL),
(172, 'Kalimantan', 'ID', 'KA', NULL),
(173, 'Maluku Islands', 'ID', 'ML', NULL),
(174, 'Lesser Sunda Islands', 'ID', 'NU', NULL),
(175, 'Western New Guinea', 'ID', 'PP', NULL),
(176, 'Sulawesi', 'ID', 'SL', NULL),
(177, 'Sumatra', 'ID', 'SM', NULL),
(178, 'Vojvodina', 'RS', NULL, NULL),
(179, 'Belgrade', 'RS', NULL, NULL),
(180, 'Sumadija and Western Serbia', 'RS', NULL, NULL),
(181, 'Southern and Eastern Serbia', 'RS', NULL, NULL),
(182, 'Kosovo and Metohija', 'RS', NULL, NULL),
(183, 'National Capital Region', 'PH', '13', NULL),
(184, 'Cordillera Administrative Region', 'PH', '14', NULL),
(185, 'Ilocos Region', 'PH', '01', NULL),
(186, 'Cagayan Valley', 'PH', '02', NULL),
(187, 'Central Luzon', 'PH', '03', NULL),
(188, 'Calabarzon', 'PH', '04', NULL),
(189, 'Southwestern Tagalog Region', 'PH', '17', NULL),
(190, 'Bicol Region', 'PH', '05', NULL),
(191, 'Western Visayas', 'PH', '06', NULL),
(192, 'Central Visayas', 'PH', '07', NULL),
(193, 'Eastern Visayas', 'PH', '08', NULL),
(194, 'Zamboanga Peninsula', 'PH', '09', NULL),
(195, 'Northern Mindanao', 'PH', '10', NULL),
(196, 'Davao Region', 'PH', '11', NULL),
(197, 'Soccsksargen', 'PH', '12', NULL),
(198, 'Caraga', 'PH', '16', NULL),
(199, 'Bangsamoro', 'PH', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `id` int(11) NOT NULL,
  `storeid` varchar(255) NOT NULL,
  `storename` varchar(255) NOT NULL,
  `images` longtext NOT NULL,
  `description` text NOT NULL,
  `createdbyid` int(11) NOT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `createdbydate` datetime NOT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `clientid` int(11) NOT NULL,
  `storepagename` text NOT NULL,
  `storefaq` text NOT NULL,
  `storetrendy` int(11) NOT NULL,
  `storepopular` int(11) NOT NULL,
  `storemetatitle` text NOT NULL,
  `storemetadescription` text NOT NULL,
  `storemetacanonical` text NOT NULL,
  `storemetahone` text NOT NULL,
  `storemetaheadcontent` text NOT NULL,
  `storecategoryid` int(11) NOT NULL,
  `featuredstore` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`id`, `storeid`, `storename`, `images`, `description`, `createdbyid`, `modifiedbyid`, `status`, `createdbydate`, `modifiedbydate`, `deleted`, `clientid`, `storepagename`, `storefaq`, `storetrendy`, `storepopular`, `storemetatitle`, `storemetadescription`, `storemetacanonical`, `storemetahone`, `storemetaheadcontent`, `storecategoryid`, `featuredstore`, `country`) VALUES
(1, 'fdsf', 'sdf', 'null', '', 2, NULL, 'Active', '2021-03-07 01:52:34', NULL, 0, 2, 'sdf', '', 0, 0, '', '', '', '', '', 3, 'sdf', 'sfs'),
(2, '171304', 'Ernest%20Jones', '[\"2_ssl/StoreCategory/2021/crossABS16044917451615142823.png\"]', 'tste%20sdfg', 2, 2, 'Active', '2021-03-08 00:17:03', '2021-03-08 01:23:55', 0, 2, 'ernest-jones-coupon-%20codes', 'dfgsdfg%20dfg', 1, 1, '35%25%20Off%20Ernest%20Jones%20Coupons%2C%20Promo%20Codes%20and%20Deals%202020', 'Ernest%20Jones%20Coupons%2C%20Promo%20Codes%2C%20Discounts%2C%20and%20Offers%20Aug%202020%3A%20Get%20up%20to%2070%25%20off%20on%20clearance%20sale%20products.%20Select%20%26%20get%2065%25%20discount%20on%20Ernest%20Jones.', 'https%3A//clothingtrial.com/store/ernest-jones-coupon-codes', 'Ernest%20Jones%20Coupon%20and%20Promo%20Codes%20', 'Ernest%20Jones%20Coupons%2C%20Promo%20Codes%2C%20Discounts%2C%20and%20Offers%20Aug%202020%3A%20Get%20up%20to%2070%25%20off%20on%20clearance%20sale%20products.%20Select%20%26%20get%2065%25%20discount%20on%20Ernest%20Jones.', 2, 'FlexOffers', 'UK'),
(3, '171264', 'John%20Smedley', '[\"2_ssl/StoreCategory/2021/crossABS16044917451615146965.png\"]', '', 2, 2, 'Active', '2021-03-08 01:26:05', '2021-03-12 07:50:13', 0, 2, 'john-smedley-coupon-codes', '', 1, 1, '35%25%20Off%20John%20Smedley%20Coupons%2C%20Promo%20Codes%20and%20Deals%202020', 'John%20Smedley%20Coupons%2C%20Promo%20Codes%2C%20Discounts%2C%20and%20Offers%20Aug%202020%3A%20Get%20up%20to%2070%25%20off%20on%20clearance%20sale%20products.%20Select%20%26%20get%2065%25%20discount%20on%20John%20Smedley.', 'https%3A//clothingtrial.com/store/john-smedley-coupon-codes', 'John%20Smedley%20Coupon%20and%20Promo%20Codes%20', 'John%20Smedley%20Coupons%2C%20Promo%20Codes%2C%20Discounts%2C%20and%20Offers%20Aug%202020%3A%20Get%20up%20to%2070%25%20off%20on%20clearance%20sale%20products.%20Select%20%26%20get%2065%25%20discount%20on%20John%20Smedley.', 6, 'FlexOffers', 'UK');

-- --------------------------------------------------------

--
-- Table structure for table `tagnames`
--

CREATE TABLE `tagnames` (
  `id` int(11) NOT NULL,
  `tagname` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `query` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tax`
--

CREATE TABLE `tax` (
  `id` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `clientid` int(11) NOT NULL,
  `taxname` varchar(100) NOT NULL,
  `percentage` decimal(12,2) DEFAULT 0.00,
  `isservice` tinyint(1) DEFAULT 0,
  `isproduct` tinyint(1) DEFAULT 0,
  `taxgroupitem` longtext DEFAULT NULL,
  `clientcountrycode` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `taxcodecategory`
--

CREATE TABLE `taxcodecategory` (
  `id` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `taxcategoryname` varchar(100) DEFAULT NULL,
  `taxcode` int(11) DEFAULT NULL,
  `taxgroupid` int(11) DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `taxcodecategorytype` enum('Service','Product') DEFAULT NULL,
  `clientcountrycode` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `deleted` int(11) DEFAULT 0,
  `templatetype` enum('Email','SMS','Push Notification') DEFAULT 'Email',
  `templatetitle` varchar(200) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `notificationalias` varchar(100) DEFAULT NULL,
  `predefinedtags` varchar(500) DEFAULT NULL,
  `logintype` tinyint(1) NOT NULL DEFAULT 0,
  `clientpackfilter` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `timezone`
--

CREATE TABLE `timezone` (
  `id` int(11) NOT NULL,
  `abbreviation` varchar(45) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `offset` varchar(200) DEFAULT NULL,
  `offsetvalue` varchar(100) DEFAULT NULL,
  `countrycode` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `timezone`
--

INSERT INTO `timezone` (`id`, `abbreviation`, `name`, `offset`, `offsetvalue`, `countrycode`) VALUES
(1, 'IST', 'India Standard Time', 'UTC +5:30', '330', 'IN'),
(2, 'HST', 'Hawaii Standard Time', 'UTC -10', '-600', 'US'),
(3, 'AKDT', 'Alaska Daylight Time', 'UTC -8', '-480', 'US'),
(4, 'PDT', 'Pacific Daylight Time', 'UTC -7', '-420', 'US'),
(5, 'MST', 'Mountain Standard Time', 'UTC -7', '-420', 'US'),
(6, 'MDT', 'Mountain Daylight Time', 'UTC -6', '-360', 'US'),
(7, 'CDT', 'Central Daylight Time', 'UTC -5', '-300', 'US'),
(8, 'EDT', 'Eastern Daylight Time', 'UTC -4', '-240', 'US'),
(9, 'GST', 'Gulf Standard Time', 'UTC +4', '240', 'AE'),
(10, 'WIB', 'Western Indonesian Time', 'UTC +7', '420', 'ID'),
(11, 'WITA', 'Central Indonesian Time', 'UTC +8', '480', 'ID'),
(12, 'WIT', 'Eastern Indonesian Time', 'UTC +9', '540', 'ID'),
(13, 'PHT', 'Philippine Time', 'UTC +8', '480', 'PH'),
(14, 'CET', 'Central European Time', 'UTC +1', '60', 'RS');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `title` enum('Mr.','Ms.','Mrs.') DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `dateofjoining` date DEFAULT NULL,
  `dateofresigning` date DEFAULT NULL,
  `employeecode` varchar(50) NOT NULL,
  `emailid` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `panno` varchar(30) NOT NULL,
  `assignrole` int(11) DEFAULT NULL,
  `specialization` longtext DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `fathername` varchar(100) DEFAULT NULL,
  `contactnumber` varchar(20) DEFAULT NULL,
  `personalemailid` varchar(100) DEFAULT NULL,
  `bloodgroup` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `clientid` int(11) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `state` int(11) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL,
  `isowner` tinyint(1) DEFAULT 0,
  `ismembermobilevisible` tinyint(1) DEFAULT 0,
  `ismemberemailidvisible` tinyint(1) DEFAULT 0,
  `theme` longtext DEFAULT NULL,
  `unit` longtext DEFAULT NULL,
  `zoneid` int(11) DEFAULT NULL,
  `lastlogindate` datetime DEFAULT NULL,
  `lastcheckin` datetime DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `balance` decimal(12,2) DEFAULT 0.00,
  `defaultbranchid` int(11) NOT NULL,
  `agreedate` date DEFAULT NULL,
  `isenquirymobilevisible` tinyint(1) DEFAULT 0,
  `isenquiryemailidvisible` tinyint(1) DEFAULT 0,
  `appaccess` enum('Enable','Disable') NOT NULL DEFAULT 'Enable',
  `istrainer` tinyint(1) DEFAULT 0,
  `enablecomplimentarysale` tinyint(1) DEFAULT 0,
  `enablediscount` tinyint(1) DEFAULT 0,
  `enablediscountlimit` tinyint(1) DEFAULT 0,
  `maxdiscountperitem` decimal(12,2) DEFAULT NULL,
  `maxdiscountperinvoice` int(11) DEFAULT NULL,
  `maxmonthlylimit` int(11) DEFAULT NULL,
  `isbiometriclogs` tinyint(1) DEFAULT 0,
  `complimentarysalelimit` int(11) DEFAULT NULL,
  `covidrisk` enum('Low','Medium','High','None') DEFAULT NULL,
  `last_covid19submitdate` datetime DEFAULT NULL,
  `enableonlinelisting` tinyint(1) DEFAULT 0,
  `ptcommssion` decimal(12,2) DEFAULT 0.00,
  `enableonlinetraining` tinyint(1) DEFAULT 0,
  `professionaldetails` varchar(600) DEFAULT NULL,
  `ispregnant` tinyint(1) DEFAULT 0,
  `ptcommissiontype` enum('Fixed','Percentage') DEFAULT NULL,
  `googletoken` longtext DEFAULT NULL,
  `isgooglecalendarenabled` tinyint(1) DEFAULT 0,
  `daysforbackdatedinvoice` int(11) DEFAULT 7,
  `timezoneoffsetvalue` varchar(100) DEFAULT NULL,
  `shifttiming` longtext DEFAULT NULL,
  `schedule` longtext DEFAULT NULL,
  `advancepayment` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `deleted`, `title`, `firstname`, `lastname`, `dateofjoining`, `dateofresigning`, `employeecode`, `emailid`, `password`, `gender`, `panno`, `assignrole`, `specialization`, `image`, `phone`, `mobile`, `fathername`, `contactnumber`, `personalemailid`, `bloodgroup`, `dateofbirth`, `address1`, `address2`, `city`, `country`, `pincode`, `clientid`, `status`, `state`, `salary`, `isowner`, `ismembermobilevisible`, `ismemberemailidvisible`, `theme`, `unit`, `zoneid`, `lastlogindate`, `lastcheckin`, `createdbyid`, `createdbydate`, `modifiedbyid`, `modifiedbydate`, `balance`, `defaultbranchid`, `agreedate`, `isenquirymobilevisible`, `isenquiryemailidvisible`, `appaccess`, `istrainer`, `enablecomplimentarysale`, `enablediscount`, `enablediscountlimit`, `maxdiscountperitem`, `maxdiscountperinvoice`, `maxmonthlylimit`, `isbiometriclogs`, `complimentarysalelimit`, `covidrisk`, `last_covid19submitdate`, `enableonlinelisting`, `ptcommssion`, `enableonlinetraining`, `professionaldetails`, `ispregnant`, `ptcommissiontype`, `googletoken`, `isgooglecalendarenabled`, `daysforbackdatedinvoice`, `timezoneoffsetvalue`, `shifttiming`, `schedule`, `advancepayment`) VALUES
(1, 0, 'Mr.', 'Vishal', 'Solanki', '2018-09-19', NULL, 'EMP0014', 'fpladmin@gmail.com', '519a8eb8605326b8f6139aa0e4d8acc5', 'Male', '99999999', 2, NULL, '1_app/2018/5341534572024.png', '77777777', '8887766666', 'test', '8777777778', 'jjjjjjjj@gmail.com', 'A-', '2000-09-13', 'ojsdfh', 'sdsdfjsdf%20', 'hhhhhhhhh', 'IN', '989898', 1, 'Active', 4, 30000, 1, 1, 1, NULL, NULL, NULL, '2021-02-01 17:13:17', '2021-01-13 13:56:08', NULL, NULL, 1, '2020-02-27 12:45:20', 0.00, 1, '2020-09-10', 1, 1, 'Enable', 0, 0, 1, 0, NULL, NULL, NULL, 0, NULL, 'None', '2020-08-05 10:56:05', 0, 0.00, 0, NULL, 0, NULL, NULL, 0, 7, '330', NULL, NULL, 0.00),
(2, 0, 'Mr.', 'Harmesh', 'Sanghvi', NULL, NULL, 'EMP0001', 'sanghviharmesh06@gmail.com', '7503fb13dbae7dd77d9a8ecfd1d708e3', 'Male', '', 173, '[\"\"]', NULL, '', '8238380029', '', '', '', NULL, NULL, '', '', '', NULL, '', 2, 'Active', NULL, 25000, 1, 1, 1, NULL, '{\"lengthunit\": \"cm\", \"weightunit\": \"kg\", \"distanceunit\": \"km\"}', NULL, '2021-04-04 05:43:33', '2020-02-14 11:13:26', NULL, NULL, 2, '2021-03-16 02:48:15', 3750.00, 2, '2020-09-07', 1, 1, 'Enable', 0, 0, 1, 1, 100.00, NULL, NULL, 1, NULL, 'None', '2020-10-16 09:59:28', 0, 0.00, 0, '', 0, NULL, NULL, 0, 7, '330', '[{\"endtime\":null,\"starttime\":null}]', '[{\"name\":\"Sunday\",\"short\":\"SUN\",\"value\":\"0\",\"checked\":false},{\"name\":\"Monday\",\"short\":\"MON\",\"value\":\"1\",\"checked\":false},{\"name\":\"Tuesday\",\"short\":\"TUE\",\"value\":\"2\",\"checked\":false},{\"name\":\"Wednesday\",\"short\":\"WED\",\"value\":\"3\",\"checked\":false},{\"name\":\"Thursday\",\"short\":\"THU\",\"value\":\"4\",\"checked\":false},{\"name\":\"Friday\",\"short\":\"FRI\",\"value\":\"5\",\"checked\":false},{\"name\":\"Saturday\",\"short\":\"SAT\",\"value\":\"6\",\"checked\":false}]', 0.00),
(5, 0, 'Mr.', 'Tambola', 'Admin', NULL, NULL, 'EMP0002', 'tambola@admin.com', '277cf9dae5f4e6ef2839c99318ad498f', 'Male', '', 174, '[\"\"]', NULL, '', '9898989898', '', '', '', NULL, NULL, '', '', '', 'IN', '', 2, 'Active', NULL, 0, 0, 0, 0, NULL, NULL, NULL, '2021-04-04 05:46:09', NULL, 2, '2021-03-12 08:19:39', 2, '2021-03-22 16:36:47', 0.00, 2, NULL, 0, 0, 'Enable', 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0.00, 0, '', 0, NULL, NULL, 0, 7, '330', '[{\"starttime\":null,\"endtime\":null}]', '[{\"short\":\"SUN\",\"name\":\"Sunday\",\"value\":\"0\",\"checked\":false},{\"short\":\"MON\",\"name\":\"Monday\",\"value\":\"1\",\"checked\":false},{\"short\":\"TUE\",\"name\":\"Tuesday\",\"value\":\"2\",\"checked\":false},{\"short\":\"WED\",\"name\":\"Wednesday\",\"value\":\"3\",\"checked\":false},{\"short\":\"THU\",\"name\":\"Thursday\",\"value\":\"4\",\"checked\":false},{\"short\":\"FRI\",\"name\":\"Friday\",\"value\":\"5\",\"checked\":false},{\"short\":\"SAT\",\"name\":\"Saturday\",\"value\":\"6\",\"checked\":false}]', 0.00),
(6, 0, 'Mr.', 'Agent', '1', NULL, NULL, 'EMP0003', 'agent1@demo.com', '7503fb13dbae7dd77d9a8ecfd1d708e3', 'Male', '', 175, '[\"\"]', NULL, '', '9898989898', '', '', '', NULL, NULL, '', '', '', 'IN', '', 2, 'Active', NULL, 0, 0, 0, 0, NULL, NULL, NULL, '2021-04-02 01:52:52', NULL, 2, '2021-03-22 15:34:41', 2, '2021-03-22 16:36:55', 0.00, 2, NULL, 0, 0, 'Enable', 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0.00, 0, '', 0, NULL, NULL, 0, 7, '330', '[{\"starttime\":null,\"endtime\":null}]', '[{\"short\":\"SUN\",\"name\":\"Sunday\",\"value\":\"0\",\"checked\":false},{\"short\":\"MON\",\"name\":\"Monday\",\"value\":\"1\",\"checked\":false},{\"short\":\"TUE\",\"name\":\"Tuesday\",\"value\":\"2\",\"checked\":false},{\"short\":\"WED\",\"name\":\"Wednesday\",\"value\":\"3\",\"checked\":false},{\"short\":\"THU\",\"name\":\"Thursday\",\"value\":\"4\",\"checked\":false},{\"short\":\"FRI\",\"name\":\"Friday\",\"value\":\"5\",\"checked\":false},{\"short\":\"SAT\",\"name\":\"Saturday\",\"value\":\"6\",\"checked\":false}]', 0.00),
(7, 0, 'Mr.', 'Rascal', 'Pandey', '2021-04-02', NULL, 'EMP0004', 'rascal@pandey.com', 'b12eec92cb6a557b6ee86d20c23bce88', 'Male', '', 175, '[\"\"]', NULL, '', '9865676534', '', '', '', NULL, NULL, '', '', '', 'IN', '', 2, 'Active', NULL, 0, 0, 0, 0, NULL, NULL, NULL, '2021-04-02 01:59:59', NULL, 5, '2021-04-02 01:57:53', NULL, NULL, 0.00, 2, NULL, 0, 0, 'Enable', 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0.00, 0, '', 0, NULL, NULL, 0, 7, '330', '[{\"starttime\":null,\"endtime\":null}]', '[{\"short\":\"SUN\",\"name\":\"Sunday\",\"value\":\"0\",\"checked\":false},{\"short\":\"MON\",\"name\":\"Monday\",\"value\":\"1\",\"checked\":false},{\"short\":\"TUE\",\"name\":\"Tuesday\",\"value\":\"2\",\"checked\":false},{\"short\":\"WED\",\"name\":\"Wednesday\",\"value\":\"3\",\"checked\":false},{\"short\":\"THU\",\"name\":\"Thursday\",\"value\":\"4\",\"checked\":false},{\"short\":\"FRI\",\"name\":\"Friday\",\"value\":\"5\",\"checked\":false},{\"short\":\"SAT\",\"name\":\"Saturday\",\"value\":\"6\",\"checked\":false}]', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `userattendance`
--

CREATE TABLE `userattendance` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `attendancetype` enum('Check-in','Check-out') DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `intime` datetime DEFAULT NULL,
  `outtime` datetime DEFAULT NULL,
  `difference` int(11) DEFAULT NULL,
  `branchid` int(11) NOT NULL,
  `distance` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `usercommission`
--

CREATE TABLE `usercommission` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `ptattendanceid` int(11) DEFAULT NULL,
  `classattendanceid` int(11) DEFAULT NULL,
  `classid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT current_timestamp(),
  `deleted` tinyint(1) DEFAULT 0,
  `commission` decimal(12,2) DEFAULT NULL,
  `branchid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `userrating`
--

CREATE TABLE `userrating` (
  `id` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `userid` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `feedback` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wrongattendance`
--

CREATE TABLE `wrongattendance` (
  `ptid` int(11) NOT NULL DEFAULT 0,
  `member` int(11) NOT NULL DEFAULT 0,
  `consumedminutes` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL DEFAULT 0,
  `branchid` int(11) NOT NULL,
  `userid` varchar(61) CHARACTER SET latin1 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `zone`
--

CREATE TABLE `zone` (
  `id` int(11) NOT NULL,
  `deleted` int(11) DEFAULT 0,
  `zonename` varchar(100) DEFAULT NULL,
  `createdbyid` int(11) DEFAULT NULL,
  `createdbydate` datetime DEFAULT NULL,
  `modifiedbyid` int(11) DEFAULT NULL,
  `modifiedbydate` datetime DEFAULT NULL,
  `clientid` int(11) DEFAULT NULL,
  `branchlist` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `biometric`
--
ALTER TABLE `biometric`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branch_unique` (`deleted`,`branchname`,`clientid`);

--
-- Indexes for table `changeexpiryhistory`
--
ALTER TABLE `changeexpiryhistory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `useremail_UNIQUE` (`useremail`),
  ADD UNIQUE KEY `UK_client_clientcode` (`clientcode`),
  ADD UNIQUE KEY `redirecturi_UNIQUE` (`redirecturi`),
  ADD KEY `redirecturo_index` (`redirecturi`);

--
-- Indexes for table `clientnotificationconfiguration`
--
ALTER TABLE `clientnotificationconfiguration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clientregistrationrequest`
--
ALTER TABLE `clientregistrationrequest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `continent`
--
ALTER TABLE `continent`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`code`),
  ADD KEY `continent_code` (`continent_code`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbackcomment`
--
ALTER TABLE `feedbackcomment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gametickets`
--
ALTER TABLE `gametickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gameid` (`gameid`);

--
-- Indexes for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_tokens`
--
ALTER TABLE `oauth_tokens`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `pushsubscription`
--
ALTER TABLE `pushsubscription`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequence`
--
ALTER TABLE `sequence`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_SEQ_CLIENT` (`alias`,`client_id`),
  ADD KEY `FK_SEQ_CLIENT_idx` (`client_id`);

--
-- Indexes for table `sessiontype`
--
ALTER TABLE `sessiontype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_code` (`country_code`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tagnames`
--
ALTER TABLE `tagnames`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax`
--
ALTER TABLE `tax`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `taxcodecategory`
--
ALTER TABLE `taxcodecategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timezone`
--
ALTER TABLE `timezone`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_client_user` (`emailid`,`clientid`),
  ADD UNIQUE KEY `uk_client_usercode` (`employeecode`,`clientid`),
  ADD KEY `FK_COUNTRY` (`country`),
  ADD KEY `FK_STATE` (`state`),
  ADD KEY `FK_CLIENT_idx` (`clientid`);

--
-- Indexes for table `userattendance`
--
ALTER TABLE `userattendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usercommission`
--
ALTER TABLE `usercommission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userrating`
--
ALTER TABLE `userrating`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `biometric`
--
ALTER TABLE `biometric`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `changeexpiryhistory`
--
ALTER TABLE `changeexpiryhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clientnotificationconfiguration`
--
ALTER TABLE `clientnotificationconfiguration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientregistrationrequest`
--
ALTER TABLE `clientregistrationrequest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedbackcomment`
--
ALTER TABLE `feedbackcomment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `gametickets`
--
ALTER TABLE `gametickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9905;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oauth_tokens`
--
ALTER TABLE `oauth_tokens`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `pushsubscription`
--
ALTER TABLE `pushsubscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT for table `sequence`
--
ALTER TABLE `sequence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `sessiontype`
--
ALTER TABLE `sessiontype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tagnames`
--
ALTER TABLE `tagnames`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tax`
--
ALTER TABLE `tax`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `taxcodecategory`
--
ALTER TABLE `taxcodecategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timezone`
--
ALTER TABLE `timezone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `userattendance`
--
ALTER TABLE `userattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usercommission`
--
ALTER TABLE `usercommission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userrating`
--
ALTER TABLE `userrating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `country`
--
ALTER TABLE `country`
  ADD CONSTRAINT `fk_country_continent` FOREIGN KEY (`continent_code`) REFERENCES `continent` (`code`);

--
-- Constraints for table `sequence`
--
ALTER TABLE `sequence`
  ADD CONSTRAINT `FK_SEQ_CLIENT` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);

--
-- Constraints for table `state`
--
ALTER TABLE `state`
  ADD CONSTRAINT `fk_state_country` FOREIGN KEY (`country_code`) REFERENCES `country` (`code`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_CLIENT` FOREIGN KEY (`clientid`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `FK_COUNTRY` FOREIGN KEY (`country`) REFERENCES `country` (`code`),
  ADD CONSTRAINT `FK_STATE` FOREIGN KEY (`state`) REFERENCES `state` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


DELIMITER $$
CREATE  PROCEDURE `USPgameallsalessearch`(IN `client_id` INT, IN `user_id` INT)
BEGIN

declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

select ticketid, customer, concat(u.firstname, ' ', u.lastname) agentname  from gametickets g inner join user u
on u.id = g.salesbyid where gameid = _gameid ;

END$$
DELIMITER ;



DROP procedure IF EXISTS `USPgamestaffwisesales`;


DELIMITER $$
CREATE PROCEDURE `USPgamestaffwisesales`(IN `client_id` INT)
BEGIN

	declare _gameid int;

	select id  into _gameid
    from game where status = 1 order by id desc limit 1;

     select count(1) ticketcount from gametickets gt
     where gt.gameid = _gameid ;

     select count(1) salescount, concat(u.firstname, ' ', u.lastname) staffname, salesbyid from gametickets gt
    inner join user u on gt.salesbyid  = u.id where gt.gameid = _gameid group by u.id ;


END$$

DELIMITER ;
;





DROP procedure IF EXISTS `USPgamepageview`;

DELIMITER $$
CREATE  PROCEDURE `USPgamepageview`(IN `client_id` INT)
BEGIN
    declare _gameid int;
    declare _launchdate datetime;
    declare _drawsequence,_called_numbers text;
        declare _winners longtext;

    select id,launchdate,drawsequence,called_numbers,winners
    into _gameid,_launchdate,_drawsequence,_called_numbers,_winners
    from game where status = 1 and deleted = 0 order by id desc limit 1;

    select  _gameid id,_launchdate launchdate,now() currentdate,_drawsequence drawsequence, _called_numbers called_numbers,_winners winners;
    select * from gametickets where gameid = _gameid;

END$$

DELIMITER ;
;
