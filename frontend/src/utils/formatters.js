export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncateString(str, maxLength = 20) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

export function getTransactionType(transaction, currentUser = 'current-user') {
  if (transaction.receiver === currentUser) {
    return 'incoming';
  }
  return 'outgoing';
}