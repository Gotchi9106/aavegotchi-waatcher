#!/usr/bin/env node

process.env["NODE_CONFIG_DIR"] =  __dirname + '/../config';
const { name, version } = require('../package.json');
const { Command } = require('commander');
const CommandBuilder = require('../src/CommandBuilder.js');
const DisplayUtils = require('../src/utils/DisplayUtils.js');

function main() {
    const program = new Command();
    const cmdBuilder = new CommandBuilder();

    program
        .name(name)
        .version(version)
        .description(DisplayUtils.getHeader(version))
        .addCommand(cmdBuilder.buildWaatchCmd())
        .addCommand(cmdBuilder.buildSummonCmd())
        .addCommand(cmdBuilder.buildStaatsCmd())
        .addHelpCommand(false)
        .parse(process.argv);
}

main();