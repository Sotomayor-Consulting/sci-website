import { tv } from "tailwind-variants";

export const marquee = tv({
  base: "relative flex overflow-hidden",
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full flex-col",
    },
    fade: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      fade: true,
      class:
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
    },
    {
      orientation: "vertical",
      fade: true,
      class:
        "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    fade: true,
  },
});

export const marqueeTrack = tv({
  base: "flex min-w-0 shrink-0 will-change-transform",
  variants: {
    orientation: {
      horizontal: "w-max min-w-full flex-row items-center",
      vertical: "h-max min-h-full w-full flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const marqueeGroup = tv({
  base: "flex shrink-0 justify-around gap-(--marquee-gap)",
  variants: {
    orientation: {
      horizontal: "flex-row items-center pr-(--marquee-gap)",
      vertical: "w-full flex-col pb-(--marquee-gap)",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});
