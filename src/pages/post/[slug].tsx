import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  console.log(post);
  return (
    <>
      <Header />
      <img src="/images/Banner.png" alt="imagem post" />
      <main className={`${commonStyles.contentContainer} ${styles.main}`}>
        <div className={`${commonStyles.post} ${styles.post}`}>
          <h2>Criando um app CRA do zero</h2>
          <div className={commonStyles.postInfo}>
            <time>
              <img src="/images/calendar.svg" alt="Icone calendário" />
              15 Mar 2021
            </time>
            <span>
              <img src="/images/user.svg" alt="Icone pessoa" />
              Joseph Oliveira
            </span>
            <span>
              <img src="/images/clock.svg" alt="Icone relogio" /> 4 min
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  // TODO

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'documento_desafio',
    String(slug),
    {}
  );

  return {
    props: {
      post: response,
    },
  };
};
