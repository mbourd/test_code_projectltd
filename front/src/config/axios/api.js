import Axios from "axios";
import { environnement } from "../env/env";

export const api = () => {
  const axios = Axios.create(
    {
      baseURL: environnement.baseURL,
    }
  )

  //Request interceptor
  axios.interceptors.request.use(request => {
    let _request = {
      ...request,
      headers: {
        ...request.headers,
      }
    }

    return _request;
  })

  return axios;
}