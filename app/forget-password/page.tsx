"use client";
import ForgetPasswordForm from "./_components/forget-password";
import LogoHover from "../_components/logo";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
       <div className="absolute inset-0 bg-linear-to-b from-black via-gray-900 to-gray-800" />
      <div className="absolute inset-0 bg-[url('/fog1.png')] opacity-25 animate-fogMove bg-cover bg-center" />
      <div className="absolute inset-0 bg-[url('/fog2.png')] opacity-15 animate-fogMoveReverse bg-cover bg-center" />
      <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(255,0,100,0.2),transparent_70%)] blur-3xl animate-pulseSlow"></div>
      <div className="absolute bottom-1/4 right-1/5 w-[35vw] h-[35vh] bg-[radial-gradient(circle,rgba(0,150,255,0.15),transparent_80%)] blur-2xl animate-pulseSlow delay-700"></div>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(550)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-floatParticle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
       <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 py-10">
        <div className="hidden md:flex justify-center md:justify-end w-full md:w-1/2">
          <LogoHover
            className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] xl:w-[650px] xl:h-[650px] 2xl:w-[800px] 2xl:h-[800px]"
          />
        </div>  
        <ForgetPasswordForm />
       </div>
       
      
    </div>
  );
}
