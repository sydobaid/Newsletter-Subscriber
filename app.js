const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req, res){
    res.sendFile(__dirname+"/signup.html")
});

app.post("/",function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    console.log(fname, lname, email);

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/8e88e15ebb";
    
    const option = {
        method: "POST",
        auth: "obaid:b79455f5a91f2b4ccc8d5a314bd0cc22-us10"
    }
    const request = https.request(url, option, function(response){
        
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
    console.log("Server Started at port 3000");
})

// API KEY
// b79455f5a91f2b4ccc8d5a314bd0cc22-us10

// list ID
// 8e88e15ebb