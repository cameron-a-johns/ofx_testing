export const calculateTradeValues = (amount: number, exchangeRate: number, ofxRate: number, precision: number, fromCurrency: string, toCurrency: string) => {
  if (!amount || !exchangeRate || !ofxRate || precision === null || precision === undefined || !fromCurrency || !toCurrency) return;

  const ofxAmount = ofxRate * exchangeRate;
  const calculatedOfxRate = exchangeRate - ofxAmount;
  
  const actual = exchangeRate * amount;
  const marked = calculatedOfxRate * amount;
  const cost = actual - marked;

  const actualFormatted = precision !== null && precision !== undefined ? actual.toFixed(precision) : actual;
  const markedFormatted = precision !== null && precision !== undefined ? marked.toFixed(precision) : marked;
  const costFormatted = precision !== null && precision !== undefined ? cost.toFixed(precision) : cost;

  if (actualFormatted === 'NaN' || markedFormatted === 'NaN' || costFormatted === 'NaN') return;

  return { tradeCost: `${amount} ${fromCurrency}`, tradeValue: `${actualFormatted} ${toCurrency}`, tradeValueReceived: `${markedFormatted} ${toCurrency}`, cost: `${costFormatted} ${toCurrency}` };
};
