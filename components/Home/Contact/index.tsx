import Item from "./Item";

const Contact = () => {
    return (
        <>
            <section id="contact">
                <h2>Entre em Contato</h2>

                <section>
                    <form>
                        <header className="page-title">
                            <h1>Formulário</h1>
                            <hr />
                        </header>

                        <p>Envie o formulário abaixo para entrar em contato conosco.</p>

                        <div className="alert danger">Preencha todos os campos</div>

                        <div className="fields">
                            <div className="field">
                                <input type="text" name="name" id="name" />
                                <label htmlFor="name">Nome Completo</label>
                            </div>
                            <div className="field">
                                <input type="email" name="email" id="email" />
                                <label htmlFor="email">E-mail</label>
                            </div>
                        </div>
                        <div className="field">
                            <textarea name="message" id="message"></textarea>
                            <label htmlFor="message">Mensagem</label>
                        </div>
                        <div className="actions">
                            <button type="submit">Enviar</button>
                        </div>
                    </form>
                    <div id="map"></div>
                </section>
                <hr className="divider" />
                <ul className="contacts">
                    <Item
                      image="/images/icon-google-place.svg"
                      title="OUR HEADQUARTERS"
                      text="Modena, Itália"
                    />
                    <Item
                      image="/images/icon-phone.svg"
                      title="SPEAK TO US"
                      text="(123) 456 7890"
                    />
                    <Item
                      image="/images/icon-skype.svg"
                      title="MAKE A VIDEO CALL"
                      text="FerrariOnSkype"
                    />
                    <Item
                      image="/images/icon-google-place.svg"
                      title="FOLLOW ON TWITTER"
                      text="2.3M Followers"
                    />
                </ul>
            </section>
        </>
    )
}

export default Contact;
