var mxUtils = {
	errorResource : (mxClient.language != 'none') ? 'error' : '',
	closeResource : (mxClient.language != 'none') ? 'close' : '',
	errorImage : mxClient.imageBasePath + '/error.gif',
	removeCursors : function(element) {
		if (element.style != null) {
			element.style.cursor = '';
		}
		var children = element.childNodes;
		if (children != null) {
			var childCount = children.length;
			for ( var i = 0; i < childCount; i += 1) {
				mxUtils.removeCursors(children[i]);
			}
		}
	},
	repaintGraph : function(graph, pt) {
		if (true || false || false) {
			var c = graph.container;
			if (c != null && pt != null
					&& (c.scrollLeft > 0 || c.scrollTop > 0)) {
				var dummy = document.createElement('div');
				dummy.style.position = 'absolute';
				dummy.style.left = pt.x + 'px';
				dummy.style.top = pt.y + 'px';
				dummy.style.width = '1px';
				dummy.style.height = '1px';
				c.appendChild(dummy);
				c.removeChild(dummy);
			}
		}
	},
	getCurrentStyle : function() {
		if (false) {
			return function(element) {
				return (element != null) ? element.currentStyle : null;
			};
		} else {
			return function(element) {
				return (element != null) ? window.getComputedStyle(element, '')
						: null;
			};
		}
	}(),
	hasScrollbars : function(node) {
		var style = mxUtils.getCurrentStyle(node);
		return style != null
				&& (style.overflow == 'scroll' || style.overflow == 'auto');
	},
	bind : function(scope, funct) {
		return function() {
			return funct.apply(scope, arguments);
		};
	},
	eval : function(expr) {
		var result = null;
		if (expr.indexOf('function') >= 0) {
			try {
				eval('var _mxJavaScriptExpression=' + expr);
				result = _mxJavaScriptExpression;
				_mxJavaScriptExpression = null;
			} catch (e) {
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		} else {
			try {
				result = eval(expr);
			} catch (e) {
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		}
		return result;
	},
	findNode : function(node, attr, value) {
		var tmp = node.getAttribute(attr);
		if (tmp != null && tmp == value) {
			return node;
		}
		node = node.firstChild;
		while (node != null) {
			var result = mxUtils.findNode(node, attr, value);
			if (result != null) {
				return result;
			}
			node = node.nextSibling;
		}
		return null;
	},
	findNodeByAttribute : function() {
		if (document.documentMode == 9) {
			return function(node, attr, value) {
				var result = null;
				if (node.nodeType == mxConstants.NODETYPE_ELEMENT
						&& node.getAttribute(attr) == value) {
					result = node;
				} else {
					var child = node.firstChild;
					while (child != null && result != null) {
						result = mxUtils
								.findNodeByAttribute(child, attr, value);
						child = child.nextSibling;
					}
				}
				return result;
			};
		} else if (false) {
			return function(node, attr, value) {
				var expr = '//*[@' + attr + '=\'' + value + '\']';
				return node.ownerDocument.selectSingleNode(expr);
			};
		} else {
			return function(node, attr, value) {
				var result = node.ownerDocument.evaluate('//*[@' + attr + '=\''
						+ value + '\']', node.ownerDocument, null,
						XPathResult.ANY_TYPE, null);
				return result.iterateNext();
			};
		}
	}(),
	getFunctionName : function(f) {
		var str = null;
		if (f != null) {
			if (f.name != null) {
				str = f.name;
			} else {
				var tmp = f.toString();
				var idx1 = 9;
				while (tmp.charAt(idx1) == ' ') {
					idx1++;
				}
				var idx2 = tmp.indexOf('(', idx1);
				str = tmp.substring(idx1, idx2);
			}
		}
		return str;
	},
	indexOf : function(array, obj) {
		if (array != null && obj != null) {
			for ( var i = 0; i < array.length; i++) {
				if (array[i] == obj) {
					return i;
				}
			}
		}
		return -1;
	},
	remove : function(obj, array) {
		var result = null;
		if (typeof (array) == 'object') {
			var index = mxUtils.indexOf(array, obj);
			while (index >= 0) {
				array.splice(index, 1);
				result = obj;
				index = mxUtils.indexOf(array, obj);
			}
		}
		for ( var key in array) {
			if (array[key] == obj) {
				delete array[key];
				result = obj;
			}
		}
		return result;
	},
	isNode : function(value, nodeName, attributeName, attributeValue) {
		if (value != null
				&& !isNaN(value.nodeType)
				&& (nodeName == null || value.nodeName.toLowerCase() == nodeName
						.toLowerCase())) {
			return attributeName == null
					|| value.getAttribute(attributeName) == attributeValue;
		}
		return false;
	},
	getChildNodes : function(node, nodeType) {
		nodeType = nodeType || mxConstants.NODETYPE_ELEMENT;
		var children = [];
		var tmp = node.firstChild;
		while (tmp != null) {
			if (tmp.nodeType == nodeType) {
				children.push(tmp);
			}
			tmp = tmp.nextSibling;
		}
		return children;
	},
	createXmlDocument : function() {
		var doc = null;
		if (document.implementation && document.implementation.createDocument) {
			doc = document.implementation.createDocument('', '', null);
		} else if (window.ActiveXObject) {
			doc = new ActiveXObject('Microsoft.XMLDOM');
		}
		return doc;
	},
	parseXml : function() {
		if (false && document.documentMode != 9) {
			return function(xml) {
				var result = mxUtils.createXmlDocument();
				result.async = 'false';
				result.loadXML(xml);
				return result;
			};
		} else {
			return function(xml) {
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			};
		}
	}(),
	clearSelection : function() {
		if (document.selection) {
			return function() {
				document.selection.empty();
			};
		} else if (window.getSelection) {
			return function() {
				window.getSelection().removeAllRanges();
			};
		}
	}(),
	getPrettyXml : function(node, tab, indent) {
		var result = [];
		if (node != null) {
			tab = tab || '  ';
			indent = indent || '';
			if (node.nodeType == mxConstants.NODETYPE_TEXT) {
				result.push(node.nodeValue);
			} else {
				result.push(indent + '<' + node.nodeName);
				var attrs = node.attributes;
				if (attrs != null) {
					for ( var i = 0; i < attrs.length; i++) {
						var val = mxUtils.htmlEntities(attrs[i].nodeValue);
						result.push(' ' + attrs[i].nodeName + '="' + val + '"');
					}
				}
				var tmp = node.firstChild;
				if (tmp != null) {
					result.push('>\n');
					while (tmp != null) {
						result.push(mxUtils
								.getPrettyXml(tmp, tab, indent + tab));
						tmp = tmp.nextSibling;
					}
					result.push(indent + '</' + node.nodeName + '>\n');
				} else {
					result.push('/>\n');
				}
			}
		}
		return result.join('');
	},
	removeWhitespace : function(node, before) {
		var tmp = (before) ? node.previousSibling : node.nextSibling;
		while (tmp != null && tmp.nodeType == mxConstants.NODETYPE_TEXT) {
			var next = (before) ? tmp.previousSibling : tmp.nextSibling;
			var text = mxUtils.getTextContent(tmp);
			if (mxUtils.trim(text).length == 0) {
				tmp.parentNode.removeChild(tmp);
			}
			tmp = next;
		}
	},
	htmlEntities : function(s, newline) {
		s = s || '';
		s = s.replace(/&/g, '&amp;');
		s = s.replace(/"/g, '&quot;');
		s = s.replace(/\'/g, '&#39;');
		s = s.replace(/</g, '&lt;');
		s = s.replace(/>/g, '&gt;');
		if (newline == null || newline) {
			s = s.replace(/\n/g, '&#xa;');
		}
		return s;
	},
	isVml : function(node) {
		return node != null && node.tagUrn == 'urn:schemas-microsoft-com:vml';
	},
	getXml : function(node, linefeed) {
		var xml = '';
		if (node != null) {
			xml = node.xml;
			if (xml == null) {
				if (node.innerHTML) {
					xml = node.innerHTML;
				} else {
					var xmlSerializer = new XMLSerializer();
					xml = xmlSerializer.serializeToString(node);
				}
			} else {
				xml = xml.replace(/\r\n\t[\t]*/g, '').replace(/>\r\n/g, '>')
						.replace(/\r\n/g, '\n');
			}
		}
		linefeed = linefeed || '&#xa;';
		xml = xml.replace(/\n/g, linefeed);
		return xml;
	},
	getTextContent : function(node) {
		var result = '';
		if (node != null) {
			if (node.firstChild != null) {
				node = node.firstChild;
			}
			result = node.nodeValue || '';
		}
		return result;
	},
	getInnerHtml : function() {
		if (false) {
			return function(node) {
				if (node != null) {
					return node.innerHTML;
				}
				return '';
			};
		} else {
			return function(node) {
				if (node != null) {
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				return '';
			};
		}
	}(),
	getOuterHtml : function() {
		if (false) {
			return function(node) {
				if (node != null) {
					if (node.outerHTML != null) {
						return node.outerHTML;
					} else {
						var tmp = [];
						tmp.push('<' + node.nodeName);
						var attrs = node.attributes;
						for ( var i = 0; i < attrs.length; i++) {
							var value = attrs[i].nodeValue;
							if (value != null && value.length > 0) {
								tmp.push(' ');
								tmp.push(attrs[i].nodeName);
								tmp.push('="');
								tmp.push(value);
								tmp.push('"');
							}
						}
						if (node.innerHTML.length == 0) {
							tmp.push('/>');
						} else {
							tmp.push('>');
							tmp.push(node.innerHTML);
							tmp.push('</' + node.nodeName + '>');
						}
						return tmp.join('');
					}
				}
				return '';
			};
		} else {
			return function(node) {
				if (node != null) {
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				return '';
			};
		}
	}(),
	write : function(parent, text) {
		doc = parent.ownerDocument;
		var node = doc.createTextNode(text);
		if (parent != null) {
			parent.appendChild(node);
		}
		return node;
	},
	writeln : function(parent, text) {
		doc = parent.ownerDocument;
		var node = doc.createTextNode(text);
		if (parent != null) {
			parent.appendChild(node);
			parent.appendChild(document.createElement('br'));
		}
		return node;
	},
	br : function(parent, count) {
		count = count || 1;
		var br = null;
		for ( var i = 0; i < count; i++) {
			if (parent != null) {
				br = parent.ownerDocument.createElement('br');
				parent.appendChild(br);
			}
		}
		return br;
	},
	button : function(label, funct, doc) {
		doc = (doc != null) ? doc : document;
		var button = doc.createElement('button');
		mxUtils.write(button, label);
		mxEvent.addListener(button, 'click', function(evt) {
			funct(evt);
		});
		return button;
	},
	para : function(parent, text) {
		var p = document.createElement('p');
		mxUtils.write(p, text);
		if (parent != null) {
			parent.appendChild(p);
		}
		return p;
	},
	linkAction : function(parent, text, editor, action, pad) {
		return mxUtils.link(parent, text, function() {
			editor.execute(action);
		}, pad);
	},
	linkInvoke : function(parent, text, editor, functName, arg, pad) {
		return mxUtils.link(parent, text, function() {
			editor[functName](arg);
		}, pad);
	},
	link : function(parent, text, funct, pad) {
		var a = document.createElement('span');
		a.style.color = 'blue';
		a.style.textDecoration = 'underline';
		a.style.cursor = 'pointer';
		if (pad != null) {
			a.style.paddingLeft = pad + 'px';
		}
		mxEvent.addListener(a, 'click', funct);
		mxUtils.write(a, text);
		if (parent != null) {
			parent.appendChild(a);
		}
		return a;
	},
	fit : function(node) {
		var left = parseInt(node.offsetLeft);
		var width = parseInt(node.offsetWidth);
		var b = document.body;
		var d = document.documentElement;
		var right = (b.scrollLeft || d.scrollLeft)
				+ (b.clientWidth || d.clientWidth);
		if (left + width > right) {
			node.style.left = Math.max((b.scrollLeft || d.scrollLeft), right
					- width)
					+ 'px';
		}
		var top = parseInt(node.offsetTop);
		var height = parseInt(node.offsetHeight);
		var bottom = (b.scrollTop || d.scrollTop)
				+ Math.max(b.clientHeight || 0, d.clientHeight);
		if (top + height > bottom) {
			node.style.top = Math.max((b.scrollTop || d.scrollTop), bottom
					- height)
					+ 'px';
		}
	},
	open : function(filename) {
		if (true) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege('UniversalXPConnect');
			} catch (e) {
				mxUtils.alert('Permission to read file denied.');
				return '';
			}
			var file = Components.classes['@mozilla.org/file/local;1']
					.createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filename);
			if (!file.exists()) {
				mxUtils.alert('File not found.');
				return '';
			}
			var is = Components.classes['@mozilla.org/network/file-input-stream;1']
					.createInstance(Components.interfaces.nsIFileInputStream);
			is.init(file, 0x01, 00004, null);
			var sis = Components.classes['@mozilla.org/scriptableinputstream;1']
					.createInstance(Components.interfaces.nsIScriptableInputStream);
			sis.init(is);
			var output = sis.read(sis.available());
			return output;
		} else {
			var activeXObject = new ActiveXObject('Scripting.FileSystemObject');
			var newStream = activeXObject.OpenTextFile(filename, 1);
			var text = newStream.readAll();
			newStream.close();
			return text;
		}
		return null;
	},
	save : function(filename, content) {
		if (true) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege('UniversalXPConnect');
			} catch (e) {
				mxUtils.alert('Permission to write file denied.');
				return;
			}
			var file = Components.classes['@mozilla.org/file/local;1']
					.createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filename);
			if (!file.exists()) {
				file.create(0x00, 0644);
			}
			var outputStream = Components.classes['@mozilla.org/network/file-output-stream;1']
					.createInstance(Components.interfaces.nsIFileOutputStream);
			outputStream.init(file, 0x20 | 0x02, 00004, null);
			outputStream.write(content, content.length);
			outputStream.flush();
			outputStream.close();
		} else {
			var fso = new ActiveXObject('Scripting.FileSystemObject');
			var file = fso.CreateTextFile(filename, true);
			file.Write(content);
			file.Close();
		}
	},
	saveAs : function(content) {
		var iframe = document.createElement('iframe');
		iframe.setAttribute('src', '');
		iframe.style.visibility = 'hidden';
		document.body.appendChild(iframe);
		try {
			if (true) {
				var doc = iframe.contentDocument;
				doc.open();
				doc.write(content);
				doc.close();
				try {
					netscape.security.PrivilegeManager
							.enablePrivilege('UniversalXPConnect');
					iframe.focus();
					saveDocument(doc);
				} catch (e) {
					mxUtils.alert('Permission to save document denied.');
				}
			} else {
				var doc = iframe.contentWindow.document;
				doc.write(content);
				doc.execCommand('SaveAs', false, document.location);
			}
		} finally {
			document.body.removeChild(iframe);
		}
	},
	copy : function(content) {
		if (window.clipboardData) {
			window.clipboardData.setData('Text', content);
		} else {
			netscape.security.PrivilegeManager
					.enablePrivilege('UniversalXPConnect');
			var clip = Components.classes['@mozilla.org/widget/clipboard;1']
					.createInstance(Components.interfaces.nsIClipboard);
			if (!clip) {
				return;
			}
			var trans = Components.classes['@mozilla.org/widget/transferable;1']
					.createInstance(Components.interfaces.nsITransferable);
			if (!trans) {
				return;
			}
			trans.addDataFlavor('text/unicode');
			var str = Components.classes['@mozilla.org/supports-string;1']
					.createInstance(Components.interfaces.nsISupportsString);
			var copytext = content;
			str.data = copytext;
			trans.setTransferData('text/unicode', str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			clip.setData(trans, null, clipid.kGlobalClipboard);
		}
	},
	load : function(url) {
		var req = new mxXmlRequest(url, null, 'GET', false);
		req.send();
		return req;
	},
	get : function(url, onload, onerror) {
		return new mxXmlRequest(url, null, 'GET').send(onload, onerror);
	},
	post : function(url, params, onload, onerror) {
		return new mxXmlRequest(url, params).send(onload, onerror);
	},
	submit : function(url, params, doc, target) {
		return new mxXmlRequest(url, params).simulate(doc, target);
	},
	loadInto : function(url, doc, onload) {
		if (false) {
			doc.onreadystatechange = function() {
				if (doc.readyState == 4) {
					onload();
				}
			};
		} else {
			doc.addEventListener('load', onload, false);
		}
		doc.load(url);
	},
	getValue : function(array, key, defaultValue) {
		var value = (array != null) ? array[key] : null;
		if (value == null) {
			value = defaultValue;
		}
		return value;
	},
	getNumber : function(array, key, defaultValue) {
		var value = (array != null) ? array[key] : null;
		if (value == null) {
			value = defaultValue || 0;
		}
		return Number(value);
	},
	getColor : function(array, key, defaultValue) {
		var value = (array != null) ? array[key] : null;
		if (value == null) {
			value = defaultValue;
		} else if (value == mxConstants.NONE) {
			value = null;
		}
		return value;
	},
	clone : function(obj, transients, shallow) {
		shallow = (shallow != null) ? shallow : false;
		var clone = null;
		if (obj != null && typeof (obj.constructor) == 'function') {
			clone = new obj.constructor();
			for ( var i in obj) {
				if (i != mxObjectIdentity.FIELD_NAME
						&& (transients == null || mxUtils
								.indexOf(transients, i) < 0)) {
					if (!shallow && typeof (obj[i]) == 'object') {
						clone[i] = mxUtils.clone(obj[i]);
					} else {
						clone[i] = obj[i];
					}
				}
			}
		}
		return clone;
	},
	equalPoints : function(a, b) {
		if ((a == null && b != null) || (a != null && b == null)
				|| (a != null && b != null && a.length != b.length)) {
			return false;
		} else if (a != null && b != null) {
			for ( var i = 0; i < a.length; i++) {
				if (a[i] == b[i] || (a[i] != null && !a[i].equals(b[i]))) {
					return false;
				}
			}
		}
		return true;
	},
	equalEntries : function(a, b) {
		if ((a == null && b != null) || (a != null && b == null)
				|| (a != null && b != null && a.length != b.length)) {
			return false;
		} else if (a != null && b != null) {
			for ( var key in a) {
				if (a[key] != b[key]) {
					return false;
				}
			}
		}
		return true;
	},
	toString : function(obj) {
		var output = '';
		for ( var i in obj) {
			try {
				if (obj[i] == null) {
					output += i + ' = [null]\n';
				} else if (typeof (obj[i]) == 'function') {
					output += i + ' => [Function]\n';
				} else if (typeof (obj[i]) == 'object') {
					var ctor = mxUtils.getFunctionName(obj[i].constructor);
					output += i + ' => [' + ctor + ']\n';
				} else {
					output += i + ' = ' + obj[i] + '\n';
				}
			} catch (e) {
				output += i + '=' + e.message;
			}
		}
		return output;
	},
	toRadians : function(deg) {
		return Math.PI * deg / 180;
	},
	arcToCurves : function(x0, y0, r1, r2, angle, largeArcFlag, sweepFlag, x, y) {
		var result = [];
		x -= x0;
		y -= y0;
		if (r1 === 0 || r2 === 0) {
			return result;
		}
		var fS = sweepFlag;
		var psai = angle;
		r1 = Math.abs(r1);
		r2 = Math.abs(r2);
		var ctx = -x / 2;
		var cty = -y / 2;
		var cpsi = Math.cos(psai * Math.PI / 180);
		var spsi = Math.sin(psai * Math.PI / 180);
		var rxd = cpsi * ctx + spsi * cty;
		var ryd = -1 * spsi * ctx + cpsi * cty;
		var rxdd = rxd * rxd;
		var rydd = ryd * ryd;
		var r1x = r1 * r1;
		var r2y = r2 * r2;
		var lamda = rxdd / r1x + rydd / r2y;
		var sds;
		if (lamda > 1) {
			r1 = Math.sqrt(lamda) * r1;
			r2 = Math.sqrt(lamda) * r2;
			sds = 0;
		} else {
			var seif = 1;
			if (largeArcFlag === fS) {
				seif = -1;
			}
			sds = seif
					* Math.sqrt((r1x * r2y - r1x * rydd - r2y * rxdd)
							/ (r1x * rydd + r2y * rxdd));
		}
		var txd = sds * r1 * ryd / r2;
		var tyd = -1 * sds * r2 * rxd / r1;
		var tx = cpsi * txd - spsi * tyd + x / 2;
		var ty = spsi * txd + cpsi * tyd + y / 2;
		var rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
				- Math.atan2(0, 1);
		var s1 = (rad >= 0) ? rad : 2 * Math.PI + rad;
		rad = Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1)
				- Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1);
		var dr = (rad >= 0) ? rad : 2 * Math.PI + rad;
		if (!fS && dr > 0) {
			dr -= 2 * Math.PI;
		} else if (fS && dr < 0) {
			dr += 2 * Math.PI;
		}
		var sse = dr * 2 / Math.PI;
		var seg = Math.ceil(sse < 0 ? -1 * sse : sse);
		var segr = dr / seg;
		var t = 8 / 3 * Math.sin(segr / 4) * Math.sin(segr / 4)
				/ Math.sin(segr / 2);
		var cpsir1 = cpsi * r1;
		var cpsir2 = cpsi * r2;
		var spsir1 = spsi * r1;
		var spsir2 = spsi * r2;
		var mc = Math.cos(s1);
		var ms = Math.sin(s1);
		var x2 = -t * (cpsir1 * ms + spsir2 * mc);
		var y2 = -t * (spsir1 * ms - cpsir2 * mc);
		var x3 = 0;
		var y3 = 0;
		for ( var n = 0; n < seg; ++n) {
			s1 += segr;
			mc = Math.cos(s1);
			ms = Math.sin(s1);
			x3 = cpsir1 * mc - spsir2 * ms + tx;
			y3 = spsir1 * mc + cpsir2 * ms + ty;
			var dx = -t * (cpsir1 * ms + spsir2 * mc);
			var dy = -t * (spsir1 * ms - cpsir2 * mc);
			result = result.concat([ Number(x2 + x0), Number(y2 + y0),
					Number(x3 - dx + x0), Number(y3 - dy + y0),
					Number(x3 + x0), Number(y3 + y0) ]);
			x2 = x3 + dx;
			y2 = y3 + dy;
		}
		return result;
	},
	getBoundingBox : function(rect, rotation) {
		var result = null;
		if (rect != null && rotation != null && rotation != 0) {
			var rad = mxUtils.toRadians(rotation);
			var cos = Math.cos(rad);
			var sin = Math.sin(rad);
			var cx = new mxPoint(rect.x + rect.width / 2, rect.y + rect.height
					/ 2);
			var p1 = new mxPoint(rect.x, rect.y);
			var p2 = new mxPoint(rect.x + rect.width, rect.y);
			var p3 = new mxPoint(p2.x, rect.y + rect.height);
			var p4 = new mxPoint(rect.x, p3.y);
			p1 = mxUtils.getRotatedPoint(p1, cos, sin, cx);
			p2 = mxUtils.getRotatedPoint(p2, cos, sin, cx);
			p3 = mxUtils.getRotatedPoint(p3, cos, sin, cx);
			p4 = mxUtils.getRotatedPoint(p4, cos, sin, cx);
			result = new mxRectangle(p1.x, p1.y, 0, 0);
			result.add(new mxRectangle(p2.x, p2.y, 0, 0));
			result.add(new mxRectangle(p3.x, p3.y, 0, 0));
			result.add(new mxRectangle(p4.x, p4.Y, 0, 0));
		}
		return result;
	},
	getRotatedPoint : function(pt, cos, sin, c) {
		c = (c != null) ? c : new mxPoint();
		var x = pt.x - c.x;
		var y = pt.y - c.y;
		var x1 = x * cos - y * sin;
		var y1 = y * cos + x * sin;
		return new mxPoint(x1 + c.x, y1 + c.y);
	},
	getPortConstraints : function(terminal, edge, source, defaultValue) {
		var value = mxUtils.getValue(terminal.style,
				mxConstants.STYLE_PORT_CONSTRAINT, null);
		if (value == null) {
			return defaultValue;
		} else {
			var directions = value.toString();
			var returnValue = mxConstants.DIRECTION_MASK_NONE;
			if (directions.indexOf(mxConstants.DIRECTION_NORTH) >= 0) {
				returnValue |= mxConstants.DIRECTION_MASK_NORTH;
			}
			if (directions.indexOf(mxConstants.DIRECTION_WEST) >= 0) {
				returnValue |= mxConstants.DIRECTION_MASK_WEST;
			}
			if (directions.indexOf(mxConstants.DIRECTION_SOUTH) >= 0) {
				returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
			}
			if (directions.indexOf(mxConstants.DIRECTION_EAST) >= 0) {
				returnValue |= mxConstants.DIRECTION_MASK_EAST;
			}
			return returnValue;
		}
	},
	reversePortConstraints : function(constraint) {
		var result = 0;
		result = (constraint & mxConstants.DIRECTION_MASK_WEST) << 3;
		result |= (constraint & mxConstants.DIRECTION_MASK_NORTH) << 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_SOUTH) >> 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_EAST) >> 3;
		return result;
	},
	findNearestSegment : function(state, x, y) {
		var index = -1;
		if (state.absolutePoints.length > 0) {
			var last = state.absolutePoints[0];
			var min = null;
			for ( var i = 1; i < state.absolutePoints.length; i++) {
				var current = state.absolutePoints[i];
				var dist = mxUtils.ptSegDistSq(last.x, last.y, current.x,
						current.y, x, y);
				if (min == null || dist < min) {
					min = dist;
					index = i - 1;
				}
				last = current;
			}
		}
		return index;
	},
	rectangleIntersectsSegment : function(bounds, p1, p2) {
		var top = bounds.y;
		var left = bounds.x;
		var bottom = top + bounds.height;
		var right = left + bounds.width;
		var minX = p1.x;
		var maxX = p2.x;
		if (p1.x > p2.x) {
			minX = p2.x;
			maxX = p1.x;
		}
		if (maxX > right) {
			maxX = right;
		}
		if (minX < left) {
			minX = left;
		}
		if (minX > maxX) {
			return false;
		}
		var minY = p1.y;
		var maxY = p2.y;
		var dx = p2.x - p1.x;
		if (Math.abs(dx) > 0.0000001) {
			var a = (p2.y - p1.y) / dx;
			var b = p1.y - a * p1.x;
			minY = a * minX + b;
			maxY = a * maxX + b;
		}
		if (minY > maxY) {
			var tmp = maxY;
			maxY = minY;
			minY = tmp;
		}
		if (maxY > bottom) {
			maxY = bottom;
		}
		if (minY < top) {
			minY = top;
		}
		if (minY > maxY) {
			return false;
		}
		return true;
	},
	contains : function(bounds, x, y) {
		return (bounds.x <= x && bounds.x + bounds.width >= x && bounds.y <= y && bounds.y
				+ bounds.height >= y);
	},
	intersects : function(a, b) {
		var tw = a.width;
		var th = a.height;
		var rw = b.width;
		var rh = b.height;
		if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
			return false;
		}
		var tx = a.x;
		var ty = a.y;
		var rx = b.x;
		var ry = b.y;
		rw += rx;
		rh += ry;
		tw += tx;
		th += ty;
		return ((rw < rx || rw > tx) && (rh < ry || rh > ty)
				&& (tw < tx || tw > rx) && (th < ty || th > ry));
	},
	intersectsHotspot : function(state, x, y, hotspot, min, max) {
		hotspot = (hotspot != null) ? hotspot : 1;
		min = (min != null) ? min : 0;
		max = (max != null) ? max : 0;
		if (hotspot > 0) {
			var cx = state.getCenterX();
			var cy = state.getCenterY();
			var w = state.width;
			var h = state.height;
			var start = mxUtils.getValue(state.style,
					mxConstants.STYLE_STARTSIZE);
			if (start > 0) {
				if (mxUtils.getValue(state.style, mxConstants.STYLE_HORIZONTAL,
						true)) {
					cy = state.y + start / 2;
					h = start;
				} else {
					cx = state.x + start / 2;
					w = start;
				}
			}
			w = Math.max(min, w * hotspot);
			h = Math.max(min, h * hotspot);
			if (max > 0) {
				w = Math.min(w, max);
				h = Math.min(h, max);
			}
			var rect = new mxRectangle(cx - w / 2, cy - h / 2, w, h);
			return mxUtils.contains(rect, x, y);
		}
		return true;
	},
	getOffset : function(container) {
		var offsetLeft = 0;
		var offsetTop = 0;
		while (container.offsetParent) {
			offsetLeft += container.offsetLeft;
			offsetTop += container.offsetTop;
			container = container.offsetParent;
		}
		return new mxPoint(offsetLeft, offsetTop);
	},
	getScrollOrigin : function(node) {
		var b = document.body;
		var d = document.documentElement;
		var sl = (b.scrollLeft || d.scrollLeft);
		var st = (b.scrollTop || d.scrollTop);
		var result = new mxPoint(sl, st);
		while (node != null && node != b && node != d) {
			result.x += node.scrollLeft;
			result.y += node.scrollTop;
			node = node.parentNode;
		}
		return result;
	},
	convertPoint : function(container, x, y) {
		var origin = mxUtils.getScrollOrigin(container);
		var offset = mxUtils.getOffset(container);
		offset.x -= origin.x;
		offset.y -= origin.y;
		return new mxPoint(x - offset.x, y - offset.y);
	},
	ltrim : function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
	},
	rtrim : function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
	},
	trim : function(str, chars) {
		return mxUtils.ltrim(mxUtils.rtrim(str, chars), chars);
	},
	isNumeric : function(str) {
		return str != null
				&& (str.length == null || (str.length > 0 && str.indexOf('0x') < 0)
						&& str.indexOf('0X') < 0) && !isNaN(str);
	},
	mod : function(n, m) {
		return ((n % m) + m) % m;
	},
	intersection : function(x0, y0, x1, y1, x2, y2, x3, y3) {
		var denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
		var nume_a = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2));
		var nume_b = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2));
		var ua = nume_a / denom;
		var ub = nume_b / denom;
		if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
			var intersectionX = x0 + ua * (x1 - x0);
			var intersectionY = y0 + ua * (y1 - y0);
			return new mxPoint(intersectionX, intersectionY);
		}
		return null;
	},
	ptSegDistSq : function(x1, y1, x2, y2, px, py) {
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		var dotprod = px * x2 + py * y2;
		var projlenSq;
		if (dotprod <= 0.0) {
			projlenSq = 0.0;
		} else {
			px = x2 - px;
			py = y2 - py;
			dotprod = px * x2 + py * y2;
			if (dotprod <= 0.0) {
				projlenSq = 0.0;
			} else {
				projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
			}
		}
		var lenSq = px * px + py * py - projlenSq;
		if (lenSq < 0) {
			lenSq = 0;
		}
		return lenSq;
	},
	relativeCcw : function(x1, y1, x2, y2, px, py) {
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		var ccw = px * y2 - py * x2;
		if (ccw == 0.0) {
			ccw = px * x2 + py * y2;
			if (ccw > 0.0) {
				px -= x2;
				py -= y2;
				ccw = px * x2 + py * y2;
				if (ccw < 0.0) {
					ccw = 0.0;
				}
			}
		}
		return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
	},
	animateChanges : function(graph, changes) {
		mxEffects.animateChanges.apply(this, arguments);
	},
	cascadeOpacity : function(graph, cell, opacity) {
		mxEffects.cascadeOpacity.apply(this, arguments);
	},
	fadeOut : function(node, from, remove, step, delay, isEnabled) {
		mxEffects.fadeOut.apply(this, arguments);
	},
	setOpacity : function(node, value) {
		if (mxUtils.isVml(node)) {
			if (value >= 100) {
				node.style.filter = null;
			} else {
				node.style.filter = 'alpha(opacity=' + (value / 5) + ')';
			}
		} else if (false) {
			if (value >= 100) {
				node.style.filter = null;
			} else {
				node.style.filter = 'alpha(opacity=' + value + ')';
			}
		} else {
			node.style.opacity = (value / 100);
		}
	},
	createImage : function(src) {
		var imageNode = null;
		if (false && document.compatMode != 'CSS1Compat') {
			imageNode = document.createElement('v:image');
			imageNode.setAttribute('src', src);
			imageNode.style.borderStyle = 'none';
		} else {
			imageNode = document.createElement('img');
			imageNode.setAttribute('src', src);
			imageNode.setAttribute('border', '0');
		}
		return imageNode;
	},
	sortCells : function(cells, ascending) {
		ascending = (ascending != null) ? ascending : true;
		var lookup = new mxDictionary();
		cells.sort(function(o1, o2) {
			var p1 = lookup.get(o1);
			if (p1 == null) {
				p1 = mxCellPath.create(o1).split(mxCellPath.PATH_SEPARATOR);
				lookup.put(o1, p1);
			}
			var p2 = lookup.get(o2);
			if (p2 == null) {
				p2 = mxCellPath.create(o2).split(mxCellPath.PATH_SEPARATOR);
				lookup.put(o2, p2);
			}
			var comp = mxCellPath.compare(p1, p2);
			return (comp == 0) ? 0 : (((comp > 0) == ascending) ? 1 : -1);
		});
		return cells;
	},
	getStylename : function(style) {
		if (style != null) {
			var pairs = style.split(';');
			var stylename = pairs[0];
			if (stylename.indexOf('=') < 0) {
				return stylename;
			}
		}
		return '';
	},
	getStylenames : function(style) {
		var result = [];
		if (style != null) {
			var pairs = style.split(';');
			for ( var i = 0; i < pairs.length; i++) {
				if (pairs[i].indexOf('=') < 0) {
					result.push(pairs[i]);
				}
			}
		}
		return result;
	},
	indexOfStylename : function(style, stylename) {
		if (style != null && stylename != null) {
			var tokens = style.split(';');
			var pos = 0;
			for ( var i = 0; i < tokens.length; i++) {
				if (tokens[i] == stylename) {
					return pos;
				}
				pos += tokens[i].length + 1;
			}
		}
		return -1;
	},
	addStylename : function(style, stylename) {
		if (mxUtils.indexOfStylename(style, stylename) < 0) {
			if (style == null) {
				style = '';
			} else if (style.length > 0
					&& style.charAt(style.length - 1) != ';') {
				style += ';';
			}
			style += stylename;
		}
		return style;
	},
	removeStylename : function(style, stylename) {
		var result = [];
		if (style != null) {
			var tokens = style.split(';');
			for ( var i = 0; i < tokens.length; i++) {
				if (tokens[i] != stylename) {
					result.push(tokens[i]);
				}
			}
		}
		return result.join(';');
	},
	removeAllStylenames : function(style) {
		var result = [];
		if (style != null) {
			var tokens = style.split(';');
			for ( var i = 0; i < tokens.length; i++) {
				if (tokens[i].indexOf('=') >= 0) {
					result.push(tokens[i]);
				}
			}
		}
		return result.join(';');
	},
	setCellStyles : function(model, cells, key, value) {
		if (cells != null && cells.length > 0) {
			model.beginUpdate();
			try {
				for ( var i = 0; i < cells.length; i++) {
					if (cells[i] != null) {
						var style = mxUtils.setStyle(model.getStyle(cells[i]),
								key, value);
						model.setStyle(cells[i], style);
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	},
	setStyle : function(style, key, value) {
		var isValue = value != null
				&& (typeof (value.length) == 'undefined' || value.length > 0);
		if (style == null || style.length == 0) {
			if (isValue) {
				style = key + '=' + value;
			}
		} else {
			var index = style.indexOf(key + '=');
			if (index < 0) {
				if (isValue) {
					var sep = (style.charAt(style.length - 1) == ';') ? ''
							: ';';
					style = style + sep + key + '=' + value;
				}
			} else {
				var tmp = (isValue) ? (key + '=' + value) : '';
				var cont = style.indexOf(';', index);
				if (!isValue) {
					cont++;
				}
				style = style.substring(0, index) + tmp
						+ ((cont > index) ? style.substring(cont) : '');
			}
		}
		return style;
	},
	setCellStyleFlags : function(model, cells, key, flag, value) {
		if (cells != null && cells.length > 0) {
			model.beginUpdate();
			try {
				for ( var i = 0; i < cells.length; i++) {
					if (cells[i] != null) {
						var style = mxUtils.setStyleFlag(model
								.getStyle(cells[i]), key, flag, value);
						model.setStyle(cells[i], style);
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	},
	setStyleFlag : function(style, key, flag, value) {
		if (style == null || style.length == 0) {
			if (value || value == null) {
				style = key + '=' + flag;
			} else {
				style = key + '=0';
			}
		} else {
			var index = style.indexOf(key + '=');
			if (index < 0) {
				var sep = (style.charAt(style.length - 1) == ';') ? '' : ';';
				if (value || value == null) {
					style = style + sep + key + '=' + flag;
				} else {
					style = style + sep + key + '=0';
				}
			} else {
				var cont = style.indexOf(';', index);
				var tmp = '';
				if (cont < 0) {
					tmp = style.substring(index + key.length + 1);
				} else {
					tmp = style.substring(index + key.length + 1, cont);
				}
				if (value == null) {
					tmp = parseInt(tmp) ^ flag;
				} else if (value) {
					tmp = parseInt(tmp) | flag;
				} else {
					tmp = parseInt(tmp) & ~flag;
				}
				style = style.substring(0, index) + key + '=' + tmp
						+ ((cont >= 0) ? style.substring(cont) : '');
			}
		}
		return style;
	},
	getSizeForString : function(text, fontSize, fontFamily) {
		var div = document.createElement('div');
		div.style.fontSize = fontSize || mxConstants.DEFAULT_FONTSIZE;
		div.style.fontFamily = fontFamily || mxConstants.DEFAULT_FONTFAMILY;
		div.style.position = 'absolute';
		div.style.display = 'inline';
		div.style.visibility = 'hidden';
		div.innerHTML = text;
		document.body.appendChild(div);
		var size = new mxRectangle(0, 0, div.offsetWidth, div.offsetHeight);
		document.body.removeChild(div);
		return size;
	},
	getViewXml : function(graph, scale, cells, x0, y0) {
		x0 = (x0 != null) ? x0 : 0;
		y0 = (y0 != null) ? y0 : 0;
		scale = (scale != null) ? scale : 1;
		if (cells == null) {
			var model = graph.getModel();
			cells = [ model.getRoot() ];
		}
		var view = graph.getView();
		var result = null;
		var eventsEnabled = view.isEventsEnabled();
		view.setEventsEnabled(false);
		var drawPane = view.drawPane;
		var overlayPane = view.overlayPane;
		if (graph.dialect == mxConstants.DIALECT_SVG) {
			view.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
			view.canvas.appendChild(view.drawPane);
			view.overlayPane = document
					.createElementNS(mxConstants.NS_SVG, 'g');
			view.canvas.appendChild(view.overlayPane);
		} else {
			view.drawPane = view.drawPane.cloneNode(false);
			view.canvas.appendChild(view.drawPane);
			view.overlayPane = view.overlayPane.cloneNode(false);
			view.canvas.appendChild(view.overlayPane);
		}
		var translate = view.getTranslate();
		view.translate = new mxPoint(x0, y0);
		var temp = new mxTemporaryCellStates(graph.getView(), scale, cells);
		try {
			var enc = new mxCodec();
			result = enc.encode(graph.getView());
		} finally {
			temp.destroy();
			view.translate = translate;
			view.canvas.removeChild(view.drawPane);
			view.canvas.removeChild(view.overlayPane);
			view.drawPane = drawPane;
			view.overlayPane = overlayPane;
			view.setEventsEnabled(eventsEnabled);
		}
		return result;
	},
	getScaleForPageCount : function(pageCount, graph, pageFormat, border) {
		if (pageCount < 1) {
			return 1;
		}
		pageFormat = (pageFormat != null) ? pageFormat
				: mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		border = (border != null) ? border : 0;
		var availablePageWidth = pageFormat.width - (border * 2);
		var availablePageHeight = pageFormat.height - (border * 2);
		var graphBounds = graph.getGraphBounds().clone();
		var sc = graph.getView().getScale();
		graphBounds.width /= sc;
		graphBounds.height /= sc;
		var graphWidth = graphBounds.width;
		var graphHeight = graphBounds.height;
		var scale = 1;
		var pageFormatAspectRatio = availablePageWidth / availablePageHeight;
		var graphAspectRatio = graphWidth / graphHeight;
		var pagesAspectRatio = graphAspectRatio / pageFormatAspectRatio;
		var pageRoot = Math.sqrt(pageCount);
		var pagesAspectRatioSqrt = Math.sqrt(pagesAspectRatio);
		var numRowPages = pageRoot * pagesAspectRatioSqrt;
		var numColumnPages = pageRoot / pagesAspectRatioSqrt;
		if (numRowPages < 1 && numColumnPages > pageCount) {
			var scaleChange = numColumnPages / pageCount;
			numColumnPages = pageCount;
			numRowPages /= scaleChange;
		}
		if (numColumnPages < 1 && numRowPages > pageCount) {
			var scaleChange = numRowPages / pageCount;
			numRowPages = pageCount;
			numColumnPages /= scaleChange;
		}
		var currentTotalPages = Math.ceil(numRowPages)
				* Math.ceil(numColumnPages);
		var numLoops = 0;
		while (currentTotalPages > pageCount) {
			var roundRowDownProportion = Math.floor(numRowPages) / numRowPages;
			var roundColumnDownProportion = Math.floor(numColumnPages)
					/ numColumnPages;
			if (roundRowDownProportion == 1) {
				roundRowDownProportion = Math.floor(numRowPages - 1)
						/ numRowPages;
			}
			if (roundColumnDownProportion == 1) {
				roundColumnDownProportion = Math.floor(numColumnPages - 1)
						/ numColumnPages;
			}
			var scaleChange = 1;
			if (roundRowDownProportion > roundColumnDownProportion) {
				scaleChange = roundRowDownProportion;
			} else {
				scaleChange = roundColumnDownProportion;
			}
			numRowPages = numRowPages * scaleChange;
			numColumnPages = numColumnPages * scaleChange;
			currentTotalPages = Math.ceil(numRowPages)
					* Math.ceil(numColumnPages);
			numLoops++;
			if (numLoops > 10) {
				break;
			}
		}
		var posterWidth = availablePageWidth * numRowPages;
		scale = posterWidth / graphWidth;
		return scale * 0.99999;
	},
	show : function(graph, doc, x0, y0) {
		x0 = (x0 != null) ? x0 : 0;
		y0 = (y0 != null) ? y0 : 0;
		if (doc == null) {
			var wnd = window.open();
			doc = wnd.document;
		} else {
			doc.open();
		}
		var bounds = graph.getGraphBounds();
		var dx = -bounds.x + x0;
		var dy = -bounds.y + y0;
		if (false) {
			var html = '<html>';
			html += '<head>';
			var base = document.getElementsByTagName('base');
			for ( var i = 0; i < base.length; i++) {
				html += base[i].outerHTML;
			}
			html += '<style>';
			for ( var i = 0; i < document.styleSheets.length; i++) {
				try {
					html += document.styleSheets(i).cssText;
				} catch (e) {
				}
			}
			html += '</style>';
			html += '</head>';
			html += '<body>';
			html += graph.container.innerHTML;
			html += '</body>';
			html += '<html>';
			doc.writeln(html);
			doc.close();
			var node = doc.body.getElementsByTagName('DIV')[0];
			if (node != null) {
				node.style.position = 'absolute';
				node.style.left = dx + 'px';
				node.style.top = dy + 'px';
			}
		} else {
			doc.writeln('<html');
			doc.writeln('<head>');
			var base = document.getElementsByTagName('base');
			for ( var i = 0; i < base.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(base[i]));
			}
			var links = document.getElementsByTagName('link');
			for ( var i = 0; i < links.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(links[i]));
			}
			var styles = document.getElementsByTagName('style');
			for ( var i = 0; i < styles.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(styles[i]));
			}
			doc.writeln('</head>');
			doc.writeln('</html>');
			doc.close();
			if (doc.body == null) {
				doc.documentElement.appendChild(doc.createElement('body'));
			}
			doc.body.style.overflow = 'auto';
			var node = graph.container.firstChild;
			while (node != null) {
				var clone = node.cloneNode(true);
				doc.body.appendChild(clone);
				node = node.nextSibling;
			}
			var node = doc.getElementsByTagName('g')[0];
			if (node != null) {
				node.setAttribute('transform', 'translate(' + dx + ',' + dy
						+ ')');
				var root = node.ownerSVGElement;
				root.setAttribute('width', bounds.width + Math.max(bounds.x, 0)
						+ 3);
				root.setAttribute('height', bounds.height
						+ Math.max(bounds.y, 0) + 3);
			}
		}
		mxUtils.removeCursors(doc.body);
		return doc;
	},
	printScreen : function(graph) {
		var wnd = window.open();
		mxUtils.show(graph, wnd.document);
		var print = function() {
			wnd.focus();
			wnd.print();
			wnd.close();
		};
		if (true) {
			wnd.setTimeout(print, 500);
		} else {
			print();
		}
	},
	popup : function(content, isInternalWindow) {
		if (isInternalWindow) {
			var div = document.createElement('div');
			div.style.overflow = 'scroll';
			div.style.width = '636px';
			div.style.height = '460px';
			var pre = document.createElement('pre');
			pre.innerHTML = mxUtils.htmlEntities(content, false).replace(/\n/g,
					'<br>').replace(/ /g, '&nbsp;');
			div.appendChild(pre);
			var w = document.body.clientWidth;
			var h = (document.body.clientHeight || document.documentElement.clientHeight);
			var wnd = new mxWindow('Popup Window', div, w / 2 - 320,
					h / 2 - 240, 640, 480, false, true);
			wnd.setClosable(true);
			wnd.setVisible(true);
		} else {
			if (true) {
				var wnd = window.open();
				wnd.document.writeln('<pre>' + mxUtils.htmlEntities(content)
						+ '</pre');
				wnd.document.close();
			} else {
				var wnd = window.open();
				var pre = wnd.document.createElement('pre');
				pre.innerHTML = mxUtils.htmlEntities(content, false).replace(
						/\n/g, '<br>').replace(/ /g, '&nbsp;');
				wnd.document.body.appendChild(pre);
			}
		}
	},
	alert : function(message) {
		alert(message);
	},
	prompt : function(message, defaultValue) {
		return prompt(message, defaultValue);
	},
	confirm : function(message) {
		return confirm(message);
	},
	error : function(message, width, close, icon) {
		var div = document.createElement('div');
		div.style.padding = '20px';
		var img = document.createElement('img');
		img.setAttribute('src', icon || mxUtils.errorImage);
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		div.appendChild(img);
		div.appendChild(document.createTextNode('\u00a0'));
		div.appendChild(document.createTextNode('\u00a0'));
		div.appendChild(document.createTextNode('\u00a0'));
		mxUtils.write(div, message);
		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(mxResources.get(mxUtils.errorResource)
				|| mxUtils.errorResource, div, (w - width) / 2, h / 4, width,
				null, false, true);
		if (close) {
			mxUtils.br(div);
			var tmp = document.createElement('p');
			var button = document.createElement('button');
			if (false) {
				button.style.cssText = 'float:right';
			} else {
				button.setAttribute('style', 'float:right');
			}
			mxEvent.addListener(button, 'click', function(evt) {
				warn.destroy();
			});
			mxUtils.write(button, mxResources.get(mxUtils.closeResource)
					|| mxUtils.closeResource);
			tmp.appendChild(button);
			div.appendChild(tmp);
			mxUtils.br(div);
			warn.setClosable(true);
		}
		warn.setVisible(true);
		return warn;
	},
	makeDraggable : function(element, graphF, funct, dragElement, dx, dy,
			autoscroll, scalePreview, highlightDropTargets, getDropTarget) {
		var dragSource = new mxDragSource(element, funct);
		dragSource.dragOffset = new mxPoint((dx != null) ? dx : 0,
				(dy != null) ? dy : mxConstants.TOOLTIP_VERTICAL_OFFSET);
		dragSource.autoscroll = autoscroll;
		dragSource.setGuidesEnabled(false);
		if (highlightDropTargets != null) {
			dragSource.highlightDropTargets = highlightDropTargets;
		}
		if (getDropTarget != null) {
			dragSource.getDropTarget = getDropTarget;
		}
		dragSource.getGraphForEvent = function(evt) {
			return (typeof (graphF) == 'function') ? graphF(evt) : graphF;
		};
		if (dragElement != null) {
			dragSource.createDragElement = function() {
				return dragElement.cloneNode(true);
			};
			if (scalePreview) {
				dragSource.createPreviewElement = function(graph) {
					var elt = dragElement.cloneNode(true);
					var w = parseInt(elt.style.width);
					var h = parseInt(elt.style.height);
					elt.style.width = Math.round(w * graph.view.scale) + ' px';
					elt.style.height = Math.round(h * graph.view.scale) + ' px';
					return elt;
				};
			}
		}
		return dragSource;
	}
};