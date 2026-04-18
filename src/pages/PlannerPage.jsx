import { useEffect, useState } from 'react'
import FormField from '../components/FormField'
import PageHero from '../components/PageHero'
import SectionHeader from '../components/SectionHeader'
import TextareaField from '../components/TextareaField'
import ToggleField from '../components/ToggleField'
import { clearPlannerState, loadPlannerState, savePlannerState } from '../utils/storage'

const defaultPlanner = {
  tripName: '',
  shipName: '',
  sailDate: '',
  departurePort: '',
  portsOfCall: '',
  notes: '',
  tasks: {
    checkIn: false,
    drinkPackage: false,
    wifi: false,
    dining: false,
    excursions: false,
    travelInsurance: false,
    flights: false,
    hotel: false,
    parking: false,
    passportDocs: false,
  },
}

const taskLabels = [
  ['checkIn', 'Check in', 'Complete online check-in when your window opens.'],
  ['drinkPackage', 'Drink package', 'Decide whether to pre-purchase or skip it.'],
  ['wifi', 'WiFi', 'Lock in internet only if it is actually needed.'],
  ['dining', 'Dining', 'Reserve specialty restaurants or dining packages.'],
  ['excursions', 'Excursions', 'Book port activities before the good options vanish.'],
  ['travelInsurance', 'Travel insurance', 'Add it if the trip cost makes the risk annoying.'],
  ['flights', 'Flights', 'Handle air travel if you are not driving in.'],
  ['hotel', 'Hotel', 'Useful for pre-cruise peace of mind.'],
  ['parking', 'Parking', 'Reserve or note your port parking plan.'],
  ['passportDocs', 'Passport or docs', 'Verify required travel documents early.'],
]

const plannerFields = [
  {
    name: 'tripName',
    label: 'Trip name',
    type: 'text',
    placeholder: 'Spring Break on Wonder',
    helper: 'A short label so the plan feels like a real trip, not a random note.',
  },
  {
    name: 'shipName',
    label: 'Ship name',
    type: 'text',
    placeholder: 'Icon of the Seas',
    helper: 'Use the exact ship name for easy reference later.',
  },
  {
    name: 'sailDate',
    label: 'Sail date',
    type: 'date',
    helper: 'Your embarkation date.',
  },
  {
    name: 'departurePort',
    label: 'Departure port',
    type: 'text',
    placeholder: 'Miami',
    helper: 'City or terminal area you are sailing from.',
  },
]

export default function PlannerPage() {
  // The planner state is loaded once from localStorage and then saved after each change.
  const [planner, setPlanner] = useState(() => loadPlannerState(defaultPlanner))

  useEffect(() => {
    savePlannerState(planner)
  }, [planner])

  function handleFieldChange(event) {
    const { name, value } = event.target
    setPlanner((current) => ({ ...current, [name]: value }))
  }

  function handleTaskToggle(event) {
    const { name, checked } = event.target
    setPlanner((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [name]: checked,
      },
    }))
  }

  function handleClearPlanner() {
    const shouldClear = window.confirm('Clear the saved planner? This will remove the local trip details from this browser.')
    if (!shouldClear) {
      return
    }

    clearPlannerState()
    setPlanner(defaultPlanner)
  }

  return (
    <div className="container page-stack">
      <PageHero
        eyebrow="Planner"
        title="Keep your cruise details in one place"
        description="Save the trip details, notes, and booking to-dos without juggling tabs, screenshots, and random notes."
      />

      <section className="card">
        <SectionHeader
          title="Trip Details"
          description="Keep the core trip details here so you can find them without digging."
        />
        <div className="form-grid">
          {plannerFields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={planner[field.name]}
              onChange={handleFieldChange}
            />
          ))}
          <TextareaField
            fullWidth
            label="Ports of call"
            name="portsOfCall"
            value={planner.portsOfCall}
            onChange={handleFieldChange}
            placeholder="CocoCay, Cozumel, Roatan"
            helper="List ports separated by commas or short lines."
          />
          <TextareaField
            fullWidth
            label="Notes"
            name="notes"
            value={planner.notes}
            onChange={handleFieldChange}
            placeholder="Reservation numbers, transfer notes, hotel ideas, or anything else worth keeping."
            helper="Use this for confirmations, reminders, or loose ends."
          />
        </div>
      </section>

      <section className="card">
        <SectionHeader
          title="Planning Checklist"
          description="Check these off as you book things so the page stays useful."
        />
        <div className="toggle-grid planner-grid">
          {taskLabels.map(([key, label, helper]) => (
            <ToggleField
              key={key}
              label={label}
              name={key}
              checked={planner.tasks[key]}
              onChange={handleTaskToggle}
              helper={helper}
            />
          ))}
        </div>
        <button className="button button-danger" type="button" onClick={handleClearPlanner}>
          Reset planner
        </button>
      </section>
    </div>
  )
}
