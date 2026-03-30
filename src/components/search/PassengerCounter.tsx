import { Button } from '@/components/ui/button';

type FormErrors = Record<string, string[] | undefined>

type PassengerCounterProps = {
  label: "Adults" | "Children",
  field: "adults" | "children",
  value: number,
  onChange: (num: number) => void
  errors: FormErrors
}

export default function PassengerCounter({ label, field, value, onChange, errors }: PassengerCounterProps) {
  const min = field === 'adults' ? 1 : 0;

  const minusPassenger = (): void => {
    if (value > min) onChange(value - 1);
  }

  const addPassenger = (): void => {
    if (value < 9) onChange(value + 1);
  }

  return (
    <div className="flex justify-between items-center">
      <label htmlFor={field} className="text-sm text-zinc-400">{label}</label>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          data-testid={`${field}-minus`}
          disabled={value === min}
          onClick={minusPassenger}
          aria-label={`Remove ${label} passenger`}
          className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </Button>
        <input type="hidden" name={field} id={field} value={value} />
        <span data-testid={`${field}-count`} className="inline-block w-12 text-center">{value}</span>
        <Button
          type="button"
          data-testid={`${field}-add`}
          disabled={value >= 9}
          onClick={addPassenger}
          aria-label={`Add ${label} passenger`}
          className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </Button>
      </div>
      {errors?.[field]?.[0] && (
        <p className="text-red-400 text-xs pt-1">
          {errors[field][0]}
        </p>
      )}
    </div>
  )
}