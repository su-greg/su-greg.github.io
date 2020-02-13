
$(document).ready(function() {

    // Toggle dark theme
    var dark = false;
    $("#lights").click(function() { // Listen for button click
        if (dark) {     // Switch to light theme

            $(".parallax use").each(function() {
                $(this).attr("fill", `rgba(255,255,255,0.${Math.floor((Math.random() * 6) + 4)})`); // Change wave colors
            });
            $(".parallax .solid-wave").attr("fill", "#e4e4e4");
            $('link[href="dark.css"]').attr('href','light.css'); // Swap css file
            dark = false;

        } else {        // Switch to dark theme

            $(".parallax use").each(function() {
                $(this).attr("fill", `rgba(38, 42, 48,0.${Math.floor((Math.random() * 6) + 4)})`); // Change wave colors
            });
            $(".parallax .solid-wave").attr("fill", "#262a30");
            $('link[href="light.css"]').attr('href','dark.css'); // Swap css file
            dark = true;

        }
        
    });


    // Scrolling
    var page = 0;   // Track the Page
    $(window).bind('DOMMouseScroll mousewheel', function(e){ // On mouse scroll
        $("div").each(function() {
            $(this).removeClass("focus"); // Remove focus from all div elements
        });
        if(page > 0 && (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0)) { // Scroll Up
            
            $(`#pg-${page}`).addClass("fall");                    // push current page down
            $(`#pg-${page-1}`).removeClass("rise");               // pull next page from top
            $(`#pg-${page-1} > .header > div`).addClass("focus"); // apply focus to all divs on page
            page--

        } else if (page < 5){                                                            // Scroll Down

            $(`#pg-${page}`).addClass("rise");                    // push current page up
            $(`#pg-${page+1}`).removeClass("fall");               // pull next page from bottom
            $(`#pg-${page+1} > .header > div`).addClass("focus"); // apply focus to all divs on page
            page++

        }
        console.log(page);
    });


    // Touch Scrolling
    var touchStart = 0; // Record the postion of first touch
    var htouchStart = 0
    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStart = e.changedTouches[0].clientY; // record touch
        htouchStart = e.changedTouches[0].clientX; // record touch
    }, false);

    // Determine scroll direction after a swipe
    document.addEventListener('touchend', function(e) {
        var swipe = e.changedTouches[0].clientY - touchStart; // find direction and magnitude
        var hswipe = e.changedTouches[0].clientX - htouchStart;
        if (swipe > 60 || swipe < -60) { // if swiping
            $("div").each(function() {
                $(this).removeClass("focus");
            });
        }
        if( swipe > 60 && page > 0) {         // Swiping Up
            
            $(`#pg-${page}`).addClass("fall");                    // push current page down
            $(`#pg-${page-1}`).removeClass("rise");               // pull next page from top
            $(`#pg-${page-1} > .header > div`).addClass("focus"); // apply focus to all divs on page
            page--

        } else if ( swipe < -60 && page < 5){ // Swiping Down

            $(`#pg-${page}`).addClass("rise");                    // push current page up
            $(`#pg-${page+1}`).removeClass("fall");               // pull next page from bottom
            $(`#pg-${page+1} > .header > div`).addClass("focus"); // apply focus to all divs on page
            page++

        }

        if (hswipe > 60) {
            $("#carousel-left").trigger("click")
        } else if (hswipe < -60) {
            $("#carousel-right").trigger("click")
        }

    }, false);


    var carousel = 1;
    $("#carousel-left").click(function() {
        if (carousel > 0) {
            $(`.carousel-${carousel}`).addClass("right");
            $(`.carousel-${carousel-1}`).removeClass("left");
            carousel--;
        }
        if (carousel == 0) {
            $(`#carousel-left i`).css("display", "none");
        } else if (carousel == 1) {
            $(`#carousel-left i`).css("display", "");
            $(`#carousel-right i`).css("display", "");
        }
        console.log("c" +carousel)
    });
    $("#carousel-right").click(function() {
        if (carousel < 2) {
            $(`.carousel-${carousel}`).addClass("left");
            $(`.carousel-${carousel+1}`).removeClass("right");
            carousel++;
        } 
        if (carousel == 2){
            $(`#carousel-right i`).css("display", "none");
        } else if (carousel == 1) {
            $(`#carousel-left i`).css("display", "");
            $(`#carousel-right i`).css("display", "");
        }
        console.log("c" +carousel)
    });
});