const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const { cursorTo } = require('readline');
var assert = require('assert');
var engine = require('consolidate');

const port =process.env.port || 3000
const app = express();
const store = new MongoDBStore({
  uri: 'mongodb+srv://Akilesh:Akil3333esh@cluster-food-order.ofcfl.mongodb.net/test',
  collection: 'sessions'
});


app.use(
session({
  secret: 'thisisasecret',
  saveUninitialized: false,
  resave: false,
  store : store,
  cookie : {
    maxAge : 1000 * 60 * 3
  }
  })
  );



var sess;
/*
CLIENT_ID="CLENT_ID";
CLIENT_SECRET="CLIENT_SECRET";
CALLBACK_URL="http://localhost:3000/items";
*/

app.use(express.static('public'))
app.use([express.json(), express.urlencoded({ extended: true })])
app.use(function(req,res,next){
  sess = req.session;
  res.locals = sess;
  next();
});

/* get */
app.engine('html', engine.mustache);
app.set('view engine', 'html')


mongoose.connect('mongodb+srv://Akilesh:Akil3333esh@cluster-food-order.ofcfl.mongodb.net/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Welcome to INDIAN COOCKER COOKS start ordering!!!"))


/* email */
/* signup */
app.post("/sign_up",(req,res)=>{
  sess = req.session;
  
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phno = req.body.phno;
    var email = req.body.email;
    var pic = req.body.ppic;
    var password = req.body.password;


    var data = {
        "fname": fname,
        "lname": lname,
        "phno": parseInt(phno),
        "email" : email,
        "pic" : pic,
        "password" : password,
        "Date" : new Date()
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("user Inserted Successfully");
    });

    return res.redirect('login.html')

})

/* add admin */
app.post("/add-admin.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phno = req.body.phno;
    var email = req.body.email;
    var password = req.body.password;
    var spassword = req.body.spassword;


    var data = {
        "fname": fname,
        "lname": lname,
        "phno": parseInt(phno),
        "email" : email,
        "password" : password,
        "spassword" :spassword,
        "Date" : new Date()
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Admin Inserted Successfully");
    });

    return res.redirect('Admin_success.html')
  } else {
    res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
  }
})
/* upd-admin */
app.post("/upd-admin.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var email = req.res.body;
    var spassword = req.res.spassword;
    
    var query = {"email":email};
    var data = { $set:{
        "spassword" : spassword,
        "Date" : new Date()
    }}

    db.collection('users').updateOne(query,data,(err,collection)=>{
      if(err){
        throw err;
    }
        
        console.log("Admin added Successfully");
        return res.redirect('Admin_success.html')
  });
} else {
  res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
}
})

/* del user */
app.post("/del-user.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var email = req.body.email;
    var data = {
        "email": email,
    }
    db.collection('users').deleteOne(data,(err,collection)=>{
      if(err){
        throw err;
    }
        console.log("user deleted Successfully");
    return res.redirect('Admin_success.html')
    });
  } else {
    res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
  }
})




/* add item */
app.post("/add-product.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var pname = req.body.pname;
    var category = req.body.category;
    var price = req.body.price;
    var fileInput = req.body.fileInput;
    var data = {
        "pname": pname,
        "category": category,
        "price" : parseInt(price),
        "fileInput" : fileInput,
        "Date" : new Date()
    }
    db.collection('products').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Item Inserted Successfully");
    });
    return res.redirect('Insert_success.html')
  } else {
    res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
  }
})

/* delete item */
app.post("/del-product.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var pname = req.body.pname;
    var data = {
        "pname": pname,
    }
    db.collection('products').deleteOne(data,(err,collection)=>{
      if(err){
        throw err;
    }
        console.log("Item deleted Successfully");
    return res.redirect('Insert_success.html')
    });
  } else {
    res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
  }
})



/* update item */
app.post("/upd-product.html",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var upname = req.body.upname;
    var pname = req.body.pname;
    var category = req.body.category;
    var price = req.body.price;
    var fileInput = req.body.fileInput;
    
    var query = {"pname": upname};
    var data = { $set:{
        "pname": pname,
        "category": category,
        "price" : parseInt(price),
        "fileInput" : fileInput,
        "Date" : new Date()
    }}

    db.collection('products').updateOne(query,data,(err,collection)=>{
      if(err){
        throw err;
    }
        
        console.log("Item updated Successfully");
        return res.redirect('Insert_success.html')
  });
} else {
  res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
}
})
/* order */
app.post("/order",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var Uname = (sess.fname + ' ' + sess.lname);
    var Unum = sess.phno;
    var email = sess.email;
    var add = req.body.add;
    var msg = req.body.msg;
    var pname = req.body.pname;
    var price = req.body.price;
    

    var data = {
        "pname": pname,
        "Uname" : Uname,
        "Unum" : Unum,
        "email" : email,
        "add" : add,
        "msg" : msg,
        "price":  price,
        "Date" : new Date()
    }

    db.collection('Orders').insertOne(data,(err,collection)=>{
        try{
        console.log("Order Inserted Successfully");
    return res.redirect('payment.html')
      } catch (err){
res.send('Invalid Order')
      }});
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})





/* forget email */
app.post("/forget",(req, res)=>{
  sess = req.session;
    var email = req.body.email;
    db.collection('users').findOne(
        {
            "email" : email
        }
        ,(err,collection)=>{
            try {
                if(collection.email == email){
                    return res.redirect('reset_link.html')
                }
            } catch (err){
                res.send(`<center><h1>Invalid Email <br><br><a href="/forget.html">Go Back</a></h1><center>`)
            }
        }
    );

});

/* login */
app.post("/login",(req,res)=>{
  sess = req.session;
    var email = req.body.email;
    var password = req.body.password;

    db.collection('users').findOne(
        {
        "email" : email
        } 
        ,(err,collection)=>{
        try{
        sess.email = collection.email;
        sess.fname = collection.fname;
        sess.lname = collection.lname;
        sess.phno = collection.phno;
        sess._id = collection._id;
        sess.loggedin = true;

        if(collection.password == password)
    {
        
        console.log("Record found Successfully");
        return res.redirect('/items')
    }
    if (collection.spassword == password) {
        console.log("Record found Successfully");
        return res.redirect('admin.html')
    }
    else 
    {
        console.log("Record not found!!");
        return res.send(`<center><h1>Invalid Password <br><br><a href="/login.html">Go Back</a></h1><center>`)
    }
    
         } catch(err){
             res.send(`<center><h1>Your not a member please <br><br> <a href="/signup.html">sign up</a></h1><center>`)
         } });
   
})

/* search */
app.get("/search",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
  var regex = req.query.search;
  
    var resultArray = [];
    
    var cursor = db.collection('products').find({pname:{$regex: regex,$options: '$i'}});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
        
      }, function (err, doc){
        assert.equal(null, err);
        if ( resultArray.length == 0) {
          return res.redirect("noresult.html")
        }
        else{
        res.render('welcome',{search : resultArray});
        
        console.log({search : resultArray});
        }
       
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
}) 

/* tea and coffees */
app.get("/items",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];


    
    var cursor = db.collection('products').find({category:'Tea and Cofee'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
        
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{tea : resultArray});
        
        console.log({tea : resultArray});
        
       
      });
      } else {
        res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
      }
  

}) 

app.get("/profile",(req,res)=>{
    sess = req.session;
    if(sess._id){
      res.write(` 
      <head>
      <link rel = "icon" href = "images/logo2.jpg"  type = "image/x-icon">
      <style>
      @import url("https://fonts.googleapis.com/css?family=Quicksand:400,500,700&subset=latin-ext");
  html {
    position: relative;
    overflow-x: hidden !important;
  }
  
  * {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
  }
  
  body {
    font-family: 'Quicksand', sans-serif;
    color: #0f212b;
    background-color: 0f212b;
  
  }
  
  a, a:hover {
    text-decoration: none;
  }
  
  
  .wrapper {
    width: 100%;
    width: 100%;
    height: auto;
    min-height: 100vh;
    padding: 50px 20px;
    padding-top: 100px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
   background-color: 0f212b;
    
  }
  
  @media screen and (max-width: 768px) {
    .wrapper {
      height: auto;
      min-height: 100vh;
      padding-top: 100px;
    }
  }
  
  .profile-card {
    width: 100%;
    min-height: 460px;
    margin: auto;
    -webkit-box-shadow: 0px 8px 60px -10px rgb(250, 2, 2);
            box-shadow: 0px 8px 60px -10px rgb(250, 2, 2);
    background: #fff;
    border-radius: 12px;
    max-width: 700px;
    position: relative;
    border:.2rem solid #fd0505;
  }
  
  .profile-card.active .profile-card__cnt {
    -webkit-filter: blur(6px);
            filter: blur(6px);
  }
  
  
  
  .profile-card__img {
    width: 150px;
    height: 150px;
    margin-left: auto;
    margin-right: auto;
    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    z-index: 4;
    background-color: blue;
    -webkit-box-shadow: 0px 5px 50px 0px red, 0px 0px 0px 7px rgb(250, 2, 2);
            box-shadow: 0px 5px 50px 0px red, 0px 0px 0px 7px rgb(250, 2, 2);
  }
  
  @media screen and (max-width: 576px) {
    .profile-card__img {
      width: 120px;
      height: 120px;
    }
  }
  
  .profile-card__img img {
    display: block;
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
       object-fit: cover;
    border-radius: 50%;
  }
  
  .profile-card__cnt {
    margin-top: -35px;
    text-align: center;
    padding: 0 20px;
    padding-bottom: 40px;
    -webkit-transition: all .3s;
    transition: all .3s;
  }
  
  .profile-card__name {
    font-weight: 700;
    font-size: 24px;
    color: #6944ff;
    margin-bottom: 15px;
  }
  
  .profile-card__txt {
    font-size: 18px;
    font-weight: 500;
    color: #324e63;
    margin-bottom: 15px;
  }
  
  .profile-card__txt strong {
    font-weight: 700;
  }
      </style>
      </head>
      <body>
      <div class="wrapper">
      <div class="profile-card js-profile-card">
        <div class="profile-card__img">
        <img src="images/user.png" alt="profile card">
        </div>
      
        <div class="profile-card__cnt js-profile-cnt">
        <div class="profile-card__name">${sess.fname}  ${sess.lname}</div><br>
        <div class="profile-card__txt">User Id: <strong>${sess._id}</strong><br><br>
        <div class="profile-card__txt">Email: <strong>${sess.email}</strong><br><br>
        Ph No : <strong>${sess.phno}</strong>
        <br>
        <br>
        <strorn><a href='/items'>Go Back</a></strong>
        </div>

        </div>
        </form>
        </div>
      
      </div>
      
      </div>
      
      </h2>
      </body>
      `);
      res.end();
}
else {
  res.write(` 
  <head>
  <style>
  @import url("https://fonts.googleapis.com/css?family=Quicksand:400,500,700&subset=latin-ext");
html {
position: relative;
overflow-x: hidden !important;
}

* {
-webkit-box-sizing: border-box;
        box-sizing: border-box;
}

body {
font-family: 'Quicksand', sans-serif;
color: #0f212b;
background-color: 0f212b;

}

a, a:hover {
text-decoration: none;
}


.wrapper {
width: 100%;
width: 100%;
height: auto;
min-height: 100vh;
padding: 50px 20px;
padding-top: 100px;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
background-color: 0f212b;

}

@media screen and (max-width: 768px) {
.wrapper {
  height: auto;
  min-height: 100vh;
  padding-top: 100px;
}
}

.profile-card {
width: 100%;
min-height: 460px;
margin: auto;
-webkit-box-shadow: 0px 8px 60px -10px rgb(250, 2, 2);
        box-shadow: 0px 8px 60px -10px rgb(250, 2, 2);
background: #fff;
border-radius: 12px;
max-width: 700px;
position: relative;
border:.2rem solid #fd0505;
}

.profile-card.active .profile-card__cnt {
-webkit-filter: blur(6px);
        filter: blur(6px);
}



.profile-card__img {
width: 150px;
height: 150px;
margin-left: auto;
margin-right: auto;
-webkit-transform: translateY(-50%);
        transform: translateY(-50%);
border-radius: 50%;
overflow: hidden;
position: relative;
z-index: 4;
background-color: blue;
-webkit-box-shadow: 0px 5px 50px 0px red, 0px 0px 0px 7px rgb(250, 2, 2);
        box-shadow: 0px 5px 50px 0px red, 0px 0px 0px 7px rgb(250, 2, 2);
}

@media screen and (max-width: 576px) {
.profile-card__img {
  width: 120px;
  height: 120px;
}
}

.profile-card__img img {
display: block;
width: 100%;
height: 100%;
-o-object-fit: cover;
   object-fit: cover;
border-radius: 50%;
}

.profile-card__cnt {
margin-top: -35px;
text-align: center;
padding: 0 20px;
padding-bottom: 40px;
-webkit-transition: all .3s;
transition: all .3s;
}

.profile-card__name {
font-weight: 700;
font-size: 24px;
color: #6944ff;
margin-bottom: 15px;
}

.profile-card__txt {
font-size: 18px;
font-weight: 500;
color: #324e63;
margin-bottom: 15px;
}

.profile-card__txt strong {
font-weight: 700;
}
  </style>
  </head>
  <body>
  <div class="wrapper">
  <div class="profile-card js-profile-card">
    <div class="profile-card__img">
    <img src="https://cdn-icons.flaticon.com/png/512/3899/premium/3899618.png?token=exp=1637247808~hmac=a1a88407f08ab4642a17b7bab645ab18" alt="profile card">
    </div>
  
    <div class="profile-card__cnt js-profile-cnt">
    <div class="profile-card__name">Login Please......</div><br>
    <br><br>
    <strong><a href='/login.html'>Go to Login Page</a></strong>
    </div>

    </div>
    </form>
    </div>
  
  </div>
  
  </div>
  
  </h2>
  </body>
  `);
  res.end();
}
  });




/* Tiffins and Salads */
app.get("/tiffins",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'Tiffins and Salads'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{tiffin : resultArray});
        console.log({tiffin : resultArray})
        
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
      
})

/* pizzas */
app.get("/pizzas",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'Pizzas and Burgers'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{pizza : resultArray});
        console.log({pizza : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})

/* rotis */

app.get("/rotis",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'roti and curries'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{roti : resultArray});
console.log({roti : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
      
})

/* starters */

app.get("/starters",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'starters'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{starters : resultArray});
console.log({starters : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})
/* rices */

app.get("/rices",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'rices'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{rices : resultArray});
console.log({rices : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})

/* cakes */
app.get("/cakes",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'cake'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{cake : resultArray});
console.log({cake : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})
/* drinks */

app.get("/drinks",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'drinks and juices'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{drink : resultArray});
console.log({drink : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})

/* icecreams */
app.get("/icecreams",(req,res)=>{
  sess = req.session;
  if (sess.loggedin){
    var resultArray = [];
    var cursor = db.collection('products').find({category:'icecreams'});
    cursor.forEach(function(doc){
        assert.notEqual(null, doc);
        resultArray.push(doc);
      }, function (err, doc){
        assert.equal(null, err);
        
        res.render('welcome',{icecreams : resultArray});
        console.log({icecreams : resultArray})
      });
    } else {
      res.send(`<center><h1>Please login to view this page!<br><br><a href="/login.html">Login</a></h1><center>`)
    }
})



/*

app.use(passport.initialize());

app.use(passport.session());


passport.serializeUser( function(id, done) {

  done(null, id);

});


passport.deserializeUser( function(id, done) {

  done(null, id);

});


// following middleware will run whenever passport. Authenticate method is called and returns different parameters defined in the scope.


passport.use(new GoogleStrategy({

  clientID: CLIENT_ID,

  clientSecret: CLIENT_SECRET,

  callbackURL: CALLBACK_URL

  },

  async function(accessToken, refreshToken, profile, email, cb) {
    
    return cb(null, email.id,profile.id);

  }

));

// serving home page for the application

app.get('/sign_up', (req, res) =>

{

  res.sendFile(path.join(__dirname + '/public/index.html'));

});


// serving success page for the application

app.get('/success', (req, res) =>

{

  res.sendFile(path.join(__dirname + '/views/welcome.html'));

});


// user will be redirected to the google auth page whenever hits the ‘/google/auth’ route.


app.get('/google/auth',

  passport.authenticate('google', {scope: ['profile', 'email']})

);


// authentication failure redirection is defined in the following route


app.get('/authorized',

  passport.authenticate('google', {failureRedirect: '/sign_up'}),

  (req, res) =>

  {

    res.redirect('/items');
  }

);
*/



app.get("/",(req,res)=>{
  sess = req.session;
  res.set({
    "Allow-access-Allow-Origin": '*',
    'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, DELETE'
})

  return res.redirect('index.html');
})

app.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
	});

});

app.listen(port,()=>{
    console.log('server started')
    console.log('http://localhost:'+ port)
})

