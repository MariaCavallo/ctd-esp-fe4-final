import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from "@mui/material";
import LayoutGeneral from "../components/layouts/layout-general";
import { theme } from "../styles/material-theme";
import { useRouter } from 'next/router';
import LayoutCheckout from 'src/components/layouts/layout-checkout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isCheckoutPage = router.pathname.includes('/checkout') || router.pathname.includes('/confirmacion-compra')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isCheckoutPage ? (
        <LayoutCheckout>
          <Component {...pageProps} />
        </LayoutCheckout>
      ) : (
        <LayoutGeneral>
          <Component {...pageProps} />
        </LayoutGeneral>  
      )}
      <style jsx global>
        {`#__next {
                height: 100%;
              }
        `}
      </style>
    </ThemeProvider>
  )
}

export default MyApp
