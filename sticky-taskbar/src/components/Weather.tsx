import {
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Moon,
  Sun,
  Thermometer,
} from "lucide-solid";
import { Accessor, JSXElement, Show } from "solid-js";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";

export default function Weather(props: {
  weather: zebar.WeatherOutput | null;
  ip: zebar.IpOutput | null;
}) {
  const getPlaceholderIcon = (weather: Accessor<zebar.WeatherOutput>) => {
    const icons: Record<zebar.WeatherStatus, JSXElement> = {
      clear_day: <Sun class="block group-hover:hidden" size={16} />,
      clear_night: <Moon class="block group-hover:hidden" size={16} />,
      cloudy_day: <CloudSun class="block group-hover:hidden" size={16} />,
      cloudy_night: <CloudMoon class="block group-hover:hidden" size={16} />,
      light_rain_day: (
        <CloudSunRain class="block group-hover:hidden" size={16} />
      ),
      light_rain_night: (
        <CloudMoonRain class="block group-hover:hidden" size={16} />
      ),
      heavy_rain_day: <CloudRain class="block group-hover:hidden" size={16} />,
      heavy_rain_night: (
        <CloudRain class="block group-hover:hidden" size={16} />
      ),
      snow_day: <CloudSnow class="block group-hover:hidden" size={16} />,
      snow_night: <CloudSnow class="block group-hover:hidden" size={16} />,
      thunder_day: (
        <CloudLightning class="block group-hover:hidden" size={16} />
      ),
      thunder_night: (
        <CloudLightning class="block group-hover:hidden" size={16} />
      ),
    };
    return (
      icons[weather().status] ?? (
        <Thermometer class="block group-hover:hidden" size={16} />
      )
    );
  };
  return (
    <Show when={props.weather}>
      {(weather) => (
        <div class="provider group">
          <Clipboard
            text={
              JSON.stringify(props.ip, undefined, 2) +
              "\n" +
              JSON.stringify(weather(), undefined, 2)
            }
            placeholderIcon={getPlaceholderIcon(weather)}
          />
          <span>{weather().celsiusTemp}</span>
          <span>°C</span>
        </div>
      )}
    </Show>
  );
}
