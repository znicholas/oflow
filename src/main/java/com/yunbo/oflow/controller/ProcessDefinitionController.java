package com.yunbo.oflow.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.yunbo.obase.core.controller.BaseRestSpringController;
import com.yunbo.oflow.model.ProcessDefinitionEntity;

@Controller
@RequestMapping("/process_defi")
public class ProcessDefinitionController extends BaseRestSpringController<ProcessDefinitionEntity, java.lang.Long> {

	@RequestMapping(value = "/test")
	public ModelAndView test() {
		return new ModelAndView("/process_defi/test");
	}

	@Override
	public ModelAndView index(HttpServletRequest request, HttpServletResponse response, ProcessDefinitionEntity model) {
		System.out.println("toIndex");
		return new ModelAndView("/process_defi/list");
	}

	@Override
	public ModelAndView show(Long id) throws Exception {
		System.out.println("toView");
		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public ModelAndView edit(Long id) throws Exception {
		System.out.println("toEdit");
		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public ModelAndView _new(HttpServletRequest request, HttpServletResponse response, ProcessDefinitionEntity model)
			throws Exception {
		System.out.println("toNew");
		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public ModelAndView create(HttpServletRequest request, HttpServletResponse response, ProcessDefinitionEntity model)
			throws Exception {
		System.out.println("toCreate");
		System.out.println("Name-> " + model.getName());
		System.out.println("XML-> " + model.getXml());

		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public ModelAndView update(HttpServletRequest request, HttpServletResponse response, ProcessDefinitionEntity model)
			throws Exception {
		System.out.println("toUpdate");
		System.out.println("Id-> " + model.getId());
		System.out.println("Name-> " + model.getName());
		System.out.println("XML-> " + model.getXml());
		return new ModelAndView("/process_defi/edit");
	}

	@Override
	public ModelAndView delete(@PathVariable Long id) {
		System.out.println("toDelete");
		System.out.println("ID-> " + id);
		return new ModelAndView("/process_defi/list");
	}

	@Override
	public ModelAndView batchDelete(@RequestParam("ids") Long[] items) {
		System.out.println("toBatchDelete");
		for (int i = 0; i < items.length; i++) {
			System.out.println("ID-> " + items[i]);
		}
		return new ModelAndView("/process_defi/list");
	}
}
