import express from 'express'
import dotenv from 'dotenv'
import dbconnection from '../connection/connection.mjs'
import session from 'express-session'
import bodyParser from 'body-parser'
dotenv.config()
const app = express()
const PORT = process.env.PORT

app.set('view engine','ejs')
app.set('views','./views')

app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret:process.env.APP_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//FRONT

app.get('/', (req, res) => {
    res.render('index',{title: "LOGIN"})
})

app.get('/register', (req, res) => {
    res.render('register', {title: "REGISTER"})
})

app.get('/home', async (req, res) => {
    try
    {
        const user_id = req.session.user_id

        if(req.session.user_id)
        {
            const response = await fetch(`http://localhost:3040/api/v1/user/account/${user_id}`)
            if(!response.ok){
                console.log(`${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            res.render('home', {title: "HOME", account: data})
        }
        else
        {
            res.redirect('/')
        }
    }
    catch(err)
    {
        console.error(err)
    }
})

app.get('/forgot', (req, res) => {
    res.render('forgot', {title: "FORGOT"})
})

app.get('/changepassword/:email', (req, res) => {
    const email = req.params.email
    console.log(email)
    res.render('changepassword', {title: "CHANGE PASSWORD" , email: email.toUpperCase() })
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err)
            throw err
        res.redirect('/')
    })
})


// ROUTES
import UserRoute from '../routes/user.mjs'
app.use('/api/v1/user/', UserRoute)

app.listen(PORT, ()=> {
    try
    {
        dbconnection.connect((err) => {
            if(err)
                throw err
            console.log(`App is litening to the port ${PORT} and Connected to the ${process.env.APP_DATABASE}`)
        })
    }
    catch(err)
    {
        console.error(`${err}`)
    }
})