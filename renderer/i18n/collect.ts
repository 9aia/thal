type Values = Record<string, any>;

export const collected: Record<string, Values> = {};

function collect(text: string, values?: Values) {
  collected[text] = values || {};
}

export default collect;
