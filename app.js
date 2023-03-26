// !!Learn promises (.then .catch  ) and async functions

const express=require("express");
const app=express();
const mongoose=require("mongoose");

app.use(express.urlencoded());
app.use(express.static("public"));
// set the view engine to ejs
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://himank:pass123@cluster0.yfk8kim.mongodb.net/todolistDB", {useNewUrlParser: true});
//creating schema
const itemsSchema=  {
    name:String
}
const Item =mongoose.model("Item",itemsSchema);
const item1 = new Item({
    name:"Welcome to Your ToDo List"
})
const item2 = new Item({
    name:"Hit the + button to add a new task"
})
const item3 = new Item({
    name:"<-- Hit the checkbox to delete a task"
})
const defaultItems=[item1,item2,item3];

//custom lists
const ListSchema={
    name : String,
    items : [itemsSchema]
}
const List=new mongoose.model("List",ListSchema);

app.get("/",function(req,res){
    
    Item.find({}).then(function(foundItems){
        if(foundItems.length === 0){
           Item.insertMany(defaultItems) 
          .then(function(){
           console.log("Successfully saved all the items to todolistDB");
             })
          .catch(function(err){
        console.log(err);
                 });
          res.redirect("/");
        }
        else{
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
       
      })
      .catch(function(err){
        console.log(err);
      });

});


app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName.toLowerCase();
    List.findOne({name:customListName})
      .then(function(foundList){
          
            if(!foundList){
              const list = new List({
                name:customListName,
                items:defaultItems
              });
            
              list.save();
              console.log("saved");
              res.redirect("/"+customListName);
            }
            else{
              res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
            }
      })
      .catch(function(err){});
    })



app.post("/",function(req,res){
const itemName=req.body.newItem;
const title=req.body.list;
const item= new Item({
    name: itemName,
})
if(title === "Today"){
    item.save();
    res.redirect("/");
}   
else{
 List.findOne({name: title})
 .then(function (foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+title);
 })
 .catch(function(err){});

}

});


//for deleting post
app.post("/delete",function(req,res){
    const checkedItemId= req.body.checkbox.trim();
    const title=req.body.title;
    if(title==="Today"){
        Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})})  ;
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({name: title}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList)
          {
            res.redirect("/" + title);
          });
      }
      
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server  running ON" +process.env.PORT);
})


