require('dotenv-extended').load();
const _restify = require('restify');
const _bot = require('../bot');

module.exports = () => {
    const _server = _restify.createServer();
    _server.post('/chatbot/messages', _bot.connector('*').listen());

    _server.listen(process.env.PORT || 8009, () => {
        console.log(`${_server.name} listening to ${_server.url}`);
    });
}
