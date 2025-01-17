
[home](readme.md)

# DronePizza API Services Test Documentation
## Overview
This test suite covers the frontend API services that communicate with the DronePizza backend. The tests verify that all API calls are properly authenticated and handle both successful and error responses correctly.

note:
- Backend uses Basic Auth for authentication
  - AdminUser required for all API calls

## Test Coverage

### DroneService Tests
Tests for drone management operations:
- Fetching all drones
- Adding new drones
- Enabling/disabling drones
- Retiring drones
- Error handling for drone operations

### DeliveryService Tests
Tests for delivery management operations:
- Retrieving undelivered orders
- Adding new deliveries
- Managing delivery queue
- Scheduling deliveries with drones
- Completing deliveries
- Error handling for delivery operations

### Authentication Tests
Verifies that:
- All API calls include proper Basic Auth headers
- Unauthorized access is handled correctly
- Authentication errors (401, 403) are properly managed

## Running the Tests

### Prerequisites
- Node.js installed
- npm packages installed (`npm install`)
- `npm install --save-dev @babel/preset-env babel-jest` to install Babel and Jest
### Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

### Test Output
The test runner will show:
- Number of tests passed/failed
- Test coverage statistics
- Detailed error messages for any failures

## Notes
- Tests use Jest's fetch mocking to simulate API calls
- All API calls require Basic Auth headers
- Error scenarios (401, 403, 500) are explicitly tested
- Authentication credentials are stored in the API service module
