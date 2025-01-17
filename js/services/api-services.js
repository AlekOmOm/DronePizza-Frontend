// ./js/services/api-services.js

const DRONES_ENDPOINT = 'http://localhost:8080/drones';
const DELIVERIES_ENDPOINT = 'http://localhost:8080/deliveries';

const AUTH_CREDENTIALS = {
    username: 'admin',
    password: 'admin1234'
};

const getAuthHeader = () => {
    const base64Credentials = btoa(`${AUTH_CREDENTIALS.username}:${AUTH_CREDENTIALS.password}`);
    return {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json'
    };
};

const DroneService = {
    getAllDrones: async () => {
        const response = await fetch(DRONES_ENDPOINT, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    addDrone: async () => {
        const response = await fetch(`${DRONES_ENDPOINT}/add`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    enableDrone: async (serialNumber) => {
        const response = await fetch(`${DRONES_ENDPOINT}/enable?serialNumber=${serialNumber}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    disableDrone: async (serialNumber) => {
        const response = await fetch(`${DRONES_ENDPOINT}/disable?serialNumber=${serialNumber}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    retireDrone: async (serialNumber) => {
        const response = await fetch(`${DRONES_ENDPOINT}/retire?serialNumber=${serialNumber}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    }
};

const DeliveryService = {
    getUndeliveredOrders: async () => {
        const response = await fetch(DELIVERIES_ENDPOINT, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    addDelivery: async (pizzaId) => {
        const response = await fetch(`${DELIVERIES_ENDPOINT}/add?pizzaId=${pizzaId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    getUnassignedDeliveries: async () => {
        const response = await fetch(`${DELIVERIES_ENDPOINT}/queue`, {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    // handle assign drone button -> assign drone to delivery i.e. schedule delivery
  scheduleDelivery: async (deliveryId, droneSerialNumber) => {
    console.log('Scheduling delivery:', {deliveryId, droneSerialNumber});

    // Encode the serialNumber to handle special characters
    const encodedSerialNumber = encodeURIComponent(droneSerialNumber);

    const url = `${DELIVERIES_ENDPOINT}/schedule?deliveryId=${deliveryId}&droneSerialNumber=${encodedSerialNumber}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeader()
      });

      // Try to parse error response as JSON first
      let errorData = '';
      if (!response.ok) {
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const jsonError = await response.json();
            errorData = JSON.stringify(jsonError);
          } else {
            errorData = await response.text();
          }
        } catch (e) {
          errorData = await response.text();
        }

        // Handle specific error cases
        if (response.status === 409) {
          throw new Error('This drone is already assigned or the delivery is already scheduled');
        }

        throw new Error(`Failed to schedule delivery: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Schedule delivery error:', error);
      throw error;
    }
  },

    finishDelivery: async (deliveryId) => {
        const response = await fetch(`${DELIVERIES_ENDPOINT}/finish?deliveryId=${deliveryId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    }
};

export { DroneService, DeliveryService };
