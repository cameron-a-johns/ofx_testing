import React, { useState } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import Input from '../../Components/Input';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { calculateTradeValues } from '../../Services/Math';
import { fetchCurrencyRate, isOkResult } from '../../Services/Api';
import Table from '../../Components/Table';

let countries = CountryData.CountryCodes;

// In the question it says to use 0.05 but in the examples you've used 0.5, I've opted to use 0.05;
const OFX_RATE = 0.0005;
const DEFAULT_RATE = 0.7456;

const getCurrencyFromCountry = (country: string): string => countryToCurrency[country as keyof typeof countryToCurrency];

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [amount, setAmount] = useState(100);
    const [roundResults, setRoundResults] = useState(true);

    const [exchangeRate, setExchangeRate] = useState<number | undefined>(DEFAULT_RATE);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);


    const tradeValues = calculateTradeValues(amount, exchangeRate || 0, OFX_RATE, roundResults ? 2 : 20, getCurrencyFromCountry(fromCurrency), getCurrencyFromCountry(toCurrency));

    const Flag = ({ code }: { code: string }) => (
        <img alt={code || ''} src={`/img/flags/${code || ''}.svg`} width="20px" className={classes.flag} />
    );

    const fetchData = async ({overrideCurrency, overrideToCurrency}: {overrideCurrency?: string, overrideToCurrency?: string}) => {
        if (!loading) {
            setLoading(true);

            const rate = await fetchCurrencyRate(overrideCurrency || fromCurrency, overrideToCurrency || toCurrency, DEFAULT_RATE);

            if (isOkResult(rate)) {
                setExchangeRate(rate.data.retailRate);
            } else {
                setExchangeRate(undefined);
            }

            setLoading(false);
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData({});
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
                            disabled={loading}
                            leftIcon={<Flag code={fromCurrency} />}
                            label={'From'}
                            selected={getCurrencyFromCountry(fromCurrency)}
                            options={countries.map(({ code }) => ({
                                option: getCurrencyFromCountry(code),
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setFromCurrency(key);
                                fetchData({ overrideCurrency: key });
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <img src="/img/icons/Transfer.svg" alt="Transfer icon" />
                        </div>

                        <div className={classes.rate}>{exchangeRate || 'Error'}</div>
                        {exchangeRate === undefined && <div className={classes.rateError}>Rate error, please refresh the page</div>}
                    </div>

                    <div>
                        <DropDown
                            disabled={loading}
                            leftIcon={<Flag code={toCurrency} />}
                            label={'To'}
                            selected={getCurrencyFromCountry(toCurrency)}
                            options={countries.map(({ code }) => ({
                                option: getCurrencyFromCountry(code),
                                key: code,
                                icon: <Flag code={code} />,
                            }))}
                            setSelected={(key: string) => {
                                setToCurrency(key);
                                fetchData({ overrideToCurrency: key });
                            }}
                            style={{ marginLeft: '20px' }}
                        />
                    </div>
                </div>

                <div className={classes.rowWrapper} style={{ alignItems: 'center' }}>
                    <Input
                        onChange={setAmount}
                        value={amount}
                        label='Amount'
                        style={{ marginTop: '20px'}}
                        type='number'
                    />

                    <div className={classes.checkboxWrapper}>
                        <label htmlFor='roundResults' style={{ fontSize: '14px' }}>Round results</label>
                        <input id='roundResults' className={classes.checkbox} type='checkbox' checked={roundResults} onChange={() => {
                            setRoundResults(!roundResults)
                        }} />
                    </div>

                </div>

                {tradeValues && (
                    <Table
                        loading={loading}
                        style={{ marginTop: '20px' }}
                        label='Trade Details'
                        data={[tradeValues]}
                        headers={[{ label: 'Trade cost', key: 'tradeCost' }, { label: 'Trade value', key: 'tradeValue' }, { label: 'Trade value received', key: 'tradeValueReceived' }, { label: 'OFX margin cost', key: 'cost' }]}
                    >
                        
                    </Table>
                )}

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
