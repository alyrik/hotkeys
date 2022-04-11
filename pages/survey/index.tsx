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

import styles from './SurveyPage.module.css';
import Slide from '@/components/Slide/Slide';
import { FormValue } from '@/models/FormValue';
import { CookieKey } from '@/models/CookieKey';
import {
  buildScreenNumberCookie,
  buildUserIdCookie,
} from '@/helpers/buildCookie';
import { IMAGE_HOST, screenMapping } from '@/config/config';
import { useSaveIndividualAnswer } from '@/mutations/hooks/useSaveIndividualAnswer';
import { useGetIndividualResults } from '@/queries/hooks/useGetIndividualResults';
import { AnalyticsData } from '@/models/AnalyticsData';
import dynamic from 'next/dynamic';

interface ISurveyPageProps {
  screenNumber: number;
  userId: string;
}

const DynamicAnalyticsComponent = dynamic(
  () => import('../../components/Analytics/Analytics'),
  { ssr: false },
);

const prepareAnalyticsData = (data: FormValue[]) => {
  return data?.reduce<AnalyticsData>(
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

  const { isLoading: isIndividualResultsLoading, data } =
    useGetIndividualResults({
      enabled: isFinalScreen,
    });
  const { mutate: saveIndividualAnswer, isLoading } = useSaveIndividualAnswer();

  const preparedIndividualData = prepareAnalyticsData(data);

  // TODO: custom prepare analytics button

  function handleStartButtonClick() {
    setCurrentScreenNumber(1);
  }

  function handleSubmitButtonClick() {
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

    const nextCount = Number(currentScreenNumber) - 1;
    setCurrentScreenNumber(nextCount);
  }

  // TODO: save cookie?
  function handleResetButtonClick() {
    const confirm = window.confirm('Are you sure to start from the beginning?');

    if (!confirm) return;

    const nextCount = 1;
    setCurrentScreenNumber(nextCount);
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
          {currentScreenNumber > 0 && (
            <>
              <Row justify="space-between">
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
          )}
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
    }

    if (preparedIndividualData) {
      return (
        <DynamicAnalyticsComponent
          data={null}
          individualData={preparedIndividualData}
          topUsersData={null}
          userPlace={null}
          isIndiviualView={true}
        />
      );
    }
  }

  // TODO: Restart button

  return (
    <div className={styles.container}>
      <Head>
        <title>Very hot keys</title>
        {/*TODO*/}
        <meta
          name="description"
          content="Must-use hotkeys for every programmer: assess your productivity!"
        />
        {/*TODO*/}
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href={IMAGE_HOST} />
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
  const initialScreenNumber = Number(req.cookies[CookieKey.ScreenNumber]); // TODO: use expirable user cookie to define screen
  const userId = initialUserId ?? uuidv4();
  const screenNumber = initialScreenNumber || 0;

  if (!initialUserId) {
    res.setHeader(
      'Set-Cookie',
      buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
    );
  }

  if (isNaN(initialScreenNumber) || initialScreenNumber === 0) {
    res.setHeader(
      'Set-Cookie',
      buildScreenNumberCookie(
        screenNumber,
        process.env.NODE_ENV === 'production',
      ),
    );
  }

  return {
    props: {
      screenNumber,
      userId,
    },
  };
};

export default SurveyPage;
