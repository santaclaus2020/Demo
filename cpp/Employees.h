//
//  Employees.h
//  Hierarchy
//
//  Created by Rusmin Susanto on 19/11/20.
//  Copyright © 2020 Rusmin Susanto. All rights reserved.
//

#ifndef Employees_h
#define Employees_h

#include <map>
#include <string>
#include <vector>

#include "Reader.h"

struct Employee
{
	Employee(int empId, int empManagerId, const std::string& empName)
		: id(empId)
		, managerId(empManagerId)
		, name(empName)
		, manager(nullptr)
	{}

	int id;
	int managerId;
	std::string name;
	Employee* manager;
	std::vector<Employee*> directReports;
};

class Employees : public ReaderHandler
{
public:
	Employees() = default;
	virtual ~Employees();

	void addEmployee(int id, int managerId, const std::string& name);
	void buildRelationship();

	void print();

	Employee* findEmployee(int id);

	// ReaderHandler
	void handleNewEmployee(int id, int managerId, const std::string& name) override;

private:
	void print(Employee* root, int level);

	std::map<int, Employee*> m_employees;
	std::vector<int> m_employeeWithNoManager;
};

#endif /* Employees_h */
