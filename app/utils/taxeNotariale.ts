import { getExchangeRate } from "./exchangeRate";

interface TaxeNotarialeParams {
  pretEuro: number;
  tipCredit: "Noua Casă" | "ipotecar" | "fara credit";
  valoareCredit: number;
  timpDetinere: number;
  tipPersoana: "fizica" | "juridica";
}

interface TaxeNotarialeResult {
  totalVanzator: number;
  totalCumparator: number;
  detaliiVanzator: {
    impozitStat: number;
    taxaExtrasCarteNormala: number;
  };
  detaliiCumparator: {
    onorariuNotarial: number;
    tarifIntabulare: number;
    taxaIntabulareIpoteca?: number;
  };
}

export async function calculateTaxeNotariale(params: TaxeNotarialeParams): Promise<TaxeNotarialeResult> {
  const { pretEuro, tipCredit, valoareCredit, timpDetinere, tipPersoana } = params;

  // Get the current exchange rate
  const exchangeRate = await getExchangeRate();
  if (!exchangeRate) {
    throw new Error("Failed to get exchange rate");
  }

  const pretLei = pretEuro * exchangeRate.rate;

  // Calculate notary fee
  let onorariuNotarial = calculateOnorariuNotarial(pretLei);
  if (tipCredit === "Noua Casă") {
    onorariuNotarial *= 0.7; // 30% reduction for "Noua Casă"
  }

  // Calculate state tax
  const impozitStat = pretLei * (timpDetinere < 3 ? 0.03 : 0.01);

  // ANCPI fees
  const taxaExtrasCarteNormala = 40; // Normal regime

  // Registration fee
  const tarifIntabulare = pretLei * (tipPersoana === "fizica" ? 0.0015 : 0.005);

  // Mortgage registration fee (if applicable)
  let taxaIntabulareIpoteca = 0;
  if (tipCredit === "ipotecar" || tipCredit === "Noua Casă") {
    taxaIntabulareIpoteca = 100 + valoareCredit * 0.001;
  }

  // Calculate totals
  const totalVanzator = impozitStat + taxaExtrasCarteNormala;
  const totalCumparator = onorariuNotarial + tarifIntabulare + taxaIntabulareIpoteca;

  return {
    totalVanzator: Math.round(totalVanzator * 100) / 100,
    totalCumparator: Math.round(totalCumparator * 100) / 100,
    detaliiVanzator: {
      impozitStat: Math.round(impozitStat * 100) / 100,
      taxaExtrasCarteNormala,
    },
    detaliiCumparator: {
      onorariuNotarial: Math.round(onorariuNotarial * 100) / 100,
      tarifIntabulare: Math.round(tarifIntabulare * 100) / 100,
      ...(taxaIntabulareIpoteca > 0 && { taxaIntabulareIpoteca: Math.round(taxaIntabulareIpoteca * 100) / 100 }),
    },
  };
}

function calculateOnorariuNotarial(valoareLei: number): number {
  if (valoareLei <= 20000) return Math.max(valoareLei * 0.022, 230);
  if (valoareLei <= 35000) return 440 + (valoareLei - 20000) * 0.019;
  if (valoareLei <= 65000) return 725 + (valoareLei - 35000) * 0.016;
  if (valoareLei <= 100000) return 1205 + (valoareLei - 65000) * 0.015;
  if (valoareLei <= 200000) return 1705 + (valoareLei - 100000) * 0.011;
  if (valoareLei <= 600000) return 2805 + (valoareLei - 200000) * 0.009;
  return 6405 + (valoareLei - 600000) * 0.006;
}