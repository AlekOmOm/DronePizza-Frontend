// js/deliveryList.js
import { DeliveryService } from '../services/api-services.js';

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
        this.container.innerHTML = ''; // Clear current content

        if (this.deliveries.length === 0) {
            this.container.innerHTML = `
                <div class="delivery-item">
                    <span>No active deliveries</span>
                </div>
            `;
            return;
        }

        this.deliveries.forEach(delivery => {
            const deliveryElement = this.createDeliveryElement(delivery);
            this.container.appendChild(deliveryElement);
        });
    }

    createDeliveryElement(delivery) {
        const li = document.createElement('li');
        li.className = 'delivery-item';

        const status = delivery.droneId ? 'Assigned to drone' : 'Waiting for drone';
        const expectedTime = new Date(delivery.expectedDeliveryTime).toLocaleTimeString();

        li.innerHTML = `
            <div class="delivery-info">
                <span class="delivery-id">Order #${delivery.id}</span>
                <span class="delivery-status ${delivery.droneId ? 'assigned' : 'waiting'}">
                    ${status}
                </span>
                <span class="delivery-time">Expected: ${expectedTime}</span>
            </div>
            <div class="delivery-actions">
                ${!delivery.droneId ? `
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
            await this.updateList();
        } catch (error) {
            console.error('Error assigning drone:', error);
            alert('Failed to assign drone');
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

    renderError(message) {
        this.container.innerHTML = `
            <div class="error-message">
                ${message}
            </div>
        `;
    }

    startPolling() {

        setInterval(() => this.updateList(), 60000);
    }
}
