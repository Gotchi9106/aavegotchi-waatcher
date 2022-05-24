const ethers = require('ethers');
const termkit = require('terminal-kit');
const term = termkit.terminal;
const DisplayUtils = require('./utils/DisplayUtils.js');

class Renderer {
    render(type, items) {
        // TODO: Use the Document and Layout features from Terminal Kit
        term.clear();

        switch(type) {
            case 'LISTINGS': {
                this.#renderListings(items);
            } break;
            case 'STATS': {
                this.#renderStatistics(items);
            } break;
            case 'INFO_GOTCHI': {
                this.#renderGotchiInfo(items[0]);
            } break;
            default: {
                console.error(`Unknown type: "${type}"`);
                process.exit(1);
            };
        }
    }

    printUserErrorThenExitProcess(message) {
        term('\n').brightRed(`Waatcher :: Oups! 😒 ${message}`)('\n\n');
        process.exit(1);
    }

    #renderListings(listings) {
        term('\n\n').bold('👀 WAATCHING FOR NEW BAAZAAR LISTINGS...')('^K(press CTRL+C to quit)')('\n\n');

        const tableCells = [['TOKEN', 'QTY', 'PRICE/unit', 'STATUS', 'SELLER', 'BAAZAAR LINK', 'LISTED AT']];
        listings.forEach(listing => {
            tableCells.push([
                `^B${DisplayUtils.getPrettyCategoryFromInt(listing.standard, listing.category_integer)}^c#${listing.token_id}^`,
                `^K${listing.standard === '1155' ? `x${listing.quantity}` : 'x1'}^`,
                `^M${ethers.utils.formatEther(listing.price_ghst.toString())} ^mGHST^`,
                `${DisplayUtils.getListingStatusString(listing)}`,
                `^K${listing.seller.slice(0, 8)}^`,
                `^K${DisplayUtils.generateBaazaarURLString(listing.standard, listing.listing_id)}^`,
                `^K${DisplayUtils.formatTimeString(listing.timestamp)}^`
            ]);
        });

        term.table(tableCells,{
            contentHasMarkup: true,
            hasBorder: true,
            borderChars: 'empty',
            textAttr: { bgColor: 'default' },
            width: 140,
            fit: true
        });

        term('\n\n');
    }

    #renderGotchiInfo(gotchi) {
        if (parseInt(gotchi.status) === 0) {
            this.printUserErrorThenExitProcess("this Gotchi has not been summoned yet...");
        }
        
        term('\n\n').bold('BoOOoo! ')(`I'm Gotchi `).bold(`^B#${gotchi.gotchiId}`)(`^W but everyone calls me `).bold(`^M${gotchi.name}`)(`^W.`)('\n')('\n');
        term.table([
            ['🎃 ^wHaunt', gotchi.hauntId],
            ['🏅 ^wLevel', `${gotchi.level}`],
            ['🔬 ^wXP', `${DisplayUtils.generateGotchiExperienceProgressBar(gotchi)}`],
            ['💎 ^wRarity', `^C${gotchi.baseRarityScore}^K-^G${gotchi.modifiedRarityScore}^K-^Y${gotchi.withSetsRarityScore}`],
            ['💜 ^wKinship', gotchi.kinship],
            ['🌀 ^wSpirit', `${ethers.utils.formatEther(gotchi.stakedAmount)} ^K${DisplayUtils.getCollateral(gotchi.collateral).symbol}`],
            ['🌈 ^wTraits', DisplayUtils.generateGotchiTraitsString(gotchi)],
            ['👘 ^wEquipped set', `${(gotchi.equippedSetName) ? gotchi.equippedSetName : 'No set equiped'}`],
            //['🧢 ^wEquipped wearables', gotchi.equippedWearables],
            ['👻 ^wSummon block', gotchi.createdAt],
            ['👾 ^wLast interaction', DisplayUtils.formatTimeString(gotchi.lastInteracted)],
            ['🌍 ^wURL', DisplayUtils.generateGotchiInfoURL(gotchi.id)],
        ],{
            contentHasMarkup: true,
            hasBorder: true,
            borderChars: 'empty',
            textAttr: { bgColor: 'default' },
            width: 80,
            fit: true
        });

        term('\n\n');
    }

    #renderStatistics(stats) {
        term('\n\n').bold('👻 AAVEGOTCHI STAATISTICS')('\n\n');
        term.table([
            ['Portals bougth', stats.portalsBought],
            ['Portals opened', stats.portalsOpened],
            ['Gotchis claimed', stats.aavegotchisClaimed],
            ['ERC721 volume', DisplayUtils.getVolumeString(stats.erc721TotalVolume)],
            ['ERC1155 volume', DisplayUtils.getVolumeString(stats.erc1155TotalVolume)],
            ['Wearables volume', DisplayUtils.getVolumeString(stats.totalWearablesVolume)],
            ['Consumables volume', DisplayUtils.getVolumeString(stats.totalConsumablesVolume)],
            ['Tickets volume', DisplayUtils.getVolumeString(stats.totalTicketsVolume)]
        ],{
            contentHasMarkup: true,
            hasBorder: true,
            borderChars: 'empty',
            textAttr: { bgColor: 'default' },
            width: 60,
            fit: true
        });

        term('\n\n');
    }
}

module.exports = Renderer;