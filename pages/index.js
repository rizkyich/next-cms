import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import MainLayout from '../components/MainLayout'
import {WriteButton} from '../components/WriteButton'


const ArticleThumbnail = ({article}) => {
  console.log(article)
  return (
    <div className="my-8 w-full flex h-48"> 
      <img className="w-3/12 shadow-xl" src={article.img_url} alt={article.img_name}/>
      <div className="w-6/12 px-4 h-full">
        <h4 className="text-lg mb-2 font-semibold">{article.title}</h4>
        <p>{article.subtitle}</p>
      </div>
    </div>
  )
}

export default function Home({res}) {
  const {arr_article} = res

  const router = useRouter()
  const [higoId, setHigoId] = useState(null)

  useEffect(() => {
    const key = sessionStorage.getItem('bl-002-key')

    if (key) {
      return
    } else {
      router.push('/login')
    }
  });

  return (
    <>
      <MainLayout back={false}>
        <WriteButton/>
        <div className="w-full px-12 h-20">
          {
            arr_article.map(article => (
              <ArticleThumbnail key={article.id} article={article}/>
            ))
          }
        </div>
      </MainLayout>
    </>
  )
}

export const getStaticProps = async () => {
  const res = await fetch('https://apiw.higo.id/adminblog-listdraftarticle',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  console.log(res)
  const json = await res.json()
  return {props: {res:json}}
}
