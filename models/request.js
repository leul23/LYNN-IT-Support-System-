const mongoose = require('mongoose')
const marked =  require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const requestsSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type:String,
        required: true
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
     type: String,
     required: true   
    }
})
requestsSchema.pre('validate', function (next){
    if(this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    if(this.location){
        this.sanitizedHtml = dompurify.sanitize(marked(this.location)) 
        
    }
    next()
})
module.exports = mongoose.model('Request', requestsSchema)