//import express from 'express'
const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')

const app = express()

mongoose.connect('mongodb+srv://oministack:oministack@oministack09.ed6ms.mongodb.net/<dbname>?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true})

app.use(cors())
app.use(express.json())
app.use('/files',express.static(path.resolve(__dirname,'..','uploads'))) //Isso permite q nessa rota rode os arquivos upados
app.use(routes)




app.listen(3333)