import { Text } from '@react-pdf/renderer';
import { pdfStyles } from '../pdfStyles';

interface Props {
  readonly children: string;
}

export function SectionLabel({ children }: Props) {
  // Keeps a label on the same page as the first lines of what it labels.
  return (
    <Text style={pdfStyles.label} minPresenceAhead={30}>
      {children}
    </Text>
  );
}
