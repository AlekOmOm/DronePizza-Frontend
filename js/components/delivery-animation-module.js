// js/components/delivery-animation-module.js

export class DeliveryAnimation {
    constructor(containerId) {
        this.container = document.querySelector(containerId);
        this.initialize();
    }

    initialize() {
        // Create the animation HTML structure
        this.container.innerHTML = `
            <div class="animation-container collapsed">
                <div class="icon pizza">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a10 10 0 0110 10"/>
                        <path d="M12 2a10 10 0 00-10 10"/>
                        <circle cx="12" cy="12" r="4"/>
                    </svg>
                    <div class="icon-label">Pizza</div>
                </div>
                
                <div class="icon drone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <div class="icon-label">Drone</div>
                </div>
                
                <div class="icon customer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    </svg>
                    <div class="icon-label">Customer</div>
                </div>
            </div>
            <div class="status-text" id="animationStatus"></div>`;

        // Cache DOM elements
        this.animationContainer = this.container.querySelector('.animation-container');
        this.pizza = this.container.querySelector('.pizza');
        this.drone = this.container.querySelector('.drone');
        this.customer = this.container.querySelector('.customer');
        this.statusText = this.container.querySelector('#animationStatus');
    }

    updateStatus(text) {
        this.statusText.textContent = text;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startAnimation() {
        // Expand the container
        this.animationContainer.classList.remove('collapsed');
        await this.sleep(600); // Wait for expansion animation

        // Reset icons
        this.pizza.classList.remove('show');
        this.customer.classList.remove('show');
        this.drone.classList.remove('show', 'drone-to-pizza', 'drone-to-customer');

        // Step 1: Show pizza and customer
        await this.sleep(100);
        this.updateStatus('New order created! 🍕');
        this.pizza.classList.add('show');
        this.customer.classList.add('show');

        // Step 2: Show drone and move to pizza
        await this.sleep(2000);
        this.updateStatus('Drone picking up the pizza... 🚁');
        this.drone.classList.add('show');
        await this.sleep(100);
        this.drone.classList.add('drone-to-pizza');

        // Step 3: Move drone to customer
        await this.sleep(2000);
        this.updateStatus('Delivering to customer... 🏃');
        this.drone.classList.add('drone-to-customer');

        // Step 4: Complete delivery
        await this.sleep(2000);
        this.updateStatus('Delivery complete! ✅');
        this.drone.classList.remove('show');

        // Collapse after completion
        await this.sleep(1500);
        this.animationContainer.classList.add('collapsed');
        await this.sleep(500);
        this.updateStatus('');
    }
}
