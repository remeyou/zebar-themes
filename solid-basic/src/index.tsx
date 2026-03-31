import { Cpu, Keyboard, MemoryStick, Plus } from "lucide-solid";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { For, render } from "solid-js/web";
import * as zebar from "zebar";
import { useSystemDarkMode } from "./hooks";
import "./index.css";

const providers = zebar.createProviderGroup({
  audio: { type: "audio" },
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  systray: { type: "systray" },
  date: { type: "date" },
  glazewm: { type: "glazewm" },
  keyboard: { type: "keyboard" },
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
    allWorkspaces: typeof output.glazewm.allWorkspaces,
  ) => {
    for (let i = 0; i < 9; i++) {
      const curr = String(i + 1);
      if (curr !== allWorkspaces[i]?.name) {
        return curr;
      }
    }
  };

  return (
    <div
      class="flex h-8 items-center px-1 text-center text-xs dark:text-white"
      onwheel={(e) => {
        if (e?.deltaY > 0) {
          output.glazewm.runCommand("focus --next-active-workspace");
        }
        if (e?.deltaY < 0) {
          output.glazewm.runCommand("focus --prev-active-workspace");
        }
      }}
    >
      <div class="section">
        {output.glazewm && (
          <div
            class="provider"
            onclick={() => output.glazewm.runCommand("toggle-tiling-direction")}
          >
            <button class="cursor-pointer p-0.5">
              {output.glazewm.tilingDirection}
            </button>
          </div>
        )}
        {output.glazewm?.allWorkspaces && (
          <div class="provider">
            {output.glazewm.isPaused ? (
              <button
                class="cursor-pointer rounded p-0.5 text-center"
                onclick={() => output.glazewm.runCommand("wm-toggle-pause")}
              >
                paused
              </button>
            ) : (
              output.glazewm.allWorkspaces
                .map((workspace) => (
                  <button
                    class={`flex cursor-pointer gap-1 rounded px-2 py-0.5 text-center ${workspace.hasFocus ? "bg-white shadow dark:bg-black" : "text-gray-400"}`}
                    onclick={() =>
                      output.glazewm.runCommand(
                        workspace.hasFocus
                          ? "wm-toggle-pause"
                          : `focus --workspace ${workspace.name}`,
                      )
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      output.glazewm.runCommand(
                        `move --workspace ${workspace.name}`,
                      );
                      output.glazewm.runCommand(
                        `focus --workspace ${workspace.name}`,
                      );
                    }}
                  >
                    <span>{workspace.name}</span>
                    {output.glazewm.allWindows
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
                          class="cursor-pointer rounded px-4 py-0.5 text-center text-gray-400"
                          onclick={() =>
                            output.glazewm.runCommand(
                              `focus --workspace ${getUnusedWorkspaceName(output.glazewm.allWorkspaces)}`,
                            )
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
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
        {output.systray && (
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
                      output.systray.onLeftClick(icon.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      output.systray.onRightClick(icon.id);
                    }}
                  />
                )
              }
            </For>
          </div>
        )}
        {output.keyboard && (
          <div class="provider">
            <Keyboard size={16} />
            <span>{output.keyboard.layout}</span>
          </div>
        )}
        {output.audio && (
          <div class="provider">
            {/* <span class="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap"> */}
            <span>{output.audio.defaultPlaybackDevice.name}</span>
            <span>
              {output.audio.defaultPlaybackDevice.isMuted
                ? 0
                : output.audio.defaultPlaybackDevice.volume}
              %
            </span>
          </div>
        )}
        {output.cpu && (
          <div class="provider">
            <Cpu size={16} />
            <span>{output.cpu.usage.toFixed()}%</span>
          </div>
        )}
        {output.memory && (
          <div class="provider">
            <MemoryStick size={16} />
            <span>{output.memory.usage.toFixed()}%</span>
          </div>
        )}
        {output.date && (
          <div class="provider">
            <span>{output.date.formatted}</span>
          </div>
        )}
      </div>
    </div>
  );
}
