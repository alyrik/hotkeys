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
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  3: {
    imageSrc: 'Select+Single+Line+at+Caret.gif',
    title: 'Select Single Line at Caret',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  4: {
    imageSrc: 'Extend%3AShrink+Selection.gif',
    title: 'Extend/Shrink Selection',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
      </ul>
    ),
  },
  5: {
    imageSrc: 'Add%3ARemove+Selection+for+Next+Occurrence.gif',
    title: 'Add/Remove Selection for Next Occurrence',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of repeating same operations for every occurrence</Text>
        </li>
      </ul>
    ),
  },
  6: {
    imageSrc: 'Delete+Line.gif',
    title: 'Delete Line',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  7: {
    imageSrc: 'Duplicate+Line+or+Selection.gif',
    title: 'Duplicate Line or Selection',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
        <li>
          <Text>Instead of rewriting code</Text>
        </li>
      </ul>
    ),
  },
  8: {
    imageSrc: 'Undo%3ARedo.gif',
    title: 'Undo/Redo',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of rewriting code</Text>
        </li>
      </ul>
    ),
  },
  9: {
    imageSrc: 'Start+New+Line.gif',
    title: 'Start New Line',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  10: {
    imageSrc: 'Indent%3AUnindent+Line+or+Selection.gif',
    title: 'Indent/Unindent Line or Selection',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  11: {
    imageSrc: 'Comment+with+Line+Comment.gif',
    title: 'Comment with Line Comment',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  12: {
    imageSrc: 'Comment+with+Block+Comment.gif',
    title: 'Comment with Block Comment',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  13: {
    imageSrc: 'Move+Line+Up%3ADown.gif',
    title: 'Move Line Up/Down',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  14: {
    imageSrc: 'Move+Statement+Up%3ADown.gif',
    title: 'Move Statement Up/Down',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  15: {
    imageSrc: 'Move+Element+Left%3ARight.gif',
    title: 'Move Element Left/Right',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  16: {
    imageSrc: 'Back%3AForward.gif',
    title: 'Back/Forward',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Instead of using more than one keystroke to find previous caret
            location
          </Text>
        </li>
      </ul>
    ),
  },
  17: {
    imageSrc: 'Last%3ANext+Edit+Location.gif',
    title: 'Last/Next Edit Location',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Instead of using more than one keystroke to find previous edit
            location
          </Text>
        </li>
      </ul>
    ),
  },
  18: {
    imageSrc: 'Find+%E2%80%94%3E+Navigate+through+occurrences+.gif',
    title: 'Find → Navigate through occurrences',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  19: {
    imageSrc: 'Find+in+Files.gif',
    title: 'Find in Files',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of searching everywhere</Text>
        </li>
      </ul>
    ),
  },
  20: {
    imageSrc: 'Recent+Files.gif',
    title: 'Recent Files',
    description: (
      <ul>
        <li>
          <Text>
            Instead of looking for the recent file in the project view
            or by search tool
          </Text>
        </li>
      </ul>
    ),
  },
  21: {
    imageSrc: 'Recent+Locations.gif',
    title: 'Recent Locations',
    description: (
      <ul>
        <li>
          <Text>
            Instead of searching for the file, opening it and finding required
            location
          </Text>
        </li>
        <li>
          <Text>
            Answer “Always” if you use other shortcuts for navigating through
            recent locations
          </Text>
        </li>
      </ul>
    ),
  },
  22: {
    imageSrc: 'Find+Usages.gif',
    title: 'Find Usages',
    description: (
      <ul>
        <li>
          <Text>Instead of using search tool</Text>
        </li>
      </ul>
    ),
  },
  23: {
    imageSrc: 'Search+Everywhere.gif',
    title: 'Search Everywhere',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using other types of manual lookup</Text>
        </li>
      </ul>
    ),
  },
  24: {
    imageSrc: 'Go+to+Line-Column.gif',
    title: 'Go to Line:Column',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  25: {
    imageSrc: 'Previous%3ANext+method.gif',
    title: 'Previous/Next method',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  26: {
    imageSrc: 'Go+to+Declaration+or+Usages.gif',
    title: 'Go to Declaration or Usages',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
        <li>
          <Text>Instead of using search tool or manual lookup</Text>
        </li>
      </ul>
    ),
  },
  27: {
    imageSrc: 'Create+new+directory+or+package.gif',
    title: 'Create new directory or package',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  28: {
    imageSrc: 'Create+new+file.gif',
    title: 'Create new file',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  29: {
    imageSrc: 'Rename.gif',
    title: 'Rename',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  30: {
    imageSrc: 'Preferences.gif',
    title: 'Preferences',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of using more than one keystroke</Text>
        </li>
      </ul>
    ),
  },
  31: {
    imageSrc: 'Paste+from+History.gif',
    title: 'Paste from History',
    description: (
      <ul>
        <li>
          <Text>Instead of copying again the fragment you copied recently</Text>
        </li>
      </ul>
    ),
  },
  32: {
    imageSrc: 'Replace.gif',
    title: 'Replace',
    description: (
      <ul>
        <li>
          <Text>Instead of repeating same operations for every occurrence</Text>
        </li>
      </ul>
    ),
  },
  33: {
    imageSrc: 'Replace+in+Files.gif',
    title: 'Replace in Files',
    description: (
      <ul>
        <li>
          <Text>Instead of repeating same operations for every file</Text>
        </li>
      </ul>
    ),
  },
  34: {
    imageSrc: 'Quick+Documentation.gif',
    title: 'Quick Documentation',
    description: (
      <ul>
        <li>
          <Text>
            Instead of searching the web for the exact same information
          </Text>
        </li>
      </ul>
    ),
  },
  35: {
    imageSrc: 'Compare+Files.gif',
    title: 'Compare Files',
    description: (
      <ul>
        <li>
          <Text>Instead of using less efficient way of comparing</Text>
        </li>
      </ul>
    ),
  },
  36: {
    imageSrc: 'Compare+with+Clipboard.gif',
    title: 'Compare with Clipboard',
    description: (
      <ul>
        <li>
          <Text>Instead of using less efficient way of comparing</Text>
        </li>
      </ul>
    ),
  },
  37: {
    imageSrc: 'Compare+with+Branch.gif',
    title: 'Compare with Branch',
    description: (
      <ul>
        <li>
          <Text>Instead of using less efficient way of comparing</Text>
        </li>
      </ul>
    ),
  },
  38: {
    imageSrc: 'Reformat+Code.gif',
    title: 'Reformat Code',
    description: (
      <ul>
        <li>
          <Text>Instead of formatting code manually</Text>
        </li>
        <li>
          <Text>
            Answer “Always” if you are using any kind of automatic reformatting
          </Text>
        </li>
      </ul>
    ),
  },
  39: {
    imageSrc: 'Move.gif',
    title: 'Move',
    description: (
      <ul>
        <li>
          <Text>Instead of moving code to another file manually</Text>
        </li>
      </ul>
    ),
  },
  40: {
    imageSrc: 'Select+Previous%3ANext+Tab.gif',
    title: 'Select Previous/Next Tab',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Answer “Always” if your editor forces you to have only one tab
          </Text>
        </li>
      </ul>
    ),
  },
  41: {
    imageSrc: 'Close.gif',
    title: 'Close',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Answer “Always” if your editor forces you to have only one tab
          </Text>
        </li>
      </ul>
    ),
  },
  42: {
    imageSrc: 'Close+Other+Tabs.gif',
    title: 'Close Other Tabs',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Answer “Always” if your editor forces you to have only one tab
          </Text>
        </li>
      </ul>
    ),
  },
  43: {
    imageSrc: 'Close+All+Tabs.gif',
    title: 'Close All Tabs',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Answer “Always” if your editor forces you to have only one tab
          </Text>
        </li>
      </ul>
    ),
  },
  44: {
    imageSrc: 'Reopen+Closed+Tab.gif',
    title: 'Reopen Closed Tab',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>Instead of searching for the file and opening it again</Text>
        </li>
      </ul>
    ),
  },
  45: {
    imageSrc: 'Focus+Editor.gif',
    title: 'Focus Editor',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
      </ul>
    ),
  },
  46: {
    imageSrc: 'Hide+Active+Tool+Window.gif',
    title: 'Hide Active Tool Window',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
      </ul>
    ),
  },
  47: {
    imageSrc: 'Project+Tool+Window.gif',
    title: 'Project Tool Window',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
      </ul>
    ),
  },
  48: {
    imageSrc: 'Select+File+in+Project+View.gif',
    title: 'Select File in Project View',
    description: (
      <ul>
        <li>
          <Text>Instead of using mouse</Text>
        </li>
        <li>
          <Text>
            Instead of looking for the opened file in the project view
            or by search tool
          </Text>
        </li>
      </ul>
    ),
  },
};
