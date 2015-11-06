var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();


module.exports = function pullFontSVG(data, pathOut) {
    parser.parseString(data, function(err, result) {
        if(err) throw err;

        var font_obj = result.svg.defs[0].font[0],
            default_width = Number(font_obj.$['horiz-adv-x']),
            chars = {
                ascent: Number(font_obj['font-face'][0].$.ascent),
                descent: Number(font_obj['font-face'][0].$.descent)
            };

        font_obj.glyph.forEach(function(glyph) {
            chars[glyph.$['glyph-name']] = {
                width: Number(glyph.$['horiz-adv-x']) || default_width,
                path: glyph.$.d
            };
        });

        // turn remaining double quotes into single
        var charStr = JSON.stringify(chars, null, 4).replace(/\"/g, '\'');

        var outStr = '/*jshint quotmark:true */\n\'use strict\';\n\n' +
            'module.exports = ' + charStr + ';\n';

        fs.writeFile(pathOut, outStr, function(err) {
            if(err) throw err;
        });
    });
};

