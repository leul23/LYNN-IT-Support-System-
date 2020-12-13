const express = require('express')
const Request = require('./../models/request')
//use express router
const router = express.Router()

router.get('/new', (req,res) => {
    res.render('requests/new', {request: new Request () })
})

router.get('/edit/:id', async (req,res) => {
    const request = await Request.findById(req.params.id)
    res.render('requests/edit', {request:request})
    
})

router.get('/:slug', async (req, res) => {
    const request = await Request.findOne({slug: req.params.slug})
    if(request == null) res.redirect('/')
    res.render('requests/show', {request:request})
}) 

router.post ('/', async (req,res,next) => {
    req.request = new Request()
    next()
}, saveArticleAndRedirect('new'))

router.put ('/:id', async (req,res,next) => {
    req.request = await Request.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', async (req,res) => {
    await Request.findByIdAndDelete(req.params.id)
    res.redirect('/request')
})

function saveArticleAndRedirect(path){
    return async(req,res) => {
        let request = req.request
            request.title = req.body.title,
            request.description = req.body.description,
            request.markdown = req.body.markdown
        
            try {
            request = await request.save()
            res.redirect(`/premium_page`)
            }
            catch (e){
                res.render('requests/show', {request: request})
            }
    }
}
//export to use the router
module.exports = router