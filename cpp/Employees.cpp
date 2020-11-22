//
//  Employees.cpp
//  Hierarchy
//
//  Created by Rusmin Susanto on 19/11/20.
//  Copyright © 2020 Rusmin Susanto. All rights reserved.
//

#include "Employees.h"

#include <algorithm>
#include <iostream>

Employees::~Employees()
{
	for (auto it = m_employees.begin(); it != m_employees.end(); it++)
		delete it->second;
}

void Employees::addEmployee(int id, int managerId, const std::string& name)
{
	m_employees[id] = new Employee(id, managerId, name);
}

void Employees::buildRelationship()
{
	for (auto it = m_employees.begin(); it != m_employees.end(); it++)
	{
		Employee* emp = it->second;

		// This employee has no manager.
		if (emp->managerId == -1)
			continue;

		auto managerIt = m_employees.find(emp->managerId);

		// Need to check, in case the manager id is invalid (the manager is not a valid employee).
		if (managerIt != m_employees.end())
		{
			Employee* manager = managerIt->second;
			emp->manager = manager;

			// Add the current employee as child of the parent
			manager->directReports.push_back(emp);
		}
		else
		{
			// This means the manager of this employee doesn't exist (not a valid employee)
			m_employeeWithNoManager.push_back(emp->id);
		}
	}
}

void Employees::print()
{
	// Print all, starting with root.
	// First, find root (those with managerId -1)
	auto it = std::find_if(m_employees.begin(), m_employees.end(), [](const std::pair<int, Employee*>& e)
						   { return e.second->managerId == -1; });

	if (it != m_employees.end())
		print(it->second, 0);

	// Then print those with invalid manager
	if (! m_employeeWithNoManager.empty())
	{
		std::cout<<"The following employee(s) have a manager who is not a valid employee."<<std::endl;
		for(int i : m_employeeWithNoManager)
			std::cout<<m_employees.find(i)->second->name<<std::endl;
	}
}

Employee* Employees::findEmployee(int id)
{
	auto it = m_employees.find(id);

	if (it != m_employees.end())
		return it->second;

	return nullptr;
}

void Employees::handleNewEmployee(int id, int managerId, const std::string& name)
{
	addEmployee(id, managerId, name);
}

void Employees::print(Employee* root, int level)
{
	if (! root)
		return;

	// Write the indent
	for(int i = 0; i < level; i++)
		std::cout<<"\t";

	// Write the name
	std::cout<<root->name<<std::endl;

	for (Employee* emp : root->directReports)
		print(emp, level + 1);
}
