import { useMemo, useState } from "react";
import axios from "axios";
import constate from "constate";
import { API_URL } from "../config";

type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

interface MyErrorType {
  response?: {
    status: number;
  };
}

const buildApi = (setIsLoading: (isLoading: boolean) => void) => {
  const processResponse = async (callInstance: any) => {
    try {
      setIsLoading(true);
      const { data } = await callInstance;
      if (data && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error: MyErrorType | any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const callAxiosMethod = (methodName: Methods, path?: string, data?: any) => {
    if (methodName === "get" || methodName === "delete") {
      return processResponse(
        axios[methodName](`${API_URL}${path}`, {
          responseType: "json",
          timeout: 600000,
        })
      );
    } else {
      return processResponse(
        axios[methodName](`${API_URL}${path}`, data, {
          responseType: "json",
          timeout: 600000,
        })
      );
    }
  };

  const get = (path: string) => callAxiosMethod("get", path);
  const post = (path: string, data?: any) =>
    callAxiosMethod("post", path, data);
  const delete_method = (path: string) => callAxiosMethod("delete", path);

  const getAllTransactions = () => get("api/transactions");
  const getTransaction = (transaction_id: string) =>
    get(`api/transactions/${transaction_id}`);
  const deleteTransaction = (transaction_id: string) =>
    delete_method(`api/transactions/${transaction_id}`);
  const createTransaction = (data: any) => post(`api/transactions`, data);

  return {
    getAllTransactions,
    getTransaction,
    deleteTransaction,
    createTransaction,
  };
};

export const useHttpApi_ = () => {
  const [isLoading, setIsLoading] = useState(false);
  const api = useMemo(() => buildApi(setIsLoading), []);
  return { api, isLoading };
};

export const [HttpApiProvider, useHttpApi, UseHttpApiLoading] = constate(
  useHttpApi_,
  ({ api }) => api,
  ({ isLoading }) => isLoading
);
