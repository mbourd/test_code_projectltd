import { axiosApi } from "../..";

export class team {
  getListTeam() {
    return axiosApi.get("/team/all");
  }

  getTeam(id) {
    return axiosApi.get("/team/" + id);
  }

  createTeam(team) {
    return axiosApi.post("/team/create", team);
  }
}