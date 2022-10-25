import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext/useAuth";
import Alert from "../../Alert";

export type FormData = {
  email: string;
  password: string;
  server?: string;
}


const FormLogin = () => {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors, watch } = useForm<FormData>();

  const router = useRouter();
  const email = watch('email');
  const password = watch('password');

  const onSubmit = (data: FormData) => {

    axios.post(`/auth/login`, data,  {
    }).then(({ data }) => {
      router.push('/')

    }).catch((e: any) => setError('server', e.response.data.message));
  }


  useEffect(() => {
    clearErrors('server');

  }, [email, password])
  return (
    <>
      <form id="auth-login" onSubmit={handleSubmit<FormData>(onSubmit)}>
        <h1>Fazer login</h1>

        <hr />

        {Object.keys(errors).length > 0 && <Alert type="danger">Houve um erro!!!</Alert>}

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
