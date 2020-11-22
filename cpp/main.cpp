//
//  main.cpp
//  Hierarchy
//
//  Created by Rusmin Susanto on 19/11/20.
//  Copyright © 2020 Rusmin Susanto. All rights reserved.
//

#include <fstream>
#include <iostream>

#include "Employees.h"
#include "Reader.h"

using namespace std;

int main(int argc, const char * argv[])
{
	ifstream file;

	if (argc > 1)
	{
		file.open(argv[1]);

		if (file.fail())
		{
			cerr<<"Fail to open file! It may not exist or you don't have permission to open it"
				<<endl;
			return -1;
		}
	}
	else
	{
		cerr<<"Please enter an input file!"<<endl;
		cerr<<"Eg. Employee data.txt"<<endl;
	}

	istream& inputStream(file);
	string line;
	Reader reader;
	Employees employees;

    while (getline (inputStream, line))
		reader.parseEmployeeData(line, &employees);

	file.close();

//	employees.addEmployee(100, 150, "Alan");
//	employees.addEmployee(220, 100, "Martin");
//	employees.addEmployee(150, -1, "Jamie");
//	employees.addEmployee(275, 100, "Alex");
//	employees.addEmployee(400, 150, "Steve");
//	employees.addEmployee(190, 400, "David");
//
	// Build hierarchical relationship, manager - employee relationship
	employees.buildRelationship();

	employees.print();

	return 0;
}
