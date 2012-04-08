package com.yunbo.oflow.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yunbo.obase.core.dao.EntityDao;
import com.yunbo.obase.core.service.BaseReousrceService;
import com.yunbo.oflow.dao.PrcoessDefinitionDao;
import com.yunbo.oflow.model.ProcessDefinitionEntity;
import com.yunbo.oflow.service.ProcessDefinitionService;

@Service
public class ProcessDefinitionServiceImpl extends BaseReousrceService<ProcessDefinitionEntity> implements
		ProcessDefinitionService {
	@Autowired
	private PrcoessDefinitionDao dao;

	@Override
	public EntityDao<ProcessDefinitionEntity> getDao() {
		return dao;
	}

}
