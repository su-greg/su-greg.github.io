
// Listen for form submittion
$("#form").submit(function(e) {
    window.location.hash = $("#appid").val();
});



// Listen for hash change
$(window).on('hashchange', () => {

    const appid = window.location.hash.replace("#", "");                                // Change the hash to the entered appid
    const api = "https://cors-anywhere.herokuapp.com/https://api.steampowered.com/";    // Cors work around for steam's web api
    const steam = "https://cors-anywhere.herokuapp.com/https://store.steampowered.com/app/";    // Cors work around for steam store

    if (!appid) {       // If the appid is blank ...

        console.log("App not specified!");
        $("#search").css("display", "inherit");
        $("#results").css("display", "none");

    } else {            // Otherwise if appid is present ...

        function apilook(url) { return(api+url+appid) }    // Function that returns steam api link

        // Request to determine if appid exists in the Steam API
        var request = $.getJSON(apilook("ISteamNews/GetNewsForApp/v2/?appid="), function(data) {
            console.log("App exists!");
            $("#search").css("display", "none");        // Hide the search box
            $("#loader").css("display", "inherit");     // Show loading animation
        });

        /*/ Bypass age restriction notice
        var sessionid = $.get( (steam + 105600) , function(data) {
            sessionid = data.split('var g_sessionID = "').pop().split('";')[0];
        });

        sessionid.done( function() {
            console.log(sessionid);
            $.post("https://cors-anywhere.herokuapp.com/https://store.steampowered.com/agecheckset/app/"+appid,
            { sessionid: sessionid,ageDay: "1",ageMonth: "October",ageYear: "2000" }
            ).done( function( res ) {

                if ( res.success == 1) console.log("authenticated!")
                else console.log("failed to auth!")
            });
        });*/

        // The appid doesn't exist in the Steam API
        request.fail( function(e) {
            console.log( "App doesnt exist" );
            document.getElementById("appid").style.animation = "red 0.3s ease 2"
            document.getElementById("appid").style.borderBottomColor = "red";
            window.location.hash = "";
        });

        // The appid does exist in the Steam API
        request.done( () => {
            var stats = {};
            var collected = 0;
            var failed = 0;

            // Display stats once collected
            function displayStats($) {
                if (collected == 2) {   // If no errors ...

                    document.title = "SteamStats - "+ stats.title;
                    $("#title").html(stats.title);
                    $("#description").html(stats.desc);
                    $("#reviews").html(stats.reviews);
                    $("#release").html("Released "+stats.released);
                    $("#image").attr("src", stats.img);
                    $("#online").html("In-Game: "+stats.active_players+" players");
                
                    $("#loader").css("display", "none");     // Hide loading animation
                    $("#results").css("display", "inline-grid");     // Hide loading animation
                } else if (!!failed) {  // If errors ...
                    console.log( "error!" );
                }
            }

            // Request number of active players ( Steam API )
            $.getJSON(apilook("ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid="), function(data) {
                stats.active_players = data.response.player_count;  // Record active players
                collected++;
                displayStats($)
            }).fail( () => { failed++;displayStats($) });

            // Request steam store page ( Web Scraping )
            $.get( (steam + appid) , function(data) {

                function shave(a, dat ,b) { return dat.split(a).pop().split(b)[0] }
                
                if (data.includes("agecheckset")) {
                    stats.title = shave('<title>',data,' on Steam</title>');    // Scrape Title
                    stats.desc = "Content is age restricted! ( I'm working on a workaround for this but it's <em>really</em> tricky! )";
                } else {
                    stats.devs = shave('<div class="summary column" id="developers_list">',data,'</div>');  // Scrape Developers
                    stats.reviews = shave('style="cursor: pointer;" data-tooltip-html="',data,'"');         // Scrape Reviews
                    stats.price = shave('<div class="game_purchase_price price">',data,'</div>');           // Scrape Price
                    stats.desc = shave('<div class="game_description_snippet">',data,'</div>');             // Scrape Description
                    stats.img = shave('class="game_header_image_full" src="',data,'"');                     // Scrape Image
                    stats.title = shave('<div class="apphub_AppName">',data,'</div>');                      // Scrape Title
                    stats.released = shave('<div class="date">',data,'</div>');                             // Scrape Release date
                }


                collected++;
                displayStats($)
            }).fail( () => { failed++;displayStats($) });
        });
    }
});

if (!!window.location.hash) {
    $(window).trigger("hashchange");
}