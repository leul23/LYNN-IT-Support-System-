const express = require('express')
const Plan = require('../models/plan')
//use express router
const router = express.Router()

router.get('/new', (req,res) => {
    res.render('plans/new', {plan: new Plan () })
})

router.get('/edit/:id', async (req,res) => {
    const plan = await Plan.findById(req.params.id)
    res.render('plans/edit', {plan:plan})
    
})

router.get('/:slug', async (req, res) => {
    const plan = await Plan.findOne({slug: req.params.slug})
    if(plan == null) res.redirect('/')
    res.render('plans/show', {plan:plan})
}) 

router.post ('/', async (req,res,next) => {
    req.plan = new Plan()
    next()
}, saveArticleAndRedirect('new'))

router.put ('/:id', async (req,res,next) => {
    req.plan = await Plan.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', async (req,res) => {
    await Plan.findByIdAndDelete(req.params.id)
    res.redirect('/plan')
})

function saveArticleAndRedirect(path){
    return async(req,res) => {
        let plan = req.plan
            plan.fullname = req.body.fullname,
            plan.account = req.body.account,
            plan.deposit = req.body.deposit,
            plan.selectedplan = req.body.selectedplan
        
            try {
            plan = await plan.save()
            res.redirect(`/premium_page`)
            }
            catch (e){
                res.render('plans/show', {plan: plan})
            }
    }
}
//export to use the router
module.exports = router