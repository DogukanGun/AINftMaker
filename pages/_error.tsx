import { GetServerSideProps, GetServerSidePropsContext } from 'next';

type ErrorPageProps = {
  statusCode: number;
};

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode }) => {
  return (
    <div>
      <h1>Error {statusCode}</h1>
      <p>Sorry, an error occurred.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ErrorPageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { res } = context;
  const statusCode = res?.statusCode || 404;
  return { props: { statusCode } };
};

export default ErrorPage;
