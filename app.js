let express = require("express")
let app = express()

let path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


let mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/ronyFarm2")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

let Element = require("./models/product");
let Farm = require('./models/farm')
app.use(express.urlencoded({ extended: true }));

let methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static('public'))


// FARM ROUTES

app.get('/farms',async(req,res)=>{
    let list = await  Farm.find({})
    res.render('farm/list',{list})
})


app.get('/farms/new',(req,res)=>{
    res.render('farm/new')
})

app.post('/farms',async(req,res)=>{
    let newFarm =new Farm(req.body)
     newFarm.save()
    res.redirect('/farms')
})
app.get('/farms/:id',async(req,res)=>{
    let {id} = req.params
    let show = await Farm.findById(id).populate('products')
    res.render('farm/show',{show})
})


app.get('/farms/:id/product/new',async(req,res)=>{
    let {id} = req.params
    let farm = await Farm.findById(id)
    res.render('results/new',{categories,farm})
})

app.post('/farms/:id/product',async(req,res)=>{
  let {id} = req.params
  let aFarm = await Farm.findById(id)
  let {name,price,category} = req.body
  let newProduct = new Element({name,price,category})
  aFarm.products.push(newProduct)
  newProduct.farm = aFarm
  await aFarm.save()
  await newProduct.save()
  res.redirect(`/farms/${id}`)
})



// PRODUCT ROUTES

let categories = ["fruit", "vegetable", "diary", "dryfood"]

app.get('/sample',async(req,res)=>{
    let {category} = req.query
    if(category)
    {
        let list = await Element.find({category}) 
        res.render('results/list' , {list,category})
    }else{
        let list = await Element.find({})
        res.render('results/list' , {list,category:"All"})
    }
})

app.get('/sample/new',(req,res)=>{
  res.render('results/new')
})

app.post('/sample',async(req,res)=>{
  let newElement = new Element(req.body)
  newElement.save()
  res.redirect(`/sample/${newElement._id}`)
})

app.get('/sample/:id',async (req,res)=>{
  let {id}= req.params
  let show = await Element.findById(id).populate('farm','name')
  console.log(show)
  res.render('results/show' , {show})
})

app.get('/sample/:id/edit',async(req,res)=>{
  let {id}= req.params
  let edit = await Element.findById(id)
  res.render('results/edit',{edit})
})

app.put("/sample/:id",async(req,res)=>{
  let {id} = req.params
  let put = await Element.findByIdAndUpdate(id , req.body , {runValidators:true , new : true})
  res.redirect(`/sample/${put._id}`)

})

app.delete('/sample/:id',async(req,res)=>{
  let {id} = req.params
  let dlt = await Element.findByIdAndDelete(id)
  res.redirect('/sample')
})


app.listen(2580,()=>{
    console.log("listen")
})