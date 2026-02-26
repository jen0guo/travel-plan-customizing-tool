import express from 'express';

var router = express.Router();

router.get('/myIdentity', async function(req, res, next) {
    let session = req.session
    if(session.isAuthenticated){
      res.json({
        status: "loggedin",
        userInfo: {
            name: session.account.name,
            username: session.account.username
        }
      })
    } else {
      res.json({status: "loggedout"})
    }
})

export default router