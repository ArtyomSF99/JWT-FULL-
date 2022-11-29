const express =require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const authRouter = require('./routes/auth_routes')
const errorMiddleware = require('./middlewares/error_middleware')


const PORT = process.env.PORT || 8000

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use('/', authRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
    
})