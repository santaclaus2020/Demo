const fs = require('fs');
const core = require('./core.js');

let allEmployees = {};

function readInputFile(inputFile, completionCallback) {
	core.readFileEachLine(inputFile, function(line) {
		try {
			let record = core.createEmployeeFromJSON(JSON.parse(line));
			allEmployees[record.id] = record;
		}
		catch(err) {
			console.log(err);
		}	
	}, 
	function(){
		if (completionCallback)
			completionCallback();
	});
}

completion = function() {
	// When is this executed, we know the loading/populating record is complete.
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
}

const arguments = process.argv;

if (arguments.length < 3) {
    console.log('Please enter file name of the data source!');
    console.log('Eg. node from_file_per_line.js data.json');
    return;
}

// Ensure file exists
if (fs.existsSync(arguments[2])) {
	try {
		readInputFile(arguments[2], completion);
	}
	catch(err) {
		console.log(err);
	}
}
else {
	console.log("Fail to read file " + arguments[2]);
}