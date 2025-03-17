import { maskSensitiveData } from '@myria/logger-mask-sensitive-js';
import { createLogger, format, transports } from 'winston';

const sensitivityRules = [
    { key: 'ssn', pattern: /\d{3}-\d{2}-\d{4}/, replacement: '***-**-****' },
    { key: 'creditCard', pattern: /\d{16}/, replacement: '**** **** **** ****' },
    { key: 'phoneNumber', pattern: /\d{3}-\d{3}-\d{4}/, replacement: '***-***-****' },
    { key: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, replacement: '****@****.com' }
];

function create(rules, level) {
    const customFormat = format.printf(({ level, message, timestamp }) => {
        let maskedMessage;
        try {
          const parsedMessage = JSON.parse(message);
          maskedMessage = maskSensitiveData(rules, parsedMessage);          
        } catch (e) {            
          maskedMessage = message;
        }        
        return `${timestamp} ${level}: ${JSON.stringify(maskedMessage)}`;
    }); 

    const logger = createLogger({
        level,
        format: format.combine(
            format.timestamp(),
            format.colorize(),
            customFormat
        ),
        transports: [
            new transports.Console({
                format: customFormat,
            }),
        ],
    });

    return logger;
}

function test() {
    const logger = create(sensitivityRules, 'debug');
    const message = {
        userId: 'user123',
        ssn: '123-45-6789', // Social Security Number
        creditCard: '1234567812345678', // Credit Card Number
        phoneNumber: '123-456-7890', // Phone Number
        email: 'user@example.com', // Email
        transactionDetails: 'Payment for invoice #12345'
    }

    logger.info(JSON.stringify(message));
}

test();