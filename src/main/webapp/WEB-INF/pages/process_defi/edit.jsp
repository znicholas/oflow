<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <script type="text/javascript">
        $(function () {
        	 var contextPath = '<c:url value="/" />';
        	
        	 doInit(); // 初始化数据
        	
        	 $.metadata.setType("attr", "validate");
             var v = $("#processdefiForm").validate({
                 //调试状态，不会提交数据的
                 //debug: true,
                 errorLabelContainer: "#errorLabelContainer", wrapper: "li",
                 invalidHandler: function (form, validator) {
                     $("#errorLabelContainer").show();
                     setTimeout(function () {
                         $.ligerDialog.tip({ content: $("#errorLabelContainer").html() });
                     }, 10);
                 }
             });
             // 渲染表单
             $("#processdefiForm").ligerForm();
        	
        	function doReturn(item)
    	    {
        		f_reloadTab(contextPath + '/process_defi');
    	    }
    	    
    		function showReponse(data, statusText) {
    			var d = $.ligerDialog.tip({ content: "保存成功"});
    			setTimeout(function () { d.close() }, 2000); // 2秒后自动关闭
    			$("#processdefiForm").dataToForm(data);
    		}
    		
    		// 初始化数据
    		function doInit(){
    			var id = '${id}';
    			if (id) {
    				$.ajax({ type: "POST", 
        				url: contextPath + 'process_defi/' + id,
        				async: false, // 非异步请求
            			contentType: "application/json", 
            			dataType: "json", 
            			success: function(data) { 
            				$("#processdefiForm").dataToForm(data);
            			}, 
            			error: function(xhr) { 
            				alert(xhr.responseText);
            			}
            		});
    			}
    		}
    		
    		// 保存
    	    function doSave(item){
    	    	if (v.form()){
    	    		// ajax表单提交
           	    	$("#processdefiForm").ajaxForm({
           	    		success: showReponse,
           	    		url: contextPath + 'process_defi/',
           	    		type: 'post',
           	    		dataType: 'json',
           	    		clearForm: false,
           	    		resetForm: false,
           	    		timeout:10000 //10秒后终止提交
           	    	});
    	    		
    	    		$("#processdefiForm").submit();
    	    	}
    	    }
        	
            $("#toptoolbar").ligerToolBar({ items: [
            	{text: '保存', click: doSave, icon:'save'},
            	{line:true},
            	{text: '返回', click: doReturn, icon:'back'}
            ]
            });
        });  
    </script>
    <style type="text/css">
        #processdefiForm{font-size:12px;}
        .l-table-edit {}
        .l-table-edit-td{padding:4px;}
        .l-button-submit,.l-button-test{width:80px; float:left; margin-left:10px; padding-bottom:2px;}
        .l-verify-tip{ left:230px; top:120px;}
        #errorLabelContainer{ padding:10px; width:300px; border:1px solid #FF4466; display:none; background:#FFEEEE; color:Red;}
    </style>
</head>

<form name="processdefiForm" id="processdefiForm" method="post">
	<!-- 工具条 -->
	<div id="toptoolbar"></div>
	<div id="errorLabelContainer">
	</div>
	<!-- 流程ID -->
	<input name="id" type="hidden" id="processdefiId" />
	<table cellpadding="0" cellspacing="0" class="l-table-edit" width="100%">
	    <tr>
	        <td align="left" class="l-table-edit-td">流程名称:</td>
	        <td align="left" class="l-table-edit-td" valign="top">流程版本:</td>
	    </tr>
	   
	    <tr>
	        <td align="left" class="l-table-edit-td">
	        	<input name="name" type="text" id="processdefiName" ltype="text" validate="{required:true,minlength:3,maxlength:10}" />
	        </td>
	        <td align="left" class="l-table-edit-td">
	            <input name="version" type="text" id="processdefiVersion" ltype="text" readonly="readonly"/>
	        </td>
	    </tr>
	</table>
	<br />
</form>
<div style="display:none">
<!--  数据统计代码 -->
</div>