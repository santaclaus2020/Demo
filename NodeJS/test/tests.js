const assert = require('assert');
const core = require('../core.js');

describe('Load simple data', function() {

	const simpleRawData = [
	    { name: "Alan", id: 100, managerId: 150 },
	    { name: "Martin", id: 220, managerId: 100 },
	    { name: "Jamie", id: 150, managerId: null },
	    { name: "Alex", id: 275, managerId: 100 },
	    { name: "Steve", id: 400, managerId: 150 },
	    { name: "David", id: 190, managerId: 400 }, 
	];

	let allEmployees;
	let results;

    before(function() {
        allEmployees = core.createEmployeeRecords(simpleRawData);
        results = core.buildRelationship(allEmployees);
    });

	it('Should have 6 employee records', () => {
		assert.equal(Object.keys(allEmployees).length, 6);
	});

	it('Should have no invalid manager or circular relationship', () => {
        assert.equal(results.employeeWithInvalidManager.length, 0);
        assert.equal(results.employeeWithCircularRelationship.length, 0);
    });

	it('CEO should have no manager', () => {
		let ceo = allEmployees[150];

		assert.equal(ceo.managerId, null);
		assert.equal(ceo.manager, null);
	});

	it('CEO should have 2 direct reports', () => {
		let ceo = allEmployees[150];

		assert.equal(ceo.directReports.length, 2);
	});

	it('Alan should 2 direct reports', () => {
		let alan = allEmployees[100];

		assert.equal(alan.directReports.length, 2);
	});

	it('Steve should 1 direct report', () => {
		let steve = allEmployees[400];

		assert.equal(steve.directReports.length, 1);
	});

	it('David should report to Steve', () => {
		let david = allEmployees[190];

		// Get the manager id via manager Object, not managerId
		assert.equal(david.manager.id, 400);
	});

	it('Martin and Alex should report to Alan', () => {
		let martin = allEmployees[220];
		let alex = allEmployees[275];

		// Get the manager id via manager Object, not managerId
		assert.equal(martin.manager.id, 100);
		assert.equal(alex.manager.id, 100);
	});

	it('Print all employee', () => {
		let stdout = require("test-console").stdout;

		// Hide print to console. Write to an array instead.
		let output = stdout.inspectSync(function() {
		    core.printAll(allEmployees);
		});

		assert.deepEqual(output, [ "Jamie\n", "\tAlan\n", "\t\tMartin\n", "\t\tAlex\n", "\tSteve\n", "\t\tDavid\n" ]);
	});

});

describe('Load data with double top level employee and an invalid manager', function() {

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

	let allEmployees;
	let results;

    before(function() {
        allEmployees = core.createEmployeeRecords(doubleTopLevelRawData);
        results = core.buildRelationship(allEmployees);
    });

	it('Should have 13 employee records', () => {
		// Note that it's 13 because 
		assert.equal(Object.keys(allEmployees).length, 13);
	});

	it('Should have 1 invalid manager and no circular relationship', () => {
        assert.equal(results.employeeWithInvalidManager.length, 1);
        assert.equal(results.employeeWithCircularRelationship.length, 0);
    });

	it('CEO should have no manager', () => {
		let ceo1 = allEmployees[150];
		let ceo2 = allEmployees[50];

		assert.equal(ceo1.managerId, null);
		assert.equal(ceo1.manager, null);

		assert.equal(ceo2.managerId, null);
		assert.equal(ceo2.manager, null);	
	});

	it('CEO 1 (Brad) should have 1 direct report', () => {
		let ceo = allEmployees[50];

		assert.equal(ceo.directReports.length, 1);
	});

	it('Jane should have 3 direct report', () => {
		let jane = allEmployees[20];

		assert.equal(jane.directReports.length, 3);
	});

	it('Hanna should have 1 direct report', () => {
		let hanna = allEmployees[30];

		assert.equal(hanna.directReports.length, 1);
	});

	it('Print Jane and her direct & indirect reports', () => {
		let stdout = require("test-console").stdout;

		// Jane will be the root/top level
		// Hide print to console. Write to an array instead.
		let output = stdout.inspectSync(function() {
		    core.print(allEmployees[20], 0);
		});

		assert.deepEqual(output, [ "Jane\n", "\tHanna\n", "\t\tPaul\n", "\tRomeo\n", "\tNed\n" ]);
	});	

});

describe('Load data with circular relationship', function() {

	const circularRawData = [
		{ name: "Alan", id: 100, managerId: 120 },
		{ name: "Martin", id: 120, managerId: 100 },
		{ name: "Jamie", id: 150, managerId: null },
		{ name: "Alex", id: 275, managerId: 100 },
		{ name: "Steve", id: 400, managerId: 150 },
		{ name: "David", id: 190, managerId: 400 },   
	];

	let allEmployees;
	let results;

    before(function() {
        allEmployees = core.createEmployeeRecords(circularRawData);
        results = core.buildRelationship(allEmployees);
    });

	it('Should have 6 employee records', () => {
		assert.equal(Object.keys(allEmployees).length, 6);
	});

	it('Should have no invalid manager and 2 circular relationships', () => {
        assert.equal(results.employeeWithInvalidManager.length, 0);
        assert.equal(results.employeeWithCircularRelationship.length, 2);
    });

	it('CEO should have 1 direct reports', () => {
		let ceo = allEmployees[150];

		assert.equal(ceo.directReports.length, 1);
	});

	it('Steve should 1 direct report', () => {
		let steve = allEmployees[400];

		assert.equal(steve.directReports.length, 1);
	});

	it('David should report to Steve', () => {
		let david = allEmployees[190];

		// Get the manager id via manager Object, not managerId
		assert.equal(david.manager.id, 400);
	});
});
