// __tests__/api-services.test.js
import { DroneService, DeliveryService } from '../services/api-services';

// Mock fetch globally
global.fetch = jest.fn();

// Shared helper functions
const mockSuccessResponse = (data) => {
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(data)
        })
    );
};

const mockErrorResponse = (status = 500) => {
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: false,
            status
        })
    );
};

// Helper to create expected auth header
const getExpectedAuthHeader = () => {
    const base64Credentials = btoa('admin:admin1234');
    return {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json'
    };
};

describe('DroneService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('getAllDrones', () => {
        it('should fetch all drones with auth headers', async () => {
            const mockDrones = [
                { id: 1, status: 'active', stationId: 1 },
                { id: 2, status: 'inactive', stationId: 2 }
            ];
            mockSuccessResponse(mockDrones);

            const result = await DroneService.getAllDrones();
            expect(result).toEqual(mockDrones);
            expect(fetch).toHaveBeenCalledWith('/drones', {
                headers: getExpectedAuthHeader()
            });
        });

        it('should handle unauthorized error', async () => {
            mockErrorResponse(401);
            await expect(DroneService.getAllDrones())
                .rejects.toThrow('HTTP error! status: 401');
        });
    });

    describe('addDrone', () => {
        it('should add a new drone with auth headers', async () => {
            const mockNewDrone = { id: 3, status: 'active', stationId: 1 };
            mockSuccessResponse(mockNewDrone);

            const result = await DroneService.addDrone();
            expect(result).toEqual(mockNewDrone);
            expect(fetch).toHaveBeenCalledWith('/drones/add', {
                method: 'POST',
                headers: getExpectedAuthHeader()
            });
        });
    });
});

describe('DeliveryService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('getUndeliveredOrders', () => {
        it('should fetch undelivered orders with auth headers', async () => {
            const mockDeliveries = [
                { id: 1, status: 'pending', pizzaId: 1 },
                { id: 2, status: 'in_progress', pizzaId: 2 }
            ];
            mockSuccessResponse(mockDeliveries);

            const result = await DeliveryService.getUndeliveredOrders();
            expect(result).toEqual(mockDeliveries);
            expect(fetch).toHaveBeenCalledWith('/deliveries', {
                headers: getExpectedAuthHeader()
            });
        });
    });

    describe('scheduleDelivery', () => {
        it('should schedule delivery with auth headers', async () => {
            const deliveryId = 1;
            const droneId = 1;
            mockSuccessResponse({ success: true });

            await DeliveryService.scheduleDelivery(deliveryId, droneId);
            expect(fetch).toHaveBeenCalledWith('/deliveries/schedule', {
                method: 'POST',
                headers: getExpectedAuthHeader(),
                body: JSON.stringify({ deliveryId, droneId })
            });
        });

        it('should handle unauthorized error', async () => {
            const deliveryId = 1;
            const droneId = 1;
            mockErrorResponse(401);

            await expect(DeliveryService.scheduleDelivery(deliveryId, droneId))
                .rejects.toThrow('HTTP error! status: 401');
        });
    });

    describe('authentication errors', () => {
        it('should handle 403 Forbidden response', async () => {
            mockErrorResponse(403);
            await expect(DeliveryService.getUndeliveredOrders())
                .rejects.toThrow('HTTP error! status: 403');
        });

        it('should handle 401 Unauthorized response', async () => {
            mockErrorResponse(401);
            await expect(DeliveryService.getUndeliveredOrders())
                .rejects.toThrow('HTTP error! status: 401');
        });
    });
});
