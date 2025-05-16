import React from "react";

const baseAPI = import.meta.env.VITE_APP_API_URL || "http://192.168.0.142:5000";

export const registerUserApi = `${baseAPI}/users/signup`;
export const loginUserApi = `${baseAPI}/users/login`