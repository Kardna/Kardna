function paa(finalurl){
    $("#video").html("<source src='"+ finalurl +"' type='application/x-mpegURL'>");
    var ply = videojs("video");
    ply.play();
}