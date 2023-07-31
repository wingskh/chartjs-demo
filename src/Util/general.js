export const convertStringToPriceFormat = (priceString) => {
  const number = parseFloat(priceString);
  const formattedPrice = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `¥ ${formattedPrice}`;
}

export const parseToDouble = (stringValue) => {
  const parsedValue = parseFloat(stringValue);
  return parsedValue;
}