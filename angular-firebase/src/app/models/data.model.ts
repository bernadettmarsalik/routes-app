export interface DataModel {
  id?: string;
  date: Date;
  routeFromCity: string;
  routeFromStreet: string;
  routeFromHouseNumber: string;
  routeToCity: string;
  routeToStreet: string;
  routeToHouseNumber: string;
  partner: string;
  km: number;
  licencePlate: string;
  type: string;
  consumption: number;
}
