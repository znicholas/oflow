<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%><%@ taglib
	uri="http://java.sun.com/jsp/jstl/core" prefix="c"%><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>列表页面</title>
<link href="<c:url value="/scripts/ligerUI/skins/Aqua/css/ligerui-all.css" />" rel="stylesheet" type="text/css" />
<link href="<c:url value="/scripts/ligerUI/skins/Gray/css/all.css" />" rel="stylesheet" type="text/css" />
<link href="<c:url value="/scripts/ligerUI/skins/ligerui-icons.css" />" rel="stylesheet" type="text/css" />
<!-- 基础js -->
<script src="<c:url value="/scripts/jquery/jquery-1.5.2.min.js" />" type="text/javascript"></script>
<script src="<c:url value="/scripts/ligerUI/js/core/base.js" />" type="text/javascript"></script>
<!-- 组件js -->
<script src="<c:url value="/scripts/ligerUI/js/plugins/ligerGrid.js" />" type="text/javascript"></script>
<script src="<c:url value="/scripts/ligerUI/js/plugins/ligerToolBar.js" />" type="text/javascript"></script>
<script src="<c:url value="/scripts/ligerUI/js/plugins/ligerResizable.js" />" type="text/javascript"></script>
<script src="<c:url value="/scripts/ligerUI/js/plugins/ligerCheckBox.js" />" type="text/javascript"></script>

<script type="text/javascript">    	
	var contextPath = '<c:url value="/" />';        
	function doCreate(item) {           
		window.location = contextPath + 'process_defi/create';        
	}        
	function doEdit(item) {        	
		var data = g.getSelectedRow();        	
		if (data && data.id) {        		 
			window.location = contextPath + 'process_defi/'+data.id+'/edit';        	
		} else {				
			alert('请选择一条记录');        	
		}        
	}        
	function doRemove(item) {            
		alert(item.text);        
	}        
	function deleteRow(){            
		g.deleteSelectedRow();        
	}                
	$(function () {            
		window['g'] = $("#maingrid").ligerGrid({                
			height:'100%',                
			columns: [{ display: '流程ID', name: 'id', align: 'left', width: 100, minWidth: 60 },	                
			          { display: '流程名称', name: 'name', minWidth: 120 },	                
			          { display: '版本', name: 'version', minWidth: 140 }                
			],                 
			//data:CustomersData,                 
			url: contextPath + 'process_defi/query?exps=[]',                
			root: 'result', // 数据源字段名,默认Rows                
			record: 'recordCount',                
			pageParmName: 'pageNumber',                
			pagesizeParmName: 'pageSize',             
			pageSize:30,                 
			rownumbers:true,                
			toolbar: { items: [	                
				{ text: '增加', click: doCreate, icon: 'add' },	                
				{ line: true },	                
				{ text: '修改', click: doEdit, icon: 'modify' },	                
				{ line: true },	                
				{ text: '删除', click: doRemove, img: '<c:url value="/scripts/ligerUI/skins/icons/delete.gif" />' }                
			]                
		}            
		});                         
		$("#pageloading").hide();        
	});    
</script>
</head>
<body style="overflow-x: hidden; padding: 2px;">
	<div class="l-loading" style="display: block" id="pageloading"></div>
	<a class="l-button"
		style="width: 120px; float: left; margin-left: 10px; display: none;"
		onclick="deleteRow()">删除选择的行</a>
	<div class="l-clear"></div>
	<div id="maingrid"></div>
	<div style="display: none;"></div>
</body>
</html>