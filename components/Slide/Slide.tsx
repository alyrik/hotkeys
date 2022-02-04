import React, { FC } from 'react';
import Image from 'next/image';
import { Card, Text, Col, Radio, Spacer } from '@nextui-org/react';
import Zoom from 'react-medium-image-zoom';

import styles from './Slide.module.scss';
import { FormValue } from '../../models/FormValue';
import { imagePlaceholder } from './imagePlaceholder';

interface ISlideProps {
  id: number;
  title: string;
  imageSrc: string;
  subTitle?: string;
  formValue: FormValue | string;
  onFormChange(value: FormValue): void;
  isDisabled: boolean;
}

const Slide: FC<ISlideProps> = ({
  id,
  title,
  subTitle,
  imageSrc,
  formValue,
  onFormChange,
  isDisabled,
}) => {
  return (
    <div
      className={[styles.root, isDisabled ? styles.disabled : undefined].join(
        ' ',
      )}>
      <Card>
        <Card.Header
          css={{
            transition: 'background 250ms ease',
            background: formValue ? '$success' : '',
          }}>
          <Col>
            <Text
              h1={true}
              size={24}
              weight="bold"
              small={false}
              css={{ letterSpacing: '$normal' }}>
              {id}. {title}
            </Text>
            <Text size={14} css={{ letterSpacing: '$normal' }}>
              {subTitle}
            </Text>
          </Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Zoom
            overlayBgColorStart="rgba(0, 0, 0, 0)"
            overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
            zoomMargin={50}>
            <Image
              src={imageSrc}
              alt={title}
              width="1280"
              height="648"
              placeholder="blur"
              blurDataURL={imagePlaceholder}
            />
          </Zoom>
        </Card.Body>
        <Card.Footer>
          <Col>
            <Spacer y={2} />
            <Text size={20} b={true} css={{ letterSpacing: '$normal' }}>
              How often do you use this functionality (via keyboard)?
            </Text>
            <Radio.Group
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