export default function StatusBadge({ status }) {
  const map = {
    pending:    { cls: 'badge-pending',    label: '⏳ Pending' },
    confirmed:  { cls: 'badge-confirmed',  label: '✅ Confirmed' },
    processing: { cls: 'badge-processing', label: '⚙️ Processing' },
    delivered:  { cls: 'badge-delivered',  label: '📦 Delivered' },
    cancelled:  { cls: 'badge-cancelled',  label: '❌ Cancelled' },
  };
  const { cls, label } = map[status] || { cls: 'badge bg-gray-100 text-gray-600', label: status };
  return <span className={cls}>{label}</span>;
}
