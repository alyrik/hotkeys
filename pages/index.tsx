import { useEffect, useRef, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import io from 'socket.io-client';
import { Button, Spacer, Text } from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';

import styles from '../styles/Home.module.css';
import { SocketEvent } from '../models/SocketEvent';
import localDataService from '../services/localDataService';
import Slide from '../components/Slide/Slide';
import { FormValue } from '../models/FormValue';
import { CookieKey } from '../models/CookieKey';
import { buildUserIdCookie } from '../helpers/buildCookie';

const IMAGE_HOST = 'https://d1l6237ra2ufh4.cloudfront.net/';
const SHIFT_NOTE = '+ Shift to enable Selection';

const screenMapping: Record<
  number,
  { imageSrc: string; title: string; subTitle?: string }
> = {
  1: {
    imageSrc: 'Move+Caret+to+Previous%3ANext+Word.gif',
    title: 'Move Caret to Previous/Next Word',
    subTitle: SHIFT_NOTE,
  },
  2: {
    imageSrc: 'Move+Caret+to+Line+Start%3AEnd.gif',
    title: 'Move Caret to Line Start/End',
    subTitle: SHIFT_NOTE,
  },
  3: {
    imageSrc: 'Select+Single+Line+at+Caret.gif',
    title: 'Select Single Line at Caret',
  },
  4: {
    imageSrc: 'Extend%3AShrink+Selection.gif',
    title: 'Extend/Shrink Selection',
  },
  5: {
    imageSrc: 'Add%3ARemove+Selection+for+Next+Occurrence.gif',
    title: 'Add/Remove Selection for Next Occurrence',
  },
  6: {
    imageSrc: 'Delete+Line.gif',
    title: 'Delete Line',
  },
  7: {
    imageSrc: 'Duplicate+Line+or+Selection.gif',
    title: 'Duplicate Line or Selection',
  },
  8: {
    imageSrc: 'Undo%3ARedo.gif',
    title: 'Undo/Redo',
  },
  9: {
    imageSrc: 'Start+New+Line.gif',
    title: 'Start New Line',
  },
  10: {
    imageSrc: 'Indent%3AUnindent+Line+or+Selection.gif',
    title: 'Indent/Unindent Line or Selection',
  },
};

interface IHomePageProps {
  initialCount: number;
  isAdmin: boolean;
  userId: string;
}

const Home: NextPage<IHomePageProps> = ({ initialCount, isAdmin, userId }) => {
  const [screenNumber, setScreenNumber] = useState(initialCount);
  const [formValue, setFormValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
              {screenNumber} / {screenEntries.length}
            </Text>
          </Button.Group>
        )}
        <Spacer y={2} />
        {screenNumber <= totalScreenCount ? (
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
        ) : (
          'RESULTS'
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<IHomePageProps> = async ({
  req,
  res,
}) => {
  const userId = req.cookies[CookieKey.UserId] ?? uuidv4();
  const isAdmin = userId === process.env.ADMIN_TOKEN;

  res.setHeader(
    'Set-Cookie',
    buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
  );

  // TODO: fetch results if localDataService.getCount() > totalCount

  return {
    props: {
      initialCount: localDataService.getCount(),
      isAdmin,
      userId,
    },
  };
};

export default Home;
