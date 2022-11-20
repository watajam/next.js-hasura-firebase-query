import { Auth } from '../components/Auth'
import { Layout } from '../components/Layout'
import { GetStaticProps } from 'next'
//hydrateはキャッシュを潤す、 dehydrateはキャッシュのデータを取得
import { dehydrate } from 'react-query/hydration'
import { fetchNews } from '../hooks/useQueryNews'
import { News } from '../types/types'
import { QueryClient, useQueryClient } from 'react-query'

export default function Home() {
  //Reactqueryのデータ取得と同じやり方
  //queryClientにHydrateで注入されたデータが格納しているのでqueryClient.getQueryDataでキャッシュのデータを取り出す
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<News[]>('news')

  return (
    <Layout title="Home">
      <p className="mb-5 text-blue-500 text-xl">News list by SSG</p>
      {data?.map((news) => (
        <p className="font-bold" key={news.id}>
          {news.content}
        </p>
      ))}
      <Auth />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  //データ取得してキャッシュに保存
  await queryClient.prefetchQuery('news', fetchNews)
  return {
    props: {
      //dehydrate = prefetchした際のキャッシュのデータを取得してindex.jsonにキャッシュのデータを出力する
      //出力されたJsonファイルはアプリケーションが実行する際にHydrateをつかって読みこむ事ができる
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3,
  }
}