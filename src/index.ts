import { Rule } from './rules';

export const maskSensitiveData = (rules: Rule[], info: any) => {
    if (typeof info === 'object' && info !== null) {
        for (const key in info) {
            if (info.hasOwnProperty(key)) {
                if (typeof info[key] === 'string') {
                    rules.forEach(rule => {
                    if (key === rule.key || rule.pattern.test(info[key])) {
                        info[key] = info[key].replace(rule.pattern, rule.replacement);
                    }
                });
                } else if (typeof info[key] === 'object') {
                    info[key] = maskSensitiveData(rules, info[key]);
                }
            }
        }
    }
    return info;
};
