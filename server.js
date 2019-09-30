const express = require('express');
const connectDB = require('./config/db');
// const cors = require("cors"); 

const app = express();

// Setting up CORS 
// const corsOptions = {
// 	origin: ["*", "http://localhost:3000"], // List of host authorized make cors request. For cross origin cookies specific host should be given. (ex:"http://localhost:3000")
// 	credentials: true // Must enable for cross origin cookies.
// };
// app.use(cors(corsOptions));

// Connect Database 
connectDB();

// Initialise middleware 
app.use(express.json({ extended: false })); 

// End points
app.get('/', (req, res) => res.send('API connected..'));

// Define Routes 
app.use('/api/v1/users', require('./routes/api/v1/users')); 
app.use('/api/v1/auth', require('./routes/api/v1/auth'));

app.use('/api/v10/auth', require('./routes/api/v10/auth10'));
app.use('/api/v10/ownbio', require('./routes/api/v10/ownbio'));
app.use('/api/v10/pets', require('./routes/api/v10/pets'));
app.use('/api/v10/todos', require('./routes/api/v10/todos'));
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
});