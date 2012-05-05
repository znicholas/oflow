var mxCodecRegistry = {
	codecs: [],
	aliases: [],
	register: function(codec) {
		if (codec != null) {
			var name = codec.getName();
			mxCodecRegistry.codecs[name] = codec;
			var classname = mxUtils.getFunctionName(codec.template.constructor);
			if (classname != name) {
				mxCodecRegistry.addAlias(classname, name);
			}
		}
		return codec;
	},
	addAlias: function(classname, codecname) {
		mxCodecRegistry.aliases[classname] = codecname;
	},
	getCodec: function(ctor) {
		var codec = null;
		if (ctor != null) {
			var name = mxUtils.getFunctionName(ctor);
			var tmp = mxCodecRegistry.aliases[name];
			if (tmp != null) {
				name = tmp;
			}
			codec = mxCodecRegistry.codecs[name];
			if (codec == null) {
				try {
					codec = new mxObjectCodec(new ctor());
					mxCodecRegistry.register(codec);
				} catch(e) {}
			}
		}
		return codec;
	}
};
function mxCodec(document) {
	this.document = document || mxUtils.createXmlDocument();
	this.objects = [];
};
mxCodec.prototype.document = null;
mxCodec.prototype.objects = null;
mxCodec.prototype.encodeDefaults = false;
mxCodec.prototype.putObject = function(id, obj) {
	this.objects[id] = obj;
	return obj;
};
mxCodec.prototype.getObject = function(id) {
	var obj = null;
	if (id != null) {
		obj = this.objects[id];
		if (obj == null) {
			obj = this.lookup(id);
			if (obj == null) {
				var node = this.getElementById(id);
				if (node != null) {
					obj = this.decode(node);
				}
			}
		}
	}
	return obj;
};
mxCodec.prototype.lookup = function(id) {
	return null;
};
mxCodec.prototype.getElementById = function(id, attr) {
	attr = (attr != null) ? attr: 'id';
	return mxUtils.findNodeByAttribute(this.document.documentElement, attr, id);
};
mxCodec.prototype.getId = function(obj) {
	var id = null;
	if (obj != null) {
		id = this.reference(obj);
		if (id == null && obj instanceof mxCell) {
			id = obj.getId();
			if (id == null) {
				id = mxCellPath.create(obj);
				if (id.length == 0) {
					id = 'root';
				}
			}
		}
	}
	return id;
};
mxCodec.prototype.reference = function(obj) {
	return null;
};
mxCodec.prototype.encode = function(obj) {
	var node = null;
	if (obj != null && obj.constructor != null) {
		var enc = mxCodecRegistry.getCodec(obj.constructor);
		if (enc != null) {
			node = enc.encode(this, obj);
		} else {
			if (mxUtils.isNode(obj)) {
				node = (mxClient.IS_IE) ? obj.cloneNode(true) : this.document.importNode(obj, true);
			} else {
				mxLog.warn('mxCodec.encode: No codec for ' + mxUtils.getFunctionName(obj.constructor));
			}
		}
	}
	return node;
};
mxCodec.prototype.decode = function(node, into) {
	var obj = null;
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var ctor = null;
		try {
			ctor = eval(node.nodeName);
		} catch(err) {}
		try {
			var dec = mxCodecRegistry.getCodec(ctor);
			if (dec != null) {
				obj = dec.decode(this, node, into);
			} else {
				obj = node.cloneNode(true);
				obj.removeAttribute('as');
			}
		} catch(err) {
			mxLog.debug('Cannot decode ' + node.nodeName + ': ' + err.message);
		}
	}
	return obj;
};
mxCodec.prototype.encodeCell = function(cell, node, includeChildren) {
	node.appendChild(this.encode(cell));
	if (includeChildren == null || includeChildren) {
		var childCount = cell.getChildCount();
		for (var i = 0; i < childCount; i++) {
			this.encodeCell(cell.getChildAt(i), node);
		}
	}
};
mxCodec.prototype.isCellCodec = function(codec) {
	if (codec != null && typeof(codec.isCellCodec) == 'function') {
		return codec.isCellCodec();
	}
	return false;
};
mxCodec.prototype.decodeCell = function(node, restoreStructures) {
	restoreStructures = (restoreStructures != null) ? restoreStructures: true;
	var cell = null;
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var decoder = mxCodecRegistry.getCodec(node.nodeName);
		if (!this.isCellCodec(decoder)) {
			var child = node.firstChild;
			while (child != null && !this.isCellCodec(decoder)) {
				decoder = mxCodecRegistry.getCodec(child.nodeName);
				child = child.nextSibling;
			}
		}
		if (!this.isCellCodec(decoder)) {
			decoder = mxCodecRegistry.getCodec(mxCell);
		}
		cell = decoder.decode(this, node);
		if (restoreStructures) {
			this.insertIntoGraph(cell);
		}
	}
	return cell;
};
mxCodec.prototype.insertIntoGraph = function(cell) {
	var parent = cell.parent;
	var source = cell.getTerminal(true);
	var target = cell.getTerminal(false);
	cell.setTerminal(null, false);
	cell.setTerminal(null, true);
	cell.parent = null;
	if (parent != null) {
		parent.insert(cell);
	}
	if (source != null) {
		source.insertEdge(cell, true);
	}
	if (target != null) {
		target.insertEdge(cell, false);
	}
};
mxCodec.prototype.setAttribute = function(node, attribute, value) {
	if (attribute != null && value != null) {
		node.setAttribute(attribute, value);
	}
};
function mxObjectCodec(template, exclude, idrefs, mapping) {
	this.template = template;
	this.exclude = (exclude != null) ? exclude: [];
	this.idrefs = (idrefs != null) ? idrefs: [];
	this.mapping = (mapping != null) ? mapping: [];
	this.reverse = new Object();
	for (var i in this.mapping) {
		this.reverse[this.mapping[i]] = i;
	}
};
mxObjectCodec.prototype.template = null;
mxObjectCodec.prototype.exclude = null;
mxObjectCodec.prototype.idrefs = null;
mxObjectCodec.prototype.mapping = null;
mxObjectCodec.prototype.reverse = null;
mxObjectCodec.prototype.getName = function() {
	return mxUtils.getFunctionName(this.template.constructor);
};
mxObjectCodec.prototype.cloneTemplate = function() {
	return new this.template.constructor();
};
mxObjectCodec.prototype.getFieldName = function(attributename) {
	if (attributename != null) {
		var mapped = this.reverse[attributename];
		if (mapped != null) {
			attributename = mapped;
		}
	}
	return attributename;
};
mxObjectCodec.prototype.getAttributeName = function(fieldname) {
	if (fieldname != null) {
		var mapped = this.mapping[fieldname];
		if (mapped != null) {
			fieldname = mapped;
		}
	}
	return fieldname;
};
mxObjectCodec.prototype.isExcluded = function(obj, attr, value, write) {
	return attr == mxObjectIdentity.FIELD_NAME || mxUtils.indexOf(this.exclude, attr) >= 0;
};
mxObjectCodec.prototype.isReference = function(obj, attr, value, write) {
	return mxUtils.indexOf(this.idrefs, attr) >= 0;
};
mxObjectCodec.prototype.encode = function(enc, obj) {
	var node = enc.document.createElement(this.getName());
	obj = this.beforeEncode(enc, obj, node);
	this.encodeObject(enc, obj, node);
	return this.afterEncode(enc, obj, node);
};
mxObjectCodec.prototype.encodeObject = function(enc, obj, node) {
	enc.setAttribute(node, 'id', enc.getId(obj));
	for (var i in obj) {
		var name = i;
		var value = obj[name];
		if (value != null && !this.isExcluded(obj, name, value, true)) {
			if (mxUtils.isNumeric(name)) {
				name = null;
			}
			this.encodeValue(enc, obj, name, value, node);
		}
	}
};
mxObjectCodec.prototype.encodeValue = function(enc, obj, name, value, node) {
	if (value != null) {
		if (this.isReference(obj, name, value, true)) {
			var tmp = enc.getId(value);
			if (tmp == null) {
				mxLog.warn('mxObjectCodec.encode: No ID for ' + this.getName() + '.' + name + '=' + value);
				return;
			}
			value = tmp;
		}
		var defaultValue = this.template[name];
		if (name == null || enc.encodeDefaults || defaultValue != value) {
			name = this.getAttributeName(name);
			this.writeAttribute(enc, obj, name, value, node);
		}
	}
};
mxObjectCodec.prototype.writeAttribute = function(enc, obj, attr, value, node) {
	if (typeof(value) != 'object') {
		this.writePrimitiveAttribute(enc, obj, attr, value, node);
	} else {
		this.writeComplexAttribute(enc, obj, attr, value, node);
	}
};
mxObjectCodec.prototype.writePrimitiveAttribute = function(enc, obj, attr, value, node) {
	value = this.convertValueToXml(value);
	if (attr == null) {
		var child = enc.document.createElement('add');
		if (typeof(value) == 'function') {
			child.appendChild(enc.document.createTextNode(value));
		} else {
			enc.setAttribute(child, 'value', value);
		}
		node.appendChild(child);
	} else if (typeof(value) != 'function') {
		enc.setAttribute(node, attr, value);
	}
};
mxObjectCodec.prototype.writeComplexAttribute = function(enc, obj, attr, value, node) {
	var child = enc.encode(value);
	if (child != null) {
		if (attr != null) {
			child.setAttribute('as', attr);
		}
		node.appendChild(child);
	} else {
		mxLog.warn('mxObjectCodec.encode: No node for ' + this.getName() + '.' + attr + ': ' + value);
	}
};
mxObjectCodec.prototype.convertValueToXml = function(value) {
	if (typeof(value.length) == 'undefined' && (value == true || value == false)) {
		value = (value == true) ? '1': '0';
	}
	return value;
};
mxObjectCodec.prototype.convertValueFromXml = function(value) {
	if (mxUtils.isNumeric(value)) {
		value = parseFloat(value);
	}
	return value;
};
mxObjectCodec.prototype.beforeEncode = function(enc, obj, node) {
	return obj;
};
mxObjectCodec.prototype.afterEncode = function(enc, obj, node) {
	return node;
};
mxObjectCodec.prototype.decode = function(dec, node, into) {
	var id = node.getAttribute('id');
	var obj = dec.objects[id];
	if (obj == null) {
		obj = into || this.cloneTemplate();
		if (id != null) {
			dec.putObject(id, obj);
		}
	}
	node = this.beforeDecode(dec, node, obj);
	this.decodeNode(dec, node, obj);
	return this.afterDecode(dec, node, obj);
};
mxObjectCodec.prototype.decodeNode = function(dec, node, obj) {
	if (node != null) {
		this.decodeAttributes(dec, node, obj);
		this.decodeChildren(dec, node, obj);
	}
};
mxObjectCodec.prototype.decodeAttributes = function(dec, node, obj) {
	var attrs = node.attributes;
	if (attrs != null) {
		for (var i = 0; i < attrs.length; i++) {
			this.decodeAttribute(dec, attrs[i], obj);
		}
	}
};
mxObjectCodec.prototype.decodeAttribute = function(dec, attr, obj) {
	var name = attr.nodeName;
	if (name != 'as' && name != 'id') {
		var value = this.convertValueFromXml(attr.nodeValue);
		var fieldname = this.getFieldName(name);
		if (this.isReference(obj, fieldname, value, false)) {
			var tmp = dec.getObject(value);
			if (tmp == null) {
				mxLog.warn('mxObjectCodec.decode: No object for ' + this.getName() + '.' + name + '=' + value);
				return;
			}
			value = tmp;
		}
		if (!this.isExcluded(obj, name, value, false)) {
			obj[name] = value;
		}
	}
};
mxObjectCodec.prototype.decodeChildren = function(dec, node, obj) {
	var child = node.firstChild;
	while (child != null) {
		var tmp = child.nextSibling;
		if (child.nodeType == mxConstants.NODETYPE_ELEMENT && !this.processInclude(dec, child, obj)) {
			this.decodeChild(dec, child, obj);
		}
		child = tmp;
	}
};
mxObjectCodec.prototype.decodeChild = function(dec, child, obj) {
	var fieldname = this.getFieldName(child.getAttribute('as'));
	if (fieldname == null || !this.isExcluded(obj, fieldname, child, false)) {
		var template = this.getFieldTemplate(obj, fieldname, child);
		var value = null;
		if (child.nodeName == 'add') {
			value = child.getAttribute('value');
			if (value == null) {
				value = mxUtils.eval(mxUtils.getTextContent(child));
			}
		} else {
			value = dec.decode(child, template);
		}
		this.addObjectValue(obj, fieldname, value, template);
	}
};
mxObjectCodec.prototype.getFieldTemplate = function(obj, fieldname, child) {
	var template = obj[fieldname];
	if (template instanceof Array && template.length > 0) {
		template = null;
	}
	return template;
};
mxObjectCodec.prototype.addObjectValue = function(obj, fieldname, value, template) {
	if (value != null && value != template) {
		if (fieldname != null && fieldname.length > 0) {
			obj[fieldname] = value;
		} else {
			obj.push(value);
		}
	}
};
mxObjectCodec.prototype.processInclude = function(dec, node, into) { // 处理include标签
	if (node.nodeName == 'include') {
		var name = node.getAttribute('name');
		if (name != null) {
			try {
				var url = name;
				if (mxBasePath) {
					url = mxBasePath +"/"+ url;
				}
				var xml = mxUtils.load(url).getDocumentElement();
				if (xml != null) {
					dec.decode(xml, into);
				}
			} catch(e) {}
		}
		return true;
	}
	return false;
};
mxObjectCodec.prototype.beforeDecode = function(dec, node, obj) {
	return node;
};
mxObjectCodec.prototype.afterDecode = function(dec, node, obj) {
	return obj;
};
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxCell(), ['children', 'edges', 'overlays', 'mxTransient'], ['parent', 'source', 'target']);
	codec.isCellCodec = function() {
		return true;
	};
	codec.isExcluded = function(obj, attr, value, isWrite) {
		return mxObjectCodec.prototype.isExcluded.apply(this, arguments) || (isWrite && attr == 'value' && value.nodeType == mxConstants.NODETYPE_ELEMENT);
	};
	codec.afterEncode = function(enc, obj, node) {
		if (obj.value != null && obj.value.nodeType == mxConstants.NODETYPE_ELEMENT) {
			var tmp = node;
			node = (mxClient.IS_IE) ? obj.value.cloneNode(true) : enc.document.importNode(obj.value, true);
			node.appendChild(tmp);
			var id = tmp.getAttribute('id');
			node.setAttribute('id', id);
			tmp.removeAttribute('id');
		}
		return node;
	};
	codec.beforeDecode = function(dec, node, obj) {
		var inner = node;
		var classname = this.getName();
		if (node.nodeName != classname) {
			var tmp = node.getElementsByTagName(classname)[0];
			if (tmp != null && tmp.parentNode == node) {
				mxUtils.removeWhitespace(tmp, true);
				mxUtils.removeWhitespace(tmp, false);
				tmp.parentNode.removeChild(tmp);
				inner = tmp;
			} else {
				inner = null;
			}
			obj.value = node.cloneNode(true);
			var id = obj.value.getAttribute('id');
			if (id != null) {
				obj.setId(id);
				obj.value.removeAttribute('id');
			}
		} else {
			obj.setId(node.getAttribute('id'));
		}
		if (inner != null) {
			for (var i = 0; i < this.idrefs.length; i++) {
				var attr = this.idrefs[i];
				var ref = inner.getAttribute(attr);
				if (ref != null) {
					inner.removeAttribute(attr);
					var object = dec.objects[ref] || dec.lookup(ref);
					if (object == null) {
						var element = dec.getElementById(ref);
						if (element != null) {
							var decoder = mxCodecRegistry.codecs[element.nodeName] || this;
							object = decoder.decode(dec, element);
						}
					}
					obj[attr] = object;
				}
			}
		}
		return inner;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxGraphModel());
	codec.encodeObject = function(enc, obj, node) {
		var rootNode = enc.document.createElement('root');
		enc.encodeCell(obj.getRoot(), rootNode);
		node.appendChild(rootNode);
	};
	codec.decodeChild = function(dec, child, obj) {
		if (child.nodeName == 'root') {
			this.decodeRoot(dec, child, obj);
		} else {
			mxObjectCodec.prototype.decodeChild.apply(this, arguments);
		}
	};
	codec.decodeRoot = function(dec, root, model) {
		var rootCell = null;
		var tmp = root.firstChild;
		while (tmp != null) {
			var cell = dec.decodeCell(tmp);
			if (cell != null && cell.getParent() == null) {
				rootCell = cell;
			}
			tmp = tmp.nextSibling;
		}
		if (rootCell != null) {
			model.setRoot(rootCell);
		}
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxRootChange(), ['model', 'previous', 'root']);
	codec.afterEncode = function(enc, obj, node) {
		enc.encodeCell(obj.root, node);
		return node;
	};
	codec.beforeDecode = function(dec, node, obj) {
		if (node.firstChild != null && node.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT) {
			node = node.cloneNode(true);
			var tmp = node.firstChild;
			obj.root = dec.decodeCell(tmp, false);
			var tmp2 = tmp.nextSibling;
			tmp.parentNode.removeChild(tmp);
			tmp = tmp2;
			while (tmp != null) {
				tmp2 = tmp.nextSibling;
				dec.decodeCell(tmp);
				tmp.parentNode.removeChild(tmp);
				tmp = tmp2;
			}
		}
		return node;
	};
	codec.afterDecode = function(dec, node, obj) {
		obj.previous = obj.root;
		return obj;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxChildChange(), ['model', 'child', 'previousIndex'], ['parent', 'previous']);
	codec.isReference = function(obj, attr, value, isWrite) {
		if (attr == 'child' && (obj.previous != null || !isWrite)) {
			return true;
		}
		return mxUtils.indexOf(this.idrefs, attr) >= 0;
	};
	codec.afterEncode = function(enc, obj, node) {
		if (this.isReference(obj, 'child', obj.child, true)) {
			node.setAttribute('child', enc.getId(obj.child));
		} else {
			enc.encodeCell(obj.child, node);
		}
		return node;
	};
	codec.beforeDecode = function(dec, node, obj) {
		if (node.firstChild != null && node.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT) {
			node = node.cloneNode(true);
			var tmp = node.firstChild;
			obj.child = dec.decodeCell(tmp, false);
			var tmp2 = tmp.nextSibling;
			tmp.parentNode.removeChild(tmp);
			tmp = tmp2;
			while (tmp != null) {
				tmp2 = tmp.nextSibling;
				if (tmp.nodeType == mxConstants.NODETYPE_ELEMENT) {
					var id = tmp.getAttribute('id');
					if (dec.lookup(id) == null) {
						dec.decodeCell(tmp);
					}
				}
				tmp.parentNode.removeChild(tmp);
				tmp = tmp2;
			}
		} else {
			var childRef = node.getAttribute('child');
			obj.child = dec.getObject(childRef);
		}
		return node;
	};
	codec.afterDecode = function(dec, node, obj) {
		obj.child.parent = obj.previous;
		obj.previous = obj.parent;
		obj.previousIndex = obj.index;
		return obj;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxTerminalChange(), ['model', 'previous'], ['cell', 'terminal']);
	codec.afterDecode = function(dec, node, obj) {
		obj.previous = obj.terminal;
		return obj;
	};
	return codec;
} ());
var mxGenericChangeCodec = function(obj, variable) {
	var codec = new mxObjectCodec(obj, ['model', 'previous'], ['cell']);
	codec.afterDecode = function(dec, node, obj) {
		if (mxUtils.isNode(obj.cell)) {
			obj.cell = dec.decodeCell(obj.cell, false);
		}
		obj.previous = obj[variable];
		return obj;
	};
	return codec;
};
mxCodecRegistry.register(mxGenericChangeCodec(new mxValueChange(), 'value'));
mxCodecRegistry.register(mxGenericChangeCodec(new mxStyleChange(), 'style'));
mxCodecRegistry.register(mxGenericChangeCodec(new mxGeometryChange(), 'geometry'));
mxCodecRegistry.register(mxGenericChangeCodec(new mxCollapseChange(), 'collapsed'));
mxCodecRegistry.register(mxGenericChangeCodec(new mxVisibleChange(), 'visible'));
mxCodecRegistry.register(mxGenericChangeCodec(new mxCellAttributeChange(), 'value'));
mxCodecRegistry.register(function() {
	return new mxObjectCodec(new mxGraph(), ['graphListeners', 'eventListeners', 'view', 'container', 'cellRenderer', 'editor', 'selection']);
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxGraphView());
	codec.encode = function(enc, view) {
		return this.encodeCell(enc, view, view.graph.getModel().getRoot());
	};
	codec.encodeCell = function(enc, view, cell) {
		var model = view.graph.getModel();
		var state = view.getState(cell);
		var parent = model.getParent(cell);
		if (parent == null || state != null) {
			var childCount = model.getChildCount(cell);
			var geo = view.graph.getCellGeometry(cell);
			var name = null;
			if (parent == model.getRoot()) {
				name = 'layer';
			} else if (parent == null) {
				name = 'graph';
			} else if (model.isEdge(cell)) {
				name = 'edge';
			} else if (childCount > 0 && geo != null) {
				name = 'group';
			} else if (model.isVertex(cell)) {
				name = 'vertex';
			}
			if (name != null) {
				var node = enc.document.createElement(name);
				var lab = view.graph.getLabel(cell);
				if (lab != null) {
					node.setAttribute('label', view.graph.getLabel(cell));
					if (view.graph.isHtmlLabel(cell)) {
						node.setAttribute('html', true);
					}
				}
				if (parent == null) {
					var bounds = view.getGraphBounds();
					if (bounds != null) {
						node.setAttribute('x', Math.round(bounds.x));
						node.setAttribute('y', Math.round(bounds.y));
						node.setAttribute('width', Math.round(bounds.width));
						node.setAttribute('height', Math.round(bounds.height));
					}
					node.setAttribute('scale', view.scale);
				} else if (state != null && geo != null) {
					for (var i in state.style) {
						var value = state.style[i];
						if (typeof(value) == 'function' && typeof(value) == 'object') {
							value = mxStyleRegistry.getName(value);
						}
						if (value != null && typeof(value) != 'function' && typeof(value) != 'object') {
							node.setAttribute(i, value);
						}
					}
					var abs = state.absolutePoints;
					if (abs != null && abs.length > 0) {
						var pts = Math.round(abs[0].x) + ',' + Math.round(abs[0].y);
						for (var i = 1; i < abs.length; i++) {
							pts += ' ' + Math.round(abs[i].x) + ',' + Math.round(abs[i].y);
						}
						node.setAttribute('points', pts);
					} else {
						node.setAttribute('x', Math.round(state.x));
						node.setAttribute('y', Math.round(state.y));
						node.setAttribute('width', Math.round(state.width));
						node.setAttribute('height', Math.round(state.height));
					}
					var offset = state.absoluteOffset;
					if (offset != null) {
						if (offset.x != 0) {
							node.setAttribute('dx', Math.round(offset.x));
						}
						if (offset.y != 0) {
							node.setAttribute('dy', Math.round(offset.y));
						}
					}
				}
				for (var i = 0; i < childCount; i++) {
					var childNode = this.encodeCell(enc, view, model.getChildAt(cell, i));
					if (childNode != null) {
						node.appendChild(childNode);
					}
				}
			}
		}
		return node;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxStylesheet());
	codec.encode = function(enc, obj) {
		var node = enc.document.createElement(this.getName());
		for (var i in obj.styles) {
			var style = obj.styles[i];
			var styleNode = enc.document.createElement('add');
			if (i != null) {
				styleNode.setAttribute('as', i);
				for (var j in style) {
					var value = this.getStringValue(j, style[j]);
					if (value != null) {
						var entry = enc.document.createElement('add');
						entry.setAttribute('value', value);
						entry.setAttribute('as', j);
						styleNode.appendChild(entry);
					}
				}
				if (styleNode.childNodes.length > 0) {
					node.appendChild(styleNode);
				}
			}
		}
		return node;
	};
	codec.getStringValue = function(key, value) {
		var type = typeof(value);
		if (type == 'function') {
			value = mxStyleRegistry.getName(style[j]);
		} else if (type == 'object') {
			value = null;
		}
		return value;
	};
	codec.decode = function(dec, node, into) {
		var obj = into || new this.template.constructor();
		var id = node.getAttribute('id');
		if (id != null) {
			dec.objects[id] = obj;
		}
		node = node.firstChild;
		while (node != null) {
			if (!this.processInclude(dec, node, obj) && node.nodeName == 'add') {
				var as = node.getAttribute('as');
				if (as != null) {
					var extend = node.getAttribute('extend');
					var style = (extend != null) ? mxUtils.clone(obj.styles[extend]) : null;
					if (style == null) {
						if (extend != null) {
							mxLog.warn('mxStylesheetCodec.decode: stylesheet ' + extend + ' not found to extend');
						}
						style = new Object();
					}
					var entry = node.firstChild;
					while (entry != null) {
						if (entry.nodeType == mxConstants.NODETYPE_ELEMENT) {
							var key = entry.getAttribute('as');
							if (entry.nodeName == 'add') {
								var text = mxUtils.getTextContent(entry);
								var value = null;
								if (text != null && text.length > 0) {
									value = mxUtils.eval(text);
								} else {
									value = entry.getAttribute('value');
									if (mxUtils.isNumeric(value)) {
										value = parseFloat(value);
									}
								}
								if (value != null) {
									style[key] = value;
								}
							} else if (entry.nodeName == 'remove') {
								delete style[key];
							}
						}
						entry = entry.nextSibling;
					}
					obj.putCellStyle(as, style);
				}
			}
			node = node.nextSibling;
		}
		return obj;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxDefaultKeyHandler());
	codec.encode = function(enc, obj) {
		return null;
	};
	codec.decode = function(dec, node, into) {
		if (into != null) {
			var editor = into.editor;
			node = node.firstChild;
			while (node != null) {
				if (!this.processInclude(dec, node, into) && node.nodeName == 'add') {
					var as = node.getAttribute('as');
					var action = node.getAttribute('action');
					var control = node.getAttribute('control');
					into.bindAction(as, action, control);
				}
				node = node.nextSibling;
			}
		}
		return into;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxDefaultToolbar());
	codec.encode = function(enc, obj) {
		return null;
	};
	codec.decode = function(dec, node, into) {
		if (into != null) {
			var editor = into.editor;
			node = node.firstChild;
			while (node != null) {
				if (node.nodeType == mxConstants.NODETYPE_ELEMENT) {
					if (!this.processInclude(dec, node, into)) {
						if (node.nodeName == 'separator') {
							into.addSeparator();
						} else if (node.nodeName == 'br') {
							into.toolbar.addBreak();
						} else if (node.nodeName == 'hr') {
							into.toolbar.addLine();
						} else if (node.nodeName == 'add') {
							var as = node.getAttribute('as');
							as = mxResources.get(as) || as;
							var icon = node.getAttribute('icon');
							var pressedIcon = node.getAttribute('pressedIcon');
							var action = node.getAttribute('action');
							var mode = node.getAttribute('mode');
							var template = node.getAttribute('template');
							var toggle = node.getAttribute('toggle') != '0';
							var text = mxUtils.getTextContent(node);
							var elt = null;
							if (action != null) {
								elt = into.addItem(as, icon, action, pressedIcon);
							} else if (mode != null) {
								var funct = mxUtils.eval(text);
								elt = into.addMode(as, icon, mode, pressedIcon, funct);
							} else if (template != null || (text != null && text.length > 0)) {
								var cell = editor.templates[template];
								var style = node.getAttribute('style');
								if (cell != null && style != null) {
									cell = cell.clone();
									cell.setStyle(style);
								}
								var insertFunction = null;
								if (text != null && text.length > 0) {
									insertFunction = mxUtils.eval(text);
								}
								elt = into.addPrototype(as, icon, cell, pressedIcon, insertFunction, toggle);
							} else {
								var children = mxUtils.getChildNodes(node);
								if (children.length > 0) {
									if (icon == null) {
										var combo = into.addActionCombo(as);
										for (var i = 0; i < children.length; i++) {
											var child = children[i];
											if (child.nodeName == 'separator') {
												into.addOption(combo, '---');
											} else if (child.nodeName == 'add') {
												var lab = child.getAttribute('as');
												var act = child.getAttribute('action');
												into.addActionOption(combo, lab, act);
											}
										}
									} else {
										var select = null;
										var create = function() {
											var template = editor.templates[select.value];
											if (template != null) {
												var clone = template.clone();
												var style = select.options[select.selectedIndex].cellStyle;
												if (style != null) {
													clone.setStyle(style);
												}
												return clone;
											} else {
												mxLog.warn('Template ' + template + ' not found');
											}
											return null;
										};
										var img = into.addPrototype(as, icon, create, null, null, toggle);
										select = into.addCombo();
										mxEvent.addListener(select, 'change',
										function() {
											into.toolbar.selectMode(img,
											function(evt) {
												var pt = mxUtils.convertPoint(editor.graph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
												return editor.addVertex(null, funct(), pt.x, pt.y);
											});
											into.toolbar.noReset = false;
										});
										for (var i = 0; i < children.length; i++) {
											var child = children[i];
											if (child.nodeName == 'separator') {
												into.addOption(select, '---');
											} else if (child.nodeName == 'add') {
												var lab = child.getAttribute('as');
												var tmp = child.getAttribute('template');
												var option = into.addOption(select, lab, tmp || template);
												option.cellStyle = child.getAttribute('style');
											}
										}
									}
								}
							}
							if (elt != null) {
								var id = node.getAttribute('id');
								if (id != null && id.length > 0) {
									elt.setAttribute('id', id);
								}
							}
						}
					}
				}
				node = node.nextSibling;
			}
		}
		return into;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxDefaultPopupMenu());
	codec.encode = function(enc, obj) {
		return null;
	};
	codec.decode = function(dec, node, into) {
		var inc = node.getElementsByTagName('include')[0];
		if (inc != null) {
			this.processInclude(dec, inc, into);
		} else if (into != null) {
			into.config = node;
		}
		return into;
	};
	return codec;
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxEditor(), ['modified', 'lastSnapshot', 'ignoredChanges', 'undoManager', 'graphContainer', 'toolbarContainer']);
	codec.afterDecode = function(dec, node, obj) {
		var defaultEdge = node.getAttribute('defaultEdge');
		if (defaultEdge != null) {
			node.removeAttribute('defaultEdge');
			obj.defaultEdge = obj.templates[defaultEdge];
		}
		var defaultGroup = node.getAttribute('defaultGroup');
		if (defaultGroup != null) {
			node.removeAttribute('defaultGroup');
			obj.defaultGroup = obj.templates[defaultGroup];
		}
		return obj;
	};
	codec.decodeChild = function(dec, child, obj) {
		if (child.nodeName == 'Array') {
			var role = child.getAttribute('as');
			if (role == 'templates') {
				this.decodeTemplates(dec, child, obj);
				return;
			}
		} else if (child.nodeName == 'ui') {
			this.decodeUi(dec, child, obj);
			return;
		}
		mxObjectCodec.prototype.decodeChild.apply(this, arguments);
	};
	codec.decodeUi = function(dec, node, editor) { // 处理ui标签
		var tmp = node.firstChild;
		while (tmp != null) {
			if (tmp.nodeName == 'add') {
				var as = tmp.getAttribute('as');
				var elt = tmp.getAttribute('element');
				var style = tmp.getAttribute('style');
				var element = null;
				if (elt != null) {
					element = document.getElementById(elt);
					if (element != null && style != null) {
						element.style.cssText += ';' + style;
					}
				} else {
					var x = parseInt(tmp.getAttribute('x'));
					var y = parseInt(tmp.getAttribute('y'));
					var width = tmp.getAttribute('width');
					var height = tmp.getAttribute('height');
					element = document.createElement('div');
					element.style.cssText = style;
					var wnd = new mxWindow(mxResources.get(as) || as, element, x, y, width, height, false, true);
					wnd.setVisible(true);
				}
				if (as == 'graph') {
					editor.setGraphContainer(element);
				} else if (as == 'toolbar') {
					editor.setToolbarContainer(element);
				} else if (as == 'title') {
					editor.setTitleContainer(element);
				} else if (as == 'status') {
					editor.setStatusContainer(element);
				} else if (as == 'map') {
					editor.setMapContainer(element);
				}
			} else if (tmp.nodeName == 'resource') {
				var resourceName = tmp.getAttribute('basename');
				if (mxBasePath) {
					resourceName = mxBasePath +"/"+resourceName;
				}
				mxResources.add(resourceName);
			} else if (tmp.nodeName == 'stylesheet') {
				mxClient.link('stylesheet', tmp.getAttribute('name'));
			}
			tmp = tmp.nextSibling;
		}
	};
	codec.decodeTemplates = function(dec, node, editor) {
		if (editor.templates == null) {
			editor.templates = [];
		}
		var children = mxUtils.getChildNodes(node);
		for (var j = 0; j < children.length; j++) {
			var name = children[j].getAttribute('as');
			var child = children[j].firstChild;
			while (child != null && child.nodeType != 1) {
				child = child.nextSibling;
			}
			if (child != null) {
				editor.templates[name] = dec.decodeCell(child);
			}
		}
	};
	return codec;
} ());