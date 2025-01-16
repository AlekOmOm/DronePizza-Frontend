# Frontend Architecture

## Component Structure
- Main Dashboard: Primary container for all functionality
- Deliveries List: Displays active deliveries with status
- Action Controls: Contains functional buttons
- Simulation Panel: Order creation and completion controls

## State Management
- Active deliveries tracking
- Drone status management
- Auto-refresh implementation
- Loading states handling

## Data Flow
1. Initial load: Fetch deliveries and drones
2. Auto refresh: 60-second interval updates
3. User actions: Direct API calls via api-service
4. State updates: Trigger re-renders

## Key Features Implementation
- Auto-refresh using setInterval
- Sort functionality for deliveries
- Status indicators for drone assignment
- Action button enablement logic
