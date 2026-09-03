import { Keyboard as KeyboardIcon } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";

export default function Keyboard(props: {
  keyboard: zebar.KeyboardOutput | null;
}) {
  return (
    <Show when={props.keyboard}>
      {(keyboard) => (
        <div class="provider">
          <KeyboardIcon size={16} />
          <span>{keyboard().layout}</span>
        </div>
      )}
    </Show>
  );
}
