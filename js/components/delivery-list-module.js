// ./js/components/delivery-list-module.js

import { DeliveryService, DroneService } from '../services/api-services.js';
import { showNotification } from "../utils.js";

export class DeliveryList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.deliveries = [];
    this.initialize();
  }

  async initialize() {
    await this.updateList();
    this.startPolling();
  }

  async updateList() {
    try {
      // Get both undelivered orders and available drones
      const [deliveries, drones] = await Promise.all([
        DeliveryService.getUndeliveredOrders(),
        DroneService.getAllDrones()
      ]);

      // Filter operational drones only
      this.availableDrones = drones.filter(drone => drone.status === 'I_DRIFT');
      this.deliveries = deliveries;
      this.render();
    } catch (error) {
      console.error('Error updating delivery list:', error);
      this.renderError(`Failed to fetch deliveries: ${error.message}`);
    }
  }

  async handleAssignDrone(deliveryId) {
    const assignButton = this.container.querySelector(`button[data-delivery-id="${deliveryId}"]`);
    if (assignButton) {
      assignButton.disabled = true;
    }

    try {
      // Only use operational drones
      const availableDrone = this.availableDrones.find(drone => drone.status === 'I_DRIFT');

      if (!availableDrone) {
        throw new Error('No operational drones available');
      }

      await DeliveryService.scheduleDelivery(deliveryId, availableDrone.serialNumber);
      showNotification('Drone assigned successfully!');
      await this.updateList();
    } catch (error) {
      console.error('Error assigning drone:', error);
      showNotification(error.message, 'error');
    } finally {
      if (assignButton) {
        assignButton.disabled = false;
      }
    }
  }

  render() {
    this.container.innerHTML = '';

    if (this.deliveries.length === 0) {
      this.container.innerHTML = `
        <li class="delivery-item">
          <span>No active deliveries</span>
        </li>
      `;
      return;
    }

    // Sort deliveries by expected delivery time (oldest first)
    const sortedDeliveries = this.sortDilveries()

    sortedDeliveries.forEach(delivery => {
      const li = document.createElement('li');
      li.className = 'delivery-item';

      // expectedTime in format: 'HH:MM'
      const expectedTime = new Date(delivery.expectedDeliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        var countdownMinutes = Math.floor((new Date(delivery.expectedDeliveryTime) - new Date()) / 60000);
      const status = delivery.drone ? 'Assigned' : 'Pending';
      const droneInfo = delivery.drone ? `Drone: ${delivery.drone.serialNumber.slice(0, 8)}...` : 'No drone assigned';

      li.innerHTML = `
        <div class="delivery-info">
          <span class="delivery-id">Order #${delivery.id}</span>
          <span class="delivery-pizza">${delivery.pizza.title}</span>
          <div class="delivery-time">
            <span class="delivery-time-info">Expected at: ${expectedTime}</span>
            <span class="countdown-timer"> ${status === 'Pending' ? ' in just '+countdownMinutes+' min!' : ''} </span>
          </div>
          <span class="delivery-status">${status}</span>
          <span class="delivery-drone">${droneInfo}</span>
        </div>
        ${!delivery.drone ? `
          <button
            class="assign-drone-btn"
            data-delivery-id="${delivery.id}"
            ${this.availableDrones.length === 0 ? 'disabled' : ''}
          >
            Assign Drone
          </button>
        ` : ''}
      `;

      // Add click event listener for assign button if present
      const assignButton = li.querySelector('.assign-drone-btn');
      if (assignButton) {
        assignButton.addEventListener('click', () => this.handleAssignDrone(delivery.id));
      }

      this.container.appendChild(li);
    });
  }

  renderError(message) {
    this.container.innerHTML = `
      <div class="error-message">
        ${message}
      </div>
    `;
  }

  sortDilveries() {
    // sort deliveries into two lsts: assigned and unassigned
    // sort each list by expected delivery time
    // merge, so unassigned first, then assigned

    const assignedDeliveries = this.deliveries.filter(delivery => delivery.drone);
    const unassignedDeliveries = this.deliveries.filter(delivery => !delivery.drone);

    let sortedDeliveries = [
      ...unassignedDeliveries.sort((a, b) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime)),
      ...assignedDeliveries.sort((a, b) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime))
    ];

    // only 15 deliveries are shown
    if (sortedDeliveries.length > 15) {
      sortedDeliveries = sortedDeliveries.slice(0, 15);
    }

    return sortedDeliveries;
  }

  startPolling() {
    setInterval(() => this.updateList(), 60000);
  }
}
