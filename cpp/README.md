# Simple App to read and show hierarcy

**NOTE:**
This C++ version is not as complete as its NodeJS version. There is also no test for C++ version. I include this because I already did it before working on the NodeJS version.

The data is loaded and processed in 2 steps.

The first step is to read it from the tabular source (either file or inserted programmatically). At this stage, the data is loaded as it is and stored in a map. So, it is still in tabular format. The key is employee id, eg. 100, 150. The value is Employee struct

	struct Employee
	{
		int id;
		int managerId;
		std::string name;
		Employee* manager;
		std::vector<Employee*> directReports;
	};

In addition to managerId, each employee has a pointer to its manager. Each employee also has a vector of its direct reports. After stage 1 complete, for each employee record, the manager is still null and directReports vector is still empty. If an employee does not have a manager, its **managerId** is set to -1.

The second step is when we build the relationship. We iterate the data and build the "parent child" relationship. After this stage, every employee that has a manager should have its manager set. The directReports array should also be populated if the employee has at least one direct report.

So, the main data structure is a map.  It is kind of flat but we can find/search each employee record and its hierarchical relationship easily with much better complexity compared to tree traversal. I have implemented similar data structure in one of my past employment. I had to create an object graph to ensure any update/change in one node that affects other related nodes can be propagated efficiently. By structuring the data in this way (map + pointer to parent + vector of children), I managed to satisfy the requirement. This is the backbone of the UI refresh system, aggregate calculation and data analysis of the application. It is still widely used by hundred of thousands of users in production today.

Consider the following scenario where the proposed data structure is superior.
1. Finding any node/employee. If a node deep down in the hierarchy, it will take time to find it in a tree data structure (complexity is O(n)). With the proposed data structure here, the complexity is O(1)
2. Finding siblings of a node/employee. Again, like in scenario #1, we have to find the node first, find its parent and then find the child nodes of the parent. With the proposed data structure here, we only need to find the node. Once the node is found, the parent is already available. We only need to check the children (directReports array)
3. Determine whether a particular node/employee is a descendant (direct/indirect report) of a parent node. Again, we first need to find that node (like in scenario #1). Then traverse up to check the parent/ancestor.

To display the output, I simply print to console. I use tab character **(\t)** as indent to show the hierarchy.

There is 1 edge case that I handle in this scenario, employee with an invalid manager. This happens when an employee has a valid **managerId**. However when searched, there is no employee with such id. In other word, the manager is not a valid employee. This situation is detected when building the relationship. I store the Id of this employee in member variable vector **m_employeeWithNoManager**. When printing, I also display this information.

The files/directory are as follows:
- **README.md** : this file
- **Employees.cpp & h** : Header and source files for Employee class. It stores all employees record.
- **Reader.cpp & h** : Header and source files for Reader class, which is used to parse input file.
- **main.cpp** : file that contains the main function.
- **data.txt** : contain simple records.

When parsing the input file, I take similar approach to SAX XML parser. So, as the Reader finds the data, it notifies the interested party. In this case, it is Employees class. **Employees** class implement **ReaderHandler** abstract class. After being notified of a record, Employees class create an Employee struct, populate its fields and insert it into employees map. Doing it this way allow us to test the parser and the **Employees** class separately. We can also work on it independently. For example, if the input file format change, we can only change the parser. We can leave the **Employees** class untouched because the new updated parser will still call the same handler to tell **Employees** class to create a new record.

If you do not want to read from file, you can simply modify main.cpp and add the records programmatically. There is already commented code that demonstrate this. The following code populates employee data.

	Employees employees;
	employees.addEmployee(100, 150, "Alan");
	employees.addEmployee(220, 100, "Martin");
	employees.addEmployee(150, -1, "Jamie");
	employees.addEmployee(275, 100, "Alex");
	employees.addEmployee(400, 150, "Steve");
	employees.addEmployee(190, 400, "David");

To build the application, use this command:

    g++ -std=c++11 Employees.cpp Reader.cpp main.cpp -o Employee

To test the app and pass a file as data:

    Employee data.txt
