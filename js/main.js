// js/main.js
// main.js
import { DeliveryList } from './components/delivery-list-module.js';
import { DroneService, DeliveryService } from './services/api-services.js';

class DronePizzaApp {
  constructor() {
    this.deliveryList = new DeliveryList('deliveryList');
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Add drone button
    document.getElementById('addDroneBtn').addEventListener('click', async () => {
      try {
        await DroneService.addDrone();
        await this.deliveryList.updateList(); // Refresh list after adding drone
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
        await this.deliveryList.updateList(); // Refresh list after adding order
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
      }
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DronePizzaApp();
});
