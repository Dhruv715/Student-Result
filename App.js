var mysql = require("mysql");
var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project2",
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("connected to database");
});

// Student Side
app.get("/student/login", function (req, res) {
  res.render("StudentLogin");
});

var studentid;
app.post("/student/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var query =
    "SELECT * FROM student WHERE email = '" +
    email +
    "' AND password = '" +
    password +
    "'";
  con.query(query, function (err, result) {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (result.length > 0) {
      console.log("User logged in successfully");
      console.log(result[0]);
      studentid = result[0].rollno;
      res.redirect("/student/dashboard"); // Redirect to admin task management page
    } else {
      console.log("Invalid email or password");
      res.redirect("/student/login");
    }
  });
});


app.get("/student/dashboard", function (req, res) {
  var query = `
    SELECT s.*, r.*
    FROM student s
    LEFT JOIN tblresult r ON s.rollno = r.rollno
    ORDER BY r.total DESC
    LIMIT 5;
  `;

  con.query(query, function (err, result) {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }

    var loggedInStudentQuery = " SELECT s.*, r.* FROM student s LEFT JOIN tblresult r ON s.rollno = r.rollno WHERE s.rollno = '"+studentid+"'"

    con.query(loggedInStudentQuery, function (err, loggedInStudentResult) {
      if (err) {
        console.error("Error executing query: " + err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.render("Student", {
        top5Results: result,
        loggedInStudentResult: loggedInStudentResult[0],
      });
    });
  });
});


// Admin Side
app.get("/admin/login", function (req, res) {
  res.render("AdminLogin");
});

app.post("/admin/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var query =
    "SELECT * FROM admin WHERE email = '" +
    email +
    "' AND password = '" +
    password +
    "'";
  con.query(query, function (err, result) {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (result.length > 0) {
      console.log("User logged in successfully");
      console.log(result[0]);
      res.redirect("/admin/dashboard"); // Redirect to admin task management page
    } else {
      console.log("Invalid email or password");
      res.redirect("/admin/login");
    }
  });
});

app.get("/admin/dashboard", (req, res) => {
  var queryUsers = "SELECT * FROM student";
  con.query(queryUsers, function (err, result) {
    if (err) {
      console.error("Error fetching tasks: ", err);
      // Handle error appropriately, maybe render an error page
      res.send("Error fetching tasks");
    } else {
      console.log(result);
      console.log("Tasks fetched successfully");
      // Pass the fetched tasks to the EJS template for rendering

      res.render("Admin", { task: result });
    }
  });
   // Assuming you have a template engine set up for rendering
});

app.get('/admin/delete/:id', function(req, res) {
  var id = req.params.id;
  var deletequery = "DELETE FROM student WHERE rollno = '"+id+"' ";
  con.query(deletequery, function(err, result) {
      if (err) throw err;

      console.log(result);
      res.redirect('/admin/dashboard');
  });
});



// POST request to insert student records
app.post("/admin/dashboard", (req, res) => {
  const rollno = req.body.rollno;
  const grno = req.body.grno;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const classVal = req.body.class;
  const batch = req.body.batch;

  // Check if email already exists in the database
  const checkQuery = `SELECT * FROM student WHERE email = '${email}'`;
  con.query(checkQuery, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (result.length > 0) {
      console.log("Email already exists");
      res.redirect("/"); // Redirect to signup page or show an error message
    } else {
      // Insert student record into the database
      const insertQuery =
        "INSERT INTO Student (rollno, grno, name, email, password, class, batch) VALUES ('" +
        rollno +
        "', '" +
        grno +
        "', '" +
        name +
        "', '" +
        email +
        "', '" +
        password +
        "', '" +
        classVal +
        "', '" +
        batch +
        "')";
      con.query(insertQuery, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err);
          res.status(500).send("Internal Server Error");
          return;
        }
        console.log("Student record inserted successfully");

        res.redirect("/admin/dashboard");
      });
    }
  });
});

// Route to render the update form for student details
app.get('/admin/update/:rollno', function(req, res) {
  var rollno = req.params.rollno;
  var queryStudent = "SELECT * FROM student WHERE rollno = '" + rollno + "'";
  con.query(queryStudent, function(err, result) {
      if (err) {
          console.error("Error fetching student details for update: ", err);
          res.send("Error fetching student details for update");
      } else {
          console.log("Student details fetched for update successfully");
          res.render("UpdateStudent", { student: result });
      }
  });
});

// Route to handle updating student details
app.post('/admin/update/:rollno', function(req, res) {
  var rollno = req.params.rollno;
  const { grno, name, email, classVal, batch, password } = req.body;

  const updateStudent =
      "UPDATE student SET grno = '" + grno + "', name = '" + name + "', email = '" + email + "', class = '" + classVal + "', batch = '" + batch + "', password = '" + password + "' WHERE rollno = '" + rollno + "'";

  con.query(updateStudent, function(err, result) {
      if (err) {
          console.error("Error updating student details: ", err);
          res.status(500).send("Internal Server Error");
      } else {
          console.log("Student details updated successfully");
          res.redirect("/admin/dashboard");
      }
  });
});


app.get('/admin/deletes/:id', function(req, res) {
  var id = req.params.id;
  var deletequery = "DELETE FROM tblresult WHERE result_id = '"+id+"' ";
  con.query(deletequery, function(err, result) {
      if (err) throw err;

      console.log(result);
      res.redirect('/admin/result');
  });
});

// Route to handle updating result
app.get('/admin/updates/:id', function(req, res) {
  var id = req.params.id;
  var queryResult = "SELECT * FROM tblresult WHERE result_id = '" + id + "'";
  con.query(queryResult, function(err, result) {
      if (err) {
          console.error("Error fetching result for update: ", err);
          res.send("Error fetching result for update");
      } else {
          console.log("Result fetched for update successfully");
          res.render("UpdateResult", { result: result });
      }
  });
});

// Route to handle updating result
app.post('/admin/updates/:id', function(req, res) {
  var id = req.params.id;
  const { rollno, subject1, subject2, subject3, subject4, subject5 } = req.body;

  const totalMarks =
      parseInt(subject1) +
      parseInt(subject2) +
      parseInt(subject3) +
      parseInt(subject4) +
      parseInt(subject5);

  // Calculate percentage
  const totalSubjects = 5; // Assuming there are 5 subjects
  const maximumMarks = totalSubjects * 100; // Assuming each subject has a maximum of 100 marks
  const percentage = (totalMarks / maximumMarks) * 100;

  // Assign grades based on percentage
  let grade;
  if (percentage >= 90) {
      grade = 'A+';
  } else if (percentage >= 80) {
      grade = 'A';
  } else if (percentage >= 70) {
      grade = 'B+';
  } else if (percentage >= 60) {
      grade = 'B';
  } else if (percentage >= 50) {
      grade = 'C';
  } else if (percentage >= 40) {
      grade = 'D';
  } else {
      grade = 'Fail';
  }

  const updateResult =
      "UPDATE tblresult SET rollno = '" + rollno + "', subject1 = '" + subject1 + "', subject2 = '" + subject2 + "', subject3 = '" + subject3 + "', subject4 = '" + subject4 + "', subject5 = '" + subject5 + "', total = '" + totalMarks + "', per = '" + percentage.toFixed(2) + "', grade = '" + grade + "' WHERE result_id = '" + id + "'";

  con.query(updateResult, function(err, result) {
      if (err) {
          console.error("Error updating result: ", err);
          res.status(500).send("Internal Server Error");
      } else {
          console.log("Result updated successfully");
          res.redirect("/admin/result");
      }
  });
});


app.get("/admin/result", (req, res) => {
  var queryUsers = "SELECT * FROM tblresult";
  con.query(queryUsers, function (err, result) {
    if (err) {
      console.error("Error fetching tasks: ", err);
      // Handle error appropriately, maybe render an error page
      res.send("Error fetching tasks");
    } else {
      console.log(result);
      console.log("Tasks fetched successfully");
      // Pass the fetched tasks to the EJS template for renderin
      res.render("AdminResult", { task: result });
    }
  });
   // Assuming you have a template engine set up for rendering
});

app.post("/admin/result", function (req, res) {
  const { rollno, subject1, subject2, subject3, subject4, subject5 } = req.body;

  const totalMarks =
    parseInt(subject1) +
    parseInt(subject2) +
    parseInt(subject3) +
    parseInt(subject4) +
    parseInt(subject5);

  // Calculate percentage
  const totalSubjects = 5; // Assuming there are 5 subjects
  const maximumMarks = totalSubjects * 100; // Assuming each subject has a maximum of 100 marks
  const percentage = (totalMarks / maximumMarks) * 100;

  // Assign grades based on percentage
  let grade;
  if (percentage >= 90) {
    grade = 'A+';
  } else if (percentage >= 80) {
    grade = 'A';
  } else if (percentage >= 70) {
    grade = 'B+';
  } else if (percentage >= 60) {
    grade = 'B';
  } else if (percentage >= 50) {
    grade = 'C';
  } else if (percentage >= 40) {
    grade = 'D';
  } else {
    grade = 'Fail';
  }

  const insertResult =
    "INSERT INTO tblresult (rollno, subject1, subject2, subject3, subject4, subject5, total, per,grade) VALUES ('" +
    rollno +
    "','" +
    subject1 +
    "','" +
    subject2 +
    "','" +
    subject3 +
    "','" +
    subject4 +
    "','" +
    subject5 +
    "','" +
    totalMarks +
    "','" +
    percentage.toFixed(2) +
    "','"+grade+"')";

  con.query(insertResult, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err);
      res.status(500).send("Internal Server Error");
      return;
    } else {
      console.log("Student Result inserted successfully", result);
      res.redirect("/admin/dashboard");
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 4000");
});
