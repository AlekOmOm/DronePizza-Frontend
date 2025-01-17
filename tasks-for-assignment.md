# Assignment Requirements Checklist

### Overall Requirements
1. Full-stack Requirements:
   - ✅ Front-end with HTML/CSS and JavaScript
   - ✅ Back-end with Spring Boot, and MySQL
   - ✅ REST API implementation
   - ✅ Unit testing with JUnit
   - ✅ Test documentation in submission

### Three Delopgaver

2. Database with JPA and MySQL (Delopgave 1):
   - ✅ Drone model with UUID serialNumber
   - ✅ Drone status ("i drift", "ude af drift", "udfaset")
   - ✅ Pizza model with title and price
   - ✅ Station model with GPS coordinates
   - ✅ Delivery model with relationships
   - ✅ At least 3 Stations and 5 Pizzas in database
   - ✅ Stations near Copenhagen center (55.41N 12.34E)

3. REST API (Delopgave 2):
   - ✅ GET /drones - List all drones
   - ✅ POST /drones/add - Create new drone
   - ✅ POST /drones/enable - Enable drone
   - ✅ POST /drones/disable - Disable drone
   - ✅ POST /drones/retire - Retire drone
   - ✅ GET /deliveries - List undelivered orders
   - ✅ POST /deliveries/add - Add new delivery
   - ✅ GET /deliveries/queue - List unassigned deliveries
   - ✅ POST /deliveries/schedule - Assign drone to delivery
   - ✅ POST /deliveries/finish - Mark delivery as complete
   - ✅ JUnit tests for endpoints
   - ✅ Appropriate error handling with HTTP status codes

4. Front-end (Delopgave 3):
   - ✅ Single page interface
   - ✅ List of undelivered orders (sorted by age)
   - ✅ 60-second auto-update
   - ✅ Buttons for assigning drones to deliveries
   - ✅ Button to create new drones
   - ✅ Simulation functionality for Customer demo:
     - ✅ Create new delivery simulation
     - ✅ Complete delivery simulation
     - ✅ Visual animation for better demonstration
   - ✅ Frontend Testing with Jest
   - ✅ Integration tests for API calls

### Submission Requirements
- ✅ Private GitHub repository
- ✅ Add class-specific GitHub collaborators
- ✅ Wiseflow document with:
  - ✅ Full name and KEA email
  - ✅ GitHub repository link(s)
  - ✅ Project progress description (5-15 lines)
  - ✅ Description of missing features/bugs
  - ✅ Description of test coverage

### Final Steps
- ✅ Verify all GitHub repository settings
- ✅ Add collaborators from your class
- ❌ Submit final document to Wiseflow
