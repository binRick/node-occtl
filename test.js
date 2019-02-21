#!/usr/bin/env node

var occtl = require('./'),
    l = console.log,
    pj = require('prettyjson');
c = require('chalk');

occtl.socketPath = '/var/run/occtl.socket';
occtl.occtlPath = '/usr/bin/occtl';
occtl.debug = false;

occtl.showStatus(function(e, ocStatus) {
    if (e) throw e;
    l('ocStatus=', ocStatus.Status);
    l(pj.render(ocStatus));
    occtl.showUsers(function(e, ocUsers) {
        if (e) throw e;
        l(c.red('\n\nUsers Connected=') + ' ' + c.white(ocUsers.length));
        l(pj.render(ocUsers));
        occtl.showAllSessions(function(e, ocAllSessions) {
            if (e) throw e;
            l(c.red('\n\nTotal Sessions=') + ' ' + c.white(ocAllSessions.length));
            l(pj.render(ocAllSessions));
            occtl.showValidSessions(function(e, ocValidSessions) {
                if (e) throw e;
                l(c.red('\n\nValid Sessions=') + ' ' + c.white(ocValidSessions.length));
                l(pj.render(ocValidSessions));
            });
        });
    });
});