//IMPORT 
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
require("dotenv").config();


//VARIABLES
const PORT= 5000 || process.env.PORT;
const LINK="mongodb://localhost:27017/TO-DO-LIST"||process;


//MIDDLEWARE
const app=express();
app.use(cors());
app.use(express.json());


//DB CONNECTION
mongoose.connect(LINK).then(()=>{console.log("DB CREATED")}).catch(()=>{console.log("DB ERROR")});

//DB SCHEMA DESIGN
const MY_SCHEMA=mongoose.Schema({text:{type:String,required:true}});

//DB MODEL
const MY_MODEL=mongoose.model("MY_MODEL",MY_SCHEMA);


//ROUTES
//GET
app.get("/api", async(req,res)=>{
    try{
        const Info=await MY_MODEL.find();
        res.json(Info);
    }
    catch(error){
        res.json(error.message);
    }
})

//POST
app.post("/api/post", async(req,res)=>{
    const newtext=MY_MODEL(req.body);
    await newtext.save();
    res.json(`New Task Added : ${newtext.text}`); 
})

//PUT
app.put("/api/update/:id", async (req, res) => {
    try {
        const updatedTask = await MY_MODEL.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTask) {
            return res.json("Task not found");
        }

        res.json("Task updated successfully");
    } catch (error) {
        res.json(error.message);
    }
});

//DELETE
app.delete("/api/delete/:id",async(req,res)=>{
    try{
        const deleteTask=await MY_MODEL.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
        return res.json("Task not found");
    }
        res.json("Task deleted Successfully");
    }
    catch(error){
        res.json(error.message);
    }
})


//APP LISTEN
app.listen(PORT,()=>{console.log("Server is running on PORT 5000")}); 