export interface TransformerSpec {
  power_kva: number;
  voltage_hv_str: string;
  voltage_lv_str: string;
  connection_group: string;
  p0_w: number;
  pkz_f_w?: number;
  pkz_h_w?: number;
  pkz_w?: number;
  i0_pct: number;
  uk_pct: number;
}

export type InsulationType = 'cast_resin' | 'air_barrier' | 'oil';
export type LossClass = 'standard' | 'low_loss';

export interface TransformerCategory {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  voltageClass: '10' | '20' | '35';
  insulationType: InsulationType;
  lossClass: LossClass;
  voltageHV: string;
  voltageLV: string;
  connectionGroup: string;
  regulationType: string;
  description: string;
  applicationArea?: string;
  tableType: 'dry_f_h' | 'dry_h' | 'oil';
  specs: TransformerSpec[];
  standardEquipment: string[];
  options: string[];
  image: string;
}

export interface QuoteRequestData {
  categorySlug: string;
  categoryTitle: string;
  powerKva: number | string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  comment?: string;
}
