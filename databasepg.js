const { Client } = require("pg")
const client = new Client({
    user: "arham",
    host: "localhost",
    database: "mydb",
    port: 5432,
    password: '123'
})

client.connect(function(err) {
    if(err) {
        console.log(err);
    }
    else{
        let query = "create table auth (username text primary key, email text, password text);"
        client.query(query, function(err, res){
            if(err){
                console.log(err);
            }
            else{
                console.log("created table auth");
            }
        })
    }        
});



module.exports = client;
