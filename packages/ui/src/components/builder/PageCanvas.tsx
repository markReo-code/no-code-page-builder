import React from "react";

const PageCanvas = () => {
  return (
    <section className="flex justify-center items-start min-w-0 min-h-full p-[32px_24px] bg-[#f5f7fb]">
      <div className="w-[min(100%,720px)] min-h-[800px] p-10 bg-white border border-[#e5e7eb] rounded">
        <h1>Welcome to the Builder</h1>
        <p>Start editing your page here...</p>
        <button>Get Started</button>
      </div>
    </section>
  );
};

export default PageCanvas;
