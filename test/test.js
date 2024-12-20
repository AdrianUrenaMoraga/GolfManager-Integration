const { createOrUpdateContactInHubSpot, createOrUpdateDealInHubSpot } = require('../api/hubspot');

describe('HubSpot Contact and Deal Creation - Invalid Email Format', () => {
    test('should handle invalid email format gracefully', async () => {
        // Mock reservation for deal creation
        const mockReservation = {
            id: 103909, // Reservation ID, maps to id_mbudo in the payload
            clientName: 'Golf Breaks', // Client name, used in dealname
            createDate: '2023-12-01T15:34:10Z', // Reservation creation date
            idClient: 2221, // Client ID, maps to id_cliente_mbudo
            total: 100, // Total reservation amount, maps to amount
            closedate: '2024-04-18T06:40:00Z', // Close date for the deal
        };

        // Mock contact for contact creation
        const mockContact = {
            id: 2221, // Contact ID
            name: 'Invalid Contact', // Contact name
            email: 'invalid-email-format', // Invalid email format
            phone: '08080808'
        };

        // Test deal creation
        try {
            const dealResult = await createOrUpdateDealInHubSpot(mockReservation);
            //console.log(dealResult);

            // Expect deal to be created successfully
            expect(dealResult).not.toBeNull();
            expect(dealResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Deal creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

        // Test contact creation
        try {
            const contactResult = await createOrUpdateContactInHubSpot(mockReservation.idClient,mockContact);
            console.log(contactResult);

            // If no error is thrown, the test should fail
            expect(contactResult).toBeNull();
        } catch (error) {
            // Expect an error to be thrown
            console.error('Contact creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }
    });
});

describe('HubSpot Contact and Deal Creation -  Same Email for Two IDs Format', () => {
    test('should handle invalid email format gracefully', async () => {
        // Mock reservation for deal creation
        const mockReservation1 = {
            id: 103909, // Reservation ID, maps to id_mbudo in the payload
            clientName: 'Golf Breaks', // Client name, used in dealname
            createDate: '2023-12-01T15:34:10Z', // Reservation creation date
            idClient: 2221, // Client ID, maps to id_cliente_mbudo
            total: 100, // Total reservation amount, maps to amount
            closedate: '2024-04-18T06:40:00Z', // Close date for the deal
        };

        // Mock contact for contact creation
        const mockContact1 = {
            id: 2221, // Contact ID
            name: 'Contact1', // Contact name
            email: 'adur@icx.co', // Invalid email format
            phone: '08080808'
        };


        // Mock reservation for deal creation
        const mockReservation2 = {
            id: 104000, // Reservation ID, maps to id_mbudo in the payload
            clientName: 'Golf Breaks', // Client name, used in dealname
            createDate: '2023-12-01T15:34:10Z', // Reservation creation date
            idClient: 2224, // Client ID, maps to id_cliente_mbudo
            total: 100, // Total reservation amount, maps to amount
            closedate: '2024-04-18T06:40:00Z', // Close date for the deal
        };

        // Mock contact for contact creation
        const mockContact2= {
            id: 2224, // Contact ID
            name: 'Contact2', // Contact name
            email: 'ad@icx.co', // Invalid email format
            phone: '08080808'
        };

        // Test deal creation
        try {
            const dealResult = await createOrUpdateDealInHubSpot(mockReservation1);
            //console.log(dealResult);

            // Expect deal to be created successfully
            expect(dealResult).not.toBeNull();
            expect(dealResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Deal creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

        // Test contact creation
        try {
            const contactResult = await createOrUpdateContactInHubSpot(mockReservation1.idClient,mockContact1);
            //console.log(contactResult);

            // If no error is thrown, the test should fail
            expect(contactResult).not.toBeNull();
            expect(contactResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Contact creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }


        // Test deal creation
        try {
            const dealResult = await createOrUpdateDealInHubSpot(mockReservation2);
            //console.log(dealResult);

            // Expect deal to be created successfully
            expect(dealResult).not.toBeNull();
            expect(dealResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Deal creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

        // Test contact creation
        try {
            const contactResult = await createOrUpdateContactInHubSpot(mockReservation2.idClient,mockContact2);
            //console.log(contactResult);

            // If no error is thrown, the test should fail
            expect(contactResult).not.toBeNull();
            expect(contactResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Contact creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

    });
});

describe('HubSpot Contact and Deal Creation - Missing IDs', () => {
    test('should handle invalid ids format gracefully', async () => {
        // Mock reservation for deal creation
        const mockReservation = {
            clientName: 'Golf Breaks', // Client name, used in dealname
            createDate: '2023-12-01T15:34:10Z', // Reservation creation date
            total: 100, // Total reservation amount, maps to amount
            closedate: '2024-04-18T06:40:00Z', // Close date for the deal
        };

        // Mock contact for contact creation
        const mockContact = {
            name: 'Invalid Contact', // Contact name
            email: 'invalid-email-format', // Invalid email format
            phone: '08080808'
        };

        // Test deal creation
        try {
            const dealResult = await createOrUpdateDealInHubSpot(mockReservation);
            //console.log(dealResult);

            // Expect deal to be created successfully
            expect(dealResult).toBeNull();
        } catch (error) {
            // Expect an error to be thrown
            console.error('Deal creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

        // Test contact creation
        try {
            const contactResult = await createOrUpdateContactInHubSpot(mockReservation.idClient,mockContact);
            console.log(contactResult);

            // If no error is thrown, the test should fail
            expect(contactResult).toBeNull();
        } catch (error) {
            // Expect an error to be thrown
            console.error('Contact creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }
    });
});

describe('HubSpot Contact and Deal Creation - Mssing Email', () => {
    test('should handle email gracefully', async () => {
        // Mock reservation for deal creation
        const mockReservation = {
            id: 10390, // Reservation ID, maps to id_mbudo in the payload
            clientName: 'Golf Breaks', // Client name, used in dealname
            createDate: '2023-12-01T15:34:10Z', // Reservation creation date
            idClient: 2222, // Client ID, maps to id_cliente_mbudo
            total: 100, // Total reservation amount, maps to amount
            closedate: '2024-04-18T06:40:00Z', // Close date for the deal
        };

        // Mock contact for contact creation
        const mockContact = {
            id: 2222, // Contact ID
            name: 'Invalid Contact', // Contact name
            email: 'invalid-email-format', // Invalid email format
            phone: '08080808'
        };

        // Test deal creation
        try {
            const dealResult = await createOrUpdateDealInHubSpot(mockReservation);
            //console.log(dealResult);

            // Expect deal to be created successfully
            expect(dealResult).not.toBeNull();
            expect(dealResult).toHaveProperty('id');
        } catch (error) {
            // Expect an error to be thrown
            console.error('Deal creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }

        // Test contact creation
        try {
            const contactResult = await createOrUpdateContactInHubSpot(mockReservation.idClient,mockContact);
            console.log(contactResult);

            // If no error is thrown, the test should fail
            expect(contactResult).toBeNull();
        } catch (error) {
            // Expect an error to be thrown
            console.error('Contact creation error:', error.response?.data || error.message);
            expect(error).toBeDefined();

            // Optionally, verify the error message
            expect(error.response?.data).toHaveProperty('message');
            expect(error.response.data.message).toContain('email');
        }
    });
});