import CountryData from '../Libs/Countries.json';
import countryToCurrency from '../Libs/CountryCurrency.json';

interface Result {
    status: 'ok' | 'error';
    message?: string;
    data?: {
        retailRate: number;
    }
}

interface OkResult extends Result {
    status: 'ok';
    data: {
        retailRate: number;
    }
}

interface ErrorResult extends Result {
    status: 'error';
    message: string;
}

export const isOkResult = (result: Result): result is OkResult => {
    return result.status === 'ok';
}

export const fetchCurrencyRate = async (fromCurrency: string, toCurrency: string, defaultRate: number): Promise<Result> => {
    if (!fromCurrency || !toCurrency) {
        return {
            status: 'error',
            message: 'Invalid currency'
        } as ErrorResult;
    }

    const fromCurrencyCode = countryToCurrency[fromCurrency as keyof typeof countryToCurrency];
    const toCurrencyCode = countryToCurrency[toCurrency as keyof typeof countryToCurrency];

    if (!fromCurrencyCode || !toCurrencyCode) {
        return {
            status: 'error',
            message: 'Invalid currency'
        } as ErrorResult;
    }

    const endpoint = "https://rates.staging.api.paytron.com/rate/public";

    const url = `${endpoint}?sellCurrency=${fromCurrencyCode}&buyCurrency=${toCurrencyCode}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {
            status: 'ok',
            data: {
                retailRate: data.retailRate || defaultRate
            }
        } as OkResult;
    } catch (error) {
        console.error("Could not fetch exchange rate:", error);

        return {
            status: 'error',
            message: 'Could not fetch exchange rate'
        } as ErrorResult;
    }
};