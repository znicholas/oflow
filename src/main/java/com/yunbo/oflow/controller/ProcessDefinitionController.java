package com.yunbo.oflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.yunbo.obase.core.controller.BaseRestJsonSpringController;
import com.yunbo.obase.core.controller.format.JsonFormat;
import com.yunbo.obase.core.dao.Expression;
import com.yunbo.obase.core.dao.Pager;
import com.yunbo.oflow.model.ProcessDefinitionEntity;
import com.yunbo.oflow.service.ProcessDefinitionService;

@Controller
@RequestMapping("/process_defi")
public class ProcessDefinitionController extends
		BaseRestJsonSpringController<ProcessDefinitionEntity, java.lang.Long> {
	@Autowired
	ProcessDefinitionService service;

	@RequestMapping(value = "/test")
	public ModelAndView test() {
		return new ModelAndView("/process_defi/test");
	}

	@RequestMapping(value = "/editor")
	public ModelAndView editor() {
		return new ModelAndView("/process_defi/workflow_editor");
	}

	@Override
	public ModelAndView index(ProcessDefinitionEntity model) {
		return new ModelAndView("/process_defi/list");
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity view(@PathVariable Long id) throws Exception {
		ProcessDefinitionEntity entity = service.find(id);
		return entity;
	}

	/**
	 * 跳转到Edit页面
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/{id}/edit")
	public @ResponseBody
	ModelAndView toEdit(@PathVariable Long id) throws Exception {
		return new ModelAndView("/process_defi/edit").addObject("id", id);
	}

	/**
	 * 跳转到空的编辑页面
	 */
	@Override
	public ModelAndView create() throws Exception {
		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity save(ProcessDefinitionEntity model)
			throws Exception {
		return service.save(model);
	}

	@Override
	public String delete(@PathVariable Long id) {
		boolean falg = service.removeById(id);
		if (falg)
			return "success";
		else
			return "input";
	}

	@Override
	@RequestMapping(value = "/delete")
	public String batchDelete(@RequestParam("ids") Long[] items) {
		System.out.println("toBatchDelete");
		try {
			service.removeByIds(items);
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "input";

	}

	@Override
	public @ResponseBody
	Pager<ProcessDefinitionEntity> query(
			@RequestParam @JsonFormat(contentType = Expression.class) List<Expression> exps,
			int pageNumber, int pageSize) {
		Pager<ProcessDefinitionEntity> pager = service.query(exps, pageNumber,
				pageSize);
		return pager;
	}
}
