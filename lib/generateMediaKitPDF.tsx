import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer";
import { averageEngagementRate } from "@/lib/mediakit";
import { parseDemographicSegments } from "@/lib/demographics";
import type { MediaKit, MediaKitFontFamily, MediaKitLayout } from "@/types/mediakit";

// Google Fonts, served as static files via the @fontsource jsDelivr mirror —
// react-pdf's Font.register() needs a direct font-file URL, not a CSS file.
// Pinned to the @fontsource v4 major and .woff (not .woff2): fontkit's TTF
// subsetter corrupts certain glyphs (e.g. a plain hyphen in Poppins) when
// fed these fonts' .woff2 files, throwing "Offset is outside the bounds of
// the DataView" — the .woff variant of the same glyphs subsets cleanly.
const FONTSOURCE_CDN = "https://cdn.jsdelivr.net/npm/@fontsource";

// Only 400/700 are registered: DM Sans doesn't ship a 600 static weight,
// and mixing weight sets per family would fight the single shared StyleSheet.
function registerFont(family: string, slug: string) {
  Font.register({
    family,
    fonts: [
      { src: `${FONTSOURCE_CDN}/${slug}@4/files/${slug}-latin-400-normal.woff`, fontWeight: 400 },
      { src: `${FONTSOURCE_CDN}/${slug}@4/files/${slug}-latin-700-normal.woff`, fontWeight: 700 },
    ],
  });
}

registerFont("Inter", "inter");
registerFont("Playfair Display", "playfair-display");
registerFont("Poppins", "poppins");
registerFont("DM Sans", "dm-sans");

const fontFamilyNames: Record<MediaKitFontFamily, string> = {
  inter: "Inter",
  playfair: "Playfair Display",
  poppins: "Poppins",
  "dm-sans": "DM Sans",
};

interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  accentLight: string;
  muted: string;
  border: string;
}

const elegantColors: ThemeColors = {
  background: "#FAF7F4",
  text: "#2C2420",
  accent: "#B08BA8",
  accentLight: "#F2EBF0",
  muted: "#8C7A70",
  border: "#E3D9D0",
};

const boldColors: ThemeColors = {
  background: "#1C1410",
  text: "#FAF7F4",
  accent: "#B08BA8",
  accentLight: "#2C2420",
  muted: "#D4B8CE",
  border: "#3A302A",
};

const minimalColors: ThemeColors = {
  background: "#FFFFFF",
  text: "#1C1917",
  accent: "#B08BA8",
  accentLight: "#F2EBF0",
  muted: "#78716C",
  border: "#E7E5E4",
};

function getThemeColors(layout: MediaKitLayout): ThemeColors {
  if (layout === "bold") return boldColors;
  if (layout === "minimal") return minimalColors;
  return elegantColors;
}

const currencySymbols: Record<string, string> = { USD: "$", EUR: "€", TRY: "₺" };

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

interface MediaKitPDFDocumentProps {
  mediaKit: MediaKit;
}

export function MediaKitPDFDocument({ mediaKit }: MediaKitPDFDocumentProps) {
  const colors = getThemeColors(mediaKit.theme.layout);
  const fontFamily = fontFamilyNames[mediaKit.theme.fontFamily];
  const engagementRate = averageEngagementRate(mediaKit.platforms);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily,
      fontSize: 10,
      padding: 40,
    },
    section: {
      marginBottom: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderBottomStyle: "solid",
    },
    lastSection: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 12,
      textAlign: "center",
    },
    hero: {
      alignItems: "center",
      textAlign: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
      objectFit: "cover",
    },
    displayName: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 6,
    },
    bio: {
      fontSize: 10,
      color: colors.muted,
      marginBottom: 10,
      maxWidth: 360,
      textAlign: "center",
    },
    pillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6,
      marginBottom: 8,
    },
    pill: {
      backgroundColor: colors.accentLight,
      color: colors.accent,
      fontSize: 8,
      fontWeight: 700,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    platformChip: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.accentLight,
      borderStyle: "solid",
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 9,
      fontSize: 8,
      gap: 3,
    },
    statGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 16,
    },
    statCard: {
      flexBasis: "23%",
      flexGrow: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "solid",
      borderRadius: 6,
      paddingVertical: 10,
      alignItems: "center",
    },
    statValue: {
      fontSize: 15,
      fontWeight: 700,
    },
    statLabel: {
      fontSize: 7,
      color: colors.muted,
      marginTop: 3,
      textTransform: "uppercase",
    },
    demographicsRow: {
      flexDirection: "row",
      gap: 16,
    },
    demographicColumn: {
      flex: 1,
    },
    demographicTitle: {
      fontSize: 8,
      fontWeight: 700,
      color: colors.muted,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    barLabelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 8,
      marginBottom: 2,
    },
    barTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accentLight,
      marginBottom: 6,
    },
    barFill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
    },
    collabCard: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 10,
    },
    collabLogo: {
      width: 32,
      height: 32,
      borderRadius: 4,
      objectFit: "cover",
    },
    collabLogoPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundColor: colors.accentLight,
    },
    collabName: {
      fontSize: 10,
      fontWeight: 700,
      marginBottom: 2,
    },
    collabDescription: {
      fontSize: 8,
      color: colors.muted,
      marginBottom: 3,
    },
    collabBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.accentLight,
      color: colors.accent,
      fontSize: 7,
      fontWeight: 700,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 8,
    },
    serviceGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    serviceCard: {
      flexBasis: "48%",
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "solid",
      borderRadius: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    serviceName: {
      fontSize: 9,
      fontWeight: 700,
    },
    servicePrice: {
      fontSize: 9,
      fontWeight: 700,
      color: colors.accent,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Hero */}
        <View style={styles.section}>
          <View style={styles.hero}>
            {mediaKit.profileImageUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img
              <Image src={mediaKit.profileImageUrl} style={styles.avatar} />
            ) : null}
            <Text style={styles.displayName}>{mediaKit.displayName || "Your Name"}</Text>
            {mediaKit.bio ? <Text style={styles.bio}>{mediaKit.bio}</Text> : null}
            {mediaKit.niche.length > 0 && (
              <View style={styles.pillRow}>
                {mediaKit.niche.map((niche) => (
                  <Text key={niche} style={styles.pill}>
                    {niche}
                  </Text>
                ))}
              </View>
            )}
            {mediaKit.platforms.length > 0 && (
              <View style={styles.pillRow}>
                {mediaKit.platforms.map((platform) => (
                  <Text key={platform.name} style={styles.platformChip}>
                    {platform.name} · @{platform.handle} · {formatCount(platform.followerCount)}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audience &amp; Performance</Text>
          <View style={styles.statGrid}>
            {[
              { label: "Avg. likes", value: formatCount(mediaKit.stats.avgLikes) },
              { label: "Avg. comments", value: formatCount(mediaKit.stats.avgComments) },
              { label: "Engagement rate", value: `${engagementRate.toFixed(1)}%` },
              { label: "Monthly impressions", value: formatCount(mediaKit.stats.monthlyImpressions) },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.demographicsRow}>
            {[
              { title: "Top locations", value: mediaKit.stats.audienceLocation },
              { title: "Age range", value: mediaKit.stats.audienceAge },
              { title: "Gender split", value: mediaKit.stats.audienceGender },
            ].map(({ title, value }) => {
              const segments = parseDemographicSegments(value);
              return (
                <View key={title} style={styles.demographicColumn}>
                  <Text style={styles.demographicTitle}>{title}</Text>
                  {segments.length > 0
                    ? segments.map((segment) => (
                        <View key={segment.label}>
                          <View style={styles.barLabelRow}>
                            <Text>{segment.label}</Text>
                            <Text>{segment.percent}%</Text>
                          </View>
                          <View style={styles.barTrack}>
                            <View style={[styles.barFill, { width: `${segment.percent}%` }]} />
                          </View>
                        </View>
                      ))
                    : value && <Text style={{ fontSize: 8 }}>{value}</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Collaborations */}
        {mediaKit.collaborations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Collaborations</Text>
            {mediaKit.collaborations.map((collab) => (
              <View key={collab.id} style={styles.collabCard}>
                {collab.brandLogoUrl ? (
                  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img
                  <Image src={collab.brandLogoUrl} style={styles.collabLogo} />
                ) : (
                  <View style={styles.collabLogoPlaceholder} />
                )}
                <View>
                  <Text style={styles.collabName}>{collab.brandName}</Text>
                  {collab.description ? (
                    <Text style={styles.collabDescription}>{collab.description}</Text>
                  ) : null}
                  {collab.resultMetric ? (
                    <Text style={styles.collabBadge}>{collab.resultMetric}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Services */}
        {mediaKit.services.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Services &amp; Pricing</Text>
            <View style={styles.serviceGrid}>
              {mediaKit.services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>
                    {service.isHidden
                      ? "Contact for pricing"
                      : `${currencySymbols[service.currency] ?? ""}${service.price.toLocaleString()}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
