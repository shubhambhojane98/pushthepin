export default function HowItWorks() {
  const steps = [
    "Search your area",
    "Discover trending local spots",
    "Pin & share recommendations",
  ];
  return (
    <section className="py-24 bg-gray-100">
      {" "}
      <div className="max-w-6xl mx-auto px-6 text-center">
        {" "}
        <h2 className="text-4xl font-bold"> How It Works </h2>{" "}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {" "}
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-3xl p-10 shadow-sm">
              {" "}
              <div className="w-14 h-14 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                {" "}
                {i + 1}{" "}
              </div>{" "}
              <h3 className="text-2xl font-semibold mt-6"> {step} </h3>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
