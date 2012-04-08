package com.yunbo.oflow.service;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.yunbo.obase.core.dao.Expression;
import com.yunbo.oflow.model.ProcessDefinitionEntity;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class ProcessDefinitionServiceTest {

	@Autowired
	private ProcessDefinitionService service;

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
		List<Expression> exps = new ArrayList<Expression>();
		List<ProcessDefinitionEntity> list = service.query(exps);
		for (ProcessDefinitionEntity processDefinitionEntity : list) {
			service.remove(processDefinitionEntity);
		}
	}

	@Test
	public void testQueryListOfExpression() {
		ProcessDefinitionEntity entity = new ProcessDefinitionEntity();
		entity.setName("myflow");
		entity.setXml("myflowXML");

		service.save(entity);

		assertTrue(true);
	}

}
