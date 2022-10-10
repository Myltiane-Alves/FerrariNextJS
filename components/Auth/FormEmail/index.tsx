import Link from "next/link";

const FormEmail = () => {
    return (
        <>
            <form id="auth-email">
                <h1>Autenticação</h1>

                <hr />

                <div className="field">
                    <input type="email" name="email" id="email" />
                    <label htmlFor="email">E-mail</label>
                </div>

                <div className="actions">
                    <Link href="auth.html#register">
                        <a className="link">Criar uma Conta</a>
                    </Link>
                    <button type="submit">Próxima</button>
                </div>
            </form>
        </>
    )
}

export default FormEmail;