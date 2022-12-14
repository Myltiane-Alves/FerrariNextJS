import Link from "next/link";
import { useForm } from "react-hook-form";
import { FormDataLogin } from "../../../types/Auth/FormDataLogin";
import { useAuth } from "../AuthContext";

const FormLogin = () => {

  const { register, handleSubmit } = useForm<FormDataLogin>();
  const { email,   onSubmitLogin } = useAuth();

  return (
    <>
      <form id="auth-login" onSubmit={handleSubmit<FormDataLogin>(onSubmitLogin)}>
        <h1>Fazer login</h1>

        <hr />

        <div className="field">
          <input type="email" {...register('email', {
            required: 'Preencha o e-mail',
          })} id="email-login" readOnly value={email} />
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
