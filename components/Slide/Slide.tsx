import React, { FC } from 'react';
import { Card, Text, Col } from '@nextui-org/react';
import Zoom from 'react-medium-image-zoom';

import styles from './Slide.module.scss';

interface ISlideProps {
  id: number;
  title: string;
  imageSrc: string;
  subTitle?: string;
}

const Slide: FC<ISlideProps> = ({ id, title, subTitle, imageSrc }) => {
  return (
    <div className={styles.root}>
      <Card>
        <Card.Header>
          <Col>
            <Text size={20} weight="bold">
              {id}. {title}
            </Text>
            <Text size={14}>{subTitle}</Text>
          </Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Zoom
            overlayBgColorStart="rgba(0, 0, 0, 0)"
            overlayBgColorEnd="rgba(0, 0, 0, 0.75)"
            zoomMargin={50}>
            <img src={imageSrc} alt={''} width="100%" />
          </Zoom>
        </Card.Body>
        <Card.Footer>
          <Text b>Text</Text>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Slide;
