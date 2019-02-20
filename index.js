var l = console.log,
    _ = require('underscore'),
    child = require('child_process'),
    c = require('chalk');

var Interface = {
    socketPath: '/var/run/occtl.socket',
    occtlPath: '/usr/bin/occtl',
    connect: function(socketPath) {

        var ocCmd = this.occtlPath + ' -js' + this.socketPath;
        l(c.green('Running Command ') + c.white.bgBlack(ocCmd));



    },

};


module.exports = Interface;
