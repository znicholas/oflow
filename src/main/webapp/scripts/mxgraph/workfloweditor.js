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
	
	// 动态生成属性表格
    $("#propgrid").ligerGrid({
        columns: [
        	{ display: '属性名称', name: 'label', minWidth : 80},
        	{ display: '属性值', name: 'value', minWidth : 102, editor: { 
        		type: 'auto'
        	}},
        	{ display: '', name: '', width:5}
        ],
        enabledEdit: true, 
        isScroll: false,
        rownumbers:false,
        usePager: false, 
        width: '100%',
        onAfterEdit: function(e){ // 动态绑定事件
	    	var cell = $("#propgrid").data("selectedCell");
	    	// 编辑后更新流程图
	    	editor.hideProperties();
	    	var model = editor.graph.model;
	    	model.beginUpdate();
	    	var edit = null;
	        try {
	        	// 值为一般字符串
				edit = new mxCellAttributeChange(cell, e.record.name, e.record.value);
	        	
	            model.execute(edit);
	            
	            if (editor.graph.isAutoSizeCell(cell)) {
	            	editor.graph.updateCellSize(cell);
	            }
	        } finally {
	            model.endUpdate();
	        }
	    }
    });
    
    $(window).trigger("resize.grid");
	
	// 点击checkbox切换模式(XML编辑模式或图形编辑模式)
	mxEvent.addListener(sourceInput, 'click', function()
	{
		editor.execute('switchView');
	});
}

/**
 * 重载双击事件处理
 * @param graph
 */
mxEditor.prototype.installDblClickHandler = function(graph) {
	graph.addListener(mxEvent.DOUBLE_CLICK, mxUtils.bind(this,
	function(sender, evt) {
		var cell = evt.getProperty('cell');
		cell = cell || this.graph.getSelectionCell();
		if (cell == null) {
		    cell = this.graph.getCurrentRoot();
		    if (cell == null) {
		        cell = this.graph.getModel().getRoot();
		    }
		}
		
		if (cell != null && graph.isEnabled() && this.dblClickAction != null) {
			this.execute(this.dblClickAction, cell);
			evt.consume();
		}
	}));
};

mxEditor.prototype.showProperties = function(cell) {
	var datas = { Rows: getColumnDatas(this, cell), Total: 3};
	
	var manager = $("#propgrid").ligerGetGridManager();
	$("#propgrid").data("selectedCell", cell);
	
    manager.loadData(datas);

    $(window).trigger("resize.grid");
};

/**
 * 获取列数据
 */
function getColumnDatas(editor, cell){
	var rtn = [];
	var model = editor.graph.getModel();
    
	var value = model.getValue(cell);
	if (!value) {
		return rtn;
	}
	
    var nodeList = value.childNodes;
    for (var i=0;i<nodeList.length;i++){
    	var node = nodeList[i];
    	if (mxUtils.isNode(node)){
    		alert(node.textContent);
    	}
    }
    
    if (mxUtils.isNode(value)) {
    	// 基本图形属性
	    if (model.isVertex(cell)) {
	        geo = model.getGeometry(cell);
	        if (geo != null) {
	        	rtn.push({ "label": "top", "name": "top", "value": geo.y, "type": "int"});
	        	rtn.push({ "label": "left", "name": "left", "value": geo.x, "type": "int"});
	        	rtn.push({ "label": "width", "name": "width", "value": geo.width, "type": "int"});
	        	rtn.push({ "label": "height", "name": "height", "value": geo.height, "type": "int"});
	        }
	    }
    }
    
    // 扩展属性
    var tmp = model.getStyle(cell);
    rtn.push({ "label":"style", "name": "style", "value": tmp || '', "type": "text"});
    
    var attrs = value.attributes;
   
    for (var i = 0; i < attrs.length; i++) {
        var val = attrs[i].nodeValue;
		
        try {
			eval("val=" + val);
			if ("function" == typeof(val)) { // 为function时执行
				val = val();
				attrs[i].nodeValue = val;
			}
		} catch (e) {
		}	
        
        
    	var config = { "label":attrs[i].nodeName,  "name": attrs[i].nodeName, "value": val ? val:''};
    	
    	if (editor.attrEditors[attrs[i].nodeName]) {
    		$.extend(config, editor.attrEditors[attrs[i].nodeName]);
    	}
    	
    	rtn.push(config);
    }
    
	return rtn;
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

//重载mxToolbar方法
/*mxToolbar.prototype.addMode = function(title, icon, funct, pressedIcon, style) {
	var div = document.createElement('div');
	var text = document.createTextNode(title);
	div.className = 'l-editor-accordion-item';
	
	var img = document.createElement((icon != null) ? 'img': 'button');
	img.initialClassName = style || 'mxToolbarMode';
	img.className = img.initialClassName;
	img.setAttribute('src', icon);
	img.altIcon = pressedIcon;
	if (title != null) {
		img.setAttribute('title', title);
	}
	img.setAttribute('align', 'absmiddle'); //设置图片垂直居中
	if (this.enabled) {
		mxEvent.addListener(img, 'click', mxUtils.bind(this,
		function(evt) {
			this.selectMode(img, funct);
			this.noReset = false;
		}));
		mxEvent.addListener(img, 'dblclick', mxUtils.bind(this,
		function(evt) {
			this.selectMode(img, funct);
			this.noReset = true;
		}));
		if (this.defaultMode == null) {
			this.defaultMode = img;
			this.selectedMode = img;
			var tmp = img.altIcon;
			if (tmp != null) {
				img.altIcon = img.getAttribute('src');
				img.setAttribute('src', tmp);
			} else {
				img.className = img.initialClassName + 'Selected';
			}
		}
	}
	div.appendChild(img);
	div.appendChild(text);
	this.container.appendChild(div);
	return div;
};*/

window.onbeforeunload = function() { return mxResources.get('changesLost'); };