define(function(require, exports, module) {

var ID_REGEX = /[a-zA-Z_0-9\$]/;

function retrievePreceedingIdentifier(text, pos) {
    var buf = [];
    for (var i = pos-1; i >= 0; i--) {
        if(ID_REGEX.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf.reverse().join("");
}

function retrieveFullIdentifier(text, pos) {
    var buf = [];
    var i = pos >= text.length ? (text.length - 1) : pos;
    while (i < text.length && ID_REGEX.test(text[i]))
        i++;
    // e.g edge semicolon check
    i = pos == text.length ? i : i-1;
    for (; i >= 0 && ID_REGEX.test(text[i]); i--) {
        buf.push(text[i]);
    }
    i++;
    var text = buf.reverse().join("");
    if (text.length == 0)
        return null;
    return {
        sc: i,
        text: text
    };
}

function prefixBinarySearch(items, prefix) {
    var startIndex = 0;
    var stopIndex = items.length - 1;
    var middle = Math.floor((stopIndex + startIndex) / 2);
    
    while (stopIndex > startIndex && middle >= 0 && items[middle].indexOf(prefix) !== 0) {
        if (prefix < items[middle]) {
            stopIndex = middle - 1;
        }
        else if (prefix > items[middle]) {
            startIndex = middle + 1;
        }
        middle = Math.floor((stopIndex + stopIndex) / 2);
    }
    
    // Look back to make sure we haven't skipped any
    while (middle > 0 && items[middle-1].indexOf(prefix) === 0)
        middle--;
    return middle >= 0 ? middle : 0; // ensure we're not returning a negative index
}

function findCompletions(prefix, allIdentifiers) {
    allIdentifiers.sort();
    var startIdx = prefixBinarySearch(allIdentifiers, prefix);
    var matches = [];
    for (var i = startIdx; i < allIdentifiers.length && allIdentifiers[i].indexOf(prefix) === 0; i++)
        matches.push(allIdentifiers[i]);
    return matches;
}

exports.retrievePreceedingIdentifier = retrievePreceedingIdentifier;
exports.retrieveFullIdentifier = retrieveFullIdentifier;
exports.findCompletions = findCompletions;

});