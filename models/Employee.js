const employees = require('../data/employees.json');

const Employee = {


    'list': ( filter_callback = null ) => {

        let result = [];

        if( typeof filter_callback === "function" ) {
            result = employees.filter( filter_callback );
        }
        else {
            result = employees;
        }

        return result;
    },

    'add': function(data){        
        employees.push(data);
        return {
            'total': employees.length,
            'newID': (employees.length-1)
        };
    }

};

module.exports = Employee;