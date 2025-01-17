

// .js/services/delivery-tracker.js
import {DeliveryService} from "./api-services.js";
import {showNotification} from "../utils.js";



const deliveryTimers = {};

function updateDeliveryDisplay() {
  const deliveryList = document.getElementById('deliveryList');

  DeliveryService.getUndeliveredOrders()
    .then(deliveries => {
      // Sort deliveries by expected delivery time (oldest first)
      deliveries.sort((a, b) => new Date(a.expectedDeliveryTime) - new Date(b.expectedDeliveryTime));

      deliveryList.innerHTML = ''; // Clear current list

      deliveries.forEach(delivery => {
        const deliveryEl = document.createElement('li');
        deliveryEl.className = 'delivery-item';

        // Set up delivery timer if newly assigned
        if (delivery.droneSerialNumber && !deliveryTimers[delivery.id]) {
          startDeliveryTimer(delivery);
        }

        // Get current status and time info
        const status = getDeliveryStatus(delivery);

        deliveryEl.innerHTML = `
                    <div class="delivery-info">
                        <span class="delivery-id">Order #${delivery.id}</span>
                        <span class="delivery-status ${status.statusClass}">${status.text}</span>
                        <span class="delivery-time">${status.timeText}</span>
                    </div>
                    <div class="delivery-actions">
                        ${!delivery.droneSerialNumber ?
          `<button onclick="assignDrone(${delivery.id})" class="assign-drone-btn">
                                Assign Drone
                             </button>` :
          ''
        }
                    </div>
                `;

        deliveryList.appendChild(deliveryEl);
      });
    })
    .catch(error => console.error('Failed to fetch deliveries:', error));
}

function startDeliveryTimer(delivery) {
  // Random delivery time between 2-15 minutes
  const deliveryTime = (Math.random() * 13 + 2) * 60 * 1000;

  deliveryTimers[delivery.id] = {
    endTime: Date.now() + deliveryTime,
    timer: setTimeout(() => {
      DeliveryService.finishDelivery(delivery.id)
        .then(() => {
          delete deliveryTimers[delivery.id];
          updateDeliveryDisplay();
          showNotification('Delivery completed successfully!', 'success');
        })
        .catch(error => {
          console.error('Failed to complete delivery:', error);
          showNotification('Failed to complete delivery', 'error');
        });
    }, deliveryTime)
  };
}

function getDeliveryStatus(delivery) {
  if (!delivery.droneSerialNumber) {
    return {
      text: 'Awaiting Drone',
      statusClass: 'waiting',
      timeText: `Expected: ${new Date(delivery.expectedDeliveryTime).toLocaleTimeString()}`
    };
  }

  if (deliveryTimers[delivery.id]) {
    const timeLeft = Math.max(0, deliveryTimers[delivery.id].endTime - Date.now());
    const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
    return {
      text: `In Delivery`,
      statusClass: 'assigned',
      timeText: `Estimated: ${minutesLeft} min remaining`
    };
  }

  return {
    text: 'Delivered',
    statusClass: 'assigned',
    timeText: 'Completed'
  };
}

function assignDrone(deliveryId) {
  DeliveryService.scheduleDelivery(deliveryId)
    .then(() => {
      updateDeliveryDisplay();
      showNotification('Drone assigned successfully!', 'success');
    })
    .catch(error => {
      console.error('Failed to assign drone:', error);
      showNotification('Failed to assign drone', 'error');
    });
}

// Update the display every 60 seconds
setInterval(updateDeliveryDisplay, 60000);

// Initial display
updateDeliveryDisplay();
