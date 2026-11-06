export type Language = 'ru' | 'en' | 'zh';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  flag: string;
}
