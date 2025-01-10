require('dotenv').config();
const axios = require('axios');

const {getClients,getClientsFull,getClientFullByID,getReservations,getTenants,getTags} = require('./api/golfmanager');
const {createOrUpdateContactInHubSpot,createOrUpdateDealInHubSpot,createOrUpdateCompanyInHubSpot,getAllContactsFromHubSpot,associateDealWithContact, associateDealWithCompany} = require('./api/hubspot');

const freeEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "yahoo.es",
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

const hubspotTags = [
    { id: "12", name: "ABONADO 2019" },
    { id: "18", name: "ABONADO AF PREMIUM" },
    { id: "19", name: "ABONADO AF STANDARD" },
    { id: "15", name: "ABONADO AI PREMIUM" },
    { id: "5", name: "ABONADO AI STANDARD" },
    { id: "29", name: "ABONADO ALBATROS" },
    { id: "17", name: "ABONADO AM PREMIUM" },
    { id: "16", name: "ABONADO AM STANDARD" },
    { id: "20", name: "ABONADO CORPORATIVO 2T" },
    { id: "21", name: "ABONADO CORPORATIVO 4T" },
    { id: "31", name: "ABONADO EAGLE" },
    { id: "7", name: "ABONADO SEMESTRAL" },
    { id: "30", name: "ABONADO SUNSET" },
    { id: "6", name: "ABONADO TRIMESTRAL" },
    { id: "24", name: "ALDIANA" },
    { id: "8", name: "GOLF DESK" },
    { id: "14", name: "GOLF EXPERIENCE" },
    { id: "13", name: "GOLF SERVICE" },
    { id: "23", name: "GOLFBREAKS" },
    { id: "4", name: "HOTEL" },
    { id: "9", name: "HOTEL RESIDENTE SO" },
    { id: "26", name: "MARKETING" },
    { id: "32", name: "RCG VALDERRAMA" },
    { id: "22", name: "REAL CLUB GOLF SOTOGRANDE" },
    { id: "28", name: "SO" },
    { id: "27", name: "STAFF" },
    { id: "25", name: "So | Sotogrande" },
    { id: "2", name: "TTOO" },
    { id: "10", name: "TTOO RESIDENTE SO" },
    { id: "1", name: "VISITANTE" }
];


(async () => {
    try {
        //const clients = await getClients();

        var date = getCurrentDate();
        
        var startFormatted = `${date}T00:00:00+01:00`;
        var endFormatted = `${date}T23:00:00+01:00`;
        
        /*
        var start = '2024-01-01';
        var end = '2024-12-22';
        */
        console.log('start:', startFormatted);
        console.log('end:', endFormatted);
        const deals = await getReservations(startFormatted,endFormatted);

        //console.log(JSON.stringify(deals));
        
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
                const hubspotContact = await createOrUpdateContactInHubSpot(golfClient.id, golfClient, hubspotTags); 
                
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