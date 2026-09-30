import { Text, View } from '@react-pdf/renderer';
import { breakLongWords } from '../breakLongWords';
import { pdfStyles } from '../pdfStyles';
import { textRunLimits } from '../textRunLimits';
import { SectionLabel } from './SectionLabel';

interface Column {
  readonly label: string;
  readonly text: string;
}

interface Props {
  readonly left?: Column;
  readonly right?: Column;
}

/** Two labelled text blocks side by side; one alone takes the full width, none renders nothing. */
export function TextColumns({ left, right }: Props) {
  if (left === undefined && right === undefined) {
    return null;
  }
  const fullWidth = left === undefined || right === undefined;
  return (
    <View style={[pdfStyles.row, pdfStyles.section]}>
      {left !== undefined && <LabelledColumn column={left} fullWidth={fullWidth} />}
      {right !== undefined && <LabelledColumn column={right} fullWidth={fullWidth} />}
    </View>
  );
}

interface LabelledColumnProps {
  readonly column: Column;
  readonly fullWidth: boolean;
}

function LabelledColumn({ column, fullWidth }: LabelledColumnProps) {
  return (
    <View style={fullWidth ? pdfStyles.fullColumn : pdfStyles.halfColumn}>
      <SectionLabel>{column.label}</SectionLabel>
      <Text style={pdfStyles.text}>
        {breakLongWords(
          column.text,
          fullWidth ? textRunLimits.fullWidth : textRunLimits.halfColumn,
        )}
      </Text>
    </View>
  );
}
