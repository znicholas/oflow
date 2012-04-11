package com.yunbo.oflow.controller;

import java.util.List;

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

@Controller
@RequestMapping("/process_defi")
public class ProcessDefinitionController extends BaseRestJsonSpringController<ProcessDefinitionEntity, java.lang.Long> {

	@RequestMapping(value = "/test")
	public ModelAndView test() {
		return new ModelAndView("/process_defi/test");
	}

	@Override
	public ModelAndView index(ProcessDefinitionEntity model) {
		System.out.println("toIndex");
		return new ModelAndView("/process_defi/list");
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity view(Long id) throws Exception {
		System.out.println("toView");
		ProcessDefinitionEntity entity = new ProcessDefinitionEntity();
		entity.setName("myName");
		entity.setXml("myXml");

		return entity;
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity edit(Long id) throws Exception {
		System.out.println("toEdit");
		ProcessDefinitionEntity entity = new ProcessDefinitionEntity();
		entity.setName("myName");
		entity.setXml("myXml");

		return entity;
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity _new(ProcessDefinitionEntity model) throws Exception {
		System.out.println("toNew");
		ProcessDefinitionEntity entity = new ProcessDefinitionEntity();
		entity.setName("myName");
		entity.setXml("myXml");

		return model;
	}

	@Override
	public @ResponseBody
	ProcessDefinitionEntity save(ProcessDefinitionEntity model) throws Exception {
		System.out.println("toSave");
		System.out.println("Name-> " + model.getName());
		System.out.println("XML-> " + model.getXml());

		return model;
	}

	@Override
	public String delete(@PathVariable Long id) {
		System.out.println("toDelete");
		System.out.println("ID-> " + id);
		return "success";
	}

	@Override
	public String batchDelete(@RequestParam("ids") Long[] items) {
		System.out.println("toBatchDelete");
		for (int i = 0; i < items.length; i++) {
			System.out.println("ID-> " + items[i]);
		}
		return "success";
	}

	@Override
	public @ResponseBody
	Pager<ProcessDefinitionEntity> query(
			@RequestParam @JsonFormat(contentType = Expression.class) List<Expression> exps) {
		for (Expression expression : exps) {
			System.out.println(expression.getName() + expression.getOperator() + expression.getValue());
		}

		Pager<ProcessDefinitionEntity> pager = new Pager<ProcessDefinitionEntity>();
		return pager;
	}
}
