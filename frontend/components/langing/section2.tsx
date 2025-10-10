import React from "react";

const Section2 = () => {
  return (
    <div className="bg-white text-gray-800 relative">
      <main className="pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="relative">
            <div className="block lg:hidden">
              <img
                src="/how.svg"
                alt="A woman looking at her mobile phone with a slight smile"
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
              />
            </div>

            <div className="hidden lg:block relative">
              <img
                src="/how.svg"
                alt="A woman looking at her mobile phone with a slight smile"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />

              <div className="absolute top-1/2 -translate-y-1/2 left-[50px] bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-md">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">
                  How it works
                </h2>

                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                    1
                  </div>
                  <div className="text-gray-800">
                    <p className="font-semibold text-lg">
                      Post your job for free
                    </p>
                    <p className="text-gray-600">
                      Tell us what you need done in minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                    2
                  </div>
                  <div className="text-gray-800">
                    <p className="font-semibold text-lg">
                      Tradespeople responds
                    </p>
                    <p className="text-gray-600">
                      Receive multiple competitive quotes from vetted
                      professionals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                    3
                  </div>
                  <div className="text-gray-800">
                    <p className="font-semibold text-lg">
                      Chat, quote, review all in one place
                    </p>
                    <p className="text-gray-600">
                      Easily manage the entire project lifecycle with
                      transparent communication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              How it works
            </h2>

            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                1
              </div>
              <div className="text-gray-800">
                <p className="font-semibold text-lg">Post your job for free</p>
                <p className="text-gray-600">
                  Tell us what you need done in minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                2
              </div>
              <div className="text-gray-800">
                <p className="font-semibold text-lg">Tradespeople responds</p>
                <p className="text-gray-600">
                  Receive multiple competitive quotes from vetted professionals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gray-900 text-white text-lg font-bold rounded-full mt-1 shadow-md">
                3
              </div>
              <div className="text-gray-800">
                <p className="font-semibold text-lg">
                  Chat, quote, review all in one place
                </p>
                <p className="text-gray-600">
                  Easily manage the entire project lifecycle with transparent
                  communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Section2;
