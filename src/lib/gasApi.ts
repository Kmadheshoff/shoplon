const GAS_URL = import.meta.env.VITE_GAS_URL;

export const fetchProducts = async () => {
  const response = await fetch(`${GAS_URL}?action=getProducts`);
  const data = await response.json();
  return data.products;
};

export const sendOtp = async (email: string, otp: string) => {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'sendOtp', email, otp }),
  });
  return await response.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'verifyOtp', email, otp }),
  });
  return await response.json();
};

export const addOrder = async (orderData: any) => {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addOrder', ...orderData }),
  });
  return await response.json();
};

export const fetchOrders = async (email: string) => {
  const response = await fetch(`${GAS_URL}?action=getOrders&email=${encodeURIComponent(email)}`);
  const data = await response.json();
  return data.orders || [];
};
