import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { DimensionScore } from '@/lib/scoring';
import { topPercentFromPercentile } from '@/lib/bellCurve';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#0F172A',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: { color: '#475569' },
  value: { fontFamily: 'Helvetica-Bold' },
  heroScore: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    textAlign: 'center',
    marginVertical: 12,
  },
  body: {
    lineHeight: 1.6,
    color: '#334155',
  },
  footer: {
    marginTop: 32,
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export interface ReportPDFProps {
  name: string;
  score: number;
  percentile: number;
  classification: string;
  rawScore: number;
  dimensionScores: DimensionScore[];
  strengths: string[];
  weaknesses: string[];
  interpretation: string | null;
  date: Date;
  brand: string;
  verificationId: string;
}

export function ReportDocument({
  name,
  score,
  percentile,
  classification,
  rawScore,
  dimensionScores,
  strengths,
  weaknesses,
  interpretation,
  date,
  brand,
  verificationId,
}: ReportPDFProps) {
  const topPercent = topPercentFromPercentile(percentile);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Cognitive Assessment Report</Text>
        <Text style={styles.subtitle}>
          Prepared for {name} · {dateStr} · {brand}
        </Text>

        <Text style={styles.sectionTitle}>IQ Score Summary</Text>
        <Text style={styles.heroScore}>{score}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Classification</Text>
          <Text style={styles.value}>{classification}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Percentile rank</Text>
          <Text style={styles.value}>Top {topPercent}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Raw score</Text>
          <Text style={styles.value}>{rawScore}</Text>
        </View>

        <Text style={styles.sectionTitle}>Cognitive Dimensions</Text>
        {dimensionScores.map((d) => (
          <View key={d.key} style={styles.row}>
            <Text style={styles.label}>{d.name}</Text>
            <Text style={styles.value}>{d.tested ? `${d.score}/100` : 'Not tested'}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Strengths</Text>
        <Text style={styles.body}>
          {strengths.length > 0 ? strengths.join(', ') : 'None identified'}
        </Text>

        <Text style={styles.sectionTitle}>Growth Areas</Text>
        <Text style={styles.body}>
          {weaknesses.length > 0 ? weaknesses.join(', ') : 'None identified'}
        </Text>

        {interpretation && (
          <>
            <Text style={styles.sectionTitle}>Personalized Analysis</Text>
            <Text style={styles.body}>{interpretation}</Text>
          </>
        )}

        <Text style={styles.footer}>Verification ID: {verificationId}</Text>
      </Page>
    </Document>
  );
}
