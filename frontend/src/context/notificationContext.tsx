"use client";

import { createContext } from "react";
import toast from "react-hot-toast";

type ProcessingFunction = (data: any) => string;

const NotificationContext = createContext({
  notify: (msg: string) => toast(msg),
  notifyPromise: (
    promise: Promise<any>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ProcessingFunction;
      error: string | ProcessingFunction;
    },
  ) =>
    toast.promise(promise, {
      loading: loading,
      success: success,
      error: error,
    }),
  error: (msg: string) => toast.error(msg),
});

export default NotificationContext;
