import { motion, useMotionValue, useTransform } from "framer-motion";

function CircularProgress({ progress }) {
  const circleLength = useTransform(progress, [0, 100], [0, 1]);
  const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
  const circleColor = useTransform(
    progress,
    [0, 95, 100],
    ["#111827", "#111827", "#111827"]
  );

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 258 258"
    >
      {/* Check mark */}
      <motion.path
        transform="translate(60 85)"
        d="M3 50L45 92L134 3"
        fill="transparent"
        stroke="#111827"
        strokeWidth={8}
        style={{ pathLength: checkmarkPathLength }}
      />
      {/* Circle */}
      <motion.path
        d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
        fill="transparent"
        strokeWidth="8"
        stroke={circleColor}
        style={{
          pathLength: circleLength,
        }}
      />
    </motion.svg>
  );
}

export default function Checkmark() {
  const progress = useMotionValue(90);
  return (
    <div className="flex justify-center items-center w-32 h-32">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        style={{ x: progress }}
        transition={{ duration: 1 }}
      />
      <CircularProgress progress={progress} />
    </div>
  );
}