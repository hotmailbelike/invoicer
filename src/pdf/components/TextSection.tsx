import { Text, View } from '@react-pdf/renderer';
import { breakLongWords } from '../breakLongWords';
import { pdfStyles } from '../pdfStyles';
import { textRunLimits } from '../textRunLimits';
import { SectionLabel } from './SectionLabel';

interface Props {
  readonly label: string;
  readonly text: string;
}

/** A full-width labelled block of free text, printed as typed, line breaks included. */
export function TextSection({ label, text }: Props) {
  return (
    <View style={pdfStyles.section}>
      <SectionLabel>{breakLongWords(label, textRunLimits.label)}</SectionLabel>
      <Text style={pdfStyles.text}>{breakLongWords(text, textRunLimits.fullWidth)}</Text>
    </View>
  );
}
