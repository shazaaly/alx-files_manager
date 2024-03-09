const {MongoClient} = require('mongodb')
const HOST = process.env.DB_HOST || 'localhost'
const PORT = process.env.DB_PORT || 27017
const DB_DATABASE  = process.env.DB_DATABASE || 'files_manager'
const url = `mongodb://${HOST}:${PORT}/${DB_DATABASE}`

class DBClient{
    constructor(){
        this.client = new MongoClient.connect(url, {useUnifiedTopology: true})
        this.client.then(() => {
            this.db = this.client.db(`${DB_DATABASE}`)

        }).catch((error) => {
            console.log(error)
        })

    }
    isAlive(){
        return this.client.isConnected()
    }
    async nbUsers(){
        const users = this.db.collection('users')
        const num = await users.countDocuments()
        return num

    }





}

module.exports = DBClient