import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function carregarMaisPosts(): void {
    fetch(
      `${nextPage}&access_token=${process.env.NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN}`
    )
      .then(res => res.json())
      .then((data: ApiSearchResponse) => {
        setPosts([...posts, ...data.results]);
        setNextPage(data.next_page);
      });
  }

  return (
    <main className={commonStyles.contentContainer}>
      <section className={styles.contentLogo}>
        <img src="/images/logo.svg" alt="Logo da Aplicação" />
      </section>
      <section>
        {posts.map(post => (
          <div className={commonStyles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <h2>{post.data.title}</h2>
            </Link>
            <p>{post.data.subtitle}</p>
            <div className={commonStyles.postInfo}>
              <time>
                <img src="/images/calendar.svg" alt="Icone calendário" />
                {post.first_publication_date}
              </time>
              <span>
                <img src="/images/user.svg" alt="Icone pessoa" />
                {post.data.author}
              </span>
            </div>
          </div>
        ))}
        {nextPage && (
          <button
            onClick={carregarMaisPosts}
            className={styles.carregarMaisPosts}
            type="button"
          >
            Carregar mais posts
          </button>
        )}
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'documento_desafio')],
    {
      fetch: [
        'documento_desafio.title',
        'documento_desafio.subtitle',
        'documento_desafio.author',
      ],
      pageSize: 2,
      page: 1,
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: response.results.map(result => {
          return {
            uid: result.uid,
            first_publication_date: format(
              new Date(result.first_publication_date),
              'd LLL yyyy',
              {
                locale: ptBR,
              }
            ),
            data: result.data,
          };
        }),
      },
    },
  };
};
