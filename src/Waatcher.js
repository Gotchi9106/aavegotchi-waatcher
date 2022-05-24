const config = require('config');
const Renderer = require('./Renderer.js');
const Queries = require('./subgraph/Queries.js');

class Waatcher {
    constructor() {
        this.queries = new Queries();
        this.renderer = new Renderer();
        this.state = {
            last_mixed_listings: [],
            last_721_listings: [],
            last_1155_listings: [],
            last_lendings: []
        }
        this.refreshRate = (config.has('app.waatcher.refresh_rate') && config.get('app.waatcher.refresh_rate') >= 10000)
            ? config.get('app.waatcher.refresh_rate')
            : 10000;
    }

    waatch(watchTarget, filters = null) {
        switch (watchTarget) {
            case 'LISTINGS': {
                if (!filters) {
                    this.#fetchAndRenderLastListings();
                    setInterval(() => {
                        this.#fetchAndRenderLastListings();
                    }, this.refreshRate);
                } else {
                    this.#fetchAndRenderLastListingsFiltered(filters);
                    setInterval(() => {
                        this.#fetchAndRenderLastListingsFiltered(filters);
                    }, this.refreshRate);
                }
            } 
                break;
            default: {
                console.error(`Unknown watch target: "${watchTarget}"`);
                process.exit(1);
            }
        }
    }

    summon(filters) {
        this.#fetchAndRenderTokenInfo(filters);
    }

    staats() {
        this.#fetchAndRenderStatistics();
    }

    async #fetchAndRenderLastListings() {
        const [erc721Listings, erc1155Listings] = await this.queries.queryForLastListings();

        if (Object.keys(erc721Listings).length === 0 && Object.keys(erc1155Listings).length === 0) {
            this.renderer.printUserErrorThenExitProcess('Digged through the Baazaar and... found nothing.');
        }

        this.#updateMixedListingsState(erc721Listings, erc1155Listings);
        this.renderer.render('LISTINGS', this.state.last_mixed_listings);
    }

    async #fetchAndRenderLastListingsFiltered(filters) {
        switch (filters.category) {
            case 'gotchi': case 'parcel': case 'portalclose': case 'portalopen': case 'vrfpending': {
                const listings = await this.queries.queryForLast721Listings(filters);
                
                if (Object.keys(listings).length === 0) {
                    this.renderer.printUserErrorThenExitProcess('Digged through the Baazaar and... found nothing.');
                }

                this.#update721ListingsState(listings);
                this.renderer.render('LISTINGS', this.state.last_721_listings);
            }
                break;
            case 'wearable': case 'consumable': case 'ticket': case 'badge': case 'building': case 'tile': {
                const listings = await this.queries.queryForLast1155Listings(filters);

                if (Object.keys(listings).length === 0) {
                    this.renderer.printUserErrorThenExitProcess('Digged through the Baazaar and... found nothing.');  
                }

                this.#update1155ListingsState(listings);
                this.renderer.render('LISTINGS', this.state.last_1155_listings);
            } 
                break;
            default: {
                this.renderer.printUserErrorThenExitProcess(`Unknown category: "${filters.category}"`);
            }
        }
    }

    async #fetchAndRenderTokenInfo(filters) {
        switch (filters.category) {
            case 'gotchi': {
                const aavegotchi = await this.queries.queryForGotchiInfo(filters.id);
                
                if (Object.keys(aavegotchi).length === 0) {
                    this.renderer.printUserErrorThenExitProcess('Digged through the Baazaar and... found nothing.'); 
                }

                this.renderer.render('INFO_GOTCHI', aavegotchi);
            } 
                break;
            default: {
                this.renderer.printUserErrorThenExitProcess(`Unknown category: "${filters.category}"`);
            }
        }
    }

    async #fetchAndRenderStatistics() {
        const response = await this.queries.queryForStatistics();
        const { statistics } = response.data.data || {};

        if (!statistics) {
            console.error('Error while querying Aavegotchi subgraph.');
            process.exit(1);
        }
        else if (!statistics[0] || Object.keys(statistics[0]) === 0) {
            this.renderer.printUserErrorThenExitProcess('No statistics available.');
        }

        this.renderer.render('STATS', statistics[0]);
    }

    #updateMixedListingsState(erc721Listings, erc1155Listings) {
        let results = [];

        erc721Listings.forEach(listing => {
            results.push({
                listing_id: listing.id,
                token_id: listing.tokenId,
                standard: '721',
                seller: listing.seller,
                category_integer: listing.category,
                price_ghst: listing.priceInWei,
                timestamp: listing.timeCreated,
                purchased: (listing.timePurchased != 0),
                cancelled: listing.cancelled
            });
        });

        erc1155Listings.forEach(listing => {
            results.push({
                listing_id: listing.id,
                token_id: listing.erc1155TypeId,
                standard: '1155',
                quantity: listing.quantity,
                seller: listing.seller,
                category_integer: listing.category,
                price_ghst: listing.priceInWei,
                timestamp: listing.timeCreated,
                purchased: listing.sold,
                cancelled: listing.cancelled
            });
        });

        this.state.last_mixed_listings = results.sort((a, b) => { return b.timestamp - a.timestamp });
    }

    #update721ListingsState(erc721Listings) {
        let results = [];

        erc721Listings.forEach(listing => {
            results.push({
                listing_id: listing.id,
                token_id: listing.tokenId,
                standard: '721',
                seller: listing.seller,
                category_integer: listing.category,
                price_ghst: listing.priceInWei,
                timestamp: listing.timeCreated,
                purchased: (listing.timePurchased != 0),
                cancelled: listing.cancelled
            });
        });

        this.state.last_721_listings = results;
    }

    #update1155ListingsState(erc1155Listings) {
        let results = [];

        erc1155Listings.forEach(listing => {
            results.push({
                listing_id: listing.id,
                token_id: listing.erc1155TypeId,
                standard: '1155',
                quantity: listing.quantity,
                seller: listing.seller,
                category_integer: listing.category,
                price_ghst: listing.priceInWei,
                timestamp: listing.timeCreated,
                purchased: listing.sold,
                cancelled: listing.cancelled
            });
        });

        this.state.last_1155_listings = results;
    }
}

module.exports = Waatcher;