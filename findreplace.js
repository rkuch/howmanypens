(function() {
    function parseMoney(grp) {
        return parseFloat(grp[1].replace(/,/g, ''));
    }

    function roundToPlaces(num, places) {
        var scale = Math.pow(10, places);
        return Math.round(num * scale) / scale;
    }

    function randFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    var xhr = new XMLHttpRequest();
    //http://stackoverflow.com/questions/354044/what-is-the-best-u-s-currency-regex
    var re = /\$[+-]?([0-9,]+(?:\.[0-9]+)?)( (million|billion|trillion|thousand))?/i;
    var elements = document.getElementsByTagName('*');

    xhr.onreadystatechange = function() {
        if (xhr.readyState != XMLHttpRequest.DONE) {
            return;
        }

        var items = JSON.parse(xhr.responseText);

        // XXX: can't we just regex on the whole HTML (i.e. body text contents)?
        for (var j = 0; j < elements.length; j++) {
            var elt = elements[j];
            for (var k = 0; k < elt.childNodes.length; k++) {
                var child = elt.childNodes[k];
                if (child.nodeType === 3) {
                    var txt = child.nodeValue;
                    // find/replace until there are none left
                    var match;
                    while (match = txt.match(re)) {
                        var item = randFromArray(items);

                        var itemAmt = roundToPlaces(parseMoney(match) / item.price, 2);
                        var written = match[2] ? " " + match[2] : "";
                        txt = txt.replace(re, itemAmt + written + " " + item.name);
                    }
                    elt.replaceChild(document.createTextNode(txt), child);
                }
            }
        }
    }; // Implemented elsewhere.
    xhr.open("GET", chrome.extension.getURL('/things.json'), true);
    xhr.send();
})();
