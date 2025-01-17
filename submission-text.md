navn og email
- Aleksander Hvid Ellegård
- alel0003@stud.kea.dk

Private gits
- https://github.com/AlekOmOm/DronePizza-Backend
- https://github.com/AlekOmOm/DronePizza-Frontend

running application:
1 access login:
- Username: admin
- Password: admin1234

2 database setup:
- MySQL database med schema: 'dronepizza'
- Kræver kun at schema eksisterer, tables oprettes automatisk via JPA og initialiseres med data.

Beskrivelse af mulige mangler og evt. bugs:
  Løsningen implementerer alle core features med MySQL som database valg.
  Backend er testet med omfattende JUnit tests (controller, service, og model lag),
  og Frontend har både unit og integration tests med Jest.

Næste skridt:
- Delivery tracker bruger local storage (frontend), men kan implementeres til Backend for bedre Persistence
- med tracker timer, så kan Droner også visualiseres med real-time tracking for Deliveries
  - og mælder sig klar til 'Assigning' / Automatisk tage Deliveries
- Frontend Server-error handling kan forbedres, også selvom Notifikationerne virker ret godt indtil videre
