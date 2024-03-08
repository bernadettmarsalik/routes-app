import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { RouteService } from "src/app/services/route.service";
@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent implements OnInit {
  routeForm!: FormGroup;
  updateLicencePlate?: string;
  updateRouteId?: string;
  subSave?: Subscription;
  isSubmitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.routeForm = new FormGroup({
      licencePlate: new FormControl("", [
        Validators.required,
        this.licensePlateValidator(),
      ]),
      type: new FormControl("", [Validators.required]),
      consumption: new FormControl(0, [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      routeFromCity: new FormControl("", [Validators.required]),
      routeFromStreet: new FormControl("", [Validators.required]),
      routeFromHouseNumber: new FormControl("", [Validators.required]),
      routeToCity: new FormControl("", [Validators.required]),
      routeToStreet: new FormControl("", [Validators.required]),
      routeToHouseNumber: new FormControl("", [Validators.required]),
      partner: new FormControl("", [Validators.required]),
      km: new FormControl(0, [Validators.required]),
      vehicleId: new FormControl(""),
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      let licencePlate = params.get("licencePlate");
      if (licencePlate) {
        this.routeService.getRoute(licencePlate).subscribe({
          next: (data) => {
            this.routeForm.patchValue(data);
            this.updateLicencePlate = data.licencePlate;
          },
        });
      }
    });
  }

  get licencePlate() {
    return this.routeForm.get("licencePlate");
  }
  get type() {
    return this.routeForm.get("type");
  }
  get consumption() {
    return this.routeForm.get("consumption");
  }
  get date() {
    return this.routeForm.get("date");
  }
  get routeFromCity() {
    return this.routeForm.get("routeFromCity");
  }

  get routeFromStreet() {
    return this.routeForm.get("routeFromStreet");
  }

  get routeFromHouseNumber() {
    return this.routeForm.get("routeFromHouseNumber");
  }

  get routeToCity() {
    return this.routeForm.get("routeToCity");
  }

  get routeToStreet() {
    return this.routeForm.get("routeToStreet");
  }

  get routeToHouseNumber() {
    return this.routeForm.get("routeToHouseNumber");
  }

  get partner() {
    return this.routeForm.get("partner");
  }
  get km() {
    return this.routeForm.get("km");
  }

  onSubmit() {
    if (!this.routeForm.valid) {
      return;
    }

    const routeToSave = { ...this.routeForm.value };

    this.routeService.addRoute(routeToSave).subscribe({
      next: (result) => {
        console.log("Útvonal mentve.", result);
      },
      error: (error) => {
        console.error("Hiba a mentés során.", error);
      },
      complete: () => {
        this.isSubmitted = true;
        this.routeForm.reset();
      },
    });
  }

  licensePlateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const validPattern = /^[A-Z0-9-]+$/i;

      if (!control.value) {
        return null;
      }

      if (!validPattern.test(control.value)) {
        return { invalidLicensePlate: true };
      }

      return null;
    };
  }
}
