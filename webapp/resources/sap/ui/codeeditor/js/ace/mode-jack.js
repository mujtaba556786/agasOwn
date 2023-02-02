ace.define("ace/mode/jack_highlight_rules",[],function(e,t,n){"use strict";var r=e("../lib/oop");var i=e("./text_highlight_rules").TextHighlightRules;var a=function(){this.$rules={start:[{token:"string",regex:'"',next:"string2"},{token:"string",regex:"'",next:"string1"},{token:"constant.numeric",regex:"-?0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"(?:0|[-+]?[1-9][0-9]*)\\b"},{token:"constant.binary",regex:"<[0-9A-Fa-f][0-9A-Fa-f](\\s+[0-9A-Fa-f][0-9A-Fa-f])*>"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:"constant.language.null",regex:"null\\b"},{token:"storage.type",regex:"(?:Integer|Boolean|Null|String|Buffer|Tuple|List|Object|Function|Coroutine|Form)\\b"},{token:"keyword",regex:"(?:return|abort|vars|for|delete|in|is|escape|exec|split|and|if|elif|else|while)\\b"},{token:"language.builtin",regex:"(?:lines|source|parse|read-stream|interval|substr|parseint|write|print|range|rand|inspect|bind|i-values|i-pairs|i-map|i-filter|i-chunk|i-all\\?|i-any\\?|i-collect|i-zip|i-merge|i-each)\\b"},{token:"comment",regex:"--.*$"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"storage.form",regex:"@[a-z]+"},{token:"constant.other.symbol",regex:":+[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"variable",regex:"[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?"},{token:"keyword.operator",regex:"\\|\\||\\^\\^|&&|!=|==|<=|<|>=|>|\\+|-|\\*|\\/|\\^|\\%|\\#|\\!"},{token:"text",regex:"\\s+"}],string1:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:"[^'\\\\]+"},{token:"string",regex:"'",next:"start"},{token:"string",regex:"",next:"start"}],string2:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/},{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:'"',next:"start"},{token:"string",regex:"",next:"start"}]}};r.inherits(a,i);t.JackHighlightRules=a});ace.define("ace/mode/matching_brace_outdent",[],function(e,t,n){"use strict";var r=e("../range").Range;var i=function(){};(function(){this.checkOutdent=function(e,t){if(!/^\s+$/.test(e))return false;return/^\s*\}/.test(t)};this.autoOutdent=function(e,t){var n=e.getLine(t);var i=n.match(/^(\s*\})/);if(!i)return 0;var a=i[1].length;var o=e.findMatchingBracket({row:t,column:a});if(!o||o.row==t)return 0;var s=this.$getIndent(e.getLine(o.row));e.replace(new r(t,0,t,a-1),s)};this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype);t.MatchingBraceOutdent=i});ace.define("ace/mode/folding/cstyle",[],function(e,t,n){"use strict";var r=e("../../lib/oop");var i=e("../../range").Range;var a=e("./fold_mode").FoldMode;var o=t.FoldMode=function(e){if(e){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end))}};r.inherits(o,a);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)){if(!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return""}var i=this._getFoldWidgetBase(e,t,n);if(!i&&this.startRegionRe.test(r))return"start";return i};this.getFoldWidgetRange=function(e,t,n,r){var i=e.getLine(n);if(this.startRegionRe.test(i))return this.getCommentRegionBlock(e,i,n);var a=i.match(this.foldingStartMarker);if(a){var o=a.index;if(a[1])return this.openingBracketBlock(e,a[1],n,o);var s=e.getCommentFoldRange(n,o+a[0].length,1);if(s&&!s.isMultiLine()){if(r){s=this.getSectionRange(e,n)}else if(t!="all")s=null}return s}if(t==="markbegin")return;var a=i.match(this.foldingStopMarker);if(a){var o=a.index+a[0].length;if(a[1])return this.closingBracketBlock(e,a[1],n,o);return e.getCommentFoldRange(n,o,-1)}};this.getSectionRange=function(e,t){var n=e.getLine(t);var r=n.search(/\S/);var a=t;var o=n.length;t=t+1;var s=t;var g=e.getLength();while(++t<g){n=e.getLine(t);var l=n.search(/\S/);if(l===-1)continue;if(r>l)break;var c=this.getFoldWidgetRange(e,"all",t);if(c){if(c.start.row<=a){break}else if(c.isMultiLine()){t=c.end.row}else if(r==l){break}}s=t}return new i(a,o,s,e.getLine(s).length)};this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/);var a=e.getLength();var o=n;var s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var g=1;while(++n<a){t=e.getLine(n);var l=s.exec(t);if(!l)continue;if(l[1])g--;else g++;if(!g)break}var c=n;if(c>o){return new i(o,r,c,t.length)}}}).call(o.prototype)});ace.define("ace/mode/jack",[],function(e,t,n){"use strict";var r=e("../lib/oop");var i=e("./text").Mode;var a=e("./jack_highlight_rules").JackHighlightRules;var o=e("./matching_brace_outdent").MatchingBraceOutdent;var s=e("./behaviour/cstyle").CstyleBehaviour;var g=e("./folding/cstyle").FoldMode;var l=function(){this.HighlightRules=a;this.$outdent=new o;this.$behaviour=new s;this.foldingRules=new g};r.inherits(l,i);(function(){this.lineCommentStart="--";this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t);if(e=="start"){var i=t.match(/^.*[\{\(\[]\s*$/);if(i){r+=n}}return r};this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)};this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)};this.$id="ace/mode/jack"}).call(l.prototype);t.Mode=l});(function(){ace.require(["ace/mode/jack"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();
//# sourceMappingURL=mode-jack.js.map