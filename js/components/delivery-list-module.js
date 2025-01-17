// ./js/components/delivery-list-module.js

import { DeliveryService, DroneService } from '../services/api-services.js';
import { showNotification } from "../utils.js";

export class DeliveryList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.deliveries = [];
    this.deliveryTimers = {};  // Add this to track delivery timers
    this.loadTimersFromStorage();
    this.initialize();

    // Add window unload listener
    window.addEventListener('beforeunload', () => {
      this.saveTimersToStorage();
    });
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
      const availableDrone = this.availableDrones.find(drone => drone.status === 'I_DRIFT');
      if (!availableDrone) {
        throw new Error('No operational drones available');
      }

      await DeliveryService.scheduleDelivery(deliveryId, availableDrone.serialNumber);
      showNotification('Drone assigned successfully!');

      // Start a timer for automatic delivery completion
      this.startDeliveryTimer(deliveryId);

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

  // Add these new methods for delivery timer handling
  startDeliveryTimer(deliveryId, remainingTime = null) {
    // Use provided remaining time or generate new random time
    const deliveryTime = remainingTime || (Math.random() * 13 + 2) * 60 * 1000;
    const endTime = Date.now() + deliveryTime;

    // Clear existing timer if any
    if (this.deliveryTimers[deliveryId]) {
      clearTimeout(this.deliveryTimers[deliveryId].timer);
    }

    this.deliveryTimers[deliveryId] = {
      endTime: endTime,
      timer: setTimeout(async () => {
        try {
          await DeliveryService.finishDelivery(deliveryId);
          delete this.deliveryTimers[deliveryId];
          this.saveTimersToStorage(); // Save after deleting
          showNotification('Delivery nr. '+deliveryId+ ' completed successfully!');
          await this.updateList();
        } catch (error) {
          console.error('Failed to complete delivery:', error);
          showNotification('Failed to complete delivery', 'error');
        }
      }, deliveryTime)
    };

    this.saveTimersToStorage(); // Save after setting new timer
  }

  // timer storage
  loadTimersFromStorage() {
    const savedTimers = localStorage.getItem('deliveryTimers');
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers);
      // Only keep timers that haven't expired
      Object.entries(parsedTimers).forEach(([deliveryId, timerData]) => {
        if (timerData.endTime > Date.now()) {
          this.startDeliveryTimer(parseInt(deliveryId), timerData.endTime - Date.now());
        }
      });
    }
  }

  saveTimersToStorage() {
    localStorage.setItem('deliveryTimers', JSON.stringify(this.deliveryTimers));
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
    const sortedDeliveries = this.sortDeliveries()

    sortedDeliveries.forEach(delivery => {
      const li = document.createElement('li');
      li.className = 'delivery-item';

      const expectedTime = new Date(delivery.expectedDeliveryTime)
        .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      let timeInfo;
      if (delivery.drone) {
        const timer = this.deliveryTimers[delivery.id];
        if (timer) {
          const timeLeft = Math.max(0, timer.endTime - Date.now());
          const minutesLeft = Math.ceil(timeLeft / 60000);
          timeInfo = `Delivering: ${minutesLeft} min remaining`;
        } else {
          // Start a new timer for existing deliveries that don't have one
          this.startDeliveryTimer(delivery.id);
          timeInfo = 'Starting delivery...';
        }
      } else {
        const countdownMinutes = Math.floor((new Date(delivery.expectedDeliveryTime) - new Date()) / 60000);
        timeInfo = `Expected in ${countdownMinutes} min!`;
      }

      li.innerHTML = `
        <div class="delivery-info">
          <span class="delivery-id">Order #${delivery.id}</span>
          <span class="delivery-pizza">${delivery.pizza.title}</span>
          <div class="delivery-time">
            <span class="delivery-time-info">Expected at: ${expectedTime}</span>
            <span class="countdown-timer">${timeInfo}</span>
          </div>
          <span class="delivery-status ${delivery.drone ? 'assigned' : 'waiting'}">
            ${delivery.drone ? 'Assigned' : 'Pending'}
          </span>
          <span class="delivery-drone">
            ${delivery.drone ? `Drone: ${delivery.drone.serialNumber.slice(0, 8)}...` : 'No drone assigned'}
          </span>
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

      const assignButton = li.querySelector('.assign-drone-btn'); // assign button
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

  sortDeliveries() {
    // sort deliveries into two lsts: assigned and unassigned
    // sort each list by expected delivery time
    // merge, so unassigned first, then assigned

    const assignedDeliveries = this.deliveries
      .filter(delivery => delivery.drone);

    const unassignedDeliveries = this.deliveries
              .filter(delivery => !delivery.drone);

    let sortedDeliveries = [
      ...unassignedDeliveries.sort((a, b) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime)), // FIFO
      ...assignedDeliveries.sort((b, a) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime)) // show latest
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

  cleanup() {
    Object.values(this.deliveryTimers).forEach(timer => {
      if (timer.timer) {
        clearTimeout(timer.timer);
      }
    });
    this.deliveryTimers = {};
  }
}
