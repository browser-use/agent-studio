// Utility to check UI mode from environment variables
export const getUIMode = () => {
  return process.env.NEXT_PUBLIC_UI_MODE || 'advanced'
}

export const isSimpleMode = () => {
  return getUIMode() === 'simple'
}

export const isAdvancedMode = () => {
  return getUIMode() === 'advanced'
} 