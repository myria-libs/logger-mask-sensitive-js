import { maskSensitiveData } from "../src/index";


test('Mask function', () => {
    const data = {
        userId: 'user123',
        ssn: '123-45-6789', // Social Security Number
        creditCard: '1234567812345678', // Credit Card Number
        phoneNumber: '123-456-7890', // Phone Number
        email: 'user@example.com', // Email
        transactionDetails: 'Payment for invoice #12345'
    };
    const rules = [
        { key: 'ssn', pattern: /\d{3}-\d{2}-\d{4}/, replacement: '***-**-****' },
        { key: 'creditCard', pattern: /\d{16}/, replacement: '**** **** **** ****' },
        { key: 'phoneNumber', pattern: /\d{3}-\d{3}-\d{4}/, replacement: '***-***-****' },
        { key: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, replacement: '****@****.com' }
    ];
    const maskedData = maskSensitiveData(rules, data);

    expect(maskedData).toMatchObject({
        userId: 'user123',
        ssn: '***-**-****',
        creditCard: '**** **** **** ****',
        phoneNumber: '***-***-****',
        email: '****@****.com',
        transactionDetails: 'Payment for invoice #12345'
      });
});
