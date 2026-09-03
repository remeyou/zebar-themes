import { For, Show } from "solid-js";
import * as zebar from "zebar";

export default function Systray(props: {
  systray: zebar.SystrayOutput | null;
}) {
  return (
    <Show when={props.systray}>
      {(systray) => (
        <div class="provider">
          <For each={systray().icons}>
            {(icon) =>
              !icon.tooltip ||
              icon.tooltip.match(/(\: .*\d+%)|(Muted)|(Battery)/) ? null : (
                <img
                  class="h-4 w-4"
                  src={icon.iconUrl}
                  title={icon.tooltip}
                  onClick={(e) => {
                    e.preventDefault();
                    systray().onLeftClick(icon.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    systray().onRightClick(icon.id);
                  }}
                />
              )
            }
          </For>
        </div>
      )}
    </Show>
  );
}
