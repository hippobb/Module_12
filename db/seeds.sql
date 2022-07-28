INSERT INTO department
  (department_name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO roles
  (job_title, salary, department_id)
VALUES

  ('Sales Lead', 10000, 1 ),
  ('Junior Sales', 8000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Account Manager', 160000, 3),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer Trainee', 190000, 4);

  INSERT INTO employee
  (employee_id,first_name, last_name, report_id, roles_id)
VALUES

  (1234,'John', 'Doe',8,1),
  (1235,'Mike', 'Chan', 7,2),
  (1236,'Ashley', 'Rodri', 6,3),
  (1237,'Kevin', 'Tupik', 5,4),
  (1238,'Kunal', 'Singh', 4,5),
  (1239,'Malia', 'Brown', 3,6),
  (1240,'Sarah', 'Lourd', 2,7),
  (1241,'Tom', 'Allen', 1,8);

  