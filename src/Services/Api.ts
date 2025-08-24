import CountryData from '../Libs/Countries.json';
import countryToCurrency from '../Libs/CountryCurrency.json';

export const fetchCurrencyRate = async (fromCurrency: string, toCurrency: string, defaultRate: number) => {
    if (!fromCurrency || !toCurrency) {
        throw new Error('Invalid currency');
    }

    const fromCurrencyCode = countryToCurrency[fromCurrency as keyof typeof countryToCurrency];
    const toCurrencyCode = countryToCurrency[toCurrency as keyof typeof countryToCurrency];

    if (!fromCurrencyCode || !toCurrencyCode) {
        throw new Error('Invalid currency');
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

        return data.retailRate || defaultRate;
    } catch (error) {
        console.error("Could not fetch exchange rate:", error);
    }
};