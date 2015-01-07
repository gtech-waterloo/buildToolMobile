$(document).on("pagecreate","#pageone",function(){
  $("#getProjects").on("tap",function(){
    $.ajax({
        url: "http://gtech.bitnamiapp.com/ProjectTools/app/project"
    }).then(function(data) {
        for (var i in data) {
            $('#result').append("<br>" + data[i].name);
            data[i]
        }
    });
  });
});
