# ElementQuery

An element query polyfill you can use today.

* Author: Tyson Matanich - http://matanich.com
* License: MIT

**Article:** http://coding.smashingmagazine.com/2013/06/25/media-queries-are-not-the-answer-element-query-polyfill/

**Demos:**
* Grid - http://codepen.io/tysonmatanich/pen/johpn
* Menu - http://codepen.io/tysonmatanich/pen/wramd
* Blockquote - http://codepen.io/tysonmatanich/pen/jIBpJ

## Syntax

This rule queries itself for a **single** condition:
```css
header[min-width~="500px"] {
	background-color: #eee;
}
```

This rule queries itself for **multiple** conditions:
```css
header[min-width~="500px"][max-width~="800px"] {
	background-color: #eee;
}
```

This rule queries a **parent** for a condition:
```css
header[min-width~="31.250em"] nav {
	clear: both;
}
```

This rule queries **itself** and a **parent** for conditions:
```css
header[min-width~="31.250em"] nav[min-height~="1em"] {
	color: #333;
}
```

### Query types
The following query types are supported: `min-width`, `max-width`, `min-height`, `max-height`.

## Selector registration

The **master branch** of elementQuery will parse your style sheets, however if you have cross-domain style sheets you will have to manualy register your selectors. The **prod branch** requires the selector information to be declared in JavaScript, which avoids the cross-domain file issue and the time required to parse the style sheets.

Here is an example of how to export elementQuery selector information using the master branch:
```javascript
console.log(JSON.stringify(elementQuery.selectors()));
```

And here is an example of how to import elementQuery selector information using the prod branch:
```javascript
elementQuery({"header":{"min-width":["500px","31.250em"],"max-width":["800px"]}});
```

## Requirements

* JavaScript
* Sizzle (http://sizzlejs.com/) or jQuery (http://jquery.com/)

## Size and delivery

Currently, the **master branch** of `elementQuery.js` compresses to around 2367 bytes (~2.3 KB) and the **prod branch** of `elementQuery.js` compresses to around 1788 bytes (~1.7 KB), after minify and gzip.

To minify, you might try these online tools: [Microsoft Ajax Minifier](http://ajaxmin.codeplex.com/), [Uglify](http://marijnhaverbeke.nl/uglifyjs), [Yahoo Compressor](http://refresh-sf.com/yui/), or [Closure Compiler](http://closure-compiler.appspot.com/home). Serve with gzip compression.

## Support

`[min-width~='10px']` selectors are not supported in IE6.
