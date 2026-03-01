const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const logger = require('../modules/logger');
const usersPath = path.join(__dirname, '../database/users.json');

function hashPassword(rawPassword){
    return new Promise(async (resolve, reject)=>{
        try {
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            resolve(hashedPassword);
        } catch (error) {
            reject(error);
        }
    })
}

function authUser(user, password, done){
    const usersDbRaw = fs.readFileSync(usersPath);
    const usersDb = JSON.parse(usersDbRaw);
    if(usersDb[user] == null){ // user not found
        logger.warn({"description": `User ${user} not found!`});
        return done(null, false);
    }else{
        const dbPassword = usersDb[user].password;
        
        bcrypt.compare(password, dbPassword, (err, res)=>{
            if(err){
                logger.error({"function": "authUser", "description": `Error while authenticating user (bcrypt)`, "error": err});
                return done(null, false);
            }else{
                if(res){ // good login - passwords match
                    logger.info({"description": `User ${user} was succesfully logged in!`});
                    return done(null, {login: user});
                }else{
                    logger.warn({"description": `User ${user} password was incorrect!`});
                    return done(null, false);
                }
            }
        })

    }
}

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()) { return next() }
    res.redirect("/dashboard/login");
}

async function changePassword(username, passData, response){

    // Sprawdzamy czy stare hasło się zgadza
    let usersDb = fs.readFileSync(usersPath);
    usersDb = JSON.parse(usersDb);

    bcrypt.compare(passData.oldPass, usersDb[username].password, async (err, res)=>{
        if(err){
            logger.error({"function": "changePassword", "description": `Error while authenticating user (bcrypt)`, "error": err});
            // Info code: 1 - wrong old password, 2 - error while saving data, 3 - error while comparing bcrypt data 
            response.status(200).json({status: "error", infoCode: 3});
        }else{
            if(res){
                const newHashedPassword = await hashPassword(passData.newPass);
                let newUsersDb = usersDb;
                newUsersDb[username].password = newHashedPassword;

                fs.writeFile(usersPath, JSON.stringify(newUsersDb), (err)=>{
                    if(err){
                        // Info code: 1 - wrong old password, 2 - error while saving data, 3 - error while comparing bcrypt data
                        response.status(200).json({status: "error", infoCode: 2});
                        logger.error({"function": `changePassword`, "description": "Error while saving users.json file"});
                    }else{
                        response.status(200).json({status: "success"});
                    }
                })
            }else{ // wrong old password
                // Info code: 1 - wrong old password, 2 - error while saving data, 3 - error while comparing bcrypt data 
                response.status(200).json({status: "error", infoCode: 1});
            }
        }
    })
}

module.exports = {hashPassword, authUser, checkAuthenticated, changePassword};