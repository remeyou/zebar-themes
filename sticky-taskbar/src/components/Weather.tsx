import { Thermometer } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";

export default function Weather(props: {
  weather: zebar.WeatherOutput | null;
  ip: zebar.IpOutput | null;
}) {
  return (
    <Show when={props.weather}>
      {(weather) => (
        <div class="provider group">
          <Clipboard
            text={(() => {
              return (
                JSON.stringify(props.ip, undefined, 2) +
                "\n" +
                JSON.stringify(weather(), undefined, 2)
              );
            })()}
            placeholderIcon={
              <Thermometer class="block group-hover:hidden" size={16} />
            }
          />
          <span>{weather().celsiusTemp}</span>
          <span>°C</span>
          <span>{weather().status.match(/[a-z]+/)?.[0]}</span>
        </div>
      )}
    </Show>
  );
}
