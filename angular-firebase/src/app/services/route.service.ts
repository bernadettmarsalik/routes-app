import { Observable, distinct, from, map, mergeMap, toArray } from "rxjs";
import { Injectable } from "@angular/core";
import { DataModel } from "../models/data.model";
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class RouteService {
  private readonly routesCollectionRef = collection(this.firestore, "routes");

  constructor(private firestore: Firestore) {}

  // CREATE
  addRoute(route: DataModel): Observable<DocumentData> {
    return from(addDoc(this.routesCollectionRef, route));
  }

  //  READ ALL:
  getRoutes(): Observable<DataModel[]> {
    return from(getDocs(this.routesCollectionRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const routeData: DataModel = doc.data() as DataModel;
          routeData.id = doc.id;
          return routeData;
        });
        return resultList;
      })
    );
  }

  // READ ONE
  getRoute(id: string) {
    const routeDoc = doc(this.firestore, `routes/${id}`);
    return from(getDoc(routeDoc)).pipe(
      map((doc) => {
        const routeData: DataModel = doc.data() as DataModel;
        routeData.id = doc.id;
        return routeData;
      })
    );
  }

  //  DELETE
  deleteRoute(routeId: string): Observable<void> {
    const routeDoc = doc(this.firestore, `routes/${routeId}`);
    return from(deleteDoc(routeDoc));
  }

  //  UPDATE
  updateRoute(route: DataModel): Observable<void> {
    const routeDoc = doc(this.firestore, `routes/${route.id}`);
    return from(setDoc(routeDoc, route));
  }

  getDistinctLicencePlates(): Observable<string[]> {
    return this.getPropertyValues("licencePlate");
  }

  private getPropertyValues(prop: string): Observable<string[]> {
    return from(getDocs(this.routesCollectionRef)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data()[prop])),
      mergeMap((dataList) => dataList),
      distinct(),
      toArray()
    );
  }

  getRoutesByVehicle(licencePlate: string): Observable<DataModel[]> {
    const queryRef = query(
      this.routesCollectionRef,
      where("licencePlate", "==", licencePlate)
    );

    return from(getDocs(queryRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const routeData: DataModel = doc.data() as DataModel;
          routeData.id = doc.id;
          return routeData;
        });
        return resultList;
      })
    );
  }

  // SEARCH
  searchRoutes(query: string): Observable<DataModel[]> {
    const normalizedQuery = query.toLowerCase().trim();

    const terms: string[] = normalizedQuery.split(" ");

    return this.getRoutes().pipe(
      map((routes) => {
        return routes.filter((route) => {
          return terms.some((term) => {
            return (
              (route.licencePlate &&
                route.licencePlate.toLowerCase().includes(term)) ||
              (route.routeFromCity &&
                route.routeFromCity.toLowerCase().includes(term)) ||
              (route.routeFromHouseNumber &&
                route.routeFromHouseNumber.toLowerCase().includes(term)) ||
              (route.routeFromStreet &&
                route.routeFromStreet.toLowerCase().includes(term)) ||
              (route.routeToCity &&
                route.routeToCity.toLowerCase().includes(term)) ||
              (route.routeToStreet &&
                route.routeToStreet.toLowerCase().includes(term)) ||
              (route.routeFromHouseNumber &&
                route.routeFromHouseNumber.toLowerCase().includes(term)) ||
              (route.partner && route.partner.toLowerCase().includes(term)) ||
              (route.type && route.type.toLowerCase().includes(term))
            );
          });
        });
      })
    );
  }
}
