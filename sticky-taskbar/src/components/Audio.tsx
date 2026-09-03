import { HeadphoneOff, Headphones } from "lucide-solid";
import { Show } from "solid-js";
import * as zebar from "zebar";

export default function Audio(props: { audio: zebar.AudioOutput | null }) {
  return (
    <Show when={props.audio}>
      {(audio) => (
        <Show when={audio().defaultPlaybackDevice}>
          {(defaultPlaybackDevice) => (
            <div
              class="provider cursor-pointer"
              onwheel={(e) => {
                audio().setVolume(
                  e.deltaY > 0
                    ? defaultPlaybackDevice().volume - 2
                    : defaultPlaybackDevice().volume + 2,
                );
              }}
              onclick={() => {
                audio().setMute(!defaultPlaybackDevice().isMuted);
              }}
            >
              <Show
                when={defaultPlaybackDevice().isMuted}
                fallback={<Headphones size={16} />}
              >
                <HeadphoneOff size={16} />
              </Show>
              <span>{defaultPlaybackDevice().volume}%</span>
              <span>{defaultPlaybackDevice().name.match(/\((.*)\)/)?.[1]}</span>
            </div>
          )}
        </Show>
      )}
    </Show>
  );
}
