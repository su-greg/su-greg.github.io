var webms = [];
var webm = 0;
const cors = "https://cors-anywhere.herokuapp.com/";
const thread = window.location.hash.replace("#", "");

var s="iuuqt;00cpbset/5dibo/psh0hjg0uisfbe0";
m=""; for (i=0; i<s.length; i++) {	if(s.charCodeAt(i) == 28){	  m+= '&';} else if (s.charCodeAt(i) == 23) {	  m+= '!';} else {	  m+=String.fromCharCode(s.charCodeAt(i)-1) } };
var source = m;

if (!!thread) {
    $.get(cors + source + thread, function(out) {
        source = out.split('<a href="//i');
        for (var i = 1; i < source.length; i++) {
            webms.push([
                "https://i" + source[i].substring(0, source[i].indexOf('.webm"')) + ".webm",                  // Webm link
                source[i].substring(source[i].indexOf('target="_blank">')+16, source[i].indexOf("</a>")-5),   // Webm title
            ]);
        }
        playWebm(0);
    })

    .fail(() => { $("#title").html("Thread "+thread+" not found!"); })

    .done(() => {

        $("#webm").on("error", () => { if (webm != 0 ) setTimeout(function(){ playWebm(1) }, 200)} );

        $("#next").click(() => {playWebm(1)});

        $("#back").click(() => {playWebm(-1)});

        $("#play").click(() => { 
            if ($("#play").html() == "") {
                $("#play").html("&#xf04b;");
                document.getElementsByTagName("video")[0].pause();
            } else {
                $("#play").html("&#xf04c;");
                $("video").attr("poster", "lost.png");
                document.getElementsByTagName("video")[0].play();
            }
        });

    });
}

function playWebm(mag) {
    webm += mag;
    if (webm < 0) webm = webms.length-1;
    else if (webm >= webms.length) webm = 0;
    $("#track").html(webm+1 + "/" + webms.length)
    $("#title").html(webms[webm][1]);
    $("#title").attr("href", webms[webm][0]);
    $("#webm").attr("src", webms[webm][0]);
    document.getElementsByTagName("video")[0].load();
    document.getElementsByTagName("video")[0].play();
}
/*

    TODO: quick youtube link

*/



