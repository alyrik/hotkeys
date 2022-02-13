import React from 'react';
import { Text } from '@nextui-org/react';

import { pluralize } from '../../helpers/pluralize';
import Countdown from 'react-countdown';

interface ICountdownProps {}

const CustomCountdown: React.FC<ICountdownProps> = () => {
  return (
    <Countdown
      daysInHours={true}
      date={new Date('2022-03-10T14:30:00.000Z')}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
          return (
            <Text
              size={80}
              css={{
                textGradient: '45deg, $blue300 -30%, $pink700 60%',
                letterSpacing: '$normal',
              }}
              weight="bold">
              a moment!
            </Text>
          );
        }

        const daysText = `${days} ${pluralize(days, {
          one: 'day',
          other: 'days',
        })}`;
        const hoursText = `${hours} ${pluralize(hours, {
          one: 'hour',
          other: 'hours',
        })}`;
        const minutesText = `${minutes} ${pluralize(minutes, {
          one: 'minute',
          other: 'minutes',
        })}`;
        const secondsText = `${seconds} ${pluralize(seconds, {
          one: 'second',
          other: 'seconds',
        })}`;

        return (
          <div>
            <Text
              size={80}
              css={{
                textGradient: '45deg, $blue300 -30%, $pink700 60%',
                letterSpacing: '$normal',
              }}
              weight="bold">
              {Boolean(days) && (
                <>
                  {daysText}
                  <br />
                </>
              )}
              {Boolean(hours) && (
                <>
                  {hoursText}
                  <br />
                </>
              )}
              {Boolean(minutes) && (
                <>
                  {minutesText}
                  <br />
                </>
              )}
              {Boolean(seconds) && secondsText}
            </Text>
          </div>
        );
      }}
    />
  );
};

export default CustomCountdown;
