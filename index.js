import axios from 'axios';
import express from 'express';

const
   app = express(),
   port = 3006;

let love = []

app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"));

app.get('/random-joke', async (req, res) => {
   const { data: {id, value} } = await axios.get('https://api.chucknorris.io/jokes/random')

   const snip = `
   <div class="card mt-2 p-2" id="${id}">
   <div class="card-body">
     ${value}.
   </div>
   <button id="favorite" class="btn btn-success" hx-post="/favorite?id=${id}&value=${value}" hx-trigger="click" hx-target="#favorite" hx-swap="outerHTML">
      מת על זה!
   </button>
   </div>
   `
   res.send(snip)
})

app.get('/random-img', async (req, res) => {

   const snip = `
   <img src="./img/${Math.ceil(Math.random() * 8)}.jpg" alt="about"  hx-get="/random-img" hx-trigger="load once delay:5s" hx-swap="outerHTML">
   `
   res.send(snip)
})

app.get('/all-favorites', async (req, res) => {

   const snip = `
   <div id="joke"> </div>
   <h1> מועדפים </h1>
   <div class="row">
   ${love.map(f =>
      `
      <figure class="p-4 col-12 col-md-6 col-lg-4" id="f${f.id}">
      <div class="card p-2">
      <div class="card-body">
      ${f.value}.
      </div>
      <button id="favorite" class="btn btn-danger" hx-post="/remove-favorite?=${f.id}" hx-trigger="click" hx-target="#f${f.id}" hx-swap="outerHTML">
      שונא את זה!
      </button>
      </div>
      </figure>
      `
   ).join('')}
   </div>
   `
   res.send(snip)
})

app.post('/favorite', async (req, res) => {
   const {id, value} = req.query
   const isFavorite = !!love.find(f => f.id === id)

   if (!isFavorite)
      love.push({id, value})
   else
      love.splice(love.findIndex(f => f.id === id), 1)

   const snip = `
   <button id="favorite" class="btn btn-${!isFavorite ? 'danger' : 'success'}" hx-post="/favorite?id=${id}&value=${value}" hx-trigger="click" hx-target="#favorite" hx-swap="outerHTML">
   ${!isFavorite ? 'שונא את' : 'מת על'} זה!
   </button>

   `
   res.send(snip)
})


app.post('/remove-favorite', async (req, res) => {
   const id = req.query.id

   love.splice(love.findIndex(f => f.id === id), 1)

   const snip = `
   <div class="alert alert-danger my-2 col-12 col-md-6 col-lg-4" role="alert">
     נבעט
   </div>
   `

   res.send(snip)
})

app.all('*', (req, res) => {
   console.log(404);
   throw ({ status: 404, clientMsg: 'דף לא נמצא' })
})

app.use((err, req, res, next) => {
   console.log('main error \n', err.message || err);
   res
      .status(err.status || 500)
      .json({ msg: err.clientMsg || 'משהו לא עובד פה חבריקו...' })
})

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
});

