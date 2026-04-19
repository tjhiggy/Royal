import { Link, useLocation } from 'react-router-dom'

const steps = [
  {
    number: 1,
    label: 'Deal',
    title: 'Is this a good deal?',
    to: '/tools/deal-evaluator',
    paths: ['/tools/deal-evaluator'],
  },
  {
    number: 2,
    label: 'Cost',
    title: 'What will it really cost?',
    to: '/tools/cruise-cost',
    paths: ['/tools/cruise-cost'],
  },
  {
    number: 3,
    label: 'Upgrades',
    title: 'Which upgrades are worth it?',
    to: '/tools/drink-package',
    paths: ['/tools/drink-package', '/tools/dining-package', '/tools/wifi', '/tools/the-key', '/dining'],
  },
  {
    number: 4,
    label: 'Compare',
    title: 'Refine the plan',
    to: '/compare',
    paths: ['/compare', '/planner'],
  },
]

export default function DecisionProgress() {
  const { pathname } = useLocation()
  const activeIndex = steps.findIndex((step) => step.paths.some((path) => pathname.startsWith(path)))

  return (
    <nav className="decision-progress" aria-label="Cruise decision flow">
      <div className="container decision-progress-inner">
        <span className="decision-progress-label">Decision flow</span>
        <div className="decision-progress-steps">
          {steps.map((step, index) => {
            const isActive = index === activeIndex
            const isComplete = activeIndex > index
            const className = [
              'decision-step',
              isActive ? 'decision-step-active' : '',
              isComplete ? 'decision-step-complete' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <Link key={step.number} className={className} to={step.to} aria-current={isActive ? 'step' : undefined}>
                <span className="decision-step-number">{isComplete ? 'OK' : step.number}</span>
                <span className="decision-step-copy">
                  <span className="decision-step-label">Step {step.number}: {step.label}</span>
                  <span className="decision-step-title">{step.title}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
