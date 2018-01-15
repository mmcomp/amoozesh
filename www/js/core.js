var current_page = 'main';
var atitle = 'دانشگاه علوم پزشکی';
var dirEntry;
var filEntry;
var codes = [];
var tmp_codes = [];
var peoples = [];
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
function malert(txt){
  navigator.notification.alert(txt,null,atitle);
}
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  $(".submenu").click(function(){
    loadPage(this.id);
  });
  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (direEntry) {
      var dt = new Date;
      dirEntry = direEntry;
      var isAppend = true;
      createFile(dirEntry, "db.txt",'start|'+dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate()+"\n", isAppend,function(){
          getCodes(loadPage(current_page));
      });
  }, onErrorLoadFs);
}
function loadPage(selected_page){
  $(".page").hide();
  $("#page-"+selected_page).show();
  $(".submenu").removeClass('icon-selected');
  $("#"+selected_page).addClass('icon-selected');
}
function loadCode(code){
    var out = {
        code : '0',
        reg_date : []
    };
    for(var j = 0;j < codes.length;j++){
        if(codes[j].code===code){
            out = codes[j];
        }
    }
    return out;
}
function addDate(code,dat){
    var out = {
        code : '0',
        reg_date : []
    };
    for(var j = 0;j < codes.length;j++){
        if(codes[j].code===code){
            codes[j].reg_date.push(dat);
            out = codes[j];
        }
    }
    return out;
}