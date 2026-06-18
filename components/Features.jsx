const features = [
  {
    title: "Nearby Discovery",
    desc: "Find restaurants, stores, and services around you.",
  },
  {
    title: "Real-Time Updates",
    desc: "Get instant alerts on local events and trending spots.",
  },
  {
    title: "Community Powered",
    desc: "Users contribute reviews, pins, and recommendations.",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Why Choose PushThePin?
          </h2>

          <p className="text-gray-500 mt-4">
            Built for modern hyperlocal experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">
                📌
              </div>

              <h3 className="text-2xl font-bold mt-6">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-4">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}