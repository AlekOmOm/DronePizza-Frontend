// js/main.js
import { DroneService, DeliveryService } from './services/droneService.js';

class DronePizzaApp {
    constructor() {
        this.initializeEventListeners();
        this.startDeliveryPolling();
    }

    initializeEventListeners() {
        // Add drone button
        document.getElementById('addDroneBtn').addEventListener('click', async () => {
            try {
                await DroneService.addDrone();
                this.updateDeliveryList();
            } catch (error) {
                console.error('Error adding drone:', error);
                alert('Failed to add drone');
            }
        });

        // Simulate new order button
        document.getElementById('simulateOrderBtn').addEventListener('click', async () => {
            try {
                // For simulation, we'll use a random pizza ID between 1-5
                const randomPizzaId = Math.floor(Math.random() * 5) + 1;
                await DeliveryService.addDelivery(randomPizzaId);
                this.updateDeliveryList();
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Failed to create order');
            }
        });
    }

    async updateDeliveryList() {
        try {
            const deliveries = await DeliveryService.getUndeliveredOrders();
            const deliveryList = document.getElementById('deliveryList');
            deliveryList.innerHTML = '';

            // Sort deliveries by expected delivery time (oldest first)
            deliveries.sort((a, b) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime));

            deliveries.forEach(delivery => {
                const deliveryItem = this.createDeliveryListItem(delivery);
                deliveryList.appendChild(deliveryItem);
            });
        } catch (error) {
            console.error('Error updating delivery list:', error);
        }
    }

    createDeliveryListItem(delivery) {
        const li = document.createElement('li');
        li.className = 'delivery-item';

        const status = delivery.droneId ? 'Assigned to drone' : 'Waiting for drone';
        const expectedTime = new Date(delivery.expectedDeliveryTime).toLocaleTimeString();

        li.innerHTML = `
            <span>Order #${delivery.id} - ${status}</span>
            <span>Expected: ${expectedTime}</span>
            ${!delivery.droneId ? `
                <button class="assign-drone-btn" data-delivery-id="${delivery.id}">
                    Assign Drone
                </button>
            ` : `
                <button class="finish-delivery-btn" data-delivery-id="${delivery.id}">
                    Mark Delivered
                </button>
            `}
        `;

        // Add event listeners for the buttons
        const assignButton = li.querySelector('.assign-drone-btn');
        if (assignButton) {
            assignButton.addEventListener('click', async () => {
                try {
                    await DeliveryService.scheduleDelivery(delivery.id);
                    this.updateDeliveryList();
                } catch (error) {
                    console.error('Error assigning drone:', error);
                    alert('Failed to assign drone');
                }
            });
        }

        const finishButton = li.querySelector('.finish-delivery-btn');
        if (finishButton) {
            finishButton.addEventListener('click', async () => {
                try {
                    await DeliveryService.finishDelivery(delivery.id);
                    this.updateDeliveryList();
                } catch (error) {
                    console.error('Error finishing delivery:', error);
                    alert('Failed to mark delivery as finished');
                }
            });
        }

        return li;
    }

    startDeliveryPolling() {
        // Update delivery list every 60 seconds
        setInterval(() => this.updateDeliveryList(), 60000);
        // Initial update
        this.updateDeliveryList();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DronePizzaApp();
});