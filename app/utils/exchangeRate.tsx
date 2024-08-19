import axios from "axios";
import { parseStringPromise } from "xml2js";

const getExchangeRate = async () => {
  const url = '/api/exchangeRate'; // Use the proxy endpoint

  try {
    const response = await axios.get(url);
    console.log('XML Response:', response.data); // Log the raw XML response

    const result = await parseStringPromise(response.data);
    console.log('Parsed Result:', JSON.stringify(result, null, 2)); // Log the parsed result

    const rate = result.DataSet.Body[0].Cube[0].Rate.find(
      (r: any) => r.$.currency === 'EUR'
    )._;

    console.log('EUR Rate:', rate); // Log the EUR rate

    return {
      currency: 'EUR',
      rate: parseFloat(rate),
    };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

export { getExchangeRate };
