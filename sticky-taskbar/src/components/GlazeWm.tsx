import { Plus } from "lucide-solid";
import { For, Show } from "solid-js";
import * as zebar from "zebar";

export default function GlazeWm(props: {
  glazewm: zebar.GlazeWmOutput | null;
}) {
  const getUnusedWorkspaceName = (
    allWorkspaces: zebar.GlazeWmOutput["allWorkspaces"],
  ) => {
    for (let i = 0; i < 9; i++) {
      const curr = String(i + 1);
      if (curr !== allWorkspaces[i]?.name) {
        return curr;
      }
    }
  };

  return (
    <Show when={props.glazewm}>
      {(glazewm) => (
        <>
          <div
            class="provider"
            onclick={() => glazewm().runCommand("toggle-tiling-direction")}
            onContextMenu={(e) => {
              e.preventDefault();
              glazewm().runCommand("wm-redraw");
            }}
          >
            <button class="cursor-pointer p-0.5">
              {glazewm().tilingDirection}
            </button>
          </div>
          <div
            class="provider"
            onwheel={(e) => {
              e.deltaY > 0
                ? glazewm().runCommand("focus --next-active-workspace")
                : glazewm().runCommand("focus --prev-active-workspace");
            }}
          >
            <Show
              when={!glazewm().isPaused}
              fallback={
                <button
                  class="cursor-pointer rounded p-0.5 text-center"
                  onclick={() => glazewm().runCommand("wm-toggle-pause")}
                >
                  paused
                </button>
              }
            >
              <For each={glazewm().allWorkspaces}>
                {(workspace) => (
                  <button
                    class={`flex min-w-11 cursor-pointer justify-center gap-1 rounded px-2 py-0.5 ${workspace.hasFocus ? "bg-gray-800/10 shadow dark:bg-gray-200/10" : "text-gray-600 dark:text-gray-400"}`}
                    onclick={() =>
                      glazewm().runCommand(
                        workspace.hasFocus
                          ? "wm-toggle-pause"
                          : `focus --workspace ${workspace.name}`,
                      )
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      glazewm().runCommand(
                        `move --workspace ${workspace.name}`,
                      );
                      glazewm().runCommand(
                        `focus --workspace ${workspace.name}`,
                      );
                    }}
                  >
                    <span>{workspace.name}</span>
                    <For
                      each={glazewm().allWindows.filter(
                        (window) => window.parentId === workspace.id,
                      )}
                    >
                      {(window) => (
                        <span
                          title={window.title}
                          class={`max-w-15 overflow-hidden text-ellipsis whitespace-nowrap ${window.hasFocus ? "font-bold" : ""}`}
                        >
                          {window.title}
                        </span>
                      )}
                    </For>
                  </button>
                )}
              </For>
              <Show when={glazewm().allWorkspaces.length < 9}>
                <button
                  class="cursor-pointer rounded px-4 py-0.5 text-center text-gray-600 dark:text-gray-400"
                  onclick={() => {
                    glazewm().runCommand(
                      `focus --workspace ${getUnusedWorkspaceName(glazewm().allWorkspaces)}`,
                    );
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const unusedWorkspaceName = getUnusedWorkspaceName(
                      glazewm().allWorkspaces,
                    );
                    glazewm().runCommand(
                      `move --workspace ${unusedWorkspaceName}`,
                    );
                    glazewm().runCommand(
                      `focus --workspace ${unusedWorkspaceName}`,
                    );
                  }}
                >
                  <Plus strokeWidth={3} size={14} />
                </button>
              </Show>
            </Show>
          </div>
        </>
      )}
    </Show>
  );
}
