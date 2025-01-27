const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if (req.session.authorization){
        const token = req.session.authorization;
        jwt.verify(token, "accesspwd", (err, decoded) => {
            if (!err) {
                next()
            }else{
                return res.status(403).json({message: "User not authenticated"})
            }
        })
    };
    return res.status(403).json({message: "User not logged"})
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(5000, () => {
    console.log("Server on port "+PORT)
})
