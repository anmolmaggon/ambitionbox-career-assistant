import { Check, LockKeyhole, Send, ShieldCheck } from 'lucide-react'

export function EmailReview({ label, value, onChange, onSend, permissionRequired = false, permissionGranted = false, onPermissionChange, onKeepDraft, sendLabel = 'Approve and send' }) {
  const canSend = value.trim() && (!permissionRequired || permissionGranted)
  return <section className="email-review">
    <div className="email-review__top">
      <span>{label}</span>
      <span className="not-sent"><LockKeyhole size={12} /> Not sent</span>
    </div>
    <textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />
    {permissionRequired && <label className={`permission-check ${permissionGranted ? 'is-checked' : ''}`}>
      <input type="checkbox" checked={permissionGranted} onChange={(event) => onPermissionChange(event.target.checked)} />
      <span className="permission-check__mark">{permissionGranted && <Check size={14} />}</span>
      <span><strong>Send only messages I approve</strong><small>One-time Gmail permission. AmbitionBox cannot send or edit anything else.</small></span>
    </label>}
    <div className="trust-note"><ShieldCheck size={16} /><span>You see the exact message before every send.</span></div>
    <button className="primary-button" disabled={!canSend} onClick={onSend}><Send size={17} /> {sendLabel}</button>
    {onKeepDraft && <button className="text-button" onClick={onKeepDraft}>Keep as draft</button>}
  </section>
}
