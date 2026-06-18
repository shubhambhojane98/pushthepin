export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center">
      {" "}
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {" "}
        <div>
          {" "}
          <span className="bg-red-100 text-primary px-4 py-2 rounded-full text-sm font-semibold">
            {" "}
            Hyperlocal Discovery Platform{" "}
          </span>{" "}
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mt-6">
            {" "}
            Find Everything{" "}
            <span className="text-primary"> Around You</span>{" "}
          </h1>{" "}
          <p className="text-gray-600 text-lg mt-6 max-w-xl">
            {" "}
            PushThePin helps users discover nearby shops, events, services, food
            spots, and hidden gems instantly in real time.{" "}
          </p>{" "}
          <div className="flex gap-4 mt-8">
            {" "}
            <button className="bg-primary text-black px-7 py-4 rounded-xl font-semibold hover:scale-105 transition">
              {" "}
              Get Started{" "}
            </button>{" "}
            <button className="border border-gray-300 px-7 py-4 rounded-xl font-semibold hover:bg-white transition">
              {" "}
              Explore Nearby{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex gap-10 mt-10">
            {" "}
            <div>
              {" "}
              <h3 className="text-3xl font-bold">10K+</h3>{" "}
              <p className="text-gray-500">Local Listings</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="text-3xl font-bold">500+</h3>{" "}
              <p className="text-gray-500">Cities Covered</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="text-3xl font-bold">1M+</h3>{" "}
              <p className="text-gray-500">Monthly Users</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="relative">
          {" "}
          <div className="bg-white shadow-2xl rounded-3xl p-6">
            {" "}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
              alt="map"
              className="rounded-2xl object-cover h-[500px] w-full"
            />{" "}
          </div>{" "}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
            {" "}
            <p className="font-bold text-lg">📍 Live Nearby Updates</p>{" "}
            <p className="text-gray-500 text-sm">
              {" "}
              Discover trending places instantly{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
