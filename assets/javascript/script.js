new fullScroll({
    mainElement: 'main',
    displayDots: true,
    dotsPosition: 'right',
    animateTime: 0.7,
    animateFunction: 'ease'
});
window.addEventListener("hashchange", function (e) {

    var elements = document.getElementsByClassName("nav-link");
    for (var i = 0; i < elements.length; i++) {

        elements[i].classList.remove('active');
        if (elements[i].href.includes(window.location.hash)) {
            elements[i].classList.add('active');
            document.getElementById("mobileButton").innerHTML = `${elements[i].innerHTML} <span class="navbar-toggler-icon"></span>`;
        }
    }
});
$(function() {
    $(document).click(function (event) {
        $('.navbar-collapse').collapse('hide');
    });
});