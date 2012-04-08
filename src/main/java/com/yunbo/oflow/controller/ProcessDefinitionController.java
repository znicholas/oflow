package com.yunbo.oflow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.yunbo.obase.core.controller.BaseRestSpringController;
import com.yunbo.oflow.model.ProcessDefinitionEntity;

@Controller
@RequestMapping("/process_defi")
public class ProcessDefinitionController extends BaseRestSpringController<ProcessDefinitionEntity, java.lang.Long> {
	
	public ModelAndView test() {
		return new ModelAndView("/process_defi/test");
	}
}
