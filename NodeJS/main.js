// Main functionalities are defined in core.js
const core = require('./core.js');

// The raw employee data (in tabular format)
const simpleRawData = [
    { name: "Alan", id: 100, managerId: 150 },
    { name: "Martin", id: 220, managerId: 100 },
    { name: "Jamie", id: 150, managerId: null },
    { name: "Alex", id: 275, managerId: 100 },
    { name: "Steve", id: 400, managerId: 150 },
    { name: "David", id: 190, managerId: 400 }, 
];

// The raw employee data (in tabular format), with more than 1 top level employees (employee with no manager)
const doubleTopLevelRawData = [
    { name: "Alan", id: 100, managerId: 150 },
    { name: "Martin", id: 220, managerId: 100 },
    { name: "Jamie", id: 150, managerId: null },
    { name: "Alex", id: 275, managerId: 100 },
    { name: "Steve", id: 400, managerId: 150 },
    { name: "David", id: 190, managerId: 400 }, 
    { name: "John", id: 290, managerId: 4440 }, 
    { name: "Brad", id: 50, managerId: null },
    { name: "Jane", id: 20, managerId: 50 },
    { name: "Hanna", id: 30, managerId: 20 },
    { name: "Paul", id: 40, managerId: 30 },
    { name: "Romeo", id: 45, managerId: 20 },
    { name: "Ned", id: 46, managerId: 20 },
];

// The raw employee data (in tabular format), with no top level employee (employee with no manager)
const invalidRawData = [
	{ name: "Alan", id: 100, managerId: 150 },
	{ name: "Martin", id: 220, managerId: 100 },
	{ name: "Alex", id: 275, managerId: 100 },
	{ name: "Steve", id: 400, managerId: 150 },
	{ name: "David", id: 190, managerId: 400 },   
];

// The raw employee data (in tabular format), contains circular reference
const circularRawData = [
	{ name: "Alan", id: 100, managerId: 120 },
	{ name: "Martin", id: 120, managerId: 100 },
	{ name: "Jamie", id: 150, managerId: null },
	{ name: "Alex", id: 275, managerId: 100 },
	{ name: "Steve", id: 400, managerId: 150 },
	{ name: "David", id: 190, managerId: 400 },   
];

// Create the employee records data structure from flat tabular data.
// Just change the rawData to a different one from above to try different dataset
let allEmployees = core.createEmployeeRecords(doubleTopLevelRawData);

// Now build the relationships. Aftef this step, the hierarchical relationship is set.
let results = core.buildRelationship(allEmployees);

// Check for employee with invalid manager (manager who is not a valid employee)
if (results.employeeWithInvalidManager.length) {
  console.log('Found employee with invalid manager. The ids : ' + results.employeeWithInvalidManager); 
}

// Chech for circular relationship, eg. A's manager is B and B's manager is A
if (results.employeeWithCircularRelationship.length) {
  console.log('Found employee with circular relationship. The ids : ' + results.employeeWithCircularRelationship);  
}

// Print all employees data (including the hierarchy)
core.printAll(allEmployees);

// Print employee with id 20 and its direct reports
//core.print(allEmployees[20], 0);
