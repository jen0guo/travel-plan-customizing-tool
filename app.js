import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js'
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'

import indexRouter from './routes/index.js';
import apiV1Router from './routes/api/v1/apiv1.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const appSettings = {
	appCredentials: {
    	clientId:  process.env.clientId,
    	tenantId:  process.env.tenantId,
    	clientSecret: process.env.clientSecret
	},
	authRoutes: {
    	redirect: "http://localhost:3000/redirect",
    	error: "/error", 
    	unauthorized: "/unauthorized"
	}
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: process.env.secret,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // makes a models step
    req.models = models
    next()
  })

app.get('/signin',
	msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
	msid.signOut({postLogoutRedirect: '/'})
)

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api/v1', apiV1Router)
//app.use('/directApi', defaultRoute)

export default app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})