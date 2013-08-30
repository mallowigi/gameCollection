/*

 Holder - 2.0 - client side image placeholders
 (c) 2012-2013 Ivan Malopinsky / http://imsky.co

 Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
 Commercial use requires attribution.

 */

var Holder = Holder || {};
(function (app, win) {

	var preempted = false,
		fallback = false,
		canvas = document.createElement('canvas');

	//getElementsByClassName polyfill
	document.getElementsByClassName || (document.getElementsByClassName = function (className) {
		var doc = document, node, xpath, i, elements = [];
		if (doc.querySelectorAll)return doc.querySelectorAll("." + className);
		if (doc.evaluate) {
			xpath = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
			node = doc.evaluate(xpath, doc, null, 0, null);
			while (i = node.iterateNext()) {
				elements.push(i)
			}
		}
		else {
			node = doc.getElementsByTagName("*");
			xpath = new RegExp("(^|\\s)" + className + "(\\s|$)");
			for (i = 0;
			     i < node.length;
			     i++) {
				xpath.test(node[i].className) && elements.push(node[i])
			}
		}
		return elements;
	});

	//getComputedStyle polyfill
	window.getComputedStyle || (window.getComputedStyle = function (element, t) {
		this.el = element;
		this.getPropertyValue = function (prop) {
			var optionRegex = /(\-([a-z]){1})/g;
			if (prop == 'float') {
				prop = "styleFloat";
			}
			if (optionRegex.test(prop)) {
				prop = prop.replace(optionRegex, function () {
					return arguments[2].toUpperCase()
				});
			}
			return element.currentStyle[prop] ? element.currentStyle[prop] : null

		};
		return this;
	});

	//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
	function contentLoaded(window, func) {
		var complete = "complete",
			readyStateChange = "readystatechange",
			notTrue = !1,
			done = notTrue,
			top = !0,
			document = window.document,
			root = document.documentElement,
			addEventListener = document.addEventListener ? "addEventListener" : "attachEvent",
			removeEventListener = document.addEventListener ? "removeEventListener" : "detachEvent",
			on = document.addEventListener ? "" : "on",
			init = function (event) {
				if (event.type != readyStateChange || document.readyState == complete) {
					var ctx = (event.type == "load" ? window : document);
					ctx[removeEventListener](on + event.type, init, notTrue);
					if (!done) {
						done = !0;
						func.call(window, null);
					}
				}
			},
			poll = function () {
				try {root.doScroll("left")}
				catch (e) {
					setTimeout(poll, 50);
					return
				}
				init("poll")
			};

		if (document.readyState == complete) {
			func.call(window, "lazy");
		}
		else {
			if (document.createEventObject && root.doScroll) {
				try {
					top = !window.frameElement
				}
				catch (e) {}

				if (top) poll();
			}
			document[addEventListener](on + "DOMContentLoaded", init, notTrue);
			document[addEventListener](on + readyStateChange, init, notTrue);
			window[addEventListener](on + "load", init, notTrue)
		}
	}

	//https://gist.github.com/991057 by Jed Schmidt with modifications
	function selector(selectorStr) {
		selectorStr = selectorStr.match(/^(\W)?(.*)/);
		var selectBy;

		if (selectorStr[1]) {
			var prefix = selectorStr[1];
			selectBy = prefix == "#" ? "ById" : "sByClassName";
		}
		else {
			selectBy = "sByTagName";
		}

		var elts = document["getElement" + selectBy](selectorStr[2]);
		var ret = [];

		if (elts != null) {
			if (elts.length) {
				ret = elts;
			}
			else {
				if (elts.length == 0) {
					ret = elts;
				}
				else {
					ret = [elts];
				}
			}
		}
		return ret;
	}

	//shallow object property extend
	function extend(obj, props) {
		var newObj = {};
		for (var key in
			obj) {
			newObj[key] = obj[key];
		}
		for (var propKey in
			props) {
			newObj[propKey] = props[propKey];
		}
		return newObj
	}

	//hasOwnProperty polyfill
	if (!Object.prototype.hasOwnProperty) {
		Object.prototype.hasOwnProperty = function (prop) {
			var proto = this.__proto__ || this.constructor.prototype;
			return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
		}
	}

	function text_size(width, height, template) {
		height = parseInt(height, 10);
		width = parseInt(width, 10);
		var bigSide = Math.max(height, width);
		var smallSide = Math.min(height, width);
		var scale = 1 / 12;
		var newHeight = Math.min(smallSide * 0.75, 0.75 * bigSide * scale);
		return {
			height: Math.round(Math.max(template.size, newHeight))
		}
	}

	function draw(canvasCtx, dimensions, themeOpts, ratio) {
		var ts = text_size(dimensions.width, dimensions.height, themeOpts);
		var text_height = ts.height;
		var width = dimensions.width * ratio,
			height = dimensions.height * ratio;
		var font = themeOpts.font ? themeOpts.font : "sans-serif";
		canvas.width = width;
		canvas.height = height;

		canvasCtx.textAlign = "center";
		canvasCtx.textBaseline = "middle";
		canvasCtx.fillStyle = themeOpts.background;
		canvasCtx.fillRect(0, 0, width, height);
		canvasCtx.fillStyle = themeOpts.foreground;
		canvasCtx.font = "bold " + text_height + "px " + font;

		var text = themeOpts.text ? themeOpts.text : (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
		var text_width = canvasCtx.measureText(text).width;
		if (text_width / width >= 0.75) {
			text_height = Math.floor(text_height * 0.75 * (width / text_width));
		}
		//Resetting font size if necessary
		canvasCtx.font = "bold " + (text_height * ratio) + "px " + font;
		canvasCtx.fillText(text, (width / 2), (height / 2), width);
		return canvas.toDataURL("image/png");
	}

	function render(mode, element, holder, src) {
		var dimensions = holder.dimensions,
			theme = holder.theme,
			text = holder.text ? decodeURIComponent(holder.text) : holder.text;
		var dimensions_caption = dimensions.width + "x" + dimensions.height;
		theme = (text ? extend(theme, {
			text: text
		}) : theme);
		theme = (holder.font ? extend(theme, {
			font: holder.font
		}) : theme);
		if (mode == "image") {
			element.setAttribute("data-src", src);
			element.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
			if (fallback || !holder.auto) {
				element.style.width = dimensions.width + "px";
				element.style.height = dimensions.height + "px";
			}
			if (fallback) {
				element.style.backgroundColor = theme.background;
			}
			else {
				element.setAttribute("src", draw(ctx, dimensions, theme, ratio));
			}
		}
		else if (mode == "background") {
			if (!fallback) {
				element.style.backgroundImage = "url(" + draw(ctx, dimensions, theme, ratio) + ")";
				element.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";
			}
		}
		else if (mode == "fluid") {
			element.setAttribute("data-src", src);
			element.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
			if (dimensions.height.substr(-1) == "%") {
				element.style.height = dimensions.height
			}
			else {
				element.style.height = dimensions.height + "px"
			}
			if (dimensions.width.substr(-1) == "%") {
				element.style.width = dimensions.width
			}
			else {
				element.style.width = dimensions.width + "px"
			}
			if (element.style.display == "inline" || element.style.display == "") {
				element.style.display = "block";
			}
			if (fallback) {
				element.style.backgroundColor = theme.background;
			}
			else {
				element.holderData = holder;
				fluid_images.push(element);
				fluid_update(element);
			}
		}
	};

	function fluid_update(element) {
		var images;
		if (element.nodeType == null) {
			images = fluid_images;
		}
		else {
			images = [element]
		}
		for (i in
			images) {
			var el = images[i]
			if (el.holderData) {
				var holder = el.holderData;
				el.setAttribute("src", draw(ctx, {
					height: el.clientHeight,
					width: el.clientWidth
				}, holder.theme, ratio));
			}
		}
	}

	function parse_flags(flags, options) {

		var ret = {
			theme: settings.themes.gray
		}, render = false;

		for (sl = flags.length, j = 0;
		     j < sl;
		     j++) {
			var flag = flags[j];
			if (app.flags.dimensions.match(flag)) {
				render = true;
				ret.dimensions = app.flags.dimensions.output(flag);
			}
			else if (app.flags.fluid.match(flag)) {
				render = true;
				ret.dimensions = app.flags.fluid.output(flag);
				ret.fluid = true;
			}
			else if (app.flags.colors.match(flag)) {
				ret.theme = app.flags.colors.output(flag);
			}
			else if (options.themes[flag]) {
				//If a theme is specified, it will override custom colors
				ret.theme = options.themes[flag];
			}
			else if (app.flags.text.match(flag)) {
				ret.text = app.flags.text.output(flag);
			}
			else if (app.flags.font.match(flag)) {
				ret.font = app.flags.font.output(flag);
			}
			else if (app.flags.auto.match(flag)) {
				ret.auto = true;
			}
		}

		return render ? ret : false;

	};

	if (!canvas.getContext) {
		fallback = true;
	}
	else {
		if (canvas.toDataURL("image/png")
			    .indexOf("data:image/png") < 0) {
			//Android doesn't support data URI
			fallback = true;
		}
		else {
			var ctx = canvas.getContext("2d");
		}
	}

	var dpr = 1, bsr = 1;

	if (!fallback) {
		dpr = window.devicePixelRatio || 1,
			bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	}

	var ratio = dpr / bsr;

	var fluid_images = [];

	var settings = {
		domain: "holder.js",
		images: "img",
		bgnodes: ".holderjs",
		themes: {
			"gray": {
				background: "#eee",
				foreground: "#aaa",
				size: 12
			},
			"social": {
				background: "#3a5a97",
				foreground: "#fff",
				size: 12
			},
			"industrial": {
				background: "#434A52",
				foreground: "#C2F200",
				size: 12
			}
		},
		stylesheet: ""
	};

	app.flags = {
		dimensions: {
			regex: /^(\d+)x(\d+)$/,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					width: +exec[1],
					height: +exec[2]
				}
			}
		},
		fluid: {
			regex: /^([0-9%]+)x([0-9%]+)$/,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					width: exec[1],
					height: exec[2]
				}
			}
		},
		colors: {
			regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
			output: function (val) {
				var exec = this.regex.exec(val);
				return {
					size: settings.themes.gray.size,
					foreground: "#" + exec[2],
					background: "#" + exec[1]
				}
			}
		},
		text: {
			regex: /text\:(.*)/,
			output: function (val) {
				return this.regex.exec(val)[1];
			}
		},
		font: {
			regex: /font\:(.*)/,
			output: function (val) {
				return this.regex.exec(val)[1];
			}
		},
		auto: {
			regex: /^auto$/
		}
	}

	for (var flag in
		app.flags) {
		if (!app.flags.hasOwnProperty(flag)) continue;
		app.flags[flag].match = function (val) {
			return val.match(this.regex)
		}
	}

	app.add_theme = function (name, theme) {
		name != null && theme != null && (settings.themes[name] = theme);
		return app;
	};

	app.add_image = function (src, el) {
		var node = selector(el);
		if (node.length) {
			for (var i = 0, l = node.length;
			     i < l;
			     i++) {
				var img = document.createElement("img")
				img.setAttribute("data-src", src);
				node[i].appendChild(img);
			}
		}
		return app;
	};

	app.run = function (opt) {
		var options = extend(settings, opt),
			images = [], imageNodes = [], bgnodes = [];

		if (typeof(options.images) == "string") {
			imageNodes = selector(options.images);
		}
		else if (window.NodeList && options.images instanceof window.NodeList) {
			imageNodes = options.images;
		}
		else if (window.Node && options.images instanceof window.Node) {
			imageNodes = [options.images];
		}

		if (typeof(options.bgnodes) == "string") {
			bgnodes = selector(options.bgnodes);
		}
		else if (window.NodeList && options.elements instanceof window.NodeList) {
			bgnodes = options.bgnodes;
		}
		else if (window.Node && options.bgnodes instanceof window.Node) {
			bgnodes = [options.bgnodes];
		}

		preempted = true;

		for (i = 0, l = imageNodes.length;
		     i < l;
		     i++) images.push(imageNodes[i]);

		var holdercss = document.getElementById("holderjs-style");
		if (!holdercss) {
			holdercss = document.createElement("style");
			holdercss.setAttribute("id", "holderjs-style");
			holdercss.type = "text/css";
			document.getElementsByTagName("head")[0].appendChild(holdercss);
		}

		if (!options.nocss) {
			if (holdercss.styleSheet) {
				holdercss.styleSheet.cssText += options.stylesheet;
			}
			else {
				holdercss.appendChild(document.createTextNode(options.stylesheet));
			}
		}

		var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");

		for (var l = bgnodes.length, i = 0;
		     i < l;
		     i++) {
			var src = window.getComputedStyle(bgnodes[i], null)
				.getPropertyValue("background-image");
			var flags = src.match(cssregex);
			var bgsrc = bgnodes[i].getAttribute("data-background-src");

			if (flags) {
				var holder = parse_flags(flags[1].split("/"), options);
				if (holder) {
					render("background", bgnodes[i], holder, src);
				}
			}
			else if (bgsrc != null) {
				var holder = parse_flags(bgsrc.substr(bgsrc.lastIndexOf(options.domain) + options.domain.length + 1)
					.split("/"), options);
				if (holder) {
					render("background", bgnodes[i], holder, src);
				}
			}
		}

		for (l = images.length, i = 0;
		     i < l;
		     i++) {

			var attr_src = attr_data_src = src = null;

			try {
				attr_src = images[i].getAttribute("src");
				attr_datasrc = images[i].getAttribute("data-src");
			}
			catch (e) {}

			if (attr_datasrc == null && !!attr_src && attr_src.indexOf(options.domain) >= 0) {
				src = attr_src;
			}
			else if (!!attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
				src = attr_datasrc;
			}

			if (src) {
				var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1)
					.split("/"), options);
				if (holder) {
					if (holder.fluid) {
						render("fluid", images[i], holder, src)
					}
					else {
						render("image", images[i], holder, src);
					}
				}
			}
		}
		return app;
	};

	contentLoaded(win, function () {
		if (window.addEventListener) {
			window.addEventListener("resize", fluid_update, false);
			window.addEventListener("orientationchange", fluid_update, false);
		}
		else {
			window.attachEvent("onresize", fluid_update)
		}
		preempted || app.run();
	});

	if (typeof define === "function" && define.amd) {
		define("Holder", [], function () {
			return app;
		});
	}

})(Holder, window);
