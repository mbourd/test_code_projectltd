import { axiosApi } from "../..";

export class country {
  getListCountry() {
    return axiosApi.get("/country/all");
  }
}