import express from 'express'
const router = express.Router()
import {createUser, loginUser, forgotUser, changePassword, viewUser} from '../controller/userController.mjs'


router.post('/loginuser', loginUser)

router.post('/createuser', createUser)

router.post('/forgot', forgotUser)

router.post('/changepassword', changePassword)

router.get('/account/:user_id', viewUser)


export default router