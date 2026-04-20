import { formatCurrency } from '../utils/formatters'

const forgottenCostItems = [
  {
    key: 'prepaidGratuities',
    label: 'Gratuities',
    helper: 'Daily service charges add up fast.',
    amount: 250,
  },
  {
    key: 'parking',
    label: 'Parking',
    helper: 'Port parking rarely stays invisible.',
    amount: 120,
  },
  {
    key: 'hotel',
    label: 'Hotel',
    helper: 'One pre-cruise night is common.',
    amount: 220,
  },
  {
    key: 'excursions',
    label: 'Excursions',
    helper: 'Tours and beach days are not free just because they are sunny.',
    amount: 450,
  },
  {
    key: 'miscellaneous',
    label: 'Onboard misc spend',
    helper: 'Most trips do not stay at $0 here.',
    amount: 150,
  },
]

export default function ForgottenCosts({ form, onQuickAdd }) {
  const zeroCount = forgottenCostItems.filter((item) => Number(form[item.key]) === 0).length

  return (
    <section className="card forgotten-costs-card">
      <div className="section-header">
        <div className="section-title-row">
          <span className="section-icon" aria-hidden="true">!</span>
          <h2>Costs people forget</h2>
        </div>
        <p>
          {zeroCount
            ? 'Most trips do not stay at $0 here. Quick-add the usual suspects before the total lies to your face.'
            : 'Good. The usual forgotten costs are at least on the board.'}
        </p>
      </div>

      <div className="forgotten-cost-grid">
        {forgottenCostItems.map((item) => {
          const value = Number(form[item.key]) || 0
          const isMissing = value === 0

          return (
            <article key={item.key} className={`forgotten-cost-item ${isMissing ? 'forgotten-cost-missing' : ''}`}>
              <div className="forgotten-cost-copy">
                <strong>{item.label}</strong>
                <span>{isMissing ? item.helper : `${formatCurrency(value)} already included.`}</span>
              </div>
              <button
                type="button"
                className={`button ${isMissing ? 'button-secondary' : 'button-ghost'} forgotten-cost-button`}
                onClick={() => onQuickAdd(item.key, item.amount)}
              >
                {isMissing ? `Add ${formatCurrency(item.amount)}` : 'Update'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
