export const convertStringToPriceFormat = (priceString) => {
  const number = parseFloat(priceString.replaceAll(',', ''));
  const formattedPrice = convertFloatToPriceFormat(number)
  return formattedPrice;
}

export const convertFloatToPriceFormat = (price) => {
  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `¥ ${formattedPrice}`;
}

export const parseToDouble = (stringValue) => {
  const parsedValue = parseFloat(stringValue);
  return parsedValue;
}