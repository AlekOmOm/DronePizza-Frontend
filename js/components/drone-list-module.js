
/*
 implementation
   DroneList class (module) in js/components/drone-list-module.js:

  - main features:
    - fetch and display of all drones, sorted by Drone.DroneStatus
    - extra:
      - show 'new' sign at the drone that was just added when 'Add Drone' button is clicked

  - Implements auto-refresh every 60 seconds
  - Includes
    - error handling

model class:
    public enum DroneStatus {
        I_DRIFT,        // in operation
        UDE_AF_DRIFT,   // out of operation
        UDFASET        // retired
    }

 */

// ./js/components/drone-list-module.js

import {DeliveryService, DroneService} from '../services/api-services.js';
import { showNotification } from "../utils.js";

export class DroneList {

  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.drones = [];
    this.initialize();
  }

  async initialize() {
    await this.updateList();
    this.startPolling();
  }

  async updateList() {
    try {
      const drones = await DroneService.getAllDrones();

      // Sort by status enums DroneStatus = I_DRIFT, UDE_AF_DRIFT, UDFASET
      const drones_operational = drones.filter(drone => drone.status === 'I_DRIFT');
      const drones_out_of_operation = drones.filter(drone => drone.status === 'UDE_AF_DRIFT');
      const drones_retired = drones.filter(drone => drone.status === 'UDFASET');

      // max 10 drones
      this.drones = [...drones_operational, ...drones_out_of_operation, ...drones_retired]
        .reduce((acc, drone, index) => {
          if (index < 10) {
            acc.push(drone);
          }
          return acc;
        }, []);

      this.render();
    } catch (error) {
      console.error('Error updating delivery list:', error);
      this.renderError(`Failed to fetch deliveries: ${error.message}`);
    }
  }

  render() {
    this.container.innerHTML = '';

    if (this.drones.length === 0) {
      this.container.innerHTML = `
                  <li class="drone-time">
                      <span>No active drones</span>
                  </li>
              `;
      return;
    }

    this.drones.forEach(drone => {
      const li = document.createElement('li');
      li.className = 'drone-item';

      // slice serialNumber when hits '-' character
      const serialNumber = drone.serialNumber
        .slice(0, 20)
        .split('-')[0];
      const status = drone.status === 'I_DRIFT' ? 'In operation' : drone.status === 'UDE_AF_DRIFT' ? 'Out of operation' : 'Retired';
      const station = drone.station ? drone.station.id : 'N/A';

      li.innerHTML = `
                  <div class="drone-info">
                      <span class="drone-serial-number">Drone #${serialNumber}</span>
                      <span class="drone-status">${status}</span>
                      <span class="drone-station">Station: ${station}</span>
                  </div>
              `;

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

  startPolling() {
    setInterval(() => this.updateList(), 60000);
  }


}
