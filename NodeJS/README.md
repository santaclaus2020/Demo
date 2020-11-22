# Simple App to read and show hierarcy

The data is loaded and processed in 2 steps.

The first step is to read it from the tabular source (either file or an array). At this stage, the data is loaded as it is and stored in a dictionary. So, it is still in tabular format. The key is employee id, eg. 100, 150. The value is the employee detail. The data structure looks like this

    { 
        name : <name>,
        id : <id>,
        managerId : <managerId>,
        manager : null,
        directReports : []
    };

In addition to managerId, each employee has a reference to its manager. Each employee also has an array of its direct reports. After stage 1 complete, for each employee record, the manager is still null and directReports array is still empty.

The second step is when we build the relationship. We iterate the data and build the "parent child" relationship. After this stage, every employee that has a manager should have its manager set. The directReports array should also be populated if the employee has at least one direct report.

So, the main data structure is a dictionary. It is kind of flat but we can find/search each employee record and its hierarchical relationship easily with much better complexity compared to tree traversal. I have implemented similar data structure in one of my past employment. I had to create an object graph to ensure any update/change in one node that affects other related nodes can be propagated efficiently. By structuring the data in this way (dictionary + reference to parent + list of children), I managed to satisfy the requirement. This is the backbone of the UI refresh system, aggregate calculation and data analysis of the application. It is still widely used by hundred of thousands of users in production today.

Consider the following scenario where the proposed data structure is superior.
1. Finding any node/employee. If a node deep down in the hierarchy, it will take time to find it in a tree data structure (complexity is O(n)). With the proposed data structure here, the complexity is O(1)
2. Finding siblings of a node/employee. Again, like in scenario #1, we have to find the node first, find its parent and then find the child nodes of the parent. With the proposed data structure here, we only need to find the node. Once the node is found, the parent is already available. We only need to check the children (directReports array)
3. Determine whether a particular node/employee is a descendant (direct/indirect report) of a parent node. Again, we first need to find that node (like in scenario #1). Then traverse up to check the parent/ancestor.

To display the output, I simply print to console. I use tab character **(\t)** as indent to show the hierarchy.

There are 2 edge cases that I handle in this scenario:
1. An employee with invalid manager. This happens when an employee has a valid **managerId**. However when searched, there is no employee with such id. In other word, the manager is not a valid employee. This situation is detected when building the relationship. I return an array than contains the id of such employee. This array is available from the return value of function **buildRelationship()**.
2. A circular relationship. For example, employee A has employee B as the manager and employee B has employee A as the manager. This situation is detected when building the relationship. I return an array than contains the id pair of such employee. This array is available from the return value of function **buildRelationship()**.
 
I also allow more than 1 top level node. This is just my preference when implementing this to cater for scenario where the company is owned/run by more than 1 persons. These persons do not have manager. You can see the raw data in **main.js**.

The files/directory are as follows:
- **README.md** : this file
- **complex_data.txt** : contain more complex data, 6 level hierarchy, 2 top level nodes (without manager)
- **core.js** : contain code for core functionality
- **data.json** : contain data in where each record is in json format
- **from_file.js** : main app that takes input file parameter for the data. The file is read synchronoulsly.
- **from_file_per_line.js** : main app that input file parameter for the data. The file is read perline and the record is created as we read the line.
- **main.js** : main app that populate the data using array in the code
- **package.json** : the package for this node app
- **simple_data.txt** : contain simple records
- **test** : a directory that contains tests.js

The app has been tested on Node v14.15.0, running on macOS 10.15.

To run the app using predefined array as data:

    node main.js

To pass a file as data (read synchronously):

    node from_file.js simple_data.txt

To pass a file as data (read per line):

    node from_file_per_line.js data.json

For unit test, I use mocha. Once you have mocha installed, you can run the test by typing

    npm run test