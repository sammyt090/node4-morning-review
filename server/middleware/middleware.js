module.exports ={
    checkUsername: (req, res, next) => {
        if(req.body.username.includes('@') && req.body.username.includes('.')){
        next()
    } else {
      return  res.status(403).send('Invalid Email')
    }
}
}