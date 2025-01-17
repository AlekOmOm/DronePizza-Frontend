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

    scheduleDelivery: async (deliveryId, droneSerialNumber) => {
        const response = await fetch(
            `${DELIVERIES_ENDPOINT}/schedule?deliveryId=${deliveryId}&droneSerialNumber=${droneSerialNumber}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }
        return await response.json();
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
