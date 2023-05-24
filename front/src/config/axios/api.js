import Axios from "axios";
import { environnement } from "../env/env";
import i18n from "../../i18n";

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
        lng: i18n.resolvedLanguage
      }
    }

    return _request;
  })

  return axios;
}