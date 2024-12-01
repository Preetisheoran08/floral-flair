const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Route Imports
const flowerRoutes = require("./routes/flowers");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const reviewRoutes = require("./routes/reviews"); // Import the reviews routes

const app = express();

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/flower-shop-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "flower-shop-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/flower-shop-auth",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// View Engine Setup
app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "main", layoutsDir: "views/layouts" })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: "views/layouts",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);


// Routes
app.use("/flowers", flowerRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/reviews", reviewRoutes); // Add route for reviews
const aboutRoutes = require("./routes/about.js");
app.use("/about", aboutRoutes);
const contactRoutes = require("./routes/contact.js")
app.use('/contact', contactRoutes);

// Home Route
app.get("/", (req, res) => {
  const homepageFlowers = getHomepageFlowersData(); // Fix: Call correct function
  console.log("Homepage Flowers:", homepageFlowers);

  if (req.session.user) {
    res.render("pages/home", {
      title: "Welcome to Flower Shop",
      username: req.session.user.username,
      loggedIn: true,
      flowers: homepageFlowers,
    });
  } else {
    res.render("pages/home", {
      title: "Welcome to Flower Shop",
      links: [
        { name: "Login", href: "/users/login" },
        { name: "Signup", href: "/users/signup" },
      ],
      loggedIn: false,
      flowers: homepageFlowers,
    });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error while logging out.");
    }
    res.redirect("/");
  });
});

// Function to read homepage flowers data from the JSON file
const getHomepageFlowersData = () => {
  const filePath = path.join(__dirname, "data", "homepageflowers.json");
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading homepageflowers.json:", err);
    return [];
  }
};

// Catch-all 404 route
app.use((req, res, next) => {
  res.status(404).render("pages/404", { title: "Page Not Found" });
});

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
