

const { error } = require("console")

const fetchData = async() =>{
    const response = await fetch('https/127.0.0.1:7979/product/all')
    const result = await response.json()

    return result
} 

fetchData.then( data =>{
    console.log(data)

}).catch(error=>{
    console.log(error)
})