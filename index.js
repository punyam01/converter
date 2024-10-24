require('dotenv').config()

const {app} = require ("./app.js")


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`----------------------------------------`);
  console.log(`SERVER IS RUNNING AT:`);
  console.log(`http://localhost:${port}`);
  console.log(`----------------------------------------`);
});