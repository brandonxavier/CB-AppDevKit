
Chaturbate App Developer Kit (ADK)


*******************************************************************************
*******************************************************************************

What the ADK IS:

-   An extremely simple offline (i.e. runs in a standalone browser) way to
    run/test/debug apps without having to utilize the testbed server (per-
    haps your employer, like mine, frowns upon visiting adult-oriented
    sites while at work?)
-   A way to utilize your favorite debuggers/IDEs in your development (getting
    tired of spending 30+ minutes chasing down a bug that would take 30 seconds
    to find in a debugger?)
-   Completely free of any external dependencies -- only the most generic
    Javascript is used -- no additional libraries/frameworks (JQuery, etc.)
    are used. The minimal set of software required is a browser and a text
    editor - although you probably almost always want to use some sort of IDE
    (at the risk of sounding like a shill, I'm quite happy with Webstorm)
-   Released under GPLv3 license.  Within the (quite liberal) constraints of
    the license, you're free to do with it as you please.
-   A convenient way for the real Chaturbate devs to prototype/test changes
    to the API.
-   Maintained at github (as are all my CB projects).  If you'd like to help
    improve this project, feel free to send me pull requests or contact me
    about rw access to the repository.

*******************************************************************************
*******************************************************************************

What the ADK is NOT:

-   A SUBSTITUTE FOR TESTING ON THE TESTBED!!!!! NEVER assume that just because
    an app/bot runs correctly in the ADK, that it's ready to go on the live
    server.  Always, ALWAYS do your final testing on the testbed!
-   A basis for a clone of Chaturbate.  Not even remotely possible.   If you
    even think this, your web development skills are in SERIOUS need of a
    reality check! :-)
-   Production ready code.  Nothing has been optimized for speed/performance,
    no runtime checking is performed, and no security best practices are
    followed (remember, it's intended to run offline). So, of course, there
    are almost always "better" ways to do things . . . but again, I wanted to
    keep this to as much simple JavaScript as possible.
-   An exact copy of how Chaturbate works.  The goal is for the ADK to produce
    the same results Chaturbate does - the code/means used to produce those
    results will almost certainly be different (I ain't psychic! LOL).  In
    addition, some objects are available in the ADK that are NOT available in
    the real Chaturbate -- most notably the "window" object (so be wary of
    using things like alert(), confirm(), etc. in your app/bot code)
 -  Pretty! If you want "pretty", visit your local art museum! LOL  Seriously
    though, it's primarily meant to be functional, not pleasing to the eye.
    To that end, I'll fix anything, or accept pull requests (hint, hint) for
    things, that may be affecting functionality (form elements overlapping,
    stuff not displaying correctly, etc.) but requests for things like "can
    you change the background to blue?" are likely to be graciously ignored

*******************************************************************************
*******************************************************************************

Usage:

The ADK runtime system is composed of 3 files:

objCB.js    -   This provides the cb object.  Generally you should not have
                to modify this.
main.html   -   Basic HTML to display the ADK screen and load objCB.js along
                with your app/bot script.  You MAY have to modify this to
                specify the name of your app/bot script and it's Init function.
main.css    -   All the basic formatting is done via css, so change it here
                to suit your preferences.  Some formatting of generated elements
                (such as the settings_choices) is done with style attributes
                within the JavaScript code (Hint: Search for "STYLE=")  Note:
                Unless you're fixing some functional issue, main.css should
                NOT be included in pull requests.

Put these 3 files along with YOUR app/bot script in a folder/directory, fix up
main.html to point to your app/bot and then simply point your IDE/browser/
debugger to main.html!

When the window opens in the browser, you should have 7 panels:

Script & Init   -   See below
Startup         -   (Top left) Processes the cb.settings_choices and provides
                    a (de)activate button
Subject & Panel -   (Top right) Shows/Sets the Room Subject and also displays
                    the Panel
Broadcaster     -   (Middle Left) Show the chat as the broadcaster sees it,
                    and allows you to chat as the broadcaster.
User            -   (Middle Right) Shows the chat as users see it. Note: Messages
                    sent to a specific user are suffixed with " to <username>".
                    You can chat as different users by selecting one in the
                    dropdown list. (No more having to open different browsers!)
                    The currently selected user is also assumed to be the one
                    sending tips and receiving customized panels (if implemented).
Tip             -   (Bottom Left) The tip window laid out according to
                    cb.tipOptions.
Log             -   (Bottom Right) cb.log messages are displayed here rather
                    than the user/bcast areas.  No /debug required to see them.


*******************************************************************************
*******************************************************************************

Specifying Your Script File & Init Function:

There are several ways to do this:

-   Change the optional parameters to cbInit in the main.html (well documented
    near the bottom of the file).  This is by far the most productive thing to
    do. However, if you don't use an Init-type script or if you execute any code
    outside of functions this can lead to problems. I'm tempted to go into an
    old-school rant about the wisdom of executing code outside of functions . . .
    but JS permits it . . . so I'll accept it as "valid" . . . and just leave it
    at that.
-   Leave the optional Init function out of the cbInit call.  The ADK will then
    try to parse your file to locate the "cb.settings_choices = " line(s) and
    eval them. This imitates the behavior of the "real" CB (i.e. the settings
    choices are set BEFORE code executes).  NOTE:  YOU WILL HAVE TO CHOOSE YOUR
    SCRIPT FILE EVERY TIME IF YOU USE THIS METHOD!  No way around this!  JS will
    not permit access to files on your computer without some sort of direct user
    interaction. The act of "choosing a file" is considered by JS to be per-
    mission to access that file (even though it's a nuisance here in this very
    limited case, as a general security precaution it's probably a VERY good
    thing JS does this)
-   Leave both the optional script and Init function out of main.html.  You can
    then select the script at runtime and optionally specify an Init function.

    Confused yet?  These two scenarios that will cover about 99% of everything:

    1.  You have an Init function named myInit() in a script file named
        "MyScript.js"  Simply make your main.html file look like:

        <SCRIPT>cbInit( "MyScript.js","myInit")</SCRIPT>

        And then COMPLETELY IGNORE THE SMALL "Script & Init Function" PANEL.
        (It's not required or recommended if both items are specified.)

     2. You do NOT use an Init function and/or you execute code outside of
        functions in your script file named "MyScript.js".  Make your main.html
        look like:

        <SCRIPT>cbInit("","")</SCRIPT>

        Then in the "Script & Init Function" Panel, hit "Choose File" to browse
        to your "MyScript.js" file, leave "Init function" blank, and hit OK.
        NOTE:  You MUST use the "Choose File" (or whatever your browser calls
        it) button -- this is what gives JS permission to read the file. Then
        fill in any settings in the "Startup" panel and hit "Activate".

      Other possible combinations of HTML and UI options may (probably) work
      but these are the simplest and most tested.  Perhaps sometime in the not
      too distant future if I get happier with the "<input type='file'>" tag
      this'll all converge into one clean and simpler method.

*******************************************************************************
*******************************************************************************

Emote Support:

Emote support is now available in a limited form for testing purposes. All
emotes are stored in the "emotes" folder located under "runtime".  The filename
of the emotes should match your emote tag, less the extension.  No attempt is
made to maintain mappings of tags to filenames.  So, for example, to show the
smile.gif file, you would use ":smile"

*******************************************************************************
*******************************************************************************

Problem Reporting:

If you come across a situation where a script is not working under the ADK as
it does on the live/testbed servers, by all means please let me know.  I can be
reached (in general order of preference) via github (issues), email at
brandonxavier421@gmail.com, or the Chaturbate API DISQUS discussions (my access
there during normal business hours is effectively zero though ;)   I will need
the following:  name and location (testbed or live server)of your script, init
function you use (or none, if you don't use one), what browser version you use,
and a general description of what the problem is unless it's obvious (like the
ADK crashes).



