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
		alert("About to submit: " + queryString);
	}
	function showReponse(responseText, statusText) {
		
	}
	
	// 注意URL变化
	// index form
	$('#indexForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		type: 'get',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// view form
	$('#viewForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi/1" />',
		type: 'get',
		dataType: null,
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
	$('#createForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		type: 'post',
		dataType: null,
		clearForm: true,
		resetForm: true,
		timeout:3000
	});
	
	// update form, 将post转为put方式提交
	$('#updateForm').ajaxForm({
		beforeSubmit: showRequest,
		success: showReponse,
		url: '<c:url value="/process_defi" />',
		data: {"id": "1", "name":"myName", "xml":"myXml"}, // 提交json
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
			
			<h3>To Create</h3>
			<ul>
				<li>
					<form id="createForm" class="createForm" action="">
						<input id="createFormSubmit" type="submit" value="To Create" />
						<div><input type="text" name="name"/></div>
						<div>
						<textarea name="xml">
						</textarea>
						</div>
					</form>
				</li>
			</ul>
			
			<h3>To Update</h3>
			<ul>
				<li>
					<form id="updateForm" class="updateForm" action="">
						<input id="updateFormSubmit" type="submit" value="To Update" />
						<!-- 生成一个hidden的_method=put,并于web.xml中的HiddenHttpMethodFilter配合使用，在服务端将post请求改为put请求 -->
						<input type="hidden" name="_method" value="put"/>
						<!--  
						<div><input type="text" name="name"/></div>
						<div>
						<textarea name="xml">
						</textarea>
						</div>
						-->
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
		</div>
	</div>
</body>
</html>