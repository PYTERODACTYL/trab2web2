const express = require('express');

const path = require('path');

const app = express();
const PORT = 3000;

const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,      
    saveUninitialized: true,
}));


app.use((req, res, next) => {
    if (req.session.routes) 
        req.session.routes.push(req.url);
    else
        req.session.routes = [req.url];

    console.log('SESSION ID ' + req.sessionID )
    console.log({ session: req.session})
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const usersRouter = require('./routes/users.routes');
app.use("/", usersRouter);
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.listen(PORT, () => {    
    console.log(`Server is running on http://localhost:${PORT}`);
})

db = require('./config/dbConnection')


const query = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    CPF TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cliente'
);
`;

db.exec(query);
db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS phones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        phone TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

const listaUsers = "SELECT * FROM users;";
const resultado = db.prepare(listaUsers).all();
console.log({ resultado })