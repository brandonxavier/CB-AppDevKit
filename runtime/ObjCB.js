/**
 * Created with JetBrains WebStorm
 * User: brandonxavier (brandonxavier421@gmail.com)
 * Date: 6/20/13
 *

 Copyright 2013 Brandon Xavier (brandonxavier421@gmail.com)

 This file is part of CB-AppDevKit.

 CB-AppDevKit is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 CB-AppDevKit is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with CB-AppDevKit.  If not, see <http://www.gnu.org/licenses/>.

 */

var AppDevKit = true;
var ADK = {'readyToRun': false,
    'scriptName': "",
    'initFunction': "",
    'settingsChoices': "",
    'tipOptions': "",
    'trueScriptName': ""
};

var cb;

$( document ).ready( function () {

    // do some jquery stuff here

} );

function objCB() {

    this.room_slug = "Betty Broadcaster"; // Just a random name I picked
    this.cbUsers = [];  // An array of logged in (dummy) users

    this.changeRoomSubject = changeRoomSubject;
    this.subjectChangeClicked = subjectChangeClicked;
    this.chatNotice = chatNotice;
    this.drawPanel = drawPanel;
    this.log = log;
    this.onDrawPanel = onDrawPanel;
    this.onMessage = onMessage;
    this.onTip = onTip;
    this.setTimeout = setTimeout;

    this.sendMsg = sendMsg;
    this.writeToTextarea = writeToTextarea;
    this.writeToChatArea = writeToChatArea;
    this.sendClicked = sendClicked;
    this.populateUserDropdown = populateUserDropdown;
    this.scriptName = ADK.scriptName;
    this.initFunction = ADK.initFunction;

    if ( ADK.settingsChoices != "" ) {
        this.settings_choices = eval( ADK.settingsChoices );
        showSettings( "#Settings", this.settings_choices );
        // createValidationCode( this.settings_choices );
    } else {
        this.settings_choices = [];
    }
    this.settings = [];

    if ( ADK.tipOptions != "" ) {

    } else {
        this.tipOptions = function () {
            return;
        };
    }

    this.panelHandler = function () {
    };
    this.mesgHandler = function () {
    };
    this.tipHandler = function () {
    };


    // Seed some dummy users;
    //
    // (name, gender, fan_club, has_tokens, is_mod, recent_tipper)
    //
    this.cbUsers[this.room_slug] = new objCBUser( this.room_slug, "f", true, true, true, true );
    this.cbUsers['Notice'] = new objCBUser( "Notice", "m", false, false, false, false ); // Cheesy way to set formatting for notices
    this.cbUsers['Bob'] = new objCBUser( "Bob", "m", false, true, false, false );
    this.cbUsers['Carol'] = new objCBUser( "Carol", "f", false, true, true, true );
    this.cbUsers['Ted'] = new objCBUser( "Ted", "m", true, false, false, false );
    this.cbUsers['Alice'] = new objCBUser( "Alice", "f", false, false, false, true );

    this.populateUserDropdown();

    if ( ADK.scriptName.match( /^blob:/ ) == null ) { // The script was specified via HTML
        loadScript();
    }

    function populateUserDropdown() {

        /**
         * it seemed like a good idea at the time to encapsulate this function with
         * the user object . . . but it wasn't . . .
         */
        var dropdownList, newentry, i;

        dropdownList = document.getElementById( "lstUsers" );
        for ( i in this.cbUsers ) {
            if ( i != this.room_slug && i != "Notice" ) {
                newentry = document.createElement( "option" );
                newentry.value = this.cbUsers[i].u;
                newentry.textContent = this.cbUsers[i].u;
                dropdownList.appendChild( newentry );
            }
        }

    }

    function changeRoomSubject(new_subject) {
        document.getElementById( "txtSubject" ).value = new_subject;
        this.writeToTextarea( "txtSubject", new_subject, true );
        var area = document.getElementById( "txtUserChat" );
        area.innerHTML += "<span style='color: #DC5500;background-color: white;font-weight:bold;' >" +
            "room subject changed to \"" + new_subject + "\"</span></br>";
        area.scrollTop = area.scrollHeight;

        area = document.getElementById( "txtBroadcaster" );
        area.innerHTML += "<span style='color: #DC5500;background-color: white;font-weight:bold;' >" +
            "room subject changed to \"" + new_subject + "\"</span></br>";
        area.scrollTop = area.scrollHeight;
    }

    function chatNotice(message, to_user) {

        /**
         *
         * This should be considered an immutable function -- don't attempt to redefine it
         *
         */

        var msgObj;

        // replace newlines in message with </br>
        while ( message.indexOf( "\n" ) >= 0 )
            message = message.replace( "\n", "</br>Notice: " );


        if ( to_user == null ) {
            // area = document.getElementById(this.cbDiv['Main'].txtMainChat);

            msgObj = createMesg( "Notice", message );
            this.writeToChatArea( "txtUserChat", msgObj );
            this.writeToChatArea( "txtBroadcaster", msgObj );
        }
        else {
            msgObj = createMesg( "Notice", message + " to " + to_user );
            if ( to_user == cb.room_slug )
                this.writeToChatArea( "txtBroadcaster", msgObj );
            else
                this.writeToChatArea( "txtUserChat", msgObj );
        }

    }

    function drawPanel() {

        /**
         *
         * This should be considered an immutable function -- don't attempt to redefine it
         *
         */

        /**
         *
         * In theory, we should loop thru all the users logged in and give them each
         * a shot at having their own personalized panel (that could make for some really
         * interesting games -- like a Texas Hold'Em with the players cards being shown to
         * them in their panel).  But since this is for testing, and we have only the one
         * user display panel, we'll just do the broadcaster and selected user
         *
         */

        var tgtUsers = [cb.room_slug, getSelectedUser()];
        for ( var z = 0; z < tgtUsers.length; z++ ) {
            var tData = [];

            var t = cb.panelHandler( tgtUsers[z] );

            if ( typeof t == "undefined" )  // No custom panel defined
                return;

            var e;

            switch (t['template']) {
                case "3_rows_11_21_31":
                    tData['row1_value'] = t.row1_value;
                    tData['row2_value'] = t.row2_value;
                    tData['row3_value'] = t.row3_value;
                    break;
                case "3_rows_11_22_32":
                    tData['row1_value'] = t.row1_value;
                    tData['row2_label'] = t.row2_label;
                    tData['row2_value'] = t.row2_value;
                    tData['row3_label'] = t.row3_label;
                    tData['row3_value'] = t.row3_value;
                    break;
                case "3_rows_12_22_32":
                case "3_rows_of_labels":
                    tData['row1_label'] = t.row1_label;
                    tData['row1_value'] = t.row1_value;
                    tData['row2_label'] = t.row2_label;
                    tData['row2_value'] = t.row2_value;
                    tData['row3_label'] = t.row3_label;
                    tData['row3_value'] = t.row3_value;
                    break;
                case "3_rows_12_21_31":
                    tData['row1_label'] = t.row1_label;
                    tData['row1_value'] = t.row1_value;
                    tData['row2_value'] = t.row2_value;
                    tData['row3_value'] = t.row3_value;
                    break;
                case "3_rows_12_22_31":
                    tData['row1_label'] = t.row1_label;
                    tData['row1_value'] = t.row1_value;
                    tData['row2_label'] = t.row2_label;
                    tData['row2_value'] = t.row2_value;
                    tData['row3_value'] = t.row3_value;
                    break;
                default:
                    cb.log( "Invalid template" + t.template );
                    break;

            }


            /**
             * This is a horribly bad way to do this . . . but honestly there
             * aren't really enough variations in the templates to justify much
             * more effort than this quick-n-dirty solution requires
             *
             */
            if ( tgtUsers[z] == cb.room_slug ) {
                var elemArray = ["brow1", "brow2", "brow3"];

            } else {
                var elemArray = ["urow1", "urow2", "urow3"];
            }

            e = document.getElementById( elemArray[0] );
            if ( typeof tData['row1_label'] == "undefined" )
                e.innerHTML = "<TD class='singleTopColumn' >" + tData['row1_value'] + "</TD>";
            else {
                e.innerHTML = "<TD class='topLeftColumn' >" + tData['row1_label'] + "</TD>" +
                    "<TD class='rightColumn' >" + tData['row1_value'] + "</TD>";
            }

            e = document.getElementById( elemArray[1] );
            if ( typeof tData['row2_label'] == "undefined" )
                e.innerHTML = "<TD class='singleColumn' >" + tData['row2_value'] + "</TD>";
            else {
                e.innerHTML = "<TD class='leftColumn' >" + tData['row2_label'] + "</TD>" +
                    "<TD class='rightColumn' >" + tData['row2_value'] + "</TD>";
            }

            e = document.getElementById( elemArray[2] );
            if ( typeof tData['row3_label'] == "undefined" )
                e.innerHTML = "<TD class='singleColumn' >" + tData['row3_value'] + "</TD>";
            else {
                e.innerHTML = "<TD class='leftColumn' >" + tData['row3_label'] + "</TD>" +
                    "<TD class='rightColumn' >" + tData['row3_value'] + "</TD>";
            }

        }

    }

    function log(message) {

        /**
         *
         * This should be considered an immutable function -- don't attempt to redefine it
         *
         */
        document.getElementById( "txtLog" ).innerHTML += message + "</br>";
        document.getElementById( "txtLog" ).scrollTop = document.getElementById( "txtLog" ).scrollHeight;

    }


    function onDrawPanel(func) {

        // cb.log(func);
        this.panelHandler = func;

        return(func);
    }

    function onMessage(func) {

        this.mesgHandler = func;

        return func;

    }


    /**
     *
     * Avoid changing this
     *
     * @param func
     * @param msecs
     */
    function setTimeout(func, msecs) {

        window.setTimeout( func, msecs );

    }

    function subjectChangeClicked() {

        /**
         *
         * This should be considered an immutable function -- don't attempt to redefine it
         *
         */

        this.changeRoomSubject( document.getElementById( "txtSubject" ).value );

        var area = document.getElementById( "txtUserChat" );
        area.innerHTML += "<span style='color: black;background-color: white;' >" +
            "Room subject changed to: " + document.getElementById( "txtSubject" ).value + "</span></br>";
        area.scrollTop = area.scrollHeight;

        area = document.getElementById( "txtBroadcaster" );
        area.innerHTML += "<span style='color: black;background-color: white;' >" +
            "Room subject changed to: " + document.getElementById( "txtSubject" ).value + "</span></br>";
        area.scrollTop = area.scrollHeight;


    }

    /**
     *
     * @param toUser
     * @param msg1
     */
    function sendMsg(toUser, msg1) {


        this.writeToChatArea( "txtBroadcaster", msg1 );
        this.writeToChatArea( "txtUserChat", msg1 );
    }

    /**
     *
     * @param targetArea
     * @param msg
     */
    function writeToChatArea(targetArea, msg) {

        var mstr = "";

        //
        // Check spam flag first and simply return if true
        //
        if ( msg['X-Spam'] == true )
            return;

        // Handle emotes - the regexes become MUCH easier if this is done before
        // any other HTML tagging is done (lot of damn ":"s in HTML)
        msg['m'] = insertEmotes( msg['m'] );

        //
        // First set the color of the name
        //
        if ( msg['user'] == "Notice" ) {
            mstr = "<SPAN STYLE='color:black'>" + msg['user'] + ": </SPAN>"
        } else if ( msg['user'] == cb.room_slug ) {
            mstr = "<SPAN STYLE='color:#DC5500;font-weight:bold'>" + msg['user'] + ": </SPAN>"
        } else if ( msg['is_mod'] == true ) {
            mstr = "<SPAN STYLE='color:#ff0000;font-weight:bold'>" + msg['user'] + ": </SPAN>"
        } else if ( msg['in_fanclub'] == true ) {
            mstr = "<SPAN STYLE='color:#090;font-weight:bold'>" + msg['user'] + ": </SPAN>"
        } else if ( msg['has_tokens'] == true ) {
            mstr = "<SPAN STYLE='color:#69A;font-weight:bold'>" + msg['user'] + ": </SPAN>"
        } else if ( msg['tipped_recently'] == true ) {
            mstr = "<SPAN STYLE='color:#009;font-weight:bold'>" + msg['user'] + ": </SPAN>"
        } else
            mstr = "<SPAN STYLE='color:#666'>" + msg['user'] + ": </SPAN>";

        // Background color is a pain
        if ( msg['background'] != "white" && msg['background'] != "#ffffff" ) {
            mstr = mstr + "<SPAN STYLE='background-color:" + msg['background'] + "'>"
        }

        // Foreground isn't so bad
        mstr = mstr + "<SPAN STYLE='color:" + msg['c'] + "'>" + msg['m'] + "</SPAN>";

        // Close up the background span
        if ( msg['background'] != "white" && msg['background'] != "#ffffff" ) {
            mstr = mstr + "</SPAN>"
        }


        // End with a newline
        mstr = mstr + "</br>";

        var area = document.getElementById( targetArea );
        area.innerHTML += mstr;
        area.scrollTop = area.scrollHeight;

    }

    function writeToTextarea(targetArea, msg, overWrite) {

        if ( msg.trim() != "" ) {
            var area = document.getElementById( targetArea );
            if ( overWrite == true ) {
                area.innerHTML = msg.trim() + "\n";
                // area.value = msg.trim() + "\n";
            } else {
                area.value += msg.trim() + "\n";
                area.scrollTop = area.scrollHeight;
            }
        }
    }

    function sendClicked(targetField) {

        /**
         *
         * This should be considered an immutable function -- don't attempt to redefine it
         *
         */

        var msgObj = [];

        if ( document.getElementById( targetField ).value.trim() != "" ) {
            if ( targetField == "inBroadcaster" ) {
                msgObj = createMesg( this.room_slug, document.getElementById( "inBroadcaster" ).value );
                cb.mesgHandler( msgObj );
                this.sendMsg( this.room_slug, msgObj );
                document.getElementById( targetField ).value = "";
            } else {
                var m = document.getElementById( "inUser" ).value;
                if ( m.length > 4 ) {
                    if ( m.search( "^/tip " ) == 0 ) { // We have a tip!
                        var t = parseInt( m.substr( 5 ) );
                        var p = (m.substr( 5 )).indexOf( " " );
                        var tm = ( p != -1 ? m.substr( p + 6 ) : "" );
                        createTippingHTML( t, tm );
                        //
                        // Terminate msg processing and allow onTip to take over after Send Tip clicked
                        document.getElementById( targetField ).value = "";
                        return;
                    }
                }


                msgObj = createMesg( getSelectedUser(), document.getElementById( "inUser" ).value );
                cb.mesgHandler( msgObj );
                this.sendMsg( getSelectedUser(), msgObj );
                document.getElementById( targetField ).value = "";
            }


        }
    }


}

function objCBUser(username, gender, fanclub, has_tokens, is_mod, tipped_recently) {

    this['u'] = username;
    this['gender'] = gender;
    this['in_fanclub'] = !!(fanclub == true); // !! ensures true/false value (no nulls)
    this['has_tokens'] = !!(has_tokens == true);
    this['is_mod'] = !!(is_mod == true);
    this['tipped_recently'] = !!(tipped_recently);

}


/**
 *
 * @param whichDiv
 * @param currSettings
 */
function showSettings(whichDiv, currSettings) {

    var str, vStr, currId, f, e, s, selectDefaults = [];

    str = "";

    /**
     *
     * Generate the validation functions now . . .
     *
     * I find it seems to be more reliable to generate
     * and <SCRIPT> all the elements at once - otherwise
     * assigning the handlers to the HTML elements (onblur)
     * tend to get squirrelly.
     *
     */
    vStr = "";
    for ( s = 0; s < currSettings.length; s++ ) {
        vStr += createValidationCode( currSettings[s] );
    }
    $( "body" ).append( "<SCRIPT>" + vStr + "</SCRIPT>" );
    /* var scrpt = document.createElement( "script" );
     scrpt.innerHTML = vStr;
     document.body.appendChild( scrpt );
     */

    for ( s = 0; s < currSettings.length; s++ ) {
        if ( currSettings[s].label != undefined ) {
            $( whichDiv ).append( "<DIV class='settingLabel'>" + currSettings[s].label + "</DIV>" );
        } else {
            $( whichDiv ).append( "<DIV class='settingLabel'>" + currSettings[s].name + "</DIV>" );
        }


        //
        // For HTML DISPLAY purposes, there's little difference between a string and an int
        //
        if ( currSettings[s].type == "int" || currSettings[s].type == "str" ) {

            currId = "in" + currSettings[s].name;

            // vStr = createValidationCode( currSettings[s] );

            str = "<DIV class='settingField'><INPUT type='text' class='settingInput' id='" + currId + "' ";
            str += "onchange='validate" + currId + "()' ";
            // str += "onblur='validate" + currId + "()' ";
            str += "onkeydown='clearErrors()' ";
            str += "onclick='clearErrors()' ";
            if ( currSettings[s].default != undefined ) {
                str += 'value="' + currSettings[s].default + '" ';
            }
            if ( currSettings[s].defaultValue != undefined ) {
                str += 'value="' + currSettings[s].defaultValue + '" ';
            }
            $( whichDiv ).append( str + "></DIV>" );
        } else {
            if ( currSettings[s].type == "choice" ) {

                currId = "lst" + currSettings[s].name;

                str = "<DIV class='settingField'><SELECT  class='settingInput' id=" + currId + " ";
                str += "onchange='validate" + currId + "()' >";
                for ( var q in currSettings[s] ) {
                    if ( q.match( "^choice*" ) != null ) {
                        str += '<OPTION value="' + currSettings[s][q] + '">' + currSettings[s][q] +
                            '</OPTION>';
                    }
                    if ( q == "defaultValue" ) {
                        selectDefaults.push( {'name': "#" + currId,
                            'defaultValue': currSettings[s][q]} );
                    }
                }
                str += "</SELECT></DIV>"
                $( whichDiv ).append( str );
            }
        }
        // f=eval("validate"+currId);
        // $("#"+currId ).on("change", f());
    }

    // Now that the "form" is created, set the default for the selects
    for ( s = 0; s < selectDefaults.length; s++ ) {

        $( selectDefaults[s].name + " option" ).each( function () {
            this.selected = (this.text == selectDefaults[s].defaultValue);
        } );

    }

}

/**
 *
 * createValidationCode - Takes a single settings object and returns
 *  a function in string form that can be later used for something useful
 *
 * @param sc single settings object
 * @returns {string} function
 */
function createValidationCode(sc) {

    var fstr, idName, idSelector;

    fstr = "";

    // for ( x = 0; x < sc.length; x++ ) {

    switch (sc.type) {
        case "int":
            idName = "in" + sc.name;
            idSelector = "#" + idName;
            if ( sc.required == true || typeof sc.required == "undefined" ) {
                fstr = " if (" + makeJQS( idSelector ) + ".val().trim() == '') { " +
                    " validationError('" + idSelector + "', '" +
                    useLabel( sc.name, sc.label ) + " is required'); return false;}"
            }
            // Not a settings_choice . . . just common sense
            fstr += " if ( isNaN(parseInt(" + makeJQS( idSelector ) + ".val().trim())) == true ) { " +
                " validationError('" + idSelector + "', '" +
                useLabel( sc.name, sc.label ) + " must be numeric'); return false;}";
            if ( typeof sc.minValue != "undefined" ) {
                fstr += " if (parseInt(" + makeJQS( idSelector ) + ".val()) < " + sc.minValue + ") { " +
                    " validationError('" + idSelector + "', '" + useLabel( sc.name, sc.label ) +
                    " below min. value " + sc.minValue + "'); return false;}"
            }
            if ( typeof sc.maxValue != "undefined" ) {
                fstr += " if (parseInt(" + makeJQS( idSelector ) + ".val()) > " + sc.maxValue + ") { " +
                    " validationError('" + idSelector + "', '" + useLabel( sc.name, sc.label ) +
                    " above max. value " + sc.maxValue + "'); return false;}"
            }
            fstr += "{ cb.settings['" + sc.name + "'] = parseInt(" + makeJQS( idSelector ) +
                ".val());}";
            // fstr += "}";
            // fstr = "{ alert('Int validation'); }";
            break;
        case "str":
            idName = "in" + sc.name;
            idSelector = "#" + idName;
            if ( sc.required == true || typeof sc.required == "undefined" ) {
                fstr += "if (" + makeJQS( idSelector ) + ".val().trim() == '') { " +
                    " validationError('" + idSelector + "', '" + useLabel( sc.name, sc.label ) +
                    " is required '); return false;}";
            }
            if ( sc.minLength != "undefined" ) {
                fstr += "if (" + makeJQS( idSelector ) + ".val().trim().length < " + sc.minLength + ") { " +
                    " validationError('" + idSelector + "', '" + useLabel( sc.name, sc.label ) +
                    " min. length is " + sc.minLength + " '); return false;}";
            }
            if ( sc.maxLength != "undefined" ) {
                fstr += "if (" + makeJQS( idSelector ) + ".val().trim().length > " + sc.maxLength + ") { " +
                    " validationError('" + idSelector + "', '" + useLabel( sc.name, sc.label ) +
                    " max. length is " + sc.maxLength + " '); return false;}";
            }
            fstr += "{ cb.settings['" + sc.name + "'] = " + makeJQS( idSelector ) + ".val().trim();}";
            // fstr += "}";
            // fstr = "{ alert('String validation'); }";
            break;
        case "choice":
            idName = "lst" + sc.name;
            idSelector = "#" + idName;
            // No error checking here, just add whatever is selected
            fstr = "{  cb.settings['" + sc.name + "'] = " + makeJQS( idSelector ) + ".val(); }";
            // fstr = "{ alert('choice validation');}";
            break;
        default:
            // cb.log( "Skipping " + sc.name + " Unknown Type: " + sc.type );
            break;
    }
    // }

    // fstr = fstr + " return ''; }";
    // alert(fstr);
    return "function validate" + idName + "() {" + fstr + "}";

}

function validationError(id, mesg) {

    $( id ).after( "<DIV class='errorLabel'>" + mesg + "</DIV>" );
    setTimeout( function () {
        $( id ).focus();
    }, 50 );
}

function clearErrors() {

    $( ".errorLabel" ).remove();

}

/**
 *
 * makeJQS - just wraps a JQ selector in "$(' . . . ')"
 *           to make the sources a little cleaner in
 *           generated code.
 *
 * @param tgt
 * @returns {string}
 */
function makeJQS(tgt) {

    return "$('" + tgt + "')";

}

function useLabel(sname, slabel) {

    return (typeof slabel == 'undefined' ? sname : slabel);

}
function btnActivateClicked() {

//noinspection JSUnresolvedFunction
    clearErrors();

    $( ".settingInput" ).change();

    if ( $( ".errorLabel" ).length == 0 ) {
        $( "#btnActivate" ).prop( "disabled", true );
        $( ".settingInput" ).prop( "disabled", true );
        cb.log( "Validation successful" );
        cb.changeRoomSubject( cb.room_slug + "'s room" );
        if ( ADK.initFunction != "" )
            window[ADK.initFunction]();
        else {
            // NOW, it's safe to load the script after the settings_choices have
            // been input and validated
            loadScript();
        }

        cb.drawPanel();

    }
    else { //noinspection JSUnresolvedFunction
        // cb.log( "Validation failed: " + validateSettings() );
    }

}

function createTippingHTML(defaultTip, defaultNote) {

    var currTipOptions = cb.tipOptions();

    // clear panel first
    $( ".tipLabel" ).remove();
    $( ".tipField" ).remove();

    var hstr;

    // Massage the optional variables
    if ( typeof defaultTip == "undefined" ) {
        defaultTip = 1;
    }
    if ( typeof defaultNote == "undefined" ) {
        defaultNote = "";
    }

    $( "#Tipping" ).append( "<DIV class='tipLabel' >Tip Amount from " + getSelectedUser() + "</DIV>" );
    $( "#Tipping" ).append( "<INPUT type='text' id='inTipAmount' class='tipField' + value='" +
        defaultTip + "'>" );
    // $("#Tipping" ).append("<DIV><INPUT type='text' id='inTipAmount' class='tipField' + value='" +
    //    defaultTip + "'></DIV>");

    if ( currTipOptions.length == 0 ) { // Display the default note box
        $( "#Tipping" ).append( "<DIV class='tipLabel' >Tip Note</DIV>" );
        $( "#Tipping" ).append( "<TEXTAREA id='inTipNote' class='tipField'  >" + defaultNote +
            "</TEXTAREA>" );
    } else {
        $( "#Tipping" ).append( "<DIV class='tipLabel'>" + currTipOptions['label'] + "</DIV>" );
        // hstr = hstr + "<LABEL STYLE='display:block'>" + currTipOptions['label'] + "</LABEL>" +
        $( "#Tipping" ).append( "<SELECT id='lstTipping' class='tipField'>" );
        $( "#lstTipping" )
            .attr( ("value", 'Select a choice:' )
                .text( 'Select a choice:' ) );
        for ( var x = 0; x < currTipOptions.options.length; x++ ) {
            $( "#lstTipping" )
                .append( ("<SELECT id='lstTipping' class='tipField'>")
                    .attr( "value", currTipOptions.options[x].label )
                    .text( currTipOptions.options[x].label ) );
        }
    }
    // document.getElementById( "Tip" ).innerHTML = hstr;
}


Object.size = function (obj) {
    var size = 0, key;
    for ( key in obj ) {
        if ( obj.hasOwnProperty( key ) ) size++;
    }
    return size;
};

function getSelectedUser() {
    // Returns user selected in the User Chat dropdown list
    //
    // Since we seed some valid dummy sample users, no error checking is done
    //
    var ele = document.getElementById( "lstUsers" );
    return  ele.options[ele.selectedIndex].value;

}

function press(e) {
    // IE uses "window.event", others pass the event as argument
    var evt = e || window.event;
    if ( evt.keyCode == 13 ) {
        cb.sendClicked( document.activeElement['id'] );
        return false;
    }
}

function objTipObject(fromUser, amt, msg) {


    this['amount'] = amt;  // amount of tip
    this['message'] = msg; // message in tip
    this['to_user'] = cb.room_slug;  // user who received tip
    this['from_user'] = fromUser; // user who sent tip
    this['from_user_in_fanclub'] = cb.cbUsers[fromUser].in_fanclub; // is the user in the broadcasters fan club
    this['from_user_has_tokens'] = cb.cbUsers[fromUser].has_tokens; //does the user have at least 1 token
    this['from_user_is_mod'] = cb.cbUsers[fromUser].is_mod; // is the user a moderator
    this['from_user_tipped_recently'] = cb.cbUsers[fromUser].tipped_recently; // is the user a “dark blue”?
    this['from_user_gender'] = cb.cbUsers[fromUser].gender; // “m” (male), “f” (female), “s” (shemale), or “c” (couple)

    cb.cbUsers[fromUser].tipped_recently = true;

}

function sendTipClicked() {

    var amt = parseInt( $( "#inTipAmount" ).val() );
    var msg = document.getElementById( "lstTipping" );
    if ( msg == null )
        msg = document.getElementById( "inTipNote" ).value;
    else
        msg = msg.options[msg.selectedIndex].value;

    var currentTip = new objTipObject( getSelectedUser(), amt, msg );


    var area = document.getElementById( "txtUserChat" );
    area.innerHTML += "<span style='color: black;background-color: yellow;' >" +
        currentTip['from_user'] + " has tipped " + currentTip['amount'] + " tokens</span></br>";
    area.scrollTop = area.scrollHeight;

    area = document.getElementById( "txtBroadcaster" );
    area.innerHTML += "<span style='color: black;background-color: yellow;' >" +
        currentTip['from_user'] + " has tipped " + currentTip['amount'] + " tokens -- " + msg + "</span></br>";
    area.scrollTop = area.scrollHeight;

    cb.tipHandler( currentTip );


}

function onTip(func) {

    this.tipHandler = func;

    return func;

}

function createMesg(fromUser, mesg) {

    var tmp = [];

    // why am I using "tmp" instead of "this."?
    tmp['m'] = mesg;
    tmp['user'] = fromUser;
    tmp['c'] = "black";
    tmp['f'] = "some font";  // TODO: Implement changing fonts
    tmp['in_fanclub'] = cb.cbUsers[fromUser].in_fanclub;
    tmp['has_tokens'] = cb.cbUsers[fromUser].has_tokens;
    tmp['is_mod'] = cb.cbUsers[fromUser].is_mod;
    tmp['tipped_recently'] = cb.cbUsers[fromUser].tipped_recently;
    tmp['gender'] = cb.cbUsers[fromUser].gender;
    tmp['X-Spam'] = false;
    tmp['background'] = "white";

    if ( tmp['user'] == "Notice" ) {
        tmp['c'] = "black";
        tmp['background'] = "white";
    }

    return tmp;

}

/**
 *
 * insertEmotes
 *
 * Takes a string and replaces occurences of ":emote tags" with <IMG> tags
 *
 * An emote tag can be an arbitrary sequence of letters & numbers only
 * (no spaces or special characters).  And for simple testing purposes
 * will be case insensitive.
 *
 * @param htmlString
 *
 */
function insertEmotes(htmlString) {

    var ePos, eString;

    if ( htmlString.indexOf( "<IMG src=" ) == -1 ) { // check to make sure we haven't already done this chunk
        while ( (eString = htmlString.match( /:\w+/ )) != null ) {
            ePos = htmlString.indexOf( eString[0] );
            htmlString = htmlString.substr( 0, ePos ) +
                "<IMG src='" + "emotes/" + eString[0].substr( 1 ) + ".gif' alt='" + "@!@" +
                eString[0].substr( 1 ) + "' title='@!@" + eString[0].substr( 1 ) + "'>" +
                htmlString.substr( ePos + eString[0].length );
        }
        htmlString = htmlString.replace( /@!@/g, ":" ); // Can't use the : in the alt tag or we get infinite loops
    }

    return htmlString;

}
/**
 *
 * cbInit - the main entry point
 *
 * Instantiates the cb object and tries to do something smart
 * about the script name and startup/init function
 *
 * @param scriptFile
 * @param appInitFunction
 */

function cbInit(scriptFile, appInitFunction) {

    /**
     * First, check to see if there's an Init function specified -- if so,
     * then we can go on our merry way . . . otherwise . . .
     *
     * As of v1.4 this is deprecated
     *
     */
    if ( appInitFunction != "" && scriptFile != "" ) { // Deprecated
        ADK.initFunction = appInitFunction;
        ADK.scriptName = scriptFile;
        ADK.trueScriptName = scriptFile;

        document.getElementById( "Script" ).style.visibility = "hidden";

        ADK.readyToRun = true; // we have a script and init function
    }

    else {
        if ( window.File && window.FileList && window.FileReader ) {
            document.getElementById( 'inFileList' ).addEventListener( 'change', readScript, false );
        } else {
            alert( "Your browser doesn't appear to fully support the HTML5 FILE APIs\n" +
                "required to parse the script file.  Please consider upgrading your\n" +
                "browser or using an Init function" );
        }
    }

    if ( ADK.readyToRun == true ) {
        cb = new objCB();
    }

}

/**
 *
 * Everything below here is related to extracting the cb_settings
 * from scripts that choose to execute code outside functions (i.e.
 * init-less scripts) and handling script loading.
 *
 */
function okBtnClicked() {

    ADK.initFunction = getInitFunction();

    if ( ADK.scriptName != "" ) {
        /**
         *
         * We need to disable the script/init/ok elements otherwise
         * things will get very messy very quickly.  Main problem
         * is all the generated code that gets injected into BODY.
         *
         * A secondary concern is a dev getting sloppy with closures/
         * scoping/initializations.
         *
         * Rather than attempting to clear everything out, just make
         * them start over every time.
         *
         */
        $( "#inFileList" ).prop( "disabled", true );
        $( "#lstFunctions" ).prop( "disabled", true );
        $( "#btnOK" ).prop( "disabled", true );
        cb = new objCB();
        if ( ADK.initFunction != "" ) {  // We have an init function, so DON'T defer script loading
            loadScript();
        }
    }

}
function readScript(evt) {

    var contents;
    var sFile = evt.target.files[0];
    ADK.scriptName = window.URL.createObjectURL( evt.target.files[0] );
    ADK.trueScriptName = evt.target.files[0].name;

    if ( sFile ) {
        var fReader = new FileReader();
        fReader.onload = function (e) {
            contents = e.target.result;
            ADK.settingsChoices = parseScript( contents );
            parseFunctions( contents );
        };
        fReader.readAsText( sFile );
    } else {
        alert( "Failed to load file" );
    }

}


/**
 *
 * parseScript
 *
 * Parse thru the script file to find the cb.settings_choices line(s)
 *
 * @param scriptInput
 * @returns {string}
 */
function parseScript(scriptInput) {

    var i, x;
    var workingContents;
    var multilineComment = false;

    // Get rid of annoying CRs
    scriptInput = scriptInput.replace( /\r/g, "" );
    // split the the mass of text into an easy to work with Array
    workingContents = scriptInput.split( "\n" );

    for ( i = 0; i < workingContents.length; i++ ) {
        /**
         *
         * Do some very crude processing to get rid of comments & blank lines first
         *
         *
         */

        // First, if we're in the middle of a multiline comment check for "*/"
        //
        if ( multilineComment == true ) {
            if ( workingContents[i].indexOf( "*/" ) != -1 ) {
                multilineComment = false;
                workingContents.splice( i, 1 );
                i--;
                continue;
            }
        }
        // Then check to see if we're starting a multiliner (/*) . . .
        if ( x = workingContents[i].indexOf( "/*" ) != -1 ) {
            multilineComment = true;
            workingContents[i] = workingContents[i].substr( 0, x - 1 );
        }
        // Then check to see if we're starting a end of liner (//) . . .
        if ( x = workingContents[i].indexOf( "//" ) != -1 ) {
            workingContents[i] = workingContents[i].substr( 0, x - 1 );
        }
        // Get rid of the whitespace
        workingContents[i] = workingContents[i].trim();
        // Now see if there's anything left of the line
        if ( workingContents[i] == "" ) {
            workingContents.splice( i, 1 );
            i--;
            continue;
        }

        /**
         *
         * OK, we should have a fairly clean script now in memory so
         * let's find what we came looking for . . . cb.settings_choices
         *
         */
        var foundTarget = false, targetString = "", patt = "cb.settings_choices *=";
        for ( i = 0; i < workingContents.length; i++ ) {
            if ( workingContents[i].match( patt ) ) {
                workingContents[i] = workingContents[i].substr( workingContents[i].indexOf( "=" ) + 1 );
                foundTarget = true;
            }
            if ( foundTarget == true ) {
                targetString += workingContents[i];
                if ( targetString.substr( targetString.length - 1 ) == ";" ) {
                    return targetString.substr( 0, targetString.length - 1 );
                }
            }


        }

    }


    return "";

}

/**
 * parseFunctions
 *
 * Populates the lstFunctions dropdown box with a list of
 * function names found in the script file
 *
 * @param scriptInput
 */
function parseFunctions(scriptInput) {

    var i, x;
    var workingContents;
    var multilineComment = false;

    // Get rid of annoying CRs
    scriptInput = scriptInput.replace( /\r/g, "" );
    // split the the mass of text into an easy to work with Array
    workingContents = scriptInput.split( "\n" );

    for ( i = 0; i < workingContents.length; i++ ) {
        /**
         *
         * Do some very crude processing to get rid of comments & blank lines first
         *
         *
         */

        // First, if we're in the middle of a multiline comment check for "*/"
        //
        if ( multilineComment == true ) {
            if ( workingContents[i].indexOf( "*/" ) != -1 ) {
                multilineComment = false;
                workingContents.splice( i, 1 );
                i--;
                continue;
            }
        }
        // Then check to see if we're starting a multiliner (/*) . . .
        if ( x = workingContents[i].indexOf( "/*" ) != -1 ) {
            multilineComment = true;
            workingContents[i] = workingContents[i].substr( 0, x - 1 );
        }
        // Then check to see if we're starting a end of liner (//) . . .
        if ( x = workingContents[i].indexOf( "//" ) != -1 ) {
            workingContents[i] = workingContents[i].substr( 0, x - 1 );
        }
        // Get rid of the whitespace
        workingContents[i] = workingContents[i].trim();
        // Now see if there's anything left of the line
        if ( workingContents[i] == "" ) {
            workingContents.splice( i, 1 );
            i--;
            continue;
        }
    }
    /**
     *
     * OK, we should have a fairly clean script now in memory so
     * let's find what we came looking for . . . function names!
     *
     */
    var funcName, found, dropdownFunctions, newEntry, targetString = "";

    dropdownFunctions = document.getElementById( "lstFunctions" );

    // Clear old functions in case user changes scripts
    while ( dropdownFunctions.length > 0 ) {
        dropdownFunctions.remove( 0 );
    }

    newEntry = document.createElement( "option" );
    newEntry.value = "";
    newEntry.textContent = "(none)";
    dropdownFunctions.appendChild( newEntry );
    dropdownFunctions.selectedIndex = 0;

    for ( i = 0; i < workingContents.length; i++ ) {
        if ( (found = workingContents[i].match( /^function \w*/i )) != null ) {
            funcName = found[0].substr( 9 );
            newEntry = document.createElement( "option" );
            newEntry.value = funcName;
            newEntry.textContent = funcName;
            dropdownFunctions.appendChild( newEntry );

            if ( funcName.match( /init/i ) != null ) {
                dropdownFunctions.selectedIndex = dropdownFunctions.length - 1;
            }

        }
    }

}

/**
 *
 * Merely returns the selected init function
 *
 * @returns {*}
 */
function getInitFunction() {
    var ele = document.getElementById( "lstFunctions" );
    return  ele.options[ele.selectedIndex].value;
}
function loadScript() {

    var script = document.createElement( "script" );
    script.type = "text/javascript";

    if ( script.readyState ) {  //IE
        script.onreadystatechange = function () {
            if ( script.readyState == "loaded" ||
                script.readyState == "complete" ) {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = ADK.scriptName;
    document.getElementsByTagName( "body" )[0].appendChild( script );
}

function callback() {
    cb.log( ADK.trueScriptName + " loaded" );
    if ( ADK.settingsChoices == "" ) {
        showSettings( "#Settings", cb.settings_choices ); // Script has to be loaded before these can be done
        // createValidationCode( cb.settings_choices );
    }
    createTippingHTML( 1, "" );
}
