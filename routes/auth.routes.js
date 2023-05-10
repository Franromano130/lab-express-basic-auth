const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js")
const bcrypt = require("bcryptjs")


router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

router.post("/signup", async (req, res, next) => {
  console.log(req.body)

  
  const { username, email, password } = req.body

  

  
  if (email === "" || password === "") {
    console.log("el email o la contraseña estan vacios")
    res.render("auth/signup.hbs", {
      errorMessage: "Los campos de email y contraseña son obligatorios",
     
    })
    return  
  }

  // validación de contraseña
  const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  if (regexPattern.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "La contraseña no es suficientemente fuerte. Necesita al menos, una mayuscula, una minuscula, un caracter especial y minimo 8 caracteres.",
    })
    return  
  }

  try {

    const foundUser = await User.findOne({ email: email })
 
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Ya existe un usuario con ese correo electronico",
      })
      return 
    } // todo probar la ruta cuando tengamos usuarios en la BD

   
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)
    console.log(hashPassword)

   
    await User.create({
      username: username,
      email: email,
      password: hashPassword
    })

  
    res.redirect("/auth/login")

  } catch (error) {
    next(error)
  }
})

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})

router.post("/login", async (req, res, next) => {
  console.log(req.body)

  try {
       
    const isPasswordCorrect = await bcrypt.compare(req.body.password, foundUser.password)
    console.log(isPasswordCorrect)
    if (isPasswordCorrect === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Contraseña no valida",
       
      })
      return 
    }

  req.session.user = foundUser 

  req.session.save(() =>{

    res.redirect("/profile")
  })
    
  } catch (error) {
    next(error)
  }
})

router.get("/logout", (req, res, next) => {
  

  req.session.destroy(() => {

   
   res.redirect("/")

  }) 
})


module.exports = router;