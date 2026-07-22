import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Cpu,
  HeadphoneOff,
  Headphones,
  MemoryStick,
  Plus,
  Thermometer,
} from "lucide-solid";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";
import { useSystemDarkMode } from "./hooks";
import "./index.css";

const providers = zebar.createProviderGroup({
  audio: { type: "audio" },
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  // systray: { type: "systray" },
  glazewm: { type: "glazewm" },
  ip: { type: "ip" },
  date: { type: "date" },
  network: { type: "network" },
  weather: { type: "weather" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  useSystemDarkMode();

  const [output, setOutput] = createStore(providers.outputMap);
  providers.onOutput((outputMap) => setOutput(outputMap));

  createEffect(() => {
    if (output.glazewm?.isPaused === false) {
      location.reload();
    }
  });

  const getUnusedWorkspaceName = (
    allWorkspaces: zebar.GlazeWmOutput["allWorkspaces"] | undefined[],
  ) => {
    for (let i = 0; i < 9; i++) {
      const curr = String(i + 1);
      if (curr !== allWorkspaces[i]?.name) {
        return curr;
      }
    }
  };

  const getWeatherInfo = () => {
    return (
      JSON.stringify(output.ip, undefined, 2) +
      "\n" +
      JSON.stringify(output.weather, undefined, 2)
    );
  };

  const getNetworkInfo = () => {
    if (!output.network) {
      return "";
    }
    return (
      JSON.stringify(output.network.traffic, undefined, 2) +
      "\n" +
      JSON.stringify(output.network.defaultInterface, undefined, 2)
    );
  };

  function getDateInfo() {
    return JSON.stringify(output.date, undefined, 2);
  }

  return (
    <div class="flex h-8 items-center px-1 text-center text-xs dark:text-white">
      <div class="section">
        {output.glazewm && (
          <div
            class="provider"
            onclick={() =>
              output.glazewm?.runCommand("toggle-tiling-direction")
            }
          >
            <button class="cursor-pointer p-0.5">
              {output.glazewm.tilingDirection}
            </button>
          </div>
        )}
        {output.glazewm && (
          <div
            class="provider"
            onwheel={(e) => {
              if (!output.glazewm) {
                return;
              }
              if (e.deltaY > 0) {
                output.glazewm.runCommand("focus --next-active-workspace");
              }
              if (e.deltaY < 0) {
                output.glazewm.runCommand("focus --prev-active-workspace");
              }
            }}
          >
            {output.glazewm.isPaused ? (
              <button
                class="cursor-pointer rounded p-0.5 text-center"
                onclick={() => output.glazewm?.runCommand("wm-toggle-pause")}
              >
                paused
              </button>
            ) : (
              output.glazewm.allWorkspaces
                .map((workspace) => (
                  <button
                    class={`flex min-w-11 cursor-pointer justify-center gap-1 rounded px-2 py-0.5 ${workspace.hasFocus ? "bg-gray-800/10 shadow dark:bg-gray-200/10" : "text-gray-500 dark:text-gray-400"}`}
                    onclick={() =>
                      output.glazewm?.runCommand(
                        workspace.hasFocus
                          ? "wm-toggle-pause"
                          : `focus --workspace ${workspace.name}`,
                      )
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (!output.glazewm) {
                        return;
                      }
                      output.glazewm.runCommand(
                        `move --workspace ${workspace.name}`,
                      );
                      output.glazewm.runCommand(
                        `focus --workspace ${workspace.name}`,
                      );
                    }}
                  >
                    <span>{workspace.name}</span>
                    {output.glazewm?.allWindows
                      .filter((window) => window.parentId === workspace.id)
                      .map((window) => (
                        <span
                          title={window.title}
                          class={`max-w-15 overflow-hidden text-ellipsis whitespace-nowrap ${window.hasFocus ? "font-bold" : ""}`}
                        >
                          {window.title}
                        </span>
                      ))}
                  </button>
                ))
                .concat(
                  output.glazewm.allWorkspaces.length < 9
                    ? [
                        <button
                          class="cursor-pointer rounded px-4 py-0.5 text-center text-gray-600 dark:text-gray-400"
                          onclick={() => {
                            if (!output.glazewm) {
                              return;
                            }
                            output.glazewm.runCommand(
                              `focus --workspace ${getUnusedWorkspaceName(output.glazewm.allWorkspaces)}`,
                            );
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (!output.glazewm) {
                              return;
                            }
                            const unusedWorkspaceName = getUnusedWorkspaceName(
                              output.glazewm.allWorkspaces,
                            );
                            output.glazewm.runCommand(
                              `move --workspace ${unusedWorkspaceName}`,
                            );
                            output.glazewm.runCommand(
                              `focus --workspace ${unusedWorkspaceName}`,
                            );
                          }}
                        >
                          <Plus strokeWidth={3} size={14} />
                        </button>,
                      ]
                    : [],
                )
            )}
          </div>
        )}
      </div>
      <div class="section">
        {/* {output.systray && (
          <div class="provider">
            <For
              each={output.systray.icons.toSorted((a, b) =>
                a.tooltip < b.tooltip ? -1 : 1,
              )}
            >
              {(icon) =>
                !icon.tooltip ||
                icon.tooltip.match(/(\: .*\d+%)|(Muted)|(Battery)/) ? null : (
                  <img
                    class="h-4 w-4"
                    src={icon.iconUrl}
                    title={icon.tooltip}
                    onClick={(e) => {
                      e.preventDefault();
                      output.systray?.onLeftClick(icon.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      output.systray?.onRightClick(icon.id);
                    }}
                  />
                )
              }
            </For>
          </div>
        )} */}
        {/* {output.keyboard && (
          <div class="provider">
            <Keyboard size={16} />
            <span>{output.keyboard.layout}</span>
          </div>
        )} */}
        {output.weather && (
          <div class="provider group" title={getWeatherInfo()}>
            <Clipboard
              text={getWeatherInfo()}
              placeholderIcon={
                <Thermometer class="block group-hover:hidden" size={16} />
              }
            />
            <span>{output.weather.celsiusTemp}</span>
            <span>°C</span>
            <span>{output.weather.status.match(/[a-z]+/)?.[0]}</span>
          </div>
        )}
        {output.ip && output.network?.traffic && (
          <div class="provider group" title={getNetworkInfo()}>
            {output.network.traffic.transmitted.bytes >
            output.network.traffic.received.bytes ? (
              <>
                <Clipboard
                  text={getNetworkInfo()}
                  placeholderIcon={
                    <ArrowUp class="block group-hover:hidden" size={16} />
                  }
                />
                <span>
                  {output.network.traffic.transmitted.siValue.toFixed(1)}
                </span>
                <span>{output.network.traffic.transmitted.siUnit}</span>
              </>
            ) : (
              <>
                <Clipboard
                  text={getNetworkInfo()}
                  placeholderIcon={
                    <ArrowDown class="block group-hover:hidden" size={16} />
                  }
                />
                <span>
                  {output.network.traffic.received.siValue.toFixed(1)}
                </span>
                <span>{output.network.traffic.received.siUnit}</span>
              </>
            )}
          </div>
        )}
        {output.audio?.defaultPlaybackDevice && (
          <div
            class="provider cursor-pointer"
            onwheel={(e) => {
              e.stopPropagation();
              if (!output.audio?.defaultPlaybackDevice) {
                return;
              }
              if (e.deltaY > 0) {
                output.audio.setVolume(
                  output.audio.defaultPlaybackDevice.volume - 2,
                );
              }
              if (e.deltaY < 0) {
                output.audio.setVolume(
                  output.audio.defaultPlaybackDevice.volume + 2,
                );
              }
            }}
            onclick={() => {
              if (!output.audio?.defaultPlaybackDevice) {
                return;
              }
              output.audio.setMute(!output.audio.defaultPlaybackDevice.isMuted);
            }}
          >
            {output.audio.defaultPlaybackDevice.isMuted ? (
              <HeadphoneOff size={16} />
            ) : (
              <Headphones size={16} />
            )}
            {/* <span class="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap"> */}
            <span>
              {output.audio.defaultPlaybackDevice.isMuted
                ? 0
                : output.audio.defaultPlaybackDevice.volume}
              %
            </span>
            <span>
              {output.audio.defaultPlaybackDevice.name.match(/\((.*)\)/)?.[1]}
            </span>
          </div>
        )}
        {output.cpu && output.memory && (
          <div class="provider">
            <Cpu size={16} />
            <span class="mr-1">{output.cpu.usage.toFixed()}%</span>
            <MemoryStick size={16} />
            <span>{output.memory.usage.toFixed()}%</span>
          </div>
        )}
        {output.date && (
          <div class="provider group" title={getDateInfo()}>
            <Clipboard
              text={getDateInfo()}
              placeholderIcon={
                <Calendar class="block group-hover:hidden" size={16} />
              }
            />

            <span>{output.date.formatted}</span>
          </div>
        )}
      </div>
    </div>
  );
}
