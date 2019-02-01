var PIANO_KEYS = 88;
var noteID;
var noteNumber;
var leftButtonDown = false;
var AnimimateTears = true; //default

//Detect if left mouse button is pressed and set flag
$(document).mousedown(function (e) {
    if (e.which === 1) {
        leftButtonDown = true;
    }
});

//Detect if left mouse button is released and set flag
$(document).mouseup(function (e) {
    if (e.which === 1) {
        leftButtonDown = false;
    }
});

$(document).ready(function () {
    
    
    var explode = false;

    //User has clicked down on a key
    $(".white").mousedown(function () {

        noteID = $(this).attr('id');
        noteNumber = $(this).attr('number');

        PlayNote(noteNumber);
        DropColorBlockFromElement($("#" + noteID), explode);
        $("#" + noteID).addClass('pressed');

    });

    //User has clicked down on a key
    $(".black").mousedown(function () {
        noteNumber = $(this).attr('number');

        noteID = $(this).attr('id');
        PlayNote(noteNumber);
        DropColorBlockFromElement($("#" + noteID), explode);
        $("#" + noteID).addClass('pressed');

    });

    //User has clicked the key mouse and the mouse has entered a key - play note and animate
    $(".white").mouseenter(function () {

        if (leftButtonDown) {
            noteID = $(this).attr('id');
            noteNumber = $(this).attr('number');
            PlayNote(noteNumber);
            DropColorBlockFromElement($("#" + noteID), explode);
            $("#" + noteID).addClass('pressed');
        }
        
       

    });

    //User has clicked the key mouse and the mouse has entered a key - play note and animate
    $(".black").mouseenter(function () {

        if (leftButtonDown) {
            noteID = $(this).attr('id');
            noteNumber = $(this).attr('number');
            //PlayNote(noteNumber);
            PlayNote(noteNumber);
            DropColorBlockFromElement($("#" + noteID), explode);
            $("#" + noteID).addClass('pressed');
        }

    });

    //User has moved the mouse out of a key
    $(".white").mouseleave(function () {
        noteID = $(this).attr('id');
        $("#" + noteID).removeClass('pressed');
    });

    //User has moved the mouse out of a key
    $(".black").mouseleave(function () {
        if (leftButtonDown) {
            noteID = $(this).attr('id');
            $("#" + noteID).removeClass('pressed');
        }
    });

    //User has released the mouse button over a key
    $(".white").mouseup(function () {
        noteID = $(this).attr('id');
        $("#" + noteID).removeClass('pressed');
    });

    //User has released the mouse button over a key
    $(".black").mouseup(function () {
        noteID = $(this).attr('id');
        $("#" + noteID).removeClass('pressed');
    });

    //Toggles and other stuffs
    $("#piano div.keyname").hide();
    $("#piano div.kbkeyname").hide();

    //If user clicks the "piano key names" then toggle between displaying "on" and "off"
    $("#KeyNames").click(function () {

        $("#piano div.kbkeyname").hide();
        $("#piano div.keyname").toggle();

        if ($("#toggleKeyNames").text() == "On") {
            $("#toggleKeyNames").text("Off");
        } else {
            $("#toggleKeyNames").text("On");
        }

        $("#toggleKeyNames").toggleClass('on');
    });
    

    //If user clicks the "piano key names" then toggle between displaying "on" and "off"
    $("#AnimatedTears").click(function () {
        if ($("#toggleAnimatedTears").text() == "On") {
            $("#toggleAnimatedTears").text("Off");
            AnimimateTears = false;
        } else {
            $("#toggleAnimatedTears").text("On");
            AnimimateTears = true;
        }

        $("#toggleAnimatedTears").toggleClass('on');
    });

});




//ARRAY WITH ALL THE KEYS
//the array content starts from element 1 so element 0 i zero, empty, nada, 0 gree
var keyboardKeys = new Array(PIANO_KEYS);
var k;

for (k = 0; k < PIANO_KEYS; k++) {
    keyboardKeys[k] = eval("pKey" + k);
}

//LOOP trought all the  keyboard-piano keys
for (i = 0; i < keyboardKeys.length; i++) {

    //BIND ON KEY DOWN
    $(document).bind('keydown', keyboardKeys[i], function (evt) {
        //check the flag false - key is down, true - key is up
        if (evt.data.flag) {
            evt.data.flag = false;

            $(evt.data.value).addClass('pressed');

            var noteNumber = $(evt.data.value).attr('number');
            PlayNote(noteNumber);

            DropColorBlockFromElement($(evt.data.value), true);
        }
        return false;
    });

    //BIND ON KEY UP
    $(document).bind('keyup', keyboardKeys[i], function (evt) {
        //check the flag false - key is down, true - key is up
        evt.data.flag = true;
        $(evt.data.value).removeClass('pressed');
        //stop_multi_sound('note-' + evt.data.value);
        return false;
    });

}

//1 channel would mean that only 1 notes can play at a time.
// 88 = every note on piano can play simultaneously.
var channel_max = 88;
audiochannels = new Array();

//Set up the channels
for (a = 0; a < channel_max; a++) {
    audiochannels[a] = new Array();
    audiochannels[a]['channel'] = new Audio();
    audiochannels[a]['finished'] = -1;
    audiochannels[a]['keyvalue'] = '';
}

//PLAY SOUND
function PlayNote(_noteNumber) {

    var item = $("[number='" + _noteNumber + "']");

    var id = "note-" + item.attr('id');

    for (var a = 0; a < audiochannels.length; a++) {
        var thistime = new Date();
        if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
            try {

                audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(id).duration * 1000;
                audiochannels[a]['channel'] = document.getElementById(id);
                audiochannels[a]['channel'].currentTime = 0;
                audiochannels[a]['channel'].volume = 1;
                audiochannels[a]['channel'].play();
                audiochannels[a]['keyvalue'] = id;
            }
            catch (v) {
                console.log(v.message);
                console.log(_noteNumber);
            }

            break;
        }
    }
}


function stop_multi_sound(s, sender) {

    s = s.replace("#", "");
    for (a = 0; a < audiochannels.length; a++) {
        if (audiochannels[a]['keyvalue'] == s) {			// is this channel finished?
            try {
                audiochannels[a]['channel'] = document.getElementById(s);

                if (sender != undefined && sender == 'mouse') {
                    setTimeout("audiochannels[a]['channel'].pause()", 1);
                    setTimeout("audiochannels[a]['channel'].currentTime = 0", 1);
                } else {
                    //audiochannels[a]['channel'].volume=0;
                    setTimeout("audiochannels[a]['channel'].pause()", 2500);
                    setTimeout("audiochannels[a]['channel'].currentTime = 0", 2500);
                }

            }
            catch (v) {
                console.log(v.message);
            }

            break;
        }
    }
}

//Finds and returns the top and left positions for the supplied element id
function getElementTopLeft(id) {

    var ele = document.getElementById(id);
    var top = 0;
    var left = 0;

    while (ele.tagName != "BODY") {
        top += ele.offsetTop;
        left += ele.offsetLeft;
        ele = ele.offsetParent;
    }

    return { top: top, left: left };
}

//Plays a specified note
function AnimateKeyboardNote(noteNumber) {
 
    //PlayNote(noteNumber);
    var item = $("[number='" + noteNumber + "']");
    var id = item.attr('id');
     DropColorBlockFromElement($("#" + id), false);   
    
    $("#" + id).addClass('pressed');
    setTimeout(function () {
        $("#" + id).removeClass('pressed');
    }, 100);
}

//Drops a randomly colored block from the specified element.
function DropColorBlockFromElement(el, explode) {
    
    if (!AnimimateTears) {
        return false;
    }

    //noteNumber = $(el).attr('number');
    //console.log(noteNumber);
    var theElement = getElementTopLeft(el.attr('id'));
    var randomColor = GetRandomColor();
    var left = theElement.left;
    var dropName = 'drop-' + left;

    $('<div />', {
        id: dropName,
    })
        .appendTo("#fallingNoteBlock")
        .addClass('ColoredRaindrop')
        .css('left', left)
        .css('box-shadow', '0px 0px 15px 0px ' + randomColor + ',0px 0px 5px 0px white inset')
        .css('-webkit-box-shadow', '0px 0px 15px 0px ' + randomColor + ',0px 0px 5px 0px white inset')
        .css('-moz-box-shadow', '0px 0px 15px 0px ' + randomColor + ',0px 0px 5px 0px white inset')
        .css('-ms-box-shadow', '0px 0px 15px 0px ' + randomColor + ',0px 0px 5px 0px white inset')
        .css('-o-box-shadow', '0px 0px 15px 0px ' + randomColor + ',0px 0px 5px 0px white inset')
        .css('background-color', randomColor).animate({
            "top": "850px",
            opacity: 0
        }, 3000, function () {

            //do we want to make the drops explode at the bottom?
            if (explode) {
                var dropLocation = getElementTopLeft(dropName);
                pop(dropLocation.left, dropLocation.top, 10, randomColor);
            }

            setTimeout(function () {
                $('#' + dropName).remove();
            }, 100);

        });
}

$.fn.extend({
    disableSelection: function () {
        this.each(function () {
            if (typeof this.onselectstart != 'undefined') {
                this.onselectstart = function () { return false; };
            } else if (typeof this.style.MozUserSelect != 'undefined') {
                this.style.MozUserSelect = 'none';
            } else {
                this.onmousedown = function () { return false; };
            }
        });
    }
});


function pop(start_x, start_y, particle_count, color) {
    var arr = [];
    var angle = 0;
    var particles = [];
    var offset_x = $("#dummy_debris").width() / 2;
    var offset_y = $("#dummy_debris").height() / 2;

    for (var i = 0; i < particle_count; i++) {
        var rad = d2r(angle);
        var x = Math.cos(rad) * (80 + Math.random() * 20);
        var y = Math.sin(rad) * (80 + Math.random() * 20);
        arr.push([start_x + x, start_y + y]);
        var z = $('<div class="debris" />');
        z.css({
            "left": start_x - offset_x,
            "top": start_y - offset_x
        })
            .css('background-color', color)
            .appendTo($("#content"));
        particles.push(z);
        angle += 360 / particle_count;
    }

    $.each(particles, function (i, v) {
        $(v).show();
        $(v).animate(
          {
              top: arr[i][1],
              left: arr[i][0],
              width: 4,
              height: 4,
              opacity: 0
          }, 200, function () {
              $(v).remove();
          });
    });
}

function r2d(x) {
    return x / (Math.PI / 180);
}

function d2r(x) {
    return x * (Math.PI / 180);
}

function GetRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
    
}

function timeFormatting(n) {

    var minutes = n / 60 / 1000;
    var totalSeconds = minutes * 60;
    var seconds = Math.floor(totalSeconds % 60).toString();
    if (seconds.length == 1) seconds = "0" + seconds;
    return Math.floor(minutes) + ":" + seconds;
}

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        console.log(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

// Toggle between Pause and Play modes.
var pausePlayStop = function(stop) {
    if (stop) {
        MIDI.Player.stop();
    } else if (MIDI.Player.playing) {
        MIDI.Player.pause(true);
        $("#pausePlayStop").attr("class", "play-pause paused");
    } else if (MIDI.Player.playing == false) {
        $("#pausePlayStop").attr("class", "play-pause");
        MIDI.Player.resume();
    }
};

function UpdateTimestamps() {
    
    if (!MIDI.Player.playing) {
        return false;
    }

    var now = MIDI.Player.currentTime; // time we are at now within the song.
    var end = MIDI.Player.endTime; // time when song ends.
    setTimeout(function () {
        $("#now").text(timeFormatting(now));
        $("#end").text("- " + timeFormatting(end - now));

        var percent = now / end;
        $("#cursor").css("width", (percent * 100) + "%");
        UpdateTimestamps();
    }, 500);
}