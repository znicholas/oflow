<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>oFlow流程编辑器</title>

<link href="<c:url value="/scripts/ligerUI/skins/Aqua/css/ligerui-all.css" />" rel="stylesheet" type="text/css" />
<link href="<c:url value="/scripts/ligerUI/skins/Aqua/css/ligerui-layout.css" />" rel="stylesheet" type="text/css" />
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

<!-- workflow editor -->
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/mxApplication.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/mxgraph/workfloweditor.js" />"></script>

<script type="text/javascript" src="<c:url value="/scripts/oflow/oflow.util.js" />"></script>

<!-- 设置流程编辑器画布 -->
<style type="text/css" media="screen">
div.base {
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	font-family: Arial;
	font-size: 8pt;
}
div.base#graph {
	border-style: solid;
	border-color: #F2F2F2;
	border-width: 1px;
	background: url('<c:url value="/scripts/mxgraph/images/grid.gif" />');
}
</style>

<script type="text/javascript">
var accordion = null;
$(function () {
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
    
    // 初始化流程编辑器
    new mxApplication(mxBasePath + '/config/workfloweditor.xml');
});

// 重载mxToolbar方法
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
		<div id="graph" class="base">
		<!-- Graph Here -->
		</div>
		<div id="xml" class="base" style="left:0px;right:0px;top:0px;bottom:40px;display:none;">
			<textarea id="xmlContent" style="height:100%;width:100%;"></textarea>
		</div>
		<div class="base" align="right" style="width:100%;height:20px;bottom:0px;right:40px;">
			<input id="source" type="checkbox" />&nbsp;Source
		</div>
		<div id="status" class="base" align="right">
			<!-- Status Here -->
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