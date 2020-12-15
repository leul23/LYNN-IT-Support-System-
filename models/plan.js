const mongoose = require('mongoose')
const marked =  require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const plansSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required: true
    },
    account: {
        type: String
    },
    deposit: {
        type:String,
        required: true
    },
    selectedplan: {
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
plansSchema.pre('validate', function (next){
    if(this.fullname){
        this.slug = slugify(this.fullname, {lower: true, strict: true})
    }
    if(this.account){
        this.sanitizedHtml = dompurify.sanitize(marked(this.account)) 
        
    }
    next()
})
module.exports = mongoose.model('Plan', plansSchema)