import React from 'react';

const ProductStory = ({ category, className = "" }) => {
  const getStory = (cat) => {
    const stories = {
      'Teeshirt': {
        en: 'Forged for first show vibes.',
        te: 'ఫస్ట్ షో ఫీల్స్ కోసం.'
      },
      'Hoodies': {
        en: 'Built for midnight missions.',
        te: 'అర్ధరాత్రి మిషన్స్ కోసం.'
      },
      'Posters': {
        en: 'Your wall, your rebellion.',
        te: 'మీ గోడ, మీ తిరుగుబాటు.'
      },
      'Accessories': {
        en: 'Small gear, big impact.',
        te: 'చిన్న గేర్, పెద్ద ప్రభావం.'
      },
      'Vault': {
        en: 'Reserved for the chosen few.',
        te: 'ఎంపిక చేసిన కొద్దిమందికి మాత్రమే.'
      },
      default: {
        en: 'Built for rebels who demand more.',
        te: 'మరింత కోరుకునే తిరుగుబాటుదారుల కోసం.'
      }
    };

    return stories[cat] || stories.default;
  };

  const story = getStory(category);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-sm text-gray-300 font-medium">{story.en}</div>
      <div className="text-xs text-gray-400">{story.te}</div>
    </div>
  );
};

export default ProductStory;