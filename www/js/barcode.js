function scanBarcode(){
    plugins.barcodeScanner.scan(
      function (result) {
        if(result.cancelled===true){
            $('div.panel').html('<div class="inf">خواندن بارکد کنسل شده</div>');
        }else{
            var res = result.text;
            var ht = '';
            res = res.split("\n");
            if(res.length===3){
                //Class
                var code = res[0];
                var title = res[1];
                var department = res[2];
                ht = '<div class="class_info">';
                ht += '<h2>'+title+'['+code+']</h2>';
                ht += '<h3>'+department+'</h3>';
                var dt = new Date();
                var c = loadCode(code);
                if(c.code==='0'){
                    tmp_codes.push(code);
                    codes.push({
                        code : code,
                        reg_date : dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds()
                    });
                    c = loadCode(code);
                }else{
                    c = addDate(code, dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds());
                }
                current_class.code = code;
                current_class.start = c.reg_date;
                var tim;
                for(var j = 0;j < c.reg_date.length;j++){
                    tim = c.reg_date[j].split(' ')[1];
                    ht += '<div class="time-div">'+tim+'</div>';   
                }
                createFile(dirEntry, "db.txt",'code|'+code+'|'+dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds()+"\n", true);
            }else if(res.length===4){
                //people
                var code = current_class.code;
                if(code !== '0'){
                    var dt = new Date();
                    var c = {
                        code : current_class.code,
                        reg_date : [dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds()]
                    };
                    var people = {
                        code : res[1],
                        fname : res[2],
                        lname : res[3],
                        class_codes : [c]
                    };
                    var people_location = -1;
                    for(var people_i = 0;people_i < peoples.length;people_i++){
                        if(people.code===peoples[people_i].code){
                            people_location = people_i;
                        }
                    }
                    ht = '<div class="inf">';
                    ht += people.fname+' '+people.lname+' ثبت شد .';
                    ht += '</div>'
                    if(people_location===-1){
                        peoples.push(people);
                    }else{
                        var ccodes = peoples[people_location].class_codes;
                        for(var ci = 0;ci < ccodes.length;ci++){
                            if(ccodes[ci].code === c.code){
                                peoples[people_location].class_codes[ci].reg_date.push(dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds());
                            }
                        }
                    }
                    createFile(dirEntry, "db.txt",'people|'+code+'|'+people.code+'|'+people.fname+'|'+people.lname+'|'+dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+' '+dt.getHours()+':'+dt.getMinutes()+':'+dt.getSeconds()+"\n", true);                        
                }else{
                    ht = '<div class="err">جهت حضور زدن دیگران ابتدا می بایست کلاس را خودتان حضور بزنید<div>';
                }
            }else{
                ht = '<div class="err">بارکد صحیح نیست یا بدرستی اسکن نشده است<div>';
            }
            $('#page-main div.panel').html(ht);
        }
      }, 
      function (error) {
          alert("خطا در خواندن بارکد: \n" + error);
      }
    );
}