package com.yunbo.oflow.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yunbo.obase.core.util.PageRequestFactory;

@Controller
@RequestMapping("/")
public class IndexController {

	
	
	@RequestMapping("/indexData")
	public @ResponseBody
	List<Map<String, String>> getIndexData(HttpServletRequest request, HttpServletResponse response) {
		List<Map<String, String>> rtn = new ArrayList<Map<String, String>>();
		Map<String, String> item4 = new HashMap<String, String>();
		item4.put("text", "流程服务测试");
		item4.put("url", request.getContextPath() + "/process_defi/test");

		Map<String, String> item0 = new HashMap<String, String>();
		item0.put("text", "流程定制");
		item0.put("url", request.getContextPath() + "/process_defi/test");

		Map<String, String> item1 = new HashMap<String, String>();
		item1.put("text", "流程运行");
		item1.put("url", request.getContextPath() + "/flow_running.jsp");

		Map<String, String> item2 = new HashMap<String, String>();
		item2.put("text", "菜单列表");
		item2.put("url", request.getContextPath() + "/menu_list.jsp");

		rtn.add(item4);
		rtn.add(item0);
		rtn.add(item1);
		rtn.add(item2);

		return rtn;
	}

	@RequestMapping("/indexDataStr")
	public void getIndexDataStr(HttpServletRequest request, HttpServletResponse response) {
		String json = "[";
		json += "{ \"text\": \"流程定制\", \"url\":\"" + request.getContextPath() + "/process_defi/test\"}, ";
		json += "{ \"text\": \"流程运行\", \"url\":\"" + request.getContextPath() + "/flow_running.jsp\"},";
		json += "{ \"text\": \"菜单列表\", \"url\":\"" + request.getContextPath() + "/menu_list.jsp\"}";
		json += "]";

		try {
			response.setCharacterEncoding("UTF-8");
			response.setContentType("application/json;chart=UTF-8");
			response.getWriter().print(json);
			response.getWriter().close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
