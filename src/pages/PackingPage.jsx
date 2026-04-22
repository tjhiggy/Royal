import { useMemo, useState } from 'react'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import ToggleField from '../components/ToggleField'
import { generatePackingList } from '../utils/calculators'

const initialForm = {
  nights: 7,
  warmWeather: true,
  formalNights: 2,
  adults: 2,
  kids: 0,
  beachPoolDays: 3,
  excursionBeach: true,
  excursionAdventure: false,
  excursionWalking: true,
  excursionRainy: false,
}

const sectionTitles = {
  clothing: 'Clothing',
  toiletries: 'Toiletries',
  travelDocuments: 'Travel Documents',
  cabinEssentials: 'Cabin Essentials',
  electronics: 'Electronics',
  easyToForget: 'Easy-to-Forget Items',
}

const sectionMarkers = {
  clothing: 'C',
  toiletries: 'T',
  travelDocuments: 'D',
  cabinEssentials: 'K',
  electronics: 'E',
  easyToForget: '!',
}

const packingFields = [
  ['nights', 'Number of nights', 'Length of the sailing.'],
  ['formalNights', 'Formal nights count', 'Add as many dinner dress-up nights as you expect.'],
  ['adults', 'Number of adults', 'Used for small quantity reminders.'],
  ['kids', 'Number of kids', 'Adds a few family-specific reminders.'],
  ['beachPoolDays', 'Beach or pool days', 'Helps bulk up swim and beach items.'],
]

const excursionToggles = [
  ['warmWeather', 'Warm weather', 'Adds lighter daytime clothing and beach basics.'],
  ['excursionBeach', 'Beach excursion', 'Adds dry-bag and beach-specific reminders.'],
  ['excursionAdventure', 'Adventure excursion', 'Adds activewear and a few practical extras.'],
  ['excursionWalking', 'Walking-heavy day', 'Adds more comfort-focused footwear prep.'],
  ['excursionRainy', 'Rainy possibility', 'Adds backup rain gear.'],
]

export default function PackingPage() {
  const [form, setForm] = useState(initialForm)
  const [checkedItems, setCheckedItems] = useState({})
  const sections = useMemo(() => generatePackingList(form), [form])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function toggleItem(section, item) {
    const key = `${section}-${item}`
    setCheckedItems((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Packing"
        title="Pack for the sailing you are actually taking"
        description="Set the trip basics and get a cruise-specific checklist instead of a generic beach list pretending to be useful."
      />

      <section className="card">
        <SectionHeader
          title="Trip Details"
          description="These details shape the checklist without turning the page into a packing dissertation."
        />
        <div className="form-grid">
          {packingFields.map(([name, label, helper]) => (
            <FormField
              key={name}
              label={label}
              name={name}
              value={form[name]}
              onChange={handleChange}
              min={name === 'nights' ? '1' : '0'}
              helper={helper}
              inputMode="numeric"
            />
          ))}
        </div>
        <div className="toggle-grid">
          {excursionToggles.map(([name, label, helper]) => (
            <ToggleField
              key={name}
              label={label}
              name={name}
              checked={form[name]}
              onChange={handleChange}
              helper={helper}
            />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          title="Checklist"
          description="Check items off as you prep. Print it if that works better for you."
        />
        <div className="packing-sections">
          {sections.map((section) => (
            <article key={section.section} className="card packing-card">
              <div className="packing-card-header">
                <span className="tool-icon" aria-hidden="true">{sectionMarkers[section.section] ?? 'P'}</span>
                <div>
                  <h3>{sectionTitles[section.section]}</h3>
                  <small>{section.items.length} items</small>
                </div>
              </div>
              <ul className="checklist">
                {section.items.map((item) => {
                  const key = `${section.section}-${item}`
                  return (
                    <li key={key}>
                      <label className={`check-item ${checkedItems[key] ? 'check-item-done' : ''}`}>
                        <input
                          type="checkbox"
                          checked={Boolean(checkedItems[key])}
                          onChange={() => toggleItem(section.section, item)}
                        />
                        <span>{item}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
