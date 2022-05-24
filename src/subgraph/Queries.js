const axios = require('axios');
const config = require('config');
const DisplayUtils = require('../utils/DisplayUtils.js');

class Queries {  
    constructor() {
        if (config.has('app.subgraph.url') && config.get('app.subgraph.url').length > 0) {
            this.subgraphURL = config.get('app.subgraph.url');
        }
        else {
            console.error(`Subgraph URL is not properly defined in config/default.json.`);
            process.exit(1);
        }   
    }

    async queryForLastListings() {
        let response;

        try {
            response = await axios.post(this.subgraphURL, { 
                query: this.#query_last721and1155Listings()
            });
        } 
        catch (error) {
            console.error('Error while querying Aavegotchi Subgraph.');
            process.exit(1);
        }

        const { erc721Listings } = response.data.data || {};
        const { erc1155Listings } = response.data.data || {};

        if (!erc721Listings || !erc1155Listings) {
            console.error("Error while querying Aavegotchi Subgraph.");
            process.exit(1);
        }

        return [erc721Listings, erc1155Listings];
    }

    async queryForLast721Listings(filters) {
        let response;

        try {
            response = await axios.post(this.subgraphURL, { 
                query: this.#query_last721Listings(filters) 
            });
        } 
        catch (error) {
            console.error('Error while querying Aavegotchi Subgraph.');
            process.exit(1);

        }
        
        const { erc721Listings } = response.data.data || {};
        
        if (!erc721Listings) {
            console.error("Error while querying Aavegotchi Subgraph.");
            process.exit(1);
        }

        return erc721Listings;
    }

    async queryForLast1155Listings(filters) {
        let response;

        try {
            response = await axios.post(this.subgraphURL, { 
                query: this.#query_last1155Listings(filters) 
            });
        } 
        catch (error) {
            console.error('Error while querying Aavegotchi Subgraph.');
            process.exit(1);
        }

        const { erc1155Listings } = response.data.data || {};

        if (!erc1155Listings) {
            console.error("Error while querying Aavegotchi Subgraph.");
            process.exit(1);
        }

        return erc1155Listings;
    }

    async queryForGotchiInfo(gotchiID) {
        let response;

        try {
            response = await axios.post(this.subgraphURL, { 
                query: this.#query_gotchiInfo(gotchiID) 
            });
        } 
        catch (error) {
            console.error('Error while querying Aavegotchi Subgraph.');
            process.exit(1);
        }

        const { aavegotchis } = response.data.data || {};

        if (!aavegotchis) {
            console.error('Error while querying Aavegotchi subgraph.');
            process.exit(1);
        }

        return aavegotchis;
    }

    async queryForStatistics() {
        let response;

        try {
            response = await axios.post(this.subgraphURL, { 
                query: this.#query_statistics() 
            });
        } 
        catch (error) {
            console.error('Error while querying Aavegotchi Subgraph.');
            process.exit();
        }

        return response;
    }

    #query_last721and1155Listings() {
        return `{
            erc721Listings(first: 5, orderBy: timeCreated, orderDirection: desc) {
                id
                category
                timeCreated
                timePurchased
                seller
                tokenId
                priceInWei
                cancelled
            }
            erc1155Listings(first: 5, orderBy: timeCreated, orderDirection: desc) {
                id
                category
                erc1155TokenAddress
                erc1155TypeId
                priceInWei
                quantity
                timeCreated
                sold
                seller
                cancelled
            }
        }`;
    }

    #query_last721Listings(filters) {
        const categoryInt = DisplayUtils.getCategoryIntegerFromString('721', filters.category);
        const whereClause = `where: { category:${categoryInt} ${filters.id ? ', tokenId:' + filters.id : ''} }`;
        
        return `{
            erc721Listings(
                first: 10, 
                ${whereClause},
                orderBy: timeCreated, 
                orderDirection: desc
            ){
                id
                category
                timeCreated
                timePurchased
                seller
                tokenId
                priceInWei
                cancelled
            }
        }`;
    }

    #query_last1155Listings(filters) {
        const categoryInt = DisplayUtils.getCategoryIntegerFromString('1155', filters.category);
        const whereClause = `where: { category:${categoryInt} ${filters.id ? ', erc1155TypeId:' + filters.id : ''} }`;
        
        return `{
            erc1155Listings(first: 10, ${whereClause}, orderBy: timeCreated, orderDirection: desc) {
                id
                category
                erc1155TokenAddress
                erc1155TypeId
                priceInWei
                quantity
                timeCreated
                sold
                seller
                cancelled
            }
        }`;
    }

    #query_gotchiInfo(id) {
        const whereClause = `where: { gotchiId: ${id} }`;

        return `{
            aavegotchis(${whereClause}) {
                id
                status
                gotchiId
                hauntId
                name
                numericTraits
                modifiedNumericTraits
                withSetsNumericTraits
                equippedSetName
                collateral
                stakedAmount
                equippedWearables
                kinship
                lastInteracted
                experience
                toNextLevel
                level
                baseRarityScore
                modifiedRarityScore
                withSetsRarityScore
                createdAt 
            }
        }`;
    }

    #query_statistics() {
        return `{
            statistics(where: { id: 0 }) {
                id
                portalsBought
                portalsOpened
                aavegotchisClaimed
                erc721ActiveListingCount
                erc1155ActiveListingCount
                erc721TotalVolume
                erc1155TotalVolume
                totalWearablesVolume
                totalConsumablesVolume
                totalTicketsVolume
            }
        }`;
    }
}

module.exports = Queries;