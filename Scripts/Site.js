//Initializes the midi.js object
function InitializeMidiJS(itemsToDisplay) {
    MIDI.loader = new widgets.Loader;
    LoadSoundfont("../Scripts/Soundfonts/", itemsToDisplay);
}

//Displays a message to the user: message text and message type (error,warning...etc)
function ShowMessage(message, type) {
    var notyPopup = noty({
        layout: 'top',
        theme: 'defaultTheme',
         type: type,
        text: message,
        dismissQueue: false,
        maxVisible: 1,
        closeWith: ['click'],
        timeout: 2000
    });
}

//Does an AJAX call to display the  navigation part which displays the 'Register/Sign in' or 'Mini Profile'
//If the user is authenticated, the 'Mini profile' will be displayed
function ShowNavigationStripProfile() {
    $.ajax({
        type: "POST",
        url: "/User/NavigationStripProfile",
    }).done(function (view) {
        $("#Register-SignIn-MiniprofilePart").html(view);
    });
}

function UpdateNavigationStrip() {
    $.ajax({
        type: "POST",
        url: "/User/NavigationStrip",
    }).done(function (view) {
        $("#nav").html(view);
    });
}
    
function LoadSoundfont(soundFontURL, itemsToDisplay) {
    MIDI.loadPlugin({
        soundfontUrl: soundFontURL,
        instrument: ["acoustic_grand_piano"],
        callback: function () {
            MIDI.loader.stop();
            $(".loader").css("display", "none");
            $.each(itemsToDisplay, function (index, value) {
                $("#" + value).fadeIn(3000);
            });
        }
});
}

