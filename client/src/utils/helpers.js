export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-IN').format(Math.round(n));

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getDayOfMonth = () => new Date().getDate();

export const getDaysInMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export const CATEGORY_ICONS = {
  Food: '🍕',
  Transport: '🚗',
  Education: '📚',
  Entertainment: '🎮',
  Shopping: '🛍️',
  Health: '💊',
  Other: '📦',
};

export const CATEGORY_COLORS = {
  Food: '#4f8ef7',
  Transport: '#7c3aed',
  Education: '#10b981',
  Entertainment: '#f59e0b',
  Shopping: '#ef4444',
  Health: '#06b6d4',
  Other: '#8b9ab8',
};

export const SURVIVAL_TIPS = [
  'Skip food delivery — use hostel mess',
  'Walk short distances instead of booking a cab',
  'Pause all subscriptions temporarily',
  'Buy groceries in bulk from local market',
  'Use student discounts wherever possible',
  'Cook with friends to split costs',
  'Avoid impulse shopping online',
];
