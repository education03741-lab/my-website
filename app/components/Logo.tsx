import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="GlowSkin"
      width={180}
      height={145}
      className="h-14 w-auto"
      priority
    />
  );
}