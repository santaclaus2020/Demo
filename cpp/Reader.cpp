//
//  Reader.cpp
//  Hierarchy
//
//  Created by Rusmin Susanto on 19/11/20.
//  Copyright © 2020 Rusmin Susanto. All rights reserved.
//

#include "Reader.h"

#include <string>
#include <vector>
#include <sstream>

using namespace std;

void Reader::parseEmployeeData(std::string& line, ReaderHandler* handler)
{
	vector<string> tokens;
	stringstream streams(line);
	string subStr;

	// Tokenizing by comma
	while(getline(streams, subStr, ','))
	{
		// Ignore empty string
		if (!subStr.empty())
			tokens.push_back(subStr);
	}

	auto it = tokens.begin();
	string name;
	int id = 0;
	int managerId = -1;	// Initialise to -1 to indicate it has no manager

	for(int i = 0; i < 3; i++)
	{
		if (it != tokens.end())
		{
			switch (i)
			{
				case 0:		// Name
					name = *it;
					break;
				case 1:		// Employee id
					id = stoi(*it);
					break;
				case 2:		// Manager id
					managerId = stoi(*it);
					break;
			}
		}

		++it;
	}

	// If there is handler, notify it
	if (handler)
		handler->handleNewEmployee(id, managerId, name);
}
