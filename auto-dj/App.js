import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, Pressable, ScrollView, StyleSheet,
  StatusBar, useWindowDimensions
} from "react-native";

const tracks = [
  { id: "1", title: "Midnight Drive", artist: "AUTO DJ DEMO", bpm: 124, key: "8A", duration: "3:42" },
  { id: "2", title: "After Hours", artist: "AUTO DJ DEMO", bpm: 126, key: "9A", duration: "4:08" },
  { id: "3", title: "Golden Frequency", artist: "AUTO DJ DEMO", bpm: 124, key: "8B", duration: "3:56" },
  { id: "4", title: "Night City", artist: "AUTO DJ DEMO", bpm: 128, key: "9A", duration: "4:21" }
];

function Action({ label, onPress, primary = false, compact = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.action, primary && styles.primaryAction, compact && styles.compactAction]}>
      <Text style={[styles.actionText, primary && styles.primaryActionText]}>{label}</Text>
    </Pressable>
  );
}

function Deck({ name, track, playing, onToggle, color }) {
  return (
    <View style={styles.deck}>
      <View style={styles.deckHeader}>
        <Text style={styles.deckName}>{name}</Text>
        <Text style={[styles.deckStatus, { color }]}>{playing ? "PLAYING" : "STANDBY"}</Text>
      </View>
      <Text style={styles.trackTitle}>{track.title}</Text>
      <Text style={styles.artist}>{track.artist}</Text>
      <View style={styles.wave}>
        {Array.from({ length: 36 }, (_, i) => (
          <View key={i} style={[styles.waveBar, { height: 8 + ((i * 17 + track.bpm) % 30), backgroundColor: color, opacity: playing ? 0.95 : 0.38 }]} />
        ))}
      </View>
      <View style={styles.metrics}>
        <View><Text style={styles.metricLabel}>BPM</Text><Text style={styles.metricValue}>{track.bpm}</Text></View>
        <View><Text style={styles.metricLabel}>KEY</Text><Text style={styles.metricValue}>{track.key}</Text></View>
        <View><Text style={styles.metricLabel}>LENGTH</Text><Text style={styles.metricValue}>{track.duration}</Text></View>
      </View>
      <Action label={playing ? "Ⅱ  PAUSE" : "▶  PLAY"} onPress={onToggle} primary />
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [playingA, setPlayingA] = useState(false);
  const [playingB, setPlayingB] = useState(false);
  const [autoDJ, setAutoDJ] = useState(false);
  const [active, setActive] = useState(0);
  const current = tracks[active % tracks.length];
  const next = tracks[(active + 1) % tracks.length];
  const queue = useMemo(() => tracks.slice((active + 2) % tracks.length).concat(tracks.slice(0, (active + 2) % tracks.length)), [active]);

  function nextTrack() {
    setActive(value => (value + 1) % tracks.length);
    if (autoDJ) { setPlayingA(true); setPlayingB(false); }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#080a0f" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>AUTO DJ <Text style={styles.brandAccent}>AI</Text></Text>
            <Text style={styles.tagline}>INTELLIGENT MIXING SYSTEM</Text>
          </View>
          <View style={styles.statusPill}><View style={styles.dot} /><Text style={styles.statusText}>SYSTEM READY</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR MUSIC. YOUR FLOW.</Text>
          <Text style={styles.headline}>The next track is{"\n"}already in the mix.</Text>
          <Text style={styles.description}>A unified DJ workspace for your music library and supported streaming integrations.</Text>
          <View style={styles.heroActions}>
            <Action label={autoDJ ? "AUTO DJ: ON" : "START AUTO DJ"} primary onPress={() => setAutoDJ(value => !value)} />
            <Action label="NEXT TRACK  →" onPress={nextTrack} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LIVE MIXER</Text>
          <Text style={styles.sectionMeta}>2-DECK CONSOLE · DEMO MODE</Text>
        </View>
        <View style={[styles.decks, wide && styles.decksWide]}>
          <Deck name="DECK A" track={current} playing={playingA} onToggle={() => setPlayingA(value => !value)} color="#d5b36a" />
          <Deck name="DECK B" track={next} playing={playingB} onToggle={() => setPlayingB(value => !value)} color="#7aa8d8" />
        </View>

        <View style={styles.mixerStrip}>
          <View><Text style={styles.metricLabel}>CROSSFADER</Text><Text style={styles.mixerHint}>A  ━━━━━━━━━●━━━━━━━━━  B</Text></View>
          <View><Text style={styles.metricLabel}>AUTO TRANSITIONS</Text><Text style={styles.metricValue}>{autoDJ ? "ENABLED" : "MANUAL"}</Text></View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UP NEXT</Text>
          <Text style={styles.sectionMeta}>{queue.length} TRACKS IN DEMO QUEUE</Text>
        </View>
        <View style={styles.queue}>
          {queue.map((track, index) => (
            <View key={track.id} style={styles.queueRow}>
              <Text style={styles.queueNumber}>{String(index + 1).padStart(2, "0")}</Text>
              <View style={styles.queueInfo}><Text style={styles.queueTitle}>{track.title}</Text><Text style={styles.artist}>{track.artist}</Text></View>
              <Text style={styles.queueBpm}>{track.bpm} BPM</Text>
              <Text style={styles.queueDuration}>{track.duration}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AUTO DJ AI</Text>
          <Text style={styles.footerText}>Milestone 1 · Interface prototype. Audio playback, local-file import, beat analysis and provider connections are next.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#080a0f" },
  page: { padding: 22, paddingBottom: 48, maxWidth: 1180, width: "100%", alignSelf: "center" },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#202630" },
  brand: { color: "#f4f2ed", fontSize: 23, fontWeight: "900", letterSpacing: 2 },
  brandAccent: { color: "#d5b36a" },
  tagline: { color: "#697383", fontSize: 9, letterSpacing: 2, marginTop: 4 },
  statusPill: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#29352f", borderRadius: 30, paddingHorizontal: 11, paddingVertical: 8 },
  dot: { width: 7, height: 7, borderRadius: 5, backgroundColor: "#6bd49a", marginRight: 7 },
  statusText: { color: "#9aa79f", fontSize: 9, letterSpacing: 1 },
  hero: { paddingVertical: 38 },
  eyebrow: { color: "#d5b36a", fontSize: 10, letterSpacing: 3, fontWeight: "700" },
  headline: { color: "#f4f2ed", fontSize: 38, lineHeight: 43, fontWeight: "800", marginTop: 12 },
  description: { color: "#8e98a8", fontSize: 14, lineHeight: 22, maxWidth: 520, marginTop: 12 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 22 },
  action: { borderWidth: 1, borderColor: "#343d4b", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  primaryAction: { backgroundColor: "#d5b36a", borderColor: "#d5b36a" },
  actionText: { color: "#dce1e9", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  primaryActionText: { color: "#101114" },
  compactAction: { paddingVertical: 9, paddingHorizontal: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 12 },
  sectionTitle: { color: "#e9e8e3", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  sectionMeta: { color: "#657080", fontSize: 9, letterSpacing: 1 },
  decks: { gap: 12 },
  decksWide: { flexDirection: "row" },
  deck: { flex: 1, minWidth: 0, backgroundColor: "#10151e", borderWidth: 1, borderColor: "#252e3b", borderRadius: 12, padding: 17, marginBottom: 12 },
  deckHeader: { flexDirection: "row", justifyContent: "space-between" },
  deckName: { color: "#aeb7c4", fontSize: 10, letterSpacing: 2, fontWeight: "800" },
  deckStatus: { fontSize: 9, letterSpacing: 1, fontWeight: "800" },
  trackTitle: { color: "#f2f0eb", fontSize: 20, fontWeight: "800", marginTop: 24 },
  artist: { color: "#748093", fontSize: 10, marginTop: 5, letterSpacing: 1 },
  wave: { height: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 18, overflow: "hidden" },
  waveBar: { width: 3, borderRadius: 3 },
  metrics: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#252e3b", paddingTop: 13, marginBottom: 16 },
  metricLabel: { color: "#657080", fontSize: 8, letterSpacing: 1.5, fontWeight: "700" },
  metricValue: { color: "#e5e8ee", fontSize: 15, fontWeight: "700", marginTop: 5 },
  mixerStrip: { backgroundColor: "#10151e", borderWidth: 1, borderColor: "#252e3b", borderRadius: 10, padding: 17, flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  mixerHint: { color: "#d5b36a", fontSize: 11, marginTop: 8, letterSpacing: 1 },
  queue: { backgroundColor: "#10151e", borderWidth: 1, borderColor: "#252e3b", borderRadius: 10, paddingHorizontal: 15 },
  queueRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#202630", gap: 12 },
  queueNumber: { color: "#687486", fontSize: 10, width: 20 },
  queueInfo: { flex: 1 },
  queueTitle: { color: "#e4e7ec", fontSize: 12, fontWeight: "700" },
  queueBpm: { color: "#b7c1cf", fontSize: 10 },
  queueDuration: { color: "#778294", fontSize: 10, width: 38, textAlign: "right" },
  footer: { borderTopWidth: 1, borderColor: "#202630", marginTop: 30, paddingTop: 18 },
  footerTitle: { color: "#d5b36a", fontWeight: "800", letterSpacing: 2, fontSize: 10 },
  footerText: { color: "#687486", fontSize: 11, lineHeight: 18, marginTop: 8 }
});
