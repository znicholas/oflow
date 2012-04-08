package com.yunbo.oflow.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.yunbo.obase.core.model.BaseEntity;

@Entity
@Table(name = "OFLOW_PROCESS_DEFINITION")
public class ProcessDefinitionEntity extends BaseEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 802732898815902642L;

	@Column(name = "NAME_", length = 50)
	private String name;

	@Lob
	@Column(name = "XML_")
	private String xml;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}
}
