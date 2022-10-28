import { formatCurrency } from "../../../utils/formatCurrency";
import { useScheduleService } from "../ScheduleServiceContext";

const Panel = () => {

  const { selecteds } = useScheduleService();

  return (
    <aside>
      <header>Resumo</header>

      <section>
        <table>
          <tbody>
            {selecteds.map(({ id, name, price}) => (
              <tr
                key={String(id)}
              >
                <td>{name}</td>
                <td className="price">{formatCurrency(+price)}</td>
              </tr>

            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <button type="button" id="btn-summary-toggle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="7.41"
            viewBox="0 0 12 7.41"
          >
            <path
              d="M10,6,8.59,7.41,13.17,12,8.59,16.59,10,18l6-6Z"
              transform="translate(-6 16) rotate(-90)"
              fill="#707070"
            />
          </svg>
        </button>

        <div>
          <span>Total</span>
          <span className="total">R$ 0,00</span>
        </div>
      </footer>
    </aside>
  )
}

export default Panel
