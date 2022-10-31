import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext";



const FormLogin = () => {

  const { register, handleSubmit, formState: { errors }, setError, clearErrors, watch } = useForm();
  const { email, password, onSubmitLogin } = useAuth();

  return (
    <>
      <form id="auth-login" onSubmit={handleSubmit(onSubmitLogin)}>
        <h1>Fazer login</h1>

        <hr />

        <div className="field">
          <input type="email" value={email} />
          <label htmlFor="email-login">E-mail</label>
        </div>

        <div className="field">
          <input type="password" id="password" value={password} />
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
