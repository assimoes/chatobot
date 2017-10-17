var ssid = require('shortid');
var https = require('https');
var db = require('../../store/mongodb');

module.exports = (bot, builder) => {
    
    bot.dialog('getGithubProfile', [
        (session, args, next) => {
            var _user = db.GetUser(session.message.user.name, (err, usr) => {
                if (!usr) {
                    let _shortid = ssid.generate();
                    session.privateConversationData.repository = _shortid;
                    let _ssid = ssid.generate();
                    session.privateConversationData.repository = _ssid;
    
                    session.send("Make sure you have a repository named %s", _ssid);
    
                    builder.Prompts.text(session, "What is your Github username?");
                } else {
                    session.endConversation("Hey! Greetings my friend! You can start issuing commands!");
                }
            });
        },
        (session, results, next) => {
            const githubProfile = results.response;
            session.send("Alright! Let me check if I should be talking to you %s", session.message.user.name);
            checkGithubProfile(session, results);
        }
    ]).triggerAction({matches: /^greetings*/i});

    bot.dialog('readCommands',[
        (session,args, next)=> {
            session.send("executing %s", session.message.text);
            session.endDialogWithResult({response: session.message.text});
        }
    ])
    .triggerAction({matches: /^git*/i});
}


checkGithubProfile = (session, results) => {
    const githubProfile = session.privateConversationData.githubProfile = results.response;            
    
    /* Checking if the Repo exists */
    let _url = "/repos/" + githubProfile + "/" + session.privateConversationData.repository;

    https.get({
        host: "api.github.com",
        path: _url,
        headers: {
            'User-Agent': "360Bot"
        }
    }, (response) => {
        var body = '';
        response.on('data', (d)=>{
            body +=d;
        });

        response.on('end', ()=> {
            var parsed = JSON.parse(body);
            if(!parsed.name || parsed.name !== session.privateConversationData.repository) {
                session.endConversation("Sorry man! I didn't find the repo I told you to create. Shall we try this again?");
            } else {
                //global.db.Add(session.message.user.name, {name: session.message.user.name});
                db.CreateUser({name: session.message.user.name, github: githubProfile, address: session.message.address}, (err) => {
                    session.endConversation(`Everything looks good man! I've added you to the list!`);
                });
            }
        });
    });

}