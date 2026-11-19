const API = "http://127.0.0.1:8787";
const $ = (id) => document.getElementById(id);
const messages = $("messages");
let busy = false;
function addMessage(role, text, error = false) {
  const item = document.createElement("div");
  item.className = "message " + role + (error ? " error" : "");
  const label = document.createElement("span"); label.className = "message-label"; label.textContent = role === "user" ? "YOU" : "JARVIS";
  const body = document.createElement("p"); body.textContent = text;
  item.append(label, body); messages.append(item); messages.scrollTop = messages.scrollHeight;
}
async function checkHealth() {
  try {
    const response = await fetch(API + "/api/health");
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    $("api-status").textContent = "JARVIS CORE ONLINE";
    $("core-state").textContent = "ONLINE";
    $("provider").textContent = data.providers?.groqConfigured ? "GROQ" : data.providers?.huggingFaceConfigured ? "HUGGING FACE" : "NEEDS SETUP";
  } catch {
    $("api-status").textContent = "API OFFLINE · CHECK SERVER";
    $("core-state").textContent = "OFFLINE";
    $("provider").textContent = "NOT CONNECTED";
  }
}
async function sendMessage(text) {
  if (!text.trim() || busy) return;
  busy = true; $("send-button").disabled = true;
  addMessage("user", text);
  try {
    const response = await fetch(API + "/api/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Assistant request failed");
    addMessage("assistant", data.reply);
    $("provider").textContent = data.provider || "CONNECTED";
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  } catch (error) { addMessage("assistant", error.message + ". Check server/.env and the local API.", true); }
  finally { busy = false; $("send-button").disabled = false; }
}
$("chat-form").addEventListener("submit", (event) => {event.preventDefault(); const field=$("prompt"); const text=field.value.trim(); field.value=""; sendMessage(text);});
$("prompt").addEventListener("keydown", (event) => {if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();$("chat-form").requestSubmit();}});
$("focus-chat").addEventListener("click", () => $("prompt").focus());
$("speak-intro").addEventListener("click", async () => {
  const greeting = "Hello. JARVIS desktop interface is ready. How may I assist you?";
  if (window.jarvisDesktop?.speak) await window.jarvisDesktop.speak(greeting);
  else if ("speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(greeting));
});
$("configure-ai").addEventListener("click", async () => {
  const result = await window.jarvisDesktop?.openConfig();
  if (result) addMessage("assistant", "Your private AI settings file could not be opened: " + result);
  else addMessage("assistant", "AI settings opened. Add your provider key, save the file, then restart JARVIS.");
});
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition(); recognition.lang = "en-US"; recognition.interimResults = false;
  recognition.onstart = () => {$("voice-hint").textContent = "Listening…";};
  recognition.onresult = (event) => {$("prompt").value = event.results[0][0].transcript;};
  recognition.onerror = () => {$("voice-hint").textContent = "Voice input unavailable. Check microphone permission.";};
  recognition.onend = () => {$("voice-hint").textContent = "Enter to send · Shift + Enter for a new line";};
  $("voice-button").addEventListener("click", () => recognition.start());
} else {
  $("voice-button").disabled = true; $("voice-hint").textContent = "Voice recognition is not supported in this runtime.";
}
document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  const view = button.dataset.view;
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view===view));
  const labels={overview:"Command overview",assistant:"AI Assistant",voice:"Voice Console",projects:"Project control",business:"Business hub",research:"Web research",studio:"Image studio"};
  $("page-title").textContent=labels[view]||"Command overview";
  if(view==="assistant"||view==="voice") $("prompt").focus();
  if(!["overview","assistant","voice"].includes(view)) addMessage("assistant", labels[view]+" is planned and is not connected yet.");
}));
(async () => {
  try {
    const info = await window.jarvisDesktop.getSystemInfo();
    $("platform").textContent = info.platform === "darwin" ? "macOS" : info.platform;
    $("os-release").textContent = "System " + info.release + " · App " + info.appVersion;
  } catch {}
  checkHealth(); setInterval(checkHealth, 15000);
})();
