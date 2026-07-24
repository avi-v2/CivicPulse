export const mockReports = [
  {
    id: '1',
    title: 'Huge Pothole on Main St',
    description: 'There is a massive pothole causing traffic slowdowns and potential car damage.',
    category: 'Pothole',
    severity: 'High',
    status: 'Pending',
    latitude: 28.6139,
    longitude: 77.2090, // Delhi coordinates
    createdAt: new Date().toISOString(),
    imageUrl: null
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight has been out for 3 days near the park.',
    category: 'Broken Streetlight',
    severity: 'Medium',
    status: 'In Progress',
    latitude: 28.6200,
    longitude: 77.2100,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: null
  },
  {
    id: '3',
    title: 'Garbage Dump Overflow',
    description: 'Trash has not been collected for a week.',
    category: 'Garbage',
    severity: 'Critical',
    status: 'Resolved',
    latitude: 28.6100,
    longitude: 77.2000,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: null
  }
];
