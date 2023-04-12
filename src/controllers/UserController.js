const { validationResult, matchedData } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const State = require('../models/State');
const User = require('../models/User');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

module.exports = {
    getStates: async (req, res) => {
        let states = await State.find();
        res.json({ states });
    },
    info: async (req, res) => {
        let token = req.query.token;
        //let { token } = req.query;
        const user = await User.findOne({ token });
        const state = await State.findById(user.state);
        const ads = await Ad.find({ idUser: user._id.toString() });
        let adList = [];
        for (let item in ads) {
            const cat = await Category.findById(ads[item].category);
            adList.push({
                id: ads[item]._id,
                status: ads[item].status,
                images: ads[item].images,
                dateCreated: ads[item].dateCreated,
                title: ads[item].title,
                price: ads[item].price,
                priceNegotiable: ads[item].priceNegotiable,
                description: ads[item].description,
                views: ads[item].views,
                category: cat.slug
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList
        });
    },
    editAction: async (req, res) => {
        const erros = validationResult(req);
        if(!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }
        const data = matchedData(req);
        let updates = {};
        if(data.name) {
            upadates.name = data.name;
        }
        if(data.email) {
            const emailCheck = await User.findOne({ email: data.email });
            if (emailCheck) {
                res.json({ error: 'E-mail já existente!' });
                return;
            }
            updates.email = data.email;
        }
        if(data.state) {
            if(mongoose.Types.ObjectId.isValid(data.state)) {
                const stateItem = await State.findById(data.state);
                if(!stateItem) {
                    res.json({
                        error: { state: {msg: 'Estado não existe'}}
                    });
                    return;
                }
                updates.state = data.state;
            } else {
                res.json({
                    error: { state: { msg: 'Código de estado inválido'}}
                });
                return;
            }
        }
        if (data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }
        await User.findOneAndUpdate({ token: data.token }, { $set: updates });
        res.json({ update: 'ok' });
    }
}