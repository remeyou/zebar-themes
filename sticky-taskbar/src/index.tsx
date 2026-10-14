import { createStore } from "solid-js/store";
import { render } from "solid-js/web";
import * as zebar from "zebar";
import Audio from "./components/Audio";
import Date from "./components/Date";
import GlazeWm from "./components/GlazeWm";
import Performance from "./components/Performance";
import Weather from "./components/Weather";
import { useSystemDarkMode } from "./hooks";
import "./index.css";

const providers = zebar.createProviderGroup({
  audio: { type: "audio" },
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  glazewm: { type: "glazewm" },
  ip: { type: "ip" },
  date: { type: "date", refreshInterval: 5000 },
  // network: { type: "network" },
  weather: { type: "weather" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  useSystemDarkMode();

  const [output, setOutput] = createStore(providers.outputMap);
  providers.onOutput((outputMap) => setOutput(outputMap));

  return (
    <div class="flex h-8 items-center px-1 text-center text-xs dark:text-white">
      <div class="section">
        <GlazeWm glazewm={output.glazewm} />
      </div>
      <div class="section">
        <Weather weather={output.weather} ip={output.ip} />
        {/* [[Bug] Zebar Frequently Requests GPS on Windows 11 · Issue #256 · glzr-io/zebar](https://github.com/glzr-io/zebar/issues/256) */}
        {/* <Network network={output.network} /> */}
        <Audio audio={output.audio} />
        <Performance cpu={output.cpu} memory={output.memory} />
        <Date date={output.date} />
      </div>
    </div>
  );
}
