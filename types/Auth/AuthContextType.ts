import { CurrentFormType } from "./CurrentFormType";

export type AuthContextType = {
  currentForm: CurrentFormType;
  email: string;
  setEmail: (email: string) => void;
  onSubmitEmail: (e: React.FormEvent<HTMLFormElement>) => void;
}
