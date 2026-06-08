import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { topPercentFromPercentile } from '@/lib/bellCurve';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Times-Roman',
  },
  outerBorder: {
    borderWidth: 3,
    borderColor: '#2563EB',
    padding: 4,
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    padding: 36,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 24,
    fontFamily: 'Times-Bold',
  },
  subheader: {
    fontSize: 14,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 12,
  },
  name: {
    fontSize: 32,
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 20,
    fontFamily: 'Times-Bold',
  },
  body: {
    fontSize: 13,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  score: {
    fontSize: 56,
    textAlign: 'center',
    color: '#2563EB',
    fontFamily: 'Helvetica-Bold',
    marginVertical: 12,
  },
  classification: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 24,
  },
  date: {
    fontSize: 12,
    textAlign: 'center',
    color: '#64748B',
    marginTop: 16,
  },
  footer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    alignItems: 'center',
  },
  brand: {
    fontSize: 11,
    color: '#64748B',
  },
  verification: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 4,
  },
  seal: {
    marginTop: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: 10,
    color: '#2563EB',
    fontFamily: 'Helvetica-Bold',
  },
});

export interface CertificatePDFProps {
  name: string;
  score: number;
  percentile: number;
  classification: string;
  date: Date;
  brand: string;
  verificationId: string;
}

export function CertificateDocument({
  name,
  score,
  percentile,
  classification,
  date,
  brand,
  verificationId,
}: CertificatePDFProps) {
  const topPercent = topPercentFromPercentile(percentile);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            <Text style={styles.header}>Certificate of Cognitive Assessment</Text>
            <Text style={styles.subheader}>This certifies that</Text>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.body}>
              has completed the cognitive assessment with a measured IQ score of
            </Text>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.classification}>
              ({classification}, Top {topPercent}%)
            </Text>
            <View style={styles.seal}>
              <Text style={styles.sealText}>CERTIFIED</Text>
            </View>
            <Text style={styles.date}>Issued on {dateStr}</Text>
            <View style={styles.footer}>
              <Text style={styles.brand}>{brand}</Text>
              <Text style={styles.verification}>Verification ID: {verificationId}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
