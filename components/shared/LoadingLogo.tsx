import Image from "next/image";


type PageProps = {
  size: number;
}
function LoadingLogo({ size = 100}: PageProps) {

  return (
    <div className="h-full w-full flex justify-center items-center ">
      <Image src="/logo.svg" alt="logo" 
      width={size} height={size}
      className="animate-pulse duration-100"
      />
    </div>
  )
}

export default LoadingLogo
