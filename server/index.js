const express=require('express');
const client = require("mongodb").MongoClient;

const fs = require('fs');
const path = require('path');

let dbinstance;
client.connect("mongodb+srv://vanshikagupta1103:Dikshant28@cluster0.vhkrrz6.mongodb.net/")
    .then((data) => {
        dbinstance = data.db("customer");
        console.log("Mongodb connected");
    })
    .catch((err) => {
        console.log(err);
    })

const app=express();
app.use(express.json());
const cors=require('cors');
app.use(express.urlencoded({extended:"false"}));
app.use(cors());

//write file  function

const writeUserDataToFile = (mongoObject) => {
    const filePath = path.join(__dirname, 'userData.json');
  
    // Read existing data from the file or initialize with an empty array
    let existingData = [];
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
  
      // Ensure existingData is an array, if not, initialize with an empty array
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (err) {
      // File doesn't exist or is not valid JSON, ignore and initialize with an empty array
    }
  
    // Ensure mongoObject is an object
    if (typeof mongoObject !== 'object') {
      console.error('MongoDB object must be an object.');
      return;
    }
  
    // Push new MongoDB object to the existing array
    existingData.push(mongoObject);
  
    // Convert the updated array of objects to a JSON string
    const updatedData = JSON.stringify(existingData, null, 2);
  
    // Write the JSON data back to the file
    fs.writeFileSync(filePath, updatedData);
    console.log('User data written to file:', filePath);
  };

app.post('/createaccount',(req,res)=>{
  const { fname,lname,email, paswd } = req.body;
  const info={"Firstname":fname,"Lastname":lname,"Email":email,"Password":paswd};
  dbinstance.collection("createaccount").insertOne(info)


  .then((result) => {
    writeUserDataToFile(info)  //write file
    console.log(result);
      res.json({ success: true, message: "Signup successful" });
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
  });
})


app.listen(3001, () => {
    console.log(`Server is running`);
  });

//login


// app.post('/login', (req, res) => {
//      fs.readFile("userData","utf-8",(err,data)=>{
//          let records=JSON.parse(data);  //array of users
//         let results= records.filter((item)=>{
//               if(item.email==req.body.email && item.paswd==req.body.password){
//                   return true;
//               }
//          });
//          if(results.length==0){
//              console.log("Invalid username");
//          }
//          else{
//             console.log("Welcome to dashboard");
//          }
//      })
// });


// app.post('/login', (req, res) => {
//     fs.readFile("userData", "utf-8", (err, data) => {
//       if (err) {
//         console.error('Error reading file:', err);
//         return res.status(500).send('Internal Server Error');
//       }
  
//       try {
//         let records = JSON.parse(data); // array of users
  
//         let results = records.filter((item) => {
//           if (item.email == req.body.email && item.paswd == req.body.password) {
//             return true;
//           }
//         });
  
//         if (results.length == 0) {
//           console.log("Invalid username");
//         } else {
//           console.log("Welcome to dashboard");
//         }
//       } catch (jsonErr) {
//         console.error('Error parsing JSON:', jsonErr);
//         return res.status(500).send('Internal Server Error');
//       }
//     });
//   });
  
app.post('/login', (req, res) => {
    const filePath = path.join(__dirname, 'userData.json');  // Use the correct file name
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      try {
        let records = JSON.parse(data); // array of users
  
        let results = records.filter((item) => {
          if (item.Email == req.body.email && item.Password == req.body.paswd) {
            return true;
          }
        });
  
        if (results.length == 0) {
          console.log("Credentials invalid!");
        } else {
          console.log("Welcome to dashboard");
        }
      } catch (jsonErr) {
        console.error('Error parsing JSON:', jsonErr);
        return res.status(500).send('Internal Server Error');
      }
    });
});
