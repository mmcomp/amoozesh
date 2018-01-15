function createFile(direEntry, fileName,data,isAppend,fn) {
    direEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
        filEntry = fileEntry;
        writeFile(fileEntry, data, isAppend,fn);
    }, onErrorCreateFile);

}
function writeFile(fileEntry, dataObj, isAppend,fn) {
    fileEntry.createWriter(function (fileWriter) {
        if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
                if(typeof fn === 'function'){
                    fn();
                }
            }
            catch (e) {
            }
        }
        fileWriter.write(dataObj);
    });
}
function readFile(fileEntry,fn) {
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            if(typeof fn === 'function'){
                fn(this.result);
            }else{
                alert(this.result);
            }
        };

        reader.readAsText(file)

    }, onErrorReadFile);
}
function onErrorCreateFile(inp){
    alert('onErrorCreateFile');
}
function onErrorLoadFs(inp){
    alert('onErrorLoadFs');
}
function onErrorReadFile(inp){
    alert('onErrorReadFile');
}


function readData(){
    // alert(current_class.code);
    // alert(current_class.start.join("\n"));
    var c = loadCode(current_class.code);
    // alert(c.reg_date);
    readFile(filEntry);
}
function clearData(){
    writeFile(filEntry, '', false);
    codes = [];
    tmp_codes = [];
    var current_class = {
            code : '0',
            start : [],
            form_opinion : {
                answers : [],
                suggestion : ''
            }, 
            teacher_opinion : {
                answers : [],
                texts : []
            },
            peoples : []
    };
    
    malert('اطلاعات شما پاک شد');
}
function getCodes(fn){
    // alert('getting codes');
    readFile(filEntry, function(result){
        // alert(result);
        var tmp = result.split("\n");
        var line;
        var obj;
        for(var i = 0;i < tmp.length;i++){
            // alert(tmp);
            line = tmp[i].split("|");
            if(line[0]==='code'){
                if($.inArray(line[1],tmp_codes)===-1){
                    tmp_codes.push(line[1]);
                    obj = {
                        code : line[1],
                        reg_date : [line[2]]
                    };
                    // alert(obj.code+' added');
                    codes.push(obj);
                }else{
                    // alert('teekrari');
                    for(var j = 0;j < codes.length;j++){
                        if(codes[j].code===line[1]){
                            codes[j].reg_date.push(line[2]);
                        }
                    }
                }
            }else if(line[0]==='people'){
                // console.log(line);
                var code = line[1];
                var people = {
                    code : line[2],
                    fname : line[3],
                    lname : line[4],
                    class_codes : [{
                        code : code,
                        reg_date : [line[5]]
                    }]
                };
                var loc = -1;
                var cloc = -1;
                for(var ppi = 0;ppi < peoples.length;ppi++){
                    if(peoples[ppi].code === people.code){
                        loc = ppi;
                        cloc = -1;
                        for(var cpi = 0;cpi < peoples[ppi].class_codes.length;cpi++){
                            if(peoples[ppi].class_codes[cpi].code=== code){
                                cloc = ppi;
                                peoples[ppi].class_codes[cpi].reg_date.push(line[5]);
                            }
                        }
                        if(cloc === -1){
                            peoples[ppi].class_codes.push({
                                code : code,
                                reg_date : [line[5]]
                            });
                        }
                    }
                }
                if(loc ===-1){
                    peoples.push(people);
                }
            }
        }
        // console.log(peoples);
        if(typeof fn === 'function'){
            fn();
        }
    });
}