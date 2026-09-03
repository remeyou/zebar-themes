import { Cpu, MemoryStick } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";

export default function Performance(props: {
  cpu: zebar.CpuOutput | null;
  memory: zebar.MemoryOutput | null;
}) {
  return (
    <Show when={props.cpu}>
      {(cpu) => (
        <Show when={props.memory}>
          {(memory) => (
            <div class="provider">
              <Cpu size={16} />
              <span class="mr-1">{cpu().usage.toFixed()}%</span>
              <MemoryStick size={16} />
              <span>{memory().usage.toFixed()}%</span>
            </div>
          )}
        </Show>
      )}
    </Show>
  );
}
