export const generateRandomPastelHexColor = (): string => {
  // Generate pastel colors with similar intensity to #a0baf0
  // One channel high (220-255), others moderate (140-200)

  const channels = [0, 0, 0];
  const dominantChannel = Math.floor(Math.random() * 3); // 0=red, 1=green, 2=blue

  // Set dominant channel high for vibrant pastel
  channels[dominantChannel] = Math.floor(Math.random() * 35 + 220); // 220-255

  // Set other channels to moderate values for pastel effect
  for (let i = 0; i < 3; i++) {
    if (i !== dominantChannel) {
      channels[i] = Math.floor(Math.random() * 60 + 140); // 140-200
    }
  }

  const [r, g, b] = channels;

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
