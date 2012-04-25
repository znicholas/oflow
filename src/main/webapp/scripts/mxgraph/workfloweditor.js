mxConstants.DEFAULT_HOTSPOT = 1;
		
// Enables guides
mxGraphHandler.prototype.guidesEnabled = true;

// Alt disables guides
mxGuide.prototype.isEnabledForEvent = function(evt)
{
	return !mxEvent.isAltDown(evt);
};

// Enables snapping waypoints to terminals
mxEdgeHandler.prototype.snapToTerminals = true;

mxUtils.getPrettyXml = function(node, tab, indent){
	var result = [];
    if (node != null) {
        tab = tab || '  ';
        indent = indent || '';
        if (node.nodeType == mxConstants.NODETYPE_TEXT) {
        	var re = /\t/g; // 创建正则表达式模式。
            result.push(node.nodeValue.replace(re, ""));
        } else {
            result.push(indent + '<' + node.nodeName);
            var attrs = node.attributes;
            if (attrs != null) {
                for (var i = 0; i < attrs.length; i++) {
                    var val = mxUtils.htmlEntities(attrs[i].nodeValue);
                    result.push(' ' + attrs[i].nodeName + '="' + val + '"');
                }
            }
            var tmp = node.firstChild;
            if (tmp != null) {
            	result.push('>');
            	var tmpNodeName = tmp.nodeName;
            	// 去掉换行回车tab等符号
            	var tmpNodeValue = tmp.nodeValue ? tmp.nodeValue.replace(/\n|\r|\t/g, "") : "";
            	
            	if (tmpNodeName != '#text'){
            		result.push('\n');
            	}
            	
                while (tmp != null) {
                    result.push(mxUtils.getPrettyXml(tmp, tab, indent + tab));
                    tmp = tmp.nextSibling;
                }
                
                if (!tmpNodeValue || tmpNodeName != '#text'){
                	result.push(indent);
                }
                result.push('</' + node.nodeName + '>\n');
            } else {
                result.push('/>\n');
            }
        }
    }
    return result.join('');
};
		
function onInit(editor) {
	// Defines a new action to switch between
	// XML and graphical display
	var xmlNode = document.getElementById('xml');
	var textNode = document.getElementById('xmlContent');
	var graphNode = editor.graph.container;
	var sourceInput = document.getElementById('source');
	sourceInput.checked = false;

	var funct = function(editor)
	{
		if (sourceInput.checked)
		{
			graphNode.style.display = 'none';
			xmlNode.style.display = 'inline';
			
			var enc = new mxCodec();
			var node = enc.encode(editor.graph.getModel());
			
			textNode.value = mxUtils.getPrettyXml(node);
			textNode.originalValue = textNode.value;
			textNode.focus();
		}
		else
		{
			graphNode.style.display = '';
			
			if (textNode.value != textNode.originalValue)
			{
				var doc = mxUtils.parseXml(textNode.value);
				var dec = new mxCodec(doc);
				dec.decode(doc.documentElement, editor.graph.getModel());
			}

			textNode.originalValue = null;
			
			// Makes sure nothing is selected in IE
			if (mxClient.IS_IE)
			{
				mxUtils.clearSelection();
			}

			xmlNode.style.display = 'none';

			// Moves the focus back to the graph
			textNode.blur();
			editor.graph.container.focus();
		}
	};
	
	editor.addAction('switchView', funct);
	
	editor.dblClickAction = 'showProperties';
	
	// 点击checkbox切换模式(XML编辑模式或图形编辑模式)
	mxEvent.addListener(sourceInput, 'click', function()
	{
		editor.execute('switchView');
	});
}
		
/*mxEditor.prototype.showProperties = function(cell) {
	cell = cell || this.graph.getSelectionCell();
	if (cell == null) {
	    cell = this.graph.getCurrentRoot();
	    if (cell == null) {
	        cell = this.graph.getModel().getRoot();
	    }
	}
	if (cell != null) {
	    this.graph.stopEditing(true);
	    var offset = mxUtils.getOffset(this.graph.container);
	    var x = offset.x + 10;
	    var y = offset.y;
	    if (this.properties != null && !this.movePropertiesDialog) {
	        x = this.properties.getX();
	        y = this.properties.getY();
	    } else {
	        var bounds = this.graph.getCellBounds(cell);
	        if (bounds != null) {
	            x += bounds.x + Math.min(200, bounds.width);
	            y += bounds.y;
	        }
	    }
	    this.hideProperties();
	    var node = document.createElement('div');
	    
	    // ajax加载页面
	    var onload = function(req){
			node.innerHTML = req.getText();
			if (node != null) {
	            this.properties = new mxWindow(mxResources.get(this.propertiesResource) || this.propertiesResource, node, x, y, this.propertiesWidth, this.propertiesHeight, false);
	            this.properties.setVisible(true);
	        }
		};
		
		var onerror = function(req){
		};
		// This code can replace multiple textareas with encoded graphs
		mxUtils.get("page/node.html", onload, onerror);
	}
};*/
		
mxEditor.prototype.createProperties = function(cell) {
    var model = this.graph.getModel();
    var value = model.getValue(cell);
    var nodeList = value.childNodes;
    for (var i=0;i<nodeList.length;i++){
    	var node = nodeList[i];
    	if (mxUtils.isNode(node)){
    		alert(node.textContent);
    	}
    }
    if (mxUtils.isNode(value)) {
        var form = new mxForm('properties');
        var id = form.addText('ID', cell.getId());
        id.setAttribute('readonly', 'true');
        var geo = null;
        var yField = null;
        var xField = null;
        var widthField = null;
        var heightField = null;
        if (model.isVertex(cell)) {
            geo = model.getGeometry(cell);
            if (geo != null) {
                yField = form.addText('top', geo.y);
                xField = form.addText('left', geo.x);
                widthField = form.addText('width', geo.width);
                heightField = form.addText('height', geo.height);
            }
        }
        var tmp = model.getStyle(cell);
        var style = form.addText('Style', tmp || '');
        var attrs = value.attributes;
        var texts = [];
        for (var i = 0; i < attrs.length; i++) {
            var val = attrs[i].nodeValue;
            texts[i] = form.addTextarea(attrs[i].nodeName, val, (attrs[i].nodeName == 'label') ? 4 : 2);
        }
        var okFunction = mxUtils.bind(this,
        function() {
            this.hideProperties();
            model.beginUpdate();
            try {
                if (geo != null) {
                    geo = geo.clone();
                    geo.x = parseFloat(xField.value);
                    geo.y = parseFloat(yField.value);
                    geo.width = parseFloat(widthField.value);
                    geo.height = parseFloat(heightField.value);
                    model.setGeometry(cell, geo);
                }
                if (style.value.length > 0) {
                    model.setStyle(cell, style.value);
                } else {
                    model.setStyle(cell, null);
                }
                for (var i = 0; i < attrs.length; i++) {
                    var edit = new mxCellAttributeChange(cell, attrs[i].nodeName, texts[i].value);
                    model.execute(edit);
                }
                if (this.graph.isAutoSizeCell(cell)) {
                    this.graph.updateCellSize(cell);
                }
            } finally {
                model.endUpdate();
            }
        });
        var cancelFunction = mxUtils.bind(this,
        function() {
            this.hideProperties();
        });
        form.addButtons(okFunction, cancelFunction);
        return form.table;
    }
    return null;
};

window.onbeforeunload = function() { return mxResources.get('changesLost'); };