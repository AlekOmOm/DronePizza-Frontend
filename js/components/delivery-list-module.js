// js/deliveryList.js
import { DeliveryService } from '../services/api-services.js';
import { showNotification } from "../utils.js";

/*
 implementation
    DeliveryList class (module) in js/services/delivery-list-module.js:

  - Handles fetching and displaying deliveries
  - Implements auto-refresh every 60 seconds
  - Includes error handling
  - Manages assign/finish delivery actions
  - Adds appropriate styling

 */

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
            const deliveries = await DeliveryService.getUndeliveredOrders();

            // Sort by expected delivery time (oldest first)
            this.deliveries = deliveries.sort((a, b) =>
                new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime)
            );
            this.render();
        } catch (error) {
            console.error('Error updating delivery list:', error);
            this.renderError(`Failed to fetch deliveries: ${error.message}`);
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

      this.deliveries.forEach(delivery => {
        const li = document.createElement('li');
        li.className = 'delivery-item';

        const status = delivery.serialNumber ? 'Assigned to drone' : 'Waiting for drone';
        const statusClass = delivery.serialNumber ? 'assigned' : 'waiting';
        const expectedTime = new Date(delivery.expectedDeliveryTime).toLocaleTimeString();

        li.innerHTML = `
                  <div class="delivery-info">
                      <span class="delivery-id">Order #${delivery.id}</span>
                      <span class="delivery-status ${statusClass}">${status}</span>
                      <span class="delivery-time">Expected: ${expectedTime}</span>
                  </div>
                  ${!delivery.serialNumber ? `
                      <div class="delivery-actions">
                          <button class="assign-drone-btn" data-delivery-id="${delivery.id}">
                              Assign Drone
                          </button>
                      </div>
                  ` : ''}
              `;

        if (!delivery.serialNumber) {
          const assignButton = li.querySelector('.assign-drone-btn');
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

    // --------------------- Operations ---------------------

    createDeliveryElement(delivery) {
        const li = document.createElement('li');
        li.className = 'delivery-item';

        const status = delivery.serialNumber ? 'Assigned to drone' : 'Waiting for drone';
        const expectedTime = new Date(delivery.expectedDeliveryTime).toLocaleTimeString();

        li.innerHTML = `
            <div class="delivery-info">
                <span class="delivery-id">Order #${delivery.id}</span>
                <span class="delivery-status ${delivery.serialNumber ? 'assigned' : 'waiting'}">
                    ${status}
                </span>
                <span class="delivery-time">Expected: ${expectedTime}</span>
            </div>
            <div class="delivery-actions">
                ${!delivery.serialNumber ? `
                    <button class="assign-drone-btn" data-delivery-id="${delivery.id}">
                        Assign Drone
                    </button>
                ` : `
                    <button class="finish-delivery-btn" data-delivery-id="${delivery.id}">
                        Mark Delivered
                    </button>
                `}
            </div>
        `;

        this.attachEventListeners(li, delivery.id);
        return li;
    }

    attachEventListeners(element, deliveryId) {
        const assignButton = element.querySelector('.assign-drone-btn');
        if (assignButton) {
            assignButton.addEventListener('click', () => this.handleAssignDrone(deliveryId));
        }

        const finishButton = element.querySelector('.finish-delivery-btn');
        if (finishButton) {
            finishButton.addEventListener('click', () => this.handleFinishDelivery(deliveryId));
        }
    }

    async handleAssignDrone(deliveryId) {
      try {
        await DeliveryService.scheduleDelivery(deliveryId);
        showNotification('Drone assigned successfully');
        await this.updateList();
      } catch (error) {
        showNotification('Failed to assign drone: ' + error.message, 'error');
        console.error('Error assigning drone:', error);
      }
    }

    async handleFinishDelivery(deliveryId) {
        try {
            await DeliveryService.finishDelivery(deliveryId);
            await this.updateList();
        } catch (error) {
            console.error('Error finishing delivery:', error);
            alert('Failed to mark delivery as finished');
        }
    }


    startPolling() {

        setInterval(() => this.updateList(), 60000);
    }
}
