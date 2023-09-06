const express = require ('express');
const cors = require ('cors')

const app  = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use(cors())


app.use((err, req, res, next)=>{
    res.json({Error: err})
})

app.listen(4500, ()=>{
    console.log('Server running on port 4500');
})