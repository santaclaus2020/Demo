//
//  Reader.h
//  Hierarchy
//
//  Created by Rusmin Susanto on 19/11/20.
//  Copyright © 2020 Rusmin Susanto. All rights reserved.
//

#ifndef Reader_h
#define Reader_h

#include <string>

// Abstract class that
class ReaderHandler
{
public:
	ReaderHandler() = default;
	virtual ~ReaderHandler() = default;

	virtual void handleNewEmployee(int id, int managerId, const std::string& name) = 0;
};

class Reader
{
public:
	Reader() = default;
	virtual ~Reader() = default;

	void parseEmployeeData(std::string& line, ReaderHandler* handler);
};

#endif /* Reader_h */
