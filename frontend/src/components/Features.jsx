import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      id: 1,
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over LKR500. Fast and reliable delivery to your doorstep.',
    },
    {
      id: 2,
      icon: FiShield,
      title: 'Secure Payment',
      description: 'Your payment information is encrypted and secure. Shop with confidence.',
    },
    {
      id: 3,
      icon: FiRotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy. If you are not satisfied, we will refund your money.',
    },
    {
      id: 4,
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Our customer support team is available 24/7 to help you with any questions.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
