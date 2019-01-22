const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../models/userSechema");
const Item = require("../../models/itemSchema");


const itemHelper = itemsId => {
  return Item
    .find({_id: {$in: itemsId}})
    .then(items => {
      return items.map(item => {
        return {
          ...item._doc,
          _id: item.id,
          creator: userHelper.bind(this,item.creator)
        }
      });
    })
    .catch(err => {
      throw err.message;
    });
}

const userHelper = userId => {
  return User
    .findById(userId)
    .exec()
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdItems: itemHelper.bind(this,user.createdItems)
      }
    })
    .catch(err => {
      throw err.message;
    });
}


module.exports = {
  //Getting All Of The Users....
  users: () => {
    return User
      .find()
      .exec()
      .then(users => {
        //console.log(users);
        return users.map(user => {
          return { 
            ...user._doc,
            password: null,
            _id: user.id,
            createdItems: itemHelper.bind(this,user.createdItems)
          }
        });
      })
      .catch(err => {
        console.log(err.message);
        throw err.message;
      });
  },

  //Create User........
  createUser: (args) => {
    //Find for duplicate email id
    return User
      .findOne({email: args.userInput.email})
      .exec()
      .then(user => {
        if (user) {
          throw new Error('invalid email id...');
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashPassword => {
        let newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: args.userInput.name,
          email: args.userInput.email,
          password: hashPassword
        });
        return newUser.save();
      })
      .then(user => {
        return { ...user._doc, password: null, _id: user.id.toString() };
      })
      .catch(err => {
        throw err.message;
      });
  },

  //Getting All Of The Items.......
  items: () => {
    return Item
      .find()
      .exec()
      .then(items => {
        if (items.length < 1) {
          throw new Error('items not found...');
        }
        return items.map(item => {
          return {
            ...item._doc,
            _id: item.id,
            creator: userHelper.bind(this,item.creator)
          }
        });
      })
      .catch(err => {
        throw err.message;
      });
  },

  //Create Items..............
  createItem: (args) => {
    let newItem = Item({
      _id: new mongoose.Types.ObjectId(),
      name: args.itemInput.name,
      price: args.itemInput.price,
      creator: args.itemInput.creatorId
    });

    let createdItems;
    return newItem
      .save()
      .then(item => {
        createdItems = {
          ...item._doc,
          _id: item.id
        };
        return User.findById(args.itemInput.creatorId).exec()
      })
      .then(user => {
        if (!user) {
          throw new Error('user not exist...');
        }
        user.createdItems.push(newItem);
        return user.save();
      })
      .then(user => {
        return createdItems;
      })
      .catch(err => {
        throw err.message;
      });
  }
}