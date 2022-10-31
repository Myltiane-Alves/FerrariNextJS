import axios from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType } from "../../../types/Auth/AuthContextType";
import { AuthProviderProps } from "../../../types/Auth/AuthProviderProps";
import { CurrentFormType } from "../../../types/Auth/CurrentFormType";
import { FormDataLogin } from "../../../types/Auth/FormDataLogin";
import { FormEmailResponse } from "../../../types/Auth/FormEmailResponse";
import { FormLoginResponse } from "../../../types/Auth/FormLoginResponse";

const AuthContext = createContext<AuthContextType>({
  currentForm: 'email',
  email: '',
  setEmail: () => {},
  onSubmitEmail: () => {},
})


export const AuthProvider = ({ children}: AuthProviderProps) => {

  const [currentForm, setCurrentForm] = useState<CurrentFormType>('email');
  const [email, setEmail] = useState('');

  const onSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.post<FormEmailResponse>(`/auth`, {
      email
    }, {
      baseURL: process.env.APi_URL
    }).then(({ data: {exists}}) => {

      if(exists) {
        setCurrentForm('login');
      } else {
        setCurrentForm('register');
      }

    }).catch(error => console.error(error));

  }

  const onSubmitLogin = (data: FormDataLogin) => {

    axios.post<FormLoginResponse>(`/auth/login`, data,  {
      baseURL: process.env.API_URL
    }).then(({ data: {token} }) => {
      console.log(token);

    }).catch((e: any) => console.error(e));
  }


  return<AuthContext.Provider value={{
    currentForm,
    email,
    setEmail,
    onSubmitEmail,
    onSubmitLogin
  }}>{children}</AuthContext.Provider>
}
export default AuthProvider;


export const useAuth = () => {
  const context =  useContext(AuthContext);

  if(!context) {
    throw new Error('useAuth must be used whitin an AuthProvider')
  }
  return context;
}
