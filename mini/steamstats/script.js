
// Listen for form submittion
$("#form").submit(function(e) {
    window.location.hash = $("#appid").val();
});

// Listen for hash change
$(window).on('hashchange', () => {

    const appid = window.location.hash.replace("#", "");                                // Change the hash to the entered appid
    const api = "https://api.steampowered.com/";    // Cors work around for steam's web api
    const steam = "https://store.steampowered.com/app/";    // Cors work around for steam store

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

        // The appid doesn't exist in the Steam API
        request.fail(function(e) {
            console.log( e );
            $("#appid").css("border-color", "#f00");
        });

        // The appid does exist in the Steam API
        request.done( () => {
            var stats = {};
            var collected = 0;
            var failed = 0;

            $("#appid").css("border-color", "#000");

            // Display stats once collected
            function displayStats($) {
                if (collected == 2) {   // If no errors ...

                    document.title = "SteamStats - "+ stats.title;
                    $("#title").html(stats.title);
                    $("#description").html(stats.desc);
                
                    $("#loader").css("display", "none");     // Hide loading animation
                    $("#results").css("display", "inherit");     // Hide loading animation
                    
                    console.log(stats);
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

                stats.reviews = data.split('<span class="game_review_summary positive" data-tooltip-html="').pop().split('"')[0];       // Scrape reviews
                stats.devs = data.split('<div class="summary column" id="developers_list">').pop().split('</div>')[0];                  // Scrape Developers
                stats.price = data.split('<div class="game_purchase_price price">').pop().split('</div>')[0];                           // Scrape Price
                stats.desc = data.split('<div class="game_description_snippet">').pop().split('</div>')[0];                             // Scrape Description
                stats.released = data.split('<div class="date">').pop().split('</div>')[0];                                             // Scrape Release date
                stats.title = data.split('<title>').pop().split(' on Steam</title>')[0];                                                // Scrape title

                collected++;
                displayStats($)
            }).fail( () => { failed++;displayStats($) });
        });
    }
});
