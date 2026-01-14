const User = require("../libs/models/user.model");
const bcrypt = require("bcrypt");

const {body, validationResult} = require('express-validator');

const validateSignup = [
  body('email','Email must not be empty').notEmpty(),
  body('email','Email must be valid').isEmail(),
  body('password','Password must not be empty').notEmpty(),
  body('password','Password must be at least 6 characters long').isLength({min:6}),
  body('repeatPassword','Repeat Password must not be empty').notEmpty(),
  body('repeatPassword').custom((value,{req})=>{
    if(value !== req.body.password){
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];


const signup = async (req, res) => {
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    //There are validation errors
    const errors = validationErrors.array();
    req.flash('errors',errors);
    req.flash('data',req.body);
    return  res.redirect('/signup');
  }
  const { email, password } = req.body;
  const query = { email };
  const existingUser = await User.findOne(query);
  if (existingUser) {

    //Email already registered
    req.flash('data',req.body);
    req.flash('info',{
      message:'Email is already registered. Try to login instead.',
      type:'error'

    })
    res.redirect("/signup");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
    };
    const result = await User.create(user);
    req.session.userId = result._id;
    req.flash('info',{
      message:'Signup successful! Welcome to EcoLuxe Invoice.',
      type:'success'
    });
    res.redirect("/dashboard");
  }
};

const validateLogin = [
  body('email','Email must not be empty').notEmpty(),
  body('email','Email must be valid').isEmail(),
  body('password','Password must not be empty').notEmpty(),
];

const login = async (req, res) => {
  const validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
    //There are validation errors
    const errors = validationErrors.array();
    req.flash('errors',errors);
    req.flash('data',req.body);
    return  res.redirect('/login');
  }
  const { email, password } = req.body;
  const query = { email };
  const existingUser = await User.findOne(query);
  if (existingUser) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordMatch) {
      req.session.userId = existingUser._id;
      req.flash('info',{  
        message:'Login successful! Welcome back to EcoLuxe Invoice.',
        type:'success'
      });
      res.redirect("/dashboard");
    } else {
      //Incorrect password
      req.flash('info',{
        message:'Incorrect Email/Password. Please try again.',
        type:'error'
      });
      req.flash('data',req.body);
      res.redirect("/login");
    }
  }else {
    //User not found
    req.flash('info',{
      message:'Email is not registered. Please try again.',
      type:'error'
    });
    req.flash('data',req.body);
    res.redirect("/login");
  }
};

const logout = (req, res) => {
  req.session.userId = null;
  req.flash('info',{
    message:'You have been logged out successfully.',
    type:'success'
  });
  res.redirect("/");
};

module.exports = {
  signup,
  validateSignup,
  login,
  validateLogin,
  logout
};

