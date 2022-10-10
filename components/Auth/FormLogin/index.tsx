import Link from "next/link";

const FormLogin = () => {
    return (
        <>
            <form id="auth-login" >
                <h1>Fazer login</h1>

                <hr />

                <div className="field">
                    <input type="email" name="email" id="email-login" />
                    <label htmlFor="email-login">E-mail</label>
                </div>

                <div className="field">
                    <input type="password" name="password" id="password" />
                    <label htmlFor="password">Digite sua Senha</label>
                </div>

                <div className="actions">
                    <div>
                        <Link href="#register">
                            <a className="link">Esqueceu sua senha?</a>
                        </Link>
                        <Link href="#email">
                            <a className="link">Este não é o seu e-mail?</a>
                        </Link>
                    </div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </>
    )
}

export default FormLogin;