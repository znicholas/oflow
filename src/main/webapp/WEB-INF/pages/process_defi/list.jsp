<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>分页的demo</title>
<link
	href="${pageContext.request.contextPath}/script/ligerUI/skins/ligerui.css"
	rel="stylesheet" type="text/css" />
<link
	href="${pageContext.request.contextPath}/script/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css" />
<link
	href="${pageContext.request.contextPath}/script/ligerUI/skins/ligerui-icons.css"
	rel="stylesheet" type="text/css" />
<script
	src="${pageContext.request.contextPath}/script/jquery/jquery-1.5.2.min.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/script/ligerUI/js/core/base.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/script/ligerUI/js/plugins/ligerDialog.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/script/ligerUI/js/plugins/ligerToolBar.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/script/ligerUI/js/plugins/ligerWindow.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/script/ligerUI/js/plugins/ligerGrid.js"
	type="text/javascript"></script>
<script type="text/javascript">
	var grid = null;
	var manager = null;
	$(function() {
		//表单的操作	    		
		$("#toptoolbar").ligerToolBar({
			items : [ 
			{text : '增加',click : doAdd,icon : 'add'},
			{line : true}, 
			{text : '修改',click : change}, 
			{line : true}, {text : '删除',click : change}
			]
		});

		grid = $("#maingrid").ligerGrid({
			url : "",//配置url地址
			columns : [
				{display : 'ID',name : 'id',align : 'left',width : 0,hide : 1}, 
				{display : '名称',name : 'name',minWidth : 90} 
			],
			showTableToggleBtn : true,
			rownumbers : true,
			parms : [ {
				name : "name",
				value : $("#txtKey").val()
			} ]
		});
		manager = $("#maingrid").ligerGetGridManager(); //装载
	});
	//format的写法
	function format(row, i) {
		var state = row.state;
		var tenId = row.name;
		manager.loadServerData();//重新加载 
	}

	function f_search() {
		var parms = [ {
			name : "tenementName",
			value : $("#txtKey").val()
		} ];
		manager.loadServerData(parms);

	}

	function doAdd() {
		$.ligerWindow.show({
			url : '',
			width : 700,
			height : 400,
			title : "添加"
		});
	}

	function change() {
		$.ligerWindow.show({
			url : "",
			width : 400,
			height : 300,
			title : "删除"
		});
	}
</script>
</head>
<body>
	<div id="toptoolbar"></div>
	<div id="searchbar">
		&nbsp;名称：<input id="txtKey" type="text" value="" name="name" />
		<input id="btnOK" type="button" value="查询" onclick="f_search()" />
	</div>
	<div id="maingrid" style="margin: 0; padding: 0"></div>
</body>
</html>