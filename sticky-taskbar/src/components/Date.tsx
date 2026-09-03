import { Calendar } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";
import Clipboard from "./Clipboard";

export default function Performance(props: { date: zebar.DateOutput | null }) {
  return (
    <Show when={props.date}>
      {(date) => (
        <div class="provider group">
          <Clipboard
            text={(() => {
              return JSON.stringify(date(), undefined, 2);
            })()}
            placeholderIcon={
              <Calendar class="block group-hover:hidden" size={16} />
            }
          />
          <span>{date().formatted}</span>
        </div>
      )}
    </Show>
  );
}
