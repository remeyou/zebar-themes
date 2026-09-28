import { ArrowDown, ArrowUp } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";

export default function Network(props: {
  network: zebar.NetworkOutput | null;
}) {
  const getNetworkInfo = () => JSON.stringify(props.network, undefined, 2);

  return (
    <Show when={props.network?.traffic}>
      {(traffic) => (
        <div class="provider group">
          <Show
            when={traffic().transmitted.bytes > traffic().received.bytes}
            fallback={
              <>
                <Clipboard
                  text={getNetworkInfo()}
                  placeholderIcon={
                    <ArrowDown class="block group-hover:hidden" size={16} />
                  }
                />
                <span>{traffic().received.siValue.toFixed(1)}</span>
                <span>{traffic().received.siUnit}</span>
              </>
            }
          >
            <Clipboard
              text={getNetworkInfo()}
              placeholderIcon={
                <ArrowUp class="block group-hover:hidden" size={16} />
              }
            />
            <span>{traffic().transmitted.siValue.toFixed(1)}</span>
            <span>{traffic().transmitted.siUnit}</span>
          </Show>
        </div>
      )}
    </Show>
  );
}
