/*! elementQuery | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function (window, document, undefined) {
    // Enable strict mode
    "use strict";

    // Use Sizzle standalone or from jQuery
    var sizzle = window.Sizzle || jQuery.find;

    // Set the number of sizzle selectors to cache (default is 50)
    //sizzle.selectors.cacheLength = 50;

    var queryData = {};

    var addQueryDataValue = function (selector, type, pair, number, value) {

        selector = trim(selector);

        if (selector != "") {
            var parts;
            if (!number && !value) {
                parts = /^([0-9]*.?[0-9]+)(px|em)$/.exec(pair)
                if (parts != null) {
                    number = Number(parts[1]);
                    if (number + "" != "NaN") {
                        value = parts[2];
                    }
                }
            }

            if (value) {
                // Compile the sizzle selector
                if (sizzle.compile) {
                    sizzle.compile(selector);
                }

                // Update the queryData object
                if (queryData[selector] === undefined) {
                    queryData[selector] = {};
                }
                if (queryData[selector][type] === undefined) {
                    queryData[selector][type] = {};
                }
                queryData[selector][type][pair] = [number, value];
            }
        }
    };

    var updateQueryData = function (data, doUpdate) {

        var i, j, k;
        for (i in data) {
            for (j in data[i]) {
                if (typeof data[i][j] == "string") {
                    addQueryDataValue(i, j, data[i][j]);
                }
                else if (typeof data[i][j] == "object") {
                    for (k = 0; k < data[i][j].length; k++) {
                        addQueryDataValue(i, j, data[i][j][k]);
                    }
                }
            }
        }

        if (doUpdate == true) {
            refresh();
        }
    };


    // Refactor from jQuery.trim()
    var trim = function (text) {
        if (text == null) {
            return "";
        }
        else {
            var core_trim = "".trim;
            if (core_trim && !core_trim.call("\uFEFF\xA0")) {
                return core_trim.call(text);
            }
            else {
                return (text + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            }
        }
    };

    // Refactor from jquery().addClass() and jquery().removeClass()
    var clean = function (element, attr) {
        // This expression is here for better compressibility
        var val = element.getAttribute(attr);
        return val ? (" " + val + " ").replace(/[\t\r\n]/g, " ") : " ";
    };

    // Refactor from jquery().addClass()
    var addTo = function (element, attr, value) {

        if (element.nodeType === 1) {
            var val = trim(value);
            if (val != "") {
                var cur = clean(element, attr);
                
                if (cur.indexOf(" " + val + " ") < 0) {
                    // Add the value if its not already there
                    element.setAttribute(attr, trim(cur + val));
                }
            }
        }
    };

    // Refactor from jquery().removeClass()
    var removeFrom = function (element, attr, value) {

        if (element.nodeType === 1) {
            var val = trim(value);
            if (val != "") {
                var cur = clean(element, attr);
                var updated = false;
                while (cur.indexOf(" " + val + " ") >= 0) {
                    // Remove the value
                    cur = cur.replace(" " + val + " ", " ");
                    updated = true;
                }
                if (updated) {
                    // Update the attribute
                    element.setAttribute(attr, trim(cur));
                }
            }
        }
    };

    var refresh = function () {

        var i, ei, j, k, elements, element, val;

        // For each selector
        for (i in queryData) {

            // Get the items matching the selector
            elements = sizzle(i);

            if (elements.length > 0) {

                // For each matching element
                for (ei = 0; ei < elements.length; ei++) {
                    element = elements[ei];

                    // For each min|max-width|height string
                    for (j in queryData[i]) {

                        // For each number px|em value pair
                        for (k in queryData[i][j]) {

                            val = queryData[i][j][k][0];

                            if (queryData[i][j][k][1] == "em") {
                                // Convert EMs to pixels
                                val = val * (window.getEmPixels ? getEmPixels(element) : 16); // NOTE: Using getEmPixels() has a small performance impact
                            }

                            /* NOTE: Using offsetWidth/Height so an element can be adjusted when it reaches a specific size.
                            /* For Nested queries scrollWidth/Height or clientWidth/Height may sometime be desired but are not supported. */

                            if ((j == "min-width" && element.offsetWidth >= val) ||
                                (j == "max-width" && element.offsetWidth <= val) ||
                                (j == "min-height" && element.offsetHeight >= val) ||
                                (j == "max-height" && element.offsetHeight <= val)) {
                                // Add matching attr value
                                addTo(element, j, k);
                            }
                            else {
                                // Remove non-matching attr value
                                removeFrom(element, j, k);
                            }
                        }
                    }
                }
            }
        }

        if (!window.addEventListener && window.attachEvent) {
            // Force a repaint in IE7 and IE8
            var className = document.documentElement.className;
            document.documentElement.className = " " + className;
            document.documentElement.className = className;
        }
    }

    // Expose some public functions
    window.elementQuery = function (arg1, arg2) {

        if (arg1 && typeof arg1 == "object" && !(arg1.cssRules || arg1.rules)) {
            // Add new selector queries
            updateQueryData(arg1, arg2);
        }
        else if (!arg1 && !arg2) {
            refresh();
        }
    };

    //NOTE: For development purposes only! Added stub to prevent errors.
    window.elementQuery.selectors = function () { };

    if (window.addEventListener) {
        window.addEventListener("resize", refresh, false);
        window.addEventListener("DOMContentLoaded", refresh, false);
        window.addEventListener("load", refresh, false);
    }
    else if (window.attachEvent) {
        window.attachEvent("onresize", refresh);
        window.attachEvent("onload", refresh);
    }
}(this, document, undefined));

/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function (document, documentElement) {
    // Enable strict mode
    "use strict";

    // Form the style on the fly to result in smaller minified file
    var important = "!important;";
    var style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

    window.getEmPixels = function (element) {

        var extraBody;

        if (!element) {
            // Emulate the documentElement to get rem value (documentElement does not work in IE6-7)
            element = extraBody = document.createElement("body");
            extraBody.style.cssText = "font-size:1em" + important;
            documentElement.insertBefore(extraBody, document.body);
        }

        // Create and style a test element
        var testElement = document.createElement("i");
        testElement.style.cssText = style;
        element.appendChild(testElement);

        // Get the client width of the test element
        var value = testElement.clientWidth;

        if (extraBody) {
            // Remove the extra body element
            documentElement.removeChild(extraBody);
        }
        else {
            // Remove the test element
            element.removeChild(testElement);
        }

        // Return the em value in pixels
        return value;
    };
}(document, document.documentElement));
