import React, { FC } from 'react';
import {
  Card,
  Text,
  Col,
  Radio,
  Spacer,
  Loading,
  Row,
} from '@nextui-org/react';
import Zoom from 'react-medium-image-zoom';

import styles from './Slide.module.scss';
import { FormValue } from '@/models/FormValue';

interface ISlideProps {
  id: number;
  slideNumber: string;
  title: string;
  imageSrc: string;
  subTitle?: string;
  formValue: FormValue | string;
  onFormChange(value: FormValue): void;
  isLoading?: boolean;
  isDisabled?: boolean;
  shouldIndicateSuccess?: boolean;
}

const Slide: FC<ISlideProps> = ({
  slideNumber,
  title,
  subTitle,
  imageSrc,
  formValue,
  onFormChange,
  isLoading,
  isDisabled,
  shouldIndicateSuccess,
}) => {
  return (
    <div
      className={[styles.root, isLoading ? styles.loading : undefined].join(
        ' ',
      )}>
      <Card>
        <Card.Header
          css={{
            transition: 'background 250ms ease',
            background: shouldIndicateSuccess && formValue ? '$success' : '',
          }}>
          <Col>
            <Text
              h1={true}
              size={24}
              weight="bold"
              small={false}
              css={{ letterSpacing: '$normal' }}>
              {slideNumber}
              <br />
              {title}
            </Text>
            <Text size={14} css={{ letterSpacing: '$normal' }}>
              {subTitle}
            </Text>
          </Col>
        </Card.Header>
        <Card.Body css={{ p: 0, overflow: 'hidden' }}>
          <Row
            justify="center"
            align="center"
            css={{ position: 'absolute', height: '100%' }}>
            <Loading color="white" size="md" />
          </Row>
          <Zoom
            overlayBgColorStart="rgba(0, 0, 0, 0)"
            overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
            zoomMargin={50}>
            <div style={{ paddingBottom: '50.63%' }}>
              <img
                src={imageSrc}
                alt={title}
                width="100%"
                style={{ position: 'absolute' }}
              />
            </div>
          </Zoom>
        </Card.Body>
        <Card.Footer>
          <Col>
            <Spacer y={2} />
            <Text size={20} b={true} css={{ letterSpacing: '$normal' }}>
              How often do you use this functionality (via keyboard)?
            </Text>
            <Radio.Group
              disabled={isDisabled}
              value={formValue}
              onChange={(value) => onFormChange(value as FormValue)}>
              <Radio value={FormValue.Always}>
                Always
                <Radio.Description>Or almost always</Radio.Description>
              </Radio>
              <Radio value={FormValue.Sometimes}>Sometimes</Radio>
              <Radio value={FormValue.Never}>
                Never<Radio.Desc>Or almost never</Radio.Desc>
              </Radio>
            </Radio.Group>
          </Col>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Slide;
