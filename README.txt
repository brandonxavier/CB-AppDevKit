
Chaturbate App Developer Kit (ADK)



What the ADK IS:

-   An extremely simple offline (i.e. runs in a standalone browser) way to run/test/debug apps
    without having to utilize the testbed server (perhaps your employer, like mine, frowns upon
    visiting adult-oriented sites while at work?)
-   A way to utilize your favorite debuggers/IDEs in your development (getting tired of spending 30+
    minutes chasing down a bug that would take 30 seconds to find in a debugger?)
-   Completely free of any external dependencies -- only the most generic Javascript is used -- no
    additional libraries/frameworks (JQuery, etc.) are used. The minimal set of software required is
    a browser and a text editor - although you probably almost always want to use some sort of IDE
    (at the risk of sounding like a shill, I'm quite happy with Webstorm)
-   Released under GPLv3 license.  Within the (quite liberal) constraints of the license, you're
    free to do with it as you please.
-   A convenient way for the real Chaturbate devs to prototype/test changes to the API.
-   Maintained at github (as are all my CB projects).  If you'd like to help improve this project,
    feel free to send me pull requests or contact me about rw access to the repository.


What the ADK is NOT:

-   A SUBSTITUTE FOR TESTING ON THE TESTBED!!!!! NEVER assume that just because an app/bot runs
    correctly in the ADK, that it's ready to go on the live server.  Always, ALWAYS do your final
    testing on the testbed!
-   A basis for a clone of Chaturbate.  Not even remotely possible.   If you even think this, your
    web development skills are in SERIOUS need of a reality check! :-)
-   Production ready code.  Nothing has been optimized for speed/performance, no runtime checking is
    performed, and no security best practices are followed (remember, it's intended to run offline).
    So, of course, there are almost always "better" ways to do things . . . but again, I wanted to
    keep this to as much simple JavaScript as possible.
-   An exact copy of how Chaturbate works.  The goal is for the ADK to produce the same results
    Chaturbate does - the code/means used to produce those results will almost certainly be
    different (I ain't psychic! LOL).  In addition, some objects are available in the ADK that are
    NOT available in the real Chaturbate -- most notably the "window" object (so be wary of using
    things like alert(), confirm(), etc. in your app/bot code)
 -  Pretty! If you want "pretty", visit your local art museum! LOL  Seriously though, it's primarily
    meant to be functional, not pleasing to the eye.  To that end, I'll fix anything, or accept pull
    requests (hint, hint) for things, that may be affecting functionality (form elements overlapping,
    stuff not displaying correctly, etc.) but requests for things like "can you change the background
    to blue?" are likely to be graciously ignored ;-)


Usage:

The ADK runtime system is composed of 3 files:

objCB.js    -   This provides the cb object.  Generally you should not have to modify this.
main.html   -   Basic HTML to display the ADK screen and load objCB.js along with your app/bot
                script.  You'll have to modify this to specify the name of your app/bot script and
                it's Init function.
main.css    -   All the basic formatting is done via css, so change it here to suit your preferences.
                Some formatting of generated elements (such as the settings_choices) is done with
                style attributes within the JavaScript code (Hint: Search for "STYLE=")  Note:  Un-
                less you're fixing some functional issue, main.css should NOT be included in pull
                requests.

Put these 3 files along with YOUR app/bot script in a folder/directory, fix up main.html to point to
your app/bot and then simply point your IDE/browser/debugger to main.html!

When the window opens in the browser, you should have 6 viewports:

Startup         -   (Top left) Processes the cb.settings_choices and provides a (de)activate button
Subject & Panel -   (Top right) Shows/Sets the Room Subject and also displays the Panel
Broadcaster     -   (Middle Left) Show the chat as the broadcaster sees it, and allows you to chat
                    as the broadcaster.
User            -   (Middle Right) Shows the chat as users see it. Note: Messages sent to a specific
                    user are suffixed with " to <username>".  You can chat as different users by
                    selecting one in the dropdown list. (No more having to open different browsers!)
Tip             -   (Bottom Left) The tip window laid out according to cb.tipOptions.
Log             -   (Bottom Right) cb.log messages are displayed here rather than the user/bcast
                    areas.  No /debug required to see them.



