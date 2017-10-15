'use strict';

const _builder = require('botbuilder');
const _flow = require('./flow');
const _dialog = require('./dialog');

const _connector = new _builder.ChatConnector({
    appId: process.env.MS_APP_ID,
    appPassword: process.env.MS_APP_PWD
});

const _bot = module.exports = new _builder.UniversalBot(_connector,[ 
    (session, args, next)=> {
        session.send("Hey! What do you want?");
        session.endConversation();
    }
]);

_dialog(_bot, _builder);
