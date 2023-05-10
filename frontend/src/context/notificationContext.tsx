"use client";

import { createContext } from "react";
import toast from "react-hot-toast";

const NotificationContext = createContext({
  notify: (msg: string) => toast(msg),
  error: (msg: string) => toast.error(msg),
});

export default NotificationContext;
