import crypto from 'crypto'
import dbconnection from '../connection/connection.mjs'
import session from 'express-session'


export const createUser = (req, res) => {
    const email = req.body.email
    const fullname = req.body.fullname
    const password = req.body.password
    const hashed = crypto.createHash("md5").update(password).digest("hex")
    console.log(email, fullname, password, hashed)
    const validateUser = `SELECT * FROM famtest_user WHERE email = ?`
    dbconnection.query(validateUser, [email], (err, rows) => {
        if(err)
            throw err
        if(rows.length == 0)
        {
            const createUser = `INSERT INTO famtest_user (email, password, unhashed, fullname) VALUES (?,?,?,?)`
            dbconnection.query(createUser, [email, hashed, password, fullname], (err) => {
                if(err)
                    throw err
                res.redirect('../../../')
                // res.render('index', {title: "LOGIN"})
            })
        }
        else
        {
            res.redirect('../../../register')
        }
    })
}

export const loginUser = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const hashed = crypto.createHash("md5").update(password).digest("hex")
    const login = `SELECT * FROM famtest_user WHERE email = ? AND password = ?`
    dbconnection.query(login, [email, hashed], (err, rows) => {
        if(err)
            throw err
        if(rows.length > 0)
        {
            req.session.user_id = rows[0].user_id
            res.redirect('../../../home')
        }
        else
        {
            res.redirect('../../../')
        }
    })
}

export const forgotUser = (req, res) => {
    const email = req.body.email
    const checkAccount = `SELECT * FROM famtest_user WHERE email = ?`
    dbconnection.query(checkAccount, [email], (err, rows) => {
        if(err)
            throw err
        if(rows.length > 0)
        {
            res.redirect(`../../../changepassword/${rows[0].email}`)
        }
        else
        {
            res.redirect('../../../forgot')
        }
    })
}


export const changePassword = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const hashed = crypto.createHash("md5").update(password).digest("hex")
    const changepassword = `UPDATE famtest_user SET password = ?, unhashed = ? WHERE email = ?`
    dbconnection.query(changepassword, [hashed, password, email], (err) => {
        if(err)
            throw err
        res.redirect('../../../')
    })
}

export const viewUser = (req, res) => {
    const user_id = parseInt(req.params.user_id)
    const validateAccount = `SELECT * FROM famtest_user WHERE user_id = ?`
    dbconnection.query(validateAccount, [user_id], (err, rows) => {
        if(err)
            throw err
        if(rows.length > 0)
        {
            const userCheck = rows[0]
            res.status(200).send({userCheck})
        }
        else
        {
            res.status(500).send({})
        }
    })
}