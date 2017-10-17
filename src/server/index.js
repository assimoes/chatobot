require('dotenv-extended').load();
const _restify = require('restify');
const _bot = require('../bot');
const _builder = require('botbuilder');
var db = require('../store/mongodb');

module.exports = () => {
    const _server = _restify.createServer();
    _server.use(_restify.plugins.bodyParser());

    _server.post('/chatbot/messages', _bot.connector('*').listen());
    _server.post('/github/notifications', notificationsHandler);

    _server.listen(process.env.PORT || 8009, () => {
        console.log(`${_server.name} listening to ${_server.url}`);
    });
}


notificationsHandler = (req, res, next) => {

    // test purposes... should iterate through reviewers and send a message.
    db.GetUserFromGithub(req.body.pull_request.user.login, (err, _user)=>{
        if (_user) {
            var _address = _user.address;
            let _msg = new _builder.Message().address(_address);  
            _bot.beginDialog(_address, "newPullRequest", req.body.pull_request);
            res.send({status: 200});
        } else {
            res.send({status:404});
        }
    })
};