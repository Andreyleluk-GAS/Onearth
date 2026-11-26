import { TransformerCalculationInput, TransformerCalculationResult } from './types';
import { calculateOilTransformer } from './oilTransformerCalculator';
import { calculateDryTransformer } from './dryTransformerCalculator';
import { DEFAULT_PRICING_CONFIG, PricingRates } from './pricingConfig';

export * from './types';
export * from './pricingConfig';
export * from './promptParser';
export * from './dxfGenerator';
export * from './cadEngineApi';

export function calculateTransformer(
  input: TransformerCalculationInput,
  pricing: PricingRates = DEFAULT_PRICING_CONFIG
): TransformerCalculationResult {
  if (input.type === 'dry') {
    return calculateDryTransformer(input, pricing);
  }
  return calculateOilTransformer(input, pricing);
}
