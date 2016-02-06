var elements = document.getElementsByTagName('*');
//var re = /\$([0-9\.]+)/i

//http://stackoverflow.com/questions/354044/what-is-the-best-u-s-currency-regex
var re = /[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?/

function parseMoney(grp) {
    return parseFloat(grp[1]);
}

function roundToPlaces(num, places) {
    var scale = Math.pow(10, places);
    return Math.round(num * scale) / scale;
}

// TODO can't we just regex on the whole HTML (i.e. body text contents)?
for (var j = 0; j < elements.length; j++) {
    var elt = elements[j];
    for (var k = 0; k < elt.childNodes.length; k++) {
        var child = elt.childNodes[k];
        if (child.nodeType === 3) {
            var txt = child.nodeValue;
            // find/replace until there are none left
            var match;
            while (match = txt.match(re)) {
                // get amount
                // TODO replace with actual item price
                var itemPrice = 1.50;
                var itemName = "loads of laundry";

                var itemAmt = roundToPlaces(parseMoney(match) / itemPrice, 2);
                txt = txt.replace(re, itemAmt + " " + itemName);
            }
            elt.replaceChild(document.createTextNode(txt), child);
        }
    }
}
