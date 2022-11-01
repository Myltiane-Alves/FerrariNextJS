import { CurrentFormType } from "./CurrentFormType";
import { FormDataForget } from "./FormDataForget";
import { FormDataLogin } from "./FormDataLogin";
import { FormDataPasswordReset } from "./FormDataPasswordReset";
import { FormDataRegister } from "./FormDataRegister";

export type AuthContextType = {
  currentForm: CurrentFormType;
  email: string;
  setEmail: (email: string) => void;
  onSubmitEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmitLogin: (data: FormDataLogin) => void;
  onSubmitRegister: (data: FormDataRegister) => void;
  onSubmitPasswordReset: (data: FormDataPasswordReset) => void;
  onSubmitForget: (data: FormDataForget) => void;
}