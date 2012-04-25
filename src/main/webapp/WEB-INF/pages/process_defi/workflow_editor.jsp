<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>oFlow流程编辑器</title>

<link href="<c:url value="/scripts/ligerUI/skins/Aqua/css/ligerui-all.css" />" rel="stylesheet" type="text/css" />
<link href="<c:url value="/styles/index.css" />" rel="stylesheet" type="text/css" />
<link href="<c:url value="/styles/process_defi/workflow_editor.css" />" rel="stylesheet" type="text/css" />
<script src="<c:url value="/scripts/jquery/jquery-1.5.2.min.js" />" type="text/javascript"></script>    
<script src="<c:url value="/scripts/ligerUI/js/ligerui.all.js" />" type="text/javascript"></script>

<!-- mxgraph -->
<script type="text/javascript">
	contextPath = '<c:url value="/" />';
	mxBasePath = '<c:url value="/scripts/mxgraph" />';
</script>
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/mxClient.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/mxUtils.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/mxConstants.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/mxOther.js" />"></script>

<script type="text/javascript" src="<c:url value="/scripts/oflow/oflow.util.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/oflow/workflowdata.js" />"></script>

<script type="text/javascript">
var accordion = null;
$(function () {
	mxConnectionHandler.prototype.connectImage = new mxImage('<c:url value="/images/mxgraph/connector.gif" />', 16, 16);
	
	// 设置流程图容器
	var container = document.getElementById("container");
	container.style.overflow = 'hidden';
	container.style.background = 'url("<c:url value="/images/mxgraph/grid.gif" />")';
	
	// Workaround for Internet Explorer ignoring certain styles
	if (mxClient.IS_IE)
	{
		new mxDivResizer(container);
	}
	
	// Creates the model and the graph inside the container
	// using the fastest rendering available on the browser
	var model = new mxGraphModel();
	var graph = new mxGraph(container, model);

	// Enables new connections in the graph
	graph.setConnectable(true);
	graph.setMultigraph(false);

	// Stops editing on enter or escape keypress
	var keyHandler = new mxKeyHandler(graph);
	var rubberband = new mxRubberband(graph);
	
	// 新建activites toolbar
	var tbContainer = document.getElementById("editor_accordion_acts");
	var tbContainer2 = document.getElementById("copyright");
	tbContainer.style.overflow = 'hidden';
	var toolbar = new mxToolbar(tbContainer);
	tbContainer2.style.overflow = 'hidden';
	var toolbar2 = new mxToolbar(tbContainer2);
	toolbar.enabled = false
	
	var addVertex = function(title, icon, w, h, style)
	{
		var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
		vertex.setVertex(true);
	
		addToolbarItem(title, graph, toolbar, vertex, icon);
		//addToolbarItem(title, graph, toolbar2, vertex, icon);
	};
	addVertex('rectangle', '<c:url value="/images/mxgraph/editors/rectangle.gif" />', 100, 40, '');
	addVertex('rounded', '<c:url value="/images/mxgraph/editors/rounded.gif" />', 100, 40, 'shape=rounded');
	
	function addToolbarItem(title, graph, toolbar, prototype, image)
	{
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		var funct = function(graph, evt, cell)
		{
			graph.stopEditing(false);

			var pt = graph.getPointForEvent(evt);
			var vertex = graph.getModel().cloneCell(prototype);
			vertex.geometry.x = pt.x;
			vertex.geometry.y = pt.y;
				
			graph.addCell(vertex);
			graph.setSelectionCell(vertex);
		}

		// Creates the image which is used as the drag icon (preview)
		var img = toolbar.addMode(title, image, funct);
		mxUtils.makeDraggable(img, graph, funct);
	}
	
	//布局
	$("#editor_layout").ligerLayout({ 
		leftWidth: 190, 
		height: '100%', 
		heightDiff:-34,
		space:4, 
		onHeightChanged: f_heightChanged 
	});
	
	// 中间布局高度
	var height = $(".l-layout-center").height();
	
	//面板
    $("#editor_accordions").ligerAccordion({ 
    	height: height - 24, 
    	speed: null 
    });
	
    //树
    /*$("#tree1").ligerTree({
        data : activities,
        checkbox: false,
        slide: false,
        treeLine: false,
        nodeWidth: 120,
        attribute: ['id', 'nodename', 'url']
    });*/
	
    $(".l-link").hover(function () {
        $(this).addClass("l-link-over");
    }, function () {
        $(this).removeClass("l-link-over");
    });
    
    $(".l-editor-accordion-item").hover(function () {
    	$(this).addClass("l-editor-accordion-item-over");
	}, function () {
		$(this).removeClass("l-editor-accordion-item-over");
	});
	
    accordion = $("#editor_accordions").ligerGetAccordionManager();
    $("#pageloading").hide();
    
    $(document.body).disableSelection();
});

// 重载mxToolbar方法
mxToolbar.prototype.addMode = function(title, icon, funct, pressedIcon, style) {
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
};

function f_heightChanged(options) {
    if (accordion && options.middleHeight - 24 > 0)
        accordion.setHeight(options.middleHeight - 24);
}

</script>
</head>
<body style="padding:0px;background:#EAEEF5;">
<div id="pageloading"></div>
<!-- Header --> 
<div id="editor_layout" style="width:99.2%; margin:0 auto; margin-top:4px; ">
	<!-- 左边区域 -->
	<div position="left"  title="BPMN2.0" id="editor_accordions"> 
		<div id="editor_accordion_acts" title="Activities" class="l-scroll">
		</div>
		
		<div title="Gateways">
		<div style=" height:7px;"></div>
			<a class="l-link" href="">列表页面</a> 
			<a class="l-link" href="demos/dialog/win7.htm" target="_blank">模拟Window桌面</a> 
		</div>    
		
		<div title="Swimlanes">
		<div style=" height:7px;"></div>
			<a class="l-link" href="lab/generate/index.htm" target="_blank">表格表单设计器</a> 
		</div> 
	</div>
	<!-- 中间区域 -->
	<div position="center" id="framecenter">
		<!-- 流程图容器 -->
		<div id="container" style="height: 100%">
		</div> 
	</div>
	<!-- 右边区域 -->
	<div position="right"  title="Properties" id="prop_accordion">
	</div>
</div>
<div id="copyright" style="height:32px; line-height:32px; text-align:center;">
</div>
</body>
</html>