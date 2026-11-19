import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

const modules = [
  ["VOICE", "Voice assistant", "MIC"],
  ["BUSINESS", "Business hub", "BIZ"],
  ["FINANCE", "Finance overview", "FIN"],
  ["PROJECTS", "Project control", "PRJ"],
  ["RESEARCH", "Live research", "WEB"],
  ["REMINDERS", "Smart reminders", "ALERT"],
  ["IMAGES", "Image studio", "IMG"],
  ["ANALYTICS", "Analytics", "DATA"]
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("JARVIS systems online. How can I help you today?");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    const message = prompt.trim();
    if (!message || busy) return;
    setBusy(true); setError(""); setReply("");
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant could not respond.");
      setReply(data.reply || "No response received.");
      setPrompt("");
    } catch (e) {
      setError(e.message + " Check that the backend is running and EXPO_PUBLIC_API_URL points to it.");
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.topline}><Text style={styles.brand}>J.A.R.V.I.S</Text><Text style={styles.version}>PERSONAL AI SYSTEM 2.0</Text></View>
          <View style={styles.hero}>
            <Text style={styles.kicker}>SYSTEM STATUS  /  READY</Text>
            <Text style={styles.heading}>Good day.</Text>
            <Text style={styles.subheading}>Your personal intelligence interface.</Text>
            <View style={styles.orb}><View style={styles.orbInner}><Text style={styles.orbText}>J</Text></View></View>
            <Text style={styles.online}>●  CORE INTERFACE ONLINE</Text>
          </View>
          <Text style={styles.section}>COMMAND MODULES</Text>
          <View style={styles.grid}>
            {modules.map(([key,label,tag]) => <View key={key} style={styles.module}><Text style={styles.moduleTag}>{tag}</Text><Text style={styles.moduleTitle}>{label}</Text><Text style={styles.moduleState}>MODULE / INITIALIZING</Text></View>)}
          </View>
          <Text style={styles.section}>ASK JARVIS</Text>
          <View style={styles.chat}>
            <Text style={styles.chatLabel}>ASSISTANT RESPONSE</Text>
            <Text style={styles.reply}>{busy ? "Thinking…" : reply}</Text>
            {busy && <ActivityIndicator color="#4AD7F5" />}
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TextInput value={prompt} onChangeText={setPrompt} placeholder="Enter a command…" placeholderTextColor="#718096" style={styles.input} multiline />
            <Pressable onPress={sendMessage} style={styles.button}><Text style={styles.buttonText}>SEND COMMAND  →</Text></Pressable>
          </View>
          <Text style={styles.footer}>JARVIS 2.0  •  PRIVATE AI WORKSPACE</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#050B16"},flex:{flex:1},container:{padding:22,paddingBottom:40},
  topline:{marginTop:12,marginBottom:22},brand:{color:"#EAF8FF",fontSize:22,fontWeight:"800",letterSpacing:5},version:{color:"#54CDEB",fontSize:9,letterSpacing:2,marginTop:5},
  hero:{borderWidth:1,borderColor:"#16445A",borderRadius:22,padding:22,backgroundColor:"#091727",alignItems:"center",marginBottom:28},
  kicker:{color:"#52D5EF",fontSize:10,letterSpacing:2,alignSelf:"flex-start"},heading:{color:"#F3FAFF",fontSize:34,fontWeight:"700",marginTop:18},subheading:{color:"#8CA7B8",fontSize:13,marginTop:6},
  orb:{width:142,height:142,borderRadius:71,borderWidth:2,borderColor:"#35C7E8",marginTop:28,alignItems:"center",justifyContent:"center",backgroundColor:"#0B2940",shadowColor:"#28C7EE",shadowOpacity:.45,shadowRadius:24,elevation:10},
  orbInner:{width:108,height:108,borderRadius:54,borderWidth:1,borderColor:"#8CEBFF",alignItems:"center",justifyContent:"center"},orbText:{fontSize:62,color:"#B8F4FF",fontWeight:"200"},online:{color:"#63E6C2",fontSize:10,letterSpacing:1.5,marginTop:20},
  section:{color:"#79DDF3",fontSize:11,letterSpacing:2,fontWeight:"700",marginBottom:12},grid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginBottom:28},
  module:{width:"48%",minHeight:94,borderRadius:14,borderWidth:1,borderColor:"#17384D",backgroundColor:"#0A1726",padding:13},moduleTag:{color:"#4DD5F3",fontSize:10,letterSpacing:1},moduleTitle:{color:"#E6F4FA",fontSize:14,fontWeight:"600",marginTop:10},moduleState:{color:"#607D8D",fontSize:8,marginTop:8,letterSpacing:1},
  chat:{padding:16,borderWidth:1,borderColor:"#1B5269",borderRadius:16,backgroundColor:"#091727"},chatLabel:{color:"#5ED7F2",fontSize:9,letterSpacing:1.5},reply:{color:"#E4F3FA",fontSize:14,lineHeight:22,marginTop:12,minHeight:42},error:{color:"#FF9B9B",fontSize:12,marginTop:10},
  input:{borderWidth:1,borderColor:"#285267",borderRadius:10,padding:13,color:"#F4FBFF",marginTop:16,minHeight:48},button:{backgroundColor:"#1C9BBE",borderRadius:10,padding:14,alignItems:"center",marginTop:10},buttonText:{color:"#00131D",fontWeight:"800",letterSpacing:1,fontSize:11},
  footer:{color:"#536D7C",textAlign:"center",fontSize:9,letterSpacing:1.5,marginTop:28}
});
