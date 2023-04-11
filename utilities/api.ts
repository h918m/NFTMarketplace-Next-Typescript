/**
 * Wrapper over axios/swr
 *
 * All api config goes here - other files
 * must use these methods only
 */

import { IAlertMessages, ValidAlert } from "@components/AlertWrapper";
import axios from "axios";

/**
 * AppApi Impl
 */
export default class AppApi {
  setAlert: (val: IAlertMessages[]) => void = () => {};

  constructor(setAlert: (val: IAlertMessages[]) => void) {
    this.setAlert = setAlert;
  }

  get = (url: string, apiUrl?: string) => {
    return axios.get((apiUrl ? apiUrl : process.env.API_URL) + url);
  };

  post = (url: string, data: any) => {
    return axios.post(process.env.API_URL + url, data);
  };

  alert = (message: string, severity: ValidAlert) => {
    this.setAlert([
      {
        severity: severity,
        content: message
          ? message.slice(0, 100) + (message.length > 100 ? "..." : "")
          : "Undefined Content",
        id: crypto.randomUUID(),
      },
    ]);
  };

  error = (e: any) => {
    console.log("func:api_error:", e);
    const message =
      typeof e === "string"
        ? e
        : e?.response
        ? e.response.status === 401
          ? e.response.data.detail
          : e.response.data
        : "Oops :( Some unknown error may have occurred";
    if (this !== undefined)
      this.alert(
        typeof message === "string" ? message : JSON.stringify(message),
        "error"
      );
  };

  ok = (message: string) => {
    this.alert(message, "success");
  };
}
