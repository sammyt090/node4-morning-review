const bcrypt = require('bcrypt')
module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')


        let user = await db.check_user(username)

        if(user[0]){
            return res.status(400).send("Email already exists")
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        let newUser = await db.register_user(username, hash)

        req.session.user = newUser[0]
        delete req.session.user.password
        res.status(201).send(req.session.user)
    },


    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let user = await db.check_user(username)

        if (!user[0]) {
            return res.status(400).send ('You dont exist')

        }

        let authenticated = bcrypt.compareSync(password, user[0].password)

        if (!authenticated){
            return res.status(401).send('Password is incorrect')
        }
            delete user[0].password
            req.session.user[0]
            res.status(202).send(req.session.user)
        
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },


    getUser: ( req, res) => {
        if(req.session.user){
            res.status(200).send(req.session.user)
        } else{
            res.status(204).send('No one logged in')
        }

    }
}