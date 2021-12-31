import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { formataData } from '../../utils/format';
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
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  console.log(post);
  return (
    <>
      <Header />
      <img src="/images/Banner.png" alt="imagem post" />
      <main className={`${commonStyles.contentContainer} ${styles.main}`}>
        <div className={`${commonStyles.post} ${styles.post}`}>
          <h2>{post.data.title}</h2>
          <div className={commonStyles.postInfo}>
            <time>
              <img src="/images/calendar.svg" alt="Icone calendário" />
              {formataData(post.first_publication_date)}
            </time>
            <span>
              <img src="/images/user.svg" alt="Icone pessoa" />
              {post.data.author}
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
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'documento_desafio')],
    {
      fetch: ['documento_desafio.uid'],
      pageSize: 2,
      page: 1,
    }
  );

  console.log('[getStaticPaths]');

  const paths = posts.results.map(result => {
    return { params: { slug: result.uid } };
  });

  console.log(paths);

  return {
    paths,
    fallback: true,
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
    revalidate: 60,
  };
};
