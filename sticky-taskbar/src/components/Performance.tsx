import { Cpu, MemoryStick } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";

export default function Performance(props: {
  cpu: zebar.CpuOutput | null;
  memory: zebar.MemoryOutput | null;
}) {
  return (
    <Show when={props.cpu || props.memory}>
      <div class="provider">
        <Show when={props.cpu}>
          {(cpu) => (
            <>
              <Cpu size={16} />
              <span class="mr-1">{cpu().usage.toFixed()}%</span>
            </>
          )}
        </Show>
        <Show when={props.memory}>
          {(memory) => (
            <>
              <MemoryStick size={16} />
              <span class="mr-1">{memory().usage.toFixed()}%</span>
            </>
          )}
        </Show>
      </div>
    </Show>
  );
}
