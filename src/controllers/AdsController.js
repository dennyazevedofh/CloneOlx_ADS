const { v4: uuidv4 } = require('uuid');
const jimp = require('jimp');
const { validationResult, matchedData } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const State = require('../models/State');
const User = require('../models/User');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

const addImage = async (buffer) => {
  let newName = `${uuidv4()}.jpg`;
  let tmpImg = await jimp.read(buffer);
  tmpImg.cover(500,500).quality(80).write(`./public/media/${newName}`);
  return newName;
}

module.exports = {
  getCategories: async (req,res) => {
    const cats = await Category.find();
    let categories = [];
    for (let i in cats) {
      categories.push({
        ...cats[i]._doc,
        img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
      })
    }
    res.json({ categories });
  },
  addAction: async (req, res) => {
    let { title, price, priceneg, desc, cat, token } = req.body;
    const user = await User.findOne({ token }).exec();
    if(!title || !cat){
      res.json({ error: 'Titulo e/ou categoria não foram preenchidos' });
      return;
    }
    if(!mongoose.Types.ObjectId.isValid(cat)) {
      res.json({ error: 'ID de categoria inválido' });
      return;
    }
  }
}