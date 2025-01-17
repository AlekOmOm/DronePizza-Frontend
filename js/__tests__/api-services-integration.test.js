// api-services-integration.test.js

import { DroneService, DeliveryService } from '../services/api-services.js';

class APITestRunner {
    constructor() {
        this.testDeliveryId = null;
        this.testDroneId = null;
        this.outputElement = null;
        this.setupTestUI();
        this.setupConsoleCapture();
    }

    setupTestUI() {
        const testRunner = document.createElement('div');

        document.body.appendChild(testRunner);
        this.outputElement = document.getElementById('testOutput');

        document.getElementById('runTestsBtn').addEventListener('click', () => this.runAllTests());
    }

    setupConsoleCapture() {
        const updateOutput = (message, isError = false) => {
            if (this.outputElement) {
                const formattedMessage = isError ?
                    `<span style="color: red">${message}</span>` :
                    message;
                this.outputElement.innerHTML += formattedMessage + '\ \n ';
                this.outputElement.scrollTop = this.outputElement.scrollHeight;
            }
        };

        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            originalLog.apply(console, args);
            updateOutput(args.join(' '));
        };

        console.error = (...args) => {
            originalError.apply(console, args);
            updateOutput(args.join(' '), true);
        };
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async checkAPIAccess() {
        console.log(' \n 🔍 Checking API accessibility...');
        try {
            const response = await fetch('http://localhost:8080/deliveries', {
                headers: {
                    'Authorization': 'Basic ' + btoa('admin:admin1234'),
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ Backend API is accessible');
                return true;
            } else {
                throw new Error(`API returned status: ${response.status}`);
            }
        } catch (error) {
            console.error(' ❌ API accessibility check failed:', error.message);
            return false;
        }
    }

    async runTest(name, testFn) {
        console.log(`\ \n 🔄 Running test: ${name}`);
        try {
            await testFn();
            console.log(`✅ ${name} passed`);
            return true;
        } catch (error) {
            console.error(`❌ ${name} failed:`, error.message);
            return false;
        }
    }

    async runAllTests() {
        this.outputElement.innerHTML = ''; // Clear previous output
        console.log('🚀 Starting API Integration Tests... ');

        if (!await this.checkAPIAccess()) {
            return;
        }

        let testsPassed = 0;
        let totalTests = 0;

        const tests = [
            {
                name: 'Get all drones',
                fn: async () => {
                    const drones = await DroneService.getAllDrones();
                    if (!Array.isArray(drones)) throw new Error('Drones response is not an array');
                }
            },
            {
                name: 'Add new drone',
                fn: async () => {
                  const newDrone = await DroneService.addDrone();

                  if (!newDrone.serialNumber) throw new Error('New drone has no serialNumber');

                  this.testDroneId = newDrone.id;
                }
            },
            {
                name: 'Get undelivered orders',
                fn: async () => {
                    const orders = await DeliveryService.getUndeliveredOrders();
                    if (!Array.isArray(orders)) throw new Error('Orders response is not an array');
                }
            },
            {
                name: 'Add new delivery',
                fn: async () => {
                    const newDelivery = await DeliveryService.addDelivery(1); // Using pizza ID 1
                    if (!newDelivery.id) throw new Error('New delivery has no ID');
                    this.testDeliveryId = newDelivery.id;
                }
            }
        ];

        for (const test of tests) {
            totalTests++;
            if (await this.runTest(test.name, test.fn)) {
                testsPassed++;
            }
            await this.wait(1000); // Delay between tests
        }

        console.log(`\ \n 📊 Test Summary: ${testsPassed}/${totalTests} tests passed`);
    }
}

// Initialize test runner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new APITestRunner();
});
