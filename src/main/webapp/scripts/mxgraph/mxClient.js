// YOU ARE NOT PERMITED TO EXTRACT THE SOURCE OF THIS APPLICATION FOR EXECUTION LOCALLY.
// YOUR IP ADDRESS HAS BEEN LOGGED, ABUSES WILL CAUSE ACCESS TO THE JGRAPH SERVER TO BE BLOCKED.
// File created 23 Apr 2012 11:09:46 for Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E) IP 14.145.134.48
// crc32=2043021838
var mxClient = {
	VERSION: '1.10.0.1',
	IS_IE: navigator.userAgent.indexOf('MSIE') >= 0,
	IS_IE6: navigator.userAgent.indexOf('MSIE 6') >= 0,
	IS_NS: navigator.userAgent.indexOf('Mozilla/') >= 0 && navigator.userAgent.indexOf('MSIE') < 0,
	IS_OP: navigator.userAgent.indexOf('Opera/') >= 0,
	IS_OT: navigator.userAgent.indexOf('Presto/2.4.') < 0 && navigator.userAgent.indexOf('Presto/2.3.') < 0 && navigator.userAgent.indexOf('Presto/2.2.') < 0 && navigator.userAgent.indexOf('Presto/2.1.') < 0 && navigator.userAgent.indexOf('Presto/2.0.') < 0 && navigator.userAgent.indexOf('Presto/1.') < 0,
	IS_SF: navigator.userAgent.indexOf('AppleWebKit/') >= 0 && navigator.userAgent.indexOf('Chrome/') < 0,
	IS_GC: navigator.userAgent.indexOf('Chrome/') >= 0,
	IS_MT: (navigator.userAgent.indexOf('Firefox/') >= 0 && navigator.userAgent.indexOf('Firefox/1.') < 0 && navigator.userAgent.indexOf('Firefox/2.') < 0) || (navigator.userAgent.indexOf('Iceweasel/') >= 0 && navigator.userAgent.indexOf('Iceweasel/1.') < 0 && navigator.userAgent.indexOf('Iceweasel/2.') < 0) || (navigator.userAgent.indexOf('SeaMonkey/') >= 0 && navigator.userAgent.indexOf('SeaMonkey/1.') < 0) || (navigator.userAgent.indexOf('Iceape/') >= 0 && navigator.userAgent.indexOf('Iceape/1.') < 0),
	IS_SVG: navigator.userAgent.indexOf('Firefox/') >= 0 || navigator.userAgent.indexOf('Iceweasel/') >= 0 || navigator.userAgent.indexOf('Seamonkey/') >= 0 || navigator.userAgent.indexOf('Iceape/') >= 0 || navigator.userAgent.indexOf('Galeon/') >= 0 || navigator.userAgent.indexOf('Epiphany/') >= 0 || navigator.userAgent.indexOf('AppleWebKit/') >= 0 || navigator.userAgent.indexOf('Gecko/') >= 0 || navigator.userAgent.indexOf('Opera/') >= 0,
	NO_FO: navigator.userAgent.indexOf('Firefox/1.') >= 0 || navigator.userAgent.indexOf('Iceweasel/1.') >= 0 || navigator.userAgent.indexOf('Firefox/2.') >= 0 || navigator.userAgent.indexOf('Iceweasel/2.') >= 0 || navigator.userAgent.indexOf('SeaMonkey/1.') >= 0 || navigator.userAgent.indexOf('Iceape/1.') >= 0 || navigator.userAgent.indexOf('Camino/1.') >= 0 || navigator.userAgent.indexOf('Epiphany/2.') >= 0 || navigator.userAgent.indexOf('Opera/') >= 0 || navigator.userAgent.indexOf('MSIE') >= 0 || navigator.userAgent.indexOf('Mozilla/2.') >= 0,
	IS_VML: navigator.appName.toUpperCase() == 'MICROSOFT INTERNET EXPLORER',
	IS_MAC: navigator.userAgent.toUpperCase().indexOf('MACINTOSH') > 0,
	IS_TOUCH: navigator.userAgent.toUpperCase().indexOf('IPAD') > 0 || navigator.userAgent.toUpperCase().indexOf('IPOD') > 0 || navigator.userAgent.toUpperCase().indexOf('IPHONE') > 0 || navigator.userAgent.toUpperCase().indexOf('ANDROID') > 0,
	IS_LOCAL: document.location.href.indexOf('http://') < 0 && document.location.href.indexOf('https://') < 0,
	isBrowserSupported: function() {
		return mxClient.IS_VML || mxClient.IS_SVG;
	},
	link: function(rel, href, doc) {
		doc = doc || document;
		if (false) {
			doc.write('<link rel="' + rel + '" href="' + href + '" charset="ISO-8859-1" type="text/css"/>');
		} else {
			var link = doc.createElement('link');
			link.setAttribute('rel', rel);
			link.setAttribute('href', href);
			link.setAttribute('charset', 'ISO-8859-1');
			link.setAttribute('type', 'text/css');
			var head = doc.getElementsByTagName('head')[0];
			head.appendChild(link);
		}
	},
	include: function(src) {
		document.write('<script src="' + src + '"></script>');
	},
	dispose: function() {
		for (var i = 0; i < mxEvent.objects.length; i++) {
			if (mxEvent.objects[i].mxListenerList != null) {
				mxEvent.removeAllListeners(mxEvent.objects[i]);
			}
		}
	}
};
if (typeof(mxLoadResources) == 'undefined') {
	mxLoadResources = true;
}
if (typeof(mxLoadStylesheets) == 'undefined') {
	mxLoadStylesheets = true;
}
if (typeof(mxBasePath) != 'undefined' && mxBasePath.length > 0) {
	if (mxBasePath.substring(mxBasePath.length - 1) == '/') {
		mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1);
	}
	mxClient.basePath = mxBasePath;
} else {
	mxClient.basePath = '.';
}
if (typeof(mxImageBasePath) != 'undefined' && mxImageBasePath.length > 0) {
	if (mxImageBasePath.substring(mxImageBasePath.length - 1) == '/') {
		mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1);
	}
	mxClient.imageBasePath = mxImageBasePath;
} else {
	mxClient.imageBasePath = mxClient.basePath + '/images';
}
if (typeof(mxLanguage) != 'undefined') {
	mxClient.language = mxLanguage;
} else {
	mxClient.language = (mxClient.IS_IE) ? navigator.userLanguage: navigator.language;
	var dash = mxClient.language.indexOf('-');
	if (dash > 0) {
		mxClient.language = mxClient.language.substring(0, dash);
	}
}
if (typeof(mxDefaultLanguage) != 'undefined') {
	mxClient.defaultLanguage = mxDefaultLanguage;
} else {
	mxClient.defaultLanguage = 'en';
}
if (mxLoadStylesheets) {
	mxClient.link('stylesheet', mxClient.basePath + '/css/common.css');
}
if (typeof(mxLanguages) != 'undefined') {
	mxClient.languages = mxLanguages;
}
if (mxClient.IS_IE) {
	if (document.documentMode >= 9) {
		mxClient.IS_VML = false;
		mxClient.IS_SVG = true;
	} else {
		if (document.documentMode == 8) {
			document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
			document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office', '#default#VML');
		} else {
			document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
			document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office');
		}
		var ss = document.createStyleSheet();
		ss.cssText = 'v\\:*{behavior:url(#default#VML)}o\\:*{behavior:url(#default#VML)}';
		if (mxLoadStylesheets) {
			mxClient.link('stylesheet', mxClient.basePath + '/css/explorer.css');
		}
	}
	window.attachEvent('onunload', mxClient.dispose);
}
var mxLog = {
	consoleName: 'Console',
	TRACE: false,
	DEBUG: true,
	WARN: true,
	buffer: '',
	init: function() {
		if (mxLog.window == null && document.body != null) {
			var title = mxLog.consoleName + ' - mxGraph ' + mxClient.VERSION;
			var table = document.createElement('table');
			table.setAttribute('width', '100%');
			table.setAttribute('height', '100%');
			var tbody = document.createElement('tbody');
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.style.verticalAlign = 'top';
			mxLog.textarea = document.createElement('textarea');
			mxLog.textarea.setAttribute('readOnly', 'true');
			mxLog.textarea.style.height = '100%';
			mxLog.textarea.style.resize = 'none';
			mxLog.textarea.value = mxLog.buffer;
			if (!mxClient.IS_IE && document.compatMode != 'BackCompat') {
				mxLog.textarea.style.width = '99%';
			} else {
				mxLog.textarea.style.width = '100%';
			}
			td.appendChild(mxLog.textarea);
			tr.appendChild(td);
			tbody.appendChild(tr);
			tr = document.createElement('tr');
			mxLog.td = document.createElement('td');
			mxLog.td.style.verticalAlign = 'top';
			mxLog.td.setAttribute('height', '30px');
			tr.appendChild(mxLog.td);
			tbody.appendChild(tr);
			table.appendChild(tbody);
			mxLog.addButton('Info',
			function(evt) {
				mxLog.info();
			});
			mxLog.addButton('DOM',
			function(evt) {
				var content = mxUtils.getInnerHtml(document.body);
				mxLog.debug(content);
			});
			mxLog.addButton('Trace',
			function(evt) {
				mxLog.TRACE = !mxLog.TRACE;
				if (mxLog.TRACE) {
					mxLog.debug('Tracing enabled');
				} else {
					mxLog.debug('Tracing disabled');
				}
			});
			mxLog.addButton('Copy',
			function(evt) {
				try {
					mxUtils.copy(mxLog.textarea.value);
				} catch(err) {
					mxUtils.alert(err);
				}
			});
			mxLog.addButton('Show',
			function(evt) {
				try {
					mxUtils.popup(mxLog.textarea.value);
				} catch(err) {
					mxUtils.alert(err);
				}
			});
			mxLog.addButton('Clear',
			function(evt) {
				mxLog.textarea.value = '';
			});
			var h = (document.body.clientHeight || document.documentElement.clientHeight);
			var w = document.body.clientWidth;
			mxLog.window = new mxWindow(title, table, Math.max(0, w - 320), Math.max(0, h - 210), 300, 160);
			mxLog.window.setMaximizable(true);
			mxLog.window.setScrollable(false);
			mxLog.window.setResizable(true);
			mxLog.window.setClosable(true);
			mxLog.window.destroyOnClose = false;
			if ((!mxClient.IS_IE || mxClient.IS_IE) && !false && !false && document.compatMode != 'BackCompat') {
				var elt = mxLog.window.getElement();
				var resizeHandler = function(sender, evt) {
					mxLog.textarea.style.height = Math.max(0, elt.offsetHeight - 70) + 'px';
				};
				mxLog.window.addListener(mxEvent.RESIZE_END, resizeHandler);
				mxLog.window.addListener(mxEvent.MAXIMIZE, resizeHandler);
				mxLog.window.addListener(mxEvent.NORMALIZE, resizeHandler);
				mxLog.textarea.style.height = '92px';
			}
		}
	},
	info: function() {
		mxLog.writeln(mxUtils.toString(navigator));
	},
	addButton: function(lab, funct) {
		var button = document.createElement('button');
		mxUtils.write(button, lab);
		mxEvent.addListener(button, 'click', funct);
		mxLog.td.appendChild(button);
	},
	isVisible: function() {
		if (mxLog.window != null) {
			return mxLog.window.isVisible();
		}
		return false;
	},
	show: function() {
		mxLog.setVisible(true);
	},
	setVisible: function(visible) {
		if (mxLog.window == null) {
			mxLog.init();
		}
		if (mxLog.window != null) {
			mxLog.window.setVisible(visible);
		}
	},
	enter: function(string) {
		if (mxLog.TRACE) {
			mxLog.writeln('Entering ' + string);
			return new Date().getTime();
		}
	},
	leave: function(string, t0) {
		if (mxLog.TRACE) {
			var dt = (t0 != 0) ? ' (' + (new Date().getTime() - t0) + ' ms)': '';
			mxLog.writeln('Leaving ' + string + dt);
		}
	},
	debug: function() {
		if (mxLog.DEBUG) {
			mxLog.writeln.apply(this, arguments);
		}
	},
	warn: function() {
		if (mxLog.WARN) {
			mxLog.writeln.apply(this, arguments);
		}
	},
	write: function() {
		var string = '';
		for (var i = 0; i < arguments.length; i++) {
			string += arguments[i];
			if (i < arguments.length - 1) {
				string += ' ';
			}
		}
		if (mxLog.textarea != null) {
			mxLog.textarea.value = mxLog.textarea.value + string;
			if (navigator.userAgent.indexOf('Presto/2.5') >= 0) {
				mxLog.textarea.style.visibility = 'hidden';
				mxLog.textarea.style.visibility = 'visible';
			}
			mxLog.textarea.scrollTop = mxLog.textarea.scrollHeight;
		} else {
			mxLog.buffer += string;
		}
	},
	writeln: function() {
		var string = '';
		for (var i = 0; i < arguments.length; i++) {
			string += arguments[i];
			if (i < arguments.length - 1) {
				string += ' ';
			}
		}
		mxLog.write(string + '\n');
	}
};
var mxObjectIdentity = {
	FIELD_NAME: 'mxObjectId',
	counter: 0,
	get: function(obj) {
		if (typeof(obj) == 'object' && obj[mxObjectIdentity.FIELD_NAME] == null) {
			var ctor = mxUtils.getFunctionName(obj.constructor);
			obj[mxObjectIdentity.FIELD_NAME] = ctor + '#' + mxObjectIdentity.counter++;
		}
		return obj[mxObjectIdentity.FIELD_NAME];
	},
	clear: function(obj) {
		if (typeof(obj) == 'object') {
			delete obj[mxObjectIdentity.FIELD_NAME];
		}
	}
};
function mxDictionary() {
	this.clear();
};
mxDictionary.prototype.map = null;
mxDictionary.prototype.clear = function() {
	this.map = {};
};
mxDictionary.prototype.get = function(key) {
	var id = mxObjectIdentity.get(key);
	return this.map[id];
};
mxDictionary.prototype.put = function(key, value) {
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	this.map[id] = value;
	return previous;
};
mxDictionary.prototype.remove = function(key) {
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	delete this.map[id];
	return previous;
};
mxDictionary.prototype.getKeys = function() {
	var result = [];
	for (key in this.map) {
		result.push(key);
	}
	return result;
};
mxDictionary.prototype.getValues = function() {
	var result = [];
	for (key in this.map) {
		result.push(this.map[key]);
	}
	return result;
};
mxDictionary.prototype.visit = function(visitor) {
	for (key in this.map) {
		visitor(key, this.map[key]);
	}
};
var mxResources = {
	resources: [],
	loadDefaultBundle: true,
	loadSpecialBundle: true,
	isLanguageSupported: function(lan) {
		if (mxClient.languages != null) {
			return mxUtils.indexOf(mxClient.languages, lan) >= 0;
		}
		return true;
	},
	getDefaultBundle: function(basename, lan) {
		if (mxResources.loadDefaultBundle || !mxResources.isLanguageSupported(lan)) {
			return basename + '.properties';
		} else {
			return null;
		}
	},
	getSpecialBundle: function(basename, lan) {
		if (mxResources.loadSpecialBundle && lan != mxClient.defaultLanguage) {
			return basename + '_' + lan + '.properties';
		} else {
			return null;
		}
	},
	add: function(basename, lan) {
		lan = (lan != null) ? lan: mxClient.language;
		if (lan != mxConstants.NONE) {
			var defaultBundle = mxResources.getDefaultBundle(basename, lan);
			if (defaultBundle != null) {
				try {
					var req = mxUtils.load(defaultBundle);
					if (req.isReady()) {
						mxResources.parse(req.getText());
					}
				} catch(e) {}
			}
			if (mxResources.isLanguageSupported(lan)) {
				var specialBundle = mxResources.getSpecialBundle(basename, lan);
				if (specialBundle != null) {
					try {
						var req = mxUtils.load(specialBundle);
						if (req.isReady()) {
							mxResources.parse(req.getText());
						}
					} catch(e) {}
				}
			}
		}
	},
	parse: function(text) {
		if (text != null) {
			var lines = text.split('\n');
			for (var i = 0; i < lines.length; i++) {
				var index = lines[i].indexOf('=');
				if (index > 0) {
					var key = lines[i].substring(0, index);
					var idx = lines[i].length;
					if (lines[i].charCodeAt(idx - 1) == 13) {
						idx--;
					}
					var value = lines[i].substring(index + 1, idx);
					mxResources.resources[key] = unescape(value);
				}
			}
		}
	},
	get: function(key, params, defaultValue) {
		var value = mxResources.resources[key];
		if (value == null) {
			value = defaultValue;
		}
		if (value != null && params != null) {
			var result = [];
			var index = null;
			for (var i = 0; i < value.length; i++) {
				var c = value.charAt(i);
				if (c == '{') {
					index = '';
				} else if (index != null && c == '}') {
					index = parseInt(index) - 1;
					if (index >= 0 && index < params.length) {
						result.push(params[index]);
					}
					index = null;
				} else if (index != null) {
					index += c;
				} else {
					result.push(c);
				}
			}
			value = result.join('');
		}
		return value;
	}
};
function mxPoint(x, y) {
	this.x = (x != null) ? x: 0;
	this.y = (y != null) ? y: 0;
};
mxPoint.prototype.x = null;
mxPoint.prototype.y = null;
mxPoint.prototype.equals = function(obj) {
	return obj.x == this.x && obj.y == this.y;
};
mxPoint.prototype.clone = function() {
	return mxUtils.clone(this);
};
function mxRectangle(x, y, width, height) {
	mxPoint.call(this, x, y);
	this.width = (width != null) ? width: 0;
	this.height = (height != null) ? height: 0;
};
mxRectangle.prototype = new mxPoint();
mxRectangle.prototype.constructor = mxRectangle;
mxRectangle.prototype.width = null;
mxRectangle.prototype.height = null;
mxRectangle.prototype.setRect = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
};
mxRectangle.prototype.getCenterX = function() {
	return this.x + this.width / 2;
};
mxRectangle.prototype.getCenterY = function() {
	return this.y + this.height / 2;
};
mxRectangle.prototype.add = function(rect) {
	if (rect != null) {
		var minX = Math.min(this.x, rect.x);
		var minY = Math.min(this.y, rect.y);
		var maxX = Math.max(this.x + this.width, rect.x + rect.width);
		var maxY = Math.max(this.y + this.height, rect.y + rect.height);
		this.x = minX;
		this.y = minY;
		this.width = maxX - minX;
		this.height = maxY - minY;
	}
};
mxRectangle.prototype.grow = function(amount) {
	this.x -= amount;
	this.y -= amount;
	this.width += 2 * amount;
	this.height += 2 * amount;
};
mxRectangle.prototype.getPoint = function() {
	return new mxPoint(this.x, this.y);
};
mxRectangle.prototype.equals = function(obj) {
	return obj.x == this.x && obj.y == this.y && obj.width == this.width && obj.height == this.height;
};
var mxEffects = {
	animateChanges: function(graph, changes, done) {
		var maxStep = 10;
		var step = 0;
		var animate = function() {
			var isRequired = false;
			for (var i = 0; i < changes.length; i++) {
				var change = changes[i];
				if (change instanceof mxGeometryChange || change instanceof mxTerminalChange || change instanceof mxValueChange || change instanceof mxChildChange || change instanceof mxStyleChange) {
					var state = graph.getView().getState(change.cell || change.child, false);
					if (state != null) {
						isRequired = true;
						if (change.constructor != mxGeometryChange || graph.model.isEdge(change.cell)) {
							mxUtils.setOpacity(state.shape.node, 100 * step / maxStep);
						} else {
							var scale = graph.getView().scale;
							var dx = (change.geometry.x - change.previous.x) * scale;
							var dy = (change.geometry.y - change.previous.y) * scale;
							var sx = (change.geometry.width - change.previous.width) * scale;
							var sy = (change.geometry.height - change.previous.height) * scale;
							if (step == 0) {
								state.x -= dx;
								state.y -= dy;
								state.width -= sx;
								state.height -= sy;
							} else {
								state.x += dx / maxStep;
								state.y += dy / maxStep;
								state.width += sx / maxStep;
								state.height += sy / maxStep;
							}
							graph.cellRenderer.redraw(state);
							mxEffects.cascadeOpacity(graph, change.cell, 100 * step / maxStep);
						}
					}
				}
			}
			mxUtils.repaintGraph(graph, new mxPoint(1, 1));
			if (step < maxStep && isRequired) {
				step++;
				window.setTimeout(animate, delay);
			} else if (done != null) {
				done();
			}
		};
		var delay = 30;
		animate();
	},
	cascadeOpacity: function(graph, cell, opacity) {
		var childCount = graph.model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var child = graph.model.getChildAt(cell, i);
			var childState = graph.getView().getState(child);
			if (childState != null) {
				mxUtils.setOpacity(childState.shape.node, opacity);
				mxEffects.cascadeOpacity(graph, child, opacity);
			}
		}
		var edges = graph.model.getEdges(cell);
		if (edges != null) {
			for (var i = 0; i < edges.length; i++) {
				var edgeState = graph.getView().getState(edges[i]);
				if (edgeState != null) {
					mxUtils.setOpacity(edgeState.shape.node, opacity);
				}
			}
		}
	},
	fadeOut: function(node, from, remove, step, delay, isEnabled) {
		step = step || 40;
		delay = delay || 30;
		var opacity = from || 100;
		mxUtils.setOpacity(node, opacity);
		if (isEnabled || isEnabled == null) {
			var f = function() {
				opacity = Math.max(opacity - step, 0);
				mxUtils.setOpacity(node, opacity);
				if (opacity > 0) {
					window.setTimeout(f, delay);
				} else {
					node.style.visibility = 'hidden';
					if (remove && node.parentNode) {
						node.parentNode.removeChild(node);
					}
				}
			};
			window.setTimeout(f, delay);
		} else {
			node.style.visibility = 'hidden';
			if (remove && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	}
};