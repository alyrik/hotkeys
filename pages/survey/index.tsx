import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {
  Button,
  Container,
  Loading,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

import styles from './SurveyPage.module.css';
import Slide from '@/components/Slide/Slide';
import { FormValue } from '@/models/FormValue';
import {
  buildScreenNumberCookie,
  buildUserIdCookie,
} from '@/helpers/buildCookie';
import { IMAGE_HOST, screenMapping } from '@/config/config';
import { useSaveIndividualAnswer } from '@/mutations/hooks/useSaveIndividualAnswer';
import { useGetIndividualResults } from '@/queries/hooks/useGetIndividualResults';
import { AnalyticsData } from '@/models/AnalyticsData';
import dynamic from 'next/dynamic';
import { CookieKey, cookieTtl } from '@/config/cookies';

interface ISurveyPageProps {
  screenNumber: number;
  userId: string;
}

const DynamicAnalyticsComponent = dynamic(
  () => import('../../components/Analytics/Analytics'),
  { ssr: false, loading: () => <ResultsLoadingView /> },
);

const ResultsLoadingView = () => (
  <Container
    style={{ padding: 0, paddingTop: 20 }}
    display="flex"
    justify="center">
    <Text
      h2
      size={24}
      css={{
        textGradient: '45deg, $blue500 -20%, $pink500 50%',
      }}
      weight="bold">
      Preparing your results...
    </Text>
    <Spacer y={4} />
    <Row justify="center">
      <Loading color="primary" size="xl" />
    </Row>
  </Container>
);

const prepareAnalyticsData = (data: FormValue[]) => {
  if (!data) return;

  return data.reduce<AnalyticsData>(
    (result, item, index) => ({
      ...result,
      [String(index + 1)]: { [item]: 1 },
    }),
    {},
  );
};

const SurveyPage: NextPage<ISurveyPageProps> = ({ screenNumber, userId }) => {
  const [currentScreenNumber, setCurrentScreenNumber] = useState(screenNumber);
  const [formValue, setFormValue] = useState('');

  const screenData = screenMapping[currentScreenNumber];
  const screenEntries = Object.entries(screenMapping);
  const totalScreenCount = screenEntries.length;
  const isFinalScreen = currentScreenNumber > totalScreenCount;

  const {
    isLoading: isIndividualResultsLoading,
    isSuccess: isIndividualResultsSuccess,
    data,
  } = useGetIndividualResults({
    enabled: isFinalScreen,
  });
  const { mutate: saveIndividualAnswer, isLoading } = useSaveIndividualAnswer();

  const preparedIndividualData = prepareAnalyticsData(data);

  if (isFinalScreen && isIndividualResultsSuccess && !preparedIndividualData) {
    saveScreenNumberCookie(1);
  }

  function saveScreenNumberCookie(nextScreenNumber: number) {
    Cookies.set(CookieKey.ScreenNumber, String(nextScreenNumber), {
      expires: cookieTtl[CookieKey.ScreenNumber],
    });
  }

  function handleStartButtonClick() {
    setCurrentScreenNumber(1);
  }

  function handleSubmitButtonClick() {
    if (isLoading) return;

    saveIndividualAnswer(
      {
        questionId: currentScreenNumber,
        answer: formValue,
      },
      {
        onSuccess() {
          setFormValue('');
          setCurrentScreenNumber(currentScreenNumber + 1);
          window.scrollTo({ top: 100, behavior: 'smooth' });
        },
        onError(e) {
          // TODO: render error
        },
      },
    );
  }

  // TODO: save cookie?
  function handlePreviousButtonClick() {
    const confirm = window.confirm('Are you sure to go to the previous slide?');

    if (!confirm) return;

    const nextScreenNumber = Number(currentScreenNumber) - 1;
    saveScreenNumberCookie(nextScreenNumber);
    setCurrentScreenNumber(nextScreenNumber);
  }

  function handleResetButtonClick() {
    const confirm = window.confirm('Are you sure to start from the beginning?');

    if (!confirm) return;

    const nextScreenNumber = 1;
    saveScreenNumberCookie(nextScreenNumber);
    setCurrentScreenNumber(nextScreenNumber);
  }

  function renderFlowControls(withBackButton?: boolean) {
    return (
      <>
        <Row justify={withBackButton ? 'space-between' : 'flex-end'}>
          {withBackButton && (
            <Button
              onClick={handlePreviousButtonClick}
              light={true}
              color="primary"
              size="lg"
              disabled={currentScreenNumber < 2}
              css={{
                paddingLeft: 0,
                paddingRight: 0,
                minWidth: 0,
                textTransform: 'none',
              }}>
              ⇦ Previous slide
            </Button>
          )}
          <Button
            onClick={handleResetButtonClick}
            light={true}
            size="lg"
            disabled={currentScreenNumber < 2}
            color="primary"
            css={{
              paddingLeft: 0,
              paddingRight: 0,
              minWidth: 0,
              textTransform: 'normal',
            }}>
            ⟳ Restart
          </Button>
        </Row>
        <Spacer y={2} />
      </>
    );
  }

  function renderResult() {
    if (currentScreenNumber === 0) {
      return (
        <Container style={{ padding: 0 }}>
          <Row>
            <Button color="gradient" size="xl" onClick={handleStartButtonClick}>
              Take survey!
            </Button>
          </Row>
        </Container>
      );
    }

    if (!isFinalScreen) {
      return (
        <>
          {currentScreenNumber > 0 && renderFlowControls(true)}
          <Slide
            key={currentScreenNumber}
            id={currentScreenNumber}
            slideNumber={`${currentScreenNumber} / ${screenEntries.length}`}
            title={screenData.title}
            subTitle={screenData.subTitle}
            imageSrc={`${IMAGE_HOST}${screenData.imageSrc}`}
            formValue={formValue}
            isLoading={isLoading}
            onFormChange={(value: FormValue) => setFormValue(value)}
          />
          <Spacer y={2} />
          <Button
            color="primary"
            size="xl"
            disabled={!formValue}
            onClick={handleSubmitButtonClick}>
            {isLoading ? <Loading color="white" /> : 'Submit'}
          </Button>
        </>
      );
    }

    if (isIndividualResultsLoading) {
      return (
        <>
          {renderFlowControls()}
          <ResultsLoadingView />
        </>
      );
    }

    if (preparedIndividualData) {
      return (
        <>
          {renderFlowControls()}
          <DynamicAnalyticsComponent
            data={null}
            individualData={preparedIndividualData}
            topUsersData={null}
            userPlace={null}
          />
        </>
      );
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Test your skills: how often do you use this functionality via
          keyboard?
        </title>
        {screenEntries
          .slice(currentScreenNumber, currentScreenNumber + 3)
          .map(([key, value]) => (
            <link
              key={key}
              rel="prefetch"
              href={IMAGE_HOST + value.imageSrc}
              as="image"
            />
          ))}
      </Head>
      <section className={styles.main}>{renderResult()}</section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ISurveyPageProps> = async ({
  req,
  res,
}) => {
  const initialUserId = req.cookies[CookieKey.UserId];
  const initialScreenNumber = Number(req.cookies[CookieKey.ScreenNumber]);
  const userId = initialUserId ?? uuidv4();
  const screenNumber = initialScreenNumber || 1;
  const cookiesToSet = [];

  if (!initialUserId) {
    cookiesToSet.push(
      buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
    );
  }

  if (isNaN(initialScreenNumber) || initialScreenNumber <= 1) {
    cookiesToSet.push(
      buildScreenNumberCookie(
        screenNumber,
        process.env.NODE_ENV === 'production',
      ),
    );
  }

  if (cookiesToSet.length) {
    res.setHeader('Set-Cookie', cookiesToSet);
  }

  return {
    props: {
      screenNumber,
      userId,
    },
  };
};

export default SurveyPage;
