var mssql=require('mysql');
var exp=require('express');
var cors=require('cors');
var bparser=require('body-parser');
bparserinit=bparser.urlencoded({extended:false});
var app=exp();//Initialize express
app.use(cors());
app.use(exp.json());
app.use(bparserinit);
var queryResults=undefined;
 
mssqlConnection=mssql.createConnection(
  {
    host:'localhost',
    database:'world',
        user:'root',
        password:'root',
        port:'3306'
  });
 
function checkConnection(error)
{
    if(error == undefined)
    {
    console.log("Connected to Database");
    }
    else
    {
    console.log("Error code: " + error.errno);
    console.log(error.message);
    }
}
 
function feedback(error)
{
  if(error != undefined)
  {
    console.log(error.errno);
    console.log(error.message);
  }
  else
  {
    console.log("Open the browser and visit this url http://localhost:3000/getAll")
  }
}

function getusersbyemailid(request,response){
  var emailid=request.query.email;
  //parameterized SQL
  mssqlConnection.query('select * from users where emailID=?',[emailID],processResults); 
  response.send(queryResults);
}
 
function getUsersById(request,response)
{
  var userid=request.query.uid;
  mssqlConnection.query('select *from users where userid=?', [userid], processResults);
  response.send(queryResults);
}
 
var statusMessage="";
 
function checkInsertStatus(error){
  statusMessage=((error==undefined)?"<b>Insert successful </b>":"<b>Insert failure</b>"
  +error.message+"</b>");
}
 
 
function processResults(error, results)
{
  queryResults=results;
  console.log(results);
}
 
function displayAllUsers(request,response)
{
  mssqlConnection.connect(checkConnection);
  mssqlConnection.query('select *from users', processResults);
  response.send(queryResults);
}
 
function insertUsers(request, response)
{
  var userid = request.body.userid;
  var password = request.body.password;
  var emailID = request.body.emailID;
  console.log(userid+"\t\t"+ password+"\t\t"+emailID)
  mssqlConnection.connect(checkConnection);
  mssqlConnection.query(
    'INSERT INTO users (userid, password, emailID) VALUES (?, ?, ?)',[userid, password, emailID],checkInsertStatus);
    response.send(JSON.stringify(statusMessage));
}
 
function updateUsers(request, response)
{
  var userid = request.body.userid;
  var password = request.body.password;
var emailID = request.body.emailID;
mssqlConnection.query(
  'UPDATE users SET password = ?, emailid = ? WHERE userid = ?',
  [password, emailID, userid],
  function (error, results) {
    if (error) {
      console.log("Update failed: " + error.message);
      response.status(500).json({ message: "Update failed" });
    } else {
      console.log("User updated successfully");
      response.status(200).json({ message: "User updated successfully" });
    }
  }
  );
}
 
 
function deleteUsers(request, response)
{
  var userid = request.query.userid; // Assuming you're passing userId as a query parameter
  mssqlConnection.query(
    'DELETE FROM users WHERE userid = ?',
    [userid],
    function (error, results) {
      if (error) {
        console.log("Delete failed: " + error.message);
        response.status(500).json({ message: "Delete failed" });
      } else {
      console.log("User deleted successfully");
      response.status(200).json({ message: "User deleted successfully" });
    }
  }
  );
}
  function loginUser(request, response) {
    var emailID = request.body.emailID;
    var password = request.body.password;
 
    // Check if the email and password are provided
    if (!emailID || !password) {
      console.log(emailID, password);
      return response.status(400).json({ message: "Email and password are required" });
    }
 
    // Query the database to find a user with the provided email and password
    mssqlConnection.query(
      'SELECT * FROM users WHERE emailID = ? AND password = ?',
      [emailID, password],
      function (error, results) {
        if (error) {
          console.log("Login failed: " + error.message);
          response.status(500).json({ message: "Login failed" });
        } else {
          if (results.length === 1) {
            console.log("Login successful");
            response.status(200).json({message : "Login successful" });
          } else {
            console.log("Login failed: Invalid email or password");
            response.status(200).json({ message: "Login failed: Invalid email or password" });
          }
        }
      }
    );  
}
 
mssqlConnection.connect(checkConnection);
app.listen(3000, feedback);
app.post('/insert', insertUsers);
app.put('/update', updateUsers);
app.delete('/delete', deleteUsers);
app.get('/getById',getUsersById);
app.get('/getAll', displayAllUsers);
app.get('/getbyemailid',getusersbyemailid);
app.post('/login',loginUser);
 
 
function insertUser(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var emailid = request.body.emailid;
  var address = request.body.address;
  var phoneno = request.body.phoneno;
  console.log(firstName+"\t\t"+ lastName+"\t\t"+emailid+ "\t\t" +address+"\t\t"+ phoneno+"\t\t")
  mssqlConnection.connect(checkConnection);
  mssqlConnection.query(
    'INSERT INTO user (firstName, lastName, emailid,address,phoneno) VALUES (?, ?, ?,?,?)',[firstName, lastName, emailid,address,phoneno],checkInsertStatus);
    response.send(JSON.stringify(statusMessage));
  }
 
 
function updateUser(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var emailID = request.body.emailID;
  var address = request.body.address;
  var phoneNo = request.body.phoneNo;
  mssqlConnection.query(
    'UPDATE user SET phoneNo = ?, emailID = ? WHERE firstName = ?',
    [firstName, lastName, emailID,address,phoneNo],
    function (error, results) {
      if (error) {
        console.log("Update failed: " + error.message);
        response.status(500).json({ message: "Update failed" });
      } else {
        console.log("User updated successfully");
        response.status(200).json({ message: "User updated successfully" });
      }
    }
    );
}
 
 
function deleteUser(request, response) {
var firstName = request.query.fname; // Assuming you're passing userId as a query parameter
mssqlConnection.query(
  'DELETE FROM user WHERE firstName = ?',
  [firstName],
  function (error, results) {
    if (error) {
      console.log("Delete failed: " + error.message);
      response.status(500).json({ message: "Delete failed" });
    } else {
      console.log("User deleted successfully");
      response.status(200).json({ message: "User deleted successfully" });
    }
  }
  );
}
 
 
function displayAllUser(request,response)
{
  mssqlConnection.connect(checkConnection);
  mssqlConnection.query('select *from user', processResults);
  response.send(queryResults);
}
 
 
function getuserbyemailid(request,response){
  var emailID=request.query.emailID;
  //parameterized SQL
  mssqlConnection.query('select * from user where emailID=?',[emailID],processResults);
  response.send(queryResults);
}
 
app.get('/getAllUser',displayAllUser);
app.delete('/deleteuser', deleteUser);
app.put('/updateUser', updateUser);
app.post('/insertUser', insertUser);
app.get('/getuserByemail' , getuserbyemailid)