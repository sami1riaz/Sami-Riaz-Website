const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");


app.use(express.static('/public/'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

 Blog.create({
     title:"Test",
     image: "https://recipes.timesofindia.com/thumb/54308405.cms?width=1200&height=1200",
     body:"First Blog"
 });

// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/html/SamiRiaz.html")
  });

// Blogs Route
app.get("/blogs", (req, res) => {
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("Error!");
        } else {
            res.render("blogs", {blogs: blogs});
        }
    });
});

// New Blog ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// Create Blog Route
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
});

//// Payments /////

app.get('/payments', async (req, res) => {
    //const intent = // ... Fetch or create the PaymentIntent
    res.render('payments');//, { client_secret: intent.client_secret });
  });
  

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_VKu4NFlvN0nooPbuXKjj79ZI000hoZLns6');


var stripepk = Stripe('pk_test_6dORex2lupf2JYahqNKqU7pL00LPz6FOGC');
var elements = stripepk.elements();
var style = {
    base: {
      color: "#32325d",
    }
  };
  
  var card = elements.create("card", { style: style });
  card.mount("#card-element");

app.post("/create-payment-intent", async (req, res) => {
    const { items, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'cad',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
    });
});

  app.get('/secret', async (req, res) => {
    const intent = // ... Fetch or create the PaymentIntent
    res.json({client_secret: intent.client_secret});
  });

app.listen(3000, () => {
    console.log("Listening on port 3000");
    });