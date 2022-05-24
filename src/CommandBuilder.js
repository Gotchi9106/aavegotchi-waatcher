
const { Command } = require('commander');
const Waatcher = require('./Waatcher.js');

class CommandBuilder {
    buildWaatchCmd() {
        const waatchCmd = new Command('waatch');

        waatchCmd
            .alias('w')
            .description('waatch for new listings or lendings with live update.');
            
        waatchCmd
            .command('baazaar')
            .alias('b')
            .description('waatch for new Baazaar listings.')
            .option('-c <category>', 'filter results by a given category: gotchi|portalclose|portalopen|parcel|wearable|consumable|badge|ticket|building|tile.')
            .option('-i <token_id>', 'filter category results by a given token ID.')
            .action((options) => {
                const waatcher = new Waatcher();
                const filters = {};
                
                if (!options.c) {
                    waatcher.waatch('LISTINGS');
                } else {
                    filters.category = options.c;

                    if (options.i) {
                        if (isNaN(options.i)) {
                            waatcher.renderer.printUserErrorThenExitProcess('token_id option must be a number.');
                        }
                        
                        filters.id = options.i;
                    }

                    waatcher.waatch('LISTINGS', filters);
                }
            });
    
        waatchCmd
            .command('lendings')
            .alias('l')
            .description('waatch for new lending listings (Gotchis only).')
            .option('-i <token_id>', 'filter by gotchi ID.')
            .action(() => {
                const waatcher = new Waatcher();
                waatcher.renderer.printUserErrorThenExitProcess('This feature is not yet implemented.');
            });

        return waatchCmd;
    }

    buildSummonCmd() {
        const summonCmd = new Command('summon');

        summonCmd
            .alias('s')
            .description('display information about an aavegotchi asset.')
            .requiredOption('-c <category>', 'the token category: gotchi|portalclose|portalopen|parcel|wearable|consumable|badge|ticket|building|tile.')
            .requiredOption('-i <token_id>', 'the token id.')
            .action((options) => {
                const waatcher = new Waatcher();
                const filters = {};

                if (isNaN(options.i)) {
                    waatcher.renderer.printUserErrorThenExitProcess('token_id option must be a number.');
                }
                
                filters.category = options.c;
                filters.id = options.i;

                waatcher.summon(filters);
            });  
        
        return summonCmd;
    }
    
    buildStaatsCmd() {
        const staatsCmd = new Command('staats');
    
        staatsCmd
            .description('display Aavegotchi stats.')
            .action(() => {
                const waatcher = new Waatcher();
                waatcher.staats();
            });
    
        return staatsCmd;
    }
}

module.exports = CommandBuilder;