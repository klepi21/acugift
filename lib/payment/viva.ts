interface CreatePaymentOrderParams {
  amount: number;
  email: string;
  phone: string;
  fullName: string;
  customerTrns: string;
}

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.VIVA_CLIENT_ID}:${process.env.VIVA_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${process.env.NEXT_PUBLIC_VIVA_BASE_URL}/connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Token error:', error);
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPaymentOrder({
  amount,
  email,
  phone,
  fullName,
  customerTrns,
}: CreatePaymentOrderParams) {
  try {
    const token = await getAccessToken();
    
    console.log('Making payment request with:', {
      amount,
      email,
      phone,
      fullName,
      customerTrns,
      token: token.slice(0, 10) + '...' // Log partial token for debugging
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_VIVA_BASE_URL}/checkout/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        customerTrns,
        customer: {
          email,
          fullName,
          phone,
          countryCode: 'GR',
        },
        paymentTimeout: 1800,
        preauth: false,
        allowRecurring: false,
        maxInstallments: 0,
        paymentNotification: true,
        tipAmount: 0,
        disableExactAmount: false,
        disableCash: true,
        disableWallet: true,
        sourceCode: process.env.VIVA_SOURCE_CODE,
        merchantTrns: customerTrns,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Viva API error response:', errorText);
      throw new Error(`Viva API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      orderCode: data.orderCode,
      checkoutUrl: data.redirectToAcsForm 
        ? data.redirectToAcsForm
        : `${process.env.NEXT_PUBLIC_VIVA_BASE_URL}/checkout/form/${data.orderCode}`,
    };
  } catch (error: unknown) {
    console.error('Create payment order error:', error);
    throw new Error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}