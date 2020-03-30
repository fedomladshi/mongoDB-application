const http = require('http');
const express = require('express');
const fs = require('fs');
const exphbs = require('express-handlebars');
const path = require('path')
const homeRoutes = require('./routers/home');
const cartRoutes = require('./routers/cart');
const addRoutes = require('./routers/add');
const coursesRoutes = require('./routers/courses');
const ordesrRoutes = require('./routers/orders')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const User = require('./models/user')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express();
const hbs = exphbs.create({
     defaultLayout: 'main',
     extname: 'hbs',
     handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
     try {
          const user = await User.findById('5e7db9b1c1edab0a58092931');
          req.user = user
          next()
     } catch (e) {
          console.log(e)
     }

})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoutes);
app.use('/addCourse', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordesrRoutes);
app.use('/courses', coursesRoutes);


async function start() {
     try {
          const url = `mongodb+srv://fedomladshi:bER9Qx5g4yYxmXck@cluster0-jy4tu.mongodb.net/shop`;
          await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
          const candidate = await User.findOne()
          if (!candidate) {
               const user = new User({
                    email: 'fedomladshi@gmail.com',
                    name: "Alexey Fedorovich",
                    cart: { items: [] }
               })
               await user.save()
          }
          app.listen(3000, () => {
               console.log("поехали")
          });
     }
     catch (e) {
          console.log(e)
     }
}
start()


