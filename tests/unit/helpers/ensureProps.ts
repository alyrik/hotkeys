import { GetServerSidePropsResult } from 'next';

function hasProps<TProps>(
  result: GetServerSidePropsResult<TProps>,
): result is { props: TProps } {
  return 'props' in result;
}

export function ensureProps<TProps>(result: GetServerSidePropsResult<TProps>): {
  props: TProps;
} {
  if (hasProps(result)) {
    return result;
  }

  throw new Error("Object doesn't contain props");
}
