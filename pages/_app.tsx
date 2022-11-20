

import '../styles/globals.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AppProps } from 'next/app'
import { useUserChanged } from '../hooks/useUserChanged'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { Hydrate } from 'react-query/hydration'

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useUserChanged()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            //デフォルトで取得に失敗した場合は3回までリトライする
            retry: false,
            // 画面にフォーカスした際にデータを取得（過剰なフェッチ）
            refetchOnWindowFocus: false,
          },
        },
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {/* pageProps.dehydratedStateはindex.jsonのデータが渡される */}
      <Hydrate state={pageProps.dehydratedState}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp