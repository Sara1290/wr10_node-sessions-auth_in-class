const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        //bring in out db, recieve info to eventuall add new user, check in an existing user matches the email --- email already in use
        //hash and salt the password too. add user to db with the user table. and get back their id. this is a post handler. create a session for user using the db response. and send the repsonse that inclueds session info to the front end.
        const db = req.app.get('db');
        const { name, email, password, admin } = req.body;
        try {
            const [existingUser] = await db.get_user_by_email(email)

            if (existingUser) {
                return res.status(409).send('User Already Exists')
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const [newUser] = await db.register_user(name, email, hash, admin);

            req.session.user = newUser;

            res.status(200).send(newUser);

        }catch(err){
            console.log(err)
            return res.sendStatus(500)
        }
    },
    login: (req, res) => {
        const db = req.app.get('db');
        const { email, password } = req.body;
        db.get_user_by_email(email)
        .then(([existingUser]) => {
            if(!existingUser) {
                res.status(403).send("Incorrect email")
            }
            const isAuthenticated = bcrypt.compareSync(password, existingUser.hash)

            if(!isAuthenticated) {
                return res.status(403).send("Incorrect Password")
            }
            delete existingUser.hash


            req.session.user = existingUser;

            res.status(200).send(req.session.user)

        })
    },
    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);

    }
}