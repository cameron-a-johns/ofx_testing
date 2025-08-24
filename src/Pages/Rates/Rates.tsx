import { useState } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import Input from '../../Components/Input';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { calculateTradeValues } from '../../Services/Math';

let countries = CountryData.CountryCodes;

// In the question it says to use 0.05 but in the examples you've used 0.5, I've opted to use 0.05;
const OFX_RATE = 0.0005;
const DEFAULT_RATE = 0.7456;

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [amount, setAmount] = useState(100);

    const [exchangeRate, setExchangeRate] = useState(DEFAULT_RATE);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);

    const tradeValues = calculateTradeValues(amount, exchangeRate, OFX_RATE);

    const Flag = ({ code }: { code: string }) => (
        <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />
    );

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);

            const fromCurrencyCode = countryToCurrency[fromCurrency as keyof typeof countryToCurrency];
            const toCurrencyCode = countryToCurrency[toCurrency as keyof typeof countryToCurrency];

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
                

                setExchangeRate(data.retailRate || DEFAULT_RATE);
            } catch (error) {
                console.error("Could not fetch exchange rate:", error);
            }

            setLoading(false);
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData();
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <div className={classes.rowWrapper}>
                    <div>
                        <DropDown
                            leftIcon={<Flag code={fromCurrency} />}
                            label={'From'}
                            selected={countryToCurrency[fromCurrency as keyof typeof countryToCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code as keyof typeof countryToCurrency],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setFromCurrency(key);
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <img src="/img/icons/Transfer.svg" alt="Transfer icon" />
                        </div>

                        <div className={classes.rate}>{exchangeRate}</div>
                    </div>

                    <div>
                        <DropDown
                            leftIcon={<Flag code={toCurrency} />}
                            label={'To'}
                            selected={countryToCurrency[toCurrency as keyof typeof countryToCurrency]}
                            options={countries.map(({ code }) => ({
                                option: countryToCurrency[code as keyof typeof countryToCurrency],
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setToCurrency(key);
                            }}
                            style={{ marginLeft: '20px' }}
                        />
                    </div>
                </div>

                <Input
                    onChange={setAmount}
                    value={amount}
                    label='Amount'
                    style={{ marginTop: '20px'}}
                    type='number'
                />

                <div>
                    <h3>Trade result:</h3>
                    {tradeValues && <div className={classes.tradeResults}>
                        <span><b>Actual:</b>
                            {tradeValues.actual}
                        </span>
                        <span><b>Marked:</b>
                            {tradeValues.marked}
                        </span>
                    </div>}
                </div>

                <ProgressBar
                    progress={progression}
                    animationClass={loading ? classes.slow : ''}
                    style={{ marginTop: '20px' }}
                />

                {loading && (
                    <div className={classes.loaderWrapper}>
                        <Loader width={'25px'} height={'25px'} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rates;
