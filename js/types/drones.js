/*

public class Drone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DroneStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @OneToMany(mappedBy = "drone")
    private List<Delivery> deliveries = new ArrayList<>();

    public enum DroneStatus {
        I_DRIFT,        // in operation
        UDE_AF_DRIFT,   // out of operation
        UDFASET        // retired
    }

 */


export class Drone {
    constructor(serialNumber, status, station, deliveries) {
        this.serialNumber = serialNumber;
        this.status = status;
        this.station = station;
        this.deliveries = deliveries;
    }

    static fromJson(json) {
        return new Drone(

            json.serialNumber,
            json.status,
            json.station,
            json.deliveries
        );
    }

    // getters and setters

    getSerialNumber() {
        return this.serialNumber;
    }

    setSerialNumber(serialNumber) {
        this.serialNumber = serialNumber;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getStation() {
        return this.station;
    }

    setStation(station) {
        this.station = station;
    }

    getDeliveries() {
        return this.deliveries;
    }

    setDeliveries(deliveries) {
        this.deliveries = deliveries;
    }


}
