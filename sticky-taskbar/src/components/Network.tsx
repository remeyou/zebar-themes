import { ArrowDown, ArrowUp } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";

export default function Network(props: {
  network: zebar.NetworkOutput | null;
}) {
  const getNetworkInfo = () => {
    if (!props.network) {
      return "";
    }
    return (
      JSON.stringify(props.network.traffic, undefined, 2) +
      "\n" +
      JSON.stringify(props.network.defaultInterface, undefined, 2)
    );
  };

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
