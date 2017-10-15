var ssid = require('shortid');
var https = require('https');

module.exports = {
    rootDialog: (session, args, next) => {
        if(!global.db.username) {
            let _shortid = ssid.generate();
            session.privateConversationData.repository = _shortid;
            session.send("Please create a Github Repository named %s", _shortid);
            session.send("This is done to make sure I'm talking to the actual github user!");
            session.send("After that is done, type your github user!");
            session.beginDialog('getGithubProfile');
        } else {
            session.beginDialog('readCommands');
        }
        
    },
    grabGithub: (session, results, next) => {
       if (!global.db.username) {
            if (results.response) {

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
                            session.endConversation(`Hello ${githubProfile}! I've added you to my list!`);
                        }
                    });
                })


            } else {
                session.endConversation("Sorry, I didn't quite get your response. Shall we try this again?");
            }
        }
    },
    readCommands: (session, results, next)=>{
        session.endConversation("Read commands ended");
    }
}