import { useMemo, useState } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import Button from './Button.jsx';
import { Field, Input, Select, Textarea } from './Field.jsx';
import Modal from './Modal.jsx';
import { calculateRiskReward } from '../utils/calculations.js';
import { validateBacktest } from '../utils/validation.js';

const emptyBacktest = {
  strategy: '',
  pair: '',
  side: 'Buy',
  entry: '',
  takeProfit: '',
  stopLoss: '',
  exit: '',
  capturedPips: '',
  profitLoss: '',
  date: new Date().toISOString().slice(0, 10),
  session: 'London',
  setupGrade: 'A',
  followedRules: 'Yes',
  mistake: 'None',
  notes: '',
  screenshot: '',
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read screenshot.'));
    reader.readAsDataURL(file);
  });
}

export default function BacktestFormModal({ backtest, onClose, onSave }) {
  const [values, setValues] = useState(() => ({ ...emptyBacktest, ...backtest }));
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');

  const rrRatio = useMemo(
    () => calculateRiskReward(values.entry, values.stopLoss, values.takeProfit),
    [values.entry, values.stopLoss, values.takeProfit],
  );

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleScreenshot(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please upload an image file.');
      return;
    }

    try {
      const screenshot = await readFileAsDataUrl(file);
      updateField('screenshot', screenshot);
      setFileError('');
    } catch (error) {
      setFileError(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateBacktest(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    onSave({
      ...values,
      id: values.id || crypto.randomUUID(),
      strategy: values.strategy.trim(),
      pair: values.pair.trim().toUpperCase(),
      entry: Number(values.entry),
      takeProfit: values.takeProfit === '' ? '' : Number(values.takeProfit),
      stopLoss: values.stopLoss === '' ? '' : Number(values.stopLoss),
      exit: Number(values.exit),
      capturedPips: Number(values.capturedPips),
      profitLoss: Number(values.profitLoss),
      rrRatio,
      notes: values.notes.trim(),
    });
  }

  return (
    <Modal title={backtest ? 'Edit Backtest' : 'Add Backtest'} onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Strategy" error={errors.strategy}>
            <Input value={values.strategy} onChange={(event) => updateField('strategy', event.target.value)} placeholder="London breakout" />
          </Field>
          <Field label="Pair" error={errors.pair}>
            <Input value={values.pair} onChange={(event) => updateField('pair', event.target.value)} placeholder="EURUSD" />
          </Field>
          <Field label="Buy/Sell" error={errors.side}>
            <Select value={values.side} onChange={(event) => updateField('side', event.target.value)}>
              <option>Buy</option>
              <option>Sell</option>
            </Select>
          </Field>
          <Field label="Date" error={errors.date}>
            <Input type="date" value={values.date} onChange={(event) => updateField('date', event.target.value)} />
          </Field>
          <Field label="Entry" error={errors.entry}>
            <Input type="number" step="0.00001" value={values.entry} onChange={(event) => updateField('entry', event.target.value)} />
          </Field>
          <Field label="Take Profit" error={errors.takeProfit}>
            <Input type="number" step="0.00001" value={values.takeProfit} onChange={(event) => updateField('takeProfit', event.target.value)} />
          </Field>
          <Field label="Stop Loss" error={errors.stopLoss}>
            <Input type="number" step="0.00001" value={values.stopLoss} onChange={(event) => updateField('stopLoss', event.target.value)} />
          </Field>
          <Field label="Exit" error={errors.exit}>
            <Input type="number" step="0.00001" value={values.exit} onChange={(event) => updateField('exit', event.target.value)} />
          </Field>
          <Field label="Captured Pips" error={errors.capturedPips}>
            <Input type="number" step="0.1" value={values.capturedPips} onChange={(event) => updateField('capturedPips', event.target.value)} />
          </Field>
          <Field label="Profit/Loss" error={errors.profitLoss}>
            <Input type="number" step="0.01" value={values.profitLoss} onChange={(event) => updateField('profitLoss', event.target.value)} />
          </Field>
          <Field label="Session">
            <Select value={values.session} onChange={(event) => updateField('session', event.target.value)}>
              <option>Asia</option>
              <option>London</option>
              <option>New York</option>
              <option>Overlap</option>
            </Select>
          </Field>
          <Field label="Setup Grade">
            <Select value={values.setupGrade} onChange={(event) => updateField('setupGrade', event.target.value)}>
              <option>A+</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </Select>
          </Field>
          <Field label="Followed Rules">
            <Select value={values.followedRules} onChange={(event) => updateField('followedRules', event.target.value)}>
              <option>Yes</option>
              <option>No</option>
            </Select>
          </Field>
          <Field label="Mistake">
            <Select value={values.mistake} onChange={(event) => updateField('mistake', event.target.value)}>
              <option>None</option>
              <option>Early Entry</option>
              <option>Late Entry</option>
              <option>Moved SL</option>
              <option>Exited Early</option>
              <option>Ignored Rule</option>
            </Select>
          </Field>
        </div>

        <div className="rounded-lg border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-cyan-300/10 to-violet-400/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Risk-to-Reward Ratio</p>
              <p className="text-sm text-zinc-400">Calculated from entry, stop loss, and take profit.</p>
            </div>
            <p className="text-2xl font-semibold text-amber-100">1:{rrRatio || '0.00'}</p>
          </div>
        </div>

        <Field label="Notes">
          <Textarea value={values.notes} onChange={(event) => updateField('notes', event.target.value)} placeholder="Rules, setup quality, replay observations..." />
        </Field>

        <div className="rounded-lg border border-dashed border-cyan-300/30 bg-cyan-300/[0.04] p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center text-sm text-cyan-100/75">
            <ImagePlus className="text-cyan-200" size={24} />
            <span>Upload screenshot</span>
            <input className="sr-only" type="file" accept="image/*" onChange={handleScreenshot} />
          </label>
          {fileError ? <p className="mt-3 text-center text-xs text-red-300">{fileError}</p> : null}
          {values.screenshot ? (
            <img src={values.screenshot} alt="Uploaded backtest screenshot" className="mx-auto mt-4 max-h-48 rounded-lg border border-cyan-300/20 object-contain" />
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-cyan-400/15 pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Save size={18} />
            Save Backtest
          </Button>
        </div>
      </form>
    </Modal>
  );
}
