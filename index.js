require('dotenv').config();
const axios = require('axios');


const {getClients,getClientsFull,getClientFullByID,getReservations,getTenants,getTags} = require('./api/golfmanager');
const {createOrUpdateContactInHubSpot,createOrUpdateDealInHubSpot,createOrUpdateCompanyInHubSpot,getAllContactsFromHubSpot,associateDealWithContact, associateDealWithCompany} = require('./api/hubspot');

const freeEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "zoho.com",
    "yandex.com",
    "protonmail.com",
    "mail.com",
    "gmx.com",
];

(async () => {
    try {
        //const clients = await getClients();
        /*
        var start = getCurrentDate();
        var end = getCurrentDate();
        */
        var start = '2020-01-01';
        var end = '2020-11-25';

        const deals = await getReservations(start,end);

        for (const golfReservation of deals) {
             console.log(`Processing deal with id_mbudo: ${golfReservation.id}`);
            const hubspotDeal = await createOrUpdateDealInHubSpot(golfReservation);
            if (hubspotDeal) {
                console.log(`Deal processed successfully: ${hubspotDeal.id}`);
                
                // Attempt to associate the deal with a contact
                const golfClient = await getClientFullByID(golfReservation.idClient);

                if (!golfClient || !golfClient.id) {
                    console.log(`No client data found for id_mbudo: ${golfReservation.idClient}`);
                    continue;
                }
                const hubspotContact = await createOrUpdateContactInHubSpot(golfClient.id, golfClient); 
                
                if (hubspotContact) {
                   console.log(`Associating deal ${hubspotDeal.id} with contact ${hubspotContact.id}`);
                    await associateDealWithContact(hubspotDeal.id, hubspotContact.id);
                } else {
                    console.log(`No matching contact found for deal id_mbudo: ${golfReservation.idClient}`);
                }

                if (golfClient.email) {
                    const domain = golfClient.email.split("@")[1]?.toLowerCase();

                    if (freeEmailDomains.includes(domain)) {
                        console.log(`Skipping company creation for free email domain: ${domain}`);
                    } else {
                        const hubspotCompany = await createOrUpdateCompanyInHubSpot(golfClient.id, golfClient,domain);
                        if (hubspotCompany) {
                            console.log(`Associating deal ${hubspotDeal.id} with company ${hubspotCompany.id}`);
                            await associateDealWithCompany(hubspotDeal.id, hubspotCompany.id);
                        } else {
                            console.log(`No matching company found for deal id_mbudo: ${golfReservation.idClient}`);
                        }
                    }
                } else {
                    console.log("No email provided for the client; skipping company creation.");
                }

            } else {
                console.log('Failed to process deal. Check logs for details.');
            }
        }
        console.log('All deals processed');
    } catch (error) {
        console.error('Error during client or reservation processing:', error.message);
    }
})();

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
}