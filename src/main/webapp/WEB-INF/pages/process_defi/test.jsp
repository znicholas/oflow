<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="<c:url value="/scripts/jquery/jquery-1.5.2.min.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/jqueryform/jquery.form-2.8.js" />"></script>
<script type="text/javascript" src="<c:url value="/scripts/json2.js" />"></script>
<script>
$(document).ready(function() {
	MvcUtil = {};
	MvcUtil.showSuccessResponse = function (text, element) {
		MvcUtil.showResponse("success", text, element);
	};
	MvcUtil.showErrorResponse = function showErrorResponse(text, element) {
		MvcUtil.showResponse("error", text, element);
	};
	MvcUtil.showResponse = function(type, text, element) {
		var responseElementId = element.attr("id") + "Response";
		var responseElement = $("#" + responseElementId);
		if (responseElement.length == 0) {
			responseElement = $('<span id="' + responseElementId + '" class="' + type + '" style="display:none">' + text + '</span>').insertAfter(element);
		} else {
			responseElement.replaceWith('<span id="' + responseElementId + '" class="' + type + '" style="display:none">' + text + '</span>');
			responseElement = $("#" + responseElementId);
		}
		responseElement.fadeIn("slow");
	};
	MvcUtil.xmlencode = function(xml) {
		//for IE 
		var text;
		if (window.ActiveXObject) {
		    text = xml.xml;
		 }
		// for Mozilla, Firefox, Opera, etc.
		else {
		   text = (new XMLSerializer()).serializeToString(xml);
		}			
		    return text.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;')
	        .replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;');
	};
	
	function showRequest(formData, jqForm, options){
		var queryString = $.param(formData);
		//alert("About to submit: " + queryString);
	}
	function showReponse(responseText, statusText) {
		alert(JSON.stringify(responseText));
	}
	
	// 注意URL变化
	// index form
	$('#indexForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		type: 'get',
		dataType: null, // 数据类型
		clearForm: true, // 清空表单
		resetForm: true, // 重置表单
		timeout:3000 // 请求超时时间,单位(毫秒)
	});
	
	// view form
	$('#viewForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/1" />',
		type: 'get',
		dataType: 'json',
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// edit form
	$('#editForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/1/edit" />',
		type: 'get',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// new form
	$('#newForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/new" />',
		type: 'get',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// create form(url与index form相同), 以post方式提交
	$('#saveForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		type: 'post',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// delete form, 将post转为delete方式提交
	$('#deleteForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/1" />',
		type: 'post',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// batch delete form, 将post转为delete方式提交
	$('#batchDeleteForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		type: 'post',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// query form, data为查询条件
	// ?exps={"name":"sss","operator":"=","value":"xxx"},{"name":"sss","operator":"=","value":"xxx"}
	$('#queryForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/query" />',
		type: 'get',
		data: {exps:'[{"name":"sss","operator":"=","value":"xxx"},{"name":"sss","operator":"=","value":"xxx"}]'},
		dataType: 'json',
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
});
</script>
<title>测试页面</title>
</head>
<body>
	<div id="messageconverters">
		<h2>ProcessDefinitionController测试</h2>
		<p>
			查看 <code> com.yunbo.oflow.controller.ProcessDefinitionController</code>类
		</p>	
		<div id="stringMessageConverter">
			<h3>To Index</h3>
			<ul>
				<li>
					<form id="indexForm" class="textForm" action="">
						<input id="indexFormSubmit" type="submit" value="To Index" />
					</form>
				</li>
			</ul>
			
			<h3>To View</h3>
			<ul>
				<li>
					<form id="viewForm" action="">
						<input id="viewFormSubmit" type="submit" value="To View" />		
					</form>
				</li>
			</ul>
			
			<h3>To Edit</h3>
			<ul>
				<li>
					<form id="editForm" class="editForm" action="">
						<input id="editFormSubmit" type="submit" value="To Edit" />		
					</form>
				</li>
			</ul>
			
			<h3>To New</h3>
			<ul>
				<li>
					<form id="newForm" class="newForm" action="">
						<input id="newFormSubmit" type="submit" value="To New" />		
					</form>
				</li>
			</ul>
			
			<h3>To Save</h3>
			<ul>
				<li>
					<form id="saveForm" class="saveForm" action="">
						<input id="saveFormSubmit" type="submit" value="To Save" />
						<div><input type="text" name="name"/></div>
						<div>
						<textarea name="xml">
						</textarea>
						</div>
					</form>
				</li>
			</ul>
			
			<h3>To Delete</h3>
			<ul>
				<li>
					<form id="deleteForm" class="deleteForm" action="">
						<input id="deleteFormSubmit" type="submit" value="To Delete" />
						<!-- 生成一个hidden的_method=put,并于web.xml中的HiddenHttpMethodFilter配合使用，在服务端将post请求改为delete请求 -->
						<input type="hidden" name="_method" value="delete"/>
					</form>
				</li>
			</ul>
			
			<h3>To Batch Delete</h3>
			<ul>
				<li>
					<form id="batchDeleteForm" class="batchDeleteForm" action="">
						<input id="batchDeleteFormSubmit" type="submit" value="To Batch Delete" />
						<!-- 生成一个hidden的_method=put,并于web.xml中的HiddenHttpMethodFilter配合使用，在服务端将post请求改为delete请求 -->
						<input type="hidden" name="_method" value="delete"/>
						<input type="hidden" name="ids" value="1"/>
						<input type="hidden" name="ids" value="2"/>
					</form>
				</li>
			</ul>
			
			<h3>To Query</h3>
			<ul>
				<li>
					<form id="queryForm" class="queryForm" action="">
						<input id="queryFormSubmit" type="submit" value="To Query" />
					</form>
				</li>
			</ul>
		</div>
	</div>
</body>
</html>