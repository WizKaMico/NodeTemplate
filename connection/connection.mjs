import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

const dbconnection = mysql.createConnection({
    'host':process.env.APP_HOST,
    'user':process.env.APP_USER,
    'password':process.env.APP_PASSWORD,
    'database':process.env.APP_DATABASE
})

export default dbconnection