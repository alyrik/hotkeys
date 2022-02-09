export const IMAGE_HOST = 'https://d1l6237ra2ufh4.cloudfront.net/';

const SHIFT_NOTE = '+ Shift to enable Selection';

export const screenMapping: Record<
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
