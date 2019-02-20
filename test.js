#!/usr/bin/env node
var occtl = require('./');

occtl.socketPath = '/var/run/occtl.socket';
occtl.occtlPath = '/usr/bin/occtl';


occtl.connect();

