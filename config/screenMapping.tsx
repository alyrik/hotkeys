import { Text } from '@nextui-org/react';

export const SHIFT_NOTE = '+ Shift to enable Selection';

export const screenMapping: Record<
  number,
  {
    imageSrc: string;
    title: string;
    subTitle?: string;
    description?: JSX.Element | string;
  }
> = {
  1: {
    imageSrc: 'Move+Caret+to+Previous%3ANext+Word.gif',
    title: 'Move Caret to Previous/Next Word',
    subTitle: SHIFT_NOTE,
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of moving caret by one character</Text>
        </li>
      </ul>
    ),
  },
  2: {
    imageSrc: 'Move+Caret+to+Line+Start%3AEnd.gif',
    title: 'Move Caret to Line Start/End',
    subTitle: SHIFT_NOTE,
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of moving caret multiple times</Text>
        </li>
      </ul>
    ),
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
  11: {
    imageSrc: 'Comment+with+Line+Comment.gif',
    title: 'Comment with Line Comment',
  },
  12: {
    imageSrc: 'Comment+with+Block+Comment.gif',
    title: 'Comment with Block Comment',
  },
  13: {
    imageSrc: 'Move+Line+Up%3ADown.gif',
    title: 'Move Line Up/Down',
  },
  14: {
    imageSrc: 'Move+Statement+Up%3ADown.gif',
    title: 'Move Statement Up/Down',
  },
  15: {
    imageSrc: 'Move+Element+Left%3ARight.gif',
    title: 'Move Element Left/Right',
  },
  16: {
    imageSrc: 'Back%3AForward.gif',
    title: 'Back/Forward',
  },
  17: {
    imageSrc: 'Last%3ANext+Edit+Location.gif',
    title: 'Last/Next Edit Location',
  },
  18: {
    imageSrc: 'Find+%E2%80%94%3E+Navigate+through+occurrences+.gif',
    title: 'Find → Navigate through occurrences',
  },
  19: {
    imageSrc: 'Find+in+Files.gif',
    title: 'Find in Files',
  },
  20: {
    imageSrc: 'Recent+Files.gif',
    title: 'Recent Files',
  },
  21: {
    imageSrc: 'Recent+Locations.gif',
    title: 'Recent Locations',
  },
  22: {
    imageSrc: 'Find+Usages.gif',
    title: 'Find Usages',
  },
  23: {
    imageSrc: 'Search+Everywhere.gif',
    title: 'Search Everywhere',
  },
  24: {
    imageSrc: 'Go+to+Line-Column.gif',
    title: 'Go to Line:Column',
  },
  25: {
    imageSrc: 'Previous%3ANext+method.gif',
    title: 'Previous/Next method',
  },
  26: {
    imageSrc: 'Go+to+Declaration+or+Usages.gif',
    title: 'Go to Declaration or Usages',
  },
  27: {
    imageSrc: 'Create+new+directory+or+package.gif',
    title: 'Create new directory or package',
  },
  28: {
    imageSrc: 'Create+new+file.gif',
    title: 'Create new file',
  },
  29: {
    imageSrc: 'Rename.gif',
    title: 'Rename',
  },
  30: {
    imageSrc: 'Preferences.gif',
    title: 'Preferences',
  },
  31: {
    imageSrc: 'Paste+from+History.gif',
    title: 'Paste from History',
  },
  32: {
    imageSrc: 'Replace.gif',
    title: 'Replace',
  },
  33: {
    imageSrc: 'Replace+in+Files.gif',
    title: 'Replace in Files',
  },
  34: {
    imageSrc: 'Quick+Documentation.gif',
    title: 'Quick Documentation',
  },
  35: {
    imageSrc: 'Compare+Files.gif',
    title: 'Compare Files',
  },
  36: {
    imageSrc: 'Compare+with+Clipboard.gif',
    title: 'Compare with Clipboard',
  },
  37: {
    imageSrc: 'Compare+with+Branch.gif',
    title: 'Compare with Branch',
  },
  38: {
    imageSrc: 'Reformat+Code.gif',
    title: 'Reformat Code',
  },
  39: {
    imageSrc: 'Move.gif',
    title: 'Move',
  },
  40: {
    imageSrc: 'Select+Previous%3ANext+Tab.gif',
    title: 'Select Previous/Next Tab',
  },
  41: {
    imageSrc: 'Close.gif',
    title: 'Close',
  },
  42: {
    imageSrc: 'Close+Other+Tabs.gif',
    title: 'Close Other Tabs',
  },
  43: {
    imageSrc: 'Close+All+Tabs.gif',
    title: 'Close All Tabs',
  },
  44: {
    imageSrc: 'Reopen+Closed+Tab.gif',
    title: 'Reopen Closed Tab',
  },
  45: {
    imageSrc: 'Focus+Editor.gif',
    title: 'Focus Editor',
  },
  46: {
    imageSrc: 'Hide+Active+Tool+Window.gif',
    title: 'Hide Active Tool Window',
  },
  47: {
    imageSrc: 'Project+Tool+Window.gif',
    title: 'Project Tool Window',
  },
  48: {
    imageSrc: 'Select+File+in+Project+View.gif',
    title: 'Select File in Project View',
  },
};
