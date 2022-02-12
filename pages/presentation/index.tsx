import { useEffect, useRef, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import io from 'socket.io-client';
import { Button, Spacer, Text } from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';

import styles from './PresentationPage.module.css';
import { SocketEvent } from '../../models/SocketEvent';
import localDataService from '../../services/localDataService';
import Slide from '../../components/Slide/Slide';
import { FormValue } from '../../models/FormValue';
import { CookieKey } from '../../models/CookieKey';
import { buildUserIdCookie } from '../../helpers/buildCookie';
import { IMAGE_HOST, screenMapping } from '../../config/config';
import { AnalyticsData } from '../../models/AnalyticsData';
import { SocketEventData } from '../../models/SocketEventData';
import analyticsService from '../../services/analyticsService';

interface IPresentationPageProps {
  initialScreen: number;
  isAdmin: boolean;
  userId: string;
  analyticsData: AnalyticsData | null;
  individualAnalyticsData: AnalyticsData | null;
}

const DynamicAnalyticsComponent = dynamic(
  () => import('../../components/Analytics/Analytics'),
  { ssr: false },
);

const PresentationPage: NextPage<IPresentationPageProps> = ({
  initialScreen,
  isAdmin,
  userId,
  analyticsData,
  individualAnalyticsData,
}) => {
  const [screenNumber, setScreenNumber] = useState(initialScreen);
  const [formValue, setFormValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localAnalyticsData, setLocalAnalyticsData] = useState(analyticsData);
  const [localIndividualAnalyticsData, setLocalIndividualAnalyticsData] =
    useState(individualAnalyticsData);
  const socketClient = useRef<ReturnType<typeof io>>();
  const formValueRef = useRef(formValue);
  const screenNumberRef = useRef(screenNumber);
  formValueRef.current = formValue;
  screenNumberRef.current = screenNumber;

  useEffect(() => {
    fetch('/api/ws').finally(() => {
      socketClient.current = io();

      socketClient.current?.on('connect', () => {
        console.log('connected');
      });

      socketClient.current?.on(
        SocketEvent.ReceiveUpdateCount,
        (count: number) => {
          setIsProcessing(true);

          if (formValueRef.current) {
            socketClient.current?.emit(SocketEvent.SaveResponse, {
              questionId: screenNumberRef.current,
              userId,
              answer: formValueRef.current,
            });
          }

          setTimeout(() => {
            setFormValue('');
            setScreenNumber(Number(count));
            setIsProcessing(false);
          }, 500);
        },
      );

      socketClient.current?.on(
        SocketEvent.ReceiveAnalyticsData,
        (msg: SocketEventData[SocketEvent.ReceiveAnalyticsData]) => {
          setLocalAnalyticsData(msg);
          socketClient.current?.emit(SocketEvent.PrepareIndividualResults);
        },
      );

      socketClient.current?.on(
        SocketEvent.ReceiveIndividualAnalyticsData,
        (msg: SocketEventData[SocketEvent.ReceiveIndividualAnalyticsData]) => {
          setLocalIndividualAnalyticsData(msg);
        },
      );

      // TODO: on receive results - show results. Show spinner before

      socketClient.current?.on('disconnect', () => {
        console.log('disconnected');
      });
    });
  }, []);

  function handleNextButtonClick() {
    const confirm = window.confirm('Are you sure to go to the next slide?');

    if (!confirm) return;

    const nextCount = Number(screenNumber) + 1;
    setScreenNumber(nextCount);
    socketClient.current?.emit(SocketEvent.UpdateCount, nextCount);

    if (nextCount > Object.keys(screenMapping).length) {
      setTimeout(() => {
        socketClient.current?.emit(SocketEvent.PrepareResults);
      }, 2000);
    }
  }

  function handleResetButtonClick() {
    const confirm = window.confirm('Are you sure to start from the beginning?');

    if (!confirm) return;

    const nextCount = 1;
    setScreenNumber(nextCount);
    socketClient.current?.emit(SocketEvent.UpdateCount, nextCount);
  }

  const screenData = screenMapping[screenNumber];
  const screenEntries = Object.entries(screenMapping);
  const totalScreenCount = screenEntries.length;
  const finalScreen = screenNumber > totalScreenCount;

  // TODO: custom prepare analytics button

  function renderResult() {
    if (!finalScreen) {
      return (
        <Slide
          key={screenNumber}
          id={screenNumber}
          title={screenData.title}
          subTitle={screenData.subTitle}
          imageSrc={`${IMAGE_HOST}${screenData.imageSrc}`}
          formValue={formValue}
          onFormChange={(value: FormValue) => setFormValue(value)}
          isLoading={isProcessing}
          isDisabled={isAdmin}
        />
      );
    }

    if (localAnalyticsData) {
      return (
        <DynamicAnalyticsComponent
          data={localAnalyticsData}
          individualData={localIndividualAnalyticsData}
        />
      );
    }

    return <div>Waiting for results</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Very hot keys</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href={IMAGE_HOST} />
        {screenEntries
          .slice(screenNumber, screenNumber + 3)
          .map(([key, value]) => (
            <link
              key={key}
              rel="prefetch"
              href={IMAGE_HOST + value.imageSrc}
              as="image"
            />
          ))}
      </Head>

      <main className={styles.main}>
        {isAdmin && (
          <Button.Group color="secondary">
            <Button onClick={handleResetButtonClick}>⇦⇦⇦</Button>
            <Button onClick={handleNextButtonClick}>⇨</Button>
            <Spacer x={2} />
            <Text>
              {finalScreen
                ? 'Results'
                : `${screenNumber} / ${screenEntries.length}`}
            </Text>
          </Button.Group>
        )}
        <Spacer y={2} />
        {renderResult()}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  IPresentationPageProps
> = async ({ req, res }) => {
  const userId = req.cookies[CookieKey.UserId] ?? uuidv4();
  const isAdmin = userId === process.env.ADMIN_TOKEN;
  const initialScreen = localDataService.getCount();

  let analyticsData: AnalyticsData | null = null;
  let individualAnalyticsData: AnalyticsData | null = null;

  res.setHeader(
    'Set-Cookie',
    buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
  );

  if (initialScreen > Object.keys(screenMapping).length) {
    analyticsData = localDataService.getAnalytics();
    const rawInputData = localDataService.getRawInputData();

    // TODO: show top users!!!

    if (rawInputData && !isAdmin) {
      individualAnalyticsData = analyticsService.prepareIndividual(
        rawInputData,
        userId,
      );
    }
  }

  return {
    props: {
      initialScreen,
      isAdmin,
      userId,
      analyticsData,
      individualAnalyticsData,
    },
  };
};

export default PresentationPage;