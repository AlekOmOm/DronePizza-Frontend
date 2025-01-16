// api-services.js

// endpoints
const DRONES_ENDPOINT = 'http://localhost:8080/drones';
const DELIVERIES_ENDPOINT = 'http://localhost:8080/deliveries';

// Authentication credentials
const AUTH_CREDENTIALS = {
    username: 'admin',
    password: 'admin1234'
};

// Helper to create Basic Auth header
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    addDrone: async () => {
        const response = await fetch(DRONES_ENDPOINT+'/add', {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    enableDrone: async (droneId) => {
        const response = await fetch(DRONES_ENDPOINT+`/enable?droneId=${droneId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    disableDrone: async (droneId) => {
        const response = await fetch(DRONES_ENDPOINT+`/disable?droneId=${droneId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    retireDrone: async (droneId) => {
        const response = await fetch(DRONES_ENDPOINT+`/retire?droneId=${droneId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch(DELIVERIES_ENDPOINT+'/add', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ pizzaId })
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    getUnassignedDeliveries: async () => {
        const response = await fetch(DELIVERIES_ENDPOINT+'/queue', {
            headers: getAuthHeader()
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    scheduleDelivery: async (deliveryId, droneId) => {
        const response = await fetch(DELIVERIES_ENDPOINT+'/schedule', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ deliveryId, droneId })
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
    },

    finishDelivery: async (deliveryId) => {
        const response = await fetch(DELIVERIES_ENDPOINT+'/finish', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ deliveryId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },


};

const fetchWithTimeout = async (url, options, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export { DroneService, DeliveryService };
