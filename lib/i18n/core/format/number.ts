import type { NumberDeclensionRule } from '../types'

export function formatNumber(number: number, numberFormat: string, options?: Intl.NumberFormatOptions) {
  return number.toLocaleString(numberFormat, options)
}

export function declineForNumber(text: string, formsString: string, value: any, numberDeclensionRule: NumberDeclensionRule) {
  const forms = formsString.split('|')
  const i = numberDeclensionRule(forms, value)

  if (i > forms.length || typeof value !== 'number')
    return { text }

  const form = forms[i]

  text = text.replaceAll(`(${formsString})`, form)
  return { text, form }
}
