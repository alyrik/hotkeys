import React, { useRef, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {
  Button,
  Card,
  Container,
  Grid,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import Cookies from 'js-cookie';
import Bugsnag from '@bugsnag/js';
import { HiChevronDoubleLeft, HiRefresh } from 'react-icons/hi';

import styles from './SurveyPage.module.scss';
import Slide from '@/components/Slide/Slide';
import { FormValue } from '@/models/FormValue';
import { buildScreenNumberCookie } from '@/helpers/buildCookie';
import { IMAGE_HOST } from '@/config/config';
import { useSaveIndividualAnswer } from '@/mutations/hooks/useSaveIndividualAnswer';
import { useGetIndividualResults } from '@/queries/hooks/useGetIndividualResults';
import { AnalyticsData } from '@/models/AnalyticsData';
import dynamic from 'next/dynamic';
import { CookieKey, cookieTtl } from '@/config/cookies';
import { themeStyles } from '@/config/theme';
import { screenMapping } from '@/config/screenMapping';
import { prepareTotalValues } from '@/helpers/analytics-converters';
import { getPercentFormatted } from '@/helpers/formatters';

interface ISurveyPageProps {
  screenNumber: number;
  userId: string;
}

type ConfirmModalType = 'previous' | 'restart';

const confirmModalSubmitButtonTexts: Record<ConfirmModalType, string> = {
  previous: 'Previous slide',
  restart: 'Restart',
};

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
        textGradient: themeStyles.textGradient,
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

const SurveyPage: NextPage<ISurveyPageProps> = ({ screenNumber }) => {
  const [currentScreenNumber, setCurrentScreenNumber] = useState(screenNumber);
  const [formValue, setFormValue] = useState('');
  const [confirmModalType, setConfirmModalType] =
    useState<ConfirmModalType | null>(null);
  const [isCopyToClipboardModalOpen, setIsCopyToClipboardModalOpen] =
    useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const slideRef = useRef<HTMLDivElement>(null);

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
    onError(e: Error) {
      Bugsnag.notify(e);
    },
  });
  const {
    mutate: saveIndividualAnswer,
    isLoading,
    isError,
  } = useSaveIndividualAnswer();

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

          const offsetTop = slideRef.current?.offsetTop;
          window.scrollTo({
            top: offsetTop ? offsetTop - 20 : 0,
            behavior: 'smooth',
          });
        },
        onError(e: any) {
          Bugsnag.notify(e);
        },
      },
    );
  }

  function handlePreviousButtonClick() {
    const nextScreenNumber = Number(currentScreenNumber) - 1;
    saveScreenNumberCookie(nextScreenNumber);
    setCurrentScreenNumber(nextScreenNumber);
  }

  function handleResetButtonClick() {
    setConfirmModalType(null);

    const nextScreenNumber = 1;
    saveScreenNumberCookie(nextScreenNumber);
    setCurrentScreenNumber(nextScreenNumber);
  }

  function handleCloseConfirmModal() {
    setConfirmModalType(null);
  }

  function handleCloseCopyToClipboardModal() {
    setIsCopyToClipboardModalOpen(false);
  }

  async function handleShareClick() {
    try {
      const totalValues = prepareTotalValues(preparedIndividualData ?? null);
      const totalNumber =
        totalValues[FormValue.Never] +
        totalValues[FormValue.Sometimes] +
        totalValues[FormValue.Always];
      const result = `My result is:
✅ — ${getPercentFormatted(totalValues[FormValue.Always], totalNumber)}
⚠️ — ${getPercentFormatted(totalValues[FormValue.Sometimes], totalNumber)}
❌ — ${getPercentFormatted(totalValues[FormValue.Never], totalNumber)}\n
And what is yours?
https://hotkeys.guru`;
      setResultMessage(result);

      await navigator.clipboard.writeText(result);
      setIsCopyToClipboardModalOpen(true);
    } catch (e: any) {
      // TODO: try alternative way
      Bugsnag.notify(e);
    }
  }

  function renderFlowControls(withBackButton?: boolean) {
    const confirmModalSubmitButtonCallbacks = {
      previous: handlePreviousButtonClick,
      restart: handleResetButtonClick,
    };

    return (
      <>
        <Modal
          closeButton={true}
          scroll={true}
          open={isCopyToClipboardModalOpen}
          onClose={handleCloseCopyToClipboardModal}>
          <Modal.Body>
            <Row css={{ mb: 5 }}>
              <Text b={true}>Copied to clipboard! Just paste it anywhere.</Text>
            </Row>
            <Row>
              <pre style={{ margin: 0 }}>{resultMessage}</pre>
            </Row>
            <Row>
              <Button
                size="lg"
                color="primary"
                css={{ width: '100%' }}
                onClick={handleCloseCopyToClipboardModal}>
                Got it!
              </Button>
            </Row>
          </Modal.Body>
        </Modal>
        <Modal
          closeButton={true}
          scroll={true}
          open={Boolean(confirmModalType)}
          onClose={handleCloseConfirmModal}>
          <Modal.Body>
            <Grid.Container>
              <Row justify="center" align="center">
                <Text b={true}>Are you sure?</Text>
              </Row>
              <Spacer y={1} />
              <Grid.Container alignContent="center" gap={2}>
                <Grid xs={6}>
                  <Button
                    size="lg"
                    auto={true}
                    light={true}
                    color="primary"
                    css={{ width: '100%' }}
                    onClick={handleCloseConfirmModal}>
                    Cancel
                  </Button>
                </Grid>
                <Grid xs={6}>
                  <Button
                    size="lg"
                    auto={true}
                    color="primary"
                    css={{ width: '100%' }}
                    onClick={
                      confirmModalType
                        ? confirmModalSubmitButtonCallbacks[confirmModalType]
                        : undefined
                    }>
                    {confirmModalType &&
                      confirmModalSubmitButtonTexts[confirmModalType]}
                  </Button>
                </Grid>
              </Grid.Container>
            </Grid.Container>
          </Modal.Body>
        </Modal>
        <Row justify={'space-between'}>
          {withBackButton ? (
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
                fontSize: 'var(--nextui-fontSizes-xs)',
                '@sm': {
                  fontSize: 'var(--nextui-fontSizes-base)',
                },
              }}>
              <HiChevronDoubleLeft size={20} /> Previous slide
            </Button>
          ) : isIndividualResultsSuccess ? (
            <Button
              color="gradient"
              size="lg"
              auto={true}
              onClick={handleShareClick}>
              Share your result!
            </Button>
          ) : (
            <span />
          )}
          <Button
            onClick={() => setConfirmModalType('restart')}
            light={true}
            color="primary"
            size="lg"
            disabled={currentScreenNumber < 2}
            css={{
              paddingLeft: 0,
              paddingRight: 0,
              minWidth: 0,
              textTransform: 'normal',
              fontSize: 'var(--nextui-fontSizes-xs)',
              '@sm': {
                fontSize: 'var(--nextui-fontSizes-base)',
              },
            }}>
            <HiRefresh size={20} /> Restart
          </Button>
        </Row>
        <Spacer css={{ marginTop: 20, '@sm': { mt: 30 } }} />
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
            ref={slideRef}
            id={currentScreenNumber}
            slideNumber={`${currentScreenNumber} / ${screenEntries.length}`}
            title={screenData.title}
            subTitle={screenData.subTitle}
            description={screenData.description}
            imageSrc={`${IMAGE_HOST}${screenData.imageSrc}`}
            formValue={formValue}
            isLoading={isLoading}
            onFormChange={(value: FormValue) => setFormValue(value)}
          />
          {isError ? (
            <>
              <Spacer y={1} />
              <Card color="error">
                <Text css={{ fontWeight: '$bold' }}>
                  Sorry, we weren&apos;t able to save your answer. Please try
                  again or restart the survey.
                </Text>
              </Card>
              <Spacer y={1} />
            </>
          ) : (
            <Spacer y={2} />
          )}
          <Button
            color="primary"
            size="xl"
            disabled={!formValue}
            css={{
              width: '100%',
              '@xs': {
                width: 'auto',
              },
            }}
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
          Test your skills: do you use this functionality via keyboard shortcut?
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
  const cookiesToSet = [];
  const initialUserId = req.cookies[CookieKey.UserId];
  const initialScreenNumber = Number(req.cookies[CookieKey.ScreenNumber]);
  const screenNumber = initialScreenNumber || 1;

  if (!initialUserId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
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
      userId: initialUserId,
    },
  };
};

export default SurveyPage;
