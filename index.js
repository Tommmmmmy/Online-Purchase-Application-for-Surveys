const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        //to encrypt the cookie
        keys: [keys.cookieKey]
    })
);

//tell app to user the passport and the passport to use cookie. 
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoute')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production') {
    // Express will serve up production assests
    //like main.js file, or main.css file
    app.use(express.static('client/build'));
    
    //Express will serve up the index.html file
    //if it does not recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);