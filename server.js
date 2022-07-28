const { getConsoleOutput } = require('@jest/console');
const inquirer = require('inquirer');
const db = require('./db/connection');
// Express middleware

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
});

function execSQL(sql,displayType) {
   db.query(sql, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      return;
      } 
      console.log(`

      `);
      const result= Object.values(JSON.parse(JSON.stringify(rows)));
          switch (displayType){
            case 0:
            break;
            case 1:
              console.log( "Department ID"+'\t\t'+"Department Name");
              result.forEach(element => console.log(element.id+"\t\t\t"+element.department_name));
            break;
            case 2:          
              console.log( "Role ID"+'\t\t'+"Job Title"+'\t\t'+"Salary"+'\t\t'+"Department Name");
              result.forEach(element => console.log(element.id+"    \t\t"+element.job_title+"      \t"+element.salary+"    \t\t"+element.department_name));
            break;
            case 3:
              console.log( "Employee ID"+'\t'+"First Name"+'\t'+"last Name"+'\t'+"Job Title"+'\t\t'+"Salary"+'\t\t'+"    Report Manager"+'\t\t'+"Department Name");
              result.forEach(element => console.log(element.employee_id+"\t\t"+element.employee+"\t\t"+element.last_name+"\t\t"
              +element.job_title+"      \t"+element.salary+"\t\t     "+element.manager+"\t\t\t"+element.department_name));
            break;
          }
      });
      
}

function menu(){
  let sql;
  inquirer
    .prompt({
    type: 'list',
    message: 'Select the options',
    name: 'select',
    choices: ['View','Add','Update','Finish']
    })
    .then(({ select }) => {
      switch (select) {
        case 'View':
          viewMenu()
        break;
        case 'Update':
          UpdateMenu();
        break;
        case 'Add':    
          addMenu();
        break;
        case 'Finish':          
          finishMenu();
        break;
      }
    }) 
}

function finishMenu(){
  db.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
  });
}

function UpdateMenu(){
  let sql,match,r_match;
  let choice=[],id=[],role=[],r_id=[];
  console.log(`
  =================
      Update Menu
  =================
  `);
  sql = `SELECT id, employee_id, first_name,last_name  FROM employee ;`;
  db.query(sql, (err, rows) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    } 
    let result= Object.values(JSON.parse(JSON.stringify(rows)));
    for (i=0;i<result.length;i++){
      choice[i]=result[i].first_name+" "+result[i].last_name;
      id[i]=result[i].id;
    }
  })
  sql =  `SELECT roles.id, job_title, department.department_name FROM roles LEFT JOIN department ON roles.department_id = department.id;`;  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
      } 
      result=[];
      result= Object.values(JSON.parse(JSON.stringify(rows)));
      for (i=0;i<result.length;i++){
        role[i]=result[i].job_title+" ("+result[i].department_name+")";
        r_id[i]=result[i].id;
    }   
  })   
  console.log(`
  `);
  inquirer
    .prompt({
      type: 'confirm',
      name: 'confirmUpdate',
      message: 'Do you like to Update the employee role?',
      default: true
    })
    .then(({ confirmUpdate }) => {
  inquirer
    .prompt({
      type: 'list',
      message: 'Select the employee',
      name: 'select',
      choices: choice
    })
    .then(({ select }) => {
        for (i=0;i<choice.length;i++){
          if (select==choice[i]){
            match=i;
            break;
          }
        } 
      console.log(`
      `);     
      inquirer
        .prompt({ type: 'list',
        message: 'Select the new role',
        name: 'r_select',
        choices: role
        })
        .then(({ r_select }) => {
          for (i=0;i<role.length;i++){
            if (r_select==role[i]){
              r_match=i;
              break;
            }
          }          
          sql = `UPDATE employee SET roles_id = ${r_id[r_match]}
              WHERE id = ${id[match]};`;
          db.query(sql, (err, rows) => {
          if (err) {
          res.status(500).json({ error: err.message });
          return;
          } 
          })          
        menu();
      })
    })
})
}
function addMenu(){
  let sql,match,r_match,report;
  let choice=[],c_id=[],role=[],r_id=[],e_choice=[],e_id=[];
  sql = `SELECT id, employee_id, first_name,last_name  FROM employee ;`;
  db.query(sql, (err, rows) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    } 
    let result= Object.values(JSON.parse(JSON.stringify(rows)));
    for (i=0;i<result.length;i++){
      e_choice[i]=result[i].first_name+" "+result[i].last_name;
      e_id[i]=result[i].id;
    }
    e_choice[result.length]="Null";
    e_id[result.length]=null;
  })
  sql = `SELECT id, department_name  FROM department ;`;
  db.query(sql, (err, rows) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    } 
    let result= Object.values(JSON.parse(JSON.stringify(rows)));
    for (i=0;i<result.length;i++){
      choice[i]=result[i].department_name;
      c_id[i]=result[i].id;
    };
  })
  sql =`SELECT roles.id, job_title, department.department_name FROM roles LEFT JOIN department ON roles.department_id = department.id;`;  
    db.query(sql, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
      return;
      } 
      result=[];
      result= Object.values(JSON.parse(JSON.stringify(rows)));
      for (i=0;i<result.length;i++){
        role[i]=result[i].job_title+" ("+result[i].department_name+")";
        r_id[i]=result[i].id;
      };  
  })
  console.log(`
  =================
      Add Menu
  =================
  `);
  inquirer
    .prompt({
    type: 'list',
    message: 'Select the options',
    name: 'select',
    choices: ['Add a departments','Add a roles','Add an Employee','Retuen to Main Menu']
    })
    .then(({ select }) => {
      switch (select) {
          case 'Add a departments':
              inquirer
              .prompt({
                  type: 'input',
                  name: 'name',
                  message: 'Please enter the new department name',
                })
                .then(({ name }) => {
                      sql=`INSERT INTO department
                      (department_name)
                    VALUES
                    ('${name}');`;
                  execSQL(sql,0);
                    addMenu();
                });
          break;
          case'Add a roles':
          inquirer
          .prompt({
              type: 'input',
              name: 'title',
              message: 'Please enter the job title',
            })
            .then(({ title }) => {
              inquirer
                .prompt({
                  type: 'input',
                  name: 'salary',
                  message: 'Please enter the salary',
                })
                .then(({ salary }) => {
                    inquirer
                    .prompt({
                      type: 'list',
                      message: 'Select the department',
                      name: 'select',
                      choices: choice
                      })
                    .then(({ select }) => {
                      for (i=0;i<choice.length;i++){
                        if (select==choice[i]){
                           match=i;
                           break;
                        }
                      } 
                      sql=`INSERT INTO roles
                            (job_title, salary, department_id)
                            VALUES ('${title}', ${salary}, ${c_id[match]});`;
                      console.log(sql);
                      execSQL(sql,0);
                      addMenu();
                      })
                })
            });
          break;
          case'Add an Employee':
          match=0;
          r_match=0;
          inquirer
          .prompt({
              type: 'input',
              name: 'id',
              message: 'Please enter the employee ID',
            })
            .then(({ id }) => {
              inquirer
                .prompt({
                  type: 'input',
                  name: 'first',
                  message: 'Please enter the first name',
                })
                .then(({ first }) => {
                  inquirer
                    .prompt({
                      type: 'input',
                      name: 'last',
                      message: 'Please enter the last name',
                    })
                      .then(({ last }) => {
                          inquirer
                          .prompt({
                            type: 'list',
                            message: 'Select the report manager',
                            name: 'select',
                            choices: e_choice
                          })
                            .then(({ select }) => {
                              for (i=0;i<e_choice.length;i++){
                                if (select==e_choice[i]){
                                  match=i
                                  break; 
                                }
                              }                       
                              
                            inquirer
                              .prompt({type: 'list',
                              message: 'Select the new role',
                              name: 'r_select',
                              choices: role
                              })
                              .then(({ r_select }) => {
                                for (i=0;i<role.length;i++){
                                  if (r_select==role[i]){
                                    r_match=i;
                                    break;
                                  }
                                }   
                                sql=`INSERT INTO employee
                                  (employee_id,first_name, last_name, report_id, roles_id)
                                  VALUES (${id}, '${first}', '${last}',${e_id[match]}, ${r_id[r_match]});`;
                                  console.log(sql);
                                  execSQL(sql,0);
                                  addMenu();
                              })
                            })
                        })
                    })
                });
          break;
          case'Retuen to Main Menu':
          menu();
          break;
        }
      }) 
  }


function viewMenu(){
  let sql;
  console.log(`
  =================
      View Menu
  =================
  `);
  inquirer
    .prompt({
    type: 'list',
    message: 'Select the options',
    name: 'select',
    choices: ['View all departments','View all roles','View all Employee','Retuen to Main Menu']
    })
    .then(({ select }) => {
      switch (select) {
        case 'View all departments':
          sql = `SELECT id, department_name FROM department;`;  
          execSQL(sql,1);
          viewMenu();          
        break;
        case 'View all roles':
          sql = `SELECT roles.id, job_title, roles.salary, department.department_name
          FROM roles LEFT JOIN department ON roles.department_id = department.id;`;  
          execSQL(sql,2);
          viewMenu();
       break;
        case 'View all Employee':          
          sql = `SELECT e.employee_id,e.last_name, roles.job_title, roles.salary, department.department_name,  
            e.first_name as employee,m.first_name as manager
            FROM employee m INNER JOIN employee e on m.id = e.report_id
            LEFT JOIN roles ON e.roles_id = roles.id
            JOIN department ON department.id=roles.department_id ORDER BY e.employee_id;`;  
          execSQL(sql,3);    
          viewMenu();
        break;
        case 'Retuen to Main Menu':
          menu();
        break;
      }
    }) 
}


menu();