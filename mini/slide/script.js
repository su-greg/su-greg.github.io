var pages = document.getElementsByClassName("page");
var page = 1;
var slideable = true;

function initSlide(main, slide) {
    slideable = slide;
    for (i=1;i <= pages.length;i++) {
        var element = document.getElementsByClassName(`pg${i}`)[0];
        if ( !element.className.includes(main) ) {
            element.classList.add("fall");
        }
    }
}


/* Page switching function */
function slidePage(page) { // page slide function ( page to slide to )
    if (slideable) {
        for (i=1;i <= pages.length;i++) {
            var element = document.getElementsByClassName(`pg${i}`)[0]

            if (i < page) { // If current is before page make it rise
                element.classList.add("rise");
            } else if (i > page) { // If current is after page make it fall
                element.classList.add("fall");
            } else { // If next page
                element.classList.remove("rise");
                element.classList.remove("fall");
            }
        }
    }
}



/* Input Detectors */
{

    // Touch Scrolling
    {
    var touchStart = 0;      // Record the postion of first touch
    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStart = e.changedTouches[0].clientY; // record touch
    }, false);

    // Determine scroll direction after a swipe
    document.addEventListener('touchend', function(e) {
        var swipe = e.changedTouches[0].clientY - touchStart; // find direction and magnitude
        if( swipe > 60 && page != 1) {                      // Swiping Up
            page--; slidePage(page);
        } else if ( swipe < -60 && page < pages.length){    // Swiping Down
            page++; slidePage(page);
        }

    }, false);
    }

    // Scroll Wheel listener
    document.addEventListener("wheel", function(e) {
        if(page != 1 && (e.deltaY < 0)) { // Scroll Up
            page--; slidePage(page);
        } else if (page < pages.length && (e.deltaY > 0)){                                                            // Scroll Down
            page++; slidePage(page);
        }
    });

    // Keyboard listener
    document.addEventListener("keydown", function(e) {
        var c = e.keyCode;
        if      (/87|104|38/.test(c) && page != 1 )           { page--; slidePage(page); }
        else if (/83|98|40/.test(c)  && page < pages.length)  { page++; slidePage(page); }
    });
}
