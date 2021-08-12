import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

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
  return (
    <main className={styles.contentContainer}>
      <section className={styles.contentLogo}>
        <img src="/images/logo.svg" alt="Logo da Aplicação" />
      </section>
      <section>
        <div className={styles.post}>
          <h2>Como utilizar Hooks</h2>
          <p>Pensando em sincronização em vez de ciclos de via</p>
          <div className={styles.postInfo}>
            <time>
              <img src="/images/calendar.svg" alt="Icone calendário" />
              15 Mar 2021
            </time>
            <span>
              <img src="/images/user.svg" alt="Icone pessoa" />
              Joseph Oliveira
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // const prismic = getPrismicClient();

  // const response = await prismic.query(
  //   [Prismic.predicates.at('document.type', 'documento_desafio')],
  //   {
  //     fetch: ['documento_desafio.title', 'documento_desafio.subtitle'],
  //     pageSize: 1,
  //   }
  // );

  return {
    props: {
      postsPagination: [],
    },
  };
};
