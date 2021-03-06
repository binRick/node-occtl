var l = console.log,
    _ = require('underscore'),
    child = require('child_process'),
    c = require('chalk'),
    pj = require('prettyjson'),
    parse = require('parse-spawn-args').parse;


var Interface = {
    socketPath: '/var/run/occtl.socket',
    occtlPath: '/usr/bin/occtl',
    debug: false,
    genCmd: function(args) {
        return parse('-js' + this.socketPath + ' ' + args);
    },
    showValidSessions: function(_cb) {
        this.runCommand('show sessions valid', _cb);
    },
    showAllSessions: function(_cb) {
        this.runCommand('show sessions all', _cb);
    },
    showUsers: function(_cb) {
        this.runCommand('show users', _cb);
    },
    showStatus: function(_cb) {
        this.runCommand('show status', _cb);
    },
    runCommand: function(command, _cb) {
        var ocCmd = this.genCmd(command);
        childProc = child.spawn(this.occtlPath, ocCmd),
            outData = '';
        if (this.debug)
            l(c.green('Running Command ') + c.white.bgBlack(ocCmd));
        childProc.stderr.on('data', function(out) {
            l('stderr>', out.toString());
        });
        childProc.stdout.on('data', function(out) {
            outData += out.toString();
            if (this.debug)
                l('stdout>', out.toString());
        });
        childProc.on('exit', function(code) {
            if (this.debug)
                l('childProc exited w code', code);
            if (code == 0) {
                try {
                    outData = _fixOpenConnectInvalidJson(outData);
                    l(outData);
                    outData = JSON.parse(outData);
                    if (this.debug)
                        l(pj.render(outData));
                    _cb(null, outData);
                } catch (e) {
                    if (this.debug) {
                        l(c.red('Unable to parse JSON from string:'));
                        l(outData);
                    }
                    _cb(e);
                }

            }
        });
    },
};




//occtl creates invalid json.. sloppy attempt to fix it up...
var _fixOpenConnectInvalidJson = function(outData) {
    var outLines = outData.split('\n'),
        fixedLines = [],
        prevLine = false;
    _.each(outLines, function(curLine) {
        curLine = curLine.trim();
        if (prevLine) {
            if (curLine.length <= 2 && prevLine && prevLine.length > 2) {
                var ll = fixedLines[fixedLines.length - 1];
                if (ll[ll.length - 1] == ',') {
                    ll = ll.slice(0, ll.length - 1);
                    fixedLines[fixedLines.length - 1] = ll;
                }
            }
            if (curLine.length > 2 && curLine[curLine.length - 1] != ',') {
                curLine += ',';
            }
        }
        fixedLines.push(curLine);
        prevLine = curLine;
    });
    outData = fixedLines.join("\n");
    return outData;
}
module.exports = Interface;
