// js/main.js
import { DeliveryList } from './components/delivery-list-module.js';
import { DroneList } from './components/drone-list-module.js';
import { DroneService, DeliveryService } from './services/api-services.js';
import { showNotification } from './utils.js';
import {Drone} from "./types/drones.js";

class DronePizzaApp {

  constructor() {
    this.deliveryList = new DeliveryList('deliveryList');
    this.droneList = new DroneList('droneList');
    this.initializeEventListeners();
  }

  async handleAddDrone() {
    const button = document.getElementById('addDroneBtn');

    try {
      const response = await DroneService.addDrone();

      let serialNumber = response.serialNumber
        .slice(0, 20)
        .split('-')[0];

      showNotification('New drone added successfully!'+'\n number: '+serialNumber+'...');
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
      await DeliveryService.addDelivery(randomPizzaId);

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
    // Add drone button
    document.getElementById('addDroneBtn').addEventListener('click',
      () => this.handleAddDrone()
    );

    // Simulate new order button
    document.getElementById('simulateOrderBtn').addEventListener('click',
      () => this.handleSimulateOrder()
    );
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DronePizzaApp();
});
