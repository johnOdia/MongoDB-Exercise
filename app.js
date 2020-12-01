const express = require('express')
const app = express()
const mongoose = require('mongoose')
const owners = require('./routes/owners')
const PORT = process.env.PORT || 3000

app.use(express.json())

mongoose.set('useFindAndModify', false);
//Routes
app.use('/owners', owners)

//connect to DB
mongoose.connect('mongodb+srv://john:56465646@cluster0.sekl8.mongodb.net/MONGO?retryWrites=true&w=majority', { useUnifiedTopology: true }, { useNewUrlParser: true }, () => console.log('DB connected!'))

app.listen(PORT, () => console.log(`server started at ${PORT}`))