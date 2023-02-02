ace.define("ace/mode/clojure_highlight_rules",[],function(e,t,n){"use strict";var r=e("../lib/oop");var s=e("./text_highlight_rules").TextHighlightRules;var a=function(){var e="* *1 *2 *3 *agent* *allow-unresolved-vars* *assert* *clojure-version* "+"*command-line-args* *compile-files* *compile-path* *e *err* *file* "+"*flush-on-newline* *in* *macro-meta* *math-context* *ns* *out* "+"*print-dup* *print-length* *print-level* *print-meta* *print-readably* "+"*read-eval* *source-path* *use-context-classloader* "+"*warn-on-reflection* + - -> ->> .. / < <= = "+"== > &gt; >= &gt;= accessor aclone "+"add-classpath add-watch agent agent-errors aget alength alias all-ns "+"alter alter-meta! alter-var-root amap ancestors and apply areduce "+"array-map aset aset-boolean aset-byte aset-char aset-double aset-float "+"aset-int aset-long aset-short assert assoc assoc! assoc-in associative? "+"atom await await-for await1 bases bean bigdec bigint binding bit-and "+"bit-and-not bit-clear bit-flip bit-not bit-or bit-set bit-shift-left "+"bit-shift-right bit-test bit-xor boolean boolean-array booleans "+"bound-fn bound-fn* butlast byte byte-array bytes cast char char-array "+"char-escape-string char-name-string char? chars chunk chunk-append "+"chunk-buffer chunk-cons chunk-first chunk-next chunk-rest chunked-seq? "+"class class? clear-agent-errors clojure-version coll? comment commute "+"comp comparator compare compare-and-set! compile complement concat cond "+"condp conj conj! cons constantly construct-proxy contains? count "+"counted? create-ns create-struct cycle dec decimal? declare definline "+"defmacro defmethod defmulti defn defn- defonce defstruct delay delay? "+"deliver deref derive descendants destructure disj disj! dissoc dissoc! "+"distinct distinct? doall doc dorun doseq dosync dotimes doto double "+"double-array doubles drop drop-last drop-while empty empty? ensure "+"enumeration-seq eval even? every? false? ffirst file-seq filter find "+"find-doc find-ns find-var first float float-array float? floats flush "+"fn fn? fnext for force format future future-call future-cancel "+"future-cancelled? future-done? future? gen-class gen-interface gensym "+"get get-in get-method get-proxy-class get-thread-bindings get-validator "+"hash hash-map hash-set identical? identity if-let if-not ifn? import "+"in-ns inc init-proxy instance? int int-array integer? interleave intern "+"interpose into into-array ints io! isa? iterate iterator-seq juxt key "+"keys keyword keyword? last lazy-cat lazy-seq let letfn line-seq list "+"list* list? load load-file load-reader load-string loaded-libs locking "+"long long-array longs loop macroexpand macroexpand-1 make-array "+"make-hierarchy map map? mapcat max max-key memfn memoize merge "+"merge-with meta method-sig methods min min-key mod name namespace neg? "+"newline next nfirst nil? nnext not not-any? not-empty not-every? not= "+"ns ns-aliases ns-imports ns-interns ns-map ns-name ns-publics "+"ns-refers ns-resolve ns-unalias ns-unmap nth nthnext num number? odd? "+"or parents partial partition pcalls peek persistent! pmap pop pop! "+"pop-thread-bindings pos? pr pr-str prefer-method prefers "+"primitives-classnames print print-ctor print-doc print-dup print-method "+"print-namespace-doc print-simple print-special-doc print-str printf "+"println println-str prn prn-str promise proxy proxy-call-with-super "+"proxy-mappings proxy-name proxy-super push-thread-bindings pvalues quot "+"rand rand-int range ratio? rational? rationalize re-find re-groups "+"re-matcher re-matches re-pattern re-seq read read-line read-string "+"reduce ref ref-history-count ref-max-history ref-min-history ref-set "+"refer refer-clojure release-pending-sends rem remove remove-method "+"remove-ns remove-watch repeat repeatedly replace replicate require "+"reset! reset-meta! resolve rest resultset-seq reverse reversible? rseq "+"rsubseq second select-keys send send-off seq seq? seque sequence "+"sequential? set set-validator! set? short short-array shorts "+"shutdown-agents slurp some sort sort-by sorted-map sorted-map-by "+"sorted-set sorted-set-by sorted? special-form-anchor special-symbol? "+"split-at split-with str stream? string? struct struct-map subs subseq "+"subvec supers swap! symbol symbol? sync syntax-symbol-anchor take "+"take-last take-nth take-while test the-ns time to-array to-array-2d "+"trampoline transient tree-seq true? type unchecked-add unchecked-dec "+"unchecked-divide unchecked-inc unchecked-multiply unchecked-negate "+"unchecked-remainder unchecked-subtract underive unquote "+"unquote-splicing update-in update-proxy use val vals var-get var-set "+"var? vary-meta vec vector vector? when when-first when-let when-not "+"while with-bindings with-bindings* with-in-str with-loading-context "+"with-local-vars with-meta with-open with-out-str with-precision xml-seq "+"zero? zipmap";var t="throw try var "+"def do fn if let loop monitor-enter monitor-exit new quote recur set!";var n="true false nil";var r=this.createKeywordMapper({keyword:t,"constant.language":n,"support.function":e},"identifier",false," ");this.$rules={start:[{token:"comment",regex:";.*$"},{token:"keyword",regex:"[\\(|\\)]"},{token:"keyword",regex:"[\\'\\(]"},{token:"keyword",regex:"[\\[|\\]]"},{token:"keyword",regex:"[\\{|\\}|\\#\\{|\\#\\}]"},{token:"keyword",regex:"[\\&]"},{token:"keyword",regex:"[\\#\\^\\{]"},{token:"keyword",regex:"[\\%]"},{token:"keyword",regex:"[@]"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language",regex:"[!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+||=|!=|<=|>=|<>|<|>|!|&&]"},{token:r,regex:"[a-zA-Z_$][a-zA-Z0-9_$\\-]*\\b"},{token:"string",regex:'"',next:"string"},{token:"constant",regex:/:[^()\[\]{}'"\^%`,;\s]+/},{token:"string.regexp",regex:'/#"(?:\\.|(?:\\")|[^""\n])*"/g'}],string:[{token:"constant.language.escape",regex:"\\\\.|\\\\$"},{token:"string",regex:'[^"\\\\]+'},{token:"string",regex:'"',next:"start"}]}};r.inherits(a,s);t.ClojureHighlightRules=a});ace.define("ace/mode/matching_parens_outdent",[],function(e,t,n){"use strict";var r=e("../range").Range;var s=function(){};(function(){this.checkOutdent=function(e,t){if(!/^\s+$/.test(e))return false;return/^\s*\)/.test(t)};this.autoOutdent=function(e,t){var n=e.getLine(t);var s=n.match(/^(\s*\))/);if(!s)return 0;var a=s[1].length;var i=e.findMatchingBracket({row:t,column:a});if(!i||i.row==t)return 0;var o=this.$getIndent(e.getLine(i.row));e.replace(new r(t,0,t,a-1),o)};this.$getIndent=function(e){var t=e.match(/^(\s+)/);if(t){return t[1]}return""}}).call(s.prototype);t.MatchingParensOutdent=s});ace.define("ace/mode/clojure",[],function(e,t,n){"use strict";var r=e("../lib/oop");var s=e("./text").Mode;var a=e("./clojure_highlight_rules").ClojureHighlightRules;var i=e("./matching_parens_outdent").MatchingParensOutdent;var o=function(){this.HighlightRules=a;this.$outdent=new i;this.$behaviour=this.$defaultBehaviour};r.inherits(o,s);(function(){this.lineCommentStart=";";this.minorIndentFunctions=["defn","defn-","defmacro","def","deftest","testing"];this.$toIndent=function(e){return e.split("").map(function(e){if(/\s/.exec(e)){return e}else{return" "}}).join("")};this.$calculateIndent=function(e,t){var n=this.$getIndent(e);var r=0;var s,a;for(var i=e.length-1;i>=0;i--){a=e[i];if(a==="("){r--;s=true}else if(a==="("||a==="["||a==="{"){r--;s=false}else if(a===")"||a==="]"||a==="}"){r++}if(r<0){break}}if(r<0&&s){i+=1;var o=i;var c="";while(true){a=e[i];if(a===" "||a==="\t"){if(this.minorIndentFunctions.indexOf(c)!==-1){return this.$toIndent(e.substring(0,o-1)+t)}else{return this.$toIndent(e.substring(0,i+1))}}else if(a===undefined){return this.$toIndent(e.substring(0,o-1)+t)}c+=e[i];i++}}else if(r<0&&!s){return this.$toIndent(e.substring(0,i+1))}else if(r>0){n=n.substring(0,n.length-t.length);return n}else{return n}};this.getNextLineIndent=function(e,t,n){return this.$calculateIndent(t,n)};this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)};this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)};this.$id="ace/mode/clojure";this.snippetFileId="ace/snippets/clojure"}).call(o.prototype);t.Mode=o});(function(){ace.require(["ace/mode/clojure"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();
//# sourceMappingURL=mode-clojure.js.map