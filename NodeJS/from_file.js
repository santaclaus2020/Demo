const arguments = process.argv;

if (arguments.length < 3) {
    console.log('Please enter file name of the data source!');
    console.log('Eg. node from_file.js data.txt');
    return;
}

// Main functionalities are defined in core.js
const core = require('./core.js');

let rawDataFromFile;

try {
	rawDataFromFile = core.readFileSyncToArray(arguments[2]);
}
catch(err) {
	console.log("Fail to read file " + arguments[2]);
	return;
}

// Create the employee records data structure from flat tabular data.
let allEmployees = core.createEmployeeRecords(rawDataFromFile);

// Now build the relationships. Aftef this step, the hierarchical relationship is set.
let results = core.buildRelationship(allEmployees);

// Check for employee with invalid manager (manager who is not a valid employee)
if (results.employeeWithInvalidManager.length) {
  console.log('Found employee with invalid manager. The ids : ' + results.employeeWithInvalidManager); 
}

// Check for circular relationship, eg. A's manager is B and B's manager is A
if (results.employeeWithCircularRelationship.length) {
  console.log('Found employee with circular relationship. The ids : ' + results.employeeWithCircularRelationship);  
}

// Print all employees data (including the hierarchy)
core.printAll(allEmployees);

// Print employee with id 20 and its direct reports
//core.print(allEmployees[20], 0);
