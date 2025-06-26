'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store, persistor, useAppSelector } from '@/lib/store'
import { PersistGate } from 'redux-persist/integration/react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

function ThemeWrapper({ children }: { children: ReactNode }) {
  const mode = useAppSelector(s => s.theme) // get theme from redux
  const theme = createTheme({
    palette: {
      mode, // 'light' | 'dark'
    },
  })

  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </PersistGate>
    </Provider>
  )
}
