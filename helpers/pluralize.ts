export const pluralize = (
  count: number,
  variants: {
    one: string;
    other: string;
    zero?: string;
    two?: string;
    few?: string;
    many?: string;
  },
) => variants[new Intl.PluralRules('en-GB').select(count)] ?? variants.other;
