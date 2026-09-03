import { ClipboardCheck, Clipboard as ClipboardIcon } from "lucide-solid";
import { JSXElement, Show, createSignal } from "solid-js";

export default function Clipboard(props: {
  text: string;
  placeholderIcon?: JSXElement;
}) {
  const getText = () => props.text;
  const getPlaceholderIcon = () => props.placeholderIcon;
  const [timeoutID, setTimeoutID] = createSignal<number>();

  return (
    <Show
      when={timeoutID()}
      fallback={
        <>
          {getPlaceholderIcon()}
          <ClipboardIcon
            class="hidden group-hover:block"
            size={16}
            onclick={() => {
              clearTimeout(timeoutID());
              navigator.clipboard.writeText(getText()).then(() => {
                setTimeoutID(
                  setTimeout(() => {
                    setTimeoutID();
                  }, 2000),
                );
              });
            }}
          />
        </>
      }
    >
      <ClipboardCheck class="hidden group-hover:block" size={16} />
    </Show>
  );
}
