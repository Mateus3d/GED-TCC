//import express from 'express'
const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')
const app = express()
// const {checkToken} = require('./controllers/AuthController.js')
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@ged.wuizc8i.mongodb.net/?retryWrites=true&w=majority`,
{useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors())
app.use(express.json())
app.use('/files',express.static(path.resolve(__dirname,'..','uploads'))) //Isso permite q nessa rota rode os arquivos upados
// app.use(checkToken)
app.use(routes)




app.listen(3333)