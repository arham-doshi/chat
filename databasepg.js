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
         
});

const findOne = async (username) => {
    
    const query = `select * from auth where username = '${username}'`;
    console.log("executing query", query);
    try {
        const res = await client.query(query);
        console.log(`number of users with name ${username} is ${res.rowCount}`);
        if(res.rowCount == 0) return ;
    
        const user = res.rows[0];
        return user
    }
    catch (err){
        console.log(err);
    }
    return ;
    
}

const addOne = async (user, email, password)=>{
    let query = `insert into auth values ('${user}', '${email}', '${password}')`;
    try{
        console.log("executing query", query);
        await client.query(query, (err) => {
            if(err){
                console.log("error while adding user to db", err.message);
            }
        });
        return true;
    }
    catch (err) {
        console.log(err);
    }
    return false;
}



module.exports = client;
module.exports.findOne = findOne;
module.exports.addOne = addOne;