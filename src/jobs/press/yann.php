<?PHP
            ini_set('memory_limit', '2024M');
            mb_internal_encoding("UTF-8");
            require_once($_SERVER["DOCUMENT_ROOT"]."/GenJson/GenGeneral.php");
 
            $mois["janvier"] = "01";
            $mois["février"] = "02";
            $mois["mars"] = "03";
            $mois["avril"] = "04";
            $mois["mai"] = "05";
            $mois["juin"] = "06";
            $mois["juillet"] = "07";
            $mois["aout"] = "08";
            $mois["septembre"] = "09";
            $mois["octobre"] = "10";
            $mois["novembre"] = "11";
            $mois["décembre"] = "12";
 
            require_once("simple_html_dom.php");
 
            $current = date('Y-m-d H:i:s');
            $current2 = date('Y-m-d H:i');
 
            $sql = "SELECT * FROM rgp_survey_311142 WHERE 1 ;";
            $reponse = $bdd->query($sql);
            if($reponse->rowCount()==0)
            {
                        while ($donneesNC = $reponse->fetch())
                        {
                                    $V1 = $donneesNC["311142X96X1763"];
                                    $V2 = $donneesNC["311142X96X1764"];
                                    if($V1=="P3"||$V1=="A4") $V2 = $donneesNC["311142X96X1767"];
                                    $V3[$V1][$V2] = "ok";
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/DepAEF3.xml') or die("Error: Cannot create object DepAEF3.xml");
                        if($ihj==5) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/DepAEF2.xml') or die("Error: Cannot create object DepAEF2.xml");
                       
                        if($ihj==2) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/DepAEF.xml') or die("Error: Cannot create object DepAEF.xml");
                       
                        if($ihj==1) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/DepAefArchives3.xml') or die("Error: Cannot create object DepAefArchives3.xml");
                       
                        if($ihj==3) $xml = simplexml_load_file('https://paysage.mesri.fr/exe/PresseXml/DepAefArchives2.xml') or die("Error: Cannot create object DepAefArchives2.xml");
                       
                        if($ihj==4) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/DepAefArchives.xml') or die("Error: Cannot create object DepAefArchives.xml");
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
                                    if(preg_match('/https:\/\/www.aefinfo.fr\/depeche\/\d{1,10}/',$Alert->Link,$matches))
                                    {
                                               $item['link'] = $matches[0];
                                    }
                                    if(preg_match('/\d{3,10}/',$item['link'],$matches))
                                    {
                                               $item['id'] = $matches[0];
                                    }
 
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "O1";
                                               $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = $Values->date;
                                               $item['auteur'] = $Values->auteur;
                                               $item['numro'] = $Values->numro;
                                               $item['text'] = "";
 
                                               if($item['details']!="")
                                               {
                                                           $date1 = "";
                                                           $date2 = "";
 
                                                           if(preg_match('/\d{2}\/\d{2}\/\d{4}/',$item['details'],$matches))
                                                           {
                                                                       $date1 = $matches[0];
                                                           }
                                                           if(preg_match('/\d{2}h\d{2}/',$item['details'],$matches))
                                                           {
                                                                       $date2 = $matches[0];
                                                           }
                                                           if($date1!=""&&$date2!="")
                                                           {
                                                                       $item['date'] = substr($date1,6,4)."-".substr($date1,3,2)."-".substr($date1,0,2)." ".substr($date2,0,2).":".substr($date2,3,2).":00";
                                                           }
                                               }
 
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['id'];
                                    //echo json_encode($item);
                                    //exit();
                                    if($item['id']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'O1' AND 311142X96X1764 = '".$item['id']."' ;";
                                               $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`, `311142X96X1768`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N', '".trim(addslashes($item['auteur']))."');";
                                                           $reponse = $bdd->query($sql);
 
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                                           //exit();
                                               }
                                    }
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/News_tank4.xml') or die("Error: Cannot create object News_tank4.xml");
                        if($ihj==3) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/News_tank3.xml') or die("Error: Cannot create object News_tank3.xml");
                        if($ihj==2) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/News_tank2.xml') or die("Error: Cannot create object News_tank2.xml");
                        if($ihj==1) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/News_tank.xml') or die("Error: Cannot create object News_tank.xml");
 
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "O2";
                                               $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = $Values->date;
                                               $item['text'] = "";
 
                                               if($item['details']!="")
                                               {
                                                           $date1 = "";
                                                           $date2 = "";
 
                                                           if(preg_match('/\d{2}\/\d{2}\/\d{4}/',$item['details'],$matches))
                                                           {
                                                                       $date1 = $matches[0];
                                                           }
                                                           if(preg_match('/\d{2}:\d{2}/',$item['details'],$matches))
                                                           {
                                                                       $date2 = $matches[0];
                                                           }
                                                           if($date1!=""&&$date2!="")
                                                           {
                                                                       $item['date'] = substr($date1,6,4)."-".substr($date1,3,2)."-".substr($date1,0,2)." ".$date2.":00";
                                                           }
                                                           if(preg_match('/\d{3,10}/',$item['details'],$matches))
                                                           {
                                                                       $item['id'] = $matches[0];
                                                           }
                                               }
 
                                               $item['link'] = $Values->lien;
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['id'];
                                    if($item['id']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'O2' AND 311142X96X1764 = '".$item['id']."' ;";
                                                $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1768`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N');";
                                                           $reponse = $bdd->query($sql);
 
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                               }
                                    }
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/figaro_01.xml') or die("Error: Cannot create object figaro_01.xml");
                       
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
                                    if(preg_match('/https:\/\/etudiant\.lefigaro\.fr\/article\/[A-Za-z0-9-_]+\//',$Alert->Link,$matches))
                                    {
                                               $item['link'] = $matches[0];
                                    }
                                    if(preg_match('/https:\/\/etudiant\.lefigaro\.fr\/article\/[[:graph:]]+_([[:graph:]]+)\//',$item['link'],$matches))
                                    {
                                               $item['id'] = $matches[1];
                                    }
 
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "O6";
                                                $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = $Values->auteur;
                                               $item['numro'] = $item['id'];
                                               $item['text'] = $Values->texte;
 
                                               if($item['details']!="")
                                               {
                                                           $date1 = "";
                                                           $date2 = "";
 
                                                           if(preg_match('/Publié le (\d{2}\/\d{2}\/\d{4})/',$item['details'],$matches))
                                                           {
                                                                       $date1 = $matches[1];
                                                           }
                                                           if(preg_match('/\d{2}:\d{2}/',$item['details'],$matches))
                                                           {
                                                                       $date2 = $matches[0];
                                                           }
                                                           if($date1!=""&&$date2!="")
                                                           {
                                                                       $item['date'] = substr($date1,6,4)."-".substr($date1,3,2)."-".substr($date1,0,2)." ".substr($date2,0,2).":".substr($date2,3,2).":00";
                                                           }
 
                                                           if(preg_match('/Par (\D+) Publié le/',$item['details'],$matches))
                                                           {
                                                                       $item['auteur'] = trim(substr(trim($matches[1]),0,-4));
                                                           }
                                                          
                                               }
 
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['id'];
                                    if($item['id']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'O6' AND 311142X96X1764 = '".$item['id']."' ;";
                                               $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`, `311142X96X1768`, `311142X96X1774`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N', '".trim(addslashes($item['auteur']))."', '".trim(addslashes($item['text']))."');";
                                                           $reponse = $bdd->query($sql);
 
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                               }
                                    }
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/EducPro_00.xml') or die("Error: Cannot create object EducPro_00.xml");
                       
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
                                    if(preg_match('/https:\/\/www\.letudiant\.fr\/educpros\/actualite\/([A-Za-z0-9-_]+).html/',$Alert->Link,$matches))
                                    {
                                               $item['link'] = $matches[0];
                                               $item['id'] = $matches[1];
                                    }
 
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "O7";
                                               $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = $Values->auteur;
                                               $item['numro'] = $item['id'];
                                               $item['text'] = $Values->texte;
 
                                               if($item['details']!="")
                                               {
                                                           $date1 = "";
                                                           $date2 = "";
 
                                                           if(preg_match('/Publié le (\d{2}\.\d{2}\.\d{4})/',$item['details'],$matches))
                                                           {
                                                                       $date1 = $matches[1];
                                                           }
                                                           if(preg_match('/\d{2}H\d{2}/',$item['details'],$matches))
                                                           {
                                                                       $date2 = $matches[0];
                                                           }
                                                           if($date1!=""&&$date2!="")
                                                           {
                                                                       $item['date'] = substr($date1,6,4)."-".substr($date1,3,2)."-".substr($date1,0,2)." ".substr($date2,0,2).":".substr($date2,3,2).":00";
                                                           }
 
                                                           if(preg_match('/(\D+) Publié le/',$item['details'],$matches))
                                                           {
                                                                       $item['auteur'] = trim($matches[1]);
                                                           }
                                                          
                                               }
 
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['id'];
                                    if($item['id']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'O7' AND 311142X96X1764 = '".$item['id']."' ;";
                                               $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`, `311142X96X1768`, `311142X96X1774`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N', '".trim(addslashes($item['auteur']))."', '".trim(addslashes($item['text']))."');";
                                                           $reponse = $bdd->query($sql);
 
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                               }
                                    }
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/A_DGS.xml') or die("Error: Cannot create object A_DGS.xml");
 
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
 
                                    $tgf=explode("#",$Alert->Link);
                                   
                                    if(substr($tgf[0],0,21)=="https://www.a-dgs.fr/")
                                    {
                                               $item['link'] = $tgf[0];
                                    }
                                   
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "P3";
                                               $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = "";
                                               $item['auteur'] = "";
                                               $item['numro'] = "";
                                               $item['text'] = $Values->texte;
                                               $item['id'] = "";
 
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['link'];
                                    if($item['link']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'P3' AND 311142X96X1767 = '".$item['link']."' ;";
                                               $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           echo $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`, `311142X96X1768`, `311142X96X1774`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N', '".trim(addslashes($item['auteur']))."', '".trim(addslashes($item['text']))."');";
                                                           $reponse = $bdd->query($sql);
                                                           echo "<br>";
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                               }
                                    }
                        }
            }
 
            for($ihj=0;$ihj<=0;$ihj++)
            {
                        if($ihj==0) $xml = simplexml_load_file('http://kbc169.kbplatform.com/Exports/Mapper/educpros/personnalites.xml') or die("Error: Cannot create object personnalites.xml");
 
                        foreach ($xml->Alert as $Alert) {
                                    unset($item);
 
                                    $tgf=explode("#",$Alert->Link);
                                   
                                    if(substr($tgf[0],0,48)=="https://www.letudiant.fr/educpros/personnalites/")
                                    {
                                               $item['link'] = $tgf[0];
                                    }
                                   
                                    foreach ($Alert->MapperValuesMailer->Index as $Values) {
                                               $item['source']     = "A4";
                                               $item['title']     = $Values->titre;
                                               $item['intro']    = $Values->intro;
                                               $item['details'] = "";
                                               $item['auteur'] = "";
                                               $item['numro'] = "";
                                               $item['text'] = "";
                                               $item['id'] = "";
 
                                               $articles[] = $item;
                                    }
                                    $V1 = $item['source'];
                                    $V2 = $item['link'];
                                    if($item['link']!=""&&$V3[$V1][$V2]==""&&$V1!="")
                                    {
                                               $sql = "SELECT * FROM rgp_survey_311142 WHERE 311142X96X1763 = 'A4' AND 311142X96X1767 = '".$item['link']."' ;";
                                               $reponse = $bdd->query($sql);
                                               if($reponse->rowCount()==0)
                                               {
                                                           $nb = 1;
                                                           while ($nb>0)
                                                           {
                                                                       $t = random("10");
                                                                       $reponse4 = $bdd->query("SELECT * FROM rgp_tokens_311142 WHERE token = '".$t."' ;");
 
                                                                       $nb = 0;
                                                                       while ($donnees = $reponse4->fetch())
                                                                       {
                                                                                   $nb++;
                                                                       }
                                                           }
 
                                                           $sql = "INSERT INTO `rgp_survey_311142` (`token`, `submitdate`, `lastpage`, `startlanguage`, `startdate`, `datestamp`, `ipaddr`, `311142X96X1754`, `311142X96X1755`, `311142X96X1757`, `311142X96X1763`, `311142X96X1764`, `311142X96X1766`, `311142X96X1765`, `311142X96X1767`, `311142X96X1748`, `311142X96X1758`, `311142X96X1759`, `311142X96X1750`, `311142X96X1752`, `311142X96X1751`, `311142X96X1770`, `311142X96X1771`, `311142X96X1768`, `311142X96X1774`) VALUES ('$t', '$current', 1, 'fr', '$current', '$current', '193.48.4.6', '', '', '', '".$item['source']."', '".$item['id']."', '".trim(addslashes($item['intro']))."', '".trim(addslashes($item['title']))."', '".$item['link']."', 'A', 'N', NULL, '".$item['date']."', 'N', '', '', 'N', '".trim(addslashes($item['auteur']))."', '".trim(addslashes($item['text']))."');";
                                                          
                                                           $reponse = $bdd->query($sql);
                                                           $sql = "INSERT INTO `rgp_tokens_311142` (`firstname`, `lastname`, `email`, `emailstatus`, `token`, `language`, `blacklisted`, `sent`, `remindersent`, `remindercount`, `completed`, `usesleft`, `validfrom`, `validuntil`, `mpid`, `attribute_1`, `attribute_2`, `attribute_3`, `attribute_4`) VALUES ('', '', '', 'OK', '$t', 'fr', NULL, 'N', 'N', 0, '$current2', 0, NULL, NULL, NULL, '', '291JP', '291JP', '');";
                                                           $reponse = $bdd->query($sql);
                                                          
                                                           $V3[$V1][$V2] = "ok";
                                               }
                                    }
                        }
            }
 
            echo "Fin";
            //$url = 'https://paysage.mesri.fr/exe/depeche2.php';
            //$img = file_get_contents($url);
            echo "done";
?>