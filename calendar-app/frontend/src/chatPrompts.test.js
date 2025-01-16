const { handleChatMessage } = require('./App'); // Adjust the import based on your file structure

const prompts = [
  { prompt: 'Meditate tomorrow at 9AM', expectedDate: '2025-01-16', expectedTime: '09:00' },
  { prompt: 'Meeting in 3 days at 2PM', expectedDate: '2025-01-18', expectedTime: '14:00' },
  { prompt: 'Dinner on Feb 14th at 7PM', expectedDate: '2025-02-14', expectedTime: '19:00' },
  { prompt: 'Workout on the 15th at 6AM', expectedDate: '2025-02-15', expectedTime: '06:00' },
  { prompt: 'Call next Monday at 10AM', expectedDate: '2025-01-20', expectedTime: '10:00' },
  // Add more prompts as needed
];

describe('Chat Prompts', () => {
  prompts.forEach(({ prompt, expectedDate, expectedTime }) => {
    test(`Prompt: "${prompt}"`, async () => {
      const result = await handleChatMessage(prompt);
      expect(result.date).toBe(expectedDate);
      expect(result.time).toBe(expectedTime);
    });
  });
});