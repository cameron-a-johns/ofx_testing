export const calculateTradeValues = (amount, exchangeRate, ofxRate, precision = 2) => {
  if (!amount) return;

  const ofxAmount = ofxRate * exchangeRate;
  const calculatedOfxRate = exchangeRate - ofxAmount;

  const actual = (exchangeRate * amount).toFixed(precision);
  const marked = (calculatedOfxRate * amount).toFixed(precision);

  return { actual, marked };
};
