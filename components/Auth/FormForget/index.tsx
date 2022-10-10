import Link from "next/link";

const FormForget = () => {
    return (
        <>
            <form id="auth-register" className="register">
                <h1>Criar conta</h1>

                <hr />

                <div className="field">
                    <input type="email" name="email" id="email-register" />
                    <label htmlFor="email-register">E-mail</label>
                </div>

                <div className="field">
                    <input type="text" name="name" id="name" />
                    <label htmlFor="name">Nome Completo</label>
                </div>

                <div className="field">
                    <input type="date" name="birth_at" id="birth_at" />
                    <label htmlFor="birth_at">Data de Nascimento</label>
                </div>

                <div className="field">
                    <input type="password" name="password" id="password_new" />
                    <label htmlFor="password_new">Crie uma Senha</label>
                </div>

                <div className="field">
                    <input
                        type="password"
                        name="password_confirm"
                        id="password_confirm"
                    />
                    <label htmlFor="password_confirm">Confirme a Senha</label>
                </div>

                <div className="actions">
                    <Link href="auth.html#login">
                        <a className="link">Já tem uma conta?</a>
                    </Link>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>

        </>
    )
}

export default FormForget;