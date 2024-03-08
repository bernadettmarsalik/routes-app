import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { DataModel } from "src/app/models/data.model";
import { RouteService } from "src/app/services/route.service";

@Component({
  selector: "app-routes",
  templateUrl: "./routes.component.html",
  styleUrls: ["./routes.component.css"],
})
export class RoutesComponent implements OnInit {
  routes$?: Observable<DataModel[]>;
  totalDistance: number = 0;
  totalFuelConsumption: number = 0;
  averageFuelConsumption: number = 0;
  vehicles?: string[] = [];
  selectedVehicle: string | null = null;
  searchedRoutes$: Observable<DataModel[]> = new Observable();
  searchedRoutes: DataModel[] = [];

  constructor(
    private routeService: RouteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeService.getDistinctLicencePlates().subscribe((licencePlates) => {
      this.vehicles = Array.from(new Set(licencePlates));
    });
    const licencePlate = this.route.snapshot.paramMap.get("licencePlate");

    if (licencePlate) {
      this.loadRoutesAndCalculateTotals(licencePlate);
    } else {
      this.loadAllRoutesAndCalculateTotals();
    }
  }

  onVehicleChange(event: any) {
    this.selectedVehicle = event?.target?.value;

    if (this.selectedVehicle) {
      this.loadRoutesAndCalculateTotals(this.selectedVehicle);
    } else {
      this.loadAllRoutesAndCalculateTotals();
    }
  }

  private loadRoutesAndCalculateTotals(licencePlate: string) {
    this.routes$ = this.routeService.getRoutesByVehicle(licencePlate);

    this.routes$.subscribe((routes) => {
      this.totalDistance = this.calculateTotalDistance(routes);
      this.totalFuelConsumption = this.calculateTotalFuelConsumption(routes);
      this.averageFuelConsumption =
        this.calculateAverageFuelConsumption(routes);
    });
  }

  private loadAllRoutesAndCalculateTotals() {
    this.routes$ = this.routeService.getRoutes();

    this.routes$.subscribe((routes) => {
      this.searchedRoutes$ = of(routes);
      this.searchedRoutes = routes;
      this.totalDistance = this.calculateTotalDistance(routes);
      this.totalFuelConsumption = this.calculateTotalFuelConsumption(routes);
      this.averageFuelConsumption =
        this.calculateAverageFuelConsumption(routes);
    });
  }

  // összes távolságot számolja ki
  private calculateTotalDistance(routes: DataModel[]): number {
    return routes.reduce((total, route) => total + route.km, 0);
  }

  // összes üzemanyagfogyasztást számolja ki
  private calculateTotalFuelConsumption(routes: DataModel[]): number {
    return routes.reduce(
      (total, route) => total + (route.km * route.consumption) / 100,
      0
    );
  }

  //  átlagfogyasztást számolja ki az összes útvonalon.
  // Az átlagfogyasztás az összes megtett kilométerre vonatkoztatva kerül kiszámításra.
  private calculateAverageFuelConsumption(routes: DataModel[]): number {
    const totalConsumption = this.calculateTotalFuelConsumption(routes);
    const totalKilometers = this.calculateTotalDistance(routes);

    return totalKilometers > 0 ? (totalConsumption / totalKilometers) * 100 : 0;
  }

  // keresés
  filter(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value;
    console.log("Input:", inputValue);

    if (inputValue !== undefined) {
      this.routeService.searchRoutes(inputValue).subscribe((searchedRoutes) => {
        this.searchedRoutes$ = of(searchedRoutes);
      });
    }
  }
}
