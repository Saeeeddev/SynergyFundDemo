// Chart design-token values — must stay in sync with design-tokens.css [D §12].
// Referenced by all four chart wrappers; never use raw hex in components.

/** Pinned hex values matching the :root variables in design-tokens.css */
export const CHART_COLORS = {
  green: '#435144',                        // --green-base (primary series, area line)
  greenDeep: '#354236',                    // --green-deep
  greenGradTop: 'rgba(67,81,68,.15)',      // area-chart fill — top of gradient
  greenGradBot: 'rgba(67,81,68,0)',        // area-chart fill — bottom (transparent)

  blue: '#243344',                         // --blue-base (benchmark series)
  blueSoft: '#2C3D50',                     // --blue-soft

  gold: '#D5AB0D',                         // --gold-soft  (bar / energy identity)
  goldBase: '#BB970D',                     // --gold-base  (bar hover)
  goldDeep: '#A1810A',                     // --gold-deep

  purple: '#5E2C72',                       // --purple-base
  gray: '#666565',                         // --gray-base

  red: '#802922',                          // --red-base (negative / below-benchmark)

  border: '#ECEAE9',                       // --border (gridlines, tooltip border)
  textSubtle: '#73736F',                   // --text-subtle (axis labels, captions)
  text: '#03080E',                         // --text (primary)
  surface: '#FFFFFF',                      // --surface (light tooltip bg)

  surfaceDark: '#03080E',                  // --black-deep  (dark multi-series tooltip bg)
  surfaceDark2: '#30322F',                 // --black-base  (dark tooltip border)
} as const

/**
 * Categorical color order for Donut / multi-series charts [D §10]:
 * Green → Blue → Gold → Purple → Gray
 */
export const CATEGORICAL_COLORS: readonly string[] = [
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.gold,
  CHART_COLORS.purple,
  CHART_COLORS.gray,
]

export const CHART_FONT = '"Yekan Bakh", Tahoma, Arial, sans-serif'
