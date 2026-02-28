import { useCallback } from "react";

interface UseWheelSelectRHFProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  loop?: boolean;
}

export function useWheelSelectRHF<T>({
  options,
  value,
  onChange,
  loop = true,
}: UseWheelSelectRHFProps<T>) {
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const currentIndex = options.indexOf(value);
      if (currentIndex === -1) return;

      if (e.deltaY > 0) {
        // scroll down
        if (currentIndex < options.length - 1) {
          onChange(options[currentIndex + 1]);
        } else if (loop) {
          onChange(options[0]);
        }
      }

      if (e.deltaY < 0) {
        // scroll up
        if (currentIndex > 0) {
          onChange(options[currentIndex - 1]);
        } else if (loop) {
          onChange(options[options.length - 1]);
        }
      }
    },
    [options, value, onChange, loop],
  );

  return { onWheel: handleWheel };
}

interface UseWheelSelectProps<T> {
  options: T[];
  value: T;
  setValue: (value: T) => void;
  loop?: boolean;
}

export function useWheelSelect<T>({
  options,
  value,
  setValue,
  loop = true,
}: UseWheelSelectProps<T>) {
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const currentIndex = options.indexOf(value);
      if (currentIndex === -1) return;

      if (e.deltaY > 0) {
        if (currentIndex < options.length - 1) {
          setValue(options[currentIndex + 1]);
        } else if (loop) {
          setValue(options[0]);
        }
      }

      if (e.deltaY < 0) {
        if (currentIndex > 0) {
          setValue(options[currentIndex - 1]);
        } else if (loop) {
          setValue(options[options.length - 1]);
        }
      }
    },
    [options, value, setValue, loop],
  );

  return { onWheel: handleWheel };
}
