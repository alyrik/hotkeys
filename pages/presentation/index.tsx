import React, { useEffect, useRef, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import io from 'socket.io-client';
import {
  Button,
  Container,
  Loading,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';

import styles from './PresentationPage.module.css';
import { SocketEvent } from '@/models/SocketEvent';
import localDataService from '@/services/localDataService';
import Slide from '@/components/Slide/Slide';
import { FormValue } from '@/models/FormValue';
import { buildUserIdCookie } from '@/helpers/buildCookie';
import { IMAGE_HOST, screenMapping } from '@/config/config';
import { AnalyticsData } from '@/models/AnalyticsData';
import { SocketEventData } from '@/models/SocketEventData';
import analyticsService from '@/services/analyticsService';
import { CookieKey } from '@/config/cookies';

interface IPresentationPageProps {
  initialScreen: number;
  isAdmin: boolean;
  userId: string;
  analyticsData: AnalyticsData | null;
  individualAnalyticsData: AnalyticsData[] | null;
  userPlace: number | null;
}

const DynamicAnalyticsComponent = dynamic(
  () => import('../../components/Analytics/Analytics'),
  { ssr: false },
);
const DynamicCustomCountdownComponent = dynamic(
  () => import('../../components/CustomCountdown/CustomCountdown'),
  { ssr: false },
);

const PresentationPage: NextPage<IPresentationPageProps> = ({
  initialScreen,
  isAdmin,
  userId,
  analyticsData,
  individualAnalyticsData,
  userPlace,
}) => {
  const [screenNumber, setScreenNumber] = useState(initialScreen);
  const [formValue, setFormValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localAnalyticsData, setLocalAnalyticsData] = useState(analyticsData);
  const [localIndividualAnalyticsData, setLocalIndividualAnalyticsData] =
    useState(individualAnalyticsData);
  const [localUserPlace, setLocalUserPlace] = useState(userPlace);

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

          const nextCount = Number(count);

          if (formValueRef.current && nextCount > 0) {
            socketClient.current?.emit(SocketEvent.SaveResponse, {
              questionId: screenNumberRef.current,
              userId,
              answer: formValueRef.current,
            });
          }

          setTimeout(() => {
            setFormValue('');
            setScreenNumber(nextCount);
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

      socketClient.current?.on(
        SocketEvent.ReceiveUserPlace,
        (msg: SocketEventData[SocketEvent.ReceiveUserPlace]) => {
          setLocalUserPlace(msg);
        },
      );

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

    const nextCount = 0;
    setScreenNumber(nextCount);
    socketClient.current?.emit(SocketEvent.UpdateCount, nextCount);
  }

  const screenData = screenMapping[screenNumber];
  const screenEntries = Object.entries(screenMapping);
  const totalScreenCount = screenEntries.length;
  const isFinalScreen = screenNumber > totalScreenCount;

  // TODO: custom prepare analytics button
  function renderResult() {
    if (screenNumber === 0) {
      return (
        <Container style={{ padding: 0 }}>
          <Row>
            <Text
              h1
              size={56}
              css={{
                textGradient: '45deg, $blue300 -30%, $pink700 60%',
                letterSpacing: '$normal',
              }}
              weight="bold">
              Coming in
            </Text>
          </Row>
          <Row>
            <DynamicCustomCountdownComponent />
          </Row>
        </Container>
      );
    }

    if (!isFinalScreen) {
      return (
        <Slide
          key={screenNumber}
          id={screenNumber}
          slideNumber={`${screenNumber} / ${screenEntries.length}`}
          title={screenData.title}
          subTitle={screenData.subTitle}
          imageSrc={`${IMAGE_HOST}${screenData.imageSrc}`}
          formValue={formValue}
          onFormChange={(value: FormValue) => setFormValue(value)}
          isLoading={isProcessing}
          isDisabled={isAdmin}
          shouldIndicateSuccess={true}
        />
      );
    }

    if (localAnalyticsData) {
      return (
        <DynamicAnalyticsComponent
          data={localAnalyticsData}
          individualData={
            isAdmin ? null : localIndividualAnalyticsData?.[0] ?? null
          }
          topUsersData={isAdmin ? localIndividualAnalyticsData : null}
          userPlace={localUserPlace}
        />
      );
    }

    return (
      <Container
        style={{ padding: 0, paddingTop: 100 }}
        display="flex"
        justify="center">
        <Row justify="center">
          <Loading color="primary" size="xl" />
        </Row>
      </Container>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
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
      <section className={styles.main}>
        {isAdmin && (
          <Button.Group color="secondary">
            <Button onClick={handleResetButtonClick}>⇦⇦⇦</Button>
            <Button onClick={handleNextButtonClick}>⇨</Button>
            <Spacer x={2} />
            <Text>
              {isFinalScreen
                ? 'Results'
                : `${screenNumber} / ${screenEntries.length}`}
            </Text>
          </Button.Group>
        )}
        <Spacer y={2} />
        {renderResult()}
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  IPresentationPageProps
> = async ({ req, res, query }) => {
  const letMeInValue = query.letMeIn;
  const initialUserId = req.cookies[CookieKey.UserId];
  const userId = initialUserId ?? letMeInValue ?? uuidv4();
  const isAdmin = userId === process.env.ADMIN_TOKEN;
  const initialScreen = localDataService.getCount();

  let analyticsData: AnalyticsData | null = null;
  let individualAnalyticsData: AnalyticsData[] | null = null;
  let userPlace: number | null = null;

  if (!initialUserId) {
    res.setHeader(
      'Set-Cookie',
      buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
    );
  }

  if (initialScreen > Object.keys(screenMapping).length) {
    analyticsData = localDataService.getAnalytics();
    const rawInputData = localDataService.getRawInputData();

    if (rawInputData) {
      const topUsersData = analyticsService.prepareTopUsers(rawInputData);

      if (isAdmin) {
        individualAnalyticsData = topUsersData.data;
      } else {
        const individualData = analyticsService.prepareIndividual(
          rawInputData,
          userId,
        );
        individualAnalyticsData = individualData ? [individualData] : null;
      }

      userPlace = analyticsService.findUserPlace(topUsersData.userIds, userId);
    }
  }

  return {
    props: {
      initialScreen,
      isAdmin,
      userId,
      analyticsData,
      individualAnalyticsData,
      userPlace,
    },
  };
};

export default PresentationPage;
