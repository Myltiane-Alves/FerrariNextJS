import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext/useAuth";

export type FormData = {
  email: string;
  password: string;
}


const FormLogin = () => {
  const { register, handleSubmit } = useForm<FormData>();
  // const { email, onSubmitLogin } = useAuth();

  const onSubmit = (data: FormData) => {

    axios.post(`/auth/login`, data,  {
      baseURL: process.env.API_URL,
    }).then(({ data }) => {
      console.log(data);
    }).catch((e) => console.log(e));
  }

  return (
    <>
      <form id="auth-login" onSubmit={handleSubmit<FormData>(onSubmit)}>
        <h1>Fazer login</h1>

        <hr />

        <div className="field">
          <input type="email" {...register('email', {
            required: 'Preencha o e-mail',
          })}  />
          <label htmlFor="email-login">E-mail</label>
        </div>

        <div className="field">
          <input type="password" id="password" {...register('password', {
            required: 'Preencha a senha',
          })} />
          <label htmlFor="password">Digite sua Senha</label>
        </div>

        <div className="actions">
          <div>
            <Link href="/auth#forget">
              <a className="link">Esqueceu sua senha?</a>
            </Link>
            <Link href="/auth#forget">
              <a href="/auth#email" className="link">Este não é o seu e-mail?</a>
            </Link>
          </div>
          <button type="submit">Login</button>
        </div>
      </form>
    </>
  )
}

export default FormLogin;
