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

                        var itemAmt = parseMoney(match) / item.price;
                        if (itemAmt < 0.01) {
                            itemAmt = 0.01;
                        }
                        itemAmt = roundToPlaces(itemAmt, 2);
                        var written = match[2] ? " " + match[2] : "";
                        var itemName = item.name;
                        // contextual capitalization only if millions/billions was matched
                        if (written !== "" && written.charAt(0) == written[0].toUpperCase()) {
                            itemName = itemName.split(' ').map(function(elt) {
                                return elt == "of" ? elt : elt[0].toUpperCase() + elt.substring(1);
                            }).join(' ');
                        }
                        txt = txt.replace(re, itemAmt + written + " " + itemName);
                    }
                    elt.replaceChild(document.createTextNode(txt), child);
                }
            }
        }
    }; // Implemented elsewhere.
    xhr.open("GET", chrome.extension.getURL('/things.json'), true);
    xhr.send();
})();
