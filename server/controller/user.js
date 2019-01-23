let userModel = require('../models/user');

let umodel = new userModel();

let consola = console.log;

saveUser = (req, res) => {
    let params = req.body;

    consola(params);
}

module.exports = {
    saveUser
}