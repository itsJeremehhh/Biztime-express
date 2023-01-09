/** Database setup for BizTime. */
const { Client } = require("pg");

const client = new Client({
    connectionString: "postgresql:///biztime"
});

client.connect();

module.exports = client;

//where would this export too? 
//look out for a "app.use("/client", Client)" somewhere"
