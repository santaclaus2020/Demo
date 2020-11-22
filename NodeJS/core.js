const fs = require('fs');
const readline = require('readline');

// --------------------
// Local functions
// --------------------

// Print the padding via for loop
function padding(level) {
  let st = '';
  for(let i = 0; i < level; i++)
    st += '\t';

  return st;
}

// Print the padding recursively
// function padding(level) {

//   if (level === 0)
//     return '';

//   return '\t' + padding(level - 1);
// }

// Return the ids of top nodes (those that don't have manager id)
function findTopNodeId(data) {
  return Object.keys(data).filter(function(id) {
      return data[id].managerId === null;
    });
}

// Return the ids of employee with invalid manager (manager who is not a valid employee)
function findEmployeesWithemployeeWithInvalidManager(data) {
   return Object.keys(data).filter(function(id) {
      let emp = data[id];
      return emp.datamanagerId && !emp.manager;
    }); 
}

// Print employee starting from given data further down the hierarchy
function printLocal(data, level) {
  // Print current data (include padding)
  console.log(padding(level) + data.name);

  // Now print its direct Reports
  for (let child of data.directReports)
    printLocal(child, level + 1);
}

// Create an employee
function createEmployee(pName, pId, pManagerId) {
  return { 
    name : pName,
    id : pId,
    managerId : pManagerId,
    manager : null,
    directReports : []
  };
}

// --------------------
// Exposed functions
// --------------------

// Read and parse a text file to an array of dictionary (synchronously)
exports.readFileSyncToArray = function(filePath) {
    let data = JSON.parse(fs.readFileSync(filePath));
    return data;
}

exports.readFileEachLine = function(filePath, handler, completionHandler) {
  let lineReader = readline.createInterface({
    input: fs.createReadStream(filePath)
  });

  lineReader.on('line', function(line) {
    if (handler)
      handler(line);
  })
  .on('close', function() {
    if (completionHandler)
      completionHandler();      
  });
}

// Create a dictionary of employees
exports.createEmployeeRecords = function(data) {
  let employees = {};

  for(let emp of data) {
    // Ensure that name and id are available (not null or undefined)
    if (emp.name && emp.id)
      employees[emp.id] = createEmployee(emp.name, emp.id, emp.managerId);
  }

  return employees;
}

// Build the relationship (connect supervisor - direct reports relationship)
exports.buildRelationship = function(data) {
  let reports = {
    employeeWithInvalidManager : [],
    employeeWithCircularRelationship : []
  };

  for (let id in data) {
    let emp = data[id];
    
    if (!emp)
      continue;
    
    // If the employee has no manager, continue
    if (!emp.managerId)
      continue;
        
    let manager = data[emp.managerId];
    
    if (manager) {
      // Check for circular relationship
      if (manager.managerId === emp.id) {
        reports.employeeWithCircularRelationship.push('Id ' + emp.id + ' <-> ' + manager.id);
      }

      emp.manager = manager;
      manager.directReports.push(emp);
    }
    else {
      // This employee's manager is not a valid employee.
      reports.employeeWithInvalidManager.push(emp.id);
    }    
  }

  // Return the reports
  return reports;
}

// Print all employee records. It first find 
exports.printAll = function(data) {
  let topNodeIds = findTopNodeId(data);

  if (! topNodeIds || topNodeIds.length === 0) {
    console.log('There is no top level employee found (employee with no manager)! Use print() and specify an employee as the root/top level!');
    return;
  }

  for (let id of topNodeIds) {
    printLocal(data[id], 0);
  }
}

// Create an employee from a given JSON object
exports.createEmployeeFromJSON = function(obj) {
  return createEmployee(obj.name, obj.id, obj.managerId);
}

// Export printLocal as print. This is accessible from outside
exports.print = printLocal;

