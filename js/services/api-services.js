// api-services.js

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
        const response = await fetch('/drones', {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    addDrone: async () => {
        const response = await fetch('/drones/add', {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    enableDrone: async (droneId) => {
        const response = await fetch(`/drones/enable?droneId=${droneId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    disableDrone: async (droneId) => {
        const response = await fetch(`/drones/disable?droneId=${droneId}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    retireDrone: async (droneId) => {
        const response = await fetch(`/drones/retire?droneId=${droneId}`, {
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
        const response = await fetch('/deliveries', {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    addDelivery: async (pizzaId) => {
        const response = await fetch('/deliveries/add', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ pizzaId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    getUnassignedDeliveries: async () => {
        const response = await fetch('/deliveries/queue', {
            headers: getAuthHeader()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    scheduleDelivery: async (deliveryId, droneId) => {
        const response = await fetch('/deliveries/schedule', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ deliveryId, droneId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    finishDelivery: async (deliveryId) => {
        const response = await fetch('/deliveries/finish', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ deliveryId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
};

export { DroneService, DeliveryService };