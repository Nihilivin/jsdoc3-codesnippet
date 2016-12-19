'use strict';

/** Can't "use strict" as ES6 is not enabled by default in NodeJS: http://stackoverflow.com/questions/22603078/syntaxerror-use-of-const-in-strict-mode */

var beautify = require('js-beautify').js_beautify;
var logger = require('jsdoc/util/logger');

var _filecontent, _filename, snippets;

exports.handlers = {
	beforeParse: function beforeParse(event) {
		// Init vars
		_filecontent = event.source;
		_filename = event.filename;
		snippets = {};
	},
	parseComplete: function parseComplete(event) {
		for (var i in event.doclets) {
			var doclet = event.doclets[i];
			if (doclet.description && doclet.description.indexOf("{@snippet ") > -1) {
				doclet.description = doclet.description.replace(/{@snippet\s+(\w+?)(?:\s+(.*?))?}/g, function (matched, snippetCode, label) {
					if (snippets[snippetCode]) {
						return '\n<pre><code>\n' + snippets[snippetCode].content + '\n</code></pre>\n';
					} else {
						logger.error('Reference to inexistant snippet "' + snippetCode + '"');
						return "";
					}
				});
			}
		}
	}
};

exports.defineTags = function (dictionary) {
	dictionary.defineTag("snippet", {
		mustHaveValue: true,
		onTagged: function onTagged(doclet, tag) {
			doclet["snippet"] = tag.value;
		}
	});
	dictionary.defineTag("snippetStart", {
		mustHaveValue: true,
		onTagged: function onTagged(doclet, tag) {
			// only include the last doclet tagged
			if (!(doclet.meta.code && Object.keys(doclet.meta.code).length > 0)) {
				return;
			}
			if (snippets[doclet.value] != null) {
				logger.error('Redefinition of snippet name "' + doclet.value + '"');
			} else {
				snippets[tag.value] = { start: doclet.meta.range[0] };
			}
		}
	});
	dictionary.defineTag("snippetEnd", {
		mustHaveValue: true,
		onTagged: function onTagged(doclet, tag) {
			// only include the first doclet tagged
			if (!(doclet.meta.code && Object.keys(doclet.meta.code).length === 0)) {
				return;
			}
			if (snippets[tag.value] == null) {
				logger.error('End of snippet name "' + doclet.value + '" found before its beginning. Did you forget the "@snippetStart ' + doclet.value + '" doclet?');
			} else {
				snippets[tag.value].end = doclet.meta.range[0];
				var innerSnippet = beautify(_filecontent.slice(snippets[tag.value].start, snippets[tag.value].end), {
					indent_size: 4
				});
				snippets[tag.value].content = innerSnippet;
			}
		}
	});
};