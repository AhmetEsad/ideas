const fs = require('fs');
var ideas = require('./ideas.json');
var input = process.stdin;
input.setEncoding('utf-8');
var session = [];

function newIdea(idea) {
    if (ideas.sessions.length == 0) {
        var id = 1;
    } else {
        id = ideas.sessions[ideas.sessions.length - 1][ideas.sessions[ideas.sessions.length - 1].length - 1].id + 1;
    }
    if (session.length !== 0) {
        id = session[session.length - 1].id + 1;
    }
    session.push({ idea: idea, id: id });
}

function save() {
    if (session.length > 0) ideas.sessions.push(session);
    fs.writeFileSync('./ideas.json', JSON.stringify(ideas), 'utf8');
}

function exit() {
    console.log('[SAVING THE CHANGES]');
    save();
    console.log(`[SAVED ${`${session.length} ${session.length == 1 ? 'IDEA' : 'IDEAS'}`}]`);
    console.log('[EXITTING]');
    process.exit();
}

process.on('SIGINT', exit);

var commands = {
    "#": "COMMANDS\n",
    "list": "Shows a list of your ideas",
    "id": "Shows an idea (requires an ID)",
    "session": "Shows a session (requires a SESSION ID)",
    "help": "Shows a list of commands",
    "del": "Deletes an idea (requires an ID)",
    "*del": "Deletes a session (requires a SESSION ID)",
    "reset": "Deletes all the ideas, asks twice, be careful",
    "export": "Exports the ideas as a TXT file",
    "exit": "Exits the app"
}

function run(command) {
    var cmd = command.split(' ')[0].split('').slice(1).join('');
    var args = command.split(' ').slice(1);
    switch (cmd) {
        case 'list':
            if (ideas.sessions.length > 0) {
                var sessionNum = 1;
                ideas.sessions.map(session => {
                    console.log(`\nSESSION ${sessionNum}`);
                    ideas.sessions[sessionNum - 1].map(idea => {
                        console.log(`${idea.id} | ${idea.idea}`);
                    });
                    sessionNum += 1;
                });
                console.log('\nTHIS SESSION');
                if (session.length !== 0) {
                    session.map(idea => {
                        console.log(`${idea.id} | ${idea.idea}`);
                    });
                } else {
                    console.log('(Empty)');
                }
            }
            break;
        case 'del':
            if (args.length !== 0) {
                var ID = args[0];
                if (!isNaN(ID)) {
                    var ID = Number(ID);
                    notAnID = 0;
                    ideasNum = 0;
                    ideas.sessions.map(session => {
                        session.map(idea => {
                            ideasNum += 1;
                            if (idea.id == ID) {
                                console.log(`[DELETING IDEA: ${idea.id} | ${idea.idea}]`);
                                idea.idea = '[DELETED]';
                                console.log('[DELETED IDEA]');
                            } else {
                                notAnID += 1;
                            }
                        });
                    });
                    if (notAnID == ideasNum) {
                        console.log('Can\'t find any ideas with the ID ' + ID);
                    }
                } else {
                    console.log('ID must be a number');
                    setTimeout(app, 300);
                }
            } else {
                console.log('You must specify the ID.')
                setTimeout(app, 300);
            }
            break;
        case '*del':
            if (args.length !== 0) {
                var ID = args[0];
                if (!isNaN(ID)) {
                    var ID = Number(ID);
                    if (ideas.sessions[ID - 1]) {
                        console.log('[DELETING SESSION ' + ID + ']');
                        console.log(`\nSESSION ${ID}\n${ideas.sessions[ID - 1].map(idea => `${idea.id} | ${idea.idea}`).join('\n')}`);
                        ideas.sessions[ID - 1] = [];
                        console.log('[DELETED SESSION ' + ID + ']');
                    } else {
                        console.log('Can\'t find SESSION ' + String(ID));
                    }
                } else {
                    console.log('SESSION must be a number');
                    setTimeout(app, 300);
                }
            } else {
                console.log('You must specify the SESSION ID.')
                setTimeout(app, 300);
            }
            break;
        case 'id':
            if (args.length !== 0) {
                var ID = args[0];
                if (!isNaN(ID)) {
                    var ID = Number(ID);
                    notAnID = 0;
                    ideasNum = 0;
                    ideas.sessions.map(session => {
                        session.map(idea => {
                            ideasNum += 1;
                            if (idea.id == ID) {
                                console.log(`${idea.id} | ${idea.idea}`);
                            } else {
                                notAnID += 1;
                            }
                        });
                    });
                    if (notAnID == ideasNum) {
                        console.log('Can\'t find any ideas with the ID ' + ID);
                    }
                } else {
                    console.log('ID must be a number');
                    setTimeout(app, 300);
                }
            } else {
                console.log('You must specify the ID.')
                setTimeout(app, 300);
            }
            break;
        case 'session':
            if (args.length !== 0) {
                var ID = args[0];
                if (!isNaN(ID)) {
                    var ID = Number(ID);
                    if (ideas.sessions[ID - 1]) {
                        console.log(`\nSESSION ${ID}\n${ideas.sessions[ID - 1].map(idea => `${idea.id} | ${idea.idea}`).join('\n')}`);
                    } else {
                        console.log('Can\'t find SESSION ' + String(ID));
                    }
                } else {
                    console.log('SESSION must be a number');
                    setTimeout(app, 300);
                }
            } else {
                console.log('You must specify the SESSION ID.')
                setTimeout(app, 300);
            }
            break;
        case 'export':
            console.log('[EXPORTING]');
            var txt = [];
            ideas.sessions.map(session => {
                session.map(idea => {
                    txt.push(idea.idea);
                });
            });
            txt = txt.map(i => i).join('\n');
            fs.writeFileSync('./ideas.txt', txt);
            console.log('[DONE]');
            exit();
            break;
        case 'help':
            Object.keys(commands).map(command => {
                console.log(`#${command.toUpperCase()}: ${commands[command]}`);
            });
            break;
        case 'reset':
            console.log('[RESETTING]');
            session = [];
            ideas = { "sessions": [] };
            exit();
            break;
        case 'exit':
            exit();
            break;
    }
}

function app() {
    console.log(`\nWhat's on your mind?${session.length !== 0 ? ' (' + (session.length + 1) + ')' : ''}`);
    console.log(Object.keys(commands).slice(1).map(command => `[${Object.keys(commands)[0]}${command.toUpperCase()}]`).join(' - '));
}

var resetting = false;
var _ = false; // preventing the app from creating more event listeners
if (_ == false) {
    if (process.argv.length < 3) {
        _ = true;
        app();
        input.on('data', function (data) {
            data = data.replace(/\n/g, '').replace(/\r/g, '');
            if (data.startsWith('#')) {
                var notThisCommand = 0;
                Object.keys(commands).map(command => {
                    if (data.toLowerCase().startsWith('#' + command)) {
                        if (command == 'reset') {
                            resetting = true;
                            console.log('\nAre you sure? (Y/N)');
                        } else {
                            run(data.toLowerCase());
                        }
                    } else {
                        notThisCommand += 1;
                    }
                })
                if (notThisCommand == Object.keys(commands).length) {
                    console.log('This is not a command.');
                    setTimeout(app, 300);
                }
            } else {
                if (data !== '') {
                    if (!resetting) {
                        newIdea(data);
                        app();
                    } else {
                        switch (data.toLowerCase()) {
                            case 'y':
                                run('reset');
                                break;
                            case 'n':
                                app();
                                resetting = false;
                                break;
                        }
                    }
                } else {
                    console.log('An idea can\'t be empty.')
                    setTimeout(app, 300);
                }
            }
        });
    } else {
        console.log('[QUICK IDEA MODE]');
        newIdea(process.argv.slice(2).join(' '));
        exit();
    }
}