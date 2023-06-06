let express = require("express");

let app = express();

app.use(express.json());

app.use(function (req, res, next) {

res.header("Access-Control-Allow-Origin","*");

res.header(

"Access-Control-Allow-Methods",

"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

);

res.header(

"Access-Control-Allow-Headers",

"Origin, X-Requested-With, Content-Type, Accept"

);

next();

});
var port=process.env.port || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let {data}=require("./assignment8B.js");
let {products,purchases,shops}=data;
const {Client} =require("pg");
const client =new Client({
    user:"postgres",
    password:"RaghavSatyam@123",
    database:"postgres",
    port:5432,
    host:"db.umnxbvgodcgisciyjqir.supabase.co",
    ssl:{rejectUnauthorized:false},
});
    client.connect(function(res,error){
    console.log(`Connected!!!`);
});

var format = require('pg-format');

app.get("/purchases",function(req,res,next){
    let shopId=req.query.shop;
    let productIds=req.query.product?req.query.product.split(","):"";
    let sort=req.query.sort;
    const query="SELECT * FROM purchases";
    client.query(query,function(err,result){
         if(err){res.status(400).send(err)}
         else{
            let purchasesData=result.rows;
        if(shopId){
        purchasesData=purchasesData.filter(k=>`st${k.shopid}`===shopId);
    }
    if(productIds){
        purchasesData=purchasesData.filter(k=>productIds.find(j=>j===`pr${k.productid}`));
    }
    if(sort){
        if(sort==="QtyAsc"){
         purchasesData=purchasesData.sort((c1,c2)=>+c1.quantity-(+c2.quantity));
        }
        else if(sort==="QtyDesc"){
          purchasesData=purchasesData.sort((c1,c2)=>+c2.quantity-(+c1.quantity));
        }
        else if(sort==="ValueAsc"){
          purchasesData=purchasesData.sort((c1,c2)=>+c1.quantity*c1.price-(+c2.quantity*c2.price));
        }
        else if(sort==="ValueDesc"){
         purchasesData=purchasesData.sort((c1,c2)=>+c2.quantity*c2.price-(+c1.quantity*c1.price));
        }
    }
            // console.log(purchasesData);
            res.send(purchasesData);
        }
    })
    // client.end();
});
app.get("/products/:prodname",function(req,res,next){
    let prodname=req.params.prodname;
    // console.log(department);
    const sql="SELECT * FROM products WHERE  productname=($1)";
    client.query(sql,[prodname],function(err,result){
         if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    })
});
app.get("/products",function(req,res,next){
    const query="SELECT * FROM products";
    client.query(query,function(err,result){
         if(err){res.status(400).send(err)}
         else{
            // console.log(result.rows);
            res.send(result.rows);
        }
    })
    // client.end();
});
app.get("/shops",function(req,res,next){
    const query="SELECT * FROM shops";
    client.query(query,function(err,result){
         if(err){res.status(400).send(err)}
         else{
            // console.log(result.rows);
            res.send(result.rows);
        }
    })
    // client.end();
});

app.get("/purchases/shops/:id",function(req,res,next){
    let id=req.params.id;
    const sql="SELECT * FROM purchases WHERE  shopid=($1)";
    client.query(sql,[id],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    })
});
app.get("/purchases/products/:id",function(req,res,next){
    let id=req.params.id;
    const sql="SELECT * FROM purchases WHERE  productid=($1)";
    client.query(sql,[id],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    })
});
app.get("/totalPurchase/shop/:stId",function(req,res,next){
    let stId=req.params.stId;
    const sql="select shopid,COUNT(productid) as totalItem, SUM(quantity) as totalQuantity from purchases where shopid=($1) group by shopid";
    client.query(sql,[stId],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    });
});
app.get("/totalPurchase/product/:prodId",function(req,res,next){
    let prodId=req.params.prodId;
    const sql="select productid,COUNT(shopid) as totalItem, SUM(quantity) as totalQuantity from purchases where productid=($1) group by productid";
    client.query(sql,[prodId],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    });
});
app.post("/products",function(req,res,next){
    var values =Object.values(req.body);
    console.log(values);
    const sql="INSERT INTO products(productname,category,description) VALUES ($1,$2,$3)";
    client.query(sql, values, function (err, result)
     {  if(err){res.status(400).send(err)}

     else{
        // console.log(result);
        res.send(` insertion successful`)};
      });
});
app.post("/shops",function(req,res,next){
    var values =Object.values(req.body);
    console.log(values);
    const sql="INSERT INTO shops(name,rent) VALUES ($1,$2)";
    client.query(sql, values, function (err, result)
     {  if(err){res.status(400).send(err)}

     else{
        // console.log(result);
        res.send(` insertion successful`)};
      });
});
app.put("/products/:id",function(req,res,next){
    let id=req.params.id;
    let body=req.body;
    const sql=`UPDATE products SET productname=$1,category=$2,description=$3 WHERE productid=$4`;
    let values=[body.productname,body.category,body.description,id];
    client.query(sql,values,function(err,result){
       if(err){res.status(400).send(err)}
        else{
            // console.log(result);
            res.send("Updated Successfully");
        }
    });
});
app.delete("/product/:id",function(req,res,next){
    let id=req.params.id;
    const sql="DELETE FROM products WHERE productid=($1)";
    client.query(sql,[id],function(err,result){
         if(err){res.status(400).send(err)}
        else{
            // console.log(result);
            res.send("DELETED Successfully");
        }
    });

});
