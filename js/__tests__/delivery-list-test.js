// js/tests/deliveryList.test.js
import { DroneService, DeliveryService } from '../services/api-services';
import { DeliveryList } from '../components/delivery-list-module';

describe('DeliveryList', () => {
    let deliveryList;
    let container;

    // Mock data
    const mockDeliveries = [
        {
            id: 1,
            expectedDeliveryTime: '2025-01-16T10:00:00',
            droneId: null
        },
        {
            id: 2,
            expectedDeliveryTime: '2025-01-16T09:30:00',
            droneId: 'drone-123'
        }
    ];

    // Setup before each test
    beforeEach(() => {
        // Create mock container
        container = document.createElement('ul');
        container.id = 'deliveryList';
        document.body.appendChild(container);

      // Mock DeliveryService methods
      jest.spyOn(DeliveryService, 'getUndeliveredOrders').mockResolvedValue(mockDeliveries);
      jest.spyOn(DeliveryService, 'scheduleDelivery').mockResolvedValue({});
      jest.spyOn(DeliveryService, 'finishDelivery').mockResolvedValue({});

        deliveryList = new DeliveryList('deliveryList');
    });

    // Cleanup after each test
    afterEach(() => {
        document.body.removeChild(container);
        jest.clearAllMocks();
    });

    test('updateList fetches and sorts deliveries', async () => {
        await deliveryList.updateList();
        // Should be sorted by expectedDeliveryTime
        expect(deliveryList.deliveries[0].id).toBe(2);
        expect(deliveryList.deliveries[1].id).toBe(1);
    });

    test('renders empty state when no deliveries', async () => {
        DeliveryService.getUndeliveredOrders.mockResolvedValueOnce([]);
        await deliveryList.updateList();
        expect(container.innerHTML).toContain('No active deliveries');
    });

    test('renders delivery items with correct status', async () => {
        await deliveryList.updateList();
        const deliveryItems = container.querySelectorAll('.delivery-item');
        expect(deliveryItems.length).toBe(2);

        // Check waiting status
        expect(deliveryItems[1].innerHTML).toContain('Waiting for drone');
        expect(deliveryItems[1].querySelector('.assign-drone-btn')).toBeTruthy();

        // Check assigned status
        expect(deliveryItems[0].innerHTML).toContain('Assigned to drone');
        expect(deliveryItems[0].querySelector('.finish-delivery-btn')).toBeTruthy();
    });

    test('handleAssignDrone calls service and updates list', async () => {
        await deliveryList.handleAssignDrone(1);
        expect(DeliveryService.scheduleDelivery).toHaveBeenCalledWith(1);
        expect(DeliveryService.getUndeliveredOrders).toHaveBeenCalled();
    });

    test('handleFinishDelivery calls service and updates list', async () => {
        await deliveryList.handleFinishDelivery(1);
        expect(DeliveryService.finishDelivery).toHaveBeenCalledWith(1);
        expect(DeliveryService.getUndeliveredOrders).toHaveBeenCalled();
    });

    test('handles API errors gracefully', async () => {
        DeliveryService.getUndeliveredOrders.mockRejectedValueOnce(new Error('API Error'));
        await deliveryList.updateList();
        expect(container.innerHTML).toContain('Failed to fetch deliveries');

        console.error('Expected error: API Error');
    });
});
