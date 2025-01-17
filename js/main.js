// js/main.js
import { DeliveryList } from './components/delivery-list-module.js';
import { DroneList } from './components/drone-list-module.js';
import { DeliveryAnimation } from './components/delivery-animation-module.js';
import { DroneService, DeliveryService } from './services/api-services.js';
import { showNotification } from './utils.js';
import './services/delivery-tracker.js';

class DronePizzaApp {
    constructor() {
        this.deliveryList = new DeliveryList('deliveryList');
        this.droneList = new DroneList('droneList');
        this.deliveryAnimation = new DeliveryAnimation('.simulation-animation');
        this.initializeEventListeners();
    }

    async handleAddDrone() {
        const button = document.getElementById('addDroneBtn');
        button.disabled = true;

        try {
            const response = await DroneService.addDrone();
            let serialNumber = response.serialNumber.slice(0, 20).split('-')[0];
            showNotification('New drone added successfully!\nnumber: ' + serialNumber + '...');
            await this.droneList.setNewDrone(response.serialNumber);
            await this.updateLists();
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error adding drone:', error);
        } finally {
            button.disabled = false;
        }
    }

    async handleSimulateOrder() {
        const button = document.getElementById('simulateOrderBtn');
        button.disabled = true;

        try {
            const randomPizzaId = Math.floor(Math.random() * 5) + 1;
            let response = await DeliveryService.addDelivery(randomPizzaId);

            console.log('Response:', response);


            // Start the animation
            await this.deliveryAnimation.startAnimation();

            showNotification('New order created successfully!');
            await this.updateLists();
        } catch (error) {
            showNotification(error.message, 'error');
            console.error('Error creating order:', error);
        } finally {
            button.disabled = false;
        }
    }

    async updateLists() {
        await this.droneList.updateList();
        await this.deliveryList.updateList();
    }

    initializeEventListeners() {
        document.getElementById('addDroneBtn').addEventListener('click',
            () => this.handleAddDrone()
        );

        document.getElementById('simulateOrderBtn').addEventListener('click',
            () => this.handleSimulateOrder()
        );
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DronePizzaApp();
});
