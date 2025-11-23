/**
 * Test card numbers for sandbox environment
 * These cards trigger specific scenarios for testing
 */

export interface TestCard {
  number: string;
  description: string;
  outcome: 'success' | 'declined' | 'requires_3ds' | 'insufficient_funds' | 'expired' | 'invalid';
  message?: string;
}

export const TEST_CARDS: TestCard[] = [
  // Success cards
  {
    number: '4242424242424242',
    description: 'Visa - Success',
    outcome: 'success',
  },
  {
    number: '4111111111111111',
    description: 'Visa - Success (Alternative)',
    outcome: 'success',
  },
  {
    number: '5555555555554444',
    description: 'Mastercard - Success',
    outcome: 'success',
  },
  {
    number: '378282246310005',
    description: 'American Express - Success',
    outcome: 'success',
  },
  
  // 3DS Required
  {
    number: '4000000000003220',
    description: 'Visa - Requires 3DS authentication',
    outcome: 'requires_3ds',
  },
  {
    number: '4000002500003155',
    description: 'Visa - Requires 3DS (Alternative)',
    outcome: 'requires_3ds',
  },
  
  // Declined cards
  {
    number: '4000000000000002',
    description: 'Visa - Generic decline',
    outcome: 'declined',
    message: 'Your card was declined',
  },
  {
    number: '4000000000009995',
    description: 'Visa - Insufficient funds',
    outcome: 'insufficient_funds',
    message: 'Insufficient funds',
  },
  {
    number: '4000000000000069',
    description: 'Visa - Expired card',
    outcome: 'expired',
    message: 'Your card has expired',
  },
  {
    number: '4000000000000127',
    description: 'Visa - Incorrect CVC',
    outcome: 'invalid',
    message: 'Incorrect CVC code',
  },
  {
    number: '4000000000000119',
    description: 'Visa - Processing error',
    outcome: 'declined',
    message: 'An error occurred while processing your card',
  },
];

export function getTestCardOutcome(cardNumber: string): TestCard | null {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return TEST_CARDS.find(card => card.number === cleanNumber) || null;
}

export function isTestCard(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return TEST_CARDS.some(card => card.number === cleanNumber);
}

/**
 * Test card expiry dates
 * Any future date works for success scenarios
 * These specific dates trigger different behaviors
 */
export const TEST_EXPIRY = {
  VALID: '12/25',      // Any future date works
  EXPIRED: '01/20',    // Triggers expired card error
  INVALID: '13/25',    // Invalid month
};

/**
 * Test CVV codes
 * Any 3-4 digit number works for success scenarios
 */
export const TEST_CVV = {
  VALID: '123',        // Standard valid CVV
  VALID_AMEX: '1234',  // Valid CVV for Amex (4 digits)
  INVALID: '000',      // Triggers invalid CVV error
};
