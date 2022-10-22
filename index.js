
const requests = require('request')
const express = require('express')
const app = express()
const fs = require('fs')


const homeFile= (fs.readFileSync('./public/home.html')).toString()


//To connect html with css through node
app.use(express.static('./public'))


const replaceValue = (tempValue, originalValue)=>{
        let temp = tempValue.replace( '{%temp%}' , Math.round(originalValue.main.temp - 273.15))
        temp = temp.replace('{%tempMin%}',Math.floor(originalValue.main.temp_min - 276.15))
        temp = temp.replace('{%tempMax%}', Math.floor(originalValue.main.temp_max - 270.15))
        temp = temp.replace('{%city%}', originalValue.name)
        temp = temp.replace('{%icon%}', originalValue.weather[0].main)
        temp = temp.replace('{%icon%}', originalValue.weather[0].main)
    
        return temp
}

// Routes
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/cityName',  (req,res)=>{
    if(req.url == `/cityName?city=${req.query.city}`){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=abcef5512beb63afd64b285e7491ae0c`)
        .on('data', (chunk)=>{
            const objData = JSON.parse(chunk) 
            const arrData = [objData]

            const realTimeData = arrData.map((val)=> {
                return replaceValue(homeFile, val)
            }).join('');
            
            res.write(realTimeData)
        })
        .on('end',()=>{
            res.end()
        
        })

        .on('error',(err)=>{
            res.status(500).json({msg:`Something bad happened please try again later, ERROR - ${err}`})
        })
    }
    else{
        res.status(400).json({msg:'Please provide a vaid city name'})
    }
   
})


const port = 3000
app.listen(port, '127.0.0.1')


