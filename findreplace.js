var elements = document.getElementsByTagName('*');
var re = /$[0-9\.]+/i

function parseMoney(grp) {
    return parseFloat(grp[1]);
}

function roundToPlaces(num, places) {
    var scale = Math.pow(10, places);
    return Math.round(num * scale) / scale;
}

// TODO can't we just regex on the whole HTML (i.e. body text contents)?
elements.forEach(function(elt) {
    elt.childNodes.forEach(function(child, idx) {
        if (child.nodeType === 3) {
            var txt = child.nodeValue;
            // find/replace until there are none left
            var match;
            while (match = txt.match(re)) {
                // get amount
                // TODO replace with actual item price
                var itemPrice = 1.50;
                var itemName = "loads of laundry";

                var itemAmt = roundToPlaces(parseMoney(grp), 2);
                txt = txt.replace(re, itemAmt + " " + itemName);
            }
            elt.replaceChild(document.createTextNode(txt), child);
        }
    });
});
