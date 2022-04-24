import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  Text,
  Col,
  Modal,
  Radio,
  Spacer,
  Loading,
  Row,
  Button,
} from '@nextui-org/react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

import styles from './Slide.module.scss';
import { FormValue } from '@/models/FormValue';
import { useClientDimensions } from '@/helpers/useClientDimensions';

interface ISlideProps {
  id: number;
  slideNumber: string;
  title: string;
  imageSrc: string;
  subTitle?: string;
  description?: JSX.Element | string;
  formValue: FormValue | string;

  onFormChange(value: FormValue): void;

  isLoading?: boolean;
  isDisabled?: boolean;
  shouldIndicateSuccess?: boolean;
}

const DynamicZoom = dynamic(() => import('react-medium-image-zoom'), {
  ssr: false,
});
const DynamicInnerImageZoom = dynamic(() => import('react-inner-image-zoom'), {
  ssr: false,
});

const Slide = React.forwardRef<HTMLDivElement, ISlideProps>(
  (
    {
      slideNumber,
      title,
      subTitle,
      description,
      imageSrc,
      formValue,
      onFormChange,
      isLoading,
      isDisabled,
      shouldIndicateSuccess,
    },
    ref,
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobileWidth } = useClientDimensions();

    function handleToggleModal() {
      setIsModalOpen(!isModalOpen);
    }

    function renderImage() {
      return <img src={imageSrc} alt={title} width="100%" />;
    }

    function renderImageContainer() {
      return (
        <div style={{ paddingBottom: '50.63%' }}>
          {isMobileWidth ? (
            <DynamicInnerImageZoom
              src={imageSrc}
              zoomScale={0.5}
              imgAttributes={{ alt: title }}
              hasSpacer={true}
              className={styles.imageFallback}
            />
          ) : (
            <DynamicZoom
              overlayBgColorStart="rgba(0, 0, 0, 0)"
              overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
              wrapStyle={{ position: 'absolute' }}
              zoomMargin={20}>
              {renderImage()}
            </DynamicZoom>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={[styles.root, isLoading ? styles.loading : undefined].join(
          ' ',
        )}>
        <Modal
          closeButton={true}
          scroll={true}
          open={isModalOpen}
          onClose={handleToggleModal}>
          <Modal.Body className={styles.modalBody}>{description}</Modal.Body>
        </Modal>
        <Card>
          <Card.Header
            css={{
              transition: 'background 250ms ease',
              p: '10px 15px',
              background: shouldIndicateSuccess && formValue ? '$success' : '',
              '@sm': { p: '15px 20px' },
            }}>
            <Col>
              <Text
                h1={true}
                weight="bold"
                small={false}
                css={{
                  fontSize: 20,
                  '@sm': { fontSize: 24 },
                }}>
                {slideNumber}
                <br />
                {title}
              </Text>
              <Text size={14}>{subTitle}</Text>
            </Col>
          </Card.Header>
          <Card.Body css={{ p: 0, overflow: 'hidden' }}>
            <Row
              justify="center"
              align="center"
              css={{ position: 'absolute', height: '100%' }}>
              <Loading color="white" size="md" />
            </Row>
            {renderImageContainer()}
          </Card.Body>
          <Card.Footer css={{ p: '10px 15px', '@sm': { p: '15px 20px' } }}>
            <Col>
              <Spacer y={1} />
              <div className={styles.questionTitle}>
                <Text
                  b={true}
                  css={{
                    fontSize: 18,
                    '@sm': { fontSize: 20 },
                  }}>
                  Do you use this functionality via keyboard shortcut?
                </Text>
                {Boolean(description) && (
                  <Button
                    className={styles.infoButton}
                    light={true}
                    color="secondary"
                    auto={true}
                    ripple={false}
                    onClick={handleToggleModal}
                    css={{ width: 30, height: 30, p: 0, ml: 10 }}
                    icon={<HiOutlineInformationCircle size={28} />}
                  />
                )}
              </div>
              <Radio.Group
                disabled={isDisabled}
                value={formValue}
                onChange={(value) => onFormChange(value as FormValue)}>
                <Radio
                  value={FormValue.Always}
                  css={{
                    '--nextui--radioSize': '18px',
                    '@sm': { '--nextui--radioSize': 'var(--nextui-space-9)' },
                  }}>
                  Always
                  <Radio.Description>Or almost always</Radio.Description>
                </Radio>
                <Radio
                  value={FormValue.Sometimes}
                  css={{
                    '--nextui--radioSize': '18px',
                    '@sm': { '--nextui--radioSize': 'var(--nextui-space-9)' },
                  }}>
                  Sometimes
                </Radio>
                <Radio
                  value={FormValue.Never}
                  css={{
                    '--nextui--radioSize': '18px',
                    '@sm': { '--nextui--radioSize': 'var(--nextui-space-9)' },
                  }}>
                  Never<Radio.Desc>Or almost never</Radio.Desc>
                </Radio>
              </Radio.Group>
            </Col>
          </Card.Footer>
        </Card>
      </div>
    );
  },
);

Slide.displayName = 'Slide';

export default Slide;
